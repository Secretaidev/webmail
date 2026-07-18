/**
 * XyronMail - BurnerMail Provider
 * https://burnermail.io
 */
const BASE = 'https://burnermail.io/api/v1';

class BurnerMailProvider {
  constructor() {
    this.name = 'burnermail';
    this.displayName = 'BurnerMail';
    this.cachedDomains = [];
  }

  async getDomains() {
    try {
      const r = await fetch(`${BASE}/domains`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      const domains = Array.isArray(data) ? data : (data.domains || []);
      this.cachedDomains = domains.map((d, i) => ({
        id: `bm_${i}`,
        domain: typeof d === 'string' ? d : d.domain,
        isActive: true,
        isPrivate: false
      }));
      return this.cachedDomains;
    } catch (e) {
      console.error(`[BurnerMail] getDomains: ${e.message}`);
      this.cachedDomains = ['burnermail.io', 'burner.email'].map((d, i) => ({
        id: `bm_${i}`, domain: d, isActive: true, isPrivate: false
      }));
      return this.cachedDomains;
    }
  }

  async createAccount(address) {
    if (address) return { id: address, address, createdAt: new Date().toISOString() };
    const r = await fetch(`${BASE}/inbox`, { method: 'POST' });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    const email = data.email || data.address || data.inbox;
    return { id: email, address: email, createdAt: new Date().toISOString() };
  }

  async getToken(address) { return address; }

  async getMessages(token) {
    try {
      const r = await fetch(`${BASE}/inbox/${encodeURIComponent(token)}/messages`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      const msgs = Array.isArray(data) ? data : (data.messages || []);
      return msgs.map(m => this._normalize(m, token));
    } catch (e) {
      console.error(`[BurnerMail] getMessages: ${e.message}`);
      return [];
    }
  }

  async getMessage(token, msgId) {
    const r = await fetch(`${BASE}/inbox/${encodeURIComponent(token)}/messages/${encodeURIComponent(msgId)}`);
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
      id: String(m.id || m.uid || m.messageId),
      providerMessageId: String(m.id || m.uid || m.messageId),
      from: { address: m.from || m.sender || '', name: m.fromName || '' },
      to: [{ address: email, name: '' }],
      subject: m.subject || '(no subject)',
      intro: (m.text || m.snippet || '').slice(0, 200),
      isRead: !!m.read, hasAttachments: false, size: 0,
      receivedAt: m.receivedAt || m.date || new Date().toISOString()
    };
    if (full) { n.bodyText = m.text || m.body || ''; n.bodyHtml = m.html || ''; }
    return n;
  }
}

module.exports = BurnerMailProvider;
