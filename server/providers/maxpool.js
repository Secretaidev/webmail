/**
 * XyronMail - MaxPool Provider Plugin
 * Curated pool of max domains
 */
class MaxPool {
  constructor() {
    this.name = 'maxpool';
    this.displayName = 'Max Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'max_0', domain: 'maxnet.email', isActive: true, isPrivate: false },
      { id: 'max_1', domain: 'maxmail60.online', isActive: true, isPrivate: false },
      { id: 'max_2', domain: 'sendmax.live', isActive: true, isPrivate: false },
      { id: 'max_3', domain: 'maxgate.info', isActive: true, isPrivate: false },
      { id: 'max_4', domain: 'maxhost.io', isActive: true, isPrivate: false },
      { id: 'max_5', domain: 'maxhub.org', isActive: true, isPrivate: false },
      { id: 'max_6', domain: 'maxtemp.xyz', isActive: true, isPrivate: false },
      { id: 'max_7', domain: 'maxquick28.tech', isActive: true, isPrivate: false },
      { id: 'max_8', domain: 'maxnet21.org', isActive: true, isPrivate: false },
      { id: 'max_9', domain: 'mailmax.io', isActive: true, isPrivate: false },
      { id: 'max_10', domain: 'maxrelay.space', isActive: true, isPrivate: false },
      { id: 'max_11', domain: 'hubmax.space', isActive: true, isPrivate: false },
      { id: 'max_12', domain: 'maxhub.dev', isActive: true, isPrivate: false },
      { id: 'max_13', domain: 'maxrelay16.dev', isActive: true, isPrivate: false },
      { id: 'max_14', domain: 'mailmax20.world', isActive: true, isPrivate: false },
      { id: 'max_15', domain: 'mailmax.pw', isActive: true, isPrivate: false },
      { id: 'max_16', domain: 'webmax.cc', isActive: true, isPrivate: false },
      { id: 'max_17', domain: 'lettermax.online', isActive: true, isPrivate: false },
      { id: 'max_18', domain: 'lettermax.dev', isActive: true, isPrivate: false },
      { id: 'max_19', domain: 'maxinbox.co', isActive: true, isPrivate: false },
      { id: 'max_20', domain: 'tempmax.email', isActive: true, isPrivate: false },
      { id: 'max_21', domain: 'maxrelay.site', isActive: true, isPrivate: false },
      { id: 'max_22', domain: 'zonemax.org', isActive: true, isPrivate: false },
      { id: 'max_23', domain: 'maxzone.com', isActive: true, isPrivate: false },
      { id: 'max_24', domain: 'maxsend.me', isActive: true, isPrivate: false },
      { id: 'max_25', domain: 'mailmax70.pw', isActive: true, isPrivate: false },
      { id: 'max_26', domain: 'maxdrop.io', isActive: true, isPrivate: false },
      { id: 'max_27', domain: 'maxcloud.com', isActive: true, isPrivate: false },
      { id: 'max_28', domain: 'boxmax.org', isActive: true, isPrivate: false },
      { id: 'max_29', domain: 'fastmax65.cloud', isActive: true, isPrivate: false },
      { id: 'max_30', domain: 'maxdrop.dev', isActive: true, isPrivate: false },
      { id: 'max_31', domain: 'lettermax.org', isActive: true, isPrivate: false },
      { id: 'max_32', domain: 'sitemax.cc', isActive: true, isPrivate: false },
      { id: 'max_33', domain: 'maxgate.email', isActive: true, isPrivate: false },
      { id: 'max_34', domain: 'sitemax34.dev', isActive: true, isPrivate: false },
      { id: 'max_35', domain: 'cloudmax.site', isActive: true, isPrivate: false },
      { id: 'max_36', domain: 'dropmax.zone', isActive: true, isPrivate: false },
      { id: 'max_37', domain: 'maxrelay.cc', isActive: true, isPrivate: false },
      { id: 'max_38', domain: 'maxweb.cc', isActive: true, isPrivate: false },
      { id: 'max_39', domain: 'mailmax.xyz', isActive: true, isPrivate: false },
      { id: 'max_40', domain: 'maxletter.cc', isActive: true, isPrivate: false },
      { id: 'max_41', domain: 'dropmax.online', isActive: true, isPrivate: false },
      { id: 'max_42', domain: 'hostmax14.com', isActive: true, isPrivate: false },
      { id: 'max_43', domain: 'maxsite48.world', isActive: true, isPrivate: false },
      { id: 'max_44', domain: 'postmax38.me', isActive: true, isPrivate: false },
      { id: 'max_45', domain: 'maxtemp.live', isActive: true, isPrivate: false },
      { id: 'max_46', domain: 'maxletter.xyz', isActive: true, isPrivate: false },
      { id: 'max_47', domain: 'quickmax.world', isActive: true, isPrivate: false },
      { id: 'max_48', domain: 'sendmax.me', isActive: true, isPrivate: false },
      { id: 'max_49', domain: 'maxgate.co', isActive: true, isPrivate: false }
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

module.exports = MaxPool;
