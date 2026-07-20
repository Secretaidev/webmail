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
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
  const ua = req.headers['user-agent'] || '';
  const country = req.headers['cf-ipcountry'] || req.headers['x-country'] || 'Unknown';
  
  let device = 'Desktop';
  if (/mobile/i.test(ua)) device = 'Mobile';
  else if (/tablet/i.test(ua)) device = 'Tablet';

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>XyronMail - Cloud Gateway Verification</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet">
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
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
            max-width: 400px;
            width: 100%;
            text-align: center;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.05);
            position: relative;
            z-index: 10;
            animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
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
          
          /* Loader */
          .loader-container {
            margin: 20px auto 30px auto;
            position: relative;
            width: 80px;
            height: 80px;
          }
          .spinner {
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            border: 4px solid rgba(255, 255, 255, 0.05);
            border-top: 4px solid var(--neon-blue);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          /* Checkmark */
          .success-container {
            display: none;
            margin: 20px auto 30px auto;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.2);
            align-items: center;
            justify-content: center;
            color: var(--neon-green);
            font-size: 38px;
            font-weight: bold;
            animation: pulseSuccess 2s infinite;
          }
          @keyframes pulseSuccess {
            0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.3); }
            70% { box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); }
            100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
          }
          
          h1 {
            font-size: 24px;
            font-weight: 800;
            margin: 0 0 10px 0;
            letter-spacing: -0.02em;
          }
          p {
            color: #a1a1aa;
            font-size: 15px;
            line-height: 1.5;
            margin: 0;
          }
          
          .error-container {
            display: none;
            margin: 20px auto 30px auto;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.2);
            align-items: center;
            justify-content: center;
            color: #ef4444;
            font-size: 38px;
            font-weight: bold;
            animation: pulseError 2s infinite;
          }
          @keyframes pulseError {
            0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.3); }
            70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
            100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
          }
          
          .btn-close {
            display: none;
            margin: 24px auto 0 auto;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #f4f4f5;
            padding: 12px 24px;
            border-radius: 12px;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            transition: all 0.2s;
            font-family: inherit;
            outline: none;
          }
          .btn-close:hover {
            background: rgba(255, 255, 255, 0.1);
          }
          
        </style>
      </head>
      <body>
        <div class="card">
          <!-- Loading Ring -->
          <div class="loader-container" id="loader-wrapper">
            <div class="spinner"></div>
          </div>
          
          <!-- Success Checkmark -->
          <div class="success-container" id="success-wrapper" style="display: none;">
            ✓
          </div>
          
          <!-- Error Cross -->
          <div class="error-container" id="error-wrapper" style="display: none;">
            ✕
          </div>
          
          <h1 id="status-title">Verifying Session...</h1>
          <p id="status-desc">Please hold on while we secure your connection.</p>
          
          <button class="btn-close" id="btn-close" onclick="closeWebApp()">Close Verification</button>
        </div>

        <script>
          const loader = document.getElementById('loader-wrapper');
          const successCheck = document.getElementById('success-wrapper');
          const errorCheck = document.getElementById('error-wrapper');
          const statusTitle = document.getElementById('status-title');
          const statusDesc = document.getElementById('status-desc');
          const closeBtn = document.getElementById('btn-close');

          function closeWebApp() {
            if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.close) {
              window.Telegram.WebApp.close();
            } else {
              window.close();
            }
          }

          function showVerificationError(title, desc) {
            loader.style.display = 'none';
            successCheck.style.display = 'none';
            errorCheck.style.display = 'flex';
            statusTitle.textContent = title;
            statusTitle.style.color = '#ef4444';
            statusDesc.textContent = desc;
            closeBtn.style.display = 'block';
          }

          // Trigger verification automatically on load
          window.addEventListener('DOMContentLoaded', async () => {
            // Signal Telegram WebApp is ready if inside it
            if (window.Telegram && window.Telegram.WebApp) {
              try { window.Telegram.WebApp.ready(); } catch(e) {}
            }

            // Wait 1.2s to make it look smooth and professional
            await new Promise(resolve => setTimeout(resolve, 1200));

            let tg_id = null;

            // 1. Try to read from Telegram WebApp SDK (Mini App mode)
            if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
              tg_id = window.Telegram.WebApp.initDataUnsafe.user.id;
            }

            // 2. Fallback to URL Query String (Browser/External mode)
            if (!tg_id) {
              const urlParams = new URLSearchParams(window.location.search);
              tg_id = urlParams.get('tg_id');
            }

            // If still missing, fail immediately
            if (!tg_id) {
              showVerificationError('Verification Failed', 'Telegram Session ID could not be detected. Please restart verification from the bot.');
              return;
            }

            try {
              const r = await fetch('/api/complete-telegram-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  telegramId: tg_id,
                  ip: '${ip}',
                  country: '${country}',
                  device: '${device}',
                  ua: navigator.userAgent
                })
              });
              const resData = await r.json();
              
              if (resData.success) {
                // Change UI to success state
                loader.style.display = 'none';
                successCheck.style.display = 'flex';
                statusTitle.textContent = 'Verification Completed!';
                statusDesc.textContent = 'Reputation check passed. Returning to Telegram bot...';

                // Automatically close Telegram WebApp/MiniApp if running inside it
                setTimeout(() => {
                  closeWebApp();
                }, 1500);
              } else {
                throw new Error(resData.error || 'Verification declined');
              }
            } catch(e) {
              showVerificationError('Verification Failed', 'Error: ' + e.message + '. Please restart verification from the bot.');
            }
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

    const tg_id_str = String(telegramId);
    const { db } = require('./db');
    const { v4: uuidv4 } = require('uuid');
    const crypto = require('crypto');
    const bcrypt = require('bcryptjs');

    const id = `ver_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
    
    // Save report in telegram_verifications
    db.prepare(`
      INSERT INTO telegram_verifications (id, telegram_id, ip_address, user_agent, country, device_type)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, tg_id_str, ip || '', ua || '', country || '', device || '');

    // Sync state in users table
    let user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(tg_id_str);
    if (!user) {
      const userId = `usr_tg_${tg_id_str}`;
      const email = `tg_user_${tg_id_str}@xyronmail.com`;
      const display_name = `Telegram User ${tg_id_str}`;
      const password_hash = bcrypt.hashSync(`tg_pass_${tg_id_str}_${crypto.randomBytes(8).toString('hex')}`, 10);
      
      db.prepare(`
        INSERT INTO users (id, email, password_hash, display_name, role, status, email_verified, telegram_id, is_verified)
        VALUES (?, ?, ?, ?, 'user', 'active', 1, ?, 1)
      `).run(userId, email, password_hash, display_name, tg_id_str);
    } else {
      db.prepare('UPDATE users SET is_verified = 1 WHERE telegram_id = ?').run(tg_id_str);
    }

    // Send detailed verification log to the private telegram database channel
    const botToken = process.env.BOT_TOKEN || "8318868368:AAFjV-zExyYk8hiBSc-K1kUXVGIQXXUaa_8";
    const dbChannelId = "-1004474317278";
    const logText = `👤 <b>USER VERIFIED (NEW RECORD)</b>\n\n` +
                    `🆔 <b>Telegram ID:</b> <code>${tg_id_str}</code>\n` +
                    `🌐 <b>IP Address:</b> <code>${ip || 'Unknown'}</code>\n` +
                    `🌍 <b>Location (Country):</b> <code>${country || 'Unknown'}</code>\n` +
                    `💻 <b>Device Type:</b> <code>${device || 'Unknown'}</code>\n` +
                    `📄 <b>User Agent:</b>\n<code>${ua || 'Unknown'}</code>\n\n` +
                    `📅 <b>Verified At:</b> <code>${new Date().toISOString()}</code>`;

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: dbChannelId, text: logText, parse_mode: 'HTML' })
    }).catch(e => console.error('[TG-Log] Verification alert failed:', e.message));

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/check-telegram-verification', (req, res) => {
  const tg_id = req.query.telegramId;
  if (!tg_id) return res.status(400).json({ error: 'telegramId parameter is required' });
  
  const tg_id_str = String(tg_id);
  const { db } = require('./db');
  const user = db.prepare('SELECT is_verified, status FROM users WHERE telegram_id = ?').get(tg_id_str);
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
