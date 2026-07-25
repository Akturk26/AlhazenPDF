/**
 * Teklif & Fatura HTML Builder
 * Navy/Gold premium tasarım — sistem fontları (offline uyumlu)
 */

const esc = (s) => String(s || '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const fmtN = (n) =>
  Number(n).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtP = (n, sym) => esc(sym) + fmtN(n);

export function buildTeklifFaturaHTML(data) {
  const {
    firma = '',
    belge_tipi = 'Teklif',
    seri_no = '',
    adres = '',
    sehir = '',
    telefon = '',
    vkn = '',
    musteri_adi = '',
    musteri_adres = '',
    musteri_vkn = '',
    tarih = '',
    gecerlilik = '',
    doviz = '₺',
    kdv_yuzde = 20,
    doviz_kuru = '',
    odeme_vadesi = '',
    kalemler = [],
    notlar = '',
    logo = null,
  } = data;

  const kdvOran = parseFloat(kdv_yuzde) / 100;
  let subTotal = 0;
  kalemler.forEach(k => {
    const qty = parseFloat(k.miktar) || 0;
    const price = parseFloat(String(k.birim_fiyat).replace(',', '.')) || 0;
    subTotal += qty * price;
  });
  const kdvTutar = subTotal * kdvOran;
  const grandTotal = subTotal + kdvTutar;

  const isFatura = belge_tipi === 'Fatura' || belge_tipi === 'Proforma Fatura';

  const logoHTML = logo
    ? `<img src="${logo}" style="width:56px;height:56px;object-fit:contain;border:1.5px solid rgba(184,146,42,0.4);" />`
    : `<div style="width:56px;height:56px;background:rgba(255,255,255,0.08);border:1.5px solid rgba(184,146,42,0.4);display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:600;letter-spacing:0.18em;color:rgba(255,255,255,0.35);">LOGO</div>`;

  const companyDetailLines = [
    adres && sehir ? `${esc(adres)} · ${esc(sehir)}` : esc(adres || sehir),
    telefon ? esc(telefon) : '',
    vkn ? `VKN: ${esc(vkn)}` : '',
  ].filter(Boolean).map((l, i) =>
    `<div style="font-size:10px;font-weight:${i === 1 ? 500 : 400};letter-spacing:0.08em;color:${i === 1 ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.5)'};">${l}</div>`
  ).join('');

  const satırlar = kalemler.map((k, idx) => {
    const qty = parseFloat(k.miktar) || 0;
    const price = parseFloat(String(k.birim_fiyat).replace(',', '.')) || 0;
    const line = qty * price;
    const bg = idx % 2 === 0 ? '#ffffff' : '#F2F4F7';
    return `
      <div style="display:grid;grid-template-columns:60px 110px 1fr 52px 58px 72px 80px 88px;padding:7px 6px;border-bottom:1px solid #E8ECF2;background:${bg};">
        <div style="font-family:monospace;font-size:9px;color:#6A7A94;padding:0 6px;display:flex;align-items:center;">${esc(k.kod || '—')}</div>
        <div style="font-size:11px;font-weight:700;color:#1A2232;padding:0 6px;display:flex;align-items:center;">${esc(k.ad || '—')}</div>
        <div style="font-size:10px;color:#6A7A94;padding:0 6px;display:flex;align-items:center;line-height:1.4;">${esc(k.aciklama || '')}</div>
        <div style="font-size:11px;color:#3A4A60;padding:0 6px;display:flex;align-items:center;justify-content:center;">${esc(k.miktar || 1)}</div>
        <div style="font-size:11px;color:#6A7A94;padding:0 6px;display:flex;align-items:center;justify-content:center;">${esc(k.birim || 'Adet')}</div>
        <div style="font-family:monospace;font-size:10.5px;color:#1A2840;font-weight:600;padding:0 6px;display:flex;align-items:center;justify-content:flex-end;">${esc(doviz)}${fmtN(price)}</div>
        <div style="font-size:11px;color:#6A7A94;padding:0 6px;display:flex;align-items:center;justify-content:center;">%${kdv_yuzde}</div>
        <div style="font-family:monospace;font-size:11px;color:#111B2E;font-weight:700;padding:0 6px;display:flex;align-items:center;justify-content:flex-end;">${fmtP(line * (1 + kdvOran), doviz)}</div>
      </div>`;
  }).join('') || `<div style="padding:16px;text-align:center;color:#8A9AB4;font-style:italic;font-size:11px;">Kalem girilmedi</div>`;

  const kdvSatırı = parseFloat(kdv_yuzde) > 0 ? `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 14px;border-bottom:1px solid #E8ECF2;background:#F2F4F7;">
      <span style="font-size:10px;font-weight:600;letter-spacing:0.22em;color:#C03030;text-transform:uppercase;">KDV (%${kdv_yuzde})</span>
      <span style="font-family:monospace;font-size:11px;color:#C03030;">${fmtP(kdvTutar, doviz)}</span>
    </div>` : '';

  const kurBandı = doviz_kuru ? `
    <div style="margin:8px 0 0;padding:6px 12px;background:#F2F4F7;border-left:3px solid #D4AA40;display:flex;align-items:center;gap:8px;">
      <span style="font-size:11px;color:#B8922A;">↕</span>
      <span style="font-size:9px;font-weight:600;letter-spacing:0.22em;color:#6A7A94;text-transform:uppercase;">Döviz Kuru</span>
      <span style="font-family:monospace;font-size:10px;letter-spacing:0.12em;color:#1A2840;">${esc(doviz_kuru)}</span>
    </div>` : '';

  const notlarHTML = notlar ? `
    <div style="padding:12px 22px 0 36px;">
      <div style="font-size:7.5px;font-weight:700;letter-spacing:0.42em;color:#8A9AB4;text-transform:uppercase;margin-bottom:5px;display:flex;align-items:center;gap:6px;">
        <span style="display:inline-block;width:14px;height:1px;background:#8A9AB4;"></span>Notlar
      </div>
      <div style="font-size:10.5px;line-height:1.55;color:#6A7A94;font-style:italic;border-left:2px solid #DDE2EA;padding-left:10px;">${esc(notlar)}</div>
    </div>` : '';

  const yasal = isFatura ? `
    <div style="margin:10px 22px 0 36px;padding:8px 14px;background:#FFF8E7;border:1px solid #ECC85A;border-radius:2px;display:flex;align-items:flex-start;gap:8px;">
      <span style="font-size:12px;flex-shrink:0;margin-top:1px;">⚠️</span>
      <span style="font-size:9px;line-height:1.55;color:#7A5C00;font-weight:500;letter-spacing:0.02em;">
        Bu resmi bir fatura değildir; yapılan iş, kullanılan malzeme ve talep edilen bedel için hazırlanmış bilgilendirme amaçlı şablondur. Yasal fatura için yetkili muhasebeci/mali müşavirinize başvurunuz.
      </span>
    </div>` : '';

  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=794px">
<title>${esc(belge_tipi)} — ${esc(firma)}</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  @page { size: A4; margin: 0; }
  body {
    width: 794px; min-height: 1123px;
    font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif;
    background: #ffffff; color: #1A2232;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
</style>
</head>
<body>
<div style="width:794px;min-height:1123px;position:relative;display:flex;flex-direction:column;background:#fff;">

  <!-- Sol altın şerit -->
  <div style="position:absolute;left:0;top:0;bottom:0;width:5px;background:linear-gradient(180deg,#ECC85A 0%,#B8922A 30%,#111B2E 50%,#B8922A 70%,#ECC85A 100%);z-index:10;"></div>

  <!-- HEADER -->
  <div style="background:#111B2E;padding:32px 36px 28px 44px;display:flex;justify-content:space-between;align-items:flex-start;position:relative;overflow:hidden;flex-shrink:0;">
    <!-- Geometrik arka plan -->
    <div style="position:absolute;top:-40px;right:-40px;width:220px;height:220px;border-radius:50%;border:40px solid rgba(184,146,42,0.12);"></div>
    <div style="position:absolute;bottom:-20px;right:80px;width:120px;height:120px;border:20px solid rgba(184,146,42,0.07);transform:rotate(45deg);"></div>

    <!-- Sol: Logo + Şirket -->
    <div style="display:flex;flex-direction:column;gap:16px;z-index:2;">
      <div style="display:flex;align-items:center;gap:14px;">
        ${logoHTML}
        <div style="display:flex;flex-direction:column;gap:3px;">
          <div style="font-family:Georgia,serif;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.04em;line-height:1;">${esc(firma || 'Şirket Adı')}</div>
          <div style="font-size:8.5px;font-weight:400;letter-spacing:0.38em;color:rgba(255,255,255,0.38);text-transform:uppercase;">${esc([sehir, telefon].filter(Boolean).join('  ·  '))}</div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:3px;">${companyDetailLines}</div>
    </div>

    <!-- Sağ: Belge tipi + meta -->
    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:16px;z-index:2;">
      <div style="font-family:Georgia,serif;font-size:42px;font-weight:300;font-style:italic;color:#ECC85A;letter-spacing:0.04em;line-height:1;">${esc(belge_tipi)}</div>
      <div style="display:flex;flex-direction:column;gap:5px;align-items:flex-end;">
        <div style="display:flex;align-items:baseline;gap:10px;">
          <span style="font-size:8px;font-weight:600;letter-spacing:0.35em;color:rgba(255,255,255,0.35);text-transform:uppercase;">Seri No</span>
          <span style="font-family:monospace;font-size:14px;font-weight:700;color:#ffffff;letter-spacing:0.12em;">${esc(seri_no || '—')}</span>
        </div>
        <div style="display:flex;align-items:baseline;gap:10px;">
          <span style="font-size:8px;font-weight:600;letter-spacing:0.35em;color:rgba(255,255,255,0.35);text-transform:uppercase;">Tarih</span>
          <span style="font-family:monospace;font-size:11px;color:#F5E4A8;letter-spacing:0.12em;">${esc(tarih || '—')}</span>
        </div>
        ${gecerlilik ? `<div style="display:flex;align-items:baseline;gap:10px;">
          <span style="font-size:8px;font-weight:600;letter-spacing:0.35em;color:rgba(255,255,255,0.35);text-transform:uppercase;">Geçerlilik</span>
          <span style="font-family:monospace;font-size:11px;color:#F5E4A8;letter-spacing:0.12em;">${esc(gecerlilik)}</span>
        </div>` : ''}
        ${doviz_kuru ? `<div style="display:flex;align-items:baseline;gap:10px;">
          <span style="font-size:8px;font-weight:600;letter-spacing:0.35em;color:rgba(255,255,255,0.35);text-transform:uppercase;">Kur</span>
          <span style="font-family:monospace;font-size:11px;color:#F5E4A8;letter-spacing:0.12em;">${esc(doviz_kuru)}</span>
        </div>` : ''}
      </div>
    </div>
  </div>

  <!-- Altın çizgi -->
  <div style="height:3px;flex-shrink:0;background:linear-gradient(90deg,#B8922A 0%,#ECC85A 25%,#D4AA40 50%,#ECC85A 75%,#B8922A 100%);"></div>

  <!-- MÜŞTERİ + BELGE BİLGİ SATIRI -->
  <div style="display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid #DDE2EA;flex-shrink:0;">
    <!-- Sol: Müşteri -->
    <div style="padding:16px 24px 14px 36px;display:flex;flex-direction:column;gap:6px;">
      <div style="font-size:8px;font-weight:700;letter-spacing:0.45em;color:#B8922A;text-transform:uppercase;display:flex;align-items:center;gap:6px;">
        <span style="display:inline-block;width:18px;height:1px;background:#B8922A;"></span>Sayın
      </div>
      <div style="font-family:Georgia,serif;font-size:18px;font-weight:600;color:#111B2E;letter-spacing:0.03em;line-height:1.2;">${esc(musteri_adi || 'Müşteri Adı')}</div>
      ${musteri_adres ? `<div style="font-size:10.5px;color:#6A7A94;letter-spacing:0.06em;line-height:1.55;">${esc(musteri_adres)}</div>` : ''}
      ${musteri_vkn ? `<div style="font-size:10px;color:#6A7A94;margin-top:2px;">VKN: <span style="font-family:monospace;">${esc(musteri_vkn)}</span></div>` : ''}
    </div>
    <!-- Sağ: Belge meta -->
    <div style="padding:16px 24px 14px 24px;background:#F2F4F7;border-left:1px solid #DDE2EA;display:flex;flex-direction:column;gap:6px;">
      <div style="font-size:8px;font-weight:700;letter-spacing:0.45em;color:#B8922A;text-transform:uppercase;display:flex;align-items:center;gap:6px;">
        <span style="display:inline-block;width:18px;height:1px;background:#B8922A;"></span>Belge Bilgileri
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 16px;margin-top:4px;">
        <div><div style="font-size:7.5px;font-weight:700;letter-spacing:0.38em;color:#8A9AB4;text-transform:uppercase;">Belge Tipi</div><div style="font-size:12px;font-weight:700;color:#111B2E;">${esc(belge_tipi)}</div></div>
        <div><div style="font-size:7.5px;font-weight:700;letter-spacing:0.38em;color:#8A9AB4;text-transform:uppercase;">Seri No</div><div style="font-family:monospace;font-size:11px;font-weight:600;color:#B8922A;">${esc(seri_no || '—')}</div></div>
        <div><div style="font-size:7.5px;font-weight:700;letter-spacing:0.38em;color:#8A9AB4;text-transform:uppercase;">Tarih</div><div style="font-size:12px;font-weight:600;color:#1A2232;">${esc(tarih || '—')}</div></div>
        ${gecerlilik ? `<div><div style="font-size:7.5px;font-weight:700;letter-spacing:0.38em;color:#8A9AB4;text-transform:uppercase;">Geçerlilik</div><div style="font-size:12px;font-weight:600;color:#1A2232;">${esc(gecerlilik)}</div></div>` : ''}
        ${odeme_vadesi ? `<div><div style="font-size:7.5px;font-weight:700;letter-spacing:0.38em;color:#8A9AB4;text-transform:uppercase;">Ödeme</div><div style="font-size:12px;font-weight:600;color:#1A2232;">${esc(odeme_vadesi)}</div></div>` : ''}
        <div><div style="font-size:7.5px;font-weight:700;letter-spacing:0.38em;color:#8A9AB4;text-transform:uppercase;">Döviz</div><div style="font-size:12px;font-weight:600;color:#B8922A;">${esc(doviz)} · KDV %${kdv_yuzde}</div></div>
      </div>
    </div>
  </div>

  <!-- TABLO -->
  <div style="flex:1;padding:0 22px 0 30px;">
    ${kurBandı}
    <!-- Tablo başlık -->
    <div style="display:grid;grid-template-columns:60px 110px 1fr 52px 58px 72px 80px 88px;padding:8px 6px 7px;background:#111B2E;margin:14px 0 0;">
      <div style="font-size:7.5px;font-weight:700;letter-spacing:0.32em;color:rgba(255,255,255,0.55);text-transform:uppercase;padding:0 6px;">Kod</div>
      <div style="font-size:7.5px;font-weight:700;letter-spacing:0.32em;color:rgba(255,255,255,0.55);text-transform:uppercase;padding:0 6px;">Ürün / Hizmet</div>
      <div style="font-size:7.5px;font-weight:700;letter-spacing:0.32em;color:rgba(255,255,255,0.55);text-transform:uppercase;padding:0 6px;">Açıklama</div>
      <div style="font-size:7.5px;font-weight:700;letter-spacing:0.32em;color:rgba(255,255,255,0.55);text-transform:uppercase;padding:0 6px;text-align:center;">Miktar</div>
      <div style="font-size:7.5px;font-weight:700;letter-spacing:0.32em;color:rgba(255,255,255,0.55);text-transform:uppercase;padding:0 6px;text-align:center;">Birim</div>
      <div style="font-size:7.5px;font-weight:700;letter-spacing:0.32em;color:rgba(255,255,255,0.55);text-transform:uppercase;padding:0 6px;text-align:right;">Birim Fiyat</div>
      <div style="font-size:7.5px;font-weight:700;letter-spacing:0.32em;color:rgba(255,255,255,0.55);text-transform:uppercase;padding:0 6px;text-align:center;">KDV</div>
      <div style="font-size:7.5px;font-weight:700;letter-spacing:0.32em;color:rgba(255,255,255,0.55);text-transform:uppercase;padding:0 6px;text-align:right;">Tutar</div>
    </div>
    <!-- Satırlar -->
    <div>${satırlar}</div>
  </div>

  <!-- TOPLAM -->
  <div style="display:flex;justify-content:flex-end;padding:16px 22px 0 30px;flex-shrink:0;">
    <div style="width:280px;border:1px solid #DDE2EA;">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 14px;border-bottom:1px solid #E8ECF2;">
        <span style="font-size:10px;font-weight:600;letter-spacing:0.22em;color:#6A7A94;text-transform:uppercase;">Ara Toplam</span>
        <span style="font-family:monospace;font-size:11px;color:#3A4A60;">${fmtP(subTotal, doviz)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 14px;border-bottom:1px solid #E8ECF2;">
        <span style="font-size:10px;font-weight:600;letter-spacing:0.22em;color:#6A7A94;text-transform:uppercase;">Brüt Toplam</span>
        <span style="font-family:monospace;font-size:11px;color:#3A4A60;">${fmtP(subTotal, doviz)}</span>
      </div>
      ${kdvSatırı}
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:#111B2E;">
        <span style="font-family:Georgia,serif;font-size:14px;font-weight:600;font-style:italic;color:#ffffff;letter-spacing:0.04em;">Genel Toplam</span>
        <span style="font-family:monospace;font-size:16px;color:#ECC85A;font-weight:700;">${fmtP(grandTotal, doviz)}</span>
      </div>
    </div>
  </div>

  ${notlarHTML}
  ${yasal}

  <!-- İMZA ALANLARI -->
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;padding:16px 22px 14px 36px;margin-top:auto;flex-shrink:0;">
    <div style="padding:0 16px;border-right:1px solid #DDE2EA;display:flex;flex-direction:column;gap:6px;align-items:center;">
      <div style="font-size:7.5px;font-weight:700;letter-spacing:0.38em;color:#8A9AB4;text-transform:uppercase;">Hazırlayan</div>
      <div style="width:100%;height:1px;background:#DDE2EA;margin-top:28px;"></div>
      <div style="font-size:9px;letter-spacing:0.15em;color:#8A9AB4;text-align:center;line-height:1.4;">${esc(firma || '—')}<br>Kaşe / İmza</div>
    </div>
    <div style="padding:0 16px;border-right:1px solid #DDE2EA;display:flex;flex-direction:column;gap:6px;align-items:center;">
      <div style="font-size:7.5px;font-weight:700;letter-spacing:0.38em;color:#8A9AB4;text-transform:uppercase;">Onaylayan</div>
      <div style="width:100%;height:1px;background:#DDE2EA;margin-top:28px;"></div>
      <div style="font-size:9px;letter-spacing:0.15em;color:#8A9AB4;text-align:center;line-height:1.4;">Yetkili<br>Kaşe / İmza</div>
    </div>
    <div style="padding:0 16px;display:flex;flex-direction:column;gap:6px;align-items:center;">
      <div style="font-size:7.5px;font-weight:700;letter-spacing:0.38em;color:#8A9AB4;text-transform:uppercase;">Müşteri Onayı</div>
      <div style="width:100%;height:1px;background:#DDE2EA;margin-top:28px;"></div>
      <div style="font-size:9px;letter-spacing:0.15em;color:#8A9AB4;text-align:center;line-height:1.4;">${esc(musteri_adi || '—')}<br>Kaşe / İmza</div>
    </div>
  </div>

  <!-- İnce çizgi -->
  <div style="height:2px;flex-shrink:0;background:linear-gradient(90deg,transparent 0%,#DDE2EA 10%,#DDE2EA 90%,transparent 100%);margin:6px 36px 0;"></div>

  <!-- ALHAZENPDF BANDI -->
  <div style="flex-shrink:0;margin:8px 22px 16px 30px;padding:10px 16px 10px 14px;display:flex;align-items:center;gap:14px;background:#111B2E;position:relative;overflow:hidden;">
    <div style="position:absolute;right:-20px;top:-20px;width:80px;height:80px;border:14px solid rgba(184,146,42,0.15);border-radius:50%;"></div>
    <div style="width:32px;height:32px;flex-shrink:0;background:#D4AA40;display:flex;align-items:center;justify-content:center;font-family:Georgia,serif;font-size:16px;color:#111B2E;font-weight:700;z-index:2;">A</div>
    <div style="display:flex;flex-direction:column;gap:2px;z-index:2;">
      <div style="font-family:Georgia,serif;font-size:14px;font-weight:700;letter-spacing:0.1em;color:#ffffff;">Alhazen<span style="color:#ECC85A;font-style:italic;">PDF</span></div>
      <div style="font-size:8px;font-weight:500;letter-spacing:0.32em;color:rgba(255,255,255,0.4);text-transform:uppercase;">Premium Belge &amp; Katalog Uygulaması</div>
    </div>
    <div style="width:1px;height:30px;background:rgba(255,255,255,0.12);z-index:2;"></div>
    <div style="display:flex;gap:10px;z-index:2;flex-wrap:wrap;">
      <span style="font-size:8.5px;font-weight:600;letter-spacing:0.15em;color:rgba(255,255,255,0.55);">✦ Araç Galerisi</span>
      <span style="font-size:8.5px;font-weight:600;letter-spacing:0.15em;color:rgba(255,255,255,0.55);">✦ Servis Bakım</span>
      <span style="font-size:8.5px;font-weight:600;letter-spacing:0.15em;color:rgba(255,255,255,0.55);">✦ Teklif &amp; Fatura</span>
      <span style="font-size:8.5px;font-weight:600;letter-spacing:0.15em;color:rgba(255,255,255,0.55);">✦ 30+ Tema</span>
    </div>
    <div style="margin-left:auto;display:flex;flex-direction:column;align-items:flex-end;gap:3px;z-index:2;">
      <div style="font-size:8px;font-weight:700;letter-spacing:0.28em;color:#ECC85A;text-transform:uppercase;">Google Play'de Ücretsiz</div>
      <div style="font-family:monospace;font-size:7.5px;letter-spacing:0.08em;color:rgba(255,255,255,0.28);">play.google.com/store/apps/details?id=com.alhazenpdf.code</div>
    </div>
  </div>

</div>
</body>
</html>`;
}
