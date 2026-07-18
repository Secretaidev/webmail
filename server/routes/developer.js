/**
 * XyronMail - Developer Platform Routes
 * API key management, usage analytics, webhooks, SDK documentation
 */
const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { authenticate, requireDeveloper, auditLog } = require('../middleware/auth');

// All developer routes require auth
router.use(authenticate);

/* ======================== Developer Registration ======================== */

router.post('/register', auditLog('developer.register', 'user'), (req, res) => {
  try {
    if (req.user.role === 'developer' || req.user.role === 'admin') {
      return res.status(400).json({ error: 'Already a developer' });
    }

    db.prepare('UPDATE users SET role = ? WHERE id = ?').run('developer', req.userId);
    res.json({ success: true, message: 'Developer access granted' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', message: err.message });
  }
});

/* ======================== API Key Management ======================== */

router.get('/api-keys', requireDeveloper, (req, res) => {
  const keys = db.prepare(`
    SELECT id, name, key_prefix, scopes, rate_limit, quota_daily, quota_used_today, status, last_used_at, expires_at, created_at
    FROM api_keys WHERE user_id = ? ORDER BY created_at DESC
  `).all(req.userId);

  res.json({ success: true, data: keys.map(k => ({ ...k, scopes: JSON.parse(k.scopes) })) });
});

router.post('/api-keys', requireDeveloper, auditLog('api_key.create', 'api_key'), (req, res) => {
  try {
    const { name, scopes = ['read'], rateLimitVal = 100, quotaDaily = 1000, expiresInDays } = req.body;
    if (!name) return res.status(400).json({ error: 'Key name is required' });

    // Check key limit (max 10 per user)
    const count = db.prepare("SELECT COUNT(*) as c FROM api_keys WHERE user_id = ? AND status = 'active'").get(req.userId);
    if (count.c >= 10) return res.status(429).json({ error: 'Maximum 10 active API keys' });

    // Generate key
    const rawKey = `xm_${crypto.randomBytes(32).toString('hex')}`;
    const keyPrefix = rawKey.slice(0, 8);
    const keyHash = bcrypt.hashSync(rawKey, 10);
    const keyId = `key_${uuidv4().replace(/-/g, '').slice(0, 12)}`;

    let expiresAt = null;
    if (expiresInDays) {
      expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString();
    }

    db.prepare(`
      INSERT INTO api_keys (id, user_id, name, key_hash, key_prefix, scopes, rate_limit, quota_daily, expires_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(keyId, req.userId, name, keyHash, keyPrefix, JSON.stringify(scopes), rateLimitVal, quotaDaily, expiresAt);

    // Return key ONCE (never stored in plain text)
    res.status(201).json({
      success: true,
      data: {
        id: keyId,
        name,
        key: rawKey,
        prefix: keyPrefix,
        scopes,
        rateLimit: rateLimitVal,
        quotaDaily,
        expiresAt
      },
      warning: 'Copy your API key now. It will not be shown again.'
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create API key', message: err.message });
  }
});

router.delete('/api-keys/:id', requireDeveloper, auditLog('api_key.revoke', 'api_key'), (req, res) => {
  db.prepare("UPDATE api_keys SET status = 'revoked' WHERE id = ? AND user_id = ?").run(req.params.id, req.userId);
  res.json({ success: true, message: 'API key revoked' });
});

/* ======================== Usage Analytics ======================== */

router.get('/analytics', requireDeveloper, (req, res) => {
  const { days = 7 } = req.query;
  const userKeys = db.prepare("SELECT id FROM api_keys WHERE user_id = ?").all(req.userId).map(k => k.id);

  if (userKeys.length === 0) {
    return res.json({ success: true, data: { totalRequests: 0, avgResponseTime: 0, errorRate: 0, daily: [], byEndpoint: [] } });
  }

  const placeholders = userKeys.map(() => '?').join(',');

  const total = db.prepare(`
    SELECT COUNT(*) as total,
    AVG(response_time_ms) as avgTime,
    SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) as errors
    FROM api_logs WHERE api_key_id IN (${placeholders}) AND created_at > datetime('now', '-${parseInt(days)} days')
  `).get(...userKeys);

  const daily = db.prepare(`
    SELECT date(created_at) as day, COUNT(*) as count, AVG(response_time_ms) as avgTime
    FROM api_logs WHERE api_key_id IN (${placeholders}) AND created_at > datetime('now', '-${parseInt(days)} days')
    GROUP BY day ORDER BY day
  `).all(...userKeys);

  const byEndpoint = db.prepare(`
    SELECT method, path, COUNT(*) as count, AVG(response_time_ms) as avgTime
    FROM api_logs WHERE api_key_id IN (${placeholders}) AND created_at > datetime('now', '-${parseInt(days)} days')
    GROUP BY method, path ORDER BY count DESC LIMIT 20
  `).all(...userKeys);

  res.json({
    success: true,
    data: {
      totalRequests: total.total,
      avgResponseTime: Math.round(total.avgTime || 0),
      errorRate: total.total > 0 ? ((total.errors / total.total) * 100).toFixed(2) : 0,
      daily,
      byEndpoint
    }
  });
});

/* ======================== Request Logs ======================== */

router.get('/logs', requireDeveloper, (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const userKeys = db.prepare("SELECT id FROM api_keys WHERE user_id = ?").all(req.userId).map(k => k.id);

  if (userKeys.length === 0) {
    return res.json({ success: true, data: [], pagination: { total: 0, page: 1, pages: 0 } });
  }

  const placeholders = userKeys.map(() => '?').join(',');
  const total = db.prepare(`SELECT COUNT(*) as c FROM api_logs WHERE api_key_id IN (${placeholders})`).get(...userKeys).c;
  const logs = db.prepare(`SELECT * FROM api_logs WHERE api_key_id IN (${placeholders}) ORDER BY created_at DESC LIMIT ? OFFSET ?`)
    .all(...userKeys, parseInt(limit), offset);

  res.json({ success: true, data: logs, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } });
});

/* ======================== Webhooks ======================== */

router.get('/webhooks', requireDeveloper, (req, res) => {
  const webhooks = db.prepare('SELECT * FROM webhooks WHERE user_id = ? ORDER BY created_at DESC').all(req.userId);
  res.json({ success: true, data: webhooks.map(w => ({ ...w, secret: w.secret.slice(0, 8) + '...' })) });
});

router.post('/webhooks', requireDeveloper, (req, res) => {
  try {
    const { url, events = ['message.received'] } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    const id = `wh_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
    const secret = crypto.randomBytes(32).toString('hex');

    db.prepare('INSERT INTO webhooks (id, user_id, url, events, secret) VALUES (?, ?, ?, ?, ?)')
      .run(id, req.userId, url, JSON.stringify(events), secret);

    res.status(201).json({ success: true, data: { id, url, events, secret } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create webhook', message: err.message });
  }
});

router.delete('/webhooks/:id', requireDeveloper, (req, res) => {
  db.prepare('DELETE FROM webhooks WHERE id = ? AND user_id = ?').run(req.params.id, req.userId);
  res.json({ success: true });
});

module.exports = router;
