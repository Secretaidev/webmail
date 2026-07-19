/**
 * XyronMail - FirePool Provider Plugin
 * Curated pool of fire domains
 */
class FirePool {
  constructor() {
    this.name = 'firepool';
    this.displayName = 'Fire Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'fire_0', domain: 'letterfire.info', isActive: true, isPrivate: false },
      { id: 'fire_1', domain: 'firesend.co', isActive: true, isPrivate: false },
      { id: 'fire_2', domain: 'firesite.net', isActive: true, isPrivate: false },
      { id: 'fire_3', domain: 'quickfire.zone', isActive: true, isPrivate: false },
      { id: 'fire_4', domain: 'fireinbox.cloud', isActive: true, isPrivate: false },
      { id: 'fire_5', domain: 'firedrop.world', isActive: true, isPrivate: false },
      { id: 'fire_6', domain: 'boxfire.pw', isActive: true, isPrivate: false },
      { id: 'fire_7', domain: 'firefast.space', isActive: true, isPrivate: false },
      { id: 'fire_8', domain: 'zonefire.co', isActive: true, isPrivate: false },
      { id: 'fire_9', domain: 'fastfire.io', isActive: true, isPrivate: false },
      { id: 'fire_10', domain: 'gatefire.io', isActive: true, isPrivate: false },
      { id: 'fire_11', domain: 'msgfire.cc', isActive: true, isPrivate: false },
      { id: 'fire_12', domain: 'letterfire25.email', isActive: true, isPrivate: false },
      { id: 'fire_13', domain: 'firemsg.live', isActive: true, isPrivate: false },
      { id: 'fire_14', domain: 'quickfire.world', isActive: true, isPrivate: false },
      { id: 'fire_15', domain: 'firetemp.email', isActive: true, isPrivate: false },
      { id: 'fire_16', domain: 'hubfire99.io', isActive: true, isPrivate: false },
      { id: 'fire_17', domain: 'firehub.tech', isActive: true, isPrivate: false },
      { id: 'fire_18', domain: 'firehost.space', isActive: true, isPrivate: false },
      { id: 'fire_19', domain: 'hubfire.co', isActive: true, isPrivate: false },
      { id: 'fire_20', domain: 'webfire.site', isActive: true, isPrivate: false },
      { id: 'fire_21', domain: 'firesend.net', isActive: true, isPrivate: false },
      { id: 'fire_22', domain: 'firequick.cloud', isActive: true, isPrivate: false },
      { id: 'fire_23', domain: 'fireweb.co', isActive: true, isPrivate: false },
      { id: 'fire_24', domain: 'firenet.email', isActive: true, isPrivate: false },
      { id: 'fire_25', domain: 'dropfire99.xyz', isActive: true, isPrivate: false },
      { id: 'fire_26', domain: 'firenet.dev', isActive: true, isPrivate: false },
      { id: 'fire_27', domain: 'letterfire.space', isActive: true, isPrivate: false },
      { id: 'fire_28', domain: 'gatefire.cloud', isActive: true, isPrivate: false },
      { id: 'fire_29', domain: 'firecloud26.org', isActive: true, isPrivate: false },
      { id: 'fire_30', domain: 'firegate94.online', isActive: true, isPrivate: false },
      { id: 'fire_31', domain: 'firemail.io', isActive: true, isPrivate: false },
      { id: 'fire_32', domain: 'firetemp.info', isActive: true, isPrivate: false },
      { id: 'fire_33', domain: 'firegate65.email', isActive: true, isPrivate: false },
      { id: 'fire_34', domain: 'postfire.me', isActive: true, isPrivate: false },
      { id: 'fire_35', domain: 'firefast.org', isActive: true, isPrivate: false },
      { id: 'fire_36', domain: 'firedrop.co', isActive: true, isPrivate: false },
      { id: 'fire_37', domain: 'firegate.org', isActive: true, isPrivate: false },
      { id: 'fire_38', domain: 'firegate.tech', isActive: true, isPrivate: false },
      { id: 'fire_39', domain: 'hostfire.com', isActive: true, isPrivate: false },
      { id: 'fire_40', domain: 'gatefire.co', isActive: true, isPrivate: false },
      { id: 'fire_41', domain: 'mailfire.cloud', isActive: true, isPrivate: false },
      { id: 'fire_42', domain: 'webfire53.email', isActive: true, isPrivate: false },
      { id: 'fire_43', domain: 'mailfire.cc', isActive: true, isPrivate: false },
      { id: 'fire_44', domain: 'firebox.tech', isActive: true, isPrivate: false },
      { id: 'fire_45', domain: 'postfire42.cloud', isActive: true, isPrivate: false },
      { id: 'fire_46', domain: 'inboxfire.co', isActive: true, isPrivate: false },
      { id: 'fire_47', domain: 'firemsg.world', isActive: true, isPrivate: false },
      { id: 'fire_48', domain: 'fastfire.world', isActive: true, isPrivate: false },
      { id: 'fire_49', domain: 'firequick.xyz', isActive: true, isPrivate: false }
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

module.exports = FirePool;
