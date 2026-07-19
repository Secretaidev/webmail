/**
 * XyronMail - LinkPool Provider Plugin
 * Curated pool of link domains
 */
class LinkPool {
  constructor() {
    this.name = 'linkpool';
    this.displayName = 'Link Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'link_0', domain: 'cloudlink.xyz', isActive: true, isPrivate: false },
      { id: 'link_1', domain: 'hostlink38.world', isActive: true, isPrivate: false },
      { id: 'link_2', domain: 'linkmail.org', isActive: true, isPrivate: false },
      { id: 'link_3', domain: 'linknet.site', isActive: true, isPrivate: false },
      { id: 'link_4', domain: 'linkhub.co', isActive: true, isPrivate: false },
      { id: 'link_5', domain: 'msglink.co', isActive: true, isPrivate: false },
      { id: 'link_6', domain: 'linkpost.world', isActive: true, isPrivate: false },
      { id: 'link_7', domain: 'linkmsg.online', isActive: true, isPrivate: false },
      { id: 'link_8', domain: 'fastlink.org', isActive: true, isPrivate: false },
      { id: 'link_9', domain: 'cloudlink.email', isActive: true, isPrivate: false },
      { id: 'link_10', domain: 'letterlink.xyz', isActive: true, isPrivate: false },
      { id: 'link_11', domain: 'linkbox.email', isActive: true, isPrivate: false },
      { id: 'link_12', domain: 'zonelink.io', isActive: true, isPrivate: false },
      { id: 'link_13', domain: 'linkcloud.tech', isActive: true, isPrivate: false },
      { id: 'link_14', domain: 'zonelink.net', isActive: true, isPrivate: false },
      { id: 'link_15', domain: 'linkquick.dev', isActive: true, isPrivate: false },
      { id: 'link_16', domain: 'linkletter.tech', isActive: true, isPrivate: false },
      { id: 'link_17', domain: 'linkhub.pw', isActive: true, isPrivate: false },
      { id: 'link_18', domain: 'weblink.dev', isActive: true, isPrivate: false },
      { id: 'link_19', domain: 'sitelink.cc', isActive: true, isPrivate: false },
      { id: 'link_20', domain: 'linkquick83.live', isActive: true, isPrivate: false },
      { id: 'link_21', domain: 'relaylink.org', isActive: true, isPrivate: false },
      { id: 'link_22', domain: 'gatelink66.com', isActive: true, isPrivate: false },
      { id: 'link_23', domain: 'fastlink.zone', isActive: true, isPrivate: false },
      { id: 'link_24', domain: 'linkfast.xyz', isActive: true, isPrivate: false },
      { id: 'link_25', domain: 'cloudlink.online', isActive: true, isPrivate: false },
      { id: 'link_26', domain: 'linkweb51.me', isActive: true, isPrivate: false },
      { id: 'link_27', domain: 'droplink.co', isActive: true, isPrivate: false },
      { id: 'link_28', domain: 'linkmsg.co', isActive: true, isPrivate: false },
      { id: 'link_29', domain: 'linkdrop96.io', isActive: true, isPrivate: false },
      { id: 'link_30', domain: 'zonelink.dev', isActive: true, isPrivate: false },
      { id: 'link_31', domain: 'linknet.xyz', isActive: true, isPrivate: false },
      { id: 'link_32', domain: 'linksend.zone', isActive: true, isPrivate: false },
      { id: 'link_33', domain: 'gatelink.net', isActive: true, isPrivate: false },
      { id: 'link_34', domain: 'inboxlink.live', isActive: true, isPrivate: false },
      { id: 'link_35', domain: 'linkweb.co', isActive: true, isPrivate: false },
      { id: 'link_36', domain: 'quicklink39.dev', isActive: true, isPrivate: false },
      { id: 'link_37', domain: 'inboxlink.pw', isActive: true, isPrivate: false },
      { id: 'link_38', domain: 'linkfast.dev', isActive: true, isPrivate: false },
      { id: 'link_39', domain: 'hublink64.me', isActive: true, isPrivate: false },
      { id: 'link_40', domain: 'hublink99.online', isActive: true, isPrivate: false },
      { id: 'link_41', domain: 'linkrelay.cloud', isActive: true, isPrivate: false },
      { id: 'link_42', domain: 'weblink.io', isActive: true, isPrivate: false },
      { id: 'link_43', domain: 'gatelink.io', isActive: true, isPrivate: false },
      { id: 'link_44', domain: 'boxlink.me', isActive: true, isPrivate: false },
      { id: 'link_45', domain: 'weblink.com', isActive: true, isPrivate: false },
      { id: 'link_46', domain: 'boxlink39.info', isActive: true, isPrivate: false },
      { id: 'link_47', domain: 'postlink15.live', isActive: true, isPrivate: false },
      { id: 'link_48', domain: 'linkletter.dev', isActive: true, isPrivate: false },
      { id: 'link_49', domain: 'inboxlink.dev', isActive: true, isPrivate: false }
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

module.exports = LinkPool;
