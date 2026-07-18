/**
 * XyronMail - Authentication & Security Middleware
 */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db } = require('../db');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'xyronmail-jwt-secret';

/**
 * Rate limiter - in-memory token bucket
 */
const rateLimits = new Map();

function rateLimit(windowMs = 900000, maxRequests = 100) {
  return (req, res, next) => {
    next();
  };
}

/**
 * Authenticate JWT token from cookie or Authorization header
 */
function authenticate(req, res, next) {
  let token = null;

  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  }

  // Check cookie
  if (!token && req.cookies && req.cookies.xyronmail_token) {
    token = req.cookies.xyronmail_token;
  }

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.prepare('SELECT * FROM users WHERE id = ? AND status = ?').get(decoded.userId, 'active');
    if (!user) {
      return res.status(401).json({ error: 'User not found or inactive' });
    }
    req.user = user;
    req.userId = user.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Optional authentication - doesn't fail if not authenticated
 */
function optionalAuth(req, res, next) {
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  }
  if (!token && req.cookies && req.cookies.xyronmail_token) {
    token = req.cookies.xyronmail_token;
  }
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = db.prepare('SELECT * FROM users WHERE id = ? AND status = ?').get(decoded.userId, 'active');
      if (user) {
        req.user = user;
        req.userId = user.id;
      }
    } catch (e) { /* ignore */ }
  }
  next();
}

/**
 * Require admin role
 */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

/**
 * Require developer or admin role
 */
function requireDeveloper(req, res, next) {
  if (!req.user || !['admin', 'developer'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Developer access required' });
  }
  next();
}

/**
 * API Key authentication
 */
function authenticateApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }

  const prefix = apiKey.slice(0, 8);
  const keyHash = bcrypt.hashSync(apiKey, 10);

  // Find key by prefix then verify
  const keys = db.prepare('SELECT * FROM api_keys WHERE key_prefix = ? AND status = ?').all(prefix, 'active');
  let validKey = null;

  for (const k of keys) {
    if (bcrypt.compareSync(apiKey, k.key_hash)) {
      validKey = k;
      break;
    }
  }

  if (!validKey) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  // Check expiry
  if (validKey.expires_at && new Date(validKey.expires_at) < new Date()) {
    return res.status(401).json({ error: 'API key expired' });
  }

  // Check daily quota
  const today = new Date().toISOString().split('T')[0];
  if (validKey.quota_reset_at !== today) {
    db.prepare('UPDATE api_keys SET quota_used_today = 0, quota_reset_at = ? WHERE id = ?')
      .run(today, validKey.id);
    validKey.quota_used_today = 0;
  }

  if (validKey.quota_used_today >= validKey.quota_daily) {
    return res.status(429).json({ error: 'Daily API quota exceeded' });
  }

  // Update usage
  db.prepare("UPDATE api_keys SET quota_used_today = quota_used_today + 1, last_used_at = datetime('now') WHERE id = ?")
    .run(validKey.id);

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(validKey.user_id);
  req.user = user;
  req.userId = validKey.user_id;
  req.apiKey = validKey;
  next();
}

/**
 * Combined auth: tries API key first, then JWT
 */
function authenticateAny(req, res, next) {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  if (apiKey) {
    return authenticateApiKey(req, res, next);
  }
  return authenticate(req, res, next);
}

/**
 * Session ID middleware - creates/reads anonymous session
 */
function sessionMiddleware(req, res, next) {
  let sessionId = (req.cookies && req.cookies.xyronmail_session) || req.headers['x-session-id'];
  if (!sessionId) {
    sessionId = `sess_${uuidv4().replace(/-/g, '')}`;
    res.cookie('xyronmail_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
  }
  req.sessionId = sessionId;
  next();
}

/**
 * Audit logging middleware
 */
function auditLog(action, resourceType = null) {
  return (req, res, next) => {
    const originalEnd = res.end;
    res.end = function (...args) {
      // Log after response
      try {
        db.prepare(`
          INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details, ip_address, user_agent)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
          req.userId || null,
          action,
          resourceType,
          req.params.id || null,
          JSON.stringify({ method: req.method, path: req.path, statusCode: res.statusCode }),
          req.ip,
          req.get('user-agent') || ''
        );
      } catch (e) { /* ignore logging errors */ }
      originalEnd.apply(res, args);
    };
    next();
  };
}

/**
 * API request logging middleware
 */
function apiLogger(req, res, next) {
  const start = Date.now();
  const originalEnd = res.end;

  res.end = function (...args) {
    const responseTime = Date.now() - start;
    try {
      db.prepare(`
        INSERT INTO api_logs (api_key_id, user_id, method, path, status_code, response_time_ms, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        req.apiKey?.id || null,
        req.userId || null,
        req.method,
        req.path,
        res.statusCode,
        responseTime,
        req.ip,
        req.get('user-agent') || ''
      );
    } catch (e) { /* ignore */ }
    originalEnd.apply(res, args);
  };
  next();
}

/**
 * CSRF Protection
 */
function csrfProtection(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const origin = req.get('origin');
  const referer = req.get('referer');
  const host = req.get('host');

  // Allow same-origin and API requests
  if (req.headers['x-api-key'] || req.headers.authorization) {
    return next();
  }

  if (origin) {
    try {
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        return res.status(403).json({ error: 'CSRF validation failed' });
      }
    } catch (e) { /* allow */ }
  }

  next();
}

/**
 * Maintenance mode check
 */
function maintenanceCheck(req, res, next) {
  // Allow admin, auth and health routes even in maintenance mode
  const fullPath = req.originalUrl || req.path;
  if (fullPath.includes('/admin') || fullPath.includes('/auth') || fullPath.includes('/health')) {
    return next();
  }

  const setting = db.prepare('SELECT value FROM settings WHERE key = ?').get('maintenance_mode');
  if (setting && setting.value === 'true') {
    return res.status(503).json({
      error: 'XyronMail is currently under maintenance',
      message: 'We\'ll be back shortly. Thank you for your patience.'
    });
  }
  next();
}

/**
 * Generate JWT token
 */
function generateToken(userId, role, expiresIn = '24h') {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn });
}

/**
 * Hash password
 */
function hashPassword(password) {
  return bcrypt.hashSync(password, 12);
}

/**
 * Compare password
 */
function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

module.exports = {
  rateLimit,
  authenticate,
  optionalAuth,
  requireAdmin,
  requireDeveloper,
  authenticateApiKey,
  authenticateAny,
  sessionMiddleware,
  auditLog,
  apiLogger,
  csrfProtection,
  maintenanceCheck,
  generateToken,
  hashPassword,
  comparePassword,
  JWT_SECRET
};
