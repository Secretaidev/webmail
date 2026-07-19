/**
 * XyronMail - HackPool Provider Plugin
 * Curated pool of hack domains
 */
class HackPool {
  constructor() {
    this.name = 'hackpool';
    this.displayName = 'Hack Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'hack_0', domain: 'zonehack.info', isActive: true, isPrivate: false },
      { id: 'hack_1', domain: 'hackgate.email', isActive: true, isPrivate: false },
      { id: 'hack_2', domain: 'hackpost.pw', isActive: true, isPrivate: false },
      { id: 'hack_3', domain: 'hackquick.co', isActive: true, isPrivate: false },
      { id: 'hack_4', domain: 'posthack.email', isActive: true, isPrivate: false },
      { id: 'hack_5', domain: 'posthack34.cc', isActive: true, isPrivate: false },
      { id: 'hack_6', domain: 'letterhack.xyz', isActive: true, isPrivate: false },
      { id: 'hack_7', domain: 'hacknet.space', isActive: true, isPrivate: false },
      { id: 'hack_8', domain: 'temphack.world', isActive: true, isPrivate: false },
      { id: 'hack_9', domain: 'msghack48.world', isActive: true, isPrivate: false },
      { id: 'hack_10', domain: 'hosthack.io', isActive: true, isPrivate: false },
      { id: 'hack_11', domain: 'sendhack.zone', isActive: true, isPrivate: false },
      { id: 'hack_12', domain: 'hackcloud.cc', isActive: true, isPrivate: false },
      { id: 'hack_13', domain: 'hacktemp.net', isActive: true, isPrivate: false },
      { id: 'hack_14', domain: 'mailhack.cloud', isActive: true, isPrivate: false },
      { id: 'hack_15', domain: 'hackfast63.cc', isActive: true, isPrivate: false },
      { id: 'hack_16', domain: 'hackinbox.email', isActive: true, isPrivate: false },
      { id: 'hack_17', domain: 'hosthack.online', isActive: true, isPrivate: false },
      { id: 'hack_18', domain: 'hackgate98.io', isActive: true, isPrivate: false },
      { id: 'hack_19', domain: 'hackdrop.zone', isActive: true, isPrivate: false },
      { id: 'hack_20', domain: 'posthack12.tech', isActive: true, isPrivate: false },
      { id: 'hack_21', domain: 'hackrelay.co', isActive: true, isPrivate: false },
      { id: 'hack_22', domain: 'hacknet62.pw', isActive: true, isPrivate: false },
      { id: 'hack_23', domain: 'hackrelay36.me', isActive: true, isPrivate: false },
      { id: 'hack_24', domain: 'hackfast15.dev', isActive: true, isPrivate: false },
      { id: 'hack_25', domain: 'sendhack35.dev', isActive: true, isPrivate: false },
      { id: 'hack_26', domain: 'hubhack.org', isActive: true, isPrivate: false },
      { id: 'hack_27', domain: 'hacktemp.info', isActive: true, isPrivate: false },
      { id: 'hack_28', domain: 'hackzone.cc', isActive: true, isPrivate: false },
      { id: 'hack_29', domain: 'quickhack.xyz', isActive: true, isPrivate: false },
      { id: 'hack_30', domain: 'inboxhack.me', isActive: true, isPrivate: false },
      { id: 'hack_31', domain: 'hosthack18.live', isActive: true, isPrivate: false },
      { id: 'hack_32', domain: 'hackpost57.online', isActive: true, isPrivate: false },
      { id: 'hack_33', domain: 'hackinbox.world', isActive: true, isPrivate: false },
      { id: 'hack_34', domain: 'hackmsg.com', isActive: true, isPrivate: false },
      { id: 'hack_35', domain: 'fasthack77.online', isActive: true, isPrivate: false },
      { id: 'hack_36', domain: 'hubhack.pw', isActive: true, isPrivate: false },
      { id: 'hack_37', domain: 'boxhack.io', isActive: true, isPrivate: false },
      { id: 'hack_38', domain: 'hackrelay.world', isActive: true, isPrivate: false },
      { id: 'hack_39', domain: 'webhack.pw', isActive: true, isPrivate: false },
      { id: 'hack_40', domain: 'quickhack.email', isActive: true, isPrivate: false },
      { id: 'hack_41', domain: 'hubhack47.online', isActive: true, isPrivate: false },
      { id: 'hack_42', domain: 'hackfast.tech', isActive: true, isPrivate: false },
      { id: 'hack_43', domain: 'hackletter.dev', isActive: true, isPrivate: false },
      { id: 'hack_44', domain: 'hackhub.online', isActive: true, isPrivate: false },
      { id: 'hack_45', domain: 'hackhub58.info', isActive: true, isPrivate: false },
      { id: 'hack_46', domain: 'hackhub.tech', isActive: true, isPrivate: false },
      { id: 'hack_47', domain: 'hackgate61.org', isActive: true, isPrivate: false },
      { id: 'hack_48', domain: 'hackmsg.cc', isActive: true, isPrivate: false },
      { id: 'hack_49', domain: 'hackrelay.me', isActive: true, isPrivate: false }
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

module.exports = HackPool;
