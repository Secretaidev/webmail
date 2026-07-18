/**
 * XyronMail - MailForSpam Provider Plugin
 */
const BASE = 'https://www.mailforspam.com';

class MailForSpamProvider {
  constructor() {
    this.name = 'mailforspam';
    this.displayName = 'MailForSpam';
    this.baseUrl = BASE;
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      'mailforspam.com', 'tempmail.io', 'disposable.email'
    ].map((d, i) => ({ id: `mfs_${i}`, domain: d, isActive: true, isPrivate: false }));
    return this.cachedDomains;
  }

  async createAccount(address) {
    const email = address || `${this._random()}@mailforspam.com`;
    return { id: email, address: email, createdAt: new Date().toISOString() };
  }

  async getToken(address) { return address; }

  async getMessages(token) {
    try {
      const r = await fetch(`${BASE}/api/mailboxes/${encodeURIComponent(token)}/emails`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      const msgs = Array.isArray(data) ? data : (data.emails || []);
      return msgs.map(m => this._normalize(m, token));
    } catch (e) {
      console.error(`[MailForSpam] getMessages: ${e.message}`);
      return [];
    }
  }

  async getMessage(token, msgId) {
    const r = await fetch(`${BASE}/api/mailboxes/${encodeURIComponent(token)}/emails/${msgId}`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return this._normalize(await r.json(), token, true);
  }

  async healthCheck() {
    const s = Date.now();
    try {
      const r = await fetch(`${BASE}/api/mailboxes/test@mailforspam.com/emails`, { signal: AbortSignal.timeout(5000) });
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
      intro: (m.body_text || m.preview || '').slice(0, 200),
      isRead: !!m.read, hasAttachments: false,
      size: 0,
      receivedAt: m.received_at || m.date || new Date().toISOString()
    };
    if (full) { n.bodyText = m.body_text || ''; n.bodyHtml = m.body_html || ''; }
    return n;
  }

  _random() {
    const c = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let s = ''; for (let i = 0; i < 10; i++) s += c[Math.floor(Math.random() * c.length)];
    return s;
  }
}

module.exports = MailForSpamProvider;
