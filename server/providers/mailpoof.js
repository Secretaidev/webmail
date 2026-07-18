/**
 * XyronMail - MailPoof Provider
 * https://mailpoof.com API
 */
const BASE = 'https://api.mailpoof.com';

class MailPoofProvider {
  constructor() {
    this.name = 'mailpoof';
    this.displayName = 'MailPoof';
    this.cachedDomains = [];
  }

  async getDomains() {
    try {
      const r = await fetch(`${BASE}/domains`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      const domains = Array.isArray(data) ? data : (data.domains || []);
      this.cachedDomains = domains.map((d, i) => ({
        id: `mp_${i}`,
        domain: typeof d === 'string' ? d : d.domain || d.name,
        isActive: true,
        isPrivate: false
      }));
      return this.cachedDomains;
    } catch (e) {
      console.error(`[MailPoof] getDomains: ${e.message}`);
      this.cachedDomains = ['mailpoof.com', 'mailsac.com'].map((d, i) => ({
        id: `mp_${i}`, domain: d, isActive: true, isPrivate: false
      }));
      return this.cachedDomains;
    }
  }

  async createAccount(address) {
    if (address) return { id: address, address, createdAt: new Date().toISOString() };
    const r = await fetch(`${BASE}/generate`, { method: 'POST' });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    const email = data.email || data.address;
    return { id: email, address: email, createdAt: new Date().toISOString() };
  }

  async getToken(address) { return address; }

  async getMessages(token) {
    try {
      const r = await fetch(`${BASE}/inbox?email=${encodeURIComponent(token)}`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      const msgs = Array.isArray(data) ? data : (data.messages || data.inbox || []);
      return msgs.map(m => this._normalize(m, token));
    } catch (e) {
      console.error(`[MailPoof] getMessages: ${e.message}`);
      return [];
    }
  }

  async getMessage(token, msgId) {
    const r = await fetch(`${BASE}/message?id=${encodeURIComponent(msgId)}&email=${encodeURIComponent(token)}`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return this._normalize(await r.json(), token, true);
  }

  async healthCheck() {
    const s = Date.now();
    try {
      const r = await fetch(`${BASE}/domains`, { signal: AbortSignal.timeout(5000) });
      return { healthy: r.ok, latency: Date.now() - s, status: r.ok ? 'healthy' : 'degraded' };
    } catch (e) {
      return { healthy: false, latency: Date.now() - s, status: 'error', error: e.message };
    }
  }

  _normalize(m, email, full = false) {
    const n = {
      id: String(m.id || m._id || m.messageId),
      providerMessageId: String(m.id || m._id || m.messageId),
      from: { address: m.from || m.sender || '', name: m.fromName || m.from || '' },
      to: [{ address: email, name: '' }],
      subject: m.subject || '(no subject)',
      intro: (m.text || m.body || m.preview || '').slice(0, 200),
      isRead: !!m.read, hasAttachments: !!(m.attachments?.length), size: m.size || 0,
      receivedAt: m.date ? new Date(m.date).toISOString() : new Date().toISOString()
    };
    if (full) { n.bodyText = m.text || m.body_text || ''; n.bodyHtml = m.html || m.body_html || ''; }
    return n;
  }
}

module.exports = MailPoofProvider;
