/**
 * XyronMail - Fake.legal Provider Plugin
 */
const BASE = 'https://fake.legal/api';

class FakeLegalProvider {
  constructor() {
    this.name = 'fakelegal';
    this.displayName = 'Fake.legal';
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
        id: `fl_${i}`,
        domain: typeof d === 'string' ? d : d.domain,
        isActive: true,
        isPrivate: false
      }));
      return this.cachedDomains;
    } catch (e) {
      console.error(`[FakeLegal] getDomains: ${e.message}`);
      this.cachedDomains = ['fake.legal', 'imgui.de', 'pulsewebmenu.de'].map((d, i) => ({
        id: `fl_${i}`, domain: d, isActive: true, isPrivate: false
      }));
      return this.cachedDomains;
    }
  }

  async createAccount(address) {
    const body = address ? { email: address } : {};
    const r = await fetch(`${BASE}/inbox/new`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    const email = data.email || data.address;
    return { id: email, address: email, createdAt: new Date().toISOString() };
  }

  async getToken(address) { return address; }

  async getMessages(token) {
    try {
      const r = await fetch(`${BASE}/inbox/${encodeURIComponent(token)}`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      const msgs = Array.isArray(data) ? data : (data.messages || data.emails || []);
      return msgs.map(m => this._normalize(m, token));
    } catch (e) {
      console.error(`[FakeLegal] getMessages: ${e.message}`);
      return [];
    }
  }

  async getMessage(token, msgId) {
    const r = await fetch(`${BASE}/inbox/${encodeURIComponent(token)}/${msgId}`);
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
      id: String(m.id || m.uid),
      providerMessageId: String(m.id || m.uid),
      from: { address: m.from || m.sender || '', name: m.from || '' },
      to: [{ address: email, name: '' }],
      subject: m.subject || '(no subject)',
      intro: (m.text || m.body || '').slice(0, 200),
      isRead: !!m.read, hasAttachments: false,
      size: 0,
      receivedAt: m.date || m.created_at || new Date().toISOString()
    };
    if (full) { n.bodyText = m.text || m.body_text || ''; n.bodyHtml = m.html || m.body_html || ''; }
    return n;
  }
}

module.exports = FakeLegalProvider;
