/**
 * XyronMail - LatamPool Provider Plugin
 * Curated pool of latam domains
 */
class LatamPool {
  constructor() {
    this.name = 'latampool';
    this.displayName = 'Latam Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'latam_0', domain: 'letterlatam.live', isActive: true, isPrivate: false },
      { id: 'latam_1', domain: 'postlatam.org', isActive: true, isPrivate: false },
      { id: 'latam_2', domain: 'latamweb.space', isActive: true, isPrivate: false },
      { id: 'latam_3', domain: 'sendlatam.xyz', isActive: true, isPrivate: false },
      { id: 'latam_4', domain: 'gatelatam.xyz', isActive: true, isPrivate: false },
      { id: 'latam_5', domain: 'quicklatam.dev', isActive: true, isPrivate: false },
      { id: 'latam_6', domain: 'latamweb.dev', isActive: true, isPrivate: false },
      { id: 'latam_7', domain: 'latamzone.tech', isActive: true, isPrivate: false },
      { id: 'latam_8', domain: 'latambox.live', isActive: true, isPrivate: false },
      { id: 'latam_9', domain: 'hublatam.info', isActive: true, isPrivate: false },
      { id: 'latam_10', domain: 'postlatam.live', isActive: true, isPrivate: false },
      { id: 'latam_11', domain: 'latamsite.online', isActive: true, isPrivate: false },
      { id: 'latam_12', domain: 'latamdrop.site', isActive: true, isPrivate: false },
      { id: 'latam_13', domain: 'sendlatam.io', isActive: true, isPrivate: false },
      { id: 'latam_14', domain: 'droplatam.io', isActive: true, isPrivate: false },
      { id: 'latam_15', domain: 'latamhost.cc', isActive: true, isPrivate: false },
      { id: 'latam_16', domain: 'latamzone.com', isActive: true, isPrivate: false },
      { id: 'latam_17', domain: 'sitelatam.co', isActive: true, isPrivate: false },
      { id: 'latam_18', domain: 'gatelatam.cloud', isActive: true, isPrivate: false },
      { id: 'latam_19', domain: 'latamdrop74.xyz', isActive: true, isPrivate: false },
      { id: 'latam_20', domain: 'droplatam.cc', isActive: true, isPrivate: false },
      { id: 'latam_21', domain: 'latamsite.com', isActive: true, isPrivate: false },
      { id: 'latam_22', domain: 'msglatam.org', isActive: true, isPrivate: false },
      { id: 'latam_23', domain: 'latambox50.dev', isActive: true, isPrivate: false },
      { id: 'latam_24', domain: 'latammail.org', isActive: true, isPrivate: false },
      { id: 'latam_25', domain: 'latamnet.tech', isActive: true, isPrivate: false },
      { id: 'latam_26', domain: 'hublatam.pw', isActive: true, isPrivate: false },
      { id: 'latam_27', domain: 'latampost.online', isActive: true, isPrivate: false },
      { id: 'latam_28', domain: 'latamfast.cloud', isActive: true, isPrivate: false },
      { id: 'latam_29', domain: 'latamgate.net', isActive: true, isPrivate: false },
      { id: 'latam_30', domain: 'templatam63.me', isActive: true, isPrivate: false },
      { id: 'latam_31', domain: 'lataminbox.world', isActive: true, isPrivate: false },
      { id: 'latam_32', domain: 'boxlatam.io', isActive: true, isPrivate: false },
      { id: 'latam_33', domain: 'latamletter53.io', isActive: true, isPrivate: false },
      { id: 'latam_34', domain: 'cloudlatam.io', isActive: true, isPrivate: false },
      { id: 'latam_35', domain: 'hublatam64.pw', isActive: true, isPrivate: false },
      { id: 'latam_36', domain: 'latamfast.xyz', isActive: true, isPrivate: false },
      { id: 'latam_37', domain: 'latamletter.live', isActive: true, isPrivate: false },
      { id: 'latam_38', domain: 'sitelatam.tech', isActive: true, isPrivate: false },
      { id: 'latam_39', domain: 'latamquick.space', isActive: true, isPrivate: false },
      { id: 'latam_40', domain: 'netlatam.cc', isActive: true, isPrivate: false },
      { id: 'latam_41', domain: 'latamcloud.space', isActive: true, isPrivate: false },
      { id: 'latam_42', domain: 'msglatam.xyz', isActive: true, isPrivate: false },
      { id: 'latam_43', domain: 'lataminbox.dev', isActive: true, isPrivate: false },
      { id: 'latam_44', domain: 'latamhub.com', isActive: true, isPrivate: false },
      { id: 'latam_45', domain: 'boxlatam.org', isActive: true, isPrivate: false },
      { id: 'latam_46', domain: 'templatam63.email', isActive: true, isPrivate: false },
      { id: 'latam_47', domain: 'latamhub.net', isActive: true, isPrivate: false },
      { id: 'latam_48', domain: 'latamzone.zone', isActive: true, isPrivate: false },
      { id: 'latam_49', domain: 'weblatam.me', isActive: true, isPrivate: false }
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

module.exports = LatamPool;
