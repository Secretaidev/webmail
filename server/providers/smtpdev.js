/**
 * XyronMail - SMTP.dev Provider Plugin
 * Mail.tm-compatible API at https://api.smtp.dev
 */
const BASE = 'https://api.smtp.dev';

class SmtpDevProvider {
  constructor() {
    this.name = 'smtpdev';
    this.displayName = 'SMTP.dev';
    this.baseUrl = BASE;
    this.cachedDomains = [];
  }

  async getDomains() {
    try {
      const r = await fetch(`${BASE}/domains`, { headers: { Accept: 'application/json' } });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      const domains = data['hydra:member'] || data || [];
      this.cachedDomains = domains.map(d => ({
        id: d.id,
        domain: d.domain,
        isActive: d.isActive !== false,
        isPrivate: d.isPrivate || false
      }));
      return this.cachedDomains;
    } catch (e) {
      console.error(`[SMTP.dev] getDomains: ${e.message}`);
      return this.cachedDomains;
    }
  }

  async createAccount(address, password) {
    const r = await fetch(`${BASE}/accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, password })
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      throw new Error(err['hydra:description'] || err.message || `HTTP ${r.status}`);
    }
    const data = await r.json();
    return { id: data.id, address: data.address, createdAt: data.createdAt };
  }

  async getToken(address, password) {
    const r = await fetch(`${BASE}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, password })
    });
    if (!r.ok) throw new Error(`Auth failed: HTTP ${r.status}`);
    return (await r.json()).token;
  }

  async getMessages(token) {
    try {
      const r = await fetch(`${BASE}/messages`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      return (data['hydra:member'] || data || []).map(m => this._normalize(m));
    } catch (e) {
      console.error(`[SMTP.dev] getMessages: ${e.message}`);
      return [];
    }
  }

  async getMessage(token, messageId) {
    const r = await fetch(`${BASE}/messages/${messageId}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return this._normalize(await r.json(), true);
  }

  async healthCheck() {
    const s = Date.now();
    try {
      const r = await fetch(`${BASE}/domains`, { signal: AbortSignal.timeout(5000) });
      return { healthy: r.ok, latency: Date.now() - s, status: r.ok ? 'healthy' : 'degraded' };
    } catch (e) {
      return { healthy: false, latency: Date.now() - s, status: 'error', error: e.message };
    }
  }

  _normalize(msg, full = false) {
    const n = {
      id: msg.id,
      providerMessageId: msg.id,
      from: { address: msg.from?.address || '', name: msg.from?.name || '' },
      to: Array.isArray(msg.to) ? msg.to.map(t => ({ address: t.address || '', name: t.name || '' })) : [],
      subject: msg.subject || '(no subject)',
      intro: msg.intro || '',
      isRead: msg.seen || false,
      hasAttachments: msg.hasAttachments || false,
      size: msg.size || 0,
      receivedAt: msg.createdAt || new Date().toISOString()
    };
    if (full) {
      n.bodyText = msg.text || '';
      n.bodyHtml = msg.html ? (Array.isArray(msg.html) ? msg.html.join('') : msg.html) : '';
    }
    return n;
  }
}

module.exports = SmtpDevProvider;
