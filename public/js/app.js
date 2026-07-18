/**
 * XyronMail — Frontend Engine v4.0
 * Ultra-fast · Error-free · All features interconnected
 * Zero provider details exposed to users
 */
const S={user:null,token:null,inboxes:[],aI:null,msgs:[],aM:null,page:'inbox',theme:localStorage.getItem('xm_t')||'dark',sse:null,poll:null,domains:[],domCount:0};
const $=id=>document.getElementById(id);

/* ═══════════════════ API LAYER ═══════════════════ */
const A={
  async r(method,path,body){
    const h={'Content-Type':'application/json'};
    if(S.token)h.Authorization=`Bearer ${S.token}`;
    const opts={method,headers:h,credentials:'include'};
    if(body&&method!=='GET')opts.body=JSON.stringify(body);
    try{
      const res=await fetch(`/api${path}`,opts);
      const data=await res.json().catch(()=>({error:'Invalid response'}));
      if(!res.ok)throw new Error(data.error||data.message||`HTTP ${res.status}`);
      return data;
    }catch(e){
      if(e.message==='Failed to fetch')throw new Error('Cannot connect to server');
      throw e;
    }
  },
  g:p=>A.r('GET',p),
  p:(p,b)=>A.r('POST',p,b),
  u:(p,b)=>A.r('PUT',p,b),
  d:p=>A.r('DELETE',p)
};

/* ═══════════════════ INIT ═══════════════════ */
document.addEventListener('DOMContentLoaded',async()=>{
  applyTheme(S.theme);
  await Promise.allSettled([checkAuth(),loadDomains(),loadAnnouncements()]);
  // Show telegram popup briefly
  setTimeout(()=>{const c=$('tgC');if(c){c.classList.remove('nn');setTimeout(()=>c.classList.add('nn'),4500)}},3500);
});

/* ═══════════════════ THEME ═══════════════════ */
function applyTheme(t){
  document.documentElement.setAttribute('data-theme',t);
  S.theme=t;localStorage.setItem('xm_t',t);
  const b=$('thB');if(b)b.textContent=t==='dark'?'☀️':'🌙';
}
function toggleTheme(){applyTheme(S.theme==='dark'?'light':'dark')}

/* ═══════════════════ AUTH ═══════════════════ */
async function checkAuth(){
  try{const d=await A.g('/auth/me');if(d.success){S.user=d.data;updateAuthUI();await loadInboxes()}}
  catch(e){await loadInboxes()}
}
function updateAuthUI(){
  const el=$('aUI');if(!el)return;
  // Remove any existing admin button to start fresh
  const existingAdminBtn = document.querySelector('[data-p="admin"]');
  if(existingAdminBtn) existingAdminBtn.remove();

  if(S.user){
    const r=S.user.role;
    el.innerHTML=`<div class="fx ac g2">
      <span class="ts t2" style="max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(S.user.displayName||S.user.email)}</span>
      <span class="bd2 bd2${r==='admin'?'d':r==='developer'?'a':'p'}">${r}</span>
      <button class="b bg bsm" onclick="logout()">↩ Out</button>
    </div>`;
    
    // Inject Admin button dynamically only if user is admin
    if(r==='admin') {
      const navContainer = $('hn');
      if(navContainer) {
        const adminBtn = document.createElement('button');
        adminBtn.dataset.p = 'admin';
        adminBtn.onclick = () => nav('admin');
        adminBtn.innerHTML = '🛡️ Admin';
        const docsBtn = document.querySelector('[data-p="docs"]');
        if(docsBtn) {
          navContainer.insertBefore(adminBtn, docsBtn);
        } else {
          navContainer.appendChild(adminBtn);
        }
      }
    }
  }else{
    el.innerHTML='<button class="b bg bsm" onclick="aModal(\'login\')">Sign In</button><button class="b bp bsm" onclick="aModal(\'register\')">Sign Up</button>';
  }
}
function aModal(mode){
  const isLogin=mode==='login';
  $('mC').innerHTML=`<div class="mo" onclick="if(event.target===this)closeModal()"><div class="mx ai">
    <div class="mh"><h2>${isLogin?'👋 Welcome Back':'🚀 Create Account'}</h2><button class="b bg bi" onclick="closeModal()">✕</button></div>
    <div class="mb">
      ${isLogin?'':'<div class="ig"><label>Display Name</label><input class="ip" id="aN" placeholder="Your name"></div>'}
      <div class="ig"><label>Email</label><input class="ip" id="aE" type="email" placeholder="you@example.com"></div>
      <div class="ig"><label>Password</label><input class="ip" id="aP" type="password" placeholder="Min 8 characters"></div>
      <div id="aEr" class="tx nn" style="color:var(--d)"></div>
    </div>
    <div class="mf">
      <button class="b bg" onclick="aModal('${isLogin?'register':'login'}')">${isLogin?'Create account':'Sign in instead'}</button>
      <button class="b bp" onclick="doAuth('${mode}')" id="aB">${isLogin?'Sign In':'Sign Up'}</button>
    </div>
  </div></div>`;
  setTimeout(()=>{const i=$('aE');if(i)i.focus()},120);
  $('mC').querySelectorAll('input').forEach(i=>i.addEventListener('keydown',e=>{if(e.key==='Enter')doAuth(mode)}));
}
async function doAuth(mode){
  const e=$('aE')?.value?.trim(),pw=$('aP')?.value,nm=$('aN')?.value?.trim(),er=$('aEr'),bt=$('aB');
  if(!e||!pw){showErr(er,'Email and password are required');return}
  if(bt){bt.disabled=true;bt.innerHTML='<div class="sp" style="width:14px;height:14px"></div>'}
  try{
    const body={email:e,password:pw};if(mode==='register'&&nm)body.displayName=nm;
    const d=await A.p(`/auth/${mode==='login'?'login':'register'}`,body);
    if(d.success){S.user=d.data;if(d.data.token)S.token=d.data.token;closeModal();updateAuthUI();await loadInboxes();toast(`Welcome${mode==='login'?' back':''}, ${d.data.displayName||d.data.email}!`,'s')}
  }catch(ex){showErr(er,ex.message);if(bt){bt.disabled=false;bt.textContent=mode==='login'?'Sign In':'Sign Up'}}
}
function showErr(el,msg){if(el){el.textContent=msg;el.classList.remove('nn')}}
async function logout(){try{await A.p('/auth/logout')}catch(e){}S.user=null;S.token=null;S.inboxes=[];S.aI=null;S.msgs=[];S.aM=null;updateAuthUI();renderInboxList();renderMessageArea();toast('Signed out','i')}

/* ═══════════════════ NAVIGATION ═══════════════════ */
function nav(pg){
  S.page=pg;
  document.querySelectorAll('.pg-v').forEach(p=>p.classList.add('nn'));
  const target=$(`pg-${pg}`);if(target)target.classList.remove('nn');
  document.querySelectorAll('.hdr-n button').forEach(b=>b.classList.toggle('on',b.dataset.p===pg));
  if(pg==='admin')loadAdmin();
  if(pg==='developer')loadDeveloper();
  if(pg==='docs')renderDocs($('dP'));
}

/* ═══════════════════ DOMAINS ═══════════════════ */
async function loadDomains(){
  try{
    const d=await A.g('/domains');
    if(d.success&&d.data){
      S.domains=d.data;S.domCount=d.data.length;
      const sel=$('dSel');
      if(sel){
        sel.innerHTML='<option value="">🎲 Auto (Best)</option>';
        const seen=new Set();
        d.data.forEach(dm=>{
          if(!seen.has(dm.domain)){seen.add(dm.domain);
            sel.innerHTML+=`<option value="${esc(dm.domain)}">${esc(dm.domain)}</option>`;
          }
        });
      }
      const info=$('pInfo');if(info)info.textContent=`${d.data.length} domains ready`;
      const hs=$('heroStatus');if(hs)hs.textContent=`${d.data.length} domains · System Operational`;
    }
  }catch(e){}
}

/* ═══════════════════ INBOX ═══════════════════ */
async function loadInboxes(){
  try{const d=await A.g('/inbox');if(d.success){S.inboxes=d.data||[];renderInboxList();if(S.inboxes.length&&!S.aI)selectInbox(S.inboxes[0].id)}}
  catch(e){S.inboxes=[];renderInboxList()}
}
function renderInboxList(){
  const c=$('ibL');if(!c)return;
  if(!S.inboxes.length){
    c.innerHTML='<div class="ey" style="padding:20px"><div style="font-size:2.2rem;opacity:.25;margin-bottom:6px">📭</div><h3 style="font-size:.88rem;font-weight:700;margin-bottom:2px">No Inboxes Yet</h3><p style="font-size:.7rem;color:var(--t3)">Click Generate above to start</p></div>';return;
  }
  c.innerHTML=S.inboxes.map((ib,i)=>`
    <div class="ica ${ib.id===S.aI?'on':''} ai" onclick="selectInbox('${esc(ib.id)}')">
      <div class="iic">📧</div>
      <div class="iin">
        <div class="iem">${esc(ib.emailAddress)}</div>
        <div class="ipr">${ago(ib.createdAt)}</div>
      </div>
      ${ib.messageCount>0?`<div class="icn">${ib.messageCount}</div>`:''}
      <div class="iac">
        <button class="b bg bi" style="padding:3px" onclick="event.stopPropagation();copyText('${esc(ib.emailAddress)}')" title="Copy">📋</button>
        <button class="b bg bi" style="padding:3px;color:var(--d)" onclick="event.stopPropagation();deleteInbox('${esc(ib.id)}')" title="Delete">🗑</button>
      </div>
    </div>`).join('');
}
async function cInbox(){
  const bt=$('cib');if(!bt)return;
  bt.disabled=true;bt.innerHTML='<div class="sp" style="width:14px;height:14px;border-top-color:#fff"></div> Creating...';
  try{
    const dom=$('dSel')?.value;
    const body=dom?{domain:dom}:{};
    const d=await A.p('/inbox',body);
    if(d.success&&d.data){
      toast(`✅ ${d.data.emailAddress}`,'s');
      copyText(d.data.emailAddress);
      await loadInboxes();selectInbox(d.data.id);
    }
  }catch(e){toast(e.message||'Failed to create inbox','e')}
  finally{bt.disabled=false;bt.innerHTML='<span style="font-size:1.05rem">⚡</span> Generate Inbox'}
}
async function deleteInbox(id){
  if(!confirm('Delete this inbox and all its messages?'))return;
  try{await A.d(`/inbox/${id}`);if(S.aI===id){S.aI=null;S.msgs=[];S.aM=null}toast('Inbox deleted','i');await loadInboxes();renderMessageArea()}catch(e){toast(e.message,'e')}
}
async function selectInbox(id){S.aI=id;S.aM=null;renderInboxList();stopLive();await loadMessages(id);startLive(id)}
function stopLive(){
  if(S.sse){try{S.sse.close()}catch(e){}S.sse=null}
  if(S.poll){clearInterval(S.poll);S.poll=null}
  if(S.liveTimeout){clearTimeout(S.liveTimeout);S.liveTimeout=null}
}

/* ═══════════════════ MESSAGES ═══════════════════ */
async function loadMessages(id){
  const el=$('eL'),ev=$('eV'),em=$('eI');if(!el)return;
  el.innerHTML='<div class="fx ac jc p6"><div class="sp sp2"></div></div>';
  em.classList.add('nn');ev.classList.add('nn');el.classList.remove('nn');
  try{
    const d=await A.g(`/inbox/${id}/messages`);
    if(d.success){S.msgs=d.data||[];renderMessageArea()}
  }catch(e){el.innerHTML=`<div class="ey"><p class="tm">⚠️ ${esc(e.message)}</p><button class="b bg bsm mt2" onclick="loadMessages('${id}')">🔄 Retry</button></div>`}
}
function renderMessageArea(){
  const el=$('eL'),ev=$('eV'),em=$('eI');if(!el||!ev||!em)return;
  // No inbox selected
  if(!S.aI){el.innerHTML='';em.classList.remove('nn');ev.classList.add('nn');el.classList.add('nn');return}
  // No messages
  if(!S.msgs.length){
    el.innerHTML='';el.classList.add('nn');ev.classList.add('nn');em.classList.remove('nn');
    const ib=S.inboxes.find(i=>i.id===S.aI);
    em.innerHTML=`<div style="font-size:3.5rem;animation:flt 3s ease-in-out infinite;margin-bottom:12px">📬</div>
      <h3 style="font-size:1.2rem;font-weight:800;margin-bottom:6px">Waiting for Emails</h3>
      <p class="tm ts" style="margin-bottom:12px">Send email to this address:</p>
      <div class="fx ac g2" style="padding:10px 18px;background:var(--bg2);border-radius:var(--r2)">
        <span class="sa mn2" style="color:var(--a);font-weight:700;font-size:.92rem">${ib?.emailAddress||''}</span>
        <button class="b bg bi" style="padding:4px" onclick="copyText('${ib?.emailAddress||''}')">📋</button>
      </div>
      <div class="fx ac g2 mt6" style="opacity:.5"><div class="sp" style="width:12px;height:12px"></div><span class="tx tm">Live checking (Real-time)</span></div>`;
    return;
  }
  // Viewing single message
  if(S.aM){el.classList.add('nn');ev.classList.remove('nn');em.classList.add('nn');return}
  // Message list
  em.classList.add('nn');el.classList.remove('nn');ev.classList.add('nn');
  el.innerHTML=`<div class="fx ac jb" style="padding:10px 20px"><span class="ts bo">${S.msgs.length} message${S.msgs.length!==1?'s':''}</span><button class="b bg bsm" onclick="loadMessages('${S.aI}')">🔄</button></div>`
    +S.msgs.map((m,i)=>`
    <div class="ei ${m.isRead?'':'ur'} ai" onclick="openMessage('${esc(m.id)}')">
      <div class="av">${(m.from?.name||m.from?.address||'?')[0].toUpperCase()}</div>
      <div class="ec">
        <div class="ef">${esc(m.from?.name||m.from?.address||'Unknown')}</div>
        <div class="es">${esc(m.subject||'(no subject)')}</div>
        <div class="ep">${esc(m.intro||'')}</div>
      </div>
      <div class="fx fc" style="align-items:flex-end;gap:3px;flex-shrink:0">
        <div class="tx tm">${ago(m.receivedAt)}</div>
        ${m.otpCode?`<span class="bd2 bd2a">OTP: ${m.otpCode}</span>`:''}
      </div>
    </div>`).join('');
}
async function openMessage(id){
  S.aM=id;renderMessageArea();
  const ev=$('eV');if(!ev)return;
  ev.innerHTML='<div class="fx ac jc" style="min-height:300px"><div class="sp sp2"></div></div>';
  try{
    const d=await A.g(`/inbox/${S.aI}/messages/${id}`);
    if(!d.success)throw new Error(d.error||'Failed to load');
    const m=d.data;
    let html=`<div class="ev ai">
      <button class="b bg bsm mb4" onclick="backToList()">← Back to inbox</button>`;
    // OTP section
    if(m.otpCode)html+=`<div class="otp"><div><div class="otpl">🔐 OTP Code Detected</div><div class="otpv">${esc(m.otpCode)}</div></div><button class="b ba bsm" onclick="copyText('${esc(m.otpCode)}')">📋 Copy</button></div>`;
    // Verification links
    if(m.verificationLinks?.length)html+=`<div style="padding:16px 20px;background:linear-gradient(135deg,rgba(52,211,153,.05),rgba(34,211,238,.03));border-radius:var(--r3);margin-bottom:16px"><div class="ts bo mb2" style="color:var(--s)">🔗 Verification Links Found</div>${m.verificationLinks.map(l=>`<a href="${esc(l)}" target="_blank" rel="noopener" class="fx ac g2" style="padding:4px 0;font-size:.76rem;color:var(--a);word-break:break-all">🔗 ${esc(l.length>80?l.slice(0,80)+'...':l)}</a>`).join('')}</div>`;
    // Subject + meta
    html+=`<div class="evs">${esc(m.subject||'(no subject)')}</div>
      <div class="evm">
        <div class="av" style="width:32px;height:32px;font-size:.72rem">${(m.from?.name||m.from?.address||'?')[0].toUpperCase()}</div>
        <div class="f1">
          <div class="ts bo">${esc(m.from?.name||m.from?.address||'Unknown')}</div>
          <div class="tx tm">${esc(m.from?.address||'')} → ${esc(typeof m.to==='string'?m.to:(m.to?.[0]?.address||''))}</div>
        </div>
        <div class="tx tm">${m.receivedAt?new Date(m.receivedAt).toLocaleString():'—'}</div>
      </div>
      <div class="fx g2 mb4"><button class="b bg bsm" onclick="deleteMessage('${esc(S.aI)}','${esc(m.id)}')">🗑 Delete</button></div>
      <div class="evb">${m.bodyHtml?`<iframe srcdoc="${escAttr(m.bodyHtml)}" sandbox="allow-same-origin" style="width:100%;min-height:350px;background:#fff;border-radius:var(--r2)" onload="this.style.height=Math.max(350,this.contentWindow.document.body.scrollHeight+20)+'px'"></iframe>`:`<pre style="white-space:pre-wrap;font-family:var(--f);line-height:1.7">${esc(m.bodyText||'(empty message)')}</pre>`}</div>
    </div>`;
    ev.innerHTML=html;
    // Mark as read locally
    const localMsg=S.msgs.find(z=>z.id===id);if(localMsg)localMsg.isRead=true;
  }catch(e){ev.innerHTML=`<div class="ey"><p class="tm">⚠️ ${esc(e.message)}</p><button class="b bg bsm mt4" onclick="backToList()">← Back</button></div>`}
}
function backToList(){S.aM=null;renderMessageArea()}
async function deleteMessage(inboxId,msgId){
  try{await A.d(`/inbox/${inboxId}/messages/${msgId}`);S.msgs=S.msgs.filter(m=>m.id!==msgId);S.aM=null;renderMessageArea();toast('Message deleted','i')}catch(e){toast(e.message,'e')}
}
function startLive(inboxId){
  if(S.liveTimeout)clearTimeout(S.liveTimeout);
  S.liveTimeout=setTimeout(()=>{
    stopLive();
    toast('⏸️ Live updates paused to save resources. Click Refresh to check again.','w',6000);
    const indicator=document.querySelector('#mA .ey span.tx');
    if(indicator)indicator.textContent='Live updates paused';
  },600000);
  try{
    S.sse=new EventSource(`/api/inbox/${inboxId}/stream`);
    S.sse.onmessage=ev=>{try{const d=JSON.parse(ev.data);if(d.type==='new_messages'&&d.count>0){toast(`📨 ${d.count} new message${d.count>1?'s':''}!`,'s');loadMessages(inboxId);loadInboxes()}}catch(e){}};
    S.sse.onerror=()=>{if(S.sse)S.sse.close();S.sse=null;if(!S.poll)S.poll=setInterval(()=>{if(S.aI===inboxId)loadMessages(inboxId)},1000)};
  }catch(e){if(!S.poll)S.poll=setInterval(()=>{if(S.aI===inboxId)loadMessages(inboxId)},1000)}
}

/* ═══════════════════ ADMIN ═══════════════════ */
async function loadAdmin(){
  const ct=$('aCt');if(!ct)return;
  if(!S.user||S.user.role!=='admin'){
    ct.innerHTML=`<div class="c tc p6"><h3 style="font-size:1.2rem;font-weight:800;margin-bottom:6px">🔒 Admin Access Required</h3><p class="tm ts mb4">Sign in with admin credentials to access controls</p><button class="b bp" onclick="aModal('login')">Sign In as Admin</button></div>`;return;
  }
  try{
    const d=await A.g('/admin/stats');
    if(d.success){
      renderAdminStats(d.data);
      const b=$('mtB');
      if(b){
        b.textContent = d.data.maintenanceMode ? '🚧 Maintenance: ON' : '✅ Maintenance: OFF';
        b.className = d.data.maintenanceMode ? 'b bd bsm' : 'b bs bsm';
      }
    }
    adminTab('dash');
  }
  catch(e){ct.innerHTML=`<div class="c p4 tm tc">⚠️ ${esc(e.message)}</div>`}
}
function renderAdminStats(s){
  const st=$('aSt');if(!st)return;
  const items=[
    ['👥',s.users||0,`Users (${s.activeUsers||0} active)`,'p'],
    ['📧',s.activeInboxes||0,`Active Inboxes`,'a'],
    ['💌',s.messages||0,'Total Messages','s'],
    ['🔑',s.apiKeys||0,'API Keys','w'],
    ['🌐',`${s.activeProviders||0}/${s.providers||0}`,'Providers Online','d'],
    ['📊',s.apiRequests24h||0,'API Requests (24h)','p'],
  ];
  st.innerHTML=items.map(([ic,v,l,c],i)=>`
    <div class="sc ai">
      <div class="si" style="background:var(--${c}g);color:var(--${c})">${ic}</div>
      <div class="sv">${v}</div>
      <div class="sl">${l}</div>
    </div>`).join('');
}
async function adminTab(t){
  // Update active tab
  const tabs=['dash','users','prov','dom','ibx','akey','alg','ann','flg','set'];
  document.querySelectorAll('#at .tb2').forEach((b,i)=>b.classList.toggle('on',tabs[i]===t));
  const c=$('aCt');if(!c)return;
  c.innerHTML='<div class="fx ac jc p6"><div class="sp sp2"></div></div>';
  try{
    if(t==='dash'){
      const [apiRes, auditRes, statsRes] = await Promise.all([
        A.g('/admin/api-logs?limit=5'),
        A.g('/admin/audit-logs?limit=5'),
        A.g('/admin/stats')
      ]);
      const apiLogs = apiRes.data || [];
      const auditLogs = auditRes.data || [];
      const stats = statsRes.data || {};
      const providers = stats.providerHealth || [];

      c.innerHTML = `
        <div class="gr g2 mb6" style="grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:16px">
          <!-- Quick Operations Card -->
          <div class="c ai" style="border:none;background:var(--gl);padding:24px">
            <h3 class="bo ts mb4" style="font-size:1.05rem;font-weight:700">⚡ Quick Management</h3>
            <div class="fx fc g2">
              <button class="b bp bw" onclick="A.p('/admin/providers/sync-domains').then(()=>{toast('✅ Domains synced','s');adminTab('dash')}).catch(e=>toast(e.message,'e'))">🔄 Force Domain Sync</button>
              <button class="b ba bw" onclick="A.p('/admin/providers/health-check').then(()=>{toast('✅ Health checked','s');adminTab('dash')}).catch(e=>toast(e.message,'e'))">💚 Check Provider Statuses</button>
              <button class="b bd bw" onclick="tMt()">🚧 Toggle Maintenance Mode</button>
            </div>
          </div>

          <!-- Active System Providers -->
          <div class="c ai" style="border:none;background:var(--gl);padding:24px">
            <h3 class="bo ts mb4" style="font-size:1.05rem;font-weight:700">🌐 Active Provider Pools</h3>
            <div style="max-height:200px;overflow-y:auto">
              ${providers.map(p => `
                <div class="fx ac jb mb2" style="border-bottom:1px solid var(--bg3);padding-bottom:8px">
                  <div>
                    <span class="ts bo" style="font-size:.82rem">${esc(p.display_name)}</span>
                    <span class="tx tm" style="font-size:.65rem;display:block">Prio: ${p.priority} · Req: ${p.request_count}</span>
                  </div>
                  <span class="bd2 bd2${p.status==='active'?'s':p.status==='degraded'?'w':'d'}">${p.status}</span>
                </div>
              `).join('') || '<div class="tc tm">No providers configured</div>'}
            </div>
          </div>
        </div>

        <div class="gr g2" style="grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:16px">
          <!-- Recent API Requests -->
          <div class="c ai" style="border:none;background:var(--gl);padding:24px">
            <h3 class="bo ts mb4" style="font-size:1.05rem;font-weight:700">📊 Real-Time API Logs</h3>
            <div class="tw">
              <table class="ta" style="font-size:.7rem">
                <thead>
                  <tr>
                    <th>Method</th>
                    <th>Path</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  ${apiLogs.map(l => `
                    <tr>
                      <td><span class="bd2 bd2${l.method==='GET'?'s':'a'}">${l.method}</span></td>
                      <td class="mn2 tx" style="max-width:140px;overflow:hidden;text-overflow:ellipsis">${esc(l.path)}</td>
                      <td><span class="bd2 bd2${(l.status_code||200)<400?'s':'d'}">${l.status_code||200}</span></td>
                      <td class="tx tm">${ago(l.created_at)}</td>
                    </tr>
                  `).join('') || '<tr><td colspan="4" class="tc tm">No logs recorded</td></tr>'}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Recent Administrative Actions -->
          <div class="c ai" style="border:none;background:var(--gl);padding:24px">
            <h3 class="bo ts mb4" style="font-size:1.05rem;font-weight:700">📋 Security Audit Logs</h3>
            <div class="tw">
              <table class="ta" style="font-size:.7rem">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>IP</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  ${auditLogs.map(l => `
                    <tr>
                      <td><span class="bd2 bd2m">${esc(l.action)}</span></td>
                      <td class="mn2 tx">${esc(l.ip_address)}</td>
                      <td class="tx tm">${ago(l.created_at)}</td>
                    </tr>
                  `).join('') || '<tr><td colspan="3" class="tc tm">No audit events recorded</td></tr>'}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    }
    else if(t==='users'){
      const d=await A.g('/admin/users');
      c.innerHTML=`<div class="tw"><table class="ta"><thead><tr><th>Email</th><th>Name</th><th>Role</th><th>Status</th><th>Last Login</th><th>Actions</th></tr></thead><tbody>
        ${(d.data||[]).map(u=>`<tr>
          <td class="mn2 tx">${esc(u.email)}</td>
          <td>${esc(u.display_name||'—')}</td>
          <td><span class="bd2 bd2${u.role==='admin'?'d':u.role==='developer'?'a':'p'}">${u.role}</span></td>
          <td><span class="bd2 bd2${u.status==='active'?'s':'w'}">${u.status}</span></td>
          <td class="tx tm">${u.last_login_at?ago(u.last_login_at):'Never'}</td>
          <td class="fx g2">
            <select class="ip" style="width:78px;padding:3px;font-size:.62rem" onchange="A.u('/admin/users/${u.id}',{role:this.value}).then(()=>toast('✅ Role updated','s')).catch(e=>toast(e.message,'e'))"><option ${u.role==='user'?'selected':''}>user</option><option ${u.role==='developer'?'selected':''}>developer</option><option ${u.role==='admin'?'selected':''}>admin</option></select>
            <select class="ip" style="width:78px;padding:3px;font-size:.62rem" onchange="A.u('/admin/users/${u.id}',{status:this.value}).then(()=>toast('✅ Status updated','s')).catch(e=>toast(e.message,'e'))"><option ${u.status==='active'?'selected':''}>active</option><option ${u.status==='suspended'?'selected':''}>suspended</option><option ${u.status==='banned'?'selected':''}>banned</option></select>
          </td>
        </tr>`).join('')}</tbody></table></div>`;
    }
    else if(t==='prov'){
      const d=await A.g('/admin/providers');
      c.innerHTML=`<div class="fx g2 mb4 fw">
        <button class="b bp bsm" onclick="A.p('/admin/providers/sync-domains').then(()=>{toast('✅ Domains synced','s');adminTab('prov')}).catch(e=>toast(e.message,'e'))">🔄 Sync All Domains</button>
        <button class="b ba bsm" onclick="A.p('/admin/providers/health-check').then(()=>{toast('✅ Health checked','s');adminTab('prov')}).catch(e=>toast(e.message,'e'))">💚 Run Health Check</button>
      </div>
      <div class="sg" style="grid-template-columns:repeat(auto-fill,minmax(240px,1fr))">
        ${(d.data||[]).map(p=>`<div class="c ai">
          <div class="fx ac jb mb2">
            <span class="bo ts">${esc(p.display_name)}</span>
            <span class="bd2 bd2${p.status==='active'?'s':p.status==='degraded'?'w':'d'}">${p.status}</span>
          </div>
          <div class="tx tm mb1">Health: <span class="bd2 bd2${p.health_status==='healthy'?'s':p.health_status==='degraded'?'w':'d'}">${p.health_status||'unknown'}</span> · ${p.avg_response_ms||0}ms</div>
          <div class="tx tm mb1">Requests: ${p.request_count||0} · Errors: ${p.error_count||0}</div>
          <div class="tx tm">Priority: ${p.priority} · Weight: ${p.weight}</div>
          <div class="mt2">
            <select class="ip" style="width:100%;padding:4px 8px;font-size:.65rem" onchange="A.u('/admin/providers/${p.id}',{status:this.value}).then(()=>{toast('Updated','s');adminTab('prov')})">
              <option ${p.status==='active'?'selected':''}>active</option>
              <option ${p.status==='degraded'?'selected':''}>degraded</option>
              <option ${p.status==='disabled'?'selected':''}>disabled</option>
            </select>
          </div>
        </div>`).join('')}
      </div>`;
    }
    else if(t==='dom'){
      const d=await A.g('/admin/domains');
      c.innerHTML=`<div class="fx ac jb mb4"><h3 class="bo ts">${(d.data||[]).length} Domains Registered</h3></div>
        <div class="tw" style="max-height:70vh;overflow-y:auto"><table class="ta"><thead><tr><th>Domain</th><th>Provider</th><th>Status</th></tr></thead><tbody>
        ${(d.data||[]).map(dm=>`<tr><td class="mn2 tx">${esc(dm.domain)}</td><td>${esc(dm.provider_display_name||dm.provider_name||'')}</td><td><span class="bd2 bd2${dm.status==='active'?'s':'d'}">${dm.status}</span></td></tr>`).join('')}
        </tbody></table></div>`;
    }
    else if(t==='ibx'){
      const d=await A.g('/admin/inboxes');
      c.innerHTML=`<div class="tw"><table class="ta"><thead><tr><th>Address</th><th>Provider</th><th>Messages</th><th>Created</th><th></th></tr></thead><tbody>
        ${(d.data||[]).map(i=>`<tr><td class="mn2 tx">${esc(i.email_address)}</td><td class="tx">${esc(i.provider_name||'')}</td><td>${i.message_count||0}</td><td class="tx tm">${ago(i.created_at)}</td><td><button class="b bg bsm" style="color:var(--d)" onclick="A.d('/admin/inboxes/${i.id}').then(()=>{toast('Deleted','i');adminTab('ibx')})">🗑</button></td></tr>`).join('')}
        </tbody></table></div>`;
    }
    else if(t==='akey'){
      const d=await A.g('/admin/api-keys');
      c.innerHTML=`<div class="tw"><table class="ta"><thead><tr><th>Name</th><th>User</th><th>Key Prefix</th><th>Status</th><th>Quota</th></tr></thead><tbody>
        ${(d.data||[]).map(k=>`<tr><td class="bo">${esc(k.name)}</td><td class="tx">${esc(k.user_email||'')}</td><td class="mn2 tx">${k.key_prefix||''}...</td><td><span class="bd2 bd2${k.status==='active'?'s':'d'}">${k.status}</span></td><td class="tx">${k.quota_used_today||0}/${k.quota_daily||1000}</td></tr>`).join('')}
        </tbody></table></div>`;
    }
    else if(t==='alg'){
      const d=await A.g('/admin/audit-logs');
      c.innerHTML=`<div class="tw"><table class="ta"><thead><tr><th>Action</th><th>Resource</th><th>IP</th><th>Time</th></tr></thead><tbody>
        ${(d.data||[]).map(l=>`<tr><td><span class="bd2 bd2m">${esc(l.action)}</span></td><td class="tx">${esc(l.resource_type||'')} ${esc(l.resource_id||'')}</td><td class="tx mn2">${esc(l.ip_address||'')}</td><td class="tx tm">${ago(l.created_at)}</td></tr>`).join('')}
        </tbody></table></div>`;
    }
    else if(t==='ann'){
      const d=await A.g('/admin/announcements');
      c.innerHTML=`<div class="fx ac jb mb4"><h3 class="bo ts">Announcements</h3><button class="b bp bsm" onclick="announceModal()">+ New</button></div>
        ${(d.data||[]).length?(d.data||[]).map(a=>`<div class="c mb2 ai"><div class="fx ac jb mb2"><span class="bo">${esc(a.title)}</span><div class="fx g2"><span class="bd2 bd2${a.type==='critical'?'d':a.type==='warning'?'w':'p'}">${a.type}</span><button class="b bg bsm" style="color:var(--d)" onclick="A.d('/admin/announcements/${a.id}').then(()=>{toast('Deleted','i');adminTab('ann')})">🗑</button></div></div><p class="ts t2">${esc(a.content)}</p></div>`).join(''):'<div class="c p4 tm tc">No announcements yet</div>'}`;
    }
    else if(t==='flg'){
      const d=await A.g('/admin/feature-flags');
      c.innerHTML=`<div class="gr g3" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr))">${(d.data||[]).map(f=>`<div class="c ai"><div class="fx ac jb"><div><div class="bo ts">${esc(f.name)}</div><div class="tx tm">${esc(f.description||'')}</div></div><button class="b ${f.is_enabled?'bs':'bg'} bsm" onclick="A.u('/admin/feature-flags/${f.id}',{isEnabled:${!f.is_enabled}}).then(()=>{toast('Updated','s');adminTab('flg')})">${f.is_enabled?'✅ ON':'❌ OFF'}</button></div></div>`).join('')}</div>`;
    }
    else if(t==='set'){
      const d=await A.g('/admin/settings');
      c.innerHTML=`<div class="gr g3" style="grid-template-columns:repeat(auto-fill,minmax(350px,1fr))">${(d.data||[]).map(s=>`<div class="c ai"><div class="tx tm mb2">${esc(s.description||'')}</div><div class="fx ac g2"><span class="mn2 ts bo" style="min-width:140px">${esc(s.key)}</span><input class="ip f1" value="${esc(s.value||'')}" id="st_${s.key}" style="padding:5px 8px;font-size:.74rem"><button class="b bp bsm" onclick="A.u('/admin/settings/${s.key}',{value:document.getElementById('st_${s.key}').value}).then(()=>toast('✅ Saved','s')).catch(e=>toast(e.message,'e'))">Save</button></div></div>`).join('')}</div>`;
    }
  }catch(e){c.innerHTML=`<div class="c p4 tm tc">⚠️ ${esc(e.message)}</div>`}
}
// Alias for HTML onclick
function aT(t){adminTab(t)}
function announceModal(){
  $('mC').innerHTML=`<div class="mo" onclick="if(event.target===this)closeModal()"><div class="mx ai"><div class="mh"><h2>📢 New Announcement</h2><button class="b bg bi" onclick="closeModal()">✕</button></div><div class="mb"><div class="ig"><label>Title</label><input class="ip" id="anT" placeholder="Announcement title"></div><div class="ig"><label>Content</label><textarea class="ip" id="anC" rows="3" placeholder="Details..."></textarea></div><div class="ig"><label>Type</label><select class="ip" id="anY"><option value="info">ℹ️ Info</option><option value="warning">⚠️ Warning</option><option value="critical">🔴 Critical</option></select></div></div><div class="mf"><button class="b bg" onclick="closeModal()">Cancel</button><button class="b bp" onclick="A.p('/admin/announcements',{title:$('anT').value,content:$('anC').value,type:$('anY').value}).then(()=>{closeModal();toast('✅ Created','s');adminTab('ann')}).catch(e=>toast(e.message,'e'))">Publish</button></div></div></div>`;
}
function aRef(){loadAdmin()}
async function tMt(){try{const d=await A.p('/admin/maintenance',{});toast(`Maintenance mode is now ${d.maintenanceMode ? 'ON 🚧' : 'OFF ✅'}`,'w');loadAdmin()}catch(e){toast(e.message,'e')}}

/* ═══════════════════ DEVELOPER ═══════════════════ */
function loadDeveloper(){
  if(!S.user) return;
  const isDev = S.user.role === 'developer' || S.user.role === 'admin';
  const tabs = $('dt');
  const ban = $('drB');
  if(tabs) tabs.classList.toggle('nn', !isDev);
  if(ban) ban.classList.toggle('nn', isDev);

  if(isDev) {
    devTab('keys');
  } else {
    const c = $('dC');
    if(c) {
      c.innerHTML = `
        <div class="c tc p8" style="background:var(--gl);border:none;padding:48px 24px">
          <div style="font-size:3rem;margin-bottom:20px">⚡</div>
          <h2 style="font-size:1.4rem;font-weight:800;margin-bottom:8px">Activate Developer Platform</h2>
          <p class="tm ts mb6" style="max-width:500px;margin-left:auto;margin-right:auto">
            Build integrations, automate email registrations, and receive callbacks using our enterprise temporary mail APIs. 
            Access API keys, Webhooks, API Playground, SDKs, and complete developer analytics.
          </p>
          <button class="b bp pl6 pr6 pt3 pb3" style="font-size:.9rem;font-weight:700" onclick="bDev()">🚀 Activate Developer Access (Free)</button>
        </div>
      `;
    }
  }
}
function dT(t){devTab(t)}
function devTab(t){
  const tabs=['keys','an','lg','wh','pg','sdk','doc'];
  document.querySelectorAll('#dt .tb2').forEach((b,i)=>b.classList.toggle('on',tabs[i]===t));
  tabs.forEach(z=>{const e=$(`d-${z}`);if(e)e.classList.toggle('nn',z!==t)});
  if(t==='keys')loadKeys();
  if(t==='an')loadDevAnalytics();
  if(t==='lg')loadDevLogs();
  if(t==='wh')loadWebhooks();
  if(t==='doc')renderDocs($('dDc'));
}
async function loadKeys(){
  const c=$('kL');if(!c)return;
  try{const d=await A.g('/developer/api-keys');
    if(!d.data?.length){c.innerHTML='<p class="tm tc p4">No API keys — create one to get started</p>';return}
    c.innerHTML=`<div class="tw"><table class="ta"><thead><tr><th>Name</th><th>Key Prefix</th><th>Quota</th><th>Status</th><th></th></tr></thead><tbody>
      ${d.data.map(k=>`<tr><td class="bo">${esc(k.name)}</td><td class="mn2 tx">${k.key_prefix}...</td><td class="tx">${k.quota_used_today||0}/${k.quota_daily||1000}</td><td><span class="bd2 bd2${k.status==='active'?'s':'d'}">${k.status}</span></td><td><button class="b bd bsm" onclick="A.d('/developer/api-keys/${k.id}').then(()=>{loadKeys();toast('🔑 Key revoked','i')})">Revoke</button></td></tr>`).join('')}
    </tbody></table></div>`}
  catch(e){c.innerHTML=`<p class="tm p4 tc">⚠️ ${esc(e.message)}</p>`}
}
function kModal(){
  $('mC').innerHTML=`<div class="mo" onclick="if(event.target===this)closeModal()"><div class="mx ai"><div class="mh"><h2>🔑 Create API Key</h2><button class="b bg bi" onclick="closeModal()">✕</button></div><div class="mb"><div class="ig"><label>Key Name</label><input class="ip" id="kN" placeholder="My Application"></div><div class="ig"><label>Daily Quota</label><input class="ip" id="kQ" type="number" value="1000"></div></div><div class="mf"><button class="b bg" onclick="closeModal()">Cancel</button><button class="b bp" onclick="createKey()">Create Key</button></div></div></div>`;
}
async function createKey(){
  try{
    const d=await A.p('/developer/api-keys',{name:$('kN')?.value||'Key',quotaDaily:parseInt($('kQ')?.value)||1000});
    closeModal();
    $('mC').innerHTML=`<div class="mo"><div class="mx ai"><div class="mh"><h2>🎉 API Key Created!</h2></div><div class="mb"><div style="background:var(--bg0);padding:16px;border-radius:var(--r2);margin-bottom:12px"><div class="tx tm mb2">⚠️ Copy this key now — it won't be shown again!</div><code class="mn2 sa" style="word-break:break-all;color:var(--a);display:block;padding:10px;background:var(--bg2);border-radius:var(--r1);font-size:.82rem">${d.data.key}</code></div><button class="b ba bw" onclick="copyText('${d.data.key}');closeModal()">📋 Copy Key & Close</button></div></div></div>`;
    loadKeys();
  }catch(e){toast(e.message,'e')}
}
async function loadDevAnalytics(){
  const c=$('dSt');if(!c)return;
  try{const d=await A.g('/developer/analytics');if(d.data)c.innerHTML=`<div class="sc ai"><div class="sv">${d.data.totalRequests||0}</div><div class="sl">Requests (7d)</div></div><div class="sc ai"><div class="sv">${d.data.avgResponseTime||0}ms</div><div class="sl">Avg Response</div></div><div class="sc ai"><div class="sv">${d.data.errorRate||0}%</div><div class="sl">Error Rate</div></div>`}catch(e){c.innerHTML=`<p class="tm tc p4">Sign in as developer</p>`}
}
async function loadDevLogs(){
  const c=$('dLg');if(!c)return;
  try{const d=await A.g('/developer/logs');c.innerHTML=(d.data||[]).length?`<table class="ta"><thead><tr><th>Method</th><th>Path</th><th>Status</th><th>Time</th><th>Date</th></tr></thead><tbody>${d.data.map(l=>`<tr><td><span class="bd2 bd2${l.method==='GET'?'s':'a'}">${l.method}</span></td><td class="mn2 tx">${esc(l.path)}</td><td><span class="bd2 bd2${(l.status_code||200)<400?'s':'d'}">${l.status_code||200}</span></td><td class="tx">${l.response_time_ms||0}ms</td><td class="tx tm">${ago(l.created_at)}</td></tr>`).join('')}</tbody></table>`:'<p class="tm p4 tc">No logs yet</p>'}catch(e){c.innerHTML=`<p class="tm p4 tc">⚠️ ${esc(e.message)}</p>`}
}
async function loadWebhooks(){
  const c=$('wL');if(!c)return;
  try{const d=await A.g('/developer/webhooks');c.innerHTML=(d.data||[]).length?d.data.map(w=>`<div class="fx ac jb p4"><div class="f1"><div class="mn2 tx" style="color:var(--a)">${esc(w.url)}</div><div class="tx tm mt2">Events: ${(()=>{try{return JSON.parse(w.events).join(', ')}catch(e){return w.events||'all'}})()}</div></div><button class="b bd bsm" onclick="A.d('/developer/webhooks/${w.id}').then(()=>{loadWebhooks();toast('Deleted','i')})">Delete</button></div>`).join(''):'<p class="tm p4 tc">No webhooks configured</p>'}catch(e){c.innerHTML=`<p class="tm p4 tc">⚠️ ${esc(e.message)}</p>`}
}
function whM(){$('mC').innerHTML=`<div class="mo" onclick="if(event.target===this)closeModal()"><div class="mx ai"><div class="mh"><h2>🔗 Add Webhook</h2><button class="b bg bi" onclick="closeModal()">✕</button></div><div class="mb"><div class="ig"><label>Endpoint URL</label><input class="ip" id="whU" placeholder="https://your-server.com/webhook"></div></div><div class="mf"><button class="b bg" onclick="closeModal()">Cancel</button><button class="b bp" onclick="A.p('/developer/webhooks',{url:$('whU').value}).then(()=>{closeModal();loadWebhooks();toast('✅ Webhook created','s')}).catch(e=>toast(e.message,'e'))">Create</button></div></div></div>`}
async function bDev(){if(!S.user){aModal('register');return}try{await A.p('/developer/register');toast('🚀 Developer access activated!','s');await checkAuth();loadDeveloper()}catch(e){toast(e.message,'e')}}
async function rPg(){
  const m=$('pM')?.value||'GET',u=$('pU')?.value||'/api/domains',b=$('pB')?.value,h=$('pH')?.value,r=$('pR');
  if(!r)return;r.textContent='// Sending request...';r.style.color='var(--t3)';
  try{
    const start=performance.now();
    const opts={method:m,headers:{'Content-Type':'application/json'},credentials:'include'};
    if(h)try{Object.assign(opts.headers,JSON.parse(h))}catch(e){}
    if(b&&m!=='GET')try{JSON.parse(b);opts.body=b}catch(e){opts.body=b}
    if(S.token)opts.headers.Authorization=`Bearer ${S.token}`;
    const res=await fetch(u.startsWith('/')?u:'/api/'+u,opts);
    const data=await res.json();const ms=Math.round(performance.now()-start);
    r.textContent=`// ${res.status} ${res.statusText} · ${ms}ms\n${JSON.stringify(data,null,2)}`;
    r.style.color=res.ok?'var(--s)':'var(--d)';
  }catch(e){r.textContent=`// Error: ${e.message}`;r.style.color='var(--d)'}
}

/* ═══════════════════ DOCS ═══════════════════ */
function renderDocs(c){
  if(!c)return;
  const base=location.origin;
  const endpoints=[
    ['GET','/domains','List all available domains',false],
    ['POST','/inbox','Create a new temporary inbox',false,'{ "domain": "optional.com" }'],
    ['GET','/inbox','List your inboxes',false],
    ['GET','/inbox/:id/messages','Get messages for an inbox',false],
    ['GET','/inbox/:iid/messages/:mid','Get full message with OTP + verification links',false],
    ['DELETE','/inbox/:id','Delete an inbox',false],
    ['GET','/inbox/:id/stream','SSE real-time message stream',false],
    ['POST','/auth/register','Register a new account',false,'{ "email": "...", "password": "..." }'],
    ['POST','/auth/login','Login to existing account',false,'{ "email": "...", "password": "..." }'],
    ['GET','/auth/me','Get current authenticated user',true],
    ['PUT','/auth/profile','Update display name or password',true],
    ['POST','/developer/register','Activate developer access',true],
    ['POST','/developer/api-keys','Create a new API key',true,'{ "name": "My App", "quotaDaily": 1000 }'],
    ['GET','/developer/api-keys','List your API keys',true],
    ['DELETE','/developer/api-keys/:id','Revoke an API key',true],
    ['GET','/developer/analytics','Get usage analytics',true],
    ['GET','/developer/logs','Get request logs',true],
    ['POST','/developer/webhooks','Register a webhook',true,'{ "url": "https://..." }'],
    ['GET','/health','System health & provider status',false],
    ['GET','/announcements','Platform announcements',false],
  ];
  c.innerHTML=`<div class="ai">
    <div class="fx ac g3 mb6">
      <div class="lg" style="width:48px;height:48px;font-size:1.3rem;border-radius:var(--r2)">✉</div>
      <div><h2 style="font-size:1.4rem;font-weight:900;letter-spacing:-.03em">XyronMail API v2.0</h2><p class="tx tm">${endpoints.length} endpoints · REST + SSE Real-time</p></div>
    </div>
    <h3 class="bo mb2 ts">Base URL</h3>
    <div class="c mb6" style="padding:12px 16px"><code class="mn2 ts sa" style="color:var(--a)">${base}/api</code></div>
    <h3 class="bo mb4 ts">All Endpoints</h3>
    ${endpoints.map(([m,p,d,auth,body])=>`
    <div class="c mb2 ai" style="padding:14px 18px">
      <div class="fx ac g2 fw">
        <span class="bd2 bd2${m==='GET'?'s':m==='POST'?'a':m==='PUT'?'w':'d'}" style="min-width:52px;justify-content:center">${m}</span>
        <code class="mn2 ts" style="color:var(--t1)">/api${p}</code>
        ${auth?'<span class="bd2 bd2w">🔒 Auth</span>':'<span class="bd2 bd2m">🌐 Public</span>'}
      </div>
      <p class="tx tm mt2">${d}</p>
      ${body?`<pre style="background:var(--bg0);padding:8px 12px;border-radius:var(--r1);margin-top:8px;font-size:.66rem;color:var(--t3);font-family:var(--fm);overflow-x:auto">${body}</pre>`:''}
    </div>`).join('')}
    <h3 class="bo mb2 mt6 ts">Authentication</h3>
    <div class="c mb6"><div class="mn2 tx" style="background:var(--bg0);padding:14px;border-radius:var(--r2);color:var(--a);line-height:2">// Option 1: Bearer token<br>Authorization: Bearer &lt;jwt_token&gt;<br><br>// Option 2: API Key<br>X-API-Key: xm_your_api_key_here</div></div>
    <h3 class="bo mb2 ts">Rate Limits</h3>
    <div class="c"><p class="ts t2">200 requests / 15 min per IP · API keys: 1000 / day (configurable)</p></div>
  </div>`;
}

/* ═══════════════════ ANNOUNCEMENTS ═══════════════════ */
async function loadAnnouncements(){try{const d=await A.g('/announcements');if(d.data?.length)d.data.forEach(a=>toast(`📢 ${a.title}`,'i',5000))}catch(e){}}

/* ═══════════════════ UTILITIES ═══════════════════ */
function toast(msg,type='i',dur=3000){
  const c=$('tC');if(!c)return;
  const t=document.createElement('div');t.className=`to to-${type}`;t.textContent=msg;c.appendChild(t);
  setTimeout(()=>{t.style.opacity='0';t.style.transform='translateX(60px)';t.style.transition='all .25s ease-out';setTimeout(()=>t.remove(),250)},dur);
}
function copyText(t){
  if(!t)return;
  navigator.clipboard?.writeText(t).then(()=>toast('📋 Copied!','s',1500)).catch(()=>{
    const a=document.createElement('textarea');a.value=t;a.style.cssText='position:fixed;opacity:0';
    document.body.appendChild(a);a.select();document.execCommand('copy');document.body.removeChild(a);
    toast('📋 Copied!','s',1500);
  });
}
function closeModal(){const mc=$('mC');if(mc)mc.innerHTML=''}
function esc(s){if(s==null)return'';const d=document.createElement('div');d.textContent=String(s);return d.innerHTML}
function escAttr(s){return s?String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&#39;').replace(/</g,'&lt;').replace(/>/g,'&gt;'):''}
function ago(d){
  if(!d)return'—';
  const s=Math.floor((Date.now()-new Date(d))/1000);
  if(s<0)return'now';if(s<60)return'just now';if(s<3600)return`${Math.floor(s/60)}m ago`;
  if(s<86400)return`${Math.floor(s/3600)}h ago`;if(s<604800)return`${Math.floor(s/86400)}d ago`;
  return new Date(d).toLocaleDateString();
}
// Service Worker
if('serviceWorker' in navigator)navigator.serviceWorker.register('/sw.js').catch(()=>{});
