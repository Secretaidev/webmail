/**
 * XyronMail - StrmPool Provider Plugin
 * Curated pool of strm domains
 */
class StrmPool {
  constructor() {
    this.name = 'strmpool';
    this.displayName = 'Strm Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'strm_0', domain: 'poststrm.space', isActive: true, isPrivate: false },
      { id: 'strm_1', domain: 'strminbox94.email', isActive: true, isPrivate: false },
      { id: 'strm_2', domain: 'strmpost.io', isActive: true, isPrivate: false },
      { id: 'strm_3', domain: 'hubstrm59.dev', isActive: true, isPrivate: false },
      { id: 'strm_4', domain: 'strmsite.online', isActive: true, isPrivate: false },
      { id: 'strm_5', domain: 'zonestrm.cc', isActive: true, isPrivate: false },
      { id: 'strm_6', domain: 'cloudstrm.me', isActive: true, isPrivate: false },
      { id: 'strm_7', domain: 'strmdrop14.net', isActive: true, isPrivate: false },
      { id: 'strm_8', domain: 'strmdrop.org', isActive: true, isPrivate: false },
      { id: 'strm_9', domain: 'msgstrm.net', isActive: true, isPrivate: false },
      { id: 'strm_10', domain: 'strmgate.com', isActive: true, isPrivate: false },
      { id: 'strm_11', domain: 'strmletter25.com', isActive: true, isPrivate: false },
      { id: 'strm_12', domain: 'strmgate90.co', isActive: true, isPrivate: false },
      { id: 'strm_13', domain: 'tempstrm.pw', isActive: true, isPrivate: false },
      { id: 'strm_14', domain: 'strmdrop92.org', isActive: true, isPrivate: false },
      { id: 'strm_15', domain: 'strmgate15.zone', isActive: true, isPrivate: false },
      { id: 'strm_16', domain: 'netstrm.world', isActive: true, isPrivate: false },
      { id: 'strm_17', domain: 'poststrm98.co', isActive: true, isPrivate: false },
      { id: 'strm_18', domain: 'msgstrm.info', isActive: true, isPrivate: false },
      { id: 'strm_19', domain: 'strmtemp.tech', isActive: true, isPrivate: false },
      { id: 'strm_20', domain: 'zonestrm.dev', isActive: true, isPrivate: false },
      { id: 'strm_21', domain: 'strmfast.info', isActive: true, isPrivate: false },
      { id: 'strm_22', domain: 'quickstrm.co', isActive: true, isPrivate: false },
      { id: 'strm_23', domain: 'strmtemp.cloud', isActive: true, isPrivate: false },
      { id: 'strm_24', domain: 'relaystrm.email', isActive: true, isPrivate: false },
      { id: 'strm_25', domain: 'strmfast.online', isActive: true, isPrivate: false },
      { id: 'strm_26', domain: 'relaystrm.co', isActive: true, isPrivate: false },
      { id: 'strm_27', domain: 'cloudstrm.io', isActive: true, isPrivate: false },
      { id: 'strm_28', domain: 'poststrm.xyz', isActive: true, isPrivate: false },
      { id: 'strm_29', domain: 'hubstrm.live', isActive: true, isPrivate: false },
      { id: 'strm_30', domain: 'webstrm.net', isActive: true, isPrivate: false },
      { id: 'strm_31', domain: 'strmgate.org', isActive: true, isPrivate: false },
      { id: 'strm_32', domain: 'mailstrm.xyz', isActive: true, isPrivate: false },
      { id: 'strm_33', domain: 'msgstrm.email', isActive: true, isPrivate: false },
      { id: 'strm_34', domain: 'strmbox.space', isActive: true, isPrivate: false },
      { id: 'strm_35', domain: 'strmquick.tech', isActive: true, isPrivate: false },
      { id: 'strm_36', domain: 'poststrm.live', isActive: true, isPrivate: false },
      { id: 'strm_37', domain: 'sendstrm.cc', isActive: true, isPrivate: false },
      { id: 'strm_38', domain: 'strmfast.co', isActive: true, isPrivate: false },
      { id: 'strm_39', domain: 'netstrm.net', isActive: true, isPrivate: false },
      { id: 'strm_40', domain: 'faststrm26.io', isActive: true, isPrivate: false },
      { id: 'strm_41', domain: 'strmhost.site', isActive: true, isPrivate: false },
      { id: 'strm_42', domain: 'strmcloud.pw', isActive: true, isPrivate: false },
      { id: 'strm_43', domain: 'strmmsg.io', isActive: true, isPrivate: false },
      { id: 'strm_44', domain: 'strmpost.email', isActive: true, isPrivate: false },
      { id: 'strm_45', domain: 'faststrm37.tech', isActive: true, isPrivate: false },
      { id: 'strm_46', domain: 'strmhub.pw', isActive: true, isPrivate: false },
      { id: 'strm_47', domain: 'strmnet.net', isActive: true, isPrivate: false },
      { id: 'strm_48', domain: 'strmhost.com', isActive: true, isPrivate: false },
      { id: 'strm_49', domain: 'strmweb.info', isActive: true, isPrivate: false }
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

module.exports = StrmPool;
