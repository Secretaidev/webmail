/**
 * XyronMail - CorePool Provider Plugin
 * Curated pool of core domains
 */
class CorePool {
  constructor() {
    this.name = 'corepool';
    this.displayName = 'Core Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'core_0', domain: 'webcore.cc', isActive: true, isPrivate: false },
      { id: 'core_1', domain: 'coremail.xyz', isActive: true, isPrivate: false },
      { id: 'core_2', domain: 'zonecore46.email', isActive: true, isPrivate: false },
      { id: 'core_3', domain: 'corerelay.site', isActive: true, isPrivate: false },
      { id: 'core_4', domain: 'coreweb.cloud', isActive: true, isPrivate: false },
      { id: 'core_5', domain: 'coresite.xyz', isActive: true, isPrivate: false },
      { id: 'core_6', domain: 'sendcore23.net', isActive: true, isPrivate: false },
      { id: 'core_7', domain: 'coreinbox.io', isActive: true, isPrivate: false },
      { id: 'core_8', domain: 'tempcore.email', isActive: true, isPrivate: false },
      { id: 'core_9', domain: 'coremail17.world', isActive: true, isPrivate: false },
      { id: 'core_10', domain: 'fastcore.tech', isActive: true, isPrivate: false },
      { id: 'core_11', domain: 'webcore66.tech', isActive: true, isPrivate: false },
      { id: 'core_12', domain: 'inboxcore.com', isActive: true, isPrivate: false },
      { id: 'core_13', domain: 'coreletter.site', isActive: true, isPrivate: false },
      { id: 'core_14', domain: 'corezone.xyz', isActive: true, isPrivate: false },
      { id: 'core_15', domain: 'relaycore.me', isActive: true, isPrivate: false },
      { id: 'core_16', domain: 'coreweb.io', isActive: true, isPrivate: false },
      { id: 'core_17', domain: 'coreletter35.info', isActive: true, isPrivate: false },
      { id: 'core_18', domain: 'quickcore.cloud', isActive: true, isPrivate: false },
      { id: 'core_19', domain: 'tempcore.online', isActive: true, isPrivate: false },
      { id: 'core_20', domain: 'relaycore49.space', isActive: true, isPrivate: false },
      { id: 'core_21', domain: 'msgcore.me', isActive: true, isPrivate: false },
      { id: 'core_22', domain: 'inboxcore.net', isActive: true, isPrivate: false },
      { id: 'core_23', domain: 'corenet.me', isActive: true, isPrivate: false },
      { id: 'core_24', domain: 'corehost.online', isActive: true, isPrivate: false },
      { id: 'core_25', domain: 'cloudcore.email', isActive: true, isPrivate: false },
      { id: 'core_26', domain: 'quickcore.pw', isActive: true, isPrivate: false },
      { id: 'core_27', domain: 'corefast.xyz', isActive: true, isPrivate: false },
      { id: 'core_28', domain: 'corecloud.co', isActive: true, isPrivate: false },
      { id: 'core_29', domain: 'coretemp.org', isActive: true, isPrivate: false },
      { id: 'core_30', domain: 'corepost43.live', isActive: true, isPrivate: false },
      { id: 'core_31', domain: 'coretemp.pw', isActive: true, isPrivate: false },
      { id: 'core_32', domain: 'dropcore.com', isActive: true, isPrivate: false },
      { id: 'core_33', domain: 'coresite98.me', isActive: true, isPrivate: false },
      { id: 'core_34', domain: 'coreinbox.world', isActive: true, isPrivate: false },
      { id: 'core_35', domain: 'netcore.tech', isActive: true, isPrivate: false },
      { id: 'core_36', domain: 'hubcore.net', isActive: true, isPrivate: false },
      { id: 'core_37', domain: 'coregate.info', isActive: true, isPrivate: false },
      { id: 'core_38', domain: 'mailcore.live', isActive: true, isPrivate: false },
      { id: 'core_39', domain: 'relaycore.live', isActive: true, isPrivate: false },
      { id: 'core_40', domain: 'zonecore.net', isActive: true, isPrivate: false },
      { id: 'core_41', domain: 'coresite.dev', isActive: true, isPrivate: false },
      { id: 'core_42', domain: 'coremail.me', isActive: true, isPrivate: false },
      { id: 'core_43', domain: 'corequick.space', isActive: true, isPrivate: false },
      { id: 'core_44', domain: 'coresite51.zone', isActive: true, isPrivate: false },
      { id: 'core_45', domain: 'fastcore.com', isActive: true, isPrivate: false },
      { id: 'core_46', domain: 'corecloud.org', isActive: true, isPrivate: false },
      { id: 'core_47', domain: 'quickcore36.me', isActive: true, isPrivate: false },
      { id: 'core_48', domain: 'coremail17.info', isActive: true, isPrivate: false },
      { id: 'core_49', domain: 'corecloud.zone', isActive: true, isPrivate: false }
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

module.exports = CorePool;
