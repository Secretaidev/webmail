/**
 * XyronMail - FastPool Provider Plugin
 * Curated pool of fast domains
 */
class FastPool {
  constructor() {
    this.name = 'fastpool';
    this.displayName = 'Fast Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'fast_0', domain: 'fastmail.net', isActive: true, isPrivate: false },
      { id: 'fast_1', domain: 'fastnet.site', isActive: true, isPrivate: false },
      { id: 'fast_2', domain: 'fastpost23.net', isActive: true, isPrivate: false },
      { id: 'fast_3', domain: 'fastletter.io', isActive: true, isPrivate: false },
      { id: 'fast_4', domain: 'fastzone37.live', isActive: true, isPrivate: false },
      { id: 'fast_5', domain: 'fastcloud.me', isActive: true, isPrivate: false },
      { id: 'fast_6', domain: 'fastcloud.site', isActive: true, isPrivate: false },
      { id: 'fast_7', domain: 'dropfast.tech', isActive: true, isPrivate: false },
      { id: 'fast_8', domain: 'fastweb.net', isActive: true, isPrivate: false },
      { id: 'fast_9', domain: 'fastnet.cloud', isActive: true, isPrivate: false },
      { id: 'fast_10', domain: 'gatefast.pw', isActive: true, isPrivate: false },
      { id: 'fast_11', domain: 'msgfast.online', isActive: true, isPrivate: false },
      { id: 'fast_12', domain: 'sendfast.co', isActive: true, isPrivate: false },
      { id: 'fast_13', domain: 'fastbox.co', isActive: true, isPrivate: false },
      { id: 'fast_14', domain: 'fastletter.space', isActive: true, isPrivate: false },
      { id: 'fast_15', domain: 'letterfast76.me', isActive: true, isPrivate: false },
      { id: 'fast_16', domain: 'hubfast.cc', isActive: true, isPrivate: false },
      { id: 'fast_17', domain: 'sendfast35.tech', isActive: true, isPrivate: false },
      { id: 'fast_18', domain: 'cloudfast.site', isActive: true, isPrivate: false },
      { id: 'fast_19', domain: 'fastbox.live', isActive: true, isPrivate: false },
      { id: 'fast_20', domain: 'msgfast.tech', isActive: true, isPrivate: false },
      { id: 'fast_21', domain: 'sendfast.email', isActive: true, isPrivate: false },
      { id: 'fast_22', domain: 'fastdrop.cloud', isActive: true, isPrivate: false },
      { id: 'fast_23', domain: 'fastsite.xyz', isActive: true, isPrivate: false },
      { id: 'fast_24', domain: 'fastbox.world', isActive: true, isPrivate: false },
      { id: 'fast_25', domain: 'fastzone.online', isActive: true, isPrivate: false },
      { id: 'fast_26', domain: 'sitefast54.net', isActive: true, isPrivate: false },
      { id: 'fast_27', domain: 'relayfast.net', isActive: true, isPrivate: false },
      { id: 'fast_28', domain: 'letterfast10.live', isActive: true, isPrivate: false },
      { id: 'fast_29', domain: 'quickfast.com', isActive: true, isPrivate: false },
      { id: 'fast_30', domain: 'hubfast70.com', isActive: true, isPrivate: false },
      { id: 'fast_31', domain: 'cloudfast.me', isActive: true, isPrivate: false },
      { id: 'fast_32', domain: 'fastfast.zone', isActive: true, isPrivate: false },
      { id: 'fast_33', domain: 'fastinbox.io', isActive: true, isPrivate: false },
      { id: 'fast_34', domain: 'zonefast15.io', isActive: true, isPrivate: false },
      { id: 'fast_35', domain: 'fastzone.zone', isActive: true, isPrivate: false },
      { id: 'fast_36', domain: 'quickfast.co', isActive: true, isPrivate: false },
      { id: 'fast_37', domain: 'fastpost.info', isActive: true, isPrivate: false },
      { id: 'fast_38', domain: 'fasthub.space', isActive: true, isPrivate: false },
      { id: 'fast_39', domain: 'fastinbox.cc', isActive: true, isPrivate: false },
      { id: 'fast_40', domain: 'fastfast.dev', isActive: true, isPrivate: false },
      { id: 'fast_41', domain: 'fastzone94.net', isActive: true, isPrivate: false },
      { id: 'fast_42', domain: 'sitefast.live', isActive: true, isPrivate: false },
      { id: 'fast_43', domain: 'cloudfast.cloud', isActive: true, isPrivate: false },
      { id: 'fast_44', domain: 'cloudfast.world', isActive: true, isPrivate: false },
      { id: 'fast_45', domain: 'fastcloud36.com', isActive: true, isPrivate: false },
      { id: 'fast_46', domain: 'relayfast.zone', isActive: true, isPrivate: false },
      { id: 'fast_47', domain: 'letterfast.cloud', isActive: true, isPrivate: false },
      { id: 'fast_48', domain: 'fastrelay.space', isActive: true, isPrivate: false },
      { id: 'fast_49', domain: 'cloudfast.co', isActive: true, isPrivate: false }
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

module.exports = FastPool;
