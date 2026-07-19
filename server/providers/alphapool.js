/**
 * XyronMail - AlphaPool Provider Plugin
 * Curated pool of alpha domains
 */
class AlphaPool {
  constructor() {
    this.name = 'alphapool';
    this.displayName = 'Alpha Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'alpha_0', domain: 'alphamsg.info', isActive: true, isPrivate: false },
      { id: 'alpha_1', domain: 'alphanet.xyz', isActive: true, isPrivate: false },
      { id: 'alpha_2', domain: 'quickalpha.co', isActive: true, isPrivate: false },
      { id: 'alpha_3', domain: 'letteralpha.tech', isActive: true, isPrivate: false },
      { id: 'alpha_4', domain: 'fastalpha.site', isActive: true, isPrivate: false },
      { id: 'alpha_5', domain: 'alphabox.site', isActive: true, isPrivate: false },
      { id: 'alpha_6', domain: 'hubalpha.dev', isActive: true, isPrivate: false },
      { id: 'alpha_7', domain: 'alphamail.org', isActive: true, isPrivate: false },
      { id: 'alpha_8', domain: 'alphacloud.io', isActive: true, isPrivate: false },
      { id: 'alpha_9', domain: 'alphamail.me', isActive: true, isPrivate: false },
      { id: 'alpha_10', domain: 'cloudalpha32.space', isActive: true, isPrivate: false },
      { id: 'alpha_11', domain: 'relayalpha44.co', isActive: true, isPrivate: false },
      { id: 'alpha_12', domain: 'alphainbox.com', isActive: true, isPrivate: false },
      { id: 'alpha_13', domain: 'sitealpha.co', isActive: true, isPrivate: false },
      { id: 'alpha_14', domain: 'alphasite.dev', isActive: true, isPrivate: false },
      { id: 'alpha_15', domain: 'alphasite.tech', isActive: true, isPrivate: false },
      { id: 'alpha_16', domain: 'zonealpha39.online', isActive: true, isPrivate: false },
      { id: 'alpha_17', domain: 'msgalpha43.io', isActive: true, isPrivate: false },
      { id: 'alpha_18', domain: 'postalpha60.dev', isActive: true, isPrivate: false },
      { id: 'alpha_19', domain: 'webalpha.net', isActive: true, isPrivate: false },
      { id: 'alpha_20', domain: 'zonealpha.io', isActive: true, isPrivate: false },
      { id: 'alpha_21', domain: 'alphafast.co', isActive: true, isPrivate: false },
      { id: 'alpha_22', domain: 'sendalpha.info', isActive: true, isPrivate: false },
      { id: 'alpha_23', domain: 'alphatemp.com', isActive: true, isPrivate: false },
      { id: 'alpha_24', domain: 'hubalpha42.zone', isActive: true, isPrivate: false },
      { id: 'alpha_25', domain: 'boxalpha.email', isActive: true, isPrivate: false },
      { id: 'alpha_26', domain: 'cloudalpha.info', isActive: true, isPrivate: false },
      { id: 'alpha_27', domain: 'alphabox.pw', isActive: true, isPrivate: false },
      { id: 'alpha_28', domain: 'alphaweb.live', isActive: true, isPrivate: false },
      { id: 'alpha_29', domain: 'alphapost59.tech', isActive: true, isPrivate: false },
      { id: 'alpha_30', domain: 'relayalpha.cc', isActive: true, isPrivate: false },
      { id: 'alpha_31', domain: 'dropalpha.org', isActive: true, isPrivate: false },
      { id: 'alpha_32', domain: 'hubalpha.cloud', isActive: true, isPrivate: false },
      { id: 'alpha_33', domain: 'postalpha.info', isActive: true, isPrivate: false },
      { id: 'alpha_34', domain: 'alphabox.xyz', isActive: true, isPrivate: false },
      { id: 'alpha_35', domain: 'hubalpha.xyz', isActive: true, isPrivate: false },
      { id: 'alpha_36', domain: 'gatealpha.cloud', isActive: true, isPrivate: false },
      { id: 'alpha_37', domain: 'alphahost37.dev', isActive: true, isPrivate: false },
      { id: 'alpha_38', domain: 'inboxalpha.site', isActive: true, isPrivate: false },
      { id: 'alpha_39', domain: 'alphanet.cloud', isActive: true, isPrivate: false },
      { id: 'alpha_40', domain: 'webalpha.online', isActive: true, isPrivate: false },
      { id: 'alpha_41', domain: 'alphaweb.cc', isActive: true, isPrivate: false },
      { id: 'alpha_42', domain: 'alphasite.com', isActive: true, isPrivate: false },
      { id: 'alpha_43', domain: 'alphazone.site', isActive: true, isPrivate: false },
      { id: 'alpha_44', domain: 'alphahost.xyz', isActive: true, isPrivate: false },
      { id: 'alpha_45', domain: 'mailalpha.net', isActive: true, isPrivate: false },
      { id: 'alpha_46', domain: 'sendalpha.cc', isActive: true, isPrivate: false },
      { id: 'alpha_47', domain: 'alphagate.io', isActive: true, isPrivate: false },
      { id: 'alpha_48', domain: 'sitealpha42.space', isActive: true, isPrivate: false },
      { id: 'alpha_49', domain: 'webalpha71.cc', isActive: true, isPrivate: false }
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

module.exports = AlphaPool;
