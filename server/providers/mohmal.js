/**
 * XyronMail — Mohmal Provider (Arabic temp email)
 * REST-based temporary email service
 */
class MohmalProvider {
  constructor() { this.name = 'mohmal'; this.displayName = 'Mohmal'; this.base = 'https://www.mohmal.com/en/api'; }

  async getDomains() {
    return [
      { id: 'moh_1', domain: 'mohmal.com', isActive: true },
      { id: 'moh_2', domain: 'mohmal.im', isActive: true },
      { id: 'moh_3', domain: 'mohmal.in', isActive: true },
      { id: 'moh_4', domain: 'mohmal.tech', isActive: true },
    ];
  }

  async createAccount(address) {
    try {
      const r = await fetch(`${this.base}/random`, { method: 'POST' });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const d = await r.json();
      const cookies = r.headers.get('set-cookie') || '';
      return { id: cookies || d.email, address: d.email || d.name + '@mohmal.com', sidToken: cookies, createdAt: new Date().toISOString() };
    } catch (e) {
      const u = this._rand();
      return { id: u, address: `${u}@mohmal.com`, createdAt: new Date().toISOString() };
    }
  }

  async getToken(a, p) { return p; }

  async getMessages(token) {
    try {
      const r = await fetch(`${this.base}/inbox`, { headers: { 'Cookie': token } });
      if (!r.ok) return [];
      const d = await r.json();
      return (d.data || d || []).map((m, i) => ({
        id: m.id || String(i), from: { address: m.from || '', name: m.sender || '' },
        subject: m.subject || '', intro: (m.preview || '').slice(0, 200),
        isRead: false, hasAttachments: false, size: 0,
        receivedAt: m.time || new Date().toISOString()
      }));
    } catch (e) { return []; }
  }

  async getMessage(token, msgId) {
    try {
      const r = await fetch(`${this.base}/message/${msgId}`, { headers: { 'Cookie': token } });
      if (!r.ok) throw new Error('Not found');
      const m = await r.json();
      return { id: m.id, from: { address: m.from }, subject: m.subject, bodyText: m.text || '', bodyHtml: m.html || '', isRead: false, hasAttachments: false, receivedAt: m.time || new Date().toISOString() };
    } catch (e) { throw e; }
  }

  async deleteMessage() { return true; }
  async markAsRead() { return true; }
  async deleteAccount() { return true; }
  async healthCheck() { const s = Date.now(); try { await fetch(this.base, { signal: AbortSignal.timeout(5000) }); return { healthy: true, latency: Date.now() - s, status: 'healthy' }; } catch (e) { return { healthy: false, latency: Date.now() - s, status: 'error' }; } }
  _rand() { const c = 'abcdefghijklmnopqrstuvwxyz0123456789'; let s = ''; for (let i = 0; i < 10; i++) s += c[Math.floor(Math.random() * c.length)]; return s; }
}

module.exports = MohmalProvider;
