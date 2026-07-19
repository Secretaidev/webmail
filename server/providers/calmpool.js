/**
 * XyronMail - CalmPool Provider Plugin
 * Curated pool of calm domains
 */
class CalmPool {
  constructor() {
    this.name = 'calmpool';
    this.displayName = 'Calm Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'calm_0', domain: 'tempcalm.pw', isActive: true, isPrivate: false },
      { id: 'calm_1', domain: 'calmhost94.live', isActive: true, isPrivate: false },
      { id: 'calm_2', domain: 'hostcalm.com', isActive: true, isPrivate: false },
      { id: 'calm_3', domain: 'lettercalm.org', isActive: true, isPrivate: false },
      { id: 'calm_4', domain: 'calminbox.world', isActive: true, isPrivate: false },
      { id: 'calm_5', domain: 'netcalm.email', isActive: true, isPrivate: false },
      { id: 'calm_6', domain: 'relaycalm.email', isActive: true, isPrivate: false },
      { id: 'calm_7', domain: 'cloudcalm.dev', isActive: true, isPrivate: false },
      { id: 'calm_8', domain: 'calmrelay.co', isActive: true, isPrivate: false },
      { id: 'calm_9', domain: 'calmletter.tech', isActive: true, isPrivate: false },
      { id: 'calm_10', domain: 'inboxcalm13.tech', isActive: true, isPrivate: false },
      { id: 'calm_11', domain: 'calmzone.cloud', isActive: true, isPrivate: false },
      { id: 'calm_12', domain: 'calmtemp.io', isActive: true, isPrivate: false },
      { id: 'calm_13', domain: 'calmrelay.com', isActive: true, isPrivate: false },
      { id: 'calm_14', domain: 'calmzone.info', isActive: true, isPrivate: false },
      { id: 'calm_15', domain: 'calmdrop.zone', isActive: true, isPrivate: false },
      { id: 'calm_16', domain: 'calmsite97.space', isActive: true, isPrivate: false },
      { id: 'calm_17', domain: 'sendcalm66.cloud', isActive: true, isPrivate: false },
      { id: 'calm_18', domain: 'dropcalm.live', isActive: true, isPrivate: false },
      { id: 'calm_19', domain: 'calmpost93.space', isActive: true, isPrivate: false },
      { id: 'calm_20', domain: 'sitecalm.email', isActive: true, isPrivate: false },
      { id: 'calm_21', domain: 'calmdrop.io', isActive: true, isPrivate: false },
      { id: 'calm_22', domain: 'lettercalm.cloud', isActive: true, isPrivate: false },
      { id: 'calm_23', domain: 'calmtemp40.me', isActive: true, isPrivate: false },
      { id: 'calm_24', domain: 'sitecalm.xyz', isActive: true, isPrivate: false },
      { id: 'calm_25', domain: 'quickcalm97.email', isActive: true, isPrivate: false },
      { id: 'calm_26', domain: 'calmgate.zone', isActive: true, isPrivate: false },
      { id: 'calm_27', domain: 'mailcalm.zone', isActive: true, isPrivate: false },
      { id: 'calm_28', domain: 'calmsend.xyz', isActive: true, isPrivate: false },
      { id: 'calm_29', domain: 'calmhub.co', isActive: true, isPrivate: false },
      { id: 'calm_30', domain: 'calmhost.dev', isActive: true, isPrivate: false },
      { id: 'calm_31', domain: 'calmweb.site', isActive: true, isPrivate: false },
      { id: 'calm_32', domain: 'relaycalm.tech', isActive: true, isPrivate: false },
      { id: 'calm_33', domain: 'inboxcalm.tech', isActive: true, isPrivate: false },
      { id: 'calm_34', domain: 'msgcalm.tech', isActive: true, isPrivate: false },
      { id: 'calm_35', domain: 'gatecalm.email', isActive: true, isPrivate: false },
      { id: 'calm_36', domain: 'calmquick.online', isActive: true, isPrivate: false },
      { id: 'calm_37', domain: 'sitecalm.me', isActive: true, isPrivate: false },
      { id: 'calm_38', domain: 'calmquick.pw', isActive: true, isPrivate: false },
      { id: 'calm_39', domain: 'relaycalm.live', isActive: true, isPrivate: false },
      { id: 'calm_40', domain: 'calmbox.live', isActive: true, isPrivate: false },
      { id: 'calm_41', domain: 'tempcalm.cloud', isActive: true, isPrivate: false },
      { id: 'calm_42', domain: 'gatecalm.cloud', isActive: true, isPrivate: false },
      { id: 'calm_43', domain: 'calmbox40.cloud', isActive: true, isPrivate: false },
      { id: 'calm_44', domain: 'fastcalm27.co', isActive: true, isPrivate: false },
      { id: 'calm_45', domain: 'relaycalm.com', isActive: true, isPrivate: false },
      { id: 'calm_46', domain: 'calmmail.info', isActive: true, isPrivate: false },
      { id: 'calm_47', domain: 'calmpost.online', isActive: true, isPrivate: false },
      { id: 'calm_48', domain: 'calmmail.org', isActive: true, isPrivate: false },
      { id: 'calm_49', domain: 'calmmail.io', isActive: true, isPrivate: false }
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

module.exports = CalmPool;
