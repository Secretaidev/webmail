/**
 * XyronMail - WolfPool Provider Plugin
 * Curated pool of wolf domains
 */
class WolfPool {
  constructor() {
    this.name = 'wolfpool';
    this.displayName = 'Wolf Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'wolf_0', domain: 'wolftemp.info', isActive: true, isPrivate: false },
      { id: 'wolf_1', domain: 'wolfdrop.xyz', isActive: true, isPrivate: false },
      { id: 'wolf_2', domain: 'gatewolf.io', isActive: true, isPrivate: false },
      { id: 'wolf_3', domain: 'hubwolf.cc', isActive: true, isPrivate: false },
      { id: 'wolf_4', domain: 'cloudwolf.io', isActive: true, isPrivate: false },
      { id: 'wolf_5', domain: 'fastwolf15.email', isActive: true, isPrivate: false },
      { id: 'wolf_6', domain: 'wolfhub53.dev', isActive: true, isPrivate: false },
      { id: 'wolf_7', domain: 'mailwolf.net', isActive: true, isPrivate: false },
      { id: 'wolf_8', domain: 'msgwolf.tech', isActive: true, isPrivate: false },
      { id: 'wolf_9', domain: 'zonewolf.me', isActive: true, isPrivate: false },
      { id: 'wolf_10', domain: 'wolftemp.co', isActive: true, isPrivate: false },
      { id: 'wolf_11', domain: 'sitewolf.online', isActive: true, isPrivate: false },
      { id: 'wolf_12', domain: 'wolfgate.io', isActive: true, isPrivate: false },
      { id: 'wolf_13', domain: 'sendwolf.com', isActive: true, isPrivate: false },
      { id: 'wolf_14', domain: 'wolfrelay.zone', isActive: true, isPrivate: false },
      { id: 'wolf_15', domain: 'dropwolf.io', isActive: true, isPrivate: false },
      { id: 'wolf_16', domain: 'wolfpost.zone', isActive: true, isPrivate: false },
      { id: 'wolf_17', domain: 'wolfmail.cc', isActive: true, isPrivate: false },
      { id: 'wolf_18', domain: 'wolfweb76.space', isActive: true, isPrivate: false },
      { id: 'wolf_19', domain: 'sitewolf.co', isActive: true, isPrivate: false },
      { id: 'wolf_20', domain: 'wolffast71.online', isActive: true, isPrivate: false },
      { id: 'wolf_21', domain: 'mailwolf.xyz', isActive: true, isPrivate: false },
      { id: 'wolf_22', domain: 'wolfzone.site', isActive: true, isPrivate: false },
      { id: 'wolf_23', domain: 'quickwolf.org', isActive: true, isPrivate: false },
      { id: 'wolf_24', domain: 'wolftemp.io', isActive: true, isPrivate: false },
      { id: 'wolf_25', domain: 'wolfnet54.zone', isActive: true, isPrivate: false },
      { id: 'wolf_26', domain: 'tempwolf.pw', isActive: true, isPrivate: false },
      { id: 'wolf_27', domain: 'netwolf.io', isActive: true, isPrivate: false },
      { id: 'wolf_28', domain: 'wolfcloud.dev', isActive: true, isPrivate: false },
      { id: 'wolf_29', domain: 'wolfpost.space', isActive: true, isPrivate: false },
      { id: 'wolf_30', domain: 'wolfweb93.live', isActive: true, isPrivate: false },
      { id: 'wolf_31', domain: 'wolfmsg.cc', isActive: true, isPrivate: false },
      { id: 'wolf_32', domain: 'netwolf.info', isActive: true, isPrivate: false },
      { id: 'wolf_33', domain: 'quickwolf.tech', isActive: true, isPrivate: false },
      { id: 'wolf_34', domain: 'boxwolf.com', isActive: true, isPrivate: false },
      { id: 'wolf_35', domain: 'sitewolf.zone', isActive: true, isPrivate: false },
      { id: 'wolf_36', domain: 'webwolf.org', isActive: true, isPrivate: false },
      { id: 'wolf_37', domain: 'wolfdrop.email', isActive: true, isPrivate: false },
      { id: 'wolf_38', domain: 'wolfquick.co', isActive: true, isPrivate: false },
      { id: 'wolf_39', domain: 'hubwolf.pw', isActive: true, isPrivate: false },
      { id: 'wolf_40', domain: 'letterwolf.net', isActive: true, isPrivate: false },
      { id: 'wolf_41', domain: 'wolfquick.cc', isActive: true, isPrivate: false },
      { id: 'wolf_42', domain: 'wolfhub.org', isActive: true, isPrivate: false },
      { id: 'wolf_43', domain: 'wolfcloud.tech', isActive: true, isPrivate: false },
      { id: 'wolf_44', domain: 'wolfletter93.xyz', isActive: true, isPrivate: false },
      { id: 'wolf_45', domain: 'wolftemp.online', isActive: true, isPrivate: false },
      { id: 'wolf_46', domain: 'dropwolf.pw', isActive: true, isPrivate: false },
      { id: 'wolf_47', domain: 'wolfbox.xyz', isActive: true, isPrivate: false },
      { id: 'wolf_48', domain: 'wolfquick.info', isActive: true, isPrivate: false },
      { id: 'wolf_49', domain: 'dropwolf55.xyz', isActive: true, isPrivate: false }
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

module.exports = WolfPool;
