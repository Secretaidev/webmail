/**
 * XyronMail - TechPool Provider Plugin
 * Curated pool of tech domains
 */
class TechPool {
  constructor() {
    this.name = 'techpool';
    this.displayName = 'Tech Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'tech_0', domain: 'webtech.world', isActive: true, isPrivate: false },
      { id: 'tech_1', domain: 'sitetech.xyz', isActive: true, isPrivate: false },
      { id: 'tech_2', domain: 'techquick.live', isActive: true, isPrivate: false },
      { id: 'tech_3', domain: 'mailtech15.world', isActive: true, isPrivate: false },
      { id: 'tech_4', domain: 'techbox50.email', isActive: true, isPrivate: false },
      { id: 'tech_5', domain: 'hubtech.cc', isActive: true, isPrivate: false },
      { id: 'tech_6', domain: 'techweb.live', isActive: true, isPrivate: false },
      { id: 'tech_7', domain: 'nettech.cloud', isActive: true, isPrivate: false },
      { id: 'tech_8', domain: 'sitetech69.info', isActive: true, isPrivate: false },
      { id: 'tech_9', domain: 'msgtech.co', isActive: true, isPrivate: false },
      { id: 'tech_10', domain: 'mailtech65.co', isActive: true, isPrivate: false },
      { id: 'tech_11', domain: 'techweb82.io', isActive: true, isPrivate: false },
      { id: 'tech_12', domain: 'zonetech.dev', isActive: true, isPrivate: false },
      { id: 'tech_13', domain: 'techbox.me', isActive: true, isPrivate: false },
      { id: 'tech_14', domain: 'hubtech.online', isActive: true, isPrivate: false },
      { id: 'tech_15', domain: 'technet.online', isActive: true, isPrivate: false },
      { id: 'tech_16', domain: 'nettech.cc', isActive: true, isPrivate: false },
      { id: 'tech_17', domain: 'techweb.online', isActive: true, isPrivate: false },
      { id: 'tech_18', domain: 'msgtech.info', isActive: true, isPrivate: false },
      { id: 'tech_19', domain: 'techzone.xyz', isActive: true, isPrivate: false },
      { id: 'tech_20', domain: 'techcloud.com', isActive: true, isPrivate: false },
      { id: 'tech_21', domain: 'techinbox.tech', isActive: true, isPrivate: false },
      { id: 'tech_22', domain: 'techmsg.site', isActive: true, isPrivate: false },
      { id: 'tech_23', domain: 'techmsg.space', isActive: true, isPrivate: false },
      { id: 'tech_24', domain: 'technet.net', isActive: true, isPrivate: false },
      { id: 'tech_25', domain: 'techpost.net', isActive: true, isPrivate: false },
      { id: 'tech_26', domain: 'techgate.dev', isActive: true, isPrivate: false },
      { id: 'tech_27', domain: 'sendtech.tech', isActive: true, isPrivate: false },
      { id: 'tech_28', domain: 'techbox.info', isActive: true, isPrivate: false },
      { id: 'tech_29', domain: 'sendtech.online', isActive: true, isPrivate: false },
      { id: 'tech_30', domain: 'techinbox.email', isActive: true, isPrivate: false },
      { id: 'tech_31', domain: 'msgtech.org', isActive: true, isPrivate: false },
      { id: 'tech_32', domain: 'nettech37.pw', isActive: true, isPrivate: false },
      { id: 'tech_33', domain: 'sitetech79.net', isActive: true, isPrivate: false },
      { id: 'tech_34', domain: 'techpost.org', isActive: true, isPrivate: false },
      { id: 'tech_35', domain: 'techsite.xyz', isActive: true, isPrivate: false },
      { id: 'tech_36', domain: 'cloudtech.xyz', isActive: true, isPrivate: false },
      { id: 'tech_37', domain: 'cloudtech.net', isActive: true, isPrivate: false },
      { id: 'tech_38', domain: 'technet.me', isActive: true, isPrivate: false },
      { id: 'tech_39', domain: 'quicktech.email', isActive: true, isPrivate: false },
      { id: 'tech_40', domain: 'inboxtech.pw', isActive: true, isPrivate: false },
      { id: 'tech_41', domain: 'techdrop.zone', isActive: true, isPrivate: false },
      { id: 'tech_42', domain: 'techbox.com', isActive: true, isPrivate: false },
      { id: 'tech_43', domain: 'techzone.pw', isActive: true, isPrivate: false },
      { id: 'tech_44', domain: 'mailtech85.online', isActive: true, isPrivate: false },
      { id: 'tech_45', domain: 'techletter.me', isActive: true, isPrivate: false },
      { id: 'tech_46', domain: 'sitetech.world', isActive: true, isPrivate: false },
      { id: 'tech_47', domain: 'technet.cc', isActive: true, isPrivate: false },
      { id: 'tech_48', domain: 'techsite.world', isActive: true, isPrivate: false },
      { id: 'tech_49', domain: 'techsite71.org', isActive: true, isPrivate: false }
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

module.exports = TechPool;
