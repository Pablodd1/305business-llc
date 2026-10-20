/* Demo ES fallback — sample listings for the Spanish white-label demo (es.html).
   Self-contained: renders directly into #listingsGrid, survives API failure,
   re-fills if the site's own scripts clear the grid afterwards. */
(function () {
  const demo = [
    { n: 'Cafetería Calle Ocho', c: 'restaurante', ic: 'fa-utensils', p: 165000, r: 380000, loc: 'Little Havana, Miami', v: 1284, q: 23, f: ['45 asientos', 'licencia completa', 'equipo nuevo'], d: 'Cafetería cubana establecida con clientela fiel y licencia completa.' },
    { n: 'Autolavado Biscayne', c: 'automotriz', ic: 'fa-car', p: 140000, r: 290000, loc: 'Biscayne Blvd, Miami', v: 947, q: 18, f: ['3 túneles', 'personal fijo', 'arrendamiento'], d: 'Autolavado de alto volumen en avenida principal con 3 túneles.' },
    { n: 'Bodega & Minimarket Wynwood', c: 'retail', ic: 'fa-store', p: 230000, r: 520000, loc: 'Wynwood, Miami', v: 1612, q: 31, f: ['24 horas', 'cerveza/vino', 'estacionamiento'], d: 'Minimarket 24 horas en zona de alto tráfico peatonal.' },
    { n: 'Salón de Belleza Coral Way', c: 'servicios', ic: 'fa-briefcase', p: 95000, r: 210000, loc: 'Coral Way, Miami', v: 733, q: 12, f: ['6 sillas', 'clientela leal', 'citas online'], d: 'Salón con clientela leal de 10+ años y reservas en línea.' },
    { n: 'Lavandería Kendall', c: 'servicios', ic: 'fa-briefcase', p: 88000, r: 175000, loc: 'Kendall, Miami', v: 655, q: 9, f: ['lavado en seco', '2 locales', 'a domicilio'], d: 'Lavandería con servicio de lavado en seco y entrega a domicilio.' },
    { n: 'Gimnasio Downtown', c: 'fitness', ic: 'fa-dumbbell', p: 195000, r: 410000, loc: 'Downtown, Miami', v: 1120, q: 27, f: ['800 miembros', 'equipo nuevo', 'clases grupales'], d: 'Gimnasio de barrio con 800 miembros activos y equipamiento nuevo.' },
    { n: 'Farmacia Little Haiti', c: 'salud', ic: 'fa-hospital', p: 310000, r: 640000, loc: 'Little Haiti, Miami', v: 1893, q: 35, f: ['recetas', 'seguros aceptados', 'servicio 24h'], d: 'Farmacia de barrio con recetas, seguros aceptados y alto flujo.' },
    { n: 'Bar de Vinos Brickell', c: 'restaurante', ic: 'fa-utensils', p: 320000, r: 680000, loc: 'Brickell, Miami', v: 2041, q: 41, f: ['80 vinos', 'terraza', 'licencia completa'], d: 'Bar de vinos de lujo en Brickell con terraza y carta de 80+ vinos.' },
    { n: 'Food Truck Doral', c: 'restaurante', ic: 'fa-utensils', p: 72000, r: 240000, loc: 'Doral, Miami', v: 512, q: 8, f: ['ruta fija', 'permiso activo', 'marca registrada'], d: 'Food truck con ruta fija de alto tráfico y permisos al día.' }
  ];

  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const money = n => '$' + n.toLocaleString('en-US');

  const card = l =>
    '<div class="tech-card overflow-hidden group">' +
      '<div class="relative h-48 overflow-hidden bg-gradient-to-br from-blue-900 to-blue-800 flex items-center justify-center">' +
        '<i class="fas ' + l.ic + ' text-6xl text-white/20"></i>' +
        '<div class="absolute top-4 right-4"><span class="px-3 py-1 text-xs font-bold uppercase" style="background:rgba(0,255,136,.15);color:#00FF88;border:1px solid rgba(0,255,136,.4)">ACTIVO</span></div>' +
        '<div class="absolute top-4 left-4"><span class="px-3 py-1 border border-white/20 text-xs text-white font-bold">' + l.v + ' VISTAS</span></div>' +
      '</div>' +
      '<div class="p-6">' +
        '<div class="flex justify-between items-start mb-2"><h3 class="text-xl font-bold text-white">' + esc(l.n) + '</h3>' +
        '<p class="text-2xl font-bold text-[#00D4FF]">' + money(l.p) + '</p></div>' +
        '<p class="text-white/40 text-sm mb-3">' + esc(l.d) + '</p>' +
        '<div class="flex items-center gap-2 text-sm text-white/30 mb-4"><i class="fas fa-map-marker-alt text-[#00D4FF]"></i><span>' + esc(l.loc) + '</span></div>' +
        '<div class="flex flex-wrap gap-2 mb-4">' + l.f.map(x => '<span class="px-2 py-1 border border-white/10 text-xs text-white/40">' + esc(x.toUpperCase()) + '</span>').join('') + '</div>' +
        '<div class="flex items-center justify-between pt-4 border-t border-white/10">' +
          '<div><p class="tech-label">INGRESOS</p><p class="font-semibold text-[#00FF88]">' + money(l.r) + '/año</p></div>' +
          '<div class="text-right"><p class="tech-label">CONSULTAS</p><p class="text-white font-semibold">' + l.q + '</p></div>' +
        '</div>' +
        '<button onclick="document.getElementById(\'contacto\')&&document.getElementById(\'contacto\').scrollIntoView({behavior:\'smooth\'})" class="schematic-btn w-full mt-4 py-2"><span class="relative z-10">VER DETALLES →</span></button>' +
      '</div>' +
    '</div>';

  window.__fillDemo = function () {
    const grid = document.getElementById('listingsGrid');
    if (!grid) return;
    grid.innerHTML = demo.map(card).join('');
    grid.style.display = 'grid';
    const l = document.getElementById('listingsLoading'); if (l) l.style.display = 'none';
    const e = document.getElementById('listingsError'); if (e) e.style.display = 'none';
    const c = document.getElementById('listingsCount'); if (c) c.textContent = '9 LISTADOS ACTIVOS · ACTUALIZADO: AHORA';
  };

  // Neutralize the live-API paths so nothing wipes the demo cards afterwards
  window.loadListings = function () { window.__fillDemo(); };
  window.filterListados = function () { window.__fillDemo(); };
  window.trackListingClick = function () {
    const t = document.getElementById('contacto');
    if (t) t.scrollIntoView({ behavior: 'smooth' });
  };

  setTimeout(window.__fillDemo, 2500);
  setInterval(function () {
    const grid = document.getElementById('listingsGrid');
    if (grid && grid.innerHTML.replace(/\s/g, '').length < 400) window.__fillDemo();
  }, 2000);
})();
