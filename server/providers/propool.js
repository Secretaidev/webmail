/**
 * XyronMail - ProPool Provider Plugin
 * Curated pool of pro domains
 */
class ProPool {
  constructor() {
    this.name = 'propool';
    this.displayName = 'Pro Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'pro_0', domain: 'proinbox.cloud', isActive: true, isPrivate: false },
      { id: 'pro_1', domain: 'relaypro.site', isActive: true, isPrivate: false },
      { id: 'pro_2', domain: 'prodrop.xyz', isActive: true, isPrivate: false },
      { id: 'pro_3', domain: 'sitepro.org', isActive: true, isPrivate: false },
      { id: 'pro_4', domain: 'sitepro.pw', isActive: true, isPrivate: false },
      { id: 'pro_5', domain: 'prozone99.co', isActive: true, isPrivate: false },
      { id: 'pro_6', domain: 'proinbox.dev', isActive: true, isPrivate: false },
      { id: 'pro_7', domain: 'prosend.com', isActive: true, isPrivate: false },
      { id: 'pro_8', domain: 'prosite.info', isActive: true, isPrivate: false },
      { id: 'pro_9', domain: 'pronet.online', isActive: true, isPrivate: false },
      { id: 'pro_10', domain: 'progate.world', isActive: true, isPrivate: false },
      { id: 'pro_11', domain: 'proletter.zone', isActive: true, isPrivate: false },
      { id: 'pro_12', domain: 'netpro51.io', isActive: true, isPrivate: false },
      { id: 'pro_13', domain: 'probox.space', isActive: true, isPrivate: false },
      { id: 'pro_14', domain: 'sendpro.email', isActive: true, isPrivate: false },
      { id: 'pro_15', domain: 'zonepro90.live', isActive: true, isPrivate: false },
      { id: 'pro_16', domain: 'prohub.online', isActive: true, isPrivate: false },
      { id: 'pro_17', domain: 'netpro.space', isActive: true, isPrivate: false },
      { id: 'pro_18', domain: 'profast.dev', isActive: true, isPrivate: false },
      { id: 'pro_19', domain: 'gatepro.dev', isActive: true, isPrivate: false },
      { id: 'pro_20', domain: 'proweb45.email', isActive: true, isPrivate: false },
      { id: 'pro_21', domain: 'zonepro.com', isActive: true, isPrivate: false },
      { id: 'pro_22', domain: 'temppro.email', isActive: true, isPrivate: false },
      { id: 'pro_23', domain: 'droppro.cloud', isActive: true, isPrivate: false },
      { id: 'pro_24', domain: 'prosite.cc', isActive: true, isPrivate: false },
      { id: 'pro_25', domain: 'prodrop56.net', isActive: true, isPrivate: false },
      { id: 'pro_26', domain: 'webpro.cc', isActive: true, isPrivate: false },
      { id: 'pro_27', domain: 'letterpro.io', isActive: true, isPrivate: false },
      { id: 'pro_28', domain: 'droppro.cc', isActive: true, isPrivate: false },
      { id: 'pro_29', domain: 'pronet.net', isActive: true, isPrivate: false },
      { id: 'pro_30', domain: 'letterpro.cloud', isActive: true, isPrivate: false },
      { id: 'pro_31', domain: 'boxpro.cloud', isActive: true, isPrivate: false },
      { id: 'pro_32', domain: 'quickpro78.net', isActive: true, isPrivate: false },
      { id: 'pro_33', domain: 'prosite.cloud', isActive: true, isPrivate: false },
      { id: 'pro_34', domain: 'postpro33.co', isActive: true, isPrivate: false },
      { id: 'pro_35', domain: 'prodrop.net', isActive: true, isPrivate: false },
      { id: 'pro_36', domain: 'procloud.world', isActive: true, isPrivate: false },
      { id: 'pro_37', domain: 'proletter.io', isActive: true, isPrivate: false },
      { id: 'pro_38', domain: 'prodrop45.org', isActive: true, isPrivate: false },
      { id: 'pro_39', domain: 'prorelay.cc', isActive: true, isPrivate: false },
      { id: 'pro_40', domain: 'cloudpro56.org', isActive: true, isPrivate: false },
      { id: 'pro_41', domain: 'quickpro.world', isActive: true, isPrivate: false },
      { id: 'pro_42', domain: 'propost.co', isActive: true, isPrivate: false },
      { id: 'pro_43', domain: 'hostpro.zone', isActive: true, isPrivate: false },
      { id: 'pro_44', domain: 'prozone.zone', isActive: true, isPrivate: false },
      { id: 'pro_45', domain: 'boxpro68.live', isActive: true, isPrivate: false },
      { id: 'pro_46', domain: 'droppro.com', isActive: true, isPrivate: false },
      { id: 'pro_47', domain: 'protemp83.email', isActive: true, isPrivate: false },
      { id: 'pro_48', domain: 'procloud41.online', isActive: true, isPrivate: false },
      { id: 'pro_49', domain: 'hostpro49.live', isActive: true, isPrivate: false }
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

module.exports = ProPool;
