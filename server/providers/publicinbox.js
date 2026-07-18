/**
 * XyronMail — Mailinator-style Public Inbox Provider
 * Uses public mailbox approach for instant inbox access
 */
class PublicInboxProvider {
  constructor() { this.name = 'publicinbox'; this.displayName = 'PublicInbox'; }

  async getDomains() {
    return [
      { id: 'pub_1', domain: 'sharklasers.com', isActive: true },
      { id: 'pub_2', domain: 'grr.la', isActive: true },
      { id: 'pub_3', domain: 'spam4.me', isActive: true },
      { id: 'pub_4', domain: 'trishare.com', isActive: true },
    ];
  }

  async createAccount(address) {
    // Public inbox: any name works, re-use guerrilla's API
    const user = address ? address.split('@')[0] : this._rand();
    const domain = address ? address.split('@')[1] : 'sharklasers.com';
    try {
      const r = await fetch(`https://api.guerrillamail.com/ajax.php?f=get_email_address&lang=en&sid_token=&site=guerrillamail.com&domain=${domain}`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const d = await r.json();
      const sid = d.sid_token;
      // Set custom address
      const r2 = await fetch(`https://api.guerrillamail.com/ajax.php?f=set_email_user&email_user=${encodeURIComponent(user)}&lang=en&sid_token=${sid}&site=guerrillamail.com`);
      const d2 = await r2.json();
      return { id: d2.sid_token || sid, address: d2.email_addr || `${user}@${domain}`, sidToken: d2.sid_token || sid, createdAt: new Date().toISOString() };
    } catch (e) {
      return { id: user, address: `${user}@${domain}`, sidToken: user, createdAt: new Date().toISOString() };
    }
  }

  async getToken(a, p) { return p; }

  async getMessages(token) {
    try {
      const r = await fetch(`https://api.guerrillamail.com/ajax.php?f=get_email_list&offset=0&sid_token=${token}&seq=0`);
      if (!r.ok) return [];
      const d = await r.json();
      return (d.list || []).filter(m => m.mail_from !== 'no-reply@guerrillamail.com').map(m => ({
        id: String(m.mail_id), providerMessageId: String(m.mail_id),
        from: { address: m.mail_from || '', name: m.mail_from || '' },
        to: [{ address: m.mail_recipient || '' }],
        subject: m.mail_subject || '(no subject)',
        intro: (m.mail_excerpt || '').slice(0, 200),
        isRead: m.mail_read === '1', hasAttachments: false,
        size: m.mail_size || 0, receivedAt: m.mail_timestamp ? new Date(m.mail_timestamp * 1000).toISOString() : new Date().toISOString()
      }));
    } catch (e) { return []; }
  }

  async getMessage(token, msgId) {
    try {
      const r = await fetch(`https://api.guerrillamail.com/ajax.php?f=fetch_email&email_id=${msgId}&sid_token=${token}`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const m = await r.json();
      return {
        id: String(m.mail_id), providerMessageId: String(m.mail_id),
        from: { address: m.mail_from || '', name: m.mail_from || '' },
        to: [{ address: m.mail_recipient || '' }],
        subject: m.mail_subject || '', bodyText: m.mail_body || '',
        bodyHtml: m.mail_body || '', isRead: true, hasAttachments: false,
        size: m.mail_size || 0, receivedAt: m.mail_timestamp ? new Date(m.mail_timestamp * 1000).toISOString() : new Date().toISOString()
      };
    } catch (e) { throw e; }
  }

  async deleteMessage(token, msgId) {
    try { await fetch(`https://api.guerrillamail.com/ajax.php?f=del_email&email_ids[]=${msgId}&sid_token=${token}`); return true; } catch (e) { return false; }
  }
  async markAsRead() { return true; }
  async deleteAccount() { return true; }
  async healthCheck() { const s = Date.now(); try { const r = await fetch('https://api.guerrillamail.com/ajax.php?f=get_email_address', { signal: AbortSignal.timeout(5000) }); return { healthy: r.ok, latency: Date.now() - s, status: r.ok ? 'healthy' : 'degraded' }; } catch (e) { return { healthy: false, latency: Date.now() - s, status: 'error', error: e.message }; } }
  _rand() { const c = 'abcdefghijklmnopqrstuvwxyz0123456789'; let s = ''; for (let i = 0; i < 10; i++) s += c[Math.floor(Math.random() * c.length)]; return s; }
}
module.exports = PublicInboxProvider;
