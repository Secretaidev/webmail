/**
 * XyronMail - ZenPool Provider Plugin
 * Curated pool of zen domains
 */
class ZenPool {
  constructor() {
    this.name = 'zenpool';
    this.displayName = 'Zen Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'zen_0', domain: 'zenrelay75.io', isActive: true, isPrivate: false },
      { id: 'zen_1', domain: 'zenpost30.co', isActive: true, isPrivate: false },
      { id: 'zen_2', domain: 'postzen81.xyz', isActive: true, isPrivate: false },
      { id: 'zen_3', domain: 'mailzen.co', isActive: true, isPrivate: false },
      { id: 'zen_4', domain: 'netzen.net', isActive: true, isPrivate: false },
      { id: 'zen_5', domain: 'zonezen83.live', isActive: true, isPrivate: false },
      { id: 'zen_6', domain: 'netzen67.io', isActive: true, isPrivate: false },
      { id: 'zen_7', domain: 'zenfast.co', isActive: true, isPrivate: false },
      { id: 'zen_8', domain: 'zensite.email', isActive: true, isPrivate: false },
      { id: 'zen_9', domain: 'zeninbox.cloud', isActive: true, isPrivate: false },
      { id: 'zen_10', domain: 'zenbox.space', isActive: true, isPrivate: false },
      { id: 'zen_11', domain: 'zendrop.space', isActive: true, isPrivate: false },
      { id: 'zen_12', domain: 'zenzone.cloud', isActive: true, isPrivate: false },
      { id: 'zen_13', domain: 'dropzen.site', isActive: true, isPrivate: false },
      { id: 'zen_14', domain: 'zentemp.site', isActive: true, isPrivate: false },
      { id: 'zen_15', domain: 'zenhub.site', isActive: true, isPrivate: false },
      { id: 'zen_16', domain: 'zenrelay43.space', isActive: true, isPrivate: false },
      { id: 'zen_17', domain: 'zeninbox.space', isActive: true, isPrivate: false },
      { id: 'zen_18', domain: 'zenmail.world', isActive: true, isPrivate: false },
      { id: 'zen_19', domain: 'boxzen91.net', isActive: true, isPrivate: false },
      { id: 'zen_20', domain: 'letterzen.dev', isActive: true, isPrivate: false },
      { id: 'zen_21', domain: 'dropzen.pw', isActive: true, isPrivate: false },
      { id: 'zen_22', domain: 'zenletter.cc', isActive: true, isPrivate: false },
      { id: 'zen_23', domain: 'zenmail.email', isActive: true, isPrivate: false },
      { id: 'zen_24', domain: 'zenmsg.live', isActive: true, isPrivate: false },
      { id: 'zen_25', domain: 'zenzone.co', isActive: true, isPrivate: false },
      { id: 'zen_26', domain: 'dropzen.space', isActive: true, isPrivate: false },
      { id: 'zen_27', domain: 'sendzen.me', isActive: true, isPrivate: false },
      { id: 'zen_28', domain: 'tempzen.me', isActive: true, isPrivate: false },
      { id: 'zen_29', domain: 'sendzen.info', isActive: true, isPrivate: false },
      { id: 'zen_30', domain: 'relayzen.site', isActive: true, isPrivate: false },
      { id: 'zen_31', domain: 'zendrop27.live', isActive: true, isPrivate: false },
      { id: 'zen_32', domain: 'zenhub.online', isActive: true, isPrivate: false },
      { id: 'zen_33', domain: 'zendrop.dev', isActive: true, isPrivate: false },
      { id: 'zen_34', domain: 'zensend.dev', isActive: true, isPrivate: false },
      { id: 'zen_35', domain: 'zenletter.tech', isActive: true, isPrivate: false },
      { id: 'zen_36', domain: 'zeninbox.com', isActive: true, isPrivate: false },
      { id: 'zen_37', domain: 'zenbox.com', isActive: true, isPrivate: false },
      { id: 'zen_38', domain: 'zensite21.me', isActive: true, isPrivate: false },
      { id: 'zen_39', domain: 'zeninbox.org', isActive: true, isPrivate: false },
      { id: 'zen_40', domain: 'sitezen.tech', isActive: true, isPrivate: false },
      { id: 'zen_41', domain: 'sitezen39.cloud', isActive: true, isPrivate: false },
      { id: 'zen_42', domain: 'postzen.zone', isActive: true, isPrivate: false },
      { id: 'zen_43', domain: 'msgzen15.online', isActive: true, isPrivate: false },
      { id: 'zen_44', domain: 'zenfast22.cc', isActive: true, isPrivate: false },
      { id: 'zen_45', domain: 'zensite.info', isActive: true, isPrivate: false },
      { id: 'zen_46', domain: 'zenhub.io', isActive: true, isPrivate: false },
      { id: 'zen_47', domain: 'zenrelay.dev', isActive: true, isPrivate: false },
      { id: 'zen_48', domain: 'mailzen.net', isActive: true, isPrivate: false },
      { id: 'zen_49', domain: 'zenquick21.com', isActive: true, isPrivate: false }
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

module.exports = ZenPool;
