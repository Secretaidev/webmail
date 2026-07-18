/**
 * XyronMail - HarakiriMail Provider
 * Free disposable email at harakirimail.com
 */
const BASE = 'https://harakirimail.com';

class HarakiriMailProvider {
  constructor() {
    this.name = 'harakirimail';
    this.displayName = 'HarakiriMail';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      { id: 'hk_1', domain: 'harakirimail.com', isActive: true, isPrivate: false }
    ];
    return this.cachedDomains;
  }

  async createAccount(address) {
    if (address) return { id: address, address, createdAt: new Date().toISOString() };
    const login = this._randomLogin();
    const email = `${login}@harakirimail.com`;
    return { id: email, address: email, createdAt: new Date().toISOString() };
  }

  async getToken(address) { return address; }

  async getMessages(token) {
    try {
      const r = await fetch(`${BASE}/ajax.php?f=check_inbox&email=${encodeURIComponent(token)}`, {
        headers: { Accept: 'application/json', 'User-Agent': 'XyronMail/2.0' }
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      const msgs = data.emails || data.messages || data.list || [];
      return msgs.map((m, i) => this._normalize(m, token, i));
    } catch (e) {
      // Return empty array instead of spamming console on normal errors
      return [];
    }
  }

  async getMessage(token, msgId) {
    try {
      const r = await fetch(`${BASE}/ajax.php?f=fetch_email&email=${encodeURIComponent(token)}&id=${encodeURIComponent(msgId)}`, {
        headers: { Accept: 'application/json', 'User-Agent': 'XyronMail/2.0' }
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return this._normalize(await r.json(), token, msgId, true);
    } catch (e) {
      const msgs = await this.getMessages(token);
      return msgs.find(m => m.id === String(msgId)) || null;
    }
  }

  async healthCheck() {
    const s = Date.now();
    try {
      const r = await fetch(`${BASE}/`, { signal: AbortSignal.timeout(5000) });
      return { healthy: r.ok, latency: Date.now() - s, status: r.ok ? 'healthy' : 'degraded' };
    } catch (e) {
      return { healthy: false, latency: Date.now() - s, status: 'error', error: e.message };
    }
  }

  _normalize(m, email, id, full = false) {
    const n = {
      id: String(m.id || m.mail_id || id),
      providerMessageId: String(m.id || m.mail_id || id),
      from: { address: m.from || m.mail_from || m.sender || '', name: m.from_name || m.from || '' },
      to: [{ address: email, name: '' }],
      subject: m.subject || m.mail_subject || '(no subject)',
      intro: (m.text || m.mail_excerpt || m.preview || '').slice(0, 200),
      isRead: !!m.read, hasAttachments: false, size: 0,
      receivedAt: m.date ? new Date(m.date).toISOString() : new Date().toISOString()
    };
    if (full) {
      n.bodyText = m.text || m.body_text || (m.body || '').replace(/<[^>]+>/g, '');
      n.bodyHtml = m.html || m.body || m.mail_body || '';
    }
    return n;
  }

  _randomLogin() {
    const c = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let s = '';
    for (let i = 0; i < 10; i++) s += c[Math.floor(Math.random() * c.length)];
    return s;
  }
}

module.exports = HarakiriMailProvider;
