/**
 * XyronMail - EuroPool Provider Plugin
 * Curated pool of euro domains
 */
class EuroPool {
  constructor() {
    this.name = 'europool';
    this.displayName = 'Euro Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'euro_0', domain: 'euroweb.tech', isActive: true, isPrivate: false },
      { id: 'euro_1', domain: 'zoneeuro.org', isActive: true, isPrivate: false },
      { id: 'euro_2', domain: 'euroletter.email', isActive: true, isPrivate: false },
      { id: 'euro_3', domain: 'inboxeuro.site', isActive: true, isPrivate: false },
      { id: 'euro_4', domain: 'msgeuro.live', isActive: true, isPrivate: false },
      { id: 'euro_5', domain: 'euromsg37.space', isActive: true, isPrivate: false },
      { id: 'euro_6', domain: 'lettereuro.net', isActive: true, isPrivate: false },
      { id: 'euro_7', domain: 'fasteuro.tech', isActive: true, isPrivate: false },
      { id: 'euro_8', domain: 'msgeuro.pw', isActive: true, isPrivate: false },
      { id: 'euro_9', domain: 'euromsg.zone', isActive: true, isPrivate: false },
      { id: 'euro_10', domain: 'eurobox24.tech', isActive: true, isPrivate: false },
      { id: 'euro_11', domain: 'lettereuro.org', isActive: true, isPrivate: false },
      { id: 'euro_12', domain: 'eurocloud97.zone', isActive: true, isPrivate: false },
      { id: 'euro_13', domain: 'posteuro22.zone', isActive: true, isPrivate: false },
      { id: 'euro_14', domain: 'eurorelay.net', isActive: true, isPrivate: false },
      { id: 'euro_15', domain: 'dropeuro.online', isActive: true, isPrivate: false },
      { id: 'euro_16', domain: 'euroletter.co', isActive: true, isPrivate: false },
      { id: 'euro_17', domain: 'tempeuro.pw', isActive: true, isPrivate: false },
      { id: 'euro_18', domain: 'webeuro.io', isActive: true, isPrivate: false },
      { id: 'euro_19', domain: 'tempeuro.cc', isActive: true, isPrivate: false },
      { id: 'euro_20', domain: 'dropeuro98.world', isActive: true, isPrivate: false },
      { id: 'euro_21', domain: 'posteuro.cloud', isActive: true, isPrivate: false },
      { id: 'euro_22', domain: 'euromail.space', isActive: true, isPrivate: false },
      { id: 'euro_23', domain: 'cloudeuro.net', isActive: true, isPrivate: false },
      { id: 'euro_24', domain: 'hubeuro.io', isActive: true, isPrivate: false },
      { id: 'euro_25', domain: 'fasteuro.email', isActive: true, isPrivate: false },
      { id: 'euro_26', domain: 'eurohub.site', isActive: true, isPrivate: false },
      { id: 'euro_27', domain: 'eurobox.pw', isActive: true, isPrivate: false },
      { id: 'euro_28', domain: 'fasteuro.pw', isActive: true, isPrivate: false },
      { id: 'euro_29', domain: 'inboxeuro.xyz', isActive: true, isPrivate: false },
      { id: 'euro_30', domain: 'euromail.me', isActive: true, isPrivate: false },
      { id: 'euro_31', domain: 'maileuro.cloud', isActive: true, isPrivate: false },
      { id: 'euro_32', domain: 'euromsg.tech', isActive: true, isPrivate: false },
      { id: 'euro_33', domain: 'zoneeuro.site', isActive: true, isPrivate: false },
      { id: 'euro_34', domain: 'euroquick.site', isActive: true, isPrivate: false },
      { id: 'euro_35', domain: 'siteeuro.dev', isActive: true, isPrivate: false },
      { id: 'euro_36', domain: 'eurosend.live', isActive: true, isPrivate: false },
      { id: 'euro_37', domain: 'europost20.cloud', isActive: true, isPrivate: false },
      { id: 'euro_38', domain: 'gateeuro.tech', isActive: true, isPrivate: false },
      { id: 'euro_39', domain: 'eurodrop.dev', isActive: true, isPrivate: false },
      { id: 'euro_40', domain: 'maileuro.info', isActive: true, isPrivate: false },
      { id: 'euro_41', domain: 'dropeuro91.co', isActive: true, isPrivate: false },
      { id: 'euro_42', domain: 'euroweb.co', isActive: true, isPrivate: false },
      { id: 'euro_43', domain: 'eurotemp85.pw', isActive: true, isPrivate: false },
      { id: 'euro_44', domain: 'zoneeuro31.dev', isActive: true, isPrivate: false },
      { id: 'euro_45', domain: 'webeuro.cloud', isActive: true, isPrivate: false },
      { id: 'euro_46', domain: 'eurogate.net', isActive: true, isPrivate: false },
      { id: 'euro_47', domain: 'eurohub.space', isActive: true, isPrivate: false },
      { id: 'euro_48', domain: 'europost.me', isActive: true, isPrivate: false },
      { id: 'euro_49', domain: 'maileuro.com', isActive: true, isPrivate: false }
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

module.exports = EuroPool;
