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
  let { enabled } = req.body;
  if (enabled === undefined) {
    const current = db.prepare("SELECT value FROM settings WHERE key = 'maintenance_mode'").get()?.value;
    enabled = current !== 'true';
  }
  db.prepare('UPDATE settings SET value = ? WHERE key = ?').run(enabled ? 'true' : 'false', 'maintenance_mode');
  res.json({ success: true, maintenanceMode: enabled });
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

module.exports = router;
