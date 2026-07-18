/**
 * XyronMail - Catchmail Provider Plugin
 * https://catchmail.io
 */
const BASE = 'https://catchmail.io/api/v1';

class CatchmailProvider {
  constructor() {
    this.name = 'catchmail';
    this.displayName = 'Catchmail';
    this.baseUrl = BASE;
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      'catchmail.io', 'mailistry.com', 'zeppost.com', 'tempmail.dev'
    ].map((d, i) => ({ id: `cm_${i}`, domain: d, isActive: true, isPrivate: false }));
    return this.cachedDomains;
  }

  async createAccount(address) {
    const email = address || `${this._random()}@catchmail.io`;
    return { id: email, address: email, createdAt: new Date().toISOString() };
  }

  async getToken(address) { return address; }

  async getMessages(token) {
    try {
      const r = await fetch(`${BASE}/mailbox?address=${encodeURIComponent(token)}`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      const msgs = Array.isArray(data) ? data : (data.messages || []);
      return msgs.map(m => this._normalize(m, token));
    } catch (e) {
      console.error(`[Catchmail] getMessages: ${e.message}`);
      return [];
    }
  }

  async getMessage(token, msgId) {
    const r = await fetch(`${BASE}/message/${msgId}?mailbox=${encodeURIComponent(token)}`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    const body = data.body || {};
    return this._normalize({ ...data, bodyText: body.text, bodyHtml: body.html }, token, true);
  }

  async healthCheck() {
    const s = Date.now();
    try {
      const r = await fetch(`${BASE}/mailbox?address=test@catchmail.io`, { signal: AbortSignal.timeout(5000) });
      return { healthy: r.ok, latency: Date.now() - s, status: r.ok ? 'healthy' : 'degraded' };
    } catch (e) {
      return { healthy: false, latency: Date.now() - s, status: 'error', error: e.message };
    }
  }

  _normalize(m, email, full = false) {
    const n = {
      id: String(m.id),
      providerMessageId: String(m.id),
      from: { address: m.from || m.sender || '', name: m.from || '' },
      to: [{ address: email, name: '' }],
      subject: m.subject || '(no subject)',
      intro: (m.bodyText || m.preview || '').slice(0, 200),
      isRead: !!m.read, hasAttachments: false,
      size: 0,
      receivedAt: m.receivedAt || m.created_at || new Date().toISOString()
    };
    if (full) { n.bodyText = m.bodyText || ''; n.bodyHtml = m.bodyHtml || ''; }
    return n;
  }

  _random() {
    const c = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let s = ''; for (let i = 0; i < 10; i++) s += c[Math.floor(Math.random() * c.length)];
    return s;
  }
}

module.exports = CatchmailProvider;
