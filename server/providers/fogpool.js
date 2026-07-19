/**
 * XyronMail - FogPool Provider Plugin
 * Curated pool of fog domains
 */
class FogPool {
  constructor() {
    this.name = 'fogpool';
    this.displayName = 'Fog Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'fog_0', domain: 'foghub.info', isActive: true, isPrivate: false },
      { id: 'fog_1', domain: 'fogcloud55.site', isActive: true, isPrivate: false },
      { id: 'fog_2', domain: 'sitefog20.world', isActive: true, isPrivate: false },
      { id: 'fog_3', domain: 'fastfog.pw', isActive: true, isPrivate: false },
      { id: 'fog_4', domain: 'msgfog.live', isActive: true, isPrivate: false },
      { id: 'fog_5', domain: 'fogbox94.site', isActive: true, isPrivate: false },
      { id: 'fog_6', domain: 'fogweb.pw', isActive: true, isPrivate: false },
      { id: 'fog_7', domain: 'hubfog.zone', isActive: true, isPrivate: false },
      { id: 'fog_8', domain: 'fogzone.cloud', isActive: true, isPrivate: false },
      { id: 'fog_9', domain: 'fogsite.tech', isActive: true, isPrivate: false },
      { id: 'fog_10', domain: 'fognet.pw', isActive: true, isPrivate: false },
      { id: 'fog_11', domain: 'fogdrop.co', isActive: true, isPrivate: false },
      { id: 'fog_12', domain: 'postfog.me', isActive: true, isPrivate: false },
      { id: 'fog_13', domain: 'fogmail.io', isActive: true, isPrivate: false },
      { id: 'fog_14', domain: 'fogdrop.dev', isActive: true, isPrivate: false },
      { id: 'fog_15', domain: 'foggate.world', isActive: true, isPrivate: false },
      { id: 'fog_16', domain: 'foginbox71.cc', isActive: true, isPrivate: false },
      { id: 'fog_17', domain: 'postfog.net', isActive: true, isPrivate: false },
      { id: 'fog_18', domain: 'msgfog.net', isActive: true, isPrivate: false },
      { id: 'fog_19', domain: 'fogbox74.dev', isActive: true, isPrivate: false },
      { id: 'fog_20', domain: 'zonefog25.zone', isActive: true, isPrivate: false },
      { id: 'fog_21', domain: 'fogsend.online', isActive: true, isPrivate: false },
      { id: 'fog_22', domain: 'fogquick.pw', isActive: true, isPrivate: false },
      { id: 'fog_23', domain: 'fogweb.online', isActive: true, isPrivate: false },
      { id: 'fog_24', domain: 'hostfog.cloud', isActive: true, isPrivate: false },
      { id: 'fog_25', domain: 'webfog.site', isActive: true, isPrivate: false },
      { id: 'fog_26', domain: 'fastfog.cc', isActive: true, isPrivate: false },
      { id: 'fog_27', domain: 'fogrelay.live', isActive: true, isPrivate: false },
      { id: 'fog_28', domain: 'postfog18.net', isActive: true, isPrivate: false },
      { id: 'fog_29', domain: 'hubfog92.xyz', isActive: true, isPrivate: false },
      { id: 'fog_30', domain: 'dropfog.world', isActive: true, isPrivate: false },
      { id: 'fog_31', domain: 'letterfog.xyz', isActive: true, isPrivate: false },
      { id: 'fog_32', domain: 'fogbox.online', isActive: true, isPrivate: false },
      { id: 'fog_33', domain: 'inboxfog32.tech', isActive: true, isPrivate: false },
      { id: 'fog_34', domain: 'inboxfog43.site', isActive: true, isPrivate: false },
      { id: 'fog_35', domain: 'dropfog12.dev', isActive: true, isPrivate: false },
      { id: 'fog_36', domain: 'hostfog.online', isActive: true, isPrivate: false },
      { id: 'fog_37', domain: 'fogmsg.zone', isActive: true, isPrivate: false },
      { id: 'fog_38', domain: 'relayfog.zone', isActive: true, isPrivate: false },
      { id: 'fog_39', domain: 'mailfog.live', isActive: true, isPrivate: false },
      { id: 'fog_40', domain: 'foghost.world', isActive: true, isPrivate: false },
      { id: 'fog_41', domain: 'fogzone.site', isActive: true, isPrivate: false },
      { id: 'fog_42', domain: 'sitefog.online', isActive: true, isPrivate: false },
      { id: 'fog_43', domain: 'postfog.email', isActive: true, isPrivate: false },
      { id: 'fog_44', domain: 'fastfog94.pw', isActive: true, isPrivate: false },
      { id: 'fog_45', domain: 'fogletter.space', isActive: true, isPrivate: false },
      { id: 'fog_46', domain: 'fogmsg.org', isActive: true, isPrivate: false },
      { id: 'fog_47', domain: 'letterfog.email', isActive: true, isPrivate: false },
      { id: 'fog_48', domain: 'fogbox.co', isActive: true, isPrivate: false },
      { id: 'fog_49', domain: 'relayfog.xyz', isActive: true, isPrivate: false }
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

module.exports = FogPool;
