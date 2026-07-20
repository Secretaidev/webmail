const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const os = require('os');

const DB_PATH = path.join(__dirname, '..', 'data', 'xyronmail.db');
const PG_URI = process.env.DATABASE_URL || 'postgresql://postgres.mjttwsrbwedummfpnqhn:adityarajsingh@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres';

let isUploading = false;

async function syncDatabaseFromCloud() {
  console.log('Checking Supabase Cloud PostgreSQL for database sync...');
  const client = new Client({ connectionString: PG_URI, connectionTimeoutMillis: 10000 });
  try {
    await client.connect();
    await client.query(`CREATE TABLE IF NOT EXISTS xyron_db_backups (id INT PRIMARY KEY, file_data BYTEA, updated_at TIMESTAMP DEFAULT NOW())`);
    const res = await client.query('SELECT file_data FROM xyron_db_backups WHERE id = 1');
    if (res.rows.length > 0 && res.rows[0].file_data) {
      const dataDir = path.dirname(DB_PATH);
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
      fs.writeFileSync(DB_PATH, res.rows[0].file_data);
      // Remove stale WAL/SHM files
      try { fs.unlinkSync(DB_PATH + '-wal'); } catch(e) {}
      try { fs.unlinkSync(DB_PATH + '-shm'); } catch(e) {}
      // Verify integrity
      const Database = require('better-sqlite3');
      let isCorrupt = false;
      try {
        const testDb = new Database(DB_PATH);
        const check = testDb.pragma('integrity_check');
        testDb.close();
        if (!check || check[0]?.integrity_check !== 'ok') {
          isCorrupt = true;
          console.error('[DB-Sync] integrity_check FAILED:', JSON.stringify(check));
        }
      } catch(e) {
        isCorrupt = true;
        console.error('[DB-Sync] Could not open downloaded DB:', e.message);
      }
      if (isCorrupt) {
        console.log('[DB-Sync] Corrupt DB detected. Deleting and starting fresh.');
        try { fs.unlinkSync(DB_PATH); } catch(e) {}
        try { fs.unlinkSync(DB_PATH + '-wal'); } catch(e) {}
        try { fs.unlinkSync(DB_PATH + '-shm'); } catch(e) {}
      } else {
        console.log('[DB-Sync] Database synced and verified from Supabase Cloud.');
      }
    } else {
      console.log('[DB-Sync] No backup found. Starting fresh database.');
    }
  } catch (err) {
    console.error('[DB-Sync] Sync failed:', err.message);
  } finally {
    try { await client.end(); } catch(e) {}
  }
}

async function uploadDatabaseToCloud() {
  if (isUploading) return;
  if (!fs.existsSync(DB_PATH)) return;
  isUploading = true;
  const tmpPath = path.join(os.tmpdir(), `xyronmail_backup_${Date.now()}.db`);
  try {
    const Database = require('better-sqlite3');
    const srcDb = new Database(DB_PATH, { readonly: true, fileMustExist: true });
    try { srcDb.pragma('wal_checkpoint(FULL)'); } catch(e) {}
    // Integrity check before upload
    let isCorrupt = false;
    try {
      const check = srcDb.pragma('integrity_check');
      if (!check || check[0]?.integrity_check !== 'ok') {
        isCorrupt = true;
        console.error('[DB-Sync] Local DB failed integrity check, skipping upload:', JSON.stringify(check));
      }
    } catch(e) { isCorrupt = true; }
    if (isCorrupt) { srcDb.close(); return; }
    await srcDb.backup(tmpPath);
    srcDb.close();
    const data = fs.readFileSync(tmpPath);
    const client = new Client({ connectionString: PG_URI, connectionTimeoutMillis: 10000 });
    try {
      await client.connect();
      await client.query(`INSERT INTO xyron_db_backups (id, file_data, updated_at) VALUES (1, $1, NOW()) ON CONFLICT (id) DO UPDATE SET file_data = EXCLUDED.file_data, updated_at = NOW()`, [data]);
      console.log('[DB-Sync] Backup uploaded to Supabase Cloud.');
    } finally {
      try { await client.end(); } catch(e) {}
    }
  } catch (err) {
    console.error('[DB-Sync] Upload failed:', err.message);
  } finally {
    try { if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath); } catch(e) {}
    isUploading = false;
  }
}

async function sendDbToTelegram(label = "Manual Backup") {
  const botToken = process.env.BOT_TOKEN || "8318868368:AAFjV-zExyYk8hiBSc-K1kUXVGIQXXUaa_8";
  const channelId = "-1004474317278";
  
  if (!fs.existsSync(DB_PATH)) return;

  const Database = require('better-sqlite3');
  const tmpPath = path.join(os.tmpdir(), `xyronmail_tg_${Date.now()}.db`);

  try {
    // 1. Perform a clean backup of SQLite to a temp file
    const srcDb = new Database(DB_PATH, { readonly: true, fileMustExist: true });
    await srcDb.backup(tmpPath);
    srcDb.close();

    // 2. Read file buffer
    const fileBuffer = fs.readFileSync(tmpPath);
    
    // 3. Prepare FormData
    const formData = new FormData();
    formData.append('chat_id', channelId);
    
    const blob = new Blob([fileBuffer], { type: 'application/x-sqlite3' });
    formData.append('document', blob, `xyronmail_${new Date().toISOString().slice(0,10)}_${Date.now()}.db`);
    
    const caption = `📦 <b>DATABASE BACKUP - EXPORT</b>\n\n` +
                    `🏷️ <b>Label:</b> <code>${label}</code>\n` +
                    `📅 <b>Timestamp:</b> <code>${new Date().toISOString()}</code>\n` +
                    `💾 <b>Size:</b> <code>${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB</code>`;
    formData.append('caption', caption);
    formData.append('parse_mode', 'HTML');

    // 4. Send via Bot API
    const r = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
      method: 'POST',
      body: formData
    });
    const d = await r.json();
    if (!d.ok) {
      console.error('[TG-Export] Telegram sendDocument error:', d.description);
    } else {
      console.log('[TG-Export] Database successfully sent to Telegram channel.');
    }
  } catch (err) {
    console.error('[TG-Export] Failed to send database to Telegram:', err.message);
  } finally {
    try { if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath); } catch(e) {}
  }
}

async function sendDailyTextSummary() {
  const botToken = process.env.BOT_TOKEN || "8318868368:AAFjV-zExyYk8hiBSc-K1kUXVGIQXXUaa_8";
  const channelId = "-1004474317278";
  const { db } = require('./db');

  try {
    const totalUsers = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
    const tgUsers = db.prepare('SELECT COUNT(*) as c FROM users WHERE telegram_id IS NOT NULL').get().c;
    const verifiedTg = db.prepare('SELECT COUNT(*) as c FROM users WHERE telegram_id IS NOT NULL AND is_verified = 1').get().c;
    const totalInboxes = db.prepare('SELECT COUNT(*) as c FROM inboxes').get().c;
    const totalMessages = db.prepare('SELECT COUNT(*) as c FROM messages').get().c;
    const apiKeys = db.prepare('SELECT COUNT(*) as c FROM api_keys WHERE status = "active"').get().c;

    const summaryText = `📊 <b>DAILY DATABASE REPORT SUMMARY</b>\n\n` +
                        `👥 <b>Total Web Users:</b> <code>${totalUsers}</code>\n` +
                        `📱 <b>Telegram Users:</b> <code>${tgUsers}</code> (Verified: <code>${verifiedTg}</code>)\n` +
                        `📬 <b>Active Inboxes:</b> <code>${totalInboxes}</code>\n` +
                        `✉️ <b>Total Messages:</b> <code>${totalMessages}</code>\n` +
                        `🔑 <b>Active API Keys:</b> <code>${apiKeys}</code>\n\n` +
                        `📅 <b>Report Generated:</b> <code>${new Date().toLocaleString()}</code>\n` +
                        `🟢 <i>System Operational</i>`;

    const r = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: channelId, text: summaryText, parse_mode: 'HTML' })
    });
    const d = await r.json();
    if (!d.ok) {
      console.error('[TG-Export] Telegram sendMessage error:', d.description);
    } else {
      console.log('[TG-Export] Sent daily text summary to Telegram.');
    }
  } catch (err) {
    console.error('[TG-Export] Failed to send daily text summary:', err.message);
  }
}

module.exports = { syncDatabaseFromCloud, uploadDatabaseToCloud, sendDbToTelegram, sendDailyTextSummary };
