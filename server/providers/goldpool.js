/**
 * XyronMail - GoldPool Provider Plugin
 * Curated pool of gold domains
 */
class GoldPool {
  constructor() {
    this.name = 'goldpool';
    this.displayName = 'Gold Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'gold_0', domain: 'fastgold.online', isActive: true, isPrivate: false },
      { id: 'gold_1', domain: 'goldletter.online', isActive: true, isPrivate: false },
      { id: 'gold_2', domain: 'lettergold.site', isActive: true, isPrivate: false },
      { id: 'gold_3', domain: 'goldfast.net', isActive: true, isPrivate: false },
      { id: 'gold_4', domain: 'goldnet11.world', isActive: true, isPrivate: false },
      { id: 'gold_5', domain: 'gategold.email', isActive: true, isPrivate: false },
      { id: 'gold_6', domain: 'goldfast.site', isActive: true, isPrivate: false },
      { id: 'gold_7', domain: 'dropgold.world', isActive: true, isPrivate: false },
      { id: 'gold_8', domain: 'tempgold.cc', isActive: true, isPrivate: false },
      { id: 'gold_9', domain: 'goldnet.site', isActive: true, isPrivate: false },
      { id: 'gold_10', domain: 'cloudgold.io', isActive: true, isPrivate: false },
      { id: 'gold_11', domain: 'mailgold.net', isActive: true, isPrivate: false },
      { id: 'gold_12', domain: 'mailgold.site', isActive: true, isPrivate: false },
      { id: 'gold_13', domain: 'goldsite.cloud', isActive: true, isPrivate: false },
      { id: 'gold_14', domain: 'webgold.io', isActive: true, isPrivate: false },
      { id: 'gold_15', domain: 'goldtemp.me', isActive: true, isPrivate: false },
      { id: 'gold_16', domain: 'postgold84.tech', isActive: true, isPrivate: false },
      { id: 'gold_17', domain: 'goldcloud.net', isActive: true, isPrivate: false },
      { id: 'gold_18', domain: 'sitegold21.cc', isActive: true, isPrivate: false },
      { id: 'gold_19', domain: 'goldtemp.org', isActive: true, isPrivate: false },
      { id: 'gold_20', domain: 'dropgold.cloud', isActive: true, isPrivate: false },
      { id: 'gold_21', domain: 'sendgold.dev', isActive: true, isPrivate: false },
      { id: 'gold_22', domain: 'gategold.net', isActive: true, isPrivate: false },
      { id: 'gold_23', domain: 'goldletter.site', isActive: true, isPrivate: false },
      { id: 'gold_24', domain: 'msggold.live', isActive: true, isPrivate: false },
      { id: 'gold_25', domain: 'zonegold.tech', isActive: true, isPrivate: false },
      { id: 'gold_26', domain: 'hostgold.space', isActive: true, isPrivate: false },
      { id: 'gold_27', domain: 'goldfast.io', isActive: true, isPrivate: false },
      { id: 'gold_28', domain: 'goldsend.tech', isActive: true, isPrivate: false },
      { id: 'gold_29', domain: 'relaygold.info', isActive: true, isPrivate: false },
      { id: 'gold_30', domain: 'goldsite.cc', isActive: true, isPrivate: false },
      { id: 'gold_31', domain: 'postgold.net', isActive: true, isPrivate: false },
      { id: 'gold_32', domain: 'quickgold39.io', isActive: true, isPrivate: false },
      { id: 'gold_33', domain: 'tempgold.world', isActive: true, isPrivate: false },
      { id: 'gold_34', domain: 'dropgold.tech', isActive: true, isPrivate: false },
      { id: 'gold_35', domain: 'goldsend13.io', isActive: true, isPrivate: false },
      { id: 'gold_36', domain: 'goldsend65.cloud', isActive: true, isPrivate: false },
      { id: 'gold_37', domain: 'hostgold.cloud', isActive: true, isPrivate: false },
      { id: 'gold_38', domain: 'goldrelay.world', isActive: true, isPrivate: false },
      { id: 'gold_39', domain: 'fastgold.pw', isActive: true, isPrivate: false },
      { id: 'gold_40', domain: 'goldweb.net', isActive: true, isPrivate: false },
      { id: 'gold_41', domain: 'mailgold.me', isActive: true, isPrivate: false },
      { id: 'gold_42', domain: 'goldletter.zone', isActive: true, isPrivate: false },
      { id: 'gold_43', domain: 'golddrop.com', isActive: true, isPrivate: false },
      { id: 'gold_44', domain: 'fastgold43.pw', isActive: true, isPrivate: false },
      { id: 'gold_45', domain: 'goldletter.live', isActive: true, isPrivate: false },
      { id: 'gold_46', domain: 'sitegold.pw', isActive: true, isPrivate: false },
      { id: 'gold_47', domain: 'goldinbox.cc', isActive: true, isPrivate: false },
      { id: 'gold_48', domain: 'cloudgold.dev', isActive: true, isPrivate: false },
      { id: 'gold_49', domain: 'goldrelay.cloud', isActive: true, isPrivate: false }
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

module.exports = GoldPool;
