const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'xyronmail.db');
const PG_URI = process.env.DATABASE_URL || 'postgresql://postgres.mjttwsrbwedummfpnqhn:adityarajsingh@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres';

async function syncDatabaseFromCloud() {
  console.log('🔄 Checking Supabase Cloud PostgreSQL for database sync...');
  const client = new Client({ connectionString: PG_URI });
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
    try {
      await client.end();
    } catch(e) {}
  }
}

async function uploadDatabaseToCloud() {
  if (!fs.existsSync(DB_PATH)) {
    console.log('⚠️ Database file does not exist locally. Skipping upload.');
    return;
  }
  
  console.log('💾 Uploading local database backup to Supabase Cloud PostgreSQL...');
  const client = new Client({ connectionString: PG_URI });
  try {
    await client.connect();
    const data = fs.readFileSync(DB_PATH);
    await client.query(`
      INSERT INTO xyron_db_backups (id, file_data, updated_at)
      VALUES (1, $1, NOW())
      ON CONFLICT (id) DO UPDATE
      SET file_data = EXCLUDED.file_data, updated_at = NOW();
    `, [data]);
    console.log('✅ Database backup successfully uploaded to Supabase Cloud.');
  } catch (err) {
    console.error('⚠️ Database backup upload failed:', err.message);
  } finally {
    try {
      await client.end();
    } catch(e) {}
  }
}

module.exports = {
  syncDatabaseFromCloud,
  uploadDatabaseToCloud
};
