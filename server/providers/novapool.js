/**
 * XyronMail - NovaPool Provider Plugin
 * Curated pool of nova domains
 */
class NovaPool {
  constructor() {
    this.name = 'novapool';
    this.displayName = 'Nova Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'nova_0', domain: 'novainbox34.net', isActive: true, isPrivate: false },
      { id: 'nova_1', domain: 'novainbox.live', isActive: true, isPrivate: false },
      { id: 'nova_2', domain: 'webnova.tech', isActive: true, isPrivate: false },
      { id: 'nova_3', domain: 'tempnova.net', isActive: true, isPrivate: false },
      { id: 'nova_4', domain: 'novasend.net', isActive: true, isPrivate: false },
      { id: 'nova_5', domain: 'novarelay.dev', isActive: true, isPrivate: false },
      { id: 'nova_6', domain: 'zonenova.zone', isActive: true, isPrivate: false },
      { id: 'nova_7', domain: 'cloudnova66.world', isActive: true, isPrivate: false },
      { id: 'nova_8', domain: 'mailnova.net', isActive: true, isPrivate: false },
      { id: 'nova_9', domain: 'netnova.co', isActive: true, isPrivate: false },
      { id: 'nova_10', domain: 'letternova38.io', isActive: true, isPrivate: false },
      { id: 'nova_11', domain: 'novainbox.io', isActive: true, isPrivate: false },
      { id: 'nova_12', domain: 'novamail43.info', isActive: true, isPrivate: false },
      { id: 'nova_13', domain: 'msgnova.cloud', isActive: true, isPrivate: false },
      { id: 'nova_14', domain: 'novadrop.org', isActive: true, isPrivate: false },
      { id: 'nova_15', domain: 'novazone.xyz', isActive: true, isPrivate: false },
      { id: 'nova_16', domain: 'novahub.email', isActive: true, isPrivate: false },
      { id: 'nova_17', domain: 'novainbox56.info', isActive: true, isPrivate: false },
      { id: 'nova_18', domain: 'letternova.xyz', isActive: true, isPrivate: false },
      { id: 'nova_19', domain: 'novasite.io', isActive: true, isPrivate: false },
      { id: 'nova_20', domain: 'cloudnova91.pw', isActive: true, isPrivate: false },
      { id: 'nova_21', domain: 'webnova.net', isActive: true, isPrivate: false },
      { id: 'nova_22', domain: 'novarelay.me', isActive: true, isPrivate: false },
      { id: 'nova_23', domain: 'quicknova.online', isActive: true, isPrivate: false },
      { id: 'nova_24', domain: 'novabox.me', isActive: true, isPrivate: false },
      { id: 'nova_25', domain: 'webnova.space', isActive: true, isPrivate: false },
      { id: 'nova_26', domain: 'dropnova24.tech', isActive: true, isPrivate: false },
      { id: 'nova_27', domain: 'novasend.pw', isActive: true, isPrivate: false },
      { id: 'nova_28', domain: 'boxnova51.site', isActive: true, isPrivate: false },
      { id: 'nova_29', domain: 'novamsg.pw', isActive: true, isPrivate: false },
      { id: 'nova_30', domain: 'hubnova.world', isActive: true, isPrivate: false },
      { id: 'nova_31', domain: 'novamail.online', isActive: true, isPrivate: false },
      { id: 'nova_32', domain: 'novapost.site', isActive: true, isPrivate: false },
      { id: 'nova_33', domain: 'zonenova.org', isActive: true, isPrivate: false },
      { id: 'nova_34', domain: 'postnova.email', isActive: true, isPrivate: false },
      { id: 'nova_35', domain: 'novatemp.dev', isActive: true, isPrivate: false },
      { id: 'nova_36', domain: 'novaweb.com', isActive: true, isPrivate: false },
      { id: 'nova_37', domain: 'webnova.live', isActive: true, isPrivate: false },
      { id: 'nova_38', domain: 'novacloud.net', isActive: true, isPrivate: false },
      { id: 'nova_39', domain: 'novaletter.space', isActive: true, isPrivate: false },
      { id: 'nova_40', domain: 'relaynova.com', isActive: true, isPrivate: false },
      { id: 'nova_41', domain: 'novainbox.online', isActive: true, isPrivate: false },
      { id: 'nova_42', domain: 'hostnova.site', isActive: true, isPrivate: false },
      { id: 'nova_43', domain: 'msgnova.zone', isActive: true, isPrivate: false },
      { id: 'nova_44', domain: 'novaweb.net', isActive: true, isPrivate: false },
      { id: 'nova_45', domain: 'novapost63.io', isActive: true, isPrivate: false },
      { id: 'nova_46', domain: 'novazone.online', isActive: true, isPrivate: false },
      { id: 'nova_47', domain: 'mailnova.dev', isActive: true, isPrivate: false },
      { id: 'nova_48', domain: 'novamsg.dev', isActive: true, isPrivate: false },
      { id: 'nova_49', domain: 'quicknova.cc', isActive: true, isPrivate: false }
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

module.exports = NovaPool;
