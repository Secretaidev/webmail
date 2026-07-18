/**
 * XyronMail - GetNada Provider Plugin
 * https://getnada.com
 */
const BASE = 'https://getnada.com/api/v1';

class GetNadaProvider {
  constructor() {
    this.name = 'getnada';
    this.displayName = 'GetNada';
    this.baseUrl = BASE;
    this.cachedDomains = [];
  }

  async getDomains() {
    try {
      const r = await fetch(`${BASE}/domains`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      const domains = Array.isArray(data) ? data : (data.domains || []);
      this.cachedDomains = domains.map((d, i) => ({
        id: `gn_${i}`,
        domain: typeof d === 'string' ? d : d.domain,
        isActive: true,
        isPrivate: false
      }));
      return this.cachedDomains;
    } catch (e) {
      console.error(`[GetNada] getDomains: ${e.message}`);
      this.cachedDomains = [
        'getnada.com', 'getnada.net', 'getnada.email', 'abyssmail.com',
        'boximail.com', 'clrmail.com', 'dropjar.com', 'getairmail.com',
        'givmail.com', 'inboxbear.com', 'robot-mail.com', 'tafmail.com',
        'vomoto.com', 'zetmail.com'
      ].map((d, i) => ({ id: `gn_${i}`, domain: d, isActive: true, isPrivate: false }));
      return this.cachedDomains;
    }
  }

  async createAccount(address) {
    const email = address || `${this._random()}@${this.cachedDomains[0]?.domain || 'getnada.com'}`;
    const r = await fetch(`${BASE}/inboxes/${encodeURIComponent(email)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!r.ok && r.status !== 409) throw new Error(`HTTP ${r.status}`);
    return { id: email, address: email, createdAt: new Date().toISOString() };
  }

  async getToken(address) { return address; }

  async getMessages(token) {
    try {
      const r = await fetch(`${BASE}/inboxes/${encodeURIComponent(token)}`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      const msgs = Array.isArray(data) ? data : (data.msgs || data.messages || []);
      return msgs.map(m => this._normalize(m, token));
    } catch (e) {
      console.error(`[GetNada] getMessages: ${e.message}`);
      return [];
    }
  }

  async getMessage(token, msgId) {
    const r = await fetch(`${BASE}/messages/${encodeURIComponent(msgId)}`);
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
      id: String(m.uid || m.id),
      providerMessageId: String(m.uid || m.id),
      from: { address: m.from || m.f || '', name: m.from || m.f || '' },
      to: [{ address: email, name: '' }],
      subject: m.s || m.subject || '(no subject)',
      intro: (m.text || m.text_plain || '').slice(0, 200),
      isRead: !!m.r, hasAttachments: false,
      size: 0,
      receivedAt: m.created_at ? new Date(m.created_at).toISOString() : new Date().toISOString()
    };
    if (full) { n.bodyText = m.text_plain || m.text || ''; n.bodyHtml = m.html_sanitized || m.html || ''; }
    return n;
  }

  _random() {
    const c = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let s = ''; for (let i = 0; i < 10; i++) s += c[Math.floor(Math.random() * c.length)];
    return s;
  }
}

module.exports = GetNadaProvider;
