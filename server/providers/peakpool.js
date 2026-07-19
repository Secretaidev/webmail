/**
 * XyronMail - PeakPool Provider Plugin
 * Curated pool of peak domains
 */
class PeakPool {
  constructor() {
    this.name = 'peakpool';
    this.displayName = 'Peak Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'peak_0', domain: 'peakinbox.space', isActive: true, isPrivate: false },
      { id: 'peak_1', domain: 'peakinbox.info', isActive: true, isPrivate: false },
      { id: 'peak_2', domain: 'postpeak.cc', isActive: true, isPrivate: false },
      { id: 'peak_3', domain: 'peakzone.org', isActive: true, isPrivate: false },
      { id: 'peak_4', domain: 'netpeak.co', isActive: true, isPrivate: false },
      { id: 'peak_5', domain: 'postpeak.site', isActive: true, isPrivate: false },
      { id: 'peak_6', domain: 'peakinbox.zone', isActive: true, isPrivate: false },
      { id: 'peak_7', domain: 'peakrelay.net', isActive: true, isPrivate: false },
      { id: 'peak_8', domain: 'postpeak54.email', isActive: true, isPrivate: false },
      { id: 'peak_9', domain: 'mailpeak46.com', isActive: true, isPrivate: false },
      { id: 'peak_10', domain: 'peakhost.world', isActive: true, isPrivate: false },
      { id: 'peak_11', domain: 'peakzone16.io', isActive: true, isPrivate: false },
      { id: 'peak_12', domain: 'peakpost.space', isActive: true, isPrivate: false },
      { id: 'peak_13', domain: 'peakzone.zone', isActive: true, isPrivate: false },
      { id: 'peak_14', domain: 'peakinbox30.world', isActive: true, isPrivate: false },
      { id: 'peak_15', domain: 'letterpeak.net', isActive: true, isPrivate: false },
      { id: 'peak_16', domain: 'peakquick42.xyz', isActive: true, isPrivate: false },
      { id: 'peak_17', domain: 'peakquick.space', isActive: true, isPrivate: false },
      { id: 'peak_18', domain: 'peakzone.cloud', isActive: true, isPrivate: false },
      { id: 'peak_19', domain: 'peakinbox.me', isActive: true, isPrivate: false },
      { id: 'peak_20', domain: 'peakdrop.email', isActive: true, isPrivate: false },
      { id: 'peak_21', domain: 'peakrelay.online', isActive: true, isPrivate: false },
      { id: 'peak_22', domain: 'droppeak.email', isActive: true, isPrivate: false },
      { id: 'peak_23', domain: 'peakdrop.online', isActive: true, isPrivate: false },
      { id: 'peak_24', domain: 'droppeak.cc', isActive: true, isPrivate: false },
      { id: 'peak_25', domain: 'letterpeak.cloud', isActive: true, isPrivate: false },
      { id: 'peak_26', domain: 'peakpost.io', isActive: true, isPrivate: false },
      { id: 'peak_27', domain: 'peakzone19.io', isActive: true, isPrivate: false },
      { id: 'peak_28', domain: 'peakdrop.world', isActive: true, isPrivate: false },
      { id: 'peak_29', domain: 'letterpeak88.world', isActive: true, isPrivate: false },
      { id: 'peak_30', domain: 'peakhost.cc', isActive: true, isPrivate: false },
      { id: 'peak_31', domain: 'cloudpeak.online', isActive: true, isPrivate: false },
      { id: 'peak_32', domain: 'peakhost.io', isActive: true, isPrivate: false },
      { id: 'peak_33', domain: 'peakweb.org', isActive: true, isPrivate: false },
      { id: 'peak_34', domain: 'peakmsg.space', isActive: true, isPrivate: false },
      { id: 'peak_35', domain: 'peakfast49.zone', isActive: true, isPrivate: false },
      { id: 'peak_36', domain: 'peakcloud.com', isActive: true, isPrivate: false },
      { id: 'peak_37', domain: 'boxpeak.com', isActive: true, isPrivate: false },
      { id: 'peak_38', domain: 'peakgate87.zone', isActive: true, isPrivate: false },
      { id: 'peak_39', domain: 'temppeak.space', isActive: true, isPrivate: false },
      { id: 'peak_40', domain: 'peakgate.zone', isActive: true, isPrivate: false },
      { id: 'peak_41', domain: 'hostpeak.com', isActive: true, isPrivate: false },
      { id: 'peak_42', domain: 'msgpeak21.dev', isActive: true, isPrivate: false },
      { id: 'peak_43', domain: 'inboxpeak.zone', isActive: true, isPrivate: false },
      { id: 'peak_44', domain: 'peakfast.cc', isActive: true, isPrivate: false },
      { id: 'peak_45', domain: 'relaypeak30.email', isActive: true, isPrivate: false },
      { id: 'peak_46', domain: 'mailpeak.tech', isActive: true, isPrivate: false },
      { id: 'peak_47', domain: 'peakquick.email', isActive: true, isPrivate: false },
      { id: 'peak_48', domain: 'peakweb.com', isActive: true, isPrivate: false },
      { id: 'peak_49', domain: 'zonepeak.org', isActive: true, isPrivate: false }
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

module.exports = PeakPool;
