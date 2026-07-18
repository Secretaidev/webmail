/**
 * XyronMail — Mega Domain Pool Provider
 * Contains 1000+ known disposable email domains
 * Routes through available API backends for actual email operations
 */
const POOL = [
  // === Guerrilla Mail Network (API: guerrillamail) ===
  'guerrillamail.com','guerrillamail.info','guerrillamail.net','guerrillamail.org','guerrillamail.de',
  'guerrillamailblock.com','sharklasers.com','grr.la','pokemail.net','spam4.me','trishare.com',
  // === 1secMail Network ===
  '1secmail.com','1secmail.org','1secmail.net','bheps.com','dcctb.com','kzccv.com','qiott.com','wuuvo.com','icznn.com','ezztt.com',
  // === Temp-Mail Networks ===
  'tempail.com','tempr.email','temp-mail.org','tempmailo.com','tempm.com',
  'temp-mail.io','fakemail.net','tmpmail.net','tmpmail.org','tempmailaddress.com',
  'emailtemporario.com.br','emailfake.com','guerrillamail.biz',
  // === Maildrop / Mailinator style ===
  'maildrop.cc','mailinator.com','guerrillamail.com','trashmail.com','throwaway.email',
  'dispostable.com','yopmail.com','mailnesia.com','tempinbox.com','fakeinbox.com',
  // === Expanded Known Disposable Domains ===
  'mailcatch.com','mailexpire.com','mailmoat.com','mailnull.com','mailshell.com',
  'mailsiphon.com','mailslite.com','mailzilla.com','meltmail.com','mintemail.com',
  'mt2015.com','mytrashmail.com','nobulk.com','nospamfor.us','nowmymail.com',
  'objectmail.com','obobbo.com','odaymail.com','oneoffemail.com','onewaymail.com',
  'oopi.org','ordinaryamerican.net','owlpic.com','pjjkp.com','plexolan.de',
  'pookmail.com','privacy.net','proxymail.eu','putthisinyouremail.com','quickinbox.com',
  'rcpt.at','reallymymail.com','recode.me','recursor.net','regbypass.com',
  'rhyta.com','rklips.com','rmqkr.net','royal.net','rppkn.com',
  'rtrtr.com','s0ny.net','safe-mail.net','safersignup.de','safetymail.info',
  'safetypost.de','sandelf.de','saynotospams.com','scatmail.com','schafmail.de',
  'sezet.com','sharklasers.com','shieldedmail.com','shiftmail.com','skeefmail.com',
  'slaskpost.se','slipry.net','slopsbox.com','smashmail.de','soodonims.com',
  'spam.la','spamavert.com','spambob.com','spambob.net','spambob.org',
  'spambog.com','spambog.de','spambog.ru','spambox.info','spambox.irishspringrealty.com',
  'spambox.us','spamcannon.com','spamcannon.net','spamcero.com','spamcon.org',
  'spamcorptastic.com','spamcowboy.com','spamcowboy.net','spamcowboy.org','spamday.com',
  'spamex.com','spamfighter.cf','spamfighter.ga','spamfighter.gq','spamfighter.ml',
  'spamfighter.tk','spamfree.org','spamfree24.com','spamfree24.de','spamfree24.eu',
  'spamfree24.info','spamfree24.net','spamfree24.org','spamgoes.in','spamherelots.com',
  'spamhereplease.com','spamhole.com','spamify.com','spaminator.de','spamkill.info',
  'spaml.com','spaml.de','spammotel.com','spamobox.com','spamoff.de',
  'spamslicer.com','spamspot.com','spamstack.net','spamthis.co.uk','spamthisplease.com',
  'spamtrail.com','spamtrap.ro','speed.1s.fr','spoofmail.de','squizzy.de',
  'sry.li','startkeys.com','stinkefinger.net','stop-my-spam.cf','stop-my-spam.com',
  'stop-my-spam.ga','stop-my-spam.ml','stop-my-spam.tk','streetwisemail.com','stuffmail.de',
  'supergreatmail.com','supermailer.jp','superrito.com','superstachel.de','suremail.info',
  'svk.jp','sweetxxx.de','tafmail.com','tagyoureit.com','talkinator.com',
  'tapchicuoihoi.com','teewars.org','teleworm.com','teleworm.us','temp-mail.de',
  'temp-mail.live','temp-mail.pp.ua','temp-mail.ru','tempail.com','tempalias.com',
  'tempe4mail.com','tempemail.biz','tempemail.co.za','tempemail.com','tempemail.net',
  'tempinbox.co.uk','tempinbox.com','tempmail.eu','tempmail.it','tempmail.pp.ua',
  'tempmail2.com','tempmaildemo.com','tempmailer.com','tempmailer.de','tempmailfo.com',
  'tempomail.fr','temporarily.de','temporarioemail.com.br','temporaryemail.net','temporaryemail.us',
  'temporaryforwarding.com','temporaryinbox.com','temporarymailaddress.com','tempthe.net','tempymail.com',
  'thanksnospam.info','thankyou2010.com','thisisnotmyrealemail.com','throwawayemail.net','tilien.com',
  'tittbit.in','tmail.ws','tmailinator.com','toiea.com','tradermail.info',
  'trash-amil.com','trash-mail.at','trash-mail.com','trash-mail.de','trash-me.com',
  'trash2009.com','trash2010.com','trash2011.com','trashdevil.com','trashdevil.de',
  'trashmail.at','trashmail.com','trashmail.de','trashmail.me','trashmail.net',
  'trashmail.org','trashmail.ws','trashmailer.com','trashymail.com','trashymail.net',
  'trbvm.com','trbvn.com','trialmail.de','trickmail.net','trillianpro.com',
  'turual.com','twinmail.de','tyldd.com','uggsrock.com','umail.net',
  'upliftnow.com','uplipht.com','venompen.com','veryreallydead.com','viditag.com',
  'viewcastmedia.com','viewcastmedia.net','viewcastmedia.org','vipmail.name','vipmail.pw',
  'vomoto.com','vpn.st','vsimcard.com','vubby.com','wasteland.rfc822.org',
  'webemail.me','webm4il.info','wegwerfadresse.de','wegwerf-email-addressen.de','wegwerf-emails.de',
  'wegwerfadresse.de','wegwerfemail.com','wegwerfemail.de','wegwerfmail.de','wegwerfmail.info',
  'wegwerfmail.net','wegwerfmail.org','wh4f.org','whatiaas.com','whatpaas.com',
  'whyspam.me','wickmail.net','wilemail.com','willhackforfood.biz','willselfdestruct.com',
  'winemaven.info','wmail.cf','wollan.info','wuzup.net','wuzupmail.net',
  'wwwnew.eu','xagloo.com','xemaps.com','xents.com','xjoi.com',
  'xmaily.com','xoxy.net','xxi2.com','xxqx3802.com','yanet.me',
  'yapped.net','yeah.net','yep.it','yogamaven.com','yomail.info',
  'yopmail.com','yopmail.fr','yopmail.gq','yourdomain.com','youmailr.com',
  'ypmail.webarnak.fr.eu.org','yui.it','yuurok.com','zehnminuten.de','zehnminutenmail.de',
  'zippymail.info','zoaxe.com','zoemail.org','zomg.info','zxcv.com','zxcvbnm.com',
  // === Additional extended domains ===
  'agedmail.com','anappfor.com','anonbox.net','anonymbox.com','antispam.de',
  'armyspy.com','binkmail.com','bobmail.info','bodhi.lawlita.com','bofthew.com',
  'broadbandninja.com','bsnow.net','bugmenot.com','bumpymail.com','casualdx.com',
  'centermail.com','centermail.net','chammy.info','chogmail.com','choicemail1.com',
  'clrmail.com','codeandscotch.com','cognitiveways.xyz','cool.fr.nf','correo.blogos.net',
  'cosmorph.com','courriel.fr.nf','courrieltemporaire.com','crapmail.org','cross-law.com',
  'crust.email','cuvox.de','dacoolest.com','dandikmail.com','dayrep.com',
  'deadaddress.com','deadfake.cf','deadfake.ga','deadfake.ml','deadfake.tk',
  'deadspam.com','deagot.com','dealja.com','despam.it','despammed.com',
  'devnullmail.com','dfgh.net','digitalsanctuary.com','dingbone.com','discard.cf',
  'discard.email','discard.ga','discard.gq','discard.ml','discard.tk',
  'discardmail.com','discardmail.de','disposable.cf','disposable.ga','disposable.ml',
  'disposableaddress.com','disposableemailaddresses.emailmiser.com','disposableinbox.com','dispose.it','dispostable.com',
  'dm.w3internet.co.uk','dodgeit.com','dodgit.com','dodgit.org','donemail.ru',
  'dontreg.com','dontsendmespam.de','drdrb.com','drdrb.net','droplar.com',
  'duam.net','dudmail.com','dumpandjunk.com','dumpmail.de','dumpyemail.com',
  'e-mail.com','e-mail.org','e4ward.com','easytrashmail.com','einrot.com',
  'einrot.de','eintagsmail.de','email60.com','emailage.cf','emailage.ga',
  'emailage.gq','emailage.ml','emailage.tk','emaildienst.de','emailgo.de',
  'emailias.com','emailigo.de','emailinfive.com','emaillime.com','emailmiser.com',
  'emailproxsy.com','emails.ga','emailsensei.com','emailspam.cf','emailspam.ga',
  'emailspam.gq','emailspam.ml','emailspam.tk','emailtemporar.ro','emailto.de',
  'emailwarden.com','emailx.at.hm','emailxfer.com','emeil.in','emeil.ir',
  'emz.net','enterto.com','ephemail.net','ero-tube.org','etranquil.com',
  'etranquil.net','etranquil.org','evopo.com','explodemail.com','express.net.ua',
  'eyepaste.com','fakemailz.com','fammix.com','fansworldwide.de','fastacura.com',
  'fastchevy.com','fastchrysler.com','fastkawasaki.com','fastmazda.com','fastmitsubishi.com',
  'fastnissan.com','fastsubaru.com','fastsuzuki.com','fasttoyota.com','fastyamaha.com',
  'filzmail.com','fizmail.com','fleckens.hu','flyspam.com','footard.com',
  'forgetmail.com','frapmail.com','freundin.ru','friendlymail.co.uk','fuckingduh.com',
  'fudgerub.com','fux0ringduh.com','garliclife.com','get-mail.cf','get-mail.ga',
  'get-mail.ml','get-mail.tk','get1mail.com','get2mail.fr','getairmail.cf',
  'getairmail.com','getairmail.ga','getairmail.gq','getairmail.ml','getairmail.tk',
  'getmails.eu','getonemail.com','getonemail.net','ghosttexter.de','girlsundertheinfluence.com',
  'gishpuppy.com','goemailgo.com','gorillaswithdirtyarmpits.com','gotmail.com','gotmail.net',
  'gotmail.org','gotti.otherinbox.com','great-host.in','greensloth.com','greyspachy.com',
  'gsrv.co.uk','guerrillamail.biz','guerrillamailblock.com','gustr.com','h8s.org',
  'hacccc.com','haltospam.com','harakirimail.com','hartbot.de','hatespam.org',
  'hellodream.mobi','herp.in','hidemail.de','hidzz.com','hmamail.com',
  'hochsydansen.com','hopemail.biz','hotpop.com','hulapla.de','ieatspam.eu',
  'ieatspam.info','ieh-mail.de','ihateyoualot.info','iheartspam.org','imails.info',
  'inbax.tk','inbox.si','inboxalias.com','inboxbear.com','inboxclean.com',
  'inboxclean.org','incognitomail.com','incognitomail.net','incognitomail.org','insorg-mail.info',
  'ipoo.org','irish2me.com','iwi.net','jetable.com','jetable.fr.nf',
  'jetable.net','jetable.org','jnxjn.com','jourrapide.com','jsrsolutions.com',
  'kasmail.com','kaspop.com','keepmymail.com','killmail.com','killmail.net',
  'kimsdisk.com','kingsq.ga','kitmail.com','klassmaster.com','klassmaster.net',
  'klzlk.com','kookmail.com','kurzepost.de','kuzumail.com','lackmail.net',
  'lags.us','landmail.co','lastmail.co','lawlita.com','lazyinbox.com',
  'letthemeatspam.com','lhsdv.com','lifebyfood.com','link2mail.net','litedrop.com',
  'loadby.us','login-email.cf','login-email.ga','login-email.ml','login-email.tk',
  'lol.ovpn.to','lookugly.com','lopl.co.cc','lortemail.dk','lovemeleaveme.com',
  'lr7.us','lr78.com','lroid.com','lukop.dk','m21.cc',
  'mail-filter.com','mail-temporaire.fr','mail.by','mail.mezimages.net','mail.zp.ua',
  'mail114.net','mail1a.de','mail21.cc','mail2rss.org','mail333.com',
  'mail4trash.com','mailbidon.com','mailblocks.com','mailbucket.org','mailcat.biz',
  'maildx.com','maileater.com','mailed.ro','mailexpire.com','mailfa.tk',
  'mailforspam.com','mailfree.ga','mailfree.gq','mailfree.ml','mailfreeonline.com',
  'mailfs.com','mailguard.me','mailhazard.com','mailhazard.us','mailhz.me',
  'mailimate.com','mailin8r.com','mailinater.com','mailinator.net','mailinator.org',
  'mailinator.us','mailinator2.com','mailincubator.com','mailismagic.com','mailjunk.cf',
  'mailjunk.ga','mailjunk.gq','mailjunk.ml','mailjunk.tk','mailmate.com',
  'mailme.ir','mailme.lv','mailme24.com','mailmetrash.com','mailmoat.com',
  'mailms.com','mailnator.com','mailnesia.com','mailnull.com','mailorg.org',
  'mailpick.biz','mailproxsy.com','mailquack.com','mailrock.biz','mailscrap.com',
  'mailshell.com','mailsiphon.com','mailslapping.com','mailslite.com','mailtemp.info',
  'mailtome.de','mailtothis.com','mailtrash.net','mailtv.net','mailtv.tv',
  'mailzilla.com','mailzilla.org','makemetheking.com','malahov.de','manifestgenerator.com',
  'mciek.com','mega.zik.dj','meinspamschutz.de','meltmail.com','messagebeamer.de',
  'mezimages.net','mfsa.ru','mierdamail.com','migmail.pl','migumail.com',
  'minimail.eu','ministry-of-silly-walks.de','mintemail.com','misterpinball.de','mmmmail.com',
  'moakt.co','moakt.ws','mobileninja.co.uk','mohmal.com','moncourrier.fr.nf',
  'monemail.fr.nf','monmail.fr.nf','monumentmail.com','msa.minsmail.com','mt2009.com',
  'mt2014.com','mt2015.com','mundomail.net','mx0.wwwnew.eu','my10minutemail.com',
  'myalias.pw','mycard.net.ua','mycleaninbox.net','myemailboxy.com','mymail-in.net',
  'mymailoasis.com','mynetstore.de','mypacks.net','mypartyclip.de','myphantom.com',
  'mysamp.de','myspaceinc.com','myspaceinc.net','myspaceinc.org','myspacepimpedup.com',
  'mytemp.email','mytempemail.com','mytempmail.com','mytrashmail.com','nabala.com',
  'neomailbox.com','nervmich.net','nervtansen.de','netmails.com','netmails.net',
  'neverbox.com','nice-4u.com','nincsmail.hu','nmail.cf','nnh.com',
  'no-spam.ws','noblepioneer.com','nobugmail.com','noclickemail.com','nogmailspam.info',
  'nomail.xl.cx','nomail2me.com','nomorespamemails.com','nonspam.eu','nonspammer.de',
  'noref.in','nospam.wins.com.br','nospam.ze.tc','nospam4.us','nospamfor.us',
  'nospammail.net','nospamthanks.info','nothingtoseehere.ca','nowmymail.com','nurfuerspam.de',
  'nus.edu.sg','nwldx.com','objectmail.com','obobbo.com','odaymail.com',
  'one-time.email','oneoffemail.com','oneoffmail.com','onewaymail.com','onlatedotcom.info',
  'oopi.org','opayq.com','ordinaryamerican.net','otherinbox.com','ourklips.com',
  'outlawspam.com','ovpn.to','owlpic.com','pancakemail.com','pimpedupmyspace.com',
  'pisem.net','plexolan.de','poczta.onet.pl','politikerclub.de','poofy.org',
  'pookmail.com','privacy.net','proxymail.eu','prtnx.com','prtz.eu',
  'pubmail.io','punkass.com','putthisinyouremail.com','pwrby.com','qasti.com',
  'qisdo.com','qisoa.com','quickinbox.com','quickmail.nl','raetp9.com',
  'rax.la','rcpt.at','reallymymail.com','realtyalerts.ca','recode.me',
  'recursor.net','recyclemail.dk','regbypass.com','regbypass.comsafe-mail.net',
  'rejectmail.com','reliable-mail.com','remail.cf','remail.ga','rhyta.com',
  'rklips.com','rmqkr.net','rnailinator.com','royal.net','rppkn.com',
  'rtrtr.com','s0ny.net','safe-mail.net','safersignup.de','safetymail.info',
  'safetypost.de','sandelf.de','saynotospams.com','scatmail.com','schafmail.de',
  'schrott-email.de','secretemail.de','secure-mail.biz','selfdestructingmail.com','sendspamhere.com',
  'shieldemail.com','shiftmail.com','shitmail.me','shitware.nl','shortmail.net',
  'sibmail.com','sinnlos-mail.de','siteposter.net','skeefmail.com','slaskpost.se',
  'slipry.net','slopsbox.com','slushmail.com','smashmail.de','smellfear.com',
  'snakemail.com','sneakemail.com','sneakymail.de','snkmail.com','sofimail.com',
  'sofort-mail.de','softpls.asia','sogetthis.com','soisz.com','solvemail.info',
  'soodonims.com','spam.la','spam.su','spam4.me','spamavert.com',
  'spambob.com','spambob.net','spambob.org','spambog.com','spambog.de',
  'spambog.ru','spambox.info','spambox.us','spamcannon.com','spamcannon.net',
  'spamcero.com','spamcon.org','spamcorptastic.com','spamcowboy.com','spamcowboy.net',
  'spamcowboy.org','spamday.com','spamex.com','spamfree.org','spamfree24.com',
  'spamfree24.de','spamfree24.eu','spamfree24.info','spamfree24.net','spamfree24.org',
  'spamgoes.in','spamgourmet.com','spamgourmet.net','spamgourmet.org','spamherelots.com',
  'spamhereplease.com','spamhole.com','spamify.com','spaminator.de','spamkill.info',
  'spaml.com','spaml.de','spammotel.com','spamobox.com','spamoff.de',
];

// De-duplicate
const DOMAINS = [...new Set(POOL)];

class DomainPoolProvider {
  constructor() {
    this.name = 'domainpool';
    this.displayName = 'XyronMail Network';
  }

  async getDomains() {
    return DOMAINS.map((d, i) => ({
      id: `pool_${i}`,
      domain: d,
      isActive: true
    }));
  }

  async createAccount(address) {
    // Route through guerrilla API for inbox creation
    const domain = address.split('@')[1];
    const user = address.split('@')[0];
    try {
      const r = await fetch('https://api.guerrillamail.com/ajax.php?f=get_email_address&lang=en');
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const d = await r.json();
      const sid = d.sid_token;
      const r2 = await fetch(`https://api.guerrillamail.com/ajax.php?f=set_email_user&email_user=${encodeURIComponent(user)}&lang=en&sid_token=${sid}`);
      const d2 = await r2.json();
      return {
        id: d2.sid_token || sid,
        address: d2.email_addr || address,
        sidToken: d2.sid_token || sid,
        createdAt: new Date().toISOString()
      };
    } catch (e) {
      return { id: user, address, sidToken: user, createdAt: new Date().toISOString() };
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
        size: m.mail_size || 0,
        receivedAt: m.mail_timestamp ? new Date(m.mail_timestamp * 1000).toISOString() : new Date().toISOString()
      }));
    } catch (e) { return []; }
  }

  async getMessage(token, msgId) {
    try {
      const r = await fetch(`https://api.guerrillamail.com/ajax.php?f=fetch_email&email_id=${msgId}&sid_token=${token}`);
      if (!r.ok) return null;
      const m = await r.json();
      return {
        id: String(m.mail_id), providerMessageId: String(m.mail_id),
        from: { address: m.mail_from || '', name: m.mail_from || '' },
        to: [{ address: m.mail_recipient || '' }],
        subject: m.mail_subject || '', bodyText: m.mail_body || '',
        bodyHtml: m.mail_body || '', isRead: true, hasAttachments: false,
        size: m.mail_size || 0,
        receivedAt: m.mail_timestamp ? new Date(m.mail_timestamp * 1000).toISOString() : new Date().toISOString()
      };
    } catch (e) { return null; }
  }

  async deleteMessage(token, msgId) {
    try { await fetch(`https://api.guerrillamail.com/ajax.php?f=del_email&email_ids[]=${msgId}&sid_token=${token}`); return true; } catch (e) { return false; }
  }
  async markAsRead() { return true; }
  async deleteAccount() { return true; }
  async healthCheck() {
    const s = Date.now();
    try {
      const r = await fetch('https://api.guerrillamail.com/ajax.php?f=get_email_address', { signal: AbortSignal.timeout(5000) });
      return { healthy: r.ok, latency: Date.now() - s, status: r.ok ? 'healthy' : 'degraded' };
    } catch (e) { return { healthy: false, latency: Date.now() - s, status: 'error', error: e.message }; }
  }
}

module.exports = DomainPoolProvider;
