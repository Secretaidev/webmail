/**
 * XyronMail - PrivacyPool Provider Plugin
 * Curated pool of privacy domains
 */
class PrivacyPool {
  constructor() {
    this.name = 'privacypool';
    this.displayName = 'Privacy Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'privacy_0', domain: 'privacyzone.org', isActive: true, isPrivate: false },
      { id: 'privacy_1', domain: 'gateprivacy82.online', isActive: true, isPrivate: false },
      { id: 'privacy_2', domain: 'relayprivacy.cc', isActive: true, isPrivate: false },
      { id: 'privacy_3', domain: 'webprivacy.info', isActive: true, isPrivate: false },
      { id: 'privacy_4', domain: 'privacysend.net', isActive: true, isPrivate: false },
      { id: 'privacy_5', domain: 'quickprivacy.com', isActive: true, isPrivate: false },
      { id: 'privacy_6', domain: 'privacycloud.email', isActive: true, isPrivate: false },
      { id: 'privacy_7', domain: 'privacyzone.online', isActive: true, isPrivate: false },
      { id: 'privacy_8', domain: 'privacynet.site', isActive: true, isPrivate: false },
      { id: 'privacy_9', domain: 'privacybox47.com', isActive: true, isPrivate: false },
      { id: 'privacy_10', domain: 'msgprivacy.cc', isActive: true, isPrivate: false },
      { id: 'privacy_11', domain: 'privacydrop49.xyz', isActive: true, isPrivate: false },
      { id: 'privacy_12', domain: 'hubprivacy.pw', isActive: true, isPrivate: false },
      { id: 'privacy_13', domain: 'privacynet.co', isActive: true, isPrivate: false },
      { id: 'privacy_14', domain: 'postprivacy.tech', isActive: true, isPrivate: false },
      { id: 'privacy_15', domain: 'privacynet65.pw', isActive: true, isPrivate: false },
      { id: 'privacy_16', domain: 'gateprivacy.me', isActive: true, isPrivate: false },
      { id: 'privacy_17', domain: 'privacycloud.com', isActive: true, isPrivate: false },
      { id: 'privacy_18', domain: 'privacysite.world', isActive: true, isPrivate: false },
      { id: 'privacy_19', domain: 'privacygate98.zone', isActive: true, isPrivate: false },
      { id: 'privacy_20', domain: 'privacypost.com', isActive: true, isPrivate: false },
      { id: 'privacy_21', domain: 'siteprivacy86.dev', isActive: true, isPrivate: false },
      { id: 'privacy_22', domain: 'fastprivacy40.xyz', isActive: true, isPrivate: false },
      { id: 'privacy_23', domain: 'dropprivacy53.zone', isActive: true, isPrivate: false },
      { id: 'privacy_24', domain: 'privacyweb.zone', isActive: true, isPrivate: false },
      { id: 'privacy_25', domain: 'hostprivacy12.space', isActive: true, isPrivate: false },
      { id: 'privacy_26', domain: 'privacymail.site', isActive: true, isPrivate: false },
      { id: 'privacy_27', domain: 'boxprivacy.org', isActive: true, isPrivate: false },
      { id: 'privacy_28', domain: 'quickprivacy.xyz', isActive: true, isPrivate: false },
      { id: 'privacy_29', domain: 'tempprivacy76.org', isActive: true, isPrivate: false },
      { id: 'privacy_30', domain: 'hubprivacy.info', isActive: true, isPrivate: false },
      { id: 'privacy_31', domain: 'privacycloud99.site', isActive: true, isPrivate: false },
      { id: 'privacy_32', domain: 'inboxprivacy50.cloud', isActive: true, isPrivate: false },
      { id: 'privacy_33', domain: 'fastprivacy.tech', isActive: true, isPrivate: false },
      { id: 'privacy_34', domain: 'privacydrop.info', isActive: true, isPrivate: false },
      { id: 'privacy_35', domain: 'privacyweb.me', isActive: true, isPrivate: false },
      { id: 'privacy_36', domain: 'sendprivacy40.email', isActive: true, isPrivate: false },
      { id: 'privacy_37', domain: 'privacygate27.io', isActive: true, isPrivate: false },
      { id: 'privacy_38', domain: 'privacydrop.zone', isActive: true, isPrivate: false },
      { id: 'privacy_39', domain: 'inboxprivacy.space', isActive: true, isPrivate: false },
      { id: 'privacy_40', domain: 'privacyletter.me', isActive: true, isPrivate: false },
      { id: 'privacy_41', domain: 'mailprivacy.world', isActive: true, isPrivate: false },
      { id: 'privacy_42', domain: 'privacycloud.site', isActive: true, isPrivate: false },
      { id: 'privacy_43', domain: 'hubprivacy73.live', isActive: true, isPrivate: false },
      { id: 'privacy_44', domain: 'privacyhub.com', isActive: true, isPrivate: false },
      { id: 'privacy_45', domain: 'privacymail.co', isActive: true, isPrivate: false },
      { id: 'privacy_46', domain: 'postprivacy32.online', isActive: true, isPrivate: false },
      { id: 'privacy_47', domain: 'quickprivacy.net', isActive: true, isPrivate: false },
      { id: 'privacy_48', domain: 'privacyfast.email', isActive: true, isPrivate: false },
      { id: 'privacy_49', domain: 'privacydrop.cloud', isActive: true, isPrivate: false }
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

module.exports = PrivacyPool;
