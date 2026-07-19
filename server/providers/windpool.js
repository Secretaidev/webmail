/**
 * XyronMail - WindPool Provider Plugin
 * Curated pool of wind domains
 */
class WindPool {
  constructor() {
    this.name = 'windpool';
    this.displayName = 'Wind Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'wind_0', domain: 'tempwind46.site', isActive: true, isPrivate: false },
      { id: 'wind_1', domain: 'windmsg.space', isActive: true, isPrivate: false },
      { id: 'wind_2', domain: 'windpost54.site', isActive: true, isPrivate: false },
      { id: 'wind_3', domain: 'boxwind14.tech', isActive: true, isPrivate: false },
      { id: 'wind_4', domain: 'windquick47.cc', isActive: true, isPrivate: false },
      { id: 'wind_5', domain: 'hostwind.zone', isActive: true, isPrivate: false },
      { id: 'wind_6', domain: 'hubwind.xyz', isActive: true, isPrivate: false },
      { id: 'wind_7', domain: 'mailwind.pw', isActive: true, isPrivate: false },
      { id: 'wind_8', domain: 'zonewind.world', isActive: true, isPrivate: false },
      { id: 'wind_9', domain: 'windhub.org', isActive: true, isPrivate: false },
      { id: 'wind_10', domain: 'windhub.pw', isActive: true, isPrivate: false },
      { id: 'wind_11', domain: 'windnet46.io', isActive: true, isPrivate: false },
      { id: 'wind_12', domain: 'windcloud.net', isActive: true, isPrivate: false },
      { id: 'wind_13', domain: 'windcloud.space', isActive: true, isPrivate: false },
      { id: 'wind_14', domain: 'msgwind.email', isActive: true, isPrivate: false },
      { id: 'wind_15', domain: 'postwind88.cc', isActive: true, isPrivate: false },
      { id: 'wind_16', domain: 'winddrop.com', isActive: true, isPrivate: false },
      { id: 'wind_17', domain: 'quickwind69.site', isActive: true, isPrivate: false },
      { id: 'wind_18', domain: 'windsite.co', isActive: true, isPrivate: false },
      { id: 'wind_19', domain: 'hostwind.io', isActive: true, isPrivate: false },
      { id: 'wind_20', domain: 'dropwind.world', isActive: true, isPrivate: false },
      { id: 'wind_21', domain: 'windmail.online', isActive: true, isPrivate: false },
      { id: 'wind_22', domain: 'windbox67.space', isActive: true, isPrivate: false },
      { id: 'wind_23', domain: 'windsend.org', isActive: true, isPrivate: false },
      { id: 'wind_24', domain: 'msgwind.info', isActive: true, isPrivate: false },
      { id: 'wind_25', domain: 'windweb.zone', isActive: true, isPrivate: false },
      { id: 'wind_26', domain: 'windhost83.email', isActive: true, isPrivate: false },
      { id: 'wind_27', domain: 'windgate.space', isActive: true, isPrivate: false },
      { id: 'wind_28', domain: 'windweb94.live', isActive: true, isPrivate: false },
      { id: 'wind_29', domain: 'dropwind.tech', isActive: true, isPrivate: false },
      { id: 'wind_30', domain: 'msgwind.dev', isActive: true, isPrivate: false },
      { id: 'wind_31', domain: 'windmail.space', isActive: true, isPrivate: false },
      { id: 'wind_32', domain: 'webwind.zone', isActive: true, isPrivate: false },
      { id: 'wind_33', domain: 'windhub.online', isActive: true, isPrivate: false },
      { id: 'wind_34', domain: 'hubwind.cc', isActive: true, isPrivate: false },
      { id: 'wind_35', domain: 'msgwind.zone', isActive: true, isPrivate: false },
      { id: 'wind_36', domain: 'zonewind86.tech', isActive: true, isPrivate: false },
      { id: 'wind_37', domain: 'tempwind.com', isActive: true, isPrivate: false },
      { id: 'wind_38', domain: 'windrelay.org', isActive: true, isPrivate: false },
      { id: 'wind_39', domain: 'windweb.com', isActive: true, isPrivate: false },
      { id: 'wind_40', domain: 'hostwind.dev', isActive: true, isPrivate: false },
      { id: 'wind_41', domain: 'windhost.live', isActive: true, isPrivate: false },
      { id: 'wind_42', domain: 'webwind17.site', isActive: true, isPrivate: false },
      { id: 'wind_43', domain: 'dropwind.co', isActive: true, isPrivate: false },
      { id: 'wind_44', domain: 'windpost.net', isActive: true, isPrivate: false },
      { id: 'wind_45', domain: 'sendwind.com', isActive: true, isPrivate: false },
      { id: 'wind_46', domain: 'tempwind.dev', isActive: true, isPrivate: false },
      { id: 'wind_47', domain: 'windletter.info', isActive: true, isPrivate: false },
      { id: 'wind_48', domain: 'windquick.world', isActive: true, isPrivate: false },
      { id: 'wind_49', domain: 'dropwind.info', isActive: true, isPrivate: false }
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

module.exports = WindPool;
