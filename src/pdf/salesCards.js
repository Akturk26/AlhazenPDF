/**
 * Premium Sales Cards - Vol.10 Fusion
 * 5 Themes: Mimari · Sakura · Derin · Volkan · Tarihi
 * Each with Story (405×720) and Post (540×540)
 */

const postProcess = (html, width, height) => {
  const pageSize = `${width}px ${height}px`;
  return html
    .replace(/(<(?:style|head)[^>]*>)/i, `$1<style>@page{size:${pageSize};margin:0;}</style>`)
    .replace(/content="width=device-width[^"]*"/g, `content="width=${width}"`)
    .replace(/width\s*:\s*100vw/g, `width: ${width}px`)
    .replace(/height\s*:\s*100vh/g, `height: ${height}px`)
    .replace(/<link[^>]*googleapis\.com[^>]*>/g, '');
};

/* ═══════════════════════════════════════════════════════════════
   🏗 MİMARİ & BETON
   ═══════════════════════════════════════════════════════════════ */
export const buildSalesArchHTML = (data, isStory = true) => {
  const { formData = {}, photos = [], companyName = '' } = data;
  const isRealEstate = data.category?.id === 'real-estate';
  const emlakTuru = formData['Emlak Türü'] || '';
  const ilanTuru = formData['İlan Türü'] || 'Satılık';
  const odaSayisi = formData['Oda Sayısı'] || '';
  const m2Brut = formData['M² (Brüt)'] || formData['M² (Net)'] || '';
  const binaYasi = formData['Bina Yaşı'] || '';
  const katNo = formData['Kat'] || '';
  const width = isStory ? 405 : 540;
  const height = isStory ? 720 : 540;

  const marka = formData['Marka'] || '';
  const model = formData['Model'] || '';
  const yil = formData['Yıl'] || '';
  const km = formData['KM'] || '';
  const motor = formData['Motor'] || '';
  const sanziman = formData['Şanzıman'] || '';
  const yakıt = formData['Yakıt'] || '';
  const fiyat = formData['Fiyat'] || '';
  const telefon = formData['Telefon'] || '';

  const photo = photos[0]?.base64 || '';

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=${width}"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#141414;font-family:Arial,Helvetica,sans-serif}
.card{width:${width}px;height:${height}px;background:#141414;position:relative;overflow:hidden}
.concrete{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 20% 30%,rgba(40,38,36,0.9) 0%,transparent 55%),radial-gradient(ellipse 60% 50% at 80% 70%,rgba(28,26,24,0.8) 0%,transparent 55%),linear-gradient(160deg,#1E1C1A 0%,#141414 50%,#181614 100%)}
.grain{position:absolute;inset:0;background-image:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.012) 3px,rgba(255,255,255,0.012) 4px),repeating-linear-gradient(90deg,transparent,transparent 8px,rgba(255,255,255,0.006) 8px,rgba(255,255,255,0.006) 9px);pointer-events:none}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(212,120,42,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(212,120,42,0.05) 1px,transparent 1px);background-size:54px 54px;pointer-events:none}
.rust{position:absolute;left:0;top:0;bottom:0;width:4px;background:linear-gradient(180deg,transparent,#6B3D1E 10%,#D4782A 30%,#E8892E 50%,#D4782A 70%,#8B4A1A 90%,transparent);box-shadow:0 0 12px rgba(212,120,42,0.35);z-index:10}
.steel-top{position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,#888 20%,#C8C8C8 50%,#888 80%,transparent);z-index:10}
.glass{position:absolute;top:0;right:0;width:120px;height:120px;background:linear-gradient(135deg,rgba(232,244,248,0.06) 0%,rgba(200,230,240,0.04) 40%,transparent 70%);clip-path:polygon(100% 0,100% 100%,0 0)}
.content{position:relative;z-index:20;height:100%;display:flex;flex-direction:column}
.top-bar{padding:${isStory ? '22px 22px 16px 26px' : '22px 22px 14px 26px'};border-bottom:1px solid rgba(255,255,255,0.07);display:flex;justify-content:space-between;align-items:flex-start}
.brand{font-size:16px;letter-spacing:0.25em;color:rgba(255,255,255,0.88);line-height:1;font-weight:700}
.sub{font-size:7.5px;letter-spacing:0.5em;color:rgba(255,255,255,0.28);text-transform:uppercase;margin-top:3px}
.wm{font-size:8px;letter-spacing:0.35em;color:rgba(212,120,42,0.5);text-transform:uppercase;text-align:right}
.hero-area{padding:${isStory ? '18px 22px 0 26px' : '14px 22px 0 26px'}}
.type{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.bolt{width:8px;height:8px;background:#D4782A;clip-path:polygon(50% 0%,100% 38%,82% 100%,18% 100%,0% 38%);box-shadow:0 0 8px rgba(212,120,42,0.5);flex-shrink:0}
.type-txt{font-size:9px;font-weight:700;letter-spacing:0.55em;color:#D4782A;text-transform:uppercase}
.type-line{flex:1;height:1px;background:linear-gradient(90deg,rgba(212,120,42,0.3),transparent)}
.big{font-size:${isStory ? '92px' : '76px'};line-height:0.82;letter-spacing:0.02em;color:#fff;text-shadow:2px 2px 0 rgba(0,0,0,0.5);font-weight:900}
.model{font-size:${isStory ? '18px' : '16px'};font-weight:200;letter-spacing:0.55em;color:rgba(200,200,200,0.35);text-transform:uppercase;margin-top:7px}
.pf{flex:1;margin:${isStory ? '16px 0 0' : '14px -22px 0 -26px'};min-height:0;position:relative;overflow:hidden}
.pi{height:100%;background:linear-gradient(160deg,#1E1C1A,#181614,#1A1816);display:flex;align-items:center;justify-content:center;color:rgba(200,200,200,0.15);font-size:9px;letter-spacing:0.45em;text-transform:uppercase}
.pi img{width:100%;height:100%;object-fit:cover;display:block}
.po{position:absolute;inset:0;background:linear-gradient(90deg,rgba(20,20,20,0.55) 0%,transparent 18%,transparent 82%,rgba(20,20,20,0.35) 100%),linear-gradient(180deg,rgba(20,20,20,0.4) 0%,transparent 22%,transparent 60%,rgba(20,20,20,0.95) 100%);pointer-events:none}
.pfl{position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#888 20%,#D4782A 50%,#888 80%,transparent);box-shadow:0 0 12px rgba(212,120,42,0.35);z-index:5}
.cm{position:absolute;width:14px;height:14px;z-index:6}
.cm-tl{top:8px;left:8px;border-top:2px solid rgba(200,200,200,0.25);border-left:2px solid rgba(200,200,200,0.25)}
.cm-tr{top:8px;right:8px;border-top:2px solid rgba(212,120,42,0.35);border-right:2px solid rgba(212,120,42,0.35)}
.cm-bl{bottom:8px;left:8px;border-bottom:2px solid rgba(212,120,42,0.3);border-left:2px solid rgba(212,120,42,0.3)}
.cm-br{bottom:8px;right:8px;border-bottom:2px solid rgba(200,200,200,0.2);border-right:2px solid rgba(200,200,200,0.2)}
.specs{padding:${isStory ? '12px 22px 20px 26px' : '12px 22px 18px 26px'};background:rgba(14,14,14,0.92);border-top:2px solid rgba(212,120,42,0.15)}
.spec-row{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(255,255,255,0.05);margin-bottom:12px}
.spec-cell{background:#141414;padding:8px 10px;display:flex;flex-direction:column;gap:2px}
.spk{font-size:7px;letter-spacing:0.4em;color:rgba(200,200,200,0.3);text-transform:uppercase}
.spv{font-size:16px;letter-spacing:0.05em;color:#fff;font-weight:700}
.spv.rust{color:#D4782A}
.spv.steel{color:#A0A0A0}
.footer{display:flex;justify-content:space-between;align-items:flex-end;border-top:1px solid rgba(255,255,255,0.07);padding-top:10px}
.plbl{font-size:7.5px;letter-spacing:0.5em;color:rgba(200,200,200,0.28);text-transform:uppercase;margin-bottom:3px}
.pval{font-size:28px;color:#D4782A;text-shadow:0 0 16px rgba(212,120,42,0.35);line-height:1;letter-spacing:0.03em;font-weight:700}
.clbl{font-size:7.5px;letter-spacing:0.4em;color:rgba(200,200,200,0.22);text-transform:uppercase;text-align:right;margin-bottom:2px}
.cnum{font-size:16px;letter-spacing:0.1em;color:rgba(255,255,255,0.55);text-align:right;font-weight:700}
.calh{font-size:7.5px;letter-spacing:0.35em;color:rgba(212,120,42,0.38);text-transform:uppercase;text-align:right;margin-top:2px}
</style></head>
<body>
<div class="card">
<div class="concrete"></div><div class="grain"></div><div class="grid"></div>
<div class="rust"></div><div class="steel-top"></div><div class="glass"></div>
<div class="content">
<div class="top-bar"><div><div class="brand">${companyName || 'Galeri'}</div><div class="sub">${isRealEstate ? 'Emlak' : 'Araç Galerisi'}</div></div><div class="wm">AlhazenPDF</div></div>
<div class="hero-area">
<div class="type"><div class="bolt"></div><div class="type-txt">${isRealEstate ? ilanTuru + ' Emlak' : 'Satılık Araç'}</div><div class="type-line"></div></div>
<div class="big">${isRealEstate ? (emlakTuru || '—') : (marka || '—')}</div>
<div class="model">${isRealEstate ? odaSayisi : (model || '')}</div>
</div>
<div class="pf">
<div class="pi">${photo ? `<img src="${photo}"/>` : 'FOTOĞRAF'}</div>
<div class="po"></div><div class="pfl"></div>
<div class="cm cm-tl"></div><div class="cm cm-tr"></div>
<div class="cm cm-bl"></div><div class="cm cm-br"></div>
</div>
<div class="specs">
<div class="spec-row">
<div class="spec-cell"><div class="spk">${isRealEstate ? 'M²' : 'Motor'}</div><div class="spv">${isRealEstate ? (m2Brut || '—') : (motor || '—')}</div></div>
<div class="spec-cell"><div class="spk">${isRealEstate ? 'Oda' : 'Vites'}</div><div class="spv steel">${isRealEstate ? (odaSayisi || '—') : (sanziman || '—')}</div></div>
<div class="spec-cell"><div class="spk">${isRealEstate ? 'Kat' : 'Yakıt'}</div><div class="spv rust">${isRealEstate ? (katNo || '—') : (yakıt || '—')}</div></div>
<div class="spec-cell"><div class="spk">${isRealEstate ? 'Bina Yaşı' : 'KM'}</div><div class="spv">${isRealEstate ? (binaYasi || '—') : (km ? km + ' km' : '—')}</div></div>
</div>
<div class="footer">
<div><div class="plbl">Fiyat</div><div class="pval">${fiyat || '—'}</div></div>
<div><div class="clbl">İletişim</div><div class="cnum">${telefon || '—'}</div><div class="calh">${companyName || 'Galeri'}</div></div>
</div>
</div>
</div>
</div>
</body></html>`;

  return postProcess(html, width, height);
};

/* ═══════════════════════════════════════════════════════════════
   🌸 SAKURA
   ═══════════════════════════════════════════════════════════════ */
export const buildSalesSakuraHTML = (data, isStory = true) => {
  const { formData = {}, photos = [], companyName = '' } = data;
  const isRealEstate = data.category?.id === 'real-estate';
  const emlakTuru = formData['Emlak Türü'] || '';
  const ilanTuru = formData['İlan Türü'] || 'Satılık';
  const odaSayisi = formData['Oda Sayısı'] || '';
  const width = isStory ? 405 : 540;
  const height = isStory ? 720 : 540;

  const marka = formData['Marka'] || '';
  const model = formData['Model'] || '';
  const yil = formData['Yıl'] || '';
  const km = formData['KM'] || '';
  const motor = formData['Motor'] || '';
  const sanziman = formData['Şanzıman'] || '';
  const yakıt = formData['Yakıt'] || '';
  const fiyat = formData['Fiyat'] || '';
  const telefon = formData['Telefon'] || '';

  const photo = photos[0]?.base64 || '';

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=${width}"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#100A0D;font-family:Georgia,serif}
.card{width:${width}px;height:${height}px;background:#100A0D;position:relative;overflow:hidden;color:#fff}
.bg{position:absolute;inset:0;background:radial-gradient(ellipse 80% 55% at 50% 25%,rgba(40,15,25,0.9) 0%,transparent 60%),radial-gradient(ellipse 60% 45% at 10% 70%,rgba(249,168,196,0.06) 0%,transparent 55%),radial-gradient(ellipse 50% 40% at 90% 50%,rgba(251,191,36,0.04) 0%,transparent 50%),linear-gradient(180deg,#160D10 0%,#100A0D 60%,#140B0F 100%)}
.petal{position:absolute;border-radius:50% 50% 50% 0;z-index:2}
.p1{top:8%;left:15%;width:8px;height:8px;background:rgba(249,168,196,0.5);transform:rotate(-45deg)}
.p2{top:18%;right:22%;width:6px;height:6px;background:rgba(252,207,219,0.4);transform:rotate(20deg)}
.p3{top:28%;left:60%;width:10px;height:10px;background:rgba(249,168,196,0.35);transform:rotate(-30deg)}
.p4{top:12%;left:40%;width:5px;height:5px;background:rgba(255,230,240,0.45);transform:rotate(60deg)}
.p5{top:35%;right:10%;width:7px;height:7px;background:rgba(249,168,196,0.3);transform:rotate(-15deg)}
.ink-bar{position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(180deg,transparent,#F9A8C4 20%,rgba(249,168,196,0.5) 60%,#F9A8C4 85%,transparent);box-shadow:0 0 10px rgba(249,168,196,0.35);z-index:10}
.gold-top{position:absolute;top:0;left:0;right:0;height:1.5px;background:linear-gradient(90deg,transparent,#FBBF24 25%,#FDE68A 50%,#FBBF24 75%,transparent);box-shadow:0 0 8px rgba(251,191,36,0.35);z-index:10}
.content{position:relative;z-index:20;height:100%;display:flex;flex-direction:column;padding:22px 22px 20px 26px}
.hdr{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:14px;border-bottom:1px solid rgba(249,168,196,0.1)}
.brand{font-size:13px;font-weight:400;letter-spacing:0.15em;color:rgba(255,255,255,0.82);line-height:1}
.brand-sub{font-size:7.5px;letter-spacing:0.5em;color:rgba(249,168,196,0.3);text-transform:uppercase;margin-top:3px}
.wm{font-size:8px;letter-spacing:0.35em;color:rgba(251,191,36,0.4);text-transform:uppercase;text-align:right}
.type{margin-top:16px;display:flex;align-items:center;gap:10px}
.bloom{width:10px;height:10px;border-radius:50%;background:radial-gradient(circle at 35% 35%,rgba(255,240,245,0.9),rgba(249,168,196,0.8));box-shadow:0 0 10px rgba(249,168,196,0.5);flex-shrink:0}
.type-txt{font-size:8.5px;font-weight:600;letter-spacing:0.55em;color:rgba(249,168,196,0.85);text-transform:uppercase;text-shadow:0 0 10px rgba(249,168,196,0.3)}
.type-line{flex:1;height:1px;background:linear-gradient(90deg,rgba(249,168,196,0.25),transparent)}
.big{font-size:${isStory ? '82px' : '68px'};font-weight:200;line-height:0.84;letter-spacing:0.03em;color:#fff;text-shadow:0 0 40px rgba(249,168,196,0.12);margin-top:8px}
.model{font-size:${isStory ? '18px' : '14px'};font-weight:200;letter-spacing:0.55em;color:rgba(249,168,196,0.28);text-transform:uppercase;margin-top:8px}
.pf{flex:1;min-height:0;margin:18px -22px 0 -26px;position:relative;overflow:hidden}
.pi{height:100%;background:linear-gradient(160deg,#1C0E14,#160A10,#1A0E12);display:flex;align-items:center;justify-content:center;color:rgba(249,168,196,0.15);font-size:9px;letter-spacing:0.45em;text-transform:uppercase;font-family:Arial}
.pi img{width:100%;height:100%;object-fit:cover;display:block}
.po{position:absolute;inset:0;background:linear-gradient(90deg,rgba(16,10,13,0.55) 0%,transparent 18%,transparent 82%,rgba(16,10,13,0.35) 100%),linear-gradient(180deg,rgba(16,10,13,0.45) 0%,transparent 22%,transparent 60%,rgba(16,10,13,0.95) 100%);pointer-events:none}
.pfl{position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(249,168,196,0.6) 20%,rgba(255,240,245,0.8) 50%,rgba(249,168,196,0.6) 80%,transparent);box-shadow:0 0 14px rgba(249,168,196,0.35),0 0 6px rgba(251,191,36,0.2);z-index:5}
.cm{position:absolute;width:14px;height:14px;z-index:6}
.cm-tl{top:8px;left:8px;border-top:1px solid rgba(251,191,36,0.4);border-left:1px solid rgba(251,191,36,0.4)}
.cm-tr{top:8px;right:8px;border-top:1px solid rgba(249,168,196,0.35);border-right:1px solid rgba(249,168,196,0.35)}
.cm-bl{bottom:8px;left:8px;border-bottom:1px solid rgba(249,168,196,0.3);border-left:1px solid rgba(249,168,196,0.3)}
.cm-br{bottom:8px;right:8px;border-bottom:1px solid rgba(251,191,36,0.35);border-right:1px solid rgba(251,191,36,0.35)}
.footer{margin-top:auto;padding-top:12px;border-top:1px solid rgba(249,168,196,0.1);display:flex;justify-content:space-between;align-items:flex-end}
.plbl{font-size:8px;color:rgba(249,168,196,0.3);margin-bottom:2px;font-family:Arial}
.pval{font-size:24px;font-weight:700;color:#F9A8C4;line-height:1}
.clbl{font-size:8px;color:rgba(249,168,196,0.28);text-align:right;margin-bottom:2px;font-family:Arial}
.cnum{font-size:14px;font-weight:600;color:rgba(255,255,255,0.65);text-align:right}
.calh{font-size:7.5px;color:rgba(251,191,36,0.4);text-align:right;margin-top:2px;font-family:Arial}
</style></head>
<body>
<div class="card">
<div class="bg"></div><div class="petal p1"></div><div class="petal p2"></div><div class="petal p3"></div><div class="petal p4"></div><div class="petal p5"></div>
<div class="ink-bar"></div><div class="gold-top"></div>
<div class="content">
<div class="hdr"><div><div class="brand">${companyName || 'Galeri'}</div><div class="brand-sub">${isRealEstate ? 'Emlak' : 'Araç Galerisi'}</div></div><div class="wm">AlhazenPDF</div></div>
<div class="type"><div class="bloom"></div><div class="type-txt">${isRealEstate ? ilanTuru + ' Emlak' : 'Satılık Araç'}</div><div class="type-line"></div></div>
<div class="big">${isRealEstate ? (emlakTuru || '—') : (marka || '—')}</div>
<div class="model">${isRealEstate ? odaSayisi : (model || '')}</div>
<div class="pf">
<div class="pi">${photo ? `<img src="${photo}"/>` : 'FOTOĞRAF'}</div>
<div class="po"></div><div class="pfl"></div>
<div class="cm cm-tl"></div><div class="cm cm-tr"></div>
<div class="cm cm-bl"></div><div class="cm cm-br"></div>
</div>
<div class="footer">
<div><div class="plbl">Fiyat</div><div class="pval">${fiyat || '—'}</div></div>
<div><div class="clbl">İletişim</div><div class="cnum">${telefon || '—'}</div><div class="calh">${companyName || 'Galeri'}</div></div>
</div>
</div>
</div>
</body></html>`;

  return postProcess(html, width, height);
};

/* ═══════════════════════════════════════════════════════════════
   🌊 DERİN DENİZ
   ═══════════════════════════════════════════════════════════════ */
export const buildSalesDeepHTML = (data, isStory = true) => {
  const { formData = {}, photos = [], companyName = '' } = data;
  const isRealEstate = data.category?.id === 'real-estate';
  const emlakTuru = formData['Emlak Türü'] || '';
  const ilanTuru = formData['İlan Türü'] || 'Satılık';
  const odaSayisi = formData['Oda Sayısı'] || '';
  const width = isStory ? 405 : 540;
  const height = isStory ? 720 : 540;

  const marka = formData['Marka'] || '';
  const model = formData['Model'] || '';
  const yil = formData['Yıl'] || '';
  const km = formData['KM'] || '';
  const motor = formData['Motor'] || '';
  const sanziman = formData['Şanzıman'] || '';
  const yakıt = formData['Yakıt'] || '';
  const fiyat = formData['Fiyat'] || '';
  const telefon = formData['Telefon'] || '';

  const photo = photos[0]?.base64 || '';

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=${width}"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#04111A;font-family:Arial,Helvetica,sans-serif}
.card{width:${width}px;height:${height}px;background:#04111A;position:relative;overflow:hidden;color:#fff}
.bg{position:absolute;inset:0;background:radial-gradient(ellipse 85% 60% at 50% 20%,rgba(10,50,80,0.7) 0%,transparent 60%),radial-gradient(ellipse 70% 50% at 15% 75%,rgba(30,70,100,0.4) 0%,transparent 55%),radial-gradient(ellipse 65% 45% at 85% 65%,rgba(77,168,218,0.12) 0%,transparent 50%),linear-gradient(180deg,#0A1820 0%,#04111A 55%,#071420 100%)}
.wave{position:absolute;height:40px;width:100%;background:transparent;opacity:0.15;z-index:2}
.w1{top:20%;left:0;border-radius:50%;background:radial-gradient(ellipse 180% 40% at 50% 50%,rgba(77,168,218,0.6) 0%,transparent 70%)}
.w2{top:35%;left:10%;border-radius:50%;background:radial-gradient(ellipse 160% 35% at 50% 50%,rgba(120,200,235,0.4) 0%,transparent 65%)}
.w3{top:50%;right:5%;border-radius:50%;background:radial-gradient(ellipse 140% 30% at 50% 50%,rgba(192,216,232,0.35) 0%,transparent 70%)}
.depth-bar{position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(180deg,transparent,#4DA8DA 15%,#78C8EB 40%,#4DA8DA 70%,rgba(77,168,218,0.5) 85%,transparent);box-shadow:0 0 16px rgba(77,168,218,0.5);z-index:10}
.silver-top{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(192,216,232,0.4) 20%,#C0D8E8 50%,rgba(192,216,232,0.4) 80%,transparent);box-shadow:0 0 10px rgba(192,216,232,0.3);z-index:10}
.content{position:relative;z-index:20;height:100%;display:flex;flex-direction:column;padding:22px 22px 20px 26px}
.hdr{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:14px;border-bottom:1px solid rgba(77,168,218,0.15)}
.brand{font-size:14px;font-weight:700;letter-spacing:0.18em;color:rgba(255,255,255,0.9);line-height:1}
.brand-sub{font-size:7.5px;letter-spacing:0.5em;color:rgba(77,168,218,0.35);text-transform:uppercase;margin-top:3px}
.wm{font-size:8px;letter-spacing:0.35em;color:rgba(192,216,232,0.4);text-transform:uppercase;text-align:right}
.type{margin-top:16px;display:flex;align-items:center;gap:10px}
.ripple{width:10px;height:10px;border-radius:50%;background:radial-gradient(circle at 40% 40%,rgba(192,216,232,0.9),rgba(120,200,235,0.6),transparent 60%);box-shadow:0 0 12px rgba(77,168,218,0.5);flex-shrink:0}
.type-txt{font-size:9px;font-weight:700;letter-spacing:0.5em;color:rgba(77,168,218,0.9);text-transform:uppercase;text-shadow:0 0 8px rgba(77,168,218,0.2)}
.type-line{flex:1;height:1px;background:linear-gradient(90deg,rgba(77,168,218,0.3),transparent)}
.big{font-size:${isStory ? '88px' : '72px'};font-weight:900;line-height:0.82;letter-spacing:0.02em;color:#fff;text-shadow:0 0 35px rgba(77,168,218,0.15),2px 2px 0 rgba(0,0,0,0.5);margin-top:8px}
.model{font-size:${isStory ? '18px' : '14px'};font-weight:300;letter-spacing:0.5em;color:rgba(120,200,235,0.32);text-transform:uppercase;margin-top:8px}
.pf{flex:1;min-height:0;margin:${isStory ? '16px -22px 0 -26px' : '14px -22px 0 -26px'};position:relative;overflow:hidden}
.pi{height:100%;background:linear-gradient(160deg,#0E2830,#0A1C25,#0C2028);display:flex;align-items:center;justify-content:center;color:rgba(77,168,218,0.15);font-size:9px;letter-spacing:0.45em;text-transform:uppercase}
.pi img{width:100%;height:100%;object-fit:cover;display:block}
.po{position:absolute;inset:0;background:linear-gradient(90deg,rgba(4,17,26,0.55) 0%,transparent 18%,transparent 82%,rgba(4,17,26,0.35) 100%),linear-gradient(180deg,rgba(4,17,26,0.45) 0%,transparent 22%,transparent 58%,rgba(4,17,26,0.95) 100%);pointer-events:none}
.pfl{position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(77,168,218,0.6) 20%,#4DA8DA 50%,rgba(77,168,218,0.6) 80%,transparent);box-shadow:0 0 14px rgba(77,168,218,0.45);z-index:5}
.cm{position:absolute;width:16px;height:16px;z-index:6;border-radius:3px}
.cm-tl{top:8px;left:8px;border-top:2px solid rgba(192,216,232,0.35);border-left:2px solid rgba(192,216,232,0.35)}
.cm-tr{top:8px;right:8px;border-top:2px solid rgba(77,168,218,0.4);border-right:2px solid rgba(77,168,218,0.4)}
.cm-bl{bottom:8px;left:8px;border-bottom:2px solid rgba(77,168,218,0.35);border-left:2px solid rgba(77,168,218,0.35)}
.cm-br{bottom:8px;right:8px;border-bottom:2px solid rgba(192,216,232,0.3);border-right:2px solid rgba(192,216,232,0.3)}
.footer{margin-top:auto;padding-top:12px;border-top:1px solid rgba(77,168,218,0.12);display:flex;justify-content:space-between;align-items:flex-end}
.plbl{font-size:8px;color:rgba(77,168,218,0.35);margin-bottom:2px;letter-spacing:0.3em}
.pval{font-size:26px;font-weight:700;color:#4DA8DA;line-height:1;text-shadow:0 0 16px rgba(77,168,218,0.35)}
.clbl{font-size:8px;color:rgba(77,168,218,0.3);text-align:right;margin-bottom:2px;letter-spacing:0.3em}
.cnum{font-size:15px;font-weight:700;color:rgba(255,255,255,0.65);text-align:right}
.calh{font-size:7.5px;color:rgba(192,216,232,0.38);text-align:right;margin-top:2px}
</style></head>
<body>
<div class="card">
<div class="bg"></div><div class="wave w1"></div><div class="wave w2"></div><div class="wave w3"></div>
<div class="depth-bar"></div><div class="silver-top"></div>
<div class="content">
<div class="hdr"><div><div class="brand">${companyName || 'Galeri'}</div><div class="brand-sub">${isRealEstate ? 'Emlak' : 'Araç Galerisi'}</div></div><div class="wm">AlhazenPDF</div></div>
<div class="type"><div class="ripple"></div><div class="type-txt">${isRealEstate ? ilanTuru + ' Emlak' : 'Satılık Araç'}</div><div class="type-line"></div></div>
<div class="big">${isRealEstate ? (emlakTuru || '—') : (marka || '—')}</div>
<div class="model">${isRealEstate ? odaSayisi : (model || '')}</div>
<div class="pf">
<div class="pi">${photo ? `<img src="${photo}"/>` : 'FOTOĞRAF'}</div>
<div class="po"></div><div class="pfl"></div>
<div class="cm cm-tl"></div><div class="cm cm-tr"></div>
<div class="cm cm-bl"></div><div class="cm cm-br"></div>
</div>
<div class="footer">
<div><div class="plbl">Fiyat</div><div class="pval">${fiyat || '—'}</div></div>
<div><div class="clbl">İletişim</div><div class="cnum">${telefon || '—'}</div><div class="calh">${companyName || 'Galeri'}</div></div>
</div>
</div>
</div>
</body></html>`;

  return postProcess(html, width, height);
};

/* ═══════════════════════════════════════════════════════════════
   🌋 VOLKAN
   ═══════════════════════════════════════════════════════════════ */
export const buildSalesVolcanoHTML = (data, isStory = true) => {
  const { formData = {}, photos = [], companyName = '' } = data;
  const isRealEstate = data.category?.id === 'real-estate';
  const emlakTuru = formData['Emlak Türü'] || '';
  const ilanTuru = formData['İlan Türü'] || 'Satılık';
  const odaSayisi = formData['Oda Sayısı'] || '';
  const width = isStory ? 405 : 540;
  const height = isStory ? 720 : 540;

  const marka = formData['Marka'] || '';
  const model = formData['Model'] || '';
  const yil = formData['Yıl'] || '';
  const km = formData['KM'] || '';
  const motor = formData['Motor'] || '';
  const sanziman = formData['Şanzıman'] || '';
  const yakıt = formData['Yakıt'] || '';
  const fiyat = formData['Fiyat'] || '';
  const telefon = formData['Telefon'] || '';

  const photo = photos[0]?.base64 || '';

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=${width}"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0A0000;font-family:Arial,Helvetica,sans-serif}
.card{width:${width}px;height:${height}px;background:#0A0000;position:relative;overflow:hidden;color:#fff}
.bg{position:absolute;inset:0;background:radial-gradient(ellipse 80% 65% at 50% 40%,rgba(90,20,0,0.7) 0%,transparent 60%),radial-gradient(ellipse 60% 50% at 20% 80%,rgba(200,50,0,0.3) 0%,transparent 55%),radial-gradient(ellipse 55% 45% at 85% 25%,rgba(255,140,0,0.12) 0%,transparent 50%),linear-gradient(160deg,#1A0A00 0%,#0A0000 55%,#140300 100%)}
.lava{position:absolute;width:100%;height:60px;background:transparent;z-index:2}
.l1{top:15%;border-radius:50%;background:radial-gradient(ellipse 200% 50% at 50% 50%,rgba(255,69,0,0.45) 0%,rgba(255,140,0,0.15) 50%,transparent 75%)}
.l2{top:32%;left:10%;border-radius:50%;background:radial-gradient(ellipse 180% 45% at 50% 50%,rgba(255,100,0,0.35) 0%,rgba(255,69,0,0.1) 50%,transparent 70%)}
.l3{top:48%;right:8%;border-radius:50%;background:radial-gradient(ellipse 160% 42% at 50% 50%,rgba(255,140,0,0.3) 0%,rgba(255,100,0,0.08) 50%,transparent 70%)}
.ember-bar{position:absolute;left:0;top:0;bottom:0;width:4px;background:linear-gradient(180deg,transparent,rgba(255,69,0,0.6) 10%,#FF4500 30%,rgba(255,100,0,0.8) 50%,#FF4500 70%,rgba(255,69,0,0.5) 90%,transparent);box-shadow:0 0 18px rgba(255,69,0,0.6);z-index:10}
.ash-top{position:absolute;top:0;left:0;right:0;height:2.5px;background:linear-gradient(90deg,transparent,rgba(80,80,80,0.5) 15%,rgba(120,120,120,0.7) 50%,rgba(80,80,80,0.5) 85%,transparent);z-index:10}
.content{position:relative;z-index:20;height:100%;display:flex;flex-direction:column;padding:22px 22px 20px 26px}
.hdr{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:14px;border-bottom:1px solid rgba(255,69,0,0.15)}
.brand{font-size:15px;font-weight:900;letter-spacing:0.2em;color:rgba(255,255,255,0.92);line-height:1;text-transform:uppercase}
.brand-sub{font-size:7.5px;letter-spacing:0.5em;color:rgba(255,69,0,0.4);text-transform:uppercase;margin-top:3px}
.wm{font-size:8px;letter-spacing:0.35em;color:rgba(255,140,0,0.45);text-transform:uppercase;text-align:right}
.type{margin-top:16px;display:flex;align-items:center;gap:10px}
.ember{width:8px;height:8px;background:#FF4500;clip-path:polygon(50% 0%,100% 38%,82% 100%,18% 100%,0% 38%);box-shadow:0 0 14px rgba(255,69,0,0.7);flex-shrink:0}
.type-txt{font-size:9px;font-weight:900;letter-spacing:0.5em;color:rgba(255,69,0,0.95);text-transform:uppercase;text-shadow:0 0 10px rgba(255,69,0,0.3)}
.type-line{flex:1;height:1px;background:linear-gradient(90deg,rgba(255,69,0,0.35),transparent)}
.big{font-size:${isStory ? '90px' : '74px'};font-weight:900;line-height:0.8;letter-spacing:0.02em;color:#fff;text-shadow:0 0 30px rgba(255,69,0,0.2),2px 2px 0 rgba(0,0,0,1);margin-top:8px}
.model{font-size:${isStory ? '18px' : '15px'};font-weight:400;letter-spacing:0.5em;color:rgba(255,100,0,0.35);text-transform:uppercase;margin-top:8px}
.pf{flex:1;min-height:0;margin:${isStory ? '16px -22px 0 -26px' : '14px -22px 0 -26px'};position:relative;overflow:hidden}
.pi{height:100%;background:linear-gradient(160deg,#2A0A00,#1A0500,#220800);display:flex;align-items:center;justify-content:center;color:rgba(255,69,0,0.15);font-size:9px;letter-spacing:0.45em;text-transform:uppercase}
.pi img{width:100%;height:100%;object-fit:cover;display:block}
.po{position:absolute;inset:0;background:linear-gradient(90deg,rgba(10,0,0,0.6) 0%,transparent 18%,transparent 82%,rgba(10,0,0,0.4) 100%),linear-gradient(180deg,rgba(10,0,0,0.5) 0%,transparent 22%,transparent 58%,rgba(10,0,0,0.98) 100%);pointer-events:none}
.pfl{position:absolute;bottom:0;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,rgba(255,69,0,0.7) 20%,#FF4500 50%,rgba(255,69,0,0.7) 80%,transparent);box-shadow:0 0 18px rgba(255,69,0,0.5);z-index:5}
.cm{position:absolute;width:14px;height:14px;z-index:6}
.cm-tl{top:8px;left:8px;border-top:2px solid rgba(120,120,120,0.4);border-left:2px solid rgba(120,120,120,0.4)}
.cm-tr{top:8px;right:8px;border-top:2px solid rgba(255,69,0,0.5);border-right:2px solid rgba(255,69,0,0.5)}
.cm-bl{bottom:8px;left:8px;border-bottom:2px solid rgba(255,69,0,0.45);border-left:2px solid rgba(255,69,0,0.45)}
.cm-br{bottom:8px;right:8px;border-bottom:2px solid rgba(120,120,120,0.35);border-right:2px solid rgba(120,120,120,0.35)}
.footer{margin-top:auto;padding-top:12px;border-top:1px solid rgba(255,69,0,0.15);display:flex;justify-content:space-between;align-items:flex-end}
.plbl{font-size:8px;color:rgba(255,69,0,0.4);margin-bottom:2px;letter-spacing:0.35em;text-transform:uppercase}
.pval{font-size:28px;font-weight:900;color:#FF4500;line-height:1;text-shadow:0 0 18px rgba(255,69,0,0.4)}
.clbl{font-size:8px;color:rgba(255,69,0,0.35);text-align:right;margin-bottom:2px;letter-spacing:0.3em;text-transform:uppercase}
.cnum{font-size:16px;font-weight:700;color:rgba(255,255,255,0.7);text-align:right}
.calh{font-size:7.5px;color:rgba(255,140,0,0.4);text-align:right;margin-top:2px}
</style></head>
<body>
<div class="card">
<div class="bg"></div><div class="lava l1"></div><div class="lava l2"></div><div class="lava l3"></div>
<div class="ember-bar"></div><div class="ash-top"></div>
<div class="content">
<div class="hdr"><div><div class="brand">${companyName || 'Galeri'}</div><div class="brand-sub">${isRealEstate ? 'Emlak' : 'Araç Galerisi'}</div></div><div class="wm">AlhazenPDF</div></div>
<div class="type"><div class="ember"></div><div class="type-txt">${isRealEstate ? ilanTuru + ' Emlak' : 'Satılık Araç'}</div><div class="type-line"></div></div>
<div class="big">${isRealEstate ? (emlakTuru || '—') : (marka || '—')}</div>
<div class="model">${isRealEstate ? odaSayisi : (model || '')}</div>
<div class="pf">
<div class="pi">${photo ? `<img src="${photo}"/>` : 'FOTOĞRAF'}</div>
<div class="po"></div><div class="pfl"></div>
<div class="cm cm-tl"></div><div class="cm cm-tr"></div>
<div class="cm cm-bl"></div><div class="cm cm-br"></div>
</div>
<div class="footer">
<div><div class="plbl">Fiyat</div><div class="pval">${fiyat || '—'}</div></div>
<div><div class="clbl">İletişim</div><div class="cnum">${telefon || '—'}</div><div class="calh">${companyName || 'Galeri'}</div></div>
</div>
</div>
</div>
</body></html>`;

  return postProcess(html, width, height);
};

/* ═══════════════════════════════════════════════════════════════
   🏛 TARİHİ
   ═══════════════════════════════════════════════════════════════ */
export const buildSalesHistHTML = (data, isStory = true) => {
  const { formData = {}, photos = [], companyName = '' } = data;
  const isRealEstate = data.category?.id === 'real-estate';
  const emlakTuru = formData['Emlak Türü'] || '';
  const ilanTuru = formData['İlan Türü'] || 'Satılık';
  const odaSayisi = formData['Oda Sayısı'] || '';
  const width = isStory ? 405 : 540;
  const height = isStory ? 720 : 540;

  const marka = formData['Marka'] || '';
  const model = formData['Model'] || '';
  const yil = formData['Yıl'] || '';
  const km = formData['KM'] || '';
  const motor = formData['Motor'] || '';
  const sanziman = formData['Şanzıman'] || '';
  const yakıt = formData['Yakıt'] || '';
  const fiyat = formData['Fiyat'] || '';
  const telefon = formData['Telefon'] || '';

  const photo = photos[0]?.base64 || '';

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=${width}"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#F2E8D5;font-family:Georgia,serif}
.card{width:${width}px;height:${height}px;background:#F2E8D5;position:relative;overflow:hidden;color:#2A1F10}
.papyrus{position:absolute;inset:0;background:radial-gradient(ellipse 75% 55% at 25% 30%,rgba(245,235,220,0.8) 0%,transparent 60%),radial-gradient(ellipse 65% 50% at 80% 70%,rgba(238,220,200,0.6) 0%,transparent 55%),linear-gradient(165deg,#F5EBE0 0%,#F2E8D5 50%,#E8DCC8 100%);background-size:100% 100%;background-attachment:fixed}
.grain{position:absolute;inset:0;background-image:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(42,31,16,0.018) 2px,rgba(42,31,16,0.018) 3px),repeating-linear-gradient(90deg,transparent,transparent 5px,rgba(42,31,16,0.012) 5px,rgba(42,31,16,0.012) 6px);pointer-events:none}
.bronze-line{position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(180deg,transparent,rgba(139,105,20,0.5) 15%,#8B6914 40%,rgba(180,140,40,0.8) 55%,#8B6914 75%,rgba(139,105,20,0.4) 92%,transparent);box-shadow:inset 0 0 6px rgba(0,0,0,0.3),0 0 10px rgba(139,105,20,0.25);z-index:10}
.antik-top{position:absolute;top:0;left:0;right:0;height:8px;background:linear-gradient(90deg,transparent 5%,rgba(139,105,20,0.2) 10%,rgba(139,105,20,0.35) 25%,rgba(139,105,20,0.5) 50%,rgba(139,105,20,0.35) 75%,rgba(139,105,20,0.2) 90%,transparent 95%);border-bottom:1px solid rgba(139,105,20,0.3);z-index:10}
.antik-btm{position:absolute;bottom:0;left:0;right:0;height:8px;background:linear-gradient(90deg,transparent 5%,rgba(139,105,20,0.2) 10%,rgba(139,105,20,0.35) 25%,rgba(139,105,20,0.5) 50%,rgba(139,105,20,0.35) 75%,rgba(139,105,20,0.2) 90%,transparent 95%);border-top:1px solid rgba(139,105,20,0.3);z-index:10}
.seal{position:absolute;width:40px;height:40px;border-radius:50%;background:radial-gradient(circle at 35% 35%,rgba(180,140,40,0.5),rgba(139,105,20,0.7));border:2px solid rgba(139,105,20,0.6);display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:bold;color:rgba(139,105,20,0.8);z-index:5;top:12px;right:12px}
.content{position:relative;z-index:20;height:100%;display:flex;flex-direction:column;padding:26px 24px 24px 28px}
.hdr{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:14px;border-bottom:2px double rgba(139,105,20,0.25)}
.brand{font-size:14px;font-weight:bold;letter-spacing:0.18em;color:#2A1F10;line-height:1}
.brand-sub{font-size:7.5px;letter-spacing:0.5em;color:rgba(139,105,20,0.6);text-transform:uppercase;margin-top:3px}
.wm{font-size:8px;letter-spacing:0.35em;color:rgba(139,105,20,0.45);text-transform:uppercase;text-align:right}
.type{margin-top:${isStory ? '16px' : '14px'};display:flex;align-items:center;gap:10px}
.laur{width:12px;height:12px;border:2px solid rgba(139,105,20,0.6);border-radius:50%;background:radial-gradient(circle at 40% 40%,rgba(180,140,40,0.3),transparent 70%);flex-shrink:0}
.type-txt{font-size:9px;font-weight:600;letter-spacing:0.5em;color:rgba(139,105,20,0.85);text-transform:uppercase}
.type-line{flex:1;height:1px;background:linear-gradient(90deg,rgba(139,105,20,0.25),transparent)}
.big{font-size:${isStory ? '78px' : '64px'};font-weight:bold;line-height:0.85;letter-spacing:0.03em;color:#2A1F10;text-shadow:1px 1px 0 rgba(139,105,20,0.08);margin-top:8px}
.model{font-size:${isStory ? '18px' : '14px'};font-weight:400;letter-spacing:0.5em;color:rgba(139,105,20,0.5);text-transform:uppercase;margin-top:8px}
.pf{flex:1;min-height:0;margin:${isStory ? '16px -24px 0 -28px' : '14px -24px 0 -28px'};position:relative;overflow:hidden;border:3px solid rgba(139,105,20,0.2);background:#F5EBE0}
.pi{height:100%;display:flex;align-items:center;justify-content:center;color:rgba(139,105,20,0.2);font-size:9px;letter-spacing:0.45em;text-transform:uppercase}
.pi img{width:100%;height:100%;object-fit:cover;display:block}
.po{position:absolute;inset:0;background:linear-gradient(90deg,rgba(242,232,213,0.45) 0%,transparent 18%,transparent 82%,rgba(242,232,213,0.3) 100%),linear-gradient(180deg,rgba(242,232,213,0.35) 0%,transparent 20%,transparent 60%,rgba(42,31,16,0.25) 100%);pointer-events:none}
.cm{position:absolute;width:12px;height:12px;border:1px solid rgba(139,105,20,0.3);background:rgba(245,235,224,0.6);z-index:6}
.cm-tl{top:4px;left:4px}
.cm-tr{top:4px;right:4px}
.cm-bl{bottom:4px;left:4px}
.cm-br{bottom:4px;right:4px}
.yazit{margin-top:auto;padding-top:14px;border-top:2px double rgba(139,105,20,0.25);background:linear-gradient(180deg,transparent,rgba(245,235,224,0.4) 30%,transparent)}
.plbl{font-size:8px;color:rgba(139,105,20,0.55);margin-bottom:3px;letter-spacing:0.35em;text-transform:uppercase}
.pval{font-size:24px;font-weight:bold;color:#8B6914;line-height:1}
.clbl{font-size:8px;color:rgba(139,105,20,0.5);text-align:right;margin-bottom:3px;letter-spacing:0.3em;text-transform:uppercase}
.cnum{font-size:15px;font-weight:600;color:#2A1F10;text-align:right}
.calh{font-size:7.5px;color:rgba(139,105,20,0.45);text-align:right;margin-top:2px}
.footer{display:flex;justify-content:space-between;align-items:flex-end}
</style></head>
<body>
<div class="card">
<div class="papyrus"></div><div class="grain"></div>
<div class="bronze-line"></div><div class="antik-top"></div><div class="antik-btm"></div>
<div class="seal">𐤀</div>
<div class="content">
<div class="hdr"><div><div class="brand">${companyName || 'Galeri'}</div><div class="brand-sub">${isRealEstate ? 'Emlak' : 'Araç Galerisi'}</div></div><div class="wm">AlhazenPDF</div></div>
<div class="type"><div class="laur"></div><div class="type-txt">${isRealEstate ? ilanTuru + ' Emlak' : 'Satılık Araç'}</div><div class="type-line"></div></div>
<div class="big">${isRealEstate ? (emlakTuru || '—') : (marka || '—')}</div>
<div class="model">${isRealEstate ? odaSayisi : (model || '')}</div>
<div class="pf">
<div class="pi">${photo ? `<img src="${photo}"/>` : 'FOTOĞRAF'}</div>
<div class="po"></div>
<div class="cm cm-tl"></div><div class="cm cm-tr"></div>
<div class="cm cm-bl"></div><div class="cm cm-br"></div>
</div>
<div class="yazit">
<div class="footer">
<div><div class="plbl">Fiyat</div><div class="pval">${fiyat || '—'}</div></div>
<div><div class="clbl">İletişim</div><div class="cnum">${telefon || '—'}</div><div class="calh">${companyName || 'Galeri'}</div></div>
</div>
</div>
</div>
</div>
</body></html>`;

  return postProcess(html, width, height);
};
