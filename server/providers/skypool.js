/**
 * XyronMail - SkyPool Provider Plugin
 * Curated pool of sky domains
 */
class SkyPool {
  constructor() {
    this.name = 'skypool';
    this.displayName = 'Sky Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'sky_0', domain: 'skydrop.cloud', isActive: true, isPrivate: false },
      { id: 'sky_1', domain: 'cloudsky42.net', isActive: true, isPrivate: false },
      { id: 'sky_2', domain: 'boxsky18.me', isActive: true, isPrivate: false },
      { id: 'sky_3', domain: 'tempsky45.org', isActive: true, isPrivate: false },
      { id: 'sky_4', domain: 'skyletter23.cc', isActive: true, isPrivate: false },
      { id: 'sky_5', domain: 'skymsg.cloud', isActive: true, isPrivate: false },
      { id: 'sky_6', domain: 'skysite.world', isActive: true, isPrivate: false },
      { id: 'sky_7', domain: 'sendsky.email', isActive: true, isPrivate: false },
      { id: 'sky_8', domain: 'inboxsky.cloud', isActive: true, isPrivate: false },
      { id: 'sky_9', domain: 'mailsky70.org', isActive: true, isPrivate: false },
      { id: 'sky_10', domain: 'skybox53.com', isActive: true, isPrivate: false },
      { id: 'sky_11', domain: 'hostsky.org', isActive: true, isPrivate: false },
      { id: 'sky_12', domain: 'skysite61.space', isActive: true, isPrivate: false },
      { id: 'sky_13', domain: 'zonesky.cc', isActive: true, isPrivate: false },
      { id: 'sky_14', domain: 'skyweb.online', isActive: true, isPrivate: false },
      { id: 'sky_15', domain: 'lettersky.co', isActive: true, isPrivate: false },
      { id: 'sky_16', domain: 'quicksky.cloud', isActive: true, isPrivate: false },
      { id: 'sky_17', domain: 'hubsky.xyz', isActive: true, isPrivate: false },
      { id: 'sky_18', domain: 'lettersky.cc', isActive: true, isPrivate: false },
      { id: 'sky_19', domain: 'skymail.email', isActive: true, isPrivate: false },
      { id: 'sky_20', domain: 'skybox.cc', isActive: true, isPrivate: false },
      { id: 'sky_21', domain: 'skysite.space', isActive: true, isPrivate: false },
      { id: 'sky_22', domain: 'skyletter.dev', isActive: true, isPrivate: false },
      { id: 'sky_23', domain: 'quicksky.site', isActive: true, isPrivate: false },
      { id: 'sky_24', domain: 'skysend.online', isActive: true, isPrivate: false },
      { id: 'sky_25', domain: 'hubsky.net', isActive: true, isPrivate: false },
      { id: 'sky_26', domain: 'skybox.me', isActive: true, isPrivate: false },
      { id: 'sky_27', domain: 'msgsky45.tech', isActive: true, isPrivate: false },
      { id: 'sky_28', domain: 'mailsky93.email', isActive: true, isPrivate: false },
      { id: 'sky_29', domain: 'dropsky.online', isActive: true, isPrivate: false },
      { id: 'sky_30', domain: 'skyrelay.co', isActive: true, isPrivate: false },
      { id: 'sky_31', domain: 'skygate61.dev', isActive: true, isPrivate: false },
      { id: 'sky_32', domain: 'skyletter.space', isActive: true, isPrivate: false },
      { id: 'sky_33', domain: 'skyhost.cloud', isActive: true, isPrivate: false },
      { id: 'sky_34', domain: 'inboxsky.dev', isActive: true, isPrivate: false },
      { id: 'sky_35', domain: 'msgsky.cloud', isActive: true, isPrivate: false },
      { id: 'sky_36', domain: 'skysend.email', isActive: true, isPrivate: false },
      { id: 'sky_37', domain: 'skyinbox.world', isActive: true, isPrivate: false },
      { id: 'sky_38', domain: 'fastsky.dev', isActive: true, isPrivate: false },
      { id: 'sky_39', domain: 'quicksky.cc', isActive: true, isPrivate: false },
      { id: 'sky_40', domain: 'fastsky.xyz', isActive: true, isPrivate: false },
      { id: 'sky_41', domain: 'cloudsky.pw', isActive: true, isPrivate: false },
      { id: 'sky_42', domain: 'fastsky.email', isActive: true, isPrivate: false },
      { id: 'sky_43', domain: 'relaysky.email', isActive: true, isPrivate: false },
      { id: 'sky_44', domain: 'relaysky.pw', isActive: true, isPrivate: false },
      { id: 'sky_45', domain: 'skyzone.online', isActive: true, isPrivate: false },
      { id: 'sky_46', domain: 'hostsky34.live', isActive: true, isPrivate: false },
      { id: 'sky_47', domain: 'hostsky36.org', isActive: true, isPrivate: false },
      { id: 'sky_48', domain: 'fastsky.me', isActive: true, isPrivate: false },
      { id: 'sky_49', domain: 'websky.tech', isActive: true, isPrivate: false }
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

module.exports = SkyPool;
