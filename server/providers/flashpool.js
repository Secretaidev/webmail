/**
 * XyronMail - FlashPool Provider Plugin
 * Curated pool of flash domains
 */
class FlashPool {
  constructor() {
    this.name = 'flashpool';
    this.displayName = 'Flash Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'flash_0', domain: 'fastflash.cloud', isActive: true, isPrivate: false },
      { id: 'flash_1', domain: 'flashmail43.dev', isActive: true, isPrivate: false },
      { id: 'flash_2', domain: 'netflash.dev', isActive: true, isPrivate: false },
      { id: 'flash_3', domain: 'relayflash.com', isActive: true, isPrivate: false },
      { id: 'flash_4', domain: 'flashgate.io', isActive: true, isPrivate: false },
      { id: 'flash_5', domain: 'sendflash.world', isActive: true, isPrivate: false },
      { id: 'flash_6', domain: 'netflash.online', isActive: true, isPrivate: false },
      { id: 'flash_7', domain: 'cloudflash.xyz', isActive: true, isPrivate: false },
      { id: 'flash_8', domain: 'tempflash.space', isActive: true, isPrivate: false },
      { id: 'flash_9', domain: 'flashhost.info', isActive: true, isPrivate: false },
      { id: 'flash_10', domain: 'sendflash.tech', isActive: true, isPrivate: false },
      { id: 'flash_11', domain: 'webflash.com', isActive: true, isPrivate: false },
      { id: 'flash_12', domain: 'flashzone.pw', isActive: true, isPrivate: false },
      { id: 'flash_13', domain: 'flashweb.zone', isActive: true, isPrivate: false },
      { id: 'flash_14', domain: 'flashmsg.space', isActive: true, isPrivate: false },
      { id: 'flash_15', domain: 'postflash.dev', isActive: true, isPrivate: false },
      { id: 'flash_16', domain: 'relayflash.net', isActive: true, isPrivate: false },
      { id: 'flash_17', domain: 'flashweb53.zone', isActive: true, isPrivate: false },
      { id: 'flash_18', domain: 'gateflash94.cloud', isActive: true, isPrivate: false },
      { id: 'flash_19', domain: 'flashnet71.space', isActive: true, isPrivate: false },
      { id: 'flash_20', domain: 'siteflash.site', isActive: true, isPrivate: false },
      { id: 'flash_21', domain: 'msgflash.zone', isActive: true, isPrivate: false },
      { id: 'flash_22', domain: 'dropflash39.org', isActive: true, isPrivate: false },
      { id: 'flash_23', domain: 'flashfast.me', isActive: true, isPrivate: false },
      { id: 'flash_24', domain: 'boxflash56.live', isActive: true, isPrivate: false },
      { id: 'flash_25', domain: 'flashmail.xyz', isActive: true, isPrivate: false },
      { id: 'flash_26', domain: 'gateflash27.com', isActive: true, isPrivate: false },
      { id: 'flash_27', domain: 'flashletter.me', isActive: true, isPrivate: false },
      { id: 'flash_28', domain: 'siteflash.pw', isActive: true, isPrivate: false },
      { id: 'flash_29', domain: 'letterflash33.online', isActive: true, isPrivate: false },
      { id: 'flash_30', domain: 'flashbox.io', isActive: true, isPrivate: false },
      { id: 'flash_31', domain: 'dropflash89.email', isActive: true, isPrivate: false },
      { id: 'flash_32', domain: 'postflash.me', isActive: true, isPrivate: false },
      { id: 'flash_33', domain: 'gateflash.pw', isActive: true, isPrivate: false },
      { id: 'flash_34', domain: 'flashcloud.me', isActive: true, isPrivate: false },
      { id: 'flash_35', domain: 'postflash.co', isActive: true, isPrivate: false },
      { id: 'flash_36', domain: 'flashmsg.site', isActive: true, isPrivate: false },
      { id: 'flash_37', domain: 'flashcloud.com', isActive: true, isPrivate: false },
      { id: 'flash_38', domain: 'flashsend68.io', isActive: true, isPrivate: false },
      { id: 'flash_39', domain: 'letterflash.com', isActive: true, isPrivate: false },
      { id: 'flash_40', domain: 'flashbox.world', isActive: true, isPrivate: false },
      { id: 'flash_41', domain: 'flashzone.world', isActive: true, isPrivate: false },
      { id: 'flash_42', domain: 'flashhub.space', isActive: true, isPrivate: false },
      { id: 'flash_43', domain: 'mailflash.online', isActive: true, isPrivate: false },
      { id: 'flash_44', domain: 'msgflash.email', isActive: true, isPrivate: false },
      { id: 'flash_45', domain: 'flashbox.zone', isActive: true, isPrivate: false },
      { id: 'flash_46', domain: 'msgflash.io', isActive: true, isPrivate: false },
      { id: 'flash_47', domain: 'flashnet.online', isActive: true, isPrivate: false },
      { id: 'flash_48', domain: 'flashdrop.world', isActive: true, isPrivate: false },
      { id: 'flash_49', domain: 'zoneflash94.com', isActive: true, isPrivate: false }
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

module.exports = FlashPool;
