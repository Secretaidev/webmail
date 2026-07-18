/**
 * XyronMail - Internxt Mail Provider
 * Free temp mail at mail.internxt.com
 */
const BASE = 'https://mail.internxt.com/api';

class InternxtProvider {
  constructor() {
    this.name = 'internxt';
    this.displayName = 'Internxt Mail';
    this.cachedDomains = [];
  }

  async getDomains() {
    try {
      const r = await fetch(`${BASE}/domains`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      const domains = Array.isArray(data) ? data : (data.domains || []);
      this.cachedDomains = domains.map((d, i) => ({
        id: `ix_${i}`,
        domain: typeof d === 'string' ? d : d.domain || d.name,
        isActive: true,
        isPrivate: false
      }));
      return this.cachedDomains;
    } catch (e) {
      console.error(`[Internxt] getDomains: ${e.message}`);
      this.cachedDomains = ['guerrillamailblock.com', 'internxt.com'].map((d, i) => ({
        id: `ix_${i}`, domain: d, isActive: true, isPrivate: false
      }));
      return this.cachedDomains;
    }
  }

  async createAccount(address) {
    if (address) return { id: address, address, createdAt: new Date().toISOString() };
    const r = await fetch(`${BASE}/inbox/create`, { method: 'POST' });
    if (!r.ok) {
      const login = this._randomLogin();
      const email = `${login}@guerrillamailblock.com`;
      return { id: email, address: email, createdAt: new Date().toISOString() };
    }
    const data = await r.json();
    const email = data.email || data.address || data.inbox;
    return { id: email, address: email, createdAt: new Date().toISOString() };
  }

  async getToken(address) { return address; }

  async getMessages(token) {
    try {
      const r = await fetch(`${BASE}/inbox/${encodeURIComponent(token)}/messages`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      const msgs = Array.isArray(data) ? data : (data.messages || []);
      return msgs.map(m => this._normalize(m, token));
    } catch (e) {
      console.error(`[Internxt] getMessages: ${e.message}`);
      return [];
    }
  }

  async getMessage(token, msgId) {
    const r = await fetch(`${BASE}/inbox/${encodeURIComponent(token)}/messages/${encodeURIComponent(msgId)}`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return this._normalize(await r.json(), token, true);
  }

  async healthCheck() {
    const s = Date.now();
    try {
      const r = await fetch('https://mail.internxt.com/', { signal: AbortSignal.timeout(5000) });
      return { healthy: r.ok, latency: Date.now() - s, status: r.ok ? 'healthy' : 'degraded' };
    } catch (e) {
      return { healthy: false, latency: Date.now() - s, status: 'error', error: e.message };
    }
  }

  _normalize(m, email, full = false) {
    const n = {
      id: String(m.id || m._id || m.messageId),
      providerMessageId: String(m.id || m._id || m.messageId),
      from: { address: m.from || m.sender || '', name: m.fromName || m.from || '' },
      to: [{ address: email, name: '' }],
      subject: m.subject || '(no subject)',
      intro: (m.text || m.body || m.preview || '').slice(0, 200),
      isRead: !!m.read, hasAttachments: false, size: m.size || 0,
      receivedAt: m.date ? new Date(m.date).toISOString() : new Date().toISOString()
    };
    if (full) { n.bodyText = m.text || m.body_text || ''; n.bodyHtml = m.html || m.body_html || ''; }
    return n;
  }

  _randomLogin() {
    const c = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let s = '';
    for (let i = 0; i < 10; i++) s += c[Math.floor(Math.random() * c.length)];
    return s;
  }
}

module.exports = InternxtProvider;
