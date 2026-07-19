/**
 * TempGmail - Temporary Gmail-style provider
 * Uses Mail.tm API backend for reliable delivery
 * Domains: inbox.lol, tmail.io, raikas77.eu.org
 */
const MAILTM_BASE = 'https://api.mail.tm';

class TempGmailProvider {
  constructor() {
    this.name = 'tempgmail';
    this.displayName = 'TempGmail';
    this.baseUrl = MAILTM_BASE;
    this.cachedDomains = [];
    this.accounts = new Map(); // address -> {token, id}
  }

  async getDomains() {
    try {
      const r = await fetch(`${this.baseUrl}/domains?page=1`, { headers: { 'Accept': 'application/json' } });
      const data = await r.json();
      const domainList = (data['hydra:member'] || data.member || []);
      this.cachedDomains = domainList.map((d, i) => ({ id: `tg_${i}`, domain: d.domain, isActive: true, isPrivate: false }));
      if (!this.cachedDomains.length) {
        this.cachedDomains = [
          { id: 'tg_0', domain: 'tmail.io', isActive: true, isPrivate: false },
          { id: 'tg_1', domain: 'inbox.lol', isActive: true, isPrivate: false },
          { id: 'tg_2', domain: 'raikas77.eu.org', isActive: true, isPrivate: false },
          { id: 'tg_3', domain: 'esiix.com', isActive: true, isPrivate: false },
        ];
      }
      return this.cachedDomains;
    } catch(e) {
      this.cachedDomains = [
        { id: 'tg_0', domain: 'tmail.io', isActive: true, isPrivate: false },
        { id: 'tg_1', domain: 'inbox.lol', isActive: true, isPrivate: false },
      ];
      return this.cachedDomains;
    }
  }

  async createAccount(address) {
    try {
      if (!this.cachedDomains.length) await this.getDomains();
      const parts = address ? address.split('@') : [];
      const login = parts[0] || this._randomLogin();
      const domain = parts[1] || this.cachedDomains[0]?.domain || 'tmail.io';
      const email = `${login}@${domain}`;
      const password = this._randomPass();
      // Create account
      const cr = await fetch(`${this.baseUrl}/accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ address: email, password })
      });
      const cdata = await cr.json();
      if (!cdata.id) throw new Error(cdata['hydra:description'] || 'Create failed');
      // Get token
      const tr = await fetch(`${this.baseUrl}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ address: email, password })
      });
      const tdata = await tr.json();
      const token = tdata.token;
      this.accounts.set(email, { token, id: cdata.id, password });
      return { id: cdata.id, address: email, token, createdAt: new Date().toISOString() };
    } catch(e) {
      if (!this.cachedDomains.length) await this.getDomains();
      const parts = address ? address.split('@') : [];
      const login = parts[0] || this._randomLogin();
      const domain = parts[1] || this.cachedDomains[0]?.domain || 'tmail.io';
      return { id: `${login}@${domain}`, address: `${login}@${domain}`, createdAt: new Date().toISOString() };
    }
  }

  async getToken(address) {
    const acc = this.accounts.get(address);
    if (acc) return acc.token;
    return null;
  }

  async getMessages(token) {
    try {
      const r = await fetch(`${this.baseUrl}/messages?page=1`, {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      const data = await r.json();
      return (data['hydra:member'] || data.member || []).map(m => ({
        id: m.id,
        from: { address: m.from?.address || '', name: m.from?.name || '' },
        subject: m.subject || '(no subject)',
        intro: m.intro || '',
        isRead: m.seen || false,
        receivedAt: m.createdAt || new Date().toISOString()
      }));
    } catch(e) { return []; }
  }

  async getMessage(token, msgId) {
    try {
      const r = await fetch(`${this.baseUrl}/messages/${msgId}`, {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      const m = await r.json();
      return {
        id: m.id,
        from: { address: m.from?.address || '', name: m.from?.name || '' },
        to: (m.to || []).map(t => ({ address: t.address, name: t.name })),
        subject: m.subject || '',
        bodyText: m.text || '',
        bodyHtml: m.html?.[0] || m.text || '',
        receivedAt: m.createdAt || new Date().toISOString()
      };
    } catch(e) { return { id: msgId, from: { address: '' }, subject: '', bodyText: 'Failed', bodyHtml: '' }; }
  }

  async deleteMessage(token, msgId) {
    try {
      await fetch(`${this.baseUrl}/messages/${msgId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return true;
    } catch(e) { return false; }
  }

  async markAsRead(token, msgId) {
    try {
      await fetch(`${this.baseUrl}/messages/${msgId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'merge-patch+json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ seen: true })
      });
      return true;
    } catch(e) { return false; }
  }

  async deleteAccount(token) {
    try {
      const r = await fetch(`${this.baseUrl}/me`, { headers: { 'Authorization': `Bearer ${token}` } });
      const me = await r.json();
      await fetch(`${this.baseUrl}/accounts/${me.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      return true;
    } catch(e) { return false; }
  }

  async healthCheck() {
    const s = Date.now();
    try {
      const r = await fetch(`${this.baseUrl}/domains`, { signal: AbortSignal.timeout(5000) });
      return { healthy: r.ok, latency: Date.now() - s, status: r.ok ? 'healthy' : 'degraded' };
    } catch(e) { return { healthy: false, latency: Date.now() - s, status: 'error', error: e.message }; }
  }

  _randomLogin() {
    const c = 'abcdefghijklmnopqrstuvwxyz0123456789'; let s = '';
    for (let i = 0; i < 10; i++) s += c[Math.floor(Math.random() * c.length)];
    return s;
  }

  _randomPass() {
    const c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$'; let s = '';
    for (let i = 0; i < 16; i++) s += c[Math.floor(Math.random() * c.length)];
    return s;
  }
}

module.exports = TempGmailProvider;
