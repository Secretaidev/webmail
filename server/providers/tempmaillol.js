/**
 * XyronMail — Tempmail.lol Provider
 * Uses official npm package, free tier, no API key
 */
const { TempMail } = require('tempmail.lol');

class TempMailLolProvider {
  constructor() {
    this.name = 'tempmaillol';
    this.displayName = 'TempMail.lol';
    this.client = new TempMail();
  }

  async getDomains() {
    return [
      { id: 'tml_1', domain: 'tempmail.lol', isActive: true },
      { id: 'tml_2', domain: 'dearduck.com', isActive: true },
      { id: 'tml_3', domain: 'hellomailo.com', isActive: true },
      { id: 'tml_4', domain: 'mailgolem.com', isActive: true },
      { id: 'tml_5', domain: 'smuggroup.com', isActive: true },
      { id: 'tml_6', domain: 'cleverlogic.biz', isActive: true },
    ];
  }

  async createAccount(address) {
    try {
      const inbox = await this.client.createInbox();
      return {
        id: inbox.token,
        address: inbox.address,
        sidToken: inbox.token,
        createdAt: new Date().toISOString()
      };
    } catch (e) { console.error(`[TempMail.lol] create: ${e.message}`); throw e; }
  }

  async getToken(address, password) { return password; }

  async getMessages(token) {
    try {
      const emails = await this.client.checkInbox(token);
      if (!emails || !Array.isArray(emails)) return [];
      return emails.map(e => ({
        id: e.token || e._id || String(Math.random()),
        providerMessageId: e.token || e._id,
        from: { address: e.from || '', name: e.from || '' },
        to: [{ address: e.to || '', name: '' }],
        subject: e.subject || '(no subject)',
        intro: (e.body || '').slice(0, 200),
        bodyText: e.body || '',
        bodyHtml: e.html || e.body || '',
        isRead: false,
        hasAttachments: false,
        size: 0,
        receivedAt: e.date ? new Date(e.date).toISOString() : new Date().toISOString()
      }));
    } catch (e) { return []; }
  }

  async getMessage(token, msgId) {
    const msgs = await this.getMessages(token);
    return msgs.find(m => m.id === msgId) || null;
  }

  async deleteMessage() { return true; }
  async markAsRead() { return true; }
  async deleteAccount() { return true; }

  async healthCheck() {
    const s = Date.now();
    try {
      const inbox = await this.client.createInbox();
      return { healthy: !!inbox.address, latency: Date.now() - s, status: inbox.address ? 'healthy' : 'error' };
    } catch (e) { return { healthy: false, latency: Date.now() - s, status: 'error', error: e.message }; }
  }
}

module.exports = TempMailLolProvider;
