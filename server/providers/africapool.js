/**
 * XyronMail - AfricaPool Provider Plugin
 * Curated pool of africa domains
 */
class AfricaPool {
  constructor() {
    this.name = 'africapool';
    this.displayName = 'Africa Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'africa_0', domain: 'relayafrica.space', isActive: true, isPrivate: false },
      { id: 'africa_1', domain: 'quickafrica17.pw', isActive: true, isPrivate: false },
      { id: 'africa_2', domain: 'webafrica.live', isActive: true, isPrivate: false },
      { id: 'africa_3', domain: 'gateafrica.cloud', isActive: true, isPrivate: false },
      { id: 'africa_4', domain: 'africagate.cc', isActive: true, isPrivate: false },
      { id: 'africa_5', domain: 'africatemp.pw', isActive: true, isPrivate: false },
      { id: 'africa_6', domain: 'mailafrica.pw', isActive: true, isPrivate: false },
      { id: 'africa_7', domain: 'africahost.live', isActive: true, isPrivate: false },
      { id: 'africa_8', domain: 'netafrica.site', isActive: true, isPrivate: false },
      { id: 'africa_9', domain: 'quickafrica.me', isActive: true, isPrivate: false },
      { id: 'africa_10', domain: 'africapost15.me', isActive: true, isPrivate: false },
      { id: 'africa_11', domain: 'africatemp.info', isActive: true, isPrivate: false },
      { id: 'africa_12', domain: 'siteafrica.io', isActive: true, isPrivate: false },
      { id: 'africa_13', domain: 'relayafrica.me', isActive: true, isPrivate: false },
      { id: 'africa_14', domain: 'africafast.space', isActive: true, isPrivate: false },
      { id: 'africa_15', domain: 'africacloud.world', isActive: true, isPrivate: false },
      { id: 'africa_16', domain: 'africazone52.live', isActive: true, isPrivate: false },
      { id: 'africa_17', domain: 'hubafrica.me', isActive: true, isPrivate: false },
      { id: 'africa_18', domain: 'africaletter66.tech', isActive: true, isPrivate: false },
      { id: 'africa_19', domain: 'sendafrica.site', isActive: true, isPrivate: false },
      { id: 'africa_20', domain: 'africasend33.world', isActive: true, isPrivate: false },
      { id: 'africa_21', domain: 'quickafrica.org', isActive: true, isPrivate: false },
      { id: 'africa_22', domain: 'msgafrica53.xyz', isActive: true, isPrivate: false },
      { id: 'africa_23', domain: 'africacloud.cc', isActive: true, isPrivate: false },
      { id: 'africa_24', domain: 'africahub.me', isActive: true, isPrivate: false },
      { id: 'africa_25', domain: 'africabox.dev', isActive: true, isPrivate: false },
      { id: 'africa_26', domain: 'mailafrica.cc', isActive: true, isPrivate: false },
      { id: 'africa_27', domain: 'sendafrica.info', isActive: true, isPrivate: false },
      { id: 'africa_28', domain: 'msgafrica.com', isActive: true, isPrivate: false },
      { id: 'africa_29', domain: 'siteafrica.pw', isActive: true, isPrivate: false },
      { id: 'africa_30', domain: 'africabox.info', isActive: true, isPrivate: false },
      { id: 'africa_31', domain: 'gateafrica.me', isActive: true, isPrivate: false },
      { id: 'africa_32', domain: 'africasite34.site', isActive: true, isPrivate: false },
      { id: 'africa_33', domain: 'africabox.co', isActive: true, isPrivate: false },
      { id: 'africa_34', domain: 'boxafrica.org', isActive: true, isPrivate: false },
      { id: 'africa_35', domain: 'netafrica.online', isActive: true, isPrivate: false },
      { id: 'africa_36', domain: 'letterafrica.email', isActive: true, isPrivate: false },
      { id: 'africa_37', domain: 'africarelay.live', isActive: true, isPrivate: false },
      { id: 'africa_38', domain: 'gateafrica27.zone', isActive: true, isPrivate: false },
      { id: 'africa_39', domain: 'africafast.com', isActive: true, isPrivate: false },
      { id: 'africa_40', domain: 'africaquick.cloud', isActive: true, isPrivate: false },
      { id: 'africa_41', domain: 'letterafrica.world', isActive: true, isPrivate: false },
      { id: 'africa_42', domain: 'africanet.email', isActive: true, isPrivate: false },
      { id: 'africa_43', domain: 'zoneafrica.tech', isActive: true, isPrivate: false },
      { id: 'africa_44', domain: 'msgafrica36.co', isActive: true, isPrivate: false },
      { id: 'africa_45', domain: 'siteafrica.cc', isActive: true, isPrivate: false },
      { id: 'africa_46', domain: 'africafast.site', isActive: true, isPrivate: false },
      { id: 'africa_47', domain: 'africaletter.pw', isActive: true, isPrivate: false },
      { id: 'africa_48', domain: 'africanet.world', isActive: true, isPrivate: false },
      { id: 'africa_49', domain: 'inboxafrica.space', isActive: true, isPrivate: false }
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

module.exports = AfricaPool;
