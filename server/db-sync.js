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

module.exports = { syncDatabaseFromCloud, uploadDatabaseToCloud };
