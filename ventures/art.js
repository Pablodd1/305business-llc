/* Schematic blueprint artwork for each venture — v3: richer scenes, depth layers, accent metrics.
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
const FL=(x,y,w,h,fill,op=1)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" opacity="${op}"/>`;

let __uid=0;
const FIG=(label,inner)=>{const u=++__uid,A='__ACC__';return `<svg viewBox="0 0 480 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
<defs>
<linearGradient id="bg${u}" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0" stop-color="#0d1233"/><stop offset="0.55" stop-color="#080b1e"/><stop offset="1" stop-color="#04060d"/></linearGradient>
<radialGradient id="gl${u}" cx="0.5" cy="0.4" r="0.75"><stop offset="0" stop-color="${A}" stop-opacity="0.36"/><stop offset="0.6" stop-color="${A}" stop-opacity="0.09"/><stop offset="1" stop-color="${A}" stop-opacity="0"/></radialGradient>
<linearGradient id="fl${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${A}" stop-opacity="0.24"/><stop offset="1" stop-color="${A}" stop-opacity="0"/></linearGradient>
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
 R(70,168,28,56)+R(112,140,28,84)+R(154,112,28,112)+R(196,84,28,140)+
 FL(196,84,28,140,'__ACC__',0.14)+
 PC('M50,212 L216,212 L236,172 L256,242 L276,132 L296,212 L432,212')+
 DOT(276,132,5)+T(292,126,'PAID','$'.length?C:C,12)+
 RR(330,72,118,54,8)+L(346,90,432,90)+L(346,104,414,104)+L(346,118,398,118)+
 PD('M346,150 H448 M346,164 H430')+
 T(78,76,'DENIALS','rgba(255,255,255,0.45)',9)+T(196,76,'-38%',C,12)),

'rpm-platform':FIG('RPM / VITALS',
 P('M200,214 C200,214 146,176 146,134 C146,109 165,93 184,93 C197,93 200,106 200,115 C200,106 203,93 216,93 C235,93 254,109 254,134 C254,176 200,214 200,214 Z')+
 PC('M55,150 H128 L142,124 L156,168 L170,112 L184,150 L300,150')+
 PC('M300,150 L312,150 L322,136 L334,160 L346,150 L432,150')+
 DOT(432,150,3)+
 RC(330,86,96,52)+L(330,102,426,102)+DOT(342,94,2.5)+DOT(352,94,2.5)+
 L(344,118,380,118)+L(344,130,404,130)+
 PD('M342,86 V70 M414,86 V70')+T(330,64,'LIVE FEED',F,8)+
 T(336,162,'THRESHOLD 140/90',C,8)),

'ai-voice-layer':FIG('VOICE LAYER',
 R(140,148,14,32)+R(164,126,14,76)+R(188,102,14,124)+R(212,84,14,160)+R(236,102,14,124)+R(260,126,14,76)+R(284,148,14,32)+
 PD('M120,120 H100 M120,150 H92 M120,180 H100')+
 PC('M322,92 a52,52 0 0 1 0,102')+PC('M386,92 a52,52 0 0 0 0,102')+
 RR(340,96,28,54,14)+L(354,150,354,176)+P('M341,176 H367')+
 RR(398,80,60,48,10)+DOT(411,104,3)+DOT(424,104,3)+DOT(437,104,3)+
 P('M406,118 l6,6 10,-12')+
 T(146,244,'LISTENING…',F,9)+T(320,60,'TAP TO TALK',C,9)),

'rtm-platform':FIG('JOINT RANGE MONITOR',
 P('M190,62 L240,150 L295,240')+CIR(240,150,11)+DOT(240,150,3)+
 PC('M292,130 A54,54 0 0 1 314,202')+PD('M260,122 A36,36 0 0 1 272,162')+
 T(332,150,'ROM',F,9)+T(332,168,'0-135°',C,10)+
 R(88,168,76,58)+L(100,168,100,156)+L(100,156,118,168)+L(118,168,118,226)+
 L(130,190,140,180)+L(140,180,152,196)+L(152,196,162,184)+
 T(96,246,'ADHERENCE',F,8)+T(96,262,'86%',C,11)),

'clinical-movement-intelligence':FIG('MOTION CAPTURE',
 runner(240,82,1)+
 P('M196,86 A44,44 0 0 1 240,42 M254,44 A44,44 0 0 1 288,72').replace('stroke-width="1.6"','stroke-width="1"')+
 PD('M196,86 A44,44 0 0 1 240,42 M254,44 A44,44 0 0 1 288,72')+
 PD('M150,250 H370')+
 PC('M262,118 A22,22 0 0 1 270,148')+T(292,136,'38°',C,9)+
 PD('M150,62 H200 M150,62 V112 M370,242 H320 M370,242 V192')+
 FL(150,250,220,6,'__ACC__',0.25)+
 T(160,236,'VISIT 01',F,8)+T(300,236,'VISIT 12',C,8)+PD('M240,252 V244 M330,252 V244')),

'dental-ehr':FIG('DENTAL RECORD',
 P('M212,100 C190,100 180,120 186,146 C192,176 202,200 212,226 C217,240 228,240 231,225 C235,205 241,205 245,225 C248,240 259,240 264,226 C274,200 284,176 290,146 C296,120 286,100 264,100 C252,100 246,111 238,111 C230,111 224,100 212,100 Z')+
 PC('M204,155 H226 L234,136 L242,168 L250,148 H272')+
 R(336,72,108,164)+L(336,94,444,94)+
 L(352,116,428,116)+L(352,136,410,136)+L(352,156,424,156)+L(352,176,398,176)+
 RC(352,196,12,12)+L(355,202,359,206)+L(359,206,365,197)+
 RR(352,218,84,12,6)+FL(352,218,56,12,'__ACC__',0.55)+
 T(352,70,'CHART 2.4',F,8)+T(380,228,'PLAN DONE 66%',C,8)),

'hotel-rate-intelligence':FIG('RATE INTELLIGENCE',
 R(130,84,150,178)+
 R(148,104,26,22)+R(196,104,26,22)+R(244,104,26,22)+
 R(148,146,26,22)+R(196,146,26,22)+R(244,146,26,22)+
 R(148,188,26,22)+R(196,188,26,22)+R(244,188,26,22)+
 FL(196,146,26,22,'__ACC__',0.35)+FL(244,104,26,22,'__ACC__',0.2)+
 R(190,224,30,38)+
 P('M205,84 V60 M205,60 H300')+DOT(205,60,3)+
 PC('M310,220 L424,112')+PC('M410,116 L424,112 L422,126')+
 PC('M324,92 L356,62 L402,62 L402,108 L356,108 Z')+DOT(388,85,4)+T(362,91,'$',W,12)+
 T(318,238,'ADR +18%',C,10)+T(130,60,'COMP SET ×20',F,8)),

'room-defect-intelligence':FIG('DEFECT DETECTION',
 R(80,70,230,165)+L(175,70,175,158)+L(175,158,80,158)+
 P('M205,92 l14,16 l-8,14 l16,18 l-6,16 l14,12')+
 P('M212,100 l10,11 M226,146 l10,9').replace('stroke-width="1.6"','stroke-width="1"')+
 CC(232,158,42)+LC(264,190,308,240)+
 L(348,100,404,156)+L(404,100,348,156)+
 T(330,86,'SEVERITY','rgba(255,255,255,0.45)',8)+RR(330,94,96,24,4)+FL(334,98,58,16,'__ACC__',0.6)+T(342,111,'HIGH · FIX NOW',W,8)+
 T(330,140,'Δ vs LAST',F,8)+T(330,156,'+94%',C,12)),

'three-d-spatial-intelligence':FIG('3D RECONSTRUCTION',
 R(150,122,108,102)+R(206,88,108,102)+L(150,122,206,88)+L(258,122,314,88)+L(258,224,314,190)+
 FL(206,88,108,102,'__ACC__',0.08)+
 PD('M56,157 H424')+LC(56,157,74,157)+LC(406,157,424,157)+T(206,62,'LIDAR SWEEP',C,8)+
 DOT(118,98,2.5)+DOT(140,214,2.5)+DOT(374,100,2.5)+DOT(358,228,2.5)+DOT(102,178,2.5)+DOT(396,178,2.5)+
 PC('M96,120 A40,40 0 0 1 96,196 M82,150 A56,56 0 0 1 82,214')+
 T(340,240,'4.2 × 3.8 M',C,9)),

'overlay-hd':FIG('OVERLAY HD',
 P('M150,95 H128 M150,95 V117 M350,95 H372 M350,95 V117 M150,215 H128 M150,215 V193 M350,215 H372 M350,215 V193')+
 PD('M250,82 V228')+
 P('M165,110 C185,96 215,96 232,110 M268,110 C285,96 315,96 335,110')+
 P('M175,150 C190,170 222,180 250,180 C278,180 310,170 325,150')+
 PC('M180,150 C196,164 222,172 250,172 C278,172 304,164 320,150')+
 RR(270,116,110,40,6)+L(282,132,398,132)+L(282,146,376,146)+
 T(270,108,'AFTER',C,8)+T(88,150,'BEFORE',F,8)+
 T(360,196,'+42% CASES',C,9)),

'ai-voice-receptionist':FIG('VOICE RECEPTIONIST',
 CIR(160,148,40)+P('M120,138 A40,40 0 0 1 200,138')+
 PC('M200,152 Q220,160 214,182')+DOT(212,184,3)+
 PC('M222,138 A28,28 0 0 1 222,194 M240,122 A48,48 0 0 1 240,210')+
 R(320,96,13,52)+R(340,76,13,92)+R(360,58,13,128)+R(380,88,13,68)+
 RR(320,196,72,30,6)+P('M332,211 l8,8 16,-18')+
 T(320,246,'BOOKED 14:30',C,9)+T(120,236,'EN / ES',F,9)+PD('M110,230 H190')),

'ai-chatbots':FIG('CHAT AGENTS',
 RR(66,72,216,84,18)+P('M102,156 L102,186 L138,156')+
 DOT(118,114,4)+DOT(146,114,4)+DOT(174,114,4)+
 PD('M96,138 H200')+
 RR(268,176,172,78,18)+P('M402,254 L402,284 L366,254')+
 L(288,202,420,202)+L(288,222,394,222)+
 CC(96,228,22)+DOT(88,226,2)+DOT(104,226,2)+P('M88,234 Q96,240 104,234')+
 T(86,268,'24/7',C,9)+T(300,60,'< 3s REPLY',C,9)),

'ai-market-intelligence':FIG('MARKET SIGNALS',
 L(128,86,128,226)+L(128,226,400,226)+
 R(158,146,18,42)+L(167,133,167,196)+
 R(200,118,18,72)+L(209,105,209,202)+
 RC(244,158,18,32)+L(253,148,253,202)+
 R(288,96,18,94)+L(297,83,297,202)+
 PD('M340,122 A36,36 0 1 1 340,194')+LC(320,158,360,158)+LC(340,138,340,178)+
 DOT(297,83,3)+
 PC('M150,70 C220,40 300,44 356,66 M346,52 L356,66 L368,56')+
 T(368,118,'TAM',F,8)+T(368,134,'$2.4B',C,10)),

'intelligent-crm':FIG('CRM GRAPH',
 CIR(126,112,26)+P('M100,190 A26,26 0 0 1 152,190')+
 CIR(354,112,26)+P('M328,190 A26,26 0 0 1 380,190')+
 CIR(240,206,26)+P('M214,284 A26,26 0 0 1 266,284')+
 L(148,124,332,124)+L(138,136,220,188)+L(362,136,246,188)+
 DOT(240,152,4)+DOT(240,152,8,'opacity="0.35"')+
 RR(206,58,68,26,6)+T(216,76,'+38 SQL',C,9)+
 PD('M240,232 V252')+T(240,266,'CLOSED',F,8)),

'website-factory':FIG('SITE FACTORY',
 L(56,256,424,256)+
 R(72,138,104,82)+L(72,158,176,158)+DOT(86,148,2.5)+DOT(100,148,2.5)+L(86,180,162,180)+L(86,198,148,198)+
 R(196,118,104,82)+L(196,138,300,138)+DOT(210,128,2.5)+DOT(224,128,2.5)+L(210,160,286,160)+L(210,178,270,178)+
 R(320,98,104,82)+L(320,118,424,118)+DOT(334,108,2.5)+DOT(348,108,2.5)+L(334,140,410,140)+L(334,158,394,158)+
 FL(320,98,104,82,'__ACC__',0.1)+
 CC(242,52,15)+P('M242,33 v8 M242,71 v8 M223,52 h8 M253,52 h8 M228,38 l6,6 M250,60 l6,6 M256,38 l-6,6 M234,60 l-6,6')+
 PC('M150,244 H330')+PC('M318,238 L330,244 L318,250')+
 T(150,52,'< 5s / SITE',C,9)),

'agentic-websites':FIG('AGENTIC SITE',
 R(112,72,252,166)+L(112,98,364,98)+DOT(128,85,2.5)+DOT(144,85,2.5)+DOT(160,85,2.5)+
 L(134,126,246,126)+L(134,148,222,148)+
 RR(134,170,90,54,4)+T(146,200,'CTA A',F,9)+
 CC(308,152,26)+P('M308,126 v10 M308,178 v10 M282,152 h10 M324,152 h10 M290,134 l7,7 M319,163 l7,7 M326,134 l-7,7 M297,163 l-7,7')+
 PC('M182,188 L282,138 L262,168 L298,158')+
 T(146,60,'INTENT: BUYER',C,8)+T(300,214,'ADAPTED',C,8)),

'seo-aeo-engine':FIG('SEO / AEO',
 R(102,192,28,48)+R(146,166,28,74)+R(190,138,28,102)+R(234,106,28,134)+
 FL(234,106,28,134,'__ACC__',0.18)+
 CC(356,132,58)+LC(397,173,432,210)+T(340,139,'#1',C,18,'middle')+
 PC('M96,92 C168,50 262,46 334,68 M324,56 L334,68 L346,56')+DOT(334,68,3)+
 T(380,56,'RICH RESULT',F,8)+
 P('M120,258 l10,-16 10,16 z M140,258 l10,-22 10,22 z').replace('stroke-width="1.6"','stroke-width="1.2"')+
 T(176,262,'CTR +64%',C,9)),

'rapid-digital-launch':FIG('48H LAUNCH',
 P('M240,54 C272,88 278,142 262,192 L218,192 C202,142 208,88 240,54 Z')+
 CC(240,120,14)+
 P('M220,152 L194,208 L230,188 M260,152 L286,208 L250,188')+
 PC('M226,196 C221,214 230,226 224,244 M242,196 C247,214 238,226 244,244 M234,196 V248')+
 PD('M148,82 L114,82 M158,108 L124,108 M322,82 L356,82 M312,108 L346,108')+
 RR(330,196,110,34,6)+T(344,218,'LIVE IN 48H',C,10)+
 DOT(240,120,3)),

'maca-locator':FIG('ROADSIDE AI',
 PD('M66,246 H414')+L(66,246,414,246)+
 P('M66,246 H190').replace('stroke-width="1.6"','stroke-width="2.5"')+
 R(90,166,120,28)+P('M90,166 L122,142 L152,142 L152,166')+
 FL(90,166,120,28,'__ACC__',0.1)+
 P('M210,194 L210,136 L250,136 L272,168 L272,194 Z')+
 CIR(124,202,14)+DOT(124,202,2.5)+CIR(240,202,14)+DOT(240,202,2.5)+
 L(220,136,220,104)+PC('M220,104 L256,104 L256,126')+PC('M256,126 a7,7 0 1 0 7,7')+
 PC('M286,124 A18,18 0 0 1 304,106 M296,142 A32,32 0 0 1 328,110')+DOT(244,92,3)+
 P('M306,196 a11,11 0 0 1 11,-11 L366,185 a13,13 0 0 1 13,11 L379,196')+
 P('M322,185 L335,164 L364,164 L372,185')+
 CIR(328,202,11)+CIR(368,202,11)+
 PD('M272,224 C294,216 302,208 314,203')+
 P('M120,244 l8,-8 M160,252 l8,-8 M340,246 l8,-8').replace('stroke-width="1.6"','stroke-width="1.2"')+
 T(84,116,'24/7 DISPATCH','rgba(255,255,255,0.45)',9)+T(306,240,'ETA 15 MIN',C,9)+
 CC(388,84,12)+DOT(388,84,3)+T(406,88,'YOU',W,8)),

'estatematch':FIG('PROPERTY MATCH',
 P('M158,142 L240,78 L322,142')+R(170,142,140,96)+R(232,184,28,54)+R(190,160,26,22)+R(272,160,26,22)+
 PC('M100,168 H142 M134,160 L142,168 L134,176 M410,168 H368 M376,160 L368,168 L376,176')+
 PC('M336,64 C336,64 318,50 318,38 C318,29 325,24 332,24 C338,24 341,30 343,33 C345,30 348,24 354,24 C361,24 368,29 368,38 C368,50 350,64 350,64 Z')+
 T(96,244,'SWIPE → MATCH',C,9)+T(306,244,'12,400 USERS',F,8)+
 PD('M96,236 H200 M306,236 H420')),

'adaptive-marketplace':FIG('ADAPTIVE COMMERCE',
 LC(118,66,362,66)+DOT(220,66,5)+LC(118,88,362,88)+DOT(312,88,5)+
 P('M104,114 H376 L368,146 H112 Z')+P('M121,146 a11,11 0 0 0 22,0 M163,146 a11,11 0 0 0 22,0 M205,146 a11,11 0 0 0 22,0 M247,146 a11,11 0 0 0 22,0 M289,146 a11,11 0 0 0 22,0 M331,146 a11,11 0 0 0 22,0')+
 R(114,146,250,96)+R(134,166,66,44)+FL(134,166,66,44,'__ACC__',0.14)+R(286,166,56,76)+
 PD('M212,206 H276')+PC('M224,206 H264')+PC('M250,196 v20')+
 T(150,236,'4 U',F,8)+T(300,258,'REC ×9',C,8)),

'pocketscribe':FIG('POCKET SCRIBE',
 RR(192,52,100,200,16)+R(208,74,68,146)+L(208,90,276,90)+DOT(242,64,2.5)+
 PC('M214,176 h10 l4,-10 l6,20 l5,-14 l4,4 h13')+
 PC('M300,120 A20,20 0 0 1 320,100 M300,142 A42,42 0 0 1 342,100')+
 R(316,168,96,58)+L(330,184,398,184)+L(330,198,386,198)+L(330,212,370,212)+
 T(316,246,'SOAP NOTE',F,8)+T(316,262,'READY 40s',C,10)+
 PD('M306,150 L316,168')),

'jmm-jas-miami-method':FIG('JMM PROTOCOL',
 runner(150,72,0.95)+
 PC('M70,222 C102,222 102,198 134,198 C166,198 166,222 198,222 C230,222 230,198 262,198 C294,198 294,222 326,222')+
 T(344,212,'180 SPM',C,10)+
 PD('M70,246 H326')+
 CC(384,100,34)+P('M384,66 V82 M384,118 V134 M350,100 H366 M402,100 H418')+
 P('M370,116 A20,20 0 1 1 398,116')+T(368,104,'92',C,11)+T(352,150,'READINESS',F,8)+T(352,164,'HRV OK',C,8)+
 PD('M150,246 V260 M262,246 V260')),

'runform-ai':FIG('GAIT ANALYSIS',
 runner(240,68,1)+PD('M128,214 H372')+
 LC(240,82,240,214)+DOT(240,214,3)+
 PC('M192,246 H284 M272,238 L284,246 L272,254')+PC('M266,224 H174 M186,216 L174,224 L186,232')+
 PC('M196,120 A16,16 0 0 1 206,100')+T(146,112,'KNEE',F,8)+T(146,126,'172°',C,9)+
 T(310,120,'STRIDE',F,8)+T(310,134,'0.94m',C,9)+PD('M284,96 H330 M284,96 V142')),

'cycling-fit-intelligence':FIG('BIKE FIT',
 CIR(148,202,44)+CIR(344,202,44)+
 L(148,202,236,102)+L(236,102,198,202)+L(236,102,308,102)+L(308,102,344,202)+L(198,202,308,102)+
 L(198,202,204,170)+L(192,167,218,167)+
 CIR(254,202,13)+DOT(254,202,2.5)+
 PC('M240,150 L264,98 L306,104')+
 PC('M240,150 L266,176 L254,216')+
 CC(274,80,11)+PC('M268,90 L272,84')+
 DOT(254,216,3)+DOT(266,176,2.5)+
 PD('M254,158 A17,17 0 0 1 276,171')+T(286,158,'145°',C,8)+
 PD('M206,160 V102')+T(214,110,'+2cm',F,8)+
 T(330,66,'POWER +11W',C,8)),

'zero-g-simulation':FIG('5,000 AGENTS',
 CC(240,148,7)+DOT(240,148,3)+
 PD('M102,148 A138,80 0 1 1 378,148 A138,80 0 1 1 102,148')+
 PD('M140,148 A100,58 0 1 1 340,148 A100,58 0 1 1 140,148')+
 PC('M240,148 L148,96 M240,148 L332,96 M240,148 L364,148 M240,148 L332,200 M240,148 L148,200 M240,148 L116,148 M240,148 L193,94 M240,148 L287,94 M240,148 L193,202 M240,148 L287,202')+
 [[148,96],[332,96],[364,148],[332,200],[148,200],[116,148],[193,94],[287,94],[193,202],[287,202]].map(p=>DOT(p[0],p[1],4)).join('')+
 [[148,96],[332,96],[364,148],[332,200],[148,200],[116,148],[193,94],[287,94],[193,202],[287,202]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="8" fill="__ACC__" opacity="0.22"/>`).join('')+
 T(352,72,'26 WKS',C,9)+T(60,240,'8 SCENARIOS',F,9)+PD('M60,232 H150'))
};

const ACCENT={
'zero-g-simulation':'#a78bfa','ai-voice-layer':'#22d3ee','hotel-rate-intelligence':'#fbbf24',
'jmm-jas-miami-method':'#f472b6','estatematch':'#34d399','pocketscribe':'#38bdf8',
'adaptive-marketplace':'#fb923c','overlay-hd':'#a3e635','runform-ai':'#f87171',
'clinical-movement-intelligence':'#2dd4bf','website-factory':'#818cf8','dental-ehr':'#67e8f9',
'room-defect-intelligence':'#fde047','rpm-platform':'#fb7185','three-d-spatial-intelligence':'#c084fc',
'ai-voice-receptionist':'#22d3ee','cycling-fit-intelligence':'#fdba74','rtm-platform':'#6ee7b7',
'intelligent-crm':'#60a5fa','agentic-websites':'#a78bfa','ai-chatbots':'#4ade80',
'ai-market-intelligence':'#fcd34d','revenue-cycle-intelligence':'#34d399','seo-aeo-engine':'#f9a8d4',
'rapid-digital-launch':'#fb923c','maca-locator':'#f59e0b'};
const RAW=window.VENTURE_ART; window.VENTURE_ART={};
for(const k in RAW){ window.VENTURE_ART[k]=RAW[k].split('__ACC__').join(ACCENT[k]||'#00D4FF'); }

})();
