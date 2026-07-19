const { syncDatabaseFromCloud } = require('./db-sync');

(async () => {
  try {
    await syncDatabaseFromCloud();
    process.exit(0);
  } catch (err) {
    console.error('Sync failed:', err);
    process.exit(1);
  }
})();
