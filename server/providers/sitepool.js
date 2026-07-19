/**
 * XyronMail - SitePool Provider Plugin
 * Curated pool of site domains
 */
class SitePool {
  constructor() {
    this.name = 'sitepool';
    this.displayName = 'Site Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'site_0', domain: 'siteweb.pw', isActive: true, isPrivate: false },
      { id: 'site_1', domain: 'gatesite.me', isActive: true, isPrivate: false },
      { id: 'site_2', domain: 'msgsite.pw', isActive: true, isPrivate: false },
      { id: 'site_3', domain: 'sitetemp.co', isActive: true, isPrivate: false },
      { id: 'site_4', domain: 'siterelay.zone', isActive: true, isPrivate: false },
      { id: 'site_5', domain: 'relaysite45.email', isActive: true, isPrivate: false },
      { id: 'site_6', domain: 'siterelay77.online', isActive: true, isPrivate: false },
      { id: 'site_7', domain: 'cloudsite.org', isActive: true, isPrivate: false },
      { id: 'site_8', domain: 'sendsite.me', isActive: true, isPrivate: false },
      { id: 'site_9', domain: 'sitenet.pw', isActive: true, isPrivate: false },
      { id: 'site_10', domain: 'sitesend.pw', isActive: true, isPrivate: false },
      { id: 'site_11', domain: 'postsite.world', isActive: true, isPrivate: false },
      { id: 'site_12', domain: 'fastsite.space', isActive: true, isPrivate: false },
      { id: 'site_13', domain: 'cloudsite16.online', isActive: true, isPrivate: false },
      { id: 'site_14', domain: 'boxsite.net', isActive: true, isPrivate: false },
      { id: 'site_15', domain: 'lettersite.world', isActive: true, isPrivate: false },
      { id: 'site_16', domain: 'sitegate.live', isActive: true, isPrivate: false },
      { id: 'site_17', domain: 'sitesite.org', isActive: true, isPrivate: false },
      { id: 'site_18', domain: 'siterelay14.zone', isActive: true, isPrivate: false },
      { id: 'site_19', domain: 'hubsite.site', isActive: true, isPrivate: false },
      { id: 'site_20', domain: 'sitefast.tech', isActive: true, isPrivate: false },
      { id: 'site_21', domain: 'zonesite.space', isActive: true, isPrivate: false },
      { id: 'site_22', domain: 'sitedrop95.cloud', isActive: true, isPrivate: false },
      { id: 'site_23', domain: 'zonesite.tech', isActive: true, isPrivate: false },
      { id: 'site_24', domain: 'sitecloud.cloud', isActive: true, isPrivate: false },
      { id: 'site_25', domain: 'sitesite.cc', isActive: true, isPrivate: false },
      { id: 'site_26', domain: 'sitenet.me', isActive: true, isPrivate: false },
      { id: 'site_27', domain: 'zonesite24.zone', isActive: true, isPrivate: false },
      { id: 'site_28', domain: 'sitepost73.online', isActive: true, isPrivate: false },
      { id: 'site_29', domain: 'sitefast.pw', isActive: true, isPrivate: false },
      { id: 'site_30', domain: 'dropsite.net', isActive: true, isPrivate: false },
      { id: 'site_31', domain: 'sendsite.site', isActive: true, isPrivate: false },
      { id: 'site_32', domain: 'sitepost.co', isActive: true, isPrivate: false },
      { id: 'site_33', domain: 'sitegate.info', isActive: true, isPrivate: false },
      { id: 'site_34', domain: 'lettersite47.xyz', isActive: true, isPrivate: false },
      { id: 'site_35', domain: 'sitemsg92.com', isActive: true, isPrivate: false },
      { id: 'site_36', domain: 'sitesite.online', isActive: true, isPrivate: false },
      { id: 'site_37', domain: 'quicksite.zone', isActive: true, isPrivate: false },
      { id: 'site_38', domain: 'sitezone.org', isActive: true, isPrivate: false },
      { id: 'site_39', domain: 'siterelay.com', isActive: true, isPrivate: false },
      { id: 'site_40', domain: 'siteinbox.site', isActive: true, isPrivate: false },
      { id: 'site_41', domain: 'cloudsite.net', isActive: true, isPrivate: false },
      { id: 'site_42', domain: 'sitenet.tech', isActive: true, isPrivate: false },
      { id: 'site_43', domain: 'tempsite.info', isActive: true, isPrivate: false },
      { id: 'site_44', domain: 'relaysite31.xyz', isActive: true, isPrivate: false },
      { id: 'site_45', domain: 'sitebox.io', isActive: true, isPrivate: false },
      { id: 'site_46', domain: 'lettersite.email', isActive: true, isPrivate: false },
      { id: 'site_47', domain: 'hostsite66.tech', isActive: true, isPrivate: false },
      { id: 'site_48', domain: 'mailsite.info', isActive: true, isPrivate: false },
      { id: 'site_49', domain: 'fastsite.pw', isActive: true, isPrivate: false }
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

module.exports = SitePool;
