class GetAirMailProvider {
  constructor() {
    this.name = 'getairmail';
    this.displayName = 'GetAirMail';
    this.baseUrl = 'https://getairmail.com/request.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'gam_0', domain: 'getairmail.com', isActive: true, isPrivate: false },
      { id: 'gam_1', domain: 'airmail.cc', isActive: true, isPrivate: false },
      { id: 'gam_2', domain: 'superrito.com', isActive: true, isPrivate: false },
      { id: 'gam_3', domain: 'suremail.info', isActive: true, isPrivate: false }
    ];
    return this.cachedDomains;
  }

  async createAccount(address) {
    const parts = address ? address.split('@') : [];
    const login = parts[0] || this._randomLogin();
    const domain = parts[1] || this.cachedDomains[0]?.domain || 'getairmail.com';
    return { id: `${login}@${domain}`, address: `${login}@${domain}`, token: `${login}@${domain}`, createdAt: new Date().toISOString() };
  }

  async getToken(address) { return address; }

  async getMessages(token) {
    try {
      const [login, domain] = token.split('@');
      const r = await fetch(`https://getairmail.com/request.php?op=list&login=${login}&domain=${domain}`);
      const data = await r.json();
      return (data || []).map(m => ({ id: String(m.id), from: { address: m.from }, subject: m.subject, intro: '', isRead: false, receivedAt: new Date().toISOString() }));
    } catch(e) { return []; }
  }

  async getMessage(token, msgId) {
    try {
      const [login, domain] = token.split('@');
      const r = await fetch(`https://getairmail.com/request.php?op=read&id=${msgId}&login=${login}&domain=${domain}`);
      const data = await r.json();
      return { id: msgId, from: { address: data.from || '' }, subject: data.subject || '', bodyText: data.textBody || '', bodyHtml: data.htmlBody || '', receivedAt: new Date().toISOString() };
    } catch (e) {
      return { id: msgId, from: { address: '' }, subject: '', bodyText: 'Failed to load', bodyHtml: '' };
    }
  }

  _randomLogin() {
    const c='abcdefghijklmnopqrstuvwxyz0123456789'; let s='';
    for(let i=0;i<10;i++) s+=c[Math.floor(Math.random()*c.length)];
    return s;
  }
}

module.exports = GetAirMailProvider;
