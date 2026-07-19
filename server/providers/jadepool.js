/**
 * XyronMail - JadePool Provider Plugin
 * Curated pool of jade domains
 */
class JadePool {
  constructor() {
    this.name = 'jadepool';
    this.displayName = 'Jade Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'jade_0', domain: 'fastjade.org', isActive: true, isPrivate: false },
      { id: 'jade_1', domain: 'jadesite.com', isActive: true, isPrivate: false },
      { id: 'jade_2', domain: 'jadequick.info', isActive: true, isPrivate: false },
      { id: 'jade_3', domain: 'fastjade.email', isActive: true, isPrivate: false },
      { id: 'jade_4', domain: 'tempjade.world', isActive: true, isPrivate: false },
      { id: 'jade_5', domain: 'dropjade.email', isActive: true, isPrivate: false },
      { id: 'jade_6', domain: 'mailjade.email', isActive: true, isPrivate: false },
      { id: 'jade_7', domain: 'jadesite.net', isActive: true, isPrivate: false },
      { id: 'jade_8', domain: 'relayjade.cloud', isActive: true, isPrivate: false },
      { id: 'jade_9', domain: 'jademsg.online', isActive: true, isPrivate: false },
      { id: 'jade_10', domain: 'webjade.cloud', isActive: true, isPrivate: false },
      { id: 'jade_11', domain: 'jadehub.me', isActive: true, isPrivate: false },
      { id: 'jade_12', domain: 'gatejade78.pw', isActive: true, isPrivate: false },
      { id: 'jade_13', domain: 'zonejade.com', isActive: true, isPrivate: false },
      { id: 'jade_14', domain: 'quickjade.zone', isActive: true, isPrivate: false },
      { id: 'jade_15', domain: 'jadeweb.cc', isActive: true, isPrivate: false },
      { id: 'jade_16', domain: 'jadenet.com', isActive: true, isPrivate: false },
      { id: 'jade_17', domain: 'sitejade.xyz', isActive: true, isPrivate: false },
      { id: 'jade_18', domain: 'jadeletter.site', isActive: true, isPrivate: false },
      { id: 'jade_19', domain: 'jadetemp.org', isActive: true, isPrivate: false },
      { id: 'jade_20', domain: 'boxjade.site', isActive: true, isPrivate: false },
      { id: 'jade_21', domain: 'jadefast.zone', isActive: true, isPrivate: false },
      { id: 'jade_22', domain: 'jaderelay97.net', isActive: true, isPrivate: false },
      { id: 'jade_23', domain: 'jademail.net', isActive: true, isPrivate: false },
      { id: 'jade_24', domain: 'jadeinbox.tech', isActive: true, isPrivate: false },
      { id: 'jade_25', domain: 'boxjade.email', isActive: true, isPrivate: false },
      { id: 'jade_26', domain: 'jadehub.cc', isActive: true, isPrivate: false },
      { id: 'jade_27', domain: 'jadeweb.io', isActive: true, isPrivate: false },
      { id: 'jade_28', domain: 'relayjade.live', isActive: true, isPrivate: false },
      { id: 'jade_29', domain: 'jadehost.online', isActive: true, isPrivate: false },
      { id: 'jade_30', domain: 'netjade.cc', isActive: true, isPrivate: false },
      { id: 'jade_31', domain: 'jadesend.info', isActive: true, isPrivate: false },
      { id: 'jade_32', domain: 'tempjade.xyz', isActive: true, isPrivate: false },
      { id: 'jade_33', domain: 'jadehost.cc', isActive: true, isPrivate: false },
      { id: 'jade_34', domain: 'jadehost.dev', isActive: true, isPrivate: false },
      { id: 'jade_35', domain: 'boxjade51.dev', isActive: true, isPrivate: false },
      { id: 'jade_36', domain: 'jadecloud40.tech', isActive: true, isPrivate: false },
      { id: 'jade_37', domain: 'tempjade.com', isActive: true, isPrivate: false },
      { id: 'jade_38', domain: 'jadefast.pw', isActive: true, isPrivate: false },
      { id: 'jade_39', domain: 'tempjade.cloud', isActive: true, isPrivate: false },
      { id: 'jade_40', domain: 'jadesite.io', isActive: true, isPrivate: false },
      { id: 'jade_41', domain: 'jaderelay.com', isActive: true, isPrivate: false },
      { id: 'jade_42', domain: 'msgjade54.info', isActive: true, isPrivate: false },
      { id: 'jade_43', domain: 'gatejade.info', isActive: true, isPrivate: false },
      { id: 'jade_44', domain: 'jademsg56.tech', isActive: true, isPrivate: false },
      { id: 'jade_45', domain: 'jadehub.world', isActive: true, isPrivate: false },
      { id: 'jade_46', domain: 'mailjade.info', isActive: true, isPrivate: false },
      { id: 'jade_47', domain: 'jademail.io', isActive: true, isPrivate: false },
      { id: 'jade_48', domain: 'boxjade.world', isActive: true, isPrivate: false },
      { id: 'jade_49', domain: 'dropjade.dev', isActive: true, isPrivate: false }
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

module.exports = JadePool;
