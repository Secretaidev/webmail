/**
 * XyronMail - PrimePool Provider Plugin
 * Curated pool of prime domains
 */
class PrimePool {
  constructor() {
    this.name = 'primepool';
    this.displayName = 'Prime Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'prime_0', domain: 'primecloud.zone', isActive: true, isPrivate: false },
      { id: 'prime_1', domain: 'primedrop.dev', isActive: true, isPrivate: false },
      { id: 'prime_2', domain: 'cloudprime.info', isActive: true, isPrivate: false },
      { id: 'prime_3', domain: 'primegate.info', isActive: true, isPrivate: false },
      { id: 'prime_4', domain: 'webprime.me', isActive: true, isPrivate: false },
      { id: 'prime_5', domain: 'primezone.email', isActive: true, isPrivate: false },
      { id: 'prime_6', domain: 'sendprime.site', isActive: true, isPrivate: false },
      { id: 'prime_7', domain: 'primeinbox.live', isActive: true, isPrivate: false },
      { id: 'prime_8', domain: 'primehost.online', isActive: true, isPrivate: false },
      { id: 'prime_9', domain: 'primebox.org', isActive: true, isPrivate: false },
      { id: 'prime_10', domain: 'primefast33.net', isActive: true, isPrivate: false },
      { id: 'prime_11', domain: 'primehost64.cloud', isActive: true, isPrivate: false },
      { id: 'prime_12', domain: 'relayprime42.dev', isActive: true, isPrivate: false },
      { id: 'prime_13', domain: 'primesite75.net', isActive: true, isPrivate: false },
      { id: 'prime_14', domain: 'dropprime.pw', isActive: true, isPrivate: false },
      { id: 'prime_15', domain: 'webprime.info', isActive: true, isPrivate: false },
      { id: 'prime_16', domain: 'hostprime80.info', isActive: true, isPrivate: false },
      { id: 'prime_17', domain: 'primerelay.world', isActive: true, isPrivate: false },
      { id: 'prime_18', domain: 'primenet.pw', isActive: true, isPrivate: false },
      { id: 'prime_19', domain: 'tempprime.info', isActive: true, isPrivate: false },
      { id: 'prime_20', domain: 'inboxprime.org', isActive: true, isPrivate: false },
      { id: 'prime_21', domain: 'primebox.live', isActive: true, isPrivate: false },
      { id: 'prime_22', domain: 'primequick.com', isActive: true, isPrivate: false },
      { id: 'prime_23', domain: 'primeweb.world', isActive: true, isPrivate: false },
      { id: 'prime_24', domain: 'netprime.pw', isActive: true, isPrivate: false },
      { id: 'prime_25', domain: 'primefast.pw', isActive: true, isPrivate: false },
      { id: 'prime_26', domain: 'tempprime.co', isActive: true, isPrivate: false },
      { id: 'prime_27', domain: 'primesite.pw', isActive: true, isPrivate: false },
      { id: 'prime_28', domain: 'primemsg.online', isActive: true, isPrivate: false },
      { id: 'prime_29', domain: 'primequick18.info', isActive: true, isPrivate: false },
      { id: 'prime_30', domain: 'mailprime.cc', isActive: true, isPrivate: false },
      { id: 'prime_31', domain: 'netprime23.com', isActive: true, isPrivate: false },
      { id: 'prime_32', domain: 'sendprime60.world', isActive: true, isPrivate: false },
      { id: 'prime_33', domain: 'primeletter54.io', isActive: true, isPrivate: false },
      { id: 'prime_34', domain: 'primenet.space', isActive: true, isPrivate: false },
      { id: 'prime_35', domain: 'zoneprime.co', isActive: true, isPrivate: false },
      { id: 'prime_36', domain: 'primeinbox.zone', isActive: true, isPrivate: false },
      { id: 'prime_37', domain: 'primegate.zone', isActive: true, isPrivate: false },
      { id: 'prime_38', domain: 'primeinbox25.site', isActive: true, isPrivate: false },
      { id: 'prime_39', domain: 'primesite.zone', isActive: true, isPrivate: false },
      { id: 'prime_40', domain: 'primesend.org', isActive: true, isPrivate: false },
      { id: 'prime_41', domain: 'netprime.space', isActive: true, isPrivate: false },
      { id: 'prime_42', domain: 'zoneprime.org', isActive: true, isPrivate: false },
      { id: 'prime_43', domain: 'primepost.tech', isActive: true, isPrivate: false },
      { id: 'prime_44', domain: 'primerelay.com', isActive: true, isPrivate: false },
      { id: 'prime_45', domain: 'primehost.org', isActive: true, isPrivate: false },
      { id: 'prime_46', domain: 'primedrop56.world', isActive: true, isPrivate: false },
      { id: 'prime_47', domain: 'primeinbox.me', isActive: true, isPrivate: false },
      { id: 'prime_48', domain: 'primesite18.online', isActive: true, isPrivate: false },
      { id: 'prime_49', domain: 'primeletter.site', isActive: true, isPrivate: false }
    ];
    return this.cachedDomains;
  }

  async createAccount(address) {
    try {
      const parts = address ? address.split('@') : [];
      const login = parts[0] || this._randomLogin();
      const domain = parts[1] || this.cachedDomains[0]?.domain || 'sharklasers.com';
      const r = await fetch(`${this.baseUrl}?f=set_email_user&email_user=${encodeURIComponent(login)}&lang=en&site=${domain}`);
      const data = await r.json();
      return { id: data.email_addr || `${login}@${domain}`, address: data.email_addr || `${login}@${domain}`, token: data.sid_token, createdAt: new Date().toISOString() };
    } catch(e) {
      return { id: `${address}`, address, createdAt: new Date().toISOString() };
    }
  }

  async getToken(address) { return address; }

  async getMessages(token) {
    try {
      const [login, domain] = token.split('@');
      const r = await fetch(`${this.baseUrl}?f=set_email_user&email_user=${encodeURIComponent(login)}&lang=en&site=${domain}`);
      const d = await r.json();
      const sid = d.sid_token;
      const r2 = await fetch(`${this.baseUrl}?f=get_email_list&offset=0&sid_token=${sid}`);
      const d2 = await r2.json();
      return (d2.list || []).map(m => ({
        id: String(m.mail_id),
        from: { address: m.mail_from, name: m.mail_from?.split('@')[0] || '' },
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
      return {
        id: String(m.mail_id),
        from: { address: m.mail_from, name: m.mail_from?.split('@')[0] || '' },
        subject: m.mail_subject || '',
        bodyText: m.mail_body?.replace(/<[^>]+>/g, ' ') || '',
        bodyHtml: m.mail_body || '',
        receivedAt: m.mail_timestamp ? new Date(parseInt(m.mail_timestamp) * 1000).toISOString() : new Date().toISOString()
      };
    } catch(e) { return { id: msgId, from: { address: '' }, subject: '', bodyText: 'Failed to load', bodyHtml: '' }; }
  }

  _randomLogin() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let s = '';
    for (let i = 0; i < 10; i++) s += chars[Math.floor(Math.random() * chars.length)];
    return s;
  }
}

module.exports = PrimePool;
