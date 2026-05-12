/**
 * Real Estate Special Format PDF Builders
 * Cam Sticker (A5) · İlan Kartı (A4) · Vitrin Afişi (A3)
 * Social Media Cards: Dark Gold · Green White · Story (9:16)
 */

const typeColor = (ilanTuru) => {
  const t = (ilanTuru || '').toLowerCase();
  if (t.includes('kiralık') || t.includes('kiralik')) return { bg: '#E05555', text: 'KİRALIK' };
  if (t.includes('satılık') || t.includes('satilik')) return { bg: '#3DBA7C', text: 'SATILIK' };
  return { bg: '#4F6EF7', text: (ilanTuru || 'İLAN').toUpperCase() };
};

const pageSize = (width, height) => {
  if (width === 559 && height === 794) return 'A5';
  if (width === 794 && height === 1123) return 'A4';
  if (width === 1587 && height === 1123) return 'A3 landscape';
  return `${width}px ${height}px`;
};

const postProcess = (html, width, height) =>
  html
    .replace(/(<(?:style|head)[^>]*>)/i, `$1<style>@page{size:${pageSize(width, height)};margin:0;}</style>`)
    .replace(/content="width=device-width[^"]*"/g, `content="width=${width}"`)
    .replace(/width\s*:\s*100vw/g, `width: ${width}px`)
    .replace(/height\s*:\s*100vh/g, `height: ${height}px`)
    .replace(/<link[^>]*googleapis\.com[^>]*>/g, '');

/* ─────────────────────────────────────────────
   AlhazenPDF marka şeridi (paylaşılan yardımcı)
   ───────────────────────────────────────────── */
const azBrand = () => `<div style="background:linear-gradient(180deg,#07091C 0%,#0D1330 55%,#060A18 100%);border-top:1px solid rgba(201,168,76,0.22);display:flex;align-items:center;justify-content:center;gap:10px;padding:9px 16px;position:relative;overflow:hidden;flex-shrink:0;"><div style="position:absolute;top:0;left:50%;transform:translateX(-50%);width:280px;height:1px;background:linear-gradient(90deg,transparent,#C9A84C 28%,#F0D060 50%,#C9A84C 72%,transparent);opacity:0.55;"></div><svg width="12" height="12" viewBox="0 0 12 12" fill="none" opacity="0.6" style="flex-shrink:0;position:relative;z-index:2;"><line x1="6" y1="0" x2="6" y2="12" stroke="#C9A84C" stroke-width="1"/><line x1="0" y1="6" x2="12" y2="6" stroke="#C9A84C" stroke-width="1"/><line x1="1.5" y1="1.5" x2="10.5" y2="10.5" stroke="#C9A84C" stroke-width="0.5" opacity="0.5"/><line x1="10.5" y1="1.5" x2="1.5" y2="10.5" stroke="#C9A84C" stroke-width="0.5" opacity="0.5"/></svg><svg style="flex-shrink:0;position:relative;z-index:2;filter:drop-shadow(0 0 6px rgba(201,168,76,0.38)) drop-shadow(0 0 10px rgba(58,110,245,0.2));" width="36" height="36" viewBox="0 0 48 48" fill="none"><polygon points="24,2 43.5,13 43.5,35 24,46 4.5,35 4.5,13" stroke="#C9A84C" stroke-width="1.5" fill="none" opacity="0.88"/><polygon points="24,7.5 38,16 38,32 24,40.5 10,32 10,16" stroke="#4F8EF7" stroke-width="2" fill="rgba(58,110,245,0.07)"/><text x="24" y="30.5" text-anchor="middle" font-family="Arial Black,Impact,sans-serif" font-weight="900" font-size="17" fill="rgba(255,255,255,0.93)">A</text><line x1="15" y1="33.5" x2="33" y2="33.5" stroke="#F0D060" stroke-width="1.5" stroke-linecap="round" opacity="0.75"/><circle cx="24" cy="3.8" r="2" fill="#F0D060" opacity="0.88"/></svg><div style="display:flex;flex-direction:column;gap:2px;position:relative;z-index:2;"><div style="font-family:'Bebas Neue',Impact,sans-serif;font-size:17px;color:#fff;letter-spacing:0.16em;line-height:1;display:flex;align-items:center;gap:7px;">ALHAZEN <span style="background:linear-gradient(135deg,#E04020 0%,#B02800 100%);color:#fff;font-size:9px;font-weight:800;letter-spacing:0.1em;padding:2px 7px 1px;border-radius:3px;display:inline-block;line-height:1.5;">PDF</span></div><div style="font-size:8.5px;color:rgba(255,255,255,0.36);letter-spacing:0.14em;text-transform:uppercase;">Bu ilan AlhazenPDF ile hazırlandı</div></div><svg width="12" height="12" viewBox="0 0 12 12" fill="none" opacity="0.5" style="flex-shrink:0;position:relative;z-index:2;"><line x1="6" y1="0" x2="6" y2="12" stroke="#4F8EF7" stroke-width="1"/><line x1="0" y1="6" x2="12" y2="6" stroke="#4F8EF7" stroke-width="1"/><line x1="1.5" y1="1.5" x2="10.5" y2="10.5" stroke="#4F8EF7" stroke-width="0.5" opacity="0.5"/><line x1="10.5" y1="1.5" x2="1.5" y2="10.5" stroke="#4F8EF7" stroke-width="0.5" opacity="0.5"/></svg></div>`;

/* ─────────────────────────────────────────────
   A5 CAM STICKER  (559 × 794 px)
   ───────────────────────────────────────────── */
export const buildCamStickerHTML = (data) => {
  const { formData = {}, photos = [], companyName = '' } = data;
  const ilanTuru  = formData['İlan Türü']  || '';
  const fiyat     = formData['Fiyat']      || '';
  const oda       = formData['Oda Sayısı'] || '';
  const sqm       = formData['M² (Net)']   || formData['M² (Brüt)'] || '';
  const adres     = formData['Adres']      || '';
  const telefon   = formData['Telefon']    || '';
  const emlakTipi = formData['Emlak Tipi'] || '';
  const binaYasi  = formData['Bina Yaşı']  || '';
  const kat       = formData['Kat']        || '';
  const isitma    = formData['Isıtma']     || '';
  const { text: badgeText } = typeColor(ilanTuru);

  const R = '#D62828'; const G = '#E8A020'; const BK = '#0F0F0F'; const OW = '#F7F4EF';

  const bigTitle = (emlakTipi || companyName || 'EMLAK').toUpperCase().split(' ');
  const tL1 = bigTitle.slice(0, 2).join(' ');
  const tL2 = bigTitle.slice(2).join(' ');

  const specRow = (svg, lbl, val) => !val ? '' : `<div style="display:flex;align-items:center;gap:12px;"><div style="width:36px;height:36px;background:${R};border-radius:4px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${svg}</div><div><div style="font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#999;font-weight:600;line-height:1;margin-bottom:2px;">${lbl}</div><div style="font-family:'Barlow Condensed',Arial Narrow,sans-serif;font-size:20px;font-weight:800;color:${BK};line-height:1;">${val}</div></div></div>`;
  const infoLine = (lbl, val) => !val ? '' : `<div style="display:flex;align-items:center;gap:12px;padding:9px 0;border-bottom:1px solid rgba(0,0,0,0.07);"><div style="width:6px;height:6px;background:${R};border-radius:50%;flex-shrink:0;"></div><div style="font-family:'Barlow Condensed',Arial Narrow,sans-serif;font-size:16px;font-weight:600;color:${BK};">${lbl}: <span style="font-weight:400;color:#999;font-size:14px;">${val}</span></div></div>`;

  const iHome  = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
  const iGrid  = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 3v18"/></svg>`;
  const iCal   = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
  const iFire  = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 2C6 2 2 7 2 12s4 10 10 10 10-4.5 10-10S18 2 12 2z"/><path d="M12 6v6l4 2"/></svg>`;
  const iPin   = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
  const iPhone = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013 11 19.79 19.79 0 01.1 2.38 2 2 0 012.08.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.18 7.9a16 16 0 006.29 6.29l1.29-1.29a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>`;

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=559">
<style>@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700;800;900&display=swap');</style></head>
<body style="margin:0;padding:0;background:#fff;font-family:Arial,sans-serif;">
<div style="width:559px;height:794px;background:#fff;display:flex;flex-direction:column;overflow:hidden;">

  <div style="background:${R};padding:28px 36px 24px;flex-shrink:0;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
      <div style="background:#fff;color:${R};font-family:'Bebas Neue',Impact,sans-serif;font-size:20px;letter-spacing:0.18em;padding:5px 18px 4px;border-radius:2px;">${badgeText}</div>
      <div style="font-family:'Barlow Condensed',Arial Narrow,sans-serif;font-size:11px;letter-spacing:0.18em;color:rgba(255,255,255,0.55);text-transform:uppercase;">${companyName || ''}</div>
    </div>
    <div style="font-family:'Bebas Neue',Impact,sans-serif;font-size:60px;line-height:0.87;color:#fff;letter-spacing:0.01em;">${tL1}${tL2 ? '<br>' + tL2 : ''}</div>
    <div style="font-family:'Barlow Condensed',Arial Narrow,sans-serif;font-size:14px;color:rgba(255,255,255,0.65);letter-spacing:0.12em;text-transform:uppercase;margin-top:8px;">${emlakTipi ? 'Ticari · ' + emlakTipi : 'Emlak İlanı'}</div>
  </div>

  <div style="background:${BK};padding:20px 36px;flex-shrink:0;display:flex;align-items:center;justify-content:space-between;gap:12px;">
    <div>
      <div style="font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-bottom:2px;">Satış Fiyatı</div>
      <div style="font-family:'Bebas Neue',Impact,sans-serif;font-size:52px;color:${G};line-height:1;letter-spacing:0.02em;">${fiyat || '—'}</div>
    </div>
    ${(oda || sqm) ? `<div style="background:${R};color:#fff;font-family:'Barlow Condensed',Arial Narrow,sans-serif;font-weight:700;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;padding:8px 16px;border-radius:2px;text-align:center;">${oda ? oda + ' Oda' : ''}${oda && sqm ? '<br>' : ''}${sqm ? sqm + ' m²' : ''}</div>` : ''}
  </div>

  <div style="flex-shrink:0;background:${OW};border-top:3px solid ${R};padding:16px 36px;display:grid;grid-template-columns:1fr 1fr;gap:14px 20px;">
    ${specRow(iHome, 'Oda', oda)}
    ${specRow(iGrid, 'Alan', sqm ? sqm + ' m²' : '')}
    ${specRow(iCal,  'Bina Yaşı', binaYasi ? binaYasi + ' yıl' : '')}
    ${specRow(iFire, 'Isıtma', isitma)}
  </div>

  <div style="flex:1;background:#fff;padding:12px 36px;display:flex;flex-direction:column;justify-content:center;">
    ${infoLine('Kat', kat)}
    ${infoLine('Emlak Tipi', emlakTipi)}
    ${infoLine('İlan Türü', ilanTuru)}
  </div>

  <div style="background:${R};flex-shrink:0;">
    ${adres ? `<div style="padding:13px 36px;display:flex;align-items:center;gap:10px;border-bottom:1px solid rgba(255,255,255,0.15);">${iPin}<span style="font-family:'Barlow Condensed',Arial Narrow,sans-serif;font-size:15px;font-weight:600;color:rgba(255,255,255,0.9);letter-spacing:0.04em;">${adres}</span></div>` : ''}
    <div style="padding:13px 36px;display:flex;align-items:center;justify-content:space-between;">
      <div style="font-family:'Bebas Neue',Impact,sans-serif;font-size:38px;color:#fff;letter-spacing:0.1em;line-height:1;display:flex;align-items:center;gap:10px;">${iPhone}${telefon || '—'}</div>
      <div style="font-family:'Barlow Condensed',Arial Narrow,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.5);text-align:right;">${companyName || ''}</div>
    </div>
  </div>

  ${azBrand()}
</div>
</body></html>`;

  return postProcess(html, 559, 794);
};

/* ─────────────────────────────────────────────
   A4 İLAN KARTI  (794 × 1123 px)
   ───────────────────────────────────────────── */
export const buildIlanKartiHTML = (data) => {
  const { formData = {}, photos = [], companyName = '' } = data;
  const ilanTuru  = formData['İlan Türü']   || '';
  const fiyat     = formData['Fiyat']       || '';
  const oda       = formData['Oda Sayısı']  || '';
  const sqm       = formData['M² (Net)']    || formData['M² (Brüt)'] || '';
  const adres     = formData['Adres']       || '';
  const telefon   = formData['Telefon']     || '';
  const emlakTipi = formData['Emlak Tipi']  || '';
  const binaYasi  = formData['Bina Yaşı']   || '';
  const kat       = formData['Kat']         || '';
  const isitma    = formData['Isıtma']      || '';
  const photo     = photos[0]?.base64 || '';
  const { text: badgeText } = typeColor(ilanTuru);

  const R = '#D62828'; const G = '#E8A020'; const BK = '#0F0F0F'; const OW = '#F7F4EF';

  const bigTitle = (emlakTipi || companyName || 'EMLAK').toUpperCase().split(' ');
  const tL1 = bigTitle.slice(0, 2).join(' ');
  const tL2 = bigTitle.slice(2).join(' ');

  const specCell = (lbl, val) => !val ? '' : `<div style="flex:1;padding:0 18px 0 0;border-right:1px solid rgba(0,0,0,0.1);margin-right:18px;"><div style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#888;font-weight:600;margin-bottom:4px;">${lbl}</div><div style="font-family:'Barlow Condensed',Arial Narrow,sans-serif;font-size:24px;font-weight:800;color:${BK};line-height:1;">${val}</div></div>`;

  const iPin   = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
  const iPhone = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013 11 19.79 19.79 0 01.1 2.38 2 2 0 012.08.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.18 7.9a16 16 0 006.29 6.29l1.29-1.29a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>`;

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=794">
<style>@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700;800;900&display=swap');</style></head>
<body style="margin:0;padding:0;background:#fff;font-family:Arial,sans-serif;">
<div style="width:794px;height:1123px;background:#fff;display:flex;flex-direction:column;overflow:hidden;">

  <div style="background:${R};width:100%;padding:40px 52px 36px;position:relative;z-index:2;flex-shrink:0;">
    <div style="display:inline-block;background:#fff;color:${R};font-family:'Bebas Neue',Impact,sans-serif;font-size:22px;letter-spacing:0.15em;padding:6px 20px 4px;border-radius:2px;margin-bottom:16px;">${badgeText}</div>
    <div style="font-family:'Bebas Neue',Impact,sans-serif;font-size:80px;line-height:0.88;color:#fff;letter-spacing:0.01em;">${tL1}${tL2 ? '<br>' + tL2 : ''}</div>
    <div style="font-family:'Barlow Condensed',Arial Narrow,sans-serif;font-size:20px;color:rgba(255,255,255,0.75);letter-spacing:0.08em;margin-top:10px;text-transform:uppercase;">${emlakTipi ? 'Ticari · ' + emlakTipi : adres || 'Emlak İlanı'}</div>
  </div>

  <div style="width:100%;height:48px;background:${R};position:relative;flex-shrink:0;z-index:1;"><div style="position:absolute;bottom:0;left:0;right:0;height:48px;background:${OW};clip-path:polygon(0 100%,100% 0%,100% 100%);"></div></div>

  <div style="flex:1;background:#D4D0C8;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;">
    ${photo ? `<img src="${photo}" style="width:100%;height:100%;object-fit:cover;display:block;">` : `<div style="width:100%;height:100%;background:linear-gradient(135deg,#b0aba0,#8a8680);display:flex;align-items:center;justify-content:center;font-size:80px;">🏠</div>`}
  </div>

  <div style="background:${BK};padding:20px 52px;display:flex;align-items:flex-end;flex-shrink:0;z-index:2;">
    <div>
      <div style="font-family:'Barlow Condensed',Arial Narrow,sans-serif;font-size:14px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.5);">Satış Fiyatı</div>
      <div style="display:flex;align-items:flex-end;"><span style="font-family:'Barlow Condensed',Arial Narrow,sans-serif;font-size:28px;font-weight:700;color:${G};opacity:0.7;margin-bottom:8px;margin-right:6px;">₺</span><span style="font-family:'Bebas Neue',Impact,sans-serif;font-size:64px;line-height:1;color:${G};letter-spacing:0.02em;">${fiyat || '—'}</span></div>
    </div>
  </div>

  <div style="background:${OW};padding:20px 52px;display:flex;gap:0;flex-shrink:0;border-top:3px solid ${R};">
    ${specCell('Oda', oda)}
    ${specCell('Alan', sqm ? sqm + ' m²' : '')}
    ${specCell('Bina Yaşı', binaYasi ? binaYasi + ' yıl' : '')}
    ${specCell('Isıtma', isitma)}
    ${specCell('Kat', kat)}
  </div>

  <div style="background:${R};padding:20px 52px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
    <div style="font-family:'Barlow Condensed',Arial Narrow,sans-serif;font-size:18px;font-weight:600;color:rgba(255,255,255,0.9);letter-spacing:0.04em;display:flex;align-items:center;gap:8px;">${iPin}${adres || ''}</div>
    <div style="font-family:'Bebas Neue',Impact,sans-serif;font-size:36px;color:#fff;letter-spacing:0.08em;display:flex;align-items:center;gap:10px;">${iPhone}${telefon || companyName || ''}</div>
  </div>

  ${azBrand()}
</div>
</body></html>`;

  return postProcess(html, 794, 1123);
};

/* ─────────────────────────────────────────────
   A3 VİTRİN AFİŞİ  (1587 × 1123 px — landscape)
   ───────────────────────────────────────────── */
export const buildVitrinHTML = (data) => {
  const { formData = {}, photos = [], companyName = '' } = data;
  const ilanTuru  = formData['İlan Türü']  || '';
  const fiyat     = formData['Fiyat']      || '';
  const oda       = formData['Oda Sayısı'] || '';
  const sqm       = formData['M² (Net)']   || formData['M² (Brüt)'] || '';
  const adres     = formData['Adres']      || '';
  const telefon   = formData['Telefon']    || '';
  const emlakTipi = formData['Emlak Tipi'] || '';
  const binaYasi  = formData['Bina Yaşı']  || '';
  const isitma    = formData['Isıtma']     || '';
  const { text: badgeText } = typeColor(ilanTuru);

  const R = '#D62828'; const G = '#E8A020'; const BK = '#0F0F0F';

  const bigTitle = (emlakTipi || companyName || 'EMLAK').toUpperCase().split(' ');

  const specCard = (lbl, val) => !val ? '' : `<div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:3px;padding:16px 18px;"><div style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-bottom:4px;font-weight:600;">${lbl}</div><div style="font-family:'Barlow Condensed',Arial Narrow,sans-serif;font-size:28px;font-weight:800;color:#fff;line-height:1;">${val}</div></div>`;

  const iPin   = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8A020" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
  const iPhone = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013 11 19.79 19.79 0 01.1 2.38 2 2 0 012.08.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.18 7.9a16 16 0 006.29 6.29l1.29-1.29a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>`;

  const brandStrip = `<div style="position:absolute;bottom:0;left:0;right:0;z-index:30;background:linear-gradient(180deg,#07091C 0%,#0D1330 55%,#060A18 100%);border-top:1px solid rgba(201,168,76,0.22);display:flex;align-items:center;justify-content:center;gap:10px;padding:9px 16px;overflow:hidden;"><div style="position:absolute;top:0;left:50%;transform:translateX(-50%);width:340px;height:1px;background:linear-gradient(90deg,transparent,#C9A84C 28%,#F0D060 50%,#C9A84C 72%,transparent);opacity:0.55;"></div><svg width="12" height="12" viewBox="0 0 12 12" fill="none" opacity="0.6" style="flex-shrink:0;position:relative;z-index:2;"><line x1="6" y1="0" x2="6" y2="12" stroke="#C9A84C" stroke-width="1"/><line x1="0" y1="6" x2="12" y2="6" stroke="#C9A84C" stroke-width="1"/></svg><svg style="flex-shrink:0;position:relative;z-index:2;" width="34" height="34" viewBox="0 0 48 48" fill="none"><polygon points="24,2 43.5,13 43.5,35 24,46 4.5,35 4.5,13" stroke="#C9A84C" stroke-width="1.5" fill="none" opacity="0.88"/><polygon points="24,7.5 38,16 38,32 24,40.5 10,32 10,16" stroke="#4F8EF7" stroke-width="2" fill="rgba(58,110,245,0.07)"/><text x="24" y="30.5" text-anchor="middle" font-family="Arial Black,Impact,sans-serif" font-weight="900" font-size="17" fill="rgba(255,255,255,0.93)">A</text><line x1="15" y1="33.5" x2="33" y2="33.5" stroke="#F0D060" stroke-width="1.5" stroke-linecap="round" opacity="0.75"/><circle cx="24" cy="3.8" r="2" fill="#F0D060" opacity="0.88"/></svg><div style="display:flex;flex-direction:column;gap:2px;position:relative;z-index:2;"><div style="font-family:'Bebas Neue',Impact,sans-serif;font-size:17px;color:#fff;letter-spacing:0.16em;line-height:1;display:flex;align-items:center;gap:7px;">ALHAZEN <span style="background:linear-gradient(135deg,#E04020 0%,#B02800 100%);color:#fff;font-size:9px;font-weight:800;letter-spacing:0.1em;padding:2px 7px 1px;border-radius:3px;line-height:1.5;">PDF</span></div><div style="font-size:8.5px;color:rgba(255,255,255,0.36);letter-spacing:0.14em;text-transform:uppercase;">Bu ilan AlhazenPDF ile hazırlandı</div></div><svg width="12" height="12" viewBox="0 0 12 12" fill="none" opacity="0.5" style="flex-shrink:0;position:relative;z-index:2;"><line x1="6" y1="0" x2="6" y2="12" stroke="#4F8EF7" stroke-width="1"/><line x1="0" y1="6" x2="12" y2="6" stroke="#4F8EF7" stroke-width="1"/></svg></div>`;

  const pageHTML = (photos.length ? photos : [null]).map((photo) => `
<div style="width:1587px;height:1123px;background:#fff;display:flex;flex-direction:row;overflow:hidden;position:relative;page-break-after:always;break-after:page;">

  <div style="width:560px;flex-shrink:0;background:${BK};display:flex;flex-direction:column;position:relative;z-index:2;overflow:hidden;">
    <div style="position:absolute;left:0;top:0;bottom:0;width:12px;background:${R};z-index:4;"></div>
    <div style="position:absolute;top:0;right:-48px;bottom:0;width:96px;background:${BK};clip-path:polygon(0 0,50% 0,50% 100%,0 100%);z-index:3;"></div>
    <div style="padding:48px 64px 48px 48px;display:flex;flex-direction:column;height:100%;position:relative;z-index:2;box-sizing:border-box;">
      <div style="display:inline-block;background:${R};color:#fff;font-family:'Bebas Neue',Impact,sans-serif;font-size:20px;letter-spacing:0.2em;padding:7px 22px 5px;border-radius:2px;margin-bottom:24px;align-self:flex-start;">${badgeText}</div>
      <div style="font-family:'Bebas Neue',Impact,sans-serif;font-size:88px;line-height:0.85;color:#fff;letter-spacing:0.01em;margin-bottom:8px;">${bigTitle[0] || ''}${bigTitle[1] ? '<br>' + bigTitle[1] : ''}${bigTitle[2] ? '<br>' + bigTitle.slice(2).join(' ') : ''}</div>
      <div style="font-family:'Barlow Condensed',Arial Narrow,sans-serif;font-size:18px;color:rgba(255,255,255,0.45);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:28px;">${emlakTipi ? 'Ticari · ' + emlakTipi : 'Emlak İlanı'}</div>
      <div style="background:${R};padding:22px 26px;border-radius:3px;margin-bottom:24px;position:relative;overflow:hidden;">
        <div style="position:absolute;top:-20px;right:-20px;width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,0.08);"></div>
        <div style="font-family:'Barlow Condensed',Arial Narrow,sans-serif;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:rgba(255,255,255,0.6);margin-bottom:4px;">Satış Fiyatı</div>
        <div style="font-family:'Bebas Neue',Impact,sans-serif;font-size:64px;line-height:1;color:#fff;letter-spacing:0.02em;"><span style="font-size:28px;opacity:0.7;margin-right:4px;">₺</span>${fiyat || '—'}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:24px;">
        ${specCard('Oda Sayısı', oda)}
        ${specCard('Toplam Alan', sqm ? sqm + ' m²' : '')}
        ${specCard('Bina Yaşı', binaYasi ? binaYasi + ' yıl' : '')}
        ${specCard('Isıtma', isitma)}
      </div>
      ${adres ? `<div style="display:flex;align-items:flex-start;gap:12px;padding:14px 0;border-top:1px solid rgba(255,255,255,0.1);border-bottom:1px solid rgba(255,255,255,0.1);margin-bottom:20px;">${iPin}<div style="font-family:'Barlow Condensed',Arial Narrow,sans-serif;font-size:19px;font-weight:600;color:rgba(255,255,255,0.8);line-height:1.3;">${adres}</div></div>` : '<div style="flex:1;"></div>'}
      <div style="display:flex;align-items:center;gap:14px;margin-top:auto;">
        <div style="width:52px;height:52px;background:${R};border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${iPhone}</div>
        <div style="font-family:'Bebas Neue',Impact,sans-serif;font-size:42px;color:#fff;letter-spacing:0.08em;line-height:1;">${telefon || companyName || '—'}</div>
      </div>
    </div>
  </div>

  <div style="flex:1;background:#B0ACA4;position:relative;overflow:hidden;">
    ${photo?.base64 ? `<img src="${photo.base64}" style="width:100%;height:100%;object-fit:cover;display:block;">` : `<div style="width:100%;height:100%;background:linear-gradient(135deg,#a8a4a0,#606060);display:flex;align-items:center;justify-content:center;font-size:100px;">🏠</div>`}
    <div style="position:absolute;top:40px;left:-10px;background:${R};color:#fff;font-family:'Bebas Neue',Impact,sans-serif;font-size:24px;letter-spacing:0.2em;padding:10px 40px 8px 20px;clip-path:polygon(0 0,100% 0,92% 100%,0 100%);z-index:5;">${badgeText}</div>
    ${fiyat ? `<div style="position:absolute;bottom:46px;right:0;background:rgba(0,0,0,0.75);padding:18px 32px;z-index:5;"><div style="font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:rgba(255,255,255,0.5);margin-bottom:2px;">Satış Fiyatı</div><div style="font-family:'Bebas Neue',Impact,sans-serif;font-size:50px;color:${G};line-height:1;">${fiyat}</div></div>` : ''}
  </div>

  ${brandStrip}
</div>`).join('\n');

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=1587">
<style>@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700;800;900&display=swap');</style></head>
<body style="margin:0;padding:0;background:#fff;font-family:Arial,sans-serif;">
${pageHTML}
</body></html>`;

  return postProcess(html, 1587, 1123);
};

/* ─────────────────────────────────────────────
   SOSYAL MEDYA · KOYU ALTIN  (600 × 600 px)
   Instagram / Facebook kare
   ───────────────────────────────────────────── */
export const buildSocialDarkHTML = (data) => {
  const { formData = {}, photos = [], companyName = '', category } = data;
  const isAuto = category?.id === 'auto';

  // Real estate fields
  const ilanTuru  = formData['İlan Türü']  || '';
  const fiyat     = formData['Fiyat']      || '';
  const adres     = formData['Adres']      || '';
  const oda       = formData['Oda Sayısı'] || '';
  const sqm       = formData['M² (Net)']   || formData['M² (Brüt)'] || '';
  const kat       = formData['Kat']        || '';
  const isitma    = formData['Isıtma']     || '';

  // Auto fields
  const marka     = formData['Marka']      || '';
  const model     = formData['Model']      || '';
  const yil       = formData['Yıl']        || '';
  const km        = formData['KM']         || '';
  const motor     = formData['Motor']      || '';

  const photo = photos[0]?.base64 || '';
  const { bg } = typeColor(ilanTuru);

  const titleLine  = isAuto
    ? `${marka}${model ? ' ' + model : ''}`
    : `${oda ? oda + ' ' : ''}${ilanTuru || 'Emlak'}`;
  const subLine    = isAuto ? (yil ? yil + (km ? ' · ' + km + ' km' : '') : '') : adres;
  const typeBadge  = isAuto ? 'SATILIK ARAÇ' : (ilanTuru || 'EMLAK').toUpperCase();
  const badgeColor = isAuto ? '#E05555' : bg;

  const specItem = (label, val) => val
    ? `<div style="margin-right:18px;">
        <div style="font-size:7px;letter-spacing:3px;color:#666;text-transform:uppercase;margin-bottom:3px;">${label}</div>
        <div style="font-family:Georgia,serif;font-size:15px;color:#F5F0E8;">${val}</div>
       </div>`
    : '';

  const specs = isAuto
    ? [specItem('Motor', motor), specItem('Yıl', yil), specItem('KM', km ? km + ' km' : '')]
    : [specItem('Oda', oda), specItem('Alan', sqm ? sqm + ' m²' : ''), specItem('Kat', kat), specItem('Isıtma', isitma)];

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=600"></head>
<body style="margin:0;padding:0;background:#0A0A0A;">
<div style="width:600px;height:600px;background:#0A0A0A;position:relative;overflow:hidden;font-family:Arial,Helvetica,sans-serif;">

  <!-- Inner border -->
  <div style="position:absolute;inset:8px;border:1px solid rgba(201,168,76,0.2);pointer-events:none;z-index:10;"></div>
  <!-- Gold corners -->
  <div style="position:absolute;top:14px;left:14px;width:16px;height:16px;border-top:1px solid #C9A84C;border-left:1px solid #C9A84C;z-index:20;"></div>
  <div style="position:absolute;top:14px;right:14px;width:16px;height:16px;border-top:1px solid #C9A84C;border-right:1px solid #C9A84C;z-index:20;"></div>
  <div style="position:absolute;bottom:14px;left:14px;width:16px;height:16px;border-bottom:1px solid #C9A84C;border-left:1px solid #C9A84C;z-index:20;"></div>
  <div style="position:absolute;bottom:14px;right:14px;width:16px;height:16px;border-bottom:1px solid #C9A84C;border-right:1px solid #C9A84C;z-index:20;"></div>

  <!-- Photo area -->
  <div style="position:absolute;top:0;left:0;right:0;height:320px;overflow:hidden;">
    ${photo
      ? `<img src="${photo}" style="width:100%;height:100%;object-fit:cover;display:block;filter:brightness(0.7);">`
      : `<div style="width:100%;height:100%;background:#1A1A1A;display:flex;align-items:center;justify-content:center;font-size:60px;">${isAuto ? '🚗' : '🏠'}</div>`}
    <!-- Gradient fade to black -->
    <div style="position:absolute;bottom:0;left:0;right:0;height:60%;background:linear-gradient(0deg,#0A0A0A 0%,transparent 100%);"></div>
  </div>

  <!-- Content -->
  <div style="position:absolute;bottom:0;left:0;right:0;padding:24px 32px;z-index:5;">
    <!-- Type label -->
    <div style="font-size:8px;letter-spacing:6px;color:${badgeColor};text-transform:uppercase;margin-bottom:8px;display:flex;align-items:center;gap:8px;">
      <div style="width:20px;height:1px;background:${badgeColor};"></div>${typeBadge}
    </div>
    <!-- Title -->
    <div style="font-family:Georgia,serif;font-size:42px;font-weight:900;color:#FFF;line-height:0.92;letter-spacing:-1px;">${titleLine || '—'}</div>
    ${subLine ? `<div style="font-family:Georgia,serif;font-size:15px;font-style:italic;color:rgba(255,255,255,0.6);margin-top:6px;letter-spacing:1px;">${subLine}</div>` : ''}
    <!-- Divider -->
    <div style="width:36px;height:1px;background:#C9A84C;margin:14px 0;"></div>
    <!-- Specs -->
    <div style="display:flex;flex-direction:row;margin-bottom:14px;">${specs.join('')}</div>
    <!-- Price / bottom -->
    <div style="display:flex;align-items:center;justify-content:space-between;padding-top:12px;border-top:1px solid rgba(201,168,76,0.15);">
      <div style="font-family:Georgia,serif;font-size:22px;font-weight:700;color:#C9A84C;">${fiyat || ''}</div>
      <div>
        ${companyName ? `<div style="font-size:8px;letter-spacing:2px;color:rgba(255,255,255,0.5);text-transform:uppercase;text-align:right;margin-bottom:2px;">${companyName}</div>` : ''}
        <div style="font-size:7px;letter-spacing:3px;color:rgba(201,168,76,0.35);text-transform:uppercase;text-align:right;">AlhazenPDF</div>
      </div>
    </div>
  </div>

</div>
</body></html>`;

  return postProcess(html, 600, 600);
};

/* ─────────────────────────────────────────────
   SOSYAL MEDYA · YEŞİL BEYAZ  (600 × 600 px)
   Instagram / Facebook kare
   ───────────────────────────────────────────── */
export const buildSocialGreenHTML = (data) => {
  const { formData = {}, photos = [], companyName = '', category } = data;
  const isAuto = category?.id === 'auto';

  const ilanTuru  = formData['İlan Türü']  || '';
  const emlakTuru = formData['Emlak Türü'] || 'Daire';
  const fiyat     = formData['Fiyat']      || '';
  const adres     = formData['Adres']      || '';
  const telefon   = formData['Telefon']    || '';
  const aciklama  = formData['Açıklama']   || '';
  const oda       = formData['Oda Sayısı'] || '';
  const sqm       = formData['M² (Net)']   || formData['M² (Brüt)'] || '';
  const kat       = formData['Kat']        || '';
  const isitma    = formData['Isıtma']     || '';
  const balkon    = formData['Balkon']     || '';
  const siteIci   = formData['Site İçi']  || '';

  const marka     = formData['Marka']      || '';
  const model     = formData['Model']      || '';
  const yil       = formData['Yıl']        || '';
  const km        = formData['KM']         || '';
  const yakıt     = formData['Yakıt']      || '';
  const sanziman  = formData['Şanzıman']   || '';

  const photo = photos[0]?.base64 || '';
  const { bg } = typeColor(ilanTuru);
  const greenMain = isAuto ? '#E05555' : '#2E7D32';
  const greenLight = isAuto ? '#FFEBEE' : '#E8F5E9';
  const greenBorder = isAuto ? '#FFCDD2' : '#A5D6A7';

  const titleLine = isAuto
    ? `${marka}${model ? ' ' + model : ''}`
    : `${oda ? oda + ' ' : ''}${emlakTuru}`;
  const locLine   = isAuto
    ? (yil || '')
    : adres;
  const badgeText = isAuto ? 'Satılık' : (ilanTuru || 'İlan');
  
  // Açıklamayı kısalt (max 160 karakter)
  const shortDesc = aciklama ? (aciklama.length > 160 ? aciklama.substring(0, 157) + '...' : aciklama) : '';

  const tag = (label) => label
    ? `<div style="background:${greenLight};border:1px solid ${greenBorder};padding:4px 12px;font-size:10px;color:${greenMain};font-weight:500;border-radius:3px;">${label}</div>`
    : '';

  const tags = isAuto
    ? [tag(yil), tag(km ? km + ' km' : ''), tag(yakıt), tag(sanziman)]
    : [tag(sqm ? sqm + ' m²' : ''), tag(kat ? kat + '. Kat' : ''), tag(isitma), tag(balkon === 'Evet' ? 'Balkon' : ''), tag(siteIci === 'Evet' ? 'Site İçi' : '')];

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=600"></head>
<body style="margin:0;padding:0;background:#FFF;">
<div style="width:600px;height:600px;background:#FFF;display:flex;flex-direction:column;overflow:hidden;font-family:Arial,Helvetica,sans-serif;">

  <!-- Top green bar -->
  <div style="height:5px;background:linear-gradient(90deg,${greenMain},#4CAF50,${greenMain});flex-shrink:0;"></div>

  <!-- Photo -->
  <div style="height:290px;overflow:hidden;position:relative;background:#E8F5E9;flex-shrink:0;">
    ${photo
      ? `<img src="${photo}" style="width:100%;height:100%;object-fit:cover;display:block;">`
      : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:60px;">${isAuto ? '🚗' : '🏠'}</div>`}
    <!-- Badge top-left -->
    <div style="position:absolute;top:16px;left:16px;background:${greenMain};padding:6px 14px;font-size:9px;letter-spacing:3px;color:#FFF;text-transform:uppercase;font-weight:500;">${badgeText}</div>
    <!-- Price top-right -->
    ${fiyat ? `<div style="position:absolute;top:16px;right:16px;background:rgba(0,0,0,0.75);padding:6px 14px;font-family:Georgia,serif;font-size:13px;color:#FFF;">${fiyat}</div>` : ''}
  </div>

  <!-- Content -->
  <div style="flex:1;display:flex;flex-direction:column;padding:16px 22px 0;">
    <div style="font-family:Georgia,serif;font-size:34px;font-weight:900;color:#1A1A1A;line-height:0.9;">${titleLine || '—'}</div>
    ${locLine ? `<div style="font-size:11px;color:${greenMain};letter-spacing:2px;text-transform:uppercase;margin-top:6px;font-weight:500;">${locLine}</div>` : ''}
    <!-- Tags -->
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;">${tags.join('')}</div>
    
    <!-- Açıklama -->
    ${shortDesc ? `<div style="margin-top:12px;font-size:11px;color:#555;line-height:1.5;">${shortDesc}</div>` : ''}
    
    <!-- Telefon -->
    ${telefon ? `<div style="margin-top:8px;display:flex;align-items:center;gap:6px;">
      <span style="font-size:14px;">📞</span>
      <span style="font-size:12px;color:${greenMain};font-weight:600;">${telefon}</span>
    </div>` : ''}
    
    <!-- Spacer -->
    <div style="flex:1;"></div>
    
    <!-- Bottom -->
    <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0 12px;border-top:1px solid #EEE;margin-top:8px;">
      <div style="font-family:Georgia,serif;font-size:24px;font-weight:700;color:#1B5E20;">${fiyat || ''}</div>
      <div style="text-align:right;">
        ${companyName ? `<div style="font-size:8px;letter-spacing:2px;color:#888;text-transform:uppercase;margin-bottom:2px;">${companyName}</div>` : ''}
        <div style="font-size:7px;letter-spacing:3px;color:#BBB;text-transform:uppercase;">AlhazenPDF</div>
      </div>
    </div>
  </div>

  <!-- Bottom green bar -->
  <div style="height:4px;background:linear-gradient(90deg,${greenMain},#4CAF50,${greenMain});flex-shrink:0;"></div>

</div>
</body></html>`;

  return postProcess(html, 600, 600);
};

/* ─────────────────────────────────────────────
   SOSYAL MEDYA · STORY 9:16  (338 × 600 px)
   Instagram Story / WhatsApp Durum
   ───────────────────────────────────────────── */
export const buildSocialStoryHTML = (data) => {
  const { formData = {}, photos = [], companyName = '', category } = data;
  const isAuto = category?.id === 'auto';

  const ilanTuru  = formData['İlan Türü']  || '';
  const emlakTuru = formData['Emlak Türü'] || 'Daire';
  const fiyat     = formData['Fiyat']      || '';
  const adres     = formData['Adres']      || '';
  const oda       = formData['Oda Sayısı'] || '';
  const sqm       = formData['M² (Net)']   || formData['M² (Brüt)'] || '';
  const kat       = formData['Kat']        || '';

  const marka     = formData['Marka']      || '';
  const model     = formData['Model']      || '';
  const yil       = formData['Yıl']        || '';
  const km        = formData['KM']         || '';
  const motor     = formData['Motor']      || '';

  const photo = photos[0]?.base64 || '';
  const { bg } = typeColor(ilanTuru);
  const bgMain = isAuto ? '#1A0A0A' : '#0D2614';
  const gold = '#D4AF37';

  const titleLine  = isAuto ? marka : (oda ? oda + ' ' + emlakTuru : emlakTuru);
  const titleLine2 = isAuto ? model : (ilanTuru || 'Emlak');
  const typeBadge  = isAuto ? 'Satılık Araç' : (ilanTuru || 'Emlak İlanı');
  const locLine    = isAuto ? (yil ? yil + (km ? ' · ' + km + ' km' : '') : '') : adres;

  const specItem = (label, val) => val
    ? `<div style="margin-right:14px;">
        <div style="font-size:6px;letter-spacing:2px;color:rgba(255,255,255,0.4);text-transform:uppercase;margin-bottom:2px;">${label}</div>
        <div style="font-family:Georgia,serif;font-size:13px;color:#F0EDE0;">${val}</div>
       </div>`
    : '';

  const specs = isAuto
    ? [specItem('Motor', motor), specItem('Yıl', yil), specItem('KM', km ? km + ' km' : '')]
    : [specItem('Alan', sqm ? sqm + ' m²' : ''), specItem('Kat', kat), specItem('Oda', oda)];

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=338"></head>
<body style="margin:0;padding:0;background:${bgMain};">
<div style="width:338px;height:600px;background:${bgMain};position:relative;overflow:hidden;font-family:Arial,Helvetica,sans-serif;color:#F0EDE0;">

  <!-- Photo -->
  <div style="position:absolute;top:0;left:0;right:0;height:380px;overflow:hidden;">
    ${photo
      ? `<img src="${photo}" style="width:100%;height:100%;object-fit:cover;display:block;filter:brightness(0.65);">`
      : `<div style="width:100%;height:100%;background:#1A2A1A;display:flex;align-items:center;justify-content:center;font-size:50px;">${isAuto ? '🚗' : '🏠'}</div>`}
    <div style="position:absolute;bottom:0;left:0;right:0;height:60%;background:linear-gradient(0deg,${bgMain} 0%,transparent 100%);"></div>
  </div>

  <!-- Header -->
  <div style="position:absolute;top:16px;left:0;right:0;padding:0 20px;display:flex;align-items:center;justify-content:space-between;z-index:10;">
    <div style="font-size:10px;letter-spacing:3px;color:rgba(255,255,255,0.8);text-transform:uppercase;font-weight:500;">${companyName || 'AlhazenPDF'}</div>
    <div style="background:${gold};padding:3px 10px;font-size:8px;letter-spacing:2px;color:${bgMain};text-transform:uppercase;font-weight:700;">${isAuto ? 'GALERİ' : 'EMLAK'}</div>
  </div>

  <!-- Content -->
  <div style="position:absolute;bottom:0;left:0;right:0;padding:20px;z-index:5;">
    <div style="font-size:7px;letter-spacing:5px;color:${gold};text-transform:uppercase;margin-bottom:8px;">${typeBadge}</div>
    <div style="font-family:Georgia,serif;font-size:34px;font-weight:900;color:#FFF;line-height:0.9;">${titleLine || '—'}<br>${titleLine2 || ''}</div>
    ${locLine ? `<div style="font-size:10px;color:rgba(255,255,255,0.55);margin-top:5px;letter-spacing:1px;">${locLine}</div>` : ''}
    <!-- Divider -->
    <div style="width:28px;height:1px;background:${gold};margin:12px 0;"></div>
    <!-- Specs -->
    <div style="display:flex;flex-direction:row;margin-bottom:14px;">${specs.join('')}</div>
    <!-- Price + watermark -->
    <div style="padding-top:12px;border-top:1px solid rgba(212,175,55,0.15);">
      <div style="font-family:Georgia,serif;font-size:20px;font-weight:700;color:${gold};">${fiyat || ''}</div>
      <div style="margin-top:6px;display:flex;align-items:center;gap:8px;">
        ${companyName ? `<div style="font-size:7px;letter-spacing:2px;color:rgba(255,255,255,0.35);text-transform:uppercase;">${companyName}</div><div style="color:rgba(212,175,55,0.3);font-size:7px;">·</div>` : ''}
        <div style="font-size:7px;letter-spacing:3px;color:rgba(212,175,55,0.3);text-transform:uppercase;">AlhazenPDF</div>
      </div>
    </div>
  </div>

</div>
</body></html>`;

  return postProcess(html, 338, 600);
};
