/**
 * XyronMail - SecurePool Provider Plugin
 * Curated pool of secure domains
 */
class SecurePool {
  constructor() {
    this.name = 'securepool';
    this.displayName = 'Secure Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'secure_0', domain: 'postsecure.co', isActive: true, isPrivate: false },
      { id: 'secure_1', domain: 'securehost.net', isActive: true, isPrivate: false },
      { id: 'secure_2', domain: 'securepost84.xyz', isActive: true, isPrivate: false },
      { id: 'secure_3', domain: 'gatesecure.dev', isActive: true, isPrivate: false },
      { id: 'secure_4', domain: 'securehub.tech', isActive: true, isPrivate: false },
      { id: 'secure_5', domain: 'securegate.online', isActive: true, isPrivate: false },
      { id: 'secure_6', domain: 'inboxsecure.net', isActive: true, isPrivate: false },
      { id: 'secure_7', domain: 'securepost.pw', isActive: true, isPrivate: false },
      { id: 'secure_8', domain: 'lettersecure.online', isActive: true, isPrivate: false },
      { id: 'secure_9', domain: 'securedrop.net', isActive: true, isPrivate: false },
      { id: 'secure_10', domain: 'relaysecure.net', isActive: true, isPrivate: false },
      { id: 'secure_11', domain: 'securetemp69.tech', isActive: true, isPrivate: false },
      { id: 'secure_12', domain: 'lettersecure.net', isActive: true, isPrivate: false },
      { id: 'secure_13', domain: 'quicksecure66.me', isActive: true, isPrivate: false },
      { id: 'secure_14', domain: 'securehost.site', isActive: true, isPrivate: false },
      { id: 'secure_15', domain: 'securemail.site', isActive: true, isPrivate: false },
      { id: 'secure_16', domain: 'inboxsecure.tech', isActive: true, isPrivate: false },
      { id: 'secure_17', domain: 'securepost.cloud', isActive: true, isPrivate: false },
      { id: 'secure_18', domain: 'lettersecure.cc', isActive: true, isPrivate: false },
      { id: 'secure_19', domain: 'mailsecure.cc', isActive: true, isPrivate: false },
      { id: 'secure_20', domain: 'lettersecure.tech', isActive: true, isPrivate: false },
      { id: 'secure_21', domain: 'mailsecure.email', isActive: true, isPrivate: false },
      { id: 'secure_22', domain: 'hostsecure.space', isActive: true, isPrivate: false },
      { id: 'secure_23', domain: 'dropsecure.tech', isActive: true, isPrivate: false },
      { id: 'secure_24', domain: 'netsecure.email', isActive: true, isPrivate: false },
      { id: 'secure_25', domain: 'secureletter.io', isActive: true, isPrivate: false },
      { id: 'secure_26', domain: 'securequick27.co', isActive: true, isPrivate: false },
      { id: 'secure_27', domain: 'relaysecure.zone', isActive: true, isPrivate: false },
      { id: 'secure_28', domain: 'tempsecure.io', isActive: true, isPrivate: false },
      { id: 'secure_29', domain: 'securemsg.email', isActive: true, isPrivate: false },
      { id: 'secure_30', domain: 'inboxsecure.xyz', isActive: true, isPrivate: false },
      { id: 'secure_31', domain: 'dropsecure.io', isActive: true, isPrivate: false },
      { id: 'secure_32', domain: 'securecloud.zone', isActive: true, isPrivate: false },
      { id: 'secure_33', domain: 'relaysecure26.world', isActive: true, isPrivate: false },
      { id: 'secure_34', domain: 'secureinbox.space', isActive: true, isPrivate: false },
      { id: 'secure_35', domain: 'securenet43.me', isActive: true, isPrivate: false },
      { id: 'secure_36', domain: 'mailsecure80.zone', isActive: true, isPrivate: false },
      { id: 'secure_37', domain: 'securerelay.site', isActive: true, isPrivate: false },
      { id: 'secure_38', domain: 'securehost61.pw', isActive: true, isPrivate: false },
      { id: 'secure_39', domain: 'securehub.com', isActive: true, isPrivate: false },
      { id: 'secure_40', domain: 'securemail.online', isActive: true, isPrivate: false },
      { id: 'secure_41', domain: 'securerelay.online', isActive: true, isPrivate: false },
      { id: 'secure_42', domain: 'hostsecure.me', isActive: true, isPrivate: false },
      { id: 'secure_43', domain: 'inboxsecure.cc', isActive: true, isPrivate: false },
      { id: 'secure_44', domain: 'secureletter.cloud', isActive: true, isPrivate: false },
      { id: 'secure_45', domain: 'fastsecure.zone', isActive: true, isPrivate: false },
      { id: 'secure_46', domain: 'boxsecure.co', isActive: true, isPrivate: false },
      { id: 'secure_47', domain: 'quicksecure.cc', isActive: true, isPrivate: false },
      { id: 'secure_48', domain: 'relaysecure.site', isActive: true, isPrivate: false },
      { id: 'secure_49', domain: 'boxsecure.info', isActive: true, isPrivate: false }
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

module.exports = SecurePool;
