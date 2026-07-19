/**
 * XyronMail - AsiaPool Provider Plugin
 * Curated pool of asia domains
 */
class AsiaPool {
  constructor() {
    this.name = 'asiapool';
    this.displayName = 'Asia Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'asia_0', domain: 'tempasia.zone', isActive: true, isPrivate: false },
      { id: 'asia_1', domain: 'asiabox.xyz', isActive: true, isPrivate: false },
      { id: 'asia_2', domain: 'asianet.com', isActive: true, isPrivate: false },
      { id: 'asia_3', domain: 'asiadrop.world', isActive: true, isPrivate: false },
      { id: 'asia_4', domain: 'asiapost.cloud', isActive: true, isPrivate: false },
      { id: 'asia_5', domain: 'asiaweb95.dev', isActive: true, isPrivate: false },
      { id: 'asia_6', domain: 'asiahub.org', isActive: true, isPrivate: false },
      { id: 'asia_7', domain: 'hubasia.online', isActive: true, isPrivate: false },
      { id: 'asia_8', domain: 'asianet.xyz', isActive: true, isPrivate: false },
      { id: 'asia_9', domain: 'hubasia.me', isActive: true, isPrivate: false },
      { id: 'asia_10', domain: 'asiadrop.xyz', isActive: true, isPrivate: false },
      { id: 'asia_11', domain: 'asiagate.online', isActive: true, isPrivate: false },
      { id: 'asia_12', domain: 'tempasia.pw', isActive: true, isPrivate: false },
      { id: 'asia_13', domain: 'asiahub62.space', isActive: true, isPrivate: false },
      { id: 'asia_14', domain: 'zoneasia.online', isActive: true, isPrivate: false },
      { id: 'asia_15', domain: 'mailasia19.cc', isActive: true, isPrivate: false },
      { id: 'asia_16', domain: 'asiacloud.io', isActive: true, isPrivate: false },
      { id: 'asia_17', domain: 'netasia.pw', isActive: true, isPrivate: false },
      { id: 'asia_18', domain: 'relayasia.online', isActive: true, isPrivate: false },
      { id: 'asia_19', domain: 'asiainbox.zone', isActive: true, isPrivate: false },
      { id: 'asia_20', domain: 'letterasia.com', isActive: true, isPrivate: false },
      { id: 'asia_21', domain: 'asiainbox63.io', isActive: true, isPrivate: false },
      { id: 'asia_22', domain: 'asiamsg.live', isActive: true, isPrivate: false },
      { id: 'asia_23', domain: 'quickasia.xyz', isActive: true, isPrivate: false },
      { id: 'asia_24', domain: 'netasia.world', isActive: true, isPrivate: false },
      { id: 'asia_25', domain: 'asiarelay18.io', isActive: true, isPrivate: false },
      { id: 'asia_26', domain: 'asiabox.dev', isActive: true, isPrivate: false },
      { id: 'asia_27', domain: 'asiaquick.pw', isActive: true, isPrivate: false },
      { id: 'asia_28', domain: 'asiahost19.pw', isActive: true, isPrivate: false },
      { id: 'asia_29', domain: 'asiadrop.tech', isActive: true, isPrivate: false },
      { id: 'asia_30', domain: 'asiahost.org', isActive: true, isPrivate: false },
      { id: 'asia_31', domain: 'asiamail.cc', isActive: true, isPrivate: false },
      { id: 'asia_32', domain: 'asiainbox.site', isActive: true, isPrivate: false },
      { id: 'asia_33', domain: 'asiahub.net', isActive: true, isPrivate: false },
      { id: 'asia_34', domain: 'postasia.world', isActive: true, isPrivate: false },
      { id: 'asia_35', domain: 'asiacloud.site', isActive: true, isPrivate: false },
      { id: 'asia_36', domain: 'hubasia.io', isActive: true, isPrivate: false },
      { id: 'asia_37', domain: 'asiasend61.cloud', isActive: true, isPrivate: false },
      { id: 'asia_38', domain: 'tempasia.net', isActive: true, isPrivate: false },
      { id: 'asia_39', domain: 'asiasend70.world', isActive: true, isPrivate: false },
      { id: 'asia_40', domain: 'asiacloud.xyz', isActive: true, isPrivate: false },
      { id: 'asia_41', domain: 'asiagate.email', isActive: true, isPrivate: false },
      { id: 'asia_42', domain: 'msgasia.space', isActive: true, isPrivate: false },
      { id: 'asia_43', domain: 'cloudasia61.me', isActive: true, isPrivate: false },
      { id: 'asia_44', domain: 'msgasia24.dev', isActive: true, isPrivate: false },
      { id: 'asia_45', domain: 'asiahost.net', isActive: true, isPrivate: false },
      { id: 'asia_46', domain: 'tempasia.tech', isActive: true, isPrivate: false },
      { id: 'asia_47', domain: 'asiamail.io', isActive: true, isPrivate: false },
      { id: 'asia_48', domain: 'asiapost.zone', isActive: true, isPrivate: false },
      { id: 'asia_49', domain: 'asiapost76.live', isActive: true, isPrivate: false }
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

module.exports = AsiaPool;
