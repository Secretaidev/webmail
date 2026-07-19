/**
 * XyronMail - NodePool Provider Plugin
 * Curated pool of node domains
 */
class NodePool {
  constructor() {
    this.name = 'nodepool';
    this.displayName = 'Node Pool';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'node_0', domain: 'relaynode.co', isActive: true, isPrivate: false },
      { id: 'node_1', domain: 'postnode.xyz', isActive: true, isPrivate: false },
      { id: 'node_2', domain: 'nodefast.space', isActive: true, isPrivate: false },
      { id: 'node_3', domain: 'nodeinbox.tech', isActive: true, isPrivate: false },
      { id: 'node_4', domain: 'nodecloud.online', isActive: true, isPrivate: false },
      { id: 'node_5', domain: 'postnode.world', isActive: true, isPrivate: false },
      { id: 'node_6', domain: 'dropnode65.email', isActive: true, isPrivate: false },
      { id: 'node_7', domain: 'fastnode.email', isActive: true, isPrivate: false },
      { id: 'node_8', domain: 'postnode.io', isActive: true, isPrivate: false },
      { id: 'node_9', domain: 'nodemail.me', isActive: true, isPrivate: false },
      { id: 'node_10', domain: 'relaynode.live', isActive: true, isPrivate: false },
      { id: 'node_11', domain: 'nodezone.world', isActive: true, isPrivate: false },
      { id: 'node_12', domain: 'nodezone95.cloud', isActive: true, isPrivate: false },
      { id: 'node_13', domain: 'nodetemp59.space', isActive: true, isPrivate: false },
      { id: 'node_14', domain: 'nodeweb.co', isActive: true, isPrivate: false },
      { id: 'node_15', domain: 'nodehub.live', isActive: true, isPrivate: false },
      { id: 'node_16', domain: 'nodequick.cc', isActive: true, isPrivate: false },
      { id: 'node_17', domain: 'nodeletter.world', isActive: true, isPrivate: false },
      { id: 'node_18', domain: 'inboxnode93.cloud', isActive: true, isPrivate: false },
      { id: 'node_19', domain: 'webnode.xyz', isActive: true, isPrivate: false },
      { id: 'node_20', domain: 'dropnode.space', isActive: true, isPrivate: false },
      { id: 'node_21', domain: 'dropnode.org', isActive: true, isPrivate: false },
      { id: 'node_22', domain: 'noderelay.net', isActive: true, isPrivate: false },
      { id: 'node_23', domain: 'boxnode.cc', isActive: true, isPrivate: false },
      { id: 'node_24', domain: 'nodesend.world', isActive: true, isPrivate: false },
      { id: 'node_25', domain: 'letternode.online', isActive: true, isPrivate: false },
      { id: 'node_26', domain: 'sitenode.io', isActive: true, isPrivate: false },
      { id: 'node_27', domain: 'postnode.cc', isActive: true, isPrivate: false },
      { id: 'node_28', domain: 'postnode.co', isActive: true, isPrivate: false },
      { id: 'node_29', domain: 'hubnode.cc', isActive: true, isPrivate: false },
      { id: 'node_30', domain: 'nodezone21.co', isActive: true, isPrivate: false },
      { id: 'node_31', domain: 'tempnode.dev', isActive: true, isPrivate: false },
      { id: 'node_32', domain: 'boxnode.online', isActive: true, isPrivate: false },
      { id: 'node_33', domain: 'nodeweb90.cc', isActive: true, isPrivate: false },
      { id: 'node_34', domain: 'letternode86.site', isActive: true, isPrivate: false },
      { id: 'node_35', domain: 'quicknode.tech', isActive: true, isPrivate: false },
      { id: 'node_36', domain: 'nodemail.net', isActive: true, isPrivate: false },
      { id: 'node_37', domain: 'nodehost.space', isActive: true, isPrivate: false },
      { id: 'node_38', domain: 'boxnode.co', isActive: true, isPrivate: false },
      { id: 'node_39', domain: 'nodehub.cloud', isActive: true, isPrivate: false },
      { id: 'node_40', domain: 'nodebox19.dev', isActive: true, isPrivate: false },
      { id: 'node_41', domain: 'inboxnode31.org', isActive: true, isPrivate: false },
      { id: 'node_42', domain: 'inboxnode98.net', isActive: true, isPrivate: false },
      { id: 'node_43', domain: 'nodepost.zone', isActive: true, isPrivate: false },
      { id: 'node_44', domain: 'nodefast86.net', isActive: true, isPrivate: false },
      { id: 'node_45', domain: 'mailnode.online', isActive: true, isPrivate: false },
      { id: 'node_46', domain: 'nodebox.site', isActive: true, isPrivate: false },
      { id: 'node_47', domain: 'noderelay.org', isActive: true, isPrivate: false },
      { id: 'node_48', domain: 'nodeletter.zone', isActive: true, isPrivate: false },
      { id: 'node_49', domain: 'nodepost.cc', isActive: true, isPrivate: false }
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

module.exports = NodePool;
