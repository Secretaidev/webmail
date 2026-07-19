/**
 * XyronMail - DevPool Provider Plugin
 * Curated pool of dev domains
 */
class DevPool {
  constructor() {
    this.name = 'devpool';
    this.displayName = 'Dev Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'dev_0', domain: 'gatedev41.world', isActive: true, isPrivate: false },
      { id: 'dev_1', domain: 'devinbox38.net', isActive: true, isPrivate: false },
      { id: 'dev_2', domain: 'senddev.pw', isActive: true, isPrivate: false },
      { id: 'dev_3', domain: 'maildev.email', isActive: true, isPrivate: false },
      { id: 'dev_4', domain: 'devhub.tech', isActive: true, isPrivate: false },
      { id: 'dev_5', domain: 'devquick.online', isActive: true, isPrivate: false },
      { id: 'dev_6', domain: 'sitedev.pw', isActive: true, isPrivate: false },
      { id: 'dev_7', domain: 'devmail.info', isActive: true, isPrivate: false },
      { id: 'dev_8', domain: 'devbox.org', isActive: true, isPrivate: false },
      { id: 'dev_9', domain: 'gatedev.pw', isActive: true, isPrivate: false },
      { id: 'dev_10', domain: 'clouddev.online', isActive: true, isPrivate: false },
      { id: 'dev_11', domain: 'devmsg.io', isActive: true, isPrivate: false },
      { id: 'dev_12', domain: 'sitedev.zone', isActive: true, isPrivate: false },
      { id: 'dev_13', domain: 'devpost18.site', isActive: true, isPrivate: false },
      { id: 'dev_14', domain: 'devzone.dev', isActive: true, isPrivate: false },
      { id: 'dev_15', domain: 'relaydev.online', isActive: true, isPrivate: false },
      { id: 'dev_16', domain: 'devcloud83.live', isActive: true, isPrivate: false },
      { id: 'dev_17', domain: 'boxdev.live', isActive: true, isPrivate: false },
      { id: 'dev_18', domain: 'hubdev.email', isActive: true, isPrivate: false },
      { id: 'dev_19', domain: 'devrelay20.io', isActive: true, isPrivate: false },
      { id: 'dev_20', domain: 'sitedev.live', isActive: true, isPrivate: false },
      { id: 'dev_21', domain: 'inboxdev.zone', isActive: true, isPrivate: false },
      { id: 'dev_22', domain: 'postdev.world', isActive: true, isPrivate: false },
      { id: 'dev_23', domain: 'dropdev19.dev', isActive: true, isPrivate: false },
      { id: 'dev_24', domain: 'inboxdev.cc', isActive: true, isPrivate: false },
      { id: 'dev_25', domain: 'gatedev.email', isActive: true, isPrivate: false },
      { id: 'dev_26', domain: 'hostdev.org', isActive: true, isPrivate: false },
      { id: 'dev_27', domain: 'fastdev.site', isActive: true, isPrivate: false },
      { id: 'dev_28', domain: 'tempdev.com', isActive: true, isPrivate: false },
      { id: 'dev_29', domain: 'devsite.cc', isActive: true, isPrivate: false },
      { id: 'dev_30', domain: 'devsite.org', isActive: true, isPrivate: false },
      { id: 'dev_31', domain: 'inboxdev.dev', isActive: true, isPrivate: false },
      { id: 'dev_32', domain: 'devquick.world', isActive: true, isPrivate: false },
      { id: 'dev_33', domain: 'hubdev.dev', isActive: true, isPrivate: false },
      { id: 'dev_34', domain: 'fastdev.co', isActive: true, isPrivate: false },
      { id: 'dev_35', domain: 'fastdev12.io', isActive: true, isPrivate: false },
      { id: 'dev_36', domain: 'devfast35.info', isActive: true, isPrivate: false },
      { id: 'dev_37', domain: 'senddev.com', isActive: true, isPrivate: false },
      { id: 'dev_38', domain: 'boxdev.cc', isActive: true, isPrivate: false },
      { id: 'dev_39', domain: 'dropdev34.online', isActive: true, isPrivate: false },
      { id: 'dev_40', domain: 'devinbox.cc', isActive: true, isPrivate: false },
      { id: 'dev_41', domain: 'devhost.site', isActive: true, isPrivate: false },
      { id: 'dev_42', domain: 'devmsg.co', isActive: true, isPrivate: false },
      { id: 'dev_43', domain: 'msgdev56.live', isActive: true, isPrivate: false },
      { id: 'dev_44', domain: 'hostdev.cloud', isActive: true, isPrivate: false },
      { id: 'dev_45', domain: 'devtemp64.cc', isActive: true, isPrivate: false },
      { id: 'dev_46', domain: 'hostdev20.live', isActive: true, isPrivate: false },
      { id: 'dev_47', domain: 'devsend.cloud', isActive: true, isPrivate: false },
      { id: 'dev_48', domain: 'devdrop.me', isActive: true, isPrivate: false },
      { id: 'dev_49', domain: 'devmail29.tech', isActive: true, isPrivate: false }
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

module.exports = DevPool;
