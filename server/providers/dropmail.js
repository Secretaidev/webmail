/**
 * DropMail - DropMail.me GraphQL API provider
 * API: https://dropmail.me/api/graphql/my-token-here
 * Domains: dropmail.me and others from their API
 */
const DROPMAIL_BASE = 'https://dropmail.me/api/graphql';

class DropMailProvider {
  constructor() {
    this.name = 'dropmail';
    this.displayName = 'DropMail';
    this.baseUrl = DROPMAIL_BASE;
    this.cachedDomains = [
      { id: 'dm_0', domain: 'dropmail.me', isActive: true, isPrivate: false },
    ];
    this.sessions = new Map(); // address -> sessionId
  }

  async getDomains() { return this.cachedDomains; }

  async createAccount(address) {
    try {
      // DropMail uses GraphQL with a session token
      const token = this._randomToken();
      const r = await fetch(`${this.baseUrl}/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '{ introduceSession { id, expiresAt, addresses { address } } }' })
      });
      const data = await r.json();
      const session = data?.data?.introduceSession;
      const addr = session?.addresses?.[0]?.address || `${this._randomLogin()}@dropmail.me`;
      this.sessions.set(addr, { token, sessionId: session?.id });
      return { id: addr, address: addr, token: JSON.stringify({ token, sessionId: session?.id, address: addr }), createdAt: new Date().toISOString() };
    } catch(e) {
      const addr = `${this._randomLogin()}@dropmail.me`;
      return { id: addr, address: addr, createdAt: new Date().toISOString() };
    }
  }

  async getToken(address) {
    const s = this.sessions.get(address);
    return s ? JSON.stringify(s) : null;
  }

  async getMessages(token) {
    try {
      const { token: apiToken, sessionId } = JSON.parse(token);
      const r = await fetch(`${this.baseUrl}/${apiToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `{ session(id: "${sessionId}") { mails { rawSize, fromAddr, toAddr, downloadUrl, text, headerSubject } } }` })
      });
      const data = await r.json();
      const mails = data?.data?.session?.mails || [];
      return mails.map((m, i) => ({
        id: String(i),
        from: { address: m.fromAddr || '', name: (m.fromAddr || '').split('@')[0] },
        subject: m.headerSubject || '(no subject)',
        intro: (m.text || '').substring(0, 100),
        isRead: false,
        receivedAt: new Date().toISOString()
      }));
    } catch(e) { return []; }
  }

  async getMessage(token, msgId) {
    try {
      const messages = await this.getMessages(token);
      const m = messages[parseInt(msgId)] || messages[0];
      return m ? { ...m, bodyText: m.intro, bodyHtml: m.intro } : { id: msgId, from: { address: '' }, subject: '', bodyText: '', bodyHtml: '' };
    } catch(e) { return { id: msgId, from: { address: '' }, subject: '', bodyText: '', bodyHtml: '' }; }
  }

  async deleteMessage() { return true; }
  async markAsRead() { return true; }
  async deleteAccount() { return true; }

  async healthCheck() {
    const s = Date.now();
    try {
      const r = await fetch(`${this.baseUrl}/test`, { signal: AbortSignal.timeout(5000), method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: '{ __typename }' }) });
      return { healthy: r.ok, latency: Date.now() - s, status: r.ok ? 'healthy' : 'degraded' };
    } catch(e) { return { healthy: false, latency: Date.now() - s, status: 'error', error: e.message }; }
  }

  _randomLogin() {
    const c = 'abcdefghijklmnopqrstuvwxyz0123456789'; let s = '';
    for (let i = 0; i < 10; i++) s += c[Math.floor(Math.random() * c.length)];
    return s;
  }

  _randomToken() {
    const c = 'abcdefghijklmnopqrstuvwxyz0123456789'; let s = '';
    for (let i = 0; i < 20; i++) s += c[Math.floor(Math.random() * c.length)];
    return s;
  }
}

module.exports = DropMailProvider;
