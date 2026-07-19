/**
 * XyronMail - BearPool Provider Plugin
 * Curated pool of bear domains
 */
class BearPool {
  constructor() {
    this.name = 'bearpool';
    this.displayName = 'Bear Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'bear_0', domain: 'zonebear.info', isActive: true, isPrivate: false },
      { id: 'bear_1', domain: 'netbear.cloud', isActive: true, isPrivate: false },
      { id: 'bear_2', domain: 'bearinbox72.space', isActive: true, isPrivate: false },
      { id: 'bear_3', domain: 'letterbear.world', isActive: true, isPrivate: false },
      { id: 'bear_4', domain: 'relaybear.tech', isActive: true, isPrivate: false },
      { id: 'bear_5', domain: 'boxbear.xyz', isActive: true, isPrivate: false },
      { id: 'bear_6', domain: 'inboxbear68.pw', isActive: true, isPrivate: false },
      { id: 'bear_7', domain: 'relaybear46.live', isActive: true, isPrivate: false },
      { id: 'bear_8', domain: 'cloudbear71.cloud', isActive: true, isPrivate: false },
      { id: 'bear_9', domain: 'bearpost.email', isActive: true, isPrivate: false },
      { id: 'bear_10', domain: 'bearquick.live', isActive: true, isPrivate: false },
      { id: 'bear_11', domain: 'letterbear.co', isActive: true, isPrivate: false },
      { id: 'bear_12', domain: 'bearnet.me', isActive: true, isPrivate: false },
      { id: 'bear_13', domain: 'bearzone.io', isActive: true, isPrivate: false },
      { id: 'bear_14', domain: 'webbear.zone', isActive: true, isPrivate: false },
      { id: 'bear_15', domain: 'bearfast.com', isActive: true, isPrivate: false },
      { id: 'bear_16', domain: 'beardrop16.live', isActive: true, isPrivate: false },
      { id: 'bear_17', domain: 'bearquick.io', isActive: true, isPrivate: false },
      { id: 'bear_18', domain: 'bearhost.dev', isActive: true, isPrivate: false },
      { id: 'bear_19', domain: 'netbear.email', isActive: true, isPrivate: false },
      { id: 'bear_20', domain: 'bearinbox.space', isActive: true, isPrivate: false },
      { id: 'bear_21', domain: 'bearinbox.cloud', isActive: true, isPrivate: false },
      { id: 'bear_22', domain: 'bearmsg.info', isActive: true, isPrivate: false },
      { id: 'bear_23', domain: 'boxbear.world', isActive: true, isPrivate: false },
      { id: 'bear_24', domain: 'fastbear.xyz', isActive: true, isPrivate: false },
      { id: 'bear_25', domain: 'bearzone.me', isActive: true, isPrivate: false },
      { id: 'bear_26', domain: 'inboxbear.live', isActive: true, isPrivate: false },
      { id: 'bear_27', domain: 'relaybear87.pw', isActive: true, isPrivate: false },
      { id: 'bear_28', domain: 'bearhub.online', isActive: true, isPrivate: false },
      { id: 'bear_29', domain: 'gatebear.space', isActive: true, isPrivate: false },
      { id: 'bear_30', domain: 'bearquick.site', isActive: true, isPrivate: false },
      { id: 'bear_31', domain: 'bearcloud.space', isActive: true, isPrivate: false },
      { id: 'bear_32', domain: 'bearzone24.com', isActive: true, isPrivate: false },
      { id: 'bear_33', domain: 'bearzone.cc', isActive: true, isPrivate: false },
      { id: 'bear_34', domain: 'postbear.zone', isActive: true, isPrivate: false },
      { id: 'bear_35', domain: 'hostbear.io', isActive: true, isPrivate: false },
      { id: 'bear_36', domain: 'bearletter.email', isActive: true, isPrivate: false },
      { id: 'bear_37', domain: 'bearhub.io', isActive: true, isPrivate: false },
      { id: 'bear_38', domain: 'bearsite.cc', isActive: true, isPrivate: false },
      { id: 'bear_39', domain: 'bearletter.space', isActive: true, isPrivate: false },
      { id: 'bear_40', domain: 'letterbear.cloud', isActive: true, isPrivate: false },
      { id: 'bear_41', domain: 'postbear.world', isActive: true, isPrivate: false },
      { id: 'bear_42', domain: 'msgbear.cloud', isActive: true, isPrivate: false },
      { id: 'bear_43', domain: 'bearquick.net', isActive: true, isPrivate: false },
      { id: 'bear_44', domain: 'postbear.tech', isActive: true, isPrivate: false },
      { id: 'bear_45', domain: 'bearmail.zone', isActive: true, isPrivate: false },
      { id: 'bear_46', domain: 'mailbear.tech', isActive: true, isPrivate: false },
      { id: 'bear_47', domain: 'webbear.cloud', isActive: true, isPrivate: false },
      { id: 'bear_48', domain: 'bearsend.space', isActive: true, isPrivate: false },
      { id: 'bear_49', domain: 'mailbear.world', isActive: true, isPrivate: false }
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

module.exports = BearPool;
