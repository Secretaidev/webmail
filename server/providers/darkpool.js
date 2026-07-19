/**
 * XyronMail - DarkPool Provider Plugin
 * Curated pool of dark domains
 */
class DarkPool {
  constructor() {
    this.name = 'darkpool';
    this.displayName = 'Dark Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'dark_0', domain: 'maildark.cloud', isActive: true, isPrivate: false },
      { id: 'dark_1', domain: 'postdark.site', isActive: true, isPrivate: false },
      { id: 'dark_2', domain: 'dropdark84.site', isActive: true, isPrivate: false },
      { id: 'dark_3', domain: 'hostdark.email', isActive: true, isPrivate: false },
      { id: 'dark_4', domain: 'darkhub83.co', isActive: true, isPrivate: false },
      { id: 'dark_5', domain: 'netdark.cloud', isActive: true, isPrivate: false },
      { id: 'dark_6', domain: 'msgdark.dev', isActive: true, isPrivate: false },
      { id: 'dark_7', domain: 'darkfast.cloud', isActive: true, isPrivate: false },
      { id: 'dark_8', domain: 'darkmsg.live', isActive: true, isPrivate: false },
      { id: 'dark_9', domain: 'darkfast.co', isActive: true, isPrivate: false },
      { id: 'dark_10', domain: 'boxdark85.net', isActive: true, isPrivate: false },
      { id: 'dark_11', domain: 'darkinbox.dev', isActive: true, isPrivate: false },
      { id: 'dark_12', domain: 'boxdark.email', isActive: true, isPrivate: false },
      { id: 'dark_13', domain: 'darkmail.world', isActive: true, isPrivate: false },
      { id: 'dark_14', domain: 'webdark67.dev', isActive: true, isPrivate: false },
      { id: 'dark_15', domain: 'darkdrop.email', isActive: true, isPrivate: false },
      { id: 'dark_16', domain: 'msgdark24.online', isActive: true, isPrivate: false },
      { id: 'dark_17', domain: 'darksite.com', isActive: true, isPrivate: false },
      { id: 'dark_18', domain: 'darkweb.zone', isActive: true, isPrivate: false },
      { id: 'dark_19', domain: 'darkletter.zone', isActive: true, isPrivate: false },
      { id: 'dark_20', domain: 'darkzone.cc', isActive: true, isPrivate: false },
      { id: 'dark_21', domain: 'darktemp.dev', isActive: true, isPrivate: false },
      { id: 'dark_22', domain: 'sitedark.tech', isActive: true, isPrivate: false },
      { id: 'dark_23', domain: 'hostdark.info', isActive: true, isPrivate: false },
      { id: 'dark_24', domain: 'darkmsg.net', isActive: true, isPrivate: false },
      { id: 'dark_25', domain: 'hubdark.live', isActive: true, isPrivate: false },
      { id: 'dark_26', domain: 'webdark82.com', isActive: true, isPrivate: false },
      { id: 'dark_27', domain: 'hostdark63.zone', isActive: true, isPrivate: false },
      { id: 'dark_28', domain: 'letterdark.org', isActive: true, isPrivate: false },
      { id: 'dark_29', domain: 'darkweb.tech', isActive: true, isPrivate: false },
      { id: 'dark_30', domain: 'clouddark.cloud', isActive: true, isPrivate: false },
      { id: 'dark_31', domain: 'hostdark.xyz', isActive: true, isPrivate: false },
      { id: 'dark_32', domain: 'darksend13.space', isActive: true, isPrivate: false },
      { id: 'dark_33', domain: 'hubdark.cloud', isActive: true, isPrivate: false },
      { id: 'dark_34', domain: 'postdark.cc', isActive: true, isPrivate: false },
      { id: 'dark_35', domain: 'darkmsg.pw', isActive: true, isPrivate: false },
      { id: 'dark_36', domain: 'darkrelay.site', isActive: true, isPrivate: false },
      { id: 'dark_37', domain: 'darksend.net', isActive: true, isPrivate: false },
      { id: 'dark_38', domain: 'tempdark.com', isActive: true, isPrivate: false },
      { id: 'dark_39', domain: 'darkfast.live', isActive: true, isPrivate: false },
      { id: 'dark_40', domain: 'netdark.info', isActive: true, isPrivate: false },
      { id: 'dark_41', domain: 'darkhost.cc', isActive: true, isPrivate: false },
      { id: 'dark_42', domain: 'darkhub.org', isActive: true, isPrivate: false },
      { id: 'dark_43', domain: 'hubdark.me', isActive: true, isPrivate: false },
      { id: 'dark_44', domain: 'webdark.space', isActive: true, isPrivate: false },
      { id: 'dark_45', domain: 'letterdark.cc', isActive: true, isPrivate: false },
      { id: 'dark_46', domain: 'darkfast24.cc', isActive: true, isPrivate: false },
      { id: 'dark_47', domain: 'darkinbox.co', isActive: true, isPrivate: false },
      { id: 'dark_48', domain: 'darkdrop.me', isActive: true, isPrivate: false },
      { id: 'dark_49', domain: 'quickdark.dev', isActive: true, isPrivate: false }
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

module.exports = DarkPool;
