/**
 * XyronMail - Provider Manager (Plugin Registry)
 * Manages all email providers, performs health checks, domain syncing,
 * intelligent failover, traffic balancing, and caching.
 */
const { db } = require('../db');
const { v4: uuidv4 } = require('uuid');

// Dynamic provider loading - load ALL provider files
const fs = require('fs');
const path = require('path');

const PROVIDER_FILES = {};
const providerDir = path.join(__dirname);
const skipFiles = ['manager.js'];

fs.readdirSync(providerDir)
  .filter(f => f.endsWith('.js') && !skipFiles.includes(f))
  .forEach(f => {
    const name = f.replace('.js', '');
    try {
      PROVIDER_FILES[name] = require(`./${name}`);
    } catch (e) {
      console.error(`[ProviderManager] Failed to load provider ${name}: ${e.message}`);
    }
  });

class ProviderManager {
  constructor() {
    this.providers = new Map();
    this.domainCache = new Map();
    this.healthCheckInterval = null;
    this.domainSyncInterval = null;
    this._initialized = false;
  }

  /**
   * Initialize all registered providers
   */
  async initialize() {
    if (this._initialized) return;

    // Register ALL providers dynamically
    for (const [name, Provider] of Object.entries(PROVIDER_FILES)) {
      try {
        this.registerProvider(name, new Provider());
      } catch (e) {
        console.error(`[ProviderManager] Failed to instantiate ${name}: ${e.message}`);
      }
    }

    // Initial domain sync
    await this.syncAllDomains();

    // Initial health check
    await this.checkAllHealth();

    this._initialized = true;
    console.log('[ProviderManager] Initialized with providers:', [...this.providers.keys()].join(', '));
  }

  /**
   * Register a provider plugin
   */
  registerProvider(name, instance) {
    this.providers.set(name, instance);
  }

  /**
   * Get a provider by name
   */
  getProvider(name) {
    return this.providers.get(name);
  }

  /**
   * Get all active providers sorted by priority
   */
  getActiveProviders() {
    const providerRows = db.prepare(`
      SELECT * FROM providers WHERE status = 'active' ORDER BY priority ASC
    `).all();

    return providerRows.map(row => ({
      ...row,
      instance: this.providers.get(row.name)
    })).filter(p => p.instance);
  }

  /**
   * Select best provider using weighted random selection
   */
  selectProvider(preferredProvider = null) {
    if (preferredProvider) {
      const prov = this.providers.get(preferredProvider);
      const provRow = db.prepare('SELECT * FROM providers WHERE name = ? AND status = ?').get(preferredProvider, 'active');
      if (prov && provRow) {
        return { instance: prov, config: provRow };
      }
    }

    const active = this.getActiveProviders();
    if (active.length === 0) throw new Error('No active providers available');

    // Weighted random selection
    const totalWeight = active.reduce((sum, p) => sum + (p.weight || 100), 0);
    let random = Math.random() * totalWeight;

    for (const provider of active) {
      random -= (provider.weight || 100);
      if (random <= 0) {
        return { instance: provider.instance, config: provider };
      }
    }

    return { instance: active[0].instance, config: active[0] };
  }

  /**
   * Sync domains from all providers
   */
  async syncAllDomains() {
    const results = {};
    for (const [name, provider] of this.providers) {
      try {
        const domains = await provider.getDomains();
        const providerRow = db.prepare('SELECT id FROM providers WHERE name = ?').get(name);
        if (!providerRow) continue;

        const insertDomain = db.prepare(`
          INSERT OR REPLACE INTO domains (id, provider_id, domain, status)
          VALUES (?, ?, ?, 'active')
        `);

        const insertMany = db.transaction(() => {
          for (const d of domains) {
            if (d.domain && d.isActive !== false) {
              insertDomain.run(
                `dom_${name}_${d.domain.replace(/\./g, '_')}`,
                providerRow.id,
                d.domain
              );
            }
          }
        });
        insertMany();

        // Update sync timestamp
        db.prepare("UPDATE providers SET domains_synced_at = datetime('now') WHERE name = ?").run(name);

        results[name] = { success: true, count: domains.length };
        console.log(`[ProviderManager] Synced ${domains.length} domains from ${name}`);
      } catch (err) {
        results[name] = { success: false, error: err.message };
        console.error(`[ProviderManager] Domain sync error for ${name}: ${err.message}`);
      }
    }
    this._domainsCacheArray = null;
    return results;
  }

  /**
   * Check health of all providers
   */
  async checkAllHealth() {
    const results = {};
    for (const [name, provider] of this.providers) {
      try {
        const health = await provider.healthCheck();
        const status = health.healthy ? 'healthy' : (health.status || 'error');

        db.prepare(`
          UPDATE providers
          SET health_status = ?, health_checked_at = datetime('now'),
              avg_response_ms = ?, status = ?
          WHERE name = ?
        `).run(
          status,
          health.latency || 0,
          health.healthy ? 'active' : 'degraded',
          name
        );

        results[name] = health;
      } catch (err) {
        db.prepare(`
          UPDATE providers
          SET health_status = 'error', health_checked_at = datetime('now'),
              status = 'error'
          WHERE name = ?
        `).run(name);
        results[name] = { healthy: false, error: err.message };
      }
    }
    this._domainsCacheArray = null;
    return results;
  }

  /**
   * Get all domains across all providers
   */
  getAllDomains() {
    if (this._domainsCacheArray) {
      return this._domainsCacheArray;
    }
    const domains = db.prepare(`
      SELECT d.*, p.name as provider_name, p.display_name as provider_display_name
      FROM domains d
      JOIN providers p ON d.provider_id = p.id
      WHERE d.status = 'active' AND p.status != 'error'
      ORDER BY p.priority ASC, d.domain ASC
    `).all();
    this._domainsCacheArray = domains;
    return domains;
  }

  /**
   * Get provider for a specific domain
   */
  getProviderForDomain(domain) {
    const row = db.prepare(`
      SELECT p.name, p.id
      FROM domains d
      JOIN providers p ON d.provider_id = p.id
      WHERE d.domain = ? AND d.status = 'active'
    `).get(domain);

    if (!row) return null;
    return {
      instance: this.providers.get(row.name),
      config: db.prepare('SELECT * FROM providers WHERE id = ?').get(row.id)
    };
  }

  /**
   * Create a temporary inbox with failover
   */
  async createInbox(preferredDomain = null, sessionId = null, userId = null) {
    let provider, providerConfig;

    if (preferredDomain) {
      const prov = this.getProviderForDomain(preferredDomain);
      if (prov) {
        provider = prov.instance;
        providerConfig = prov.config;
      }
    }

    if (!provider) {
      const selected = this.selectProvider();
      provider = selected.instance;
      providerConfig = selected.config;
    }

    // Calculate expiration before try/catch so it's available in failover
    const ttlSetting = db.prepare("SELECT value FROM settings WHERE key = 'inbox_ttl_minutes'").get();
    const ttlMinutes = parseInt(ttlSetting?.value || '60', 10);
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString();

    // Get a random domain from this provider
    let domain = preferredDomain;
    if (!domain) {
      const domains = db.prepare(`
        SELECT domain FROM domains
        WHERE provider_id = ? AND status = 'active'
        ORDER BY RANDOM() LIMIT 1
      `).get(providerConfig.id);

      if (!domains) {
        // Try any available domain from any active provider
        const anyDomain = db.prepare(`
          SELECT d.domain, p.name as provider_name, p.id as provider_id
          FROM domains d JOIN providers p ON d.provider_id = p.id
          WHERE d.status = 'active' AND p.status IN ('active','degraded')
          ORDER BY p.priority ASC, RANDOM() LIMIT 1
        `).get();
        if (!anyDomain) throw new Error('No domains available');
        domain = anyDomain.domain;
        const altProv = this.providers.get(anyDomain.provider_name);
        if (altProv) {
          provider = altProv;
          providerConfig = db.prepare('SELECT * FROM providers WHERE id = ?').get(anyDomain.provider_id);
        }
      } else {
        domain = domains.domain;
      }
    }

    // Generate random username
    const username = this._generateUsername();
    const address = `${username}@${domain}`;
    const password = uuidv4().replace(/-/g, '').slice(0, 16);

    try {
      const account = await provider.createAccount(address, password);
      let token = null;
      try {
        token = await provider.getToken(account.address || address, password);
      } catch (e) {
        token = account.sidToken || account.id;
      }
      const inboxId = `inbox_${uuidv4().replace(/-/g, '').slice(0, 12)}`;

      db.prepare(`
        INSERT INTO inboxes (id, user_session_id, user_id, provider_id, email_address, domain, password_hash, provider_token, provider_account_id, expires_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        inboxId,
        sessionId,
        userId,
        providerConfig.id,
        account.address || address,
        domain,
        password,
        token,
        account.id || account.sidToken,
        expiresAt
      );

      // Update provider request count
      db.prepare('UPDATE providers SET request_count = request_count + 1 WHERE id = ?').run(providerConfig.id);

      return {
        id: inboxId,
        emailAddress: account.address || address,
        domain: domain,
        provider: 'XyronMail Network',
        providerName: 'domainpool',
        expiresAt: expiresAt,
        token: token,
        createdAt: new Date().toISOString()
      };
    } catch (err) {
      // Failover to next provider
      console.error(`[ProviderManager] Create failed on ${providerConfig.name}, attempting failover: ${err.message}`);
      db.prepare('UPDATE providers SET error_count = error_count + 1 WHERE id = ?').run(providerConfig.id);

      const otherProviders = this.getActiveProviders().filter(p => p.name !== providerConfig.name);
      for (const other of otherProviders) {
        try {
          const otherDomains = db.prepare('SELECT domain FROM domains WHERE provider_id = ? AND status = ? ORDER BY RANDOM() LIMIT 1').get(other.id, 'active');
          if (!otherDomains) continue;

          const altUsername = this._generateUsername();
          const altAddress = `${altUsername}@${otherDomains.domain}`;
          const altPassword = uuidv4().replace(/-/g, '').slice(0, 16);

          const altAccount = await other.instance.createAccount(altAddress, altPassword);
          let altToken = null;
          try {
            altToken = await other.instance.getToken(altAccount.address || altAddress, altPassword);
          } catch (e) {
            altToken = altAccount.sidToken || altAccount.id;
          }

          const altInboxId = `inbox_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
          const altExpires = expiresAt;

          db.prepare(`
            INSERT INTO inboxes (id, user_session_id, user_id, provider_id, email_address, domain, password_hash, provider_token, provider_account_id, expires_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(altInboxId, sessionId, userId, other.id, altAccount.address || altAddress, otherDomains.domain, altPassword, altToken, altAccount.id || altAccount.sidToken, altExpires);

          db.prepare('UPDATE providers SET request_count = request_count + 1 WHERE id = ?').run(other.id);

          return {
            id: altInboxId,
            emailAddress: altAccount.address || altAddress,
            domain: otherDomains.domain,
            provider: 'XyronMail Network',
            providerName: 'domainpool',
            expiresAt: altExpires,
            token: altToken,
            createdAt: new Date().toISOString(),
            failover: true
          };
        } catch (failoverErr) {
          console.error(`[ProviderManager] Failover to ${other.name} also failed: ${failoverErr.message}`);
          db.prepare('UPDATE providers SET error_count = error_count + 1 WHERE id = ?').run(other.id);
        }
      }

      throw new Error('All providers failed to create inbox');
    }
  }

  /**
   * Refresh messages for an inbox
   */
  async refreshMessages(inboxId) {
    const inbox = db.prepare('SELECT * FROM inboxes WHERE id = ?').get(inboxId);
    if (!inbox) throw new Error('Inbox not found');

    const providerRow = db.prepare('SELECT * FROM providers WHERE id = ?').get(inbox.provider_id);
    if (!providerRow) throw new Error('Provider not found');

    const provider = this.providers.get(providerRow.name);
    if (!provider) throw new Error('Provider instance not found');

    const messages = await provider.getMessages(inbox.provider_token);

    const insertMsg = db.prepare(`
      INSERT OR IGNORE INTO messages
        (id, inbox_id, provider_message_id, from_address, from_name, to_address, subject, body_text, body_html, is_read, has_attachments, size_bytes, received_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const newMessages = [];
    const insertAll = db.transaction(() => {
      for (const msg of messages) {
        const msgId = `msg_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
        const existing = db.prepare('SELECT id FROM messages WHERE inbox_id = ? AND provider_message_id = ?').get(inboxId, msg.id);
        if (existing) continue;

        insertMsg.run(
          msgId,
          inboxId,
          msg.id,
          msg.from?.address || '',
          msg.from?.name || '',
          inbox.email_address,
          msg.subject,
          msg.bodyText || msg.intro || '',
          msg.bodyHtml || '',
          msg.isRead ? 1 : 0,
          msg.hasAttachments ? 1 : 0,
          msg.size || 0,
          msg.receivedAt
        );

        newMessages.push({
          id: msgId,
          ...msg
        });
      }
    });
    insertAll();

    // Update inbox
    db.prepare("UPDATE inboxes SET message_count = ?, last_checked_at = datetime('now') WHERE id = ?")
      .run(messages.length, inboxId);

    // Fire webhooks for new messages
    if (newMessages.length > 0) {
      this._fireWebhooks(inboxId, newMessages).catch(err =>
        console.error('[ProviderManager] Webhook error:', err.message)
      );
    }

    return { total: messages.length, new: newMessages.length, messages: newMessages };
  }

  /**
   * Get full message content
   */
  async getFullMessage(inboxId, messageId) {
    const inbox = db.prepare('SELECT * FROM inboxes WHERE id = ?').get(inboxId);
    if (!inbox) throw new Error('Inbox not found');

    const msg = db.prepare('SELECT * FROM messages WHERE id = ? AND inbox_id = ?').get(messageId, inboxId);
    console.log('[DEBUG] getFullMessage result:', msg);
    if (!msg) throw new Error('Message not found');

    const providerRow = db.prepare('SELECT * FROM providers WHERE id = ?').get(inbox.provider_id);
    const provider = this.providers.get(providerRow.name);

    // If we already have the body, return from DB
    if (msg.body_html && msg.body_html.length > 0) {
      // Extract OTP and links
      const otp = this._extractOTP(msg.body_text || msg.body_html);
      const links = this._extractVerificationLinks(msg.body_html || msg.body_text);

      // Update OTP and links in DB
      if (otp || links.length > 0) {
        db.prepare('UPDATE messages SET otp_code = ?, verification_links = ? WHERE id = ?')
          .run(otp, JSON.stringify(links), messageId);
      }

      return {
        ...msg,
        otp_code: otp,
        verification_links: links
      };
    }

    // Fetch from provider
    try {
      const fullMsg = await provider.getMessage(inbox.provider_token, msg.provider_message_id);
      const otp = this._extractOTP(fullMsg.bodyText || fullMsg.bodyHtml);
      const links = this._extractVerificationLinks(fullMsg.bodyHtml || fullMsg.bodyText);

      db.prepare(`
        UPDATE messages SET body_text = ?, body_html = ?, is_read = 1, otp_code = ?, verification_links = ?
        WHERE id = ?
      `).run(
        fullMsg.bodyText || '',
        fullMsg.bodyHtml || '',
        otp,
        JSON.stringify(links),
        messageId
      );

      return {
        ...msg,
        body_text: fullMsg.bodyText || '',
        body_html: fullMsg.bodyHtml || '',
        otp_code: otp,
        verification_links: links,
        attachments: fullMsg.attachments || []
      };
    } catch (err) {
      console.error(`[ProviderManager] getFullMessage error: ${err.message}`);
      return msg;
    }
  }

  /**
   * Extract OTP codes from email content
   */
  _extractOTP(text) {
    if (!text) return null;
    const cleanText = text.replace(/<[^>]+>/g, ' ');

    // Common OTP patterns
    const patterns = [
      /\b(?:verification|verify|otp|code|pin|passcode|one.?time)\s*(?:is|to\s+be|has\s+been)?\s*[:\s]*["\s]*(\d{4,8})\b/i,
      /\b(\d{4,8})\s*(?:is your|is the|verification|otp|code|pin)\b/i,
      /(?:enter|use|type)\s+(?:the\s+)?(?:code|otp|pin)?\s*(?:is|to\s+be)?\s*[:\s]*["\s]*(\d{4,8})\b/i,
      /\b(?:code|otp|pin|token)\s*(?:is|to\s+be)?\s*[:\s]*["\s]*(\d{4,8})["\s]*/i,
      /(?:^|\s)(\d{4,8})(?:\b|[\s.,!?]|$)/m, // Standalone 4 to 8 digit code with punctuation boundary
    ];

    for (const pattern of patterns) {
      const match = cleanText.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  }

  /**
   * Extract verification/confirmation links
   */
  _extractVerificationLinks(html) {
    if (!html) return [];
    const links = [];
    const linkRegex = /href=["']([^"']+)["']/gi;
    const keywords = ['verify', 'confirm', 'activate', 'validate', 'click', 'reset', 'unsubscribe'];
    let match;

    while ((match = linkRegex.exec(html)) !== null) {
      const url = match[1];
      if (url.startsWith('mailto:') || url.startsWith('#')) continue;
      const lower = url.toLowerCase();
      if (keywords.some(kw => lower.includes(kw))) {
        links.push(url);
      }
    }

    // Also check for links near verification text
    const textLinks = html.match(/https?:\/\/[^\s"'<>]+/g) || [];
    for (const url of textLinks) {
      const lower = url.toLowerCase();
      if (keywords.some(kw => lower.includes(kw)) && !links.includes(url)) {
        links.push(url);
      }
    }

    return [...new Set(links)].slice(0, 10);
  }

  /**
   * Fire webhooks when new messages arrive
   */
  async _fireWebhooks(inboxId, newMessages) {
    const inbox = db.prepare('SELECT * FROM inboxes WHERE id = ?').get(inboxId);
    if (!inbox) return;

    const webhooks = db.prepare(`
      SELECT w.* FROM webhooks w
      JOIN users u ON w.user_id = u.id
      WHERE w.status = 'active' AND (w.user_id = ? OR ? IS NOT NULL)
    `).all(inbox.user_id, inbox.user_id);

    // Also fire for inbox owner and all active webhooks listening to message.received
    const allWebhooks = db.prepare("SELECT * FROM webhooks WHERE status = 'active'").all();

    for (const wh of allWebhooks) {
      const events = JSON.parse(wh.events || '[]');
      if (!events.includes('message.received')) continue;

      const payload = {
        event: 'message.received',
        inboxId,
        emailAddress: inbox.email_address,
        messages: newMessages.map(m => ({
          id: m.id,
          from: m.from,
          subject: m.subject,
          receivedAt: m.receivedAt
        })),
        timestamp: new Date().toISOString()
      };

      try {
        const res = await fetch(wh.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Secret': wh.secret,
            'X-XyronMail-Event': 'message.received'
          },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(10000)
        });

        if (res.ok) {
          db.prepare("UPDATE webhooks SET last_triggered_at = datetime('now'), failure_count = 0 WHERE id = ?").run(wh.id);
        } else {
          db.prepare('UPDATE webhooks SET failure_count = failure_count + 1 WHERE id = ?').run(wh.id);
        }
      } catch (err) {
        db.prepare('UPDATE webhooks SET failure_count = failure_count + 1 WHERE id = ?').run(wh.id);
      }
    }
  }

  /**
   * Get provider stats for public display
   */
  getProviderStats() {
    return db.prepare(`
      SELECT p.name, p.display_name, p.status, p.health_status, p.avg_response_ms,
             p.request_count, p.error_count, COUNT(d.id) as domain_count
      FROM providers p
      LEFT JOIN domains d ON d.provider_id = p.id AND d.status = 'active'
      GROUP BY p.id
      ORDER BY p.priority ASC
    `).all();
  }

  /**
   * Generate a random username
   */
  _generateUsername() {
    const adjectives = ['swift','cool','fast','dark','wild','free','pure','bold','calm','keen'];
    const nouns = ['hawk','wolf','bear','fox','lion','star','moon','fire','wind','wave'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `${adj}${noun}${num}`;
  }

  /**
   * Start periodic background jobs
   */
  startBackgroundJobs() {
    // Health check every 60 seconds
    this.healthCheckInterval = setInterval(() => {
      this.checkAllHealth().catch(err =>
        console.error('[ProviderManager] Health check error:', err.message)
      );
    }, 60000);

    // Domain sync every 5 minutes
    this.domainSyncInterval = setInterval(() => {
      this.syncAllDomains().catch(err =>
        console.error('[ProviderManager] Domain sync error:', err.message)
      );
    }, 300000);

    console.log('[ProviderManager] Background jobs started');
  }

  /**
   * Stop background jobs
   */
  stopBackgroundJobs() {
    if (this.healthCheckInterval) clearInterval(this.healthCheckInterval);
    if (this.domainSyncInterval) clearInterval(this.domainSyncInterval);
  }
}

// Singleton
const providerManager = new ProviderManager();
module.exports = providerManager;
