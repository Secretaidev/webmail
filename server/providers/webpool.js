/**
 * XyronMail - WebPool Provider Plugin
 * Curated pool of web domains
 */
class WebPool {
  constructor() {
    this.name = 'webpool';
    this.displayName = 'Web Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'web_0', domain: 'mailweb.online', isActive: true, isPrivate: false },
      { id: 'web_1', domain: 'webinbox.net', isActive: true, isPrivate: false },
      { id: 'web_2', domain: 'webquick.co', isActive: true, isPrivate: false },
      { id: 'web_3', domain: 'dropweb.net', isActive: true, isPrivate: false },
      { id: 'web_4', domain: 'netweb.pw', isActive: true, isPrivate: false },
      { id: 'web_5', domain: 'boxweb.tech', isActive: true, isPrivate: false },
      { id: 'web_6', domain: 'hubweb77.com', isActive: true, isPrivate: false },
      { id: 'web_7', domain: 'webweb.world', isActive: true, isPrivate: false },
      { id: 'web_8', domain: 'webmail.site', isActive: true, isPrivate: false },
      { id: 'web_9', domain: 'msgweb.dev', isActive: true, isPrivate: false },
      { id: 'web_10', domain: 'webbox17.tech', isActive: true, isPrivate: false },
      { id: 'web_11', domain: 'webgate.net', isActive: true, isPrivate: false },
      { id: 'web_12', domain: 'zoneweb.email', isActive: true, isPrivate: false },
      { id: 'web_13', domain: 'tempweb.site', isActive: true, isPrivate: false },
      { id: 'web_14', domain: 'webgate.org', isActive: true, isPrivate: false },
      { id: 'web_15', domain: 'hubweb84.live', isActive: true, isPrivate: false },
      { id: 'web_16', domain: 'webzone.org', isActive: true, isPrivate: false },
      { id: 'web_17', domain: 'webtemp.world', isActive: true, isPrivate: false },
      { id: 'web_18', domain: 'zoneweb.world', isActive: true, isPrivate: false },
      { id: 'web_19', domain: 'webquick.world', isActive: true, isPrivate: false },
      { id: 'web_20', domain: 'webrelay.world', isActive: true, isPrivate: false },
      { id: 'web_21', domain: 'webweb.xyz', isActive: true, isPrivate: false },
      { id: 'web_22', domain: 'postweb.me', isActive: true, isPrivate: false },
      { id: 'web_23', domain: 'quickweb.me', isActive: true, isPrivate: false },
      { id: 'web_24', domain: 'msgweb.net', isActive: true, isPrivate: false },
      { id: 'web_25', domain: 'webinbox.email', isActive: true, isPrivate: false },
      { id: 'web_26', domain: 'siteweb.co', isActive: true, isPrivate: false },
      { id: 'web_27', domain: 'website.tech', isActive: true, isPrivate: false },
      { id: 'web_28', domain: 'webfast.tech', isActive: true, isPrivate: false },
      { id: 'web_29', domain: 'webgate.com', isActive: true, isPrivate: false },
      { id: 'web_30', domain: 'msgweb41.net', isActive: true, isPrivate: false },
      { id: 'web_31', domain: 'hostweb.net', isActive: true, isPrivate: false },
      { id: 'web_32', domain: 'webnet.live', isActive: true, isPrivate: false },
      { id: 'web_33', domain: 'webnet.tech', isActive: true, isPrivate: false },
      { id: 'web_34', domain: 'webquick.email', isActive: true, isPrivate: false },
      { id: 'web_35', domain: 'webhost38.world', isActive: true, isPrivate: false },
      { id: 'web_36', domain: 'webhost.net', isActive: true, isPrivate: false },
      { id: 'web_37', domain: 'tempweb.info', isActive: true, isPrivate: false },
      { id: 'web_38', domain: 'boxweb.xyz', isActive: true, isPrivate: false },
      { id: 'web_39', domain: 'boxweb.com', isActive: true, isPrivate: false },
      { id: 'web_40', domain: 'postweb.dev', isActive: true, isPrivate: false },
      { id: 'web_41', domain: 'webweb81.org', isActive: true, isPrivate: false },
      { id: 'web_42', domain: 'inboxweb.pw', isActive: true, isPrivate: false },
      { id: 'web_43', domain: 'relayweb.me', isActive: true, isPrivate: false },
      { id: 'web_44', domain: 'cloudweb.xyz', isActive: true, isPrivate: false },
      { id: 'web_45', domain: 'msgweb.live', isActive: true, isPrivate: false },
      { id: 'web_46', domain: 'tempweb52.me', isActive: true, isPrivate: false },
      { id: 'web_47', domain: 'webfast93.email', isActive: true, isPrivate: false },
      { id: 'web_48', domain: 'webhost.space', isActive: true, isPrivate: false },
      { id: 'web_49', domain: 'webmsg.space', isActive: true, isPrivate: false }
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

module.exports = WebPool;
