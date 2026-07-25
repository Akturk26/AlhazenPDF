/**
 * AlhazenPDF - 8 New A4 Themes for Sales Cards
 * Themes: GREEN, GALACTIC, SALDA, CRYSTAL, AMBER, OLTU, VOLKAN, TARIHI
 */

// Ekspertiz özet bölümü — sadece veri varsa HTML döner
const buildEkspertizSection = (ekspertizData = {}, borderColor = 'rgba(255,255,255,0.1)', textColor = 'rgba(255,255,255,0.6)') => {
  if (!ekspertizData || !Object.keys(ekspertizData).length) return '';
  const items = Object.values(ekspertizData);
  const boyali  = items.filter(e => e.status === 'paint').map(e => e.name).join(', ');
  const degisen = items.filter(e => e.status === 'replace').map(e => e.name).join(', ');
  const lokal   = items.filter(e => e.status === 'local').map(e => e.name).join(', ');
  if (!boyali && !degisen && !lokal) return '';
  return `<div style="position:relative;z-index:20;padding:5px 22px 5px 26px;border-top:1px solid ${borderColor}">
${boyali  ? `<div style="display:flex;align-items:center;gap:5px;margin-bottom:2px"><span style="width:7px;height:7px;border-radius:50%;background:#60A5FA;flex-shrink:0;display:inline-block"></span><span style="font-size:7px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:#60A5FA;flex-shrink:0;width:52px">Boyalı</span><span style="font-size:8px;color:${textColor}">${boyali}</span></div>` : ''}
${degisen ? `<div style="display:flex;align-items:center;gap:5px;margin-bottom:2px"><span style="width:7px;height:7px;border-radius:50%;background:#FBBF24;flex-shrink:0;display:inline-block"></span><span style="font-size:7px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:#FBBF24;flex-shrink:0;width:52px">Değişen</span><span style="font-size:8px;color:${textColor}">${degisen}</span></div>` : ''}
${lokal   ? `<div style="display:flex;align-items:center;gap:5px"><span style="width:7px;height:7px;border-radius:50%;background:#34D399;flex-shrink:0;display:inline-block"></span><span style="font-size:7px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:#34D399;flex-shrink:0;width:52px">Lokal</span><span style="font-size:8px;color:${textColor}">${lokal}</span></div>` : ''}
</div>`;
};

const postProcess = (html, width, height) => {
  // expo-print width/height are PDF points (72dpi).
  // Card HTML is at 96dpi CSS pixels. Ratio: 1pt = 4/3 px.
  // zoom:4/3 scales the 595px card to fill a 595pt (≈793px) A4 page.
  const zoom = (4 / 3).toFixed(6);
  const fixStyle = `<style>@page{size:${width}pt ${height}pt;margin:0}body{zoom:${zoom}}</style>`;
  return html
    .replace(/(<(?:style|head)[^>]*>)/i, `$1${fixStyle}`)
    .replace(/content="width=device-width[^"]*"/g, `content="width=${width}"`)
    .replace(/width\s*:\s*100vw/g, `width: ${width}px`)
    .replace(/height\s*:\s*100vh/g, `height: ${height}px`);
};

const parseVehicleData = (data) => {
  const { formData = {}, photos = [], companyName = '', ekspertizData = {} } = data;
  const isRealEstate = data.category?.id === 'real-estate';
  return {
    width: 595, height: 842,
    marka: formData['Marka'] || '',
    model: formData['Model'] || '',
    yil: String(formData['Yıl'] || '').replace(/\./g, ''),
    motor: formData['Motor'] || '',
    sanziman: formData['Şanzıman'] || '',
    yakıt: formData['Yakıt'] || '',
    km: formData['KM'] || '',
    fiyat: (formData['Fiyat'] || '').replace(/\s*₺\s*/g, '').trim(),
    telefon: formData['Telefon'] || '',
    renk: formData['Renk'] || '',
    photo: photos[0]?.base64 || '',
    companyName,
    ekspertizData,
    isRealEstate,
    emlakTuru: formData['Emlak Türü'] || '',
    ilanTuru: formData['İlan Türü'] || 'Satılık',
    odaSayisi: formData['Oda Sayısı'] || '',
    m2Brut: formData['M² (Brüt)'] || formData['M² (Net)'] || '',
    binaYasi: formData['Bina Yaşı'] || '',
    katNo: formData['Kat'] || '',
  };
};

/* ═══════════════════════════════════════════════════════════════
   3. YEŞİL / GREEN (Natural Elegant)
   ═══════════════════════════════════════════════════════════════ */
export const buildA4GreenHTML = (data) => {
  const { width, height, marka, model, yil, motor, sanziman, yakıt, km, fiyat, telefon, renk, photo, companyName, ekspertizData, isRealEstate, emlakTuru, ilanTuru, odaSayisi, m2Brut, binaYasi, katNo } = parseVehicleData(data);

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=${width}">
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Cormorant+Garamond:wght@300;400;600&family=Barlow+Condensed:wght@200;400;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#F2E8D5;font-family:'Cormorant Garamond',serif;color:#1A1510}
.card{width:${width}px;height:${height}px;background:#F2E8D5;color:#1A1510;position:relative;overflow:hidden;display:flex;flex-direction:column}
.bg{position:absolute;inset:0;background:radial-gradient(ellipse 70% 50% at 30% 20%,rgba(74,103,68,0.03) 0%,transparent 60%),radial-gradient(ellipse 60% 45% at 70% 80%,rgba(242,232,213,0.5) 0%,transparent 55%);pointer-events:none}
.side{position:absolute;left:0;top:0;bottom:0;width:4px;background:linear-gradient(180deg,#E8DCC5 0%,#4A6744 20%,#5C7D56 50%,#4A6744 80%,#E8DCC5 100%);border-left:1px solid rgba(74,103,68,0.4);border-right:1px solid rgba(74,103,68,0.3);box-shadow:inset 0 0 8px rgba(74,103,68,0.2);z-index:10}
.top{position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(74,103,68,0.25) 30%,rgba(74,103,68,0.35) 50%,rgba(74,103,68,0.25) 70%,transparent);z-index:10}
.hdr{position:relative;z-index:20;padding:14px 18px 12px 28px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(74,103,68,0.15)}
.brand{font-family:'DM Serif Display',serif;font-size:14px;font-weight:400;letter-spacing:0.15em;color:#1A1510;line-height:1}
.brand-sub{font-family:'Cormorant Garamond',serif;font-size:8px;letter-spacing:0.3em;text-transform:uppercase;margin-top:2px;opacity:0.5;color:#4A6744}
.badge{display:flex;align-items:center;gap:7px;padding:6px 14px 6px 10px;border-radius:1px;background:rgba(74,103,68,0.08);border:1px solid rgba(74,103,68,0.25)}
.badge-diamond{width:10px;height:10px;transform:rotate(45deg);background:#4A6744;box-shadow:0 2px 6px rgba(74,103,68,0.3)}
.badge-text{font-family:'DM Serif Display',serif;font-size:12px;font-weight:400;letter-spacing:0.2em;text-transform:uppercase;color:#4A6744;line-height:1}
.badge-sub{font-family:'Cormorant Garamond',serif;font-size:7px;letter-spacing:0.4em;text-transform:uppercase;margin-top:2px;opacity:0.6;color:#5C7D56;line-height:1}
.veh{position:relative;z-index:20;padding:10px 22px 0 28px}
.type-tag{display:flex;align-items:center;gap:8px;margin-bottom:3px}
.type-leaf{width:8px;height:8px;background:#4A6744;border-radius:50% 0 50% 50%;transform:rotate(-45deg);box-shadow:0 2px 6px rgba(74,103,68,0.25)}
.type-txt{font-family:'Cormorant Garamond',serif;font-size:9px;font-weight:400;letter-spacing:0.4em;text-transform:uppercase;color:#5C7D56}
.make{font-family:'DM Serif Display',serif;font-size:92px;line-height:0.88;letter-spacing:0.02em;color:#1A1510;text-shadow:1px 1px 0 rgba(74,103,68,0.1)}
.model{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:300;letter-spacing:0.12em;line-height:1.2;margin-top:4px;color:#4A6744}
.pf{position:relative;flex:1;min-height:0;overflow:hidden;margin:14px 0 0}
.ph-bg{position:absolute;inset:0;background:linear-gradient(140deg,#2C3A28,#1E2820);display:flex;align-items:center;justify-content:center}
${photo ? `.ph-bg{background:none}.ph-bg img{width:100%;height:100%;object-fit:cover}` : `.ph-txt{font-family:'Cormorant Garamond',serif;font-size:10px;letter-spacing:0.4em;text-transform:uppercase;color:rgba(92,125,86,0.15)}`}
.ph-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(242,232,213,0.15) 0%,transparent 18%,transparent 65%,rgba(242,232,213,0.35) 100%);pointer-events:none;z-index:2}
.ph-floor{position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#4A6744 20%,#5C7D56 50%,#4A6744 80%,transparent);box-shadow:0 0 8px rgba(74,103,68,0.3);z-index:5}
.pc{position:absolute;width:14px;height:14px;z-index:4}
.pc-tl{top:10px;left:10px;border-top:1.5px solid rgba(74,103,68,0.35);border-left:1.5px solid rgba(74,103,68,0.35)}
.pc-tr{top:10px;right:10px;border-top:1.5px solid rgba(92,125,86,0.3);border-right:1.5px solid rgba(92,125,86,0.3)}
.pc-bl{bottom:10px;left:10px;border-bottom:1.5px solid rgba(92,125,86,0.28);border-left:1.5px solid rgba(92,125,86,0.28)}
.pc-br{bottom:10px;right:10px;border-bottom:1.5px solid rgba(74,103,68,0.32);border-right:1.5px solid rgba(74,103,68,0.32)}
.yr-badge{position:absolute;bottom:10px;left:14px;z-index:6;display:flex;align-items:baseline;gap:4px}
.yr-num{font-family:'DM Serif Display',serif;font-size:20px;font-weight:400;line-height:1;color:#5C7D56}
.yr-lbl{font-family:'Cormorant Garamond',serif;font-size:7px;letter-spacing:0.3em;text-transform:uppercase;opacity:0.5;color:#4A6744}
.specs{position:relative;z-index:20;background:rgba(242,232,213,0.85);border-top:1px solid rgba(74,103,68,0.15);padding:9px 22px 9px 28px;backdrop-filter:blur(5px)}
.spec-row{display:flex;gap:10px}
.spec-item{flex:1;display:flex;flex-direction:column;gap:2px;border-right:1px solid rgba(74,103,68,0.12);padding-right:10px}
.spec-item:last-child{border-right:none;padding-right:0}
.spk{font-family:'Cormorant Garamond',serif;font-size:8px;letter-spacing:0.35em;text-transform:uppercase;color:rgba(74,103,68,0.45)}
.spv{font-family:'DM Serif Display',serif;font-size:15px;letter-spacing:0.03em;color:#1A1510}
.spv.hi{color:#4A6744}
.footer{position:relative;z-index:20;padding:10px 18px 14px 28px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;border-top:1px solid rgba(74,103,68,0.15);background:rgba(242,228,210,0.95)}
.footer-left{}
.footer-center{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 14px;border-left:1px solid rgba(74,103,68,0.15);border-right:1px solid rgba(74,103,68,0.15)}
.footer-right{text-align:right}
.alh-diamond{width:11px;height:11px;transform:rotate(45deg);background:#4A6744;box-shadow:0 2px 6px rgba(74,103,68,0.3);margin-bottom:4px}
.alh-name{font-family:'DM Serif Display',serif;font-size:16px;font-weight:400;letter-spacing:0.2em;text-transform:uppercase;color:#4A6744;line-height:1}
.alh-tag{font-family:'Cormorant Garamond',serif;font-size:7px;font-weight:400;letter-spacing:0.4em;text-transform:uppercase;opacity:0.6;color:#5C7D56;margin-top:3px}
.p-lbl{font-family:'Cormorant Garamond',serif;font-size:8px;letter-spacing:0.4em;text-transform:uppercase;opacity:0.4;margin-bottom:3px}
.p-val{font-family:'DM Serif Display',serif;font-size:26px;font-weight:400;color:#4A6744;text-shadow:0 1px 4px rgba(74,103,68,0.15);letter-spacing:0.02em;line-height:1}
.c-lbl{font-family:'Cormorant Garamond',serif;font-size:8px;letter-spacing:0.3em;text-transform:uppercase;opacity:0.35;margin-bottom:2px}
.c-num{font-family:'DM Serif Display',serif;font-size:15px;font-weight:400;letter-spacing:0.08em;color:#1A1510}
.c-alh{font-family:'Cormorant Garamond',serif;font-size:7px;letter-spacing:0.3em;text-transform:uppercase;margin-top:2px;color:rgba(74,103,68,0.4)}
</style></head>
<body>
<div class="card">
<div class="bg"></div><div class="side"></div><div class="top"></div>
<div class="hdr">
<div><div class="brand">${companyName || 'Galeri'}</div><div class="brand-sub">${isRealEstate ? 'Emlak' : 'Araç Galerisi'}</div></div>
<div class="badge"><div class="badge-diamond"></div><div><div class="badge-text">AlhazenPDF</div><div class="badge-sub">Premium · PDF</div></div></div>
</div>
<div class="veh">
<div class="type-tag"><div class="type-leaf"></div><div class="type-txt">${isRealEstate ? ilanTuru + ' Emlak' : 'Satılık Araç'}</div></div>
<div class="make">${isRealEstate ? (emlakTuru || '—') : marka}</div>
<div class="model">${isRealEstate ? odaSayisi : model}</div>
</div>
<div class="pf">
<div class="ph-bg">${photo ? `<img src="${photo}"/>` : `<span class="ph-txt">ARAÇ FOTOĞRAFI</span>`}</div>
<div class="ph-overlay"></div><div class="ph-floor"></div>
<div class="pc pc-tl"></div><div class="pc pc-tr"></div><div class="pc pc-bl"></div><div class="pc pc-br"></div>
<div class="yr-badge"><span class="yr-num">${yil}</span><span class="yr-lbl">Model</span></div>
</div>
<div class="specs">
<div class="spec-row">
<div class="spec-item"><div class="spk">${isRealEstate ? 'M²' : 'Motor'}</div><div class="spv hi">${isRealEstate ? (m2Brut || '—') : motor}</div></div>
<div class="spec-item"><div class="spk">${isRealEstate ? 'Oda' : 'Şanzıman'}</div><div class="spv">${isRealEstate ? (odaSayisi || '—') : sanziman}</div></div>
<div class="spec-item"><div class="spk">${isRealEstate ? 'Kat' : 'Yakıt'}</div><div class="spv">${isRealEstate ? (katNo || '—') : yakıt}</div></div>
<div class="spec-item"><div class="spk">${isRealEstate ? 'Bina Yaşı' : 'Kilometre'}</div><div class="spv hi">${isRealEstate ? (binaYasi || '—') : km}</div></div>
<div class="spec-item"><div class="spk">${isRealEstate ? 'İlan Türü' : 'Renk'}</div><div class="spv">${isRealEstate ? ilanTuru : renk}</div></div>
</div>
</div>
${buildEkspertizSection(ekspertizData, 'rgba(74,103,68,0.15)', 'rgba(26,21,16,0.55)')}
<div class="footer">
<div class="footer-left"><div class="p-lbl">İstenen Fiyat</div><div class="p-val">${fiyat} ₺</div></div>
<div class="footer-center"><div class="alh-diamond"></div><div class="alh-name">AlhazenPDF</div><div class="alh-tag">Premium · Satış Kartı</div></div>
<div class="footer-right"><div class="c-lbl">İletişim</div><div class="c-num">${telefon}</div><div class="c-alh">AlhazenPDF</div></div>
</div>
</div>
</body></html>`;

  return postProcess(html, width, height);
};

/* ═══════════════════════════════════════════════════════════════
   4. GALAKTİK / GALACTIC (Space Theme)
   ═══════════════════════════════════════════════════════════════ */
export const buildA4GalacticHTML = (data) => {
  const { width, height, marka, model, yil, motor, sanziman, yakıt, km, fiyat, telefon, renk, photo, companyName, ekspertizData, isRealEstate, emlakTuru, ilanTuru, odaSayisi, m2Brut, binaYasi, katNo } = parseVehicleData(data);

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=${width}">
<link href="https://fonts.googleapis.com/css2?family=Raleway:wght@900&family=Exo+2:wght@200;400;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#020410;font-family:'Exo 2',sans-serif}
.card{width:${width}px;height:${height}px;background:#020410;color:#fff;position:relative;overflow:hidden;display:flex;flex-direction:column}
.bg{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 50%,rgba(16,20,40,0.8) 0%,transparent 70%),radial-gradient(ellipse 60% 45% at 20% 20%,rgba(103,232,249,0.03) 0%,transparent 55%),radial-gradient(ellipse 50% 40% at 80% 80%,rgba(192,132,252,0.04) 0%,transparent 50%);pointer-events:none}
.star{position:absolute;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,0.9),rgba(103,232,249,0.4));z-index:2}
.st1{top:8%;left:15%;width:2px;height:2px;box-shadow:0 0 4px rgba(103,232,249,0.6)}
.st2{top:18%;right:22%;width:3px;height:3px;box-shadow:0 0 6px rgba(255,255,255,0.7)}
.st3{top:28%;left:45%;width:1px;height:1px;box-shadow:0 0 3px rgba(192,132,252,0.5)}
.st4{top:42%;right:12%;width:2px;height:2px;box-shadow:0 0 5px rgba(103,232,249,0.6)}
.st5{top:55%;left:72%;width:2px;height:2px;box-shadow:0 0 4px rgba(255,255,255,0.6)}
.st6{top:68%;right:35%;width:1px;height:1px;box-shadow:0 0 3px rgba(192,132,252,0.5)}
.st7{top:15%;left:80%;width:2px;height:2px;box-shadow:0 0 5px rgba(103,232,249,0.7)}
.st8{top:35%;left:25%;width:1px;height:1px;box-shadow:0 0 3px rgba(255,255,255,0.5)}
.planet{position:absolute;top:12px;right:14px;width:50px;height:50px;border-radius:50%;background:radial-gradient(circle at 30% 30%,rgba(103,232,249,0.35),rgba(67,182,219,0.2) 40%,rgba(2,4,16,0.5) 75%);box-shadow:inset 0 0 15px rgba(103,232,249,0.25),0 0 20px rgba(103,232,249,0.15);z-index:3}
.planet::before{content:'';position:absolute;top:20%;left:15%;width:12px;height:8px;border-radius:50%;background:rgba(103,232,249,0.15);filter:blur(2px)}
.side{position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(180deg,transparent,#67E8F9 15%,#8B5CF6 40%,#C084FC 60%,#67E8F9 85%,transparent);box-shadow:0 0 12px rgba(103,232,249,0.4);z-index:10}
.top{position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,#67E8F9 30%,#C084FC 50%,#67E8F9 70%,transparent);box-shadow:0 0 8px rgba(103,232,249,0.3);z-index:10}
.hdr{position:relative;z-index:20;padding:14px 18px 12px 26px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(103,232,249,0.15)}
.brand{font-family:'Raleway',sans-serif;font-size:13px;font-weight:900;letter-spacing:0.25em;color:rgba(255,255,255,0.95);line-height:1;text-transform:uppercase}
.brand-sub{font-family:'Exo 2',sans-serif;font-size:7px;font-weight:200;letter-spacing:0.45em;text-transform:uppercase;margin-top:2px;opacity:0.4;color:#67E8F9}
.badge{display:flex;align-items:center;gap:7px;padding:6px 14px 6px 10px;border-radius:2px;background:rgba(103,232,249,0.08);border:1.5px solid rgba(103,232,249,0.35)}
.badge-diamond{width:10px;height:10px;transform:rotate(45deg);background:#67E8F9;box-shadow:0 0 12px rgba(103,232,249,0.7)}
.badge-text{font-family:'Raleway',sans-serif;font-size:12px;font-weight:900;letter-spacing:0.2em;text-transform:uppercase;color:#67E8F9;text-shadow:0 0 10px rgba(103,232,249,0.5);line-height:1}
.badge-sub{font-family:'Exo 2',sans-serif;font-size:7px;font-weight:200;letter-spacing:0.45em;text-transform:uppercase;margin-top:2px;opacity:0.7;color:rgba(192,132,252,0.7);line-height:1}
.veh{position:relative;z-index:20;padding:10px 22px 0 26px}
.type-tag{display:flex;align-items:center;gap:8px;margin-bottom:2px}
.type-dot{width:8px;height:8px;background:#67E8F9;transform:rotate(45deg);box-shadow:0 0 10px rgba(103,232,249,0.7);animation:pulse 2s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1;box-shadow:0 0 10px rgba(103,232,249,0.7)}50%{opacity:0.7;box-shadow:0 0 15px rgba(103,232,249,0.9)}}
.type-txt{font-family:'Exo 2',sans-serif;font-size:8px;font-weight:700;letter-spacing:0.5em;text-transform:uppercase;color:#C084FC}
.make{font-family:'Raleway',sans-serif;font-size:100px;line-height:0.82;letter-spacing:0.08em;font-weight:900;color:#fff;text-shadow:0 0 30px rgba(103,232,249,0.3),0 0 60px rgba(103,232,249,0.15);text-transform:uppercase}
.model{font-family:'Exo 2',sans-serif;font-size:32px;font-weight:200;letter-spacing:0.25em;line-height:1;margin-top:2px;background:linear-gradient(90deg,#67E8F9,#C084FC);-webkit-background-clip:text;-webkit-text-fill-color:transparent;text-transform:uppercase}
.pf{position:relative;flex:1;min-height:0;overflow:hidden;margin:12px 0 0}
.ph-bg{position:absolute;inset:0;background:linear-gradient(160deg,#0A0E1A,#040610);display:flex;align-items:center;justify-content:center}
${photo ? `.ph-bg{background:none}.ph-bg img{width:100%;height:100%;object-fit:cover}` : `.ph-txt{font-family:'Exo 2',sans-serif;font-size:10px;font-weight:200;letter-spacing:0.5em;text-transform:uppercase;color:rgba(103,232,249,0.15)}`}
.ph-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(2,4,16,0.4) 0%,transparent 18%,transparent 65%,rgba(2,4,16,0.95) 100%);pointer-events:none;z-index:2}
.ph-floor{position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#67E8F9 20%,#C084FC 50%,#67E8F9 80%,transparent);box-shadow:0 0 15px rgba(103,232,249,0.5);z-index:5}
.pc{position:absolute;width:16px;height:16px;z-index:4}
.pc-tl{top:10px;left:10px;border-top:1.5px solid rgba(103,232,249,0.5);border-left:1.5px solid rgba(103,232,249,0.5)}
.pc-tr{top:10px;right:10px;border-top:1.5px solid rgba(192,132,252,0.4);border-right:1.5px solid rgba(192,132,252,0.4)}
.pc-bl{bottom:10px;left:10px;border-bottom:1.5px solid rgba(192,132,252,0.35);border-left:1.5px solid rgba(192,132,252,0.35)}
.pc-br{bottom:10px;right:10px;border-bottom:1.5px solid rgba(103,232,249,0.45);border-right:1.5px solid rgba(103,232,249,0.45)}
.yr-badge{position:absolute;bottom:10px;left:14px;z-index:6;display:flex;align-items:baseline;gap:4px}
.yr-num{font-family:'Raleway',sans-serif;font-size:20px;font-weight:900;line-height:1;color:#67E8F9;text-shadow:0 0 10px rgba(103,232,249,0.5)}
.yr-lbl{font-family:'Exo 2',sans-serif;font-size:7px;font-weight:200;letter-spacing:0.35em;text-transform:uppercase;opacity:0.5;color:rgba(192,132,252,0.5)}
.specs{position:relative;z-index:20;background:rgba(2,4,16,0.97);border-top:1px solid rgba(103,232,249,0.15);padding:9px 22px 9px 26px}
.spec-row{display:flex;gap:10px}
.spec-item{flex:1;display:flex;flex-direction:column;gap:2px;border-right:1px solid rgba(103,232,249,0.1);padding-right:10px}
.spec-item:last-child{border-right:none;padding-right:0}
.spk{font-family:'Exo 2',sans-serif;font-size:7px;font-weight:200;letter-spacing:0.4em;text-transform:uppercase;color:rgba(103,232,249,0.4)}
.spv{font-family:'Raleway',sans-serif;font-size:16px;font-weight:900;letter-spacing:0.05em;color:#fff;text-transform:uppercase}
.spv.hi{color:#67E8F9;text-shadow:0 0 8px rgba(103,232,249,0.4)}
.footer{position:relative;z-index:20;padding:10px 18px 14px 26px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;border-top:1px solid rgba(103,232,249,0.15);background:rgba(1,2,8,0.98)}
.footer-left{}
.footer-center{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 14px;border-left:1px solid rgba(103,232,249,0.18);border-right:1px solid rgba(103,232,249,0.18)}
.footer-right{text-align:right}
.alh-diamond{width:11px;height:11px;transform:rotate(45deg);background:#67E8F9;box-shadow:0 0 12px rgba(103,232,249,0.7);margin-bottom:4px}
.alh-name{font-family:'Raleway',sans-serif;font-size:17px;font-weight:900;letter-spacing:0.2em;text-transform:uppercase;color:#67E8F9;text-shadow:0 0 10px rgba(103,232,249,0.3);line-height:1}
.alh-tag{font-family:'Exo 2',sans-serif;font-size:7px;font-weight:200;letter-spacing:0.5em;text-transform:uppercase;opacity:0.7;color:rgba(192,132,252,0.7);margin-top:3px}
.p-lbl{font-family:'Exo 2',sans-serif;font-size:7px;font-weight:200;letter-spacing:0.5em;text-transform:uppercase;opacity:0.35;margin-bottom:3px}
.p-val{font-family:'Raleway',sans-serif;font-size:28px;font-weight:900;background:linear-gradient(90deg,#67E8F9,#C084FC);-webkit-background-clip:text;-webkit-text-fill-color:transparent;text-shadow:0 0 14px rgba(103,232,249,0.3);letter-spacing:0.03em;line-height:1}
.c-lbl{font-family:'Exo 2',sans-serif;font-size:7px;font-weight:200;letter-spacing:0.4em;text-transform:uppercase;opacity:0.3;margin-bottom:2px}
.c-num{font-family:'Raleway',sans-serif;font-size:16px;font-weight:900;letter-spacing:0.1em;color:rgba(255,255,255,0.75);text-transform:uppercase}
.c-alh{font-family:'Exo 2',sans-serif;font-size:7px;font-weight:200;letter-spacing:0.35em;text-transform:uppercase;margin-top:2px;color:rgba(103,232,249,0.45)}
</style></head>
<body>
<div class="card">
<div class="bg"></div>
<div class="star st1"></div><div class="star st2"></div><div class="star st3"></div><div class="star st4"></div>
<div class="star st5"></div><div class="star st6"></div><div class="star st7"></div><div class="star st8"></div>
<div class="planet"></div>
<div class="side"></div><div class="top"></div>
<div class="hdr">
<div><div class="brand">${companyName || 'Galeri'}</div><div class="brand-sub">${isRealEstate ? 'Emlak' : 'Araç Galerisi'}</div></div>
<div class="badge"><div class="badge-diamond"></div><div><div class="badge-text">AlhazenPDF</div><div class="badge-sub">Premium · PDF</div></div></div>
</div>
<div class="veh">
<div class="type-tag"><div class="type-dot"></div><div class="type-txt">${isRealEstate ? ilanTuru + ' Emlak' : 'Satılık Araç'}</div></div>
<div class="make">${isRealEstate ? (emlakTuru || '—') : marka}</div>
<div class="model">${isRealEstate ? odaSayisi : model}</div>
</div>
<div class="pf">
<div class="ph-bg">${photo ? `<img src="${photo}"/>` : `<span class="ph-txt">ARAÇ FOTOĞRAFI</span>`}</div>
<div class="ph-overlay"></div><div class="ph-floor"></div>
<div class="pc pc-tl"></div><div class="pc pc-tr"></div><div class="pc pc-bl"></div><div class="pc pc-br"></div>
<div class="yr-badge"><span class="yr-num">${yil}</span><span class="yr-lbl">Model</span></div>
</div>
<div class="specs">
<div class="spec-row">
<div class="spec-item"><div class="spk">${isRealEstate ? 'M²' : 'Motor'}</div><div class="spv hi">${isRealEstate ? (m2Brut || '—') : motor}</div></div>
<div class="spec-item"><div class="spk">${isRealEstate ? 'Oda' : 'Şanzıman'}</div><div class="spv">${isRealEstate ? (odaSayisi || '—') : sanziman}</div></div>
<div class="spec-item"><div class="spk">${isRealEstate ? 'Kat' : 'Yakıt'}</div><div class="spv">${isRealEstate ? (katNo || '—') : yakıt}</div></div>
<div class="spec-item"><div class="spk">${isRealEstate ? 'Bina Yaşı' : 'Kilometre'}</div><div class="spv hi">${isRealEstate ? (binaYasi || '—') : km}</div></div>
<div class="spec-item"><div class="spk">${isRealEstate ? 'İlan Türü' : 'Renk'}</div><div class="spv">${isRealEstate ? ilanTuru : renk}</div></div>
</div>
</div>
${buildEkspertizSection(ekspertizData)}
<div class="footer">
<div class="footer-left"><div class="p-lbl">İstenen Fiyat</div><div class="p-val">${fiyat} ₺</div></div>
<div class="footer-center"><div class="alh-diamond"></div><div class="alh-name">AlhazenPDF</div><div class="alh-tag">Premium · Satış Kartı</div></div>
<div class="footer-right"><div class="c-lbl">İletişim</div><div class="c-num">${telefon}</div><div class="c-alh">AlhazenPDF</div></div>
</div>
</div>
</body></html>`;

  return postProcess(html, width, height);
};

/* ═══════════════════════════════════════════════════════════════
   5. SALDA / PIRATE (Beach Theme)
   ═══════════════════════════════════════════════════════════════ */
export const buildA4SaldaHTML = (data) => {
  const { width, height, marka, model, yil, motor, sanziman, yakıt, km, fiyat, telefon, renk, photo, companyName, ekspertizData, isRealEstate, emlakTuru, ilanTuru, odaSayisi, m2Brut, binaYasi, katNo } = parseVehicleData(data);

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=${width}">
<link href="https://fonts.googleapis.com/css2?family=Pirata+One&family=IM+Fell+DW+Pica:ital@0;1&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0E1E2A;font-family:'IM Fell DW Pica',serif}
.card{width:${width}px;height:${height}px;background:#0E1E2A;color:#fff;position:relative;overflow:hidden;display:flex;flex-direction:column}
.bg{position:absolute;inset:0;background:linear-gradient(180deg,#0E1E2A 0%,#122635 42%,#0E1E2A 100%);pointer-events:none}
.sand{position:absolute;bottom:0;left:0;right:0;height:58%;background:linear-gradient(180deg,#DED8C2 0%,#E8E0CC 30%,#F6F0E0 70%,#E8E0CC 100%);z-index:1}
.sand::before{content:'';position:absolute;inset:0;background-image:repeating-linear-gradient(45deg,transparent,transparent 2px,rgba(222,216,194,0.3) 2px,rgba(222,216,194,0.3) 4px),repeating-linear-gradient(-45deg,transparent,transparent 3px,rgba(246,240,224,0.2) 3px,rgba(246,240,224,0.2) 5px);opacity:0.4}
.water{position:absolute;bottom:39%;left:0;right:0;height:3%;background:linear-gradient(90deg,rgba(74,144,217,0.4) 0%,rgba(107,170,229,0.5) 50%,rgba(74,144,217,0.4) 100%);z-index:2}
.water::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2) 50%,transparent);animation:wave 3s ease-in-out infinite}
@keyframes wave{0%,100%{transform:translateX(-25%)}50%{transform:translateX(25%)}}
.corsair{position:absolute;bottom:42%;left:0;right:0;height:4px;background:#C41E3A;box-shadow:0 0 15px rgba(196,30,58,0.6),0 0 30px rgba(196,30,58,0.3);z-index:3}
.side{position:absolute;left:0;top:0;bottom:0;width:4px;background:linear-gradient(180deg,transparent,rgba(246,240,224,0.3) 10%,#C41E3A 20%,#8B1528 50%,#C41E3A 80%,rgba(246,240,224,0.3) 90%,transparent);box-shadow:0 0 10px rgba(196,30,58,0.4);z-index:10}
.top{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(196,30,58,0.3) 30%,rgba(196,30,58,0.5) 50%,rgba(196,30,58,0.3) 70%,transparent);z-index:10}
.hdr{position:relative;z-index:20;padding:14px 18px 12px 26px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(246,240,224,0.15)}
.brand{font-family:'Pirata One',cursive;font-size:18px;font-weight:400;letter-spacing:0.1em;color:#F6F0E0;line-height:1;text-shadow:2px 2px 4px rgba(0,0,0,0.5)}
.brand-sub{font-family:'IM Fell DW Pica',serif;font-size:8px;font-style:italic;letter-spacing:0.25em;text-transform:uppercase;margin-top:2px;opacity:0.5;color:rgba(222,216,194,0.6)}
.badge{display:flex;align-items:center;gap:7px;padding:6px 14px 6px 10px;border-radius:2px;background:rgba(196,30,58,0.15);border:1.5px solid rgba(196,30,58,0.4)}
.badge-diamond{width:10px;height:10px;transform:rotate(45deg);background:#C41E3A;box-shadow:0 0 10px rgba(196,30,58,0.6)}
.badge-text{font-family:'Pirata One',cursive;font-size:14px;font-weight:400;letter-spacing:0.15em;text-transform:uppercase;color:#C41E3A;line-height:1}
.badge-sub{font-family:'IM Fell DW Pica',serif;font-size:7px;font-style:italic;letter-spacing:0.4em;text-transform:uppercase;margin-top:2px;opacity:0.7;color:rgba(196,30,58,0.7);line-height:1}
.veh{position:relative;z-index:20;padding:10px 22px 0 26px}
.type-tag{display:flex;align-items:center;gap:8px;margin-bottom:2px}
.type-skull{width:8px;height:8px;background:#C41E3A;border-radius:50%;position:relative;box-shadow:0 0 8px rgba(196,30,58,0.6)}
.type-skull::before{content:'';position:absolute;top:-2px;left:50%;width:2px;height:4px;background:#C41E3A;transform:translateX(-50%)}
.type-txt{font-family:'IM Fell DW Pica',serif;font-size:8px;font-style:italic;font-weight:400;letter-spacing:0.4em;text-transform:uppercase;color:rgba(222,216,194,0.7)}
.make{font-family:'Pirata One',cursive;font-size:86px;line-height:0.88;letter-spacing:0.08em;color:#F6F0E0;text-shadow:3px 3px 6px rgba(0,0,0,0.7)}
.model{font-family:'IM Fell DW Pica',serif;font-size:26px;font-style:italic;font-weight:400;letter-spacing:0.15em;line-height:1.2;margin-top:4px;color:#DED8C2}
.pf{position:relative;z-index:20;flex:1;min-height:0;overflow:hidden;margin:12px 0 0}
.ph-bg{position:absolute;inset:0;background:linear-gradient(160deg,#1A2A35,#0F1D26);display:flex;align-items:center;justify-content:center}
${photo ? `.ph-bg{background:none}.ph-bg img{width:100%;height:100%;object-fit:cover}` : `.ph-txt{font-family:'IM Fell DW Pica',serif;font-size:10px;font-style:italic;letter-spacing:0.4em;text-transform:uppercase;color:rgba(222,216,194,0.15)}`}
.ph-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,30,42,0.4) 0%,transparent 18%,transparent 65%,rgba(14,30,42,0.9) 100%);pointer-events:none;z-index:2}
.ph-floor{position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#C41E3A 20%,#F6F0E0 50%,#C41E3A 80%,transparent);box-shadow:0 0 10px rgba(196,30,58,0.4);z-index:5}
.pc{position:absolute;width:14px;height:14px;z-index:4}
.pc-tl{top:10px;left:10px;border-top:2px solid rgba(196,30,58,0.4);border-left:2px solid rgba(196,30,58,0.4)}
.pc-tr{top:10px;right:10px;border-top:2px solid rgba(222,216,194,0.3);border-right:2px solid rgba(222,216,194,0.3)}
.pc-bl{bottom:10px;left:10px;border-bottom:2px solid rgba(222,216,194,0.28);border-left:2px solid rgba(222,216,194,0.28)}
.pc-br{bottom:10px;right:10px;border-bottom:2px solid rgba(196,30,58,0.35);border-right:2px solid rgba(196,30,58,0.35)}
.yr-badge{position:absolute;bottom:10px;left:14px;z-index:6;display:flex;align-items:baseline;gap:4px}
.yr-num{font-family:'Pirata One',cursive;font-size:22px;font-weight:400;line-height:1;color:#C41E3A;text-shadow:0 0 8px rgba(196,30,58,0.5)}
.yr-lbl{font-family:'IM Fell DW Pica',serif;font-size:7px;font-style:italic;letter-spacing:0.3em;text-transform:uppercase;opacity:0.5;color:rgba(222,216,194,0.5)}
.specs{position:relative;z-index:20;background:rgba(14,30,42,0.95);border-top:1px solid rgba(246,240,224,0.15);padding:9px 22px 9px 26px}
.spec-row{display:flex;gap:10px}
.spec-item{flex:1;display:flex;flex-direction:column;gap:2px;border-right:1px solid rgba(246,240,224,0.1);padding-right:10px}
.spec-item:last-child{border-right:none;padding-right:0}
.spk{font-family:'IM Fell DW Pica',serif;font-size:7px;font-style:italic;letter-spacing:0.35em;text-transform:uppercase;color:rgba(222,216,194,0.4)}
.spv{font-family:'Pirata One',cursive;font-size:17px;letter-spacing:0.05em;color:#F6F0E0}
.spv.hi{color:#C41E3A}
.footer{position:relative;z-index:20;padding:10px 18px 14px 26px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;border-top:1px solid rgba(246,240,224,0.15);background:rgba(10,20,28,0.98)}
.footer-left{}
.footer-center{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 14px;border-left:1px solid rgba(246,240,224,0.15);border-right:1px solid rgba(246,240,224,0.15)}
.footer-right{text-align:right}
.alh-diamond{width:11px;height:11px;transform:rotate(45deg);background:#C41E3A;box-shadow:0 0 10px rgba(196,30,58,0.6);margin-bottom:4px}
.alh-name{font-family:'Pirata One',cursive;font-size:18px;font-weight:400;letter-spacing:0.18em;text-transform:uppercase;color:#C41E3A;text-shadow:0 0 10px rgba(196,30,58,0.3);line-height:1}
.alh-tag{font-family:'IM Fell DW Pica',serif;font-size:7px;font-style:italic;font-weight:400;letter-spacing:0.4em;text-transform:uppercase;opacity:0.7;color:rgba(222,216,194,0.7);margin-top:3px}
.p-lbl{font-family:'IM Fell DW Pica',serif;font-size:7px;font-style:italic;letter-spacing:0.4em;text-transform:uppercase;opacity:0.35;margin-bottom:3px}
.p-val{font-family:'Pirata One',cursive;font-size:28px;font-weight:400;color:#C41E3A;text-shadow:0 0 12px rgba(196,30,58,0.4);letter-spacing:0.05em;line-height:1}
.c-lbl{font-family:'IM Fell DW Pica',serif;font-size:7px;font-style:italic;letter-spacing:0.3em;text-transform:uppercase;opacity:0.3;margin-bottom:2px}
.c-num{font-family:'Pirata One',cursive;font-size:16px;font-weight:400;letter-spacing:0.08em;color:rgba(246,240,224,0.75)}
.c-alh{font-family:'IM Fell DW Pica',serif;font-size:7px;font-style:italic;letter-spacing:0.3em;text-transform:uppercase;margin-top:2px;color:rgba(196,30,58,0.4)}
</style></head>
<body>
<div class="card">
<div class="bg"></div><div class="sand"></div><div class="water"></div><div class="corsair"></div>
<div class="side"></div><div class="top"></div>
<div class="hdr">
<div><div class="brand">${companyName || 'Galeri'}</div><div class="brand-sub">${isRealEstate ? 'Emlak' : 'Araç Galerisi'}</div></div>
<div class="badge"><div class="badge-diamond"></div><div><div class="badge-text">AlhazenPDF</div><div class="badge-sub">Premium · PDF</div></div></div>
</div>
<div class="veh">
<div class="type-tag"><div class="type-skull"></div><div class="type-txt">${isRealEstate ? ilanTuru + ' Emlak' : 'Satılık Araç'}</div></div>
<div class="make">${isRealEstate ? (emlakTuru || '—') : marka}</div>
<div class="model">${isRealEstate ? odaSayisi : model}</div>
</div>
<div class="pf">
<div class="ph-bg">${photo ? `<img src="${photo}"/>` : `<span class="ph-txt">ARAÇ FOTOĞRAFI</span>`}</div>
<div class="ph-overlay"></div><div class="ph-floor"></div>
<div class="pc pc-tl"></div><div class="pc pc-tr"></div><div class="pc pc-bl"></div><div class="pc pc-br"></div>
<div class="yr-badge"><span class="yr-num">${yil}</span><span class="yr-lbl">Model</span></div>
</div>
<div class="specs">
<div class="spec-row">
<div class="spec-item"><div class="spk">${isRealEstate ? 'M²' : 'Motor'}</div><div class="spv hi">${isRealEstate ? (m2Brut || '—') : motor}</div></div>
<div class="spec-item"><div class="spk">${isRealEstate ? 'Oda' : 'Şanzıman'}</div><div class="spv">${isRealEstate ? (odaSayisi || '—') : sanziman}</div></div>
<div class="spec-item"><div class="spk">${isRealEstate ? 'Kat' : 'Yakıt'}</div><div class="spv">${isRealEstate ? (katNo || '—') : yakıt}</div></div>
<div class="spec-item"><div class="spk">${isRealEstate ? 'Bina Yaşı' : 'Kilometre'}</div><div class="spv hi">${isRealEstate ? (binaYasi || '—') : km}</div></div>
<div class="spec-item"><div class="spk">${isRealEstate ? 'İlan Türü' : 'Renk'}</div><div class="spv">${isRealEstate ? ilanTuru : renk}</div></div>
</div>
</div>
${buildEkspertizSection(ekspertizData)}
<div class="footer">
<div class="footer-left"><div class="p-lbl">İstenen Fiyat</div><div class="p-val">${fiyat} ₺</div></div>
<div class="footer-center"><div class="alh-diamond"></div><div class="alh-name">AlhazenPDF</div><div class="alh-tag">Premium · Satış Kartı</div></div>
<div class="footer-right"><div class="c-lbl">İletişim</div><div class="c-num">${telefon}</div><div class="c-alh">AlhazenPDF</div></div>
</div>
</div>
</body></html>`;

  return postProcess(html, width, height);
};

/* Continue to next message for remaining 5 themes... */
/* ═══════════════════════════════════════════════════════════════
   6. KRİSTAL / CRYSTAL (Multi-Color Theme)
   ═══════════════════════════════════════════════════════════════ */
export const buildA4CrystalHTML = (data) => {
  const { width, height, marka, model, yil, motor, sanziman, yakıt, km, fiyat, telefon, renk, photo, companyName, ekspertizData, isRealEstate, emlakTuru, ilanTuru, odaSayisi, m2Brut, binaYasi, katNo } = parseVehicleData(data);

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=${width}">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#06060C;font-family:'Cormorant Garamond',serif}
.card{width:${width}px;height:${height}px;background:#06060C;color:#fff;position:relative;overflow:hidden;display:flex;flex-direction:column}
.bg{position:absolute;inset:0;background:radial-gradient(ellipse 70% 50% at 50% 30%,rgba(59,130,246,0.05) 0%,transparent 60%),radial-gradient(ellipse 60% 45% at 20% 70%,rgba(16,185,129,0.04) 0%,transparent 55%),radial-gradient(ellipse 50% 40% at 80% 60%,rgba(239,68,68,0.05) 0%,transparent 50%);pointer-events:none}
.side{position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(180deg,transparent,#3B82F6 15%,#10B981 40%,#EF4444 65%,#8B5CF6 85%,transparent);box-shadow:0 0 10px rgba(59,130,246,0.3),0 0 20px rgba(16,185,129,0.2);z-index:10}
.top{position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,#3B82F6 25%,#10B981 50%,#EF4444 75%,transparent);z-index:10}
.hdr{position:relative;z-index:20;padding:14px 18px 12px 26px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.08)}
.brand{font-family:'Cormorant Garamond',serif;font-size:14px;font-weight:400;font-style:italic;letter-spacing:0.2em;color:rgba(255,255,255,0.95);line-height:1}
.brand-sub{font-size:8px;font-style:italic;letter-spacing:0.4em;text-transform:uppercase;margin-top:2px;opacity:0.4;color:rgba(59,130,246,0.5)}
.badge{display:flex;align-items:center;gap:7px;padding:6px 14px 6px 10px;border-radius:2px;background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.3)}
.badge-diamond{width:10px;height:10px;transform:rotate(45deg);background:linear-gradient(135deg,#3B82F6,#10B981,#EF4444);box-shadow:0 0 12px rgba(59,130,246,0.5)}
.badge-text{font-family:'Cormorant Garamond',serif;font-size:13px;font-weight:400;font-style:italic;letter-spacing:0.2em;text-transform:uppercase;background:linear-gradient(90deg,#3B82F6,#10B981,#EF4444);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1}
.badge-sub{font-size:7px;font-style:italic;letter-spacing:0.45em;text-transform:uppercase;margin-top:2px;opacity:0.7;color:rgba(16,185,129,0.7);line-height:1}
.veh{position:relative;z-index:20;padding:10px 22px 0 26px}
.type-tag{display:flex;align-items:center;gap:8px;margin-bottom:2px}
.type-gem{width:8px;height:8px;background:linear-gradient(135deg,#3B82F6,#10B981);transform:rotate(45deg);box-shadow:0 0 10px rgba(59,130,246,0.6)}
.type-txt{font-size:8px;font-weight:300;font-style:italic;letter-spacing:0.5em;text-transform:uppercase;color:rgba(16,185,129,0.7)}
.make{font-family:'Cormorant Garamond',serif;font-size:96px;line-height:0.86;font-weight:300;font-style:italic;letter-spacing:0.05em;color:#fff;text-shadow:0 0 40px rgba(59,130,246,0.2)}
.model{font-size:36px;font-weight:300;font-style:italic;letter-spacing:0.08em;line-height:1;margin-top:2px;background:linear-gradient(90deg,#3B82F6,#10B981);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.pf{position:relative;flex:1;min-height:0;overflow:hidden;margin:12px 0 0}
.ph-bg{position:absolute;inset:0;background:linear-gradient(150deg,#0E0F14,#080A10);display:flex;align-items:center;justify-content:center}
${photo ? `.ph-bg{background:none}.ph-bg img{width:100%;height:100%;object-fit:cover}` : `.ph-txt{font-size:10px;font-style:italic;letter-spacing:0.5em;text-transform:uppercase;color:rgba(59,130,246,0.15)}`}
.ph-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(6,6,12,0.35) 0%,transparent 18%,transparent 65%,rgba(6,6,12,0.95) 100%);pointer-events:none;z-index:2}
.ph-floor{position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#3B82F6 20%,#10B981 40%,#EF4444 60%,#8B5CF6 80%,transparent);box-shadow:0 0 12px rgba(59,130,246,0.4);z-index:5}
.pc{position:absolute;width:16px;height:16px;z-index:4}
.pc-tl{top:10px;left:10px;border-top:1.5px solid rgba(59,130,246,0.5);border-left:1.5px solid rgba(59,130,246,0.5)}
.pc-tr{top:10px;right:10px;border-top:1.5px solid rgba(16,185,129,0.4);border-right:1.5px solid rgba(16,185,129,0.4)}
.pc-bl{bottom:10px;left:10px;border-bottom:1.5px solid rgba(239,68,68,0.35);border-left:1.5px solid rgba(239,68,68,0.35)}
.pc-br{bottom:10px;right:10px;border-bottom:1.5px solid rgba(139,92,246,0.4);border-right:1.5px solid rgba(139,92,246,0.4)}
.yr-badge{position:absolute;bottom:10px;left:14px;z-index:6;display:flex;align-items:baseline;gap:4px}
.yr-num{font-size:20px;font-weight:300;font-style:italic;line-height:1;background:linear-gradient(90deg,#3B82F6,#10B981);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.yr-lbl{font-size:7px;font-style:italic;letter-spacing:0.35em;text-transform:uppercase;opacity:0.5;color:rgba(59,130,246,0.5)}
.specs{position:relative;z-index:20;background:rgba(6,6,12,0.97);border-top:1px solid rgba(255,255,255,0.08);padding:9px 22px 9px 26px}
.spec-row{display:flex;gap:10px}
.spec-item{flex:1;display:flex;flex-direction:column;gap:2px;border-right:1px solid rgba(255,255,255,0.06);padding-right:10px}
.spec-item:last-child{border-right:none;padding-right:0}
.spk{font-size:7px;font-style:italic;letter-spacing:0.4em;text-transform:uppercase;color:rgba(255,255,255,0.35)}
.spv{font-size:16px;font-weight:300;font-style:italic;letter-spacing:0.03em;color:#fff}
.spv.hi{background:linear-gradient(90deg,#3B82F6,#10B981);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.footer{position:relative;z-index:20;padding:10px 18px 14px 26px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;border-top:1px solid rgba(255,255,255,0.08);background:rgba(4,4,8,0.98)}
.footer-left{}
.footer-center{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 14px;border-left:1px solid rgba(255,255,255,0.08);border-right:1px solid rgba(255,255,255,0.08)}
.footer-right{text-align:right}
.alh-diamond{width:11px;height:11px;transform:rotate(45deg);background:linear-gradient(135deg,#3B82F6,#10B981,#EF4444);box-shadow:0 0 12px rgba(59,130,246,0.5);margin-bottom:4px}
.alh-name{font-size:17px;font-weight:300;font-style:italic;letter-spacing:0.2em;text-transform:uppercase;background:linear-gradient(90deg,#3B82F6,#10B981,#EF4444);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1}
.alh-tag{font-size:7px;font-weight:300;font-style:italic;letter-spacing:0.5em;text-transform:uppercase;opacity:0.7;color:rgba(16,185,129,0.7);margin-top:3px}
.p-lbl{font-size:7px;font-style:italic;letter-spacing:0.5em;text-transform:uppercase;opacity:0.35;margin-bottom:3px}
.p-val{font-size:28px;font-weight:300;font-style:italic;background:linear-gradient(90deg,#3B82F6,#10B981,#EF4444);-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:0.03em;line-height:1}
.c-lbl{font-size:7px;font-style:italic;letter-spacing:0.4em;text-transform:uppercase;opacity:0.3;margin-bottom:2px}
.c-num{font-size:16px;font-weight:300;font-style:italic;letter-spacing:0.1em;color:rgba(255,255,255,0.75)}
.c-alh{font-size:7px;font-style:italic;letter-spacing:0.35em;text-transform:uppercase;margin-top:2px;color:rgba(59,130,246,0.45)}
</style></head>
<body>
<div class="card">
<div class="bg"></div><div class="side"></div><div class="top"></div>
<div class="hdr">
<div><div class="brand">${companyName || 'Galeri'}</div><div class="brand-sub">${isRealEstate ? 'Emlak' : 'Araç Galerisi'}</div></div>
<div class="badge"><div class="badge-diamond"></div><div><div class="badge-text">AlhazenPDF</div><div class="badge-sub">Premium · PDF</div></div></div>
</div>
<div class="veh">
<div class="type-tag"><div class="type-gem"></div><div class="type-txt">${isRealEstate ? ilanTuru + ' Emlak' : 'Satılık Araç'}</div></div>
<div class="make">${isRealEstate ? (emlakTuru || '—') : marka}</div>
<div class="model">${isRealEstate ? odaSayisi : model}</div>
</div>
<div class="pf">
<div class="ph-bg">${photo ? `<img src="${photo}"/>` : `<span class="ph-txt">ARAÇ FOTOĞRAFI</span>`}</div>
<div class="ph-overlay"></div><div class="ph-floor"></div>
<div class="pc pc-tl"></div><div class="pc pc-tr"></div><div class="pc pc-bl"></div><div class="pc pc-br"></div>
<div class="yr-badge"><span class="yr-num">${yil}</span><span class="yr-lbl">Model</span></div>
</div>
<div class="specs">
<div class="spec-row">
<div class="spec-item"><div class="spk">${isRealEstate ? 'M²' : 'Motor'}</div><div class="spv hi">${isRealEstate ? (m2Brut || '—') : motor}</div></div>
<div class="spec-item"><div class="spk">${isRealEstate ? 'Oda' : 'Şanzıman'}</div><div class="spv">${isRealEstate ? (odaSayisi || '—') : sanziman}</div></div>
<div class="spec-item"><div class="spk">${isRealEstate ? 'Kat' : 'Yakıt'}</div><div class="spv">${isRealEstate ? (katNo || '—') : yakıt}</div></div>
<div class="spec-item"><div class="spk">${isRealEstate ? 'Bina Yaşı' : 'Kilometre'}</div><div class="spv hi">${isRealEstate ? (binaYasi || '—') : km}</div></div>
<div class="spec-item"><div class="spk">${isRealEstate ? 'İlan Türü' : 'Renk'}</div><div class="spv">${isRealEstate ? ilanTuru : renk}</div></div>
</div>
</div>
${buildEkspertizSection(ekspertizData)}
<div class="footer">
<div class="footer-left"><div class="p-lbl">İstenen Fiyat</div><div class="p-val">${fiyat} ₺</div></div>
<div class="footer-center"><div class="alh-diamond"></div><div class="alh-name">AlhazenPDF</div><div class="alh-tag">Premium · Satış Kartı</div></div>
<div class="footer-right"><div class="c-lbl">İletişim</div><div class="c-num">${telefon}</div><div class="c-alh">AlhazenPDF</div></div>
</div>
</div>
</body></html>`;

  return postProcess(html, width, height);
};
/* ═══════════════════════════════════════════════════════════════
   7. KEHRİBAR / AMBER (Resin Theme)
   ═══════════════════════════════════════════════════════════════ */
export const buildA4AmberHTML = (data) => {
  const { width, height, marka, model, yil, motor, sanziman, yakıt, km, fiyat, telefon, renk, photo, companyName, ekspertizData, isRealEstate, emlakTuru, ilanTuru, odaSayisi, m2Brut, binaYasi, katNo } = parseVehicleData(data);

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=${width}">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#100800;font-family:'Playfair Display',serif}
.card{width:${width}px;height:${height}px;background:#100800;color:#fff;position:relative;overflow:hidden;display:flex;flex-direction:column}
.bg{position:absolute;inset:0;background:radial-gradient(ellipse 75% 55% at 50% 40%,rgba(217,119,6,0.08) 0%,transparent 65%),radial-gradient(ellipse 60% 45% at 20% 80%,rgba(251,146,60,0.05) 0%,transparent 55%);pointer-events:none}
.resin-glow{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 30%,rgba(217,119,6,0.12) 0%,rgba(180,83,9,0.06) 40%,transparent 70%);pointer-events:none;opacity:0.6}
.vein{position:absolute;z-index:2}
.v1{top:15%;left:5%;width:80px;height:1px;background:linear-gradient(90deg,transparent,rgba(217,119,6,0.2) 50%,transparent);transform:rotate(-8deg)}
.v2{top:35%;right:8%;width:60px;height:1px;background:linear-gradient(90deg,transparent,rgba(217,119,6,0.15) 50%,transparent);transform:rotate(12deg)}
.v3{top:55%;left:15%;width:45px;height:1px;background:linear-gradient(90deg,transparent,rgba(217,119,6,0.18) 50%,transparent);transform:rotate(-15deg)}
.side{position:absolute;left:0;top:0;bottom:0;width:4px;background:linear-gradient(180deg,transparent,rgba(217,119,6,0.3) 10%,#D97706 30%,#FB923C 50%,#D97706 70%,rgba(217,119,6,0.3) 90%,transparent);box-shadow:0 0 12px rgba(217,119,6,0.35),inset 0 0 6px rgba(251,146,60,0.2);z-index:10}
.top{position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(217,119,6,0.4) 30%,rgba(251,146,60,0.5) 50%,rgba(217,119,6,0.4) 70%,transparent);z-index:10}
.hdr{position:relative;z-index:20;padding:14px 18px 12px 26px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(217,119,6,0.15)}
.brand{font-family:'Playfair Display',serif;font-size:14px;font-weight:700;letter-spacing:0.2em;color:rgba(255,255,255,0.95);line-height:1}
.brand-sub{font-size:8px;font-style:italic;letter-spacing:0.35em;text-transform:uppercase;margin-top:2px;opacity:0.45;color:rgba(217,119,6,0.6)}
.badge{display:flex;align-items:center;gap:7px;padding:6px 14px 6px 10px;border-radius:2px;background:rgba(217,119,6,0.1);border:1.5px solid rgba(217,119,6,0.35)}
.badge-diamond{width:10px;height:10px;transform:rotate(45deg);background:#D97706;box-shadow:0 0 10px rgba(217,119,6,0.6),inset 0 0 4px rgba(251,146,60,0.4)}
.badge-text{font-family:'Playfair Display',serif;font-size:13px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#D97706;text-shadow:0 0 12px rgba(217,119,6,0.3);line-height:1}
.badge-sub{font-size:7px;font-style:italic;letter-spacing:0.45em;text-transform:uppercase;margin-top:2px;opacity:0.7;color:rgba(251,146,60,0.7);line-height:1}
.veh{position:relative;z-index:20;padding:10px 22px 0 26px}
.type-tag{display:flex;align-items:center;gap:8px;margin-bottom:2px}
.type-amber{width:9px;height:9px;background:radial-gradient(circle at 30% 30%,rgba(251,146,60,0.8),rgba(217,119,6,0.6));border-radius:50%;box-shadow:0 0 10px rgba(217,119,6,0.5),inset 0 0 3px rgba(251,146,60,0.3)}
.type-txt{font-size:8px;font-weight:400;letter-spacing:0.5em;text-transform:uppercase;color:rgba(217,119,6,0.75)}
.make{font-family:'Playfair Display',serif;font-size:88px;line-height:0.88;font-weight:700;letter-spacing:0.03em;color:#fff;text-shadow:0 2px 30px rgba(217,119,6,0.25)}
.model{font-size:32px;font-weight:400;font-style:italic;letter-spacing:0.12em;line-height:1;margin-top:3px;color:#D97706;text-shadow:0 0 15px rgba(217,119,6,0.3)}
.pf{position:relative;flex:1;min-height:0;overflow:hidden;margin:12px 0 0}
.ph-bg{position:absolute;inset:0;background:linear-gradient(155deg,#1A1008,#140A04);display:flex;align-items:center;justify-content:center}
${photo ? `.ph-bg{background:none}.ph-bg img{width:100%;height:100%;object-fit:cover}` : `.ph-txt{font-size:10px;font-style:italic;letter-spacing:0.5em;text-transform:uppercase;color:rgba(217,119,6,0.15)}`}
.ph-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(16,8,0,0.4) 0%,transparent 18%,transparent 65%,rgba(16,8,0,0.95) 100%);pointer-events:none;z-index:2}
.ph-floor{position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#D97706 20%,#FB923C 50%,#D97706 80%,transparent);box-shadow:0 0 12px rgba(217,119,6,0.4);z-index:5}
.pc{position:absolute;width:16px;height:16px;z-index:4}
.pc-tl{top:10px;left:10px;border-top:1.5px solid rgba(217,119,6,0.4);border-left:1.5px solid rgba(217,119,6,0.4)}
.pc-tr{top:10px;right:10px;border-top:1.5px solid rgba(251,146,60,0.35);border-right:1.5px solid rgba(251,146,60,0.35)}
.pc-bl{bottom:10px;left:10px;border-bottom:1.5px solid rgba(251,146,60,0.3);border-left:1.5px solid rgba(251,146,60,0.3)}
.pc-br{bottom:10px;right:10px;border-bottom:1.5px solid rgba(217,119,6,0.38);border-right:1.5px solid rgba(217,119,6,0.38)}
.yr-badge{position:absolute;bottom:10px;left:14px;z-index:6;display:flex;align-items:baseline;gap:4px}
.yr-num{font-size:20px;font-weight:700;line-height:1;color:#D97706;text-shadow:0 0 10px rgba(217,119,6,0.5)}
.yr-lbl{font-size:7px;font-style:italic;letter-spacing:0.35em;text-transform:uppercase;opacity:0.5;color:rgba(217,119,6,0.5)}
.specs{position:relative;z-index:20;background:rgba(16,8,0,0.97);border-top:1px solid rgba(217,119,6,0.15);padding:9px 22px 9px 26px}
.spec-row{display:flex;gap:10px}
.spec-item{flex:1;display:flex;flex-direction:column;gap:2px;border-right:1px solid rgba(217,119,6,0.1);padding-right:10px}
.spec-item:last-child{border-right:none;padding-right:0}
.spk{font-size:7px;font-style:italic;letter-spacing:0.4em;text-transform:uppercase;color:rgba(217,119,6,0.4)}
.spv{font-size:16px;font-weight:700;letter-spacing:0.03em;color:#fff}
.spv.hi{color:#D97706;text-shadow:0 0 8px rgba(217,119,6,0.3)}
.footer{position:relative;z-index:20;padding:10px 18px 14px 26px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;border-top:1px solid rgba(217,119,6,0.15);background:rgba(12,6,0,0.98)}
.footer-left{}
.footer-center{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 14px;border-left:1px solid rgba(217,119,6,0.15);border-right:1px solid rgba(217,119,6,0.15)}
.footer-right{text-align:right}
.alh-diamond{width:11px;height:11px;transform:rotate(45deg);background:#D97706;box-shadow:0 0 10px rgba(217,119,6,0.6),inset 0 0 4px rgba(251,146,60,0.4);margin-bottom:4px}
.alh-name{font-size:17px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#D97706;text-shadow:0 0 12px rgba(217,119,6,0.3);line-height:1}
.alh-tag{font-size:7px;font-weight:400;font-style:italic;letter-spacing:0.5em;text-transform:uppercase;opacity:0.7;color:rgba(251,146,60,0.7);margin-top:3px}
.p-lbl{font-size:7px;font-style:italic;letter-spacing:0.5em;text-transform:uppercase;opacity:0.35;margin-bottom:3px}
.p-val{font-size:28px;font-weight:700;color:#D97706;text-shadow:0 0 14px rgba(217,119,6,0.4);letter-spacing:0.03em;line-height:1}
.c-lbl{font-size:7px;font-style:italic;letter-spacing:0.4em;text-transform:uppercase;opacity:0.3;margin-bottom:2px}
.c-num{font-size:16px;font-weight:700;letter-spacing:0.1em;color:rgba(255,255,255,0.75)}
.c-alh{font-size:7px;font-style:italic;letter-spacing:0.35em;text-transform:uppercase;margin-top:2px;color:rgba(217,119,6,0.45)}
</style></head>
<body>
<div class="card">
<div class="bg"></div><div class="resin-glow"></div>
<div class="vein v1"></div><div class="vein v2"></div><div class="vein v3"></div>
<div class="side"></div><div class="top"></div>
<div class="hdr">
<div><div class="brand">${companyName || 'Galeri'}</div><div class="brand-sub">${isRealEstate ? 'Emlak' : 'Araç Galerisi'}</div></div>
<div class="badge"><div class="badge-diamond"></div><div><div class="badge-text">AlhazenPDF</div><div class="badge-sub">Premium · PDF</div></div></div>
</div>
<div class="veh">
<div class="type-tag"><div class="type-amber"></div><div class="type-txt">${isRealEstate ? ilanTuru + ' Emlak' : 'Satılık Araç'}</div></div>
<div class="make">${isRealEstate ? (emlakTuru || '—') : marka}</div>
<div class="model">${isRealEstate ? odaSayisi : model}</div>
</div>
<div class="pf">
<div class="ph-bg">${photo ? `<img src="${photo}"/>` : `<span class="ph-txt">ARAÇ FOTOĞRAFI</span>`}</div>
<div class="ph-overlay"></div><div class="ph-floor"></div>
<div class="pc pc-tl"></div><div class="pc pc-tr"></div><div class="pc pc-bl"></div><div class="pc pc-br"></div>
<div class="yr-badge"><span class="yr-num">${yil}</span><span class="yr-lbl">Model</span></div>
</div>
<div class="specs">
<div class="spec-row">
<div class="spec-item"><div class="spk">${isRealEstate ? 'M²' : 'Motor'}</div><div class="spv hi">${isRealEstate ? (m2Brut || '—') : motor}</div></div>
<div class="spec-item"><div class="spk">${isRealEstate ? 'Oda' : 'Şanzıman'}</div><div class="spv">${isRealEstate ? (odaSayisi || '—') : sanziman}</div></div>
<div class="spec-item"><div class="spk">${isRealEstate ? 'Kat' : 'Yakıt'}</div><div class="spv">${isRealEstate ? (katNo || '—') : yakıt}</div></div>
<div class="spec-item"><div class="spk">${isRealEstate ? 'Bina Yaşı' : 'Kilometre'}</div><div class="spv hi">${isRealEstate ? (binaYasi || '—') : km}</div></div>
<div class="spec-item"><div class="spk">${isRealEstate ? 'İlan Türü' : 'Renk'}</div><div class="spv">${isRealEstate ? ilanTuru : renk}</div></div>
</div>
</div>
${buildEkspertizSection(ekspertizData)}
<div class="footer">
<div class="footer-left"><div class="p-lbl">İstenen Fiyat</div><div class="p-val">${fiyat} ₺</div></div>
<div class="footer-center"><div class="alh-diamond"></div><div class="alh-name">AlhazenPDF</div><div class="alh-tag">Premium · Satış Kartı</div></div>
<div class="footer-right"><div class="c-lbl">İletişim</div><div class="c-num">${telefon}</div><div class="c-alh">AlhazenPDF</div></div>
</div>
</div>
</body></html>`;

  return postProcess(html, width, height);
};
/* ═══════════════════════════════════════════════════════════════
   8. OLTU TAŞ / OPAL (Black Opal Theme)
   ═══════════════════════════════════════════════════════════════ */
export const buildA4OltuHTML = (data) => {
  const { width, height, marka, model, yil, motor, sanziman, yakıt, km, fiyat, telefon, renk, photo, companyName, ekspertizData, isRealEstate, emlakTuru, ilanTuru, odaSayisi, m2Brut, binaYasi, katNo } = parseVehicleData(data);

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=${width}">
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#060606;font-family:'Cinzel',serif}
.card{width:${width}px;height:${height}px;background:#060606;color:#fff;position:relative;overflow:hidden;display:flex;flex-direction:column}
.bg{position:absolute;inset:0;background:radial-gradient(ellipse 70% 50% at 50% 40%,rgba(236,72,153,0.04) 0%,transparent 60%),radial-gradient(ellipse 60% 45% at 25% 75%,rgba(59,130,246,0.03) 0%,transparent 55%),radial-gradient(ellipse 50% 40% at 75% 25%,rgba(16,185,129,0.03) 0%,transparent 50%);pointer-events:none}
.opal-overlay{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:240px;height:340px;background:radial-gradient(ellipse closest-side,rgba(236,72,153,0.08) 0%,rgba(59,130,246,0.06) 30%,rgba(16,185,129,0.05) 50%,rgba(192,132,252,0.06) 70%,transparent 90%);border-radius:30% 70% 70% 30% / 30% 30% 70% 70%;opacity:0.4;z-index:1}
.opal-ray{position:absolute;z-index:2}
.r1{top:20%;left:15%;width:60px;height:1px;background:linear-gradient(90deg,transparent,rgba(236,72,153,0.25) 50%,transparent);transform:rotate(-25deg)}
.r2{top:45%;right:18%;width:70px;height:1px;background:linear-gradient(90deg,transparent,rgba(59,130,246,0.2) 50%,transparent);transform:rotate(35deg)}
.side{position:absolute;left:0;top:0;bottom:0;width:5px;background:linear-gradient(180deg,transparent,rgba(236,72,153,0.2) 15%,rgba(59,130,246,0.25) 35%,rgba(16,185,129,0.25) 55%,rgba(192,132,252,0.25) 75%,rgba(251,146,60,0.2) 90%,transparent);opacity:0.7;z-index:10}
.top{position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(236,72,153,0.3) 25%,rgba(59,130,246,0.35) 50%,rgba(16,185,129,0.3) 75%,transparent);z-index:10}
.hdr{position:relative;z-index:20;padding:14px 18px 12px 26px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.06)}
.brand{font-family:'Cinzel',serif;font-size:13px;font-weight:600;letter-spacing:0.25em;color:rgba(255,255,255,0.95);line-height:1}
.brand-sub{font-size:8px;letter-spacing:0.4em;text-transform:uppercase;margin-top:2px;opacity:0.45;color:rgba(236,72,153,0.5)}
.badge{display:flex;align-items:center;gap:7px;padding:6px 14px 6px 10px;border-radius:2px;background:rgba(236,72,153,0.06);border:1px solid rgba(236,72,153,0.25)}
.badge-diamond{width:10px;height:10px;transform:rotate(45deg);background:linear-gradient(135deg,rgba(236,72,153,0.8),rgba(59,130,246,0.6),rgba(16,185,129,0.7));box-shadow:0 0 12px rgba(236,72,153,0.4)}
.badge-text{font-family:'Cinzel',serif;font-size:12px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;background:linear-gradient(90deg,#EC4899,#3B82F6,#10B981);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1}
.badge-sub{font-size:7px;letter-spacing:0.45em;text-transform:uppercase;margin-top:2px;opacity:0.7;color:rgba(59,130,246,0.7);line-height:1}
.veh{position:relative;z-index:20;padding:10px 22px 0 26px}
.type-tag{display:flex;align-items:center;gap:8px;margin-bottom:2px}
.type-opal{width:8px;height:8px;background:radial-gradient(circle,rgba(236,72,153,0.7),rgba(59,130,246,0.5) 50%,rgba(16,185,129,0.6));border-radius:50%;box-shadow:0 0 10px rgba(236,72,153,0.5)}
.type-txt{font-size:8px;font-weight:400;letter-spacing:0.5em;text-transform:uppercase;color:rgba(236,72,153,0.6)}
.make{font-family:'Cinzel',serif;font-size:80px;line-height:0.88;font-weight:700;letter-spacing:0.08em;color:#fff;text-shadow:0 0 40px rgba(236,72,153,0.2)}
.model{font-size:32px;font-weight:400;letter-spacing:0.15em;line-height:1;margin-top:3px;background:linear-gradient(90deg,#EC4899,#3B82F6,#10B981);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.pf{position:relative;flex:1;min-height:0;overflow:hidden;margin:12px 0 0}
.ph-bg{position:absolute;inset:0;background:linear-gradient(160deg,#0E0E10,#060608);display:flex;align-items:center;justify-content:center}
${photo ? `.ph-bg{background:none}.ph-bg img{width:100%;height:100%;object-fit:cover}` : `.ph-txt{font-size:10px;letter-spacing:0.5em;text-transform:uppercase;color:rgba(236,72,153,0.12)}`}
.ph-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(6,6,6,0.35) 0%,transparent 18%,transparent 65%,rgba(6,6,6,0.95) 100%);pointer-events:none;z-index:2}
.ph-floor{position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#EC4899 15%,#3B82F6 35%,#10B981 55%,#C084FC 75%,#FB923C 90%,transparent);box-shadow:0 0 12px rgba(236,72,153,0.3);z-index:5}
.pc{position:absolute;width:16px;height:16px;z-index:4}
.pc-tl{top:10px;left:10px;border-top:1.5px solid rgba(236,72,153,0.4);border-left:1.5px solid rgba(236,72,153,0.4)}
.pc-tr{top:10px;right:10px;border-top:1.5px solid rgba(59,130,246,0.35);border-right:1.5px solid rgba(59,130,246,0.35)}
.pc-bl{bottom:10px;left:10px;border-bottom:1.5px solid rgba(16,185,129,0.32);border-left:1.5px solid rgba(16,185,129,0.32)}
.pc-br{bottom:10px;right:10px;border-bottom:1.5px solid rgba(192,132,252,0.38);border-right:1.5px solid rgba(192,132,252,0.38)}
.yr-badge{position:absolute;bottom:10px;left:14px;z-index:6;display:flex;align-items:baseline;gap:4px}
.yr-num{font-size:20px;font-weight:700;line-height:1;background:linear-gradient(90deg,#EC4899,#3B82F6);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.yr-lbl{font-size:7px;letter-spacing:0.35em;text-transform:uppercase;opacity:0.5;color:rgba(236,72,153,0.5)}
.specs{position:relative;z-index:20;background:rgba(6,6,6,0.97);border-top:1px solid rgba(255,255,255,0.06);padding:9px 22px 9px 26px}
.spec-row{display:flex;gap:10px}
.spec-item{flex:1;display:flex;flex-direction:column;gap:2px;border-right:1px solid rgba(255,255,255,0.05);padding-right:10px}
.spec-item:last-child{border-right:none;padding-right:0}
.spk{font-size:7px;letter-spacing:0.4em;text-transform:uppercase;color:rgba(255,255,255,0.35)}
.spv{font-size:16px;font-weight:600;letter-spacing:0.03em;color:#fff}
.spv.hi{background:linear-gradient(90deg,#EC4899,#3B82F6,#10B981);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.footer{position:relative;z-index:20;padding:10px 18px 14px 26px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;border-top:1px solid rgba(255,255,255,0.06);background:rgba(4,4,4,0.98)}
.footer-left{}
.footer-center{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 14px;border-left:1px solid rgba(255,255,255,0.06);border-right:1px solid rgba(255,255,255,0.06)}
.footer-right{text-align:right}
.alh-diamond{width:11px;height:11px;transform:rotate(45deg);background:linear-gradient(135deg,rgba(236,72,153,0.8),rgba(59,130,246,0.6),rgba(16,185,129,0.7));box-shadow:0 0 12px rgba(236,72,153,0.4);margin-bottom:4px}
.alh-name{font-size:17px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;background:linear-gradient(90deg,#EC4899,#3B82F6,#10B981);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1}
.alh-tag{font-size:7px;font-weight:400;letter-spacing:0.5em;text-transform:uppercase;opacity:0.7;color:rgba(59,130,246,0.7);margin-top:3px}
.p-lbl{font-size:7px;letter-spacing:0.5em;text-transform:uppercase;opacity:0.35;margin-bottom:3px}
.p-val{font-size:28px;font-weight:700;background:linear-gradient(90deg,#EC4899,#3B82F6,#10B981);-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:0.03em;line-height:1}
.c-lbl{font-size:7px;letter-spacing:0.4em;text-transform:uppercase;opacity:0.3;margin-bottom:2px}
.c-num{font-size:16px;font-weight:600;letter-spacing:0.1em;color:rgba(255,255,255,0.75)}
.c-alh{font-size:7px;letter-spacing:0.35em;text-transform:uppercase;margin-top:2px;color:rgba(236,72,153,0.45)}
</style></head>
<body>
<div class="card">
<div class="bg"></div><div class="opal-overlay"></div>
<div class="opal-ray r1"></div><div class="opal-ray r2"></div>
<div class="side"></div><div class="top"></div>
<div class="hdr">
<div><div class="brand">${companyName || 'Galeri'}</div><div class="brand-sub">${isRealEstate ? 'Emlak' : 'Araç Galerisi'}</div></div>
<div class="badge"><div class="badge-diamond"></div><div><div class="badge-text">AlhazenPDF</div><div class="badge-sub">Premium · PDF</div></div></div>
</div>
<div class="veh">
<div class="type-tag"><div class="type-opal"></div><div class="type-txt">${isRealEstate ? ilanTuru + ' Emlak' : 'Satılık Araç'}</div></div>
<div class="make">${isRealEstate ? (emlakTuru || '—') : marka}</div>
<div class="model">${isRealEstate ? odaSayisi : model}</div>
</div>
<div class="pf">
<div class="ph-bg">${photo ? `<img src="${photo}"/>` : `<span class="ph-txt">ARAÇ FOTOĞRAFI</span>`}</div>
<div class="ph-overlay"></div><div class="ph-floor"></div>
<div class="pc pc-tl"></div><div class="pc pc-tr"></div><div class="pc pc-bl"></div><div class="pc pc-br"></div>
<div class="yr-badge"><span class="yr-num">${yil}</span><span class="yr-lbl">Model</span></div>
</div>
<div class="specs">
<div class="spec-row">
<div class="spec-item"><div class="spk">${isRealEstate ? 'M²' : 'Motor'}</div><div class="spv hi">${isRealEstate ? (m2Brut || '—') : motor}</div></div>
<div class="spec-item"><div class="spk">${isRealEstate ? 'Oda' : 'Şanzıman'}</div><div class="spv">${isRealEstate ? (odaSayisi || '—') : sanziman}</div></div>
<div class="spec-item"><div class="spk">${isRealEstate ? 'Kat' : 'Yakıt'}</div><div class="spv">${isRealEstate ? (katNo || '—') : yakıt}</div></div>
<div class="spec-item"><div class="spk">${isRealEstate ? 'Bina Yaşı' : 'Kilometre'}</div><div class="spv hi">${isRealEstate ? (binaYasi || '—') : km}</div></div>
<div class="spec-item"><div class="spk">${isRealEstate ? 'İlan Türü' : 'Renk'}</div><div class="spv">${isRealEstate ? ilanTuru : renk}</div></div>
</div>
</div>
${buildEkspertizSection(ekspertizData)}
<div class="footer">
<div class="footer-left"><div class="p-lbl">İstenen Fiyat</div><div class="p-val">${fiyat} ₺</div></div>
<div class="footer-center"><div class="alh-diamond"></div><div class="alh-name">AlhazenPDF</div><div class="alh-tag">Premium · Satış Kartı</div></div>
<div class="footer-right"><div class="c-lbl">İletişim</div><div class="c-num">${telefon}</div><div class="c-alh">AlhazenPDF</div></div>
</div>
</div>
</body></html>`;

  return postProcess(html, width, height);
};
/* ═══════════════════════════════════════════════════════════════
   9. VOLKAN / VOLCANIC (Lava Theme)
   ═══════════════════════════════════════════════════════════════ */
export const buildA4VolkanHTML = (data) => {
  const { width, height, marka, model, yil, motor, sanziman, yakıt, km, fiyat, telefon, renk, photo, companyName, ekspertizData, isRealEstate, emlakTuru, ilanTuru, odaSayisi, m2Brut, binaYasi, katNo } = parseVehicleData(data);

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=${width}">
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Bebas+Neue&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0A0500;font-family:'Oswald',sans-serif}
.card{width:${width}px;height:${height}px;background:#0A0500;color:#fff;position:relative;overflow:hidden;display:flex;flex-direction:column}
.bg{position:absolute;inset:0;background:radial-gradient(ellipse 80% 55% at 50% 85%,rgba(180,40,0,0.5) 0%,rgba(100,20,0,0.3) 35%,transparent 60%),radial-gradient(ellipse 60% 45% at 20% 60%,rgba(255,69,0,0.12) 0%,transparent 50%),radial-gradient(ellipse 50% 40% at 80% 40%,rgba(255,140,0,0.08) 0%,transparent 50%),linear-gradient(180deg,#0E0600 0%,#0A0500 50%,#140800 100%);pointer-events:none}
.lava1{position:absolute;left:-10%;right:-10%;bottom:15%;height:2px;background:linear-gradient(90deg,transparent,rgba(255,69,0,0.5) 20%,rgba(255,140,0,0.7) 50%,rgba(255,69,0,0.5) 80%,transparent);transform:rotate(-1.5deg);filter:blur(1px);box-shadow:0 0 10px rgba(255,69,0,0.4),0 0 20px rgba(255,140,0,0.2)}
.lava2{position:absolute;left:-10%;right:-10%;bottom:25%;height:1px;background:linear-gradient(90deg,transparent,rgba(255,69,0,0.3) 30%,rgba(255,140,0,0.4) 50%,rgba(255,69,0,0.3) 70%,transparent);transform:rotate(0.8deg)}
.ash{position:absolute;border-radius:1px;z-index:3}
.a1{top:15%;left:22%;width:2px;height:2px;background:rgba(180,180,180,0.3);transform:rotate(45deg)}
.a2{top:25%;right:30%;width:3px;height:1px;background:rgba(160,160,160,0.25)}
.a3{top:8%;left:55%;width:2px;height:2px;background:rgba(200,200,200,0.2);transform:rotate(30deg)}
.side{position:absolute;left:0;top:0;bottom:0;width:4px;background:linear-gradient(180deg,rgba(138,138,138,0.4) 0%,#FF4500 20%,#FF8C00 45%,#FF4500 70%,rgba(100,30,0,0.6) 90%,transparent 100%);box-shadow:0 0 14px rgba(255,69,0,0.5),0 0 30px rgba(255,140,0,0.2);z-index:10}
.ash-top{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(180,180,180,0.4) 20%,rgba(220,220,220,0.6) 50%,rgba(180,180,180,0.4) 80%,transparent);z-index:10}
.lava-glow{position:absolute;bottom:-40px;left:50%;transform:translateX(-50%);width:300px;height:180px;background:radial-gradient(ellipse,rgba(255,69,0,0.2) 0%,rgba(200,30,0,0.1) 40%,transparent 70%);pointer-events:none}
.hdr{position:relative;z-index:20;padding:14px 18px 12px 26px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,69,0,0.15)}
.brand{font-family:'Oswald',sans-serif;font-size:13px;font-weight:400;letter-spacing:0.35em;color:rgba(255,140,0,0.8);text-transform:uppercase;line-height:1}
.brand-sub{font-size:8px;letter-spacing:0.5em;text-transform:uppercase;margin-top:2px;opacity:0.3;color:rgba(255,140,0,0.3)}
.badge{display:flex;align-items:center;gap:7px;padding:6px 14px 6px 10px;border-radius:2px;background:rgba(255,69,0,0.1);border:1.5px solid rgba(255,69,0,0.35)}
.badge-diamond{width:10px;height:10px;transform:rotate(45deg);background:#FF4500;box-shadow:0 0 12px rgba(255,69,0,0.7)}
.badge-text{font-family:'Bebas Neue',sans-serif;font-size:13px;font-weight:400;letter-spacing:0.2em;text-transform:uppercase;color:#FF8C00;text-shadow:0 0 12px rgba(255,140,0,0.4);line-height:1}
.badge-sub{font-size:7px;letter-spacing:0.45em;text-transform:uppercase;margin-top:2px;opacity:0.7;color:rgba(255,69,0,0.7);line-height:1}
.veh{position:relative;z-index:20;padding:10px 22px 0 26px}
.type-tag{display:flex;align-items:center;gap:8px;margin-bottom:2px}
.type-ember{width:8px;height:8px;border-radius:2px;transform:rotate(45deg);background:radial-gradient(circle at 35% 35%,#FF8C00,#FF4500);box-shadow:0 0 10px rgba(255,69,0,0.7),0 0 20px rgba(255,140,0,0.3)}
.type-txt{font-size:8px;font-weight:700;letter-spacing:0.55em;text-transform:uppercase;color:#FF8C00;text-shadow:0 0 10px rgba(255,140,0,0.4)}
.make{font-family:'Oswald',sans-serif;font-size:88px;font-weight:700;line-height:0.82;letter-spacing:-0.01em;color:#fff;text-shadow:0 0 40px rgba(255,69,0,0.2);text-transform:uppercase}
.model{font-size:38px;font-weight:200;letter-spacing:0.15em;line-height:1;margin-top:3px;color:rgba(255,140,0,0.8);text-transform:uppercase}
.pf{position:relative;flex:1;min-height:0;overflow:hidden;margin:12px 0 0}
.ph-bg{position:absolute;inset:0;background:linear-gradient(160deg,#1A0A00,#140600,#180800);display:flex;align-items:center;justify-content:center}
${photo ? `.ph-bg{background:none}.ph-bg img{width:100%;height:100%;object-fit:cover}` : `.ph-txt{font-size:10px;letter-spacing:0.5em;text-transform:uppercase;color:rgba(255,140,0,0.18)}`}
.ph-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,5,0,0.45) 0%,transparent 22%,transparent 60%,rgba(10,5,0,0.96) 100%);pointer-events:none;z-index:2}
.ph-floor{position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#FF4500 20%,#FF8C00 50%,#FF4500 80%,transparent);box-shadow:0 0 16px rgba(255,69,0,0.5),0 0 32px rgba(255,140,0,0.2);z-index:5}
.pc{position:absolute;width:16px;height:16px;z-index:4}
.pc-tl{top:10px;left:10px;border-top:2px solid rgba(180,180,180,0.25);border-left:2px solid rgba(180,180,180,0.25)}
.pc-tr{top:10px;right:10px;border-top:2px solid rgba(255,140,0,0.4);border-right:2px solid rgba(255,140,0,0.4)}
.pc-bl{bottom:10px;left:10px;border-bottom:2px solid rgba(255,69,0,0.35);border-left:2px solid rgba(255,69,0,0.35)}
.pc-br{bottom:10px;right:10px;border-bottom:2px solid rgba(180,180,180,0.2);border-right:2px solid rgba(180,180,180,0.2)}
.yr-badge{position:absolute;bottom:10px;left:14px;z-index:6;display:flex;align-items:baseline;gap:4px}
.yr-num{font-family:'Bebas Neue',sans-serif;font-size:20px;font-weight:900;line-height:1;color:#FF8C00;text-shadow:0 0 10px rgba(255,140,0,0.5)}
.yr-lbl{font-size:7px;letter-spacing:0.35em;text-transform:uppercase;opacity:0.5;color:rgba(255,140,0,0.5)}
.specs{position:relative;z-index:20;background:rgba(10,5,0,0.93);border-top:1px solid rgba(255,69,0,0.12);border-left:3px solid #FF4500;padding:9px 22px 9px 26px;backdrop-filter:blur(12px)}
.spec-row{display:flex;gap:10px}
.spec-item{flex:1;display:flex;flex-direction:column;gap:2px;border-right:1px solid rgba(255,69,0,0.08);padding-right:10px}
.spec-item:last-child{border-right:none;padding-right:0}
.spk{font-size:7px;letter-spacing:0.42em;text-transform:uppercase;color:rgba(255,140,0,0.3)}
.spv{font-family:'Oswald',sans-serif;font-size:15px;font-weight:500;color:#fff;letter-spacing:0.05em}
.spv.hi{color:#FF8C00;text-shadow:0 0 8px rgba(255,140,0,0.4)}
.footer{position:relative;z-index:20;padding:10px 18px 14px 26px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;border-top:1px solid rgba(255,69,0,0.08);background:rgba(8,4,0,0.98)}
.footer-left{}
.footer-center{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 14px;border-left:1px solid rgba(255,69,0,0.1);border-right:1px solid rgba(255,69,0,0.1)}
.footer-right{text-align:right}
.alh-diamond{width:11px;height:11px;transform:rotate(45deg);background:#FF4500;box-shadow:0 0 12px rgba(255,69,0,0.7);margin-bottom:4px}
.alh-name{font-family:'Bebas Neue',sans-serif;font-size:17px;font-weight:400;letter-spacing:0.2em;text-transform:uppercase;color:#FF8C00;text-shadow:0 0 12px rgba(255,140,0,0.3);line-height:1}
.alh-tag{font-size:7px;font-weight:400;letter-spacing:0.5em;text-transform:uppercase;opacity:0.7;color:rgba(255,69,0,0.7);margin-top:3px}
.p-lbl{font-size:7px;letter-spacing:0.5em;text-transform:uppercase;opacity:0.35;margin-bottom:3px}
.p-val{font-family:'Oswald',sans-serif;font-size:26px;font-weight:600;color:#FF8C00;text-shadow:0 0 16px rgba(255,140,0,0.4);letter-spacing:0.03em;line-height:1}
.c-lbl{font-size:7px;letter-spacing:0.4em;text-transform:uppercase;opacity:0.3;margin-bottom:2px}
.c-num{font-family:'Oswald',sans-serif;font-size:14px;font-weight:300;letter-spacing:0.1em;color:rgba(255,255,255,0.55)}
.c-alh{font-size:7px;letter-spacing:0.35em;text-transform:uppercase;margin-top:2px;color:rgba(255,69,0,0.4)}
</style></head>
<body>
<div class="card">
<div class="bg"></div><div class="lava1"></div><div class="lava2"></div>
<div class="ash a1"></div><div class="ash a2"></div><div class="ash a3"></div>
<div class="side"></div><div class="ash-top"></div><div class="lava-glow"></div>
<div class="hdr">
<div><div class="brand">${companyName || 'Galeri'}</div><div class="brand-sub">${isRealEstate ? 'Emlak' : 'Araç Galerisi'}</div></div>
<div class="badge"><div class="badge-diamond"></div><div><div class="badge-text">AlhazenPDF</div><div class="badge-sub">Premium · PDF</div></div></div>
</div>
<div class="veh">
<div class="type-tag"><div class="type-ember"></div><div class="type-txt">${isRealEstate ? ilanTuru + ' Emlak' : 'Satılık Araç'}</div></div>
<div class="make">${isRealEstate ? (emlakTuru || '—') : marka}</div>
<div class="model">${isRealEstate ? odaSayisi : model}</div>
</div>
<div class="pf">
<div class="ph-bg">${photo ? `<img src="${photo}"/>` : `<span class="ph-txt">ARAÇ FOTOĞRAFI</span>`}</div>
<div class="ph-overlay"></div><div class="ph-floor"></div>
<div class="pc pc-tl"></div><div class="pc pc-tr"></div><div class="pc pc-bl"></div><div class="pc pc-br"></div>
<div class="yr-badge"><span class="yr-num">${yil}</span><span class="yr-lbl">Model</span></div>
</div>
<div class="specs">
<div class="spec-row">
<div class="spec-item"><div class="spk">${isRealEstate ? 'M²' : 'Motor'}</div><div class="spv hi">${isRealEstate ? (m2Brut || '—') : motor}</div></div>
<div class="spec-item"><div class="spk">${isRealEstate ? 'Oda' : 'Şanzıman'}</div><div class="spv">${isRealEstate ? (odaSayisi || '—') : sanziman}</div></div>
<div class="spec-item"><div class="spk">${isRealEstate ? 'Kat' : 'Yakıt'}</div><div class="spv">${isRealEstate ? (katNo || '—') : yakıt}</div></div>
<div class="spec-item"><div class="spk">${isRealEstate ? 'Bina Yaşı' : 'Kilometre'}</div><div class="spv hi">${isRealEstate ? (binaYasi || '—') : km}</div></div>
<div class="spec-item"><div class="spk">${isRealEstate ? 'İlan Türü' : 'Renk'}</div><div class="spv">${isRealEstate ? ilanTuru : renk}</div></div>
</div>
</div>
${buildEkspertizSection(ekspertizData)}
<div class="footer">
<div class="footer-left"><div class="p-lbl">İstenen Fiyat</div><div class="p-val">${fiyat} ₺</div></div>
<div class="footer-center"><div class="alh-diamond"></div><div class="alh-name">AlhazenPDF</div><div class="alh-tag">Premium · Satış Kartı</div></div>
<div class="footer-right"><div class="c-lbl">İletişim</div><div class="c-num">${telefon}</div><div class="c-alh">AlhazenPDF</div></div>
</div>
</div>
</body></html>`;

  return postProcess(html, width, height);
};
/* ═══════════════════════════════════════════════════════════════
   10. TARIHI / HISTORICAL (Historical Parchment Theme)
   ═══════════════════════════════════════════════════════════════ */
export const buildA4TarihiHTML = (data) => {
  const { width, height, marka, model, yil, motor, sanziman, yakıt, km, fiyat, telefon, renk, photo, companyName, ekspertizData, isRealEstate, emlakTuru, ilanTuru, odaSayisi, m2Brut, binaYasi, katNo } = parseVehicleData(data);

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=${width}">
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800&family=IM+Fell+DW+Pica:ital@0;1&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#F2E8D5;font-family:'IM Fell DW Pica',serif}
.card{width:${width}px;height:${height}px;background:#F2E8D5;color:#2A1F14;position:relative;overflow:hidden;display:flex;flex-direction:column}
.bg{position:absolute;inset:0;background:repeating-linear-gradient(180deg,transparent,transparent 27.5px,rgba(139,105,20,0.06) 27.5px,rgba(139,105,20,0.06) 28px),radial-gradient(ellipse 65% 55% at 15% 20%,rgba(139,105,20,0.02),transparent 50%),radial-gradient(ellipse 50% 45% at 85% 70%,rgba(196,64,12,0.015),transparent 45%),linear-gradient(180deg,#F4ECE1 0%,#F2E8D5 35%,#F2E8D5 65%,#EEE3CE 100%);pointer-events:none}
.border-outer{position:absolute;inset:10px;border:2px solid rgba(139,105,20,0.5);z-index:5}
.border-inner{position:absolute;inset:16px;border:1px solid rgba(139,105,20,0.25);z-index:5}
.hc{position:absolute;width:24px;height:24px;z-index:6}
.hc-tl{top:4px;left:4px;background:radial-gradient(ellipse at 30% 30%,rgba(196,64,12,0.25),rgba(139,105,20,0.15));border-top:2px solid rgba(139,105,20,0.65);border-left:2px solid rgba(139,105,20,0.65);border-radius:2px 0 4px 0}
.hc-tr{top:4px;right:4px;background:radial-gradient(ellipse at 70% 30%,rgba(139,105,20,0.2),rgba(196,64,12,0.12));border-top:2px solid rgba(196,64,12,0.55);border-right:2px solid rgba(196,64,12,0.55);border-radius:0 2px 0 4px}
.hc-bl{bottom:4px;left:4px;background:radial-gradient(ellipse at 30% 70%,rgba(139,105,20,0.18),rgba(139,105,20,0.1));border-bottom:2px solid rgba(139,105,20,0.5);border-left:2px solid rgba(139,105,20,0.5);border-radius:0 4px 2px 0}
.hc-br{bottom:4px;right:4px;background:radial-gradient(ellipse at 70% 70%,rgba(196,64,12,0.15),transparent);border-bottom:2px solid rgba(196,64,12,0.45);border-right:2px solid rgba(196,64,12,0.45);border-radius:4px 0 0 2px}
.seal{position:absolute;top:18px;right:22px;z-index:8;width:42px;height:42px;border-radius:50%;background:radial-gradient(circle at 40% 35%,rgba(139,105,20,0.25),rgba(139,105,20,0.08));border:2px solid rgba(139,105,20,0.4);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:4px}
.seal-text{font-family:'Cinzel',serif;font-size:7px;font-weight:700;letter-spacing:0.25em;color:rgba(139,105,20,0.7);text-transform:uppercase;line-height:1.2}
.hdr{position:relative;z-index:20;padding:22px 30px 16px;display:flex;justify-content:space-between;align-items:flex-start}
.brand{font-family:'Cinzel',serif;font-size:14px;font-weight:700;letter-spacing:0.4em;color:#8B6914;text-transform:uppercase;line-height:1}
.brand-sub{font-family:'IM Fell DW Pica',serif;font-style:italic;font-size:8px;letter-spacing:0.5em;text-transform:uppercase;margin-top:3px;color:rgba(139,105,20,0.4);line-height:1}
.badge{display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 16px;border-radius:2px;background:rgba(139,105,20,0.06);border:1.5px solid rgba(139,105,20,0.3)}
.badge-text{font-family:'Cinzel',serif;font-size:14px;font-weight:600;letter-spacing:0.25em;text-transform:uppercase;color:#8B6914;line-height:1}
.badge-sub{font-family:'IM Fell DW Pica',serif;font-style:italic;font-size:7px;letter-spacing:0.5em;text-transform:uppercase;color:rgba(196,64,12,0.5);line-height:1}
.veh{position:relative;z-index:20;padding:4px 30px 12px}
.type-tag{display:inline-flex;align-items:center;gap:8px;margin-bottom:8px;padding:5px 14px;background:rgba(139,105,20,0.08);border:1px solid rgba(139,105,20,0.2);border-radius:2px}
.type-dec{width:8px;height:8px;border-radius:1px;background:linear-gradient(135deg,rgba(139,105,20,0.5),rgba(196,64,12,0.3));box-shadow:inset 1px 1px 2px rgba(255,255,255,0.2),1px 1px 3px rgba(0,0,0,0.1)}
.type-txt{font-family:'IM Fell DW Pica',serif;font-size:8px;font-weight:400;letter-spacing:0.55em;text-transform:uppercase;color:rgba(139,105,20,0.6)}
.make{font-family:'Cinzel',serif;font-size:88px;font-weight:800;line-height:0.88;letter-spacing:0.04em;color:#8B6914;text-shadow:2px 2px 0 rgba(255,255,255,0.3),-1px -1px 0 rgba(139,105,20,0.1);text-transform:uppercase}
.model{font-family:'IM Fell DW Pica',serif;font-size:36px;font-weight:400;letter-spacing:0.2em;line-height:1;margin-top:8px;color:rgba(196,64,12,0.7);text-transform:uppercase}
.pf{position:relative;flex:1;min-height:0;overflow:hidden;margin:12px 26px}
.ph-bg{position:absolute;inset:0;background:linear-gradient(150deg,#E8DCC8,#F0E4D0,#EAE0CE);display:flex;align-items:center;justify-content:center;border:2px solid rgba(139,105,20,0.25)}
${photo ? `.ph-bg{background:none;border:2px solid rgba(139,105,20,0.35)}.ph-bg img{width:100%;height:100%;object-fit:cover}` : `.ph-txt{font-family:'IM Fell DW Pica',serif;font-style:italic;font-size:10px;letter-spacing:0.5em;text-transform:uppercase;color:rgba(139,105,20,0.15)}`}
.ph-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(242,232,213,0.35) 0%,transparent 20%,transparent 75%,rgba(42,31,20,0.12) 100%);pointer-events:none;z-index:2}
.ph-floor{position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(139,105,20,0.3) 20%,rgba(196,64,12,0.35) 50%,rgba(139,105,20,0.3) 80%,transparent);z-index:5}
.pc{position:absolute;width:20px;height:20px;z-index:4}
.pc-tl{top:6px;left:6px;border-top:3px solid rgba(139,105,20,0.35);border-left:3px solid rgba(139,105,20,0.35);border-radius:2px 0 0 0}
.pc-tr{top:6px;right:6px;border-top:3px solid rgba(196,64,12,0.35);border-right:3px solid rgba(196,64,12,0.35);border-radius:0 2px 0 0}
.pc-bl{bottom:6px;left:6px;border-bottom:3px solid rgba(139,105,20,0.35);border-left:3px solid rgba(139,105,20,0.35);border-radius:0 0 0 2px}
.pc-br{bottom:6px;right:6px;border-bottom:3px solid rgba(196,64,12,0.3);border-right:3px solid rgba(196,64,12,0.3);border-radius:0 0 2px 0}
.yr-badge{position:absolute;bottom:8px;left:12px;z-index:6;display:flex;align-items:center;gap:6px;background:rgba(242,232,213,0.95);padding:5px 12px;border:1.5px solid rgba(139,105,20,0.35);border-radius:2px}
.yr-num{font-family:'Cinzel',serif;font-size:22px;font-weight:700;line-height:1;color:#8B6914}
.yr-lbl{font-family:'IM Fell DW Pica',serif;font-size:7px;letter-spacing:0.4em;text-transform:uppercase;color:rgba(139,105,20,0.5)}
.specs{position:relative;z-index:20;background:rgba(242,232,213,0.7);border-top:2px solid rgba(139,105,20,0.25);border-bottom:2px solid rgba(139,105,20,0.2);padding:11px 30px;backdrop-filter:blur(8px)}
.spec-row{display:flex;gap:12px}
.spec-item{flex:1;display:flex;flex-direction:column;gap:3px;border-right:1.5px solid rgba(139,105,20,0.15);padding-right:12px}
.spec-item:last-child{border-right:none;padding-right:0}
.spk{font-family:'IM Fell DW Pica',serif;font-size:7px;letter-spacing:0.45em;text-transform:uppercase;color:rgba(139,105,20,0.45)}
.spv{font-family:'Cinzel',serif;font-size:15px;font-weight:500;color:#2A1F14;letter-spacing:0.05em}
.spv.hi{color:#C4400C;font-weight:600}
.footer{position:relative;z-index:20;padding:14px 30px 18px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;border-top:2px solid rgba(139,105,20,0.2);background:rgba(242,232,213,0.85)}
.footer-left{}
.footer-center{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 18px;border-left:2px solid rgba(139,105,20,0.15);border-right:2px solid rgba(139,105,20,0.15)}
.footer-right{text-align:right}
.alh-dec{width:12px;height:12px;border-radius:2px;background:linear-gradient(135deg,rgba(139,105,20,0.4),rgba(196,64,12,0.25));border:1px solid rgba(139,105,20,0.35);box-shadow:inset 1px 1px 2px rgba(255,255,255,0.15);margin-bottom:4px}
.alh-name{font-family:'Cinzel',serif;font-size:18px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:#8B6914;line-height:1}
.alh-tag{font-family:'IM Fell DW Pica',serif;font-style:italic;font-size:7px;letter-spacing:0.5em;text-transform:uppercase;color:rgba(196,64,12,0.5);margin-top:3px}
.p-lbl{font-family:'IM Fell DW Pica',serif;font-size:7px;letter-spacing:0.5em;text-transform:uppercase;color:rgba(139,105,20,0.4);margin-bottom:3px}
.p-val{font-family:'Cinzel',serif;font-size:26px;font-weight:700;color:#8B6914;letter-spacing:0.03em;line-height:1}
.c-lbl{font-family:'IM Fell DW Pica',serif;font-size:7px;letter-spacing:0.4em;text-transform:uppercase;color:rgba(139,105,20,0.35);margin-bottom:2px}
.c-num{font-family:'Cinzel',serif;font-size:14px;font-weight:400;letter-spacing:0.08em;color:rgba(42,31,20,0.7)}
.c-alh{font-family:'IM Fell DW Pica',serif;font-style:italic;font-size:7px;letter-spacing:0.4em;text-transform:uppercase;margin-top:2px;color:rgba(196,64,12,0.4)}
</style></head>
<body>
<div class="card">
<div class="bg"></div>
<div class="border-outer"></div><div class="border-inner"></div>
<div class="hc hc-tl"></div><div class="hc hc-tr"></div><div class="hc hc-bl"></div><div class="hc hc-br"></div>
<div class="seal"><div class="seal-text">AL<br>HAZ</div></div>
<div class="hdr">
<div><div class="brand">${companyName || 'Galeri'}</div><div class="brand-sub">${isRealEstate ? 'Emlak' : 'Araç Galerisi'}</div></div>
<div class="badge"><div class="badge-text">AlhazenPDF</div><div class="badge-sub">Premium · PDF</div></div>
</div>
<div class="veh">
<div class="type-tag"><div class="type-dec"></div><div class="type-txt">${isRealEstate ? ilanTuru + ' Emlak' : 'Satılık Araç'}</div></div>
<div class="make">${isRealEstate ? (emlakTuru || '—') : marka}</div>
<div class="model">${isRealEstate ? odaSayisi : model}</div>
</div>
<div class="pf">
<div class="ph-bg">${photo ? `<img src="${photo}"/>` : `<span class="ph-txt">ARAÇ FOTOĞRAFI</span>`}</div>
<div class="ph-overlay"></div><div class="ph-floor"></div>
<div class="pc pc-tl"></div><div class="pc pc-tr"></div><div class="pc pc-bl"></div><div class="pc pc-br"></div>
<div class="yr-badge"><span class="yr-num">${yil}</span><span class="yr-lbl">Model</span></div>
</div>
<div class="specs">
<div class="spec-row">
<div class="spec-item"><div class="spk">${isRealEstate ? 'M²' : 'Motor'}</div><div class="spv hi">${isRealEstate ? (m2Brut || '—') : motor}</div></div>
<div class="spec-item"><div class="spk">${isRealEstate ? 'Oda' : 'Şanzıman'}</div><div class="spv">${isRealEstate ? (odaSayisi || '—') : sanziman}</div></div>
<div class="spec-item"><div class="spk">${isRealEstate ? 'Kat' : 'Yakıt'}</div><div class="spv">${isRealEstate ? (katNo || '—') : yakıt}</div></div>
<div class="spec-item"><div class="spk">${isRealEstate ? 'Bina Yaşı' : 'Kilometre'}</div><div class="spv hi">${isRealEstate ? (binaYasi || '—') : km}</div></div>
<div class="spec-item"><div class="spk">${isRealEstate ? 'İlan Türü' : 'Renk'}</div><div class="spv">${isRealEstate ? ilanTuru : renk}</div></div>
</div>
</div>
${buildEkspertizSection(ekspertizData)}
<div class="footer">
<div class="footer-left"><div class="p-lbl">İstenen Fiyat</div><div class="p-val">${fiyat} ₺</div></div>
<div class="footer-center"><div class="alh-dec"></div><div class="alh-name">AlhazenPDF</div><div class="alh-tag">Premium · Satış Kartı</div></div>
<div class="footer-right"><div class="c-lbl">İletişim</div><div class="c-num">${telefon}</div><div class="c-alh">AlhazenPDF</div></div>
</div>
</div>
</body></html>`;

  return postProcess(html, width, height);
};
