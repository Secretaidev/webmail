/**
 * XyronMail - BoxPool Provider Plugin
 * Curated pool of box domains
 */
class BoxPool {
  constructor() {
    this.name = 'boxpool';
    this.displayName = 'Box Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'box_0', domain: 'boxfast.tech', isActive: true, isPrivate: false },
      { id: 'box_1', domain: 'mailbox.cloud', isActive: true, isPrivate: false },
      { id: 'box_2', domain: 'boxfast.info', isActive: true, isPrivate: false },
      { id: 'box_3', domain: 'zonebox.live', isActive: true, isPrivate: false },
      { id: 'box_4', domain: 'postbox.cc', isActive: true, isPrivate: false },
      { id: 'box_5', domain: 'hubbox91.world', isActive: true, isPrivate: false },
      { id: 'box_6', domain: 'boxweb.space', isActive: true, isPrivate: false },
      { id: 'box_7', domain: 'relaybox.xyz', isActive: true, isPrivate: false },
      { id: 'box_8', domain: 'dropbox.cloud', isActive: true, isPrivate: false },
      { id: 'box_9', domain: 'letterbox.cloud', isActive: true, isPrivate: false },
      { id: 'box_10', domain: 'msgbox.world', isActive: true, isPrivate: false },
      { id: 'box_11', domain: 'boxhub.net', isActive: true, isPrivate: false },
      { id: 'box_12', domain: 'inboxbox16.cc', isActive: true, isPrivate: false },
      { id: 'box_13', domain: 'boxhub.site', isActive: true, isPrivate: false },
      { id: 'box_14', domain: 'tempbox52.email', isActive: true, isPrivate: false },
      { id: 'box_15', domain: 'boxhost.site', isActive: true, isPrivate: false },
      { id: 'box_16', domain: 'boxquick.live', isActive: true, isPrivate: false },
      { id: 'box_17', domain: 'postbox.online', isActive: true, isPrivate: false },
      { id: 'box_18', domain: 'boxquick.world', isActive: true, isPrivate: false },
      { id: 'box_19', domain: 'quickbox.me', isActive: true, isPrivate: false },
      { id: 'box_20', domain: 'zonebox.site', isActive: true, isPrivate: false },
      { id: 'box_21', domain: 'boxsend.io', isActive: true, isPrivate: false },
      { id: 'box_22', domain: 'boxweb.me', isActive: true, isPrivate: false },
      { id: 'box_23', domain: 'boxdrop.pw', isActive: true, isPrivate: false },
      { id: 'box_24', domain: 'boxzone.info', isActive: true, isPrivate: false },
      { id: 'box_25', domain: 'dropbox.info', isActive: true, isPrivate: false },
      { id: 'box_26', domain: 'boxtemp.site', isActive: true, isPrivate: false },
      { id: 'box_27', domain: 'boxtemp.org', isActive: true, isPrivate: false },
      { id: 'box_28', domain: 'hostbox.io', isActive: true, isPrivate: false },
      { id: 'box_29', domain: 'boxdrop.tech', isActive: true, isPrivate: false },
      { id: 'box_30', domain: 'netbox30.live', isActive: true, isPrivate: false },
      { id: 'box_31', domain: 'boxbox.live', isActive: true, isPrivate: false },
      { id: 'box_32', domain: 'boxnet.cloud', isActive: true, isPrivate: false },
      { id: 'box_33', domain: 'sendbox.live', isActive: true, isPrivate: false },
      { id: 'box_34', domain: 'boxtemp.dev', isActive: true, isPrivate: false },
      { id: 'box_35', domain: 'boxhub.cc', isActive: true, isPrivate: false },
      { id: 'box_36', domain: 'boxquick14.world', isActive: true, isPrivate: false },
      { id: 'box_37', domain: 'inboxbox39.info', isActive: true, isPrivate: false },
      { id: 'box_38', domain: 'boxweb33.email', isActive: true, isPrivate: false },
      { id: 'box_39', domain: 'boxletter.online', isActive: true, isPrivate: false },
      { id: 'box_40', domain: 'boxfast.live', isActive: true, isPrivate: false },
      { id: 'box_41', domain: 'tempbox.email', isActive: true, isPrivate: false },
      { id: 'box_42', domain: 'netbox.tech', isActive: true, isPrivate: false },
      { id: 'box_43', domain: 'hubbox75.net', isActive: true, isPrivate: false },
      { id: 'box_44', domain: 'boxbox.co', isActive: true, isPrivate: false },
      { id: 'box_45', domain: 'postbox.zone', isActive: true, isPrivate: false },
      { id: 'box_46', domain: 'boxinbox.cloud', isActive: true, isPrivate: false },
      { id: 'box_47', domain: 'quickbox.cc', isActive: true, isPrivate: false },
      { id: 'box_48', domain: 'boxquick.me', isActive: true, isPrivate: false },
      { id: 'box_49', domain: 'boxbox86.co', isActive: true, isPrivate: false }
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

module.exports = BoxPool;
