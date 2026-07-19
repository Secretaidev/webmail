/**
 * XyronMail - DropPool Provider Plugin
 * Curated pool of drop domains
 */
class DropPool {
  constructor() {
    this.name = 'droppool';
    this.displayName = 'Drop Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'drop_0', domain: 'drophost.world', isActive: true, isPrivate: false },
      { id: 'drop_1', domain: 'dropcloud.online', isActive: true, isPrivate: false },
      { id: 'drop_2', domain: 'senddrop.org', isActive: true, isPrivate: false },
      { id: 'drop_3', domain: 'fastdrop.io', isActive: true, isPrivate: false },
      { id: 'drop_4', domain: 'droprelay20.cloud', isActive: true, isPrivate: false },
      { id: 'drop_5', domain: 'netdrop.dev', isActive: true, isPrivate: false },
      { id: 'drop_6', domain: 'postdrop.io', isActive: true, isPrivate: false },
      { id: 'drop_7', domain: 'hubdrop.info', isActive: true, isPrivate: false },
      { id: 'drop_8', domain: 'maildrop.xyz', isActive: true, isPrivate: false },
      { id: 'drop_9', domain: 'dropinbox49.com', isActive: true, isPrivate: false },
      { id: 'drop_10', domain: 'dropdrop.zone', isActive: true, isPrivate: false },
      { id: 'drop_11', domain: 'dropnet.com', isActive: true, isPrivate: false },
      { id: 'drop_12', domain: 'zonedrop.me', isActive: true, isPrivate: false },
      { id: 'drop_13', domain: 'hubdrop.live', isActive: true, isPrivate: false },
      { id: 'drop_14', domain: 'senddrop.dev', isActive: true, isPrivate: false },
      { id: 'drop_15', domain: 'quickdrop.email', isActive: true, isPrivate: false },
      { id: 'drop_16', domain: 'droptemp.info', isActive: true, isPrivate: false },
      { id: 'drop_17', domain: 'dropnet.site', isActive: true, isPrivate: false },
      { id: 'drop_18', domain: 'droprelay.cloud', isActive: true, isPrivate: false },
      { id: 'drop_19', domain: 'dropmsg.org', isActive: true, isPrivate: false },
      { id: 'drop_20', domain: 'clouddrop75.org', isActive: true, isPrivate: false },
      { id: 'drop_21', domain: 'webdrop29.cc', isActive: true, isPrivate: false },
      { id: 'drop_22', domain: 'boxdrop93.online', isActive: true, isPrivate: false },
      { id: 'drop_23', domain: 'letterdrop.io', isActive: true, isPrivate: false },
      { id: 'drop_24', domain: 'relaydrop.net', isActive: true, isPrivate: false },
      { id: 'drop_25', domain: 'zonedrop.com', isActive: true, isPrivate: false },
      { id: 'drop_26', domain: 'dropsend.email', isActive: true, isPrivate: false },
      { id: 'drop_27', domain: 'dropsend.net', isActive: true, isPrivate: false },
      { id: 'drop_28', domain: 'maildrop.org', isActive: true, isPrivate: false },
      { id: 'drop_29', domain: 'relaydrop.online', isActive: true, isPrivate: false },
      { id: 'drop_30', domain: 'drophost.io', isActive: true, isPrivate: false },
      { id: 'drop_31', domain: 'postdrop.net', isActive: true, isPrivate: false },
      { id: 'drop_32', domain: 'zonedrop.space', isActive: true, isPrivate: false },
      { id: 'drop_33', domain: 'drophub.io', isActive: true, isPrivate: false },
      { id: 'drop_34', domain: 'dropgate.com', isActive: true, isPrivate: false },
      { id: 'drop_35', domain: 'msgdrop.xyz', isActive: true, isPrivate: false },
      { id: 'drop_36', domain: 'postdrop.me', isActive: true, isPrivate: false },
      { id: 'drop_37', domain: 'drophub.cloud', isActive: true, isPrivate: false },
      { id: 'drop_38', domain: 'relaydrop69.me', isActive: true, isPrivate: false },
      { id: 'drop_39', domain: 'hostdrop89.net', isActive: true, isPrivate: false },
      { id: 'drop_40', domain: 'dropmsg.com', isActive: true, isPrivate: false },
      { id: 'drop_41', domain: 'dropcloud.xyz', isActive: true, isPrivate: false },
      { id: 'drop_42', domain: 'dropmail.io', isActive: true, isPrivate: false },
      { id: 'drop_43', domain: 'boxdrop85.xyz', isActive: true, isPrivate: false },
      { id: 'drop_44', domain: 'dropinbox.zone', isActive: true, isPrivate: false },
      { id: 'drop_45', domain: 'droptemp.me', isActive: true, isPrivate: false },
      { id: 'drop_46', domain: 'droprelay.zone', isActive: true, isPrivate: false },
      { id: 'drop_47', domain: 'maildrop.zone', isActive: true, isPrivate: false },
      { id: 'drop_48', domain: 'dropletter.pw', isActive: true, isPrivate: false },
      { id: 'drop_49', domain: 'dropmail.dev', isActive: true, isPrivate: false }
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

module.exports = DropPool;
