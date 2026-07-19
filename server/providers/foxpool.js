/**
 * XyronMail - FoxPool Provider Plugin
 * Curated pool of fox domains
 */
class FoxPool {
  constructor() {
    this.name = 'foxpool';
    this.displayName = 'Fox Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'fox_0', domain: 'dropfox.dev', isActive: true, isPrivate: false },
      { id: 'fox_1', domain: 'postfox.site', isActive: true, isPrivate: false },
      { id: 'fox_2', domain: 'sendfox.email', isActive: true, isPrivate: false },
      { id: 'fox_3', domain: 'sendfox.com', isActive: true, isPrivate: false },
      { id: 'fox_4', domain: 'dropfox38.xyz', isActive: true, isPrivate: false },
      { id: 'fox_5', domain: 'hostfox.space', isActive: true, isPrivate: false },
      { id: 'fox_6', domain: 'sitefox.space', isActive: true, isPrivate: false },
      { id: 'fox_7', domain: 'relayfox.email', isActive: true, isPrivate: false },
      { id: 'fox_8', domain: 'foxrelay55.co', isActive: true, isPrivate: false },
      { id: 'fox_9', domain: 'foxquick.xyz', isActive: true, isPrivate: false },
      { id: 'fox_10', domain: 'gatefox75.online', isActive: true, isPrivate: false },
      { id: 'fox_11', domain: 'cloudfox.xyz', isActive: true, isPrivate: false },
      { id: 'fox_12', domain: 'foxbox13.me', isActive: true, isPrivate: false },
      { id: 'fox_13', domain: 'cloudfox.cc', isActive: true, isPrivate: false },
      { id: 'fox_14', domain: 'foxsend62.email', isActive: true, isPrivate: false },
      { id: 'fox_15', domain: 'gatefox.cloud', isActive: true, isPrivate: false },
      { id: 'fox_16', domain: 'msgfox.com', isActive: true, isPrivate: false },
      { id: 'fox_17', domain: 'hostfox33.cc', isActive: true, isPrivate: false },
      { id: 'fox_18', domain: 'inboxfox53.email', isActive: true, isPrivate: false },
      { id: 'fox_19', domain: 'foxweb83.com', isActive: true, isPrivate: false },
      { id: 'fox_20', domain: 'inboxfox.dev', isActive: true, isPrivate: false },
      { id: 'fox_21', domain: 'foxmsg.info', isActive: true, isPrivate: false },
      { id: 'fox_22', domain: 'hostfox81.me', isActive: true, isPrivate: false },
      { id: 'fox_23', domain: 'foxletter.email', isActive: true, isPrivate: false },
      { id: 'fox_24', domain: 'hostfox.zone', isActive: true, isPrivate: false },
      { id: 'fox_25', domain: 'relayfox.com', isActive: true, isPrivate: false },
      { id: 'fox_26', domain: 'msgfox.info', isActive: true, isPrivate: false },
      { id: 'fox_27', domain: 'inboxfox26.live', isActive: true, isPrivate: false },
      { id: 'fox_28', domain: 'webfox49.co', isActive: true, isPrivate: false },
      { id: 'fox_29', domain: 'foxbox26.me', isActive: true, isPrivate: false },
      { id: 'fox_30', domain: 'boxfox.live', isActive: true, isPrivate: false },
      { id: 'fox_31', domain: 'msgfox.xyz', isActive: true, isPrivate: false },
      { id: 'fox_32', domain: 'mailfox.info', isActive: true, isPrivate: false },
      { id: 'fox_33', domain: 'cloudfox.site', isActive: true, isPrivate: false },
      { id: 'fox_34', domain: 'hubfox.cc', isActive: true, isPrivate: false },
      { id: 'fox_35', domain: 'inboxfox87.world', isActive: true, isPrivate: false },
      { id: 'fox_36', domain: 'foxfast94.online', isActive: true, isPrivate: false },
      { id: 'fox_37', domain: 'foxhub.cloud', isActive: true, isPrivate: false },
      { id: 'fox_38', domain: 'hostfox.cloud', isActive: true, isPrivate: false },
      { id: 'fox_39', domain: 'hostfox.co', isActive: true, isPrivate: false },
      { id: 'fox_40', domain: 'sendfox.pw', isActive: true, isPrivate: false },
      { id: 'fox_41', domain: 'foxtemp28.net', isActive: true, isPrivate: false },
      { id: 'fox_42', domain: 'sendfox11.io', isActive: true, isPrivate: false },
      { id: 'fox_43', domain: 'foxhost.space', isActive: true, isPrivate: false },
      { id: 'fox_44', domain: 'foxcloud.me', isActive: true, isPrivate: false },
      { id: 'fox_45', domain: 'fastfox.site', isActive: true, isPrivate: false },
      { id: 'fox_46', domain: 'foxfast11.live', isActive: true, isPrivate: false },
      { id: 'fox_47', domain: 'sitefox70.net', isActive: true, isPrivate: false },
      { id: 'fox_48', domain: 'foxweb.space', isActive: true, isPrivate: false },
      { id: 'fox_49', domain: 'dropfox48.online', isActive: true, isPrivate: false }
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

module.exports = FoxPool;
