/**
 * XyronMail - Mail.tm Provider Plugin
 * Integrates with the Mail.tm REST API for temporary email creation and message retrieval.
 * API Docs: https://docs.mail.tm
 */

const BASE_URL = 'https://api.mail.tm';

class MailTmProvider {
  constructor() {
    this.name = 'mailtm';
    this.displayName = 'Mail.tm';
    this.baseUrl = BASE_URL;
    this.cachedDomains = [];
    this.lastDomainSync = null;
  }

  /**
   * Fetch available domains from Mail.tm
   */
  async getDomains() {
    try {
      const res = await fetch(`${this.baseUrl}/domains`, {
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      // Mail.tm returns { 'hydra:member': [...] } or an array
      const domains = data['hydra:member'] || data || [];
      this.cachedDomains = domains.map(d => ({
        id: d.id,
        domain: d.domain,
        isActive: d.isActive !== false,
        isPrivate: d.isPrivate || false,
      }));
      this.lastDomainSync = new Date().toISOString();
      return this.cachedDomains;
    } catch (err) {
      console.error(`[MailTm] getDomains error: ${err.message}`);
      return this.cachedDomains; // Return cached on error
    }
  }

  /**
   * Create a new temporary email account
   */
  async createAccount(address, password) {
    try {
      const res = await fetch(`${this.baseUrl}/accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, password })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData['hydra:description'] || errData.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      return {
        id: data.id,
        address: data.address,
        createdAt: data.createdAt
      };
    } catch (err) {
      console.error(`[MailTm] createAccount error: ${err.message}`);
      throw err;
    }
  }

  /**
   * Authenticate and get JWT token
   */
  async getToken(address, password) {
    try {
      const res = await fetch(`${this.baseUrl}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, password })
      });
      if (!res.ok) throw new Error(`Auth failed: HTTP ${res.status}`);
      const data = await res.json();
      return data.token;
    } catch (err) {
      console.error(`[MailTm] getToken error: ${err.message}`);
      throw err;
    }
  }

  /**
   * Fetch messages for an account
   */
  async getMessages(token, page = 1) {
    try {
      const res = await fetch(`${this.baseUrl}/messages?page=${page}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const messages = data['hydra:member'] || data || [];
      return messages.map(m => this._normalizeMessage(m));
    } catch (err) {
      console.error(`[MailTm] getMessages error: ${err.message}`);
      return [];
    }
  }

  /**
   * Get a single message with full body
   */
  async getMessage(token, messageId) {
    try {
      const res = await fetch(`${this.baseUrl}/messages/${messageId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return this._normalizeMessage(data, true);
    } catch (err) {
      console.error(`[MailTm] getMessage error: ${err.message}`);
      throw err;
    }
  }

  /**
   * Delete a message
   */
  async deleteMessage(token, messageId) {
    try {
      const res = await fetch(`${this.baseUrl}/messages/${messageId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return res.ok || res.status === 204;
    } catch (err) {
      console.error(`[MailTm] deleteMessage error: ${err.message}`);
      return false;
    }
  }

  /**
   * Mark a message as read
   */
  async markAsRead(token, messageId) {
    try {
      const res = await fetch(`${this.baseUrl}/messages/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/merge-patch+json'
        },
        body: JSON.stringify({ seen: true })
      });
      return res.ok;
    } catch (err) {
      console.error(`[MailTm] markAsRead error: ${err.message}`);
      return false;
    }
  }

  /**
   * Delete an account
   */
  async deleteAccount(token, accountId) {
    try {
      const res = await fetch(`${this.baseUrl}/accounts/${accountId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return res.ok || res.status === 204;
    } catch (err) {
      console.error(`[MailTm] deleteAccount error: ${err.message}`);
      return false;
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    const start = Date.now();
    try {
      const res = await fetch(`${this.baseUrl}/domains`, {
        signal: AbortSignal.timeout(5000)
      });
      const latency = Date.now() - start;
      return {
        healthy: res.ok,
        latency,
        status: res.ok ? 'healthy' : 'degraded',
        statusCode: res.status
      };
    } catch (err) {
      return {
        healthy: false,
        latency: Date.now() - start,
        status: 'error',
        error: err.message
      };
    }
  }

  /**
   * Get SSE endpoint for real-time messages
   */
  getSSEUrl(token) {
    return `${this.baseUrl}/messages?token=${token}`;
  }

  /**
   * Normalize a message to common format
   */
  _normalizeMessage(msg, full = false) {
    const normalized = {
      id: msg.id || msg['@id'],
      providerMessageId: msg.id,
      from: {
        address: msg.from?.address || '',
        name: msg.from?.name || ''
      },
      to: Array.isArray(msg.to) ? msg.to.map(t => ({
        address: t.address || '',
        name: t.name || ''
      })) : [],
      subject: msg.subject || '(no subject)',
      intro: msg.intro || '',
      isRead: msg.seen || false,
      hasAttachments: (msg.hasAttachments || false) || (msg.attachments && msg.attachments.length > 0),
      size: msg.size || 0,
      receivedAt: msg.createdAt || new Date().toISOString(),
      attachments: (msg.attachments || []).map(a => ({
        id: a.id,
        filename: a.filename,
        contentType: a.contentType,
        size: a.size,
        downloadUrl: a.downloadUrl ? `${this.baseUrl}${a.downloadUrl}` : null
      }))
    };

    if (full) {
      normalized.bodyText = msg.text || '';
      normalized.bodyHtml = msg.html ? msg.html.join ? msg.html.join('') : msg.html : '';
      normalized.headers = msg.headers || {};
    }

    return normalized;
  }
}

module.exports = MailTmProvider;
