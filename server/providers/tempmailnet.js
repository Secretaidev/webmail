/**
 * XyronMail - Temp-Mail.net Provider
 */
const BASE = 'https://www.temp-mail.net/api/v1';

class TempMailNetProvider {
  constructor() {
    this.name = 'tempmailnet';
    this.displayName = 'Temp-Mail.net';
    this.cachedDomains = [];
  }

  async getDomains() {
    try {
      const r = await fetch(`${BASE}/domains`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      const domains = Array.isArray(data) ? data : (data.domains || []);
      this.cachedDomains = domains.map((d, i) => ({
        id: `tn_${i}`,
        domain: typeof d === 'string' ? d : d.domain || d.name,
        isActive: true,
        isPrivate: false
      }));
      return this.cachedDomains;
    } catch (e) {
      console.error(`[TempMail.net] getDomains: ${e.message}`);
      this.cachedDomains = ['temp-mail.net', 'tempmail.net'].map((d, i) => ({
        id: `tn_${i}`, domain: d, isActive: true, isPrivate: false
      }));
      return this.cachedDomains;
    }
  }

  async createAccount(address) {
    if (address) return { id: address, address, createdAt: new Date().toISOString() };
    const r = await fetch(`${BASE}/email/new`, { method: 'POST' });
    if (!r.ok) {
      const login = this._randomLogin();
      const email = `${login}@temp-mail.net`;
      return { id: email, address: email, createdAt: new Date().toISOString() };
    }
    const data = await r.json();
    const email = data.email || data.address;
    return { id: email, address: email, createdAt: new Date().toISOString() };
  }

  async getToken(address) { return address; }

  async getMessages(token) {
    try {
      const r = await fetch(`${BASE}/email/${encodeURIComponent(token)}/messages`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      const msgs = Array.isArray(data) ? data : (data.messages || []);
      return msgs.map(m => this._normalize(m, token));
    } catch (e) {
      console.error(`[TempMail.net] getMessages: ${e.message}`);
      return [];
    }
  }

  async getMessage(token, msgId) {
    const r = await fetch(`${BASE}/email/${encodeURIComponent(token)}/messages/${encodeURIComponent(msgId)}`);
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
      id: String(m.id || m._id),
      providerMessageId: String(m.id || m._id),
      from: { address: m.from || m.sender || '', name: m.fromName || m.from || '' },
      to: [{ address: email, name: '' }],
      subject: m.subject || '(no subject)',
      intro: (m.text || m.body || '').slice(0, 200),
      isRead: !!m.read, hasAttachments: false, size: 0,
      receivedAt: m.date ? new Date(m.date).toISOString() : new Date().toISOString()
    };
    if (full) { n.bodyText = m.text || m.body_text || ''; n.bodyHtml = m.html || m.body_html || ''; }
    return n;
  }

  _randomLogin() {
    const c = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let s = '';
    for (let i = 0; i < 10; i++) s += c[Math.floor(Math.random() * c.length)];
    return s;
  }
}

module.exports = TempMailNetProvider;
