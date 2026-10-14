#!/usr/bin/env node
/* Generates 24 static venture detail pages in the native 305business blueprint theme. */
const fs = require('fs');
global.window = {};
eval(fs.readFileSync(__dirname + '/data.js', 'utf8'));
eval(fs.readFileSync(__dirname + '/art.js', 'utf8'));
const V = global.window.VENTURES;
const A = global.window.VENTURE_ART;
const fmt = n => '$' + n.toLocaleString('en-US');
const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');

const NAV = `
    <nav class="blueprint-nav fixed top-0 left-0 right-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <a href="https://305business.llc" class="flex items-center gap-3">
                    <img src="https://305business.llc/305business-logo-transparent.png" alt="305business" class="h-8 w-auto">
                    <div><span class="font-bold text-lg text-white tracking-wider">305business</span><span class="tech-label ml-2">.LLC</span></div>
                </a>
                <div class="hidden md:flex items-center gap-4">
                    <a href="https://305business.llc/#market" class="tech-label hover:text-white/60 transition" data-i18n="nav_market">MARKET</a>
                    <a href="https://305business.llc/#search" class="tech-label hover:text-white/60 transition" data-i18n="nav_search">SEARCH</a>
                    <a href="https://305business.llc/#listings" class="tech-label hover:text-white/60 transition" data-i18n="nav_listings">LISTINGS</a>
                    <a href="https://305business.llc/#matching" class="tech-label hover:text-white/60 transition" data-i18n="nav_match">AI MATCH</a>
                    <a href="/ventures/" class="tech-label transition" style="color:#00D4FF">VENTURES</a>
                    <a href="https://305business.llc/#wealth-intelligence" class="tech-label hover:text-white/60 transition">WEALTH</a>
                    <a href="https://305business.llc/how-it-works.html" class="tech-label hover:text-white/60 transition" data-i18n="nav_process">HOW IT WORKS</a>
                    <a href="https://305business.llc/founders.html" class="tech-label hover:text-white/60 transition">FOUNDERS</a>
                    <div id="lang-toggle" style="margin-left:0.5rem;"></div>
                    <button onclick="window.location.href='https://305business.llc/list-business.html'" class="schematic-btn px-4 py-2" data-i18n="nav_list_business"><span class="relative z-10">+ LIST BUSINESS</span></button>
                    <div id="nav-auth" class="flex items-center gap-2 ml-2">
                        <a href="/login.html" class="text-white/80 hover:text-white transition text-sm font-medium">Log In</a>
                        <a href="/signup.html" class="bg-[#23d9b0] text-[#050249] px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-[#1bc9a0] transition">Get Started</a>
                    </div>
                    <div class="flex items-center gap-2 ml-2">
                        <a href="https://t.me/28729102e2163caa3555992f580e1013" target="_blank" class="text-white/60 hover:text-white transition" title="Telegram"><i class="fab fa-telegram text-lg"></i></a>
                        <a href="https://wa.me/17866432099" target="_blank" class="text-white/60 hover:text-white transition" title="WhatsApp"><i class="fab fa-whatsapp text-lg"></i></a>
                        <a href="https://instagram.com/305business" target="_blank" class="text-white/60 hover:text-white transition" title="Instagram"><i class="fab fa-instagram text-lg"></i></a>
                        <a href="https://facebook.com/305business" target="_blank" class="text-white/60 hover:text-white transition" title="Facebook"><i class="fab fa-facebook text-lg"></i></a>
                    </div>
                </div>
                <button class="md:hidden text-white p-2" onclick="toggleMobileMenu()"><i class="fas fa-bars text-xl"></i></button>
            </div>
        </div>
        <div id="mobileMenu" class="hidden md:hidden fixed inset-0 bg-[#0a1628]/95 z-50 pt-16">
            <div class="flex flex-col items-center gap-6 py-8">
                <a href="https://305business.llc/#market" class="text-white text-lg" onclick="toggleMobileMenu()">MARKET</a>
                <a href="https://305business.llc/#listings" class="text-white text-lg" onclick="toggleMobileMenu()">LISTINGS</a>
                <a href="/ventures/" class="text-lg" style="color:#00D4FF" onclick="toggleMobileMenu()">VENTURES</a>
                <a href="https://305business.llc/how-it-works.html" class="text-white text-lg" onclick="toggleMobileMenu()">HOW IT WORKS</a>
                <div id="lang-toggle-mobile" style="margin-top:0.5rem;"></div>
                <button onclick="window.location.href='https://305business.llc/list-business.html'" class="schematic-btn px-6 py-3"><span class="relative z-10">+ LIST BUSINESS</span></button>
            </div>
        </div>
    </nav>`;

const CSS = `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { font-family: 'Inter', sans-serif; background: #1a4a7a; color: #e0e0e0; min-height: 100vh; overflow-x: hidden; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        .blueprint-bg { background-color: #1a4a7a; background-image: linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px); background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px; background-attachment: fixed; }
        .tech-border { border: 2px solid rgba(255,255,255,0.4); position: relative; margin: 2px; }
        .tech-border::before, .tech-border::after { content: ''; position: absolute; width: 12px; height: 12px; border: 2px solid rgba(255,255,255,0.6); }
        .tech-border::before { top: -2px; left: -2px; border-right: none; border-bottom: none; }
        .tech-border::after { bottom: -2px; right: -2px; border-left: none; border-top: none; }
        .tech-card { background: rgba(255,255,255,0.03); border: 1.5px solid rgba(255,255,255,0.25); position: relative; transition: all 0.3s ease; }
        .tech-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 20%, rgba(255,255,255,0.5) 80%, transparent 100%); }
        .tech-card::after { content: ''; position: absolute; bottom: 8px; right: 8px; width: 20px; height: 20px; border-right: 1.5px solid rgba(255,255,255,0.2); border-bottom: 1.5px solid rgba(255,255,255,0.2); }
        .tech-card:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.35); transform: translateY(-2px); }
        .inset-view { border: 1.5px solid rgba(255,255,255,0.25); background: rgba(255,255,255,0.04); position: relative; }
        .inset-view::before { content: attr(data-view); position: absolute; top: -10px; left: 10px; background: #1a4a7a; padding: 0 5px; font-family: 'JetBrains Mono', monospace; font-size: 9px; color: rgba(255,255,255,0.6); letter-spacing: 0.1em; }
        .schematic-btn { background: transparent; border: 1.5px solid rgba(255,255,255,0.3); color: white; font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.05em; position: relative; overflow: hidden; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
        .schematic-btn::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: rgba(255,255,255,0.08); transition: left 0.3s; }
        .schematic-btn:hover::before { left: 0; }
        .tech-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.6); }
        .section-divider { height: 2px; background: repeating-linear-gradient(90deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 15px, transparent 15px, transparent 25px); margin: 40px 0; position: relative; }
        .title-block { border: 2px solid rgba(255,255,255,0.4); background: rgba(255,255,255,0.03); position: relative; }
        .title-block::after { content: ''; position: absolute; bottom: -2px; right: -2px; width: 180px; height: 70px; border: 2px solid rgba(255,255,255,0.4); border-bottom: none; border-right: none; background: rgba(255,255,255,0.02); }
        .blueprint-nav { background: rgba(26,74,122,0.95); border-bottom: 1.5px solid rgba(255,255,255,0.2); }
        .tech-input { background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.2); color: white; font-family: 'JetBrains Mono', monospace; }
        .tech-input:focus { outline: none; border-color: rgba(255,255,255,0.5); }
        .tech-input::placeholder { color: rgba(255,255,255,0.35); }
        .art-hero { border: 1.5px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.02); height: 260px; overflow: hidden; position: relative; }
        .art-hero svg { width: 100%; height: 100%; display: block; }
        .vstatus { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; padding: 3px 10px; border: 1px solid; border-radius: 999px; white-space: nowrap; text-transform: uppercase; }`;

const STATUS_COLOR = {
  'LIVE':'#00FF88','PRODUCTION':'#00FF88','FUNCTIONAL':'#ffffff','PILOT':'#FFC107',
  'IN DEVELOPMENT':'#00D4FF','R&D':'#d98ae8','PROTOTYPE':'#FF006E','AVAILABLE':'#7db8ff'
};
const sc = s => { const c = STATUS_COLOR[s] || '#fff';
  return `style="color:${c};border-color:${c}55;background:${c}12"`; };

function page(v, related) {
  const demoBtns = [
    v.links?.demo ? `<a href="${v.links.demo}" target="_blank" rel="noopener" class="schematic-btn px-5 py-2"><span class="relative z-10"><i class="fas fa-play mr-2"></i>LIVE DEMO</span></a>` : '',
    v.links?.website ? `<a href="${v.links.website}" target="_blank" rel="noopener" class="schematic-btn px-5 py-2"><span class="relative z-10"><i class="fas fa-globe mr-2"></i>WEBSITE</span></a>` : ''
  ].join('');
  const sup = v.support ? `Optional support: ${fmt(v.support)}/mo` : 'Support included';
  const rel = related.map(r => `
                <a class="tech-card p-5 block" href="/ventures/${r.slug}.html">
                    <div class="flex justify-between items-center mb-3 gap-2">
                        <span class="tech-label">${r.industry.toUpperCase()}</span>
                        <span class="vstatus" ${sc(r.status)}>${r.status}</span>
                    </div>
                    <h4 class="text-white font-bold">${r.name}</h4>
                    <div class="text-[#00D4FF] text-xs font-semibold mt-1">${r.tagline}</div>
                    <div class="mono text-lg font-bold text-white mt-3">${fmt(r.price)} <span class="tech-label">ONE-TIME</span></div>
                </a>`).join('');
  const ld = {
    "@context":"https://schema.org","@type":"SoftwareApplication",
    "name":v.name,"description":v.summary,"applicationCategory":"BusinessApplication","operatingSystem":"Web",
    "offers":{"@type":"Offer","price":v.price,"priceCurrency":"USD","availability":"https://schema.org/InStock","url":`https://305business.llc/ventures/${v.slug}.html`},
    "brand":{"@type":"Brand","name":v.name}
  };
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(v.name)} — ${esc(v.tagline)} | Acquisition: ${fmt(v.price)} | 305business</title>
    <meta name="description" content="${esc(v.summary.slice(0,155))}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="theme-color" content="#1a4a7a" />
    <link rel="canonical" href="https://305business.llc/ventures/${v.slug}.html" />
    <link rel="alternate" hreflang="en" href="https://305business.llc/ventures/${v.slug}.html" />
    <link rel="alternate" hreflang="es" href="https://305business.llc/ventures/${v.slug}.html" />
    <link rel="alternate" hreflang="ht" href="https://305business.llc/ventures/${v.slug}.html" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${esc(v.name)} — available for acquisition" />
    <meta property="og:description" content="${esc(v.tagline)}. One-time acquisition ${fmt(v.price)}. Stage: ${v.status}." />
    <meta property="og:image" content="https://305business.llc/305business-logo.png" />
    <meta property="og:url" content="https://305business.llc/ventures/${v.slug}.html" />
    <meta property="twitter:card" content="summary_large_image" />
    <script type="application/ld+json">${JSON.stringify(ld)}</script>
    <link rel="icon" type="image/png" href="https://305business.llc/305business-logo-transparent.png">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    <style>${CSS}</style>
</head>
<body class="blueprint-bg">
${NAV}

    <main class="pt-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div class="tech-label"><a href="https://305business.llc" class="hover:text-white/80">305BUSINESS</a> / <a href="/ventures/" class="hover:text-white/80">VENTURES</a> / <span style="color:#00D4FF">${v.slug.toUpperCase()}</span></div>
        </div>

        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <div class="grid lg:grid-cols-3 gap-8 items-start">
                <div class="lg:col-span-2">
                    <div class="title-block p-8 md:p-10">
                        <div class="grid md:grid-cols-5 gap-8 items-center">
                            <div class="md:col-span-3">
                        <div class="flex justify-between items-start gap-4 mb-6 flex-wrap">
                            <span class="tech-label">${v.industry.toUpperCase()}</span>
                            <span class="vstatus" ${sc(v.status)}>${v.status}</span>
                        </div>
                        <h1 class="text-3xl md:text-5xl font-extrabold text-white leading-none tracking-tight">${v.name.toUpperCase()}</h1>
                        <div class="text-[#00D4FF] text-lg font-semibold mt-4">${v.tagline}</div>
                        <p class="text-white/70 mt-6 leading-relaxed text-base md:text-lg">${v.summary}</p>
                        <div class="flex flex-wrap gap-3 mt-8">${demoBtns}</div>
                            </div>
                            <div class="md:col-span-2">
                                <div class="art-hero">${A[v.slug] || ''}</div>
                            </div>
                        </div>
                    </div>

                    <div class="section-divider"></div>

                    <div class="inset-view p-6 md:p-8" data-view="CAPABILITIES">
                        <h2 class="text-white text-xl font-bold mb-6">CAPABILITIES</h2>
                        <div class="grid sm:grid-cols-2 gap-3">
                            ${v.capabilities.map(c=>`<div class="tech-label border border-white/15 px-3 py-2.5" style="font-size:11px;color:#c9d8ea"><span style="color:#00D4FF">◆</span>&nbsp; ${c.toUpperCase()}</div>`).join('')}
                        </div>
                    </div>

                    <div class="section-divider"></div>

                    <div class="inset-view p-6 md:p-8" data-view="TARGET USERS">
                        <h2 class="text-white text-xl font-bold mb-4">WHO THIS IS FOR</h2>
                        <p class="text-white/70 leading-relaxed">${v.target}</p>
                    </div>
                </div>

                <aside class="lg:sticky lg:top-24">
                    <div class="tech-card p-6" id="offer">
                        <div class="tech-label">ONE-TIME ACQUISITION</div>
                        <div class="mono text-4xl font-bold text-white mt-2">${fmt(v.price)}</div>
                        <div class="text-white/60 text-sm mt-1 mb-6">${sup} · Open to offers</div>
                        <form onsubmit="return offerSubmit(event,'${v.slug}','${esc(v.name)}',${v.price})" class="flex flex-col gap-3">
                            <input required name="name" class="tech-input px-4 py-3 text-sm w-full" placeholder="YOUR NAME" />
                            <input required name="email" type="email" class="tech-input px-4 py-3 text-sm w-full" placeholder="EMAIL" />
                            <input required name="amount" type="number" min="1000" class="tech-input px-4 py-3 text-sm w-full" placeholder="YOUR OFFER (USD)" />
                            <textarea name="msg" rows="3" class="tech-input px-4 py-3 text-sm w-full" placeholder="NOTES (OPTIONAL)"></textarea>
                            <button type="submit" class="schematic-btn px-5 py-3 mt-1"><span class="relative z-10"><i class="fas fa-paper-plane mr-2"></i>SUBMIT OFFER</span></button>
                        </form>
                        <p class="tech-label mt-4 leading-relaxed" style="text-transform:none;letter-spacing:0.02em;font-size:10px">All offers confidential. Reviewed within 48 hours. Terms, code transfer and IP assignment negotiated per deal.</p>
                    </div>
                </aside>
            </div>
        </section>

        ${rel ? `
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div class="section-divider"></div>
            <h2 class="text-white text-2xl font-bold mb-8">RELATED VENTURES</h2>
            <div class="grid md:grid-cols-3 gap-6">${rel}
            </div>
        </section>` : ''}

        <footer class="border-t border-white/10 py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex flex-wrap justify-between gap-6 items-center">
                    <div class="tech-label">© 2026 305BUSINESS.LLC — MIAMI, FL</div>
                    <a href="/ventures/" class="tech-label hover:text-white/80 transition" style="color:#00D4FF">← ALL VENTURES</a>
                </div>
            </div>
        </footer>
    </main>

    <script src="/js/email-notify.js"></script>
    <script>
    function toggleMobileMenu(){ document.getElementById('mobileMenu').classList.toggle('hidden'); }
    async function offerSubmit(e, slug, name, listed){
        e.preventDefault();
        const f = e.target;
        const offerStr = '$' + Number(f.amount.value).toLocaleString('en-US');
        const payload = {
            business_name: name + ' (' + slug + ') — LISTED ' + '$' + listed.toLocaleString('en-US'),
            name: f.name.value, email: f.email.value, phone: '',
            message: 'ACQUISITION OFFER: ' + offerStr + '\\nNOTES: ' + (f.msg.value || '-')
        };
        if (window.EmailNotify && (window.SENDINBLUE_API_KEY || (EmailNotify.config && EmailNotify.config.API_KEY))) {
            const r = await EmailNotify.send('new_inquiry', payload, { subject: '💰 Acquisition Offer — ' + name + ' (' + offerStr + ')' });
            if (r && r.success) {
                f.innerHTML = '<p style="color:#00FF88;font-family:JetBrains Mono,monospace;font-size:13px;padding:16px 0" class="text-center"><i class="fas fa-check-circle mr-2"></i>OFFER RECEIVED — REVIEW WITHIN 48H</p>';
                return false;
            }
        }
        const body = 'Venture: ' + name + ' (' + slug + ')\\nListed: $' + listed.toLocaleString('en-US') + '\\nMy offer: ' + offerStr + '\\n\\nName: ' + f.name.value + '\\nEmail: ' + f.email.value + '\\nNotes: ' + (f.msg.value || '-');
        location.href = 'mailto:info@305business.llc?subject=' + encodeURIComponent('Acquisition Offer — ' + name) + '&body=' + encodeURIComponent(body);
        f.innerHTML = '<p style="color:#00FF88;font-family:JetBrains Mono,monospace;font-size:13px;padding:16px 0" class="text-center"><i class="fas fa-envelope mr-2"></i>DRAFT OPENED IN YOUR EMAIL APP</p>';
        return false;
    }
    </script>
    <script src="https://305business.llc/shared/language-toggle.js"></script>
    <script>LanguageToggle.init({ toggleContainerId: 'lang-toggle', basePath: '/shared/translations/' });</script>
</body>
</html>`;
}

let made = 0;
for (const v of V) {
  const related = V.filter(x => x.slug !== v.slug && (x.industry === v.industry || x.featured)).slice(0, 3);
  fs.writeFileSync(`${__dirname}/${v.slug}.html`, page(v, related));
  made++;
}
console.log('generated', made, 'venture pages (blueprint theme)');
