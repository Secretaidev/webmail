/**
 * XyronMail - BetaPool Provider Plugin
 * Curated pool of beta domains
 */
class BetaPool {
  constructor() {
    this.name = 'betapool';
    this.displayName = 'Beta Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'beta_0', domain: 'betasite.co', isActive: true, isPrivate: false },
      { id: 'beta_1', domain: 'betanet.email', isActive: true, isPrivate: false },
      { id: 'beta_2', domain: 'postbeta.space', isActive: true, isPrivate: false },
      { id: 'beta_3', domain: 'betapost.io', isActive: true, isPrivate: false },
      { id: 'beta_4', domain: 'betapost.live', isActive: true, isPrivate: false },
      { id: 'beta_5', domain: 'msgbeta.world', isActive: true, isPrivate: false },
      { id: 'beta_6', domain: 'betaweb.cloud', isActive: true, isPrivate: false },
      { id: 'beta_7', domain: 'webbeta.org', isActive: true, isPrivate: false },
      { id: 'beta_8', domain: 'betatemp64.co', isActive: true, isPrivate: false },
      { id: 'beta_9', domain: 'relaybeta.live', isActive: true, isPrivate: false },
      { id: 'beta_10', domain: 'betazone.live', isActive: true, isPrivate: false },
      { id: 'beta_11', domain: 'betabox.online', isActive: true, isPrivate: false },
      { id: 'beta_12', domain: 'betasite.xyz', isActive: true, isPrivate: false },
      { id: 'beta_13', domain: 'inboxbeta.xyz', isActive: true, isPrivate: false },
      { id: 'beta_14', domain: 'webbeta.info', isActive: true, isPrivate: false },
      { id: 'beta_15', domain: 'betaweb30.info', isActive: true, isPrivate: false },
      { id: 'beta_16', domain: 'betafast.space', isActive: true, isPrivate: false },
      { id: 'beta_17', domain: 'betaquick.email', isActive: true, isPrivate: false },
      { id: 'beta_18', domain: 'msgbeta43.cloud', isActive: true, isPrivate: false },
      { id: 'beta_19', domain: 'betamail.xyz', isActive: true, isPrivate: false },
      { id: 'beta_20', domain: 'boxbeta.com', isActive: true, isPrivate: false },
      { id: 'beta_21', domain: 'betapost.site', isActive: true, isPrivate: false },
      { id: 'beta_22', domain: 'cloudbeta57.site', isActive: true, isPrivate: false },
      { id: 'beta_23', domain: 'betanet.info', isActive: true, isPrivate: false },
      { id: 'beta_24', domain: 'betainbox.me', isActive: true, isPrivate: false },
      { id: 'beta_25', domain: 'hubbeta33.dev', isActive: true, isPrivate: false },
      { id: 'beta_26', domain: 'betagate.dev', isActive: true, isPrivate: false },
      { id: 'beta_27', domain: 'betazone.site', isActive: true, isPrivate: false },
      { id: 'beta_28', domain: 'tempbeta.xyz', isActive: true, isPrivate: false },
      { id: 'beta_29', domain: 'betasend.world', isActive: true, isPrivate: false },
      { id: 'beta_30', domain: 'betarelay.email', isActive: true, isPrivate: false },
      { id: 'beta_31', domain: 'betaletter85.net', isActive: true, isPrivate: false },
      { id: 'beta_32', domain: 'betamail26.org', isActive: true, isPrivate: false },
      { id: 'beta_33', domain: 'betarelay.net', isActive: true, isPrivate: false },
      { id: 'beta_34', domain: 'betasite.tech', isActive: true, isPrivate: false },
      { id: 'beta_35', domain: 'inboxbeta61.org', isActive: true, isPrivate: false },
      { id: 'beta_36', domain: 'zonebeta.info', isActive: true, isPrivate: false },
      { id: 'beta_37', domain: 'betahub.xyz', isActive: true, isPrivate: false },
      { id: 'beta_38', domain: 'letterbeta21.online', isActive: true, isPrivate: false },
      { id: 'beta_39', domain: 'betapost95.info', isActive: true, isPrivate: false },
      { id: 'beta_40', domain: 'letterbeta44.site', isActive: true, isPrivate: false },
      { id: 'beta_41', domain: 'sitebeta.cc', isActive: true, isPrivate: false },
      { id: 'beta_42', domain: 'relaybeta51.email', isActive: true, isPrivate: false },
      { id: 'beta_43', domain: 'zonebeta48.site', isActive: true, isPrivate: false },
      { id: 'beta_44', domain: 'betahub.co', isActive: true, isPrivate: false },
      { id: 'beta_45', domain: 'inboxbeta.io', isActive: true, isPrivate: false },
      { id: 'beta_46', domain: 'relaybeta53.zone', isActive: true, isPrivate: false },
      { id: 'beta_47', domain: 'msgbeta.me', isActive: true, isPrivate: false },
      { id: 'beta_48', domain: 'tempbeta.co', isActive: true, isPrivate: false },
      { id: 'beta_49', domain: 'hostbeta.zone', isActive: true, isPrivate: false }
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

module.exports = BetaPool;
