const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'domainpool.js');
let content = fs.readFileSync(filePath, 'utf8');

const newDomainsStr = `
// Guerrilla Mail Network
guerrillamail.com, guerrillamail.de, guerrillamail.net, guerrillamail.org, guerrillamail.info, guerrillamail.biz,
guerrillamailblock.com, sharklasers.com, grr.la, pokemail.net, spam4.me,

// 1secmail Network  
1secmail.com, 1secmail.org, 1secmail.net, wwjmp.com, esiix.com, xojxe.com, yoggm.com, bheps.com, dcctb.com, kzccv.com, qiott.com, wuuvo.com, icznn.com, ezztt.com, dpptd.com, nqmow.com, nbmbb.com, clrmail.com, emlpro.com, emltmp.com,

// YopMail Network
yopmail.com, yopmail.fr, yopmail.net, cool.fr.nf, jetable.fr.nf, nospam.ze.tc, nomail.xl.cx, mega.zik.dj, speed.1s.fr, courriel.fr.nf, moncourrier.com, monemail.fr.nf, monmail.fr.nf, temporaire.fr, nomail.cf, nopmail.fr,

// TempMail.org Network (hundreds of partner domains)
temp-mail.org, temp-mail.io, temp-mail.de, temp-mail.ru, tempmail.net, tempmail.org, tempmail.com, tempmail.eu, tempmail.pp.ua,
tmailinator.com, tmpmail.net, tmpmail.org, tempr.email, tempm.com, tempemail.com, tempemail.net, tempemail.biz, tempinbox.com, tempinbox.co.uk,
tempmailo.com, tempmailer.com, tempmailer.de, tempmailfo.com, tempmail2.com, tempmaildemo.com, tempail.com,
tempthe.net, tempymail.com, tempalias.com, tempe4mail.com, tempemail.co.za,
temporarily.de, temporarioemail.com.br, temporaryemail.net, temporaryemail.us, temporaryforwarding.com,
temporaryinbox.com, temporarymailaddress.com, temporaryemail.eu, temporarymailaddress.com,

// Mailinator Network
mailinator.com, suremail.info, mailinator2.com, sogetthis.com, spamhereplease.com, spamherelots.com, sendspamhere.com, inoutmail.com, inoutmail.de, inoutmail.eu, inoutmail.info, safetymail.info, mailinater.com, mailinate.com,

// TrashMail Network
trashmail.com, trashmail.at, trashmail.de, trashmail.me, trashmail.net, trashmail.org, trashmail.io, trashmail.ws, trashmailer.com, trashymail.com, trashymail.net, trash-mail.at, trash-mail.com, trash-mail.de, trash-me.com, trashdevil.com, trashdevil.de,

// DisCard / Dispostable
discard.email, discardmail.com, discardmail.de, dispostable.com, dispose.it,

// Mailnesia
mailnesia.com,

// MailDrop
maildrop.cc,

// Spamgourmet
spamgourmet.com, spamgourmet.net, spamgourmet.org,

// Harakirimail
harakirimail.com,

// GetNada
getnada.com,

// AnonBox
anonbox.net,

// Throwam
throwam.com,

// MinuteMail
minutemailbox.com, mintemail.com,

// MohMal
mohmal.com, mohmal.im,

// BurnerMail
burnermail.io,

// Spam4.me etc
spam4.me, spam.la, spam4me.com,

// Fake inbox services
fakeinbox.com, fakemail.net, fakeinbox.net, fakemailgenerator.com, fakemailgenerator.net,
fakedemail.com, fakedomain.net, fakeemailsite.com,

// Throwaway/Disposable networks
throwaway.email, throwawayemail.net, throwawaymail.com, throwawaymail.net,
disposableaddress.com, disposable.email, disposableemail.com, disposableemail.net, disposablemails.com,
disposableinbox.com, disposablemail.org, disposableaddress.net,

// MailNull
mailnull.com,

// Spam/AntiSpam services  
nospam.ze.tc, nospamfor.us, nospam4.us, anti-spam.org, no-spam.ws, notsharingmy.info, notmailinator.com,

// Various known temp mail domains
getairmail.com, airmail.cc, yandex.com domains,
getonemail.com, getonemail.net, getonemail.com,
mailforspam.com, mail-filter.com,
cloakmail.com, cloak.me,
email60.com, 60minutemail.com,
tenminutemail.com, 10minutemail.com, 10minutemail.net, 10minutemail.org, 10minutemail.cf,
10minutemail.de, 10minutemail.co.uk, 10minutemail.pro, 10minutemail.be, 10minutemail.nl,
10minutemail.eu, 10minutemail.info, 10minutemail.us,
20minutemail.com, 20minutemail.it,
5minutemail.com, minutemail.com, minutemailbox.com,
bouncemail.de, bouncr.com,
correo.blogos.net, correomail.com,
dataflowsystems.com, dayrep.com,
deagel.com, deadaddress.com, deadletter.ga,
doublemail.de,
email60.com, emailage.cf, emailage.ga, emailage.gq, emailage.ml, emailage.tk,
emailalia.com, emailazing.com, emailcorner.net, emailengine.net, emailengine.org,
emailer.eu.org, emailfowarding.com, emailgoal.com, emailias.com, emailigo.com,
emailinfive.com, emailisvalid.com, emailjunk.com,
emaill.com, emailnax.com, emailo.pro, emailondeck.com, emailover.net,
emailproxsy.com, emailresort.com, emailsensei.com, emailsingularity.net,
emailsio.com, emailsy.info, emailtea.com, emailtech.info, emailtemporanea.com,
emailtemporario.com.br, emailthe.net, emailtmp.com, emailto.de, emailtrash.net,
emailure.net, emailwarden.com, emailwarden.org, emailx.at.hm, emailxfer.com,
emailxxx.com, emailz.cf, emailz.ga, emailz.gq, emailz.ml,

// European disposable email domains
spamfree24.com, spamfree24.de, spamfree24.eu, spamfree24.info, spamfree24.net, spamfree24.org,
spamoff.de, spamspot.com, spamstack.net, spamthis.co.uk,
spamfighter.cf, spamfighter.ga, spamfighter.gq, spamfighter.ml, spamfighter.tk,
spamcannon.com, spamcannon.net, spamcero.com, spamcon.org,
spambob.com, spambob.net, spambob.org, spambog.com, spambog.de, spambog.ru,
spambox.info, spambox.us, spamday.com,
wegwerfmail.de, wegwerfmail.net, wegwerfmail.org, wegwerfmail.info,
wegwerf-email-addressen.de, wegwerf-emails.de, wegwerfadresse.de, wegwerfemail.com, wegwerfemail.de,
zehnminuten.de, zehnminutenmail.de, sofort-mail.de, spam.la, netvillag.com,

// Russian/Eastern European
mail.ru-aliases, mailddone.com, maileimer.de, mailexpire.com, mailfreeonline.com,
mailguard.de, mailhazard.com, mailhazard.us, mailimate.com, mailinblack.com,
mailincubator.com, mailing.one,
mailismagic.com, mailme.gq, mailme.ir, mailme24.com, mailmetrash.com,
mailmixx.com, mailmoat.com, mailms.com, mailna.co, mailna.me,
mailnew.com, mailnull.com, mailorg.org, mailover.net,

// More diverse domains
privacy.net, privalo.com, privy-mail.com, privy-mail.de,
proxymail.eu, putthisinyouremail.com, quickinbox.com,
rcpt.at, reallymymail.com, recode.me,
rhyta.com, rklips.com, rmqkr.net, rtrtr.com,
safe-mail.net, safersignup.de, sandelf.de, saynotospams.com,
sezet.com, shieldedmail.com, shiftmail.com, skeefmail.com,
slopsbox.com, smashmail.de, soodonims.com,
stop-my-spam.cf, stop-my-spam.com, stop-my-spam.ga, stop-my-spam.ml, stop-my-spam.tk,
streetwise.net, stuffmail.de, supergreatmail.com, supermailer.jp,
tempinbox.com, trbvm.com, trbvn.com, trialmail.de, trickmail.net,
turual.com, tyldd.com,
umail.net, venompen.com,
webemail.me, webm4il.info,
xagloo.com, xemaps.com, xents.com,
yapped.net, yeah.net, yep.it,
zippymail.info, zoaxe.com, zoemail.org,

// TempMail clone domains (hundreds from temp-mail.org network)
aligamel.com, altmails.com, anonymail.es, anonymized.org, anonymouse.org,
antichef.com, antichef.net, antireg.com, antireg.ru,
antispam.de, antispam24.de, antispam4.me, antispammail.de,
armyspy.com, artmanmail.com, asfdasd.com,
astartimes.com, atmc.net, aver.com,
awsoo.com, azcomputerworks.com,
bagong.info, baldbin.com, bareed.ws, bartmax.com,
baxomale.hk.to, beddly.com, beefmilk.com,
benipaula.org, bidourlnks.com, big1.us, bigprofitsguy.com,
bisectd.com, bladesmail.net, blaze.ws, blinks.com,
bluedumpling.com, boofx.com, bootmail.com, bootroo.com,
botmail.com, bqueen.pl, brasx.org,
brickpower.net, brulia.com, bspamfree.org, buccalmassage.ru,
buckfake.com, bum.net, bundes-li.ga, butterfliesandbutterflies.com,
cactus.live, camera.csh.ac.uk, canaglie.net, cat.pp.ua, cavseemail.com,
ccmail.de, cd.mintemail.com, cf.mintemail.com, cfo.net,
change.com, chef.net, chemist.com, chewieokies.com,
chimpandapeaceful.com, chogmail.com, chopstix.me, chudmail.ru,
cinchr.com, ckamail.com, cleanmail.com, clenbuterol4sale.com,
clients.is, clixser.com, cmail.com, cmail.net,
cnmeonline.com, cocovpn.com, coieo.com, coldmail.ru,
collect.us, comeonthis.com, comwest.com,
coolimpool.com, correios.es, courriel.fr.nf, covfefe.us,
cqzg.com, crapmail.org, crazespaces.com, crazymailing.com,
criminalattorney.com, crusthost.com, cubiclink.com,
cuirushi.com, cutout.club, cutradition.com,
cwtblpkwziuu.com, cyber-phone.eu, cybersout.com,
cybertracker.net, czqjii8.com
`;

// extract domains and format them as an array of strings
const parsedDomains = newDomainsStr.split(/[,\n]/)
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('//') && s !== 'yandex.com domains' && s !== 'mail.ru-aliases');

if (newDomainsStr.includes('yandex.com domains')) parsedDomains.push('yandex.com');
if (newDomainsStr.includes('mail.ru-aliases')) parsedDomains.push('mail.ru');

const newDomainsFormatted = parsedDomains.map(d => "  '" + d + "',").join('\\n');

// inject into the POOL array before "];"
const match = content.match(/\r?\n\];\r?\n\r?\n\/\/ De-duplicate/);
if (!match) {
  console.error("Could not find the split marker in domainpool.js");
  process.exit(1);
}

const splitIndex = match.index;
const newContent = content.substring(0, splitIndex) + '\n  // === New Real Domains Added ===\n' + newDomainsFormatted + match[0] + content.substring(splitIndex + match[0].length);


fs.writeFileSync(filePath, newContent);
console.log('Successfully updated domainpool.js with ' + parsedDomains.length + ' new domains.');
