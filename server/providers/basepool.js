/**
 * XyronMail - BasePool Provider Plugin
 * Curated pool of base domains
 */
class BasePool {
  constructor() {
    this.name = 'basepool';
    this.displayName = 'Base Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'base_0', domain: 'basebox.net', isActive: true, isPrivate: false },
      { id: 'base_1', domain: 'basequick.pw', isActive: true, isPrivate: false },
      { id: 'base_2', domain: 'quickbase.dev', isActive: true, isPrivate: false },
      { id: 'base_3', domain: 'basetemp.world', isActive: true, isPrivate: false },
      { id: 'base_4', domain: 'basemsg.live', isActive: true, isPrivate: false },
      { id: 'base_5', domain: 'netbase.world', isActive: true, isPrivate: false },
      { id: 'base_6', domain: 'letterbase.com', isActive: true, isPrivate: false },
      { id: 'base_7', domain: 'hubbase38.dev', isActive: true, isPrivate: false },
      { id: 'base_8', domain: 'mailbase80.email', isActive: true, isPrivate: false },
      { id: 'base_9', domain: 'basesend76.io', isActive: true, isPrivate: false },
      { id: 'base_10', domain: 'gatebase.tech', isActive: true, isPrivate: false },
      { id: 'base_11', domain: 'baseinbox.cloud', isActive: true, isPrivate: false },
      { id: 'base_12', domain: 'basemsg.net', isActive: true, isPrivate: false },
      { id: 'base_13', domain: 'boxbase.zone', isActive: true, isPrivate: false },
      { id: 'base_14', domain: 'basebox.me', isActive: true, isPrivate: false },
      { id: 'base_15', domain: 'basetemp58.org', isActive: true, isPrivate: false },
      { id: 'base_16', domain: 'baseweb.dev', isActive: true, isPrivate: false },
      { id: 'base_17', domain: 'basehub.live', isActive: true, isPrivate: false },
      { id: 'base_18', domain: 'hubbase.email', isActive: true, isPrivate: false },
      { id: 'base_19', domain: 'inboxbase.info', isActive: true, isPrivate: false },
      { id: 'base_20', domain: 'basesite.com', isActive: true, isPrivate: false },
      { id: 'base_21', domain: 'boxbase.co', isActive: true, isPrivate: false },
      { id: 'base_22', domain: 'relaybase.dev', isActive: true, isPrivate: false },
      { id: 'base_23', domain: 'relaybase.pw', isActive: true, isPrivate: false },
      { id: 'base_24', domain: 'basesite18.cc', isActive: true, isPrivate: false },
      { id: 'base_25', domain: 'mailbase.xyz', isActive: true, isPrivate: false },
      { id: 'base_26', domain: 'basetemp.email', isActive: true, isPrivate: false },
      { id: 'base_27', domain: 'sendbase75.zone', isActive: true, isPrivate: false },
      { id: 'base_28', domain: 'quickbase64.cloud', isActive: true, isPrivate: false },
      { id: 'base_29', domain: 'basedrop.pw', isActive: true, isPrivate: false },
      { id: 'base_30', domain: 'dropbase61.site', isActive: true, isPrivate: false },
      { id: 'base_31', domain: 'cloudbase.email', isActive: true, isPrivate: false },
      { id: 'base_32', domain: 'msgbase.online', isActive: true, isPrivate: false },
      { id: 'base_33', domain: 'basehub.org', isActive: true, isPrivate: false },
      { id: 'base_34', domain: 'netbase41.dev', isActive: true, isPrivate: false },
      { id: 'base_35', domain: 'hostbase.zone', isActive: true, isPrivate: false },
      { id: 'base_36', domain: 'baseweb84.email', isActive: true, isPrivate: false },
      { id: 'base_37', domain: 'mailbase16.live', isActive: true, isPrivate: false },
      { id: 'base_38', domain: 'mailbase.org', isActive: true, isPrivate: false },
      { id: 'base_39', domain: 'basebox.cloud', isActive: true, isPrivate: false },
      { id: 'base_40', domain: 'dropbase.tech', isActive: true, isPrivate: false },
      { id: 'base_41', domain: 'basezone.me', isActive: true, isPrivate: false },
      { id: 'base_42', domain: 'msgbase.world', isActive: true, isPrivate: false },
      { id: 'base_43', domain: 'baseweb.org', isActive: true, isPrivate: false },
      { id: 'base_44', domain: 'basegate.info', isActive: true, isPrivate: false },
      { id: 'base_45', domain: 'baseletter.email', isActive: true, isPrivate: false },
      { id: 'base_46', domain: 'cloudbase.xyz', isActive: true, isPrivate: false },
      { id: 'base_47', domain: 'cloudbase.pw', isActive: true, isPrivate: false },
      { id: 'base_48', domain: 'netbase.pw', isActive: true, isPrivate: false },
      { id: 'base_49', domain: 'sendbase.world', isActive: true, isPrivate: false }
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

module.exports = BasePool;
