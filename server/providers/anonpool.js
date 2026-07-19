/**
 * XyronMail - AnonPool Provider Plugin
 * Curated pool of anon domains
 */
class AnonPool {
  constructor() {
    this.name = 'anonpool';
    this.displayName = 'Anon Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'anon_0', domain: 'anonquick.net', isActive: true, isPrivate: false },
      { id: 'anon_1', domain: 'anonmsg.cloud', isActive: true, isPrivate: false },
      { id: 'anon_2', domain: 'tempanon.live', isActive: true, isPrivate: false },
      { id: 'anon_3', domain: 'quickanon.me', isActive: true, isPrivate: false },
      { id: 'anon_4', domain: 'anonsend.live', isActive: true, isPrivate: false },
      { id: 'anon_5', domain: 'anonmail.dev', isActive: true, isPrivate: false },
      { id: 'anon_6', domain: 'mailanon.io', isActive: true, isPrivate: false },
      { id: 'anon_7', domain: 'fastanon.pw', isActive: true, isPrivate: false },
      { id: 'anon_8', domain: 'fastanon.zone', isActive: true, isPrivate: false },
      { id: 'anon_9', domain: 'anonhub.online', isActive: true, isPrivate: false },
      { id: 'anon_10', domain: 'anongate.world', isActive: true, isPrivate: false },
      { id: 'anon_11', domain: 'hubanon.com', isActive: true, isPrivate: false },
      { id: 'anon_12', domain: 'anoninbox.com', isActive: true, isPrivate: false },
      { id: 'anon_13', domain: 'mailanon.space', isActive: true, isPrivate: false },
      { id: 'anon_14', domain: 'anonbox.me', isActive: true, isPrivate: false },
      { id: 'anon_15', domain: 'zoneanon.me', isActive: true, isPrivate: false },
      { id: 'anon_16', domain: 'dropanon33.zone', isActive: true, isPrivate: false },
      { id: 'anon_17', domain: 'anontemp.space', isActive: true, isPrivate: false },
      { id: 'anon_18', domain: 'msganon.pw', isActive: true, isPrivate: false },
      { id: 'anon_19', domain: 'anonquick.email', isActive: true, isPrivate: false },
      { id: 'anon_20', domain: 'anonsite.pw', isActive: true, isPrivate: false },
      { id: 'anon_21', domain: 'netanon.info', isActive: true, isPrivate: false },
      { id: 'anon_22', domain: 'postanon.live', isActive: true, isPrivate: false },
      { id: 'anon_23', domain: 'zoneanon.com', isActive: true, isPrivate: false },
      { id: 'anon_24', domain: 'anongate.email', isActive: true, isPrivate: false },
      { id: 'anon_25', domain: 'anonbox.live', isActive: true, isPrivate: false },
      { id: 'anon_26', domain: 'anonmail.com', isActive: true, isPrivate: false },
      { id: 'anon_27', domain: 'hostanon.org', isActive: true, isPrivate: false },
      { id: 'anon_28', domain: 'anonmail.xyz', isActive: true, isPrivate: false },
      { id: 'anon_29', domain: 'anoninbox.dev', isActive: true, isPrivate: false },
      { id: 'anon_30', domain: 'anontemp.cloud', isActive: true, isPrivate: false },
      { id: 'anon_31', domain: 'quickanon.io', isActive: true, isPrivate: false },
      { id: 'anon_32', domain: 'siteanon.me', isActive: true, isPrivate: false },
      { id: 'anon_33', domain: 'anondrop.info', isActive: true, isPrivate: false },
      { id: 'anon_34', domain: 'anonbox.online', isActive: true, isPrivate: false },
      { id: 'anon_35', domain: 'anonmsg.org', isActive: true, isPrivate: false },
      { id: 'anon_36', domain: 'msganon41.cc', isActive: true, isPrivate: false },
      { id: 'anon_37', domain: 'anonzone.co', isActive: true, isPrivate: false },
      { id: 'anon_38', domain: 'anonzone.net', isActive: true, isPrivate: false },
      { id: 'anon_39', domain: 'dropanon.info', isActive: true, isPrivate: false },
      { id: 'anon_40', domain: 'letteranon63.online', isActive: true, isPrivate: false },
      { id: 'anon_41', domain: 'anonnet.co', isActive: true, isPrivate: false },
      { id: 'anon_42', domain: 'anonletter.info', isActive: true, isPrivate: false },
      { id: 'anon_43', domain: 'relayanon54.net', isActive: true, isPrivate: false },
      { id: 'anon_44', domain: 'anoninbox97.org', isActive: true, isPrivate: false },
      { id: 'anon_45', domain: 'msganon.zone', isActive: true, isPrivate: false },
      { id: 'anon_46', domain: 'sendanon57.dev', isActive: true, isPrivate: false },
      { id: 'anon_47', domain: 'anonhub.cc', isActive: true, isPrivate: false },
      { id: 'anon_48', domain: 'anoncloud.online', isActive: true, isPrivate: false },
      { id: 'anon_49', domain: 'anonsite60.cc', isActive: true, isPrivate: false }
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

module.exports = AnonPool;
