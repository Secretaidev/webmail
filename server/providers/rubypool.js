/**
 * XyronMail - RubyPool Provider Plugin
 * Curated pool of ruby domains
 */
class RubyPool {
  constructor() {
    this.name = 'rubypool';
    this.displayName = 'Ruby Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'ruby_0', domain: 'msgruby.pw', isActive: true, isPrivate: false },
      { id: 'ruby_1', domain: 'postruby.xyz', isActive: true, isPrivate: false },
      { id: 'ruby_2', domain: 'sendruby.info', isActive: true, isPrivate: false },
      { id: 'ruby_3', domain: 'inboxruby.cloud', isActive: true, isPrivate: false },
      { id: 'ruby_4', domain: 'quickruby.co', isActive: true, isPrivate: false },
      { id: 'ruby_5', domain: 'rubysite.me', isActive: true, isPrivate: false },
      { id: 'ruby_6', domain: 'rubynet.com', isActive: true, isPrivate: false },
      { id: 'ruby_7', domain: 'rubysend27.pw', isActive: true, isPrivate: false },
      { id: 'ruby_8', domain: 'rubytemp.net', isActive: true, isPrivate: false },
      { id: 'ruby_9', domain: 'rubydrop.email', isActive: true, isPrivate: false },
      { id: 'ruby_10', domain: 'postruby40.space', isActive: true, isPrivate: false },
      { id: 'ruby_11', domain: 'dropruby.online', isActive: true, isPrivate: false },
      { id: 'ruby_12', domain: 'siteruby.cloud', isActive: true, isPrivate: false },
      { id: 'ruby_13', domain: 'hostruby.zone', isActive: true, isPrivate: false },
      { id: 'ruby_14', domain: 'msgruby.site', isActive: true, isPrivate: false },
      { id: 'ruby_15', domain: 'rubydrop.co', isActive: true, isPrivate: false },
      { id: 'ruby_16', domain: 'rubyzone.email', isActive: true, isPrivate: false },
      { id: 'ruby_17', domain: 'rubymsg.email', isActive: true, isPrivate: false },
      { id: 'ruby_18', domain: 'webruby.pw', isActive: true, isPrivate: false },
      { id: 'ruby_19', domain: 'fastruby.co', isActive: true, isPrivate: false },
      { id: 'ruby_20', domain: 'rubyzone.zone', isActive: true, isPrivate: false },
      { id: 'ruby_21', domain: 'rubysend.site', isActive: true, isPrivate: false },
      { id: 'ruby_22', domain: 'rubygate.pw', isActive: true, isPrivate: false },
      { id: 'ruby_23', domain: 'relayruby.zone', isActive: true, isPrivate: false },
      { id: 'ruby_24', domain: 'rubydrop.cc', isActive: true, isPrivate: false },
      { id: 'ruby_25', domain: 'rubysend.org', isActive: true, isPrivate: false },
      { id: 'ruby_26', domain: 'msgruby.org', isActive: true, isPrivate: false },
      { id: 'ruby_27', domain: 'rubymail.pw', isActive: true, isPrivate: false },
      { id: 'ruby_28', domain: 'rubytemp.pw', isActive: true, isPrivate: false },
      { id: 'ruby_29', domain: 'hubruby.org', isActive: true, isPrivate: false },
      { id: 'ruby_30', domain: 'rubyinbox43.cc', isActive: true, isPrivate: false },
      { id: 'ruby_31', domain: 'rubydrop.com', isActive: true, isPrivate: false },
      { id: 'ruby_32', domain: 'gateruby88.me', isActive: true, isPrivate: false },
      { id: 'ruby_33', domain: 'siteruby73.info', isActive: true, isPrivate: false },
      { id: 'ruby_34', domain: 'rubyzone.online', isActive: true, isPrivate: false },
      { id: 'ruby_35', domain: 'gateruby92.dev', isActive: true, isPrivate: false },
      { id: 'ruby_36', domain: 'netruby.com', isActive: true, isPrivate: false },
      { id: 'ruby_37', domain: 'webruby.com', isActive: true, isPrivate: false },
      { id: 'ruby_38', domain: 'rubygate.cloud', isActive: true, isPrivate: false },
      { id: 'ruby_39', domain: 'letterruby.cloud', isActive: true, isPrivate: false },
      { id: 'ruby_40', domain: 'rubynet.org', isActive: true, isPrivate: false },
      { id: 'ruby_41', domain: 'rubyletter.xyz', isActive: true, isPrivate: false },
      { id: 'ruby_42', domain: 'letterruby.space', isActive: true, isPrivate: false },
      { id: 'ruby_43', domain: 'rubyhub36.space', isActive: true, isPrivate: false },
      { id: 'ruby_44', domain: 'relayruby.me', isActive: true, isPrivate: false },
      { id: 'ruby_45', domain: 'rubytemp84.org', isActive: true, isPrivate: false },
      { id: 'ruby_46', domain: 'rubygate.org', isActive: true, isPrivate: false },
      { id: 'ruby_47', domain: 'hostruby.cc', isActive: true, isPrivate: false },
      { id: 'ruby_48', domain: 'rubyrelay.net', isActive: true, isPrivate: false },
      { id: 'ruby_49', domain: 'rubypost.net', isActive: true, isPrivate: false }
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

module.exports = RubyPool;
