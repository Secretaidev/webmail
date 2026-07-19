/**
 * XyronMail - SunPool Provider Plugin
 * Curated pool of sun domains
 */
class SunPool {
  constructor() {
    this.name = 'sunpool';
    this.displayName = 'Sun Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'sun_0', domain: 'hubsun.net', isActive: true, isPrivate: false },
      { id: 'sun_1', domain: 'postsun98.org', isActive: true, isPrivate: false },
      { id: 'sun_2', domain: 'netsun.com', isActive: true, isPrivate: false },
      { id: 'sun_3', domain: 'sitesun.site', isActive: true, isPrivate: false },
      { id: 'sun_4', domain: 'sunnet13.tech', isActive: true, isPrivate: false },
      { id: 'sun_5', domain: 'fastsun.online', isActive: true, isPrivate: false },
      { id: 'sun_6', domain: 'hostsun.tech', isActive: true, isPrivate: false },
      { id: 'sun_7', domain: 'sunfast18.com', isActive: true, isPrivate: false },
      { id: 'sun_8', domain: 'fastsun.tech', isActive: true, isPrivate: false },
      { id: 'sun_9', domain: 'netsun.online', isActive: true, isPrivate: false },
      { id: 'sun_10', domain: 'sunnet24.email', isActive: true, isPrivate: false },
      { id: 'sun_11', domain: 'zonesun.tech', isActive: true, isPrivate: false },
      { id: 'sun_12', domain: 'suncloud.net', isActive: true, isPrivate: false },
      { id: 'sun_13', domain: 'sunmsg.dev', isActive: true, isPrivate: false },
      { id: 'sun_14', domain: 'sunhost.com', isActive: true, isPrivate: false },
      { id: 'sun_15', domain: 'hubsun.com', isActive: true, isPrivate: false },
      { id: 'sun_16', domain: 'sunletter67.tech', isActive: true, isPrivate: false },
      { id: 'sun_17', domain: 'postsun.site', isActive: true, isPrivate: false },
      { id: 'sun_18', domain: 'websun.email', isActive: true, isPrivate: false },
      { id: 'sun_19', domain: 'sunpost.email', isActive: true, isPrivate: false },
      { id: 'sun_20', domain: 'cloudsun.xyz', isActive: true, isPrivate: false },
      { id: 'sun_21', domain: 'boxsun.live', isActive: true, isPrivate: false },
      { id: 'sun_22', domain: 'boxsun.email', isActive: true, isPrivate: false },
      { id: 'sun_23', domain: 'sunsite.zone', isActive: true, isPrivate: false },
      { id: 'sun_24', domain: 'suncloud.cc', isActive: true, isPrivate: false },
      { id: 'sun_25', domain: 'sunquick.space', isActive: true, isPrivate: false },
      { id: 'sun_26', domain: 'sunmail.world', isActive: true, isPrivate: false },
      { id: 'sun_27', domain: 'netsun.tech', isActive: true, isPrivate: false },
      { id: 'sun_28', domain: 'sunquick.world', isActive: true, isPrivate: false },
      { id: 'sun_29', domain: 'sunpost.cc', isActive: true, isPrivate: false },
      { id: 'sun_30', domain: 'sunbox.tech', isActive: true, isPrivate: false },
      { id: 'sun_31', domain: 'sunbox.zone', isActive: true, isPrivate: false },
      { id: 'sun_32', domain: 'relaysun.org', isActive: true, isPrivate: false },
      { id: 'sun_33', domain: 'cloudsun.cc', isActive: true, isPrivate: false },
      { id: 'sun_34', domain: 'sunrelay.co', isActive: true, isPrivate: false },
      { id: 'sun_35', domain: 'suncloud81.co', isActive: true, isPrivate: false },
      { id: 'sun_36', domain: 'hubsun.online', isActive: true, isPrivate: false },
      { id: 'sun_37', domain: 'fastsun88.live', isActive: true, isPrivate: false },
      { id: 'sun_38', domain: 'sunmail33.org', isActive: true, isPrivate: false },
      { id: 'sun_39', domain: 'sunhost.co', isActive: true, isPrivate: false },
      { id: 'sun_40', domain: 'relaysun.email', isActive: true, isPrivate: false },
      { id: 'sun_41', domain: 'netsun.world', isActive: true, isPrivate: false },
      { id: 'sun_42', domain: 'relaysun40.world', isActive: true, isPrivate: false },
      { id: 'sun_43', domain: 'sunletter.email', isActive: true, isPrivate: false },
      { id: 'sun_44', domain: 'cloudsun84.xyz', isActive: true, isPrivate: false },
      { id: 'sun_45', domain: 'sitesun.space', isActive: true, isPrivate: false },
      { id: 'sun_46', domain: 'postsun.com', isActive: true, isPrivate: false },
      { id: 'sun_47', domain: 'sungate73.email', isActive: true, isPrivate: false },
      { id: 'sun_48', domain: 'hostsun20.com', isActive: true, isPrivate: false },
      { id: 'sun_49', domain: 'sunbox.pw', isActive: true, isPrivate: false }
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

module.exports = SunPool;
