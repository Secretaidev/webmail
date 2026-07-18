/**
 * XyronMail — Temp-Mail.io Provider
 * REST API (free tier available)
 */
class TempMailIoProvider {
  constructor() { this.name = 'tempmailio'; this.displayName = 'Temp-Mail.io'; this.base = 'https://api.internal.temp-mail.io/api/v3'; }

  async getDomains() {
    try {
      const r = await fetch(`${this.base}/domains`, { headers: { Accept: 'application/json' } });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const d = await r.json();
      return (d.domains || d || []).map((dm, i) => ({
        id: `tio_${i}`, domain: typeof dm === 'string' ? dm : dm.name, isActive: true
      }));
    } catch (e) {
      return [
        { id: 'tio_1', domain: 'mailto.plus', isActive: true },
        { id: 'tio_2', domain: 'fexpost.com', isActive: true },
        { id: 'tio_3', domain: 'fexbox.org', isActive: true },
        { id: 'tio_4', domain: 'fexbox.ru', isActive: true },
        { id: 'tio_5', domain: 'mailbox.in.ua', isActive: true },
        { id: 'tio_6', domain: 'rover.info', isActive: true },
        { id: 'tio_7', domain: 'inpwa.com', isActive: true },
        { id: 'tio_8', domain: 'inticity.com', isActive: true },
        { id: 'tio_9', domain: 'chitthi.in', isActive: true },
        { id: 'tio_10', domain: 'labworld.org', isActive: true },
        { id: 'tio_11', domain: 'laste.ml', isActive: true },
      ];
    }
  }

  async createAccount(address) {
    try {
      const r = await fetch(`${this.base}/email/new`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(address ? { name: address.split('@')[0], domain: address.split('@')[1] } : {})
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const d = await r.json();
      return { id: d.token || d.email, address: d.email, sidToken: d.token, createdAt: new Date().toISOString() };
    } catch (e) { throw e; }
  }

  async getToken(addr, pw) { return pw; }

  async getMessages(token) {
    try {
      const r = await fetch(`${this.base}/email/${token}/messages`, { headers: { Accept: 'application/json' } });
      if (!r.ok) return [];
      const msgs = await r.json();
      return (msgs || []).map(m => ({
        id: String(m.id || m._id), providerMessageId: String(m.id || m._id),
        from: { address: m.from || '', name: m.from || '' },
        to: [{ address: m.to || '' }],
        subject: m.subject || '(no subject)', intro: (m.body_text || '').slice(0, 200),
        bodyText: m.body_text || '', bodyHtml: m.body_html || '',
        isRead: false, hasAttachments: !!(m.attachments?.length),
        size: 0, receivedAt: m.created_at || new Date().toISOString()
      }));
    } catch (e) { return []; }
  }

  async getMessage(token, msgId) {
    const msgs = await this.getMessages(token);
    const m = msgs.find(x => x.id === msgId);
    return m || null;
  }

  async deleteMessage() { return true; }
  async markAsRead() { return true; }
  async deleteAccount() { return true; }

  async healthCheck() {
    const s = Date.now();
    try {
      const r = await fetch(`${this.base}/domains`, { signal: AbortSignal.timeout(5000) });
      return { healthy: r.ok, latency: Date.now() - s, status: r.ok ? 'healthy' : 'error' };
    } catch (e) { return { healthy: false, latency: Date.now() - s, status: 'error' }; }
  }
}

module.exports = TempMailIoProvider;
