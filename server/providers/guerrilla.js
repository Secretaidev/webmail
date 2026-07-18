/**
 * XyronMail - Guerrilla Mail Provider Plugin
 * Integrates with the Guerrilla Mail API for temporary email functionality.
 * API Docs: https://www.guerrillamail.com/GuerrillaMailAPI.html
 */

const BASE_URL = 'https://api.guerrillamail.com/ajax.php';

class GuerrillaProvider {
  constructor() {
    this.name = 'guerrilla';
    this.displayName = 'Guerrilla Mail';
    this.baseUrl = BASE_URL;
    this.cachedDomains = [];
    this.lastDomainSync = null;
  }

  /**
   * Make API request to Guerrilla Mail
   */
  async _request(params, sidToken = null) {
    const url = new URL(this.baseUrl);
    for (const [key, val] of Object.entries(params)) {
      url.searchParams.set(key, val);
    }
    if (sidToken) {
      url.searchParams.set('sid_token', sidToken);
    }
    url.searchParams.set('ip', '127.0.0.1');
    url.searchParams.set('agent', 'XyronMail');

    const res = await fetch(url.toString(), {
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  /**
   * Get available domains - Guerrilla Mail has fixed domains
   */
  async getDomains() {
    try {
      // Guerrilla Mail provides domains through get_email_address
      const data = await this._request({ f: 'get_email_address' });
      
      // Known Guerrilla Mail domains
      const knownDomains = [
        'guerrillamail.com',
        'guerrillamail.de',
        'guerrillamail.net',
        'guerrillamail.org',
        'guerrillamailblock.com',
        'grr.la',
        'guerrillamail.info',
        'spam4.me',
        'sharklasers.com',
        'guerrillamailblock.com'
      ];

      this.cachedDomains = [...new Set(knownDomains)].map((domain, i) => ({
        id: `gm_${i}`,
        domain: domain,
        isActive: true,
        isPrivate: false,
      }));

      this.lastDomainSync = new Date().toISOString();
      this.lastSidToken = data.sid_token;
      return this.cachedDomains;
    } catch (err) {
      console.error(`[Guerrilla] getDomains error: ${err.message}`);
      return this.cachedDomains;
    }
  }

  /**
   * Create/get a random email address
   */
  async createAccount(address = null, password = null) {
    try {
      let data;
      if (address) {
        // Set specific user
        const parts = address.split('@');
        data = await this._request({
          f: 'set_email_user',
          email_user: parts[0],
          lang: 'en'
        });
      } else {
        data = await this._request({ f: 'get_email_address', lang: 'en' });
      }

      return {
        id: data.sid_token,
        address: data.email_addr,
        sidToken: data.sid_token,
        alias: data.alias,
        createdAt: new Date().toISOString()
      };
    } catch (err) {
      console.error(`[Guerrilla] createAccount error: ${err.message}`);
      throw err;
    }
  }

  /**
   * Get token (returns sid_token)
   */
  async getToken(address, password) {
    // Guerrilla uses session tokens not JWT
    try {
      const parts = address.split('@');
      const data = await this._request({
        f: 'set_email_user',
        email_user: parts[0],
        lang: 'en'
      });
      return data.sid_token;
    } catch (err) {
      console.error(`[Guerrilla] getToken error: ${err.message}`);
      throw err;
    }
  }

  /**
   * Check for new emails
   */
  async getMessages(sidToken, seq = 0) {
    try {
      const data = await this._request({
        f: 'check_email',
        seq: seq.toString()
      }, sidToken);

      const messages = data.list || [];
      return messages.map(m => this._normalizeMessage(m));
    } catch (err) {
      console.error(`[Guerrilla] getMessages error: ${err.message}`);
      return [];
    }
  }

  /**
   * Fetch a single email by ID
   */
  async getMessage(sidToken, mailId) {
    try {
      const data = await this._request({
        f: 'fetch_email',
        email_id: mailId
      }, sidToken);

      return this._normalizeMessage(data, true);
    } catch (err) {
      console.error(`[Guerrilla] getMessage error: ${err.message}`);
      throw err;
    }
  }

  /**
   * Delete email(s)
   */
  async deleteMessage(sidToken, mailIds) {
    try {
      const ids = Array.isArray(mailIds) ? mailIds : [mailIds];
      await this._request({
        f: 'del_email',
        email_ids: JSON.stringify(ids)
      }, sidToken);
      return true;
    } catch (err) {
      console.error(`[Guerrilla] deleteMessage error: ${err.message}`);
      return false;
    }
  }

  /**
   * Mark as read (Guerrilla doesn't have a specific endpoint)
   */
  async markAsRead(sidToken, mailId) {
    // Guerrilla marks as read when fetched
    return true;
  }

  /**
   * Delete account (forget session)
   */
  async deleteAccount(sidToken) {
    try {
      await this._request({ f: 'forget_me' }, sidToken);
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    const start = Date.now();
    try {
      const res = await fetch(`${this.baseUrl}?f=get_email_address&ip=127.0.0.1&agent=XyronMail`, {
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
   * Normalize message to common format
   */
  _normalizeMessage(msg, full = false) {
    const normalized = {
      id: msg.mail_id?.toString() || '',
      providerMessageId: msg.mail_id?.toString() || '',
      from: {
        address: msg.mail_from || '',
        name: msg.mail_from || ''
      },
      to: [{
        address: msg.mail_recipient || '',
        name: ''
      }],
      subject: msg.mail_subject || '(no subject)',
      intro: msg.mail_excerpt || '',
      isRead: msg.mail_read === '1',
      hasAttachments: false,
      size: parseInt(msg.mail_size || '0'),
      receivedAt: msg.mail_timestamp ? new Date(parseInt(msg.mail_timestamp) * 1000).toISOString() : new Date().toISOString(),
      attachments: []
    };

    if (full) {
      normalized.bodyText = msg.mail_body?.replace(/<[^>]+>/g, '') || '';
      normalized.bodyHtml = msg.mail_body || '';
      normalized.headers = {};
    }

    return normalized;
  }
}

module.exports = GuerrillaProvider;
