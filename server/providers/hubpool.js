/**
 * XyronMail - HubPool Provider Plugin
 * Curated pool of hub domains
 */
class HubPool {
  constructor() {
    this.name = 'hubpool';
    this.displayName = 'Hub Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'hub_0', domain: 'inboxhub.world', isActive: true, isPrivate: false },
      { id: 'hub_1', domain: 'letterhub.info', isActive: true, isPrivate: false },
      { id: 'hub_2', domain: 'mailhub.online', isActive: true, isPrivate: false },
      { id: 'hub_3', domain: 'mailhub43.com', isActive: true, isPrivate: false },
      { id: 'hub_4', domain: 'hubzone.email', isActive: true, isPrivate: false },
      { id: 'hub_5', domain: 'mailhub.dev', isActive: true, isPrivate: false },
      { id: 'hub_6', domain: 'drophub.world', isActive: true, isPrivate: false },
      { id: 'hub_7', domain: 'gatehub.email', isActive: true, isPrivate: false },
      { id: 'hub_8', domain: 'hubweb.live', isActive: true, isPrivate: false },
      { id: 'hub_9', domain: 'hubmail.org', isActive: true, isPrivate: false },
      { id: 'hub_10', domain: 'webhub32.space', isActive: true, isPrivate: false },
      { id: 'hub_11', domain: 'posthub.site', isActive: true, isPrivate: false },
      { id: 'hub_12', domain: 'hubcloud39.co', isActive: true, isPrivate: false },
      { id: 'hub_13', domain: 'zonehub.io', isActive: true, isPrivate: false },
      { id: 'hub_14', domain: 'hubtemp.xyz', isActive: true, isPrivate: false },
      { id: 'hub_15', domain: 'hubhub97.tech', isActive: true, isPrivate: false },
      { id: 'hub_16', domain: 'hubnet.pw', isActive: true, isPrivate: false },
      { id: 'hub_17', domain: 'hubsite30.org', isActive: true, isPrivate: false },
      { id: 'hub_18', domain: 'relayhub.space', isActive: true, isPrivate: false },
      { id: 'hub_19', domain: 'zonehub99.io', isActive: true, isPrivate: false },
      { id: 'hub_20', domain: 'sitehub.me', isActive: true, isPrivate: false },
      { id: 'hub_21', domain: 'hubfast.zone', isActive: true, isPrivate: false },
      { id: 'hub_22', domain: 'hubdrop.cloud', isActive: true, isPrivate: false },
      { id: 'hub_23', domain: 'relayhub59.info', isActive: true, isPrivate: false },
      { id: 'hub_24', domain: 'hubweb.tech', isActive: true, isPrivate: false },
      { id: 'hub_25', domain: 'hubsend.cloud', isActive: true, isPrivate: false },
      { id: 'hub_26', domain: 'zonehub14.tech', isActive: true, isPrivate: false },
      { id: 'hub_27', domain: 'hubmsg.net', isActive: true, isPrivate: false },
      { id: 'hub_28', domain: 'hubweb74.site', isActive: true, isPrivate: false },
      { id: 'hub_29', domain: 'hubquick.me', isActive: true, isPrivate: false },
      { id: 'hub_30', domain: 'nethub.xyz', isActive: true, isPrivate: false },
      { id: 'hub_31', domain: 'hubhost14.pw', isActive: true, isPrivate: false },
      { id: 'hub_32', domain: 'sendhub10.cloud', isActive: true, isPrivate: false },
      { id: 'hub_33', domain: 'hubzone.zone', isActive: true, isPrivate: false },
      { id: 'hub_34', domain: 'hubcloud59.cc', isActive: true, isPrivate: false },
      { id: 'hub_35', domain: 'hubquick80.net', isActive: true, isPrivate: false },
      { id: 'hub_36', domain: 'hubsite86.com', isActive: true, isPrivate: false },
      { id: 'hub_37', domain: 'hubdrop.pw', isActive: true, isPrivate: false },
      { id: 'hub_38', domain: 'hubdrop.space', isActive: true, isPrivate: false },
      { id: 'hub_39', domain: 'letterhub.xyz', isActive: true, isPrivate: false },
      { id: 'hub_40', domain: 'hubcloud97.me', isActive: true, isPrivate: false },
      { id: 'hub_41', domain: 'relayhub.tech', isActive: true, isPrivate: false },
      { id: 'hub_42', domain: 'hubfast53.me', isActive: true, isPrivate: false },
      { id: 'hub_43', domain: 'sendhub.xyz', isActive: true, isPrivate: false },
      { id: 'hub_44', domain: 'hubletter80.com', isActive: true, isPrivate: false },
      { id: 'hub_45', domain: 'sitehub.space', isActive: true, isPrivate: false },
      { id: 'hub_46', domain: 'inboxhub.live', isActive: true, isPrivate: false },
      { id: 'hub_47', domain: 'hubmsg.live', isActive: true, isPrivate: false },
      { id: 'hub_48', domain: 'fasthub77.io', isActive: true, isPrivate: false },
      { id: 'hub_49', domain: 'cloudhub.co', isActive: true, isPrivate: false }
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

module.exports = HubPool;
