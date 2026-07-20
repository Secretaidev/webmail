const { sendDbToTelegram, sendDailyTextSummary } = require('./db-sync');

(async () => {
  try {
    await sendDbToTelegram("Server Shutdown Final Export");
    await sendDailyTextSummary();
    process.exit(0);
  } catch (err) {
    console.error('Final TG sync upload failed:', err);
    process.exit(1);
  }
})();
