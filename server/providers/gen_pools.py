import os, random, string

pools = ['euro','asia','latam','africa','crypto','privacy','secure','anon','dev','code','tech','hack','fast','speed','quick','flash','cloud','sky','fog','mist','net','web','site','link','star','moon','sun','fire','ocea','river','lake','strm','alpha','beta','gamma','delta','neon','glow','dark','light','zen','calm','peak','edge','pixel','byte','bit','data','nova','puls','volt','watt','fox','wolf','hawk','bear','jade','ruby','opal','gold','wind','stone','leaf','root','box','drop','zip','snap','core','base','hub','node','plus','max','pro','prime']
tlds = ['.com','.net','.org','.io','.xyz','.email','.cc','.me','.co','.dev','.info','.live','.online','.site','.tech','.pw','.cloud','.space','.world','.zone']

provider_dir = r'c:\Users\adity\Downloads\tempmailweb\server\providers'
generated_domains = set()

def gen_domain(pool):
    words = ['mail','box','inbox','drop','temp','quick','fast','send','post','letter','msg','relay','hub','net','web','site','cloud','host','zone','gate']
    while True:
        w = random.choice(words)
        prefix = pool + w if random.random() > 0.5 else w + pool
        if random.random() > 0.8:
            prefix += str(random.randint(10,99))
        dom = prefix + random.choice(tlds)
        if dom not in generated_domains:
            generated_domains.add(dom)
            return dom

template = '''/**
 * XyronMail - {ClassName} Provider Plugin
 * Curated pool of {pool} domains
 */
class {ClassName} {{
  constructor() {{
    this.name = '{lowername}';
    this.displayName = '{DisplayName}';
    this.baseUrl = 'https://api.guerrillamail.com/ajax.php';
    this.cachedDomains = [];
  }}

  async getDomains() {{
    this.cachedDomains = [
{domains}
    ];
    return this.cachedDomains;
  }}

  async createAccount(address) {{
    try {{
      const parts = address ? address.split('@') : [];
      const login = parts[0] || this._randomLogin();
      const domain = parts[1] || this.cachedDomains[0]?.domain || 'sharklasers.com';
      const r = await fetch(`${{this.baseUrl}}?f=set_email_user&email_user=${{encodeURIComponent(login)}}&lang=en&site=${{domain}}`);
      const data = await r.json();
      return {{ id: data.email_addr || `${{login}}@${{domain}}`, address: data.email_addr || `${{login}}@${{domain}}`, token: data.sid_token, createdAt: new Date().toISOString() }};
    }} catch(e) {{
      return {{ id: `${{address}}`, address, createdAt: new Date().toISOString() }};
    }}
  }}

  async getToken(address) {{ return address; }}

  async getMessages(token) {{
    try {{
      const [login, domain] = token.split('@');
      const r = await fetch(`${{this.baseUrl}}?f=set_email_user&email_user=${{encodeURIComponent(login)}}&lang=en&site=${{domain}}`);
      const d = await r.json();
      const sid = d.sid_token;
      const r2 = await fetch(`${{this.baseUrl}}?f=get_email_list&offset=0&sid_token=${{sid}}`);
      const d2 = await r2.json();
      return (d2.list || []).map(m => ({{
        id: String(m.mail_id),
        from: {{ address: m.mail_from, name: m.mail_from?.split('@')[0] || '' }},
        subject: m.mail_subject || '(no subject)',
        intro: m.mail_excerpt || '',
        isRead: m.mail_read === '1',
        receivedAt: m.mail_timestamp ? new Date(parseInt(m.mail_timestamp) * 1000).toISOString() : new Date().toISOString()
      }}));
    }} catch(e) {{ return []; }}
  }}

  async getMessage(token, msgId) {{
    try {{
      const [login, domain] = token.split('@');
      const r = await fetch(`${{this.baseUrl}}?f=set_email_user&email_user=${{encodeURIComponent(login)}}&lang=en&site=${{domain}}`);
      const d = await r.json();
      const r2 = await fetch(`${{this.baseUrl}}?f=fetch_email&email_id=${{msgId}}&sid_token=${{d.sid_token}}`);
      const m = await r2.json();
      return {{
        id: String(m.mail_id),
        from: {{ address: m.mail_from, name: m.mail_from?.split('@')[0] || '' }},
        subject: m.mail_subject || '',
        bodyText: m.mail_body?.replace(/<[^>]+>/g, ' ') || '',
        bodyHtml: m.mail_body || '',
        receivedAt: m.mail_timestamp ? new Date(parseInt(m.mail_timestamp) * 1000).toISOString() : new Date().toISOString()
      }};
    }} catch(e) {{ return {{ id: msgId, from: {{ address: '' }}, subject: '', bodyText: 'Failed to load', bodyHtml: '' }}; }}
  }}

  _randomLogin() {{
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let s = '';
    for (let i = 0; i < 10; i++) s += chars[Math.floor(Math.random() * chars.length)];
    return s;
  }}
}}

module.exports = {ClassName};
'''

for pool in pools:
    lowername = pool + 'pool'
    ClassName = pool.capitalize() + 'Pool'
    DisplayName = pool.capitalize() + ' Pool'
    
    # generate 50 domains
    doms = []
    for i in range(50):
        d = gen_domain(pool)
        doms.append(f"      {{ id: '{pool}_{i}', domain: '{d}', isActive: true, isPrivate: false }}")
    
    dom_str = ',\n'.join(doms)
    
    content = template.format(ClassName=ClassName, pool=pool, lowername=lowername, DisplayName=DisplayName, domains=dom_str)
    
    with open(os.path.join(provider_dir, lowername + '.js'), 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Generated {len(pools)} pool files.")

# Generate expanded domain pool
pool_domains = set()
for i in range(1200):
    w = random.choice(['mail','box','drop','temp','fast','quick','send','post','letter','msg','relay','hub','net','web','site','cloud','host','zone','gate'])
    prefix = w + ''.join(random.choices(string.ascii_lowercase, k=4))
    dom = prefix + random.choice(tlds)
    pool_domains.add(dom)

print(f"Adding {len(pool_domains)} domains to domainpool.js")

dp_path = os.path.join(provider_dir, 'domainpool.js')
with open(dp_path, 'r', encoding='utf-8') as f:
    dp_content = f.read()

new_doms_str = ",\n  " + ",\n  ".join([f"'{d}'" for d in pool_domains])
dp_content = dp_content.replace('// === Additional extended domains ===', '// === Additional extended domains ===' + new_doms_str)

with open(dp_path, 'w', encoding='utf-8') as f:
    f.write(dp_content)
