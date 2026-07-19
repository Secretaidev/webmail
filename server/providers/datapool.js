/**
 * XyronMail - DataPool Provider Plugin
 * Curated pool of data domains
 */
class DataPool {
  constructor() {
    this.name = 'datapool';
    this.displayName = 'Data Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'data_0', domain: 'datatemp.cloud', isActive: true, isPrivate: false },
      { id: 'data_1', domain: 'dataletter.cc', isActive: true, isPrivate: false },
      { id: 'data_2', domain: 'datatemp.zone', isActive: true, isPrivate: false },
      { id: 'data_3', domain: 'datafast.co', isActive: true, isPrivate: false },
      { id: 'data_4', domain: 'datainbox.pw', isActive: true, isPrivate: false },
      { id: 'data_5', domain: 'clouddata.dev', isActive: true, isPrivate: false },
      { id: 'data_6', domain: 'datacloud.zone', isActive: true, isPrivate: false },
      { id: 'data_7', domain: 'inboxdata.tech', isActive: true, isPrivate: false },
      { id: 'data_8', domain: 'dataletter.live', isActive: true, isPrivate: false },
      { id: 'data_9', domain: 'datahost.com', isActive: true, isPrivate: false },
      { id: 'data_10', domain: 'datahost.dev', isActive: true, isPrivate: false },
      { id: 'data_11', domain: 'hostdata59.org', isActive: true, isPrivate: false },
      { id: 'data_12', domain: 'boxdata.site', isActive: true, isPrivate: false },
      { id: 'data_13', domain: 'databox.net', isActive: true, isPrivate: false },
      { id: 'data_14', domain: 'datadrop.pw', isActive: true, isPrivate: false },
      { id: 'data_15', domain: 'datasite.site', isActive: true, isPrivate: false },
      { id: 'data_16', domain: 'hostdata.org', isActive: true, isPrivate: false },
      { id: 'data_17', domain: 'netdata69.co', isActive: true, isPrivate: false },
      { id: 'data_18', domain: 'postdata.site', isActive: true, isPrivate: false },
      { id: 'data_19', domain: 'letterdata.dev', isActive: true, isPrivate: false },
      { id: 'data_20', domain: 'webdata.site', isActive: true, isPrivate: false },
      { id: 'data_21', domain: 'datagate.site', isActive: true, isPrivate: false },
      { id: 'data_22', domain: 'datamail.xyz', isActive: true, isPrivate: false },
      { id: 'data_23', domain: 'webdata.space', isActive: true, isPrivate: false },
      { id: 'data_24', domain: 'tempdata.xyz', isActive: true, isPrivate: false },
      { id: 'data_25', domain: 'datadrop.io', isActive: true, isPrivate: false },
      { id: 'data_26', domain: 'dataletter.online', isActive: true, isPrivate: false },
      { id: 'data_27', domain: 'datahub.net', isActive: true, isPrivate: false },
      { id: 'data_28', domain: 'zonedata.co', isActive: true, isPrivate: false },
      { id: 'data_29', domain: 'msgdata.dev', isActive: true, isPrivate: false },
      { id: 'data_30', domain: 'hubdata74.com', isActive: true, isPrivate: false },
      { id: 'data_31', domain: 'dataletter40.live', isActive: true, isPrivate: false },
      { id: 'data_32', domain: 'fastdata.world', isActive: true, isPrivate: false },
      { id: 'data_33', domain: 'fastdata.org', isActive: true, isPrivate: false },
      { id: 'data_34', domain: 'dataweb37.info', isActive: true, isPrivate: false },
      { id: 'data_35', domain: 'inboxdata.com', isActive: true, isPrivate: false },
      { id: 'data_36', domain: 'hubdata.world', isActive: true, isPrivate: false },
      { id: 'data_37', domain: 'quickdata.net', isActive: true, isPrivate: false },
      { id: 'data_38', domain: 'postdata.live', isActive: true, isPrivate: false },
      { id: 'data_39', domain: 'dataletter.io', isActive: true, isPrivate: false },
      { id: 'data_40', domain: 'datapost.xyz', isActive: true, isPrivate: false },
      { id: 'data_41', domain: 'datasend.net', isActive: true, isPrivate: false },
      { id: 'data_42', domain: 'maildata98.co', isActive: true, isPrivate: false },
      { id: 'data_43', domain: 'datahost34.zone', isActive: true, isPrivate: false },
      { id: 'data_44', domain: 'boxdata.info', isActive: true, isPrivate: false },
      { id: 'data_45', domain: 'hostdata.email', isActive: true, isPrivate: false },
      { id: 'data_46', domain: 'netdata.space', isActive: true, isPrivate: false },
      { id: 'data_47', domain: 'datanet.pw', isActive: true, isPrivate: false },
      { id: 'data_48', domain: 'senddata.co', isActive: true, isPrivate: false },
      { id: 'data_49', domain: 'dataletter.pw', isActive: true, isPrivate: false }
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

module.exports = DataPool;
