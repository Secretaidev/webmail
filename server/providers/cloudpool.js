/**
 * XyronMail - CloudPool Provider Plugin
 * Curated pool of cloud domains
 */
class CloudPool {
  constructor() {
    this.name = 'cloudpool';
    this.displayName = 'Cloud Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'cloud_0', domain: 'netcloud.tech', isActive: true, isPrivate: false },
      { id: 'cloud_1', domain: 'mailcloud.info', isActive: true, isPrivate: false },
      { id: 'cloud_2', domain: 'cloudrelay99.org', isActive: true, isPrivate: false },
      { id: 'cloud_3', domain: 'cloudtemp71.io', isActive: true, isPrivate: false },
      { id: 'cloud_4', domain: 'cloudquick.pw', isActive: true, isPrivate: false },
      { id: 'cloud_5', domain: 'cloudtemp.online', isActive: true, isPrivate: false },
      { id: 'cloud_6', domain: 'sendcloud.cc', isActive: true, isPrivate: false },
      { id: 'cloud_7', domain: 'boxcloud.zone', isActive: true, isPrivate: false },
      { id: 'cloud_8', domain: 'tempcloud.email', isActive: true, isPrivate: false },
      { id: 'cloud_9', domain: 'zonecloud.me', isActive: true, isPrivate: false },
      { id: 'cloud_10', domain: 'cloudquick.live', isActive: true, isPrivate: false },
      { id: 'cloud_11', domain: 'fastcloud16.world', isActive: true, isPrivate: false },
      { id: 'cloud_12', domain: 'clouddrop92.tech', isActive: true, isPrivate: false },
      { id: 'cloud_13', domain: 'cloudmsg.co', isActive: true, isPrivate: false },
      { id: 'cloud_14', domain: 'cloudtemp.org', isActive: true, isPrivate: false },
      { id: 'cloud_15', domain: 'cloudquick49.net', isActive: true, isPrivate: false },
      { id: 'cloud_16', domain: 'cloudsite.xyz', isActive: true, isPrivate: false },
      { id: 'cloud_17', domain: 'gatecloud.me', isActive: true, isPrivate: false },
      { id: 'cloud_18', domain: 'cloudsite.io', isActive: true, isPrivate: false },
      { id: 'cloud_19', domain: 'cloudinbox.cc', isActive: true, isPrivate: false },
      { id: 'cloud_20', domain: 'msgcloud.com', isActive: true, isPrivate: false },
      { id: 'cloud_21', domain: 'clouddrop.me', isActive: true, isPrivate: false },
      { id: 'cloud_22', domain: 'inboxcloud41.pw', isActive: true, isPrivate: false },
      { id: 'cloud_23', domain: 'relaycloud.tech', isActive: true, isPrivate: false },
      { id: 'cloud_24', domain: 'sendcloud.online', isActive: true, isPrivate: false },
      { id: 'cloud_25', domain: 'cloudpost.io', isActive: true, isPrivate: false },
      { id: 'cloud_26', domain: 'cloudhost.xyz', isActive: true, isPrivate: false },
      { id: 'cloud_27', domain: 'cloudinbox.live', isActive: true, isPrivate: false },
      { id: 'cloud_28', domain: 'hubcloud.site', isActive: true, isPrivate: false },
      { id: 'cloud_29', domain: 'postcloud.space', isActive: true, isPrivate: false },
      { id: 'cloud_30', domain: 'mailcloud.io', isActive: true, isPrivate: false },
      { id: 'cloud_31', domain: 'zonecloud11.email', isActive: true, isPrivate: false },
      { id: 'cloud_32', domain: 'hubcloud.space', isActive: true, isPrivate: false },
      { id: 'cloud_33', domain: 'boxcloud.me', isActive: true, isPrivate: false },
      { id: 'cloud_34', domain: 'cloudbox.org', isActive: true, isPrivate: false },
      { id: 'cloud_35', domain: 'gatecloud.xyz', isActive: true, isPrivate: false },
      { id: 'cloud_36', domain: 'lettercloud.live', isActive: true, isPrivate: false },
      { id: 'cloud_37', domain: 'lettercloud.cc', isActive: true, isPrivate: false },
      { id: 'cloud_38', domain: 'cloudinbox.zone', isActive: true, isPrivate: false },
      { id: 'cloud_39', domain: 'hostcloud.pw', isActive: true, isPrivate: false },
      { id: 'cloud_40', domain: 'quickcloud.live', isActive: true, isPrivate: false },
      { id: 'cloud_41', domain: 'cloudhost20.me', isActive: true, isPrivate: false },
      { id: 'cloud_42', domain: 'cloudquick38.net', isActive: true, isPrivate: false },
      { id: 'cloud_43', domain: 'cloudquick.online', isActive: true, isPrivate: false },
      { id: 'cloud_44', domain: 'msgcloud.info', isActive: true, isPrivate: false },
      { id: 'cloud_45', domain: 'tempcloud.com', isActive: true, isPrivate: false },
      { id: 'cloud_46', domain: 'hubcloud63.org', isActive: true, isPrivate: false },
      { id: 'cloud_47', domain: 'cloudrelay.site', isActive: true, isPrivate: false },
      { id: 'cloud_48', domain: 'cloudletter22.tech', isActive: true, isPrivate: false },
      { id: 'cloud_49', domain: 'cloudrelay.co', isActive: true, isPrivate: false }
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

module.exports = CloudPool;
