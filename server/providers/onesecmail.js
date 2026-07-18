/**
 * XyronMail - 1secmail Provider Plugin
 * https://www.1secmail.com/api/
 * Free, no auth, instant disposable email
 */
const BASE = 'https://www.1secmail.com/api/v1/';

class OneSecMailProvider {
  constructor() {
    this.name = 'onesecmail';
    this.displayName = '1secMail';
    this.baseUrl = BASE;
    this.cachedDomains = [];
  }

  async getDomains() {
    try {
      const r = await fetch(`${this.baseUrl}?action=getDomainList`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const domains = await r.json();
      this.cachedDomains = domains.map((d, i) => ({ id: `1s_${i}`, domain: d, isActive: true, isPrivate: false }));
      return this.cachedDomains;
    } catch (e) {
      console.error(`[1secMail] getDomains: ${e.message}`);
      // Fallback known domains
      this.cachedDomains = ['1secmail.com','1secmail.org','1secmail.net','wwjmp.com','esiix.com','xojxe.com','yoggm.com']
        .map((d,i) => ({ id: `1s_${i}`, domain: d, isActive: true, isPrivate: false }));
      return this.cachedDomains;
    }
  }

  async createAccount(address) {
    // 1secmail doesn't require account creation - just use any address
    const parts = address ? address.split('@') : [];
    const login = parts[0] || this._randomLogin();
    const domain = parts[1] || '1secmail.com';
    return { id: `${login}@${domain}`, address: `${login}@${domain}`, createdAt: new Date().toISOString() };
  }

  async getToken(address) { return address; } // No auth needed

  async getMessages(token) {
    try {
      const [login, domain] = token.split('@');
      const r = await fetch(`${this.baseUrl}?action=getMessages&login=${encodeURIComponent(login)}&domain=${encodeURIComponent(domain)}`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const msgs = await r.json();
      return msgs.map(m => this._normalize(m, login, domain));
    } catch (e) {
      console.error(`[1secMail] getMessages: ${e.message}`);
      return [];
    }
  }

  async getMessage(token, msgId) {
    try {
      const [login, domain] = token.split('@');
      const r = await fetch(`${this.baseUrl}?action=readMessage&login=${encodeURIComponent(login)}&domain=${encodeURIComponent(domain)}&id=${msgId}`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const m = await r.json();
      return this._normalize(m, login, domain, true);
    } catch (e) {
      console.error(`[1secMail] getMessage: ${e.message}`);
      throw e;
    }
  }

  async deleteMessage() { return true; }
  async markAsRead() { return true; }
  async deleteAccount() { return true; }

  async healthCheck() {
    const s = Date.now();
    try {
      const r = await fetch(`${this.baseUrl}?action=getDomainList`, { signal: AbortSignal.timeout(5000) });
      return { healthy: r.ok, latency: Date.now() - s, status: r.ok ? 'healthy' : 'degraded' };
    } catch (e) {
      return { healthy: false, latency: Date.now() - s, status: 'error', error: e.message };
    }
  }

  _normalize(m, login, domain, full = false) {
    const n = {
      id: String(m.id), providerMessageId: String(m.id),
      from: { address: m.from || '', name: m.from || '' },
      to: [{ address: `${login}@${domain}`, name: '' }],
      subject: m.subject || '(no subject)',
      intro: m.textBody ? m.textBody.slice(0, 200) : '',
      isRead: false, hasAttachments: m.attachments && m.attachments.length > 0,
      size: 0, receivedAt: m.date ? new Date(m.date).toISOString() : new Date().toISOString(),
      attachments: (m.attachments || []).map(a => ({ id: a.filename, filename: a.filename, contentType: a.contentType, size: a.size }))
    };
    if (full) { n.bodyText = m.textBody || ''; n.bodyHtml = m.htmlBody || m.body || ''; }
    return n;
  }

  _randomLogin() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let s = ''; for (let i = 0; i < 10; i++) s += chars[Math.floor(Math.random() * chars.length)];
    return s;
  }
}

module.exports = OneSecMailProvider;
