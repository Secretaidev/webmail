/**
 * XyronMail — DropMail.me Provider (GraphQL API)
 * Free, auto-generated tokens, no signup
 */
const BASE = 'https://dropmail.me/api/graphql';

class DropMailProvider {
  constructor() { this.name = 'dropmail'; this.displayName = 'DropMail'; this.authToken = 'web-test-' + Math.random().toString(36).slice(2, 10); }

  async getDomains() {
    try {
      const r = await fetch(`${BASE}/${this.authToken}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '{ domains { name } }' })
      });
      const d = await r.json();
      return (d.data?.domains || []).map((dm, i) => ({ id: `dm_${i}`, domain: dm.name, isActive: true }));
    } catch (e) {
      return [
        { id: 'dm_1', domain: 'dropmail.me', isActive: true },
        { id: 'dm_2', domain: 'emlhub.com', isActive: true },
        { id: 'dm_3', domain: 'emlpro.com', isActive: true },
      ];
    }
  }

  async createAccount() {
    try {
      const r = await fetch(`${BASE}/${this.authToken}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'mutation { introduceSession { id, expiresAt, addresses { address } } }' })
      });
      const d = await r.json();
      const session = d.data?.introduceSession;
      if (!session) throw new Error('Failed');
      const addr = session.addresses?.[0]?.address || '';
      return { id: session.id, address: addr, sidToken: session.id, createdAt: new Date().toISOString() };
    } catch (e) { throw e; }
  }

  async getToken(addr, pw) { return pw; }

  async getMessages(token) {
    try {
      const r = await fetch(`${BASE}/${this.authToken}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `{ session(id: "${token}") { mails { rawSize, fromAddr, toAddr, downloadUrl, text, headerSubject, receivedAt } } }` })
      });
      const d = await r.json();
      return (d.data?.session?.mails || []).map((m, i) => ({
        id: String(i), providerMessageId: String(i),
        from: { address: m.fromAddr || '', name: m.fromAddr || '' },
        to: [{ address: m.toAddr || '', name: '' }],
        subject: m.headerSubject || '(no subject)', intro: (m.text || '').slice(0, 200),
        bodyText: m.text || '', bodyHtml: '',
        isRead: false, hasAttachments: false, size: m.rawSize || 0,
        receivedAt: m.receivedAt || new Date().toISOString()
      }));
    } catch (e) { return []; }
  }

  async getMessage(token, msgId) {
    const msgs = await this.getMessages(token);
    return msgs.find(m => m.id === msgId) || msgs[parseInt(msgId)] || null;
  }

  async deleteMessage() { return true; }
  async markAsRead() { return true; }
  async deleteAccount() { return true; }

  async healthCheck() {
    const s = Date.now();
    try {
      const r = await fetch(`${BASE}/${this.authToken}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '{ domains { name } }' }),
        signal: AbortSignal.timeout(5000)
      });
      return { healthy: r.ok, latency: Date.now() - s, status: r.ok ? 'healthy' : 'error' };
    } catch (e) { return { healthy: false, latency: Date.now() - s, status: 'error', error: e.message }; }
  }
}

module.exports = DropMailProvider;
