const { uploadDatabaseToCloud } = require('./db-sync');

(async () => {
  try {
    await uploadDatabaseToCloud();
    process.exit(0);
  } catch (err) {
    console.error('Final sync upload failed:', err);
    process.exit(1);
  }
})();
