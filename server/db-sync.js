const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const os = require('os');

const DB_PATH = path.join(__dirname, '..', 'data', 'xyronmail.db');
const PG_URI = process.env.DATABASE_URL || 'postgresql://postgres.mjttwsrbwedummfpnqhn:adityarajsingh@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres';

// Track if upload is currently running to prevent concurrent uploads
let isUploading = false;

async function syncDatabaseFromCloud() {
  console.log('🔄 Checking Supabase Cloud PostgreSQL for database sync...');
  const client = new Client({ connectionString: PG_URI, connectionTimeoutMillis: 10000 });
  try {
    await client.connect();
    
    // Create the backup table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS xyron_db_backups (
        id INT PRIMARY KEY,
        file_data BYTEA,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    const res = await client.query('SELECT file_data FROM xyron_db_backups WHERE id = 1');
    if (res.rows.length > 0 && res.rows[0].file_data) {
      // Ensure the directory exists
      const dataDir = path.dirname(DB_PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, res.rows[0].file_data);
      console.log('✅ Database successfully synced from Supabase Cloud PostgreSQL!');
    } else {
      console.log('🌱 No backup found on Supabase. Starting fresh database.');
    }
  } catch (err) {
    console.error('⚠️ Failed to sync database from cloud (using local cache if available):', err.message);
  } finally {
    try { await client.end(); } catch(e) {}
  }
}

/**
 * Upload DB safely using SQLite's online backup API to avoid WAL corruption.
 * We use better-sqlite3's .backup() method which is the correct way to backup
 * an open SQLite database (handles WAL correctly).
 */
async function uploadDatabaseToCloud() {
  if (isUploading) return; // Prevent concurrent uploads
  if (!fs.existsSync(DB_PATH)) return;

  isUploading = true;
  const tmpPath = path.join(os.tmpdir(), `xyronmail_backup_${Date.now()}.db`);

  try {
    // Use better-sqlite3's built-in backup() API — safe with WAL mode
    const Database = require('better-sqlite3');
    const srcDb = new Database(DB_PATH, { readonly: true, fileMustExist: true });

    // Perform hot backup to temp file (handles WAL correctly)
    await srcDb.backup(tmpPath);
    srcDb.close();

    const data = fs.readFileSync(tmpPath);
    
    const client = new Client({ connectionString: PG_URI, connectionTimeoutMillis: 10000 });
    try {
      await client.connect();
      await client.query(`
        INSERT INTO xyron_db_backups (id, file_data, updated_at)
        VALUES (1, $1, NOW())
        ON CONFLICT (id) DO UPDATE
        SET file_data = EXCLUDED.file_data, updated_at = NOW();
      `, [data]);
      console.log('✅ Database backup successfully uploaded to Supabase Cloud.');
    } finally {
      try { await client.end(); } catch(e) {}
    }
  } catch (err) {
    console.error('⚠️ Database backup upload failed:', err.message);
  } finally {
    // Clean up temp file
    try { if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath); } catch(e) {}
    isUploading = false;
  }
}

module.exports = {
  syncDatabaseFromCloud,
  uploadDatabaseToCloud
};
