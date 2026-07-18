/**
 * XyronMail — Dispostable Provider
 * Free disposable email REST API
 */
class DispostableProvider {
  constructor() { this.name = 'dispostable'; this.displayName = 'Dispostable'; this.base = 'https://www.dispostable.com/api/v1'; }

  async getDomains() {
    return [{ id: 'disp_1', domain: 'dispostable.com', isActive: true }];
  }

  async createAccount(address) {
    const user = address ? address.split('@')[0] : this._rand();
    return { id: user, address: `${user}@dispostable.com`, createdAt: new Date().toISOString() };
  }

  async getToken(address) { return address.split('@')[0]; }

  async getMessages(token) {
    try {
      const r = await fetch(`${this.base}/inbox/${token}`);
      if (!r.ok) return [];
      const d = await r.json();
      return (d || []).map((m, i) => ({
        id: m.id || String(i), providerMessageId: m.id || String(i),
        from: { address: m.sender || '', name: m.sender || '' },
        to: [{ address: `${token}@dispostable.com`, name: '' }],
        subject: m.subject || '(no subject)', intro: (m.body || '').slice(0, 200),
        isRead: false, hasAttachments: false, size: 0,
        receivedAt: m.received_at || new Date().toISOString()
      }));
    } catch (e) { return []; }
  }

  async getMessage(token, msgId) {
    try {
      const r = await fetch(`${this.base}/inbox/${token}/message/${msgId}`);
      if (!r.ok) throw new Error('Not found');
      const m = await r.json();
      return {
        id: m.id || msgId, from: { address: m.sender || '', name: m.sender || '' },
        to: [{ address: `${token}@dispostable.com` }],
        subject: m.subject || '', bodyText: m.body || '', bodyHtml: m.html || m.body || '',
        isRead: false, hasAttachments: false, size: 0,
        receivedAt: m.received_at || new Date().toISOString()
      };
    } catch (e) { throw e; }
  }

  async deleteMessage() { return true; }
  async markAsRead() { return true; }
  async deleteAccount() { return true; }

  async healthCheck() {
    const s = Date.now();
    try {
      const r = await fetch(`${this.base}/inbox/healthcheck`, { signal: AbortSignal.timeout(5000) });
      return { healthy: true, latency: Date.now() - s, status: 'healthy' };
    } catch (e) { return { healthy: false, latency: Date.now() - s, status: 'error' }; }
  }

  _rand() { const c = 'abcdefghijklmnopqrstuvwxyz0123456789'; let s = ''; for (let i = 0; i < 10; i++) s += c[Math.floor(Math.random() * c.length)]; return s; }
}

module.exports = DispostableProvider;
