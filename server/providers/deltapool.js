/**
 * XyronMail - DeltaPool Provider Plugin
 * Curated pool of delta domains
 */
class DeltaPool {
  constructor() {
    this.name = 'deltapool';
    this.displayName = 'Delta Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'delta_0', domain: 'relaydelta.net', isActive: true, isPrivate: false },
      { id: 'delta_1', domain: 'deltahost.com', isActive: true, isPrivate: false },
      { id: 'delta_2', domain: 'deltagate.email', isActive: true, isPrivate: false },
      { id: 'delta_3', domain: 'senddelta25.email', isActive: true, isPrivate: false },
      { id: 'delta_4', domain: 'dropdelta.io', isActive: true, isPrivate: false },
      { id: 'delta_5', domain: 'boxdelta.tech', isActive: true, isPrivate: false },
      { id: 'delta_6', domain: 'senddelta.cc', isActive: true, isPrivate: false },
      { id: 'delta_7', domain: 'deltahub.pw', isActive: true, isPrivate: false },
      { id: 'delta_8', domain: 'netdelta.me', isActive: true, isPrivate: false },
      { id: 'delta_9', domain: 'deltainbox.cloud', isActive: true, isPrivate: false },
      { id: 'delta_10', domain: 'deltamsg.online', isActive: true, isPrivate: false },
      { id: 'delta_11', domain: 'deltagate.com', isActive: true, isPrivate: false },
      { id: 'delta_12', domain: 'deltafast38.me', isActive: true, isPrivate: false },
      { id: 'delta_13', domain: 'netdelta.dev', isActive: true, isPrivate: false },
      { id: 'delta_14', domain: 'deltabox.online', isActive: true, isPrivate: false },
      { id: 'delta_15', domain: 'hubdelta.me', isActive: true, isPrivate: false },
      { id: 'delta_16', domain: 'relaydelta.me', isActive: true, isPrivate: false },
      { id: 'delta_17', domain: 'deltasite47.com', isActive: true, isPrivate: false },
      { id: 'delta_18', domain: 'inboxdelta.io', isActive: true, isPrivate: false },
      { id: 'delta_19', domain: 'deltarelay.net', isActive: true, isPrivate: false },
      { id: 'delta_20', domain: 'netdelta.cloud', isActive: true, isPrivate: false },
      { id: 'delta_21', domain: 'hostdelta.net', isActive: true, isPrivate: false },
      { id: 'delta_22', domain: 'deltaquick.me', isActive: true, isPrivate: false },
      { id: 'delta_23', domain: 'deltacloud.pw', isActive: true, isPrivate: false },
      { id: 'delta_24', domain: 'deltatemp75.email', isActive: true, isPrivate: false },
      { id: 'delta_25', domain: 'deltamsg.site', isActive: true, isPrivate: false },
      { id: 'delta_26', domain: 'fastdelta99.xyz', isActive: true, isPrivate: false },
      { id: 'delta_27', domain: 'webdelta76.online', isActive: true, isPrivate: false },
      { id: 'delta_28', domain: 'deltainbox.email', isActive: true, isPrivate: false },
      { id: 'delta_29', domain: 'deltaquick87.xyz', isActive: true, isPrivate: false },
      { id: 'delta_30', domain: 'deltasend.pw', isActive: true, isPrivate: false },
      { id: 'delta_31', domain: 'tempdelta90.me', isActive: true, isPrivate: false },
      { id: 'delta_32', domain: 'quickdelta.xyz', isActive: true, isPrivate: false },
      { id: 'delta_33', domain: 'deltaweb.space', isActive: true, isPrivate: false },
      { id: 'delta_34', domain: 'deltamail40.cc', isActive: true, isPrivate: false },
      { id: 'delta_35', domain: 'zonedelta.site', isActive: true, isPrivate: false },
      { id: 'delta_36', domain: 'deltanet.site', isActive: true, isPrivate: false },
      { id: 'delta_37', domain: 'dropdelta.tech', isActive: true, isPrivate: false },
      { id: 'delta_38', domain: 'deltatemp.xyz', isActive: true, isPrivate: false },
      { id: 'delta_39', domain: 'postdelta.tech', isActive: true, isPrivate: false },
      { id: 'delta_40', domain: 'deltasend.cloud', isActive: true, isPrivate: false },
      { id: 'delta_41', domain: 'msgdelta95.cloud', isActive: true, isPrivate: false },
      { id: 'delta_42', domain: 'gatedelta69.org', isActive: true, isPrivate: false },
      { id: 'delta_43', domain: 'boxdelta54.org', isActive: true, isPrivate: false },
      { id: 'delta_44', domain: 'deltamail.tech', isActive: true, isPrivate: false },
      { id: 'delta_45', domain: 'deltarelay42.zone', isActive: true, isPrivate: false },
      { id: 'delta_46', domain: 'deltarelay.zone', isActive: true, isPrivate: false },
      { id: 'delta_47', domain: 'deltasend.world', isActive: true, isPrivate: false },
      { id: 'delta_48', domain: 'maildelta.org', isActive: true, isPrivate: false },
      { id: 'delta_49', domain: 'dropdelta.xyz', isActive: true, isPrivate: false }
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

module.exports = DeltaPool;
