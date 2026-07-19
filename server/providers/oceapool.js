/**
 * XyronMail - OceaPool Provider Plugin
 * Curated pool of ocea domains
 */
class OceaPool {
  constructor() {
    this.name = 'oceapool';
    this.displayName = 'Ocea Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'ocea_0', domain: 'webocea.zone', isActive: true, isPrivate: false },
      { id: 'ocea_1', domain: 'dropocea.cc', isActive: true, isPrivate: false },
      { id: 'ocea_2', domain: 'ocealetter.world', isActive: true, isPrivate: false },
      { id: 'ocea_3', domain: 'oceazone.zone', isActive: true, isPrivate: false },
      { id: 'ocea_4', domain: 'oceabox.live', isActive: true, isPrivate: false },
      { id: 'ocea_5', domain: 'dropocea.io', isActive: true, isPrivate: false },
      { id: 'ocea_6', domain: 'oceabox20.co', isActive: true, isPrivate: false },
      { id: 'ocea_7', domain: 'ocealetter.tech', isActive: true, isPrivate: false },
      { id: 'ocea_8', domain: 'oceanet50.live', isActive: true, isPrivate: false },
      { id: 'ocea_9', domain: 'oceatemp84.pw', isActive: true, isPrivate: false },
      { id: 'ocea_10', domain: 'oceainbox.net', isActive: true, isPrivate: false },
      { id: 'ocea_11', domain: 'oceasend.live', isActive: true, isPrivate: false },
      { id: 'ocea_12', domain: 'oceaquick.xyz', isActive: true, isPrivate: false },
      { id: 'ocea_13', domain: 'letterocea.me', isActive: true, isPrivate: false },
      { id: 'ocea_14', domain: 'oceamsg38.zone', isActive: true, isPrivate: false },
      { id: 'ocea_15', domain: 'boxocea.com', isActive: true, isPrivate: false },
      { id: 'ocea_16', domain: 'gateocea82.site', isActive: true, isPrivate: false },
      { id: 'ocea_17', domain: 'tempocea.live', isActive: true, isPrivate: false },
      { id: 'ocea_18', domain: 'sendocea.pw', isActive: true, isPrivate: false },
      { id: 'ocea_19', domain: 'oceamail.space', isActive: true, isPrivate: false },
      { id: 'ocea_20', domain: 'oceainbox.co', isActive: true, isPrivate: false },
      { id: 'ocea_21', domain: 'ocearelay.site', isActive: true, isPrivate: false },
      { id: 'ocea_22', domain: 'sendocea.info', isActive: true, isPrivate: false },
      { id: 'ocea_23', domain: 'quickocea.zone', isActive: true, isPrivate: false },
      { id: 'ocea_24', domain: 'oceanet.info', isActive: true, isPrivate: false },
      { id: 'ocea_25', domain: 'hubocea.dev', isActive: true, isPrivate: false },
      { id: 'ocea_26', domain: 'oceazone.tech', isActive: true, isPrivate: false },
      { id: 'ocea_27', domain: 'oceahost.cc', isActive: true, isPrivate: false },
      { id: 'ocea_28', domain: 'oceatemp.co', isActive: true, isPrivate: false },
      { id: 'ocea_29', domain: 'zoneocea.xyz', isActive: true, isPrivate: false },
      { id: 'ocea_30', domain: 'oceatemp.net', isActive: true, isPrivate: false },
      { id: 'ocea_31', domain: 'oceatemp.email', isActive: true, isPrivate: false },
      { id: 'ocea_32', domain: 'oceainbox96.cloud', isActive: true, isPrivate: false },
      { id: 'ocea_33', domain: 'oceadrop.dev', isActive: true, isPrivate: false },
      { id: 'ocea_34', domain: 'cloudocea.tech', isActive: true, isPrivate: false },
      { id: 'ocea_35', domain: 'gateocea.net', isActive: true, isPrivate: false },
      { id: 'ocea_36', domain: 'quickocea.me', isActive: true, isPrivate: false },
      { id: 'ocea_37', domain: 'netocea.xyz', isActive: true, isPrivate: false },
      { id: 'ocea_38', domain: 'tempocea.zone', isActive: true, isPrivate: false },
      { id: 'ocea_39', domain: 'oceaquick.space', isActive: true, isPrivate: false },
      { id: 'ocea_40', domain: 'webocea.world', isActive: true, isPrivate: false },
      { id: 'ocea_41', domain: 'oceaquick.org', isActive: true, isPrivate: false },
      { id: 'ocea_42', domain: 'oceagate.me', isActive: true, isPrivate: false },
      { id: 'ocea_43', domain: 'boxocea.xyz', isActive: true, isPrivate: false },
      { id: 'ocea_44', domain: 'letterocea.net', isActive: true, isPrivate: false },
      { id: 'ocea_45', domain: 'oceagate.com', isActive: true, isPrivate: false },
      { id: 'ocea_46', domain: 'ocealetter.xyz', isActive: true, isPrivate: false },
      { id: 'ocea_47', domain: 'cloudocea.pw', isActive: true, isPrivate: false },
      { id: 'ocea_48', domain: 'oceadrop80.dev', isActive: true, isPrivate: false },
      { id: 'ocea_49', domain: 'letterocea.zone', isActive: true, isPrivate: false }
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

module.exports = OceaPool;
