/**
 * XyronMail - DevMail.uk Provider Plugin
 */
const BASE = 'https://devmail.uk/api';

class DevMailProvider {
  constructor() {
    this.name = 'devmail';
    this.displayName = 'DevMail.uk';
    this.baseUrl = BASE;
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = ['devmail.uk', 'devmail.io'].map((d, i) => ({
      id: `dm_${i}`, domain: d, isActive: true, isPrivate: false
    }));
    return this.cachedDomains;
  }

  async createAccount(address) {
    if (address) {
      const mailbox = address.split('@')[0];
      return { id: mailbox, address, mailbox, createdAt: new Date().toISOString() };
    }
    const r = await fetch(`${BASE}/new`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    const email = data.email || data.address;
    const mailbox = data.mailbox || email.split('@')[0];
    return { id: mailbox, address: email, mailbox, createdAt: new Date().toISOString() };
  }

  async getToken(account) { return account; }

  async getMessages(token) {
    try {
      const mailbox = token.includes('@') ? token.split('@')[0] : token;
      const r = await fetch(`${BASE}/inbox/${encodeURIComponent(mailbox)}?detail=true`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      const msgs = Array.isArray(data) ? data : (data.emails || data.messages || []);
      return msgs.map(m => this._normalize(m, token));
    } catch (e) {
      console.error(`[DevMail] getMessages: ${e.message}`);
      return [];
    }
  }

  async getMessage(token, msgId) {
    const mailbox = token.includes('@') ? token.split('@')[0] : token;
    const r = await fetch(`${BASE}/inbox/${encodeURIComponent(mailbox)}/${msgId}`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return this._normalize(await r.json(), token, true);
  }

  async healthCheck() {
    const s = Date.now();
    try {
      const r = await fetch(`${BASE}/new`, { signal: AbortSignal.timeout(5000) });
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
      intro: (m.text || m.body || '').slice(0, 200),
      isRead: !!m.read, hasAttachments: false,
      size: 0,
      receivedAt: m.date || m.received_at || new Date().toISOString()
    };
    if (full) { n.bodyText = m.text || m.body_text || ''; n.bodyHtml = m.html || m.body_html || ''; }
    return n;
  }
}

module.exports = DevMailProvider;
