/**
 * XyronMail - Inboxes.com Provider Plugin
 */
const BASE = 'https://inboxes.com/api/v2';

class InboxesProvider {
  constructor() {
    this.name = 'inboxes';
    this.displayName = 'Inboxes.com';
    this.baseUrl = BASE;
    this.cachedDomains = [];
  }

  async getDomains() {
    try {
      const r = await fetch(`${BASE}/domain`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      const domains = Array.isArray(data) ? data : (data.domains || []);
      this.cachedDomains = domains.map((d, i) => ({
        id: `ib_${i}`,
        domain: typeof d === 'string' ? d : (d.domain || d.name),
        isActive: true,
        isPrivate: false
      }));
      return this.cachedDomains;
    } catch (e) {
      console.error(`[Inboxes] getDomains: ${e.message}`);
      this.cachedDomains = ['inboxes.com', 'inboxkitten.com'].map((d, i) => ({
        id: `ib_${i}`, domain: d, isActive: true, isPrivate: false
      }));
      return this.cachedDomains;
    }
  }

  async createAccount(address) {
    const email = address || `${this._random()}@inboxes.com`;
    return { id: email, address: email, createdAt: new Date().toISOString() };
  }

  async getToken(address) { return address; }

  async getMessages(token) {
    try {
      const r = await fetch(`${BASE}/inbox/${encodeURIComponent(token)}`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      const msgs = Array.isArray(data) ? data : (data.inbox || data.messages || []);
      return msgs.map(m => this._normalize(m, token));
    } catch (e) {
      console.error(`[Inboxes] getMessages: ${e.message}`);
      return [];
    }
  }

  async getMessage(token, msgId) {
    const r = await fetch(`${BASE}/message/${encodeURIComponent(msgId)}`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return this._normalize(await r.json(), token, true);
  }

  async healthCheck() {
    const s = Date.now();
    try {
      const r = await fetch(`${BASE}/domain`, { signal: AbortSignal.timeout(5000) });
      return { healthy: r.ok, latency: Date.now() - s, status: r.ok ? 'healthy' : 'degraded' };
    } catch (e) {
      return { healthy: false, latency: Date.now() - s, status: 'error', error: e.message };
    }
  }

  _normalize(m, email, full = false) {
    const n = {
      id: String(m.uid || m.id),
      providerMessageId: String(m.uid || m.id),
      from: { address: m.f || m.from || '', name: m.f || m.from || '' },
      to: [{ address: email, name: '' }],
      subject: m.s || m.subject || '(no subject)',
      intro: (m.text || m.preview || '').slice(0, 200),
      isRead: !!m.seen, hasAttachments: false,
      size: 0,
      receivedAt: m.created_at || new Date().toISOString()
    };
    if (full) { n.bodyText = m.text || ''; n.bodyHtml = m.html || ''; }
    return n;
  }

  _random() {
    const c = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let s = ''; for (let i = 0; i < 10; i++) s += c[Math.floor(Math.random() * c.length)];
    return s;
  }
}

module.exports = InboxesProvider;
