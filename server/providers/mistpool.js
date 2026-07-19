/**
 * XyronMail - MistPool Provider Plugin
 * Curated pool of mist domains
 */
class MistPool {
  constructor() {
    this.name = 'mistpool';
    this.displayName = 'Mist Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'mist_0', domain: 'boxmist86.com', isActive: true, isPrivate: false },
      { id: 'mist_1', domain: 'gatemist40.co', isActive: true, isPrivate: false },
      { id: 'mist_2', domain: 'lettermist93.live', isActive: true, isPrivate: false },
      { id: 'mist_3', domain: 'netmist.cc', isActive: true, isPrivate: false },
      { id: 'mist_4', domain: 'mistcloud.tech', isActive: true, isPrivate: false },
      { id: 'mist_5', domain: 'hostmist78.io', isActive: true, isPrivate: false },
      { id: 'mist_6', domain: 'netmist.online', isActive: true, isPrivate: false },
      { id: 'mist_7', domain: 'webmist23.tech', isActive: true, isPrivate: false },
      { id: 'mist_8', domain: 'webmist86.dev', isActive: true, isPrivate: false },
      { id: 'mist_9', domain: 'misthub39.tech', isActive: true, isPrivate: false },
      { id: 'mist_10', domain: 'mistmail.online', isActive: true, isPrivate: false },
      { id: 'mist_11', domain: 'boxmist.com', isActive: true, isPrivate: false },
      { id: 'mist_12', domain: 'mistmsg58.cloud', isActive: true, isPrivate: false },
      { id: 'mist_13', domain: 'quickmist.dev', isActive: true, isPrivate: false },
      { id: 'mist_14', domain: 'mistbox.tech', isActive: true, isPrivate: false },
      { id: 'mist_15', domain: 'gatemist.site', isActive: true, isPrivate: false },
      { id: 'mist_16', domain: 'sendmist.site', isActive: true, isPrivate: false },
      { id: 'mist_17', domain: 'mistbox.info', isActive: true, isPrivate: false },
      { id: 'mist_18', domain: 'mistinbox.net', isActive: true, isPrivate: false },
      { id: 'mist_19', domain: 'mistsite.dev', isActive: true, isPrivate: false },
      { id: 'mist_20', domain: 'zonemist65.site', isActive: true, isPrivate: false },
      { id: 'mist_21', domain: 'mistletter.com', isActive: true, isPrivate: false },
      { id: 'mist_22', domain: 'sendmist.online', isActive: true, isPrivate: false },
      { id: 'mist_23', domain: 'sitemist.email', isActive: true, isPrivate: false },
      { id: 'mist_24', domain: 'relaymist.org', isActive: true, isPrivate: false },
      { id: 'mist_25', domain: 'sitemist.pw', isActive: true, isPrivate: false },
      { id: 'mist_26', domain: 'mistmsg.world', isActive: true, isPrivate: false },
      { id: 'mist_27', domain: 'cloudmist.pw', isActive: true, isPrivate: false },
      { id: 'mist_28', domain: 'lettermist.io', isActive: true, isPrivate: false },
      { id: 'mist_29', domain: 'dropmist.space', isActive: true, isPrivate: false },
      { id: 'mist_30', domain: 'relaymist.io', isActive: true, isPrivate: false },
      { id: 'mist_31', domain: 'mailmist15.world', isActive: true, isPrivate: false },
      { id: 'mist_32', domain: 'mistcloud65.cc', isActive: true, isPrivate: false },
      { id: 'mist_33', domain: 'mistsite.live', isActive: true, isPrivate: false },
      { id: 'mist_34', domain: 'relaymist.cc', isActive: true, isPrivate: false },
      { id: 'mist_35', domain: 'misttemp.com', isActive: true, isPrivate: false },
      { id: 'mist_36', domain: 'mistsite.tech', isActive: true, isPrivate: false },
      { id: 'mist_37', domain: 'mistnet.zone', isActive: true, isPrivate: false },
      { id: 'mist_38', domain: 'mistrelay.info', isActive: true, isPrivate: false },
      { id: 'mist_39', domain: 'mistmsg.com', isActive: true, isPrivate: false },
      { id: 'mist_40', domain: 'misttemp.info', isActive: true, isPrivate: false },
      { id: 'mist_41', domain: 'hubmist.dev', isActive: true, isPrivate: false },
      { id: 'mist_42', domain: 'mistquick.space', isActive: true, isPrivate: false },
      { id: 'mist_43', domain: 'mistrelay.io', isActive: true, isPrivate: false },
      { id: 'mist_44', domain: 'sitemist.org', isActive: true, isPrivate: false },
      { id: 'mist_45', domain: 'zonemist.info', isActive: true, isPrivate: false },
      { id: 'mist_46', domain: 'mistinbox.cc', isActive: true, isPrivate: false },
      { id: 'mist_47', domain: 'mistgate.site', isActive: true, isPrivate: false },
      { id: 'mist_48', domain: 'mistdrop.dev', isActive: true, isPrivate: false },
      { id: 'mist_49', domain: 'mistrelay72.com', isActive: true, isPrivate: false }
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

module.exports = MistPool;
