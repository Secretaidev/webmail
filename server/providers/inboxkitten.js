/**
 * XyronMail - InboxKitten Provider Plugin
 */
const BASE = 'https://inboxkitten.com/api/v1';

class InboxKittenProvider {
  constructor() {
    this.name = 'inboxkitten';
    this.displayName = 'InboxKitten';
    this.baseUrl = BASE;
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = ['inboxkitten.com', 'inboxkitten.net'].map((d, i) => ({
      id: `ik_${i}`, domain: d, isActive: true, isPrivate: false
    }));
    return this.cachedDomains;
  }

  async createAccount(address) {
    if (address) return { id: address, address, createdAt: new Date().toISOString() };
    const r = await fetch(`${BASE}/mailbox/new`, { method: 'POST' });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    const email = data.email || data.address;
    return { id: email, address: email, createdAt: new Date().toISOString() };
  }

  async getToken(address) { return address; }

  async getMessages(token) {
    try {
      const r = await fetch(`${BASE}/mailbox/${encodeURIComponent(token)}/messages`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      const msgs = Array.isArray(data) ? data : (data.messages || []);
      return msgs.map(m => this._normalize(m, token));
    } catch (e) {
      console.error(`[InboxKitten] getMessages: ${e.message}`);
      return [];
    }
  }

  async getMessage(token, msgId) {
    const r = await fetch(`${BASE}/mailbox/${encodeURIComponent(token)}/messages/${msgId}`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return this._normalize(await r.json(), token, true);
  }

  async healthCheck() {
    const s = Date.now();
    try {
      const r = await fetch(`${BASE}/mailbox/new`, { method: 'POST', signal: AbortSignal.timeout(5000) });
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
      intro: (m.text || m.preview || '').slice(0, 200),
      isRead: !!m.read, hasAttachments: false,
      size: 0,
      receivedAt: m.date || m.received_at || new Date().toISOString()
    };
    if (full) { n.bodyText = m.text || m.body_text || ''; n.bodyHtml = m.html || m.body_html || ''; }
    return n;
  }
}

module.exports = InboxKittenProvider;
