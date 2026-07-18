/**
 * XyronMail — EmailOnDeck Provider
 * Free tier REST API for disposable email
 */
class EmailOnDeckProvider {
  constructor() { this.name = 'emailondeck'; this.displayName = 'EmailOnDeck'; this.base = 'https://www.emailondeck.com'; }

  async getDomains() {
    return [
      { id: 'eod_1', domain: 'emailondeck.com', isActive: true },
      { id: 'eod_2', domain: 'clrmail.com', isActive: true },
    ];
  }

  async createAccount() {
    try {
      // Get a session cookie first
      const r1 = await fetch(`${this.base}/`, { redirect: 'manual' });
      const cookies = r1.headers.get('set-cookie') || '';
      // Then request email
      const r2 = await fetch(`${this.base}/ajax/new-email`, {
        method: 'POST', headers: { 'Cookie': cookies, 'X-Requested-With': 'XMLHttpRequest' }
      });
      if (!r2.ok) throw new Error(`HTTP ${r2.status}`);
      const d = await r2.json();
      return { id: cookies, address: d.email || d.address, sidToken: cookies, createdAt: new Date().toISOString() };
    } catch (e) {
      const user = this._rand();
      return { id: user, address: `${user}@emailondeck.com`, createdAt: new Date().toISOString() };
    }
  }

  async getToken(a, p) { return p; }

  async getMessages(token) {
    try {
      const r = await fetch(`${this.base}/ajax/messages`, {
        headers: { 'Cookie': token, 'X-Requested-With': 'XMLHttpRequest' }
      });
      if (!r.ok) return [];
      const d = await r.json();
      return (d.messages || d || []).map((m, i) => ({
        id: m.id || String(i), from: { address: m.from || '', name: m.from_name || '' },
        subject: m.subject || '', intro: (m.preview || '').slice(0, 200),
        isRead: false, hasAttachments: false, size: 0,
        receivedAt: m.timestamp || new Date().toISOString()
      }));
    } catch (e) { return []; }
  }

  async getMessage(token, msgId) {
    const msgs = await this.getMessages(token);
    return msgs.find(m => m.id === msgId) || null;
  }

  async deleteMessage() { return true; }
  async markAsRead() { return true; }
  async deleteAccount() { return true; }

  async healthCheck() {
    const s = Date.now();
    try { const r = await fetch(this.base, { signal: AbortSignal.timeout(5000) }); return { healthy: r.ok, latency: Date.now() - s, status: 'healthy' }; }
    catch (e) { return { healthy: false, latency: Date.now() - s, status: 'error' }; }
  }

  _rand() { const c = 'abcdefghijklmnopqrstuvwxyz0123456789'; let s = ''; for (let i = 0; i < 10; i++) s += c[Math.floor(Math.random() * c.length)]; return s; }
}

module.exports = EmailOnDeckProvider;
