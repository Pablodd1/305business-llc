/* Schematic blueprint artwork for each venture — bold line-art, minimal labels, safe zones.
   Card strips crop vertically (~y<45 and y>255 hidden at 165px) — keep subjects y 70-240, titles y 48. */
(function(){
const W='rgba(255,255,255,0.85)', C='#00D4FF', F='rgba(255,255,255,0.35)', G='rgba(255,255,255,0.12)';
const P =(d,e='')=>`<path d="${d}" fill="none" stroke="${W}" stroke-width="1.6" ${e}/>`;
const PC=(d,e='')=>`<path d="${d}" fill="none" stroke="${C}" stroke-width="1.6" ${e}/>`;
const PD=(d,e='')=>`<path d="${d}" fill="none" stroke="${F}" stroke-width="1" stroke-dasharray="4 3" ${e}/>`;
const L =(x1,y1,x2,y2,e='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${W}" stroke-width="1.6" ${e}/>`;
const LC=(x1,y1,x2,y2,e='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${C}" stroke-width="1.6" ${e}/>`;
const CIR=(cx,cy,r,e='')=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${W}" stroke-width="1.6" ${e}/>`;
const CC=(cx,cy,r,e='')=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C}" stroke-width="1.6" ${e}/>`;
const DOT=(cx,cy,r=3,e='')=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C}" ${e}/>`;
const T =(x,y,t,fill=W,size=9,anchor='start')=>`<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" font-family="JetBrains Mono, monospace" letter-spacing="1.5" text-anchor="${anchor}">${t}</text>`;
const R =(x,y,w,h,e='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${W}" stroke-width="1.6" ${e}/>`;
const RC=(x,y,w,h,e='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${C}" stroke-width="1.6" ${e}/>`;
const RR=(x,y,w,h,rx,e='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="none" stroke="${W}" stroke-width="1.6" ${e}/>`;

let __uid=0;
const FIG=(label,inner)=>{const u=++__uid,A='__ACC__';return `<svg viewBox="0 0 480 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
<defs>
<linearGradient id="bg${u}" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0" stop-color="#0d1233"/><stop offset="0.55" stop-color="#080b1e"/><stop offset="1" stop-color="#04060d"/></linearGradient>
<radialGradient id="gl${u}" cx="0.5" cy="0.4" r="0.75"><stop offset="0" stop-color="${A}" stop-opacity="0.32"/><stop offset="0.6" stop-color="${A}" stop-opacity="0.08"/><stop offset="1" stop-color="${A}" stop-opacity="0"/></radialGradient>
<linearGradient id="fl${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${A}" stop-opacity="0.22"/><stop offset="1" stop-color="${A}" stop-opacity="0"/></linearGradient>
<radialGradient id="vg${u}" cx="0.5" cy="0.45" r="0.85"><stop offset="0.62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.42"/></radialGradient>
<pattern id="sc${u}" width="4" height="3" patternUnits="userSpaceOnUse"><rect width="4" height="1" fill="#ffffff" opacity="0.035"/></pattern>
<filter id="bl${u}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="7"/></filter>
</defs>
<rect width="480" height="300" fill="url(#bg${u})"/>
<rect width="480" height="300" fill="url(#gl${u})"/>
<g stroke="rgba(255,255,255,0.05)" stroke-width="1">
<line x1="0" y1="216" x2="480" y2="216"/><line x1="0" y1="234" x2="480" y2="234"/><line x1="0" y1="258" x2="480" y2="258"/><line x1="0" y1="288" x2="480" y2="288"/>
<line x1="240" y1="216" x2="240" y2="300"/><line x1="180" y1="216" x2="60" y2="300"/><line x1="300" y1="216" x2="420" y2="300"/><line x1="120" y1="216" x2="-120" y2="300"/><line x1="360" y1="216" x2="600" y2="300"/>
</g>
<rect x="0" y="216" width="480" height="84" fill="url(#fl${u})"/>
<rect width="480" height="300" fill="url(#sc${u})"/>
<rect x="10" y="10" width="460" height="280" fill="none" stroke="rgba(255,255,255,0.10)"/>
${P('M10 30 H30 M10 30 V10 M470 270 H450 M470 270 V290').replace('stroke-width="1.6"','stroke-width="1"')}
<rect x="20" y="36" width="4" height="12" fill="${A}"/>
${T(30,46,label,'rgba(255,255,255,0.55)',9)}
${T(452,282,'FIG. 1',A,9,'end')}
<ellipse cx="240" cy="238" rx="180" ry="24" fill="${A}" opacity="0.15" filter="url(#bl${u})"/>
${inner}
<rect width="480" height="300" fill="url(#vg${u})"/>
</svg>`;};

const runner=(x,y,sc=1,col=W)=>{const s=sc;return `<g stroke="${col}" stroke-width="1.6" fill="none">
${CIR(x,y,14*s)}${L(x,y+14*s,x-4*s,y+62*s)}${L(x-4*s,y+30*s,x-34*s,y+48*s)}${L(x-4*s,y+30*s,x+30*s,y+40*s)}
${L(x-4*s,y+62*s,x-30*s,y+108*s)}${L(x-30*s,y+108*s,x-44*s,y+138*s)}${L(x-4*s,y+62*s,x+32*s,y+96*s)}${L(x+32*s,y+96*s,x+48*s,y+126*s)}</g>`};

window.VENTURE_ART={
'revenue-cycle-intelligence':FIG('REVENUE CYCLE',
 R(70,160,30,60)+R(115,130,30,90)+R(160,100,30,120)+
 PC('M50,205 L210,205 L230,165 L250,235 L270,125 L290,205 L430,205')+
 DOT(270,125,5)+T(286,118,'$',C,13)),

'rpm-platform':FIG('RPM / VITALS',
 P('M240,220 C240,220 178,176 178,128 C178,100 200,82 221,82 C237,82 240,98 240,108 C240,98 243,82 259,82 C280,82 302,100 302,128 C302,176 240,220 240,220 Z')+
 PC('M55,150 H160 L176,122 L192,170 L208,108 L224,150 L425,150')+
 PC('M370,88 A26,26 0 0 1 396,62 M382,100 A14,14 0 0 1 396,86')+
 DOT(396,62,3)),

'ai-voice-layer':FIG('VOICE LAYER',
 R(140,150,14,30)+R(164,130,14,70)+R(188,107,14,115)+R(212,90,14,150)+R(236,107,14,115)+R(260,130,14,70)+R(284,150,14,30)+
 PC('M322,96 a50,50 0 0 1 0,98')+PC('M384,96 a50,50 0 0 0 0,98')+
 RR(340,100,26,52,13)+L(353,152,353,176)+P('M341,176 H365')+
 RR(396,92,58,44,8)+DOT(408,114,3)+DOT(420,114,3)+DOT(432,114,3)+
 T(150,262,'EN / ES',C,9)+PD('M120,256 H240')),

'rtm-platform':FIG('JOINT RANGE MONITOR',
 P('M190,60 L240,150 L295,240')+CIR(240,150,11)+DOT(240,150,3)+
 PC('M292,132 A52,52 0 0 1 312,200')+PD('M262,124 A34,34 0 0 1 272,160')+
 T(330,158,'ROM',F,9)+T(330,174,'0-135°',C,9)),

'clinical-movement-intelligence':FIG('MOTION CAPTURE',
 runner(240,85,1)+
 PD('M150,248 H370')+
 PC('M262,120 A22,22 0 0 1 270,150')+T(292,138,'38°',C,9)+
 PD('M150,60 H200 M150,60 V110 M370,240 H320 M370,240 V190')),

'dental-ehr':FIG('DENTAL RECORD',
 P('M212,100 C190,100 180,120 186,146 C192,176 202,200 212,226 C217,240 228,240 231,225 C235,205 241,205 245,225 C248,240 259,240 264,226 C274,200 284,176 290,146 C296,120 286,100 264,100 C252,100 246,111 238,111 C230,111 224,100 212,100 Z')+
 PC('M204,155 H226 L234,136 L242,168 L250,148 H272')+
 R(340,90,100,150)+L(340,110,440,110)+
 L(354,132,426,132)+L(354,150,410,150)+L(354,168,422,168)+L(354,186,398,186)+
 RC(354,206,12,12)+L(357,212,361,216)+L(361,216,367,207)),

'hotel-rate-intelligence':FIG('RATE INTELLIGENCE',
 R(140,80,140,175)+
 R(158,100,24,20)+R(202,100,24,20)+R(246,100,24,20)+
 R(158,140,24,20)+R(202,140,24,20)+R(246,140,24,20)+
 R(158,180,24,20)+R(202,180,24,20)+R(246,180,24,20)+
 R(196,215,28,40)+
 PC('M320,220 L420,120')+PC('M408,124 L420,120 L418,132')+
 PC('M330,96 L358,70 L400,70 L400,112 L358,112 Z')+DOT(384,91,4)+T(364,97,'$',W,11)),

'room-defect-intelligence':FIG('DEFECT DETECTION',
 R(80,70,230,165)+L(175,70,175,155)+L(175,155,80,155)+
 PC('M205,95 l14,16 l-8,14 l16,18 l-6,16 l14,12')+
 CC(228,155,40)+LC(258,185,300,234)+
 T(330,110,'CRACK',F,9)+T(330,126,'+94%',C,10)),

'three-d-spatial-intelligence':FIG('3D RECONSTRUCTION',
 R(160,120,105,100)+R(212,88,105,100)+L(160,120,212,88)+L(265,120,317,88)+L(265,220,317,188)+
 PD('M60,155 H420')+LC(60,155,76,155)+LC(404,155,420,155)+
 DOT(115,95,2.5)+DOT(135,215,2.5)+DOT(370,105,2.5)+DOT(355,225,2.5)+DOT(100,175,2.5)),

'overlay-hd':FIG('OVERLAY HD',
 P('M120,95 H142 M120,95 V117 M360,95 H338 M360,95 V117 M120,215 H142 M120,215 V193 M360,215 H338 M360,215 V193')+
 CC(240,155,50)+LC(240,95,240,115)+LC(240,195,240,215)+LC(180,155,200,155)+LC(280,155,300,155)+
 RC(155,105,60,44)+T(158,150,'0.42m',C,8)+
 RC(285,175,55,36)+T(288,228,'1.07m',C,8)),

'ai-voice-receptionist':FIG('VOICE RECEPTIONIST',
 CIR(165,150,38)+P('M127,141 A38,38 0 0 1 203,141')+
 PC('M203,152 Q222,160 216,180')+DOT(214,182,3)+
 PC('M224,140 A26,26 0 0 1 224,192 M240,126 A44,44 0 0 1 240,206')+
 R(330,130,11,44)+R(348,112,11,80)+R(366,96,11,112)+R(384,124,11,56)),

'ai-chatbots':FIG('CHAT AGENTS',
 RR(70,75,210,80,16)+P('M105,155 L105,182 L138,155')+
 DOT(120,116,4)+DOT(145,116,4)+DOT(170,116,4)+
 RR(265,170,165,72,16)+P('M395,242 L395,268 L364,242')+
 L(285,196,410,196)+L(285,214,382,214)),

'ai-market-intelligence':FIG('MARKET SIGNALS',
 L(135,85,135,225)+L(135,225,395,225)+
 R(165,145,16,40)+L(173,133,173,193)+
 R(205,120,16,60)+L(213,108,213,190)+
 RC(245,155,16,32)+L(253,145,253,199)+
 R(285,100,16,80)+L(293,88,293,192)+
 PD('M340,120 A35,35 0 1 1 340,190')+LC(318,155,362,155)+LC(340,133,340,177)+
 DOT(293,88,3)),

'intelligent-crm':FIG('CRM GRAPH',
 CIR(130,115,24)+P('M106,188 A24,24 0 0 1 154,188')+
 CIR(350,115,24)+P('M326,188 A24,24 0 0 1 374,188')+
 CIR(240,205,24)+P('M216,278 A24,24 0 0 1 264,278')+
 L(150,128,330,128)+L(142,138,226,190)+L(358,138,246,190)+
 DOT(240,155,4)),

'website-factory':FIG('SITE FACTORY',
 L(60,255,420,255)+
 R(75,140,100,80)+L(75,158,175,158)+DOT(87,149,2.5)+DOT(99,149,2.5)+L(88,178,162,178)+L(88,194,148,194)+
 R(195,120,100,80)+L(195,138,295,138)+DOT(207,129,2.5)+DOT(219,129,2.5)+L(208,158,282,158)+L(208,174,268,174)+
 R(315,100,100,80)+L(315,118,415,118)+DOT(327,109,2.5)+DOT(339,109,2.5)+L(328,138,402,138)+L(328,154,388,154)+
 CC(240,55,14)+P('M240,37 v8 M240,65 v8 M222,55 h8 M250,55 h8 M227,42 l6,6 M247,62 l6,6 M253,42 l-6,6 M233,62 l-6,6')),

'agentic-websites':FIG('AGENTIC SITE',
 R(115,70,250,165)+L(115,94,365,94)+DOT(129,82,2.5)+DOT(143,82,2.5)+DOT(157,82,2.5)+
 L(135,120,250,120)+L(135,140,220,140)+
 CC(305,150,24)+P('M305,120 v10 M305,180 v10 M275,150 h10 M325,150 h10 M284,129 l7,7 M319,164 l7,7 M326,129 l-7,7 M291,164 l-7,7')+
 PC('M180,190 L255,160 L240,182 L268,175')),

'seo-aeo-engine':FIG('SEO / AEO',
 R(105,190,28,48)+R(148,165,28,73)+R(191,138,28,100)+R(234,108,28,130)+
 CC(352,135,56)+LC(392,175,426,216)+T(338,142,'#1',C,17,'middle')+
 PC('M100,95 C170,55 260,50 330,70 M320,58 L330,70 L338,58')+DOT(330,70,3)),

'rapid-digital-launch':FIG('48H LAUNCH',
 P('M240,58 C270,90 276,142 260,190 L220,190 C204,142 210,90 240,58 Z')+
 CC(240,118,13)+
 P('M221,150 L196,204 L230,186 M259,150 L284,204 L250,186')+
 PC('M227,194 C222,212 231,224 225,242 M243,194 C248,212 239,224 245,242 M235,194 V246')+
 PD('M150,80 L118,80 M158,104 L126,104 M322,80 L354,80 M314,104 L346,104')),

'estatematch':FIG('PROPERTY MATCH',
 P('M165,140 L245,78 L325,140')+R(177,140,136,95)+R(238,180,26,55)+R(195,158,24,20)+R(272,158,24,20)+
 PC('M335,62 C335,62 318,49 318,38 C318,30 324,25 331,25 C336,25 339,30 341,33 C343,30 346,25 351,25 C358,25 364,30 364,38 C364,49 347,62 347,62 Z')+
 PC('M85,160 H125 M117,152 L125,160 L117,168 M405,160 H365 M373,152 L365,160 L373,168')),

'adaptive-marketplace':FIG('ADAPTIVE COMMERCE',
 LC(120,68,360,68)+DOT(222,68,5)+LC(120,88,360,88)+DOT(310,88,5)+
 P('M105,112 H375 L367,142 H113 Z')+P('M121,142 a10,10 0 0 0 20,0 M161,142 a10,10 0 0 0 20,0 M201,142 a10,10 0 0 0 20,0 M241,142 a10,10 0 0 0 20,0 M281,142 a10,10 0 0 0 20,0 M321,142 a10,10 0 0 0 20,0')+
 R(115,142,250,95)+R(135,162,65,42)+R(285,162,55,75)),

'pocketscribe':FIG('POCKET SCRIBE',
 RR(195,55,95,195,14)+R(210,75,65,140)+L(210,90,275,90)+DOT(242,65,2.5)+
 PC('M216,175 h10 l4,-10 l6,20 l5,-14 l4,4 h13')+
 PC('M300,125 A18,18 0 0 1 318,107 M300,145 A38,38 0 0 1 338,107')),

'jmm-jas-miami-method':FIG('JMM PROTOCOL',
 runner(160,75,0.9)+
 PC('M75,225 C105,225 105,200 135,200 C165,200 165,225 195,225 C225,225 225,200 255,200 C285,200 285,225 315,225')+
 T(335,216,'180 SPM',C,10)+
 PD('M75,248 H315')),

'runform-ai':FIG('GAIT ANALYSIS',
 runner(240,70,1)+PD('M130,212 H370')+
 LC(240,84,240,212)+DOT(240,212,3)+
 PC('M195,242 H285 M273,234 L285,242 L273,250')+PC('M265,222 H175 M187,214 L175,222 L187,230')),

'cycling-fit-intelligence':FIG('BIKE FIT',
 CIR(150,200,42)+CIR(340,200,42)+
 L(150,200,235,105)+L(235,105,200,200)+L(235,105,305,105)+L(305,105,340,200)+L(200,200,305,105)+
 L(200,200,206,170)+L(194,167,218,167)+
 CIR(252,200,12)+DOT(252,200,2.5)+
 PC('M240,150 L262,100 L302,106')+
 PC('M240,150 L264,174 L252,212')+
 CC(272,84,10)+PC('M266,94 L270,88')+
 DOT(252,212,3)+DOT(264,174,2.5)+
 PD('M252,158 A16,16 0 0 1 272,170')+T(282,158,'145°',C,8)+
 PD('M206,160 V105')+T(214,112,'+2cm','rgba(255,255,255,0.45)',8)),

'zero-g-simulation':FIG('5,000 AGENTS',
 CC(240,150,7)+DOT(240,150,3)+
 PD('M105,150 A135,80 0 1 1 375,150 A135,80 0 1 1 105,150')+
 PC('M240,150 L150,100 M240,150 L330,100 M240,150 L360,150 M240,150 L330,200 M240,150 L150,200 M240,150 L120,150 M240,150 L195,95 M240,150 L285,95 M240,150 L195,205 M240,150 L285,205')+
 [[150,100],[330,100],[360,150],[330,200],[150,200],[120,150],[195,95],[285,95],[195,205],[285,205]].map(p=>DOT(p[0],p[1],4)).join('')
)};

const ACCENT={
'zero-g-simulation':'#a78bfa','ai-voice-layer':'#22d3ee','hotel-rate-intelligence':'#fbbf24',
'jmm-jas-miami-method':'#f472b6','estatematch':'#34d399','pocketscribe':'#38bdf8',
'adaptive-marketplace':'#fb923c','overlay-hd':'#a3e635','runform-ai':'#f87171',
'clinical-movement-intelligence':'#2dd4bf','website-factory':'#818cf8','dental-ehr':'#67e8f9',
'room-defect-intelligence':'#fde047','rpm-platform':'#fb7185','three-d-spatial-intelligence':'#c084fc',
'ai-voice-receptionist':'#22d3ee','cycling-fit-intelligence':'#fdba74','rtm-platform':'#6ee7b7',
'intelligent-crm':'#60a5fa','agentic-websites':'#a78bfa','ai-chatbots':'#4ade80',
'ai-market-intelligence':'#fcd34d','revenue-cycle-intelligence':'#34d399','seo-aeo-engine':'#f9a8d4',
'rapid-digital-launch':'#fb923c'};
const RAW=window.VENTURE_ART; window.VENTURE_ART={};
for(const k in RAW){ window.VENTURE_ART[k]=RAW[k].split('__ACC__').join(ACCENT[k]||'#00D4FF'); }

})();
