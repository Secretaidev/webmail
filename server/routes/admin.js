/**
 * XyronMail - Admin Routes
 * Complete admin console API with visibility and control over all resources
 */
const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { authenticateAny, requireAdmin, auditLog, hashPassword } = require('../middleware/auth');
const providerManager = require('../providers/manager');
const { v4: uuidv4 } = require('uuid');

// All admin routes require authentication + admin role
router.use(authenticateAny);
router.use(requireAdmin);

/* ======================== Dashboard Stats ======================== */

router.get('/stats', (req, res) => {
  try {
    const stats = {
      users: db.prepare('SELECT COUNT(*) as c FROM users').get().c,
      activeUsers: db.prepare("SELECT COUNT(*) as c FROM users WHERE status = 'active'").get().c,
      developers: db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'developer'").get().c,
      inboxes: db.prepare('SELECT COUNT(*) as c FROM inboxes').get().c,
      activeInboxes: db.prepare("SELECT COUNT(*) as c FROM inboxes WHERE status = 'active'").get().c,
      messages: db.prepare('SELECT COUNT(*) as c FROM messages').get().c,
      apiKeys: db.prepare("SELECT COUNT(*) as c FROM api_keys WHERE status = 'active'").get().c,
      providers: db.prepare('SELECT COUNT(*) as c FROM providers').get().c,
      activeProviders: db.prepare("SELECT COUNT(*) as c FROM providers WHERE status = 'active'").get().c,
      domains: db.prepare("SELECT COUNT(*) as c FROM domains WHERE status = 'active'").get().c,
      apiRequests24h: db.prepare("SELECT COUNT(*) as c FROM api_logs WHERE created_at > datetime('now', '-24 hours')").get().c,
      auditEvents24h: db.prepare("SELECT COUNT(*) as c FROM audit_logs WHERE created_at > datetime('now', '-24 hours')").get().c,
      maintenanceMode: db.prepare("SELECT value FROM settings WHERE key = 'maintenance_mode'").get()?.value === 'true',
      
      // Telegram Stats
      telegramTotalVerifications: db.prepare('SELECT COUNT(*) as c FROM telegram_verifications').get().c,
      telegramVerifiedUsers: db.prepare('SELECT COUNT(*) as c FROM users WHERE telegram_id IS NOT NULL AND is_verified = 1').get().c,
      telegramUnverifiedUsers: db.prepare('SELECT COUNT(*) as c FROM users WHERE telegram_id IS NOT NULL AND is_verified = 0').get().c,
    };

    // Hourly message chart (last 24h)
    stats.messageChart = db.prepare(`
      SELECT strftime('%H', received_at) as hour, COUNT(*) as count
      FROM messages
      WHERE received_at > datetime('now', '-24 hours')
      GROUP BY hour ORDER BY hour
    `).all();

    // Provider health
    stats.providerHealth = db.prepare('SELECT name, display_name, status, health_status, avg_response_ms, request_count, error_count FROM providers').all();

    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats', message: err.message });
  }
});

/* ======================== User Management ======================== */

router.get('/users', (req, res) => {
  const { page = 1, limit = 50, role, status, search } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  let where = '1=1';
  const params = [];

  if (role) { where += ' AND role = ?'; params.push(role); }
  if (status) { where += ' AND status = ?'; params.push(status); }
  if (search) { where += ' AND (email LIKE ? OR display_name LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

  const total = db.prepare(`SELECT COUNT(*) as c FROM users WHERE ${where}`).get(...params).c;
  const users = db.prepare(`SELECT id, email, display_name, role, status, email_verified, last_login_at, login_count, created_at FROM users WHERE ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(...params, parseInt(limit), offset);

  res.json({ success: true, data: users, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } });
});

router.put('/users/:id', auditLog('user.update', 'user'), (req, res) => {
  const { role, status, displayName } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (role) db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, req.params.id);
  if (status) db.prepare('UPDATE users SET status = ? WHERE id = ?').run(status, req.params.id);
  if (displayName) db.prepare('UPDATE users SET display_name = ? WHERE id = ?').run(displayName, req.params.id);

  db.prepare("UPDATE users SET updated_at = datetime('now') WHERE id = ?").run(req.params.id);
  const updated = db.prepare('SELECT id, email, display_name, role, status FROM users WHERE id = ?').get(req.params.id);
  res.json({ success: true, data: updated });
});

router.delete('/users/:id', auditLog('user.delete', 'user'), (req, res) => {
  if (req.params.id === req.userId) return res.status(400).json({ error: 'Cannot delete yourself' });
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'User deleted' });
});

/* ======================== Provider Management ======================== */

router.get('/providers', (req, res) => {
  const providers = db.prepare('SELECT * FROM providers ORDER BY priority ASC').all();
  res.json({ success: true, data: providers });
});

router.put('/providers/:id', auditLog('provider.update', 'provider'), (req, res) => {
  const { status, priority, weight } = req.body;
  if (status) db.prepare('UPDATE providers SET status = ? WHERE id = ?').run(status, req.params.id);
  if (priority !== undefined) db.prepare('UPDATE providers SET priority = ? WHERE id = ?').run(priority, req.params.id);
  if (weight !== undefined) db.prepare('UPDATE providers SET weight = ? WHERE id = ?').run(weight, req.params.id);
  db.prepare("UPDATE providers SET updated_at = datetime('now') WHERE id = ?").run(req.params.id);
  const updated = db.prepare('SELECT * FROM providers WHERE id = ?').get(req.params.id);
  res.json({ success: true, data: updated });
});

router.post('/providers/sync-domains', async (req, res) => {
  try {
    const results = await providerManager.syncAllDomains();
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ error: 'Domain sync failed', message: err.message });
  }
});

router.post('/providers/health-check', async (req, res) => {
  try {
    const results = await providerManager.checkAllHealth();
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ error: 'Health check failed', message: err.message });
  }
});

/* ======================== Domain Management ======================== */

router.get('/domains', (req, res) => {
  const domains = db.prepare(`
    SELECT d.*, p.name as provider_name, p.display_name as provider_display_name
    FROM domains d JOIN providers p ON d.provider_id = p.id
    ORDER BY p.priority, d.domain
  `).all();
  res.json({ success: true, data: domains });
});

router.put('/domains/:id', (req, res) => {
  const { status, isPremium } = req.body;
  if (status) db.prepare('UPDATE domains SET status = ? WHERE id = ?').run(status, req.params.id);
  if (isPremium !== undefined) db.prepare('UPDATE domains SET is_premium = ? WHERE id = ?').run(isPremium ? 1 : 0, req.params.id);
  res.json({ success: true });
});

/* ======================== Inbox Management ======================== */

router.get('/inboxes', (req, res) => {
  const { page = 1, limit = 50, status, search } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  let where = '1=1';
  const params = [];
  if (status) { where += ' AND i.status = ?'; params.push(status); }
  if (search) { where += ' AND i.email_address LIKE ?'; params.push(`%${search}%`); }

  const total = db.prepare(`SELECT COUNT(*) as c FROM inboxes i WHERE ${where}`).get(...params).c;
  const inboxes = db.prepare(`
    SELECT i.*, p.display_name as provider_name
    FROM inboxes i JOIN providers p ON i.provider_id = p.id
    WHERE ${where} ORDER BY i.created_at DESC LIMIT ? OFFSET ?
  `).all(...params, parseInt(limit), offset);

  res.json({ success: true, data: inboxes, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } });
});

router.delete('/inboxes/:id', auditLog('inbox.delete', 'inbox'), (req, res) => {
  db.prepare('DELETE FROM messages WHERE inbox_id = ?').run(req.params.id);
  db.prepare('DELETE FROM inboxes WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

/* ======================== API Key Management ======================== */

router.get('/api-keys', (req, res) => {
  const keys = db.prepare(`
    SELECT k.*, u.email as user_email
    FROM api_keys k JOIN users u ON k.user_id = u.id
    ORDER BY k.created_at DESC
  `).all();
  res.json({ success: true, data: keys.map(k => ({ ...k, key_hash: undefined })) });
});

router.put('/api-keys/:id', (req, res) => {
  const { status, rateLimitVal, quotaDaily } = req.body;
  if (status) db.prepare('UPDATE api_keys SET status = ? WHERE id = ?').run(status, req.params.id);
  if (rateLimitVal) db.prepare('UPDATE api_keys SET rate_limit = ? WHERE id = ?').run(rateLimitVal, req.params.id);
  if (quotaDaily) db.prepare('UPDATE api_keys SET quota_daily = ? WHERE id = ?').run(quotaDaily, req.params.id);
  res.json({ success: true });
});

/* ======================== Logs ======================== */

router.get('/audit-logs', (req, res) => {
  const { page = 1, limit = 100, action, userId } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  let where = '1=1';
  const params = [];
  if (action) { where += ' AND action = ?'; params.push(action); }
  if (userId) { where += ' AND user_id = ?'; params.push(userId); }

  const total = db.prepare(`SELECT COUNT(*) as c FROM audit_logs WHERE ${where}`).get(...params).c;
  const logs = db.prepare(`SELECT * FROM audit_logs WHERE ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(...params, parseInt(limit), offset);
  res.json({ success: true, data: logs, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } });
});

router.get('/api-logs', (req, res) => {
  const { page = 1, limit = 100, method, path } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  let where = '1=1';
  const params = [];
  if (method) { where += ' AND method = ?'; params.push(method); }
  if (path) { where += ' AND path LIKE ?'; params.push(`%${path}%`); }

  const total = db.prepare(`SELECT COUNT(*) as c FROM api_logs WHERE ${where}`).get(...params).c;
  const logs = db.prepare(`SELECT * FROM api_logs WHERE ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(...params, parseInt(limit), offset);
  res.json({ success: true, data: logs, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } });
});

/* ======================== Announcements ======================== */

router.get('/announcements', (req, res) => {
  const announcements = db.prepare('SELECT * FROM announcements ORDER BY created_at DESC').all();
  res.json({ success: true, data: announcements });
});

router.post('/announcements', auditLog('announcement.create', 'announcement'), (req, res) => {
  const { title, content, type, endsAt } = req.body;
  const id = `ann_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
  db.prepare('INSERT INTO announcements (id, title, content, type, ends_at, created_by) VALUES (?, ?, ?, ?, ?, ?)')
    .run(id, title, content, type || 'info', endsAt || null, req.userId);
  res.status(201).json({ success: true, data: { id } });
});

router.delete('/announcements/:id', (req, res) => {
  db.prepare('DELETE FROM announcements WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

/* ======================== Feature Flags ======================== */

router.get('/feature-flags', (req, res) => {
  const flags = db.prepare('SELECT * FROM feature_flags ORDER BY name').all();
  res.json({ success: true, data: flags });
});

router.put('/feature-flags/:id', auditLog('feature_flag.update', 'feature_flag'), (req, res) => {
  const { isEnabled } = req.body;
  db.prepare("UPDATE feature_flags SET is_enabled = ?, updated_by = ?, updated_at = datetime('now') WHERE id = ?")
    .run(isEnabled ? 1 : 0, req.userId, req.params.id);
  res.json({ success: true });
});

/* ======================== Settings ======================== */

router.get('/settings', (req, res) => {
  const settings = db.prepare('SELECT * FROM settings ORDER BY key').all();
  res.json({ success: true, data: settings });
});

router.put('/settings/:key', auditLog('setting.update', 'setting'), (req, res) => {
  const { value } = req.body;
  db.prepare("UPDATE settings SET value = ?, updated_at = datetime('now') WHERE key = ?").run(value, req.params.key);
  res.json({ success: true });
});

/* ======================== Maintenance & System ======================== */

router.post('/maintenance', auditLog('maintenance.toggle', 'system'), (req, res) => {
  try {
    let { enabled } = req.body;
    if (enabled === undefined) {
      const current = db.prepare("SELECT value FROM settings WHERE key = 'maintenance_mode'").get()?.value;
      enabled = current !== 'true';
    }
    db.prepare("INSERT OR REPLACE INTO settings (key, value, description) VALUES ('maintenance_mode', ?, 'Enable/disable maintenance mode')").run(enabled ? 'true' : 'false');
    res.json({ success: true, maintenanceMode: enabled });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/system-info', (req, res) => {
  res.json({
    success: true,
    data: {
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      dbSize: require('fs').statSync(require('path').join(__dirname, '..', '..', 'data', 'xyronmail.db')).size,
    }
  });
});

/* ======================== Telegram Bot Key Sync ======================== */

router.post('/generate-telegram-key', auditLog('api_key.create_telegram', 'api_key'), (req, res) => {
  try {
    const { telegramId, name, quotaDaily, rateLimit } = req.body;
    if (!telegramId) return res.status(400).json({ error: 'telegramId is required' });

    const isAdmin = String(telegramId) === "8265364068";
    
    // Limits
    let finalQuota = quotaDaily ? parseInt(quotaDaily) : 5000;
    let finalRate = rateLimit ? parseInt(rateLimit) : 500;
    let scopes = '["read","write"]';

    if (isAdmin) {
      finalQuota = 9999999;
      finalRate = 999999;
      scopes = '["read","write","admin"]';
    }

    // 1. Check if user already exists
    let user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(telegramId);
    if (!user) {
      const bcrypt = require('bcryptjs');
      const crypto = require('crypto');
      const userId = `usr_tg_${telegramId}`;
      const email = `tg_user_${telegramId}@xyronmail.com`;
      const display_name = isAdmin ? 'Admin Root' : `Telegram User ${telegramId}`;
      const password_hash = bcrypt.hashSync(`tg_pass_${telegramId}_${crypto.randomBytes(8).toString('hex')}`, 10);
      const role = isAdmin ? 'admin' : 'developer';
      
      db.prepare(`
        INSERT INTO users (id, email, password_hash, display_name, role, status, email_verified, telegram_id, is_verified)
        VALUES (?, ?, ?, ?, ?, 'active', 1, ?, 1)
      `).run(userId, email, password_hash, display_name, role, telegramId);

      user = { id: userId, email, display_name, role, status: 'active', telegram_id: telegramId };
    } else if (isAdmin && user.role !== 'admin') {
      db.prepare("UPDATE users SET role = 'admin' WHERE telegram_id = ?").run(telegramId);
    }

    // Revoke existing keys if any (limit 1 key per developer user)
    db.prepare("UPDATE api_keys SET status = 'revoked' WHERE user_id = ?").run(user.id);

    // 2. Claim a pre-generated key or generate a fresh one
    let rawKey = null;
    let preGeneratedRecord = db.prepare("SELECT * FROM pre_generated_keys WHERE status = 'unused' ORDER BY created_at ASC LIMIT 1").get();
    
    if (preGeneratedRecord) {
      rawKey = preGeneratedRecord.plain_key;
    } else {
      // Fallback if we run out of pre-generated keys
      const crypto = require('crypto');
      rawKey = `xm_dev_${crypto.randomBytes(24).toString('hex')}`;
    }

    const bcrypt = require('bcryptjs');
    const keyPrefix = rawKey.slice(0, 8);
    const keyHash = bcrypt.hashSync(rawKey, 10);
    const keyId = `key_tg_${uuidv4().replace(/-/g, '').slice(0, 12)}`;

    // 3. Insert into api_keys
    db.prepare(`
      INSERT INTO api_keys (id, user_id, name, key_hash, key_prefix, scopes, rate_limit, quota_daily, telegram_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(keyId, user.id, name || `Telegram Key (${telegramId})`, keyHash, keyPrefix, scopes, finalRate, finalQuota, telegramId);

    // 4. Update status in pre_generated_keys if we claimed one
    if (preGeneratedRecord) {
      db.prepare("UPDATE pre_generated_keys SET status = 'assigned', assigned_to_telegram_id = ? WHERE id = ?")
        .run(telegramId, preGeneratedRecord.id);
    }

    res.status(201).json({
      success: true,
      data: {
        id: keyId,
        key: rawKey,
        prefix: keyPrefix,
        telegramId,
        quotaDaily: finalQuota,
        rateLimit: finalRate
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create Telegram API key', message: err.message });
  }
});

/* ======================== Telegram User Controls ======================== */

router.get('/telegram-user/:tg_id', (req, res) => {
  try {
    const tg_id = req.params.tg_id;
    const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(tg_id);
    if (!user) return res.json({ success: false, error: 'User not found' });
    
    const verifications = db.prepare('SELECT * FROM telegram_verifications WHERE telegram_id = ? ORDER BY created_at DESC LIMIT 5').all(tg_id);
    const keys = db.prepare('SELECT id, key_prefix, rate_limit, quota_daily, status, created_at FROM api_keys WHERE telegram_id = ?').all(tg_id);
    
    res.json({
      success: true,
      data: {
        user,
        verifications,
        keys
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/telegram-user/status', (req, res) => {
  try {
    const { telegramId, status } = req.body;
    if (!telegramId || !status) return res.status(400).json({ error: 'telegramId and status are required' });
    
    const user = db.prepare('SELECT id FROM users WHERE telegram_id = ?').get(telegramId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    db.prepare('UPDATE users SET status = ? WHERE telegram_id = ?').run(status, telegramId);
    res.json({ success: true, message: `User status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ======================== Telegram Verification Logs ======================== */

router.get('/telegram-verifications', (req, res) => {
  try {
    const logs = db.prepare(`
      SELECT * FROM telegram_verifications 
      ORDER BY created_at DESC 
      LIMIT 200
    `).all();
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ======================== Clear All Data ======================== */

router.delete('/clear-all', auditLog('admin.clear_all', 'system'), (req, res) => {
  try {
    const clearAll = db.transaction(() => {
      db.prepare('DELETE FROM attachments').run();
      db.prepare('DELETE FROM messages').run();
      db.prepare('DELETE FROM inboxes').run();
    });
    clearAll();
    res.json({ success: true, message: 'All inboxes and messages cleared successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear all data', message: err.message });
  }
});

/* ======================== Purge All Non-Admin Users ======================== */

router.delete('/purge-all-users', auditLog('admin.purge_users', 'system'), (req, res) => {
  try {
    const purge = db.transaction(() => {
      // Delete all data
      db.prepare('DELETE FROM attachments').run();
      db.prepare('DELETE FROM messages').run();
      db.prepare('DELETE FROM inboxes').run();
      db.prepare('DELETE FROM api_logs').run();
      db.prepare('DELETE FROM audit_logs').run();
      db.prepare('DELETE FROM sessions').run();
      db.prepare('DELETE FROM telegram_verifications').run();
      // Delete all API keys for non-admin users
      db.prepare("DELETE FROM api_keys WHERE id != 'key_bot_master' AND user_id NOT IN (SELECT id FROM users WHERE role = 'admin')").run();
      // Delete all non-admin users
      db.prepare("DELETE FROM users WHERE role != 'admin'").run();
      // Reset pre-generated keys
      db.prepare("UPDATE pre_generated_keys SET status = 'unused', assigned_to_telegram_id = NULL").run();
    });
    purge();
    res.json({ success: true, message: 'All non-admin users and their data have been purged. System is fresh.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to purge users', message: err.message });
  }
});

/* ======================== Message Management ======================== */

router.get('/messages', (req, res) => {
  const { page = 1, limit = 50, search } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  let where = '1=1';
  const params = [];
  if (search) { where += ' AND (m.subject LIKE ? OR m.from_address LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

  const total = db.prepare(`SELECT COUNT(*) as c FROM messages m WHERE ${where}`).get(...params).c;
  const messages = db.prepare(`
    SELECT m.id, m.from_address, m.subject, m.otp_code, m.received_at, m.size_bytes,
           i.email_address as inbox_email, i.user_session_id
    FROM messages m JOIN inboxes i ON m.inbox_id = i.id
    WHERE ${where} ORDER BY m.received_at DESC LIMIT ? OFFSET ?
  `).all(...params, parseInt(limit), offset);

  res.json({ success: true, data: messages, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } });
});

router.delete('/messages', auditLog('admin.delete_messages', 'system'), (req, res) => {
  try {
    const r1 = db.prepare('DELETE FROM attachments').run();
    const r2 = db.prepare('DELETE FROM messages').run();
    db.prepare("UPDATE inboxes SET message_count = 0").run();
    res.json({ success: true, message: `Deleted ${r2.changes} messages.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete messages', message: err.message });
  }
});

/* ======================== Broadcast to Telegram Users ======================== */

router.post('/broadcast', async (req, res) => {
  try {
    const { message, targetType = 'all' } = req.body;
    if (!message) return res.status(400).json({ error: 'message is required' });

    const botToken = process.env.BOT_TOKEN || "8318868368:AAFjV-zExyYk8hiBSc-K1kUXVGIQXXUaa_8";

    let users;
    if (targetType === 'verified') {
      users = db.prepare("SELECT telegram_id FROM users WHERE telegram_id IS NOT NULL AND is_verified = 1").all();
    } else {
      users = db.prepare("SELECT telegram_id FROM users WHERE telegram_id IS NOT NULL").all();
    }

    let sent = 0, failed = 0;
    for (const u of users) {
      try {
        const r = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: u.telegram_id, text: message, parse_mode: 'HTML' })
        });
        const d = await r.json();
        if (d.ok) sent++; else failed++;
      } catch (e) { failed++; }
    }

    res.json({ success: true, sent, failed, total: users.length });
  } catch (err) {
    res.status(500).json({ error: 'Broadcast failed', message: err.message });
  }
});

/* ======================== Telegram User - Full Management ======================== */

router.delete('/telegram-user/:tg_id', auditLog('admin.delete_telegram_user', 'user'), (req, res) => {
  try {
    const tg_id = req.params.tg_id;
    const user = db.prepare('SELECT id FROM users WHERE telegram_id = ?').get(tg_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const deleteUser = db.transaction(() => {
      // Cascade delete all user data
      const inboxIds = db.prepare('SELECT id FROM inboxes WHERE user_id = ? OR user_session_id = ?').all(user.id, `tg_${tg_id}`).map(i => i.id);
      for (const inboxId of inboxIds) {
        db.prepare('DELETE FROM attachments WHERE message_id IN (SELECT id FROM messages WHERE inbox_id = ?)').run(inboxId);
        db.prepare('DELETE FROM messages WHERE inbox_id = ?').run(inboxId);
      }
      db.prepare('DELETE FROM inboxes WHERE user_id = ? OR user_session_id = ?').run(user.id, `tg_${tg_id}`);
      db.prepare('DELETE FROM api_keys WHERE user_id = ?').run(user.id);
      db.prepare('DELETE FROM sessions WHERE user_id = ?').run(user.id);
      db.prepare('DELETE FROM telegram_verifications WHERE telegram_id = ?').run(tg_id);
      db.prepare('DELETE FROM users WHERE id = ?').run(user.id);
    });
    deleteUser();

    res.json({ success: true, message: `Telegram user ${tg_id} and all their data deleted.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user', message: err.message });
  }
});

router.post('/telegram-user/:tg_id/reset-verification', (req, res) => {
  try {
    const tg_id = req.params.tg_id;
    db.prepare('UPDATE users SET is_verified = 0 WHERE telegram_id = ?').run(tg_id);
    db.prepare('DELETE FROM telegram_verifications WHERE telegram_id = ?').run(tg_id);
    res.json({ success: true, message: 'Verification reset.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ======================== All Telegram Users List ======================== */

router.get('/telegram-users', (req, res) => {
  try {
    const users = db.prepare(`
      SELECT u.id, u.telegram_id, u.display_name, u.role, u.status, u.is_verified, 
             u.created_at, u.last_login_at,
             COUNT(DISTINCT i.id) as inbox_count,
             COUNT(DISTINCT k.id) as key_count
      FROM users u
      LEFT JOIN inboxes i ON (i.user_id = u.id OR i.user_session_id = 'tg_' || u.telegram_id)
      LEFT JOIN api_keys k ON k.user_id = u.id AND k.status = 'active'
      WHERE u.telegram_id IS NOT NULL
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `).all();
    res.json({ success: true, data: users, total: users.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
