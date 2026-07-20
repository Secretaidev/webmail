/**
 * XyronMail - Database initialization and schema
 * Uses better-sqlite3 for synchronous, fast SQLite operations
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'data', 'xyronmail.db');

// Run the download sync script synchronously before instantiating the SQLite database
try {
  console.log('[Database] Triggering synchronous cloud sync download...');
  execSync(`node "${path.join(__dirname, 'sync-download.js')}"`, { stdio: 'inherit' });
} catch (e) {
  console.error('[Database] Sync download script failed. Continuing with local copy.', e.message);
}

const Database = require('better-sqlite3');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(DB_PATH);

// Use DELETE journal mode — WAL requires persistent filesystem (not available on Railway)
// DELETE mode is simpler, safer, and avoids WAL file corruption issues
db.pragma('journal_mode = DELETE');
db.pragma('foreign_keys = ON');
db.pragma('synchronous = FULL');
db.pragma('temp_store = MEMORY');
db.pragma('cache_size = -32000');
db.pragma('busy_timeout = 30000');

// Background interval to upload SQLite backup to cloud
const { uploadDatabaseToCloud } = require('./db-sync');
setInterval(() => {
  uploadDatabaseToCloud();
}, 60000); // Back up every 60 seconds (reduced frequency to lower write pressure)

// Hook into graceful shutdowns to upload one final time
function handleExitSync() {
  console.log('[Database] Saving final backup to Supabase Cloud before exit...');
  try {
    // We run it synchronously using child process to prevent process from terminating before async upload finishes
    execSync(`node "${path.join(__dirname, 'sync-upload-direct.js')}"`, { stdio: 'inherit' });
  } catch (e) {
    console.error('Final sync upload failed:', e.message);
  }
}

process.on('SIGINT', () => {
  handleExitSync();
  process.exit(0);
});

process.on('SIGTERM', () => {
  handleExitSync();
  process.exit(0);
});

/**
 * Initialize all database tables
 */
function initializeDatabase() {
  db.exec(`
    -- Users table (admin, developer, regular users)
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      display_name TEXT DEFAULT '',
      role TEXT DEFAULT 'user' CHECK(role IN ('admin','developer','user')),
      status TEXT DEFAULT 'active' CHECK(status IN ('active','suspended','pending','banned')),
      email_verified INTEGER DEFAULT 0,
      avatar_url TEXT DEFAULT '',
      telegram_id TEXT UNIQUE DEFAULT NULL,
      is_verified INTEGER DEFAULT 0,
      last_login_at TEXT,
      login_count INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- Sessions table
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      expires_at TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- API Keys for developers
    CREATE TABLE IF NOT EXISTS api_keys (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      key_hash TEXT UNIQUE NOT NULL,
      key_prefix TEXT NOT NULL,
      scopes TEXT DEFAULT '["read"]',
      rate_limit INTEGER DEFAULT 100,
      quota_daily INTEGER DEFAULT 1000,
      quota_used_today INTEGER DEFAULT 0,
      quota_reset_at TEXT,
      status TEXT DEFAULT 'active' CHECK(status IN ('active','revoked','expired')),
      telegram_id TEXT DEFAULT NULL,
      last_used_at TEXT,
      expires_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Email providers configuration
    CREATE TABLE IF NOT EXISTS providers (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      display_name TEXT NOT NULL,
      type TEXT NOT NULL,
      base_url TEXT NOT NULL,
      status TEXT DEFAULT 'active' CHECK(status IN ('active','inactive','degraded','error')),
      health_status TEXT DEFAULT 'unknown',
      health_checked_at TEXT,
      priority INTEGER DEFAULT 0,
      weight INTEGER DEFAULT 100,
      config TEXT DEFAULT '{}',
      domains_synced_at TEXT,
      request_count INTEGER DEFAULT 0,
      error_count INTEGER DEFAULT 0,
      avg_response_ms INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- Domains from providers
    CREATE TABLE IF NOT EXISTS domains (
      id TEXT PRIMARY KEY,
      provider_id TEXT NOT NULL,
      domain TEXT NOT NULL,
      status TEXT DEFAULT 'active' CHECK(status IN ('active','inactive','blocked')),
      is_premium INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE,
      UNIQUE(provider_id, domain)
    );

    -- Temporary email inboxes created by users
    CREATE TABLE IF NOT EXISTS inboxes (
      id TEXT PRIMARY KEY,
      user_session_id TEXT,
      user_id TEXT,
      provider_id TEXT NOT NULL,
      email_address TEXT UNIQUE NOT NULL,
      domain TEXT NOT NULL,
      password_hash TEXT,
      provider_token TEXT,
      provider_account_id TEXT,
      is_favorite INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active' CHECK(status IN ('active','expired','deleted')),
      expires_at TEXT,
      message_count INTEGER DEFAULT 0,
      last_checked_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (provider_id) REFERENCES providers(id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    -- Emails/Messages
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      inbox_id TEXT NOT NULL,
      provider_message_id TEXT,
      from_address TEXT NOT NULL,
      from_name TEXT DEFAULT '',
      to_address TEXT NOT NULL,
      subject TEXT DEFAULT '(no subject)',
      body_text TEXT DEFAULT '',
      body_html TEXT DEFAULT '',
      is_read INTEGER DEFAULT 0,
      is_starred INTEGER DEFAULT 0,
      has_attachments INTEGER DEFAULT 0,
      otp_code TEXT,
      verification_links TEXT DEFAULT '[]',
      headers TEXT DEFAULT '{}',
      size_bytes INTEGER DEFAULT 0,
      received_at TEXT DEFAULT (datetime('now')),
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (inbox_id) REFERENCES inboxes(id) ON DELETE CASCADE
    );

    -- Attachments
    CREATE TABLE IF NOT EXISTS attachments (
      id TEXT PRIMARY KEY,
      message_id TEXT NOT NULL,
      filename TEXT NOT NULL,
      content_type TEXT DEFAULT 'application/octet-stream',
      size_bytes INTEGER DEFAULT 0,
      content_url TEXT,
      content_base64 TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
    );

    -- API Request Logs
    CREATE TABLE IF NOT EXISTS api_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      api_key_id TEXT,
      user_id TEXT,
      method TEXT NOT NULL,
      path TEXT NOT NULL,
      status_code INTEGER,
      response_time_ms INTEGER,
      ip_address TEXT,
      user_agent TEXT,
      request_body TEXT,
      response_body TEXT,
      error TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Audit Logs
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      action TEXT NOT NULL,
      resource_type TEXT,
      resource_id TEXT,
      details TEXT DEFAULT '{}',
      ip_address TEXT,
      user_agent TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Announcements
    CREATE TABLE IF NOT EXISTS announcements (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      type TEXT DEFAULT 'info' CHECK(type IN ('info','warning','critical','maintenance')),
      is_active INTEGER DEFAULT 1,
      starts_at TEXT DEFAULT (datetime('now')),
      ends_at TEXT,
      created_by TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (created_by) REFERENCES users(id)
    );

    -- Feature Flags
    CREATE TABLE IF NOT EXISTS feature_flags (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      description TEXT DEFAULT '',
      is_enabled INTEGER DEFAULT 0,
      config TEXT DEFAULT '{}',
      updated_by TEXT,
      updated_at TEXT DEFAULT (datetime('now')),
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- System Settings
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      description TEXT DEFAULT '',
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- Webhooks
    CREATE TABLE IF NOT EXISTS webhooks (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      url TEXT NOT NULL,
      events TEXT DEFAULT '["message.received"]',
      secret TEXT NOT NULL,
      status TEXT DEFAULT 'active' CHECK(status IN ('active','inactive','failed')),
      failure_count INTEGER DEFAULT 0,
      last_triggered_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Indexes for performance
    CREATE INDEX IF NOT EXISTS idx_messages_inbox ON messages(inbox_id);
    CREATE INDEX IF NOT EXISTS idx_messages_received ON messages(received_at DESC);
    CREATE INDEX IF NOT EXISTS idx_inboxes_user ON inboxes(user_id);
    CREATE INDEX IF NOT EXISTS idx_inboxes_email ON inboxes(email_address);
    CREATE INDEX IF NOT EXISTS idx_inboxes_session ON inboxes(user_session_id);
    CREATE INDEX IF NOT EXISTS idx_domains_provider ON domains(provider_id);
    CREATE INDEX IF NOT EXISTS idx_domains_domain ON domains(domain);
    CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id);
    CREATE INDEX IF NOT EXISTS idx_api_logs_created ON api_logs(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_api_logs_key ON api_logs(api_key_id);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
    CREATE INDEX IF NOT EXISTS idx_attachments_message ON attachments(message_id);

    -- Pre-generated API keys pool
    CREATE TABLE IF NOT EXISTS pre_generated_keys (
      id TEXT PRIMARY KEY,
      plain_key TEXT UNIQUE NOT NULL,
      status TEXT DEFAULT 'unused' CHECK(status IN ('unused','assigned')),
      assigned_to_telegram_id TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_pre_generated_keys_status ON pre_generated_keys(status);
  `);

  try {
    db.exec("ALTER TABLE users ADD COLUMN telegram_id TEXT");
  } catch (e) {
    // Ignore if column already exists
  }
  try {
    db.exec("ALTER TABLE users ADD COLUMN is_verified INTEGER DEFAULT 0");
  } catch (e) {
    // Ignore if column already exists
  }
  try {
    db.exec("ALTER TABLE api_keys ADD COLUMN telegram_id TEXT");
  } catch (e) {
    // Ignore if column already exists
  }
  try {
    db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_telegram ON users(telegram_id)");
    db.exec("CREATE INDEX IF NOT EXISTS idx_api_keys_telegram ON api_keys(telegram_id)");
  } catch (e) {
    // Ignore
  }

  // Add monitor_ends_at column to inboxes for OTP monitoring timer feature
  try {
    db.exec("ALTER TABLE inboxes ADD COLUMN monitor_ends_at TEXT DEFAULT NULL");
  } catch (e) {
    // Ignore if column already exists
  }

  // Add monitor_chat_id column for sending bot messages
  try {
    db.exec("ALTER TABLE inboxes ADD COLUMN monitor_chat_id TEXT DEFAULT NULL");
  } catch (e) {
    // Ignore if column already exists
  }

  // Create telegram_verifications table for IP tracking
  db.exec(`
    CREATE TABLE IF NOT EXISTS telegram_verifications (
      id TEXT PRIMARY KEY,
      telegram_id TEXT NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      country TEXT,
      region TEXT,
      city TEXT,
      device_type TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_verifications_tg ON telegram_verifications(telegram_id);
  `);


  // Insert default settings
  const insertSetting = db.prepare(`
    INSERT OR IGNORE INTO settings (key, value, description)
    VALUES (?, ?, ?)
  `);

  const defaults = [
    ['maintenance_mode', 'false', 'Enable/disable maintenance mode'],
    ['registration_enabled', 'true', 'Enable/disable new user registration'],
    ['max_inboxes_per_session', '5', 'Maximum inboxes per anonymous session'],
    ['inbox_ttl_minutes', '60', 'Default inbox lifetime in minutes'],
    ['auto_refresh_interval', '10', 'Auto-refresh interval in seconds'],
    ['theme_default', 'dark', 'Default theme (dark/light)'],
    ['app_name', 'XyronMail', 'Application name'],
    ['app_version', '2.0.0', 'Application version'],
  ];

  const insertMany = db.transaction(() => {
    for (const [key, value, desc] of defaults) {
      insertSetting.run(key, value, desc);
    }
  });
  insertMany();

  // Insert default feature flags
  const insertFlag = db.prepare(`
    INSERT OR IGNORE INTO feature_flags (id, name, description, is_enabled)
    VALUES (?, ?, ?, ?)
  `);

  const flags = [
    ['ff_otp_extract', 'otp_extraction', 'Automatic OTP code extraction from emails', 1],
    ['ff_link_detect', 'link_detection', 'Automatic verification link detection', 1],
    ['ff_realtime', 'realtime_sync', 'Real-time inbox synchronization via SSE', 1],
    ['ff_api_playground', 'api_playground', 'Interactive API playground for developers', 1],
    ['ff_webhooks', 'webhooks', 'Webhook notifications for new messages', 1],
    ['ff_export', 'email_export', 'Export emails as EML/PDF', 1],
    ['ff_multilang', 'multilingual', 'Multi-language support', 1],
  ];

  const insertFlags = db.transaction(() => {
    for (const [id, name, desc, enabled] of flags) {
      insertFlag.run(id, name, desc, enabled);
    }
  });
  insertFlags();

  // Insert default providers
  const insertProvider = db.prepare(`
    INSERT OR IGNORE INTO providers (id, name, display_name, type, base_url, status, priority, weight, config)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const providers = [
    ['prov_mailtm', 'mailtm', 'Mail.tm', 'rest', 'https://api.mail.tm', 'active', 1, 100, '{"auth_type":"jwt"}'],
    ['prov_guerrilla', 'guerrilla', 'Guerrilla Mail', 'rest', 'https://api.guerrillamail.com/ajax.php', 'active', 2, 95, '{"auth_type":"session"}'],
    ['prov_onesecmail', 'onesecmail', '1secMail', 'rest', 'https://www.1secmail.com/api/v1/', 'active', 3, 90, '{"auth_type":"none"}'],
    ['prov_mailgw', 'mailgw', 'Mail.gw', 'rest', 'https://api.mail.gw', 'active', 4, 85, '{"auth_type":"jwt"}'],
    ['prov_tempmaillol', 'tempmaillol', 'TempMail.lol', 'rest', 'https://tempmail.lol', 'active', 5, 88, '{"auth_type":"token"}'],
    ['prov_maildrop', 'maildrop', 'Maildrop', 'graphql', 'https://api.maildrop.cc/graphql', 'active', 6, 80, '{"auth_type":"none"}'],
    ['prov_dropmail', 'dropmail', 'DropMail', 'graphql', 'https://dropmail.me/api/graphql', 'active', 7, 75, '{"auth_type":"auto_token"}'],
    ['prov_dispostable', 'dispostable', 'Dispostable', 'rest', 'https://www.dispostable.com/api', 'active', 8, 70, '{"auth_type":"none"}'],
    ['prov_tempmailio', 'tempmailio', 'Temp-Mail.io', 'rest', 'https://api.internal.temp-mail.io', 'active', 9, 68, '{"auth_type":"none"}'],
    ['prov_emailondeck', 'emailondeck', 'EmailOnDeck', 'rest', 'https://www.emailondeck.com', 'active', 10, 65, '{"auth_type":"session"}'],
    ['prov_mohmal', 'mohmal', 'Mohmal', 'rest', 'https://www.mohmal.com', 'active', 11, 62, '{"auth_type":"session"}'],
    ['prov_tempmailc', 'tempmailc', 'TempMailC', 'rest', 'https://tempmailc.com/api/v1', 'active', 12, 78, '{"auth_type":"none"}'],
    ['prov_getnada', 'getnada', 'GetNada', 'rest', 'https://getnada.com/api/v1', 'active', 13, 76, '{"auth_type":"session"}'],
    ['prov_tempmailplus', 'tempmailplus', 'TempMail+', 'rest', 'https://tempmail.plus/api', 'active', 14, 74, '{"auth_type":"none"}'],
    ['prov_catchmail', 'catchmail', 'Catchmail', 'rest', 'https://catchmail.io/api/v1', 'active', 15, 72, '{"auth_type":"none"}'],
    ['prov_mailforspam', 'mailforspam', 'MailForSpam', 'rest', 'https://www.mailforspam.com', 'active', 16, 60, '{"auth_type":"none"}'],
    ['prov_inboxes', 'inboxes', 'Inboxes.com', 'rest', 'https://inboxes.com/api/v2', 'active', 17, 58, '{"auth_type":"none"}'],
    ['prov_devmail', 'devmail', 'DevMail', 'rest', 'https://devmail.uk/api', 'active', 18, 56, '{"auth_type":"none"}'],
    ['prov_fakelegal', 'fakelegal', 'Fake.legal', 'rest', 'https://fake.legal/api', 'active', 19, 54, '{"auth_type":"none"}'],
    ['prov_mail123', 'mail123', 'Mail123', 'rest', 'https://mail123.fr/api/v1', 'active', 20, 52, '{"auth_type":"none"}'],
    ['prov_mailinator', 'mailinator', 'Mailinator', 'rest', 'https://mailinator.com/api/v2', 'active', 21, 50, '{"auth_type":"none"}'],
    ['prov_mailnesia', 'mailnesia', 'Mailnesia', 'rest', 'https://mailnesia.com', 'active', 22, 48, '{"auth_type":"none"}'],
    ['prov_inboxkitten', 'inboxkitten', 'InboxKitten', 'rest', 'https://inboxkitten.com/api/v1', 'active', 23, 46, '{"auth_type":"none"}'],
    ['prov_publicinbox', 'publicinbox', 'PublicInbox', 'rest', 'https://api.guerrillamail.com', 'active', 24, 82, '{"auth_type":"session"}'],
    ['prov_tempmailgg', 'tempmailgg', 'TempMail.gg', 'rest', 'https://api.tempmail.gg', 'active', 25, 70, '{"auth_type":"none"}'],
    ['prov_burnermail', 'burnermail', 'BurnerMail', 'rest', 'https://burnermail.io', 'active', 26, 55, '{"auth_type":"none"}'],
    ['prov_harakirimail', 'harakirimail', 'HarakiriMail', 'rest', 'https://harakirimail.com', 'active', 27, 53, '{"auth_type":"none"}'],
    ['prov_internxt', 'internxt', 'Internxt', 'rest', 'https://internxt.com', 'active', 28, 51, '{"auth_type":"none"}'],
    ['prov_mailpoof', 'mailpoof', 'MailPoof', 'rest', 'https://mailpoof.com', 'active', 29, 49, '{"auth_type":"none"}'],
    ['prov_mytemp', 'mytemp', 'MyTemp', 'rest', 'https://mytemp.email', 'active', 30, 47, '{"auth_type":"none"}'],
    ['prov_smtpdev', 'smtpdev', 'SMTPDev', 'rest', 'https://smtpdev.io', 'active', 31, 45, '{"auth_type":"none"}'],
    ['prov_tempmailnet', 'tempmailnet', 'TempMail.net', 'rest', 'https://tempmail.net', 'active', 32, 44, '{"auth_type":"none"}'],
    ['prov_domainpool', 'domainpool', 'XyronMail Network', 'rest', 'https://api.guerrillamail.com', 'active', 33, 99, '{"auth_type":"session","mega_pool":true}'],
  ];

  const insertProviders = db.transaction(() => {
    for (const p of providers) {
      insertProvider.run(...p);
    }
  });
  insertProviders();

  // Seed pre-generated keys
  try {
    const keyCount = db.prepare("SELECT COUNT(*) as c FROM pre_generated_keys").get().c;
    if (keyCount < 1000) {
      const crypto = require('crypto');
      const { v4: uuidv4 } = require('uuid');
      const insertPreKey = db.prepare("INSERT OR IGNORE INTO pre_generated_keys (id, plain_key, status) VALUES (?, ?, 'unused')");
      
      const seedTransaction = db.transaction((keys) => {
        for (const k of keys) {
          insertPreKey.run(k.id, k.plain_key);
        }
      });

      const batch = [];
      for (let i = 0; i < (1000 - keyCount); i++) {
        const raw = `xm_dev_${crypto.randomBytes(24).toString('hex')}`;
        batch.push({ id: `pre_${uuidv4().replace(/-/g, '').slice(0, 12)}`, plain_key: raw });
      }
      seedTransaction(batch);
      console.log(`[DB] Seeded ${1000 - keyCount} pre-generated keys successfully.`);
    }
  } catch (e) {
    console.error('[DB] Seeding pre-generated keys failed:', e.message);
  }

  console.log('[DB] Database initialized successfully');
  require('./db-sync').uploadDatabaseToCloud();
}

module.exports = { db, initializeDatabase };
