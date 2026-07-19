/**
 * XyronMail - LakePool Provider Plugin
 * Curated pool of lake domains
 */
class LakePool {
  constructor() {
    this.name = 'lakepool';
    this.displayName = 'Lake Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'lake_0', domain: 'lakesite35.info', isActive: true, isPrivate: false },
      { id: 'lake_1', domain: 'lakepost.tech', isActive: true, isPrivate: false },
      { id: 'lake_2', domain: 'droplake98.world', isActive: true, isPrivate: false },
      { id: 'lake_3', domain: 'lakecloud.email', isActive: true, isPrivate: false },
      { id: 'lake_4', domain: 'msglake.co', isActive: true, isPrivate: false },
      { id: 'lake_5', domain: 'lakeletter41.tech', isActive: true, isPrivate: false },
      { id: 'lake_6', domain: 'lakepost87.zone', isActive: true, isPrivate: false },
      { id: 'lake_7', domain: 'msglake.pw', isActive: true, isPrivate: false },
      { id: 'lake_8', domain: 'lakerelay.site', isActive: true, isPrivate: false },
      { id: 'lake_9', domain: 'fastlake12.me', isActive: true, isPrivate: false },
      { id: 'lake_10', domain: 'lakerelay.info', isActive: true, isPrivate: false },
      { id: 'lake_11', domain: 'letterlake.cloud', isActive: true, isPrivate: false },
      { id: 'lake_12', domain: 'boxlake.info', isActive: true, isPrivate: false },
      { id: 'lake_13', domain: 'postlake.site', isActive: true, isPrivate: false },
      { id: 'lake_14', domain: 'cloudlake.io', isActive: true, isPrivate: false },
      { id: 'lake_15', domain: 'letterlake51.space', isActive: true, isPrivate: false },
      { id: 'lake_16', domain: 'netlake.cc', isActive: true, isPrivate: false },
      { id: 'lake_17', domain: 'inboxlake.com', isActive: true, isPrivate: false },
      { id: 'lake_18', domain: 'templake.net', isActive: true, isPrivate: false },
      { id: 'lake_19', domain: 'inboxlake.cloud', isActive: true, isPrivate: false },
      { id: 'lake_20', domain: 'sitelake.live', isActive: true, isPrivate: false },
      { id: 'lake_21', domain: 'quicklake.dev', isActive: true, isPrivate: false },
      { id: 'lake_22', domain: 'lakebox67.cloud', isActive: true, isPrivate: false },
      { id: 'lake_23', domain: 'sendlake.co', isActive: true, isPrivate: false },
      { id: 'lake_24', domain: 'sendlake.email', isActive: true, isPrivate: false },
      { id: 'lake_25', domain: 'msglake.info', isActive: true, isPrivate: false },
      { id: 'lake_26', domain: 'lakedrop.co', isActive: true, isPrivate: false },
      { id: 'lake_27', domain: 'zonelake.org', isActive: true, isPrivate: false },
      { id: 'lake_28', domain: 'gatelake.world', isActive: true, isPrivate: false },
      { id: 'lake_29', domain: 'lakemsg.email', isActive: true, isPrivate: false },
      { id: 'lake_30', domain: 'lakemail98.io', isActive: true, isPrivate: false },
      { id: 'lake_31', domain: 'hublake.zone', isActive: true, isPrivate: false },
      { id: 'lake_32', domain: 'lakecloud69.cc', isActive: true, isPrivate: false },
      { id: 'lake_33', domain: 'fastlake51.net', isActive: true, isPrivate: false },
      { id: 'lake_34', domain: 'lakedrop.xyz', isActive: true, isPrivate: false },
      { id: 'lake_35', domain: 'maillake90.xyz', isActive: true, isPrivate: false },
      { id: 'lake_36', domain: 'lakeweb87.me', isActive: true, isPrivate: false },
      { id: 'lake_37', domain: 'quicklake.world', isActive: true, isPrivate: false },
      { id: 'lake_38', domain: 'lakezone.co', isActive: true, isPrivate: false },
      { id: 'lake_39', domain: 'netlake.tech', isActive: true, isPrivate: false },
      { id: 'lake_40', domain: 'lakemail.site', isActive: true, isPrivate: false },
      { id: 'lake_41', domain: 'lakesite.org', isActive: true, isPrivate: false },
      { id: 'lake_42', domain: 'postlake.space', isActive: true, isPrivate: false },
      { id: 'lake_43', domain: 'droplake.me', isActive: true, isPrivate: false },
      { id: 'lake_44', domain: 'hostlake.cc', isActive: true, isPrivate: false },
      { id: 'lake_45', domain: 'droplake.email', isActive: true, isPrivate: false },
      { id: 'lake_46', domain: 'sitelake.online', isActive: true, isPrivate: false },
      { id: 'lake_47', domain: 'msglake.site', isActive: true, isPrivate: false },
      { id: 'lake_48', domain: 'templake.live', isActive: true, isPrivate: false },
      { id: 'lake_49', domain: 'fastlake.tech', isActive: true, isPrivate: false }
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

module.exports = LakePool;
