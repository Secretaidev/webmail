/**
 * XyronMail - PlusPool Provider Plugin
 * Curated pool of plus domains
 */
class PlusPool {
  constructor() {
    this.name = 'pluspool';
    this.displayName = 'Plus Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'plus_0', domain: 'quickplus.online', isActive: true, isPrivate: false },
      { id: 'plus_1', domain: 'pluscloud.space', isActive: true, isPrivate: false },
      { id: 'plus_2', domain: 'plusbox.cloud', isActive: true, isPrivate: false },
      { id: 'plus_3', domain: 'plusrelay.site', isActive: true, isPrivate: false },
      { id: 'plus_4', domain: 'inboxplus.xyz', isActive: true, isPrivate: false },
      { id: 'plus_5', domain: 'plushost.online', isActive: true, isPrivate: false },
      { id: 'plus_6', domain: 'pluscloud.org', isActive: true, isPrivate: false },
      { id: 'plus_7', domain: 'plushost.dev', isActive: true, isPrivate: false },
      { id: 'plus_8', domain: 'boxplus.cloud', isActive: true, isPrivate: false },
      { id: 'plus_9', domain: 'relayplus.info', isActive: true, isPrivate: false },
      { id: 'plus_10', domain: 'plusrelay.com', isActive: true, isPrivate: false },
      { id: 'plus_11', domain: 'plusdrop.tech', isActive: true, isPrivate: false },
      { id: 'plus_12', domain: 'plushost.tech', isActive: true, isPrivate: false },
      { id: 'plus_13', domain: 'plusmail.org', isActive: true, isPrivate: false },
      { id: 'plus_14', domain: 'plussend.dev', isActive: true, isPrivate: false },
      { id: 'plus_15', domain: 'plusfast.live', isActive: true, isPrivate: false },
      { id: 'plus_16', domain: 'sendplus.cc', isActive: true, isPrivate: false },
      { id: 'plus_17', domain: 'plusdrop.cloud', isActive: true, isPrivate: false },
      { id: 'plus_18', domain: 'pluspost.io', isActive: true, isPrivate: false },
      { id: 'plus_19', domain: 'webplus.net', isActive: true, isPrivate: false },
      { id: 'plus_20', domain: 'plusfast.pw', isActive: true, isPrivate: false },
      { id: 'plus_21', domain: 'plusrelay.cloud', isActive: true, isPrivate: false },
      { id: 'plus_22', domain: 'pluszone.xyz', isActive: true, isPrivate: false },
      { id: 'plus_23', domain: 'pluszone.org', isActive: true, isPrivate: false },
      { id: 'plus_24', domain: 'sendplus34.space', isActive: true, isPrivate: false },
      { id: 'plus_25', domain: 'pluszone19.dev', isActive: true, isPrivate: false },
      { id: 'plus_26', domain: 'plusletter.email', isActive: true, isPrivate: false },
      { id: 'plus_27', domain: 'pluscloud.zone', isActive: true, isPrivate: false },
      { id: 'plus_28', domain: 'plushost68.co', isActive: true, isPrivate: false },
      { id: 'plus_29', domain: 'plusnet56.live', isActive: true, isPrivate: false },
      { id: 'plus_30', domain: 'plusweb.me', isActive: true, isPrivate: false },
      { id: 'plus_31', domain: 'pluszone.online', isActive: true, isPrivate: false },
      { id: 'plus_32', domain: 'plustemp.com', isActive: true, isPrivate: false },
      { id: 'plus_33', domain: 'plustemp.email', isActive: true, isPrivate: false },
      { id: 'plus_34', domain: 'webplus.world', isActive: true, isPrivate: false },
      { id: 'plus_35', domain: 'zoneplus.net', isActive: true, isPrivate: false },
      { id: 'plus_36', domain: 'boxplus.com', isActive: true, isPrivate: false },
      { id: 'plus_37', domain: 'plusweb.org', isActive: true, isPrivate: false },
      { id: 'plus_38', domain: 'sendplus.io', isActive: true, isPrivate: false },
      { id: 'plus_39', domain: 'pluscloud.io', isActive: true, isPrivate: false },
      { id: 'plus_40', domain: 'plusgate.pw', isActive: true, isPrivate: false },
      { id: 'plus_41', domain: 'plusweb.live', isActive: true, isPrivate: false },
      { id: 'plus_42', domain: 'msgplus.pw', isActive: true, isPrivate: false },
      { id: 'plus_43', domain: 'plusletter.tech', isActive: true, isPrivate: false },
      { id: 'plus_44', domain: 'zoneplus.dev', isActive: true, isPrivate: false },
      { id: 'plus_45', domain: 'plusquick.pw', isActive: true, isPrivate: false },
      { id: 'plus_46', domain: 'plusbox.cc', isActive: true, isPrivate: false },
      { id: 'plus_47', domain: 'quickplus.me', isActive: true, isPrivate: false },
      { id: 'plus_48', domain: 'pluscloud.com', isActive: true, isPrivate: false },
      { id: 'plus_49', domain: 'plusrelay.tech', isActive: true, isPrivate: false }
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

module.exports = PlusPool;
