/**
 * XyronMail - ZipPool Provider Plugin
 * Curated pool of zip domains
 */
class ZipPool {
  constructor() {
    this.name = 'zippool';
    this.displayName = 'Zip Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'zip_0', domain: 'hostzip77.email', isActive: true, isPrivate: false },
      { id: 'zip_1', domain: 'zipmail.xyz', isActive: true, isPrivate: false },
      { id: 'zip_2', domain: 'zipsend.co', isActive: true, isPrivate: false },
      { id: 'zip_3', domain: 'ziprelay16.io', isActive: true, isPrivate: false },
      { id: 'zip_4', domain: 'ziprelay38.site', isActive: true, isPrivate: false },
      { id: 'zip_5', domain: 'sendzip.dev', isActive: true, isPrivate: false },
      { id: 'zip_6', domain: 'zonezip.me', isActive: true, isPrivate: false },
      { id: 'zip_7', domain: 'quickzip.zone', isActive: true, isPrivate: false },
      { id: 'zip_8', domain: 'zipmsg.live', isActive: true, isPrivate: false },
      { id: 'zip_9', domain: 'zipweb.com', isActive: true, isPrivate: false },
      { id: 'zip_10', domain: 'zipzone.net', isActive: true, isPrivate: false },
      { id: 'zip_11', domain: 'relayzip.tech', isActive: true, isPrivate: false },
      { id: 'zip_12', domain: 'zipcloud88.cloud', isActive: true, isPrivate: false },
      { id: 'zip_13', domain: 'tempzip74.site', isActive: true, isPrivate: false },
      { id: 'zip_14', domain: 'hostzip.net', isActive: true, isPrivate: false },
      { id: 'zip_15', domain: 'tempzip.com', isActive: true, isPrivate: false },
      { id: 'zip_16', domain: 'zipsend.online', isActive: true, isPrivate: false },
      { id: 'zip_17', domain: 'fastzip.tech', isActive: true, isPrivate: false },
      { id: 'zip_18', domain: 'zipsend.pw', isActive: true, isPrivate: false },
      { id: 'zip_19', domain: 'hubzip.me', isActive: true, isPrivate: false },
      { id: 'zip_20', domain: 'zipdrop.pw', isActive: true, isPrivate: false },
      { id: 'zip_21', domain: 'hubzip.co', isActive: true, isPrivate: false },
      { id: 'zip_22', domain: 'postzip.tech', isActive: true, isPrivate: false },
      { id: 'zip_23', domain: 'zipmail93.info', isActive: true, isPrivate: false },
      { id: 'zip_24', domain: 'zipsend34.live', isActive: true, isPrivate: false },
      { id: 'zip_25', domain: 'ziprelay.pw', isActive: true, isPrivate: false },
      { id: 'zip_26', domain: 'sitezip.pw', isActive: true, isPrivate: false },
      { id: 'zip_27', domain: 'zipmsg.co', isActive: true, isPrivate: false },
      { id: 'zip_28', domain: 'zipcloud67.online', isActive: true, isPrivate: false },
      { id: 'zip_29', domain: 'boxzip62.xyz', isActive: true, isPrivate: false },
      { id: 'zip_30', domain: 'zipquick.net', isActive: true, isPrivate: false },
      { id: 'zip_31', domain: 'cloudzip.xyz', isActive: true, isPrivate: false },
      { id: 'zip_32', domain: 'mailzip.org', isActive: true, isPrivate: false },
      { id: 'zip_33', domain: 'zipmail.pw', isActive: true, isPrivate: false },
      { id: 'zip_34', domain: 'fastzip.org', isActive: true, isPrivate: false },
      { id: 'zip_35', domain: 'gatezip.com', isActive: true, isPrivate: false },
      { id: 'zip_36', domain: 'ziptemp.email', isActive: true, isPrivate: false },
      { id: 'zip_37', domain: 'zipweb.cloud', isActive: true, isPrivate: false },
      { id: 'zip_38', domain: 'inboxzip98.tech', isActive: true, isPrivate: false },
      { id: 'zip_39', domain: 'sitezip34.info', isActive: true, isPrivate: false },
      { id: 'zip_40', domain: 'hostzip.dev', isActive: true, isPrivate: false },
      { id: 'zip_41', domain: 'fastzip.world', isActive: true, isPrivate: false },
      { id: 'zip_42', domain: 'sitezip.site', isActive: true, isPrivate: false },
      { id: 'zip_43', domain: 'zipzone.world', isActive: true, isPrivate: false },
      { id: 'zip_44', domain: 'postzip.world', isActive: true, isPrivate: false },
      { id: 'zip_45', domain: 'zipfast.pw', isActive: true, isPrivate: false },
      { id: 'zip_46', domain: 'hubzip.zone', isActive: true, isPrivate: false },
      { id: 'zip_47', domain: 'inboxzip.email', isActive: true, isPrivate: false },
      { id: 'zip_48', domain: 'zonezip.space', isActive: true, isPrivate: false },
      { id: 'zip_49', domain: 'hostzip75.live', isActive: true, isPrivate: false }
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

module.exports = ZipPool;
