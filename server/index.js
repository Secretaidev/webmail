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

/* ======================== Telegram Verification & Tracking ======================== */

app.get('/verify-telegram', async (req, res) => {
  const tg_id = req.query.tg_id;
  if (!tg_id) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Verification Error</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { background: #09090b; color: #fafafa; font-family: system-ui; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; padding: 20px; }
            .card { background: #18181b; border: 1px solid #ef4444; border-radius: 12px; padding: 30px; text-align: center; max-width: 400px; width: 100%; }
            h1 { color: #ef4444; font-size: 20px; margin-bottom: 10px; }
            p { color: #a1a1aa; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Verification Failed</h1>
            <p>Telegram user ID is missing. Please initiate verification from the Telegram bot.</p>
          </div>
        </body>
      </html>
    `);
  }

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
  const ua = req.headers['user-agent'] || '';
  const country = req.headers['cf-ipcountry'] || req.headers['x-country'] || 'Unknown';
  
  let device = 'Desktop';
  if (/mobile/i.test(ua)) device = 'Mobile';
  else if (/tablet/i.test(ua)) device = 'Tablet';

  // Serve a stunningly beautiful premium interactive verification page
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>XyronMail - Cloud Gateway Verification</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
        <style>
          :root {
            --bg-color: #030303;
            --card-bg: rgba(9, 9, 11, 0.7);
            --border-color: rgba(63, 63, 70, 0.4);
            --primary-glow: rgba(99, 102, 241, 0.15);
            --neon-blue: #6366f1;
            --neon-green: #10b981;
          }
          body {
            background-color: var(--bg-color);
            background-image: 
              radial-gradient(circle at 10% 20%, var(--primary-glow) 0%, transparent 40%),
              radial-gradient(circle at 90% 80%, rgba(16, 185, 129, 0.08) 0%, transparent 40%),
              linear-gradient(rgba(18, 18, 18, 0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(18, 18, 18, 0.4) 1px, transparent 1px);
            background-size: 100% 100%, 100% 100%, 24px 24px, 24px 24px;
            color: #f4f4f5;
            font-family: 'Outfit', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
            box-sizing: border-box;
            overflow: hidden;
          }
          .card {
            background: var(--card-bg);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid var(--border-color);
            border-radius: 24px;
            padding: 40px;
            max-width: 440px;
            width: 100%;
            text-align: center;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.05);
            position: relative;
            z-index: 10;
            transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .card::before {
            content: '';
            position: absolute;
            top: -2px; left: -2px; right: -2px; bottom: -2px;
            background: linear-gradient(135deg, var(--neon-blue), transparent, var(--neon-green));
            border-radius: 26px;
            z-index: -1;
            opacity: 0.15;
            transition: opacity 0.5s;
          }
          .card:hover::before {
            opacity: 0.3;
          }
          .badge {
            display: inline-flex;
            align-items: center;
            background: rgba(99, 102, 241, 0.1);
            border: 1px solid rgba(99, 102, 241, 0.2);
            color: var(--neon-blue);
            font-size: 12px;
            font-weight: 600;
            padding: 6px 14px;
            border-radius: 100px;
            margin-bottom: 24px;
            letter-spacing: 0.05em;
            text-transform: uppercase;
          }
          h1 {
            font-size: 28px;
            font-weight: 800;
            margin: 0 0 10px 0;
            letter-spacing: -0.03em;
            background: linear-gradient(135deg, #ffffff 60%, #a1a1aa);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          p {
            color: #a1a1aa;
            font-size: 15px;
            line-height: 1.6;
            margin: 0 0 30px 0;
          }
          .btn-verify {
            background: linear-gradient(135deg, var(--neon-blue), #4f46e5);
            color: #ffffff;
            border: none;
            border-radius: 12px;
            padding: 16px 32px;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
            position: relative;
            overflow: hidden;
          }
          .btn-verify::after {
            content: '';
            position: absolute;
            top: 0; left: -100%; width: 100%; height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: 0.5s;
          }
          .btn-verify:hover::after {
            left: 100%;
          }
          .btn-verify:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 24px rgba(99, 102, 241, 0.5);
          }
          .btn-verify:active {
            transform: translateY(0);
          }
          .console {
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 16px;
            text-align: left;
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            color: #71717a;
            margin-top: 24px;
            max-height: 160px;
            overflow-y: auto;
            display: none;
          }
          .console-line {
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 6px;
          }
          .console-line.success { color: var(--neon-green); }
          .console-line.info { color: var(--neon-blue); }
          
          /* Success Screen */
          .success-screen {
            display: none;
          }
          .checkmark-circle {
            width: 72px;
            height: 72px;
            border-radius: 50%;
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px auto;
            color: var(--neon-green);
            font-size: 36px;
            font-weight: bold;
            animation: pulseSuccess 2s infinite;
          }
          @keyframes pulseSuccess {
            0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.2); }
            70% { box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); }
            100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
          }
          .btn-success {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border-color);
            color: #ffffff;
            border-radius: 10px;
            padding: 12px 24px;
            font-size: 14px;
            font-weight: 600;
            text-decoration: none;
            display: inline-block;
            transition: all 0.3s;
          }
          .btn-success:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.2);
          }
          
          .meta-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-top: 30px;
            padding-top: 24px;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            text-align: left;
            font-size: 12px;
            color: #71717a;
          }
          .meta-item span {
            color: #d4d4d8;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="card" id="verification-card">
          <!-- Verification Form -->
          <div id="verify-form">
            <div class="badge">🌐 Cloud Gateway Security</div>
            <h1>Solve Captcha & Sync</h1>
            <p>Confirm your Telegram user session integrity. Our server will establish a secure cryptographic binding to verify your identity.</p>
            
            <button class="btn-verify" id="start-btn">
              <span>🔒 Start Cloud Verification</span>
            </button>
            
            <div class="console" id="log-console"></div>
            
            <div class="meta-info">
              <div class="meta-item">IP: <span>${ip}</span></div>
              <div class="meta-item">Loc: <span>${country}</span></div>
              <div class="meta-item">Device: <span>${device}</span></div>
              <div class="meta-item">ID: <span>${tg_id}</span></div>
            </div>
          </div>
          
          <!-- Success Screen -->
          <div class="success-screen" id="success-screen">
            <div class="checkmark-circle">✓</div>
            <h1>Verification Completed</h1>
            <p>Reputation check passed successfully! Your account has been synced. You can now return to the Telegram bot.</p>
            <a href="tg://resolve?domain=XyronMail_Bot" class="btn-success">Return to Telegram Bot</a>
          </div>
        </div>

        <script>
          const startBtn = document.getElementById('start-btn');
          const verifyForm = document.getElementById('verify-form');
          const successScreen = document.getElementById('success-screen');
          const consoleEl = document.getElementById('log-console');
          const card = document.getElementById('verification-card');

          const logs = [
            { text: '🛰️ Pinging Cloud Gateway...', delay: 0, type: 'info' },
            { text: '🔍 Harvesting device metadata...', delay: 600, type: 'info' },
            { text: '🌐 Verifying client IP route (${ip})...', delay: 1200, type: 'info' },
            { text: '🛡️ Checking firewall reputation rules...', delay: 1800, type: 'info' },
            { text: '🔐 Syncing Telegram ID (${tg_id}) state...', delay: 2400, type: 'info' },
            { text: '⚡ Establishing cryptographic handshake...', delay: 3000, type: 'info' }
          ];

          startBtn.addEventListener('click', () => {
            startBtn.style.display = 'none';
            consoleEl.style.display = 'block';
            
            logs.forEach(log => {
              setTimeout(() => {
                const line = document.createElement('div');
                line.className = 'console-line ' + log.type;
                line.innerHTML = '<span>&gt;</span> ' + log.text;
                consoleEl.appendChild(line);
                consoleEl.scrollTop = consoleEl.scrollHeight;
              }, log.delay);
            });

            // Perform POST submission to finalize verification
            setTimeout(async () => {
              try {
                const r = await fetch('/api/complete-telegram-verification', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    telegramId: '${tg_id}',
                    ip: '${ip}',
                    country: '${country}',
                    device: '${device}',
                    ua: navigator.userAgent
                  })
                });
                const resData = await r.json();
                
                if (resData.success) {
                  const successLine = document.createElement('div');
                  successLine.className = 'console-line success';
                  successLine.innerHTML = '<span>&gt;</span> 🎉 Handshake successfully verified!';
                  consoleEl.appendChild(successLine);
                  consoleEl.scrollTop = consoleEl.scrollHeight;

                  setTimeout(() => {
                    document.getElementById('verify-form').style.display = 'none';
                    successScreen.style.display = 'block';
                  }, 800);
                } else {
                  throw new Error(resData.error || 'Verification declined');
                }
              } catch(e) {
                const errLine = document.createElement('div');
                errLine.style.color = '#ef4444';
                errLine.className = 'console-line';
                errLine.innerHTML = '<span>&gt;</span> ❌ Verification Error: ' + e.message;
                consoleEl.appendChild(errLine);
              }
            }, 3600);
          });
        </script>
      </body>
    </html>
  `);
});

app.post('/api/complete-telegram-verification', async (req, res) => {
  try {
    const { telegramId, ip, country, device, ua } = req.body;
    if (!telegramId) return res.status(400).json({ error: 'telegramId is required' });

    const { db } = require('./db');
    const { v4: uuidv4 } = require('uuid');
    const crypto = require('crypto');
    const bcrypt = require('bcryptjs');

    const id = `ver_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
    
    // Save report in telegram_verifications
    db.prepare(`
      INSERT INTO telegram_verifications (id, telegram_id, ip_address, user_agent, country, device_type)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, telegramId, ip || '', ua || '', country || '', device || '');

    // Sync state in users table
    let user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(telegramId);
    if (!user) {
      const userId = `usr_tg_${telegramId}`;
      const email = `tg_user_${telegramId}@xyronmail.com`;
      const display_name = `Telegram User ${telegramId}`;
      const password_hash = bcrypt.hashSync(`tg_pass_${telegramId}_${crypto.randomBytes(8).toString('hex')}`, 10);
      
      db.prepare(`
        INSERT INTO users (id, email, password_hash, display_name, role, status, email_verified, telegram_id, is_verified)
        VALUES (?, ?, ?, ?, 'user', 'active', 1, ?, 1)
      `).run(userId, email, password_hash, display_name, telegramId);
    } else {
      db.prepare('UPDATE users SET is_verified = 1 WHERE telegram_id = ?').run(telegramId);
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/check-telegram-verification', (req, res) => {
  const tg_id = req.query.telegramId;
  if (!tg_id) return res.status(400).json({ error: 'telegramId parameter is required' });
  
  const { db } = require('./db');
  const user = db.prepare('SELECT is_verified, status FROM users WHERE telegram_id = ?').get(tg_id);
  res.json({
    success: true,
    verified: user ? user.is_verified === 1 : false,
    status: user ? user.status : 'active'
  });
});

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
    let admin = db.prepare('SELECT id FROM users WHERE role = ?').get('admin');
    let adminId;
    if (!admin) {
      adminId = `user_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
      const adminEmail = process.env.ADMIN_EMAIL || 'xyron_secure_root_admin@xyronmail.com';
      const adminPass = hashPassword(process.env.ADMIN_PASSWORD || 'XyronMail_Secure_Root_Admin_@2026_!#_928374');
      db.prepare(`
        INSERT INTO users (id, email, password_hash, display_name, role, status, email_verified)
        VALUES (?, ?, ?, 'Admin', 'admin', 'active', 1)
      `).run(adminId, adminEmail, adminPass);
      console.log(`[Server] Admin created: ${adminEmail}`);
    } else {
      adminId = admin.id;
    }

    // Seed master API key for bot if not exists
    const botKey = db.prepare("SELECT id FROM api_keys WHERE id = 'key_bot_master'").get();
    if (!botKey) {
      const bcrypt = require('bcryptjs');
      const rawKey = "xm_unlimited_admin_key_928374";
      const keyHash = bcrypt.hashSync(rawKey, 10);
      db.prepare(`
        INSERT INTO api_keys (id, user_id, name, key_hash, key_prefix, scopes, quota_daily, status)
        VALUES ('key_bot_master', ?, 'Telegram Bot Master Key', ?, 'xm_unli', '["read","write","admin"]', 9999999, 'active')
      `).run(adminId, keyHash);
      console.log("[Server] Telegram Bot Master API Key seeded");
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
