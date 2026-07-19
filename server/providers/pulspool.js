/**
 * XyronMail - PulsPool Provider Plugin
 * Curated pool of puls domains
 */
class PulsPool {
  constructor() {
    this.name = 'pulspool';
    this.displayName = 'Puls Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'puls_0', domain: 'pulssend.space', isActive: true, isPrivate: false },
      { id: 'puls_1', domain: 'sendpuls.me', isActive: true, isPrivate: false },
      { id: 'puls_2', domain: 'pulspost.tech', isActive: true, isPrivate: false },
      { id: 'puls_3', domain: 'hostpuls.dev', isActive: true, isPrivate: false },
      { id: 'puls_4', domain: 'netpuls.dev', isActive: true, isPrivate: false },
      { id: 'puls_5', domain: 'pulshub.space', isActive: true, isPrivate: false },
      { id: 'puls_6', domain: 'pulssend26.org', isActive: true, isPrivate: false },
      { id: 'puls_7', domain: 'pulstemp.zone', isActive: true, isPrivate: false },
      { id: 'puls_8', domain: 'boxpuls.io', isActive: true, isPrivate: false },
      { id: 'puls_9', domain: 'fastpuls.net', isActive: true, isPrivate: false },
      { id: 'puls_10', domain: 'hubpuls.live', isActive: true, isPrivate: false },
      { id: 'puls_11', domain: 'fastpuls.me', isActive: true, isPrivate: false },
      { id: 'puls_12', domain: 'pulsmsg.world', isActive: true, isPrivate: false },
      { id: 'puls_13', domain: 'pulsgate.net', isActive: true, isPrivate: false },
      { id: 'puls_14', domain: 'pulssend.online', isActive: true, isPrivate: false },
      { id: 'puls_15', domain: 'pulshost.email', isActive: true, isPrivate: false },
      { id: 'puls_16', domain: 'pulszone.pw', isActive: true, isPrivate: false },
      { id: 'puls_17', domain: 'pulsnet.zone', isActive: true, isPrivate: false },
      { id: 'puls_18', domain: 'sitepuls49.zone', isActive: true, isPrivate: false },
      { id: 'puls_19', domain: 'pulstemp.online', isActive: true, isPrivate: false },
      { id: 'puls_20', domain: 'gatepuls37.me', isActive: true, isPrivate: false },
      { id: 'puls_21', domain: 'letterpuls.tech', isActive: true, isPrivate: false },
      { id: 'puls_22', domain: 'boxpuls.email', isActive: true, isPrivate: false },
      { id: 'puls_23', domain: 'pulshub.email', isActive: true, isPrivate: false },
      { id: 'puls_24', domain: 'pulsweb88.net', isActive: true, isPrivate: false },
      { id: 'puls_25', domain: 'pulsmsg.info', isActive: true, isPrivate: false },
      { id: 'puls_26', domain: 'pulszone81.online', isActive: true, isPrivate: false },
      { id: 'puls_27', domain: 'pulszone.dev', isActive: true, isPrivate: false },
      { id: 'puls_28', domain: 'pulshost33.dev', isActive: true, isPrivate: false },
      { id: 'puls_29', domain: 'pulsmail14.me', isActive: true, isPrivate: false },
      { id: 'puls_30', domain: 'pulsbox.online', isActive: true, isPrivate: false },
      { id: 'puls_31', domain: 'pulsfast.cc', isActive: true, isPrivate: false },
      { id: 'puls_32', domain: 'sendpuls.online', isActive: true, isPrivate: false },
      { id: 'puls_33', domain: 'pulsquick.me', isActive: true, isPrivate: false },
      { id: 'puls_34', domain: 'pulsrelay.com', isActive: true, isPrivate: false },
      { id: 'puls_35', domain: 'webpuls21.zone', isActive: true, isPrivate: false },
      { id: 'puls_36', domain: 'gatepuls.email', isActive: true, isPrivate: false },
      { id: 'puls_37', domain: 'gatepuls.dev', isActive: true, isPrivate: false },
      { id: 'puls_38', domain: 'temppuls.cloud', isActive: true, isPrivate: false },
      { id: 'puls_39', domain: 'droppuls62.dev', isActive: true, isPrivate: false },
      { id: 'puls_40', domain: 'pulsweb.net', isActive: true, isPrivate: false },
      { id: 'puls_41', domain: 'sitepuls92.email', isActive: true, isPrivate: false },
      { id: 'puls_42', domain: 'pulsmail.site', isActive: true, isPrivate: false },
      { id: 'puls_43', domain: 'pulsnet39.info', isActive: true, isPrivate: false },
      { id: 'puls_44', domain: 'pulsdrop.xyz', isActive: true, isPrivate: false },
      { id: 'puls_45', domain: 'msgpuls.live', isActive: true, isPrivate: false },
      { id: 'puls_46', domain: 'droppuls.tech', isActive: true, isPrivate: false },
      { id: 'puls_47', domain: 'sitepuls87.tech', isActive: true, isPrivate: false },
      { id: 'puls_48', domain: 'inboxpuls64.co', isActive: true, isPrivate: false },
      { id: 'puls_49', domain: 'droppuls.net', isActive: true, isPrivate: false }
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

module.exports = PulsPool;
