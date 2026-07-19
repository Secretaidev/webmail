/**
 * XyronMail - OpalPool Provider Plugin
 * Curated pool of opal domains
 */
class OpalPool {
  constructor() {
    this.name = 'opalpool';
    this.displayName = 'Opal Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'opal_0', domain: 'opalhub.cloud', isActive: true, isPrivate: false },
      { id: 'opal_1', domain: 'opalweb.cloud', isActive: true, isPrivate: false },
      { id: 'opal_2', domain: 'tempopal.pw', isActive: true, isPrivate: false },
      { id: 'opal_3', domain: 'opalrelay.io', isActive: true, isPrivate: false },
      { id: 'opal_4', domain: 'netopal43.space', isActive: true, isPrivate: false },
      { id: 'opal_5', domain: 'mailopal.dev', isActive: true, isPrivate: false },
      { id: 'opal_6', domain: 'opaldrop.me', isActive: true, isPrivate: false },
      { id: 'opal_7', domain: 'opalsite.io', isActive: true, isPrivate: false },
      { id: 'opal_8', domain: 'fastopal.world', isActive: true, isPrivate: false },
      { id: 'opal_9', domain: 'opaldrop.zone', isActive: true, isPrivate: false },
      { id: 'opal_10', domain: 'opalsend.cloud', isActive: true, isPrivate: false },
      { id: 'opal_11', domain: 'opalcloud.world', isActive: true, isPrivate: false },
      { id: 'opal_12', domain: 'netopal.cloud', isActive: true, isPrivate: false },
      { id: 'opal_13', domain: 'tempopal.net', isActive: true, isPrivate: false },
      { id: 'opal_14', domain: 'quickopal.co', isActive: true, isPrivate: false },
      { id: 'opal_15', domain: 'opalpost.dev', isActive: true, isPrivate: false },
      { id: 'opal_16', domain: 'netopal41.info', isActive: true, isPrivate: false },
      { id: 'opal_17', domain: 'sendopal.world', isActive: true, isPrivate: false },
      { id: 'opal_18', domain: 'postopal.cc', isActive: true, isPrivate: false },
      { id: 'opal_19', domain: 'postopal.site', isActive: true, isPrivate: false },
      { id: 'opal_20', domain: 'hostopal.pw', isActive: true, isPrivate: false },
      { id: 'opal_21', domain: 'fastopal.me', isActive: true, isPrivate: false },
      { id: 'opal_22', domain: 'hubopal.cloud', isActive: true, isPrivate: false },
      { id: 'opal_23', domain: 'opalletter.me', isActive: true, isPrivate: false },
      { id: 'opal_24', domain: 'opalbox.pw', isActive: true, isPrivate: false },
      { id: 'opal_25', domain: 'fastopal.zone', isActive: true, isPrivate: false },
      { id: 'opal_26', domain: 'cloudopal.cc', isActive: true, isPrivate: false },
      { id: 'opal_27', domain: 'dropopal.com', isActive: true, isPrivate: false },
      { id: 'opal_28', domain: 'quickopal95.site', isActive: true, isPrivate: false },
      { id: 'opal_29', domain: 'msgopal.cc', isActive: true, isPrivate: false },
      { id: 'opal_30', domain: 'relayopal.co', isActive: true, isPrivate: false },
      { id: 'opal_31', domain: 'opaltemp.info', isActive: true, isPrivate: false },
      { id: 'opal_32', domain: 'postopal38.net', isActive: true, isPrivate: false },
      { id: 'opal_33', domain: 'dropopal.email', isActive: true, isPrivate: false },
      { id: 'opal_34', domain: 'opalrelay.tech', isActive: true, isPrivate: false },
      { id: 'opal_35', domain: 'opalrelay30.org', isActive: true, isPrivate: false },
      { id: 'opal_36', domain: 'opalrelay.world', isActive: true, isPrivate: false },
      { id: 'opal_37', domain: 'opalcloud.space', isActive: true, isPrivate: false },
      { id: 'opal_38', domain: 'opalsite.dev', isActive: true, isPrivate: false },
      { id: 'opal_39', domain: 'opaltemp.online', isActive: true, isPrivate: false },
      { id: 'opal_40', domain: 'opalpost.com', isActive: true, isPrivate: false },
      { id: 'opal_41', domain: 'msgopal.io', isActive: true, isPrivate: false },
      { id: 'opal_42', domain: 'boxopal.xyz', isActive: true, isPrivate: false },
      { id: 'opal_43', domain: 'opalsend.com', isActive: true, isPrivate: false },
      { id: 'opal_44', domain: 'zoneopal.space', isActive: true, isPrivate: false },
      { id: 'opal_45', domain: 'quickopal.live', isActive: true, isPrivate: false },
      { id: 'opal_46', domain: 'opalrelay.live', isActive: true, isPrivate: false },
      { id: 'opal_47', domain: 'opalfast.tech', isActive: true, isPrivate: false },
      { id: 'opal_48', domain: 'cloudopal.world', isActive: true, isPrivate: false },
      { id: 'opal_49', domain: 'opalmail.co', isActive: true, isPrivate: false }
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

module.exports = OpalPool;
