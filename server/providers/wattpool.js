/**
 * XyronMail - WattPool Provider Plugin
 * Curated pool of watt domains
 */
class WattPool {
  constructor() {
    this.name = 'wattpool';
    this.displayName = 'Watt Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'watt_0', domain: 'postwatt97.site', isActive: true, isPrivate: false },
      { id: 'watt_1', domain: 'fastwatt.xyz', isActive: true, isPrivate: false },
      { id: 'watt_2', domain: 'wattfast.pw', isActive: true, isPrivate: false },
      { id: 'watt_3', domain: 'wattdrop.space', isActive: true, isPrivate: false },
      { id: 'watt_4', domain: 'sendwatt.cc', isActive: true, isPrivate: false },
      { id: 'watt_5', domain: 'quickwatt.xyz', isActive: true, isPrivate: false },
      { id: 'watt_6', domain: 'wattmsg.org', isActive: true, isPrivate: false },
      { id: 'watt_7', domain: 'watttemp.email', isActive: true, isPrivate: false },
      { id: 'watt_8', domain: 'wattletter.site', isActive: true, isPrivate: false },
      { id: 'watt_9', domain: 'watthost.me', isActive: true, isPrivate: false },
      { id: 'watt_10', domain: 'wattweb.online', isActive: true, isPrivate: false },
      { id: 'watt_11', domain: 'fastwatt.space', isActive: true, isPrivate: false },
      { id: 'watt_12', domain: 'wattinbox.info', isActive: true, isPrivate: false },
      { id: 'watt_13', domain: 'inboxwatt.dev', isActive: true, isPrivate: false },
      { id: 'watt_14', domain: 'wattdrop.io', isActive: true, isPrivate: false },
      { id: 'watt_15', domain: 'wattrelay57.space', isActive: true, isPrivate: false },
      { id: 'watt_16', domain: 'dropwatt32.me', isActive: true, isPrivate: false },
      { id: 'watt_17', domain: 'quickwatt.com', isActive: true, isPrivate: false },
      { id: 'watt_18', domain: 'wattrelay55.com', isActive: true, isPrivate: false },
      { id: 'watt_19', domain: 'webwatt.net', isActive: true, isPrivate: false },
      { id: 'watt_20', domain: 'wattzone.cloud', isActive: true, isPrivate: false },
      { id: 'watt_21', domain: 'wattmail.me', isActive: true, isPrivate: false },
      { id: 'watt_22', domain: 'postwatt.io', isActive: true, isPrivate: false },
      { id: 'watt_23', domain: 'letterwatt.dev', isActive: true, isPrivate: false },
      { id: 'watt_24', domain: 'wattfast.com', isActive: true, isPrivate: false },
      { id: 'watt_25', domain: 'quickwatt.dev', isActive: true, isPrivate: false },
      { id: 'watt_26', domain: 'webwatt.tech', isActive: true, isPrivate: false },
      { id: 'watt_27', domain: 'wattdrop11.email', isActive: true, isPrivate: false },
      { id: 'watt_28', domain: 'webwatt.cc', isActive: true, isPrivate: false },
      { id: 'watt_29', domain: 'gatewatt.org', isActive: true, isPrivate: false },
      { id: 'watt_30', domain: 'wattcloud.org', isActive: true, isPrivate: false },
      { id: 'watt_31', domain: 'letterwatt70.tech', isActive: true, isPrivate: false },
      { id: 'watt_32', domain: 'wattcloud.cc', isActive: true, isPrivate: false },
      { id: 'watt_33', domain: 'wattzone47.world', isActive: true, isPrivate: false },
      { id: 'watt_34', domain: 'msgwatt.info', isActive: true, isPrivate: false },
      { id: 'watt_35', domain: 'wattbox.info', isActive: true, isPrivate: false },
      { id: 'watt_36', domain: 'hubwatt.zone', isActive: true, isPrivate: false },
      { id: 'watt_37', domain: 'netwatt.email', isActive: true, isPrivate: false },
      { id: 'watt_38', domain: 'wattmail.org', isActive: true, isPrivate: false },
      { id: 'watt_39', domain: 'zonewatt13.online', isActive: true, isPrivate: false },
      { id: 'watt_40', domain: 'relaywatt.tech', isActive: true, isPrivate: false },
      { id: 'watt_41', domain: 'wattpost.org', isActive: true, isPrivate: false },
      { id: 'watt_42', domain: 'fastwatt.live', isActive: true, isPrivate: false },
      { id: 'watt_43', domain: 'wattweb.net', isActive: true, isPrivate: false },
      { id: 'watt_44', domain: 'wattbox.zone', isActive: true, isPrivate: false },
      { id: 'watt_45', domain: 'mailwatt.info', isActive: true, isPrivate: false },
      { id: 'watt_46', domain: 'wattnet44.org', isActive: true, isPrivate: false },
      { id: 'watt_47', domain: 'cloudwatt.live', isActive: true, isPrivate: false },
      { id: 'watt_48', domain: 'watthub35.zone', isActive: true, isPrivate: false },
      { id: 'watt_49', domain: 'letterwatt.org', isActive: true, isPrivate: false }
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

module.exports = WattPool;
