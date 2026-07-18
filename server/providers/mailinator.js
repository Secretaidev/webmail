/**
 * XyronMail - Mailinator Public Provider Plugin
 */
const BASE = 'https://mailinator.com/api/v2';

class MailinatorProvider {
  constructor() {
    this.name = 'mailinator';
    this.displayName = 'Mailinator';
    this.baseUrl = BASE;
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      'mailinator.com', 'mailinator.net', 'mailinator2.com',
      'mailinater.com', 'mailinator.co', 'mailinator.info'
    ].map((d, i) => ({ id: `mi_${i}`, domain: d, isActive: true, isPrivate: false }));
    return this.cachedDomains;
  }

  async createAccount(address) {
    const email = address || `${this._random()}@mailinator.com`;
    return { id: email.split('@')[0], address: email, createdAt: new Date().toISOString() };
  }

  async getToken(address) { return address.split('@')[0]; }

  async getMessages(token) {
    try {
      const inbox = token.includes('@') ? token.split('@')[0] : token;
      const r = await fetch(`${BASE}/domains/public/inboxes/${encodeURIComponent(inbox)}?limit=50`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      const msgs = data.msgs || data.messages || [];
      return msgs.map(m => this._normalize(m, token));
    } catch (e) {
      console.error(`[Mailinator] getMessages: ${e.message}`);
      return [];
    }
  }

  async getMessage(token, msgId) {
    const r = await fetch(`${BASE}/domains/public/messages/${encodeURIComponent(msgId)}/texthtml`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const html = await r.text();
    const textR = await fetch(`${BASE}/domains/public/messages/${encodeURIComponent(msgId)}/text`);
    const text = textR.ok ? await textR.text() : '';
    return {
      id: msgId, providerMessageId: msgId,
      from: { address: '', name: '' },
      to: [{ address: token, name: '' }],
      subject: '(no subject)', intro: text.slice(0, 200),
      isRead: false, hasAttachments: false, size: 0,
      receivedAt: new Date().toISOString(),
      bodyText: text, bodyHtml: html
    };
  }

  async healthCheck() {
    const s = Date.now();
    try {
      const r = await fetch(`${BASE}/domains/public/inboxes/test?limit=1`, { signal: AbortSignal.timeout(5000) });
      return { healthy: r.ok, latency: Date.now() - s, status: r.ok ? 'healthy' : 'degraded' };
    } catch (e) {
      return { healthy: false, latency: Date.now() - s, status: 'error', error: e.message };
    }
  }

  _normalize(m, email, full = false) {
    const n = {
      id: String(m.id),
      providerMessageId: String(m.id),
      from: { address: m.from || m.origfrom || '', name: m.from || '' },
      to: [{ address: email, name: '' }],
      subject: m.subject || '(no subject)',
      intro: (m.excerpt || m.snippet || '').slice(0, 200),
      isRead: !!m.read, hasAttachments: !!(m.attachments?.length),
      size: m.size || 0,
      receivedAt: m.time ? new Date(m.time).toISOString() : new Date().toISOString()
    };
    if (full) { n.bodyText = m.text || ''; n.bodyHtml = m.html || ''; }
    return n;
  }

  _random() {
    const c = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let s = ''; for (let i = 0; i < 10; i++) s += c[Math.floor(Math.random() * c.length)];
    return s;
  }
}

module.exports = MailinatorProvider;
