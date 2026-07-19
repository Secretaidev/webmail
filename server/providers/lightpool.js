/**
 * XyronMail - LightPool Provider Plugin
 * Curated pool of light domains
 */
class LightPool {
  constructor() {
    this.name = 'lightpool';
    this.displayName = 'Light Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'light_0', domain: 'lightpost.com', isActive: true, isPrivate: false },
      { id: 'light_1', domain: 'lightletter.world', isActive: true, isPrivate: false },
      { id: 'light_2', domain: 'quicklight.tech', isActive: true, isPrivate: false },
      { id: 'light_3', domain: 'lightgate.site', isActive: true, isPrivate: false },
      { id: 'light_4', domain: 'lighttemp.world', isActive: true, isPrivate: false },
      { id: 'light_5', domain: 'droplight18.xyz', isActive: true, isPrivate: false },
      { id: 'light_6', domain: 'lightmail.co', isActive: true, isPrivate: false },
      { id: 'light_7', domain: 'lightsend.xyz', isActive: true, isPrivate: false },
      { id: 'light_8', domain: 'quicklight14.dev', isActive: true, isPrivate: false },
      { id: 'light_9', domain: 'lightsend95.me', isActive: true, isPrivate: false },
      { id: 'light_10', domain: 'sitelight77.me', isActive: true, isPrivate: false },
      { id: 'light_11', domain: 'lightinbox.com', isActive: true, isPrivate: false },
      { id: 'light_12', domain: 'lightzone29.io', isActive: true, isPrivate: false },
      { id: 'light_13', domain: 'lighthost90.com', isActive: true, isPrivate: false },
      { id: 'light_14', domain: 'lightbox.info', isActive: true, isPrivate: false },
      { id: 'light_15', domain: 'postlight.me', isActive: true, isPrivate: false },
      { id: 'light_16', domain: 'lightmail.online', isActive: true, isPrivate: false },
      { id: 'light_17', domain: 'sitelight.org', isActive: true, isPrivate: false },
      { id: 'light_18', domain: 'gatelight.pw', isActive: true, isPrivate: false },
      { id: 'light_19', domain: 'lightletter.zone', isActive: true, isPrivate: false },
      { id: 'light_20', domain: 'lightfast.site', isActive: true, isPrivate: false },
      { id: 'light_21', domain: 'hublight.dev', isActive: true, isPrivate: false },
      { id: 'light_22', domain: 'lightweb.pw', isActive: true, isPrivate: false },
      { id: 'light_23', domain: 'lightgate.online', isActive: true, isPrivate: false },
      { id: 'light_24', domain: 'templight.cloud', isActive: true, isPrivate: false },
      { id: 'light_25', domain: 'lightquick69.world', isActive: true, isPrivate: false },
      { id: 'light_26', domain: 'netlight.site', isActive: true, isPrivate: false },
      { id: 'light_27', domain: 'lightfast76.tech', isActive: true, isPrivate: false },
      { id: 'light_28', domain: 'sitelight.pw', isActive: true, isPrivate: false },
      { id: 'light_29', domain: 'netlight.com', isActive: true, isPrivate: false },
      { id: 'light_30', domain: 'cloudlight.dev', isActive: true, isPrivate: false },
      { id: 'light_31', domain: 'lightinbox.info', isActive: true, isPrivate: false },
      { id: 'light_32', domain: 'boxlight.org', isActive: true, isPrivate: false },
      { id: 'light_33', domain: 'cloudlight.pw', isActive: true, isPrivate: false },
      { id: 'light_34', domain: 'lightrelay.space', isActive: true, isPrivate: false },
      { id: 'light_35', domain: 'lightsend.com', isActive: true, isPrivate: false },
      { id: 'light_36', domain: 'letterlight.online', isActive: true, isPrivate: false },
      { id: 'light_37', domain: 'lightweb.net', isActive: true, isPrivate: false },
      { id: 'light_38', domain: 'weblight.com', isActive: true, isPrivate: false },
      { id: 'light_39', domain: 'gatelight.email', isActive: true, isPrivate: false },
      { id: 'light_40', domain: 'hostlight.online', isActive: true, isPrivate: false },
      { id: 'light_41', domain: 'lightsite.tech', isActive: true, isPrivate: false },
      { id: 'light_42', domain: 'quicklight20.net', isActive: true, isPrivate: false },
      { id: 'light_43', domain: 'lightpost14.me', isActive: true, isPrivate: false },
      { id: 'light_44', domain: 'gatelight.com', isActive: true, isPrivate: false },
      { id: 'light_45', domain: 'lightbox.me', isActive: true, isPrivate: false },
      { id: 'light_46', domain: 'lighttemp.net', isActive: true, isPrivate: false },
      { id: 'light_47', domain: 'letterlight.me', isActive: true, isPrivate: false },
      { id: 'light_48', domain: 'sitelight.email', isActive: true, isPrivate: false },
      { id: 'light_49', domain: 'sitelight.info', isActive: true, isPrivate: false }
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

module.exports = LightPool;
