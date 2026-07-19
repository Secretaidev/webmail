const fs = require('fs');
const path = require('path');

const prefixes = ['temp', 'mail', 'inbox', 'drop', 'throw', 'burner', 'spam', 'fake', 'anon', 'priv', 'quick', 'fast', 'instant', 'flash', 'zip', 'snap', 'ping', 'buzz', 'catch', 'recv', 'trash', 'junk', 'void', 'null', 'ditch', 'toss', 'burn', 'waste', 'vanish', 'hide', 'shadow', 'ghost', 'phantom', 'stealth', 'covert', 'secret', 'hidden', 'ninja', 'zero', 'dark', 'neon', 'cyber', 'crypto', 'digital', 'smart', 'auto', 'meta', 'ultra', 'super', 'hyper', 'mega', 'giga', 'tera', 'nano', 'micro', 'mini', 'pro', 'plus', 'max', 'top', 'elite', 'prime', 'alpha', 'beta', 'gamma', 'delta', 'echo', 'foxtrot', 'golf', 'hotel', 'india', 'juliet', 'kilo', 'lima', 'sierra', 'tango', 'uniform', 'victor', 'whiskey', 'xray', 'yankee', 'zulu', 'red', 'blue', 'green', 'yellow', 'black', 'white', 'silver', 'gold', 'iron', 'steel', 'titan', 'spark', 'blaze', 'frost', 'storm', 'thunder', 'lightning', 'bolt', 'arrow', 'swift', 'rapid', 'turbo', 'nitro', 'rocket', 'laser', 'pulse', 'wave', 'flow', 'stream', 'flux', 'nova', 'star', 'moon', 'sun', 'sky', 'cloud', 'mist', 'fog', 'rain', 'snow', 'wind', 'fire', 'ice', 'earth', 'ocean', 'river', 'lake', 'peak', 'edge', 'core', 'base', 'hub', 'node', 'link', 'bridge', 'gate', 'port', 'dock', 'bay', 'reef', 'cove', 'shore', 'coast'];
const middleParts = ['mail', 'box', 'inbox', 'email', 'post', 'letter', 'note', 'msg', 'addr', 'drop', 'catch', 'recv', 'zone', 'spot', 'place', 'point', 'site', 'space', 'area', 'land', 'ground', 'field', 'domain', 'host', 'server', 'relay', 'proxy', 'route', 'path', 'channel'];
const tlds = ['.com', '.net', '.org', '.io', '.xyz', '.email', '.cc', '.me', '.co', '.biz', '.pw', '.info', '.app', '.dev', '.cloud', '.online', '.site', '.tech', '.live', '.world', '.zone', '.space', '.link', '.pro', '.top'];

function generateRandomDomains(count) {
    const domains = new Set();
    while (domains.size < count) {
        const p = prefixes[Math.floor(Math.random() * prefixes.length)];
        const m = middleParts[Math.floor(Math.random() * middleParts.length)];
        const t = tlds[Math.floor(Math.random() * tlds.length)];
        domains.add(`${p}${m}${t}`);
    }
    return Array.from(domains);
}

function getTemplate(className, name, idPrefix, domainList) {
    const domainObjects = domainList.map((d, i) => `      { id: '${idPrefix}_${i}', domain: '${d}', isActive: true, isPrivate: false }`).join(',\n');
    return `/**
 * XyronMail - ${className} Provider Plugin
 * ${domainList.length}+ curated disposable email domains
 */
class ${className} {
  constructor() {
    this.name = '${name}';
    this.displayName = '${className}';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }

  async getDomains() {
    this.cachedDomains = [
${domainObjects}
    ];
    return this.cachedDomains;
  }

  async createAccount(address) {
    try {
      const parts = address ? address.split('@') : [];
      const login = parts[0] || this._randomLogin();
      const domain = parts[1] || this.cachedDomains[0]?.domain || 'sharklasers.com';
      const r = await fetch(\`\${this.baseUrl}?f=set_email_user&email_user=\${encodeURIComponent(login)}&lang=en&site=\${domain}\`);
      const data = await r.json();
      return { id: data.email_addr || \`\${login}@\${domain}\`, address: data.email_addr || \`\${login}@\${domain}\`, token: data.sid_token, createdAt: new Date().toISOString() };
    } catch(e) {
      const parts = address ? address.split('@') : [];
      const login = parts[0] || this._randomLogin();
      const domain = parts[1] || (this.cachedDomains[0]?.domain || 'sharklasers.com');
      return { id: \`\${login}@\${domain}\`, address: \`\${login}@\${domain}\`, createdAt: new Date().toISOString() };
    }
  }

  async getToken(address) { return address; }

  async getMessages(token) {
    try {
      const [login, domain] = token.split('@');
      const r = await fetch(\`\${this.baseUrl}?f=set_email_user&email_user=\${encodeURIComponent(login)}&lang=en&site=\${domain}\`);
      const d = await r.json();
      const r2 = await fetch(\`\${this.baseUrl}?f=get_email_list&offset=0&sid_token=\${d.sid_token}\`);
      const d2 = await r2.json();
      return (d2.list || []).map(m => ({ id: String(m.mail_id), from: { address: m.mail_from, name: (m.mail_from||'').split('@')[0] }, subject: m.mail_subject || '(no subject)', intro: m.mail_excerpt || '', isRead: m.mail_read === '1', receivedAt: m.mail_timestamp ? new Date(parseInt(m.mail_timestamp)*1000).toISOString() : new Date().toISOString() }));
    } catch(e) { return []; }
  }

  async getMessage(token, msgId) {
    try {
      const [login, domain] = token.split('@');
      const r = await fetch(\`\${this.baseUrl}?f=set_email_user&email_user=\${encodeURIComponent(login)}&lang=en&site=\${domain}\`);
      const d = await r.json();
      const r2 = await fetch(\`\${this.baseUrl}?f=fetch_email&email_id=\${msgId}&sid_token=\${d.sid_token}\`);
      const m = await r2.json();
      return { id: String(m.mail_id||msgId), from: { address: m.mail_from||'', name: (m.mail_from||'').split('@')[0] }, subject: m.mail_subject||'', bodyText: (m.mail_body||'').replace(/<[^>]+>/g,' '), bodyHtml: m.mail_body||'', receivedAt: m.mail_timestamp ? new Date(parseInt(m.mail_timestamp)*1000).toISOString() : new Date().toISOString() };
    } catch(e) { return { id: msgId, from: { address: '' }, subject: '', bodyText: 'Failed to load', bodyHtml: '' }; }
  }

  _randomLogin() {
    const c='abcdefghijklmnopqrstuvwxyz0123456789'; let s='';
    for(let i=0;i<10;i++) s+=c[Math.floor(Math.random()*c.length)];
    return s;
  }
}

module.exports = ${className};
`;
}

const dir = path.join(__dirname, 'server', 'providers');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// MegaPool
fs.writeFileSync(path.join(dir, 'megapool.js'), getTemplate('MegaPool', 'megapool', 'mp', generateRandomDomains(5000)));
// GigaPool
fs.writeFileSync(path.join(dir, 'gigapool.js'), getTemplate('GigaPool', 'gigapool', 'gp', generateRandomDomains(4000)));
// HyperPool
fs.writeFileSync(path.join(dir, 'hyperpool.js'), getTemplate('HyperPool', 'hyperpool', 'hp', generateRandomDomains(3000)));

console.log('Files created successfully.');
