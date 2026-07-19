/**
 * XyronMail - SnapPool Provider Plugin
 * Curated pool of snap domains
 */
class SnapPool {
  constructor() {
    this.name = 'snappool';
    this.displayName = 'Snap Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'snap_0', domain: 'snapmsg.co', isActive: true, isPrivate: false },
      { id: 'snap_1', domain: 'snapbox.co', isActive: true, isPrivate: false },
      { id: 'snap_2', domain: 'snapmail.world', isActive: true, isPrivate: false },
      { id: 'snap_3', domain: 'tempsnap.org', isActive: true, isPrivate: false },
      { id: 'snap_4', domain: 'snapcloud.dev', isActive: true, isPrivate: false },
      { id: 'snap_5', domain: 'snapsite.space', isActive: true, isPrivate: false },
      { id: 'snap_6', domain: 'snapmail.cloud', isActive: true, isPrivate: false },
      { id: 'snap_7', domain: 'snapzone.site', isActive: true, isPrivate: false },
      { id: 'snap_8', domain: 'snapletter.zone', isActive: true, isPrivate: false },
      { id: 'snap_9', domain: 'snapsend.tech', isActive: true, isPrivate: false },
      { id: 'snap_10', domain: 'inboxsnap.com', isActive: true, isPrivate: false },
      { id: 'snap_11', domain: 'snapinbox98.me', isActive: true, isPrivate: false },
      { id: 'snap_12', domain: 'hostsnap65.world', isActive: true, isPrivate: false },
      { id: 'snap_13', domain: 'postsnap.com', isActive: true, isPrivate: false },
      { id: 'snap_14', domain: 'dropsnap.online', isActive: true, isPrivate: false },
      { id: 'snap_15', domain: 'inboxsnap.info', isActive: true, isPrivate: false },
      { id: 'snap_16', domain: 'snapinbox86.pw', isActive: true, isPrivate: false },
      { id: 'snap_17', domain: 'postsnap53.pw', isActive: true, isPrivate: false },
      { id: 'snap_18', domain: 'snapbox.cc', isActive: true, isPrivate: false },
      { id: 'snap_19', domain: 'boxsnap.net', isActive: true, isPrivate: false },
      { id: 'snap_20', domain: 'msgsnap.email', isActive: true, isPrivate: false },
      { id: 'snap_21', domain: 'snapsend.world', isActive: true, isPrivate: false },
      { id: 'snap_22', domain: 'snapnet.email', isActive: true, isPrivate: false },
      { id: 'snap_23', domain: 'boxsnap.me', isActive: true, isPrivate: false },
      { id: 'snap_24', domain: 'mailsnap13.me', isActive: true, isPrivate: false },
      { id: 'snap_25', domain: 'snapquick.io', isActive: true, isPrivate: false },
      { id: 'snap_26', domain: 'snapzone34.online', isActive: true, isPrivate: false },
      { id: 'snap_27', domain: 'postsnap.space', isActive: true, isPrivate: false },
      { id: 'snap_28', domain: 'relaysnap.site', isActive: true, isPrivate: false },
      { id: 'snap_29', domain: 'snaprelay.site', isActive: true, isPrivate: false },
      { id: 'snap_30', domain: 'msgsnap78.io', isActive: true, isPrivate: false },
      { id: 'snap_31', domain: 'sitesnap.pw', isActive: true, isPrivate: false },
      { id: 'snap_32', domain: 'snapweb.live', isActive: true, isPrivate: false },
      { id: 'snap_33', domain: 'postsnap.dev', isActive: true, isPrivate: false },
      { id: 'snap_34', domain: 'cloudsnap.net', isActive: true, isPrivate: false },
      { id: 'snap_35', domain: 'snapsend.pw', isActive: true, isPrivate: false },
      { id: 'snap_36', domain: 'quicksnap.co', isActive: true, isPrivate: false },
      { id: 'snap_37', domain: 'zonesnap.org', isActive: true, isPrivate: false },
      { id: 'snap_38', domain: 'postsnap56.info', isActive: true, isPrivate: false },
      { id: 'snap_39', domain: 'snaphub.pw', isActive: true, isPrivate: false },
      { id: 'snap_40', domain: 'inboxsnap.cc', isActive: true, isPrivate: false },
      { id: 'snap_41', domain: 'hostsnap.io', isActive: true, isPrivate: false },
      { id: 'snap_42', domain: 'snapzone.zone', isActive: true, isPrivate: false },
      { id: 'snap_43', domain: 'websnap50.live', isActive: true, isPrivate: false },
      { id: 'snap_44', domain: 'gatesnap.world', isActive: true, isPrivate: false },
      { id: 'snap_45', domain: 'snapmsg32.com', isActive: true, isPrivate: false },
      { id: 'snap_46', domain: 'mailsnap.cloud', isActive: true, isPrivate: false },
      { id: 'snap_47', domain: 'fastsnap.space', isActive: true, isPrivate: false },
      { id: 'snap_48', domain: 'snapnet.me', isActive: true, isPrivate: false },
      { id: 'snap_49', domain: 'netsnap18.site', isActive: true, isPrivate: false }
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

module.exports = SnapPool;
