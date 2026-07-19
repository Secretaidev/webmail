/**
 * XyronMail - Inbox & Email Routes
 * Core API for creating temporary inboxes, fetching messages, and real-time sync
 */
const express = require('express');
const router = express.Router();
const { db } = require('../db');
const providerManager = require('../providers/manager');
const { sessionMiddleware, optionalAuth, authenticate, apiLogger } = require('../middleware/auth');

// Apply session middleware to all inbox routes
router.use(sessionMiddleware);
router.use(optionalAuth);

/**
 * GET /api/domains - List all available domains
 */
router.get('/domains', (req, res) => {
  try {
    const domains = providerManager.getAllDomains();
    res.json({
      success: true,
      data: domains.map(d => ({
        id: d.id,
        domain: d.domain,
        provider: 'XyronMail Network',
        isPremium: d.is_premium === 1
      }))
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch domains', message: err.message });
  }
});

/**
 * POST /api/inbox - Create a new temporary inbox
 */
router.post('/inbox', async (req, res) => {
  try {
    const { domain, provider } = req.body || {};

    const inbox = await providerManager.createInbox(domain || null, req.sessionId, req.userId);

    res.status(201).json({
      success: true,
      data: inbox
    });
  } catch (err) {
    console.error('[API] Create inbox error:', err.message);
    res.status(500).json({ error: 'Failed to create inbox', message: err.message });
  }
});

/**
 * GET /api/inbox - List all inboxes for current session/user
 */
router.get('/inbox', (req, res) => {
  try {
    let inboxes;
    if (req.userId) {
      inboxes = db.prepare(`
        SELECT i.*, p.display_name as provider_name
        FROM inboxes i
        JOIN providers p ON i.provider_id = p.id
        WHERE (i.user_id = ? OR i.user_session_id = ?) AND i.status = 'active'
        ORDER BY i.created_at DESC
      `).all(req.userId, req.sessionId);
    } else {
      inboxes = db.prepare(`
        SELECT i.*, p.display_name as provider_name
        FROM inboxes i
        JOIN providers p ON i.provider_id = p.id
        WHERE i.user_session_id = ? AND i.status = 'active'
        ORDER BY i.created_at DESC
      `).all(req.sessionId);
    }

    res.json({
      success: true,
      data: inboxes.map(i => ({
        id: i.id,
        emailAddress: i.email_address,
        domain: i.domain,
        provider: 'XyronMail Network',
        isFavorite: i.is_favorite === 1,
        messageCount: i.message_count,
        expiresAt: i.expires_at,
        createdAt: i.created_at,
        lastCheckedAt: i.last_checked_at
      }))
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inboxes', message: err.message });
  }
});

/**
 * GET /api/inbox/:id - Get inbox details
 */
router.get('/inbox/:id', (req, res) => {
  try {
    const inbox = db.prepare(`
      SELECT i.*, p.display_name as provider_name, p.name as provider_slug
      FROM inboxes i
      JOIN providers p ON i.provider_id = p.id
      WHERE i.id = ?
    `).get(req.params.id);

    if (!inbox) {
      return res.status(404).json({ error: 'Inbox not found' });
    }

    // Verify access
    if (inbox.user_session_id !== req.sessionId && inbox.user_id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      success: true,
      data: {
        id: inbox.id,
        emailAddress: inbox.email_address,
        domain: inbox.domain,
        provider: 'XyronMail Network',
        isFavorite: inbox.is_favorite === 1,
        messageCount: inbox.message_count,
        expiresAt: inbox.expires_at,
        createdAt: inbox.created_at
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inbox', message: err.message });
  }
});

/**
 * DELETE /api/inbox/:id - Delete an inbox
 */
router.delete('/inbox/:id', (req, res) => {
  try {
    const inbox = db.prepare('SELECT * FROM inboxes WHERE id = ?').get(req.params.id);
    if (!inbox) return res.status(404).json({ error: 'Inbox not found' });

    if (inbox.user_session_id !== req.sessionId && inbox.user_id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    db.prepare('UPDATE inboxes SET status = ? WHERE id = ?').run('deleted', req.params.id);
    db.prepare('DELETE FROM messages WHERE inbox_id = ?').run(req.params.id);

    res.json({ success: true, message: 'Inbox deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete inbox', message: err.message });
  }
});

/**
 * PATCH /api/inbox/:id/favorite - Toggle favorite
 */
router.patch('/inbox/:id/favorite', (req, res) => {
  try {
    const inbox = db.prepare('SELECT * FROM inboxes WHERE id = ?').get(req.params.id);
    if (!inbox) return res.status(404).json({ error: 'Inbox not found' });

    const newVal = inbox.is_favorite === 1 ? 0 : 1;
    db.prepare('UPDATE inboxes SET is_favorite = ? WHERE id = ?').run(newVal, req.params.id);

    res.json({ success: true, isFavorite: newVal === 1 });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update favorite', message: err.message });
  }
});

/**
 * GET /api/inbox/:id/messages - Fetch messages for an inbox
 */
router.get('/inbox/:id/messages', async (req, res) => {
  try {
    const inbox = db.prepare('SELECT * FROM inboxes WHERE id = ?').get(req.params.id);
    if (!inbox) return res.status(404).json({ error: 'Inbox not found' });

    if (inbox.user_session_id !== req.sessionId && inbox.user_id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Refresh from provider
    const refresh = req.query.refresh !== 'false';
    if (refresh) {
      try {
        await providerManager.refreshMessages(inbox.id);
      } catch (e) {
        console.error('[API] Refresh error:', e.message);
      }
    }

    // Get messages from DB
    const messages = db.prepare(`
      SELECT * FROM messages
      WHERE inbox_id = ?
      ORDER BY received_at DESC
    `).all(req.params.id);

    res.json({
      success: true,
      data: messages.map(m => ({
        id: m.id,
        from: { address: m.from_address, name: m.from_name },
        to: m.to_address,
        subject: m.subject,
        intro: m.body_text ? m.body_text.slice(0, 200) : '',
        isRead: m.is_read === 1,
        isStarred: m.is_starred === 1,
        hasAttachments: m.has_attachments === 1,
        otpCode: m.otp_code,
        receivedAt: m.received_at,
        size: m.size_bytes
      }))
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages', message: err.message });
  }
});

/**
 * GET /api/inbox/:inboxId/messages/:msgId - Get full message
 */
router.get('/inbox/:inboxId/messages/:msgId', async (req, res) => {
  try {
    const inbox = db.prepare('SELECT * FROM inboxes WHERE id = ?').get(req.params.inboxId);
    if (!inbox) return res.status(404).json({ error: 'Inbox not found' });

    if (inbox.user_session_id !== req.sessionId && inbox.user_id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const message = await providerManager.getFullMessage(req.params.inboxId, req.params.msgId);
    if (!message) return res.status(404).json({ error: 'Message not found' });

    // Mark as read
    db.prepare('UPDATE messages SET is_read = 1 WHERE id = ?').run(req.params.msgId);

    // Get attachments
    const attachments = db.prepare('SELECT * FROM attachments WHERE message_id = ?').all(req.params.msgId);

    res.json({
      success: true,
      data: {
        id: message.id,
        from: { address: message.from_address, name: message.from_name },
        to: message.to_address,
        subject: message.subject,
        bodyText: message.body_text,
        bodyHtml: message.body_html,
        isRead: true,
        isStarred: message.is_starred === 1,
        hasAttachments: message.has_attachments === 1,
        otpCode: message.otp_code,
        verificationLinks: (() => {
          if (!message.verification_links) return [];
          if (Array.isArray(message.verification_links)) return message.verification_links;
          try { return JSON.parse(message.verification_links); } catch (e) { return []; }
        })(),
        attachments: attachments.map(a => ({
          id: a.id,
          filename: a.filename,
          contentType: a.content_type,
          size: a.size_bytes
        })),
        receivedAt: message.received_at,
        headers: (() => {
          if (!message.headers) return {};
          if (typeof message.headers === 'object') return message.headers;
          try { return JSON.parse(message.headers); } catch (e) { return {}; }
        })()
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch message', message: err.message });
  }
});

/**
 * DELETE /api/inbox/:inboxId/messages/:msgId - Delete message
 */
router.delete('/inbox/:inboxId/messages/:msgId', (req, res) => {
  try {
    db.prepare('DELETE FROM messages WHERE id = ? AND inbox_id = ?').run(req.params.msgId, req.params.inboxId);
    res.json({ success: true, message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete message', message: err.message });
  }
});

/**
 * PATCH /api/inbox/:inboxId/messages/:msgId/star - Toggle star
 */
router.patch('/inbox/:inboxId/messages/:msgId/star', (req, res) => {
  try {
    const msg = db.prepare('SELECT is_starred FROM messages WHERE id = ?').get(req.params.msgId);
    if (!msg) return res.status(404).json({ error: 'Message not found' });
    const newVal = msg.is_starred === 1 ? 0 : 1;
    db.prepare('UPDATE messages SET is_starred = ? WHERE id = ?').run(newVal, req.params.msgId);
    res.json({ success: true, isStarred: newVal === 1 });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update star', message: err.message });
  }
});

/**
 * POST /api/inbox/:id/monitor - Start OTP monitoring (max 10 minutes)
 */
router.post('/inbox/:id/monitor', (req, res) => {
  try {
    const inbox = db.prepare('SELECT * FROM inboxes WHERE id = ?').get(req.params.id);
    if (!inbox) return res.status(404).json({ error: 'Inbox not found' });

    if (inbox.user_session_id !== req.sessionId && inbox.user_id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const minutes = Math.min(Math.max(parseInt(req.body.minutes) || 2, 1), 10);
    const endsAt = new Date(Date.now() + minutes * 60 * 1000).toISOString();
    const chatId = req.body.chatId || null;

    db.prepare('UPDATE inboxes SET monitor_ends_at = ?, monitor_chat_id = ? WHERE id = ?')
      .run(endsAt, chatId, req.params.id);

    res.json({
      success: true,
      monitorEndsAt: endsAt,
      minutesSet: minutes,
      remainingSeconds: minutes * 60
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to start monitoring', message: err.message });
  }
});

/**
 * GET /api/inbox/:id/monitor-status - Check monitoring status
 */
router.get('/inbox/:id/monitor-status', (req, res) => {
  try {
    const inbox = db.prepare('SELECT monitor_ends_at, email_address FROM inboxes WHERE id = ?').get(req.params.id);
    if (!inbox) return res.status(404).json({ error: 'Inbox not found' });

    const now = Date.now();
    const endsAt = inbox.monitor_ends_at ? new Date(inbox.monitor_ends_at).getTime() : null;
    const isActive = endsAt && endsAt > now;
    const remainingSeconds = isActive ? Math.floor((endsAt - now) / 1000) : 0;

    res.json({
      success: true,
      isActive,
      remainingSeconds,
      monitorEndsAt: inbox.monitor_ends_at
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check monitor status', message: err.message });
  }
});

/**
 * PATCH /api/inbox/:id/extend - Extend OTP monitoring by X more minutes (max 10 per extension)
 */
router.patch('/inbox/:id/extend', (req, res) => {
  try {
    const inbox = db.prepare('SELECT * FROM inboxes WHERE id = ?').get(req.params.id);
    if (!inbox) return res.status(404).json({ error: 'Inbox not found' });

    if (inbox.user_session_id !== req.sessionId && inbox.user_id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const minutes = Math.min(Math.max(parseInt(req.body.minutes) || 2, 1), 10);
    
    // If monitoring is still active, extend from current end. Else start fresh.
    const now = Date.now();
    const currentEnds = inbox.monitor_ends_at ? new Date(inbox.monitor_ends_at).getTime() : now;
    const baseTime = currentEnds > now ? currentEnds : now;
    const newEndsAt = new Date(baseTime + minutes * 60 * 1000).toISOString();

    db.prepare('UPDATE inboxes SET monitor_ends_at = ? WHERE id = ?').run(newEndsAt, req.params.id);

    const remainingSeconds = Math.floor((new Date(newEndsAt).getTime() - now) / 1000);

    res.json({
      success: true,
      monitorEndsAt: newEndsAt,
      minutesAdded: minutes,
      remainingSeconds
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to extend monitoring', message: err.message });
  }
});

/**
 * DELETE /api/inbox/:id/monitor - Stop monitoring
 */
router.delete('/inbox/:id/monitor', (req, res) => {
  try {
    const inbox = db.prepare('SELECT * FROM inboxes WHERE id = ?').get(req.params.id);
    if (!inbox) return res.status(404).json({ error: 'Inbox not found' });

    db.prepare('UPDATE inboxes SET monitor_ends_at = NULL WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Monitoring stopped' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to stop monitoring', message: err.message });
  }
});


router.get('/inbox/:id/stream', (req, res) => {
  const inbox = db.prepare('SELECT * FROM inboxes WHERE id = ?').get(req.params.id);
  if (!inbox) return res.status(404).json({ error: 'Inbox not found' });

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no'
  });

  res.write('data: {"type":"connected"}\n\n');

  let lastCount = inbox.message_count;

  const interval = setInterval(async () => {
    try {
      const result = await providerManager.refreshMessages(inbox.id);
      const currentInbox = db.prepare('SELECT message_count FROM inboxes WHERE id = ?').get(inbox.id);
      const currentCount = currentInbox?.message_count || 0;

      if (currentCount > lastCount || result.new > 0) {
        const messages = db.prepare(`
          SELECT * FROM messages WHERE inbox_id = ? ORDER BY received_at DESC LIMIT ?
        `).all(inbox.id, Math.max(result.new, 1));

        res.write(`data: ${JSON.stringify({
          type: 'new_messages',
          count: result.new,
          total: currentCount,
          messages: messages.map(m => ({
            id: m.id,
            from: { address: m.from_address, name: m.from_name },
            subject: m.subject,
            intro: m.body_text?.slice(0, 200) || '',
            otpCode: m.otp_code,
            receivedAt: m.received_at
          }))
        })}\n\n`);

        lastCount = currentCount;
      } else {
        res.write(`data: ${JSON.stringify({ type: 'heartbeat', timestamp: new Date().toISOString() })}\n\n`);
      }
    } catch (e) {
      res.write(`data: ${JSON.stringify({ type: 'error', message: e.message })}\n\n`);
    }
  }, 1000); // Check every 1 second

  req.on('close', () => {
    clearInterval(interval);
  });
});

module.exports = router;
