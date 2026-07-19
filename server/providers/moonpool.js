/**
 * XyronMail - MoonPool Provider Plugin
 * Curated pool of moon domains
 */
class MoonPool {
  constructor() {
    this.name = 'moonpool';
    this.displayName = 'Moon Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'moon_0', domain: 'boxmoon61.co', isActive: true, isPrivate: false },
      { id: 'moon_1', domain: 'netmoon.org', isActive: true, isPrivate: false },
      { id: 'moon_2', domain: 'moontemp.info', isActive: true, isPrivate: false },
      { id: 'moon_3', domain: 'msgmoon76.site', isActive: true, isPrivate: false },
      { id: 'moon_4', domain: 'moonrelay.pw', isActive: true, isPrivate: false },
      { id: 'moon_5', domain: 'lettermoon53.site', isActive: true, isPrivate: false },
      { id: 'moon_6', domain: 'msgmoon.site', isActive: true, isPrivate: false },
      { id: 'moon_7', domain: 'moongate.space', isActive: true, isPrivate: false },
      { id: 'moon_8', domain: 'moonpost.cc', isActive: true, isPrivate: false },
      { id: 'moon_9', domain: 'inboxmoon51.world', isActive: true, isPrivate: false },
      { id: 'moon_10', domain: 'zonemoon.org', isActive: true, isPrivate: false },
      { id: 'moon_11', domain: 'postmoon98.world', isActive: true, isPrivate: false },
      { id: 'moon_12', domain: 'moonweb.info', isActive: true, isPrivate: false },
      { id: 'moon_13', domain: 'moonrelay.space', isActive: true, isPrivate: false },
      { id: 'moon_14', domain: 'mailmoon.io', isActive: true, isPrivate: false },
      { id: 'moon_15', domain: 'mooncloud38.xyz', isActive: true, isPrivate: false },
      { id: 'moon_16', domain: 'boxmoon.me', isActive: true, isPrivate: false },
      { id: 'moon_17', domain: 'zonemoon.tech', isActive: true, isPrivate: false },
      { id: 'moon_18', domain: 'mooninbox60.com', isActive: true, isPrivate: false },
      { id: 'moon_19', domain: 'hostmoon.info', isActive: true, isPrivate: false },
      { id: 'moon_20', domain: 'webmoon.me', isActive: true, isPrivate: false },
      { id: 'moon_21', domain: 'hostmoon.net', isActive: true, isPrivate: false },
      { id: 'moon_22', domain: 'moonsite46.tech', isActive: true, isPrivate: false },
      { id: 'moon_23', domain: 'mooncloud.info', isActive: true, isPrivate: false },
      { id: 'moon_24', domain: 'cloudmoon.pw', isActive: true, isPrivate: false },
      { id: 'moon_25', domain: 'mooninbox.net', isActive: true, isPrivate: false },
      { id: 'moon_26', domain: 'moonquick.space', isActive: true, isPrivate: false },
      { id: 'moon_27', domain: 'moongate.live', isActive: true, isPrivate: false },
      { id: 'moon_28', domain: 'gatemoon.org', isActive: true, isPrivate: false },
      { id: 'moon_29', domain: 'moonbox92.cc', isActive: true, isPrivate: false },
      { id: 'moon_30', domain: 'moonmail51.com', isActive: true, isPrivate: false },
      { id: 'moon_31', domain: 'gatemoon.cc', isActive: true, isPrivate: false },
      { id: 'moon_32', domain: 'tempmoon.net', isActive: true, isPrivate: false },
      { id: 'moon_33', domain: 'mooncloud.net', isActive: true, isPrivate: false },
      { id: 'moon_34', domain: 'inboxmoon15.info', isActive: true, isPrivate: false },
      { id: 'moon_35', domain: 'dropmoon.cloud', isActive: true, isPrivate: false },
      { id: 'moon_36', domain: 'lettermoon.live', isActive: true, isPrivate: false },
      { id: 'moon_37', domain: 'moongate.cc', isActive: true, isPrivate: false },
      { id: 'moon_38', domain: 'fastmoon.co', isActive: true, isPrivate: false },
      { id: 'moon_39', domain: 'fastmoon.org', isActive: true, isPrivate: false },
      { id: 'moon_40', domain: 'moonzone48.tech', isActive: true, isPrivate: false },
      { id: 'moon_41', domain: 'moonsend.world', isActive: true, isPrivate: false },
      { id: 'moon_42', domain: 'webmoon.site', isActive: true, isPrivate: false },
      { id: 'moon_43', domain: 'moonmail33.live', isActive: true, isPrivate: false },
      { id: 'moon_44', domain: 'moonquick.net', isActive: true, isPrivate: false },
      { id: 'moon_45', domain: 'quickmoon.zone', isActive: true, isPrivate: false },
      { id: 'moon_46', domain: 'inboxmoon69.dev', isActive: true, isPrivate: false },
      { id: 'moon_47', domain: 'moonnet.org', isActive: true, isPrivate: false },
      { id: 'moon_48', domain: 'hostmoon.pw', isActive: true, isPrivate: false },
      { id: 'moon_49', domain: 'moonmail.net', isActive: true, isPrivate: false }
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

module.exports = MoonPool;
