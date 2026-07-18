/**
 * XyronMail - Auth Routes
 * Registration, login, password management, session management
 */
const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { v4: uuidv4 } = require('uuid');
const {
  authenticate,
  requireAdmin,
  generateToken,
  hashPassword,
  comparePassword,
  rateLimit
} = require('../middleware/auth');

// Rate limit auth endpoints
router.use(rateLimit(300000, 150)); // 150 requests per 5 minutes

/**
 * POST /api/auth/register - Register a new user
 */
router.post('/register', (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Check if registration is enabled
    const regSetting = db.prepare('SELECT value FROM settings WHERE key = ?').get('registration_enabled');
    if (regSetting && regSetting.value === 'false') {
      return res.status(403).json({ error: 'Registration is currently disabled' });
    }

    // Check existing
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const userId = `user_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
    const passwordHash = hashPassword(password);

    db.prepare(`
      INSERT INTO users (id, email, password_hash, display_name, role, status)
      VALUES (?, ?, ?, ?, 'user', 'active')
    `).run(userId, email.toLowerCase(), passwordHash, displayName || email.split('@')[0]);

    const token = generateToken(userId, 'user');

    res.cookie('xyronmail_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      success: true,
      data: {
        id: userId,
        email: email.toLowerCase(),
        displayName: displayName || email.split('@')[0],
        role: 'user',
        token
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', message: err.message });
  }
});

/**
 * POST /api/auth/login - Login
 */
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.status === 'banned' || user.status === 'suspended') {
      return res.status(403).json({ error: `Account is ${user.status}` });
    }

    if (!comparePassword(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update login stats
    db.prepare("UPDATE users SET last_login_at = datetime('now'), login_count = login_count + 1 WHERE id = ?")
      .run(user.id);

    const token = generateToken(user.id, user.role);

    // Create session record
    const sessionId = `sess_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
    db.prepare(`
      INSERT INTO sessions (id, user_id, token, ip_address, user_agent, expires_at)
      VALUES (?, ?, ?, ?, ?, datetime('now', '+24 hours'))
    `).run(sessionId, user.id, token, req.ip, req.get('user-agent'));

    res.cookie('xyronmail_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        role: user.role,
        token
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', message: err.message });
  }
});

/**
 * POST /api/auth/logout - Logout
 */
router.post('/logout', (req, res) => {
  res.clearCookie('xyronmail_token');
  res.json({ success: true, message: 'Logged out' });
});

/**
 * GET /api/auth/me - Get current user
 */
router.get('/me', authenticate, (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.user.id,
      email: req.user.email,
      displayName: req.user.display_name,
      role: req.user.role,
      status: req.user.status,
      lastLogin: req.user.last_login_at,
      createdAt: req.user.created_at
    }
  });
});

/**
 * PUT /api/auth/profile - Update profile
 */
router.put('/profile', authenticate, (req, res) => {
  try {
    const { displayName, currentPassword, newPassword } = req.body;

    if (displayName) {
      db.prepare("UPDATE users SET display_name = ?, updated_at = datetime('now') WHERE id = ?")
        .run(displayName, req.userId);
    }

    if (currentPassword && newPassword) {
      if (!comparePassword(currentPassword, req.user.password_hash)) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
      if (newPassword.length < 8) {
        return res.status(400).json({ error: 'New password must be at least 8 characters' });
      }
      const newHash = hashPassword(newPassword);
      db.prepare("UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE id = ?")
        .run(newHash, req.userId);
    }

    const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);
    res.json({
      success: true,
      data: {
        id: updated.id,
        email: updated.email,
        displayName: updated.display_name,
        role: updated.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Update failed', message: err.message });
  }
});

module.exports = router;
