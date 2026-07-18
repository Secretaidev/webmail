/**
 * XyronMail — TempMail.gg Provider
 * Free REST API for disposable email
 */
class TempMailGgProvider {
  constructor() { this.name = 'tempmailgg'; this.displayName = 'TempMail.gg'; this.base = 'https://api.tempmail.gg/v1'; }

  async getDomains() {
    try {
      const r = await fetch(`${this.base}/domains`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const d = await r.json();
      return (d.domains || d || []).map((dm, i) => ({
        id: `tgg_${i}`, domain: typeof dm === 'string' ? dm : dm.domain || dm.name, isActive: true
      }));
    } catch (e) {
      return [
        { id: 'tgg_1', domain: 'tempmail.gg', isActive: true },
        { id: 'tgg_2', domain: 'mailgg.org', isActive: true },
      ];
    }
  }

  async createAccount(address) {
    try {
      const r = await fetch(`${this.base}/email/new`, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const d = await r.json();
      return { id: d.token || d.id, address: d.email || d.address, sidToken: d.token, createdAt: new Date().toISOString() };
    } catch (e) {
      const u = this._rand();
      return { id: u, address: `${u}@tempmail.gg`, createdAt: new Date().toISOString() };
    }
  }

  async getToken(a, p) { return p; }
  async getMessages(token) {
    try {
      const r = await fetch(`${this.base}/email/${token}/messages`);
      if (!r.ok) return [];
      const d = await r.json();
      return (d.messages || d || []).map(m => ({
        id: String(m.id || m._id), providerMessageId: String(m.id),
        from: { address: m.from || m.sender || '', name: m.from_name || '' },
        to: [{ address: m.to || '' }], subject: m.subject || '(no subject)',
        intro: (m.body || m.preview || '').slice(0, 200), isRead: false,
        hasAttachments: false, size: 0, receivedAt: m.date || m.created_at || new Date().toISOString()
      }));
    } catch (e) { return []; }
  }
  async getMessage(token, msgId) { const msgs = await this.getMessages(token); return msgs.find(m => m.id === msgId) || null; }
  async deleteMessage() { return true; }
  async markAsRead() { return true; }
  async deleteAccount() { return true; }
  async healthCheck() { const s = Date.now(); try { const r = await fetch(`${this.base}/domains`, { signal: AbortSignal.timeout(5000) }); return { healthy: r.ok, latency: Date.now() - s, status: r.ok ? 'healthy' : 'degraded' }; } catch (e) { return { healthy: false, latency: Date.now() - s, status: 'error', error: e.message }; } }
  _rand() { const c = 'abcdefghijklmnopqrstuvwxyz0123456789'; let s = ''; for (let i = 0; i < 10; i++) s += c[Math.floor(Math.random() * c.length)]; return s; }
}
module.exports = TempMailGgProvider;
