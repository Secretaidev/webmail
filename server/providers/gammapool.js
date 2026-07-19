/**
 * XyronMail - GammaPool Provider Plugin
 * Curated pool of gamma domains
 */
class GammaPool {
  constructor() {
    this.name = 'gammapool';
    this.displayName = 'Gamma Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'gamma_0', domain: 'gammaletter.world', isActive: true, isPrivate: false },
      { id: 'gamma_1', domain: 'inboxgamma47.org', isActive: true, isPrivate: false },
      { id: 'gamma_2', domain: 'gammaletter.cloud', isActive: true, isPrivate: false },
      { id: 'gamma_3', domain: 'cloudgamma.site', isActive: true, isPrivate: false },
      { id: 'gamma_4', domain: 'mailgamma.space', isActive: true, isPrivate: false },
      { id: 'gamma_5', domain: 'gategamma.online', isActive: true, isPrivate: false },
      { id: 'gamma_6', domain: 'gammahub84.tech', isActive: true, isPrivate: false },
      { id: 'gamma_7', domain: 'gammamail57.cc', isActive: true, isPrivate: false },
      { id: 'gamma_8', domain: 'gammagate44.me', isActive: true, isPrivate: false },
      { id: 'gamma_9', domain: 'postgamma.cloud', isActive: true, isPrivate: false },
      { id: 'gamma_10', domain: 'gammapost.pw', isActive: true, isPrivate: false },
      { id: 'gamma_11', domain: 'gammahost62.space', isActive: true, isPrivate: false },
      { id: 'gamma_12', domain: 'tempgamma67.cloud', isActive: true, isPrivate: false },
      { id: 'gamma_13', domain: 'gammahost.io', isActive: true, isPrivate: false },
      { id: 'gamma_14', domain: 'inboxgamma.space', isActive: true, isPrivate: false },
      { id: 'gamma_15', domain: 'gammarelay.cc', isActive: true, isPrivate: false },
      { id: 'gamma_16', domain: 'gammanet.cloud', isActive: true, isPrivate: false },
      { id: 'gamma_17', domain: 'fastgamma46.pw', isActive: true, isPrivate: false },
      { id: 'gamma_18', domain: 'lettergamma.com', isActive: true, isPrivate: false },
      { id: 'gamma_19', domain: 'gammafast.live', isActive: true, isPrivate: false },
      { id: 'gamma_20', domain: 'quickgamma33.org', isActive: true, isPrivate: false },
      { id: 'gamma_21', domain: 'gammanet.site', isActive: true, isPrivate: false },
      { id: 'gamma_22', domain: 'quickgamma.cc', isActive: true, isPrivate: false },
      { id: 'gamma_23', domain: 'gammatemp60.xyz', isActive: true, isPrivate: false },
      { id: 'gamma_24', domain: 'zonegamma72.pw', isActive: true, isPrivate: false },
      { id: 'gamma_25', domain: 'msggamma.world', isActive: true, isPrivate: false },
      { id: 'gamma_26', domain: 'gammaquick64.live', isActive: true, isPrivate: false },
      { id: 'gamma_27', domain: 'gammaweb.me', isActive: true, isPrivate: false },
      { id: 'gamma_28', domain: 'msggamma.dev', isActive: true, isPrivate: false },
      { id: 'gamma_29', domain: 'gammahost.space', isActive: true, isPrivate: false },
      { id: 'gamma_30', domain: 'gammapost62.org', isActive: true, isPrivate: false },
      { id: 'gamma_31', domain: 'sendgamma76.info', isActive: true, isPrivate: false },
      { id: 'gamma_32', domain: 'gammamail.info', isActive: true, isPrivate: false },
      { id: 'gamma_33', domain: 'msggamma33.com', isActive: true, isPrivate: false },
      { id: 'gamma_34', domain: 'gammadrop.cc', isActive: true, isPrivate: false },
      { id: 'gamma_35', domain: 'boxgamma.tech', isActive: true, isPrivate: false },
      { id: 'gamma_36', domain: 'gammainbox.space', isActive: true, isPrivate: false },
      { id: 'gamma_37', domain: 'fastgamma.net', isActive: true, isPrivate: false },
      { id: 'gamma_38', domain: 'inboxgamma.live', isActive: true, isPrivate: false },
      { id: 'gamma_39', domain: 'gategamma.info', isActive: true, isPrivate: false },
      { id: 'gamma_40', domain: 'fastgamma.io', isActive: true, isPrivate: false },
      { id: 'gamma_41', domain: 'gammapost.me', isActive: true, isPrivate: false },
      { id: 'gamma_42', domain: 'gammacloud.org', isActive: true, isPrivate: false },
      { id: 'gamma_43', domain: 'gategamma.pw', isActive: true, isPrivate: false },
      { id: 'gamma_44', domain: 'lettergamma.live', isActive: true, isPrivate: false },
      { id: 'gamma_45', domain: 'gammagate.co', isActive: true, isPrivate: false },
      { id: 'gamma_46', domain: 'gammanet70.email', isActive: true, isPrivate: false },
      { id: 'gamma_47', domain: 'gammagate.com', isActive: true, isPrivate: false },
      { id: 'gamma_48', domain: 'gammarelay.zone', isActive: true, isPrivate: false },
      { id: 'gamma_49', domain: 'fastgamma.site', isActive: true, isPrivate: false }
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

module.exports = GammaPool;
