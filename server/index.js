/**
 * XyronMail - Main Server Entry Point
 * Enterprise-grade Temporary Email SaaS Platform
 */
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const path = require('path');

const { initializeDatabase, db } = require('./db');
const providerManager = require('./providers/manager');
const { rateLimit, sessionMiddleware, maintenanceCheck, csrfProtection, apiLogger, hashPassword } = require('./middleware/auth');
const { v4: uuidv4 } = require('uuid');

// Import routes
const authRoutes = require('./routes/auth');
const inboxRoutes = require('./routes/inbox');
const adminRoutes = require('./routes/admin');
const developerRoutes = require('./routes/developer');

const app = express();
const PORT = process.env.PORT || 3000;

/* ======================== Middleware ======================== */

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Global rate limiter
app.use('/api/', rateLimit(900000, 1000)); // 1000 requests per 15 minutes

// Maintenance mode check
app.use('/api/', maintenanceCheck);

// API request logging for /api routes
app.use('/api/', apiLogger);

/* ======================== Static Files ======================== */

// Static files with aggressive caching
app.use(express.static(path.join(__dirname, '..', 'public'), {
  maxAge: '7d',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    } else if (filePath.endsWith('.css') || filePath.endsWith('.js')) {
      res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
    }
  }
}));

/* ======================== API Routes ======================== */

app.use('/api/auth', authRoutes);
app.use('/api', inboxRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/developer', developerRoutes);

// Public announcements
app.get('/api/announcements', (req, res) => {
  const now = new Date().toISOString();
  const announcements = db.prepare(`
    SELECT id, title, content, type, starts_at, ends_at
    FROM announcements
    WHERE is_active = 1 AND starts_at <= ? AND (ends_at IS NULL OR ends_at > ?)
    ORDER BY created_at DESC LIMIT 5
  `).all(now, now);
  res.json({ success: true, data: announcements });
});

// Provider health (public)
app.get('/api/health', (req, res) => {
  const providers = providerManager.getProviderStats();
  const domainCount = db.prepare("SELECT COUNT(*) as c FROM domains WHERE status = 'active'").get().c;
  const activeProviders = providers.filter(p => p.status === 'active').length;
  res.json({
    success: true,
    status: 'operational',
    version: process.env.APP_VERSION || '2.0.0',
    providerCount: providers.length,
    activeProviders,
    domainCount,
    providers
  });
});

// Public provider list
app.get('/api/providers', (req, res) => {
  const providers = providerManager.getProviderStats();
  res.json({ success: true, data: providers });
});

// OpenAPI spec endpoint
app.get('/api/openapi.json', (req, res) => {
  res.json({
    openapi: '3.0.3',
    info: {
      title: 'XyronMail API',
      version: '1.0.0',
      description: 'XyronMail Temporary Email Platform API. Create disposable email inboxes, receive messages in real-time, extract OTPs, and manage your temporary email workflow.',
      contact: { name: 'XyronMail', url: 'https://t.me/Xyron_Bots' }
    },
    servers: [{ url: '/api', description: 'XyronMail API' }],
    paths: {
      '/domains': { get: { summary: 'List available domains', tags: ['Inbox'], responses: { '200': { description: 'Domain list' } } } },
      '/inbox': {
        post: { summary: 'Create temporary inbox', tags: ['Inbox'], requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { domain: { type: 'string' } } } } } }, responses: { '201': { description: 'Inbox created' } } },
        get: { summary: 'List your inboxes', tags: ['Inbox'], responses: { '200': { description: 'Inbox list' } } }
      },
      '/inbox/{id}/messages': { get: { summary: 'Get inbox messages', tags: ['Messages'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Message list' } } } },
      '/inbox/{inboxId}/messages/{msgId}': { get: { summary: 'Get full message', tags: ['Messages'], parameters: [{ name: 'inboxId', in: 'path', required: true, schema: { type: 'string' } }, { name: 'msgId', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Full message' } } } },
      '/inbox/{id}/stream': { get: { summary: 'Real-time message stream (SSE)', tags: ['Real-time'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'SSE stream' } } } },
      '/auth/register': { post: { summary: 'Register account', tags: ['Auth'], requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' }, displayName: { type: 'string' } }, required: ['email', 'password'] } } } }, responses: { '201': { description: 'Registered' } } } },
      '/auth/login': { post: { summary: 'Login', tags: ['Auth'], responses: { '200': { description: 'Logged in' } } } },
      '/developer/api-keys': {
        get: { summary: 'List API keys', tags: ['Developer'], security: [{ bearerAuth: [] }], responses: { '200': { description: 'Key list' } } },
        post: { summary: 'Create API key', tags: ['Developer'], security: [{ bearerAuth: [] }], responses: { '201': { description: 'Key created' } } }
      },
      '/health': { get: { summary: 'System health', tags: ['System'], responses: { '200': { description: 'Health status' } } } }
    },
    components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer' }, apiKey: { type: 'apiKey', in: 'header', name: 'X-API-Key' } } }
  });
});

/* ======================== SPA Fallback ======================== */

app.get('{*path}', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

/* ======================== Error Handler ======================== */

app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

/* ======================== Server Start ======================== */

async function startServer() {
  try {
    // Initialize database
    initializeDatabase();

    // Create default admin if not exists
    const admin = db.prepare('SELECT id FROM users WHERE role = ?').get('admin');
    if (!admin) {
      const adminId = `user_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
      const adminEmail = process.env.ADMIN_EMAIL || 'xyron_secure_root_admin@xyronmail.com';
      const adminPass = hashPassword(process.env.ADMIN_PASSWORD || 'XyronMail_Secure_Root_Admin_@2026_!#_928374');
      db.prepare(`
        INSERT INTO users (id, email, password_hash, display_name, role, status, email_verified)
        VALUES (?, ?, ?, 'Admin', 'admin', 'active', 1)
      `).run(adminId, adminEmail, adminPass);
      console.log(`[Server] Admin created: ${adminEmail}`);
    }

    // Initialize providers
    await providerManager.initialize();
    providerManager.startBackgroundJobs();

    // Start server
    app.listen(PORT, () => {
      console.log(`
╔══════════════════════════════════════════════╗
║                                              ║
║           ✉  XyronMail Server  ✉             ║
║                                              ║
║   Status:  Running                           ║
║   Port:    ${PORT}                              ║
║   Mode:    ${process.env.NODE_ENV || 'development'}                     ║
║   Admin:   ${process.env.ADMIN_EMAIL || 'xyron_secure_root_admin@xyronmail.com'}          ║
║                                              ║
║   🌐  http://localhost:${PORT}                  ║
║                                              ║
╚══════════════════════════════════════════════╝
      `);
    });

  } catch (err) {
    console.error('[Server] Failed to start:', err);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n[Server] Shutting down...');
  providerManager.stopBackgroundJobs();
  db.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  providerManager.stopBackgroundJobs();
  db.close();
  process.exit(0);
});

startServer();
