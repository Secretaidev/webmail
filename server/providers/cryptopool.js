/**
 * XyronMail - CryptoPool Provider Plugin
 * Curated pool of crypto domains
 */
class CryptoPool {
  constructor() {
    this.name = 'cryptopool';
    this.displayName = 'Crypto Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'crypto_0', domain: 'gatecrypto.dev', isActive: true, isPrivate: false },
      { id: 'crypto_1', domain: 'netcrypto.email', isActive: true, isPrivate: false },
      { id: 'crypto_2', domain: 'hostcrypto.cc', isActive: true, isPrivate: false },
      { id: 'crypto_3', domain: 'cryptoweb.space', isActive: true, isPrivate: false },
      { id: 'crypto_4', domain: 'cryptonet.site', isActive: true, isPrivate: false },
      { id: 'crypto_5', domain: 'cryptosite.email', isActive: true, isPrivate: false },
      { id: 'crypto_6', domain: 'boxcrypto.cc', isActive: true, isPrivate: false },
      { id: 'crypto_7', domain: 'hubcrypto27.xyz', isActive: true, isPrivate: false },
      { id: 'crypto_8', domain: 'cryptosend.email', isActive: true, isPrivate: false },
      { id: 'crypto_9', domain: 'cryptobox22.site', isActive: true, isPrivate: false },
      { id: 'crypto_10', domain: 'inboxcrypto.cloud', isActive: true, isPrivate: false },
      { id: 'crypto_11', domain: 'cryptoletter.email', isActive: true, isPrivate: false },
      { id: 'crypto_12', domain: 'cryptosite.cc', isActive: true, isPrivate: false },
      { id: 'crypto_13', domain: 'cryptohost47.xyz', isActive: true, isPrivate: false },
      { id: 'crypto_14', domain: 'netcrypto85.email', isActive: true, isPrivate: false },
      { id: 'crypto_15', domain: 'cryptopost.me', isActive: true, isPrivate: false },
      { id: 'crypto_16', domain: 'cryptofast23.co', isActive: true, isPrivate: false },
      { id: 'crypto_17', domain: 'cloudcrypto.cc', isActive: true, isPrivate: false },
      { id: 'crypto_18', domain: 'msgcrypto.co', isActive: true, isPrivate: false },
      { id: 'crypto_19', domain: 'cryptorelay45.xyz', isActive: true, isPrivate: false },
      { id: 'crypto_20', domain: 'inboxcrypto.zone', isActive: true, isPrivate: false },
      { id: 'crypto_21', domain: 'cryptonet51.com', isActive: true, isPrivate: false },
      { id: 'crypto_22', domain: 'quickcrypto.info', isActive: true, isPrivate: false },
      { id: 'crypto_23', domain: 'cryptobox.co', isActive: true, isPrivate: false },
      { id: 'crypto_24', domain: 'hubcrypto.tech', isActive: true, isPrivate: false },
      { id: 'crypto_25', domain: 'cryptogate.site', isActive: true, isPrivate: false },
      { id: 'crypto_26', domain: 'zonecrypto.org', isActive: true, isPrivate: false },
      { id: 'crypto_27', domain: 'sendcrypto81.me', isActive: true, isPrivate: false },
      { id: 'crypto_28', domain: 'msgcrypto.space', isActive: true, isPrivate: false },
      { id: 'crypto_29', domain: 'cryptomail37.io', isActive: true, isPrivate: false },
      { id: 'crypto_30', domain: 'lettercrypto.com', isActive: true, isPrivate: false },
      { id: 'crypto_31', domain: 'cryptodrop.live', isActive: true, isPrivate: false },
      { id: 'crypto_32', domain: 'cryptonet44.space', isActive: true, isPrivate: false },
      { id: 'crypto_33', domain: 'cloudcrypto46.zone', isActive: true, isPrivate: false },
      { id: 'crypto_34', domain: 'cloudcrypto.zone', isActive: true, isPrivate: false },
      { id: 'crypto_35', domain: 'cryptomail.me', isActive: true, isPrivate: false },
      { id: 'crypto_36', domain: 'webcrypto.tech', isActive: true, isPrivate: false },
      { id: 'crypto_37', domain: 'quickcrypto.site', isActive: true, isPrivate: false },
      { id: 'crypto_38', domain: 'cryptofast.cloud', isActive: true, isPrivate: false },
      { id: 'crypto_39', domain: 'cryptotemp16.email', isActive: true, isPrivate: false },
      { id: 'crypto_40', domain: 'tempcrypto.world', isActive: true, isPrivate: false },
      { id: 'crypto_41', domain: 'cryptorelay95.email', isActive: true, isPrivate: false },
      { id: 'crypto_42', domain: 'cryptozone.com', isActive: true, isPrivate: false },
      { id: 'crypto_43', domain: 'sitecrypto.pw', isActive: true, isPrivate: false },
      { id: 'crypto_44', domain: 'cryptorelay.xyz', isActive: true, isPrivate: false },
      { id: 'crypto_45', domain: 'cryptogate.space', isActive: true, isPrivate: false },
      { id: 'crypto_46', domain: 'cryptocloud.live', isActive: true, isPrivate: false },
      { id: 'crypto_47', domain: 'cryptomail23.email', isActive: true, isPrivate: false },
      { id: 'crypto_48', domain: 'cryptosend14.pw', isActive: true, isPrivate: false },
      { id: 'crypto_49', domain: 'cryptofast.live', isActive: true, isPrivate: false }
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

module.exports = CryptoPool;
