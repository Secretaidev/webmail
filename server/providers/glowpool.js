/**
 * XyronMail - GlowPool Provider Plugin
 * Curated pool of glow domains
 */
class GlowPool {
  constructor() {
    this.name = 'glowpool';
    this.displayName = 'Glow Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'glow_0', domain: 'hubglow79.world', isActive: true, isPrivate: false },
      { id: 'glow_1', domain: 'sendglow.io', isActive: true, isPrivate: false },
      { id: 'glow_2', domain: 'glowcloud.dev', isActive: true, isPrivate: false },
      { id: 'glow_3', domain: 'glowpost.net', isActive: true, isPrivate: false },
      { id: 'glow_4', domain: 'relayglow.zone', isActive: true, isPrivate: false },
      { id: 'glow_5', domain: 'glowrelay.co', isActive: true, isPrivate: false },
      { id: 'glow_6', domain: 'glowweb.info', isActive: true, isPrivate: false },
      { id: 'glow_7', domain: 'fastglow.me', isActive: true, isPrivate: false },
      { id: 'glow_8', domain: 'glowcloud.info', isActive: true, isPrivate: false },
      { id: 'glow_9', domain: 'glowpost.zone', isActive: true, isPrivate: false },
      { id: 'glow_10', domain: 'glowquick.pw', isActive: true, isPrivate: false },
      { id: 'glow_11', domain: 'glowfast90.net', isActive: true, isPrivate: false },
      { id: 'glow_12', domain: 'fastglow.cloud', isActive: true, isPrivate: false },
      { id: 'glow_13', domain: 'glowmail.world', isActive: true, isPrivate: false },
      { id: 'glow_14', domain: 'glownet.tech', isActive: true, isPrivate: false },
      { id: 'glow_15', domain: 'webglow.cc', isActive: true, isPrivate: false },
      { id: 'glow_16', domain: 'tempglow.co', isActive: true, isPrivate: false },
      { id: 'glow_17', domain: 'siteglow.pw', isActive: true, isPrivate: false },
      { id: 'glow_18', domain: 'glowmsg.me', isActive: true, isPrivate: false },
      { id: 'glow_19', domain: 'cloudglow.cc', isActive: true, isPrivate: false },
      { id: 'glow_20', domain: 'glowhub.cc', isActive: true, isPrivate: false },
      { id: 'glow_21', domain: 'gateglow.space', isActive: true, isPrivate: false },
      { id: 'glow_22', domain: 'glowmsg.live', isActive: true, isPrivate: false },
      { id: 'glow_23', domain: 'glowmail.space', isActive: true, isPrivate: false },
      { id: 'glow_24', domain: 'inboxglow.co', isActive: true, isPrivate: false },
      { id: 'glow_25', domain: 'glowpost.world', isActive: true, isPrivate: false },
      { id: 'glow_26', domain: 'relayglow63.online', isActive: true, isPrivate: false },
      { id: 'glow_27', domain: 'glowcloud.xyz', isActive: true, isPrivate: false },
      { id: 'glow_28', domain: 'inboxglow.zone', isActive: true, isPrivate: false },
      { id: 'glow_29', domain: 'postglow.space', isActive: true, isPrivate: false },
      { id: 'glow_30', domain: 'glowweb.cc', isActive: true, isPrivate: false },
      { id: 'glow_31', domain: 'glowsite.live', isActive: true, isPrivate: false },
      { id: 'glow_32', domain: 'glowletter.com', isActive: true, isPrivate: false },
      { id: 'glow_33', domain: 'sendglow.tech', isActive: true, isPrivate: false },
      { id: 'glow_34', domain: 'glowbox.tech', isActive: true, isPrivate: false },
      { id: 'glow_35', domain: 'boxglow.site', isActive: true, isPrivate: false },
      { id: 'glow_36', domain: 'glowrelay61.co', isActive: true, isPrivate: false },
      { id: 'glow_37', domain: 'msgglow.me', isActive: true, isPrivate: false },
      { id: 'glow_38', domain: 'netglow.pw', isActive: true, isPrivate: false },
      { id: 'glow_39', domain: 'zoneglow.space', isActive: true, isPrivate: false },
      { id: 'glow_40', domain: 'glowinbox.xyz', isActive: true, isPrivate: false },
      { id: 'glow_41', domain: 'webglow.co', isActive: true, isPrivate: false },
      { id: 'glow_42', domain: 'glowhub.world', isActive: true, isPrivate: false },
      { id: 'glow_43', domain: 'gateglow.zone', isActive: true, isPrivate: false },
      { id: 'glow_44', domain: 'webglow.net', isActive: true, isPrivate: false },
      { id: 'glow_45', domain: 'netglow.info', isActive: true, isPrivate: false },
      { id: 'glow_46', domain: 'quickglow63.cc', isActive: true, isPrivate: false },
      { id: 'glow_47', domain: 'boxglow.email', isActive: true, isPrivate: false },
      { id: 'glow_48', domain: 'postglow41.org', isActive: true, isPrivate: false },
      { id: 'glow_49', domain: 'gateglow22.cloud', isActive: true, isPrivate: false }
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

module.exports = GlowPool;
