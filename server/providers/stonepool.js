/**
 * XyronMail - StonePool Provider Plugin
 * Curated pool of stone domains
 */
class StonePool {
  constructor() {
    this.name = 'stonepool';
    this.displayName = 'Stone Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'stone_0', domain: 'stonezone.email', isActive: true, isPrivate: false },
      { id: 'stone_1', domain: 'mailstone.cc', isActive: true, isPrivate: false },
      { id: 'stone_2', domain: 'stonesend.com', isActive: true, isPrivate: false },
      { id: 'stone_3', domain: 'poststone.pw', isActive: true, isPrivate: false },
      { id: 'stone_4', domain: 'cloudstone.cloud', isActive: true, isPrivate: false },
      { id: 'stone_5', domain: 'tempstone.world', isActive: true, isPrivate: false },
      { id: 'stone_6', domain: 'stonefast.io', isActive: true, isPrivate: false },
      { id: 'stone_7', domain: 'sitestone.org', isActive: true, isPrivate: false },
      { id: 'stone_8', domain: 'cloudstone45.site', isActive: true, isPrivate: false },
      { id: 'stone_9', domain: 'boxstone80.pw', isActive: true, isPrivate: false },
      { id: 'stone_10', domain: 'hoststone.dev', isActive: true, isPrivate: false },
      { id: 'stone_11', domain: 'netstone.cloud', isActive: true, isPrivate: false },
      { id: 'stone_12', domain: 'inboxstone.net', isActive: true, isPrivate: false },
      { id: 'stone_13', domain: 'faststone.co', isActive: true, isPrivate: false },
      { id: 'stone_14', domain: 'stonesite15.space', isActive: true, isPrivate: false },
      { id: 'stone_15', domain: 'stonepost.world', isActive: true, isPrivate: false },
      { id: 'stone_16', domain: 'inboxstone.site', isActive: true, isPrivate: false },
      { id: 'stone_17', domain: 'relaystone.co', isActive: true, isPrivate: false },
      { id: 'stone_18', domain: 'stonetemp.space', isActive: true, isPrivate: false },
      { id: 'stone_19', domain: 'stonedrop94.space', isActive: true, isPrivate: false },
      { id: 'stone_20', domain: 'stonefast.dev', isActive: true, isPrivate: false },
      { id: 'stone_21', domain: 'hubstone.info', isActive: true, isPrivate: false },
      { id: 'stone_22', domain: 'relaystone.tech', isActive: true, isPrivate: false },
      { id: 'stone_23', domain: 'stonefast.tech', isActive: true, isPrivate: false },
      { id: 'stone_24', domain: 'dropstone.live', isActive: true, isPrivate: false },
      { id: 'stone_25', domain: 'zonestone.com', isActive: true, isPrivate: false },
      { id: 'stone_26', domain: 'zonestone.cc', isActive: true, isPrivate: false },
      { id: 'stone_27', domain: 'webstone.zone', isActive: true, isPrivate: false },
      { id: 'stone_28', domain: 'stonehub.tech', isActive: true, isPrivate: false },
      { id: 'stone_29', domain: 'stonefast.space', isActive: true, isPrivate: false },
      { id: 'stone_30', domain: 'stonerelay.cloud', isActive: true, isPrivate: false },
      { id: 'stone_31', domain: 'stonerelay97.site', isActive: true, isPrivate: false },
      { id: 'stone_32', domain: 'quickstone.me', isActive: true, isPrivate: false },
      { id: 'stone_33', domain: 'sitestone94.me', isActive: true, isPrivate: false },
      { id: 'stone_34', domain: 'stonebox.org', isActive: true, isPrivate: false },
      { id: 'stone_35', domain: 'stonequick.site', isActive: true, isPrivate: false },
      { id: 'stone_36', domain: 'gatestone.world', isActive: true, isPrivate: false },
      { id: 'stone_37', domain: 'stonerelay.org', isActive: true, isPrivate: false },
      { id: 'stone_38', domain: 'stonemsg.world', isActive: true, isPrivate: false },
      { id: 'stone_39', domain: 'stoneinbox.world', isActive: true, isPrivate: false },
      { id: 'stone_40', domain: 'stonehub98.zone', isActive: true, isPrivate: false },
      { id: 'stone_41', domain: 'stonefast.co', isActive: true, isPrivate: false },
      { id: 'stone_42', domain: 'stonetemp.cc', isActive: true, isPrivate: false },
      { id: 'stone_43', domain: 'cloudstone.info', isActive: true, isPrivate: false },
      { id: 'stone_44', domain: 'hubstone60.email', isActive: true, isPrivate: false },
      { id: 'stone_45', domain: 'netstone.tech', isActive: true, isPrivate: false },
      { id: 'stone_46', domain: 'relaystone.info', isActive: true, isPrivate: false },
      { id: 'stone_47', domain: 'stonenet.world', isActive: true, isPrivate: false },
      { id: 'stone_48', domain: 'poststone.live', isActive: true, isPrivate: false },
      { id: 'stone_49', domain: 'faststone.site', isActive: true, isPrivate: false }
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

module.exports = StonePool;
