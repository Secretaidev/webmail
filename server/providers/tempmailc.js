/**
 * XyronMail - TempMailC Provider Plugin
 * https://tempmailc.com/api/v1/docs
 */
const BASE = 'https://tempmailc.com/api/v1';

class TempMailCProvider {
  constructor() {
    this.name = 'tempmailc';
    this.displayName = 'TempMailC';
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
        id: `tc_${i}`,
        domain: typeof d === 'string' ? d : d.domain,
        isActive: true,
        isPrivate: false
      }));
      return this.cachedDomains;
    } catch (e) {
      console.error(`[TempMailC] getDomains: ${e.message}`);
      this.cachedDomains = ['tempmailc.com', 'tmpmail.org', 'tmpbox.net'].map((d, i) => ({
        id: `tc_${i}`, domain: d, isActive: true, isPrivate: false
      }));
      return this.cachedDomains;
    }
  }

  async createAccount(address) {
    if (address) {
      return { id: address, address, createdAt: new Date().toISOString() };
    }
    const r = await fetch(`${BASE}/new`);
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
      console.error(`[TempMailC] getMessages: ${e.message}`);
      return [];
    }
  }

  async getMessage(token, msgId) {
    const r = await fetch(`${BASE}/message?email=${encodeURIComponent(token)}&msg_id=${encodeURIComponent(msgId)}`);
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
      id: String(m.id || m.msg_id || m.message_id),
      providerMessageId: String(m.id || m.msg_id || m.message_id),
      from: { address: m.from || m.sender || '', name: m.from_name || m.from || '' },
      to: [{ address: email, name: '' }],
      subject: m.subject || '(no subject)',
      intro: (m.text || m.body || m.preview || '').slice(0, 200),
      isRead: !!m.read, hasAttachments: !!(m.attachments?.length),
      size: m.size || 0,
      receivedAt: m.date ? new Date(m.date).toISOString() : new Date().toISOString()
    };
    if (full) { n.bodyText = m.text || m.body_text || ''; n.bodyHtml = m.html || m.body_html || ''; }
    return n;
  }
}

module.exports = TempMailCProvider;
