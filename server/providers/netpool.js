/**
 * XyronMail - NetPool Provider Plugin
 * Curated pool of net domains
 */
class NetPool {
  constructor() {
    this.name = 'netpool';
    this.displayName = 'Net Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'net_0', domain: 'gatenet.org', isActive: true, isPrivate: false },
      { id: 'net_1', domain: 'relaynet.cloud', isActive: true, isPrivate: false },
      { id: 'net_2', domain: 'nettemp.com', isActive: true, isPrivate: false },
      { id: 'net_3', domain: 'netbox.xyz', isActive: true, isPrivate: false },
      { id: 'net_4', domain: 'netgate.live', isActive: true, isPrivate: false },
      { id: 'net_5', domain: 'nethost81.me', isActive: true, isPrivate: false },
      { id: 'net_6', domain: 'zonenet.com', isActive: true, isPrivate: false },
      { id: 'net_7', domain: 'boxnet.me', isActive: true, isPrivate: false },
      { id: 'net_8', domain: 'netmsg.dev', isActive: true, isPrivate: false },
      { id: 'net_9', domain: 'cloudnet.info', isActive: true, isPrivate: false },
      { id: 'net_10', domain: 'dropnet.cloud', isActive: true, isPrivate: false },
      { id: 'net_11', domain: 'netsend.co', isActive: true, isPrivate: false },
      { id: 'net_12', domain: 'postnet69.space', isActive: true, isPrivate: false },
      { id: 'net_13', domain: 'netnet.com', isActive: true, isPrivate: false },
      { id: 'net_14', domain: 'inboxnet.me', isActive: true, isPrivate: false },
      { id: 'net_15', domain: 'netrelay10.com', isActive: true, isPrivate: false },
      { id: 'net_16', domain: 'cloudnet.org', isActive: true, isPrivate: false },
      { id: 'net_17', domain: 'msgnet.com', isActive: true, isPrivate: false },
      { id: 'net_18', domain: 'postnet.com', isActive: true, isPrivate: false },
      { id: 'net_19', domain: 'msgnet.online', isActive: true, isPrivate: false },
      { id: 'net_20', domain: 'netletter.tech', isActive: true, isPrivate: false },
      { id: 'net_21', domain: 'netsend.live', isActive: true, isPrivate: false },
      { id: 'net_22', domain: 'netletter.online', isActive: true, isPrivate: false },
      { id: 'net_23', domain: 'netzone.live', isActive: true, isPrivate: false },
      { id: 'net_24', domain: 'netbox.io', isActive: true, isPrivate: false },
      { id: 'net_25', domain: 'netgate.xyz', isActive: true, isPrivate: false },
      { id: 'net_26', domain: 'fastnet.me', isActive: true, isPrivate: false },
      { id: 'net_27', domain: 'netrelay.xyz', isActive: true, isPrivate: false },
      { id: 'net_28', domain: 'postnet.io', isActive: true, isPrivate: false },
      { id: 'net_29', domain: 'netsite.co', isActive: true, isPrivate: false },
      { id: 'net_30', domain: 'netrelay.co', isActive: true, isPrivate: false },
      { id: 'net_31', domain: 'netweb.zone', isActive: true, isPrivate: false },
      { id: 'net_32', domain: 'netzone.org', isActive: true, isPrivate: false },
      { id: 'net_33', domain: 'netnet.space', isActive: true, isPrivate: false },
      { id: 'net_34', domain: 'webnet.xyz', isActive: true, isPrivate: false },
      { id: 'net_35', domain: 'zonenet.email', isActive: true, isPrivate: false },
      { id: 'net_36', domain: 'nettemp.zone', isActive: true, isPrivate: false },
      { id: 'net_37', domain: 'fastnet.net', isActive: true, isPrivate: false },
      { id: 'net_38', domain: 'netfast.email', isActive: true, isPrivate: false },
      { id: 'net_39', domain: 'gatenet.me', isActive: true, isPrivate: false },
      { id: 'net_40', domain: 'sendnet.online', isActive: true, isPrivate: false },
      { id: 'net_41', domain: 'cloudnet.zone', isActive: true, isPrivate: false },
      { id: 'net_42', domain: 'netbox.org', isActive: true, isPrivate: false },
      { id: 'net_43', domain: 'netgate.org', isActive: true, isPrivate: false },
      { id: 'net_44', domain: 'webnet.site', isActive: true, isPrivate: false },
      { id: 'net_45', domain: 'tempnet11.net', isActive: true, isPrivate: false },
      { id: 'net_46', domain: 'mailnet.co', isActive: true, isPrivate: false },
      { id: 'net_47', domain: 'mailnet.zone', isActive: true, isPrivate: false },
      { id: 'net_48', domain: 'zonenet.world', isActive: true, isPrivate: false },
      { id: 'net_49', domain: 'netzone.net', isActive: true, isPrivate: false }
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

module.exports = NetPool;
