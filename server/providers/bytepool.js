/**
 * XyronMail - BytePool Provider Plugin
 * Curated pool of byte domains
 */
class BytePool {
  constructor() {
    this.name = 'bytepool';
    this.displayName = 'Byte Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'byte_0', domain: 'quickbyte.cc', isActive: true, isPrivate: false },
      { id: 'byte_1', domain: 'bytetemp.info', isActive: true, isPrivate: false },
      { id: 'byte_2', domain: 'msgbyte.space', isActive: true, isPrivate: false },
      { id: 'byte_3', domain: 'gatebyte49.cc', isActive: true, isPrivate: false },
      { id: 'byte_4', domain: 'byteweb.pw', isActive: true, isPrivate: false },
      { id: 'byte_5', domain: 'bytefast73.zone', isActive: true, isPrivate: false },
      { id: 'byte_6', domain: 'quickbyte97.org', isActive: true, isPrivate: false },
      { id: 'byte_7', domain: 'byteinbox.co', isActive: true, isPrivate: false },
      { id: 'byte_8', domain: 'hubbyte.space', isActive: true, isPrivate: false },
      { id: 'byte_9', domain: 'bytemail.com', isActive: true, isPrivate: false },
      { id: 'byte_10', domain: 'tempbyte.co', isActive: true, isPrivate: false },
      { id: 'byte_11', domain: 'bytesite.info', isActive: true, isPrivate: false },
      { id: 'byte_12', domain: 'bytemail.co', isActive: true, isPrivate: false },
      { id: 'byte_13', domain: 'bytecloud25.net', isActive: true, isPrivate: false },
      { id: 'byte_14', domain: 'bytebox.site', isActive: true, isPrivate: false },
      { id: 'byte_15', domain: 'bytetemp79.cc', isActive: true, isPrivate: false },
      { id: 'byte_16', domain: 'bytemsg.xyz', isActive: true, isPrivate: false },
      { id: 'byte_17', domain: 'bytedrop.xyz', isActive: true, isPrivate: false },
      { id: 'byte_18', domain: 'hubbyte.org', isActive: true, isPrivate: false },
      { id: 'byte_19', domain: 'boxbyte.net', isActive: true, isPrivate: false },
      { id: 'byte_20', domain: 'bytesend.org', isActive: true, isPrivate: false },
      { id: 'byte_21', domain: 'postbyte.cc', isActive: true, isPrivate: false },
      { id: 'byte_22', domain: 'gatebyte.co', isActive: true, isPrivate: false },
      { id: 'byte_23', domain: 'netbyte.org', isActive: true, isPrivate: false },
      { id: 'byte_24', domain: 'hubbyte27.cc', isActive: true, isPrivate: false },
      { id: 'byte_25', domain: 'byteletter.world', isActive: true, isPrivate: false },
      { id: 'byte_26', domain: 'sendbyte.com', isActive: true, isPrivate: false },
      { id: 'byte_27', domain: 'bytebox.dev', isActive: true, isPrivate: false },
      { id: 'byte_28', domain: 'bytefast.tech', isActive: true, isPrivate: false },
      { id: 'byte_29', domain: 'bytebox.email', isActive: true, isPrivate: false },
      { id: 'byte_30', domain: 'bytecloud.co', isActive: true, isPrivate: false },
      { id: 'byte_31', domain: 'byteletter.dev', isActive: true, isPrivate: false },
      { id: 'byte_32', domain: 'boxbyte.online', isActive: true, isPrivate: false },
      { id: 'byte_33', domain: 'mailbyte.zone', isActive: true, isPrivate: false },
      { id: 'byte_34', domain: 'bytesend54.cloud', isActive: true, isPrivate: false },
      { id: 'byte_35', domain: 'byteweb35.zone', isActive: true, isPrivate: false },
      { id: 'byte_36', domain: 'tempbyte.cc', isActive: true, isPrivate: false },
      { id: 'byte_37', domain: 'bytenet.io', isActive: true, isPrivate: false },
      { id: 'byte_38', domain: 'letterbyte.cc', isActive: true, isPrivate: false },
      { id: 'byte_39', domain: 'msgbyte34.co', isActive: true, isPrivate: false },
      { id: 'byte_40', domain: 'msgbyte.dev', isActive: true, isPrivate: false },
      { id: 'byte_41', domain: 'sendbyte.me', isActive: true, isPrivate: false },
      { id: 'byte_42', domain: 'inboxbyte.cloud', isActive: true, isPrivate: false },
      { id: 'byte_43', domain: 'bytehub.net', isActive: true, isPrivate: false },
      { id: 'byte_44', domain: 'hostbyte.xyz', isActive: true, isPrivate: false },
      { id: 'byte_45', domain: 'hostbyte.net', isActive: true, isPrivate: false },
      { id: 'byte_46', domain: 'bytefast.world', isActive: true, isPrivate: false },
      { id: 'byte_47', domain: 'byterelay.email', isActive: true, isPrivate: false },
      { id: 'byte_48', domain: 'sendbyte.io', isActive: true, isPrivate: false },
      { id: 'byte_49', domain: 'webbyte62.zone', isActive: true, isPrivate: false }
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

module.exports = BytePool;
