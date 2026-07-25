/**
 * Emlak Portfolyo PDF Builder
 * Navy / Gold / Cream premium tasarım — 2 ilan/sayfa, max 10 ilan
 */

const esc = (s) => String(s || '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function today() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
}

function formatFiyat(val) {
  const num = String(val || '').replace(/[^\d]/g, '');
  if (!num) return '—';
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function buildListing(ev, idx) {
  const num = String(idx + 1).padStart(2, '0');
  const ozellikler = (ev.ozellikler || []).slice(0, 4);

  const specsHTML = `
    <div class="listing-specs">
      <div class="spec-item">
        <div class="spec-key">Brüt m²</div>
        <div class="spec-val">${esc(ev.m2) || '—'}</div>
      </div>
      <div class="spec-item">
        <div class="spec-key">Oda</div>
        <div class="spec-val">${esc(ev.oda) || '—'}</div>
      </div>
      ${ev.kat ? `<div class="spec-item"><div class="spec-key">Kat</div><div class="spec-val">${esc(ev.kat)}</div></div>` : ''}
      ${ev.yapiYili ? `<div class="spec-item"><div class="spec-key">Yapı Yılı</div><div class="spec-val">${esc(ev.yapiYili)}</div></div>` : ''}
    </div>`;

  const featuresHTML = ozellikler.length > 0 ? `
    <div class="listing-features">
      ${ozellikler.map(f => `
        <div class="feat-item">
          <div class="feat-dot"></div>
          <div class="feat-text">${esc(f)}</div>
        </div>`).join('')}
    </div>` : '';

  const photoHTML = ev.foto
    ? `<img src="${ev.foto}" />`
    : `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:#1a2e42;"><span style="font-size:48px;opacity:0.2">🏠</span></div>`;

  return `
    <div class="listing">
      <div class="listing-photo">
        ${photoHTML}
        <div class="listing-photo-overlay"></div>
        <div class="listing-type-badge">
          <div class="listing-type-dot"></div>
          <div class="listing-type-text">${esc(ev.ilanTuru || 'Satılık')}</div>
        </div>
        <div class="listing-photo-bottom">
          <div class="listing-num">${num}</div>
          <div class="listing-photo-specs">
            ${ev.m2 ? `<div class="photo-spec-pill">${esc(ev.m2)} m²</div>` : ''}
            ${ev.oda ? `<div class="photo-spec-pill">${esc(ev.oda)}</div>` : ''}
          </div>
        </div>
      </div>
      <div class="listing-info">
        <div class="listing-number">İlan · ${String(idx + 1).padStart(3, '0')}</div>
        <div class="listing-title">${esc(ev.baslik)}</div>
        <div class="listing-location">
          <div class="location-dot"></div>
          <div class="location-text">${esc(ev.konum)}</div>
        </div>
        ${specsHTML}
        ${featuresHTML}
        <div class="listing-price-row">
          <div>
            <div class="price-label">${ev.ilanTuru === 'Kiralık' ? 'Aylık Kira' : 'Satış Fiyatı'}</div>
            <div class="price-val">${formatFiyat(ev.fiyat)} ₺</div>
          </div>
          ${ev.not ? `<div class="price-note">${esc(ev.not).replace(/\s/g, '<br>')}</div>` : ''}
        </div>
      </div>
    </div>`;
}

function buildPage(listings, pageNum, totalPages, agencyName, contact, tarih, totalCount) {
  const ayAd = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran',
                 'Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  const d = new Date();
  const ayYil = `${ayAd[d.getMonth()]} ${d.getFullYear()}`;

  return `
  <div class="page${pageNum === totalPages ? ' page-last' : ''}">
    <div class="page-header">
      <div class="header-left">
        <div class="header-agency">${esc(agencyName)}</div>
        <div class="header-sub">Gayrimenkul Portföyü</div>
      </div>
      <div class="header-center">
        <div class="header-brand">AlhazenPDF</div>
        <div class="header-brand-sub">Portföy · PDF</div>
      </div>
      <div class="header-right">
        <div class="header-info">${ayYil} · ${totalCount} Konut</div>
        <div class="header-page">Sayfa ${pageNum} / ${totalPages} · ${tarih}</div>
      </div>
    </div>
    <div class="gold-bar"></div>
    <div class="listings">
      ${listings.map((ev, i) => buildListing(ev, (pageNum - 1) * 2 + i)).join('')}
    </div>
    <div class="gold-bar"></div>
    <div class="page-footer">
      <div class="footer-left">
        <div class="footer-contact">${esc(agencyName)}${contact ? ' · ' + esc(contact) : ''}</div>
      </div>
      <div class="footer-center">
        <div class="footer-brand">AlhazenPDF</div>
      </div>
      <div class="footer-right">
        <div class="footer-page">${pageNum} / ${totalPages}</div>
      </div>
    </div>
  </div>`;
}

export function buildEmlakPortfolyoHTML(data) {
  const {
    evler = [],
    agencyName = 'Emlak Ofisi',
    contact = '',
  } = data;

  const tarih = today();
  const totalPages = Math.ceil(evler.length / 2);
  const pages = [];

  for (let i = 0; i < totalPages; i++) {
    const slice = evler.slice(i * 2, i * 2 + 2);
    pages.push(buildPage(slice, i + 1, totalPages, agencyName, contact, tarih, evler.length));
  }

  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@200;300;400;500;600;700&display=swap" rel="stylesheet">
<style>
@page{size:A4 portrait;margin:0;}
:root {
  --navy:#0d1b2a; --navy-mid:#1a2e42;
  --cream:#f7f3ec; --cream-dark:#ede5d8;
  --gold:#b8965a; --gold-light:#d4af7a; --gold-dim:#7a6038;
  --white:#fdfaf5; --gray:#8a8070; --gray-light:#c5bfb5;
}
*{margin:0;padding:0;box-sizing:border-box}
body{background:#2a2520;font-family:'Jost',sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:794px;height:1123px;background:var(--cream);position:relative;overflow:hidden;display:flex;flex-direction:column;page-break-after:always;break-after:page}
.page-last{page-break-after:avoid;break-after:avoid}
.page-header{background:var(--navy);padding:14px 40px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;flex-shrink:0}
.header-agency{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:400;color:var(--white);letter-spacing:1px}
.header-sub{font-size:8px;letter-spacing:4px;color:rgba(184,150,90,0.5);text-transform:uppercase;margin-top:2px}
.header-center{text-align:center}
.header-brand{font-family:'Jost',sans-serif;font-size:11px;font-weight:700;letter-spacing:6px;color:var(--gold);text-transform:uppercase}
.header-brand-sub{font-size:7px;letter-spacing:3px;color:rgba(184,150,90,0.4);margin-top:3px;text-transform:uppercase}
.header-right{text-align:right}
.header-info{font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.5);margin-bottom:3px}
.header-page{font-size:8px;letter-spacing:2px;color:rgba(184,150,90,0.35)}
.gold-bar{height:2px;background:linear-gradient(90deg,var(--navy-mid) 0%,var(--gold) 40%,var(--gold-light) 60%,var(--navy-mid) 100%);flex-shrink:0}
.listings{flex:1;display:flex;flex-direction:column;overflow:hidden;min-height:0}
.listing{display:flex;flex-direction:row;border-bottom:1px solid var(--cream-dark);overflow:hidden;flex:1;min-height:0}
.listing:last-child{border-bottom:none}
.listing-photo{flex:2;position:relative;overflow:hidden;background:var(--cream-dark);min-height:0}
.listing-photo img{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;display:block;filter:brightness(0.88) saturate(0.95)}
.listing-photo-overlay{position:absolute;inset:0;background:linear-gradient(to right,transparent 60%,rgba(247,243,236,0.15) 100%),linear-gradient(to top,rgba(13,27,42,0.5) 0%,transparent 40%)}
.listing-type-badge{position:absolute;top:16px;left:16px;background:var(--navy);padding:5px 12px;display:flex;align-items:center;gap:6px}
.listing-type-dot{width:5px;height:5px;border-radius:50%;background:var(--gold)}
.listing-type-text{font-size:8px;font-weight:600;letter-spacing:3px;color:var(--gold);text-transform:uppercase}
.listing-photo-bottom{position:absolute;bottom:16px;left:16px;right:16px;display:flex;align-items:flex-end;justify-content:space-between}
.listing-num{font-family:'Cormorant Garamond',serif;font-size:48px;font-weight:300;color:rgba(255,255,255,0.08);line-height:1;font-style:italic}
.listing-photo-specs{display:flex;gap:8px}
.photo-spec-pill{background:rgba(13,27,42,0.7);border:1px solid rgba(184,150,90,0.3);padding:3px 8px;font-size:9px;font-weight:500;color:var(--cream);letter-spacing:1px;backdrop-filter:blur(4px)}
.listing-info{flex:1.2;min-width:0;padding:16px 20px 14px;display:flex;flex-direction:column;background:var(--white);border-left:1px solid var(--cream-dark);overflow:hidden}
.listing-number{font-size:8px;letter-spacing:3px;color:var(--gold-dim);text-transform:uppercase;font-weight:500;margin-bottom:6px}
.listing-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:500;color:var(--navy);line-height:1.2;margin-bottom:4px}
.listing-location{display:flex;align-items:center;gap:5px;margin-bottom:10px}
.location-dot{width:4px;height:4px;border-radius:50%;background:var(--gold);flex-shrink:0}
.location-text{font-size:10px;color:var(--gray);font-weight:300;letter-spacing:0.5px}
.listing-specs{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--cream-dark);border:1px solid var(--cream-dark);margin-bottom:8px}
.spec-item{background:var(--cream);padding:8px 10px}
.spec-key{font-size:7px;letter-spacing:2px;color:var(--gray-light);text-transform:uppercase;margin-bottom:3px}
.spec-val{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:500;color:var(--navy);line-height:1}
.listing-features{display:flex;flex-direction:column;gap:4px;margin-bottom:8px}
.feat-item{display:flex;align-items:center;gap:7px}
.feat-dot{width:3px;height:3px;border-radius:50%;background:var(--gold);flex-shrink:0}
.feat-text{font-size:10px;color:var(--gray);font-weight:300;line-height:1.4}
.listing-price-row{padding-top:10px;border-top:1px solid var(--cream-dark);display:flex;align-items:flex-end;justify-content:space-between;flex-shrink:0;margin-top:auto}
.price-label{font-size:7px;letter-spacing:2px;color:var(--gold-dim);text-transform:uppercase;margin-bottom:3px}
.price-val{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:var(--navy);line-height:1}
.price-note{font-size:8px;color:var(--gray-light);letter-spacing:1px;text-align:right}
.page-footer{background:var(--navy);padding:10px 40px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;flex-shrink:0}
.footer-contact{font-family:'Cormorant Garamond',serif;font-size:13px;color:var(--white);font-weight:300;font-style:italic}
.footer-center{text-align:center}
.footer-brand{font-size:9px;font-weight:700;letter-spacing:5px;color:var(--gold);text-transform:uppercase}
.footer-right{text-align:right}
.footer-page{font-size:8px;letter-spacing:2px;color:rgba(255,255,255,0.2)}
@media print{body{background:none}.page{box-shadow:none}}
</style>
</head>
<body>
${pages.join('\n')}
</body>
</html>`;
}
