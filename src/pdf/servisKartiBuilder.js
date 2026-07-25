function fmtKm(str) {
  if (!str) return '';
  const n = parseInt(String(str).replace(/[^0-9]/g, ''));
  if (isNaN(n)) return str;
  return n.toLocaleString('tr-TR') + ' km';
}
function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function splitLines(raw) {
  return String(raw || '').split(/\n/).map(s => s.trim()).filter(Boolean);
}
function splitCsv(raw) {
  return String(raw || '').split(/[,\n]/).map(s => s.trim()).filter(Boolean);
}
function kmDiff(now, next) {
  const n = parseInt(String(now).replace(/[^0-9]/g, ''));
  const x = parseInt(String(next).replace(/[^0-9]/g, ''));
  if (!isNaN(n) && !isNaN(x) && x > n)
    return (x - n).toLocaleString('tr-TR') + ' km sonra bakım';
  return '';
}
function logoHtml(b64) {
  if (b64) return `<img src="${b64}" style="width:100%;height:100%;object-fit:contain;padding:6px;display:block;">`;
  return `<div class="logo-placeholder">SERVİS<br>LOGO</div>`;
}
function docNo(date) {
  return 'SRV-' + String(date || '').replace(/\./g, '').slice(-6);
}
const MAX_PER_PANEL = 17;
function doneItemHtml(t) {
  return `<div class="done-item"><div class="di-icon">✓</div><div class="di-text">${esc(t)}</div></div>`;
}
function partItemHtml(t) {
  return `<div class="part-item"><div class="pi-dot"></div><div class="pi-text">${esc(t)}</div></div>`;
}
function emptyMsg(msg) {
  return `<div class="empty-msg">${msg}</div>`;
}

const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{width:100vw;margin:0;padding:0;}
body{width:100vw;margin:0;padding:0;background:#fff;font-family:'Rajdhani',sans-serif;}
.a4{
  width:100vw;height:100vh;position:relative;overflow:hidden;
  display:flex;flex-direction:column;flex-shrink:0;
  -webkit-print-color-adjust:exact;print-color-adjust:exact;
  background:#FFFFFF;color:#1A2332;
  page-break-after:always;
}
.a4:last-child{page-break-after:auto;}

/* ── KENAR SÜSLEMELERİ ── */
.edge-top{position:absolute;top:0;left:0;right:0;height:5px;z-index:10;
  background:linear-gradient(90deg,#1C2B47 0%,#C9A84C 25%,#D4AF37 50%,#C9A84C 75%,#1C2B47 100%);}
.edge-left{position:absolute;left:0;top:5px;bottom:0;width:4px;z-index:10;
  background:linear-gradient(180deg,#C9A84C,#1C2B47 40%,#C9A84C 70%,#1C2B47);}
.corner-tr{position:absolute;top:5px;right:0;width:32px;height:32px;z-index:10;}
.corner-tr::before{content:'';position:absolute;top:0;right:0;left:0;height:2px;background:#C9A84C;}
.corner-tr::after{content:'';position:absolute;top:0;right:0;bottom:0;width:2px;background:#C9A84C;}
.corner-br{position:absolute;bottom:0;right:0;width:32px;height:32px;z-index:10;}
.corner-br::before{content:'';position:absolute;bottom:0;right:0;left:0;height:2px;background:#C9A84C;}
.corner-br::after{content:'';position:absolute;bottom:0;right:0;top:0;width:2px;background:#C9A84C;}
.watermark{position:absolute;bottom:80px;right:20px;z-index:1;opacity:.04;
  font-family:'Orbitron',sans-serif;font-size:72px;font-weight:800;color:#C9A84C;
  letter-spacing:.1em;transform:rotate(-15deg);pointer-events:none;}

/* ── HEADER ── */
.srv-header{
  position:relative;z-index:20;flex-shrink:0;
  padding:12px 20px 11px 18px;
  display:flex;justify-content:space-between;align-items:center;
  background:linear-gradient(135deg,#1C2B47 0%,#0F1F3D 60%,#162440 100%);
  border-bottom:2px solid #C9A84C;
}
.h-brand{display:flex;flex-direction:column;gap:2px;}
.h-brand-name{font-family:'Orbitron',sans-serif;font-size:10px;font-weight:700;
  letter-spacing:.3em;color:#D4AF37;text-transform:uppercase;}
.h-brand-sub{font-family:'Rajdhani',sans-serif;font-size:8.5px;
  letter-spacing:.2em;color:rgba(196,175,100,.5);text-transform:uppercase;}
.h-badge{display:flex;align-items:center;gap:6px;
  padding:5px 14px;border:1.5px solid #C9A84C;
  background:rgba(196,175,100,.1);}
.h-badge-dot{width:7px;height:7px;background:#C9A84C;border-radius:50%;}
.h-badge-txt{font-family:'Orbitron',sans-serif;font-size:8.5px;font-weight:600;
  letter-spacing:.15em;color:#D4AF37;text-transform:uppercase;}
.h-doc{display:flex;flex-direction:column;align-items:flex-end;gap:3px;}
.h-doc-no{font-family:'Orbitron',sans-serif;font-size:8px;letter-spacing:.18em;color:rgba(196,175,100,.65);}
.h-doc-date{font-family:'Rajdhani',sans-serif;font-size:8.5px;letter-spacing:.15em;color:rgba(196,175,100,.45);}

/* ── ARAÇ SATIRI ── */
.vehicle-row{
  position:relative;z-index:20;flex-shrink:0;
  padding:10px 18px 9px 18px;
  display:flex;align-items:flex-start;gap:14px;
  border-bottom:1px solid #E8E2D4;
  background:linear-gradient(90deg,#FDFAF4,#FFFFFF 60%);
}
.logo-box{
  width:80px;height:66px;flex-shrink:0;
  border:1.5px solid #C9A84C;background:#F8F5ED;
  display:flex;align-items:center;justify-content:center;
  position:relative;
}
.logo-corner{position:absolute;width:9px;height:9px;}
.logo-corner::before,.logo-corner::after{content:'';position:absolute;background:#C9A84C;}
.logo-corner.tl{top:2px;left:2px}.logo-corner.tl::before{top:0;left:0;right:0;height:1.5px}.logo-corner.tl::after{top:0;left:0;bottom:0;width:1.5px}
.logo-corner.br{bottom:2px;right:2px}.logo-corner.br::before{bottom:0;left:0;right:0;height:1.5px}.logo-corner.br::after{top:0;right:0;bottom:0;width:1.5px}
.logo-placeholder{font-family:'Rajdhani',sans-serif;font-size:7px;letter-spacing:.25em;
  color:rgba(196,175,100,.4);text-align:center;line-height:1.9;font-weight:600;}
.veh-info{flex:1;display:flex;flex-direction:column;gap:5px;}
.veh-top{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;}
.veh-make{font-family:'Orbitron',sans-serif;font-size:19px;font-weight:700;
  letter-spacing:.06em;color:#1C2B47;}
.veh-model{font-family:'Orbitron',sans-serif;font-size:11px;font-weight:500;
  letter-spacing:.15em;color:#C9A84C;}
.veh-year{font-family:'Rajdhani',sans-serif;font-size:12px;letter-spacing:.12em;color:#8A9BA8;font-weight:500;}
.veh-plate{
  font-family:'Orbitron',sans-serif;font-size:11px;font-weight:700;letter-spacing:.22em;
  color:#1C2B47;background:#F0C020;padding:3px 10px;
  border:1px solid #C9A84C;align-self:flex-start;}
.veh-meta{display:flex;gap:14px;flex-wrap:wrap;}
.vm{display:flex;flex-direction:column;gap:1px;}
.vm-k{font-family:'Rajdhani',sans-serif;font-size:7px;letter-spacing:.35em;
  text-transform:uppercase;color:#A89880;font-weight:600;}
.vm-v{font-family:'Rajdhani',sans-serif;font-size:13px;font-weight:700;color:#1C2B47;letter-spacing:.04em;}
.vm-v.gold{color:#B8921C;}.vm-v.navy{color:#1C6090;}

/* ── KM BANDI ── */
.km-band{
  position:relative;z-index:20;flex-shrink:0;
  padding:8px 18px 7px 18px;
  background:#F5F2EA;border-bottom:1px solid #E8E2D4;
}
.km-row{display:flex;align-items:center;gap:10px;}
.km-label{font-family:'Rajdhani',sans-serif;font-size:7.5px;letter-spacing:.28em;
  text-transform:uppercase;color:#A89880;flex-shrink:0;width:86px;font-weight:600;}
.km-val{font-family:'Orbitron',sans-serif;font-size:12.5px;font-weight:700;letter-spacing:.1em;flex-shrink:0;}
.km-val.done{color:#1A7A45;}.km-val.next{color:#B8921C;}
.km-track{flex:1;height:7px;background:#E8E2D4;border:1px solid #D4C89A;overflow:hidden;}
.km-fill{height:100%;background:linear-gradient(90deg,#1A7A45,#C9A84C 60%,#B8921C);width:62%;}
.km-arrow{font-size:9px;color:#C9A84C;flex-shrink:0;}
.km-diff{font-family:'Rajdhani',sans-serif;font-size:8px;letter-spacing:.15em;
  color:#B8921C;font-weight:600;margin-top:3px;text-align:right;}

/* ── ANA GÖVDE ── */
.main-body{
  position:relative;z-index:20;flex:1;min-height:0;
  display:grid;grid-template-columns:1fr 1fr;overflow:hidden;
}
.panel-left{border-right:1px solid #E8E2D4;display:flex;flex-direction:column;overflow:hidden;}
.panel-right{display:flex;flex-direction:column;overflow:hidden;}
.panel-header{padding:7px 12px 6px 14px;display:flex;align-items:center;gap:7px;flex-shrink:0;}
.ph-icon{font-size:11px;}
.ph-title{font-family:'Orbitron',sans-serif;font-size:7.5px;font-weight:700;letter-spacing:.25em;text-transform:uppercase;}
.ph-count{font-family:'Rajdhani',sans-serif;font-size:8px;letter-spacing:.1em;margin-left:auto;opacity:.5;font-weight:600;}
.panel-left .panel-header{background:#EEF6F1;border-bottom:1px solid #C5DFD0;}
.panel-left .ph-title{color:#1A7A45;}
.panel-right .panel-header{background:#FBF5E6;border-bottom:1px solid #E0C97A;}
.panel-right .ph-title{color:#9A7418;}
.item-list{flex:1;overflow:hidden;padding:6px 10px 6px 12px;display:flex;flex-direction:column;gap:3px;}
.done-item{display:flex;align-items:flex-start;gap:7px;padding:4px 6px;
  background:#F5FBF7;border-left:2.5px solid #1A7A45;flex-shrink:0;}
.di-icon{width:14px;height:14px;border-radius:50%;flex-shrink:0;
  background:#1A7A45;display:flex;align-items:center;justify-content:center;
  font-size:8px;color:#fff;margin-top:1px;font-weight:800;}
.di-text,.pi-text{font-family:'Rajdhani',sans-serif;font-size:12px;font-weight:500;
  letter-spacing:.03em;color:#1A2332;line-height:1.3;}
.part-item{display:flex;align-items:flex-start;gap:7px;padding:4px 6px;
  background:#FFFBF0;border-left:2.5px solid #C9A84C;flex-shrink:0;}
.pi-dot{width:10px;height:10px;flex-shrink:0;transform:rotate(45deg);
  background:#C9A84C;margin-top:2px;}
.empty-msg{font-family:'Rajdhani',sans-serif;font-size:9px;letter-spacing:.2em;
  color:rgba(26,35,50,.25);padding:12px 0;text-align:center;font-weight:600;}
.more-badge{font-family:'Rajdhani',sans-serif;font-size:8px;letter-spacing:.15em;
  color:#9A7418;padding:4px 6px;border-top:1px solid #E0C97A;margin-top:auto;flex-shrink:0;font-weight:600;}

/* ── ÖNERİLER ── */
.suggest-band{
  position:relative;z-index:20;flex-shrink:0;
  border-top:1.5px solid #E0C97A;
  background:linear-gradient(90deg,#FBF5E6,#FEFDFB 70%);
}
.suggest-header{padding:5px 18px 4px 18px;display:flex;align-items:center;gap:8px;}
.sh-icon{font-size:10px;color:#9A7418;}
.sh-title{font-family:'Orbitron',sans-serif;font-size:7px;font-weight:700;
  letter-spacing:.28em;text-transform:uppercase;color:#9A7418;}
.sh-sub{font-family:'Rajdhani',sans-serif;font-size:7px;letter-spacing:.12em;
  color:#B8A060;margin-left:auto;font-weight:600;}
.suggest-list{padding:3px 18px 7px 18px;display:flex;flex-wrap:wrap;gap:5px;}
.sug-chip{font-family:'Rajdhani',sans-serif;font-size:11px;font-weight:600;letter-spacing:.05em;
  color:#8B6914;padding:2px 10px;background:#FBF0D0;border:1px solid #D4BF78;
  display:flex;align-items:center;gap:4px;}
.sug-chip::before{content:'▲ ';font-size:7px;opacity:.7;}
.sug-empty{font-family:'Rajdhani',sans-serif;font-size:8px;letter-spacing:.18em;color:rgba(26,35,50,.25);font-style:italic;}

/* ── NOTLAR ── */
.notes-band{
  position:relative;z-index:20;flex-shrink:0;
  padding:5px 18px 5px 18px;border-top:1px solid #E8E2D4;
  background:#F8F7F4;display:flex;align-items:flex-start;gap:8px;min-height:26px;
}
.notes-label{font-family:'Rajdhani',sans-serif;font-size:7px;letter-spacing:.3em;
  text-transform:uppercase;color:#A89880;flex-shrink:0;margin-top:1px;font-weight:700;}
.notes-text{font-family:'Rajdhani',sans-serif;font-size:11px;letter-spacing:.03em;
  color:#555;line-height:1.45;font-style:italic;}

/* ── FOOTER ── */
.srv-footer{
  position:relative;z-index:20;flex-shrink:0;
  padding:8px 18px 10px 18px;
  display:grid;grid-template-columns:1fr auto 1fr;align-items:center;
  border-top:2px solid #C9A84C;
  background:linear-gradient(135deg,#1C2B47 0%,#0F1F3D 60%,#162440 100%);
}
.f-shop{display:flex;flex-direction:column;gap:2px;}
.f-shop-name{font-family:'Orbitron',sans-serif;font-size:10px;font-weight:600;
  letter-spacing:.12em;color:#E8E2D4;}
.f-shop-addr{font-family:'Rajdhani',sans-serif;font-size:7.5px;
  letter-spacing:.12em;color:rgba(196,175,100,.45);font-weight:500;}
.f-center{display:flex;flex-direction:column;align-items:center;gap:3px;padding:0 16px;
  border-left:1px solid rgba(196,175,100,.2);border-right:1px solid rgba(196,175,100,.2);}
.f-diam{width:10px;height:10px;transform:rotate(45deg);
  background:linear-gradient(135deg,#C9A84C,#D4AF37,#F0C020);margin-bottom:3px;}
.f-logo{font-family:'Orbitron',sans-serif;font-size:10px;font-weight:700;letter-spacing:.2em;
  background:linear-gradient(90deg,#C9A84C,#D4AF37,#C9A84C);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;white-space:nowrap;}
.f-logo-sub{font-family:'Rajdhani',sans-serif;font-size:6.5px;letter-spacing:.28em;
  color:rgba(196,175,100,.4);text-transform:uppercase;font-weight:600;}
.f-right{display:flex;flex-direction:column;align-items:flex-end;gap:2px;}
.f-phone{font-family:'Orbitron',sans-serif;font-size:10px;font-weight:500;
  letter-spacing:.1em;color:#C9A84C;}
.f-verify{font-family:'Rajdhani',sans-serif;font-size:7px;letter-spacing:.14em;color:rgba(196,175,100,.4);font-weight:600;}

/* ── SAYFA 2 ── */
.p2-bar{position:relative;z-index:20;flex-shrink:0;padding:8px 18px 7px 18px;
  display:flex;align-items:center;gap:10px;
  border-bottom:1.5px solid #C9A84C;
  background:linear-gradient(90deg,#FDFAF4,#FFFFFF 60%);}
.p2-title{font-family:'Orbitron',sans-serif;font-size:8px;font-weight:700;
  letter-spacing:.25em;color:#9A7418;text-transform:uppercase;}
.p2-plate{font-family:'Orbitron',sans-serif;font-size:9.5px;font-weight:700;
  letter-spacing:.2em;color:#1C2B47;background:#F0C020;padding:2px 9px;}
.p2-date{font-family:'Rajdhani',sans-serif;font-size:8.5px;letter-spacing:.14em;color:#A89880;margin-left:auto;font-weight:600;}

@media print{html,body{background:#fff;}.a4{box-shadow:none;}}
`;

const DECOR = `
  <div class="edge-top"></div>
  <div class="edge-left"></div>
  <div class="corner-tr"></div>
  <div class="corner-br"></div>
  <div class="watermark">SERVİS</div>`;

function postProcess(html) {
  return html
    .replace(/(<(?:style|head)[^>]*>)/i, '$1<style>@page{size:A4;margin:0;}</style>')
    .replace(/content="width=[^"]*"/g, 'content="width=794"')
    .replace(/width\s*:\s*100vw/g, 'width: 794px')
    .replace(/height\s*:\s*100vh/g, 'height: 1123px');
}

export function buildServisKartiHTML(data) {
  const {
    make = 'MARKA', model = 'MODEL', year = '', plaka = '',
    fuel = '', color = '', gear = '', kmNow = '', kmNext = '',
    tarih = '', shop = '', addr = '', phone = '',
    logoBase64 = null,
    done = '', parts = '', suggest = '', note = '',
  } = data;

  const doneAll  = splitLines(done);
  const partsAll = splitLines(parts);
  const sugItems = splitCsv(suggest);

  const done1  = doneAll.slice(0, MAX_PER_PANEL);
  const done2  = doneAll.slice(MAX_PER_PANEL);
  const parts1 = partsAll.slice(0, MAX_PER_PANEL);
  const parts2 = partsAll.slice(MAX_PER_PANEL);
  const needsPage2 = done2.length > 0 || parts2.length > 0;

  const FOOTER = `
  <div class="srv-footer">
    <div class="f-shop">
      <div class="f-shop-name">${esc(shop) || 'Servis Adı'}</div>
      <div class="f-shop-addr">${esc(addr)}</div>
    </div>
    <div class="f-center">
      <div class="f-diam"></div>
      <div class="f-logo">AlhazenPDF</div>
      <div class="f-logo-sub">Servis · Bakım Kartı</div>
    </div>
    <div class="f-right">
      <div class="f-phone">${esc(phone) || '—'}</div>
      <div class="f-verify">✓ Dijital Doğrulandı · AlhazenPDF</div>
    </div>
  </div>`;

  const metaItems = [
    fuel  && { k: 'Yakıt',  v: fuel,  cls: 'navy' },
    gear  && { k: 'Vites',  v: gear,  cls: '' },
    color && { k: 'Renk',   v: color, cls: '' },
  ].filter(Boolean);

  const metaHtml = metaItems.map(m =>
    `<div class="vm"><span class="vm-k">${m.k}</span><span class="vm-v ${m.cls}">${esc(m.v)}</span></div>`
  ).join('');

  const page1 = `
<div class="a4">
  ${DECOR}

  <div class="srv-header">
    <div class="h-brand">
      <div class="h-brand-name">AlhazenPDF · Servis</div>
      <div class="h-brand-sub">Teknik Bakım Kartı</div>
    </div>
    <div class="h-badge">
      <div class="h-badge-dot"></div>
      <div class="h-badge-txt">Bakım Tamamlandı</div>
    </div>
    <div class="h-doc">
      <div class="h-doc-no">${esc(docNo(tarih))}</div>
      <div class="h-doc-date">${esc(tarih)}</div>
    </div>
  </div>

  <div class="vehicle-row">
    <div class="logo-box">
      <div class="logo-corner tl"></div><div class="logo-corner br"></div>
      ${logoHtml(logoBase64)}
    </div>
    <div class="veh-info">
      <div class="veh-top">
        <span class="veh-make">${esc(make.toUpperCase())}</span>
        <span class="veh-model">${esc(model.toUpperCase())}</span>
        <span class="veh-year">${esc(year)}</span>
        <span class="veh-plate">${esc(plaka.toUpperCase())}</span>
      </div>
      <div class="veh-meta">
        ${metaHtml}
      </div>
    </div>
  </div>

  <div class="km-band">
    <div class="km-row">
      <span class="km-label">Bakım Yapılan</span>
      <span class="km-val done">${esc(fmtKm(kmNow))}</span>
      <span class="km-arrow">──▶</span>
      <div class="km-track"><div class="km-fill"></div></div>
      <span class="km-arrow">──▶</span>
      <span class="km-val next">${esc(fmtKm(kmNext))}</span>
      <span class="km-label" style="text-align:right;width:72px;">Sonraki Bakım</span>
    </div>
    ${kmDiff(kmNow,kmNext) ? `<div class="km-diff">⧖ ${esc(kmDiff(kmNow,kmNext))}</div>` : ''}
  </div>

  <div class="main-body">
    <div class="panel-left">
      <div class="panel-header">
        <span class="ph-icon">✓</span>
        <span class="ph-title">Yapılan İşlemler</span>
        <span class="ph-count">${doneAll.length} İşlem</span>
      </div>
      <div class="item-list">
        ${done1.length ? done1.map(doneItemHtml).join('') : emptyMsg('İşlem girilmedi')}
        ${done2.length ? `<div class="more-badge">+ ${done2.length} işlem daha → 2. sayfa</div>` : ''}
      </div>
    </div>
    <div class="panel-right">
      <div class="panel-header">
        <span class="ph-icon">◆</span>
        <span class="ph-title">Değiştirilen Parçalar</span>
        <span class="ph-count">${partsAll.length} Parça</span>
      </div>
      <div class="item-list">
        ${parts1.length ? parts1.map(partItemHtml).join('') : emptyMsg('Parça girilmedi')}
        ${parts2.length ? `<div class="more-badge">+ ${parts2.length} parça daha → 2. sayfa</div>` : ''}
      </div>
    </div>
  </div>

  <div class="suggest-band">
    <div class="suggest-header">
      <span class="sh-icon">▲</span>
      <span class="sh-title">Sonraki Bakımda Önerilen İşlemler</span>
      <span class="sh-sub">${sugItems.length > 0 ? sugItems.length + ' Öneri' : '—'}</span>
    </div>
    <div class="suggest-list">
      ${sugItems.length ? sugItems.map(t => `<span class="sug-chip">${esc(t)}</span>`).join('') : '<span class="sug-empty">Öneri girilmedi</span>'}
    </div>
  </div>

  <div class="notes-band">
    <span class="notes-label">Not:</span>
    <span class="notes-text">${esc(note) || 'Teknisyen notu girilmedi.'}</span>
  </div>

  ${FOOTER}
</div>`;

  const page2 = needsPage2 ? `
<div class="a4">
  ${DECOR}
  <div class="p2-bar">
    <span class="p2-title">Bakım Detay Devamı</span>
    <span class="p2-plate">${esc(plaka.toUpperCase())}</span>
    <span class="p2-date">${esc(tarih)}</span>
  </div>
  <div class="main-body">
    <div class="panel-left">
      <div class="panel-header">
        <span class="ph-icon">✓</span>
        <span class="ph-title">Yapılan İşlemler (devam)</span>
        <span class="ph-count">${done2.length} İşlem</span>
      </div>
      <div class="item-list">
        ${done2.length ? done2.map(doneItemHtml).join('') : emptyMsg('—')}
      </div>
    </div>
    <div class="panel-right">
      <div class="panel-header">
        <span class="ph-icon">◆</span>
        <span class="ph-title">Değiştirilen Parçalar (devam)</span>
        <span class="ph-count">${parts2.length} Parça</span>
      </div>
      <div class="item-list">
        ${parts2.length ? parts2.map(partItemHtml).join('') : emptyMsg('—')}
      </div>
    </div>
  </div>
  ${FOOTER}
</div>` : '';

  return postProcess(`<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=595">
<title>Servis Bakım Kartı</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>${CSS}</style>
</head>
<body>
${page1}
${page2}
</body>
</html>`);
}
