/**
 * XyronMail - Mail.gw Provider Plugin
 * Mirror/fork of Mail.tm with same API structure
 * https://api.mail.gw
 */
const BASE = 'https://api.mail.gw';

class MailGwProvider {
  constructor() {
    this.name = 'mailgw';
    this.displayName = 'Mail.gw';
    this.baseUrl = BASE;
    this.cachedDomains = [];
  }

  async getDomains() {
    try {
      const r = await fetch(`${this.baseUrl}/domains`, { headers: { 'Accept': 'application/json' } });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      const domains = data['hydra:member'] || data || [];
      this.cachedDomains = domains.map(d => ({ id: d.id, domain: d.domain, isActive: d.isActive !== false, isPrivate: false }));
      return this.cachedDomains;
    } catch (e) {
      console.error(`[Mail.gw] getDomains: ${e.message}`);
      return this.cachedDomains;
    }
  }

  async createAccount(address, password) {
    try {
      const r = await fetch(`${this.baseUrl}/accounts`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, password })
      });
      if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e['hydra:description'] || `HTTP ${r.status}`); }
      const d = await r.json();
      return { id: d.id, address: d.address, createdAt: d.createdAt };
    } catch (e) { console.error(`[Mail.gw] createAccount: ${e.message}`); throw e; }
  }

  async getToken(address, password) {
    try {
      const r = await fetch(`${this.baseUrl}/token`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, password })
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return (await r.json()).token;
    } catch (e) { console.error(`[Mail.gw] getToken: ${e.message}`); throw e; }
  }

  async getMessages(token) {
    try {
      const r = await fetch(`${this.baseUrl}/messages`, { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      return (data['hydra:member'] || data || []).map(m => this._normalize(m));
    } catch (e) { return []; }
  }

  async getMessage(token, id) {
    try {
      const r = await fetch(`${this.baseUrl}/messages/${id}`, { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return this._normalize(await r.json(), true);
    } catch (e) { throw e; }
  }

  async deleteMessage(token, id) {
    try { const r = await fetch(`${this.baseUrl}/messages/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } }); return r.ok; } catch (e) { return false; }
  }

  async markAsRead(token, id) {
    try { await fetch(`${this.baseUrl}/messages/${id}`, { method: 'PATCH', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/merge-patch+json' }, body: JSON.stringify({ seen: true }) }); return true; } catch (e) { return false; }
  }

  async deleteAccount(token, id) {
    try { await fetch(`${this.baseUrl}/accounts/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } }); return true; } catch (e) { return false; }
  }

  async healthCheck() {
    const s = Date.now();
    try { const r = await fetch(`${this.baseUrl}/domains`, { signal: AbortSignal.timeout(5000) }); return { healthy: r.ok, latency: Date.now()-s, status: r.ok ? 'healthy' : 'degraded' }; }
    catch (e) { return { healthy: false, latency: Date.now()-s, status: 'error', error: e.message }; }
  }

  _normalize(m, full = false) {
    const n = {
      id: m.id || m['@id'], providerMessageId: m.id,
      from: { address: m.from?.address || '', name: m.from?.name || '' },
      to: (m.to || []).map(t => ({ address: t.address || '', name: t.name || '' })),
      subject: m.subject || '(no subject)', intro: m.intro || '',
      isRead: m.seen || false, hasAttachments: !!(m.hasAttachments || (m.attachments?.length)),
      size: m.size || 0, receivedAt: m.createdAt || new Date().toISOString(),
      attachments: (m.attachments || []).map(a => ({ id: a.id, filename: a.filename, contentType: a.contentType, size: a.size, downloadUrl: a.downloadUrl ? `${this.baseUrl}${a.downloadUrl}` : null }))
    };
    if (full) { n.bodyText = m.text || ''; n.bodyHtml = m.html ? (m.html.join ? m.html.join('') : m.html) : ''; }
    return n;
  }
}

module.exports = MailGwProvider;
