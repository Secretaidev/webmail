/**
 * XyronMail - CodePool Provider Plugin
 * Curated pool of code domains
 */
class CodePool {
  constructor() {
    this.name = 'codepool';
    this.displayName = 'Code Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'code_0', domain: 'hubcode.zone', isActive: true, isPrivate: false },
      { id: 'code_1', domain: 'codetemp.live', isActive: true, isPrivate: false },
      { id: 'code_2', domain: 'msgcode.net', isActive: true, isPrivate: false },
      { id: 'code_3', domain: 'codequick.tech', isActive: true, isPrivate: false },
      { id: 'code_4', domain: 'postcode.zone', isActive: true, isPrivate: false },
      { id: 'code_5', domain: 'codeinbox.cc', isActive: true, isPrivate: false },
      { id: 'code_6', domain: 'codepost.zone', isActive: true, isPrivate: false },
      { id: 'code_7', domain: 'codemsg77.co', isActive: true, isPrivate: false },
      { id: 'code_8', domain: 'codetemp58.site', isActive: true, isPrivate: false },
      { id: 'code_9', domain: 'sendcode36.live', isActive: true, isPrivate: false },
      { id: 'code_10', domain: 'fastcode.tech', isActive: true, isPrivate: false },
      { id: 'code_11', domain: 'netcode.dev', isActive: true, isPrivate: false },
      { id: 'code_12', domain: 'codebox.tech', isActive: true, isPrivate: false },
      { id: 'code_13', domain: 'codepost.net', isActive: true, isPrivate: false },
      { id: 'code_14', domain: 'codezone66.email', isActive: true, isPrivate: false },
      { id: 'code_15', domain: 'codecloud.cloud', isActive: true, isPrivate: false },
      { id: 'code_16', domain: 'hostcode.cloud', isActive: true, isPrivate: false },
      { id: 'code_17', domain: 'inboxcode.xyz', isActive: true, isPrivate: false },
      { id: 'code_18', domain: 'codecloud.org', isActive: true, isPrivate: false },
      { id: 'code_19', domain: 'relaycode.com', isActive: true, isPrivate: false },
      { id: 'code_20', domain: 'codedrop95.cc', isActive: true, isPrivate: false },
      { id: 'code_21', domain: 'cloudcode73.cc', isActive: true, isPrivate: false },
      { id: 'code_22', domain: 'codetemp59.org', isActive: true, isPrivate: false },
      { id: 'code_23', domain: 'gatecode28.email', isActive: true, isPrivate: false },
      { id: 'code_24', domain: 'fastcode.dev', isActive: true, isPrivate: false },
      { id: 'code_25', domain: 'webcode.org', isActive: true, isPrivate: false },
      { id: 'code_26', domain: 'netcode72.me', isActive: true, isPrivate: false },
      { id: 'code_27', domain: 'codesend72.world', isActive: true, isPrivate: false },
      { id: 'code_28', domain: 'hostcode.me', isActive: true, isPrivate: false },
      { id: 'code_29', domain: 'cloudcode.co', isActive: true, isPrivate: false },
      { id: 'code_30', domain: 'hostcode.dev', isActive: true, isPrivate: false },
      { id: 'code_31', domain: 'sitecode38.dev', isActive: true, isPrivate: false },
      { id: 'code_32', domain: 'codegate.com', isActive: true, isPrivate: false },
      { id: 'code_33', domain: 'codeletter86.pw', isActive: true, isPrivate: false },
      { id: 'code_34', domain: 'lettercode16.cc', isActive: true, isPrivate: false },
      { id: 'code_35', domain: 'lettercode82.live', isActive: true, isPrivate: false },
      { id: 'code_36', domain: 'codefast.net', isActive: true, isPrivate: false },
      { id: 'code_37', domain: 'fastcode52.com', isActive: true, isPrivate: false },
      { id: 'code_38', domain: 'sitecode.cc', isActive: true, isPrivate: false },
      { id: 'code_39', domain: 'codemail26.zone', isActive: true, isPrivate: false },
      { id: 'code_40', domain: 'lettercode.cloud', isActive: true, isPrivate: false },
      { id: 'code_41', domain: 'codecloud.net', isActive: true, isPrivate: false },
      { id: 'code_42', domain: 'zonecode.com', isActive: true, isPrivate: false },
      { id: 'code_43', domain: 'codemail.online', isActive: true, isPrivate: false },
      { id: 'code_44', domain: 'fastcode82.me', isActive: true, isPrivate: false },
      { id: 'code_45', domain: 'fastcode.zone', isActive: true, isPrivate: false },
      { id: 'code_46', domain: 'cloudcode68.com', isActive: true, isPrivate: false },
      { id: 'code_47', domain: 'codegate18.online', isActive: true, isPrivate: false },
      { id: 'code_48', domain: 'coderelay.cc', isActive: true, isPrivate: false },
      { id: 'code_49', domain: 'codesite.live', isActive: true, isPrivate: false }
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

module.exports = CodePool;
