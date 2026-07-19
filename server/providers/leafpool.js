/**
 * XyronMail - LeafPool Provider Plugin
 * Curated pool of leaf domains
 */
class LeafPool {
  constructor() {
    this.name = 'leafpool';
    this.displayName = 'Leaf Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'leaf_0', domain: 'leafmsg.xyz', isActive: true, isPrivate: false },
      { id: 'leaf_1', domain: 'inboxleaf.org', isActive: true, isPrivate: false },
      { id: 'leaf_2', domain: 'leafnet.tech', isActive: true, isPrivate: false },
      { id: 'leaf_3', domain: 'leafzone37.live', isActive: true, isPrivate: false },
      { id: 'leaf_4', domain: 'hostleaf.space', isActive: true, isPrivate: false },
      { id: 'leaf_5', domain: 'inboxleaf29.xyz', isActive: true, isPrivate: false },
      { id: 'leaf_6', domain: 'leafsite.pw', isActive: true, isPrivate: false },
      { id: 'leaf_7', domain: 'leafletter.cc', isActive: true, isPrivate: false },
      { id: 'leaf_8', domain: 'boxleaf.cloud', isActive: true, isPrivate: false },
      { id: 'leaf_9', domain: 'leafsite.email', isActive: true, isPrivate: false },
      { id: 'leaf_10', domain: 'dropleaf.net', isActive: true, isPrivate: false },
      { id: 'leaf_11', domain: 'webleaf.cc', isActive: true, isPrivate: false },
      { id: 'leaf_12', domain: 'leaffast.pw', isActive: true, isPrivate: false },
      { id: 'leaf_13', domain: 'relayleaf.tech', isActive: true, isPrivate: false },
      { id: 'leaf_14', domain: 'leafnet.live', isActive: true, isPrivate: false },
      { id: 'leaf_15', domain: 'leaffast.email', isActive: true, isPrivate: false },
      { id: 'leaf_16', domain: 'letterleaf.io', isActive: true, isPrivate: false },
      { id: 'leaf_17', domain: 'cloudleaf.email', isActive: true, isPrivate: false },
      { id: 'leaf_18', domain: 'boxleaf.live', isActive: true, isPrivate: false },
      { id: 'leaf_19', domain: 'leafbox.dev', isActive: true, isPrivate: false },
      { id: 'leaf_20', domain: 'sendleaf.dev', isActive: true, isPrivate: false },
      { id: 'leaf_21', domain: 'hostleaf.net', isActive: true, isPrivate: false },
      { id: 'leaf_22', domain: 'zoneleaf.net', isActive: true, isPrivate: false },
      { id: 'leaf_23', domain: 'letterleaf.online', isActive: true, isPrivate: false },
      { id: 'leaf_24', domain: 'hostleaf87.world', isActive: true, isPrivate: false },
      { id: 'leaf_25', domain: 'hostleaf64.space', isActive: true, isPrivate: false },
      { id: 'leaf_26', domain: 'netleaf.xyz', isActive: true, isPrivate: false },
      { id: 'leaf_27', domain: 'letterleaf.pw', isActive: true, isPrivate: false },
      { id: 'leaf_28', domain: 'sendleaf.live', isActive: true, isPrivate: false },
      { id: 'leaf_29', domain: 'leafmsg.zone', isActive: true, isPrivate: false },
      { id: 'leaf_30', domain: 'hubleaf.info', isActive: true, isPrivate: false },
      { id: 'leaf_31', domain: 'netleaf.org', isActive: true, isPrivate: false },
      { id: 'leaf_32', domain: 'siteleaf.com', isActive: true, isPrivate: false },
      { id: 'leaf_33', domain: 'leafmail.me', isActive: true, isPrivate: false },
      { id: 'leaf_34', domain: 'templeaf.com', isActive: true, isPrivate: false },
      { id: 'leaf_35', domain: 'leafrelay.tech', isActive: true, isPrivate: false },
      { id: 'leaf_36', domain: 'leafcloud.info', isActive: true, isPrivate: false },
      { id: 'leaf_37', domain: 'hubleaf.online', isActive: true, isPrivate: false },
      { id: 'leaf_38', domain: 'letterleaf.net', isActive: true, isPrivate: false },
      { id: 'leaf_39', domain: 'hostleaf88.site', isActive: true, isPrivate: false },
      { id: 'leaf_40', domain: 'webleaf.live', isActive: true, isPrivate: false },
      { id: 'leaf_41', domain: 'gateleaf84.me', isActive: true, isPrivate: false },
      { id: 'leaf_42', domain: 'postleaf.info', isActive: true, isPrivate: false },
      { id: 'leaf_43', domain: 'netleaf.net', isActive: true, isPrivate: false },
      { id: 'leaf_44', domain: 'sendleaf.email', isActive: true, isPrivate: false },
      { id: 'leaf_45', domain: 'leafnet.email', isActive: true, isPrivate: false },
      { id: 'leaf_46', domain: 'leafsite87.online', isActive: true, isPrivate: false },
      { id: 'leaf_47', domain: 'leafcloud55.online', isActive: true, isPrivate: false },
      { id: 'leaf_48', domain: 'templeaf.me', isActive: true, isPrivate: false },
      { id: 'leaf_49', domain: 'sendleaf10.tech', isActive: true, isPrivate: false }
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

module.exports = LeafPool;
