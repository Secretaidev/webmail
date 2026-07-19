/**
 * XyronMail - BitPool Provider Plugin
 * Curated pool of bit domains
 */
class BitPool {
  constructor() {
    this.name = 'bitpool';
    this.displayName = 'Bit Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'bit_0', domain: 'bitdrop.com', isActive: true, isPrivate: false },
      { id: 'bit_1', domain: 'fastbit.site', isActive: true, isPrivate: false },
      { id: 'bit_2', domain: 'bitmsg.org', isActive: true, isPrivate: false },
      { id: 'bit_3', domain: 'hubbit.site', isActive: true, isPrivate: false },
      { id: 'bit_4', domain: 'boxbit.dev', isActive: true, isPrivate: false },
      { id: 'bit_5', domain: 'bitletter.co', isActive: true, isPrivate: false },
      { id: 'bit_6', domain: 'bitrelay.dev', isActive: true, isPrivate: false },
      { id: 'bit_7', domain: 'bitquick.net', isActive: true, isPrivate: false },
      { id: 'bit_8', domain: 'bitfast.cc', isActive: true, isPrivate: false },
      { id: 'bit_9', domain: 'bitfast.cloud', isActive: true, isPrivate: false },
      { id: 'bit_10', domain: 'inboxbit.co', isActive: true, isPrivate: false },
      { id: 'bit_11', domain: 'gatebit.info', isActive: true, isPrivate: false },
      { id: 'bit_12', domain: 'relaybit.co', isActive: true, isPrivate: false },
      { id: 'bit_13', domain: 'bithub11.org', isActive: true, isPrivate: false },
      { id: 'bit_14', domain: 'msgbit84.cloud', isActive: true, isPrivate: false },
      { id: 'bit_15', domain: 'gatebit.zone', isActive: true, isPrivate: false },
      { id: 'bit_16', domain: 'netbit15.zone', isActive: true, isPrivate: false },
      { id: 'bit_17', domain: 'gatebit.com', isActive: true, isPrivate: false },
      { id: 'bit_18', domain: 'boxbit.cc', isActive: true, isPrivate: false },
      { id: 'bit_19', domain: 'boxbit.info', isActive: true, isPrivate: false },
      { id: 'bit_20', domain: 'msgbit.info', isActive: true, isPrivate: false },
      { id: 'bit_21', domain: 'boxbit86.io', isActive: true, isPrivate: false },
      { id: 'bit_22', domain: 'bitweb.live', isActive: true, isPrivate: false },
      { id: 'bit_23', domain: 'bitpost.me', isActive: true, isPrivate: false },
      { id: 'bit_24', domain: 'bitweb.net', isActive: true, isPrivate: false },
      { id: 'bit_25', domain: 'hostbit.cloud', isActive: true, isPrivate: false },
      { id: 'bit_26', domain: 'bitrelay.email', isActive: true, isPrivate: false },
      { id: 'bit_27', domain: 'relaybit.me', isActive: true, isPrivate: false },
      { id: 'bit_28', domain: 'bitzone.net', isActive: true, isPrivate: false },
      { id: 'bit_29', domain: 'zonebit49.info', isActive: true, isPrivate: false },
      { id: 'bit_30', domain: 'sitebit85.pw', isActive: true, isPrivate: false },
      { id: 'bit_31', domain: 'postbit.world', isActive: true, isPrivate: false },
      { id: 'bit_32', domain: 'bitweb52.cc', isActive: true, isPrivate: false },
      { id: 'bit_33', domain: 'postbit.cloud', isActive: true, isPrivate: false },
      { id: 'bit_34', domain: 'bitdrop.xyz', isActive: true, isPrivate: false },
      { id: 'bit_35', domain: 'webbit.space', isActive: true, isPrivate: false },
      { id: 'bit_36', domain: 'bithub.space', isActive: true, isPrivate: false },
      { id: 'bit_37', domain: 'bittemp.xyz', isActive: true, isPrivate: false },
      { id: 'bit_38', domain: 'sendbit.cc', isActive: true, isPrivate: false },
      { id: 'bit_39', domain: 'gatebit.online', isActive: true, isPrivate: false },
      { id: 'bit_40', domain: 'boxbit.xyz', isActive: true, isPrivate: false },
      { id: 'bit_41', domain: 'bitzone42.xyz', isActive: true, isPrivate: false },
      { id: 'bit_42', domain: 'zonebit64.net', isActive: true, isPrivate: false },
      { id: 'bit_43', domain: 'bitsite.dev', isActive: true, isPrivate: false },
      { id: 'bit_44', domain: 'boxbit.world', isActive: true, isPrivate: false },
      { id: 'bit_45', domain: 'sendbit.site', isActive: true, isPrivate: false },
      { id: 'bit_46', domain: 'bitweb.pw', isActive: true, isPrivate: false },
      { id: 'bit_47', domain: 'tempbit.world', isActive: true, isPrivate: false },
      { id: 'bit_48', domain: 'bitweb.space', isActive: true, isPrivate: false },
      { id: 'bit_49', domain: 'sendbit64.world', isActive: true, isPrivate: false }
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

module.exports = BitPool;
