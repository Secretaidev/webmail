/**
 * XyronMail - SpeedPool Provider Plugin
 * Curated pool of speed domains
 */
class SpeedPool {
  constructor() {
    this.name = 'speedpool';
    this.displayName = 'Speed Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'speed_0', domain: 'speeddrop.world', isActive: true, isPrivate: false },
      { id: 'speed_1', domain: 'speedgate45.dev', isActive: true, isPrivate: false },
      { id: 'speed_2', domain: 'speedweb.org', isActive: true, isPrivate: false },
      { id: 'speed_3', domain: 'speedbox.site', isActive: true, isPrivate: false },
      { id: 'speed_4', domain: 'speeddrop.com', isActive: true, isPrivate: false },
      { id: 'speed_5', domain: 'speedsite48.info', isActive: true, isPrivate: false },
      { id: 'speed_6', domain: 'quickspeed.net', isActive: true, isPrivate: false },
      { id: 'speed_7', domain: 'hubspeed.cc', isActive: true, isPrivate: false },
      { id: 'speed_8', domain: 'speedinbox.space', isActive: true, isPrivate: false },
      { id: 'speed_9', domain: 'speedpost.tech', isActive: true, isPrivate: false },
      { id: 'speed_10', domain: 'dropspeed15.live', isActive: true, isPrivate: false },
      { id: 'speed_11', domain: 'speedcloud.cloud', isActive: true, isPrivate: false },
      { id: 'speed_12', domain: 'speedhost.cloud', isActive: true, isPrivate: false },
      { id: 'speed_13', domain: 'speedzone.info', isActive: true, isPrivate: false },
      { id: 'speed_14', domain: 'relayspeed.space', isActive: true, isPrivate: false },
      { id: 'speed_15', domain: 'speedmail.site', isActive: true, isPrivate: false },
      { id: 'speed_16', domain: 'netspeed.cc', isActive: true, isPrivate: false },
      { id: 'speed_17', domain: 'postspeed.co', isActive: true, isPrivate: false },
      { id: 'speed_18', domain: 'msgspeed.co', isActive: true, isPrivate: false },
      { id: 'speed_19', domain: 'speedrelay.live', isActive: true, isPrivate: false },
      { id: 'speed_20', domain: 'mailspeed.zone', isActive: true, isPrivate: false },
      { id: 'speed_21', domain: 'sitespeed.email', isActive: true, isPrivate: false },
      { id: 'speed_22', domain: 'speedhost19.org', isActive: true, isPrivate: false },
      { id: 'speed_23', domain: 'fastspeed.online', isActive: true, isPrivate: false },
      { id: 'speed_24', domain: 'cloudspeed.cloud', isActive: true, isPrivate: false },
      { id: 'speed_25', domain: 'speedsend.info', isActive: true, isPrivate: false },
      { id: 'speed_26', domain: 'webspeed35.online', isActive: true, isPrivate: false },
      { id: 'speed_27', domain: 'speedzone.cloud', isActive: true, isPrivate: false },
      { id: 'speed_28', domain: 'netspeed.me', isActive: true, isPrivate: false },
      { id: 'speed_29', domain: 'hostspeed.io', isActive: true, isPrivate: false },
      { id: 'speed_30', domain: 'speedcloud.com', isActive: true, isPrivate: false },
      { id: 'speed_31', domain: 'letterspeed.pw', isActive: true, isPrivate: false },
      { id: 'speed_32', domain: 'speedsite66.me', isActive: true, isPrivate: false },
      { id: 'speed_33', domain: 'webspeed.io', isActive: true, isPrivate: false },
      { id: 'speed_34', domain: 'inboxspeed.zone', isActive: true, isPrivate: false },
      { id: 'speed_35', domain: 'speedquick.world', isActive: true, isPrivate: false },
      { id: 'speed_36', domain: 'sendspeed.zone', isActive: true, isPrivate: false },
      { id: 'speed_37', domain: 'speedweb.info', isActive: true, isPrivate: false },
      { id: 'speed_38', domain: 'speedcloud10.me', isActive: true, isPrivate: false },
      { id: 'speed_39', domain: 'relayspeed.site', isActive: true, isPrivate: false },
      { id: 'speed_40', domain: 'hubspeed73.email', isActive: true, isPrivate: false },
      { id: 'speed_41', domain: 'dropspeed.io', isActive: true, isPrivate: false },
      { id: 'speed_42', domain: 'postspeed.live', isActive: true, isPrivate: false },
      { id: 'speed_43', domain: 'speedletter.me', isActive: true, isPrivate: false },
      { id: 'speed_44', domain: 'speedsend.org', isActive: true, isPrivate: false },
      { id: 'speed_45', domain: 'speeddrop.tech', isActive: true, isPrivate: false },
      { id: 'speed_46', domain: 'speedhost35.dev', isActive: true, isPrivate: false },
      { id: 'speed_47', domain: 'inboxspeed54.site', isActive: true, isPrivate: false },
      { id: 'speed_48', domain: 'zonespeed.org', isActive: true, isPrivate: false },
      { id: 'speed_49', domain: 'hostspeed.dev', isActive: true, isPrivate: false }
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

module.exports = SpeedPool;
