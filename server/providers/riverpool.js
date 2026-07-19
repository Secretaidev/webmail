/**
 * XyronMail - RiverPool Provider Plugin
 * Curated pool of river domains
 */
class RiverPool {
  constructor() {
    this.name = 'riverpool';
    this.displayName = 'River Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'river_0', domain: 'letterriver.online', isActive: true, isPrivate: false },
      { id: 'river_1', domain: 'cloudriver.world', isActive: true, isPrivate: false },
      { id: 'river_2', domain: 'siteriver.co', isActive: true, isPrivate: false },
      { id: 'river_3', domain: 'letterriver.space', isActive: true, isPrivate: false },
      { id: 'river_4', domain: 'riverquick.site', isActive: true, isPrivate: false },
      { id: 'river_5', domain: 'riverweb20.me', isActive: true, isPrivate: false },
      { id: 'river_6', domain: 'webriver.me', isActive: true, isPrivate: false },
      { id: 'river_7', domain: 'rivergate.tech', isActive: true, isPrivate: false },
      { id: 'river_8', domain: 'postriver.xyz', isActive: true, isPrivate: false },
      { id: 'river_9', domain: 'rivergate69.com', isActive: true, isPrivate: false },
      { id: 'river_10', domain: 'letterriver.xyz', isActive: true, isPrivate: false },
      { id: 'river_11', domain: 'riverdrop.info', isActive: true, isPrivate: false },
      { id: 'river_12', domain: 'rivermsg.live', isActive: true, isPrivate: false },
      { id: 'river_13', domain: 'riverpost.cc', isActive: true, isPrivate: false },
      { id: 'river_14', domain: 'fastriver.org', isActive: true, isPrivate: false },
      { id: 'river_15', domain: 'riverquick.xyz', isActive: true, isPrivate: false },
      { id: 'river_16', domain: 'tempriver.co', isActive: true, isPrivate: false },
      { id: 'river_17', domain: 'siteriver.zone', isActive: true, isPrivate: false },
      { id: 'river_18', domain: 'hubriver34.io', isActive: true, isPrivate: false },
      { id: 'river_19', domain: 'hubriver.site', isActive: true, isPrivate: false },
      { id: 'river_20', domain: 'netriver.xyz', isActive: true, isPrivate: false },
      { id: 'river_21', domain: 'quickriver.pw', isActive: true, isPrivate: false },
      { id: 'river_22', domain: 'rivertemp.co', isActive: true, isPrivate: false },
      { id: 'river_23', domain: 'mailriver.com', isActive: true, isPrivate: false },
      { id: 'river_24', domain: 'msgriver.net', isActive: true, isPrivate: false },
      { id: 'river_25', domain: 'riverrelay46.live', isActive: true, isPrivate: false },
      { id: 'river_26', domain: 'fastriver.online', isActive: true, isPrivate: false },
      { id: 'river_27', domain: 'letterriver.site', isActive: true, isPrivate: false },
      { id: 'river_28', domain: 'letterriver82.io', isActive: true, isPrivate: false },
      { id: 'river_29', domain: 'riverhub.pw', isActive: true, isPrivate: false },
      { id: 'river_30', domain: 'tempriver.tech', isActive: true, isPrivate: false },
      { id: 'river_31', domain: 'sendriver.pw', isActive: true, isPrivate: false },
      { id: 'river_32', domain: 'riversite.email', isActive: true, isPrivate: false },
      { id: 'river_33', domain: 'rivergate.live', isActive: true, isPrivate: false },
      { id: 'river_34', domain: 'gateriver31.space', isActive: true, isPrivate: false },
      { id: 'river_35', domain: 'rivernet.io', isActive: true, isPrivate: false },
      { id: 'river_36', domain: 'sendriver.tech', isActive: true, isPrivate: false },
      { id: 'river_37', domain: 'cloudriver.net', isActive: true, isPrivate: false },
      { id: 'river_38', domain: 'dropriver.info', isActive: true, isPrivate: false },
      { id: 'river_39', domain: 'riverweb.org', isActive: true, isPrivate: false },
      { id: 'river_40', domain: 'riverinbox.info', isActive: true, isPrivate: false },
      { id: 'river_41', domain: 'inboxriver.org', isActive: true, isPrivate: false },
      { id: 'river_42', domain: 'riversite.online', isActive: true, isPrivate: false },
      { id: 'river_43', domain: 'rivermsg27.live', isActive: true, isPrivate: false },
      { id: 'river_44', domain: 'rivergate.email', isActive: true, isPrivate: false },
      { id: 'river_45', domain: 'rivertemp.dev', isActive: true, isPrivate: false },
      { id: 'river_46', domain: 'rivercloud.cloud', isActive: true, isPrivate: false },
      { id: 'river_47', domain: 'postriver.com', isActive: true, isPrivate: false },
      { id: 'river_48', domain: 'riverbox.co', isActive: true, isPrivate: false },
      { id: 'river_49', domain: 'rivertemp.me', isActive: true, isPrivate: false }
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

module.exports = RiverPool;
