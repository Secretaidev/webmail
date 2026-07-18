/**
 * XyronMail - TempMail.plus Provider Plugin
 */
const BASE = 'https://tempmail.plus/api';

class TempMailPlusProvider {
  constructor() {
    this.name = 'tempmailplus';
    this.displayName = 'TempMail.plus';
    this.baseUrl = BASE;
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
      'mailto.plus', 'fexpost.com', 'fexbox.org', 'mailbox.in.ua',
      'rover.info', 'merepost.com', 'any.pink', 'fexbox.ru'
    ].map((d, i) => ({ id: `tp_${i}`, domain: d, isActive: true, isPrivate: false }));
    return this.cachedDomains;
  }

  async createAccount(address) {
    const email = address || `${this._random()}@mailto.plus`;
    return { id: email, address: email, createdAt: new Date().toISOString() };
  }

  async getToken(address) { return address; }

  async getMessages(token) {
    try {
      const r = await fetch(`${BASE}/mails?email=${encodeURIComponent(token)}&limit=20&epin=`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      const msgs = data.mail_list || data.mails || data.list || [];
      return msgs.map(m => this._normalize(m, token));
    } catch (e) {
      console.error(`[TempMailPlus] getMessages: ${e.message}`);
      return [];
    }
  }

  async getMessage(token, msgId) {
    const r = await fetch(`${BASE}/mails/${msgId}?email=${encodeURIComponent(token)}&epin=`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return this._normalize(await r.json(), token, true);
  }

  async healthCheck() {
    const s = Date.now();
    try {
      const r = await fetch(`${BASE}/mails?email=test@test.com&limit=1`, { signal: AbortSignal.timeout(5000) });
      return { healthy: r.ok || r.status === 404, latency: Date.now() - s, status: 'healthy' };
    } catch (e) {
      return { healthy: false, latency: Date.now() - s, status: 'error', error: e.message };
    }
  }

  _normalize(m, email, full = false) {
    const n = {
      id: String(m.mail_id || m.id),
      providerMessageId: String(m.mail_id || m.id),
      from: { address: m.from_mail || m.from || '', name: m.from_name || m.from_mail || '' },
      to: [{ address: email, name: '' }],
      subject: m.subject || '(no subject)',
      intro: (m.text || m.textBody || '').slice(0, 200),
      isRead: !!m.is_new === false, hasAttachments: false,
      size: 0,
      receivedAt: m.time ? new Date(m.time * 1000).toISOString() : new Date().toISOString()
    };
    if (full) { n.bodyText = m.text || m.textBody || ''; n.bodyHtml = m.html || m.textHtml || ''; }
    return n;
  }

  _random() {
    const c = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let s = ''; for (let i = 0; i < 10; i++) s += c[Math.floor(Math.random() * c.length)];
    return s;
  }
}

module.exports = TempMailPlusProvider;
