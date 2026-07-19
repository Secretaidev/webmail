/**
 * XyronMail - VoltPool Provider Plugin
 * Curated pool of volt domains
 */
class VoltPool {
  constructor() {
    this.name = 'voltpool';
    this.displayName = 'Volt Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'volt_0', domain: 'tempvolt.io', isActive: true, isPrivate: false },
      { id: 'volt_1', domain: 'voltnet.io', isActive: true, isPrivate: false },
      { id: 'volt_2', domain: 'voltsend.co', isActive: true, isPrivate: false },
      { id: 'volt_3', domain: 'voltsend.cc', isActive: true, isPrivate: false },
      { id: 'volt_4', domain: 'voltmsg.dev', isActive: true, isPrivate: false },
      { id: 'volt_5', domain: 'msgvolt.co', isActive: true, isPrivate: false },
      { id: 'volt_6', domain: 'gatevolt.io', isActive: true, isPrivate: false },
      { id: 'volt_7', domain: 'voltpost.online', isActive: true, isPrivate: false },
      { id: 'volt_8', domain: 'voltdrop94.cloud', isActive: true, isPrivate: false },
      { id: 'volt_9', domain: 'tempvolt.net', isActive: true, isPrivate: false },
      { id: 'volt_10', domain: 'voltrelay.io', isActive: true, isPrivate: false },
      { id: 'volt_11', domain: 'voltinbox.site', isActive: true, isPrivate: false },
      { id: 'volt_12', domain: 'voltinbox.cloud', isActive: true, isPrivate: false },
      { id: 'volt_13', domain: 'dropvolt.live', isActive: true, isPrivate: false },
      { id: 'volt_14', domain: 'voltdrop.com', isActive: true, isPrivate: false },
      { id: 'volt_15', domain: 'hubvolt19.io', isActive: true, isPrivate: false },
      { id: 'volt_16', domain: 'zonevolt.live', isActive: true, isPrivate: false },
      { id: 'volt_17', domain: 'mailvolt.co', isActive: true, isPrivate: false },
      { id: 'volt_18', domain: 'volthost.org', isActive: true, isPrivate: false },
      { id: 'volt_19', domain: 'dropvolt86.io', isActive: true, isPrivate: false },
      { id: 'volt_20', domain: 'voltsite.info', isActive: true, isPrivate: false },
      { id: 'volt_21', domain: 'msgvolt.space', isActive: true, isPrivate: false },
      { id: 'volt_22', domain: 'volthub.email', isActive: true, isPrivate: false },
      { id: 'volt_23', domain: 'boxvolt.site', isActive: true, isPrivate: false },
      { id: 'volt_24', domain: 'volttemp.cc', isActive: true, isPrivate: false },
      { id: 'volt_25', domain: 'voltrelay41.net', isActive: true, isPrivate: false },
      { id: 'volt_26', domain: 'webvolt.pw', isActive: true, isPrivate: false },
      { id: 'volt_27', domain: 'voltcloud.org', isActive: true, isPrivate: false },
      { id: 'volt_28', domain: 'voltsend45.zone', isActive: true, isPrivate: false },
      { id: 'volt_29', domain: 'zonevolt40.net', isActive: true, isPrivate: false },
      { id: 'volt_30', domain: 'volthost.world', isActive: true, isPrivate: false },
      { id: 'volt_31', domain: 'lettervolt.me', isActive: true, isPrivate: false },
      { id: 'volt_32', domain: 'voltsite.xyz', isActive: true, isPrivate: false },
      { id: 'volt_33', domain: 'sendvolt.zone', isActive: true, isPrivate: false },
      { id: 'volt_34', domain: 'inboxvolt64.cc', isActive: true, isPrivate: false },
      { id: 'volt_35', domain: 'msgvolt66.me', isActive: true, isPrivate: false },
      { id: 'volt_36', domain: 'voltpost.cloud', isActive: true, isPrivate: false },
      { id: 'volt_37', domain: 'voltgate.co', isActive: true, isPrivate: false },
      { id: 'volt_38', domain: 'voltmsg49.io', isActive: true, isPrivate: false },
      { id: 'volt_39', domain: 'voltletter.world', isActive: true, isPrivate: false },
      { id: 'volt_40', domain: 'quickvolt.xyz', isActive: true, isPrivate: false },
      { id: 'volt_41', domain: 'voltnet.space', isActive: true, isPrivate: false },
      { id: 'volt_42', domain: 'lettervolt.org', isActive: true, isPrivate: false },
      { id: 'volt_43', domain: 'voltmsg.world', isActive: true, isPrivate: false },
      { id: 'volt_44', domain: 'voltinbox.email', isActive: true, isPrivate: false },
      { id: 'volt_45', domain: 'voltgate.xyz', isActive: true, isPrivate: false },
      { id: 'volt_46', domain: 'lettervolt92.cc', isActive: true, isPrivate: false },
      { id: 'volt_47', domain: 'volthub75.world', isActive: true, isPrivate: false },
      { id: 'volt_48', domain: 'voltzone.space', isActive: true, isPrivate: false },
      { id: 'volt_49', domain: 'voltdrop.world', isActive: true, isPrivate: false }
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

module.exports = VoltPool;
