/**
 * XyronMail - EdgePool Provider Plugin
 * Curated pool of edge domains
 */
class EdgePool {
  constructor() {
    this.name = 'edgepool';
    this.displayName = 'Edge Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'edge_0', domain: 'dropedge.me', isActive: true, isPrivate: false },
      { id: 'edge_1', domain: 'hubedge.cloud', isActive: true, isPrivate: false },
      { id: 'edge_2', domain: 'edgehost.site', isActive: true, isPrivate: false },
      { id: 'edge_3', domain: 'edgequick82.dev', isActive: true, isPrivate: false },
      { id: 'edge_4', domain: 'edgegate.email', isActive: true, isPrivate: false },
      { id: 'edge_5', domain: 'boxedge50.tech', isActive: true, isPrivate: false },
      { id: 'edge_6', domain: 'sendedge.me', isActive: true, isPrivate: false },
      { id: 'edge_7', domain: 'gateedge13.cloud', isActive: true, isPrivate: false },
      { id: 'edge_8', domain: 'edgetemp.xyz', isActive: true, isPrivate: false },
      { id: 'edge_9', domain: 'edgenet98.space', isActive: true, isPrivate: false },
      { id: 'edge_10', domain: 'dropedge.zone', isActive: true, isPrivate: false },
      { id: 'edge_11', domain: 'dropedge21.tech', isActive: true, isPrivate: false },
      { id: 'edge_12', domain: 'edgerelay92.pw', isActive: true, isPrivate: false },
      { id: 'edge_13', domain: 'tempedge.live', isActive: true, isPrivate: false },
      { id: 'edge_14', domain: 'postedge59.com', isActive: true, isPrivate: false },
      { id: 'edge_15', domain: 'netedge53.online', isActive: true, isPrivate: false },
      { id: 'edge_16', domain: 'edgehost98.site', isActive: true, isPrivate: false },
      { id: 'edge_17', domain: 'netedge.dev', isActive: true, isPrivate: false },
      { id: 'edge_18', domain: 'hostedge.space', isActive: true, isPrivate: false },
      { id: 'edge_19', domain: 'inboxedge.pw', isActive: true, isPrivate: false },
      { id: 'edge_20', domain: 'edgegate.pw', isActive: true, isPrivate: false },
      { id: 'edge_21', domain: 'edgequick.dev', isActive: true, isPrivate: false },
      { id: 'edge_22', domain: 'mailedge59.world', isActive: true, isPrivate: false },
      { id: 'edge_23', domain: 'edgetemp.world', isActive: true, isPrivate: false },
      { id: 'edge_24', domain: 'edgerelay46.tech', isActive: true, isPrivate: false },
      { id: 'edge_25', domain: 'letteredge.info', isActive: true, isPrivate: false },
      { id: 'edge_26', domain: 'edgequick.com', isActive: true, isPrivate: false },
      { id: 'edge_27', domain: 'hubedge.xyz', isActive: true, isPrivate: false },
      { id: 'edge_28', domain: 'edgesite.email', isActive: true, isPrivate: false },
      { id: 'edge_29', domain: 'edgefast.xyz', isActive: true, isPrivate: false },
      { id: 'edge_30', domain: 'edgequick.email', isActive: true, isPrivate: false },
      { id: 'edge_31', domain: 'edgemail.co', isActive: true, isPrivate: false },
      { id: 'edge_32', domain: 'edgeweb.space', isActive: true, isPrivate: false },
      { id: 'edge_33', domain: 'cloudedge.io', isActive: true, isPrivate: false },
      { id: 'edge_34', domain: 'edgebox.info', isActive: true, isPrivate: false },
      { id: 'edge_35', domain: 'edgetemp13.co', isActive: true, isPrivate: false },
      { id: 'edge_36', domain: 'postedge.space', isActive: true, isPrivate: false },
      { id: 'edge_37', domain: 'quickedge.site', isActive: true, isPrivate: false },
      { id: 'edge_38', domain: 'edgebox.cc', isActive: true, isPrivate: false },
      { id: 'edge_39', domain: 'edgequick.tech', isActive: true, isPrivate: false },
      { id: 'edge_40', domain: 'letteredge.pw', isActive: true, isPrivate: false },
      { id: 'edge_41', domain: 'edgesend.com', isActive: true, isPrivate: false },
      { id: 'edge_42', domain: 'edgehub.com', isActive: true, isPrivate: false },
      { id: 'edge_43', domain: 'edgenet.io', isActive: true, isPrivate: false },
      { id: 'edge_44', domain: 'boxedge71.live', isActive: true, isPrivate: false },
      { id: 'edge_45', domain: 'edgetemp.com', isActive: true, isPrivate: false },
      { id: 'edge_46', domain: 'netedge.pw', isActive: true, isPrivate: false },
      { id: 'edge_47', domain: 'edgemail.online', isActive: true, isPrivate: false },
      { id: 'edge_48', domain: 'edgesite.world', isActive: true, isPrivate: false },
      { id: 'edge_49', domain: 'edgemail12.info', isActive: true, isPrivate: false }
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

module.exports = EdgePool;
