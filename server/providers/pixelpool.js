/**
 * XyronMail - PixelPool Provider Plugin
 * Curated pool of pixel domains
 */
class PixelPool {
  constructor() {
    this.name = 'pixelpool';
    this.displayName = 'Pixel Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'pixel_0', domain: 'pixelzone37.net', isActive: true, isPrivate: false },
      { id: 'pixel_1', domain: 'mailpixel.com', isActive: true, isPrivate: false },
      { id: 'pixel_2', domain: 'relaypixel.co', isActive: true, isPrivate: false },
      { id: 'pixel_3', domain: 'hubpixel.zone', isActive: true, isPrivate: false },
      { id: 'pixel_4', domain: 'pixelgate.me', isActive: true, isPrivate: false },
      { id: 'pixel_5', domain: 'pixelmsg.info', isActive: true, isPrivate: false },
      { id: 'pixel_6', domain: 'hostpixel.com', isActive: true, isPrivate: false },
      { id: 'pixel_7', domain: 'pixelhost.dev', isActive: true, isPrivate: false },
      { id: 'pixel_8', domain: 'relaypixel.cc', isActive: true, isPrivate: false },
      { id: 'pixel_9', domain: 'letterpixel.live', isActive: true, isPrivate: false },
      { id: 'pixel_10', domain: 'netpixel.io', isActive: true, isPrivate: false },
      { id: 'pixel_11', domain: 'pixelinbox.info', isActive: true, isPrivate: false },
      { id: 'pixel_12', domain: 'pixelhub.site', isActive: true, isPrivate: false },
      { id: 'pixel_13', domain: 'pixelsite.info', isActive: true, isPrivate: false },
      { id: 'pixel_14', domain: 'pixelquick.space', isActive: true, isPrivate: false },
      { id: 'pixel_15', domain: 'pixelmsg.zone', isActive: true, isPrivate: false },
      { id: 'pixel_16', domain: 'netpixel.world', isActive: true, isPrivate: false },
      { id: 'pixel_17', domain: 'pixelmail.online', isActive: true, isPrivate: false },
      { id: 'pixel_18', domain: 'pixelsend.online', isActive: true, isPrivate: false },
      { id: 'pixel_19', domain: 'webpixel.com', isActive: true, isPrivate: false },
      { id: 'pixel_20', domain: 'webpixel.io', isActive: true, isPrivate: false },
      { id: 'pixel_21', domain: 'webpixel.cloud', isActive: true, isPrivate: false },
      { id: 'pixel_22', domain: 'pixelweb.dev', isActive: true, isPrivate: false },
      { id: 'pixel_23', domain: 'quickpixel.net', isActive: true, isPrivate: false },
      { id: 'pixel_24', domain: 'quickpixel.world', isActive: true, isPrivate: false },
      { id: 'pixel_25', domain: 'pixelgate.net', isActive: true, isPrivate: false },
      { id: 'pixel_26', domain: 'zonepixel.live', isActive: true, isPrivate: false },
      { id: 'pixel_27', domain: 'pixelquick.xyz', isActive: true, isPrivate: false },
      { id: 'pixel_28', domain: 'gatepixel.info', isActive: true, isPrivate: false },
      { id: 'pixel_29', domain: 'pixelnet.com', isActive: true, isPrivate: false },
      { id: 'pixel_30', domain: 'inboxpixel.world', isActive: true, isPrivate: false },
      { id: 'pixel_31', domain: 'inboxpixel.cc', isActive: true, isPrivate: false },
      { id: 'pixel_32', domain: 'pixeldrop89.io', isActive: true, isPrivate: false },
      { id: 'pixel_33', domain: 'pixelsend40.tech', isActive: true, isPrivate: false },
      { id: 'pixel_34', domain: 'pixelcloud69.io', isActive: true, isPrivate: false },
      { id: 'pixel_35', domain: 'pixelmail.dev', isActive: true, isPrivate: false },
      { id: 'pixel_36', domain: 'pixelhub.dev', isActive: true, isPrivate: false },
      { id: 'pixel_37', domain: 'mailpixel.email', isActive: true, isPrivate: false },
      { id: 'pixel_38', domain: 'pixelquick.io', isActive: true, isPrivate: false },
      { id: 'pixel_39', domain: 'letterpixel76.xyz', isActive: true, isPrivate: false },
      { id: 'pixel_40', domain: 'temppixel.dev', isActive: true, isPrivate: false },
      { id: 'pixel_41', domain: 'pixelpost.io', isActive: true, isPrivate: false },
      { id: 'pixel_42', domain: 'inboxpixel.io', isActive: true, isPrivate: false },
      { id: 'pixel_43', domain: 'letterpixel.me', isActive: true, isPrivate: false },
      { id: 'pixel_44', domain: 'pixelmsg67.cc', isActive: true, isPrivate: false },
      { id: 'pixel_45', domain: 'relaypixel.world', isActive: true, isPrivate: false },
      { id: 'pixel_46', domain: 'pixelhost61.net', isActive: true, isPrivate: false },
      { id: 'pixel_47', domain: 'zonepixel.io', isActive: true, isPrivate: false },
      { id: 'pixel_48', domain: 'pixelweb.net', isActive: true, isPrivate: false },
      { id: 'pixel_49', domain: 'inboxpixel93.live', isActive: true, isPrivate: false }
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

module.exports = PixelPool;
