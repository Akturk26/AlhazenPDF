/**
 * Expertizli Satış Kartları — A4 PDF Builders
 * Hasar haritası entegre · 595×842px · Print-ready
 */

const formatFiyat = (raw) => {
  const digits = String(raw).replace(/[^\d]/g, '');
  if (!digits) return raw;
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const postProcess = (html, width, height) => {
  const pageSize = `${width}px ${height}px`;
  return html
    .replace(/(<(?:style|head)[^>]*>)/i, `$1<style>@page{size:${pageSize};margin:0;}</style>`)
    .replace(/content="width=device-width[^"]*"/g, `content="width=${width}"`)
    .replace(/width\s*:\s*100vw/g, `width: ${width}px`)
    .replace(/height\s*:\s*100vh/g, `height: ${height}px`);
};

const PART_NAMES = {
  'front-bumper': 'Ön Tampon',
  'hood': 'Kaput',
  'fl-fender': 'Sol Ön Çamurluk',
  'fr-fender': 'Sağ Ön Çamurluk',
  'fl-door': 'Sol Ön Kapı',
  'fr-door': 'Sağ Ön Kapı',
  'roof': 'Tavan',
  'rl-door': 'Sol Arka Kapı',
  'rr-door': 'Sağ Arka Kapı',
  'rl-fender': 'Sol Arka Çamurluk',
  'rr-fender': 'Sağ Arka Çamurluk',
  'trunk': 'Bagaj',
  'rear-bumper': 'Arka Tampon',
};

const getPartStyle = (ekspertizData, partId) => {
  const status = ekspertizData[partId]?.status;
  if (status === 'paint')   return { fill: '#60A5FA', stroke: '#1B7FD4', sw: '1.5' };
  if (status === 'replace') return { fill: '#FBBF24', stroke: '#D97706', sw: '1.5' };
  if (status === 'local')   return { fill: '#34D399', stroke: '#059669', sw: '1.5' };
  return { fill: '#D5D8DC', stroke: '#B8BBBD', sw: '1.2' };
};

const buildMiniCarSVG = (ekspertizData = {}) => {
  const g = (id) => getPartStyle(ekspertizData, id);
  const fb  = g('front-bumper');
  const hd  = g('hood');
  const flf = g('fl-fender');
  const frf = g('fr-fender');
  const fld = g('fl-door');
  const frd = g('fr-door');
  const rf  = g('roof');
  const rld = g('rl-door');
  const rrd = g('rr-door');
  const rlf = g('rl-fender');
  const rrf = g('rr-fender');
  const tr  = g('trunk');
  const rb  = g('rear-bumper');

  return `<svg class="mini-svg" viewBox="0 0 240 400" xmlns="http://www.w3.org/2000/svg">
<defs>
<linearGradient id="mg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="rgba(180,215,245,0.45)"/><stop offset="100%" stop-color="rgba(140,190,230,0.28)"/></linearGradient>
<radialGradient id="mwg" cx="38%" cy="32%" r="65%"><stop offset="0%" stop-color="#C8C8C8"/><stop offset="100%" stop-color="#A0A0A0"/></radialGradient>
<radialGradient id="mwj" cx="38%" cy="32%" r="65%"><stop offset="0%" stop-color="#E0E0E0"/><stop offset="100%" stop-color="#C0C0C0"/></radialGradient>
</defs>
<ellipse cx="120" cy="200" rx="92" ry="182" fill="rgba(0,0,0,0.07)"/>
<path d="M68 12 C68 8 72 6 80 5 L160 5 C168 5 172 8 172 12 L174 30 C174 33 171 35 168 35 L72 35 C69 35 66 33 66 30 Z" fill="${fb.fill}" stroke="${fb.stroke}" stroke-width="${fb.sw}"/>
<path d="M72 35 L168 35 L170 82 C170 85 167 87 164 87 L76 87 C73 87 70 85 70 82 Z" fill="${hd.fill}" stroke="${hd.stroke}" stroke-width="${hd.sw}"/>
<line x1="120" y1="37" x2="120" y2="85" stroke="rgba(0,0,0,0.07)" stroke-width="0.8"/>
<path d="M38 52 C30 56 22 68 18 82 C14 96 14 112 16 122 C18 130 22 135 28 137 L70 135 L70 52 Z" fill="${flf.fill}" stroke="${flf.stroke}" stroke-width="${flf.sw}"/>
<path d="M202 52 C210 56 218 68 222 82 C226 96 226 112 224 122 C222 130 218 135 212 137 L170 135 L170 52 Z" fill="${frf.fill}" stroke="${frf.stroke}" stroke-width="${frf.sw}"/>
<path d="M16 138 L70 135 L70 198 L16 198 C14 198 13 197 13 195 L13 141 C13 139 14 138 16 138 Z" fill="${fld.fill}" stroke="${fld.stroke}" stroke-width="${fld.sw}"/>
<rect x="16" y="160" width="16" height="4" rx="2" fill="rgba(0,0,0,0.1)"/>
<path d="M224 138 L170 135 L170 198 L224 198 C226 198 227 197 227 195 L227 141 C227 139 226 138 224 138 Z" fill="${frd.fill}" stroke="${frd.stroke}" stroke-width="${frd.sw}"/>
<rect x="208" y="160" width="16" height="4" rx="2" fill="rgba(0,0,0,0.08)"/>
<path d="M70 87 L170 87 L170 295 L70 295 Z" fill="${rf.fill}" stroke="${rf.stroke}" stroke-width="${rf.sw}"/>
<line x1="120" y1="90" x2="120" y2="293" stroke="rgba(0,0,0,0.06)" stroke-width="0.8"/>
<path d="M16 200 L70 200 L70 268 L16 268 C14 268 13 267 13 265 L13 203 C13 201 14 200 16 200 Z" fill="${rld.fill}" stroke="${rld.stroke}" stroke-width="${rld.sw}"/>
<rect x="16" y="228" width="16" height="4" rx="2" fill="rgba(0,0,0,0.1)"/>
<path d="M224 200 L170 200 L170 268 L224 268 C226 268 227 267 227 265 L227 203 C227 201 226 200 224 200 Z" fill="${rrd.fill}" stroke="${rrd.stroke}" stroke-width="${rrd.sw}"/>
<rect x="208" y="228" width="16" height="4" rx="2" fill="rgba(0,0,0,0.08)"/>
<path d="M16 270 L70 270 L70 330 L28 333 C22 332 17 328 15 322 C12 312 12 295 14 283 Z" fill="${rlf.fill}" stroke="${rlf.stroke}" stroke-width="${rlf.sw}"/>
<path d="M224 270 L170 270 L170 330 L212 333 C218 332 223 328 225 322 C228 312 228 295 226 283 Z" fill="${rrf.fill}" stroke="${rrf.stroke}" stroke-width="${rrf.sw}"/>
<path d="M70 295 L170 295 L168 338 C166 342 162 344 158 344 L82 344 C78 344 74 342 72 338 Z" fill="${tr.fill}" stroke="${tr.stroke}" stroke-width="${tr.sw}"/>
<line x1="120" y1="297" x2="120" y2="342" stroke="rgba(0,0,0,0.07)" stroke-width="0.8"/>
<rect x="108" y="334" width="24" height="5" rx="2.5" fill="rgba(0,0,0,0.1)"/>
<path d="M72 344 L168 344 C171 344 173 346 173 349 L171 366 C171 370 167 372 162 372 L78 372 C73 372 69 370 69 366 L67 349 C67 346 69 344 72 344 Z" fill="${rb.fill}" stroke="${rb.stroke}" stroke-width="${rb.sw}"/>
<ellipse cx="88" cy="366" rx="7" ry="3.5" fill="rgba(0,0,0,0.14)" stroke="rgba(0,0,0,0.16)" stroke-width="0.7"/>
<ellipse cx="152" cy="366" rx="7" ry="3.5" fill="rgba(0,0,0,0.14)" stroke="rgba(0,0,0,0.16)" stroke-width="0.7"/>
<ellipse cx="88" cy="366" rx="4" ry="2" fill="rgba(0,0,0,0.2)"/>
<ellipse cx="152" cy="366" rx="4" ry="2" fill="rgba(0,0,0,0.2)"/>
<g><circle cx="16" cy="100" r="17" fill="#808080" stroke="#606060" stroke-width="1"/><circle cx="16" cy="100" r="12" fill="url(#mwg)" stroke="#909090" stroke-width="0.8"/><circle cx="16" cy="100" r="7" fill="url(#mwj)" stroke="#A8A8A8" stroke-width="0.6"/><line x1="16" y1="94" x2="16" y2="106" stroke="rgba(0,0,0,0.2)" stroke-width="1"/><line x1="10" y1="97" x2="22" y2="103" stroke="rgba(0,0,0,0.2)" stroke-width="1"/><line x1="10" y1="103" x2="22" y2="97" stroke="rgba(0,0,0,0.2)" stroke-width="1"/><circle cx="16" cy="100" r="2.5" fill="#989898"/></g>
<g><circle cx="224" cy="100" r="17" fill="#808080" stroke="#606060" stroke-width="1"/><circle cx="224" cy="100" r="12" fill="url(#mwg)" stroke="#909090" stroke-width="0.8"/><circle cx="224" cy="100" r="7" fill="url(#mwj)" stroke="#A8A8A8" stroke-width="0.6"/><line x1="224" y1="94" x2="224" y2="106" stroke="rgba(0,0,0,0.2)" stroke-width="1"/><line x1="218" y1="97" x2="230" y2="103" stroke="rgba(0,0,0,0.2)" stroke-width="1"/><line x1="218" y1="103" x2="230" y2="97" stroke="rgba(0,0,0,0.2)" stroke-width="1"/><circle cx="224" cy="100" r="2.5" fill="#989898"/></g>
<g><circle cx="16" cy="305" r="17" fill="#808080" stroke="#606060" stroke-width="1"/><circle cx="16" cy="305" r="12" fill="url(#mwg)" stroke="#909090" stroke-width="0.8"/><circle cx="16" cy="305" r="7" fill="url(#mwj)" stroke="#A8A8A8" stroke-width="0.6"/><line x1="16" y1="299" x2="16" y2="311" stroke="rgba(0,0,0,0.2)" stroke-width="1"/><line x1="10" y1="302" x2="22" y2="308" stroke="rgba(0,0,0,0.2)" stroke-width="1"/><line x1="10" y1="308" x2="22" y2="302" stroke="rgba(0,0,0,0.2)" stroke-width="1"/><circle cx="16" cy="305" r="2.5" fill="#989898"/></g>
<g><circle cx="224" cy="305" r="17" fill="#808080" stroke="#606060" stroke-width="1"/><circle cx="224" cy="305" r="12" fill="url(#mwg)" stroke="#909090" stroke-width="0.8"/><circle cx="224" cy="305" r="7" fill="url(#mwj)" stroke="#A8A8A8" stroke-width="0.6"/><line x1="224" y1="299" x2="224" y2="311" stroke="rgba(0,0,0,0.2)" stroke-width="1"/><line x1="218" y1="302" x2="230" y2="308" stroke="rgba(0,0,0,0.2)" stroke-width="1"/><line x1="218" y1="308" x2="230" y2="302" stroke="rgba(0,0,0,0.2)" stroke-width="1"/><circle cx="224" cy="305" r="2.5" fill="#989898"/></g>
<path d="M13 136 C8 136 4 133 4 129 C4 125 7 123 11 123 L18 124 L18 136 Z" fill="#C8C8C8" stroke="#B0B0B0" stroke-width="0.8"/>
<path d="M227 136 C232 136 236 133 236 129 C236 125 233 123 229 123 L222 124 L222 136 Z" fill="#C8C8C8" stroke="#B0B0B0" stroke-width="0.8"/>
<path d="M70 6 L70 28 L78 28 L78 6 Z" fill="rgba(255,255,200,0.5)" stroke="rgba(200,180,0,0.22)" stroke-width="0.7"/>
<path d="M170 6 L170 28 L162 28 L162 6 Z" fill="rgba(255,255,200,0.5)" stroke="rgba(200,180,0,0.22)" stroke-width="0.7"/>
<path d="M70 344 L72 372 L80 372 L80 344 Z" fill="rgba(196,32,58,0.45)" stroke="rgba(160,0,0,0.2)" stroke-width="0.7"/>
<path d="M170 344 L168 372 L160 372 L160 344 Z" fill="rgba(196,32,58,0.45)" stroke="rgba(160,0,0,0.2)" stroke-width="0.7"/>
<path d="M88 40 L152 40 L153 82 L87 82 Z" fill="url(#mg)" stroke="rgba(100,160,210,0.18)" stroke-width="0.7" opacity="0.65"/>
<path d="M86 297 L154 297 L152 340 L88 340 Z" fill="url(#mg)" stroke="rgba(100,160,210,0.15)" stroke-width="0.7" opacity="0.55"/>
<line x1="13" y1="200" x2="70" y2="200" stroke="rgba(0,0,0,0.1)" stroke-width="0.8"/>
<line x1="170" y1="200" x2="227" y2="200" stroke="rgba(0,0,0,0.1)" stroke-width="0.8"/>
<line x1="70" y1="87" x2="70" y2="295" stroke="rgba(0,0,0,0.08)" stroke-width="0.8"/>
<line x1="170" y1="87" x2="170" y2="295" stroke="rgba(0,0,0,0.08)" stroke-width="0.8"/>
</svg>`;
};

const buildHasarSummary = (ekspertizData = {}) => {
  const entries = Object.entries(ekspertizData);
  if (!entries.length) {
    return `<div style="color:rgba(14,30,42,0.3);font-size:8.5px;font-family:'DM Sans',sans-serif;padding:4px 0">Tüm parçalar orjinal</div>`;
  }
  const paint   = entries.filter(([, v]) => v.status === 'paint');
  const replace = entries.filter(([, v]) => v.status === 'replace');
  const local   = entries.filter(([, v]) => v.status === 'local');

  const row = (dot, stateColor, stateLabel, parts) => parts.length === 0 ? '' : `
<div class="hi-sum-row">
  <div class="hi-sum-dot" style="background:${dot}"></div>
  <div>
    <div class="hi-sum-state" style="color:${stateColor}">${stateLabel}</div>
    <div class="hi-sum-parts">${parts.map(([id]) => PART_NAMES[id] || id).join(', ')}</div>
  </div>
</div>`;

  const rows = row('#60A5FA', '#1B7FD4', 'Boyalı', paint)
             + row('#FBBF24', '#B45309', 'Değişen', replace)
             + row('#34D399', '#047857', 'Lokal', local);

  return rows || `<div style="color:rgba(14,30,42,0.3);font-size:8.5px;font-family:'DM Sans',sans-serif;padding:4px 0">Tüm parçalar orjinal</div>`;
};

const calculateSkor = (ekspertizData = {}) => {
  const parts = Object.values(ekspertizData).filter(p => p.status && p.status !== 'org');
  const penalties = { paint: 5, local: 3, replace: 15 };
  const total = parts.reduce((sum, p) => sum + (penalties[p.status] || 0), 0);
  return Math.max(0, 100 - total);
};

const buildDonanımChips = (donanim = [], max = 14) => {
  if (!donanim.length) return `<div class="dc"><div class="dc-dot"></div><div class="dc-txt">Donanım bilgisi girilmemiş</div></div>`;
  const shown = donanim.slice(0, max);
  const extra = donanim.length - shown.length;
  const chips = shown.map(item => `<div class="dc"><div class="dc-dot"></div><div class="dc-txt">${item}</div></div>`).join('');
  const more  = extra > 0
    ? `<div class="dc dc-overflow" style="opacity:0.6;border-style:dashed;align-self:center"><div class="dc-txt">+${extra} özellik daha</div></div>`
    : '';
  return chips + more;
};

/* ═══════════════════════════════════════════════════════════
   SALDA KORSAN — Deniz mavisi · Korsan altını
   ═══════════════════════════════════════════════════════════ */
export const buildSaldaKorsanHTML = (data) => {
  const { formData = {}, photos = [], companyName = '', ekspertizData = {}, donanim = [], tramer = true } = data;

  const photo     = photos[0]?.base64 || '';
  const marka     = formData['Marka']    || 'MARKA';
  const model     = formData['Model']    || 'Model';
  const yil       = String(formData['Yıl'] || '2024').replace(/\./g, '');
  const yakit     = formData['Yakıt']    || 'Benzin';
  const motor     = formData['Motor']    || '—';
  const sanziman  = formData['Şanzıman'] || '—';
  const km        = formData['KM']       || '0 km';
  const renk      = formData['Renk']     || '—';
  const telefon   = formData['Telefon']  || '';
  const fiyat     = formatFiyat((formData['Fiyat'] || '0').replace(/\s*₺\s*/g, '').trim());
  const kasaTipi  = formData['Kasa Tipi'] || '—';
  const muayene   = formData['Muayene']  || '—';
  const bagaj     = formData['Bagaj']    || '—';
  const garanti   = formData['Garanti']  || '—';

  const skor        = calculateSkor(ekspertizData);
  const miniSVG     = buildMiniCarSVG(ekspertizData);
  const hasarSum    = buildHasarSummary(ekspertizData);
  const donChips    = buildDonanımChips(donanim);
  const tramerColor = tramer ? '#16A34A' : '#DC2626';
  const tramerTxt   = tramer ? 'Tramer Kaydı Yok' : 'Tramer Kaydı Var';

  const html = `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=595">
<link href="https://fonts.googleapis.com/css2?family=Pirata+One&family=Barlow+Condensed:wght@300;400;500;600;700;800;900&family=DM+Sans:wght@300;400;500&family=Share+Tech+Mono&family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400;1,600&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:#050D10;font-family:'DM Sans',sans-serif}
:root{--sea:#0E1E2A;--wave:#1A3040;--gold:#C4A020;--gold2:#E8C840;--red:#C41E3A;--red2:#E83050;--sand:#F2EDD4}
.a4{width:595px;height:842px;position:relative;overflow:hidden;display:flex;flex-direction:column;background:var(--sand);-webkit-print-color-adjust:exact;print-color-adjust:exact}
.tex{position:absolute;inset:0;z-index:1;pointer-events:none;background:radial-gradient(ellipse 80% 60% at 15% 20%,rgba(180,150,80,0.08) 0%,transparent 55%),radial-gradient(ellipse 60% 50% at 85% 75%,rgba(160,120,60,0.06) 0%,transparent 50%)}
/* HEADER */
.hdr{height:76px;flex-shrink:0;position:relative;z-index:20;background:var(--sea);display:flex;flex-direction:column}
.hdr-stripe{height:5px;background:linear-gradient(90deg,var(--red) 0%,var(--red) 8%,var(--gold) 12%,var(--gold2) 20%,var(--gold) 28%,var(--red) 32%,var(--red) 50%,var(--gold) 54%,var(--gold2) 62%,var(--gold) 70%,var(--red) 74%,var(--red) 100%)}
.hdr-body{flex:1;padding:0 22px;display:flex;justify-content:space-between;align-items:center}
.hdr-left{display:flex;align-items:center;gap:12px}
.hdr-skull{width:36px;height:36px;border:1.5px solid rgba(196,160,32,0.5);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;background:rgba(196,32,58,0.12)}
.hdr-galeri{font-family:'Pirata One',cursive;font-size:16px;letter-spacing:0.08em;color:rgba(242,237,212,0.92);line-height:1}
.hdr-sub{font-family:'Barlow Condensed',sans-serif;font-size:8px;font-weight:500;letter-spacing:0.48em;text-transform:uppercase;color:rgba(196,160,32,0.5);margin-top:3px}
.alh{display:flex;align-items:center;gap:6px;padding:5px 12px 5px 8px;border:1px solid rgba(196,160,32,0.45);background:rgba(196,160,32,0.08)}
.alh-d{width:7px;height:7px;transform:rotate(45deg);background:linear-gradient(135deg,var(--gold2),var(--gold));box-shadow:0 0 8px rgba(196,160,32,0.65);flex-shrink:0}
.alh-t{font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;background:linear-gradient(90deg,var(--gold),var(--gold2),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
/* HERO */
.hero{height:108px;flex-shrink:0;position:relative;z-index:20;background:var(--sea);display:flex;align-items:flex-end;overflow:hidden}
.hero-wave-bg{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 70% 80% at 80% 50%,rgba(26,48,64,0.8) 0%,transparent 65%),linear-gradient(180deg,var(--sea) 0%,rgba(14,30,42,0.95) 100%)}
.hero-wave-lines{position:absolute;inset:0;pointer-events:none;overflow:hidden}
.hero-wave-lines::before{content:'';position:absolute;left:-20px;right:-20px;bottom:-4px;height:32px;background:repeating-linear-gradient(90deg,transparent,transparent 8px,rgba(196,160,32,0.08) 8px,rgba(196,160,32,0.08) 9px);border-top:1px solid rgba(196,160,32,0.18)}
.hero-make{position:relative;z-index:2;font-family:'Pirata One',cursive;font-size:84px;line-height:0.82;letter-spacing:0.04em;color:var(--sand);text-shadow:2px 3px 0 rgba(0,0,0,0.5),0 0 40px rgba(196,160,32,0.15);padding:0 0 12px 22px}
.hero-right{position:absolute;right:22px;bottom:14px;z-index:2;text-align:right}
.hero-model{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:300;font-style:italic;letter-spacing:0.16em;background:linear-gradient(90deg,var(--red),var(--gold),var(--gold2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1}
.hero-year-tag{display:inline-flex;align-items:center;gap:6px;margin-top:5px;padding:3px 10px;background:rgba(196,32,58,0.15);border:1px solid rgba(196,32,58,0.4)}
.hero-year-txt{font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.2em;color:rgba(232,48,80,0.85)}
.hero-rule{position:absolute;bottom:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--red) 0%,var(--red2) 20%,transparent 40%,transparent 60%,var(--gold) 80%,var(--gold2) 100%)}
/* FOTO */
.photo{height:230px;flex-shrink:0;position:relative;overflow:hidden;z-index:15;background:linear-gradient(160deg,#0A1820,#060E14,#0C1820)}
.photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.photo-txt{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:'Pirata One',cursive;font-size:13px;letter-spacing:0.4em;color:rgba(242,237,212,0.05);pointer-events:none}
.photo-accent{position:absolute;left:0;top:0;bottom:0;width:5px;z-index:3;background:linear-gradient(180deg,var(--red) 0%,var(--red2) 30%,var(--gold) 50%,var(--gold2) 55%,var(--gold) 60%,var(--red2) 80%,var(--red) 100%)}
.photo-fade-t{position:absolute;top:0;left:0;right:0;height:50px;background:linear-gradient(180deg,rgba(6,14,20,0.6),transparent);z-index:2;pointer-events:none}
.photo-fade-b{position:absolute;bottom:0;left:0;right:0;height:80px;background:linear-gradient(180deg,transparent,var(--sand));z-index:2;pointer-events:none}
.photo-chips{position:absolute;top:12px;right:14px;z-index:4;display:flex;flex-direction:column;gap:5px;align-items:flex-end}
.chip{display:flex;align-items:center;gap:7px;padding:5px 11px;background:rgba(6,14,20,0.75);border:1px solid rgba(196,160,32,0.3)}
.chip-lbl{font-family:'Barlow Condensed',sans-serif;font-size:7.5px;font-weight:600;letter-spacing:0.4em;text-transform:uppercase;color:rgba(242,237,212,0.35)}
.chip-val{font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;color:rgba(242,237,212,0.9)}
.chip-val.g{color:var(--gold2)}
.chip-val.r{color:var(--red2)}
.photo-price-bg{position:absolute;bottom:18px;left:18px;z-index:4;pointer-events:none}
.ppb-label{font-family:'Barlow Condensed',sans-serif;font-size:7.5px;font-weight:600;letter-spacing:0.45em;text-transform:uppercase;color:rgba(196,160,32,0.45);margin-bottom:1px}
.ppb-val{font-family:'Pirata One',cursive;font-size:34px;letter-spacing:0.02em;color:rgba(242,237,212,0.18);line-height:1;text-shadow:0 2px 8px rgba(0,0,0,0.5)}
.cn{position:absolute;z-index:4}
.cn::before,.cn::after{content:'';position:absolute}
.cn.tl{top:0;left:0;width:20px;height:20px}.cn.tl::before{top:0;left:0;right:0;height:2px;background:var(--red)}.cn.tl::after{top:0;left:0;bottom:0;width:2px;background:var(--red)}
.cn.tr{top:0;right:0;width:20px;height:20px}.cn.tr::before{top:0;left:0;right:0;height:2px;background:var(--gold)}.cn.tr::after{top:0;right:0;bottom:0;width:2px;background:var(--gold)}
.cn.bl{bottom:0;left:0;width:20px;height:20px}.cn.bl::before{bottom:0;left:0;right:0;height:2px;background:rgba(242,237,212,0.2)}.cn.bl::after{top:0;left:0;bottom:0;width:2px;background:rgba(242,237,212,0.2)}
.cn.br{bottom:0;right:0;width:20px;height:20px}.cn.br::before{bottom:0;left:0;right:0;height:2px;background:rgba(196,160,32,0.3)}.cn.br::after{top:0;right:0;bottom:0;width:2px;background:rgba(196,160,32,0.3)}
/* ORTA */
.mid{height:256px;flex-shrink:0;display:flex;z-index:20;position:relative;background:var(--sand);border-top:1px solid rgba(14,30,42,0.1);border-bottom:2px solid var(--sea)}
.col-hasar{width:200px;flex-shrink:0;border-right:1px solid rgba(14,30,42,0.1);display:flex;flex-direction:column}
.col-title{height:26px;flex-shrink:0;background:var(--wave);padding:0 14px;display:flex;align-items:center;gap:7px}
.ct-skull{font-size:11px}
.ct-txt{font-family:'Barlow Condensed',sans-serif;font-size:8.5px;font-weight:700;letter-spacing:0.5em;text-transform:uppercase;color:rgba(196,160,32,0.7)}
.hasar-body{flex:1;display:flex;padding:8px 10px 8px 8px;gap:8px;align-items:flex-start;overflow:hidden}
.mini-svg-wrap{flex-shrink:0}
.mini-svg{width:90px;height:146px;filter:drop-shadow(0 2px 10px rgba(0,0,0,0.15))}
.hasar-info{flex:1;display:flex;flex-direction:column;gap:5px;padding-top:2px}
.hi-legend{display:flex;flex-direction:column;gap:3px;margin-bottom:3px}
.hi-li{display:flex;align-items:center;gap:5px}
.hi-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.hi-name{font-family:'Barlow Condensed',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:rgba(14,30,42,0.55)}
.hi-div{height:1px;background:rgba(14,30,42,0.1);margin:2px 0}
.hi-sum{display:flex;flex-direction:column;gap:4px}
.hi-sum-row{display:flex;align-items:flex-start;gap:4px}
.hi-sum-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;margin-top:2px}
.hi-sum-state{font-family:'Barlow Condensed',sans-serif;font-size:8px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;line-height:1}
.hi-sum-parts{font-family:'DM Sans',sans-serif;font-size:8.5px;color:rgba(14,30,42,0.5);line-height:1.3;margin-top:1px}
.hi-footer{margin-top:auto;padding-top:5px;border-top:1px solid rgba(14,30,42,0.1)}
.hi-tramer{display:flex;align-items:center;gap:5px;margin-bottom:5px}
.hi-tramer-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
.hi-tramer-txt{font-family:'Barlow Condensed',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase}
.hi-score-row{display:flex;align-items:center;gap:5px}
.hi-score-lbl{font-family:'Barlow Condensed',sans-serif;font-size:8px;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:rgba(14,30,42,0.3);flex-shrink:0}
.hi-score-bar{flex:1;height:5px;background:rgba(14,30,42,0.1);border-radius:3px;overflow:hidden}
.hi-score-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,var(--red),var(--gold),var(--gold2))}
.hi-score-num{font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:900;color:var(--gold);flex-shrink:0}
.col-bilgi{flex:1;display:flex;flex-direction:column;overflow:hidden}
.bilgi-table{flex:1;overflow:hidden;display:flex;flex-direction:column;border-bottom:1px solid rgba(14,30,42,0.08)}
.bt-row{flex:1;display:grid;grid-template-columns:1fr 1fr 1fr;border-bottom:1px solid rgba(14,30,42,0.07)}
.bt-row:last-child{border-bottom:none}
.bt-item{display:flex;align-items:center;gap:6px;padding:0 10px;border-right:1px solid rgba(14,30,42,0.07)}
.bt-item:last-child{border-right:none}
.bt-ico{font-size:13px;flex-shrink:0;width:20px;text-align:center}
.bt-content{display:flex;flex-direction:column;gap:1px}
.bt-lbl{font-family:'Barlow Condensed',sans-serif;font-size:7px;font-weight:700;letter-spacing:0.4em;text-transform:uppercase;color:rgba(14,30,42,0.3)}
.bt-val{font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:800;letter-spacing:0.03em;color:var(--sea);line-height:1.1}
.bt-val.gold{color:var(--gold)}
.bt-val.green{color:#16A34A}
.bilgi-score{padding:8px 14px;border-bottom:1px solid rgba(14,30,42,0.08);display:flex;align-items:center;gap:10px}
.bs-lbl{font-family:'Barlow Condensed',sans-serif;font-size:8px;font-weight:700;letter-spacing:0.38em;text-transform:uppercase;color:rgba(14,30,42,0.3);flex-shrink:0}
.bs-bar-wrap{flex:1}
.bs-bar{height:6px;border-radius:3px;background:rgba(14,30,42,0.1);overflow:hidden;margin-bottom:3px}
.bs-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,var(--red),var(--gold),var(--gold2))}
.bs-nums{display:flex;justify-content:space-between}
.bs-n{font-family:'Barlow Condensed',sans-serif;font-size:7px;font-weight:600;letter-spacing:0.2em;color:rgba(14,30,42,0.28);text-transform:uppercase}
.bs-big{font-family:'Pirata One',cursive;font-size:28px;color:var(--gold);flex-shrink:0;line-height:1;text-shadow:0 0 12px rgba(196,160,32,0.3)}
.bs-unit{font-family:'Barlow Condensed',sans-serif;font-size:8px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(14,30,42,0.3);flex-shrink:0;align-self:flex-end;padding-bottom:4px}
/* DONANIM */
.donanim{height:90px;flex-shrink:0;position:relative;z-index:20;background:var(--wave);padding:10px 22px;border-bottom:3px solid var(--sea);overflow:hidden}
.donanim::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--red) 0%,var(--red2) 10%,var(--gold) 18%,var(--gold2) 28%,var(--gold) 38%,transparent 50%,var(--gold) 62%,var(--gold2) 72%,var(--gold) 82%,var(--red2) 90%,var(--red) 100%)}
.don-title{font-family:'Barlow Condensed',sans-serif;font-size:8.5px;font-weight:700;letter-spacing:0.52em;text-transform:uppercase;color:rgba(196,160,32,0.55);margin-bottom:7px}
.don-chips{display:flex;flex-wrap:wrap;gap:4px}
.dc{display:flex;align-items:center;gap:4px;padding:4px 9px;background:rgba(14,30,42,0.4);border:1px solid rgba(196,160,32,0.15);border-bottom:1.5px solid rgba(196,32,58,0.3);border-radius:2px}
.dc-dot{width:4px;height:4px;border-radius:50%;background:var(--red);flex-shrink:0}
.dc-txt{font-family:'Barlow Condensed',sans-serif;font-size:9px;font-weight:600;letter-spacing:0.08em;color:rgba(242,237,212,0.72);white-space:nowrap}
/* FOOTER */
.footer{height:82px;flex-shrink:0;position:relative;z-index:20;background:var(--sea);display:flex;flex-direction:column}
.footer-stripe{height:4px;background:linear-gradient(90deg,var(--red) 0%,var(--red) 8%,var(--gold) 12%,var(--gold2) 22%,var(--gold) 32%,var(--red) 36%,var(--red) 50%,var(--gold) 54%,var(--gold2) 64%,var(--gold) 74%,var(--red) 78%,var(--red) 100%)}
.footer-body{flex:1;padding:0 22px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center}
.f-galeri{font-family:'Pirata One',cursive;font-size:14px;letter-spacing:0.1em;color:rgba(242,237,212,0.88);line-height:1}
.f-detail{font-family:'Share Tech Mono',monospace;font-size:8px;letter-spacing:0.1em;color:rgba(242,237,212,0.2);line-height:1.8;margin-top:3px}
.f-phone{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:400;font-style:italic;letter-spacing:0.04em;color:rgba(196,160,32,0.75);margin-top:2px}
.f-alh{display:flex;flex-direction:column;align-items:center;gap:2px;padding:0 20px;border-left:1px solid rgba(255,255,255,0.06);border-right:1px solid rgba(255,255,255,0.06)}
.f-alh-skull{font-size:16px;margin-bottom:1px}
.f-alh-n{font-family:'Pirata One',cursive;font-size:16px;letter-spacing:0.1em;background:linear-gradient(90deg,var(--gold),var(--gold2),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;white-space:nowrap}
.f-alh-t{font-family:'Barlow Condensed',sans-serif;font-size:7px;letter-spacing:0.48em;text-transform:uppercase;color:rgba(196,32,58,0.5)}
.f-price{text-align:right}
.f-plbl{font-family:'Barlow Condensed',sans-serif;font-size:7.5px;letter-spacing:0.48em;text-transform:uppercase;color:rgba(242,237,212,0.25);margin-bottom:2px}
.f-pval{font-family:'Pirata One',cursive;font-size:22px;letter-spacing:0.02em;color:rgba(242,237,212,0.92);line-height:1}
.f-psub{font-family:'Barlow Condensed',sans-serif;font-size:7.5px;letter-spacing:0.4em;text-transform:uppercase;color:rgba(196,160,32,0.45);margin-top:2px}
.footer-legal{height:18px;flex-shrink:0;padding:0 22px;border-top:1px solid rgba(255,255,255,0.04);display:flex;align-items:center;justify-content:space-between;background:rgba(0,0,0,0.2)}
.fl-txt{font-family:'DM Sans',sans-serif;font-size:7px;color:rgba(242,237,212,0.13)}
.fl-alh{font-family:'Barlow Condensed',sans-serif;font-size:7px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;color:rgba(196,160,32,0.28)}
@media print{body{background:white;padding:0}.a4{width:210mm;height:297mm;box-shadow:none}}
</style>
</head>
<body>
<div class="a4">
<div class="tex"></div>

<div class="hdr">
  <div class="hdr-stripe"></div>
  <div class="hdr-body">
    <div class="hdr-left">
      <div class="hdr-skull">☠️</div>
      <div>
        <div class="hdr-galeri">${companyName || 'Galeri Adı'}</div>
        <div class="hdr-sub">Yetkili Galeri · AlhazenPDF</div>
      </div>
    </div>
    <div class="alh"><div class="alh-d"></div><div class="alh-t">AlhazenPDF</div></div>
  </div>
</div>

<div class="hero">
  <div class="hero-wave-bg"></div>
  <div class="hero-wave-lines"></div>
  <div class="hero-make">${marka}</div>
  <div class="hero-right">
    <div class="hero-model">${model}</div>
    <div class="hero-year-tag">
      <div class="hero-year-txt">⚓ ${yil} · ${yakit}</div>
    </div>
  </div>
  <div class="hero-rule"></div>
</div>

<div class="photo"${photo ? ' style="background:none"' : ''}>
  ${photo ? `<img src="${photo}" />` : '<div class="photo-txt">Araç Fotoğrafı</div>'}
  <div class="photo-accent"></div>
  <div class="photo-fade-t"></div>
  <div class="photo-fade-b"></div>
  <div class="photo-chips">
    <div class="chip"><div class="chip-lbl">KM</div><div class="chip-val g">${km}</div></div>
    <div class="chip"><div class="chip-lbl">Renk</div><div class="chip-val">${renk}</div></div>
    <div class="chip"><div class="chip-lbl">Muayene</div><div class="chip-val r">${muayene}</div></div>
  </div>
  <div class="photo-price-bg">
    <div class="ppb-label">İstenen Fiyat</div>
    <div class="ppb-val">${fiyat} ₺</div>
  </div>
  <div class="cn tl"></div><div class="cn tr"></div><div class="cn bl"></div><div class="cn br"></div>
</div>

<div class="mid">
  <div class="col-hasar">
    <div class="col-title"><div class="ct-skull">⚓</div><div class="ct-txt">Hasar &amp; Boya</div></div>
    <div class="hasar-body">
      <div class="mini-svg-wrap">${miniSVG}</div>
      <div class="hasar-info">
        <div class="hi-legend">
          <div class="hi-li"><div class="hi-dot" style="background:#D5D8DC;border:1px solid #B8BBBD"></div><div class="hi-name">Orjinal</div></div>
          <div class="hi-li"><div class="hi-dot" style="background:#60A5FA"></div><div class="hi-name" style="color:#1B7FD4">Boyalı</div></div>
          <div class="hi-li"><div class="hi-dot" style="background:#FBBF24"></div><div class="hi-name" style="color:#B45309">Değişen</div></div>
          <div class="hi-li"><div class="hi-dot" style="background:#34D399"></div><div class="hi-name" style="color:#047857">Lokal</div></div>
        </div>
        <div class="hi-div"></div>
        <div class="hi-sum">${hasarSum}</div>
        <div class="hi-footer">
          <div class="hi-tramer">
            <div class="hi-tramer-dot" style="background:${tramerColor};box-shadow:0 0 5px ${tramerColor}66"></div>
            <div class="hi-tramer-txt" style="color:${tramerColor}">${tramerTxt}</div>
          </div>
          <div class="hi-score-row">
            <div class="hi-score-lbl">Skor</div>
            <div class="hi-score-bar"><div class="hi-score-fill" style="width:${skor}%"></div></div>
            <div class="hi-score-num">${skor}</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="col-bilgi">
    <div class="col-title"><div class="ct-skull">⚓</div><div class="ct-txt">Araç Bilgileri</div></div>
    <div class="bilgi-table">
      <div class="bt-row">
        <div class="bt-item"><div class="bt-ico">🔧</div><div class="bt-content"><div class="bt-lbl">Motor</div><div class="bt-val gold">${motor}</div></div></div>
        <div class="bt-item"><div class="bt-ico">⚡</div><div class="bt-content"><div class="bt-lbl">Şanzıman</div><div class="bt-val">${sanziman}</div></div></div>
        <div class="bt-item"><div class="bt-ico">⛽</div><div class="bt-content"><div class="bt-lbl">Yakıt</div><div class="bt-val">${yakit}</div></div></div>
      </div>
      <div class="bt-row">
        <div class="bt-item"><div class="bt-ico">📍</div><div class="bt-content"><div class="bt-lbl">Kilometre</div><div class="bt-val gold">${km}</div></div></div>
        <div class="bt-item"><div class="bt-ico">🎨</div><div class="bt-content"><div class="bt-lbl">Renk</div><div class="bt-val">${renk}</div></div></div>
        <div class="bt-item"><div class="bt-ico">🚘</div><div class="bt-content"><div class="bt-lbl">Kasa Tipi</div><div class="bt-val">${kasaTipi}</div></div></div>
      </div>
      <div class="bt-row">
        <div class="bt-item"><div class="bt-ico">✅</div><div class="bt-content"><div class="bt-lbl">Muayene</div><div class="bt-val green">${muayene}</div></div></div>
        <div class="bt-item"><div class="bt-ico">🧳</div><div class="bt-content"><div class="bt-lbl">Bagaj</div><div class="bt-val">${bagaj}</div></div></div>
        <div class="bt-item"><div class="bt-ico">🛡️</div><div class="bt-content"><div class="bt-lbl">Garanti</div><div class="bt-val green">${garanti}</div></div></div>
      </div>
    </div>
    <div class="bilgi-score">
      <div class="bs-lbl">Durum</div>
      <div class="bs-bar-wrap">
        <div class="bs-bar"><div class="bs-fill" style="width:${skor}%"></div></div>
        <div class="bs-nums">
          <div class="bs-n">Kötü</div>
          <div class="bs-n" style="color:var(--gold)">İyi Durum</div>
          <div class="bs-n">Mükemmel</div>
        </div>
      </div>
      <div class="bs-big">${skor}</div>
      <div class="bs-unit">/ 100</div>
    </div>
  </div>
</div>

<div class="donanim">
  <div class="don-title">⚓ Standart Donanım</div>
  <div class="don-chips">${donChips}</div>
</div>

<div class="footer">
  <div class="footer-stripe"></div>
  <div class="footer-body">
    <div class="f-contact">
      <div class="f-galeri">${companyName || 'Galeri Adı'}</div>
      <div class="f-detail">AlhazenPDF · Expertizli Satış Kartı</div>
      <div class="f-phone">${telefon}</div>
    </div>
    <div class="f-alh">
      <div class="f-alh-skull">☠️</div>
      <div class="f-alh-n">AlhazenPDF</div>
      <div class="f-alh-t">Salda · Korsan · Satış Kartı</div>
    </div>
    <div class="f-price">
      <div class="f-plbl">İstenen Fiyat</div>
      <div class="f-pval">${fiyat} ₺</div>
      <div class="f-psub">KDV Dahil · Takas Görüşülür</div>
    </div>
  </div>
  <div class="footer-legal">
    <div class="fl-txt">Fiyat ve stok bilgileri değişiklik gösterebilir. Araç bilgileri resmi kayıtlardan alınmıştır.</div>
    <div class="fl-alh">AlhazenPDF</div>
  </div>
</div>

</div>
</body>
</html>`;

  return postProcess(html, 595, 842);
};

/* ═══════════════════════════════════════════════════════════
   KOZMİK MUKARNAS — Derin uzay · Nebula · Atom geometri
   ═══════════════════════════════════════════════════════════ */
export const buildKozmikMukarnasHTML = (data) => {
  const { formData = {}, photos = [], companyName = '', ekspertizData = {}, donanim = [], tramer = true } = data;

  const photo     = photos[0]?.base64 || '';
  const marka     = formData['Marka']    || 'MARKA';
  const model     = formData['Model']    || 'Model';
  const yil       = String(formData['Yıl'] || '2024').replace(/\./g, '');
  const yakit     = formData['Yakıt']    || 'Benzin';
  const motor     = formData['Motor']    || '—';
  const sanziman  = formData['Şanzıman'] || '—';
  const km        = formData['KM']       || '0 km';
  const renk      = formData['Renk']     || '—';
  const fiyat     = formatFiyat((formData['Fiyat'] || '0').replace(/\s*₺\s*/g, '').trim());
  const kasaTipi  = formData['Kasa Tipi'] || '—';
  const muayene   = formData['Muayene']  || '—';
  const bagaj     = formData['Bagaj']    || '—';
  const garanti   = formData['Garanti']  || '—';
  const telefon   = formData['Telefon']  || '';

  const skor        = calculateSkor(ekspertizData);
  const miniSVG     = buildMiniCarSVG(ekspertizData);
  const hasarSum    = buildHasarSummary(ekspertizData);
  const donChips    = buildDonanımChips(donanim);
  const tramerColor = tramer ? '#16A34A' : '#DC2626';
  const tramerTxt   = tramer ? 'Tramer Kaydı Yok' : 'Tramer Kaydı Var';

  const html = `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AlhazenPDF · Kozmik Mukarnas</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,600&family=Barlow+Condensed:wght@200;300;400;500;600;700;800;900&family=Share+Tech+Mono&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
body { background: var(--void); font-family: 'Barlow Condensed', sans-serif; }
:root {
  --void:#04030A;--deep1:#080618;--deep2:#0E0A24;--nebula1:#1A0E3A;--nebula2:#2A1660;--nebula3:#3D2280;
  --pillar1:#0A1F16;--pillar2:#0D2B1F;--pillar3:#1A4A32;--pillar4:#2E7A50;
  --crim1:#4A0F28;--crim2:#8B1A42;--crim3:#C23B5A;
  --plasma1:#003850;--plasma2:#005A78;--plasma3:#00A0C8;--plasma4:#00C8E0;--plasma5:#80E8F4;
  --atom1:#003A38;--atom2:#006B68;--atom3:#00C8C0;--atom4:#00E5D4;--atom5:#80F5EE;
  --gold1:#5A4010;--gold2:#A87820;--gold3:#D4A840;--gold4:#E8C060;--gold5:#F8E090;
  --star:#F0EFFF;--star2:#C8E8FF;--star3:#A0C8FF;--ink:#F2F0FF;--ink2:#D4D0F0;--ink3:#A8A4C8;--ink4:#7A78A0;
}
.a4 {
  width:595px; height:842px; position:relative; overflow:hidden;
  display:flex; flex-direction:column; background:#14102A;
  -webkit-print-color-adjust:exact; print-color-adjust:exact;
}
.nebula-bg {
  position:absolute; inset:0; z-index:0; pointer-events:none;
  background:
    radial-gradient(ellipse 55% 40% at 85% 18%, rgba(194,59,90,0.14) 0%, transparent 70%),
    radial-gradient(ellipse 45% 55% at 8% 55%, rgba(92,45,143,0.18) 0%, transparent 65%),
    radial-gradient(ellipse 60% 35% at 20% 90%, rgba(46,122,80,0.12) 0%, transparent 60%),
    radial-gradient(ellipse 40% 30% at 92% 78%, rgba(0,200,224,0.10) 0%, transparent 55%),
    linear-gradient(180deg, #121028 0%, #180E34 35%, #10122A 65%, #0C0E20 100%);
}
.star-field {
  position:absolute; inset:0; z-index:1; pointer-events:none; opacity:0.55;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23n)'/%3E%3C/svg%3E");
  mix-blend-mode:screen;
}
.mukarnas-border { position:absolute; inset:0; z-index:3; pointer-events:none; }
.mukarnas-border::before { content:''; position:absolute; inset:3px; border:1px solid rgba(0,200,224,0.07); }
.mukarnas-border::after  { content:''; position:absolute; inset:5px; border:1px solid rgba(92,45,143,0.08); }
.hdr {
  height:54px; flex-shrink:0;
  background:linear-gradient(180deg,#0E0C28 0%,#141030 100%);
  position:relative; z-index:20;
  display:flex; align-items:center; padding:0 22px; justify-content:space-between;
}
.hdr::before {
  content:''; position:absolute; top:0; left:0; right:0; height:2px;
  background:linear-gradient(90deg,transparent 0%,var(--atom2) 8%,var(--atom3) 22%,var(--atom4) 38%,var(--atom5) 50%,var(--atom4) 62%,var(--atom3) 78%,var(--atom2) 92%,transparent 100%);
  filter:blur(0.5px);
}
.hdr::after {
  content:''; position:absolute; bottom:0; left:0; right:0; height:1.5px;
  background:linear-gradient(90deg,transparent 0%,var(--gold2) 10%,var(--gold3) 28%,var(--gold4) 42%,var(--gold5) 50%,var(--gold4) 62%,var(--gold3) 76%,var(--gold2) 90%,transparent 100%);
  opacity:0.6;
}
.hdr-left { display:flex; align-items:center; gap:14px; }
.hdr-logo {
  width:36px; height:36px; display:flex; align-items:center; justify-content:center;
  position:relative; flex-shrink:0; border:1px solid rgba(0,200,224,0.2);
  background:rgba(0,100,120,0.15); border-radius:50%;
}
.hdr-logo svg { width:24px; height:24px; }
.hdr-galeri { font-family:'Cinzel',serif; font-size:12.5px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:var(--star); line-height:1; }
.hdr-sub { font-family:'Share Tech Mono',monospace; font-size:7px; letter-spacing:0.16em; color:rgba(0,200,224,0.35); margin-top:3px; }
.hdr-badge { display:flex; align-items:center; gap:6px; padding:5px 12px 5px 8px; border:1px solid rgba(92,45,143,0.5); background:rgba(42,22,96,0.4); }
.hdr-badge-gem { width:8px; height:8px; flex-shrink:0; background:radial-gradient(circle at 35% 35%,var(--plasma5),var(--plasma3)); border-radius:50%; }
.hdr-badge-t { font-family:'Barlow Condensed',sans-serif; font-size:10.5px; font-weight:800; letter-spacing:0.22em; text-transform:uppercase; color:var(--plasma4); }
.brand-blk {
  height:112px; flex-shrink:0; position:relative; z-index:20; display:flex; overflow:hidden;
  background:linear-gradient(180deg,#161230 0%,#1A1438 60%,#1C163C 100%);
}
.brand-blk::before {
  content:''; position:absolute; inset:0;
  background:radial-gradient(ellipse 70% 100% at 60% 50%,rgba(92,45,143,0.12) 0%,transparent 70%),radial-gradient(ellipse 40% 80% at 95% 50%,rgba(194,59,90,0.06) 0%,transparent 60%);
  pointer-events:none;
}
.brand-blk::after {
  content:''; position:absolute; right:140px; top:50%; transform:translateY(-50%);
  width:160px; height:160px;
  background:repeating-conic-gradient(from 22.5deg at 50% 50%,rgba(0,200,224,0.025) 0deg 45deg,rgba(92,45,143,0.02) 45deg 90deg);
  border-radius:50%; pointer-events:none;
}
.brand-left { flex:1; padding:12px 0 10px 22px; display:flex; flex-direction:column; justify-content:flex-end; position:relative; z-index:1; }
.brand-year-wm {
  position:absolute; right:-6px; top:50%; transform:translateY(-50%);
  font-family:'Cinzel',serif; font-size:108px; font-weight:900; letter-spacing:-0.03em;
  color:rgba(0,200,224,0.03); line-height:1; pointer-events:none; user-select:none; z-index:0;
}
.brand-tag { display:flex; align-items:center; gap:8px; margin-bottom:5px; position:relative; z-index:1; }
.brand-tag-atom { display:flex; align-items:center; gap:3px; flex-shrink:0; }
.brand-tag-atom .nucleus { width:5px; height:5px; border-radius:50%; background:radial-gradient(circle at 35% 35%,var(--atom5),var(--atom3)); }
.brand-tag-atom .trail { width:18px; height:1px; background:linear-gradient(90deg,var(--atom3),transparent); }
.brand-tag-txt { font-family:'Barlow Condensed',sans-serif; font-size:7.5px; font-weight:700; letter-spacing:0.6em; text-transform:uppercase; color:var(--ink3); }
.brand-make {
  font-family:'Cinzel',serif; font-size:68px; font-weight:900; line-height:0.85; letter-spacing:0.07em;
  background:linear-gradient(180deg,var(--star) 0%,var(--star2) 50%,var(--star3) 100%);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  position:relative; z-index:1;
}
.brand-model {
  font-family:'Cormorant Garamond',serif; font-size:21px; font-weight:400; font-style:italic;
  letter-spacing:0.1em; line-height:1; margin-top:5px;
  background:linear-gradient(90deg,var(--gold2),var(--gold3),var(--gold4),var(--gold5),var(--gold4));
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  position:relative; z-index:1;
}
.brand-right {
  width:154px; flex-shrink:0; padding:12px 22px 10px 0;
  display:flex; flex-direction:column; justify-content:flex-end; align-items:flex-end;
  position:relative; z-index:1;
}
.br-expertiz-badge { display:flex; align-items:center; gap:5px; padding:4px 10px; background:linear-gradient(135deg,var(--nebula2),var(--nebula1)); border:1px solid rgba(92,45,143,0.5); margin-bottom:8px; }
.br-expertiz-txt { font-family:'Barlow Condensed',sans-serif; font-size:8.5px; font-weight:800; letter-spacing:0.3em; text-transform:uppercase; color:var(--plasma4); }
.br-expertiz-dot { width:5px; height:5px; border-radius:50%; flex-shrink:0; background:radial-gradient(circle at 35% 35%,var(--plasma5),var(--plasma3)); }
.br-year { font-family:'Barlow Condensed',sans-serif; font-size:10px; font-weight:400; letter-spacing:0.38em; text-transform:uppercase; color:var(--ink3); margin-bottom:1px; text-align:right; }
.br-price-lbl { font-family:'Barlow Condensed',sans-serif; font-size:7px; font-weight:600; letter-spacing:0.5em; text-transform:uppercase; color:var(--ink3); text-align:right; }
.br-price { font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:600; letter-spacing:0.02em; color:var(--star); line-height:1; text-align:right; }
.photo-blk {
  height:294px; flex-shrink:0; position:relative; overflow:hidden; z-index:15;
  background:linear-gradient(160deg,#100E30,#0A0A28,#140E34);
}
.photo-blk::before {
  content:''; position:absolute; inset:0;
  background:
    radial-gradient(ellipse 35% 80% at 12% 60%,rgba(13,43,31,0.85) 0%,rgba(26,74,50,0.5) 40%,transparent 70%),
    radial-gradient(ellipse 55% 70% at 50% 30%,rgba(60,35,120,0.55) 0%,rgba(38,22,80,0.35) 50%,transparent 80%),
    radial-gradient(ellipse 40% 65% at 88% 50%,rgba(130,35,75,0.45) 0%,rgba(90,20,50,0.25) 50%,transparent 75%),
    radial-gradient(ellipse 30% 30% at 55% 5%,rgba(0,200,224,0.12) 0%,transparent 60%);
  pointer-events:none; z-index:0;
}
.photo-blk::after {
  content:''; position:absolute; inset:0; z-index:1; pointer-events:none;
  background-image:
    radial-gradient(circle 1px at 15% 20%,rgba(240,239,255,0.7) 0%,transparent 1px),
    radial-gradient(circle 1px at 72% 15%,rgba(240,239,255,0.6) 0%,transparent 1px),
    radial-gradient(circle 1px at 88% 35%,rgba(200,232,255,0.5) 0%,transparent 1px),
    radial-gradient(circle 1px at 35% 45%,rgba(240,239,255,0.4) 0%,transparent 1px),
    radial-gradient(circle 1px at 60% 60%,rgba(240,239,255,0.55) 0%,transparent 1px),
    radial-gradient(circle 1px at 25% 75%,rgba(200,232,255,0.5) 0%,transparent 1px),
    radial-gradient(circle 2px at 48% 28%,rgba(255,255,255,0.6) 0%,transparent 2px);
}
.photo-placeholder {
  position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
  font-family:'Cinzel',serif; font-size:10px; letter-spacing:0.5em;
  color:rgba(200,232,255,0.04); pointer-events:none; text-align:center; z-index:2;
}
.photo-img {
  position:absolute; inset:0; z-index:2;
  background-size:cover; background-position:center; background-repeat:no-repeat;
}
.photo-accent {
  position:absolute; left:0; top:0; bottom:0; width:5px; z-index:4;
  background:linear-gradient(180deg,var(--atom2) 0%,var(--atom3) 20%,var(--plasma3) 40%,var(--nebula3) 60%,var(--crim2) 80%,var(--pillar3) 100%);
}
.photo-gt { position:absolute; top:0; left:0; right:0; height:55px; background:linear-gradient(180deg,rgba(7,5,26,0.85) 0%,transparent 100%); z-index:3; pointer-events:none; }
.photo-gb { position:absolute; bottom:0; left:0; right:0; height:90px; background:linear-gradient(180deg,transparent,#14102A); z-index:3; pointer-events:none; }
.photo-chips { position:absolute; top:10px; right:14px; z-index:5; display:flex; gap:5px; align-items:flex-end; flex-direction:column; }
.pchip { display:flex; align-items:center; gap:7px; padding:5px 11px; background:rgba(16,12,48,0.88); border:1px solid rgba(0,200,224,0.2); backdrop-filter:blur(8px); }
.pchip-l { font-family:'Barlow Condensed',sans-serif; font-size:7px; font-weight:600; letter-spacing:0.38em; text-transform:uppercase; color:rgba(0,200,224,0.4); }
.pchip-v { font-family:'Barlow Condensed',sans-serif; font-size:13px; font-weight:700; color:var(--star); }
.pchip-v.glow { color:var(--plasma4); }
.pchip-v.ok { color:var(--atom4); display:flex; align-items:center; gap:4px; }
.photo-seal { position:absolute; bottom:16px; left:18px; z-index:5; }
.ps-outer { width:68px; height:68px; border-radius:50%; border:1px solid rgba(0,200,224,0.25); display:flex; align-items:center; justify-content:center; position:relative; background:rgba(4,3,20,0.6); }
.ps-orbit { position:absolute; inset:-4px; border-radius:50%; border:1px dashed rgba(0,200,224,0.15); }
.ps-orbit2 { position:absolute; inset:5px; border-radius:50%; border:1px dashed rgba(92,45,143,0.2); }
.ps-inner { width:50px; height:50px; border-radius:50%; border:1px solid rgba(92,45,143,0.3); display:flex; align-items:center; justify-content:center; background:rgba(10,8,30,0.8); }
.ps-center { display:flex; flex-direction:column; align-items:center; gap:1px; }
.ps-star { font-size:11px; line-height:1; background:linear-gradient(135deg,var(--atom4),var(--plasma4)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.ps-title { font-family:'Barlow Condensed',sans-serif; font-size:5.5px; font-weight:800; letter-spacing:0.16em; text-transform:uppercase; color:rgba(0,200,224,0.5); text-align:center; line-height:1.3; }
.ps-date { font-family:'Share Tech Mono',monospace; font-size:5.5px; color:rgba(92,45,143,0.5); letter-spacing:0.1em; margin-top:1px; }
.cn { position:absolute; z-index:5; }
.cn::before,.cn::after { content:''; position:absolute; }
.cn.tl { top:0; left:0; width:20px; height:20px; }
.cn.tl::before { top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--atom3),transparent); }
.cn.tl::after  { top:0;left:0;bottom:0;width:2px;background:linear-gradient(180deg,var(--atom3),transparent); }
.cn.tr { top:0; right:0; width:20px; height:20px; }
.cn.tr::before { top:0;left:0;right:0;height:2px;background:linear-gradient(270deg,var(--plasma3),transparent); }
.cn.tr::after  { top:0;right:0;bottom:0;width:2px;background:linear-gradient(180deg,var(--plasma3),transparent); }
.cn.br { bottom:0; right:0; width:20px; height:20px; }
.cn.br::before { bottom:0;left:0;right:0;height:2px;background:linear-gradient(270deg,rgba(92,45,143,0.5),transparent); }
.cn.br::after  { top:0;right:0;bottom:0;width:2px;background:linear-gradient(0deg,rgba(92,45,143,0.5),transparent); }
.sep { height:6px; flex-shrink:0; z-index:20; position:relative; overflow:hidden; }
.sep::before { content:''; position:absolute; inset:0; background:var(--void); }
.sep::after {
  content:''; position:absolute; inset:0;
  background-image:repeating-linear-gradient(90deg,var(--atom3) 0px,var(--atom3) 3px,var(--nebula3) 3px,var(--nebula3) 6px,var(--crim2) 6px,var(--crim2) 9px,var(--plasma3) 9px,var(--plasma3) 12px,var(--pillar3) 12px,var(--pillar3) 15px,var(--gold3) 15px,var(--gold3) 18px,var(--void) 18px,var(--void) 24px);
  opacity:0.65;
}
.middle { height:200px; flex-shrink:0; display:flex; z-index:20; position:relative; background:linear-gradient(180deg,#14102A 0%,#121028 100%); }
.mid-left { flex:1; border-right:1px solid rgba(0,200,224,0.08); display:flex; flex-direction:column; overflow:hidden; }
.mid-section-title { height:22px; flex-shrink:0; padding:0 16px; display:flex; align-items:center; gap:7px; border-bottom:1px solid rgba(0,200,224,0.07); background:rgba(0,120,150,0.1); }
.mst-atom { display:flex; align-items:center; gap:3px; flex-shrink:0; }
.mst-atom-core { width:4px; height:4px; border-radius:50%; background:radial-gradient(circle at 35% 35%,var(--atom5),var(--atom3)); }
.mst-atom-trail { width:10px; height:1px; background:linear-gradient(90deg,var(--atom3),transparent); }
.mst-txt { font-family:'Barlow Condensed',sans-serif; font-size:7.5px; font-weight:700; letter-spacing:0.55em; text-transform:uppercase; color:var(--ink3); }
.id-grid { display:grid; grid-template-columns:1fr 1fr; flex:1; }
.id-cell { display:flex; flex-direction:column; justify-content:center; padding:0 15px; border-right:1px solid rgba(0,200,224,0.05); border-bottom:1px solid rgba(0,200,224,0.05); min-height:44px; }
.id-cell:nth-child(even) { border-right:none; }
.id-cell:nth-last-child(-n+2) { border-bottom:none; }
.id-lbl { font-family:'Barlow Condensed',sans-serif; font-size:7px; font-weight:700; letter-spacing:0.45em; text-transform:uppercase; color:var(--ink4); line-height:1; }
.id-val { font-family:'Cinzel',serif; font-size:14px; font-weight:700; letter-spacing:0.03em; color:var(--star); line-height:1; margin-top:2px; }
.id-val.plasma { color:var(--plasma4); }
.id-val.green  { color:var(--atom4); }
.id-val.sm     { font-size:11.5px; font-weight:600; color:var(--ink2); }
.id-sub { font-family:'Barlow Condensed',sans-serif; font-size:8px; font-weight:400; letter-spacing:0.1em; color:var(--ink4); margin-top:1px; }
.mid-right { width:188px; flex-shrink:0; display:flex; flex-direction:column; overflow:hidden; }
.hasar-body-inner { flex:1; display:flex; padding:8px 10px 6px 8px; gap:8px; align-items:flex-start; overflow:hidden; }
.mini-svg { width:82px; height:133px; flex-shrink:0; }
.hasar-right { flex:1; display:flex; flex-direction:column; gap:4px; padding-top:1px; }
.hr-legend { display:flex; flex-direction:column; gap:3px; }
.hr-li { display:flex; align-items:center; gap:5px; }
.hr-dot { width:8px; height:8px; flex-shrink:0; border-radius:50%; }
.hr-name { font-family:'Barlow Condensed',sans-serif; font-size:9px; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; color:var(--ink3); }
.hr-div { height:1px; background:rgba(0,200,224,0.08); margin:3px 0; }
.hr-sum { display:flex; flex-direction:column; gap:4px; }
.hi-sum-row { display:flex; align-items:flex-start; gap:4px; }
.hi-sum-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; margin-top:2px; }
.hi-sum-state { font-family:'Barlow Condensed',sans-serif; font-size:8px; font-weight:800; letter-spacing:0.14em; text-transform:uppercase; line-height:1; }
.hi-sum-parts { font-family:'DM Sans',sans-serif; font-size:8px; color:var(--ink4); line-height:1.3; margin-top:1px; }
.hasar-footer { flex-shrink:0; padding:6px 10px 7px; border-top:1px solid rgba(0,200,224,0.06); background:rgba(0,120,150,0.08); }
.hf-tramer { display:flex; align-items:center; gap:5px; margin-bottom:5px; }
.hf-tramer-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
.hf-tramer-txt { font-family:'Barlow Condensed',sans-serif; font-size:9px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; }
.hf-score { display:flex; align-items:center; gap:6px; }
.hf-score-lbl { font-family:'Barlow Condensed',sans-serif; font-size:7.5px; font-weight:600; letter-spacing:0.3em; text-transform:uppercase; color:var(--ink4); flex-shrink:0; }
.hf-score-bar { flex:1; height:4px; background:rgba(0,200,224,0.08); border-radius:2px; overflow:hidden; }
.hf-score-fill { height:100%; border-radius:2px; background:linear-gradient(90deg,var(--pillar3),var(--atom3),var(--plasma4),var(--atom5)); }
.hf-score-num { font-family:'Barlow Condensed',sans-serif; font-size:14px; font-weight:900; color:var(--atom4); }
.donanim {
  height:82px; flex-shrink:0; position:relative; z-index:20; padding:10px 20px;
  background:linear-gradient(180deg,#0E2018 0%,#0A1810 100%); overflow:hidden;
}
.donanim::before {
  content:''; position:absolute; inset:0;
  background:radial-gradient(ellipse 60% 100% at 20% 50%,rgba(20,60,38,0.7) 0%,transparent 70%),radial-gradient(ellipse 40% 100% at 85% 50%,rgba(0,120,150,0.2) 0%,transparent 60%);
  pointer-events:none;
}
.donanim::after {
  content:''; position:absolute; top:0; left:0; right:0; height:1.5px;
  background:linear-gradient(90deg,transparent,var(--pillar3) 15%,var(--atom3) 40%,var(--plasma4) 50%,var(--atom3) 60%,var(--pillar3) 85%,transparent);
}
.don-title { font-family:'Barlow Condensed',sans-serif; font-size:7.5px; font-weight:700; letter-spacing:0.55em; text-transform:uppercase; color:rgba(0,200,120,0.4); margin-bottom:7px; position:relative; z-index:1; }
.don-chips { display:flex; flex-wrap:wrap; gap:4px; position:relative; z-index:1; }
.dc { display:flex; align-items:center; gap:4px; padding:4px 9px; background:rgba(20,60,38,0.7); border:1px solid rgba(46,122,80,0.3); border-bottom:1.5px solid rgba(0,200,120,0.3); }
.dc-dot { width:3px; height:3px; border-radius:50%; background:var(--atom3); flex-shrink:0; }
.dc-txt { font-family:'Barlow Condensed',sans-serif; font-size:9px; font-weight:600; letter-spacing:0.06em; color:rgba(160,245,220,0.75); white-space:nowrap; }
.footer {
  height:94px; flex-shrink:0; background:linear-gradient(180deg,#100E28 0%,#0C0A20 100%);
  position:relative; z-index:20; display:flex; flex-direction:column; overflow:hidden;
}
.footer::before {
  content:''; position:absolute; inset:0;
  background:radial-gradient(ellipse 50% 80% at 50% 50%,rgba(42,22,96,0.2) 0%,transparent 70%);
  pointer-events:none;
}
.footer-stripe {
  height:3px; position:relative; z-index:1;
  background:linear-gradient(90deg,transparent 0%,var(--gold1) 5%,var(--gold2) 15%,var(--gold3) 28%,var(--gold4) 40%,var(--gold5) 50%,var(--gold4) 60%,var(--gold3) 72%,var(--gold2) 85%,var(--gold1) 95%,transparent 100%);
}
.footer-body { flex:1; padding:0 22px; display:grid; grid-template-columns:1fr auto 1fr; align-items:center; position:relative; z-index:1; }
.f-galeri { font-family:'Cinzel',serif; font-size:11.5px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:var(--star); line-height:1; }
.f-detail { font-family:'Share Tech Mono',monospace; font-size:7px; letter-spacing:0.1em; color:rgba(200,232,255,0.18); line-height:2; margin-top:2px; }
.f-phone { font-family:'Cormorant Garamond',serif; font-size:15px; font-weight:400; font-style:italic; letter-spacing:0.04em; color:rgba(212,168,64,0.7); margin-top:1px; }
.f-alh { display:flex; flex-direction:column; align-items:center; gap:2px; padding:0 20px; border-left:1px solid rgba(0,200,224,0.06); border-right:1px solid rgba(0,200,224,0.06); position:relative; z-index:1; }
.f-alh-cosmos { font-size:9px; letter-spacing:3px; line-height:1; margin-bottom:1px; color:var(--atom3); }
.f-alh-n { font-family:'Cinzel',serif; font-size:13px; font-weight:700; letter-spacing:0.22em; text-transform:uppercase; color:var(--gold4); white-space:nowrap; }
.f-alh-sub { font-family:'Barlow Condensed',sans-serif; font-size:6.5px; letter-spacing:0.45em; text-transform:uppercase; color:rgba(0,200,224,0.28); }
.f-price-block { text-align:right; position:relative; z-index:1; }
.f-plbl { font-family:'Barlow Condensed',sans-serif; font-size:7px; letter-spacing:0.5em; text-transform:uppercase; color:rgba(200,232,255,0.18); margin-bottom:1px; }
.f-pval { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:var(--star); line-height:1; }
.f-psub { font-family:'Barlow Condensed',sans-serif; font-size:7px; letter-spacing:0.42em; text-transform:uppercase; color:rgba(212,168,64,0.38); margin-top:2px; }
.footer-legal { height:16px; flex-shrink:0; padding:0 22px; border-top:1px solid rgba(0,200,224,0.04); background:rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:space-between; position:relative; z-index:1; }
.fl-txt { font-family:'Cormorant Garamond',serif; font-size:7px; color:rgba(200,232,255,0.08); font-style:italic; }
.fl-tag { font-family:'Barlow Condensed',sans-serif; font-size:6.5px; font-weight:700; letter-spacing:0.3em; text-transform:uppercase; color:rgba(212,168,64,0.25); }
</style>
</head>
<body>
<div class="a4">
  <div class="nebula-bg"></div>
  <div class="star-field"></div>
  <div class="mukarnas-border"></div>

  <div class="hdr">
    <div class="hdr-left">
      <div class="hdr-logo">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="12" cy="12" rx="10" ry="4" stroke="rgba(0,200,224,0.45)" stroke-width="0.7" transform="rotate(0 12 12)"/>
          <ellipse cx="12" cy="12" rx="10" ry="4" stroke="rgba(92,45,143,0.4)" stroke-width="0.7" transform="rotate(60 12 12)"/>
          <ellipse cx="12" cy="12" rx="10" ry="4" stroke="rgba(0,200,224,0.3)" stroke-width="0.7" transform="rotate(120 12 12)"/>
          <circle cx="12" cy="12" r="2.2" fill="url(#atom-grad)" stroke="rgba(0,229,212,0.5)" stroke-width="0.5"/>
          <circle cx="22" cy="12" r="1.2" fill="#00E5D4" opacity="0.8"/>
          <circle cx="7" cy="4.5" r="1" fill="#5C2D8F" opacity="0.8"/>
          <circle cx="7" cy="19.5" r="1" fill="#00A0C8" opacity="0.7"/>
          <defs><radialGradient id="atom-grad" cx="35%" cy="35%"><stop offset="0%" stop-color="#80F5EE"/><stop offset="100%" stop-color="#006B68"/></radialGradient></defs>
        </svg>
      </div>
      <div>
        <div class="hdr-galeri">${companyName || 'Galeri'}</div>
        <div class="hdr-sub">YETKİLİ GALERİ · TÜRKİYE</div>
      </div>
    </div>
    <div class="hdr-badge">
      <div class="hdr-badge-gem"></div>
      <div class="hdr-badge-t">AlhazenPDF</div>
    </div>
  </div>

  <div class="brand-blk">
    <div class="brand-left">
      <div class="brand-year-wm">${yil}</div>
      <div class="brand-tag">
        <div class="brand-tag-atom">
          <span class="nucleus"></span><span class="trail"></span><span class="nucleus"></span>
        </div>
        <div class="brand-tag-txt">Sertifikalı Araç · Expertiz Onaylı</div>
      </div>
      <div class="brand-make">${marka}</div>
      <div class="brand-model">${model} · ${yakit} · ${sanziman}</div>
    </div>
    <div class="brand-right">
      <div class="br-expertiz-badge">
        <div class="br-expertiz-dot"></div>
        <div class="br-expertiz-txt">Expertiz</div>
      </div>
      <div class="br-year">${yil} MODEL</div>
      <div class="br-price-lbl">Satış Fiyatı</div>
      <div class="br-price">${fiyat} ₺</div>
    </div>
  </div>

  <div class="photo-blk"${photo ? ` style="background:none"` : ''}>
    ${photo ? `<div class="photo-img" style="background-image:url('${photo}');background-size:cover;background-position:center;background-repeat:no-repeat;position:absolute;inset:0;z-index:2;"></div>` : '<div class="photo-placeholder">Araç Fotoğrafı</div>'}
    <div class="photo-accent"></div>
    <div class="photo-gt"></div>
    <div class="photo-gb"></div>
    <div class="cn tl"></div><div class="cn tr"></div><div class="cn br"></div>
    <div class="photo-chips">
      <div class="pchip"><div class="pchip-l">Yıl</div><div class="pchip-v glow">${yil}</div></div>
      <div class="pchip"><div class="pchip-l">km</div><div class="pchip-v">${km}</div></div>
      <div class="pchip"><div class="pchip-l">Renk</div><div class="pchip-v">${renk}</div></div>
    </div>
    <div class="photo-seal">
      <div class="ps-outer">
        <div class="ps-orbit"></div><div class="ps-orbit2"></div>
        <div class="ps-inner">
          <div class="ps-center">
            <div class="ps-star">✦</div>
            <div class="ps-title">EXPERTİZ<br>ONAYLIDIR</div>
            <div class="ps-date">2026</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="sep"></div>

  <div class="middle">
    <div class="mid-left">
      <div class="mid-section-title">
        <div class="mst-atom"><div class="mst-atom-core"></div><div class="mst-atom-trail"></div></div>
        <div class="mst-txt">Araç Kimlik Bilgileri</div>
      </div>
      <div class="id-grid">
        <div class="id-cell"><div class="id-lbl">Marka / Model</div><div class="id-val sm">${marka} ${model}</div></div>
        <div class="id-cell"><div class="id-lbl">Model Yılı</div><div class="id-val plasma">${yil}</div></div>
        <div class="id-cell"><div class="id-lbl">Kilometre</div><div class="id-val">${km}</div></div>
        <div class="id-cell"><div class="id-lbl">Yakıt / Vites</div><div class="id-val sm">${yakit} / ${sanziman}</div></div>
        <div class="id-cell"><div class="id-lbl">Motor Hacmi</div><div class="id-val">${motor}</div></div>
        <div class="id-cell"><div class="id-lbl">Renk</div><div class="id-val sm">${renk}</div></div>
        <div class="id-cell"><div class="id-lbl">Kasa Tipi</div><div class="id-val sm">${kasaTipi}</div></div>
        <div class="id-cell"><div class="id-lbl">Muayene</div><div class="id-val green">${muayene}</div></div>
      </div>
    </div>
    <div class="mid-right">
      <div class="mid-section-title">
        <div class="mst-atom"><div class="mst-atom-core"></div><div class="mst-atom-trail"></div></div>
        <div class="mst-txt">Hasar Haritası</div>
      </div>
      <div class="hasar-body-inner">
        ${miniSVG}
        <div class="hasar-right">
          <div class="hr-legend">
            <div class="hr-li"><div class="hr-dot" style="background:#282838;border:1px solid #404060"></div><div class="hr-name">Orjinal</div></div>
            <div class="hr-li"><div class="hr-dot" style="background:#1A3850;border:1px solid #2A5878"></div><div class="hr-name" style="color:#4A8BA8">Boyalı</div></div>
            <div class="hr-li"><div class="hr-dot" style="background:#4A0F28;border:1px solid #8B1A42"></div><div class="hr-name" style="color:#C23B5A">Değişen</div></div>
            <div class="hr-li"><div class="hr-dot" style="background:#0D2B1F;border:1px solid #1A4A32"></div><div class="hr-name" style="color:#2E7A50">Lokal</div></div>
          </div>
          <div class="hr-div"></div>
          <div class="hr-sum">${hasarSum}</div>
        </div>
      </div>
      <div class="hasar-footer">
        <div class="hf-tramer">
          <div class="hf-tramer-dot" style="background:${tramerColor}"></div>
          <div class="hf-tramer-txt" style="color:${tramerColor}">${tramerTxt}</div>
        </div>
        <div class="hf-score">
          <div class="hf-score-lbl">Skor</div>
          <div class="hf-score-bar"><div class="hf-score-fill" style="width:${skor}%"></div></div>
          <div class="hf-score-num">${skor}</div>
        </div>
      </div>
    </div>
  </div>

  <div class="donanim">
    <div class="don-title">Standart Donanım</div>
    <div class="don-chips">${donChips}</div>
  </div>

  <div class="footer">
    <div class="footer-stripe"></div>
    <div class="footer-body">
      <div>
        <div class="f-galeri">${companyName || 'Galeri'}</div>
        <div class="f-phone">${telefon}</div>
      </div>
      <div class="f-alh">
        <div class="f-alh-cosmos">✦ · ✦</div>
        <div class="f-alh-n">AlhazenPDF</div>
        <div class="f-alh-sub">Kozmik · Mukarnas · Tema</div>
      </div>
      <div class="f-price-block">
        <div class="f-plbl">Satış Fiyatı</div>
        <div class="f-pval">${fiyat} ₺</div>
        <div class="f-psub">KDV Dahil · Takas Görüşülür</div>
      </div>
    </div>
    <div class="footer-legal">
      <div class="fl-txt">Bu belge expertiz onaylıdır. Fiyat ve stok bilgileri değişiklik gösterebilir.</div>
      <div class="fl-tag">AlhazenPDF · Kozmik Mukarnas</div>
    </div>
  </div>

</div>
</body>
</html>`;
  return postProcess(html, 595, 842);
};

/* ═══════════════════════════════════════════════════════════
   İBN-ÜL HEYSEM — Kitabül Menazir · Parşömen · Işık spektrumu
   ═══════════════════════════════════════════════════════════ */
export const buildIbnulHeysemHTML = (data) => {
  const { formData = {}, photos = [], companyName = '', ekspertizData = {}, donanim = [], tramer = true } = data;

  const photo     = photos[0]?.base64 || '';
  const marka     = formData['Marka']    || 'MARKA';
  const model     = formData['Model']    || 'Model';
  const yil       = String(formData['Yıl'] || '2024').replace(/\./g, '');
  const yakit     = formData['Yakıt']    || 'Benzin';
  const motor     = formData['Motor']    || '—';
  const sanziman  = formData['Şanzıman'] || '—';
  const km        = formData['KM']       || '0 km';
  const renk      = formData['Renk']     || '—';
  const fiyat     = formatFiyat((formData['Fiyat'] || '0').replace(/\s*₺\s*/g, '').trim());
  const kasaTipi  = formData['Kasa Tipi'] || '—';
  const muayene   = formData['Muayene']  || '—';
  const bagaj     = formData['Bagaj']    || '—';
  const garanti   = formData['Garanti']  || '—';
  const telefon   = formData['Telefon']  || '';

  const skor        = calculateSkor(ekspertizData);
  const miniSVG     = buildMiniCarSVG(ekspertizData);
  const hasarSum    = buildHasarSummary(ekspertizData);
  const donChips    = buildDonanımChips(donanim);
  const tramerColor = tramer ? '#16A34A' : '#DC2626';
  const tramerTxt   = tramer ? 'Tramer Kaydı Yok' : 'Tramer Kaydı Var';

  const html = `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AlhazenPDF · Kitabül Menazir</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Barlow+Condensed:wght@200;300;400;500;600;700;800;900&family=DM+Sans:wght@300;400;500&family=Share+Tech+Mono&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{background:#05080F;font-family:'DM Sans',sans-serif;}
:root{
  --void:#060A14;--deep:#0C1428;--ocean:#142240;
  --light:#E8C84A;--light2:#F4DC7A;--amber:#C49A1A;
  --parch:#F5EDD8;--parch2:#EDE0C4;--copper:#B87440;
  --teal:#2A7A8A;--prism:#4AAABB;
}
.a4{width:595px;height:842px;position:relative;overflow:hidden;display:flex;flex-direction:column;background:var(--parch);-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.grain{
  position:absolute;inset:0;z-index:1;pointer-events:none;
  background:radial-gradient(ellipse 90% 70% at 15% 25%,rgba(210,180,120,0.12) 0%,transparent 55%),radial-gradient(ellipse 70% 60% at 85% 75%,rgba(180,150,90,0.08) 0%,transparent 50%);
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.68' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23n)' opacity='0.038'/%3E%3C/svg%3E");
}
.geo-pattern{
  position:absolute;inset:0;z-index:0;pointer-events:none;opacity:0.028;
  background-image:
    repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(180,140,40,1) 39px,rgba(180,140,40,1) 40px),
    repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(180,140,40,1) 39px,rgba(180,140,40,1) 40px),
    repeating-linear-gradient(45deg,transparent,transparent 27px,rgba(180,140,40,0.6) 27px,rgba(180,140,40,0.6) 28px),
    repeating-linear-gradient(-45deg,transparent,transparent 27px,rgba(180,140,40,0.6) 27px,rgba(180,140,40,0.6) 28px);
}
.hdr{height:80px;flex-shrink:0;background:var(--void);position:relative;z-index:20;display:flex;flex-direction:column;overflow:hidden;}
.hdr-light-ray{position:absolute;top:-20px;left:-40px;width:300px;height:140px;background:linear-gradient(125deg,transparent 0%,rgba(232,200,74,0.04) 30%,rgba(244,220,122,0.08) 50%,rgba(232,200,74,0.04) 70%,transparent 100%);transform:skewX(-15deg);pointer-events:none;}
.hdr-geo{position:absolute;inset:0;pointer-events:none;opacity:0.06;background:radial-gradient(circle 40px at 20% 50%,rgba(232,200,74,1) 0%,transparent 70%),radial-gradient(circle 40px at 25% 50%,transparent 0%,rgba(232,200,74,0.3) 40%,transparent 70%);}
.hdr-body{flex:1;padding:0 24px;display:flex;justify-content:space-between;align-items:center;position:relative;z-index:2;}
.hdr-ibn{display:flex;align-items:center;gap:16px;}
.hdr-eye{width:44px;height:44px;flex-shrink:0;display:flex;align-items:center;justify-content:center;}
.hdr-arabic{font-family:'Cinzel',serif;font-size:9px;font-weight:400;letter-spacing:0.35em;color:rgba(232,200,74,0.5);margin-bottom:3px;font-style:italic;}
.hdr-latin{font-family:'Cinzel',serif;font-size:17px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(245,237,216,0.92);line-height:1;}
.hdr-title{font-family:'Cormorant Garamond',serif;font-size:11px;font-weight:300;font-style:italic;letter-spacing:0.12em;color:rgba(196,154,26,0.6);margin-top:3px;}
.hdr-badge{display:flex;flex-direction:column;align-items:flex-end;gap:5px;}
.hdr-badge-main{display:flex;align-items:center;gap:6px;padding:5px 12px 5px 7px;border:1px solid rgba(232,200,74,0.38);background:rgba(232,200,74,0.07);}
.hdr-badge-d{width:7px;height:7px;transform:rotate(45deg);flex-shrink:0;background:linear-gradient(135deg,var(--light2),var(--amber));}
.hdr-badge-t{font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;color:var(--light);}
.hdr-doc-no{font-family:'Share Tech Mono',monospace;font-size:7.5px;letter-spacing:0.18em;color:rgba(232,200,74,0.28);}
.hdr-rule{height:4px;flex-shrink:0;background:linear-gradient(90deg,var(--void) 0%,var(--teal) 10%,var(--prism) 18%,var(--light) 28%,var(--light2) 38%,var(--amber) 48%,var(--copper) 55%,var(--light) 62%,var(--prism) 72%,var(--teal) 80%,var(--void) 100%);}
.hero{height:108px;flex-shrink:0;background:var(--parch);position:relative;z-index:20;display:flex;align-items:flex-end;overflow:hidden;}
.hero-geo-corner{position:absolute;right:-10px;top:-10px;width:120px;height:120px;pointer-events:none;opacity:0.07;}
.hero-year-wm{position:absolute;right:14px;top:50%;transform:translateY(-50%);font-family:'Cinzel',serif;font-size:96px;font-weight:900;letter-spacing:-0.02em;color:rgba(0,0,0,0.06);line-height:1;pointer-events:none;user-select:none;}
.hero-content{padding:0 0 14px 24px;flex:1;position:relative;z-index:1;}
.hero-tag{display:flex;align-items:center;gap:8px;margin-bottom:5px;}
.hero-tag-orn{width:20px;height:20px;flex-shrink:0;position:relative;}
.hero-tag-orn::before{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(45deg);width:8px;height:8px;border:1.5px solid var(--amber);}
.hero-tag-orn::after{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:5px;height:5px;background:var(--light);border-radius:50%;}
.hero-tag-txt{font-family:'Barlow Condensed',sans-serif;font-size:8.5px;font-weight:700;letter-spacing:0.65em;text-transform:uppercase;color:rgba(0,0,0,0.3);}
.hero-tag-line{flex:1;height:1px;background:linear-gradient(90deg,rgba(196,154,26,0.3),transparent);}
.hero-make{font-family:'Cinzel',serif;font-size:72px;font-weight:900;line-height:0.82;letter-spacing:0.06em;color:#0C0C0C;}
.hero-model{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:400;font-style:italic;letter-spacing:0.18em;line-height:1;margin-top:4px;background:linear-gradient(90deg,#6A4A00,#C49A1A,#E8C84A,#F4DC7A,#E8C84A,#C49A1A);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.hero-right{padding:0 24px 14px 0;text-align:right;flex-shrink:0;position:relative;z-index:1;}
.hr-year{font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:500;letter-spacing:0.4em;text-transform:uppercase;color:rgba(0,0,0,0.3);margin-bottom:3px;}
.hr-series{font-family:'Cormorant Garamond',serif;font-size:14px;font-weight:300;font-style:italic;letter-spacing:0.1em;color:rgba(0,0,0,0.45);margin-bottom:6px;}
.hr-price{font-family:'Cinzel',serif;font-size:24px;font-weight:700;color:#0C0C0C;line-height:1;}
.hr-price-sub{font-family:'Barlow Condensed',sans-serif;font-size:8px;font-weight:500;letter-spacing:0.4em;text-transform:uppercase;color:rgba(196,154,26,0.6);margin-top:2px;}
.light-band{height:8px;flex-shrink:0;position:relative;z-index:20;background:var(--deep);}
.light-band::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,var(--deep) 0%,var(--teal) 8%,var(--prism) 16%,var(--light) 26%,var(--light2) 36%,var(--light) 46%,var(--amber) 54%,var(--copper) 60%,var(--light) 68%,var(--prism) 78%,var(--teal) 88%,var(--deep) 100%);opacity:0.9;}
.light-band::after{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(244,220,122,0.5) 50%,transparent);}
.light-band.thin{height:6px;}
.photo{height:240px;flex-shrink:0;position:relative;overflow:hidden;z-index:15;background:linear-gradient(160deg,#0E1826,#060A14,#0C1422);}
.photo-txt{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:'Cinzel',serif;font-size:11px;font-style:italic;letter-spacing:0.5em;color:rgba(245,237,216,0.05);pointer-events:none;}
.photo-img{position:absolute;inset:0;z-index:2;background-size:cover;background-position:center;background-repeat:no-repeat;}
.photo-ray{position:absolute;left:0;top:0;bottom:0;width:5px;z-index:3;background:linear-gradient(180deg,var(--teal) 0%,var(--prism) 15%,var(--light) 30%,var(--light2) 50%,var(--light) 70%,var(--amber) 85%,var(--copper) 100%);}
.photo-gt{position:absolute;top:0;left:0;right:0;height:45px;background:linear-gradient(180deg,rgba(6,10,20,0.55),transparent);z-index:2;pointer-events:none;}
.photo-gb{position:absolute;bottom:0;left:0;right:0;height:65px;background:linear-gradient(180deg,transparent,var(--parch));z-index:2;pointer-events:none;}
.photo-chips{position:absolute;top:12px;right:14px;z-index:4;display:flex;flex-direction:column;gap:5px;align-items:flex-end;}
.pchip{display:flex;align-items:center;gap:7px;padding:5px 11px;background:rgba(6,10,20,0.75);border:1px solid rgba(232,200,74,0.22);backdrop-filter:blur(6px);}
.pchip-l{font-family:'Barlow Condensed',sans-serif;font-size:7.5px;font-weight:600;letter-spacing:0.4em;text-transform:uppercase;color:rgba(245,237,216,0.32);}
.pchip-v{font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;color:rgba(245,237,216,0.88);}
.pchip-v.g{color:var(--light2);}
.pchip-v.ok{color:#4ADE80;}
.photo-seal{position:absolute;bottom:12px;left:16px;z-index:4;display:flex;align-items:center;gap:8px;}
.seal-ring{width:52px;height:52px;border-radius:50%;border:1.5px solid rgba(232,200,74,0.35);display:flex;align-items:center;justify-content:center;position:relative;}
.seal-ring::before{content:'';position:absolute;inset:5px;border-radius:50%;border:1px dashed rgba(232,200,74,0.2);}
.seal-inner{display:flex;flex-direction:column;align-items:center;gap:1px;}
.seal-eye{font-size:14px;line-height:1;}
.seal-text{font-family:'Barlow Condensed',sans-serif;font-size:5.5px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:rgba(232,200,74,0.55);text-align:center;line-height:1.3;}
.seal-date{font-family:'Share Tech Mono',monospace;font-size:5.5px;color:rgba(232,200,74,0.38);letter-spacing:0.1em;}
.seal-label{display:flex;flex-direction:column;gap:1px;}
.sl-main{font-family:'Cinzel',serif;font-size:9px;font-weight:600;letter-spacing:0.12em;color:rgba(232,200,74,0.65);}
.sl-sub{font-family:'Barlow Condensed',sans-serif;font-size:8px;font-weight:500;letter-spacing:0.25em;text-transform:uppercase;color:rgba(245,237,216,0.25);}
.cn{position:absolute;z-index:4;}
.cn::before,.cn::after{content:'';position:absolute;}
.cn.tl{top:0;left:0;width:18px;height:18px;}
.cn.tl::before{top:0;left:0;right:0;height:2px;background:var(--light);}
.cn.tl::after{top:0;left:0;bottom:0;width:2px;background:var(--light);}
.cn.tr{top:0;right:0;width:18px;height:18px;}
.cn.tr::before{top:0;left:0;right:0;height:2px;background:var(--teal);}
.cn.tr::after{top:0;right:0;bottom:0;width:2px;background:var(--teal);}
.cn.br{bottom:0;right:0;width:18px;height:18px;}
.cn.br::before{bottom:0;left:0;right:0;height:2px;background:rgba(232,200,74,0.3);}
.cn.br::after{top:0;right:0;bottom:0;width:2px;background:rgba(232,200,74,0.3);}
.middle{height:200px;flex-shrink:0;display:flex;z-index:20;position:relative;background:var(--parch);border-bottom:1px solid rgba(0,0,0,0.08);}
.mid-title{height:26px;flex-shrink:0;padding:0 16px;display:flex;align-items:center;gap:8px;border-bottom:1px solid rgba(0,0,0,0.07);background:rgba(0,0,0,0.025);}
.mt-diamond{width:8px;height:8px;transform:rotate(45deg);flex-shrink:0;border:1.5px solid var(--amber);position:relative;}
.mt-diamond::after{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:3px;height:3px;background:var(--light);border-radius:50%;}
.mt-txt{font-family:'Cinzel',serif;font-size:8px;font-weight:600;letter-spacing:0.45em;text-transform:uppercase;color:rgba(0,0,0,0.32);}
.mt-line{flex:1;height:1px;background:linear-gradient(90deg,rgba(196,154,26,0.25),transparent);}
.mid-left{flex:1;border-right:1px solid rgba(0,0,0,0.08);display:flex;flex-direction:column;overflow:hidden;}
.id-grid{display:grid;grid-template-columns:1fr 1fr;flex:1;}
.id-cell{display:flex;flex-direction:column;justify-content:center;padding:0 16px;min-height:0;border-right:1px solid rgba(0,0,0,0.06);border-bottom:1px solid rgba(0,0,0,0.06);}
.id-cell:nth-child(even){border-right:none;}
.id-cell:nth-last-child(-n+2){border-bottom:none;}
.id-lbl{font-family:'Barlow Condensed',sans-serif;font-size:7.5px;font-weight:700;letter-spacing:0.45em;text-transform:uppercase;color:rgba(0,0,0,0.28);line-height:1;}
.id-val{font-family:'Cinzel',serif;font-size:16px;font-weight:700;letter-spacing:0.04em;color:#0C0C0C;line-height:1;margin-top:2px;}
.id-val.gold{color:var(--amber);}
.id-val.green{color:#16A34A;}
.id-val.sm{font-size:12px;font-weight:600;color:rgba(0,0,0,0.6);}
.id-sub{font-family:'Barlow Condensed',sans-serif;font-size:9px;font-weight:400;letter-spacing:0.12em;color:rgba(0,0,0,0.35);margin-top:1px;}
.mid-right{width:192px;flex-shrink:0;display:flex;flex-direction:column;overflow:hidden;}
.hasar-body{flex:1;display:flex;padding:8px 10px 6px 8px;gap:8px;align-items:flex-start;overflow:hidden;}
.mini-svg{width:84px;height:136px;flex-shrink:0;}
.hasar-info{flex:1;display:flex;flex-direction:column;gap:4px;padding-top:1px;}
.hi-legend{display:flex;flex-direction:column;gap:3px;}
.hi-li{display:flex;align-items:center;gap:5px;}
.hi-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.hi-name{font-family:'Barlow Condensed',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:rgba(0,0,0,0.45);}
.hi-div{height:1px;background:rgba(0,0,0,0.08);margin:3px 0;}
.hi-sum{display:flex;flex-direction:column;gap:4px;}
.hi-row{display:flex;align-items:flex-start;gap:4px;}
.hi-rdot{width:6px;height:6px;border-radius:50%;flex-shrink:0;margin-top:2px;}
.hi-state{font-family:'Barlow Condensed',sans-serif;font-size:8px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;line-height:1;}
.hi-parts{font-family:'DM Sans',sans-serif;font-size:8px;color:rgba(0,0,0,0.45);line-height:1.3;margin-top:1px;}
.hi-sum-row{display:flex;align-items:flex-start;gap:4px;}
.hi-sum-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;margin-top:2px;}
.hi-sum-state{font-family:'Barlow Condensed',sans-serif;font-size:8px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;line-height:1;}
.hi-sum-parts{font-family:'DM Sans',sans-serif;font-size:8px;color:rgba(0,0,0,0.45);line-height:1.3;margin-top:1px;}
.hasar-footer{flex-shrink:0;padding:6px 10px 8px;border-top:1px solid rgba(0,0,0,0.07);background:rgba(0,0,0,0.02);}
.hf-tramer{display:flex;align-items:center;gap:5px;margin-bottom:5px;}
.hf-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
.hf-txt{font-family:'Barlow Condensed',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;}
.hf-score-row{display:flex;align-items:center;gap:6px;}
.hf-slbl{font-family:'Barlow Condensed',sans-serif;font-size:8px;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:rgba(0,0,0,0.3);flex-shrink:0;}
.hf-sbar{flex:1;height:5px;background:rgba(0,0,0,0.08);border-radius:3px;overflow:hidden;}
.hf-sfill{height:100%;border-radius:3px;background:linear-gradient(90deg,var(--amber),var(--light),var(--light2));}
.hf-snum{font-family:'Cinzel',serif;font-size:13px;font-weight:700;color:var(--amber);}
.donanim{height:82px;flex-shrink:0;position:relative;z-index:20;background:var(--deep);padding:10px 24px;overflow:hidden;}
.donanim::before{content:'';position:absolute;top:-20px;left:50%;transform:translateX(-50%);width:200px;height:120px;background:radial-gradient(ellipse,rgba(232,200,74,0.06) 0%,transparent 70%);pointer-events:none;}
.donanim::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--teal) 10%,var(--prism) 20%,var(--light) 32%,var(--light2) 42%,var(--light) 52%,var(--amber) 62%,var(--copper) 70%,var(--prism) 80%,var(--teal) 90%,transparent);}
.don-header{display:flex;align-items:center;gap:8px;margin-bottom:7px;}
.don-diamond{width:8px;height:8px;transform:rotate(45deg);flex-shrink:0;background:var(--light);}
.don-title{font-family:'Barlow Condensed',sans-serif;font-size:8px;font-weight:700;letter-spacing:0.55em;text-transform:uppercase;color:rgba(232,200,74,0.5);}
.don-chips{display:flex;flex-wrap:wrap;gap:4px;}
.dc{display:flex;align-items:center;gap:4px;padding:4px 9px;background:rgba(255,255,255,0.04);border:1px solid rgba(232,200,74,0.1);border-bottom:1.5px solid rgba(196,154,26,0.28);border-radius:2px;}
.dc-dot{width:4px;height:4px;border-radius:50%;background:var(--amber);flex-shrink:0;}
.dc-txt{font-family:'Barlow Condensed',sans-serif;font-size:9px;font-weight:600;letter-spacing:0.08em;color:rgba(245,237,216,0.62);white-space:nowrap;}
.footer{height:118px;flex-shrink:0;background:var(--void);position:relative;z-index:20;display:flex;flex-direction:column;overflow:hidden;}
.footer-ray{position:absolute;top:0;left:-60px;bottom:0;width:400px;background:linear-gradient(125deg,transparent 0%,rgba(232,200,74,0.02) 30%,rgba(244,220,122,0.04) 50%,rgba(232,200,74,0.02) 70%,transparent 100%);pointer-events:none;}
.footer-spectrum{height:4px;flex-shrink:0;background:linear-gradient(90deg,var(--void) 0%,var(--teal) 8%,var(--prism) 16%,var(--light) 28%,var(--light2) 38%,var(--light) 48%,var(--amber) 56%,var(--copper) 62%,var(--light) 70%,var(--prism) 82%,var(--teal) 92%,var(--void) 100%);}
.footer-body{flex:1;padding:0 24px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;position:relative;z-index:2;}
.f-galeri{font-family:'Cinzel',serif;font-size:13px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:rgba(245,237,216,0.88);line-height:1;}
.f-detail{font-family:'Share Tech Mono',monospace;font-size:8px;letter-spacing:0.12em;color:rgba(245,237,216,0.2);line-height:1.9;margin-top:3px;}
.f-phone{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:400;font-style:italic;letter-spacing:0.04em;color:rgba(232,200,74,0.72);margin-top:2px;}
.f-center{display:flex;flex-direction:column;align-items:center;gap:2px;padding:0 22px;border-left:1px solid rgba(255,255,255,0.05);border-right:1px solid rgba(255,255,255,0.05);}
.f-eye{font-size:18px;margin-bottom:2px;}
.f-alh-n{font-family:'Cinzel',serif;font-size:17px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;background:linear-gradient(90deg,var(--amber),var(--light),var(--light2),var(--light),var(--amber));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;white-space:nowrap;}
.f-ibn{font-family:'Cormorant Garamond',serif;font-size:9px;font-weight:300;font-style:italic;letter-spacing:0.18em;color:rgba(232,200,74,0.35);white-space:nowrap;margin-top:1px;}
.f-alh-t{font-family:'Barlow Condensed',sans-serif;font-size:7px;letter-spacing:0.45em;text-transform:uppercase;color:rgba(232,200,74,0.3);}
.f-price{text-align:right;}
.f-plbl{font-family:'Barlow Condensed',sans-serif;font-size:7.5px;letter-spacing:0.5em;text-transform:uppercase;color:rgba(245,237,216,0.22);margin-bottom:2px;}
.f-pval{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:600;color:rgba(245,237,216,0.92);line-height:1;}
.f-psub{font-family:'Barlow Condensed',sans-serif;font-size:7.5px;letter-spacing:0.42em;text-transform:uppercase;color:rgba(232,200,74,0.4);margin-top:2px;}
.footer-quote{height:28px;flex-shrink:0;padding:0 24px;border-top:1px solid rgba(255,255,255,0.04);background:rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:space-between;position:relative;z-index:2;}
.fq-quote{font-family:'Cormorant Garamond',serif;font-size:9px;font-weight:300;font-style:italic;letter-spacing:0.06em;color:rgba(232,200,74,0.32);flex:1;}
.fq-tag{font-family:'Barlow Condensed',sans-serif;font-size:7px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;color:rgba(232,200,74,0.22);white-space:nowrap;margin-left:12px;}
</style>
</head>
<body>
<div class="a4">
  <div class="grain"></div>
  <div class="geo-pattern"></div>

  <div class="hdr">
    <div class="hdr-light-ray"></div>
    <div class="hdr-geo"></div>
    <div class="hdr-body">
      <div class="hdr-ibn">
        <div class="hdr-eye">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <circle cx="22" cy="22" r="20" stroke="rgba(232,200,74,0.35)" stroke-width="1"/>
            <polygon points="22,4 30,8 38,16 40,22 38,28 30,36 22,40 14,36 6,28 4,22 6,16 14,8" fill="none" stroke="rgba(232,200,74,0.18)" stroke-width="0.8"/>
            <path d="M8 22 C12 14 18 11 22 11 C26 11 32 14 36 22 C32 30 26 33 22 33 C18 33 12 30 8 22 Z" fill="none" stroke="rgba(232,200,74,0.5)" stroke-width="1.2"/>
            <circle cx="22" cy="22" r="6" fill="none" stroke="rgba(232,200,74,0.4)" stroke-width="1"/>
            <circle cx="22" cy="22" r="2.5" fill="rgba(244,220,122,0.8)"/>
            <circle cx="22" cy="22" r="1" fill="rgba(255,255,255,0.9)"/>
            <line x1="22" y1="2" x2="22" y2="7" stroke="rgba(232,200,74,0.3)" stroke-width="0.8"/>
            <line x1="22" y1="37" x2="22" y2="42" stroke="rgba(232,200,74,0.3)" stroke-width="0.8"/>
            <line x1="2" y1="22" x2="7" y2="22" stroke="rgba(232,200,74,0.3)" stroke-width="0.8"/>
            <line x1="37" y1="22" x2="42" y2="22" stroke="rgba(232,200,74,0.3)" stroke-width="0.8"/>
          </svg>
        </div>
        <div class="hdr-name-block">
          <div class="hdr-arabic">ابن الهيثم · 965 — 1040</div>
          <div class="hdr-latin">Alhazen</div>
          <div class="hdr-title">İbn-ül Heysem · Işığın Bilgesi · Kitabül Menazir</div>
        </div>
      </div>
      <div class="hdr-badge">
        <div class="hdr-badge-main">
          <div class="hdr-badge-d"></div>
          <div class="hdr-badge-t">AlhazenPDF</div>
        </div>
        <div class="hdr-doc-no">KM-2026 · ESK-TR</div>
      </div>
    </div>
    <div class="hdr-rule"></div>
  </div>

  <div class="hero">
    <div class="hero-year-wm">${yil}</div>
    <svg class="hero-geo-corner" viewBox="0 0 120 120" fill="none">
      <circle cx="120" cy="0" r="80" stroke="rgba(196,154,26,0.12)" stroke-width="0.8" fill="none"/>
      <circle cx="120" cy="0" r="60" stroke="rgba(196,154,26,0.08)" stroke-width="0.8" fill="none"/>
      <circle cx="120" cy="0" r="40" stroke="rgba(196,154,26,0.1)" stroke-width="0.8" fill="none"/>
    </svg>
    <div class="hero-content">
      <div class="hero-tag">
        <div class="hero-tag-orn"></div>
        <div class="hero-tag-txt">Satılık · Premium Araç</div>
        <div class="hero-tag-line"></div>
      </div>
      <div class="hero-make">${marka}</div>
      <div class="hero-model">${model}</div>
    </div>
    <div class="hero-right">
      <div class="hr-year">Model · ${yil}</div>
      <div class="hr-series">${kasaTipi} · ${yakit}</div>
      <div class="hr-price">${fiyat} ₺</div>
      <div class="hr-price-sub">Satış Fiyatı · KDV Dahil</div>
    </div>
  </div>

  <div class="light-band"></div>

  <div class="photo"${photo ? ' style="background:none"' : ''}>
    ${photo ? `<div class="photo-img" style="background-image:url('${photo}')"></div>` : '<div class="photo-txt">Araç Fotoğrafı</div>'}
    <div class="photo-ray"></div>
    <div class="photo-gt"></div>
    <div class="photo-gb"></div>
    <div class="photo-chips">
      <div class="pchip"><div class="pchip-l">KM</div><div class="pchip-v g">${km}</div></div>
      <div class="pchip"><div class="pchip-l">Renk</div><div class="pchip-v">${renk}</div></div>
      <div class="pchip"><div class="pchip-l">Muayene</div><div class="pchip-v ok">✓ ${muayene}</div></div>
    </div>
    <div class="photo-seal">
      <div class="seal-ring">
        <div class="seal-inner">
          <div class="seal-eye">👁</div>
          <div class="seal-text">KİTABÜL<br>MENAZİR</div>
          <div class="seal-date">2026</div>
        </div>
      </div>
      <div class="seal-label">
        <div class="sl-main">AlhazenPDF</div>
        <div class="sl-sub">Premium Satış Kartı</div>
      </div>
    </div>
    <div class="cn tl"></div><div class="cn tr"></div><div class="cn br"></div>
  </div>

  <div class="light-band thin"></div>

  <div class="middle">
    <div class="mid-left">
      <div class="mid-title">
        <div class="mt-diamond"></div>
        <div class="mt-txt">Araç Kimliği</div>
        <div class="mt-line"></div>
      </div>
      <div class="id-grid">
        <div class="id-cell"><div class="id-lbl">Motor</div><div class="id-val gold">${motor}</div></div>
        <div class="id-cell"><div class="id-lbl">Şanzıman</div><div class="id-val">${sanziman}</div></div>
        <div class="id-cell"><div class="id-lbl">Kilometre</div><div class="id-val gold">${km}</div></div>
        <div class="id-cell"><div class="id-lbl">Renk</div><div class="id-val sm">${renk}</div></div>
        <div class="id-cell"><div class="id-lbl">Muayene</div><div class="id-val green">${muayene}</div></div>
        <div class="id-cell"><div class="id-lbl">Kasa</div><div class="id-val sm">${kasaTipi}</div></div>
        <div class="id-cell"><div class="id-lbl">Bagaj</div><div class="id-val">${bagaj}</div></div>
        <div class="id-cell"><div class="id-lbl">Garanti</div><div class="id-val green">${garanti}</div></div>
      </div>
    </div>
    <div class="mid-right">
      <div class="mid-title">
        <div class="mt-diamond"></div>
        <div class="mt-txt">Hasar & Boya</div>
        <div class="mt-line"></div>
      </div>
      <div class="hasar-body">
        ${miniSVG}
        <div class="hasar-info">
          <div class="hi-legend">
            <div class="hi-li"><div class="hi-dot" style="background:#D8D8D4;border:1px solid #BCBCB8"></div><div class="hi-name">Orjinal</div></div>
            <div class="hi-li"><div class="hi-dot" style="background:#93C5FD"></div><div class="hi-name" style="color:#1B7FD4">Boyalı</div></div>
            <div class="hi-li"><div class="hi-dot" style="background:#FCD34D"></div><div class="hi-name" style="color:#B45309">Değişen</div></div>
            <div class="hi-li"><div class="hi-dot" style="background:#86EFAC"></div><div class="hi-name" style="color:#047857">Lokal</div></div>
          </div>
          <div class="hi-div"></div>
          <div class="hi-sum">${hasarSum}</div>
        </div>
      </div>
      <div class="hasar-footer">
        <div class="hf-tramer">
          <div class="hf-dot" style="background:${tramerColor}"></div>
          <div class="hf-txt" style="color:${tramerColor}">${tramerTxt}</div>
        </div>
        <div class="hf-score-row">
          <div class="hf-slbl">Skor</div>
          <div class="hf-sbar"><div class="hf-sfill" style="width:${skor}%"></div></div>
          <div class="hf-snum">${skor}</div>
        </div>
      </div>
    </div>
  </div>

  <div class="donanim">
    <div class="don-header"><div class="don-diamond"></div><div class="don-title">Standart Donanım</div></div>
    <div class="don-chips">${donChips}</div>
  </div>

  <div class="footer">
    <div class="footer-ray"></div>
    <div class="footer-spectrum"></div>
    <div class="footer-body">
      <div>
        <div class="f-galeri">${companyName || 'Galeri'}</div>
        <div class="f-phone">${telefon}</div>
      </div>
      <div class="f-center">
        <div class="f-eye">👁</div>
        <div class="f-alh-n">AlhazenPDF</div>
        <div class="f-ibn">İbn-ül Heysem · Işığın Bilgesi</div>
        <div class="f-alh-t">Premium · Satış Kartı</div>
      </div>
      <div class="f-price">
        <div class="f-plbl">İstenen Fiyat</div>
        <div class="f-pval">${fiyat} ₺</div>
        <div class="f-psub">KDV Dahil · Takas Görüşülür</div>
      </div>
    </div>
    <div class="footer-quote">
      <div class="fq-quote">"Işık, gözden çıkmaz; dışarıdan gelir ve varlıkları görünür kılar." — İbn-ül Heysem, Kitabül Menazir, 1011</div>
      <div class="fq-tag">AlhazenPDF · KM-2026</div>
    </div>
  </div>

</div>
</body>
</html>`;
  return postProcess(html, 595, 842);
};


/* ═══════════════════════════════════════════════════════════
   ALPINE — Kristal Zirve · Snow/glacier · Mountain peaks · Alpine blue/white
   ═══════════════════════════════════════════════════════════ */
export const buildAlpineHTML = (data) => {
  const { formData = {}, photos = [], companyName = '', ekspertizData = {}, donanim = [], tramer = true } = data;

  const photo     = photos[0]?.base64 || '';
  const marka     = formData['Marka']    || 'MARKA';
  const model     = formData['Model']    || 'Model';
  const yil       = String(formData['Yıl'] || '2024').replace(/\./g, '');
  const yakit     = formData['Yakıt']    || 'Benzin';
  const motor     = formData['Motor']    || '—';
  const sanziman  = formData['Şanzıman'] || '—';
  const km        = formData['KM']       || '0 km';
  const renk      = formData['Renk']     || '—';
  const fiyat     = formatFiyat((formData['Fiyat'] || '0').replace(/\s*₺\s*/g, '').trim());
  const kasaTipi  = formData['Kasa Tipi'] || '—';
  const muayene   = formData['Muayene']  || '—';
  const bagaj     = formData['Bagaj']    || '—';
  const garanti   = formData['Garanti']  || '—';
  const telefon   = formData['Telefon']  || '';

  const skor        = calculateSkor(ekspertizData);
  const miniSVG     = buildMiniCarSVG(ekspertizData);
  const hasarSum    = buildHasarSummary(ekspertizData);
  const donChips    = buildDonanımChips(donanim);
  const tramerColor = tramer ? '#16A34A' : '#DC2626';
  const tramerTxt   = tramer ? 'Tramer Kaydı Yok' : 'Tramer Kaydı Var';

  const html = `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=595">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Barlow+Condensed:wght@200;300;400;500;600;700;800;900&family=DM+Sans:wght@300;400;500&family=Share+Tech+Mono&family=EB+Garamond:ital,wght@0,400;0,700;1,400;1,700&family=Montserrat:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
body { background:#F4F8FA; font-family:'DM Sans',sans-serif; }
:root {
  --summit:#060C12; --stone:#0E1A24; --slate:#162535;
  --pine:#1A4A3A; --fir:#0F3028; --glacier:#5BBFDC;
  --ice:#A8DEF0; --snow:#F4F8FA; --chalk:#EDF2F4; --frost:#D6EEF5; --needle:#2E7D52;
}
.a4 { width:595px; height:842px; position:relative; overflow:hidden; display:flex; flex-direction:column; background:var(--snow); -webkit-print-color-adjust:exact; print-color-adjust:exact; }
.grain { position:absolute; inset:0; z-index:1; pointer-events:none;
  background: radial-gradient(ellipse 80% 60% at 15% 20%, rgba(168,222,240,0.08) 0%, transparent 55%), radial-gradient(ellipse 60% 70% at 80% 85%, rgba(91,191,220,0.05) 0%, transparent 50%);
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E"); }
.crystal-pattern { position:absolute; inset:0; z-index:0; pointer-events:none; opacity:0.02;
  background-image: repeating-linear-gradient(60deg, transparent, transparent 22px, rgba(91,191,220,1) 22px, rgba(91,191,220,1) 23px), repeating-linear-gradient(-60deg, transparent, transparent 22px, rgba(91,191,220,0.6) 22px, rgba(91,191,220,0.6) 23px), repeating-linear-gradient(0deg, transparent, transparent 22px, rgba(91,191,220,0.3) 22px, rgba(91,191,220,0.3) 23px); }
.hdr { height:80px; flex-shrink:0; background:var(--summit); position:relative; z-index:20; display:flex; flex-direction:column; overflow:hidden; }
.hdr-frost { position:absolute; inset:0; pointer-events:none; background: radial-gradient(ellipse 70% 150% at 25% 110%, rgba(91,191,220,0.07) 0%, transparent 60%), radial-gradient(ellipse 50% 120% at 75% 110%, rgba(168,222,240,0.05) 0%, transparent 55%); }
.hdr-mountain { position:absolute; right:0; bottom:4px; width:180px; height:55px; pointer-events:none; opacity:0.04; }
.hdr-body { flex:1; padding:0 24px; display:flex; justify-content:space-between; align-items:center; position:relative; z-index:2; }
.hdr-brand { display:flex; align-items:center; gap:14px; }
.hdr-crystal { width:44px; height:44px; flex-shrink:0; position:relative; display:flex; align-items:center; justify-content:center; }
.hdr-sub { font-family:'Montserrat',sans-serif; font-size:7.5px; font-weight:500; letter-spacing:0.55em; text-transform:uppercase; color:rgba(91,191,220,0.45); margin-bottom:3px; }
.hdr-latin { font-family:'Montserrat',sans-serif; font-size:17px; font-weight:800; letter-spacing:0.14em; text-transform:uppercase; color:rgba(244,248,250,0.92); line-height:1; }
.hdr-title { font-family:'EB Garamond',serif; font-size:10.5px; font-weight:400; font-style:italic; letter-spacing:0.14em; color:rgba(91,191,220,0.5); margin-top:4px; }
.hdr-badge { display:flex; flex-direction:column; align-items:flex-end; gap:5px; }
.hdr-badge-main { display:flex; align-items:center; gap:7px; padding:5px 12px 5px 8px; border:1px solid rgba(91,191,220,0.28); background:rgba(91,191,220,0.05); }
.hdr-badge-crystal { width:10px; height:10px; flex-shrink:0; transform:rotate(45deg); background:linear-gradient(135deg,var(--ice),var(--glacier)); box-shadow:0 0 8px rgba(91,191,220,0.5); }
.hdr-badge-t { font-family:'Montserrat',sans-serif; font-size:11px; font-weight:800; letter-spacing:0.22em; text-transform:uppercase; background:linear-gradient(90deg,var(--slate),var(--glacier),var(--ice)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.hdr-doc-no { font-family:'Share Tech Mono',monospace; font-size:7.5px; letter-spacing:0.18em; color:rgba(91,191,220,0.25); }
.hdr-rule { height:4px; flex-shrink:0; background:linear-gradient(90deg, var(--summit) 0%, var(--fir) 8%, var(--pine) 16%, var(--needle) 24%, var(--glacier) 34%, var(--ice) 44%, var(--glacier) 52%, var(--needle) 60%, var(--pine) 68%, var(--glacier) 78%, var(--fir) 90%, var(--summit) 100%); }
.hero { height:108px; flex-shrink:0; background:var(--snow); position:relative; z-index:20; display:flex; align-items:flex-end; overflow:hidden; }
.hero-left-bar { position:absolute; left:0; top:0; bottom:0; width:4px; background:linear-gradient(180deg,var(--needle),var(--pine),var(--fir)); }
.hero-crystal-corner { position:absolute; right:-10px; top:-10px; width:130px; height:130px; pointer-events:none; opacity:0.055; }
.hero-year-wm { position:absolute; right:16px; top:50%; transform:translateY(-50%); font-family:'Montserrat',sans-serif; font-size:96px; font-weight:900; letter-spacing:-0.03em; color:rgba(0,0,0,0.04); line-height:1; pointer-events:none; user-select:none; }
.hero-content { padding:0 0 14px 28px; flex:1; position:relative; z-index:1; }
.hero-tag { display:flex; align-items:center; gap:8px; margin-bottom:5px; }
.hero-tag-peak { width:14px; height:10px; flex-shrink:0; position:relative; }
.hero-tag-peak::before { content:''; position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:0; height:0; border-left:7px solid transparent; border-right:7px solid transparent; border-bottom:10px solid rgba(26,74,58,0.4); }
.hero-tag-txt { font-family:'Montserrat',sans-serif; font-size:8px; font-weight:700; letter-spacing:0.6em; text-transform:uppercase; color:rgba(0,0,0,0.26); }
.hero-tag-line { flex:1; height:1px; background:linear-gradient(90deg,rgba(91,191,220,0.3),transparent); }
.hero-make { font-family:'Montserrat',sans-serif; font-size:72px; font-weight:900; line-height:0.82; letter-spacing:0.02em; text-transform:uppercase; color:#080C10; text-shadow:2px 3px 0 rgba(0,0,0,0.04); }
.hero-model { font-family:'EB Garamond',serif; font-size:26px; font-weight:400; font-style:italic; letter-spacing:0.16em; line-height:1; margin-top:4px; background:linear-gradient(90deg,var(--fir),var(--pine),var(--needle),var(--glacier),var(--needle),var(--pine)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.hero-right { padding:0 24px 14px 0; text-align:right; flex-shrink:0; position:relative; z-index:1; }
.hr-year { font-family:'Montserrat',sans-serif; font-size:9px; font-weight:600; letter-spacing:0.4em; text-transform:uppercase; color:rgba(0,0,0,0.26); margin-bottom:3px; }
.hr-series { font-family:'EB Garamond',serif; font-size:14px; font-weight:400; font-style:italic; letter-spacing:0.1em; color:rgba(0,0,0,0.38); margin-bottom:6px; }
.hr-price { font-family:'Montserrat',sans-serif; font-size:23px; font-weight:800; color:#080C10; line-height:1; }
.hr-price-sub { font-family:'Montserrat',sans-serif; font-size:7.5px; font-weight:500; letter-spacing:0.38em; text-transform:uppercase; color:rgba(26,74,58,0.55); margin-top:2px; }
.snow-band { height:8px; flex-shrink:0; position:relative; z-index:20; background:var(--stone); }
.snow-band::before { content:''; position:absolute; inset:0; background:linear-gradient(90deg,var(--stone) 0%,var(--fir) 6%,var(--pine) 14%,var(--needle) 22%,var(--glacier) 32%,var(--ice) 42%,var(--glacier) 50%,var(--needle) 58%,var(--pine) 68%,var(--glacier) 78%,var(--fir) 88%,var(--stone) 100%); opacity:0.9; }
.snow-band::after { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(168,222,240,0.55) 50%,transparent); }
.snow-band.thin { height:6px; }
.photo { height:240px; flex-shrink:0; position:relative; overflow:hidden; z-index:15; background:linear-gradient(160deg,#0C1820,#060C12,#101E2C); }
.photo-txt { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); font-family:'Montserrat',sans-serif; font-size:11px; font-weight:300; letter-spacing:0.5em; color:rgba(244,248,250,0.04); pointer-events:none; }
.photo-ray { position:absolute; left:0; top:0; bottom:0; width:5px; z-index:3; background:linear-gradient(180deg,var(--slate) 0%,var(--pine) 15%,var(--needle) 30%,var(--glacier) 50%,var(--ice) 65%,var(--glacier) 80%,var(--pine) 100%); }
.photo-gt { position:absolute; top:0; left:0; right:0; height:45px; background:linear-gradient(180deg,rgba(6,12,18,0.62),transparent); z-index:2; pointer-events:none; }
.photo-gb { position:absolute; bottom:0; left:0; right:0; height:65px; background:linear-gradient(180deg,transparent,var(--snow)); z-index:2; pointer-events:none; }
.photo-chips { position:absolute; top:12px; right:14px; z-index:4; display:flex; flex-direction:column; gap:5px; align-items:flex-end; }
.pchip { display:flex; align-items:center; gap:7px; padding:5px 11px; background:rgba(6,12,18,0.8); border:1px solid rgba(91,191,220,0.2); backdrop-filter:blur(6px); }
.pchip-l { font-family:'Montserrat',sans-serif; font-size:7px; font-weight:600; letter-spacing:0.4em; text-transform:uppercase; color:rgba(244,248,250,0.32); }
.pchip-v { font-family:'Montserrat',sans-serif; font-size:12px; font-weight:700; color:rgba(244,248,250,0.88); }
.pchip-v.ice { color:var(--glacier); }
.pchip-v.ok { color:#4ADE80; }
.photo-seal { position:absolute; bottom:12px; left:16px; z-index:4; display:flex; align-items:center; gap:8px; }
.seal-ring { width:52px; height:52px; border-radius:50%; border:1.5px solid rgba(91,191,220,0.35); display:flex; align-items:center; justify-content:center; position:relative; }
.seal-ring::before { content:''; position:absolute; inset:5px; border-radius:50%; border:1px dashed rgba(91,191,220,0.2); }
.seal-inner { display:flex; flex-direction:column; align-items:center; gap:1px; }
.seal-icon { font-size:14px; line-height:1; }
.seal-text { font-family:'Montserrat',sans-serif; font-size:5px; font-weight:800; letter-spacing:0.16em; text-transform:uppercase; color:rgba(91,191,220,0.55); text-align:center; line-height:1.3; }
.seal-date { font-family:'Share Tech Mono',monospace; font-size:5.5px; color:rgba(91,191,220,0.38); letter-spacing:0.1em; }
.seal-label { display:flex; flex-direction:column; gap:1px; }
.sl-main { font-family:'Montserrat',sans-serif; font-size:9px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:rgba(91,191,220,0.65); }
.sl-sub { font-family:'Montserrat',sans-serif; font-size:7px; font-weight:500; letter-spacing:0.25em; text-transform:uppercase; color:rgba(244,248,250,0.25); }
.cn { position:absolute; z-index:4; }
.cn::before, .cn::after { content:''; position:absolute; }
.cn.tl { top:0; left:0; width:18px; height:18px; }
.cn.tl::before { top:0;left:0;right:0;height:2px;background:var(--glacier); }
.cn.tl::after { top:0;left:0;bottom:0;width:2px;background:var(--glacier); }
.cn.tr { top:0; right:0; width:18px; height:18px; }
.cn.tr::before { top:0;left:0;right:0;height:2px;background:var(--needle); }
.cn.tr::after { top:0;right:0;bottom:0;width:2px;background:var(--needle); }
.cn.br { bottom:0; right:0; width:18px; height:18px; }
.cn.br::before { bottom:0;left:0;right:0;height:2px;background:rgba(91,191,220,0.3); }
.cn.br::after { top:0;right:0;bottom:0;width:2px;background:rgba(91,191,220,0.3); }
.middle { height:200px; flex-shrink:0; display:flex; z-index:20; position:relative; background:var(--snow); border-bottom:1px solid rgba(0,0,0,0.07); }
.mid-title { height:26px; flex-shrink:0; padding:0 16px; display:flex; align-items:center; gap:8px; border-bottom:1px solid rgba(0,0,0,0.07); background:rgba(91,191,220,0.03); }
.mt-peak { width:10px; height:10px; flex-shrink:0; position:relative; }
.mt-peak::before { content:''; position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:0; height:0; border-left:5px solid transparent; border-right:5px solid transparent; border-bottom:9px solid var(--glacier); }
.mt-peak::after { content:''; position:absolute; bottom:5px; left:50%; transform:translateX(-50%); width:5px; height:3px; background:rgba(168,222,240,0.5); border-radius:1px; }
.mt-txt { font-family:'Montserrat',sans-serif; font-size:7.5px; font-weight:700; letter-spacing:0.45em; text-transform:uppercase; color:rgba(0,0,0,0.3); }
.mt-line { flex:1; height:1px; background:linear-gradient(90deg,rgba(91,191,220,0.25),transparent); }
.mid-left { flex:1; border-right:1px solid rgba(0,0,0,0.07); display:flex; flex-direction:column; overflow:hidden; }
.id-grid { display:grid; grid-template-columns:1fr 1fr; flex:1; }
.id-cell { display:flex; flex-direction:column; justify-content:center; padding:0 16px; min-height:0; border-right:1px solid rgba(0,0,0,0.05); border-bottom:1px solid rgba(0,0,0,0.05); }
.id-cell:nth-child(even) { border-right:none; }
.id-cell:nth-last-child(-n+2) { border-bottom:none; }
.id-lbl { font-family:'Montserrat',sans-serif; font-size:7px; font-weight:700; letter-spacing:0.45em; text-transform:uppercase; color:rgba(0,0,0,0.25); line-height:1; }
.id-val { font-family:'Montserrat',sans-serif; font-size:15px; font-weight:800; letter-spacing:0.02em; color:#080C10; line-height:1; margin-top:2px; }
.id-val.pine { color:var(--pine); }
.id-val.green { color:#16A34A; }
.id-val.sm { font-size:12px; font-weight:500; color:rgba(0,0,0,0.55); }
.id-sub { font-family:'Montserrat',sans-serif; font-size:8px; font-weight:400; letter-spacing:0.1em; color:rgba(0,0,0,0.3); margin-top:1px; }
.mid-right { width:192px; flex-shrink:0; display:flex; flex-direction:column; overflow:hidden; }
.hasar-body { flex:1; display:flex; padding:8px 10px 6px 8px; gap:8px; align-items:flex-start; overflow:hidden; }
.mini-svg { width:84px; height:136px; flex-shrink:0; filter:drop-shadow(0 2px 8px rgba(0,0,0,0.1)); }
.hasar-info { flex:1; display:flex; flex-direction:column; gap:4px; padding-top:1px; }
.hi-legend { display:flex; flex-direction:column; gap:3px; }
.hi-li { display:flex; align-items:center; gap:5px; }
.hi-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.hi-name { font-family:'Montserrat',sans-serif; font-size:8px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:rgba(0,0,0,0.43); }
.hi-div { height:1px; background:rgba(0,0,0,0.07); margin:3px 0; }
.hi-sum { display:flex; flex-direction:column; gap:4px; }
.hi-row { display:flex; align-items:flex-start; gap:4px; }
.hi-rdot { width:6px; height:6px; border-radius:50%; flex-shrink:0; margin-top:2px; }
.hi-state { font-family:'Montserrat',sans-serif; font-size:7.5px; font-weight:800; letter-spacing:0.12em; text-transform:uppercase; line-height:1; }
.hi-parts { font-family:'DM Sans',sans-serif; font-size:8px; color:rgba(0,0,0,0.43); line-height:1.3; margin-top:1px; }
.hasar-footer { flex-shrink:0; padding:6px 10px 8px; border-top:1px solid rgba(0,0,0,0.06); background:rgba(0,0,0,0.02); }
.hf-tramer { display:flex; align-items:center; gap:5px; margin-bottom:5px; }
.hf-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
.hf-txt { font-family:'Montserrat',sans-serif; font-size:8px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; }
.hf-score-row { display:flex; align-items:center; gap:6px; }
.hf-slbl { font-family:'Montserrat',sans-serif; font-size:7.5px; font-weight:600; letter-spacing:0.3em; text-transform:uppercase; color:rgba(0,0,0,0.28); flex-shrink:0; }
.hf-sbar { flex:1; height:5px; background:rgba(0,0,0,0.08); border-radius:3px; overflow:hidden; }
.hf-sfill { height:100%; border-radius:3px; background:linear-gradient(90deg,var(--fir),var(--needle),var(--glacier)); }
.hf-snum { font-family:'Montserrat',sans-serif; font-size:13px; font-weight:800; color:var(--pine); }
.donanim { height:82px; flex-shrink:0; position:relative; z-index:20; background:var(--stone); padding:10px 24px; overflow:hidden; }
.donanim::before { content:''; position:absolute; top:-20px; left:50%; transform:translateX(-50%); width:200px; height:120px; background:radial-gradient(ellipse,rgba(91,191,220,0.05) 0%,transparent 70%); pointer-events:none; }
.donanim::after { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,var(--fir) 8%,var(--pine) 18%,var(--needle) 28%,var(--glacier) 40%,var(--ice) 50%,var(--glacier) 58%,var(--needle) 68%,var(--pine) 80%,var(--fir) 90%,transparent); }
.don-header { display:flex; align-items:center; gap:8px; margin-bottom:7px; }
.don-peak { width:10px; height:10px; flex-shrink:0; position:relative; }
.don-peak::before { content:''; position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:0; height:0; border-left:5px solid transparent; border-right:5px solid transparent; border-bottom:10px solid var(--glacier); }
.don-title { font-family:'Montserrat',sans-serif; font-size:7.5px; font-weight:800; letter-spacing:0.55em; text-transform:uppercase; color:rgba(91,191,220,0.5); }
.don-chips { display:flex; flex-wrap:wrap; gap:4px; }
.dc { display:flex; align-items:center; gap:4px; padding:4px 9px; background:rgba(255,255,255,0.03); border:1px solid rgba(91,191,220,0.1); border-bottom:1.5px solid rgba(46,125,82,0.3); border-radius:1px; }
.dc-dot { width:4px; height:4px; flex-shrink:0; transform:rotate(45deg); background:var(--glacier); }
.dc-txt { font-family:'Montserrat',sans-serif; font-size:8.5px; font-weight:600; letter-spacing:0.06em; color:rgba(244,248,250,0.6); white-space:nowrap; }
.footer { height:118px; flex-shrink:0; background:var(--summit); position:relative; z-index:20; display:flex; flex-direction:column; overflow:hidden; }
.footer-ray { position:absolute; top:0; left:-60px; bottom:0; width:400px; background:linear-gradient(125deg,transparent 0%,rgba(91,191,220,0.015) 30%,rgba(168,222,240,0.03) 50%,rgba(91,191,220,0.015) 70%,transparent 100%); pointer-events:none; }
.footer-peaks { position:absolute; bottom:28px; left:0; right:0; height:40px; pointer-events:none; opacity:0.03; }
.footer-spectrum { height:4px; flex-shrink:0; background:linear-gradient(90deg,var(--summit) 0%,var(--fir) 6%,var(--pine) 14%,var(--needle) 24%,var(--glacier) 34%,var(--ice) 44%,var(--glacier) 52%,var(--needle) 60%,var(--pine) 70%,var(--glacier) 82%,var(--fir) 92%,var(--summit) 100%); }
.footer-body { flex:1; padding:0 24px; display:grid; grid-template-columns:1fr auto 1fr; align-items:center; position:relative; z-index:2; }
.f-galeri { font-family:'Montserrat',sans-serif; font-size:12px; font-weight:800; letter-spacing:0.14em; text-transform:uppercase; color:rgba(244,248,250,0.88); line-height:1; }
.f-detail { font-family:'Share Tech Mono',monospace; font-size:8px; letter-spacing:0.12em; color:rgba(244,248,250,0.2); line-height:1.9; margin-top:3px; }
.f-phone { font-family:'EB Garamond',serif; font-size:18px; font-weight:400; font-style:italic; letter-spacing:0.04em; color:rgba(91,191,220,0.7); margin-top:2px; }
.f-center { display:flex; flex-direction:column; align-items:center; gap:2px; padding:0 22px; border-left:1px solid rgba(255,255,255,0.05); border-right:1px solid rgba(255,255,255,0.05); }
.f-icon { font-size:18px; margin-bottom:2px; }
.f-alh-n { font-family:'Montserrat',sans-serif; font-size:16px; font-weight:900; letter-spacing:0.2em; text-transform:uppercase; background:linear-gradient(90deg,var(--pine),var(--needle),var(--glacier),var(--ice),var(--glacier),var(--needle)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; filter:drop-shadow(0 0 10px rgba(91,191,220,0.3)); white-space:nowrap; }
.f-theme-name { font-family:'EB Garamond',serif; font-size:9px; font-weight:400; font-style:italic; letter-spacing:0.18em; color:rgba(91,191,220,0.35); white-space:nowrap; margin-top:1px; }
.f-alh-t { font-family:'Montserrat',sans-serif; font-size:6.5px; font-weight:600; letter-spacing:0.45em; text-transform:uppercase; color:rgba(91,191,220,0.28); }
.f-price { text-align:right; }
.f-plbl { font-family:'Montserrat',sans-serif; font-size:7px; letter-spacing:0.5em; text-transform:uppercase; color:rgba(244,248,250,0.22); margin-bottom:2px; }
.f-pval { font-family:'EB Garamond',serif; font-size:26px; font-weight:700; color:rgba(244,248,250,0.92); line-height:1; }
.f-psub { font-family:'Montserrat',sans-serif; font-size:7px; letter-spacing:0.42em; text-transform:uppercase; color:rgba(91,191,220,0.38); margin-top:2px; }
.footer-quote { height:28px; flex-shrink:0; padding:0 24px; border-top:1px solid rgba(255,255,255,0.04); background:rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:space-between; position:relative; z-index:2; }
.fq-quote { font-family:'EB Garamond',serif; font-size:9px; font-weight:400; font-style:italic; letter-spacing:0.06em; color:rgba(91,191,220,0.3); flex:1; }
.fq-tag { font-family:'Montserrat',sans-serif; font-size:6.5px; font-weight:700; letter-spacing:0.3em; text-transform:uppercase; color:rgba(91,191,220,0.2); white-space:nowrap; margin-left:12px; }
</style>
</head>
<body>
<div class="a4">
  <div class="grain"></div>
  <div class="crystal-pattern"></div>
  <div class="hdr">
    <div class="hdr-frost"></div>
    <svg class="hdr-mountain" viewBox="0 0 180 55" fill="none">
      <path d="M0 55 L30 20 L50 35 L80 5 L110 28 L140 10 L180 55 Z" fill="rgba(91,191,220,1)"/>
      <path d="M70 14 L80 5 L90 14 Z" fill="rgba(244,248,250,0.8)"/>
      <path d="M130 17 L140 10 L150 17 Z" fill="rgba(244,248,250,0.6)"/>
    </svg>
    <div class="hdr-body">
      <div class="hdr-brand">
        <div class="hdr-crystal">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <circle cx="22" cy="22" r="20" stroke="rgba(91,191,220,0.28)" stroke-width="1"/>
            <line x1="22" y1="4" x2="22" y2="40" stroke="rgba(91,191,220,0.35)" stroke-width="0.8"/>
            <line x1="4" y1="22" x2="40" y2="22" stroke="rgba(91,191,220,0.35)" stroke-width="0.8"/>
            <line x1="8" y1="8" x2="36" y2="36" stroke="rgba(91,191,220,0.25)" stroke-width="0.8"/>
            <line x1="36" y1="8" x2="8" y2="36" stroke="rgba(91,191,220,0.25)" stroke-width="0.8"/>
            <path d="M22 4 L19 9 M22 4 L25 9" stroke="rgba(91,191,220,0.3)" stroke-width="0.7"/>
            <path d="M22 40 L19 35 M22 40 L25 35" stroke="rgba(91,191,220,0.3)" stroke-width="0.7"/>
            <path d="M4 22 L9 19 M4 22 L9 25" stroke="rgba(91,191,220,0.3)" stroke-width="0.7"/>
            <path d="M40 22 L35 19 M40 22 L35 25" stroke="rgba(91,191,220,0.3)" stroke-width="0.7"/>
            <polygon points="22,12 28,26 22,24 16,26" fill="none" stroke="rgba(168,222,240,0.4)" stroke-width="0.8"/>
            <polygon points="22,12 25,17 19,17" fill="rgba(168,222,240,0.6)"/>
            <circle cx="22" cy="22" r="3" fill="none" stroke="rgba(91,191,220,0.5)" stroke-width="0.8"/>
            <circle cx="22" cy="22" r="1.5" fill="rgba(168,222,240,0.9)"/>
          </svg>
        </div>
        <div>
          <div class="hdr-sub">Kristal Zirve · Alpine</div>
          <div class="hdr-latin">Alhazen</div>
          <div class="hdr-title">Premium Araç Ekspertiz Raporu</div>
        </div>
      </div>
      <div class="hdr-badge">
        <div class="hdr-badge-main">
          <div class="hdr-badge-crystal"></div>
          <div class="hdr-badge-t">AlhazenPDF</div>
        </div>
        <div class="hdr-doc-no">KZ-2026 · ESK-TR</div>
      </div>
    </div>
    <div class="hdr-rule"></div>
  </div>
  <div class="hero">
    <div class="hero-left-bar"></div>
    <div class="hero-year-wm">${yil}</div>
    <svg class="hero-crystal-corner" viewBox="0 0 130 130" fill="none">
      <line x1="130" y1="0" x2="0" y2="130" stroke="rgba(91,191,220,0.08)" stroke-width="0.8"/>
      <line x1="130" y1="0" x2="60" y2="130" stroke="rgba(91,191,220,0.06)" stroke-width="0.6"/>
      <line x1="130" y1="0" x2="130" y2="80" stroke="rgba(91,191,220,0.06)" stroke-width="0.6"/>
      <circle cx="130" cy="0" r="60" stroke="rgba(91,191,220,0.06)" stroke-width="0.7" fill="none"/>
      <circle cx="130" cy="0" r="90" stroke="rgba(91,191,220,0.04)" stroke-width="0.7" fill="none"/>
      <line x1="110" y1="18" x2="118" y2="18" stroke="rgba(91,191,220,0.2)" stroke-width="0.7"/>
      <line x1="114" y1="14" x2="114" y2="22" stroke="rgba(91,191,220,0.2)" stroke-width="0.7"/>
      <line x1="111" y1="15" x2="117" y2="21" stroke="rgba(91,191,220,0.15)" stroke-width="0.6"/>
      <line x1="117" y1="15" x2="111" y2="21" stroke="rgba(91,191,220,0.15)" stroke-width="0.6"/>
    </svg>
    <div class="hero-content">
      <div class="hero-tag">
        <div class="hero-tag-peak"></div>
        <div class="hero-tag-txt">Satılık · Premium Araç</div>
        <div class="hero-tag-line"></div>
      </div>
      <div class="hero-make">${marka}</div>
      <div class="hero-model">${model}</div>
    </div>
    <div class="hero-right">
      <div class="hr-year">Model · ${yil}</div>
      <div class="hr-series">${kasaTipi} · ${yakit}</div>
      <div class="hr-price">${fiyat} ₺</div>
      <div class="hr-price-sub">Satış Fiyatı · KDV Dahil</div>
    </div>
  </div>
  <div class="snow-band"></div>
  <div class="photo"${photo ? ' style="background:none"' : ''}>
    ${!photo ? '<div class="photo-txt">Araç Fotoğrafı</div>' : ''}
    <div class="photo-ray"></div>
    <div class="photo-gt"></div>
    <div class="photo-gb"></div>
    ${photo ? `<img src="${photo}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"/>` : ''}
    <div class="photo-chips">
      <div class="pchip"><div class="pchip-l">KM</div><div class="pchip-v ice">${km}</div></div>
      <div class="pchip"><div class="pchip-l">Renk</div><div class="pchip-v">${renk}</div></div>
      <div class="pchip"><div class="pchip-l">Muayene</div><div class="pchip-v ok">${muayene}</div></div>
    </div>
    <div class="photo-seal">
      <div class="seal-ring">
        <div class="seal-inner">
          <div class="seal-icon">❄️</div>
          <div class="seal-text">KRİSTAL<br>ZİRVE</div>
          <div class="seal-date">ALHAZEN</div>
        </div>
      </div>
      <div class="seal-label">
        <div class="sl-main">AlhazenPDF</div>
        <div class="sl-sub">Premium Satış Kartı</div>
      </div>
    </div>
    <div class="cn tl"></div><div class="cn tr"></div><div class="cn br"></div>
  </div>
  <div class="snow-band thin"></div>
  <div class="middle">
    <div class="mid-left">
      <div class="mid-title">
        <div class="mt-peak"></div>
        <div class="mt-txt">Araç Kimliği</div>
        <div class="mt-line"></div>
      </div>
      <div class="id-grid">
        <div class="id-cell"><div class="id-lbl">Motor</div><div class="id-val pine">${motor}</div><div class="id-sub">${yakit}</div></div>
        <div class="id-cell"><div class="id-lbl">Şanzıman</div><div class="id-val">${sanziman}</div></div>
        <div class="id-cell"><div class="id-lbl">Kilometre</div><div class="id-val pine">${km}</div><div class="id-sub">km</div></div>
        <div class="id-cell"><div class="id-lbl">Renk</div><div class="id-val sm">${renk}</div><div class="id-sub">Orijinal Boya</div></div>
        <div class="id-cell"><div class="id-lbl">Muayene</div><div class="id-val green">${muayene}</div><div class="id-sub">Geçerli ✓</div></div>
        <div class="id-cell"><div class="id-lbl">Kasa</div><div class="id-val sm">${kasaTipi}</div></div>
        <div class="id-cell"><div class="id-lbl">Bagaj</div><div class="id-val">${bagaj}</div><div class="id-sub">Litre</div></div>
        <div class="id-cell"><div class="id-lbl">Garanti</div><div class="id-val green">${garanti}</div></div>
      </div>
    </div>
    <div class="mid-right">
      <div class="mid-title">
        <div class="mt-peak"></div>
        <div class="mt-txt">Hasar &amp; Boya</div>
        <div class="mt-line"></div>
      </div>
      <div class="hasar-body">
        <div class="mini-svg">${miniSVG}</div>
        <div class="hasar-info">
          <div class="hi-legend">
            <div class="hi-li"><div class="hi-dot" style="background:#D8D8D4;border:1px solid #BCBCB8"></div><div class="hi-name">Orjinal</div></div>
            <div class="hi-li"><div class="hi-dot" style="background:#93C5FD"></div><div class="hi-name" style="color:#1B7FD4">Boyalı</div></div>
            <div class="hi-li"><div class="hi-dot" style="background:#FCD34D"></div><div class="hi-name" style="color:#B45309">Değişen</div></div>
            <div class="hi-li"><div class="hi-dot" style="background:#86EFAC"></div><div class="hi-name" style="color:#047857">Lokal</div></div>
          </div>
          <div class="hi-div"></div>
          <div class="hi-sum">${hasarSum}</div>
        </div>
      </div>
      <div class="hasar-footer">
        <div class="hf-tramer">
          <div class="hf-dot" style="background:${tramerColor}"></div>
          <div class="hf-txt" style="color:${tramerColor}">${tramerTxt}</div>
        </div>
        <div class="hf-score-row">
          <div class="hf-slbl">Skor</div>
          <div class="hf-sbar"><div class="hf-sfill" style="width:${skor}%"></div></div>
          <div class="hf-snum">${skor}</div>
        </div>
      </div>
    </div>
  </div>
  <div class="donanim">
    <div class="don-header"><div class="don-peak"></div><div class="don-title">Standart Donanım</div></div>
    <div class="don-chips">${donChips}</div>
  </div>
  <div class="footer">
    <div class="footer-ray"></div>
    <svg class="footer-peaks" viewBox="0 0 595 40" preserveAspectRatio="none">
      <path d="M0 40 L80 15 L130 28 L200 5 L260 20 L340 8 L400 22 L480 2 L540 18 L595 40 Z" fill="rgba(91,191,220,1)"/>
      <path d="M180 12 L200 5 L220 12 Z" fill="rgba(244,248,250,0.8)"/>
      <path d="M460 8 L480 2 L500 8 Z" fill="rgba(244,248,250,0.6)"/>
    </svg>
    <div class="footer-spectrum"></div>
    <div class="footer-body">
      <div>
        <div class="f-galeri">${companyName || 'Galeri Adı'}</div>
        <div class="f-phone">${telefon}</div>
      </div>
      <div class="f-center">
        <div class="f-icon">❄️</div>
        <div class="f-alh-n">AlhazenPDF</div>
        <div class="f-theme-name">Kristal Zirve · Alpine</div>
        <div class="f-alh-t">Premium · Satış Kartı</div>
      </div>
      <div class="f-price">
        <div class="f-plbl">İstenen Fiyat</div>
        <div class="f-pval">${fiyat} ₺</div>
        <div class="f-psub">KDV Dahil · Takas Görüşülür</div>
      </div>
    </div>
    <div class="footer-quote">
      <div class="fq-quote">"Zirvede sessizlik hüküm sürer; netlik oradan gelir, belirsizlik ovada kalır."</div>
      <div class="fq-tag">AlhazenPDF · KZ-2026</div>
    </div>
  </div>
</div>
</body>
</html>`;
  return postProcess(html, 595, 842);
};


/* ═══════════════════════════════════════════════════════════
   MUKARNAS AOTEAROA — Forest green/gold · Fern patterns · Mukarnas geometry · NZ/Maori fusion
   ═══════════════════════════════════════════════════════════ */
export const buildMukarnasAotearoaHTML = (data) => {
  const { formData = {}, photos = [], companyName = '', ekspertizData = {}, donanim = [], tramer = true } = data;

  const photo     = photos[0]?.base64 || '';
  const marka     = formData['Marka']    || 'MARKA';
  const model     = formData['Model']    || 'Model';
  const yil       = String(formData['Yıl'] || '2024').replace(/\./g, '');
  const yakit     = formData['Yakıt']    || 'Benzin';
  const motor     = formData['Motor']    || '—';
  const sanziman  = formData['Şanzıman'] || '—';
  const km        = formData['KM']       || '0 km';
  const renk      = formData['Renk']     || '—';
  const fiyat     = formatFiyat((formData['Fiyat'] || '0').replace(/\s*₺\s*/g, '').trim());
  const kasaTipi  = formData['Kasa Tipi'] || '—';
  const muayene   = formData['Muayene']  || '—';
  const bagaj     = formData['Bagaj']    || '—';
  const garanti   = formData['Garanti']  || '—';
  const telefon   = formData['Telefon']  || '';

  const skor        = calculateSkor(ekspertizData);
  const miniSVG     = buildMiniCarSVG(ekspertizData);
  const hasarSum    = buildHasarSummary(ekspertizData);
  const donChips    = buildDonanımChips(donanim);
  const tramerColor = tramer ? '#16A34A' : '#DC2626';
  const tramerTxt   = tramer ? 'Tramer Kaydı Yok' : 'Tramer Kaydı Var';

  const html = `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=595">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=Barlow+Condensed:wght@300;400;500;600;700;800;900&family=DM+Sans:wght@300;400;500&family=Share+Tech+Mono&family=Cinzel:wght@400;600;700;900&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
body { background:#F0EDE4; font-family:'DM Sans',sans-serif; }
:root {
  --void:#060E08; --deep:#0B1A0D; --forest:#0F2412; --moss:#1A3D1E;
  --fern:#2D6A35; --jade:#3D8B45; --kiwi:#5AAD5E; --pounamu:#2A6B5A;
  --cream:#F0EDE4; --stone:#E4DDD0; --gold:#C8952A; --gold2:#E8B040;
}
.a4 { width:595px; height:842px; position:relative; overflow:hidden; display:flex; flex-direction:column; background:var(--cream); -webkit-print-color-adjust:exact; print-color-adjust:exact; }
.mukarnas-bg { position:absolute; inset:0; z-index:0; pointer-events:none; }
.grain { position:absolute; inset:0; z-index:2; pointer-events:none; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.68' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E"); }
.hdr { height:80px; flex-shrink:0; background:var(--forest); position:relative; z-index:20; display:flex; flex-direction:column; overflow:hidden; }
.hdr-mukarnas { position:absolute; inset:0; pointer-events:none; z-index:1; }
.hdr-gold-line { position:absolute; top:0; left:0; right:0; height:2px; z-index:3; background:linear-gradient(90deg,transparent,var(--gold2) 15%,var(--gold) 50%,var(--gold2) 85%,transparent); }
.hdr-body { flex:1; padding:0 22px; display:flex; justify-content:space-between; align-items:center; position:relative; z-index:4; }
.hdr-brand { display:flex; align-items:center; gap:14px; }
.hdr-symbol { width:44px; height:44px; flex-shrink:0; position:relative; display:flex; align-items:center; justify-content:center; }
.hdr-sub { font-family:'Barlow Condensed',sans-serif; font-size:8px; font-weight:500; letter-spacing:0.5em; text-transform:uppercase; color:rgba(200,149,42,0.6); margin-bottom:3px; }
.hdr-latin { font-family:'Cinzel',serif; font-size:17px; font-weight:700; letter-spacing:0.1em; color:rgba(240,237,228,0.94); line-height:1; }
.hdr-title { font-family:'Cormorant Garamond',serif; font-size:10.5px; font-weight:300; font-style:italic; letter-spacing:0.14em; color:rgba(90,173,94,0.6); margin-top:4px; }
.hdr-badge { display:flex; flex-direction:column; align-items:flex-end; gap:5px; }
.hdr-badge-main { display:flex; align-items:center; gap:7px; padding:5px 12px 5px 8px; border:1px solid rgba(200,149,42,0.32); background:rgba(200,149,42,0.07); }
.hdr-star { width:12px; height:12px; flex-shrink:0; background:var(--gold2); clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%); box-shadow:0 0 8px rgba(232,176,64,0.55); }
.hdr-badge-t { font-family:'Barlow Condensed',sans-serif; font-size:11px; font-weight:800; letter-spacing:0.22em; text-transform:uppercase; background:linear-gradient(90deg,var(--gold),var(--gold2),#F5C855,var(--gold2)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.hdr-doc-no { font-family:'Share Tech Mono',monospace; font-size:7.5px; letter-spacing:0.18em; color:rgba(200,149,42,0.28); }
.hdr-rule { height:4px; flex-shrink:0; background:linear-gradient(90deg,var(--forest) 0%,var(--moss) 7%,var(--fern) 15%,var(--gold2) 25%,var(--jade) 35%,var(--kiwi) 45%,var(--pounamu) 54%,var(--gold2) 62%,var(--fern) 72%,var(--jade) 82%,var(--moss) 92%,var(--forest) 100%); }
.hero { height:108px; flex-shrink:0; background:transparent; position:relative; z-index:20; display:flex; align-items:flex-end; overflow:hidden; }
.hero-bg { position:absolute; inset:0; background:var(--cream); z-index:0; }
.hero-left-bar { position:absolute; left:0; top:0; bottom:0; width:5px; z-index:3; background:linear-gradient(180deg,var(--gold2),var(--fern),var(--pounamu)); }
.hero-fern-corner { position:absolute; right:0; top:0; width:130px; height:108px; pointer-events:none; z-index:2; opacity:0.06; }
.hero-year-wm { position:absolute; right:16px; top:50%; transform:translateY(-50%); font-family:'Cinzel',serif; font-size:96px; font-weight:900; letter-spacing:-0.02em; color:rgba(0,0,0,0.042); line-height:1; pointer-events:none; user-select:none; z-index:2; }
.hero-content { padding:0 0 14px 30px; flex:1; position:relative; z-index:4; }
.hero-tag { display:flex; align-items:center; gap:8px; margin-bottom:5px; }
.hero-koru { width:14px; height:14px; flex-shrink:0; }
.hero-tag-txt { font-family:'Barlow Condensed',sans-serif; font-size:8.5px; font-weight:700; letter-spacing:0.65em; text-transform:uppercase; color:rgba(0,0,0,0.28); }
.hero-tag-line { flex:1; height:1px; background:linear-gradient(90deg,rgba(45,106,53,0.3),transparent); }
.hero-make { font-family:'Cinzel',serif; font-size:72px; font-weight:900; line-height:0.82; letter-spacing:0.05em; color:#080F09; text-shadow:2px 3px 0 rgba(0,0,0,0.05); }
.hero-model { font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:400; font-style:italic; letter-spacing:0.16em; line-height:1; margin-top:4px; background:linear-gradient(90deg,var(--moss),var(--fern),var(--jade),var(--pounamu),var(--jade),var(--fern)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.hero-right { padding:0 22px 14px 0; text-align:right; flex-shrink:0; position:relative; z-index:4; }
.hr-year { font-family:'Barlow Condensed',sans-serif; font-size:10px; font-weight:500; letter-spacing:0.4em; text-transform:uppercase; color:rgba(0,0,0,0.27); margin-bottom:3px; }
.hr-series { font-family:'Cormorant Garamond',serif; font-size:14px; font-weight:300; font-style:italic; letter-spacing:0.1em; color:rgba(0,0,0,0.38); margin-bottom:6px; }
.hr-price { font-family:'Cinzel',serif; font-size:24px; font-weight:700; color:#080F09; line-height:1; }
.hr-price-sub { font-family:'Barlow Condensed',sans-serif; font-size:8px; font-weight:500; letter-spacing:0.4em; text-transform:uppercase; color:rgba(45,106,53,0.55); margin-top:2px; }
.nature-band { height:8px; flex-shrink:0; position:relative; z-index:20; background:var(--deep); }
.nature-band::before { content:''; position:absolute; inset:0; background:linear-gradient(90deg,var(--deep) 0%,var(--forest) 6%,var(--moss) 14%,var(--fern) 22%,var(--gold2) 30%,var(--jade) 40%,var(--kiwi) 50%,var(--pounamu) 58%,var(--gold) 66%,var(--fern) 74%,var(--moss) 84%,var(--forest) 92%,var(--deep) 100%); opacity:0.95; }
.nature-band::after { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(232,176,64,0.5) 50%,transparent); }
.nature-band.thin { height:6px; }
.photo { height:240px; flex-shrink:0; position:relative; overflow:hidden; z-index:15; background:linear-gradient(160deg,#0A1A0C,#060E08,#0C1E0E); }
.photo-txt { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); font-family:'Cinzel',serif; font-size:11px; font-style:italic; letter-spacing:0.5em; color:rgba(240,237,228,0.04); pointer-events:none; }
.photo-ray { position:absolute; left:0; top:0; bottom:0; width:5px; z-index:3; background:linear-gradient(180deg,var(--moss) 0%,var(--fern) 15%,var(--gold2) 30%,var(--jade) 50%,var(--pounamu) 70%,var(--fern) 85%,var(--moss) 100%); }
.photo-gt { position:absolute; top:0; left:0; right:0; height:45px; background:linear-gradient(180deg,rgba(6,14,8,0.65),transparent); z-index:2; pointer-events:none; }
.photo-gb { position:absolute; bottom:0; left:0; right:0; height:65px; background:linear-gradient(180deg,transparent,var(--cream)); z-index:2; pointer-events:none; }
.photo-chips { position:absolute; top:12px; right:14px; z-index:4; display:flex; flex-direction:column; gap:5px; align-items:flex-end; }
.pchip { display:flex; align-items:center; gap:7px; padding:5px 11px; background:rgba(6,14,8,0.82); border:1px solid rgba(200,149,42,0.22); border-left:2px solid var(--gold); backdrop-filter:blur(6px); }
.pchip-l { font-family:'Barlow Condensed',sans-serif; font-size:7.5px; font-weight:600; letter-spacing:0.4em; text-transform:uppercase; color:rgba(240,237,228,0.32); }
.pchip-v { font-family:'Barlow Condensed',sans-serif; font-size:13px; font-weight:700; color:rgba(240,237,228,0.88); }
.pchip-v.jade { color:var(--kiwi); }
.pchip-v.ok { color:#4ADE80; }
.photo-seal { position:absolute; bottom:12px; left:16px; z-index:4; display:flex; align-items:center; gap:8px; }
.seal-ring { width:52px; height:52px; border-radius:50%; border:1.5px solid rgba(200,149,42,0.4); display:flex; align-items:center; justify-content:center; position:relative; }
.seal-ring::before { content:''; position:absolute; inset:5px; border-radius:50%; border:1px dashed rgba(200,149,42,0.2); }
.seal-inner { display:flex; flex-direction:column; align-items:center; gap:1px; }
.seal-icon { font-size:14px; line-height:1; }
.seal-text { font-family:'Barlow Condensed',sans-serif; font-size:5px; font-weight:800; letter-spacing:0.14em; text-transform:uppercase; color:rgba(200,149,42,0.6); text-align:center; line-height:1.3; }
.seal-date { font-family:'Share Tech Mono',monospace; font-size:5.5px; color:rgba(200,149,42,0.38); letter-spacing:0.1em; }
.seal-label { display:flex; flex-direction:column; gap:1px; }
.sl-main { font-family:'Cinzel',serif; font-size:9px; font-weight:600; letter-spacing:0.1em; color:rgba(200,149,42,0.7); }
.sl-sub { font-family:'Barlow Condensed',sans-serif; font-size:8px; font-weight:500; letter-spacing:0.25em; text-transform:uppercase; color:rgba(240,237,228,0.25); }
.cn { position:absolute; z-index:4; }
.cn::before, .cn::after { content:''; position:absolute; }
.cn.tl { top:0;left:0;width:18px;height:18px; }
.cn.tl::before { top:0;left:0;right:0;height:2px;background:var(--gold2); }
.cn.tl::after { top:0;left:0;bottom:0;width:2px;background:var(--gold2); }
.cn.tr { top:0;right:0;width:18px;height:18px; }
.cn.tr::before { top:0;left:0;right:0;height:2px;background:var(--jade); }
.cn.tr::after { top:0;right:0;bottom:0;width:2px;background:var(--jade); }
.cn.br { bottom:0;right:0;width:18px;height:18px; }
.cn.br::before { bottom:0;left:0;right:0;height:2px;background:rgba(200,149,42,0.3); }
.cn.br::after { top:0;right:0;bottom:0;width:2px;background:rgba(200,149,42,0.3); }
.middle { height:200px; flex-shrink:0; display:flex; z-index:20; position:relative; background:transparent; border-bottom:1px solid rgba(0,0,0,0.07); }
.middle-bg { position:absolute; inset:0; background:var(--cream); z-index:0; }
.mid-title { height:26px; flex-shrink:0; padding:0 16px; display:flex; align-items:center; gap:8px; border-bottom:1px solid rgba(0,0,0,0.07); background:rgba(45,106,53,0.04); position:relative; z-index:2; }
.mt-star { width:9px; height:9px; flex-shrink:0; background:var(--fern); clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%); }
.mt-txt { font-family:'Cinzel',serif; font-size:8px; font-weight:600; letter-spacing:0.42em; text-transform:uppercase; color:rgba(0,0,0,0.3); }
.mt-line { flex:1; height:1px; background:linear-gradient(90deg,rgba(45,106,53,0.25),transparent); }
.mid-left { flex:1; border-right:1px solid rgba(0,0,0,0.07); display:flex; flex-direction:column; overflow:hidden; position:relative; z-index:2; }
.id-grid { display:grid; grid-template-columns:1fr 1fr; flex:1; }
.id-cell { display:flex; flex-direction:column; justify-content:center; padding:0 16px; min-height:0; border-right:1px solid rgba(0,0,0,0.055); border-bottom:1px solid rgba(0,0,0,0.055); }
.id-cell:nth-child(even) { border-right:none; }
.id-cell:nth-last-child(-n+2) { border-bottom:none; }
.id-lbl { font-family:'Barlow Condensed',sans-serif; font-size:7.5px; font-weight:700; letter-spacing:0.45em; text-transform:uppercase; color:rgba(0,0,0,0.25); line-height:1; }
.id-val { font-family:'Cinzel',serif; font-size:15px; font-weight:700; letter-spacing:0.02em; color:#080F09; line-height:1; margin-top:2px; }
.id-val.fern { color:var(--fern); }
.id-val.green { color:#16A34A; }
.id-val.sm { font-size:12px; font-weight:400; color:rgba(0,0,0,0.55); font-style:italic; font-family:'Cormorant Garamond',serif; }
.id-sub { font-family:'Barlow Condensed',sans-serif; font-size:9px; font-weight:400; letter-spacing:0.12em; color:rgba(0,0,0,0.3); margin-top:1px; }
.mid-right { width:192px; flex-shrink:0; display:flex; flex-direction:column; overflow:hidden; position:relative; z-index:2; }
.hasar-body { flex:1; display:flex; padding:8px 10px 6px 8px; gap:8px; align-items:flex-start; overflow:hidden; }
.mini-svg { width:84px; height:136px; flex-shrink:0; filter:drop-shadow(0 2px 8px rgba(0,0,0,0.1)); }
.hasar-info { flex:1; display:flex; flex-direction:column; gap:4px; padding-top:1px; }
.hi-legend { display:flex; flex-direction:column; gap:3px; }
.hi-li { display:flex; align-items:center; gap:5px; }
.hi-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.hi-name { font-family:'Barlow Condensed',sans-serif; font-size:9px; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; color:rgba(0,0,0,0.45); }
.hi-div { height:1px; background:rgba(0,0,0,0.08); margin:3px 0; }
.hi-sum { display:flex; flex-direction:column; gap:4px; }
.hi-row { display:flex; align-items:flex-start; gap:4px; }
.hi-rdot { width:6px; height:6px; border-radius:50%; flex-shrink:0; margin-top:2px; }
.hi-state { font-family:'Barlow Condensed',sans-serif; font-size:8px; font-weight:800; letter-spacing:0.14em; text-transform:uppercase; line-height:1; }
.hi-parts { font-family:'DM Sans',sans-serif; font-size:8px; color:rgba(0,0,0,0.45); line-height:1.3; margin-top:1px; }
.hasar-footer { flex-shrink:0; padding:6px 10px 8px; border-top:1px solid rgba(0,0,0,0.07); background:rgba(0,0,0,0.02); }
.hf-tramer { display:flex; align-items:center; gap:5px; margin-bottom:5px; }
.hf-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
.hf-txt { font-family:'Barlow Condensed',sans-serif; font-size:9px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; }
.hf-score-row { display:flex; align-items:center; gap:6px; }
.hf-slbl { font-family:'Barlow Condensed',sans-serif; font-size:8px; font-weight:600; letter-spacing:0.3em; text-transform:uppercase; color:rgba(0,0,0,0.3); flex-shrink:0; }
.hf-sbar { flex:1; height:5px; background:rgba(0,0,0,0.08); border-radius:3px; overflow:hidden; }
.hf-sfill { height:100%; border-radius:3px; background:linear-gradient(90deg,var(--moss),var(--fern),var(--jade)); }
.hf-snum { font-family:'Cinzel',serif; font-size:13px; font-weight:700; color:var(--fern); }
.donanim { height:82px; flex-shrink:0; position:relative; z-index:20; background:var(--forest); padding:10px 24px; overflow:hidden; }
.donanim::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,var(--moss) 8%,var(--gold2) 18%,var(--fern) 28%,var(--jade) 38%,var(--gold2) 50%,var(--pounamu) 60%,var(--gold) 70%,var(--fern) 82%,transparent); }
.donanim::after { content:''; position:absolute; top:-20px; left:50%; transform:translateX(-50%); width:200px; height:120px; background:radial-gradient(ellipse,rgba(90,173,94,0.05) 0%,transparent 70%); pointer-events:none; }
.don-header { display:flex; align-items:center; gap:8px; margin-bottom:7px; }
.don-star { width:8px; height:8px; flex-shrink:0; background:var(--gold2); clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%); box-shadow:0 0 6px rgba(232,176,64,0.6); }
.don-title { font-family:'Barlow Condensed',sans-serif; font-size:8px; font-weight:700; letter-spacing:0.55em; text-transform:uppercase; color:rgba(200,149,42,0.6); }
.don-chips { display:flex; flex-wrap:wrap; gap:4px; }
.dc { display:flex; align-items:center; gap:4px; padding:4px 9px; background:rgba(255,255,255,0.04); border:1px solid rgba(200,149,42,0.1); border-bottom:1.5px solid rgba(45,106,53,0.35); border-radius:1px; }
.dc-dot { width:5px; height:5px; flex-shrink:0; background:var(--jade); clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%); }
.dc-txt { font-family:'Barlow Condensed',sans-serif; font-size:9px; font-weight:600; letter-spacing:0.08em; color:rgba(240,237,228,0.62); white-space:nowrap; }
.footer { height:118px; flex-shrink:0; background:var(--void); position:relative; z-index:20; display:flex; flex-direction:column; overflow:hidden; }
.footer-forest-glow { position:absolute; inset:0; pointer-events:none; background: radial-gradient(ellipse 80% 160% at 15% 50%,rgba(45,106,53,0.1) 0%,transparent 55%), radial-gradient(ellipse 60% 140% at 85% 50%,rgba(42,107,90,0.08) 0%,transparent 50%); }
.footer-spectrum { height:4px; flex-shrink:0; background:linear-gradient(90deg,var(--void) 0%,var(--forest) 6%,var(--moss) 14%,var(--fern) 22%,var(--gold2) 30%,var(--jade) 40%,var(--kiwi) 50%,var(--pounamu) 58%,var(--gold) 66%,var(--fern) 76%,var(--moss) 86%,var(--void) 100%); }
.footer-body { flex:1; padding:0 24px; display:grid; grid-template-columns:1fr auto 1fr; align-items:center; position:relative; z-index:2; }
.f-galeri { font-family:'Cinzel',serif; font-size:13px; font-weight:600; letter-spacing:0.1em; color:rgba(240,237,228,0.9); line-height:1; }
.f-detail { font-family:'Share Tech Mono',monospace; font-size:8px; letter-spacing:0.12em; color:rgba(240,237,228,0.2); line-height:1.9; margin-top:3px; }
.f-phone { font-family:'Cormorant Garamond',serif; font-size:18px; font-weight:400; font-style:italic; letter-spacing:0.04em; color:rgba(200,149,42,0.75); margin-top:2px; }
.f-center { display:flex; flex-direction:column; align-items:center; gap:2px; padding:0 22px; border-left:1px solid rgba(255,255,255,0.05); border-right:1px solid rgba(255,255,255,0.05); }
.f-icon { font-size:18px; margin-bottom:2px; }
.f-alh-n { font-family:'Cinzel',serif; font-size:17px; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; background:linear-gradient(90deg,var(--gold),var(--gold2),#F5C855,var(--gold2),var(--gold)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; filter:drop-shadow(0 0 10px rgba(200,149,42,0.35)); white-space:nowrap; }
.f-theme-name { font-family:'Cormorant Garamond',serif; font-size:9px; font-weight:300; font-style:italic; letter-spacing:0.18em; color:rgba(90,173,94,0.4); white-space:nowrap; margin-top:1px; }
.f-alh-t { font-family:'Barlow Condensed',sans-serif; font-size:7px; letter-spacing:0.45em; text-transform:uppercase; color:rgba(200,149,42,0.3); }
.f-price { text-align:right; }
.f-plbl { font-family:'Barlow Condensed',sans-serif; font-size:7.5px; letter-spacing:0.5em; text-transform:uppercase; color:rgba(240,237,228,0.22); margin-bottom:2px; }
.f-pval { font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:600; color:rgba(240,237,228,0.92); line-height:1; }
.f-psub { font-family:'Barlow Condensed',sans-serif; font-size:7.5px; letter-spacing:0.42em; text-transform:uppercase; color:rgba(200,149,42,0.42); margin-top:2px; }
.footer-quote { height:28px; flex-shrink:0; padding:0 24px; border-top:1px solid rgba(255,255,255,0.04); background:rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:space-between; position:relative; z-index:2; }
.fq-quote { font-family:'Cormorant Garamond',serif; font-size:9px; font-weight:300; font-style:italic; letter-spacing:0.06em; color:rgba(200,149,42,0.32); flex:1; }
.fq-tag { font-family:'Barlow Condensed',sans-serif; font-size:7px; font-weight:700; letter-spacing:0.3em; text-transform:uppercase; color:rgba(200,149,42,0.22); white-space:nowrap; margin-left:12px; }
</style>
</head>
<body>
<div class="a4">
  <svg class="mukarnas-bg" viewBox="0 0 595 842" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <defs>
      <pattern id="mukP" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        <polygon points="30,4 44,10 56,22 56,38 44,50 30,56 16,50 4,38 4,22 16,10" fill="none" stroke="rgba(45,106,53,0.14)" stroke-width="0.7"/>
        <rect x="21" y="21" width="18" height="18" transform="rotate(45 30 30)" fill="none" stroke="rgba(45,106,53,0.1)" stroke-width="0.5"/>
        <circle cx="30" cy="30" r="2.5" fill="none" stroke="rgba(200,149,42,0.18)" stroke-width="0.5"/>
        <circle cx="4" cy="4" r="1.5" fill="rgba(45,106,53,0.12)"/><circle cx="56" cy="4" r="1.5" fill="rgba(45,106,53,0.12)"/>
        <circle cx="4" cy="56" r="1.5" fill="rgba(45,106,53,0.12)"/><circle cx="56" cy="56" r="1.5" fill="rgba(45,106,53,0.12)"/>
        <line x1="4" y1="22" x2="16" y2="10" stroke="rgba(45,106,53,0.08)" stroke-width="0.4"/>
        <line x1="44" y1="10" x2="56" y2="22" stroke="rgba(45,106,53,0.08)" stroke-width="0.4"/>
        <line x1="56" y1="38" x2="44" y2="50" stroke="rgba(45,106,53,0.08)" stroke-width="0.4"/>
        <line x1="16" y1="50" x2="4" y2="38" stroke="rgba(45,106,53,0.08)" stroke-width="0.4"/>
      </pattern>
      <pattern id="mukStar" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
        <polygon points="60,5 67,26 80,14 73,34 93,28 82,45 103,46 87,58 103,70 82,70 93,87 73,81 80,101 67,89 60,110 53,89 40,101 47,81 27,87 38,70 17,70 33,58 17,46 38,45 27,28 47,34 40,14 53,26" fill="none" stroke="rgba(45,106,53,0.07)" stroke-width="0.8"/>
        <polygon points="60,38 70,43 78,52 78,68 70,77 60,82 50,77 42,68 42,52 50,43" fill="none" stroke="rgba(200,149,42,0.1)" stroke-width="0.6"/>
        <circle cx="60" cy="60" r="4" fill="none" stroke="rgba(200,149,42,0.15)" stroke-width="0.6"/>
        <circle cx="60" cy="60" r="1.5" fill="rgba(200,149,42,0.2)"/>
      </pattern>
    </defs>
    <rect width="595" height="842" fill="url(#mukStar)"/>
    <rect width="595" height="842" fill="url(#mukP)"/>
    <line x1="297.5" y1="88" x2="297.5" y2="330" stroke="rgba(45,106,53,0.05)" stroke-width="0.5" stroke-dasharray="3,6"/>
    <line x1="0" y1="402" x2="595" y2="402" stroke="rgba(200,149,42,0.06)" stroke-width="0.4"/>
  </svg>
  <div class="grain"></div>
  <div class="hdr">
    <svg class="hdr-mukarnas" viewBox="0 0 595 80" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.18">
        <polygon points="8,80 8,55 20,45 32,55 32,80" fill="rgba(45,106,53,0.4)" stroke="rgba(200,149,42,0.3)" stroke-width="0.5"/>
        <polygon points="14,55 14,35 23,27 32,35 32,55" fill="rgba(45,106,53,0.3)" stroke="rgba(200,149,42,0.25)" stroke-width="0.5"/>
        <polygon points="18,35 18,20 23,14 28,20 28,35" fill="rgba(200,149,42,0.35)" stroke="rgba(200,149,42,0.4)" stroke-width="0.5"/>
        <path d="M8 55 Q14 50 20 45 Q26 50 32 55" fill="rgba(45,106,53,0.25)" stroke="rgba(200,149,42,0.2)" stroke-width="0.4"/>
        <path d="M14 35 Q18 30 23 27 Q28 30 32 35" fill="rgba(45,106,53,0.2)" stroke="rgba(200,149,42,0.18)" stroke-width="0.4"/>
      </g>
      <g opacity="0.18">
        <polygon points="563,80 563,55 575,45 587,55 587,80" fill="rgba(45,106,53,0.4)" stroke="rgba(200,149,42,0.3)" stroke-width="0.5"/>
        <polygon points="569,55 569,35 575,27 581,35 581,55" fill="rgba(45,106,53,0.3)" stroke="rgba(200,149,42,0.25)" stroke-width="0.5"/>
        <polygon points="571,35 571,20 575,14 579,20 579,35" fill="rgba(200,149,42,0.35)" stroke="rgba(200,149,42,0.4)" stroke-width="0.5"/>
        <path d="M563 55 Q569 50 575 45 Q581 50 587 55" fill="rgba(45,106,53,0.25)" stroke="rgba(200,149,42,0.2)" stroke-width="0.4"/>
        <path d="M569 35 Q572 30 575 27 Q578 30 581 35" fill="rgba(45,106,53,0.2)" stroke="rgba(200,149,42,0.18)" stroke-width="0.4"/>
      </g>
      <g opacity="0.15">
        <path d="M0 76 Q5 70 10 76 Q15 70 20 76 Q25 70 30 76 Q35 70 40 76 Q45 70 50 76 Q55 70 60 76 Q65 70 70 76 Q75 70 80 76 Q85 70 90 76 Q95 70 100 76 Q105 70 110 76 Q115 70 120 76 Q125 70 130 76 Q135 70 140 76 Q145 70 150 76 Q155 70 160 76 Q165 70 170 76 Q175 70 180 76 Q185 70 190 76 Q195 70 200 76 Q205 70 210 76 Q215 70 220 76 Q225 70 230 76 Q235 70 240 76 Q245 70 250 76 Q255 70 260 76 Q265 70 270 76 Q275 70 280 76 Q285 70 290 76 Q295 70 300 76 Q305 70 310 76 Q315 70 320 76 Q325 70 330 76 Q335 70 340 76 Q345 70 350 76 Q355 70 360 76 Q365 70 370 76 Q375 70 380 76 Q385 70 390 76 Q395 70 400 76 Q405 70 410 76 Q415 70 420 76 Q425 70 430 76 Q435 70 440 76 Q445 70 450 76 Q455 70 460 76 Q465 70 470 76 Q475 70 480 76 Q485 70 490 76 Q495 70 500 76 Q505 70 510 76 Q515 70 520 76 Q525 70 530 76 Q535 70 540 76 Q545 70 550 76 Q555 70 560 76 Q565 70 570 76 Q575 70 580 76 Q585 70 590 76 Q592 70 595 76" fill="rgba(45,106,53,0.25)" stroke="none"/>
      </g>
    </svg>
    <div class="hdr-gold-line"></div>
    <div class="hdr-body">
      <div class="hdr-brand">
        <div class="hdr-symbol">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <polygon points="22,2 32,6 40,14 42,22 40,30 32,38 22,42 12,38 4,30 2,22 4,14 12,6" fill="none" stroke="rgba(200,149,42,0.45)" stroke-width="1"/>
            <polygon points="22,8 25,17 34,17 27,23 30,32 22,26 14,32 17,23 10,17 19,17" fill="none" stroke="rgba(200,149,42,0.3)" stroke-width="0.7"/>
            <path d="M22 34 Q22 26 26 22 Q30 18 28 13 Q26 8 22 8" fill="none" stroke="rgba(90,173,94,0.6)" stroke-width="1.2" stroke-linecap="round"/>
            <path d="M22 8 Q27 6 28 11 Q29 16 23 16 Q17 16 22 8" fill="none" stroke="rgba(90,173,94,0.5)" stroke-width="0.8"/>
            <circle cx="22" cy="22" r="2.5" fill="rgba(200,149,42,0.75)"/>
            <circle cx="22" cy="22" r="1" fill="rgba(255,255,255,0.8)"/>
            <circle cx="22" cy="2" r="1.2" fill="rgba(200,149,42,0.45)"/>
            <circle cx="22" cy="42" r="1.2" fill="rgba(90,173,94,0.5)"/>
          </svg>
        </div>
        <div>
          <div class="hdr-sub">Mukarnas · Aotearoa</div>
          <div class="hdr-latin">Alhazen</div>
          <div class="hdr-title">Premium Araç Ekspertiz Raporu</div>
        </div>
      </div>
      <div class="hdr-badge">
        <div class="hdr-badge-main">
          <div class="hdr-star"></div>
          <div class="hdr-badge-t">AlhazenPDF</div>
        </div>
        <div class="hdr-doc-no">MK-2026 · ESK-TR</div>
      </div>
    </div>
    <div class="hdr-rule"></div>
  </div>
  <div class="hero">
    <div class="hero-bg"></div>
    <div class="hero-left-bar"></div>
    <div class="hero-year-wm">${yil}</div>
    <svg class="hero-fern-corner" viewBox="0 0 130 108" fill="none">
      <path d="M130 108 Q128 70 110 50 Q92 30 100 5" stroke="rgba(45,106,53,1)" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <path d="M118 75 Q128 65 122 52" stroke="rgba(45,106,53,0.7)" stroke-width="0.9" fill="none"/>
      <path d="M112 60 Q122 50 116 37" stroke="rgba(45,106,53,0.6)" stroke-width="0.8" fill="none"/>
      <path d="M106 44 Q116 34 110 21" stroke="rgba(45,106,53,0.55)" stroke-width="0.7" fill="none"/>
      <path d="M100 5 Q112 0 116 10 Q120 20 109 22 Q98 24 100 5" stroke="rgba(45,106,53,0.8)" stroke-width="0.9" fill="none"/>
    </svg>
    <div class="hero-content">
      <div class="hero-tag">
        <svg class="hero-koru" viewBox="0 0 14 14" fill="none">
          <path d="M7 13 Q7 8 10 6 Q13 4 11 1" stroke="rgba(45,106,53,0.45)" stroke-width="1.2" stroke-linecap="round" fill="none"/>
          <path d="M11 1 Q14 0 14 3 Q14 6 10 6" stroke="rgba(45,106,53,0.4)" stroke-width="0.8" fill="none"/>
        </svg>
        <div class="hero-tag-txt">Satılık · Premium Araç</div>
        <div class="hero-tag-line"></div>
      </div>
      <div class="hero-make">${marka}</div>
      <div class="hero-model">${model}</div>
    </div>
    <div class="hero-right">
      <div class="hr-year">Model · ${yil}</div>
      <div class="hr-series">${kasaTipi} · ${yakit}</div>
      <div class="hr-price">${fiyat} ₺</div>
      <div class="hr-price-sub">Satış Fiyatı · KDV Dahil</div>
    </div>
  </div>
  <div class="nature-band"></div>
  <div class="photo"${photo ? ' style="background:none"' : ''}>
    ${!photo ? '<div class="photo-txt">Araç Fotoğrafı</div>' : ''}
    <div class="photo-ray"></div>
    <div class="photo-gt"></div>
    <div class="photo-gb"></div>
    ${photo ? `<img src="${photo}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"/>` : ''}
    <div class="photo-chips">
      <div class="pchip"><div class="pchip-l">KM</div><div class="pchip-v jade">${km}</div></div>
      <div class="pchip"><div class="pchip-l">Renk</div><div class="pchip-v">${renk}</div></div>
      <div class="pchip"><div class="pchip-l">Muayene</div><div class="pchip-v ok">${muayene}</div></div>
    </div>
    <div class="photo-seal">
      <div class="seal-ring">
        <div class="seal-inner">
          <div class="seal-icon">🌿</div>
          <div class="seal-text">MUKARNAS<br>AOTEAROA</div>
          <div class="seal-date">ALHAZEN</div>
        </div>
      </div>
      <div class="seal-label">
        <div class="sl-main">AlhazenPDF</div>
        <div class="sl-sub">Premium Satış Kartı</div>
      </div>
    </div>
    <div class="cn tl"></div><div class="cn tr"></div><div class="cn br"></div>
  </div>
  <div class="nature-band thin"></div>
  <div class="middle">
    <div class="middle-bg"></div>
    <div class="mid-left">
      <div class="mid-title">
        <div class="mt-star"></div>
        <div class="mt-txt">Araç Kimliği</div>
        <div class="mt-line"></div>
      </div>
      <div class="id-grid">
        <div class="id-cell"><div class="id-lbl">Motor</div><div class="id-val fern">${motor}</div><div class="id-sub">${yakit}</div></div>
        <div class="id-cell"><div class="id-lbl">Şanzıman</div><div class="id-val">${sanziman}</div></div>
        <div class="id-cell"><div class="id-lbl">Kilometre</div><div class="id-val fern">${km}</div><div class="id-sub">km</div></div>
        <div class="id-cell"><div class="id-lbl">Renk</div><div class="id-val sm">${renk}</div><div class="id-sub">Orijinal Boya</div></div>
        <div class="id-cell"><div class="id-lbl">Muayene</div><div class="id-val green">${muayene}</div><div class="id-sub">Geçerli ✓</div></div>
        <div class="id-cell"><div class="id-lbl">Kasa</div><div class="id-val sm">${kasaTipi}</div></div>
        <div class="id-cell"><div class="id-lbl">Bagaj</div><div class="id-val">${bagaj}</div><div class="id-sub">Litre</div></div>
        <div class="id-cell"><div class="id-lbl">Garanti</div><div class="id-val green">${garanti}</div></div>
      </div>
    </div>
    <div class="mid-right">
      <div class="mid-title">
        <div class="mt-star"></div>
        <div class="mt-txt">Hasar &amp; Boya</div>
        <div class="mt-line"></div>
      </div>
      <div class="hasar-body">
        <div class="mini-svg">${miniSVG}</div>
        <div class="hasar-info">
          <div class="hi-legend">
            <div class="hi-li"><div class="hi-dot" style="background:#D8D8D4;border:1px solid #BCBCB8"></div><div class="hi-name">Orjinal</div></div>
            <div class="hi-li"><div class="hi-dot" style="background:#93C5FD"></div><div class="hi-name" style="color:#1B7FD4">Boyalı</div></div>
            <div class="hi-li"><div class="hi-dot" style="background:#FCD34D"></div><div class="hi-name" style="color:#B45309">Değişen</div></div>
            <div class="hi-li"><div class="hi-dot" style="background:#86EFAC"></div><div class="hi-name" style="color:#047857">Lokal</div></div>
          </div>
          <div class="hi-div"></div>
          <div class="hi-sum">${hasarSum}</div>
        </div>
      </div>
      <div class="hasar-footer">
        <div class="hf-tramer">
          <div class="hf-dot" style="background:${tramerColor}"></div>
          <div class="hf-txt" style="color:${tramerColor}">${tramerTxt}</div>
        </div>
        <div class="hf-score-row">
          <div class="hf-slbl">Skor</div>
          <div class="hf-sbar"><div class="hf-sfill" style="width:${skor}%"></div></div>
          <div class="hf-snum">${skor}</div>
        </div>
      </div>
    </div>
  </div>
  <div class="donanim">
    <div class="don-header"><div class="don-star"></div><div class="don-title">Standart Donanım</div></div>
    <div class="don-chips">${donChips}</div>
  </div>
  <div class="footer">
    <div class="footer-forest-glow"></div>
    <div class="footer-spectrum"></div>
    <div class="footer-body">
      <div>
        <div class="f-galeri">${companyName || 'Galeri Adı'}</div>
        <div class="f-phone">${telefon}</div>
      </div>
      <div class="f-center">
        <div class="f-icon">🌿</div>
        <div class="f-alh-n">AlhazenPDF</div>
        <div class="f-theme-name">Mukarnas · Aotearoa</div>
        <div class="f-alh-t">Premium · Satış Kartı</div>
      </div>
      <div class="f-price">
        <div class="f-plbl">İstenen Fiyat</div>
        <div class="f-pval">${fiyat} ₺</div>
        <div class="f-psub">KDV Dahil · Takas Görüşülür</div>
      </div>
    </div>
    <div class="footer-quote">
      <div class="fq-quote">"Geometri bir sanatt; orman büyür, taş oyulur — ikisi de uzun zaman yaşar."</div>
      <div class="fq-tag">AlhazenPDF · MK-2026</div>
    </div>
  </div>
</div>
</body>
</html>`;
  return postProcess(html, 595, 842);
};


/* ═══════════════════════════════════════════════════════════
   İZNİK ÇİNİ — Ottoman Iznik tiles · Cobalt blue · Tulip motifs · Parchment background
   ═══════════════════════════════════════════════════════════ */
export const buildIznikCiniHTML = (data) => {
  const { formData = {}, photos = [], companyName = '', ekspertizData = {}, donanim = [], tramer = true } = data;

  const photo     = photos[0]?.base64 || '';
  const marka     = formData['Marka']    || 'MARKA';
  const model     = formData['Model']    || 'Model';
  const yil       = String(formData['Yıl'] || '2024').replace(/\./g, '');
  const yakit     = formData['Yakıt']    || 'Benzin';
  const motor     = formData['Motor']    || '—';
  const sanziman  = formData['Şanzıman'] || '—';
  const km        = formData['KM']       || '0 km';
  const renk      = formData['Renk']     || '—';
  const fiyat     = formatFiyat((formData['Fiyat'] || '0').replace(/\s*₺\s*/g, '').trim());
  const kasaTipi  = formData['Kasa Tipi'] || '—';
  const muayene   = formData['Muayene']  || '—';
  const bagaj     = formData['Bagaj']    || '—';
  const garanti   = formData['Garanti']  || '—';
  const telefon   = formData['Telefon']  || '';

  const skor        = calculateSkor(ekspertizData);
  const miniSVG     = buildMiniCarSVG(ekspertizData);
  const hasarSum    = buildHasarSummary(ekspertizData);
  const donChips    = buildDonanımChips(donanim);
  const tramerColor = tramer ? '#16A34A' : '#DC2626';
  const tramerTxt   = tramer ? 'Tramer Kaydı Yok' : 'Tramer Kaydı Var';

  const html = `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=595">
<link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Barlow+Condensed:wght@300;400;500;600;700;800;900&family=DM+Sans:wght@300;400;500&family=Share+Tech+Mono&family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
body { background:#F5EDE0; font-family:'DM Sans',sans-serif; }
:root {
  --kiremit:#1A0A0F; --koyu:#220D14; --toprak:#F5EDE0; --toprak2:#EDE0CC;
  --cobalt:#1B4F8A; --cobalt2:#2563B0; --lale:#C0392B; --lale2:#E04535;
  --firuze:#1A7A6E; --firuze2:#22A090; --altin:#B8860B; --altin2:#D4A020;
}
.a4 { width:595px; height:842px; position:relative; overflow:hidden; display:flex; flex-direction:column; background:var(--toprak); -webkit-print-color-adjust:exact; print-color-adjust:exact; }
.grain { position:absolute; inset:0; z-index:1; pointer-events:none; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E"); }
.cini-pattern { position:absolute; inset:0; z-index:0; pointer-events:none; opacity:0.028; background-image:radial-gradient(circle 2px at 40px 40px,var(--cobalt) 100%,transparent 100%),radial-gradient(circle 1.5px at 20px 20px,var(--lale) 100%,transparent 100%); background-size:40px 40px; }
.hdr { height:80px; flex-shrink:0; background:var(--cobalt); position:relative; z-index:20; display:flex; flex-direction:column; overflow:hidden; }
.hdr-cini-bg { position:absolute; inset:0; pointer-events:none; background-image:radial-gradient(ellipse 180% 160% at -5% 50%,rgba(192,57,43,0.18) 0%,transparent 45%),radial-gradient(ellipse 100% 200% at 105% 50%,rgba(26,122,110,0.12) 0%,transparent 40%); }
.hdr-gold-top { position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,var(--altin2) 20%,var(--altin) 50%,var(--altin2) 80%,transparent); }
.hdr-body { flex:1; padding:0 22px; display:flex; justify-content:space-between; align-items:center; position:relative; z-index:2; }
.hdr-brand { display:flex; align-items:center; gap:14px; }
.hdr-lale { width:44px; height:44px; flex-shrink:0; position:relative; display:flex; align-items:center; justify-content:center; }
.hdr-sub { font-family:'Barlow Condensed',sans-serif; font-size:8px; font-weight:500; letter-spacing:0.5em; text-transform:uppercase; color:rgba(212,160,32,0.65); margin-bottom:3px; }
.hdr-latin { font-family:'Libre Baskerville',serif; font-size:18px; font-weight:700; letter-spacing:0.06em; color:rgba(245,237,224,0.95); line-height:1; }
.hdr-title { font-family:'Libre Baskerville',serif; font-size:10px; font-weight:400; font-style:italic; letter-spacing:0.12em; color:rgba(212,160,32,0.55); margin-top:4px; }
.hdr-badge { display:flex; flex-direction:column; align-items:flex-end; gap:5px; }
.hdr-badge-main { display:flex; align-items:center; gap:7px; padding:5px 12px 5px 8px; border:1px solid rgba(212,160,32,0.35); background:rgba(212,160,32,0.08); }
.hdr-badge-sekizgen { width:12px; height:12px; flex-shrink:0; background:var(--altin2); clip-path:polygon(30% 0%,70% 0%,100% 30%,100% 70%,70% 100%,30% 100%,0% 70%,0% 30%); box-shadow:0 0 8px rgba(212,160,32,0.5); }
.hdr-badge-t { font-family:'Barlow Condensed',sans-serif; font-size:11px; font-weight:800; letter-spacing:0.22em; text-transform:uppercase; background:linear-gradient(90deg,var(--altin),var(--altin2),#F0C040,var(--altin2)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.hdr-doc-no { font-family:'Share Tech Mono',monospace; font-size:7.5px; letter-spacing:0.18em; color:rgba(212,160,32,0.28); }
.hdr-rule { height:4px; flex-shrink:0; background:linear-gradient(90deg,var(--cobalt) 0%,var(--firuze) 8%,var(--cobalt2) 18%,var(--altin2) 28%,var(--lale2) 38%,var(--altin2) 46%,var(--cobalt2) 54%,var(--firuze2) 62%,var(--altin2) 72%,var(--lale) 80%,var(--cobalt2) 90%,var(--cobalt) 100%); }
.hero { height:108px; flex-shrink:0; background:var(--toprak); position:relative; z-index:20; display:flex; align-items:flex-end; overflow:hidden; }
.hero-left-bar { position:absolute; left:0; top:0; bottom:0; width:5px; background:linear-gradient(180deg,var(--lale),var(--cobalt),var(--firuze)); }
.hero-corner-cini { position:absolute; right:0; top:0; width:140px; height:108px; pointer-events:none; opacity:0.055; }
.hero-year-wm { position:absolute; right:16px; top:50%; transform:translateY(-50%); font-family:'Libre Baskerville',serif; font-size:96px; font-weight:700; letter-spacing:-0.02em; color:rgba(0,0,0,0.045); line-height:1; pointer-events:none; user-select:none; }
.hero-content { padding:0 0 14px 30px; flex:1; position:relative; z-index:1; }
.hero-tag { display:flex; align-items:center; gap:8px; margin-bottom:5px; }
.hero-tag-lale { width:12px; height:16px; flex-shrink:0; position:relative; }
.hero-tag-lale::before { content:''; position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:2px; height:8px; background:var(--cobalt); opacity:0.35; }
.hero-tag-lale::after { content:''; position:absolute; top:0; left:50%; transform:translateX(-50%); width:8px; height:10px; background:var(--lale); border-radius:50% 50% 30% 30%; opacity:0.45; }
.hero-tag-txt { font-family:'Barlow Condensed',sans-serif; font-size:8.5px; font-weight:700; letter-spacing:0.65em; text-transform:uppercase; color:rgba(0,0,0,0.3); }
.hero-tag-line { flex:1; height:1px; background:linear-gradient(90deg,rgba(27,79,138,0.3),transparent); }
.hero-make { font-family:'Libre Baskerville',serif; font-size:72px; font-weight:700; line-height:0.82; letter-spacing:0.03em; color:#10080C; text-shadow:2px 3px 0 rgba(0,0,0,0.06); }
.hero-model { font-family:'Libre Baskerville',serif; font-size:25px; font-weight:400; font-style:italic; letter-spacing:0.14em; line-height:1; margin-top:5px; background:linear-gradient(90deg,var(--cobalt),var(--cobalt2),var(--firuze2),var(--cobalt2),var(--cobalt)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.hero-right { padding:0 22px 14px 0; text-align:right; flex-shrink:0; position:relative; z-index:1; }
.hr-year { font-family:'Barlow Condensed',sans-serif; font-size:10px; font-weight:500; letter-spacing:0.4em; text-transform:uppercase; color:rgba(0,0,0,0.28); margin-bottom:3px; }
.hr-series { font-family:'Libre Baskerville',serif; font-size:13px; font-weight:400; font-style:italic; letter-spacing:0.08em; color:rgba(0,0,0,0.38); margin-bottom:6px; }
.hr-price { font-family:'Libre Baskerville',serif; font-size:24px; font-weight:700; color:#10080C; line-height:1; }
.hr-price-sub { font-family:'Barlow Condensed',sans-serif; font-size:8px; font-weight:500; letter-spacing:0.4em; text-transform:uppercase; color:rgba(27,79,138,0.55); margin-top:2px; }
.cini-band { height:8px; flex-shrink:0; position:relative; z-index:20; background:var(--kiremit); }
.cini-band::before { content:''; position:absolute; inset:0; background:linear-gradient(90deg,var(--kiremit) 0%,var(--cobalt) 6%,var(--firuze) 14%,var(--cobalt2) 22%,var(--altin2) 30%,var(--lale2) 40%,var(--altin2) 48%,var(--firuze2) 56%,var(--cobalt2) 64%,var(--lale) 72%,var(--cobalt) 82%,var(--firuze) 90%,var(--kiremit) 100%); opacity:0.95; }
.cini-band::after { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(212,160,32,0.55) 50%,transparent); }
.cini-band.thin { height:6px; }
.photo { height:240px; flex-shrink:0; position:relative; overflow:hidden; z-index:15; background:linear-gradient(160deg,#180A10,#10050A,#1C0D14); }
.photo-txt { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); font-family:'Libre Baskerville',serif; font-size:11px; font-style:italic; letter-spacing:0.5em; color:rgba(245,237,224,0.04); pointer-events:none; }
.photo-ray { position:absolute; left:0; top:0; bottom:0; width:5px; z-index:3; background:linear-gradient(180deg,var(--cobalt) 0%,var(--cobalt2) 15%,var(--altin2) 30%,var(--lale2) 50%,var(--altin2) 65%,var(--firuze2) 80%,var(--cobalt) 100%); }
.photo-gt { position:absolute; top:0; left:0; right:0; height:45px; background:linear-gradient(180deg,rgba(16,5,10,0.65),transparent); z-index:2; pointer-events:none; }
.photo-gb { position:absolute; bottom:0; left:0; right:0; height:65px; background:linear-gradient(180deg,transparent,var(--toprak)); z-index:2; pointer-events:none; }
.photo-corner-ornament { position:absolute; top:8px; right:8px; z-index:3; width:32px; height:32px; opacity:0.18; }
.photo-chips { position:absolute; top:12px; right:14px; z-index:4; display:flex; flex-direction:column; gap:5px; align-items:flex-end; }
.pchip { display:flex; align-items:center; gap:7px; padding:5px 11px; background:rgba(16,5,10,0.82); border:1px solid rgba(212,160,32,0.25); border-left:2px solid var(--altin); backdrop-filter:blur(6px); }
.pchip-l { font-family:'Barlow Condensed',sans-serif; font-size:7.5px; font-weight:600; letter-spacing:0.4em; text-transform:uppercase; color:rgba(245,237,224,0.32); }
.pchip-v { font-family:'Barlow Condensed',sans-serif; font-size:13px; font-weight:700; color:rgba(245,237,224,0.88); }
.pchip-v.altin { color:var(--altin2); }
.pchip-v.ok { color:#4ADE80; }
.photo-seal { position:absolute; bottom:12px; left:16px; z-index:4; display:flex; align-items:center; gap:8px; }
.seal-ring { width:52px; height:52px; border:1.5px solid rgba(212,160,32,0.4); clip-path:polygon(30% 0%,70% 0%,100% 30%,100% 70%,70% 100%,30% 100%,0% 70%,0% 30%); display:flex; align-items:center; justify-content:center; position:relative; background:rgba(27,79,138,0.15); }
.seal-inner { display:flex; flex-direction:column; align-items:center; gap:1px; }
.seal-icon { font-size:13px; line-height:1; }
.seal-text { font-family:'Barlow Condensed',sans-serif; font-size:5px; font-weight:800; letter-spacing:0.12em; text-transform:uppercase; color:rgba(212,160,32,0.65); text-align:center; line-height:1.3; }
.seal-date { font-family:'Share Tech Mono',monospace; font-size:5.5px; color:rgba(212,160,32,0.38); letter-spacing:0.1em; }
.seal-label { display:flex; flex-direction:column; gap:1px; }
.sl-main { font-family:'Libre Baskerville',serif; font-size:9px; font-weight:700; letter-spacing:0.1em; color:rgba(212,160,32,0.7); }
.sl-sub { font-family:'Barlow Condensed',sans-serif; font-size:8px; font-weight:500; letter-spacing:0.25em; text-transform:uppercase; color:rgba(245,237,224,0.25); }
.cn { position:absolute; z-index:4; }
.cn::before, .cn::after { content:''; position:absolute; }
.cn.tl { top:0;left:0;width:18px;height:18px; }
.cn.tl::before { top:0;left:0;right:0;height:2px;background:var(--altin2); }
.cn.tl::after { top:0;left:0;bottom:0;width:2px;background:var(--altin2); }
.cn.tr { top:0;right:0;width:18px;height:18px; }
.cn.tr::before { top:0;left:0;right:0;height:2px;background:var(--lale2); }
.cn.tr::after { top:0;right:0;bottom:0;width:2px;background:var(--lale2); }
.cn.br { bottom:0;right:0;width:18px;height:18px; }
.cn.br::before { bottom:0;left:0;right:0;height:2px;background:rgba(212,160,32,0.35); }
.cn.br::after { top:0;right:0;bottom:0;width:2px;background:rgba(212,160,32,0.35); }
.middle { height:200px; flex-shrink:0; display:flex; z-index:20; position:relative; background:var(--toprak); border-bottom:1px solid rgba(0,0,0,0.08); }
.mid-title { height:26px; flex-shrink:0; padding:0 16px; display:flex; align-items:center; gap:8px; border-bottom:1px solid rgba(0,0,0,0.07); background:rgba(27,79,138,0.04); }
.mt-sekizgen { width:9px; height:9px; flex-shrink:0; background:var(--cobalt2); clip-path:polygon(30% 0%,70% 0%,100% 30%,100% 70%,70% 100%,30% 100%,0% 70%,0% 30%); }
.mt-txt { font-family:'Libre Baskerville',serif; font-size:8px; font-weight:700; letter-spacing:0.42em; text-transform:uppercase; color:rgba(0,0,0,0.3); }
.mt-line { flex:1; height:1px; background:linear-gradient(90deg,rgba(27,79,138,0.25),transparent); }
.mid-left { flex:1; border-right:1px solid rgba(0,0,0,0.08); display:flex; flex-direction:column; overflow:hidden; }
.id-grid { display:grid; grid-template-columns:1fr 1fr; flex:1; }
.id-cell { display:flex; flex-direction:column; justify-content:center; padding:0 16px; min-height:0; border-right:1px solid rgba(0,0,0,0.06); border-bottom:1px solid rgba(0,0,0,0.06); position:relative; }
.id-cell::after { content:''; position:absolute; bottom:3px; right:4px; width:4px; height:4px; background:var(--cobalt); clip-path:polygon(30% 0%,70% 0%,100% 30%,100% 70%,70% 100%,30% 100%,0% 70%,0% 30%); opacity:0.12; }
.id-cell:nth-child(even) { border-right:none; }
.id-cell:nth-last-child(-n+2) { border-bottom:none; }
.id-lbl { font-family:'Barlow Condensed',sans-serif; font-size:7.5px; font-weight:700; letter-spacing:0.45em; text-transform:uppercase; color:rgba(0,0,0,0.26); line-height:1; }
.id-val { font-family:'Libre Baskerville',serif; font-size:15px; font-weight:700; letter-spacing:0.02em; color:#10080C; line-height:1; margin-top:2px; }
.id-val.cobalt { color:var(--cobalt); }
.id-val.green { color:#16A34A; }
.id-val.sm { font-size:12px; font-weight:400; color:rgba(0,0,0,0.55); font-style:italic; }
.id-sub { font-family:'Barlow Condensed',sans-serif; font-size:9px; font-weight:400; letter-spacing:0.12em; color:rgba(0,0,0,0.32); margin-top:1px; }
.mid-right { width:192px; flex-shrink:0; display:flex; flex-direction:column; overflow:hidden; }
.hasar-body { flex:1; display:flex; padding:8px 10px 6px 8px; gap:8px; align-items:flex-start; overflow:hidden; }
.mini-svg { width:84px; height:136px; flex-shrink:0; filter:drop-shadow(0 2px 8px rgba(0,0,0,0.1)); }
.hasar-info { flex:1; display:flex; flex-direction:column; gap:4px; padding-top:1px; }
.hi-legend { display:flex; flex-direction:column; gap:3px; }
.hi-li { display:flex; align-items:center; gap:5px; }
.hi-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.hi-name { font-family:'Barlow Condensed',sans-serif; font-size:9px; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; color:rgba(0,0,0,0.45); }
.hi-div { height:1px; background:rgba(0,0,0,0.08); margin:3px 0; }
.hi-sum { display:flex; flex-direction:column; gap:4px; }
.hi-row { display:flex; align-items:flex-start; gap:4px; }
.hi-rdot { width:6px; height:6px; border-radius:50%; flex-shrink:0; margin-top:2px; }
.hi-state { font-family:'Barlow Condensed',sans-serif; font-size:8px; font-weight:800; letter-spacing:0.14em; text-transform:uppercase; line-height:1; }
.hi-parts { font-family:'DM Sans',sans-serif; font-size:8px; color:rgba(0,0,0,0.45); line-height:1.3; margin-top:1px; }
.hasar-footer { flex-shrink:0; padding:6px 10px 8px; border-top:1px solid rgba(0,0,0,0.07); background:rgba(0,0,0,0.02); }
.hf-tramer { display:flex; align-items:center; gap:5px; margin-bottom:5px; }
.hf-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
.hf-txt { font-family:'Barlow Condensed',sans-serif; font-size:9px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; }
.hf-score-row { display:flex; align-items:center; gap:6px; }
.hf-slbl { font-family:'Barlow Condensed',sans-serif; font-size:8px; font-weight:600; letter-spacing:0.3em; text-transform:uppercase; color:rgba(0,0,0,0.3); flex-shrink:0; }
.hf-sbar { flex:1; height:5px; background:rgba(0,0,0,0.08); border-radius:3px; overflow:hidden; }
.hf-sfill { height:100%; border-radius:3px; background:linear-gradient(90deg,var(--cobalt),var(--cobalt2),var(--firuze2)); }
.hf-snum { font-family:'Libre Baskerville',serif; font-size:13px; font-weight:700; color:var(--cobalt); }
.donanim { height:82px; flex-shrink:0; position:relative; z-index:20; background:var(--cobalt); padding:10px 24px; overflow:hidden; }
.donanim::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,var(--firuze) 8%,var(--altin2) 18%,var(--lale2) 28%,var(--altin2) 38%,var(--firuze2) 48%,var(--altin2) 56%,var(--lale2) 66%,var(--altin2) 76%,var(--firuze) 88%,transparent); }
.donanim::after { content:''; position:absolute; right:-10px; top:-10px; width:80px; height:100px; background:radial-gradient(ellipse,rgba(192,57,43,0.1) 0%,transparent 65%); pointer-events:none; }
.don-header { display:flex; align-items:center; gap:8px; margin-bottom:7px; }
.don-sekizgen { width:8px; height:8px; flex-shrink:0; background:var(--altin2); clip-path:polygon(30% 0%,70% 0%,100% 30%,100% 70%,70% 100%,30% 100%,0% 70%,0% 30%); box-shadow:0 0 6px rgba(212,160,32,0.6); }
.don-title { font-family:'Barlow Condensed',sans-serif; font-size:8px; font-weight:700; letter-spacing:0.55em; text-transform:uppercase; color:rgba(212,160,32,0.6); }
.don-chips { display:flex; flex-wrap:wrap; gap:4px; }
.dc { display:flex; align-items:center; gap:4px; padding:4px 9px; background:rgba(245,237,224,0.05); border:1px solid rgba(212,160,32,0.12); border-bottom:1.5px solid rgba(212,160,32,0.32); }
.dc-dot { width:5px; height:5px; flex-shrink:0; background:var(--altin2); clip-path:polygon(30% 0%,70% 0%,100% 30%,100% 70%,70% 100%,30% 100%,0% 70%,0% 30%); }
.dc-txt { font-family:'Barlow Condensed',sans-serif; font-size:9px; font-weight:600; letter-spacing:0.08em; color:rgba(245,237,224,0.65); white-space:nowrap; }
.footer { height:118px; flex-shrink:0; background:var(--kiremit); position:relative; z-index:20; display:flex; flex-direction:column; overflow:hidden; }
.footer-cini-bg { position:absolute; inset:0; pointer-events:none; background:radial-gradient(ellipse 80% 160% at 10% 50%,rgba(27,79,138,0.1) 0%,transparent 50%),radial-gradient(ellipse 60% 140% at 90% 50%,rgba(192,57,43,0.08) 0%,transparent 50%); }
.footer-spectrum { height:4px; flex-shrink:0; background:linear-gradient(90deg,var(--kiremit) 0%,var(--cobalt) 6%,var(--firuze) 14%,var(--altin2) 22%,var(--lale2) 32%,var(--altin2) 40%,var(--cobalt2) 50%,var(--firuze2) 58%,var(--altin2) 66%,var(--lale) 76%,var(--cobalt) 86%,var(--kiremit) 100%); }
.footer-body { flex:1; padding:0 24px; display:grid; grid-template-columns:1fr auto 1fr; align-items:center; position:relative; z-index:2; }
.f-galeri { font-family:'Libre Baskerville',serif; font-size:13px; font-weight:700; letter-spacing:0.08em; color:rgba(245,237,224,0.9); line-height:1; }
.f-detail { font-family:'Share Tech Mono',monospace; font-size:8px; letter-spacing:0.12em; color:rgba(245,237,224,0.2); line-height:1.9; margin-top:3px; }
.f-phone { font-family:'Libre Baskerville',serif; font-size:18px; font-weight:400; font-style:italic; letter-spacing:0.04em; color:rgba(212,160,32,0.75); margin-top:2px; }
.f-center { display:flex; flex-direction:column; align-items:center; gap:2px; padding:0 22px; border-left:1px solid rgba(255,255,255,0.05); border-right:1px solid rgba(255,255,255,0.05); }
.f-sekizgen-wrap { width:22px; height:22px; margin-bottom:3px; background:var(--altin2); clip-path:polygon(30% 0%,70% 0%,100% 30%,100% 70%,70% 100%,30% 100%,0% 70%,0% 30%); display:flex; align-items:center; justify-content:center; box-shadow:0 0 12px rgba(212,160,32,0.4); }
.f-sekizgen-inner { font-size:11px; line-height:1; color:var(--kiremit); font-weight:bold; }
.f-alh-n { font-family:'Libre Baskerville',serif; font-size:17px; font-weight:700; letter-spacing:0.18em; background:linear-gradient(90deg,var(--altin),var(--altin2),#F0C040,var(--altin2),var(--altin)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; filter:drop-shadow(0 0 10px rgba(212,160,32,0.35)); white-space:nowrap; }
.f-theme-name { font-family:'Libre Baskerville',serif; font-size:9px; font-weight:400; font-style:italic; letter-spacing:0.16em; color:rgba(212,160,32,0.38); white-space:nowrap; margin-top:1px; }
.f-alh-t { font-family:'Barlow Condensed',sans-serif; font-size:7px; letter-spacing:0.45em; text-transform:uppercase; color:rgba(212,160,32,0.3); }
.f-price { text-align:right; }
.f-plbl { font-family:'Barlow Condensed',sans-serif; font-size:7.5px; letter-spacing:0.5em; text-transform:uppercase; color:rgba(245,237,224,0.22); margin-bottom:2px; }
.f-pval { font-family:'Libre Baskerville',serif; font-size:26px; font-weight:700; color:rgba(245,237,224,0.92); line-height:1; }
.f-psub { font-family:'Barlow Condensed',sans-serif; font-size:7.5px; letter-spacing:0.42em; text-transform:uppercase; color:rgba(212,160,32,0.42); margin-top:2px; }
.footer-quote { height:28px; flex-shrink:0; padding:0 24px; border-top:1px solid rgba(212,160,32,0.08); background:rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:space-between; position:relative; z-index:2; }
.footer-quote::before { content:''; position:absolute; top:0; left:24px; right:24px; height:1px; background:linear-gradient(90deg,transparent,rgba(192,57,43,0.3) 20%,rgba(212,160,32,0.3) 50%,rgba(192,57,43,0.3) 80%,transparent); }
.fq-quote { font-family:'Libre Baskerville',serif; font-size:9px; font-weight:400; font-style:italic; letter-spacing:0.05em; color:rgba(212,160,32,0.32); flex:1; }
.fq-tag { font-family:'Barlow Condensed',sans-serif; font-size:7px; font-weight:700; letter-spacing:0.3em; text-transform:uppercase; color:rgba(212,160,32,0.22); white-space:nowrap; margin-left:12px; }
</style>
</head>
<body>
<div class="a4">
  <div class="grain"></div>
  <div class="cini-pattern"></div>
  <div class="hdr">
    <div class="hdr-cini-bg"></div>
    <div class="hdr-gold-top"></div>
    <div class="hdr-body">
      <div class="hdr-brand">
        <div class="hdr-lale">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <polygon points="22,2 34,6 42,18 42,26 34,38 22,42 10,38 2,26 2,18 10,6" fill="none" stroke="rgba(212,160,32,0.4)" stroke-width="1"/>
            <polygon points="22,8 30,11 36,17 36,27 30,33 22,36 14,33 8,27 8,17 14,11" fill="none" stroke="rgba(212,160,32,0.2)" stroke-width="0.7"/>
            <path d="M22 30 L22 38" stroke="rgba(26,122,110,0.5)" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M22 18 C18 14 15 12 16 8 C17 5 20 4 22 6 C24 4 27 5 28 8 C29 12 26 14 22 18 Z" fill="rgba(192,57,43,0.7)" stroke="rgba(192,57,43,0.9)" stroke-width="0.5"/>
            <path d="M16 22 C12 20 10 16 12 13 C14 10 18 12 18 16" fill="rgba(26,122,110,0.5)" stroke="rgba(26,122,110,0.7)" stroke-width="0.5"/>
            <path d="M28 22 C32 20 34 16 32 13 C30 10 26 12 26 16" fill="rgba(26,122,110,0.5)" stroke="rgba(26,122,110,0.7)" stroke-width="0.5"/>
            <circle cx="22" cy="22" r="2.5" fill="rgba(212,160,32,0.8)"/>
            <circle cx="22" cy="2" r="1.2" fill="rgba(212,160,32,0.5)"/>
            <circle cx="22" cy="42" r="1.2" fill="rgba(212,160,32,0.5)"/>
            <circle cx="2" cy="22" r="1.2" fill="rgba(212,160,32,0.4)"/>
            <circle cx="42" cy="22" r="1.2" fill="rgba(212,160,32,0.4)"/>
          </svg>
        </div>
        <div>
          <div class="hdr-sub">İznik Çini · XV. Yüzyıl</div>
          <div class="hdr-latin">Alhazen</div>
          <div class="hdr-title">Premium Araç Ekspertiz Raporu</div>
        </div>
      </div>
      <div class="hdr-badge">
        <div class="hdr-badge-main">
          <div class="hdr-badge-sekizgen"></div>
          <div class="hdr-badge-t">AlhazenPDF</div>
        </div>
        <div class="hdr-doc-no">IZ-2026 · ESK-TR</div>
      </div>
    </div>
    <div class="hdr-rule"></div>
  </div>
  <div class="hero">
    <div class="hero-left-bar"></div>
    <div class="hero-year-wm">${yil}</div>
    <svg class="hero-corner-cini" viewBox="0 0 140 108" fill="none">
      <path d="M140 0 Q100 20 120 50 Q140 80 100 108" stroke="rgba(27,79,138,1)" stroke-width="0.8" fill="none"/>
      <path d="M140 20 Q110 35 125 65 Q140 95 110 108" stroke="rgba(192,57,43,0.6)" stroke-width="0.6" fill="none"/>
      <ellipse cx="118" cy="48" rx="5" ry="8" fill="rgba(192,57,43,0.7)" transform="rotate(-20 118 48)"/>
      <ellipse cx="108" cy="28" rx="4" ry="6" fill="rgba(26,122,110,0.6)" transform="rotate(10 108 28)"/>
      <ellipse cx="102" cy="72" rx="4" ry="6" fill="rgba(212,160,32,0.5)" transform="rotate(-10 102 72)"/>
      <circle cx="130" cy="15" r="2" fill="rgba(212,160,32,0.5)"/>
      <circle cx="125" cy="90" r="1.5" fill="rgba(192,57,43,0.4)"/>
      <circle cx="115" cy="60" r="1.8" fill="rgba(26,122,110,0.4)"/>
    </svg>
    <div class="hero-content">
      <div class="hero-tag">
        <div class="hero-tag-lale"></div>
        <div class="hero-tag-txt">Satılık · Premium Araç</div>
        <div class="hero-tag-line"></div>
      </div>
      <div class="hero-make">${marka}</div>
      <div class="hero-model">${model}</div>
    </div>
    <div class="hero-right">
      <div class="hr-year">Model · ${yil}</div>
      <div class="hr-series">${kasaTipi} · ${yakit}</div>
      <div class="hr-price">${fiyat} ₺</div>
      <div class="hr-price-sub">Satış Fiyatı · KDV Dahil</div>
    </div>
  </div>
  <div class="cini-band"></div>
  <div class="photo"${photo ? ' style="background:none"' : ''}>
    ${!photo ? '<div class="photo-txt">Araç Fotoğrafı</div>' : ''}
    <div class="photo-ray"></div>
    <div class="photo-gt"></div>
    <div class="photo-gb"></div>
    ${photo ? `<img src="${photo}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"/>` : ''}
    <svg class="photo-corner-ornament" viewBox="0 0 32 32" fill="none">
      <polygon points="16,1 25,5 31,14 31,18 25,27 16,31 7,27 1,18 1,14 7,5" fill="none" stroke="rgba(212,160,32,1)" stroke-width="1.2"/>
      <circle cx="16" cy="16" r="4" fill="rgba(192,57,43,0.8)"/>
    </svg>
    <div class="photo-chips">
      <div class="pchip"><div class="pchip-l">KM</div><div class="pchip-v altin">${km}</div></div>
      <div class="pchip"><div class="pchip-l">Renk</div><div class="pchip-v">${renk}</div></div>
      <div class="pchip"><div class="pchip-l">Muayene</div><div class="pchip-v ok">${muayene}</div></div>
    </div>
    <div class="photo-seal">
      <div class="seal-ring">
        <div class="seal-inner">
          <div class="seal-icon">🌷</div>
          <div class="seal-text">İZNİK<br>ÇİNİ</div>
          <div class="seal-date">ALHAZEN</div>
        </div>
      </div>
      <div class="seal-label">
        <div class="sl-main">AlhazenPDF</div>
        <div class="sl-sub">Premium Satış Kartı</div>
      </div>
    </div>
    <div class="cn tl"></div><div class="cn tr"></div><div class="cn br"></div>
  </div>
  <div class="cini-band thin"></div>
  <div class="middle">
    <div class="mid-left">
      <div class="mid-title">
        <div class="mt-sekizgen"></div>
        <div class="mt-txt">Araç Kimliği</div>
        <div class="mt-line"></div>
      </div>
      <div class="id-grid">
        <div class="id-cell"><div class="id-lbl">Motor</div><div class="id-val cobalt">${motor}</div><div class="id-sub">${yakit}</div></div>
        <div class="id-cell"><div class="id-lbl">Şanzıman</div><div class="id-val">${sanziman}</div></div>
        <div class="id-cell"><div class="id-lbl">Kilometre</div><div class="id-val cobalt">${km}</div><div class="id-sub">km</div></div>
        <div class="id-cell"><div class="id-lbl">Renk</div><div class="id-val sm">${renk}</div><div class="id-sub">Orijinal Boya</div></div>
        <div class="id-cell"><div class="id-lbl">Muayene</div><div class="id-val green">${muayene}</div><div class="id-sub">Geçerli ✓</div></div>
        <div class="id-cell"><div class="id-lbl">Kasa</div><div class="id-val sm">${kasaTipi}</div></div>
        <div class="id-cell"><div class="id-lbl">Bagaj</div><div class="id-val">${bagaj}</div><div class="id-sub">Litre</div></div>
        <div class="id-cell"><div class="id-lbl">Garanti</div><div class="id-val green">${garanti}</div></div>
      </div>
    </div>
    <div class="mid-right">
      <div class="mid-title">
        <div class="mt-sekizgen"></div>
        <div class="mt-txt">Hasar &amp; Boya</div>
        <div class="mt-line"></div>
      </div>
      <div class="hasar-body">
        <div class="mini-svg">${miniSVG}</div>
        <div class="hasar-info">
          <div class="hi-legend">
            <div class="hi-li"><div class="hi-dot" style="background:#D8D8D4;border:1px solid #BCBCB8"></div><div class="hi-name">Orjinal</div></div>
            <div class="hi-li"><div class="hi-dot" style="background:#93C5FD"></div><div class="hi-name" style="color:#1B7FD4">Boyalı</div></div>
            <div class="hi-li"><div class="hi-dot" style="background:#FCD34D"></div><div class="hi-name" style="color:#B45309">Değişen</div></div>
            <div class="hi-li"><div class="hi-dot" style="background:#86EFAC"></div><div class="hi-name" style="color:#047857">Lokal</div></div>
          </div>
          <div class="hi-div"></div>
          <div class="hi-sum">${hasarSum}</div>
        </div>
      </div>
      <div class="hasar-footer">
        <div class="hf-tramer">
          <div class="hf-dot" style="background:${tramerColor}"></div>
          <div class="hf-txt" style="color:${tramerColor}">${tramerTxt}</div>
        </div>
        <div class="hf-score-row">
          <div class="hf-slbl">Skor</div>
          <div class="hf-sbar"><div class="hf-sfill" style="width:${skor}%"></div></div>
          <div class="hf-snum">${skor}</div>
        </div>
      </div>
    </div>
  </div>
  <div class="donanim">
    <div class="don-header"><div class="don-sekizgen"></div><div class="don-title">Standart Donanım</div></div>
    <div class="don-chips">${donChips}</div>
  </div>
  <div class="footer">
    <div class="footer-cini-bg"></div>
    <div class="footer-spectrum"></div>
    <div class="footer-body">
      <div>
        <div class="f-galeri">${companyName || 'Galeri Adı'}</div>
        <div class="f-phone">${telefon}</div>
      </div>
      <div class="f-center">
        <div class="f-sekizgen-wrap"><div class="f-sekizgen-inner">✦</div></div>
        <div class="f-alh-n">AlhazenPDF</div>
        <div class="f-theme-name">İznik Çini · Osmanlı</div>
        <div class="f-alh-t">Premium · Satış Kartı</div>
      </div>
      <div class="f-price">
        <div class="f-plbl">İstenen Fiyat</div>
        <div class="f-pval">${fiyat} ₺</div>
        <div class="f-psub">KDV Dahil · Takas Görüşülür</div>
      </div>
    </div>
    <div class="footer-quote">
      <div class="fq-quote">"Güzellik, ustalığın ham toprağa dokunduğu anda doğar — tıpkı İznik fırınlarında olduğu gibi."</div>
      <div class="fq-tag">AlhazenPDF · IZ-2026</div>
    </div>
  </div>
</div>
</body>
</html>`;
  return postProcess(html, 595, 842);
};

