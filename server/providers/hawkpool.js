/**
 * XyronMail - HawkPool Provider Plugin
 * Curated pool of hawk domains
 */
class HawkPool {
  constructor() {
    this.name = 'hawkpool';
    this.displayName = 'Hawk Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'hawk_0', domain: 'msghawk18.live', isActive: true, isPrivate: false },
      { id: 'hawk_1', domain: 'nethawk.dev', isActive: true, isPrivate: false },
      { id: 'hawk_2', domain: 'sendhawk.world', isActive: true, isPrivate: false },
      { id: 'hawk_3', domain: 'hawkmail.world', isActive: true, isPrivate: false },
      { id: 'hawk_4', domain: 'hawkletter.pw', isActive: true, isPrivate: false },
      { id: 'hawk_5', domain: 'hawkmsg19.com', isActive: true, isPrivate: false },
      { id: 'hawk_6', domain: 'sendhawk.online', isActive: true, isPrivate: false },
      { id: 'hawk_7', domain: 'hawkgate.online', isActive: true, isPrivate: false },
      { id: 'hawk_8', domain: 'hawkfast44.dev', isActive: true, isPrivate: false },
      { id: 'hawk_9', domain: 'hawkletter.email', isActive: true, isPrivate: false },
      { id: 'hawk_10', domain: 'hawkhub.com', isActive: true, isPrivate: false },
      { id: 'hawk_11', domain: 'hawkinbox87.live', isActive: true, isPrivate: false },
      { id: 'hawk_12', domain: 'zonehawk.xyz', isActive: true, isPrivate: false },
      { id: 'hawk_13', domain: 'hawkweb.com', isActive: true, isPrivate: false },
      { id: 'hawk_14', domain: 'hawkzone.io', isActive: true, isPrivate: false },
      { id: 'hawk_15', domain: 'sendhawk.org', isActive: true, isPrivate: false },
      { id: 'hawk_16', domain: 'drophawk.zone', isActive: true, isPrivate: false },
      { id: 'hawk_17', domain: 'hawkhub71.cc', isActive: true, isPrivate: false },
      { id: 'hawk_18', domain: 'hawkletter59.live', isActive: true, isPrivate: false },
      { id: 'hawk_19', domain: 'hawkhost67.dev', isActive: true, isPrivate: false },
      { id: 'hawk_20', domain: 'hawkcloud50.zone', isActive: true, isPrivate: false },
      { id: 'hawk_21', domain: 'hosthawk.cc', isActive: true, isPrivate: false },
      { id: 'hawk_22', domain: 'hawkzone.world', isActive: true, isPrivate: false },
      { id: 'hawk_23', domain: 'hawksite.live', isActive: true, isPrivate: false },
      { id: 'hawk_24', domain: 'drophawk.tech', isActive: true, isPrivate: false },
      { id: 'hawk_25', domain: 'cloudhawk.cloud', isActive: true, isPrivate: false },
      { id: 'hawk_26', domain: 'hawkdrop.pw', isActive: true, isPrivate: false },
      { id: 'hawk_27', domain: 'hawkzone.com', isActive: true, isPrivate: false },
      { id: 'hawk_28', domain: 'hawkgate95.pw', isActive: true, isPrivate: false },
      { id: 'hawk_29', domain: 'hawkpost.co', isActive: true, isPrivate: false },
      { id: 'hawk_30', domain: 'hawkweb.dev', isActive: true, isPrivate: false },
      { id: 'hawk_31', domain: 'hawkcloud.tech', isActive: true, isPrivate: false },
      { id: 'hawk_32', domain: 'fasthawk.info', isActive: true, isPrivate: false },
      { id: 'hawk_33', domain: 'sitehawk.online', isActive: true, isPrivate: false },
      { id: 'hawk_34', domain: 'inboxhawk.com', isActive: true, isPrivate: false },
      { id: 'hawk_35', domain: 'nethawk65.cloud', isActive: true, isPrivate: false },
      { id: 'hawk_36', domain: 'quickhawk.net', isActive: true, isPrivate: false },
      { id: 'hawk_37', domain: 'hosthawk.space', isActive: true, isPrivate: false },
      { id: 'hawk_38', domain: 'hawkmsg.cloud', isActive: true, isPrivate: false },
      { id: 'hawk_39', domain: 'posthawk62.site', isActive: true, isPrivate: false },
      { id: 'hawk_40', domain: 'fasthawk.co', isActive: true, isPrivate: false },
      { id: 'hawk_41', domain: 'mailhawk76.tech', isActive: true, isPrivate: false },
      { id: 'hawk_42', domain: 'hawkpost.world', isActive: true, isPrivate: false },
      { id: 'hawk_43', domain: 'hawkbox45.co', isActive: true, isPrivate: false },
      { id: 'hawk_44', domain: 'hosthawk.io', isActive: true, isPrivate: false },
      { id: 'hawk_45', domain: 'hawkbox.tech', isActive: true, isPrivate: false },
      { id: 'hawk_46', domain: 'msghawk.me', isActive: true, isPrivate: false },
      { id: 'hawk_47', domain: 'hawkbox.zone', isActive: true, isPrivate: false },
      { id: 'hawk_48', domain: 'msghawk.tech', isActive: true, isPrivate: false },
      { id: 'hawk_49', domain: 'letterhawk.info', isActive: true, isPrivate: false }
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

module.exports = HawkPool;
