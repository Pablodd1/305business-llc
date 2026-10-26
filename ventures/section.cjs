#!/usr/bin/env node
/* Emits the homepage VENTURES section HTML (6 featured, with schematic art) for insertion into index.html */
global.window = {};
eval(require('fs').readFileSync(__dirname + '/data.js', 'utf8'));
eval(require('fs').readFileSync(__dirname + '/art.js', 'utf8'));
const V = global.window.VENTURES, A = global.window.VENTURE_ART;
const fmt = n => '$' + n.toLocaleString('en-US');
const SC = {'LIVE':'#00FF88','PRODUCTION':'#00FF88','FUNCTIONAL':'#ffffff','PILOT':'#FFC107','IN DEVELOPMENT':'#00D4FF','R&D':'#d98ae8','PROTOTYPE':'#FF006E','AVAILABLE':'#7db8ff'};
const picks = V.filter(v=>v.featured).concat(V.filter(v=>!v.featured)).slice(0,6);
const card = v => { const c = SC[v.status]||'#fff'; return `
                <a href="/ventures/${v.slug}.html" class="tech-card block">
                    <div class="art-sm">${A[v.slug]||''}</div>
                    <div class="p-5">
                        <div class="flex justify-between items-center mb-3 gap-2">
                            <span class="tech-label">${v.industry.toUpperCase()}</span>
                            <span class="vstatus-home" style="color:${c};border-color:${c}55;background:${c}12">${v.status}</span>
                        </div>
                        <h3 class="text-white font-bold">${v.name}</h3>
                        <div class="text-[#00D4FF] text-xs font-semibold mt-1">${v.tagline}</div>
                        <div class="border-t border-dashed border-white/20 mt-4 pt-3 flex justify-between items-center">
                            <span class="mono text-white font-bold">${fmt(v.price)}</span>
                            <span class="tech-label" style="font-size:9px">OR ${fmt(v.monthly)}/MO × 18 · MAINTENANCE INCL.</span>
                        </div>
                    </div>
                </a>`; };
console.log(`    <!-- Venture Portfolio Section -->
    <section id="ventures" class="py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <div class="tech-label mb-3">SHEET: V-1 · SCALE 1:1</div>
                <h2 class="text-3xl font-bold text-white">VENTURE PORTFOLIO</h2>
                <p class="text-white/60 mt-3 max-w-2xl mx-auto">Companies we built — available for one-time acquisition. Healthcare AI, sports science, computer vision, intelligent commerce. Every stage labeled honestly, every offer reviewed.</p>
            </div>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">${picks.map(card).join('')}
            </div>
            <div class="text-center mt-10">
                <a href="/ventures/" class="schematic-btn px-8 py-3 inline-flex"><span class="relative z-10">VIEW ALL ${V.length} VENTURES →</span></a>
            </div>
        </div>
    </section>

    <div class="section-divider"></div>`);
