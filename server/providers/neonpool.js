/**
 * XyronMail - NeonPool Provider Plugin
 * Curated pool of neon domains
 */
class NeonPool {
  constructor() {
    this.name = 'neonpool';
    this.displayName = 'Neon Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'neon_0', domain: 'neonsend.live', isActive: true, isPrivate: false },
      { id: 'neon_1', domain: 'neondrop.site', isActive: true, isPrivate: false },
      { id: 'neon_2', domain: 'fastneon.me', isActive: true, isPrivate: false },
      { id: 'neon_3', domain: 'quickneon11.org', isActive: true, isPrivate: false },
      { id: 'neon_4', domain: 'neonfast.net', isActive: true, isPrivate: false },
      { id: 'neon_5', domain: 'msgneon28.com', isActive: true, isPrivate: false },
      { id: 'neon_6', domain: 'neoninbox65.email', isActive: true, isPrivate: false },
      { id: 'neon_7', domain: 'neonhub.tech', isActive: true, isPrivate: false },
      { id: 'neon_8', domain: 'neoninbox.tech', isActive: true, isPrivate: false },
      { id: 'neon_9', domain: 'neonnet.me', isActive: true, isPrivate: false },
      { id: 'neon_10', domain: 'neoninbox.com', isActive: true, isPrivate: false },
      { id: 'neon_11', domain: 'neonrelay.me', isActive: true, isPrivate: false },
      { id: 'neon_12', domain: 'neonletter.cc', isActive: true, isPrivate: false },
      { id: 'neon_13', domain: 'dropneon.cc', isActive: true, isPrivate: false },
      { id: 'neon_14', domain: 'neonsite.live', isActive: true, isPrivate: false },
      { id: 'neon_15', domain: 'neonhub.zone', isActive: true, isPrivate: false },
      { id: 'neon_16', domain: 'neoninbox.site', isActive: true, isPrivate: false },
      { id: 'neon_17', domain: 'neonfast.co', isActive: true, isPrivate: false },
      { id: 'neon_18', domain: 'neonsend64.dev', isActive: true, isPrivate: false },
      { id: 'neon_19', domain: 'neoncloud53.online', isActive: true, isPrivate: false },
      { id: 'neon_20', domain: 'msgneon.live', isActive: true, isPrivate: false },
      { id: 'neon_21', domain: 'neondrop.net', isActive: true, isPrivate: false },
      { id: 'neon_22', domain: 'mailneon53.info', isActive: true, isPrivate: false },
      { id: 'neon_23', domain: 'inboxneon.tech', isActive: true, isPrivate: false },
      { id: 'neon_24', domain: 'zoneneon.org', isActive: true, isPrivate: false },
      { id: 'neon_25', domain: 'neonrelay.com', isActive: true, isPrivate: false },
      { id: 'neon_26', domain: 'neonbox.dev', isActive: true, isPrivate: false },
      { id: 'neon_27', domain: 'neoninbox.cc', isActive: true, isPrivate: false },
      { id: 'neon_28', domain: 'neonpost.xyz', isActive: true, isPrivate: false },
      { id: 'neon_29', domain: 'neonfast.online', isActive: true, isPrivate: false },
      { id: 'neon_30', domain: 'neonweb46.site', isActive: true, isPrivate: false },
      { id: 'neon_31', domain: 'neonmail.online', isActive: true, isPrivate: false },
      { id: 'neon_32', domain: 'neonnet.zone', isActive: true, isPrivate: false },
      { id: 'neon_33', domain: 'neonrelay.pw', isActive: true, isPrivate: false },
      { id: 'neon_34', domain: 'hubneon.world', isActive: true, isPrivate: false },
      { id: 'neon_35', domain: 'zoneneon.email', isActive: true, isPrivate: false },
      { id: 'neon_36', domain: 'netneon19.com', isActive: true, isPrivate: false },
      { id: 'neon_37', domain: 'relayneon.world', isActive: true, isPrivate: false },
      { id: 'neon_38', domain: 'tempneon.online', isActive: true, isPrivate: false },
      { id: 'neon_39', domain: 'neonzone.dev', isActive: true, isPrivate: false },
      { id: 'neon_40', domain: 'neongate.dev', isActive: true, isPrivate: false },
      { id: 'neon_41', domain: 'neoninbox.me', isActive: true, isPrivate: false },
      { id: 'neon_42', domain: 'netneon.space', isActive: true, isPrivate: false },
      { id: 'neon_43', domain: 'postneon.site', isActive: true, isPrivate: false },
      { id: 'neon_44', domain: 'relayneon.net', isActive: true, isPrivate: false },
      { id: 'neon_45', domain: 'relayneon11.xyz', isActive: true, isPrivate: false },
      { id: 'neon_46', domain: 'neonweb.com', isActive: true, isPrivate: false },
      { id: 'neon_47', domain: 'neonquick77.xyz', isActive: true, isPrivate: false },
      { id: 'neon_48', domain: 'neonrelay.site', isActive: true, isPrivate: false },
      { id: 'neon_49', domain: 'zoneneon.co', isActive: true, isPrivate: false }
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

module.exports = NeonPool;
