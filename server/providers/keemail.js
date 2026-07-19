/**
 * KeeMail - KeeMail / KeePass style
 */
const BASE_URL = 'https://api.guerrillamail.com/ajax.php';

class KeeMailProvider {
  constructor() {
    this.name = 'keemail';
    this.displayName = 'KeeMail';
    this.baseUrl = BASE_URL;
    this.cachedDomains = [
      { id: 'km_0', domain: 'keemail.me', isActive: true, isPrivate: false },
      { id: 'km_1', domain: 'deyom.com', isActive: true, isPrivate: false },
      { id: 'km_2', domain: 'laste.ml', isActive: true, isPrivate: false },
    ];
  }

  async getDomains() { return this.cachedDomains; }

  async createAccount(address) {
    try {
      const parts = address ? address.split('@') : [];
      const login = parts[0] || this._randomLogin();
      const domain = parts[1] || this.cachedDomains[0].domain;
      const r = await fetch(`${this.baseUrl}?f=set_email_user&email_user=${encodeURIComponent(login)}&lang=en&site=${domain}`);
      const data = await r.json();
      return { id: data.email_addr || `${login}@${domain}`, address: data.email_addr || `${login}@${domain}`, token: data.sid_token, createdAt: new Date().toISOString() };
    } catch(e) {
      const parts = address ? address.split('@') : [];
      const login = parts[0] || this._randomLogin();
      const domain = parts[1] || this.cachedDomains[0].domain;
      return { id: `${login}@${domain}`, address: `${login}@${domain}`, createdAt: new Date().toISOString() };
    }
  }

  async getToken(address) { return address; }

  async getMessages(token) {
    try {
      const [login, domain] = token.split('@');
      const r = await fetch(`${this.baseUrl}?f=set_email_user&email_user=${encodeURIComponent(login)}&lang=en&site=${domain}`);
      const d = await r.json();
      const r2 = await fetch(`${this.baseUrl}?f=get_email_list&offset=0&sid_token=${d.sid_token}`);
      const d2 = await r2.json();
      return (d2.list || []).map(m => ({
        id: String(m.mail_id),
        from: { address: m.mail_from, name: (m.mail_from || '').split('@')[0] },
        subject: m.mail_subject || '(no subject)',
        intro: m.mail_excerpt || '',
        isRead: m.mail_read === '1',
        receivedAt: m.mail_timestamp ? new Date(parseInt(m.mail_timestamp) * 1000).toISOString() : new Date().toISOString()
      }));
    } catch(e) { return []; }
  }

  async getMessage(token, msgId) {
    try {
      const [login, domain] = token.split('@');
      const r = await fetch(`${this.baseUrl}?f=set_email_user&email_user=${encodeURIComponent(login)}&lang=en&site=${domain}`);
      const d = await r.json();
      const r2 = await fetch(`${this.baseUrl}?f=fetch_email&email_id=${msgId}&sid_token=${d.sid_token}`);
      const m = await r2.json();
      return { id: String(m.mail_id || msgId), from: { address: m.mail_from || '', name: (m.mail_from || '').split('@')[0] }, subject: m.mail_subject || '', bodyText: (m.mail_body || '').replace(/<[^>]+>/g, ' '), bodyHtml: m.mail_body || '', receivedAt: m.mail_timestamp ? new Date(parseInt(m.mail_timestamp) * 1000).toISOString() : new Date().toISOString() };
    } catch(e) { return { id: msgId, from: { address: '' }, subject: '', bodyText: 'Failed to load', bodyHtml: '' }; }
  }

  async deleteMessage() { return true; }
  async markAsRead() { return true; }
  async deleteAccount() { return true; }

  async healthCheck() {
    const s = Date.now();
    try {
      const r = await fetch(`${this.baseUrl}?f=get_email_address`, { signal: AbortSignal.timeout(5000) });
      return { healthy: r.ok, latency: Date.now() - s, status: r.ok ? 'healthy' : 'degraded' };
    } catch(e) { return { healthy: false, latency: Date.now() - s, status: 'error', error: e.message }; }
  }

  _randomLogin() {
    const c = 'abcdefghijklmnopqrstuvwxyz0123456789'; let s = '';
    for (let i = 0; i < 10; i++) s += c[Math.floor(Math.random() * c.length)];
    return s;
  }
}

module.exports = KeeMailProvider;
