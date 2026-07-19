/**
 * XyronMail - QuickPool Provider Plugin
 * Curated pool of quick domains
 */
class QuickPool {
  constructor() {
    this.name = 'quickpool';
    this.displayName = 'Quick Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'quick_0', domain: 'dropquick99.net', isActive: true, isPrivate: false },
      { id: 'quick_1', domain: 'relayquick.xyz', isActive: true, isPrivate: false },
      { id: 'quick_2', domain: 'sitequick12.me', isActive: true, isPrivate: false },
      { id: 'quick_3', domain: 'hostquick.org', isActive: true, isPrivate: false },
      { id: 'quick_4', domain: 'quickmsg74.tech', isActive: true, isPrivate: false },
      { id: 'quick_5', domain: 'sitequick.co', isActive: true, isPrivate: false },
      { id: 'quick_6', domain: 'sendquick.site', isActive: true, isPrivate: false },
      { id: 'quick_7', domain: 'webquick.me', isActive: true, isPrivate: false },
      { id: 'quick_8', domain: 'msgquick.com', isActive: true, isPrivate: false },
      { id: 'quick_9', domain: 'quickmail.zone', isActive: true, isPrivate: false },
      { id: 'quick_10', domain: 'dropquick.co', isActive: true, isPrivate: false },
      { id: 'quick_11', domain: 'hostquick.online', isActive: true, isPrivate: false },
      { id: 'quick_12', domain: 'quicknet.cc', isActive: true, isPrivate: false },
      { id: 'quick_13', domain: 'quicksend.pw', isActive: true, isPrivate: false },
      { id: 'quick_14', domain: 'gatequick.space', isActive: true, isPrivate: false },
      { id: 'quick_15', domain: 'quicknet.xyz', isActive: true, isPrivate: false },
      { id: 'quick_16', domain: 'quicksite.email', isActive: true, isPrivate: false },
      { id: 'quick_17', domain: 'fastquick.live', isActive: true, isPrivate: false },
      { id: 'quick_18', domain: 'quickgate.org', isActive: true, isPrivate: false },
      { id: 'quick_19', domain: 'tempquick.io', isActive: true, isPrivate: false },
      { id: 'quick_20', domain: 'quicknet.io', isActive: true, isPrivate: false },
      { id: 'quick_21', domain: 'quickgate.pw', isActive: true, isPrivate: false },
      { id: 'quick_22', domain: 'letterquick.net', isActive: true, isPrivate: false },
      { id: 'quick_23', domain: 'quickinbox33.world', isActive: true, isPrivate: false },
      { id: 'quick_24', domain: 'quickpost.cloud', isActive: true, isPrivate: false },
      { id: 'quick_25', domain: 'hostquick.space', isActive: true, isPrivate: false },
      { id: 'quick_26', domain: 'quickletter.net', isActive: true, isPrivate: false },
      { id: 'quick_27', domain: 'cloudquick.me', isActive: true, isPrivate: false },
      { id: 'quick_28', domain: 'quickweb.org', isActive: true, isPrivate: false },
      { id: 'quick_29', domain: 'cloudquick54.space', isActive: true, isPrivate: false },
      { id: 'quick_30', domain: 'quickrelay.cc', isActive: true, isPrivate: false },
      { id: 'quick_31', domain: 'quickhub16.com', isActive: true, isPrivate: false },
      { id: 'quick_32', domain: 'quickletter57.info', isActive: true, isPrivate: false },
      { id: 'quick_33', domain: 'quickdrop.tech', isActive: true, isPrivate: false },
      { id: 'quick_34', domain: 'quickquick.dev', isActive: true, isPrivate: false },
      { id: 'quick_35', domain: 'hostquick.xyz', isActive: true, isPrivate: false },
      { id: 'quick_36', domain: 'quickcloud.me', isActive: true, isPrivate: false },
      { id: 'quick_37', domain: 'quickpost39.info', isActive: true, isPrivate: false },
      { id: 'quick_38', domain: 'quickmail.email', isActive: true, isPrivate: false },
      { id: 'quick_39', domain: 'quicktemp.me', isActive: true, isPrivate: false },
      { id: 'quick_40', domain: 'quickdrop.co', isActive: true, isPrivate: false },
      { id: 'quick_41', domain: 'quickquick.pw', isActive: true, isPrivate: false },
      { id: 'quick_42', domain: 'webquick.live', isActive: true, isPrivate: false },
      { id: 'quick_43', domain: 'quickbox.xyz', isActive: true, isPrivate: false },
      { id: 'quick_44', domain: 'quickquick.io', isActive: true, isPrivate: false },
      { id: 'quick_45', domain: 'quickquick96.cc', isActive: true, isPrivate: false },
      { id: 'quick_46', domain: 'quickcloud.online', isActive: true, isPrivate: false },
      { id: 'quick_47', domain: 'quickrelay.zone', isActive: true, isPrivate: false },
      { id: 'quick_48', domain: 'quickzone.net', isActive: true, isPrivate: false },
      { id: 'quick_49', domain: 'quickmsg33.space', isActive: true, isPrivate: false }
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

module.exports = QuickPool;
