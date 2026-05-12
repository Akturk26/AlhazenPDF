/**
 * PDF HTML Component Builders
 * Her component HTML string döndürür
 */

/**
 * Header Component
 * @param {Object} data - { logo, companyName, category }
 * @param {Object} theme - Theme configuration
 * @returns {string} HTML string
 */
export const buildHeader = (data, theme) => {
  const { logo, companyName, category } = data;
  const { layout } = theme;

  // Köşe süslemeleri (bazı temalarda var)
  const corners = layout.headerStyle === 'corners' ? `
    <div class="corner tl"></div>
    <div class="corner tr"></div>
    <div class="corner bl"></div>
    <div class="corner br"></div>
  ` : '';

  // Logo veya badge
  const rightContent = logo ? `
    <img src="${logo}" class="header-logo" />
  ` : (layout.headerStyle === 'badge' ? `
    <div class="header-badge">
      <div class="header-badge-dot"></div>
      <div class="header-badge-text">AlhazenPDF</div>
    </div>
  ` : `
    <div class="header-tag">AlhazenPDF</div>
  `);

  return `
    ${corners}
    <div class="header">
      <div class="brand-block">
        <div class="brand-name">${companyName || 'AlhazenPDF'}</div>
        <div class="brand-sub">${category.name}</div>
      </div>
      ${rightContent}
    </div>
  `;
};

/**
 * Hero/Title Section Component
 * @param {Object} data - { title, category, formData }
 * @param {Object} theme - Theme configuration
 * @returns {string} HTML string
 */
export const buildHero = (data, theme) => {
  const { title, category, formData } = data;
  const { layout } = theme;
  
  // Marka ve model ayırma
  const [brand = '', model = ''] = title.split(' ');
  
  // Fiyat bilgisi (bazı temalarda hero'da gösterilir)
  const priceEntry = Object.entries(formData).find(([key]) => 
    key.toLowerCase().includes('fiyat')
  );
  
  const priceSection = layout.priceInHero && priceEntry ? `
    <div class="hero-right">
      <div class="hero-price-label">${priceEntry[0]}</div>
      <div class="hero-price">${priceEntry[1]}</div>
    </div>
  ` : '';

  // Inline specs (Motor, Şanzıman, KM) - sadece dolu alanlar gösterilir
  const km = formData.KM || formData.Kilometre;
  const inlineSpecParts = [
    formData.Motor,
    formData.Şanzıman,
    km ? `${km} km` : null,
  ].filter(Boolean);
  const inlineSpecs = inlineSpecParts.join(' · ');

  return `
    <div class="hero">
      <div class="hero-content">
        <div class="hero-left">
          <div class="hero-title">
            ${brand.toUpperCase()}
            ${model ? `<span class="hero-model">${model.toUpperCase()}</span>` : ''}
          </div>
          ${formData.Yıl || formData['Model Yılı'] ? `
            <div class="hero-year">Model Yılı · ${formData.Yıl || formData['Model Yılı']}</div>
          ` : ''}
          <div class="hero-divider"></div>
          <div class="hero-tagline">${inlineSpecs}</div>
        </div>
        ${priceSection}
      </div>
    </div>
  `;
};

/**
 * Gallery Component
 * @param {Array} photos - Photo objects with { base64, width, height, isPortrait }
 * @param {Object} theme - Theme configuration
 * @returns {string} HTML string
 */
export const buildGallery = (photos, theme) => {
  const { layout } = theme;
  
  if (!photos || photos.length === 0) return '';

  const maxPhotos = layout.galleryMaxPhotos || 5;
  const images = photos.slice(0, maxPhotos);
  const mainImage = images[0] || null;
  const subImages = images.slice(1);

  // Helper: Get image src and orientation class
  const getImageData = (img) => {
    if (!img) return { src: '', orientClass: '' };
    // Support both object {base64, isPortrait} and legacy string format
    const src = typeof img === 'string' ? img : (img.base64 || img.uri || '');
    const isPortrait = typeof img === 'object' && img.isPortrait !== undefined ? img.isPortrait : false;
    const orientClass = isPortrait ? 'photo-portrait' : 'photo-landscape';
    return { src, orientClass };
  };

  // Grid yapısı (2-column veya 3-column)
  const gridStyle = layout.galleryColumns === 2 
    ? 'grid-template-columns: 1.6fr 1fr; grid-template-rows: 200px 140px;'
    : 'grid-template-columns: repeat(3, 1fr); grid-template-rows: 180px 110px;';

  // Section başlığı (tema bazlı)
  const sectionHeader = layout.sectionStyle === 'numbered' ? `
    <div class="section-header">
      <span class="section-num">01</span>
      <span class="section-title">Fotoğraf Galerisi</span>
      <div class="section-line"></div>
    </div>
  ` : layout.sectionStyle === 'ornament' ? `
    <div class="section-header">
      <span class="section-ornament">✦</span>
      <span class="section-title">Fotoğraf Galerisi</span>
      <div class="section-line"></div>
    </div>
  ` : `
    <div class="section-header">
      <span class="section-title">Fotoğraf Galerisi</span>
      <div class="section-line"></div>
    </div>
  `;

  // 2-column layout: Ana fotoğraf + yan fotoğraflar
  const mainImgData = getImageData(mainImage);
  const galleryHTML = layout.galleryColumns === 2 ? `
    ${mainImage ? `<div class="gallery-item main ${mainImgData.orientClass}"><img src="${mainImgData.src}" /></div>` : ''}
    ${subImages.map(img => {
      const imgData = getImageData(img);
      return `<div class="gallery-item ${imgData.orientClass}"><img src="${imgData.src}" /></div>`;
    }).join('')}
  ` : `
    ${images[0] ? (() => {
      const imgData = getImageData(images[0]);
      return `<div class="gallery-item ${layout.galleryColumns === 3 ? 'tall' : 'wide'} ${imgData.orientClass}"><img src="${imgData.src}" /></div>`;
    })() : ''}
    ${images.slice(1).map(img => {
      const imgData = getImageData(img);
      return `<div class="gallery-item ${imgData.orientClass}"><img src="${imgData.src}" /></div>`;
    }).join('')}
  `;

  return `
    <div class="gallery-section">
      ${sectionHeader}
      <div class="gallery-grid" style="${gridStyle}">
        ${galleryHTML}
      </div>
    </div>
  `;
};

/**
 * Specs/Info Component
 * @param {Object} formData - Form bilgileri
 * @param {Object} theme - Theme configuration
 * @returns {string} HTML string
 */
export const buildSpecs = (formData, theme, category) => {
  const { layout } = theme;

  const specs = Object.entries(formData);
  const priceEntry = specs.find(([key]) => key.toLowerCase().includes('fiyat'));
  const otherSpecs = specs.filter(([key]) => !key.toLowerCase().includes('fiyat'));

  const isRealEstate = category?.id === 'real-estate';
  const specsLabel = isRealEstate ? 'Emlak Bilgileri' : 'Araç Bilgileri';

  // Section başlığı
  const sectionHeader = layout.sectionStyle === 'numbered' ? `
    <div class="section-header">
      <span class="section-num">02</span>
      <span class="section-title">Teknik Özellikler</span>
      <div class="section-line"></div>
    </div>
  ` : layout.sectionStyle === 'ornament' ? `
    <div class="section-header">
      <span class="section-ornament">✦</span>
      <span class="section-title">${specsLabel}</span>
      <div class="section-line"></div>
    </div>
  ` : `
    <div class="section-header">
      <span class="section-title">${specsLabel}</span>
      <div class="section-line"></div>
    </div>
  `;

  // Grid Layout (default)
  if (layout.specsLayout === 'grid') {
    const specsHTML = otherSpecs
      .filter(([key, value]) => value && value !== '--' && value !== '· ·' && value !== '')
      .map(([key, value]) => {
        const isDescription = key.toLowerCase().includes('açıklama') || key.toLowerCase().includes('description');
        return isDescription ? `
          <div class="spec-cell spec-description">
            <div class="spec-key">${key}</div>
            <div class="spec-val description-text">${value}</div>
          </div>
        ` : `
          <div class="spec-cell">
            <div class="spec-key">${key}</div>
            <div class="spec-val">${value}</div>
          </div>
        `;
      }).join('');

    const priceHTML = priceEntry && !layout.priceInHero && priceEntry[1] && priceEntry[1] !== '--' ? `
      <div class="spec-cell price-cell">
        <div><div class="price-label">${priceEntry[0]}</div></div>
        <div class="spec-val price">${priceEntry[1]}</div>
      </div>
    ` : '';

    return `
      <div class="specs-section">
        ${sectionHeader}
        <div class="specs-grid">
          ${specsHTML}
          ${priceHTML}
        </div>
      </div>
    `;
  }

  // Table Layout (vintage tema)
  if (layout.specsLayout === 'table') {
    const specsHTML = otherSpecs
      .filter(([key, value]) => value && value !== '--' && value !== '· ·' && value !== '')
      .map(([key, value]) => `
        <tr>
          <td class="key">${key}</td>
          <td class="val">${value}</td>
        </tr>
      `).join('');

    const priceHTML = priceEntry && !layout.priceInHero && priceEntry[1] && priceEntry[1] !== '--' ? `
      <tr class="price-row">
        <td class="key">${priceEntry[0]}</td>
        <td class="val">${priceEntry[1]}</td>
      </tr>
    ` : '';

    return `
      <div class="specs-section">
        ${sectionHeader}
        <table class="specs-table">
          ${specsHTML}
          ${priceHTML}
        </table>
      </div>
    `;
  }

  return '';
};

/**
 * Footer Component
 * @param {Object} theme - Theme configuration
 * @param {number} pageNum - Sayfa numarası (opsiyonel)
 * @param {number} totalPages - Toplam sayfa (opsiyonel)
 * @returns {string} HTML string
 */
export const buildFooter = (theme, pageNum = null, totalPages = null) => {
  const { layout } = theme;
  
  const date = new Date().toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const dotElement = layout.footerDot ? `<div class="footer-dot"></div>` : '';
  
  const pageInfo = pageNum && totalPages ? `
    ${dotElement}
    <div class="footer-page">Sayfa ${pageNum} / ${totalPages}</div>
  ` : '';

  return `
    <div class="footer">
      <div class="footer-left">
        ${dotElement}
        <div class="footer-brand">AlhazenPDF</div>
      </div>
      ${pageInfo}
      ${pageInfo ? dotElement : ''}
      <div class="footer-date">${date}</div>
    </div>
    ${layout.bottomBar ? '<div class="bottom-bar"></div>' : ''}
  `;
};

// ═══════════════════════════════════════════════════════════
// PHOTO PAGINATION HELPERS
// ═══════════════════════════════════════════════════════════

/**
 * Fotoğrafları sayfalara böler
 * Sayfa 1: İlk 4 foto (hero layout)
 * Sayfa 2+: Her sayfada 6 foto (3x2 grid)
 * Son sayfa: Kalan fotolar (1,2,3,4,5 için akıllı grid)
 * 
 * @param {string[]} photos - Base64 veya URI dizisi
 * @returns {{ heroPhotos: string[], galleryPages: string[][] }}
 */
export const paginatePhotos = (photos) => {
  if (!photos || photos.length === 0) {
    return { heroPhotos: [], galleryPages: [] };
  }

  const heroPhotos = photos.slice(0, 4);        // Sayfa 1: ilk 4
  const remaining = photos.slice(4);             // Geri kalanlar

  const galleryPages = [];
  for (let i = 0; i < remaining.length; i += 6) {
    galleryPages.push(remaining.slice(i, i + 6));
  }

  return { heroPhotos, galleryPages };
};

/**
 * Toplam sayfa sayısını hesaplar
 * @param {number} photoCount - Toplam fotoğraf sayısı
 * @returns {number} Toplam sayfa sayısı
 */
export const getTotalPages = (photoCount) => {
  if (!photoCount || photoCount === 0) return 1;
  const remaining = Math.max(0, photoCount - 4);
  return 1 + Math.ceil(remaining / 6);
};

/**
 * Kalan fotoğraflar için akıllı grid style seçer
 * @param {number} count - Kalan fotoğraf sayısı
 * @returns {string} Grid CSS style
 */
export const getLastPageGridStyle = (count) => {
  if (count === 1) return 'grid-template-columns: 1fr; max-width: 340px; margin: 0 auto;';
  if (count === 2) return 'grid-template-columns: 1fr 1fr; max-width: 520px; margin: 0 auto;';
  if (count === 4) return 'grid-template-columns: 1fr 1fr;';
  return 'grid-template-columns: 1fr 1fr 1fr;'; // 3, 5, 6
};

/**
 * Tek bir fotoğraf HTML'i üretir
 * @param {string} src - Base64 veya URI
 * @param {string} height - Yükseklik (CSS value)
 * @returns {string} HTML string
 */
export const photoItemHTML = (src, height = '100%') => `
  <div class="photo-item" style="height:${height};">
    <img src="${src}" />
  </div>
`;

/**
 * Hero galeri layout (1 büyük + 3 küçük) — Sayfa 1
 * @param {string[]} photos - İlk 4 fotoğraf
 * @returns {string} HTML string
 */
export const heroGalleryHTML = (photos) => {
  const [p1, p2, p3, p4] = photos;
  
  // Helper: Get image src and orientation class
  const getImgData = (img) => {
    if (!img) return { src: '', orientClass: '' };
    const src = typeof img === 'string' ? img : (img.base64 || img.uri || '');
    const isPortrait = typeof img === 'object' && img.isPortrait !== undefined ? img.isPortrait : false;
    return { src, orientClass: isPortrait ? 'photo-portrait' : 'photo-landscape' };
  };
  
  const img1 = getImgData(p1);
  const img2 = getImgData(p2);
  const img3 = getImgData(p3);
  const img4 = getImgData(p4);
  
  return `
    <div class="gallery-hero-grid">
      ${p1 ? `<div class="photo-item photo-main ${img1.orientClass}"><img src="${img1.src}" /></div>` : '<div class="photo-item photo-main"></div>'}
      ${p2 ? `<div class="photo-item ${img2.orientClass}"><img src="${img2.src}" /></div>` : '<div class="photo-item"></div>'}
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:5px;">
        ${p3 ? `<div class="photo-item ${img3.orientClass}" style="height:100%"><img src="${img3.src}" style="width:100%;height:100%;object-fit:cover;" /></div>` : '<div class="photo-item" style="height:100%"></div>'}
        ${p4 ? `<div class="photo-item ${img4.orientClass}" style="height:100%"><img src="${img4.src}" style="width:100%;height:100%;object-fit:cover;" /></div>` : '<div class="photo-item" style="height:100%"></div>'}
      </div>
    </div>
  `;
};

/**
 * 3x2 galeri sayfası — tam sayfa layout
 * @param {string[]} photos - 6'ya kadar fotoğraf
 * @param {number} pageNum - Sayfa numarası
 * @param {number} totalPages - Toplam sayfa
 * @param {string} date - Tarih
 * @param {string} brandName - Marka adı
 * @param {string} carTitle - Araç başlığı
 * @param {Object} theme - Theme configuration
 * @returns {string} HTML string (full page)
 */
export const galleryPageHTML = (photos, pageNum, totalPages, date, brandName, carTitle, theme) => {
  const { colors, layout } = theme;
  
  // Helper: Get image src and orientation class
  const getImgData = (img) => {
    if (!img) return { src: '', orientClass: '' };
    const src = typeof img === 'string' ? img : (img.base64 || img.uri || '');
    const isPortrait = typeof img === 'object' && img.isPortrait !== undefined ? img.isPortrait : false;
    return { src, orientClass: isPortrait ? 'photo-portrait' : 'photo-landscape' };
  };
  
  // Fotoğraf grid'i (6'ya kadar) with orientation classes
  const photoGridHTML = photos.map(photo => {
    const imgData = getImgData(photo);
    return `
      <div class="photo-item ${imgData.orientClass}">
        <img src="${imgData.src}" />
      </div>
    `;
  }).join('');
  
  // 6'dan az varsa boş hücreler ekle
  const emptySlots = photos.length < 6 
    ? Array(6 - photos.length).fill(`<div class="photo-item empty"></div>`).join('')
    : '';

  // Köşe süslemeleri
  const corners = layout.headerStyle === 'corners' ? `
    <div class="corner tl"></div>
    <div class="corner tr"></div>
    <div class="corner bl"></div>
    <div class="corner br"></div>
  ` : '';

  return `
    <div class="page">
      ${corners}
      
      <!-- Mini header (continuation page) -->
      <div class="page-cont-header">
        <div class="page-cont-brand">${brandName}</div>
        <div class="page-cont-model">${carTitle}</div>
      </div>

      <!-- Gallery grid -->
      <div class="gallery-full">
        <div class="section-header">
          <span class="section-title">Fotoğraf Galerisi</span>
          <div class="section-line"></div>
        </div>
        <div class="gallery-3x2">
          ${photoGridHTML}
          ${emptySlots}
        </div>
      </div>

      <!-- Footer -->
      ${buildFooter(theme, pageNum, totalPages)}
    </div>
  `;
};
