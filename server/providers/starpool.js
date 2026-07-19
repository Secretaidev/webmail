/**
 * XyronMail - StarPool Provider Plugin
 * Curated pool of star domains
 */
class StarPool {
  constructor() {
    this.name = 'starpool';
    this.displayName = 'Star Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'star_0', domain: 'hubstar58.site', isActive: true, isPrivate: false },
      { id: 'star_1', domain: 'starbox.cloud', isActive: true, isPrivate: false },
      { id: 'star_2', domain: 'sendstar72.xyz', isActive: true, isPrivate: false },
      { id: 'star_3', domain: 'starletter.xyz', isActive: true, isPrivate: false },
      { id: 'star_4', domain: 'netstar15.io', isActive: true, isPrivate: false },
      { id: 'star_5', domain: 'sendstar.site', isActive: true, isPrivate: false },
      { id: 'star_6', domain: 'starhost.online', isActive: true, isPrivate: false },
      { id: 'star_7', domain: 'relaystar.cc', isActive: true, isPrivate: false },
      { id: 'star_8', domain: 'starmail.cloud', isActive: true, isPrivate: false },
      { id: 'star_9', domain: 'stardrop.xyz', isActive: true, isPrivate: false },
      { id: 'star_10', domain: 'starbox.org', isActive: true, isPrivate: false },
      { id: 'star_11', domain: 'zonestar.dev', isActive: true, isPrivate: false },
      { id: 'star_12', domain: 'starzone.com', isActive: true, isPrivate: false },
      { id: 'star_13', domain: 'starweb.io', isActive: true, isPrivate: false },
      { id: 'star_14', domain: 'boxstar16.email', isActive: true, isPrivate: false },
      { id: 'star_15', domain: 'starmail.email', isActive: true, isPrivate: false },
      { id: 'star_16', domain: 'boxstar.net', isActive: true, isPrivate: false },
      { id: 'star_17', domain: 'starsite.net', isActive: true, isPrivate: false },
      { id: 'star_18', domain: 'starletter.site', isActive: true, isPrivate: false },
      { id: 'star_19', domain: 'sendstar.xyz', isActive: true, isPrivate: false },
      { id: 'star_20', domain: 'starnet.net', isActive: true, isPrivate: false },
      { id: 'star_21', domain: 'hubstar.cc', isActive: true, isPrivate: false },
      { id: 'star_22', domain: 'webstar.pw', isActive: true, isPrivate: false },
      { id: 'star_23', domain: 'poststar.pw', isActive: true, isPrivate: false },
      { id: 'star_24', domain: 'starinbox.cc', isActive: true, isPrivate: false },
      { id: 'star_25', domain: 'relaystar.dev', isActive: true, isPrivate: false },
      { id: 'star_26', domain: 'dropstar.io', isActive: true, isPrivate: false },
      { id: 'star_27', domain: 'starrelay23.me', isActive: true, isPrivate: false },
      { id: 'star_28', domain: 'tempstar.io', isActive: true, isPrivate: false },
      { id: 'star_29', domain: 'gatestar.tech', isActive: true, isPrivate: false },
      { id: 'star_30', domain: 'starmsg.cc', isActive: true, isPrivate: false },
      { id: 'star_31', domain: 'starhost.com', isActive: true, isPrivate: false },
      { id: 'star_32', domain: 'starnet.pw', isActive: true, isPrivate: false },
      { id: 'star_33', domain: 'relaystar34.world', isActive: true, isPrivate: false },
      { id: 'star_34', domain: 'zonestar33.space', isActive: true, isPrivate: false },
      { id: 'star_35', domain: 'netstar.zone', isActive: true, isPrivate: false },
      { id: 'star_36', domain: 'zonestar.co', isActive: true, isPrivate: false },
      { id: 'star_37', domain: 'starpost.online', isActive: true, isPrivate: false },
      { id: 'star_38', domain: 'starletter.me', isActive: true, isPrivate: false },
      { id: 'star_39', domain: 'starpost.com', isActive: true, isPrivate: false },
      { id: 'star_40', domain: 'sitestar.co', isActive: true, isPrivate: false },
      { id: 'star_41', domain: 'stargate.org', isActive: true, isPrivate: false },
      { id: 'star_42', domain: 'hoststar75.me', isActive: true, isPrivate: false },
      { id: 'star_43', domain: 'faststar.site', isActive: true, isPrivate: false },
      { id: 'star_44', domain: 'dropstar.site', isActive: true, isPrivate: false },
      { id: 'star_45', domain: 'starnet.co', isActive: true, isPrivate: false },
      { id: 'star_46', domain: 'starquick.com', isActive: true, isPrivate: false },
      { id: 'star_47', domain: 'starfast.site', isActive: true, isPrivate: false },
      { id: 'star_48', domain: 'letterstar.co', isActive: true, isPrivate: false },
      { id: 'star_49', domain: 'stargate.cloud', isActive: true, isPrivate: false }
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

module.exports = StarPool;
