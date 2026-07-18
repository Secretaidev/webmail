/**
 * XyronMail - Mail123.fr Provider Plugin
 */
const BASE = 'https://mail123.fr/api/v1';

class Mail123Provider {
  constructor() {
    this.name = 'mail123';
    this.displayName = 'Mail123';
    this.baseUrl = BASE;
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = ['mail123.fr', 'mail123.io'].map((d, i) => ({
      id: `m1_${i}`, domain: d, isActive: true, isPrivate: false
    }));
    return this.cachedDomains;
  }

  async createAccount(address) {
    if (address) return { id: address, address, createdAt: new Date().toISOString() };
    const r = await fetch(`${BASE}/mailbox/new`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    const email = data.address || data.email;
    return { id: email, address: email, createdAt: new Date().toISOString() };
  }

  async getToken(address) { return address; }

  async getMessages(token) {
    try {
      const r = await fetch(`${BASE}/mailbox/${encodeURIComponent(token)}/messages?limit=50`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      const msgs = Array.isArray(data) ? data : (data.messages || []);
      return msgs.map(m => this._normalize(m, token));
    } catch (e) {
      console.error(`[Mail123] getMessages: ${e.message}`);
      return [];
    }
  }

  async getMessage(token, msgId) {
    const r = await fetch(`${BASE}/mailbox/${encodeURIComponent(token)}/messages/${msgId}`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return this._normalize(await r.json(), token, true);
  }

  async healthCheck() {
    const s = Date.now();
    try {
      const r = await fetch(`${BASE}/mailbox/new`, { signal: AbortSignal.timeout(5000) });
      return { healthy: r.ok, latency: Date.now() - s, status: r.ok ? 'healthy' : 'degraded' };
    } catch (e) {
      return { healthy: false, latency: Date.now() - s, status: 'error', error: e.message };
    }
  }

  _normalize(m, email, full = false) {
    const n = {
      id: String(m.id || m.uid),
      providerMessageId: String(m.id || m.uid),
      from: { address: m.from || m.sender || '', name: m.from || '' },
      to: [{ address: email, name: '' }],
      subject: m.subject || '(no subject)',
      intro: (m.text || m.preview || '').slice(0, 200),
      isRead: !!m.read, hasAttachments: false,
      size: 0,
      receivedAt: m.date || m.received_at || new Date().toISOString()
    };
    if (full) { n.bodyText = m.text || ''; n.bodyHtml = m.html || ''; }
    return n;
  }
}

module.exports = Mail123Provider;
