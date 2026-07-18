/**
 * XyronMail — Maildrop.cc Provider (GraphQL API)
 * Free, no auth, public mailboxes
 */
const BASE = 'https://api.maildrop.cc/graphql';

class MaildropProvider {
  constructor() { this.name = 'maildrop'; this.displayName = 'Maildrop'; }

  async getDomains() {
    return [{ id: 'md_1', domain: 'maildrop.cc', isActive: true }];
  }

  async createAccount(address) {
    const alias = address ? address.split('@')[0] : this._rand();
    return { id: alias, address: `${alias}@maildrop.cc`, createdAt: new Date().toISOString() };
  }

  async getToken(address) { return address.split('@')[0]; }

  async getMessages(token) {
    try {
      const r = await fetch(BASE, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `{ inbox(mailbox: "${token}") { id headerfrom subject date html } }` })
      });
      const d = await r.json();
      return (d.data?.inbox || []).map(m => ({
        id: m.id, providerMessageId: m.id,
        from: { address: m.headerfrom || '', name: m.headerfrom || '' },
        to: [{ address: `${token}@maildrop.cc`, name: '' }],
        subject: m.subject || '(no subject)', intro: '',
        isRead: false, hasAttachments: false, size: 0,
        receivedAt: m.date ? new Date(m.date).toISOString() : new Date().toISOString()
      }));
    } catch (e) { return []; }
  }

  async getMessage(token, msgId) {
    try {
      const r = await fetch(BASE, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `{ message(mailbox: "${token}", id: "${msgId}") { id headerfrom subject date html } }` })
      });
      const d = await r.json();
      const m = d.data?.message;
      if (!m) throw new Error('Not found');
      return {
        id: m.id, providerMessageId: m.id,
        from: { address: m.headerfrom || '', name: m.headerfrom || '' },
        to: [{ address: `${token}@maildrop.cc`, name: '' }],
        subject: m.subject || '', intro: '', bodyText: '', bodyHtml: m.html || '',
        isRead: false, hasAttachments: false, size: 0,
        receivedAt: m.date ? new Date(m.date).toISOString() : new Date().toISOString()
      };
    } catch (e) { throw e; }
  }

  async deleteMessage(token, msgId) {
    try {
      await fetch(BASE, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `mutation { delete(mailbox: "${token}", id: "${msgId}") }` })
      });
      return true;
    } catch (e) { return false; }
  }

  async markAsRead() { return true; }
  async deleteAccount() { return true; }

  async healthCheck() {
    const s = Date.now();
    try {
      const r = await fetch(BASE, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '{ ping }' }),
        signal: AbortSignal.timeout(5000)
      });
      return { healthy: r.ok, latency: Date.now() - s, status: r.ok ? 'healthy' : 'error' };
    } catch (e) { return { healthy: false, latency: Date.now() - s, status: 'error', error: e.message }; }
  }

  _rand() { const c = 'abcdefghijklmnopqrstuvwxyz0123456789'; let s = ''; for (let i = 0; i < 10; i++) s += c[Math.floor(Math.random() * c.length)]; return s; }
}

module.exports = MaildropProvider;
