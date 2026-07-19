/**
 * TempOutlook - Temporary Outlook-style provider
 * Uses 1secMail API backend for reliable delivery
 * Domains: 1secmail.com, 1secmail.org, 1secmail.net
 */
const ONESEC_BASE = 'https://www.1secmail.com/api/v1/';

class TempOutlookProvider {
  constructor() {
    this.name = 'tempoutlook';
    this.displayName = 'TempOutlook';
    this.baseUrl = ONESEC_BASE;
    this.cachedDomains = [
      { id: 'to_0', domain: '1secmail.com', isActive: true, isPrivate: false },
      { id: 'to_1', domain: '1secmail.org', isActive: true, isPrivate: false },
      { id: 'to_2', domain: '1secmail.net', isActive: true, isPrivate: false },
      { id: 'to_3', domain: 'wwjmp.com', isActive: true, isPrivate: false },
      { id: 'to_4', domain: 'esiix.com', isActive: true, isPrivate: false },
      { id: 'to_5', domain: 'xojxe.com', isActive: true, isPrivate: false },
      { id: 'to_6', domain: 'yoggm.com', isActive: true, isPrivate: false },
    ];
  }

  async getDomains() { return this.cachedDomains; }

  async createAccount(address) {
    try {
      const r = await fetch(`${this.baseUrl}?action=genRandomMailbox&count=1`);
      const data = await r.json();
      const email = data[0] || (address || `${this._randomLogin()}@1secmail.com`);
      return { id: email, address: email, token: email, createdAt: new Date().toISOString() };
    } catch(e) {
      const parts = address ? address.split('@') : [];
      const login = parts[0] || this._randomLogin();
      const domain = parts[1] || '1secmail.com';
      const email = `${login}@${domain}`;
      return { id: email, address: email, token: email, createdAt: new Date().toISOString() };
    }
  }

  async getToken(address) { return address; }

  async getMessages(token) {
    try {
      const [login, domain] = token.split('@');
      const r = await fetch(`${this.baseUrl}?action=getMessages&login=${login}&domain=${domain}`);
      const data = await r.json();
      return (Array.isArray(data) ? data : []).map(m => ({
        id: String(m.id),
        from: { address: m.from || '', name: (m.from || '').split('@')[0] },
        subject: m.subject || '(no subject)',
        intro: '',
        isRead: false,
        receivedAt: m.date ? new Date(m.date).toISOString() : new Date().toISOString()
      }));
    } catch(e) { return []; }
  }

  async getMessage(token, msgId) {
    try {
      const [login, domain] = token.split('@');
      const r = await fetch(`${this.baseUrl}?action=readMessage&login=${login}&domain=${domain}&id=${msgId}`);
      const m = await r.json();
      return {
        id: String(m.id || msgId),
        from: { address: m.from || '', name: (m.from || '').split('@')[0] },
        subject: m.subject || '',
        bodyText: m.textBody || '',
        bodyHtml: m.htmlBody || m.textBody || '',
        receivedAt: m.date ? new Date(m.date).toISOString() : new Date().toISOString()
      };
    } catch(e) { return { id: msgId, from: { address: '' }, subject: '', bodyText: 'Failed to load', bodyHtml: '' }; }
  }

  async deleteMessage() { return true; }
  async markAsRead() { return true; }
  async deleteAccount() { return true; }

  async healthCheck() {
    const s = Date.now();
    try {
      const r = await fetch(`${this.baseUrl}?action=genRandomMailbox&count=1`, { signal: AbortSignal.timeout(5000) });
      return { healthy: r.ok, latency: Date.now() - s, status: r.ok ? 'healthy' : 'degraded' };
    } catch(e) { return { healthy: false, latency: Date.now() - s, status: 'error', error: e.message }; }
  }

  _randomLogin() {
    const c = 'abcdefghijklmnopqrstuvwxyz0123456789'; let s = '';
    for (let i = 0; i < 10; i++) s += c[Math.floor(Math.random() * c.length)];
    return s;
  }
}

module.exports = TempOutlookProvider;
