/**
 * XyronMail - MyTemp.email Provider
 * Similar to 1secmail-style free API
 */
const BASE = 'https://api.mytemp.email/';

class MyTempProvider {
  constructor() {
    this.name = 'mytemp';
    this.displayName = 'MyTemp.email';
    this.cachedDomains = [];
  }

  async getDomains() {
    try {
      const r = await fetch(`${BASE}?action=getDomainList`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const domains = await r.json();
      this.cachedDomains = (Array.isArray(domains) ? domains : []).map((d, i) => ({
        id: `mt_${i}`, domain: d, isActive: true, isPrivate: false
      }));
      return this.cachedDomains;
    } catch (e) {
      console.error(`[MyTemp] getDomains: ${e.message}`);
      this.cachedDomains = ['mytemp.email', 'tmpmail.net', 'tmpmail.org'].map((d, i) => ({
        id: `mt_${i}`, domain: d, isActive: true, isPrivate: false
      }));
      return this.cachedDomains;
    }
  }

  async createAccount(address) {
    const parts = address ? address.split('@') : [];
    const login = parts[0] || this._randomLogin();
    const domain = parts[1] || 'mytemp.email';
    return { id: `${login}@${domain}`, address: `${login}@${domain}`, createdAt: new Date().toISOString() };
  }

  async getToken(address) { return address; }

  async getMessages(token) {
    try {
      const [login, domain] = token.split('@');
      const r = await fetch(`${BASE}?action=getMessages&login=${encodeURIComponent(login)}&domain=${encodeURIComponent(domain)}`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return (await r.json()).map(m => this._normalize(m, login, domain));
    } catch (e) {
      console.error(`[MyTemp] getMessages: ${e.message}`);
      return [];
    }
  }

  async getMessage(token, msgId) {
    const [login, domain] = token.split('@');
    const r = await fetch(`${BASE}?action=readMessage&login=${encodeURIComponent(login)}&domain=${encodeURIComponent(domain)}&id=${msgId}`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return this._normalize(await r.json(), login, domain, true);
  }

  async healthCheck() {
    const s = Date.now();
    try {
      const r = await fetch(`${BASE}?action=getDomainList`, { signal: AbortSignal.timeout(5000) });
      return { healthy: r.ok, latency: Date.now() - s, status: r.ok ? 'healthy' : 'degraded' };
    } catch (e) {
      return { healthy: false, latency: Date.now() - s, status: 'error', error: e.message };
    }
  }

  _normalize(m, login, domain, full = false) {
    const n = {
      id: String(m.id), providerMessageId: String(m.id),
      from: { address: m.from || '', name: m.from || '' },
      to: [{ address: `${login}@${domain}`, name: '' }],
      subject: m.subject || '(no subject)',
      intro: m.textBody ? m.textBody.slice(0, 200) : '',
      isRead: false, hasAttachments: !!(m.attachments?.length), size: 0,
      receivedAt: m.date ? new Date(m.date).toISOString() : new Date().toISOString()
    };
    if (full) { n.bodyText = m.textBody || ''; n.bodyHtml = m.htmlBody || m.body || ''; }
    return n;
  }

  _randomLogin() {
    const c = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let s = '';
    for (let i = 0; i < 10; i++) s += c[Math.floor(Math.random() * c.length)];
    return s;
  }
}

module.exports = MyTempProvider;
