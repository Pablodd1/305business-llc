/* 305business Deal Flow — workflow backend client (La Jefatura engine)
   Stages: inquiry → nda_signed → loi_sent → loi_accepted → due_diligence → escrow → closed
   Fallback endpoints: public tunnel first, then direct. */
(function () {
  const ENDPOINTS = [
    'https://latitude-here-windsor-radical.trycloudflare.com',
    'http://localhost:8090'
  ];
  async function post(path, data) {
    let lastErr;
    for (const base of ENDPOINTS) {
      try {
        const r = await fetch(base + path, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (r.ok) return await r.json();
        lastErr = new Error('HTTP ' + r.status);
      } catch (e) { lastErr = e; }
    }
    throw lastErr || new Error('deal engine unreachable');
  }
  async function get(path) {
    for (const base of ENDPOINTS) {
      try {
        const r = await fetch(base + path);
        if (r.ok) return await r.json();
      } catch (e) { /* try next */ }
    }
    return null;
  }

  const STAGES = ['inquiry', 'nda_signed', 'loi_sent', 'loi_accepted', 'due_diligence', 'escrow', 'closed'];
  const STAGE_LABEL = {
    inquiry: 'Consulta', nda_sent: 'NDA enviado', nda_signed: 'NDA firmado',
    loi_sent: 'LOI enviado', loi_accepted: 'LOI aceptado', due_diligence: 'Due Diligence',
    escrow: 'Escrow', closed: 'Cerrado', dead: 'Caído'
  };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- injected UI (NDA gate + LOI form) ---------- */
  const CSS = `
  #dfOverlay{position:fixed;inset:0;background:rgba(10,15,25,.6);z-index:9998;display:none;align-items:center;justify-content:center;padding:16px}
  #dfOverlay.active{display:flex}
  .df-modal{background:#fff;border-radius:14px;max-width:520px;width:100%;max-height:90vh;overflow:auto;padding:28px 30px;font-family:inherit}
  .df-modal h3{margin:0 0 6px;font-size:1.25rem;font-weight:700;color:#111}
  .df-modal .df-sub{color:#667085;font-size:.875rem;margin-bottom:18px;line-height:1.5}
  .df-modal label{display:block;font-size:.8rem;font-weight:600;color:#374151;margin:12px 0 4px}
  .df-modal input[type=text],.df-modal input[type=email],.df-modal input[type=tel],.df-modal input[type=number],.df-modal textarea{width:100%;border:1.5px solid #d0d5dd;border-radius:8px;padding:10px 12px;font-size:.9rem;box-sizing:border-box}
  .df-modal textarea{min-height:80px}
  .df-check{display:flex;gap:10px;align-items:flex-start;margin:14px 0;font-size:.85rem;color:#374151;line-height:1.45}
  .df-btn{display:inline-block;background:#1a4a7a;color:#fff;border:none;border-radius:8px;padding:11px 20px;font-weight:600;font-size:.9rem;cursor:pointer}
  .df-btn.ghost{background:#eef2f6;color:#1a4a7a}
  .df-btn:disabled{opacity:.6;cursor:default}
  .df-row{display:flex;gap:10px;justify-content:flex-end;margin-top:18px}
  .df-nda-box{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px;font-size:.8rem;color:#475467;max-height:160px;overflow:auto;line-height:1.55;margin-top:8px}
  .df-ok{color:#067647;font-size:.9rem;margin-top:10px;display:none}
  .df-err{color:#b42318;font-size:.85rem;margin-top:10px;display:none}
  .df-stage-pill{display:inline-block;font-size:.72rem;font-weight:700;letter-spacing:.04em;padding:3px 10px;border-radius:99px;background:#e0eaff;color:#1a4a7a;text-transform:uppercase}
  `;
  const NDA_TEXT = `ACUERDO DE CONFIDENCIALIDAD (NDA) — RESUMEN EJECUTABLE
Al firmar digitalmente, el comprador acuerda: (1) mantener confidencial toda información financiera y operativa compartida por el vendedor; (2) usar dicha información únicamente para evaluar esta transacción; (3) no contactar empleados, clientes o proveedores del negocio sin autorización escrita del vendedor. La firma digital registrada con fecha, hora y dirección IP tiene efecto de firma electrónica conforme a la Ley ESIGN y el Estatuto Uniforme de Transacciones Electrónicas (UETA) de Florida.`;

  function mount() {
    if (document.getElementById('dfOverlay')) return;
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    const wrap = document.createElement('div');
    wrap.id = 'dfOverlay';
    wrap.innerHTML = `<div class="df-modal" id="dfModalBody"></div>`;
    wrap.addEventListener('click', e => { if (e.target === wrap) close(); });
    document.body.appendChild(wrap);
  }
  function open(html) {
    mount();
    document.getElementById('dfModalBody').innerHTML = html;
    document.getElementById('dfOverlay').classList.add('active');
  }
  function close() {
    const o = document.getElementById('dfOverlay');
    if (o) o.classList.remove('active');
  }

  function showNDAGate(deal) {
    open(`
      <span class="df-stage-pill">Paso 2 de 6 · NDA</span>
      <h3 style="margin-top:10px">Firma el NDA para ver los números</h3>
      <div class="df-sub"><b>${esc(deal.listing_title)}</b> — el vendedor comparte finanzas y contacto solo bajo confidencialidad.</div>
      <div class="df-nda-box">${NDA_TEXT.replace(/\n/g, '<br>')}</div>
      <label>Escribe tu nombre completo (firma digital)</label>
      <input type="text" id="dfNdaName" placeholder="Nombre y apellido" autocomplete="name">
      <div class="df-check"><input type="checkbox" id="dfNdaAccept"><span>He leído y acepto el Acuerdo de Confidencialidad. Entiendo que mi firma digital queda registrada con fecha, hora e IP.</span></div>
      <div class="df-err" id="dfNdaErr">Completa tu nombre y acepta el acuerdo.</div>
      <div class="df-row">
        <button class="df-btn ghost" onclick="document.getElementById('dfOverlay').classList.remove('active')">Ahora no</button>
        <button class="df-btn" id="dfNdaBtn">Firmar NDA</button>
      </div>`);
    document.getElementById('dfNdaBtn').onclick = async () => {
      const name = document.getElementById('dfNdaName').value.trim();
      const ok = document.getElementById('dfNdaAccept').checked;
      if (!name || !ok) { document.getElementById('dfNdaErr').style.display = 'block'; return; }
      const btn = document.getElementById('dfNdaBtn');
      btn.disabled = true; btn.textContent = 'Firmando…';
      try {
        const r = await post('/api/b305/nda', { deal_id: deal.deal_id, name, listing_id: deal.listing_id });
        if (r.ok) showLOI(deal, name);
        else throw new Error('NDA failed');
      } catch (e) {
        document.getElementById('dfNdaErr').textContent = 'Error de red. Intenta de nuevo.';
        document.getElementById('dfNdaErr').style.display = 'block';
        btn.disabled = false; btn.textContent = 'Firmar NDA';
      }
    };
  }

  function showLOI(deal, buyerName) {
    open(`
      <span class="df-stage-pill">Paso 3 de 6 · LOI</span>
      <h3 style="margin-top:10px">NDA firmado ✓</h3>
      <div class="df-sub">Bienvenido a la sala de datos, <b>${esc(buyerName)}</b>. El vendedor compartirá los estados financieros. ¿Quieres enviar una Carta de Intención (LOI) ahora o después de revisar los números?</div>
      <label>Monto ofrecido (USD)</label>
      <input type="number" id="dfLoiAmt" min="0" step="1000" placeholder="250000">
      <label>Términos (financiamiento, contingencias, plazo)</label>
      <textarea id="dfLoiTerms" placeholder="Ej: 20% depósito en escrow, due diligence de 30 días, cierre en 60 días"></textarea>
      <div class="df-err" id="dfLoiErr">Ingresa un monto válido.</div>
      <div class="df-ok" id="dfLoiOk">LOI enviada al vendedor. Te notificaremos su respuesta por email.</div>
      <div class="df-row">
        <button class="df-btn ghost" onclick="document.getElementById('dfOverlay').classList.remove('active')">Revisar números primero</button>
        <button class="df-btn" id="dfLoiBtn">Enviar LOI</button>
      </div>`);
    document.getElementById('dfLoiBtn').onclick = async () => {
      const amt = parseFloat(document.getElementById('dfLoiAmt').value);
      if (!(amt > 0)) { document.getElementById('dfLoiErr').style.display = 'block'; return; }
      const btn = document.getElementById('dfLoiBtn');
      btn.disabled = true; btn.textContent = 'Enviando…';
      try {
        const r = await post('/api/b305/loi', { deal_id: deal.deal_id, amount: amt, terms: document.getElementById('dfLoiTerms').value });
        if (r.ok) {
          document.getElementById('dfLoiOk').style.display = 'block';
          document.getElementById('dfLoiErr').style.display = 'none';
          setTimeout(close, 2200);
        } else throw new Error('LOI failed');
      } catch (e) {
        document.getElementById('dfLoiErr').textContent = 'Error de red. Intenta de nuevo.';
        document.getElementById('dfLoiErr').style.display = 'block';
        btn.disabled = false; btn.textContent = 'Enviar LOI';
      }
    };
  }

  window.DealFlow = {
    STAGES, STAGE_LABEL, close,
    submitInquiry(data) { return post('/api/b305/deal', data); },
    signNDA(dealId, name) { return post('/api/b305/nda', { deal_id: dealId, name }); },
    sendLOI(dealId, amount, terms) { return post('/api/b305/loi', { deal_id: dealId, amount, terms }); },
    advance(dealId, stage) { return post('/api/b305/advance', { deal_id: dealId, stage }); },
    list() { return get('/api/b305/deals'); },
    showNDAGate
  };
})();
