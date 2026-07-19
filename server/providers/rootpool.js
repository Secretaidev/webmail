/**
 * XyronMail - RootPool Provider Plugin
 * Curated pool of root domains
 */
class RootPool {
  constructor() {
    this.name = 'rootpool';
    this.displayName = 'Root Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'root_0', domain: 'siteroot42.xyz', isActive: true, isPrivate: false },
      { id: 'root_1', domain: 'rootinbox11.pw', isActive: true, isPrivate: false },
      { id: 'root_2', domain: 'rootsite.xyz', isActive: true, isPrivate: false },
      { id: 'root_3', domain: 'siteroot97.pw', isActive: true, isPrivate: false },
      { id: 'root_4', domain: 'quickroot.cc', isActive: true, isPrivate: false },
      { id: 'root_5', domain: 'postroot.net', isActive: true, isPrivate: false },
      { id: 'root_6', domain: 'relayroot52.cloud', isActive: true, isPrivate: false },
      { id: 'root_7', domain: 'rootrelay62.space', isActive: true, isPrivate: false },
      { id: 'root_8', domain: 'rootdrop.live', isActive: true, isPrivate: false },
      { id: 'root_9', domain: 'rootdrop.xyz', isActive: true, isPrivate: false },
      { id: 'root_10', domain: 'rootdrop89.net', isActive: true, isPrivate: false },
      { id: 'root_11', domain: 'roothost.xyz', isActive: true, isPrivate: false },
      { id: 'root_12', domain: 'rootnet.live', isActive: true, isPrivate: false },
      { id: 'root_13', domain: 'rootgate.cloud', isActive: true, isPrivate: false },
      { id: 'root_14', domain: 'siteroot29.email', isActive: true, isPrivate: false },
      { id: 'root_15', domain: 'rootmail.me', isActive: true, isPrivate: false },
      { id: 'root_16', domain: 'zoneroot50.cc', isActive: true, isPrivate: false },
      { id: 'root_17', domain: 'msgroot.email', isActive: true, isPrivate: false },
      { id: 'root_18', domain: 'cloudroot.cc', isActive: true, isPrivate: false },
      { id: 'root_19', domain: 'rootrelay.email', isActive: true, isPrivate: false },
      { id: 'root_20', domain: 'letterroot67.net', isActive: true, isPrivate: false },
      { id: 'root_21', domain: 'netroot.me', isActive: true, isPrivate: false },
      { id: 'root_22', domain: 'fastroot.zone', isActive: true, isPrivate: false },
      { id: 'root_23', domain: 'msgroot.com', isActive: true, isPrivate: false },
      { id: 'root_24', domain: 'netroot.dev', isActive: true, isPrivate: false },
      { id: 'root_25', domain: 'letterroot97.cc', isActive: true, isPrivate: false },
      { id: 'root_26', domain: 'rootrelay.dev', isActive: true, isPrivate: false },
      { id: 'root_27', domain: 'letterroot.info', isActive: true, isPrivate: false },
      { id: 'root_28', domain: 'droproot12.net', isActive: true, isPrivate: false },
      { id: 'root_29', domain: 'rootpost13.xyz', isActive: true, isPrivate: false },
      { id: 'root_30', domain: 'rootmail45.info', isActive: true, isPrivate: false },
      { id: 'root_31', domain: 'rootsend.zone', isActive: true, isPrivate: false },
      { id: 'root_32', domain: 'rootpost.world', isActive: true, isPrivate: false },
      { id: 'root_33', domain: 'relayroot.org', isActive: true, isPrivate: false },
      { id: 'root_34', domain: 'boxroot34.co', isActive: true, isPrivate: false },
      { id: 'root_35', domain: 'rootinbox.email', isActive: true, isPrivate: false },
      { id: 'root_36', domain: 'rootinbox59.cc', isActive: true, isPrivate: false },
      { id: 'root_37', domain: 'mailroot.site', isActive: true, isPrivate: false },
      { id: 'root_38', domain: 'rootletter.dev', isActive: true, isPrivate: false },
      { id: 'root_39', domain: 'inboxroot.space', isActive: true, isPrivate: false },
      { id: 'root_40', domain: 'droproot66.email', isActive: true, isPrivate: false },
      { id: 'root_41', domain: 'roothub.org', isActive: true, isPrivate: false },
      { id: 'root_42', domain: 'netroot.org', isActive: true, isPrivate: false },
      { id: 'root_43', domain: 'rootletter.cloud', isActive: true, isPrivate: false },
      { id: 'root_44', domain: 'netroot.com', isActive: true, isPrivate: false },
      { id: 'root_45', domain: 'rootletter.xyz', isActive: true, isPrivate: false },
      { id: 'root_46', domain: 'mailroot.io', isActive: true, isPrivate: false },
      { id: 'root_47', domain: 'rootpost.site', isActive: true, isPrivate: false },
      { id: 'root_48', domain: 'hostroot.space', isActive: true, isPrivate: false },
      { id: 'root_49', domain: 'rootweb.xyz', isActive: true, isPrivate: false }
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

module.exports = RootPool;
