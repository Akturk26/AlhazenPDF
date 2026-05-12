/**
 * PDF HTML Base Builder
 * Tema ve component'leri birleştirip final HTML oluşturur
 */

import {
  buildHeader,
  buildHero,
  buildGallery,
  buildSpecs,
  buildFooter,
  paginatePhotos,
  getTotalPages,
} from './pdfComponents';

/**
 * CSS Generator - Tema objesinden CSS üretir
 * @param {Object} theme - Theme configuration
 * @returns {string} CSS string
 */
const generateCSS = (theme) => {
  const { colors, fonts, layout, name } = theme;

  // WHITE THEME: Use exact HTML template CSS (multi-page builder)
  if (name === 'Premium Beyaz' || name === 'Premium White') {
    return `
    <style>
      @page {
        margin: 0;
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      html {
        width: 100%;
        margin: 0;
        padding: 0;
        background: transparent;
      }

      body {
        width: 100%;
        margin: 0;
        padding: 0;
        background: transparent;
        font-family: 'DM Sans', sans-serif;
        display: block;
      }

      .page {
        width: 100vw;
        height: 100vh;
        background: #FFFFFF;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        page-break-after: always;
        page-break-inside: avoid;
        break-after: page;
        break-inside: avoid;
      }

      .page:last-child {
        page-break-after: avoid;
        break-after: avoid;
      }

      .page-last {
        page-break-after: avoid !important;
        break-after: avoid !important;
      }

      .accent-top {
        height: 3px;
        width: 100%;
        background: linear-gradient(90deg, #111 0%, #C8C8C8 50%, #EEEEEE 100%);
        flex-shrink: 0;
      }

      .accent-bottom {
        height: 3px;
        width: 100%;
        background: linear-gradient(90deg, #EEEEEE 0%, #111 50%, #EEEEEE 100%);
        flex-shrink: 0;
      }

      .p1-header {
        height: 72px;
        flex-shrink: 0;
        padding: 0 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #EEEEEE;
      }

      .brand-name {
        font-family: 'Playfair Display', serif;
        font-size: 19px;
        font-weight: 400;
        color: #111;
        letter-spacing: 0.5px;
      }

      .brand-sub {
        font-size: 8px;
        letter-spacing: 4px;
        color: #999;
        text-transform: uppercase;
        margin-top: 3px;
      }

      .header-logo-wrap {
        width: 44px;
        height: 44px;
        border-radius: 10px;
        overflow: hidden;
        border: 1px solid #EEE;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #F8F8F8;
      }

      .header-logo-wrap img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .header-logo-placeholder {
        font-size: 8px;
        letter-spacing: 2px;
        color: #AAA;
        text-transform: uppercase;
        font-family: 'DM Sans', sans-serif;
      }

      .p1-hero {
        height: 124px;
        flex-shrink: 0;
        background: #111;
        padding: 0 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        overflow: hidden;
      }

      .p1-hero::before {
        content: '';
        position: absolute;
        right: -50px; top: -50px;
        width: 220px; height: 220px;
        border-radius:50%;
        border: 1px solid rgba(255,255,255,0.04);
      }

      .hero-eyebrow {
        font-size: 8px;
        letter-spacing: 5px;
        color: #888;
        text-transform: uppercase;
        margin-bottom: 8px;
      }

      .hero-title {
        font-family: 'Playfair Display', serif;
        font-size: 26px;
        font-weight: 900;
        line-height: 0.88;
        color: #FFF;
        letter-spacing: -1.5px;
      }

      .hero-model {
        font-family: 'Playfair Display', serif;
        font-size: 22px;
        font-weight: 300;
        font-style: italic;
        color: #888;
        letter-spacing: 4px;
        margin-top: 6px;
      }

      .hero-right {
        text-align: right;
        flex-shrink: 0;
      }

      .hero-price-label {
        font-size: 8px;
        letter-spacing: 3px;
        color: #666;
        text-transform: uppercase;
        margin-bottom: 5px;
      }

      .hero-price {
        font-family: 'Playfair Display', serif;
        font-size: 26px;
        font-weight: 700;
        color: #FFF;
        letter-spacing: -0.5px;
      }

      .hero-year-badge {
        display: inline-block;
        border: 1px solid #444;
        padding: 4px 12px;
        font-size: 9px;
        letter-spacing: 3px;
        color: #888;
        text-transform: uppercase;
        margin-top: 8px;
      }

      .p1-gallery {
        height: 320px;
        flex-shrink: 0;
        padding: 12px 12px 0;
        display: flex;
        flex-direction: column;
      }

      .section-label {
        height: 28px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 10px;
      }

      .section-label-text {
        font-size: 8px;
        letter-spacing: 5px;
        text-transform: uppercase;
        color: #AAA;
        white-space: nowrap;
      }

      .section-label-line {
        flex: 1;
        height: 1px;
        background: #EEEEEE;
      }

      .gallery-hero-grid {
        flex: 1;
        display: grid;
        grid-template-columns: 1.5fr 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 4px;
        overflow: hidden;
      }

      .photo-main {
        grid-row: span 2;
        overflow: hidden;
      }

      .photo-cell {
        overflow: hidden;
        background: #F5F5F5;
      }

      .photo-cell img,
      .photo-main img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      /* Orientation-aware image rendering */
      .photo-portrait img {
        width: auto !important;
        height: 100% !important;
        max-width: 100%;
        margin: 0 auto;
      }

      .photo-landscape img {
        width: 100% !important;
        height: auto !important;
        max-height: 100%;
        margin: auto 0;
      }

      .p1-specs {
        flex: 1;
        padding: 10px 12px 0;
        display: flex;
        flex-direction: column;
      }

      .specs-grid {
        flex: 1;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1px;
        background: #EEEEEE;
        border: 1px solid #EEEEEE;
        overflow: hidden;
      }

      .spec-cell {
        background: #FFF;
        padding: 12px 14px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .spec-key {
        font-size: 7px;
        letter-spacing: 3px;
        text-transform: uppercase;
        color: #AAA;
        margin-bottom: 5px;
      }

      .spec-val {
        font-family: 'Playfair Display', serif;
        font-size: 15px;
        color: #111;
      }

      .page-footer {
        height: 36px;
        flex-shrink: 0;
        padding: 0 12px;
        background: #F8F8F8;
        border-top: 1px solid #EEEEEE;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .footer-brand {
        font-size: 8px;
        letter-spacing: 4px;
        color: #999;
        text-transform: uppercase;
      }

      .footer-page {
        font-size: 8px;
        letter-spacing: 2px;
        color: #AAA;
      }

      .footer-date {
        font-size: 8px;
        letter-spacing: 2px;
        color: #AAA;
      }

      .gallery-page-header {
        height: 26px;
        flex-shrink: 0;
        padding: 0 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #EEEEEE;
        background: #F8F8F8;
      }

      .gph-brand {
        font-family: 'Playfair Display', serif;
        font-size: 13px;
        color: #111;
        letter-spacing: 0.5px;
      }

      .gph-model {
        font-size: 8px;
        letter-spacing: 3px;
        color: #AAA;
        text-transform: uppercase;
      }

      .gallery-page-content {
        flex: 1;
        padding: 14px 24px 8px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .gallery-grid-3x2 {
        flex: 1;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 4px;
        overflow: hidden;
      }

      .gallery-grid-3x2 .photo-cell {
        overflow: hidden;
        background: #F5F5F5;
        height: 100%;
      }

      .gallery-grid-3x2 .photo-cell img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .photo-cell.empty {
        background: #F8F8F8;
        border: none;
      }
    </style>
    `;
  }

  // DARKGOLD THEME: Siyah Altın (corners)
  if (name === 'Siyah Altın' || name === 'Premium Altın' || layout.headerStyle === 'corners') {
    return `
    <style>
      @page {
        margin: 0;
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      body {
        background: transparent;
        font-family: 'Montserrat', sans-serif;
        display: block;
        margin: 0;
        padding: 0;
      }

      .page {
        width: 100vw;
        height: 100vh;
        background: #0A0A0A;
        color: #F5F0E8;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        page-break-after: always;
        page-break-inside: avoid;
        break-after: page;
        break-inside: avoid;
      }

      .page:last-child {
        page-break-after: avoid;
        break-after: avoid;
      }

      .page-last {
        page-break-after: avoid !important;
        break-after: avoid !important;
      }

      .page::before {
        content: '';
        position: absolute;
        inset: 10px;
        border: 1px solid rgba(201,168,76,0.18);
        pointer-events: none;
        z-index: 10;
      }

      .corner { position: absolute; width: 18px; height: 18px; z-index: 20; }
      .corner.tl { top: 16px; left: 16px; border-top: 1px solid #C9A84C; border-left: 1px solid #C9A84C; }
      .corner.tr { top: 16px; right: 16px; border-top: 1px solid #C9A84C; border-right: 1px solid #C9A84C; }
      .corner.bl { bottom: 16px; left: 16px; border-bottom: 1px solid #C9A84C; border-left: 1px solid #C9A84C; }
      .corner.br { bottom: 16px; right: 16px; border-bottom: 1px solid #C9A84C; border-right: 1px solid #C9A84C; }

      .p1-header {
        height: 68px;
        flex-shrink: 0;
        padding: 0 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid rgba(201,168,76,0.15);
        position: relative; z-index: 1;
      }

      .p1-header::after {
        content: '';
        position: absolute;
        bottom: -1px; left: 24px;
        width: 50px; height: 2px;
        background: #C9A84C;
      }

      .brand-name {
        font-family: 'Cormorant Garamond', serif;
        font-size: 13px;
        font-weight: 400;
        letter-spacing: 5px;
        text-transform: uppercase;
        color: #C9A84C;
      }

      .brand-sub {
        font-size: 8px;
        letter-spacing: 3px;
        color: #666;
        margin-top: 3px;
        text-transform: uppercase;
      }

      .header-logo-wrap {
        width: 42px; height: 42px;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid rgba(201,168,76,0.2);
        display: flex; align-items: center; justify-content: center;
        background: #111;
      }

      .header-logo-wrap img { width: 100%; height: 100%; object-fit: contain; }
      .header-logo-placeholder { font-size: 7px; letter-spacing: 1px; color: #444; }

      .p1-hero {
        height: 142px;
        flex-shrink: 0;
        padding: 0 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative; z-index: 1;
        overflow: hidden;
      }

      .hero-eyebrow {
        font-size: 8px;
        letter-spacing: 6px;
        color: #C9A84C;
        text-transform: uppercase;
        margin-bottom: 8px;
      }

      .hero-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: 26px;
        font-weight: 300;
        line-height: 0.88;
        color: #F5F0E8;
        letter-spacing: -1px;
      }

      .hero-model {
        font-family: 'Cormorant Garamond', serif;
        font-size: 20px;
        font-weight: 400;
        color: #C9A84C;
        letter-spacing: 4px;
        margin-top: 6px;
      }

      .hero-divider {
        width: 36px; height: 1px;
        background: #C9A84C;
        margin: 10px 0;
      }

      .hero-specs-inline {
        font-size: 9px;
        letter-spacing: 2px;
        color: #666;
        text-transform: uppercase;
      }

      .hero-right { text-align: right; flex-shrink: 0; }

      .hero-price-label {
        font-size: 8px;
        letter-spacing: 3px;
        color: #666;
        text-transform: uppercase;
        margin-bottom: 5px;
      }

      .hero-price {
        font-family: 'Cormorant Garamond', serif;
        font-size: 28px;
        font-weight: 600;
        color: #C9A84C;
      }

      .p1-gallery {
        height: 310px;
        flex-shrink: 0;
        padding: 10px 12px 0;
        display: flex;
        flex-direction: column;
        position: relative; z-index: 1;
      }

      .section-label {
        height: 26px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
      }

      .section-label-text {
        font-size: 7px;
        letter-spacing: 5px;
        text-transform: uppercase;
        color: #9A7A2E;
        white-space: nowrap;
      }

      .section-label-line {
        flex: 1; height: 1px;
        background: rgba(201,168,76,0.12);
      }

      .gallery-hero-grid {
        flex: 1;
        display: grid;
        grid-template-columns: 1.5fr 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 4px;
        overflow: hidden;
      }

      .photo-main { grid-row: span 2; overflow: hidden; }

      .photo-cell {
        overflow: hidden;
        background: #1A1A1A;
        position: relative;
      }

      .photo-cell::after {
        content: '';
        position: absolute; inset: 0;
        background: linear-gradient(135deg, rgba(201,168,76,0.05) 0%, transparent 60%);
        pointer-events: none;
      }

      .photo-cell img, .photo-main img {
        width: 100%; height: 100%;
        object-fit: cover; display: block;
        filter: brightness(0.88) contrast(1.04);
      }

      /* Orientation-aware image rendering */
      .photo-portrait img {
        width: auto !important;
        height: 100% !important;
        max-width: 100%;
        margin: 0 auto;
      }

      .photo-landscape img {
        width: 100% !important;
        height: auto !important;
        max-height: 100%;
        margin: auto 0;
      }

      .p1-specs {
        flex: 1;
        padding: 12px 24px 0;
        display: flex;
        flex-direction: column;
        position: relative; z-index: 1;
      }

      .specs-grid {
        flex: 1;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1px;
        background: rgba(201,168,76,0.08);
        border: 1px solid rgba(201,168,76,0.08);
        overflow: hidden;
      }

      .spec-cell {
        background: #111;
        padding: 12px 14px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .spec-cell.desc-cell {
        grid-column: span 3;
        background: #161616;
        padding: 14px 18px;
      }

      .spec-key {
        font-size: 7px;
        letter-spacing: 3px;
        text-transform: uppercase;
        color: #9A7A2E;
        margin-bottom: 5px;
      }

      .spec-val {
        font-family: 'Cormorant Garamond', serif;
        font-size: 16px;
        font-weight: 600;
        color: #F5F0E8;
      }

      .spec-desc {
        font-family: 'Cormorant Garamond', serif;
        font-size: 13px;
        font-style: italic;
        font-weight: 400;
        color: #888;
        line-height: 1.6;
        letter-spacing: 0.3px;
      }

      .page-footer {
        height: 36px;
        flex-shrink: 0;
        padding: 0 12px;
        border-top: 1px solid rgba(201,168,76,0.1);
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative; z-index: 1;
      }

      .footer-brand {
        font-family: 'Cormorant Garamond', serif;
        font-size: 9px;
        letter-spacing: 3px;
        color: rgba(201,168,76,0.35);
        text-transform: uppercase;
      }

      .footer-dot { width: 3px; height: 3px; border-radius: 50%; background: #C9A84C; opacity: 0.35; }
      .footer-page { font-size: 8px; letter-spacing: 2px; color: #555; }
      .footer-date { font-size: 8px; letter-spacing: 2px; color: #555; }

      .gallery-page-header {
        height: 50px;
        flex-shrink: 0;
        padding: 0 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid rgba(201,168,76,0.1);
        position: relative; z-index: 1;
      }

      .gph-brand {
        font-family: 'Cormorant Garamond', serif;
        font-size: 11px;
        letter-spacing: 4px;
        color: #9A7A2E;
        text-transform: uppercase;
      }

      .gph-model {
        font-size: 8px;
        letter-spacing: 3px;
        color: #555;
        text-transform: uppercase;
      }

      .gallery-page-content {
        flex: 1;
        padding: 12px 24px 8px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        position: relative; z-index: 1;
      }

      .gallery-grid-3x2 {
        flex: 1;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 4px;
        overflow: hidden;
      }

      .gallery-grid-3x2 .photo-cell {
        overflow: hidden;
        background: #1A1A1A;
        height: 100%;
        position: relative;
      }

      .gallery-grid-3x2 .photo-cell::after {
        content: '';
        position: absolute; inset: 0;
        background: linear-gradient(135deg, rgba(201,168,76,0.04) 0%, transparent 60%);
        pointer-events: none;
      }

      .gallery-grid-3x2 .photo-cell img {
        width: 100%; height: 100%;
        object-fit: cover; display: block;
        filter: brightness(0.88) contrast(1.04);
      }

      .gallery-grid-last {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
        overflow: hidden;
      }

      .gallery-last-row {
        flex: 1;
        display: grid;
        gap: 4px;
        overflow: hidden;
      }

      .gallery-last-row .photo-cell {
        overflow: hidden;
        background: #1A1A1A;
        position: relative;
      }

      .gallery-last-row .photo-cell img {
        width: 100%; height: 100%;
        object-fit: cover; display: block;
        filter: brightness(0.88) contrast(1.04);
      }

      .photo-cell.empty { background: #0D0D0D; }

      .total-badge {
        height: 28px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        margin-top: 8px;
      }

      .total-line { flex: 1; height: 1px; background: rgba(201,168,76,0.1); }
      .total-text { font-size: 7px; letter-spacing: 4px; color: #9A7A2E; text-transform: uppercase; }
    </style>
    `;
  }

  // GREEN THEME: Yeşil Ofis (badge)
  if (name === 'Premium Yeşil' || name === 'Yeşil' || layout.headerStyle === 'badge') {
    return `
    <style>
      @page {
        margin: 0;
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      body {
        background: transparent;
        font-family: 'Space Grotesk', sans-serif;
        display: block;
        margin: 0;
        padding: 0;
      }

      .page {
        width: 100vw;
        height: 100vh;
        background: #0A1F0F;
        color: #F0EDE0;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        page-break-after: always;
        page-break-inside: avoid;
        break-after: page;
        break-inside: avoid;
      }

      .page:last-child {
        page-break-after: avoid;
        break-after: avoid;
      }

      .page-last {
        page-break-after: avoid !important;
        break-after: avoid !important;
      }

      .page::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; height: 1px;
        background: linear-gradient(90deg, transparent, #D4AF37, #4CAF50, #D4AF37, transparent);
        z-index: 20;
      }

      .page::after {
        content: '';
        position: absolute; inset: 0;
        background:
          radial-gradient(ellipse at 90% 0%, rgba(76,175,80,0.05) 0%, transparent 45%),
          radial-gradient(ellipse at 10% 100%, rgba(212,175,55,0.04) 0%, transparent 35%);
        pointer-events: none; z-index: 0;
      }

      .page > * { position: relative; z-index: 1; }

      .p1-header {
        height: 64px;
        flex-shrink: 0;
        padding: 0 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid rgba(212,175,55,0.12);
      }

      .brand-name {
        font-family: 'Unbounded', sans-serif;
        font-size: 12px;
        font-weight: 400;
        letter-spacing: 2px;
        color: #F0EDE0;
      }

      .brand-sub {
        font-size: 7px;
        letter-spacing: 5px;
        color: #6A8A6A;
        text-transform: uppercase;
        margin-top: 4px;
      }

      .header-badge {
        display: flex;
        align-items: center;
        gap: 7px;
        border: 1px solid rgba(212,175,55,0.25);
        padding: 5px 12px;
      }

      .header-badge-dot {
        width: 5px; height: 5px;
        border-radius: 50%;
        background: #4CAF50;
        box-shadow: 0 0 6px #4CAF50;
      }

      .header-badge-text {
        font-size: 7px;
        letter-spacing: 4px;
        color: #D4AF37;
        text-transform: uppercase;
      }

      .p1-hero {
        height: 136px;
        flex-shrink: 0;
        padding: 0 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        overflow: hidden;
      }

      .p1-hero::before {
        content: '';
        position: absolute; inset: 0;
        background-image:
          linear-gradient(rgba(212,175,55,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(212,175,55,0.025) 1px, transparent 1px);
        background-size: 36px 36px;
      }

      .hero-tag {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 14px;
      }

      .hero-tag-line { width: 20px; height: 1px; background: #D4AF37; }
      .hero-tag-text { font-size: 8px; letter-spacing: 5px; color: #D4AF37; text-transform: uppercase; }

      .hero-title {
        font-family: 'Unbounded', sans-serif;
        font-size: 44px;
        font-weight: 900;
        line-height: 0.9;
        color: #F0EDE0;
        letter-spacing: -2px;
      }

      .hero-model {
        font-family: 'Unbounded', sans-serif;
        font-size: 13px;
        font-weight: 300;
        letter-spacing: 7px;
        color: #D4AF37;
        margin-top: 8px;
        text-transform: uppercase;
      }

      .price-box {
        border: 1px solid rgba(212,175,55,0.25);
        padding: 14px 18px;
        background: rgba(212,175,55,0.04);
        text-align: right;
        flex-shrink: 0;
      }

      .price-label { font-size: 7px; letter-spacing: 4px; color: #6A8A6A; text-transform: uppercase; margin-bottom: 6px; }
      .price-val { font-family: 'Unbounded', sans-serif; font-size: 20px; font-weight: 700; color: #F0D060; }
      .price-currency { font-size: 11px; color: #D4AF37; font-weight: 300; }

      .p1-gallery {
        height: 304px;
        flex-shrink: 0;
        padding: 12px 24px 0;
        display: flex;
        flex-direction: column;
      }

      .section-label {
        height: 26px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
      }

      .section-num { font-family: 'Unbounded', sans-serif; font-size: 9px; color: #D4AF37; opacity: 0.4; }
      .section-label-text { font-size: 7px; letter-spacing: 5px; text-transform: uppercase; color: #6A8A6A; white-space: nowrap; }
      .section-label-line { flex: 1; height: 1px; background: rgba(212,175,55,0.1); }

      .gallery-hero-grid {
        flex: 1;
        display: grid;
        grid-template-columns: 1.5fr 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 4px;
        overflow: hidden;
      }

      .photo-main { grid-row: span 2; overflow: hidden; }

      .photo-cell {
        overflow: hidden;
        background: #153018;
        position: relative;
      }

      .photo-cell::after {
        content: '';
        position: absolute; inset: 0;
        border: 1px solid rgba(212,175,55,0.06);
        pointer-events: none;
      }

      .photo-cell img, .photo-main img {
        width: 100%; height: 100%;
        object-fit: cover; display: block;
        filter: brightness(0.85) contrast(1.05) saturate(0.9);
      }

      /* Orientation-aware image rendering */
      .photo-portrait img {
        width: auto !important;
        height: 100% !important;
        max-width: 100%;
        margin: 0 auto;
      }

      .photo-landscape img {
        width: 100% !important;
        height: auto !important;
        max-height: 100%;
        margin: auto 0;
      }

      .p1-specs {
        flex: 1;
        padding: 12px 24px 0;
        display: flex;
        flex-direction: column;
      }

      .specs-grid {
        flex: 1;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1px;
        background: rgba(212,175,55,0.07);
        overflow: hidden;
      }

      .spec-cell {
        background: #0D2614;
        padding: 11px 14px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .spec-cell.desc-cell {
        grid-column: span 3;
        background: #1E4020;
        padding: 13px 16px;
      }

      .spec-key { font-size: 7px; letter-spacing: 4px; text-transform: uppercase; color: #6A8A6A; margin-bottom: 6px; }

      .spec-val {
        font-family: 'Unbounded', sans-serif;
        font-size: 12px;
        font-weight: 400;
        color: #F0EDE0;
      }

      .spec-desc {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 12px;
        font-style: italic;
        font-weight: 300;
        color: #6A8A6A;
        line-height: 1.6;
        letter-spacing: 0.2px;
      }

      .page-footer {
        height: 36px;
        flex-shrink: 0;
        padding: 0 12px;
        border-top: 1px solid rgba(212,175,55,0.08);
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .footer-left { display: flex; align-items: center; gap: 7px; }
      .footer-dot-green { width: 4px; height: 4px; border-radius: 50%; background: #4CAF50; box-shadow: 0 0 5px #4CAF50; }
      .footer-brand { font-size: 7px; letter-spacing: 4px; color: #6A8A6A; text-transform: uppercase; }
      .footer-center { font-size: 7px; letter-spacing: 2px; color: #6A8A6A; }
      .footer-date { font-size: 7px; letter-spacing: 2px; color: rgba(106,138,106,0.5); }

      .gallery-page-header {
        height: 24px;
        flex-shrink: 0;
        padding: 0 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid rgba(212,175,55,0.08);
      }

      .gph-brand { font-family: 'Unbounded', sans-serif; font-size: 10px; color: #9A7A2E; letter-spacing: 2px; }
      .gph-model { font-size: 7px; letter-spacing: 3px; color: #6A8A6A; text-transform: uppercase; }

      .gallery-page-content {
        flex: 1;
        padding: 12px 24px 8px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .gallery-grid-3x2 {
        flex: 1;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 4px;
        overflow: hidden;
      }

      .gallery-grid-3x2 .photo-cell {
        overflow: hidden;
        background: #153018;
        height: 100%;
        position: relative;
      }

      .gallery-grid-3x2 .photo-cell::after {
        content: '';
        position: absolute; inset: 0;
        border: 1px solid rgba(212,175,55,0.05);
        pointer-events: none;
      }

      .gallery-grid-3x2 .photo-cell img {
        width: 100%; height: 100%;
        object-fit: cover; display: block;
        filter: brightness(0.85) contrast(1.05) saturate(0.9);
      }

      .gallery-grid-last {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
        overflow: hidden;
      }

      .gallery-last-row { flex: 1; display: grid; gap: 4px; overflow: hidden; }

      .gallery-last-row .photo-cell {
        overflow: hidden;
        background: #153018;
        position: relative;
      }

      .gallery-last-row .photo-cell img {
        width: 100%; height: 100%;
        object-fit: cover; display: block;
        filter: brightness(0.85) contrast(1.05) saturate(0.9);
      }

      .photo-cell.empty { background: #0A1F0F; }

      .total-badge {
        height: 28px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        margin-top: 8px;
      }

      .total-line { flex: 1; height: 1px; background: rgba(212,175,55,0.08); }
      .total-text { font-size: 7px; letter-spacing: 4px; color: #6A8A6A; text-transform: uppercase; font-family: 'Unbounded', sans-serif; }
    </style>
    `;
  }

  // VINTAGE THEME: Bej Vintage (ornament)
  if (name === 'Premium Vintage' || name === 'Bej Vintage' || layout.headerStyle === 'ornament') {
    return `
    <style>
      @page {
        margin: 0;
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      body {
        background: transparent;
        font-family: 'Jost', sans-serif;
        display: block;
        margin: 0;
        padding: 0;
      }

      .page {
        width: 100vw;
        height: 100vh;
        background: #F5EDD8;
        color: #2A1A0C;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        page-break-after: always;
        page-break-inside: avoid;
        break-after: page;
        break-inside: avoid;
      }

      .page:last-child {
        page-break-after: avoid;
        break-after: avoid;
      }

      .page-last {
        page-break-after: avoid !important;
        break-after: avoid !important;
      }

      .page-inner {
        margin: 12px;
        border: 1px solid #D4C4A0;
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .p1-header {
        height: 64px;
        flex-shrink: 0;
        padding: 0 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #D4C4A0;
        background: #EDE0C4;
      }

      .brand-name {
        font-family: 'Libre Baskerville', serif;
        font-size: 16px;
        font-weight: 700;
        color: #2A1A0C;
      }

      .brand-sub {
        font-size: 7px;
        letter-spacing: 5px;
        color: #A08060;
        text-transform: uppercase;
        margin-top: 3px;
      }

      .header-right { display: flex; align-items: center; gap: 12px; }
      .header-ornament { font-family: 'Libre Baskerville', serif; font-size: 20px; color: #D4C4A0; font-style: italic; }
      .header-label { font-size: 7px; letter-spacing: 4px; color: #A08060; text-transform: uppercase; }

      .p1-hero {
        height: 130px;
        flex-shrink: 0;
        padding: 0 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #2A1A0C;
        position: relative;
        overflow: hidden;
      }

      .p1-hero::before {
        content: '';
        position: absolute;
        right: 0; top: 0; bottom: 0;
        width: 160px;
        background: repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(164,128,96,0.04) 8px, rgba(164,128,96,0.04) 9px);
      }

      .hero-eyebrow { font-size: 7px; letter-spacing: 6px; color: #A08060; text-transform: uppercase; margin-bottom: 10px; }

      .hero-title {
        font-family: 'Libre Baskerville', serif;
        font-size: 46px;
        font-weight: 700;
        color: #F5EDD8;
        line-height: 0.9;
      }

      .hero-model {
        font-family: 'Libre Baskerville', serif;
        font-size: 16px;
        font-weight: 400;
        font-style: italic;
        color: #A08060;
        margin-top: 7px;
        letter-spacing: 3px;
      }

      .hero-right { text-align: right; flex-shrink: 0; }

      .year-badge {
        border: 1px solid #A08060;
        padding: 6px 14px;
        font-size: 9px;
        letter-spacing: 4px;
        color: #D4C4A0;
        text-transform: uppercase;
        margin-bottom: 8px;
        display: inline-block;
      }

      .hero-price-label { font-size: 7px; letter-spacing: 3px; color: #A08060; text-transform: uppercase; margin-bottom: 4px; }

      .hero-price {
        font-family: 'Libre Baskerville', serif;
        font-size: 20px;
        font-weight: 700;
        color: #F5EDD8;
      }

      .p1-gallery {
        height: 306px;
        flex-shrink: 0;
        padding: 12px 16px 0;
        display: flex;
        flex-direction: column;
        border-bottom: 1px solid #D4C4A0;
      }

      .section-label {
        height: 26px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 8px;
      }

      .section-ornament { font-family: 'Libre Baskerville', serif; font-style: italic; font-size: 11px; color: #A08060; }
      .section-label-text { font-size: 7px; letter-spacing: 5px; text-transform: uppercase; color: #7A5C3C; white-space: nowrap; }
      .section-label-line { flex: 1; height: 1px; background: #D4C4A0; }

      .gallery-hero-grid {
        flex: 1;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 5px;
        overflow: hidden;
      }

      .photo-main { grid-row: span 2; overflow: hidden; }

      .photo-cell {
        overflow: hidden;
        background: #EDE0C4;
      }

      .photo-cell img, .photo-main img {
        width: 100%; height: 100%;
        object-fit: cover; display: block;
        filter: brightness(0.92) sepia(8%);
      }

      /* Orientation-aware image rendering */
      .photo-portrait img {
        width: auto !important;
        height: 100% !important;
        max-width: 100%;
        margin: 0 auto;
      }

      .photo-landscape img {
        width: 100% !important;
        height: auto !important;
        max-height: 100%;
        margin: auto 0;
      }

      .p1-specs {
        flex: 1;
        padding: 12px 16px 0;
        display: flex;
        flex-direction: column;
      }

      .specs-table-wrap {
        flex: 1;
        overflow: hidden;
      }

      .specs-table {
        width: 100%;
        border-collapse: collapse;
        height: 100%;
      }

      .specs-table tr { border-bottom: 1px solid #EDE0C4; }
      .specs-table tr:last-child { border-bottom: none; }

      .specs-table td { padding: 9px 0; vertical-align: middle; }

      .specs-table td.key {
        font-size: 7px;
        letter-spacing: 4px;
        text-transform: uppercase;
        color: #A08060;
        width: 120px;
      }

      .specs-table td.val {
        font-family: 'Libre Baskerville', serif;
        font-size: 13px;
        color: #2A1A0C;
      }

      .specs-table tr.desc-row td {
        padding: 12px 0;
      }

      .specs-table td.desc-val {
        font-family: 'Libre Baskerville', serif;
        font-size: 12px;
        font-style: italic;
        color: #7A5C3C;
        line-height: 1.65;
      }

      .page-footer {
        height: 36px;
        flex-shrink: 0;
        padding: 0 16px;
        background: #EDE0C4;
        border-top: 1px solid #D4C4A0;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .footer-brand { font-family: 'Libre Baskerville', serif; font-size: 9px; font-style: italic; color: #A08060; }
      .footer-dot { width: 3px; height: 3px; border-radius: 50%; background: #A08060; opacity: 0.5; }
      .footer-page { font-size: 7px; letter-spacing: 3px; color: #A08060; }
      .footer-date { font-size: 7px; letter-spacing: 2px; color: #A08060; }

      .gallery-page-header {
        height: 24px;
        flex-shrink: 0;
        padding: 0 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #D4C4A0;
        background: #EDE0C4;
      }

      .gph-brand { font-family: 'Libre Baskerville', serif; font-size: 13px; color: #2A1A0C; }
      .gph-model { font-size: 7px; letter-spacing: 3px; color: #A08060; text-transform: uppercase; }

      .gallery-page-content {
        flex: 1;
        padding: 12px 16px 8px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .gallery-grid-3x2 {
        flex: 1;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 5px;
        overflow: hidden;
      }

      .gallery-grid-3x2 .photo-cell {
        overflow: hidden;
        background: #EDE0C4;
        height: 100%;
      }

      .gallery-grid-3x2 .photo-cell img {
        width: 100%; height: 100%;
        object-fit: cover; display: block;
        filter: brightness(0.92) sepia(8%);
      }

      .gallery-grid-last {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 5px;
        overflow: hidden;
      }

      .gallery-last-row { flex: 1; display: grid; gap: 5px; overflow: hidden; }

      .gallery-last-row .photo-cell {
        overflow: hidden;
        background: #EDE0C4;
      }

      .gallery-last-row .photo-cell img {
        width: 100%; height: 100%;
        object-fit: cover; display: block;
        filter: brightness(0.92) sepia(8%);
      }

      .photo-cell.empty { background: #F0E8D4; }

      .total-badge {
        height: 28px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        margin-top: 8px;
      }

      .total-line { flex: 1; height: 1px; background: #D4C4A0; }
      .total-text { font-size: 7px; letter-spacing: 4px; color: #A08060; text-transform: uppercase; font-family: 'Libre Baskerville', serif; font-style: italic; }
    </style>
    `;
  }

  // ── BURGUNDY GOLD THEME ──────────────────────────────────
  if (name === 'Bordo Altın' || layout.headerStyle === 'burgundy') {
    return `
    <style>
      @page { margin: 0; }
      * { margin: 0; padding: 0; box-sizing: border-box;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important; }
      html { width: 100%; margin: 0; padding: 0; background: transparent; }
      body { width: 100%; margin: 0; padding: 0; background: transparent; display: block; font-family: 'Josefin Sans', sans-serif; }

      .page {
        width: 100vw; height: 100vh;
        background: #1A0608; color: #F8F0E0;
        position: relative; overflow: hidden;
        display: flex; flex-direction: column; flex-shrink: 0;
        page-break-after: always; page-break-inside: avoid;
        break-after: page; break-inside: avoid;
      }
      .page:last-child { page-break-after: avoid; break-after: avoid; }
      .page-last { page-break-after: avoid !important; break-after: avoid !important; }
      .page::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
        background: linear-gradient(90deg, transparent, #8A6808, #F0CC50, #E0B020, #F0CC50, #8A6808, transparent); z-index: 20; }
      .page::after { content: ''; position: absolute; inset: 0;
        background: radial-gradient(ellipse at 50% 0%, rgba(200,150,10,0.06) 0%, transparent 50%);
        pointer-events: none; z-index: 0; }
      .page > * { position: relative; z-index: 1; }
      .frame { position: absolute; inset: 10px; border: 1px solid rgba(200,150,10,0.15); pointer-events: none; z-index: 10; }
      .corner { position: absolute; width: 22px; height: 22px; z-index: 20; }
      .corner.tl { top: 16px; left: 16px; border-top: 1px solid #C8960A; border-left: 1px solid #C8960A; }
      .corner.tr { top: 16px; right: 16px; border-top: 1px solid #C8960A; border-right: 1px solid #C8960A; }
      .corner.bl { bottom: 16px; left: 16px; border-bottom: 1px solid #C8960A; border-left: 1px solid #C8960A; }
      .corner.br { bottom: 16px; right: 16px; border-bottom: 1px solid #C8960A; border-right: 1px solid #C8960A; }

      .p1-header { height: 64px; flex-shrink: 0; padding: 0 48px; display: flex; align-items: center;
        justify-content: space-between; border-bottom: 1px solid rgba(200,150,10,0.12); }
      .brand-name { font-family: 'IM Fell English', serif; font-size: 17px; font-weight: 400; color: #E0B020; letter-spacing: 1px; }
      .brand-sub { font-size: 7px; letter-spacing: 5px; color: #8A6050; margin-top: 3px; text-transform: uppercase; }
      .header-right { display: flex; align-items: center; gap: 10px; }
      .header-ornament { font-family: 'IM Fell English', serif; font-size: 20px; color: rgba(200,150,10,0.3); font-style: italic; }
      .header-label { font-size: 7px; letter-spacing: 4px; color: #8A6050; text-transform: uppercase; }

      .p1-hero { height: 132px; flex-shrink: 0; padding: 0 48px; display: flex; align-items: center;
        justify-content: space-between; background: #280A0E; border-bottom: 1px solid rgba(200,150,10,0.1);
        position: relative; overflow: hidden; }
      .p1-hero::before { content: ''; position: absolute; right: 0; top: 0; bottom: 0; width: 200px;
        background: repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(200,150,10,0.02) 10px, rgba(200,150,10,0.02) 11px); }
      .hero-eyebrow { font-size: 7px; letter-spacing: 6px; color: #8A6808; text-transform: uppercase; margin-bottom: 10px; }
      .hero-title { font-family: 'IM Fell English', serif; font-size: 52px; font-weight: 400; line-height: 0.9; color: #F8F0E0; letter-spacing: 1px; }
      .hero-model { font-family: 'IM Fell English', serif; font-size: 18px; font-style: italic; color: #C8960A; letter-spacing: 3px; margin-top: 8px; }
      .hero-right { text-align: right; flex-shrink: 0; }
      .year-badge { border: 1px solid rgba(200,150,10,0.3); padding: 5px 14px; font-size: 9px; letter-spacing: 4px; color: #C8960A; text-transform: uppercase; margin-bottom: 10px; display: inline-block; }
      .price-label { font-size: 7px; letter-spacing: 3px; color: #8A6050; text-transform: uppercase; margin-bottom: 4px; }
      .price-val { font-family: 'IM Fell English', serif; font-size: 22px; color: #E0B020; }

      .p1-gallery { height: 308px; flex-shrink: 0; padding: 12px 48px 0; display: flex; flex-direction: column;
        border-bottom: 1px solid rgba(200,150,10,0.08); }
      .section-label { height: 24px; flex-shrink: 0; display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
      .section-ornament { font-family: 'IM Fell English', serif; font-style: italic; font-size: 12px; color: #8A6808; }
      .section-label-text { font-size: 7px; letter-spacing: 5px; text-transform: uppercase; color: #8A6050; white-space: nowrap; }
      .section-label-line { flex: 1; height: 1px; background: rgba(200,150,10,0.1); }

      .p1-specs { flex: 1; padding: 12px 48px 0; display: flex; flex-direction: column; }
      .specs-table-wrap { flex: 1; overflow: hidden; }
      .specs-table { width: 100%; border-collapse: collapse; }
      .specs-table tr { border-bottom: 1px solid rgba(200,150,10,0.08); }
      .specs-table tr:last-child { border-bottom: none; }
      .specs-table td { padding: 10px 0; vertical-align: middle; }
      .specs-table td.key { font-size: 7px; letter-spacing: 4px; text-transform: uppercase; color: #8A6050; width: 130px; }
      .specs-table td.val { font-family: 'IM Fell English', serif; font-size: 14px; color: #F8F0E0; }
      .specs-table td.desc-val { font-family: 'IM Fell English', serif; font-size: 13px; font-style: italic; color: #8A6050; line-height: 1.6; }

      .page-footer { height: 36px; flex-shrink: 0; padding: 0 48px; border-top: 1px solid rgba(200,150,10,0.1);
        display: flex; align-items: center; justify-content: space-between; }
      .footer-brand { font-family: 'IM Fell English', serif; font-size: 9px; font-style: italic; color: rgba(200,150,10,0.3); }
      .footer-dot { width: 3px; height: 3px; border-radius: 50%; background: #8A6808; opacity: 0.4; }
      .footer-page { font-size: 7px; letter-spacing: 2px; color: #8A6050; }
      .footer-date { font-size: 7px; letter-spacing: 2px; color: #8A6050; }

      .gallery-page-header { height: 48px; flex-shrink: 0; padding: 0 48px; display: flex; align-items: center;
        justify-content: space-between; border-bottom: 1px solid rgba(200,150,10,0.1); background: #280A0E; }
      .gph-brand { font-family: 'IM Fell English', serif; font-size: 14px; color: #C8960A; }
      .gph-model { font-size: 7px; letter-spacing: 3px; color: #8A6050; text-transform: uppercase; }
      .gallery-page-content { flex: 1; padding: 12px 48px 8px; display: flex; flex-direction: column; overflow: hidden; }

      .photo-cell { overflow: hidden; background: #380E14; position: relative; min-height: 0; }
      .photo-cell img { width: 100%; height: 100%; object-fit: cover; display: block; filter: brightness(0.88) contrast(1.05) sepia(5%); }

      .total-badge { height: 28px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; gap: 14px; margin-top: 8px; }
      .total-line { flex: 1; height: 1px; background: rgba(200,150,10,0.1); }
      .total-text { font-size: 7px; letter-spacing: 4px; color: #8A6050; text-transform: uppercase; font-family: 'IM Fell English', serif; font-style: italic; }
    </style>
    `;
  }

  // ── NAVY SILVER THEME ─────────────────────────────────────
  if (name === 'Lacivert Gümüş' || layout.headerStyle === 'navySilver') {
    return `
    <style>
      @page { margin: 0; }
      * { margin: 0; padding: 0; box-sizing: border-box;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important; }
      html { width: 100%; margin: 0; padding: 0; background: transparent; }
      body { width: 100%; margin: 0; padding: 0; background: transparent; display: block; font-family: 'Raleway', sans-serif; }

      .page {
        width: 100vw; height: 100vh;
        background: #0B1628; color: #EEF4F8;
        position: relative; overflow: hidden;
        display: flex; flex-direction: column; flex-shrink: 0;
        page-break-after: always; page-break-inside: avoid;
        break-after: page; break-inside: avoid;
      }
      .page:last-child { page-break-after: avoid; break-after: avoid; }
      .page-last { page-break-after: avoid !important; break-after: avoid !important; }
      .page::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
        background: linear-gradient(90deg, transparent, #A0B4C8, #E8F0F8, #A0B4C8, transparent); z-index: 20; }
      .page::after { content: ''; position: absolute; inset: 0;
        background: radial-gradient(ellipse at 85% 5%, rgba(74,144,200,0.08) 0%, transparent 45%);
        pointer-events: none; z-index: 0; }
      .page > * { position: relative; z-index: 1; }

      .p1-header { height: 66px; flex-shrink: 0; padding: 0 48px; display: flex; align-items: center;
        justify-content: space-between; border-bottom: 1px solid rgba(200,212,224,0.1); background: rgba(18,32,64,0.8); }
      .brand-name { font-family: 'Cinzel', serif; font-size: 13px; font-weight: 600; letter-spacing: 4px; color: #E8F0F8; text-transform: uppercase; }
      .brand-sub { font-size: 8px; letter-spacing: 4px; color: #7A96B0; margin-top: 3px; text-transform: uppercase; }
      .header-badge { display: flex; align-items: center; gap: 8px; border: 1px solid rgba(200,212,224,0.2);
        padding: 5px 14px; background: rgba(74,144,200,0.06); }
      .header-badge-line { width: 16px; height: 1px; background: #A0B4C8; }
      .header-badge-text { font-size: 7px; letter-spacing: 4px; color: #A0B4C8; text-transform: uppercase; }

      .p1-hero { height: 138px; flex-shrink: 0; padding: 0 48px; display: flex; align-items: center;
        justify-content: space-between; background: #122040; border-bottom: 1px solid rgba(200,212,224,0.08);
        position: relative; overflow: hidden; }
      .p1-hero::before { content: ''; position: absolute; inset: 0;
        background: repeating-linear-gradient(-55deg, transparent, transparent 20px, rgba(74,144,200,0.02) 20px, rgba(74,144,200,0.02) 21px); }
      .hero-eyebrow { font-size: 7px; letter-spacing: 6px; color: #6AAEE0; text-transform: uppercase; margin-bottom: 10px;
        display: flex; align-items: center; gap: 8px; }
      .hero-eyebrow::before { content: ''; width: 20px; height: 1px; background: #6AAEE0; }
      .hero-title { font-family: 'Cinzel', serif; font-size: 48px; font-weight: 700; line-height: 0.9; color: #E8F0F8; letter-spacing: 2px; }
      .hero-model { font-family: 'Raleway', sans-serif; font-size: 16px; font-weight: 200; letter-spacing: 8px; color: #A0B4C8; margin-top: 8px; text-transform: uppercase; }
      .hero-right { text-align: right; flex-shrink: 0; position: relative; z-index: 1; }
      .price-box { border: 1px solid rgba(200,212,224,0.15); padding: 14px 20px; background: rgba(74,144,200,0.05); text-align: right; }
      .price-label { font-size: 7px; letter-spacing: 4px; color: #7A96B0; text-transform: uppercase; margin-bottom: 6px; }
      .price-val { font-family: 'Cinzel', serif; font-size: 22px; font-weight: 600; color: #E8F0F8; letter-spacing: 1px; }

      .p1-gallery { height: 308px; flex-shrink: 0; padding: 14px 48px 0; display: flex; flex-direction: column; }
      .section-label { height: 26px; flex-shrink: 0; display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
      .section-label-text { font-size: 7px; letter-spacing: 5px; text-transform: uppercase; color: #7A96B0; white-space: nowrap; }
      .section-label-line { flex: 1; height: 1px; background: rgba(200,212,224,0.1); }

      .p1-specs { flex: 1; padding: 12px 48px 0; display: flex; flex-direction: column; }
      .specs-grid { flex: 1; display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px;
        background: rgba(200,212,224,0.06); overflow: hidden; }
      .spec-cell { background: #122040; padding: 12px 14px; display: flex; flex-direction: column; justify-content: center; }
      .spec-cell.desc-cell { grid-column: span 3; background: rgba(74,144,200,0.04); border-top: 1px solid rgba(74,144,200,0.1); padding: 13px 16px; }
      .spec-key { font-size: 7px; letter-spacing: 3px; text-transform: uppercase; color: #7A96B0; margin-bottom: 5px; }
      .spec-val { font-family: 'Cinzel', serif; font-size: 14px; font-weight: 400; color: #E8F0F8; }
      .spec-desc { font-family: 'Raleway', sans-serif; font-size: 12px; font-style: italic; font-weight: 300; color: #728AA0; line-height: 1.65; }

      .page-footer { height: 36px; flex-shrink: 0; padding: 0 48px; border-top: 1px solid rgba(200,212,224,0.08);
        display: flex; align-items: center; justify-content: space-between; background: rgba(18,32,64,0.6); }
      .footer-brand { font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 3px; color: rgba(200,212,224,0.3); text-transform: uppercase; }
      .footer-dot { width: 3px; height: 3px; border-radius: 50%; background: #A0B4C8; opacity: 0.3; }
      .footer-page { font-size: 7px; letter-spacing: 2px; color: #7A96B0; }
      .footer-date { font-size: 7px; letter-spacing: 2px; color: #7A96B0; }

      .gallery-page-header { height: 50px; flex-shrink: 0; padding: 0 48px; display: flex; align-items: center;
        justify-content: space-between; border-bottom: 1px solid rgba(200,212,224,0.08); background: rgba(18,32,64,0.8); }
      .gph-brand { font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 3px; color: #A0B4C8; text-transform: uppercase; }
      .gph-model { font-size: 7px; letter-spacing: 3px; color: #7A96B0; text-transform: uppercase; }
      .gallery-page-content { flex: 1; padding: 12px 48px 8px; display: flex; flex-direction: column; overflow: hidden; }

      .photo-cell { overflow: hidden; background: #1A2E55; position: relative; min-height: 0; }
      .photo-cell img { width: 100%; height: 100%; object-fit: cover; display: block; filter: brightness(0.88) contrast(1.04) saturate(0.95); }

      .total-badge { height: 28px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; gap: 14px; margin-top: 8px; }
      .total-line { flex: 1; height: 1px; background: rgba(200,212,224,0.08); }
      .total-text { font-size: 7px; letter-spacing: 4px; color: #7A96B0; text-transform: uppercase; font-family: 'Cinzel', sans-serif; }
    </style>
    `;
  }

  // ── COPPER MIDNIGHT THEME ─────────────────────────────────
  if (name === 'Bakır' || layout.headerStyle === 'copper') {
    return `
    <style>
      @page { margin: 0; }
      * { margin: 0; padding: 0; box-sizing: border-box;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important; }
      html { width: 100%; margin: 0; padding: 0; background: transparent; }
      body { width: 100%; margin: 0; padding: 0; background: transparent; display: block; font-family: 'Outfit', sans-serif; }

      .page {
        width: 100vw; height: 100vh;
        background: #080C14; color: #E8EEF8;
        position: relative; overflow: hidden;
        display: flex; flex-direction: column; flex-shrink: 0;
        page-break-after: always; page-break-inside: avoid;
        break-after: page; break-inside: avoid;
      }
      .page:last-child { page-break-after: avoid; break-after: avoid; }
      .page-last { page-break-after: avoid !important; break-after: avoid !important; }
      .page::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
        background: linear-gradient(90deg, transparent, #6A3E20, #E8A060, #F0C090, #E8A060, #6A3E20, transparent); z-index: 20; }
      .page::after { content: ''; position: absolute; inset: 0;
        background: radial-gradient(ellipse at 20% 0%, rgba(184,112,64,0.06) 0%, transparent 40%),
          radial-gradient(ellipse at 80% 100%, rgba(16,32,64,0.8) 0%, transparent 50%);
        pointer-events: none; z-index: 0; }
      .page > * { position: relative; z-index: 1; }
      .frame { position: absolute; inset: 12px; border: 1px solid rgba(184,112,64,0.12); pointer-events: none; z-index: 10; }

      .p1-header { height: 66px; flex-shrink: 0; padding: 0 48px; display: flex; align-items: center;
        justify-content: space-between; border-bottom: 1px solid rgba(184,112,64,0.1); }
      .brand-name { font-family: 'Cormorant SC', serif; font-size: 15px; font-weight: 500; letter-spacing: 4px; color: #F0C090; }
      .brand-sub { font-size: 8px; letter-spacing: 4px; color: #506080; margin-top: 3px; text-transform: uppercase; font-weight: 300; }
      .header-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
      .header-copper-line { width: 40px; height: 1px; background: linear-gradient(90deg, transparent, #B87040); }
      .header-label { font-size: 7px; letter-spacing: 4px; color: #6A3E20; text-transform: uppercase; }

      .p1-hero { height: 136px; flex-shrink: 0; padding: 0 48px; display: flex; align-items: center;
        justify-content: space-between; background: #0C1220; border-bottom: 1px solid rgba(184,112,64,0.08);
        position: relative; overflow: hidden; }
      .p1-hero::before { content: ''; position: absolute; inset: 0;
        background-image: linear-gradient(rgba(184,112,64,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(184,112,64,0.02) 1px, transparent 1px);
        background-size: 32px 32px; }
      .hero-eyebrow { display: flex; align-items: center; gap: 10px; font-size: 7px; letter-spacing: 6px; color: #B87040;
        text-transform: uppercase; margin-bottom: 12px; font-weight: 400; }
      .hero-eyebrow::before { content: ''; width: 24px; height: 1px; background: #B87040; flex-shrink: 0; }
      .hero-title { font-family: 'Cormorant SC', serif; font-size: 52px; font-weight: 600; line-height: 0.88; color: #E8EEF8; letter-spacing: 3px; }
      .hero-model { font-family: 'Cormorant SC', serif; font-size: 17px; font-weight: 300; letter-spacing: 6px; color: #D08850; margin-top: 8px; }
      .hero-right { text-align: right; flex-shrink: 0; position: relative; z-index: 1; }
      .price-box { border: 1px solid rgba(184,112,64,0.2); padding: 14px 20px; background: rgba(184,112,64,0.04);
        position: relative; overflow: hidden; }
      .price-box::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
        background: linear-gradient(90deg, transparent, #D08850, transparent); }
      .price-label { font-size: 7px; letter-spacing: 4px; color: #506080; text-transform: uppercase; margin-bottom: 6px; }
      .price-val { font-family: 'Cormorant SC', serif; font-size: 24px; font-weight: 600; color: #F0C090; letter-spacing: 1px; }
      .year-tag { font-size: 9px; letter-spacing: 4px; color: #8090A8; text-transform: uppercase; margin-top: 6px; }

      .p1-gallery { height: 308px; flex-shrink: 0; padding: 12px 48px 0; display: flex; flex-direction: column;
        border-bottom: 1px solid rgba(184,112,64,0.06); }
      .section-label { height: 24px; flex-shrink: 0; display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
      .section-label-text { font-size: 7px; letter-spacing: 5px; text-transform: uppercase; color: #506080; white-space: nowrap; font-weight: 300; }
      .section-label-line { flex: 1; height: 1px; background: rgba(184,112,64,0.1); }

      .p1-specs { flex: 1; padding: 12px 48px 0; display: flex; flex-direction: column; }
      .specs-grid { flex: 1; display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px;
        background: rgba(184,112,64,0.06); overflow: hidden; }
      .spec-cell { background: #0C1220; padding: 11px 14px; display: flex; flex-direction: column; justify-content: center; }
      .spec-cell.desc-cell { grid-column: span 3; background: rgba(184,112,64,0.03); border-top: 1px solid rgba(184,112,64,0.08); padding: 12px 16px; }
      .spec-key { font-size: 7px; letter-spacing: 3px; text-transform: uppercase; color: #506080; margin-bottom: 5px; font-weight: 300; }
      .spec-val { font-family: 'Cormorant SC', serif; font-size: 15px; font-weight: 500; color: #E8EEF8; letter-spacing: 1px; }
      .spec-desc { font-family: 'Outfit', sans-serif; font-size: 11px; font-weight: 300; color: #8090A8; line-height: 1.65; }

      .page-footer { height: 36px; flex-shrink: 0; padding: 0 48px; border-top: 1px solid rgba(184,112,64,0.08);
        display: flex; align-items: center; justify-content: space-between; }
      .footer-brand { font-family: 'Cormorant SC', serif; font-size: 9px; letter-spacing: 3px; color: rgba(184,112,64,0.25); }
      .footer-dot { width: 3px; height: 3px; border-radius: 50%; background: #6A3E20; opacity: 0.5; }
      .footer-page { font-size: 7px; letter-spacing: 2px; color: #506080; }
      .footer-date { font-size: 7px; letter-spacing: 2px; color: #506080; }

      .gallery-page-header { height: 50px; flex-shrink: 0; padding: 0 48px; display: flex; align-items: center;
        justify-content: space-between; border-bottom: 1px solid rgba(184,112,64,0.08); background: #0C1220; }
      .gph-brand { font-family: 'Cormorant SC', serif; font-size: 13px; font-weight: 500; color: #D08850; letter-spacing: 3px; }
      .gph-model { font-size: 7px; letter-spacing: 3px; color: #506080; text-transform: uppercase; }
      .gallery-page-content { flex: 1; padding: 12px 48px 8px; display: flex; flex-direction: column; overflow: hidden; }

      .photo-cell { overflow: hidden; background: #10182A; position: relative; min-height: 0; }
      .photo-cell img { width: 100%; height: 100%; object-fit: cover; display: block; filter: brightness(0.86) contrast(1.06) saturate(0.88); }

      .total-badge { height: 28px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; gap: 14px; margin-top: 8px; }
      .total-line { flex: 1; height: 1px; background: rgba(184,112,64,0.08); }
      .total-text { font-size: 7px; letter-spacing: 4px; color: #506080; text-transform: uppercase; font-family: 'Cormorant SC', serif; }
    </style>
    `;
  }

  // ── GRAY ORANGE THEME ─────────────────────────────────────
  if (name === 'Gri Turuncu' || layout.headerStyle === 'grayOrange') {
    return `
    <style>
      @page { margin: 0; }
      * { margin: 0; padding: 0; box-sizing: border-box;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important; }
      html { width: 100%; margin: 0; padding: 0; background: transparent; }
      body { width: 100%; margin: 0; padding: 0; background: transparent; display: block; font-family: 'Barlow', sans-serif; }

      .page {
        width: 100vw; height: 100vh;
        background: #0F0F0F; color: #F0F0F0;
        position: relative; overflow: hidden;
        display: flex; flex-direction: column; flex-shrink: 0;
        page-break-after: always; page-break-inside: avoid;
        break-after: page; break-inside: avoid;
      }
      .page:last-child { page-break-after: avoid; break-after: avoid; }
      .page-last { page-break-after: avoid !important; break-after: avoid !important; }
      .page::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
        background: linear-gradient(90deg, transparent, #8A3810, #FF8040, #F07030, #FF8040, #8A3810, transparent); z-index: 20; }
      .page > * { position: relative; z-index: 1; }

      .p1-header { height: 62px; flex-shrink: 0; padding: 0 48px; display: flex; align-items: center;
        justify-content: space-between; border-bottom: 1px solid #262626; background: #161616; }
      .brand-name { font-family: 'Barlow Condensed', sans-serif; font-size: 18px; font-weight: 700; letter-spacing: 3px; color: #F0F0F0; text-transform: uppercase; }
      .brand-sub { font-size: 8px; letter-spacing: 4px; color: #6A6A6A; margin-top: 2px; text-transform: uppercase; font-weight: 300; }
      .header-tag { display: flex; align-items: center; gap: 6px; }
      .header-tag-bar { width: 3px; height: 18px; background: #E86020; }
      .header-tag-text { font-family: 'Barlow Condensed', sans-serif; font-size: 10px; letter-spacing: 3px; color: #E86020; text-transform: uppercase; font-weight: 600; }

      .p1-hero { height: 130px; flex-shrink: 0; display: flex; align-items: stretch; overflow: hidden; position: relative; }
      .hero-accent-bar { width: 4px; background: #E86020; flex-shrink: 0; }
      .hero-content { flex: 1; padding: 0 44px; display: flex; align-items: center; justify-content: space-between;
        background: #161616; position: relative; overflow: hidden; }
      .hero-content::before { content: ''; position: absolute; top: 0; left: 200px; right: 0; bottom: 0;
        background: repeating-linear-gradient(-8deg, transparent, transparent 30px, rgba(232,96,32,0.02) 30px, rgba(232,96,32,0.02) 31px); }
      .hero-eyebrow { font-size: 8px; letter-spacing: 5px; color: #E86020; text-transform: uppercase; font-weight: 400; margin-bottom: 8px; }
      .hero-title { font-family: 'Barlow Condensed', sans-serif; font-size: 56px; font-weight: 800; line-height: 0.88; color: #F0F0F0; letter-spacing: 1px; text-transform: uppercase; }
      .hero-model { font-family: 'Barlow Condensed', sans-serif; font-size: 18px; font-weight: 300; letter-spacing: 6px; color: #7A7A7A; margin-top: 6px; text-transform: uppercase; }
      .hero-right { text-align: right; flex-shrink: 0; position: relative; z-index: 1; }
      .price-label { font-size: 7px; letter-spacing: 4px; color: #6A6A6A; text-transform: uppercase; margin-bottom: 5px; }
      .price-val { font-family: 'Barlow Condensed', sans-serif; font-size: 28px; font-weight: 700; color: #F07030; letter-spacing: -1px; }
      .year-tag { display: inline-block; background: #E86020; padding: 2px 10px; font-family: 'Barlow Condensed', sans-serif;
        font-size: 11px; font-weight: 700; color: white; letter-spacing: 2px; margin-top: 6px; }

      .p1-gallery { height: 310px; flex-shrink: 0; padding: 12px 48px 0; display: flex; flex-direction: column; }
      .section-label { height: 24px; flex-shrink: 0; display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
      .section-num { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; font-weight: 700; color: #E86020; letter-spacing: 1px; }
      .section-label-text { font-size: 7px; letter-spacing: 5px; text-transform: uppercase; color: #6A6A6A; font-weight: 400; white-space: nowrap; }
      .section-label-line { flex: 1; height: 1px; background: #262626; }

      .p1-specs { flex: 1; padding: 12px 48px 0; display: flex; flex-direction: column; }
      .specs-grid { flex: 1; display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: #1E1E1E; overflow: hidden; }
      .spec-cell { background: #161616; padding: 11px 14px; display: flex; flex-direction: column; justify-content: center;
        position: relative; }
      .spec-cell.desc-cell { grid-column: span 3; background: #1E1E1E; padding: 12px 16px; border-top: 1px solid #262626;
        border-left: 2px solid #E86020; }
      .spec-key { font-size: 7px; letter-spacing: 3px; text-transform: uppercase; color: #6A6A6A; margin-bottom: 5px; font-weight: 400; }
      .spec-val { font-family: 'Barlow Condensed', sans-serif; font-size: 16px; font-weight: 600; color: #F0F0F0; letter-spacing: 0.5px; text-transform: uppercase; }
      .spec-desc { font-family: 'Barlow', sans-serif; font-size: 11px; font-weight: 300; color: #7A7A7A; line-height: 1.65; }

      .page-footer { height: 34px; flex-shrink: 0; padding: 0 48px; border-top: 1px solid #1E1E1E;
        display: flex; align-items: center; justify-content: space-between; background: #161616; }
      .footer-brand { font-family: 'Barlow Condensed', sans-serif; font-size: 8px; letter-spacing: 3px; color: rgba(232,96,32,0.3); text-transform: uppercase; font-weight: 600; }
      .footer-dot { width: 3px; height: 3px; background: #E86020; opacity: 0.3; }
      .footer-page { font-size: 7px; letter-spacing: 2px; color: #6A6A6A; }
      .footer-date { font-size: 7px; letter-spacing: 2px; color: #6A6A6A; }

      .gallery-page-header { height: 48px; flex-shrink: 0; padding: 0 0 0 48px; display: flex; align-items: center;
        border-bottom: 1px solid #1E1E1E; background: #161616; overflow: hidden; }
      .gph-accent { width: 3px; height: 100%; background: #E86020; flex-shrink: 0; margin-right: 16px; margin-left: -48px; }
      .gph-brand { font-family: 'Barlow Condensed', sans-serif; font-size: 14px; font-weight: 700; color: #F0F0F0;
        letter-spacing: 2px; text-transform: uppercase; margin-left: 16px; flex: 1; }
      .gph-model { font-size: 7px; letter-spacing: 3px; color: #6A6A6A; text-transform: uppercase; margin-right: 48px; }
      .gallery-page-content { flex: 1; padding: 12px 48px 8px; display: flex; flex-direction: column; overflow: hidden; }

      .photo-cell { overflow: hidden; background: #1E1E1E; position: relative; min-height: 0; }
      .photo-cell img { width: 100%; height: 100%; object-fit: cover; display: block; filter: brightness(0.88) contrast(1.08) saturate(0.9); }

      .total-badge { height: 28px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; gap: 14px; margin-top: 8px; }
      .total-line { flex: 1; height: 1px; background: #262626; }
      .total-text { font-family: 'Barlow Condensed', sans-serif; font-size: 8px; letter-spacing: 5px; color: #6A6A6A; text-transform: uppercase; font-weight: 400; }
    </style>
    `;
  }

  // FALLBACK: Original CSS for other themes
  return `
    <style>
      /* CSS Variables */
      :root {
        --primary: ${colors.primary};
        --secondary: ${colors.secondary};
        --tertiary: ${colors.tertiary};
        --accent: ${colors.accent};
        --accent-light: ${colors.accentLight || colors.accent};
        --accent-dark: ${colors.accentDark || colors.accent};
        --text: ${colors.text};
        --text-secondary: ${colors.textSecondary};
        ${colors.silver ? `--silver: ${colors.silver};` : ''}
        ${colors.silverDark ? `--silver-dark: ${colors.silverDark};` : ''}
        ${colors.accentSecondary ? `--accent-secondary: ${colors.accentSecondary};` : ''}
      }

      /* Reset & Base */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      html {
        width: 100%;
        margin: 0;
        padding: 0;
        background: transparent;
      }

      body {
        width: 100%;
        margin: 0;
        padding: 0;
        background: transparent;
        color: var(--text);
        font-family: '${fonts.body}', sans-serif;
        display: block;
      }

      .page {
        width: 100vw;
        height: 100vh;
        background: var(--primary);
        color: var(--text);
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        page-break-after: always;
        page-break-inside: avoid;
        break-after: page;
        break-inside: avoid;
        box-sizing: border-box;
      }

      .page:last-child {
        page-break-after: avoid;
        break-after: avoid;
      }

      .page-last {
        page-break-after: avoid !important;
        break-after: avoid !important;
      }

      /* Top/Bottom Bars */
      ${layout.topBar ? `
        .top-bar {
          height: 3px;
          background: linear-gradient(90deg, var(--accent) 0%, var(--silver) 50%, var(--tertiary) 100%);
        }
      ` : ''}

      ${layout.bottomBar ? `
        .bottom-bar {
          height: 3px;
          background: linear-gradient(90deg, var(--tertiary) 0%, var(--accent) 50%, var(--tertiary) 100%);
        }
      ` : ''}

      /* Border (Vintage) */
      ${layout.border ? `
        .page-inner {
          margin: 14px;
          border: 1px solid var(--tertiary);
          height: calc(100% - 28px);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
      ` : ''}

      /* Texture/Effects */
      .page::before {
        content: '';
        position: absolute;
        ${layout.headerStyle === 'corners' ? `
          inset: 12px;
          border: 1px solid rgba(201,168,76,0.25);
        ` : layout.topBar ? `
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
        ` : ''}
        pointer-events: none;
        z-index: 10;
      }

      .page::after {
        content: '';
        position: absolute;
        inset: 0;
        ${layout.headerStyle === 'corners' ? `
          background-image: 
            radial-gradient(ellipse at 80% 10%, rgba(201,168,76,0.04) 0%, transparent 50%),
            radial-gradient(ellipse at 20% 90%, rgba(201,168,76,0.03) 0%, transparent 40%);
        ` : layout.headerStyle === 'badge' ? `
          background: 
            radial-gradient(ellipse at 90% 0%, rgba(76,175,80,0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 10% 100%, rgba(212,175,55,0.05) 0%, transparent 40%);
        ` : ''}
        pointer-events: none;
        z-index: 0;
      }

      .page > * { position: relative; z-index: 1; }

      /* ─── HEADER ─── */
      .header {
        height: 70px;
        padding: ${layout.headerStyle === 'corners' ? '20px 24px' : '18px 24px'};
        display: flex;
        align-items: ${layout.headerStyle === 'simple' ? 'flex-end' : 'center'};
        justify-content: space-between;
        border-bottom: 1px solid ${layout.headerStyle === 'corners' ? 'rgba(201,168,76,0.2)' : 'var(--tertiary)'};
        ${layout.border ? 'background: var(--secondary);' : ''}
        flex-shrink: 0;
        box-sizing: border-box;
      }

      ${layout.headerStyle === 'corners' ? `
        .header::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 24px;
          width: 80px;
          height: 2px;
          background: var(--accent);
        }
      ` : ''}

      .brand-name {
        font-family: '${fonts.heading}', serif;
        font-size: ${layout.headerStyle === 'ornament' ? '18px' : layout.headerStyle === 'simple' ? '22px' : '13px'};
        font-weight: ${layout.headerStyle === 'ornament' ? '700' : '400'};
        letter-spacing: ${layout.headerStyle === 'simple' ? '1px' : layout.headerStyle === 'ornament' ? '1px' : '5px'};
        ${layout.headerStyle !== 'ornament' ? 'text-transform: uppercase;' : ''}
        color: ${layout.headerStyle === 'corners' ? 'var(--accent)' : 'var(--text)'};
      }

      .brand-sub {
        font-size: ${layout.headerStyle === 'simple' ? '9px' : '8px'};
        letter-spacing: ${layout.headerStyle === 'simple' ? '4px' : layout.headerStyle === 'ornament' ? '5px' : '3px'};
        color: var(--text-secondary);
        text-transform: uppercase;
        margin-top: ${layout.headerStyle === 'simple' ? '3px' : '4px'};
      }

      .header-logo {
        width: 60px;
        height: 60px;
        object-fit: contain;
        ${layout.border ? 'border-radius: 4px;' : ''}
      }

      .header-badge {
        display: flex;
        align-items: center;
        gap: 8px;
        border: 1px solid rgba(212,175,55,0.3);
        padding: 6px 14px;
      }

      .header-badge-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #4CAF50;
        box-shadow: 0 0 8px #4CAF50;
      }

      .header-badge-text {
        font-size: 8px;
        letter-spacing: 4px;
        color: var(--accent-secondary);
        text-transform: uppercase;
      }

      .header-tag {
        font-size: 9px;
        letter-spacing: 4px;
        color: var(--text-secondary);
        text-transform: uppercase;
      }

      .header-ornament {
        font-family: '${fonts.heading}', serif;
        font-size: 24px;
        color: var(--tertiary);
        font-style: italic;
      }

      /* ─── CORNER ORNAMENTS ─── */
      ${layout.headerStyle === 'corners' ? `
        .corner {
          position: absolute;
          width: 20px;
          height: 20px;
          z-index: 20;
        }
        .corner.tl { top: 18px; left: 18px; border-top: 1px solid var(--accent); border-left: 1px solid var(--accent); }
        .corner.tr { top: 18px; right: 18px; border-top: 1px solid var(--accent); border-right: 1px solid var(--accent); }
        .corner.bl { bottom: 18px; left: 18px; border-bottom: 1px solid var(--accent); border-left: 1px solid var(--accent); }
        .corner.br { bottom: 18px; right: 18px; border-bottom: 1px solid var(--accent); border-right: 1px solid var(--accent); }
      ` : ''}

      /* ─── HERO ─── */
      .hero {
        height: 150px;
        padding: ${layout.priceInHero ? '28px 26px' : '16px 24px'};
        ${layout.priceInHero ? 'background: var(--accent); color: var(--primary);' : ''}
        position: relative;
        flex-shrink: 0;
        box-sizing: border-box;
        overflow: hidden;
      }

      .hero-content {
        display: flex;
        justify-content: space-between;
        align-items: ${layout.priceInHero ? 'flex-end' : 'flex-start'};
      }

      .hero-eyebrow {
        font-size: ${layout.sectionStyle === 'numbered' ? '9px' : '8px'};
        letter-spacing: ${layout.sectionStyle === 'numbered' ? '5px' : '6px'};
        color: ${layout.priceInHero ? 'var(--silver)' : 'var(--accent)'};
        text-transform: uppercase;
        margin-bottom: ${layout.sectionStyle === 'numbered' ? '12px' : '16px'};
      }

      .hero-title {
        font-family: '${fonts.heading}', serif;
        font-size: ${layout.priceInHero ? '56px' : layout.headerStyle === 'ornament' ? '24px' : '44px'};
        font-weight: ${layout.priceInHero ? '900' : layout.headerStyle === 'ornament' ? '700' : '300'};
        line-height: ${layout.priceInHero ? '0.85' : '0.9'};
        color: ${layout.priceInHero ? 'var(--primary)' : 'var(--text)'};
        letter-spacing: ${layout.priceInHero ? '-2px' : '-1px'};
      }

      .hero-model {
        ${layout.priceInHero ? `
          font-weight: 300;
          font-size: 28px;
          display: block;
          color: var(--silver);
          letter-spacing: 6px;
          font-style: italic;
          margin-top: 6px;
        ` : `
          font-family: '${fonts.heading}', serif;
          font-size: 13px;
          font-weight: 300;
          letter-spacing: 6px;
          color: var(--accent);
          margin-top: 8px;
          text-transform: uppercase;
          display: block;
        `}
      }

      .hero-year {
        font-size: 9px;
        letter-spacing: 3px;
        color: var(--text-secondary);
        margin-top: 8px;
        text-transform: uppercase;
      }

      .hero-divider {
        width: ${layout.headerStyle === 'ornament' ? '20px' : '24px'};
        height: 1px;
        background: ${layout.headerStyle === 'ornament' ? 'var(--text-secondary)' : 'var(--accent)'};
        margin: 12px 0;
      }

      .hero-tagline {
        font-size: ${layout.headerStyle === 'ornament' ? '9px' : '10px'};
        letter-spacing: ${layout.headerStyle === 'ornament' ? '2px' : '2px'};
        color: var(--text-secondary);
        text-transform: uppercase;
        font-weight: 300;
      }

      ${layout.priceInHero ? `
        .hero-price-label {
          font-size: 8px;
          letter-spacing: 2px;
          color: var(--text-secondary);
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .hero-price {
          font-family: '${fonts.heading}', serif;
          font-size: 28px;
          font-weight: 700;
          color: var(--primary);
          letter-spacing: -1px;
        }
      ` : ''}

      /* ─── GALLERY ─── */
      .gallery-section {
        height: 360px;
        padding: ${layout.border ? '20px 20px' : '20px 24px'};
        ${layout.border ? 'border-bottom: 1px solid var(--tertiary);' : ''}
        flex-shrink: 0;
        box-sizing: border-box;
        overflow: hidden;
      }

      .section-header {
        height: 30px;
        display: flex;
        align-items: center;
        gap: ${layout.sectionStyle === 'numbered' ? '16px' : '14px'};
        margin-bottom: ${layout.sectionStyle === 'numbered' ? '10px' : '12px'};
        ${layout.sectionStyle === 'numbered' ? '' : 'padding-top: 0;'}
        flex-shrink: 0;
      }

      ${layout.sectionStyle === 'numbered' ? `
        .section-num {
          font-family: '${fonts.heading}', serif;
          font-size: 10px;
          color: var(--accent);
          opacity: 0.5;
        }
      ` : ''}

      ${layout.sectionStyle === 'ornament' ? `
        .section-ornament {
          font-family: '${fonts.heading}', serif;
          font-style: italic;
          font-size: 13px;
          color: var(--text-secondary);
        }
      ` : ''}

      .section-title {
        font-size: 8px;
        letter-spacing: 5px;
        text-transform: uppercase;
        color: ${layout.sectionStyle === 'ornament' ? 'var(--accent-dark)' : 'var(--text-secondary)'};
      }

      .section-line {
        flex: 1;
        height: 1px;
        background: ${layout.sectionStyle === 'numbered' ? 'rgba(212,175,55,0.12)' : 'var(--tertiary)'};
      }

      .gallery-grid {
        display: grid;
        gap: ${layout.galleryColumns === 2 ? '4px' : '5px'};
      }

      .gallery-item {
        background: ${layout.headerStyle === 'corners' ? 'var(--secondary)' : layout.headerStyle === 'badge' ? 'var(--tertiary)' : 'var(--secondary)'};
        overflow: hidden;
        position: relative;
      }

      .gallery-item.main {
        grid-row: span 2;
      }

      .gallery-item.tall {
        grid-row: span 2;
      }

      .gallery-item.wide {
        grid-column: span 2;
      }

      ${layout.headerStyle === 'corners' || layout.headerStyle === 'badge' ? `
        .gallery-item::after {
          content: '';
          position: absolute;
          inset: 0;
          border: 1px solid rgba(212,175,55,0.08);
          pointer-events: none;
        }
      ` : ''}

      .gallery-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        ${layout.headerStyle === 'corners' ? 'filter: brightness(0.85) contrast(1.05);' : ''}
        ${layout.headerStyle === 'badge' ? 'filter: brightness(0.9);' : ''}
        ${layout.headerStyle === 'ornament' ? 'filter: sepia(0.15);' : ''}
        ${layout.headerStyle === 'simple' ? 'filter: grayscale(0.15);' : ''}
      }

      /* ─── SPECS ─── */
      .specs-section {
        max-height: 280px;
        padding: ${layout.border ? '20px 20px' : layout.headerStyle === 'simple' ? '24px 26px' : '20px 24px'};
        page-break-inside: avoid;
        flex-shrink: 0;
        box-sizing: border-box;
        overflow: hidden;
      }

      ${layout.specsLayout === 'grid' ? `
        .specs-grid {
          display: grid;
          grid-template-columns: repeat(${layout.specsColumns}, 1fr);
          gap: 1px;
          background: ${layout.headerStyle === 'simple' ? 'var(--tertiary)' : 'rgba(212,175,55,0.08)'};
          ${layout.headerStyle === 'simple' ? 'border: 1px solid var(--tertiary);' : ''}
          page-break-inside: avoid;
        }

        .spec-description {
          grid-column: span ${layout.specsColumns};
        }

        .description-text {
          font-size: 11px !important;
          line-height: 1.5;
          max-height: 66px;
          overflow: hidden;
          word-wrap: break-word;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
        }

        .spec-cell {
          background: ${layout.headerStyle === 'simple' ? 'var(--primary)' : 'var(--secondary)'};
          padding: ${layout.headerStyle === 'simple' ? '16px 14px' : '16px'};
          position: relative;
        }

        .spec-cell.wide {
          grid-column: span 2;
          ${layout.headerStyle === 'simple' ? 'background: var(--secondary);' : ''}
        }

        .spec-cell.price-cell {
          grid-column: span ${layout.specsColumns};
          background: ${layout.headerStyle === 'badge' ? 'var(--tertiary)' : 'var(--tertiary)'};
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
        }
      ` : `
        .specs-table {
          width: 100%;
          border-collapse: collapse;
        }

        .specs-table tr {
          border-bottom: 1px solid var(--secondary);
        }

        .specs-table tr:last-child {
          border-bottom: none;
          background: var(--accent);
        }

        .specs-table td {
          padding: 10px 0;
          font-size: 12px;
        }

        .specs-table tr.price-row td {
          padding: 14px 16px;
          color: var(--primary);
        }
      `}

      .spec-key {
        font-size: ${layout.specsLayout === 'table' ? '8px' : '7px'};
        letter-spacing: ${layout.specsLayout === 'table' ? '3px' : layout.headerStyle === 'simple' ? '2px' : '3px'};
        text-transform: uppercase;
        color: ${layout.specsLayout === 'table' ? 'var(--text-secondary)' : layout.headerStyle === 'simple' ? 'var(--text-secondary)' : 'var(--accent-dark)'};
        margin-bottom: ${layout.specsLayout === 'table' ? '0' : '6px'};
        ${layout.specsLayout === 'table' ? 'width: 160px;' : ''}
      }

      .spec-val {
        font-family: '${fonts.heading}', serif;
        font-size: ${layout.specsLayout === 'table' ? '13px' : layout.headerStyle === 'simple' ? '18px' : '14px'};
        font-weight: ${layout.specsLayout === 'table' ? '400' : layout.headerStyle === 'simple' ? '400' : '400'};
        color: var(--text);
        ${layout.specsLayout !== 'table' ? 'letter-spacing: -0.5px;' : ''}
      }

      .spec-val.large {
        font-size: 24px;
        font-weight: 700;
      }

      .spec-val.price {
        font-size: 22px;
        font-weight: 700;
        color: ${layout.headerStyle === 'simple' ? 'var(--text)' : 'var(--accent-light)'};
      }

      ${layout.specsLayout === 'table' ? `
        .specs-table tr.price-row td.key {
          color: var(--text-secondary);
        }

        .specs-table tr.price-row td.val {
          font-size: 20px;
          color: var(--primary);
          font-weight: 700;
          text-align: right;
        }
      ` : ''}

      .price-label {
        font-size: 9px;
        letter-spacing: 3px;
        color: var(--text-secondary);
        text-transform: uppercase;
      }

      /* ─── FOOTER ─── */
      .footer {
        height: 55px;
        padding: ${layout.border ? '14px 20px' : layout.headerStyle === 'simple' ? '14px 26px' : '16px 24px'};
        ${layout.border ? 'background: var(--secondary);' : layout.headerStyle === 'simple' ? 'background: var(--secondary);' : ''}
        border-top: 1px solid ${layout.headerStyle === 'corners' ? 'rgba(201,168,76,0.1)' : 'var(--tertiary)'};
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: auto;
        flex-shrink: 0;
        box-sizing: border-box;
      }

      .footer-left {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      ${layout.footerDot ? `
        .footer-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: ${layout.headerStyle === 'badge' ? '#4CAF50' : 'var(--accent)'};
          ${layout.headerStyle === 'badge' ? 'box-shadow: 0 0 6px #4CAF50;' : 'opacity: 0.5;'}
        }
      ` : ''}

      .footer-brand {
        font-family: ${layout.headerStyle === 'ornament' ? `'${fonts.heading}', serif` : 'inherit'};
        font-size: ${layout.headerStyle === 'ornament' ? '10px' : layout.headerStyle === 'simple' ? '9px' : '8px'};
        letter-spacing: ${layout.headerStyle === 'ornament' ? '0' : '4px'};
        color: ${layout.headerStyle === 'corners' ? 'rgba(201,168,76,0.5)' : layout.headerStyle === 'ornament' ? 'var(--text-secondary)' : 'var(--text-secondary)'};
        text-transform: ${layout.headerStyle === 'ornament' ? 'none' : 'uppercase'};
        ${layout.headerStyle === 'ornament' ? 'font-style: italic;' : ''}
      }

      .footer-date {
        font-size: ${layout.headerStyle === 'simple' ? '9px' : '8px'};
        letter-spacing: ${layout.headerStyle === 'simple' ? '2px' : '3px'};
        color: ${layout.headerStyle === 'corners' ? 'var(--text-secondary)' : 'var(--text-secondary)'};
      }

      .footer-page {
        font-size: 8px;
        letter-spacing: 2px;
        color: var(--text-secondary);
      }

      /* ─── MULTI-PAGE LAYOUTS ─── */
      
      /* Hero Gallery Layout (1 büyük + 3 küçük) */
      .gallery-hero-grid {
        display: grid;
        grid-template-columns: 1.5fr 1fr;
        grid-template-rows: 150px 150px;
        gap: 5px;
        height: 300px;
        overflow: hidden;
      }

      .gallery-hero-grid .photo-main {
        grid-row: span 2;
        height: 100%;
      }

      .gallery-hero-grid .photo-item {
        background: ${layout.headerStyle === 'corners' ? '#1A1A1A' : 'var(--secondary)'};
        overflow: hidden;
        position: relative;
        height: 100%;
        width: 100%;
      }

      .gallery-hero-grid .photo-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        loading: eager;
        ${layout.headerStyle === 'corners' ? 'filter: brightness(0.88) contrast(1.05);' : ''}
      }

      ${layout.headerStyle === 'corners' ? `
        .gallery-hero-grid .photo-item::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(201,168,76,0.06) 0%, transparent 60%);
          pointer-events: none;
        }
      ` : ''}

      /* 3x2 Full Gallery Grid */
      .gallery-3x2 {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 485px 485px;
        gap: 5px;
        height: 970px;
        overflow: hidden;
      }

      .gallery-3x2 .photo-item {
        height: 485px;
        width: 100%;
        background: ${layout.headerStyle === 'corners' ? '#222222' : 'var(--secondary)'};
        overflow: hidden;
        position: relative;
      }

      .gallery-3x2 .photo-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        loading: eager;
        ${layout.headerStyle === 'corners' ? 'filter: brightness(0.88) contrast(1.05);' : ''}
      }

      ${layout.headerStyle === 'corners' ? `
        .gallery-3x2 .photo-item::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(201,168,76,0.06) 0%, transparent 60%);
          pointer-events: none;
        }
      ` : ''}

      .gallery-3x2 .photo-item.empty {
        background: var(--primary);
        border: none;
      }

      /* Full Page Gallery Section */
      .gallery-full {
        padding: ${layout.border ? '20px 20px' : '24px 24px'};
        flex: 1;
        display: flex;
        flex-direction: column;
        height: calc(100vh - 55px - 62px);
        box-sizing: border-box;
        overflow: hidden;
      }

      .gallery-full .section-header {
        height: 36px;
        margin-bottom: 10px;
      }

      /* Continuation Page Header */
      .page-cont-header {
        height: 55px;
        padding: 16px 24px;
        border-bottom: 1px solid ${layout.headerStyle === 'corners' ? 'rgba(201,168,76,0.12)' : 'var(--tertiary)'};
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-shrink: 0;
        box-sizing: border-box;
      }

      .page-cont-brand {
        font-family: ${layout.headerStyle === 'ornament' ? `'${fonts.heading}', serif` : 'inherit'};
        font-size: 11px;
        letter-spacing: 4px;
        color: ${layout.headerStyle === 'corners' ? 'var(--accent-dark)' : 'var(--accent)'};
        text-transform: uppercase;
      }

      .page-cont-model {
        font-size: 9px;
        letter-spacing: 3px;
        color: var(--text-secondary);
        text-transform: uppercase;
      }
    </style>
  `;
};

/**
 * Build Complete HTML from theme and data
 * @param {Object} data - { title, category, formData, logo, companyName, photos }
 * @param {Object} theme - Theme configuration object
 * @returns {string} Complete HTML string
 */
export const buildHTML = (data, theme) => {
  const { title, category, formData, logo, companyName, photos } = data;

  // Google Fonts
  const fontsLink = theme.fonts.googleFontsURL ? 
    `<link href="${theme.fonts.googleFontsURL}" rel="stylesheet">` : '';

  // Wrapper for vintage theme (border)
  const wrapperStart = theme.layout.border ? '<div class="page-inner">' : '';
  const wrapperEnd = theme.layout.border ? '</div>' : '';

  // Top bar (white theme)
  const topBar = theme.layout.topBar ? '<div class="top-bar"></div>' : '';

  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${companyName || 'AlhazenPDF'} — ${title}</title>
  ${fontsLink}
  ${generateCSS(theme)}
</head>
<body>
  <div class="page">
    ${topBar}
    ${wrapperStart}
    ${buildHeader({ logo, companyName, category }, theme)}
    ${buildHero({ title, category, formData }, theme)}
    ${buildGallery(photos, theme)}
    ${buildSpecs(formData, theme, category)}
    ${buildFooter(theme)}
    ${wrapperEnd}
  </div>
</body>
</html>
  `;
};

/**
 * Build Multi-Page HTML with Photo Pagination
 * İlk 4 foto: Hero layout (1 büyük + 3 küçük)
 * Sonraki her 6 foto: 3x2 grid sayfası
 * 
 * @param {Object} data - { title, category, formData, logo, companyName, photos }
 * @param {Object} theme - Theme configuration object
 * @returns {string} Complete multi-page HTML string
 */
export const buildMultiPageHTML = (data, theme) => {
  const { title, category, formData, logo, companyName, photos = [] } = data;

  // BELLEK OPTİMİZASYONU: Max 25 foto (5 sayfa) ile sınırla
  const MAX_PHOTOS = 25;
  const limitedPhotos = photos.slice(0, MAX_PHOTOS);

  // Google Fonts
  const fontsLink = theme.fonts.googleFontsURL ? 
    `<link href="${theme.fonts.googleFontsURL}" rel="stylesheet">` : '';

  // Fotoğrafları sayfalara böl
  const { heroPhotos, galleryPages } = paginatePhotos(limitedPhotos);
  const totalPages = getTotalPages(limitedPhotos.length);

  // Convert photo objects preserving orientation metadata
  const toPhotoData = (photo) => {
    const src = typeof photo === 'string' ? photo : (photo?.base64 || photo?.uri || '');
    const w = photo?.width || 1;
    const h = photo?.height || 1;
    const isPortrait = photo?.isPortrait ?? (h > w);
    const objectPosition = photo?.objectPosition || null; // {x:0-100, y:0-100}
    return { src, isPortrait, w, h, objectPosition };
  };
  const heroPhotoData  = heroPhotos.map(toPhotoData);
  const galleryPageData = galleryPages.map(page => page.map(toPhotoData));

  // Tarih
  const date = new Date().toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Title parsing
  const [brand = '', model = ''] = title.split(' ');

  // Extract year, price, description
  const year = formData.Yıl || formData['Model Yılı'] || '';
  const priceEntry = Object.entries(formData).find(([key]) => key.toLowerCase().includes('fiyat'));
  const price = priceEntry ? priceEntry[1] : '';
  const description = formData.Açıklama || formData.Description || '';

  // Filter specs (remove year, price, description)
  const specs = Object.entries(formData).filter(([key, val]) => 
    !key.toLowerCase().includes('fiyat') &&
    !key.toLowerCase().includes('açıklama') &&
    !key.toLowerCase().includes('description') &&
    key !== 'Yıl' && key !== 'Model Yılı' &&
    val && val !== '--' && val !== ''
  );

  // ═══════════════════════════════════════════════════════
  // SMART ORIENTATION-AWARE GALLERY GRID BUILDER
  // ═══════════════════════════════════════════════════════
  /**
   * Generates inline-styled photo grid HTML with cover fit.
   * Layout adapts to photo count and portrait/landscape mix.
   * @param {Array} photoArr - [{src, isPortrait}] (1–6 photos)
   * @param {string} bgColor - empty cell background color
   * @param {string} imgFilter - CSS filter for images
   */
  const buildSmartGrid = (photoArr, bgColor = '#111', imgFilter = '') => {
    const n = photoArr.length;
    if (n === 0) return '';
    const cellImgStyle = (p) => {
      const pos = p.objectPosition ? `${p.objectPosition.x}% ${p.objectPosition.y}%` : 'center center';
      return `width:100%;height:100%;object-fit:cover;object-position:${pos};display:block;${imgFilter ? `filter:${imgFilter};` : ''}`;
    };
    const cell = (p) => `<div style="overflow:hidden;background:${bgColor};min-height:0;min-width:0;"><img src="${p.src}" loading="eager" style="${cellImgStyle(p)}"></div>`;
    const grid = (cols, rows, extra = '', content = '') =>
      `<div style="display:grid;grid-template-columns:${cols};grid-template-rows:${rows};gap:5px;width:100%;height:100%;${extra}">${content}</div>`;

    if (n === 1) {
      return grid('1fr', '1fr', '', cell(photoArr[0]));
    }

    if (n === 2) {
      const allPortrait = photoArr.every(p => p.isPortrait);
      // Portrait-only: side by side (each gets equal vertical space)
      // Landscape or mixed: top & bottom
      if (allPortrait) {
        return grid('1fr 1fr', '1fr', '', photoArr.map(cell).join(''));
      }
      return grid('1fr', '1fr 1fr', '', photoArr.map(cell).join(''));
    }

    if (n === 3) {
      const allPortrait = photoArr.every(p => p.isPortrait);
      if (allPortrait) {
        // 3 portrait: equal 3-column row
        return grid('1fr 1fr 1fr', '1fr', '', photoArr.map(cell).join(''));
      }
      // 1 big left + 2 small right
      return grid('1.6fr 1fr', '1fr 1fr', '',
        `<div style="grid-row:span 2;overflow:hidden;background:${bgColor}"><img src="${photoArr[0].src}" loading="eager" style="${cellImgStyle(photoArr[0])}"></div>`
        + cell(photoArr[1]) + cell(photoArr[2])
      );
    }

    if (n === 4) {
      const portraitCount = photoArr.filter(p => p.isPortrait).length;
      if (portraitCount >= 3) {
        // 2-column × 2-row portrait grid
        return grid('1fr 1fr', '1fr 1fr', '', photoArr.map(cell).join(''));
      }
      // 1 big left + 3 small right stack
      return grid('1.6fr 1fr', '1fr 1fr 1fr', '',
        `<div style="grid-row:span 3;overflow:hidden;background:${bgColor}"><img src="${photoArr[0].src}" loading="eager" style="${cellImgStyle(photoArr[0])}"></div>`
        + photoArr.slice(1).map(cell).join('')
      );
    }

    if (n === 5) {
      // Row 1: 3 photos, Row 2: photo spanning cols 1-2 + 1 photo
      return grid('1fr 1fr 1fr', '1fr 1fr', '',
        photoArr.slice(0, 3).map(cell).join('')
        + `<div style="grid-column:1/3;overflow:hidden;background:${bgColor}"><img src="${photoArr[3].src}" loading="eager" style="${cellImgStyle(photoArr[3])}"></div>`
        + cell(photoArr[4])
      );
    }

    // 6 photos: 3×2 grid
    return grid('1fr 1fr 1fr', '1fr 1fr', '', photoArr.map(cell).join(''));
  };

  // ═══════════════════════════════════════════════════════
  // CATEGORY-AWARE LABELS
  // ═══════════════════════════════════════════════════════
  const isRealEstate = category?.id === 'real-estate';
  const eyebrowText  = isRealEstate ? (formData['İlan Türü'] || 'Emlak İlanı') : 'Satılık Araç';
  const specsLabel   = isRealEstate ? 'Emlak Bilgileri' : 'Araç Bilgileri';

  // ═══════════════════════════════════════════════════════
  // THEME DETECTION
  // ═══════════════════════════════════════════════════════
  const themeName = theme.name || '';
  const themeLayout = theme.layout?.headerStyle || '';
  const isDarkGold    = themeName === 'Siyah Altın'    || themeName === 'Premium Altın'   || themeLayout === 'corners';
  const isGreen       = themeName === 'Premium Yeşil'  || themeName === 'Yeşil'           || themeLayout === 'badge';
  const isVintage     = themeName === 'Premium Vintage'|| themeName === 'Bej Vintage'     || themeLayout === 'ornament';
  const isBurgundy    = themeName === 'Bordo Altın'                                       || themeLayout === 'burgundy';
  const isNavySilver  = themeName === 'Lacivert Gümüş'                                   || themeLayout === 'navySilver';
  const isCopper      = themeName === 'Bakır'                                             || themeLayout === 'copper';
  const isGrayOrange  = themeName === 'Gri Turuncu'                                       || themeLayout === 'grayOrange';

  // ═══════════════════════════════════════════════════════
  // PAGE 1 HTML GENERATION
  // ═══════════════════════════════════════════════════════
  let page1 = '';

  if (isDarkGold) {
    // DARKGOLD THEME
    const dg_filter = 'brightness(0.88) contrast(1.05)';
    const heroGalleryHTML = heroPhotoData.length >= 4
      ? buildSmartGrid(heroPhotoData.slice(0, 4), '#1A1A1A', dg_filter)
      : buildSmartGrid(heroPhotoData, '#1A1A1A', dg_filter);

    const specsHTML = specs.map(([key, val]) => `
      <div class="spec-cell"><div class="spec-key">${key}</div><div class="spec-val">${val}</div></div>
    `).join('');

    const descriptionHTML = description ? `
      <div class="spec-cell desc-cell">
        <div class="spec-key">Açıklama</div>
        <div class="spec-desc">${description}</div>
      </div>
    ` : '';

    const specsInline = isRealEstate
      ? [
          formData['Oda Sayısı'],
          formData['M² (Net)'] ? formData['M² (Net)'] + ' m²' : formData['M² (Brüt)'] ? formData['M² (Brüt)'] + ' m²' : null,
          formData['Kat'] ? formData['Kat'] + '. Kat' : null,
        ].filter(Boolean).join(' · ')
      : [
          formData['Motor'] || formData['Motor Hacmi'],
          formData['Vites'] || formData['Şanzıman'],
          formData['Yakıt'] || formData['Yakıt Tipi'],
          formData['Kilometre'],
        ].filter(Boolean).join(' · ');

    page1 = `
  <div class="page">
    <div class="corner tl"></div><div class="corner tr"></div>
    <div class="corner bl"></div><div class="corner br"></div>

    <div class="p1-header">
      <div>
        <div class="brand-name">${companyName || 'AlhazenPDF'}</div>
        <div class="brand-sub">${category.name}</div>
      </div>
      <div class="header-logo-wrap">
        ${logo ? `<img src="${logo}" />` : '<div class="header-logo-placeholder">LOGO</div>'}
      </div>
    </div>

    <div class="p1-hero">
      <div>
        <div class="hero-eyebrow">${eyebrowText}</div>
        <div class="hero-title">${brand.toUpperCase()}</div>
        <div class="hero-model">${model}</div>
        ${specsInline ? '<div class="hero-divider"></div>' : ''}
        ${specsInline ? `<div class="hero-specs-inline">${specsInline}</div>` : ''}
      </div>
      ${price ? `
      <div class="hero-right">
        <div class="hero-price-label">İstenen Fiyat</div>
        <div class="hero-price">${price}</div>
      </div>
      ` : ''}
    </div>

    ${heroPhotoData.length > 0 ? `
    <div class="p1-gallery">
      <div class="section-label">
        <span class="section-label-text">Fotoğraf Galerisi</span>
        <div class="section-label-line"></div>
      </div>
      <div style="flex:1;min-height:0;overflow:hidden;">
        ${heroGalleryHTML}
      </div>
    </div>
    ` : ''}

    <div class="p1-specs">
      <div class="section-label">
        <span class="section-label-text">${specsLabel}</span>
        <div class="section-label-line"></div>
      </div>
      <div class="specs-grid">
        ${specsHTML}
        ${descriptionHTML}
      </div>
    </div>

    <div class="page-footer">
      <div class="footer-brand">AlhazenPDF</div>
      <div class="footer-dot"></div>
      <div class="footer-page">Sayfa 1 / ${totalPages}</div>
      <div class="footer-dot"></div>
      <div class="footer-date">${date}</div>
    </div>
  </div>
    `;
  } else if (isGreen) {
    // GREEN THEME
    const heroGalleryHTML = buildSmartGrid(heroPhotoData.slice(0, 4), '#1A2A1A', '');

    const specsHTML = specs.map(([key, val]) => `
      <div class="spec-cell"><div class="spec-key">${key}</div><div class="spec-val">${val}</div></div>
    `).join('');

    const descriptionHTML = description ? `
      <div class="spec-cell desc-cell">
        <div class="spec-key">Açıklama</div>
        <div class="spec-desc">${description}</div>
      </div>
    ` : '';

    page1 = `
  <div class="page">
    <div class="p1-header">
      <div>
        <div class="brand-name">${companyName || 'AlhazenPDF'}</div>
        <div class="brand-sub">${category.name}</div>
      </div>
      <div class="header-badge">
        <div class="header-badge-dot"></div>
        <div class="header-badge-text">AlhazenPDF</div>
      </div>
    </div>

    <div class="p1-hero">
      <div>
        <div class="hero-tag"><div class="hero-tag-line"></div><div class="hero-tag-text">${eyebrowText}</div></div>
        <div class="hero-title">${brand.toUpperCase()}</div>
        <div class="hero-model">${model}${year ? ' · ' + year : ''}</div>
      </div>
      ${price ? `
      <div class="price-box">
        <div class="price-label">İstenen Fiyat</div>
        <div class="price-val"><span class="price-currency">₺ </span>${price.replace(/[^\d]/g, '')}</div>
      </div>
      ` : ''}
    </div>

    ${heroPhotoData.length > 0 ? `
    <div class="p1-gallery">
      <div class="section-label">
        <span class="section-num">01</span>
        <span class="section-label-text">Fotoğraf Galerisi</span>
        <div class="section-label-line"></div>
      </div>
      <div style="flex:1;min-height:0;overflow:hidden;">
        ${heroGalleryHTML}
      </div>
    </div>
    ` : ''}

    <div class="p1-specs">
      <div class="section-label">
        <span class="section-num">02</span>
        <span class="section-label-text">${specsLabel}</span>
        <div class="section-label-line"></div>
      </div>
      <div class="specs-grid">
        ${specsHTML}
        ${descriptionHTML}
      </div>
    </div>

    <div class="page-footer">
      <div class="footer-left"><div class="footer-dot-green"></div><div class="footer-brand">AlhazenPDF</div></div>
      <div class="footer-center">Sayfa 1 / ${totalPages}</div>
      <div class="footer-date">${date}</div>
    </div>
  </div>
    `;
  } else if (isVintage) {
    // VINTAGE THEME
    const heroGalleryHTML = buildSmartGrid(heroPhotoData.slice(0, 4), '#EDE0C4', 'brightness(0.92) sepia(8%)');

    const specsHalfLength = Math.ceil(specs.length / 2);
    const specsFirstHalf = specs.slice(0, specsHalfLength);
    const specsSecondHalf = specs.slice(specsHalfLength);
    
    const specsRows = [];
    for (let i = 0; i < Math.max(specsFirstHalf.length, specsSecondHalf.length); i++) {
      const left = specsFirstHalf[i];
      const right = specsSecondHalf[i];
      specsRows.push(`
        <tr>
          ${left ? `<td class="key">${left[0]}</td><td class="val">${left[1]}</td>` : '<td></td><td></td>'}
          ${right ? `<td class="key">${right[0]}</td><td class="val">${right[1]}</td>` : '<td></td><td></td>'}
        </tr>
      `);
    }

    const descriptionHTML = description ? `
      <tr class="desc-row">
        <td class="key">Açıklama</td>
        <td class="desc-val" colspan="3">${description}</td>
      </tr>
    ` : '';

    page1 = `
  <div class="page">
  <div class="page-inner">
    <div class="p1-header">
      <div>
        <div class="brand-name">${companyName || 'AlhazenPDF'}</div>
        <div class="brand-sub">${category.name}</div>
      </div>
      <div class="header-right">
        <div class="header-ornament">❧</div>
        <div class="header-label">AlhazenPDF</div>
      </div>
    </div>

    <div class="p1-hero">
      <div>
        <div class="hero-eyebrow">${eyebrowText}</div>
        <div class="hero-title">${brand.toUpperCase()}</div>
        <div class="hero-model">${model}</div>
      </div>
      <div class="hero-right">
        ${year ? `<div class="year-badge">${year}</div>` : ''}
        ${price ? `
        <div class="hero-price-label">İstenen Fiyat</div>
        <div class="hero-price">${price}</div>
        ` : ''}
      </div>
    </div>

    ${heroPhotoData.length > 0 ? `
    <div class="p1-gallery">
      <div class="section-label">
        <span class="section-ornament">✦</span>
        <span class="section-label-text">Fotoğraf Galerisi</span>
        <div class="section-label-line"></div>
      </div>
      <div style="flex:1;min-height:0;overflow:hidden;">
        ${heroGalleryHTML}
      </div>
    </div>
    ` : ''}

    <div class="p1-specs">
      <div class="section-label">
        <span class="section-ornament">✦</span>
        <span class="section-label-text">${specsLabel}</span>
        <div class="section-label-line"></div>
      </div>
      <div class="specs-table-wrap">
        <table class="specs-table">
          ${specsRows.join('')}
          ${descriptionHTML}
        </table>
      </div>
    </div>

    <div class="page-footer">
      <div class="footer-brand">AlhazenPDF ile oluşturuldu</div>
      <div class="footer-dot"></div>
      <div class="footer-page">Sayfa 1 / ${totalPages}</div>
      <div class="footer-dot"></div>
      <div class="footer-date">${date}</div>
    </div>
  </div>
  </div>
    `;
  } else if (isBurgundy) {
    // BURGUNDY GOLD THEME
    const heroGalleryHTML = buildSmartGrid(heroPhotoData.slice(0, 4), '#380E14', 'brightness(0.88) contrast(1.05) sepia(5%)');

    const specsHalfLength = Math.ceil(specs.length / 2);
    const specsFirstHalf = specs.slice(0, specsHalfLength);
    const specsSecondHalf = specs.slice(specsHalfLength);
    const specsRows = [];
    for (let i = 0; i < Math.max(specsFirstHalf.length, specsSecondHalf.length); i++) {
      const left = specsFirstHalf[i];
      const right = specsSecondHalf[i];
      specsRows.push(`<tr>
        ${left ? `<td class="key">${left[0]}</td><td class="val">${left[1]}</td>` : '<td></td><td></td>'}
        ${right ? `<td class="key">${right[0]}</td><td class="val">${right[1]}</td>` : '<td></td><td></td>'}
      </tr>`);
    }
    const descriptionHTML = description ? `<tr><td class="key">Açıklama</td><td class="desc-val" colspan="3">${description}</td></tr>` : '';

    page1 = `
  <div class="page">
    <div class="frame"></div>
    <div class="corner tl"></div><div class="corner tr"></div>
    <div class="corner bl"></div><div class="corner br"></div>
    <div class="p1-header">
      <div><div class="brand-name">${companyName || 'AlhazenPDF'}</div><div class="brand-sub">${category.name}</div></div>
      <div class="header-right"><div class="header-ornament">❧</div><div class="header-label">AlhazenPDF</div></div>
    </div>
    <div class="p1-hero">
      <div>
        <div class="hero-eyebrow">${eyebrowText}</div>
        <div class="hero-title">${brand.toUpperCase()}</div>
        <div class="hero-model">${model}</div>
      </div>
      <div class="hero-right">
        ${year ? `<div class="year-badge">${year}</div>` : ''}
        ${price ? `<div class="price-label">İstenen Fiyat</div><div class="price-val">${price}</div>` : ''}
      </div>
    </div>
    ${heroPhotoData.length > 0 ? `
    <div class="p1-gallery">
      <div class="section-label"><span class="section-ornament">✦</span><span class="section-label-text">Fotoğraf Galerisi</span><div class="section-label-line"></div></div>
      <div style="flex:1;min-height:0;overflow:hidden;">${heroGalleryHTML}</div>
    </div>` : ''}
    <div class="p1-specs">
      <div class="section-label"><span class="section-ornament">✦</span><span class="section-label-text">${specsLabel}</span><div class="section-label-line"></div></div>
      <div class="specs-table-wrap"><table class="specs-table">${specsRows.join('')}${descriptionHTML}</table></div>
    </div>
    <div class="page-footer">
      <div class="footer-brand">AlhazenPDF ile oluşturuldu</div>
      <div class="footer-dot"></div>
      <div class="footer-page">Sayfa 1 / ${totalPages}</div>
      <div class="footer-dot"></div>
      <div class="footer-date">${date}</div>
    </div>
  </div>`;

  } else if (isNavySilver) {
    // NAVY SILVER THEME
    const heroGalleryHTML = buildSmartGrid(heroPhotoData.slice(0, 4), '#1A2E55', 'brightness(0.88) contrast(1.04) saturate(0.95)');

    const specsHTML = specs.map(([key, val]) => `<div class="spec-cell"><div class="spec-key">${key}</div><div class="spec-val">${val}</div></div>`).join('');
    const descriptionHTML = description ? `<div class="spec-cell desc-cell"><div class="spec-key">Açıklama</div><div class="spec-desc">${description}</div></div>` : '';

    page1 = `
  <div class="page">
    <div class="p1-header">
      <div><div class="brand-name">${companyName || 'AlhazenPDF'}</div><div class="brand-sub">${category.name}</div></div>
      <div class="header-badge"><div class="header-badge-line"></div><div class="header-badge-text">AlhazenPDF</div></div>
    </div>
    <div class="p1-hero">
      <div>
        <div class="hero-eyebrow">${eyebrowText}</div>
        <div class="hero-title">${brand.toUpperCase()}</div>
        <div class="hero-model">${model}${year ? ' · ' + year : ''}</div>
      </div>
      ${price ? `<div class="hero-right"><div class="price-box"><div class="price-label">İstenen Fiyat</div><div class="price-val">${price}</div></div></div>` : ''}
    </div>
    ${heroPhotoData.length > 0 ? `
    <div class="p1-gallery">
      <div class="section-label"><span class="section-label-text">Fotoğraf Galerisi</span><div class="section-label-line"></div></div>
      <div style="flex:1;min-height:0;overflow:hidden;">${heroGalleryHTML}</div>
    </div>` : ''}
    <div class="p1-specs">
      <div class="section-label"><span class="section-label-text">${specsLabel}</span><div class="section-label-line"></div></div>
      <div class="specs-grid">${specsHTML}${descriptionHTML}</div>
    </div>
    <div class="page-footer">
      <div class="footer-brand">AlhazenPDF</div>
      <div class="footer-dot"></div>
      <div class="footer-page">Sayfa 1 / ${totalPages}</div>
      <div class="footer-dot"></div>
      <div class="footer-date">${date}</div>
    </div>
  </div>`;

  } else if (isCopper) {
    // COPPER MIDNIGHT THEME
    const heroGalleryHTML = buildSmartGrid(heroPhotoData.slice(0, 4), '#10182A', 'brightness(0.86) contrast(1.06) saturate(0.88)');

    const specsHTML = specs.map(([key, val]) => `<div class="spec-cell"><div class="spec-key">${key}</div><div class="spec-val">${val}</div></div>`).join('');
    const descriptionHTML = description ? `<div class="spec-cell desc-cell"><div class="spec-key">Açıklama</div><div class="spec-desc">${description}</div></div>` : '';

    page1 = `
  <div class="page">
    <div class="frame"></div>
    <div class="p1-header">
      <div><div class="brand-name">${companyName || 'AlhazenPDF'}</div><div class="brand-sub">${category.name}</div></div>
      <div class="header-right"><div class="header-copper-line"></div><div class="header-label">AlhazenPDF</div></div>
    </div>
    <div class="p1-hero">
      <div>
        <div class="hero-eyebrow">${eyebrowText}</div>
        <div class="hero-title">${brand.toUpperCase()}</div>
        <div class="hero-model">${model}</div>
      </div>
      ${price ? `<div class="hero-right"><div class="price-box"><div class="price-label">İstenen Fiyat</div><div class="price-val">${price}</div>${year ? `<div class="year-tag">${year}</div>` : ''}</div></div>` : ''}
    </div>
    ${heroPhotoData.length > 0 ? `
    <div class="p1-gallery">
      <div class="section-label"><span class="section-label-text">Fotoğraf Galerisi</span><div class="section-label-line"></div></div>
      <div style="flex:1;min-height:0;overflow:hidden;">${heroGalleryHTML}</div>
    </div>` : ''}
    <div class="p1-specs">
      <div class="section-label"><span class="section-label-text">${specsLabel}</span><div class="section-label-line"></div></div>
      <div class="specs-grid">${specsHTML}${descriptionHTML}</div>
    </div>
    <div class="page-footer">
      <div class="footer-brand">AlhazenPDF</div>
      <div class="footer-dot"></div>
      <div class="footer-page">Sayfa 1 / ${totalPages}</div>
      <div class="footer-dot"></div>
      <div class="footer-date">${date}</div>
    </div>
  </div>`;

  } else if (isGrayOrange) {
    // GRAY ORANGE THEME
    const heroGalleryHTML = buildSmartGrid(heroPhotoData.slice(0, 4), '#1E1E1E', 'brightness(0.88) contrast(1.08) saturate(0.9)');

    const specsHTML = specs.map(([key, val]) => `<div class="spec-cell"><div class="spec-key">${key}</div><div class="spec-val">${val}</div></div>`).join('');
    const descriptionHTML = description ? `<div class="spec-cell desc-cell"><div class="spec-key">Açıklama</div><div class="spec-desc">${description}</div></div>` : '';

    page1 = `
  <div class="page">
    <div class="p1-header">
      <div><div class="brand-name">${companyName || 'AlhazenPDF'}</div><div class="brand-sub">${category.name}</div></div>
      <div class="header-tag"><div class="header-tag-bar"></div><div class="header-tag-text">AlhazenPDF</div></div>
    </div>
    <div class="p1-hero">
      <div class="hero-accent-bar"></div>
      <div class="hero-content">
        <div>
          <div class="hero-eyebrow">${eyebrowText}</div>
          <div class="hero-title">${brand.toUpperCase()}</div>
          <div class="hero-model">${model}</div>
        </div>
        ${price ? `<div class="hero-right"><div class="price-label">İstenen Fiyat</div><div class="price-val">${price}</div>${year ? `<div class="year-tag">${year}</div>` : ''}</div>` : ''}
      </div>
    </div>
    ${heroPhotoData.length > 0 ? `
    <div class="p1-gallery">
      <div class="section-label"><span class="section-num">01</span><span class="section-label-text">Fotoğraf Galerisi</span><div class="section-label-line"></div></div>
      <div style="flex:1;min-height:0;overflow:hidden;">${heroGalleryHTML}</div>
    </div>` : ''}
    <div class="p1-specs">
      <div class="section-label"><span class="section-num">02</span><span class="section-label-text">${specsLabel}</span><div class="section-label-line"></div></div>
      <div class="specs-grid">${specsHTML}${descriptionHTML}</div>
    </div>
    <div class="page-footer">
      <div class="footer-brand">AlhazenPDF</div>
      <div class="footer-dot"></div>
      <div class="footer-page">Sayfa 1 / ${totalPages}</div>
      <div class="footer-dot"></div>
      <div class="footer-date">${date}</div>
    </div>
  </div>`;

  } else {
    // WHITE THEME (DEFAULT)
    const heroGalleryHTML = buildSmartGrid(heroPhotoData.slice(0, 4), '#EEEEEE', 'brightness(0.92) sepia(8%)');

    const specsHTML = specs.map(([key, val]) => `
      <div class="spec-cell"><div class="spec-key">${key}</div><div class="spec-val">${val}</div></div>
    `).join('');

    const descriptionHTML = description ? `
      <div class="spec-cell" style="grid-column: span 4; background: #F8F8F8; padding: 16px 18px; min-height: 72px;">
        <div class="spec-key" style="margin-bottom: 8px;">Açıklama</div>
        <div style="font-family: 'Playfair Display', serif; font-size: 13px; font-style: italic; font-weight: 400; color: #444; line-height: 1.65; letter-spacing: 0.2px;">
          ${description}
        </div>
      </div>
    ` : '';

    page1 = `
  <div class="page">
    <div class="accent-top"></div>

    <div class="p1-header">
      <div>
        <div class="brand-name">${companyName || 'AlhazenPDF'}</div>
        <div class="brand-sub">${category.name}</div>
      </div>
      <div class="header-logo-wrap">
        ${logo ? `<img src="${logo}" />` : '<div class="header-logo-placeholder">LOGO</div>'}
      </div>
    </div>

    <div class="p1-hero">
      <div class="hero-left">
        <div class="hero-eyebrow">${eyebrowText}</div>
        <div class="hero-title">${brand.toUpperCase()}</div>
        <div class="hero-model">${model}</div>
      </div>
      ${price ? `
      <div class="hero-right">
        <div class="hero-price-label">İstenen Fiyat</div>
        <div class="hero-price">${price}</div>
        ${year ? `<div class="hero-year-badge">${year}</div>` : ''}
      </div>
      ` : ''}
    </div>

    ${heroPhotoData.length > 0 ? `
    <div class="p1-gallery">
      <div class="section-label">
        <span class="section-label-text">Fotoğraf Galerisi</span>
        <div class="section-label-line"></div>
      </div>
      <div style="flex:1;min-height:0;overflow:hidden;">
        ${heroGalleryHTML}
      </div>
    </div>
    ` : ''}

    <div class="p1-specs">
      <div class="section-label">
        <span class="section-label-text">${specsLabel}</span>
        <div class="section-label-line"></div>
      </div>
      <div class="specs-grid">
        ${specsHTML}
        ${descriptionHTML}
      </div>
    </div>

    <div class="page-footer">
      <div class="footer-brand">AlhazenPDF</div>
      <div class="footer-page">Sayfa 1 / ${totalPages}</div>
      <div class="footer-date">${date}</div>
    </div>
    <div class="accent-bottom"></div>
  </div>
    `;
  }

  // ═══════════════════════════════════════════════════════
  // GALLERY PAGES (2+)
  // ═══════════════════════════════════════════════════════
  // ─── Gallery page footer builders ───
  const totalPhotoCount = heroPhotoData.length + galleryPageData.flat().length;
  const totalBadgeHTML = (isLast) => isLast ? `
    <div class="total-badge">
      <div class="total-line"></div>
      <div class="total-text">Toplam ${totalPhotoCount} Fotoğraf</div>
      <div class="total-line"></div>
    </div>` : '';

  const additionalPages = galleryPageData.map((pagePhotoObjs, index) => {
    const pageNum = index + 2;
    const isLastPage = pageNum === totalPages;

    // Color/filter per theme
    const bgColor = isDarkGold ? '#1A1A1A'
      : isGreen      ? '#1A2A1A'
      : isVintage    ? '#EDE0C4'
      : isBurgundy   ? '#380E14'
      : isNavySilver ? '#1A2E55'
      : isCopper     ? '#10182A'
      : isGrayOrange ? '#1E1E1E'
      : '#EEEEEE';
    const imgFilter = isDarkGold  ? 'brightness(0.88) contrast(1.05)'
      : isVintage    ? 'brightness(0.92) sepia(8%)'
      : isBurgundy   ? 'brightness(0.88) contrast(1.05) sepia(5%)'
      : isNavySilver ? 'brightness(0.88) contrast(1.04) saturate(0.95)'
      : isCopper     ? 'brightness(0.86) contrast(1.06) saturate(0.88)'
      : isGrayOrange ? 'brightness(0.88) contrast(1.08) saturate(0.9)'
      : '';

    const smartGridHTML = buildSmartGrid(pagePhotoObjs, bgColor, imgFilter);

    if (isDarkGold) {
      return `
  <div class="page${isLastPage ? ' page-last' : ''}">
    <div class="corner tl"></div><div class="corner tr"></div>
    <div class="corner bl"></div><div class="corner br"></div>
    <div class="gallery-page-header">
      <div class="gph-brand">${companyName || 'AlhazenPDF'}</div>
      <div class="gph-model">${title}</div>
    </div>
    <div class="gallery-page-content" style="display:flex;flex-direction:column;">
      <div class="section-label">
        <span class="section-label-text">Fotoğraf Galerisi</span>
        <div class="section-label-line"></div>
      </div>
      <div style="flex:1;min-height:0;">
        ${smartGridHTML}
      </div>
      ${totalBadgeHTML(isLastPage)}
    </div>
    <div class="page-footer">
      <div class="footer-brand">AlhazenPDF</div>
      <div class="footer-dot"></div>
      <div class="footer-page">Sayfa ${pageNum} / ${totalPages}</div>
      <div class="footer-dot"></div>
      <div class="footer-date">${date}</div>
    </div>
  </div>`;
    } else if (isGreen) {
      return `
  <div class="page${isLastPage ? ' page-last' : ''}">
    <div class="gallery-page-header">
      <div class="gph-brand">${companyName || 'AlhazenPDF'}</div>
      <div class="gph-model">${title}</div>
    </div>
    <div class="gallery-page-content" style="display:flex;flex-direction:column;">
      <div class="section-label">
        <span class="section-num">0${index + 1}</span>
        <span class="section-label-text">Fotoğraf Galerisi</span>
        <div class="section-label-line"></div>
      </div>
      <div style="flex:1;min-height:0;">
        ${smartGridHTML}
      </div>
      ${totalBadgeHTML(isLastPage)}
    </div>
    <div class="page-footer">
      <div class="footer-left"><div class="footer-dot-green"></div><div class="footer-brand">AlhazenPDF</div></div>
      <div class="footer-center">Sayfa ${pageNum} / ${totalPages}</div>
      <div class="footer-date">${date}</div>
    </div>
  </div>`;
    } else if (isVintage) {
      return `
  <div class="page${isLastPage ? ' page-last' : ''}">
  <div class="page-inner">
    <div class="gallery-page-header">
      <div class="gph-brand">${companyName || 'AlhazenPDF'}</div>
      <div class="gph-model">${title}</div>
    </div>
    <div class="gallery-page-content" style="display:flex;flex-direction:column;">
      <div class="section-label">
        <span class="section-ornament">✦</span>
        <span class="section-label-text">Fotoğraf Galerisi</span>
        <div class="section-label-line"></div>
      </div>
      <div style="flex:1;min-height:0;">
        ${smartGridHTML}
      </div>
      ${totalBadgeHTML(isLastPage)}
    </div>
    <div class="page-footer">
      <div class="footer-brand">AlhazenPDF ile oluşturuldu</div>
      <div class="footer-dot"></div>
      <div class="footer-page">Sayfa ${pageNum} / ${totalPages}</div>
      <div class="footer-dot"></div>
      <div class="footer-date">${date}</div>
    </div>
  </div>
  </div>`;
    } else if (isBurgundy) {
      return `
  <div class="page${isLastPage ? ' page-last' : ''}">
    <div class="frame"></div>
    <div class="corner tl"></div><div class="corner tr"></div>
    <div class="corner bl"></div><div class="corner br"></div>
    <div class="gallery-page-header">
      <div class="gph-brand">${companyName || 'AlhazenPDF'}</div>
      <div class="gph-model">${title}</div>
    </div>
    <div class="gallery-page-content" style="display:flex;flex-direction:column;">
      <div class="section-label"><span class="section-ornament">✦</span><span class="section-label-text">Fotoğraf Galerisi</span><div class="section-label-line"></div></div>
      <div style="flex:1;min-height:0;">${smartGridHTML}</div>
      ${totalBadgeHTML(isLastPage)}
    </div>
    <div class="page-footer">
      <div class="footer-brand">AlhazenPDF ile oluşturuldu</div>
      <div class="footer-dot"></div>
      <div class="footer-page">Sayfa ${pageNum} / ${totalPages}</div>
      <div class="footer-dot"></div>
      <div class="footer-date">${date}</div>
    </div>
  </div>`;
    } else if (isNavySilver) {
      return `
  <div class="page${isLastPage ? ' page-last' : ''}">
    <div class="gallery-page-header">
      <div class="gph-brand">${companyName || 'AlhazenPDF'}</div>
      <div class="gph-model">${title}</div>
    </div>
    <div class="gallery-page-content" style="display:flex;flex-direction:column;">
      <div class="section-label"><span class="section-label-text">Fotoğraf Galerisi</span><div class="section-label-line"></div></div>
      <div style="flex:1;min-height:0;">${smartGridHTML}</div>
      ${totalBadgeHTML(isLastPage)}
    </div>
    <div class="page-footer">
      <div class="footer-brand">AlhazenPDF</div>
      <div class="footer-dot"></div>
      <div class="footer-page">Sayfa ${pageNum} / ${totalPages}</div>
      <div class="footer-dot"></div>
      <div class="footer-date">${date}</div>
    </div>
  </div>`;
    } else if (isCopper) {
      return `
  <div class="page${isLastPage ? ' page-last' : ''}">
    <div class="frame"></div>
    <div class="gallery-page-header">
      <div class="gph-brand">${companyName || 'AlhazenPDF'}</div>
      <div class="gph-model">${title}</div>
    </div>
    <div class="gallery-page-content" style="display:flex;flex-direction:column;">
      <div class="section-label"><span class="section-label-text">Fotoğraf Galerisi</span><div class="section-label-line"></div></div>
      <div style="flex:1;min-height:0;">${smartGridHTML}</div>
      ${totalBadgeHTML(isLastPage)}
    </div>
    <div class="page-footer">
      <div class="footer-brand">AlhazenPDF</div>
      <div class="footer-dot"></div>
      <div class="footer-page">Sayfa ${pageNum} / ${totalPages}</div>
      <div class="footer-dot"></div>
      <div class="footer-date">${date}</div>
    </div>
  </div>`;
    } else if (isGrayOrange) {
      return `
  <div class="page${isLastPage ? ' page-last' : ''}">
    <div class="gallery-page-header">
      <div class="gph-accent"></div>
      <div class="gph-brand">${companyName || 'AlhazenPDF'}</div>
      <div class="gph-model">${title}</div>
    </div>
    <div class="gallery-page-content" style="display:flex;flex-direction:column;">
      <div class="section-label"><span class="section-num">0${index + 1}</span><span class="section-label-text">Fotoğraf Galerisi</span><div class="section-label-line"></div></div>
      <div style="flex:1;min-height:0;">${smartGridHTML}</div>
      ${totalBadgeHTML(isLastPage)}
    </div>
    <div class="page-footer">
      <div class="footer-brand">AlhazenPDF</div>
      <div class="footer-dot"></div>
      <div class="footer-page">Sayfa ${pageNum} / ${totalPages}</div>
      <div class="footer-dot"></div>
      <div class="footer-date">${date}</div>
    </div>
  </div>`;
    } else {
      // WHITE THEME
      return `
  <div class="page${isLastPage ? ' page-last' : ''}">
    <div class="accent-top"></div>
    <div class="gallery-page-header">
      <div class="gph-brand">${companyName || 'AlhazenPDF'}</div>
      <div class="gph-model">${title}</div>
    </div>
    <div class="gallery-page-content" style="display:flex;flex-direction:column;">
      <div class="section-label">
        <span class="section-label-text">Fotoğraf Galerisi</span>
        <div class="section-label-line"></div>
      </div>
      <div style="flex:1;min-height:0;">
        ${smartGridHTML}
      </div>
      ${totalBadgeHTML(isLastPage)}
    </div>
    <div class="page-footer">
      <div class="footer-brand">AlhazenPDF</div>
      <div class="footer-page">Sayfa ${pageNum} / ${totalPages}</div>
      <div class="footer-date">${date}</div>
    </div>
    <div class="accent-bottom"></div>
  </div>`;
    }
  }).join('\n');

  // ═══════════════════════════════════════════════════════
  // FINAL HTML
  // ═══════════════════════════════════════════════════════
  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${companyName || 'AlhazenPDF'} — ${title}</title>
  ${fontsLink}
  ${generateCSS(theme)}
</head>
<body>
  ${page1}
  ${additionalPages}
</body>
</html>
  `;
};


// ═══════════════════════════════════════════════════════════════════════════
// CV / KİŞİSEL PDF BUILDER — Yeşil Altın & Bej Vintage temaları
// ═══════════════════════════════════════════════════════════════════════════

export const buildCVHTML = (data) => {
  const { formData = {}, photos = [], logo, companyName } = data;

  const themeKey  = formData['CV Teması'] || 'yesil';
  const name      = formData['Ad Soyad']    || '';
  const title     = formData['Meslek']       || '';
  const birthDate = formData['Doğum Tarihi'] || '';
  const phone     = formData['Telefon']      || '';
  const email     = formData['Email']        || '';
  const address   = formData['Adres']        || '';
  const linkedin  = formData['LinkedIn']     || '';
  const about     = formData['Açıklama']     || '';

  const workHistory = Array.isArray(formData['İş Geçmişi'])    ? formData['İş Geçmişi']    : [];
  const skills      = Array.isArray(formData['Beceriler'])      ? formData['Beceriler']      : [];
  const languages   = Array.isArray(formData['Yabancı Diller']) ? formData['Yabancı Diller'] : [];

  const profilePhoto = logo || photos[0]?.base64 || null;

  const themes = {
    yesil: {
      sidebarBg:  '#0d1f0f', sidebarText: '#ffffff',
      accent:     '#c9a84c', accentLight: '#f0cc6a', accentDim: '201,168,76',
      avatarBg:   '#1a3a1c',
      mainBg:     '#ffffff', mainText: '#0d1f0f',
      cardBg:     '#f5f9f5', metaColor: '#9ca3af',
      divColor:   '#eef4ee', footColor: '#d1d5db', aboutColor: '#4b5563',
    },
    bej: {
      sidebarBg:  '#2c2416', sidebarText: '#f5edd8',
      accent:     '#b48c50', accentLight: '#e8c87a', accentDim: '180,140,80',
      avatarBg:   '#3d3020',
      mainBg:     '#faf7f2', mainText: '#2c2416',
      cardBg:     '#f2ece0', metaColor: '#a0917a',
      divColor:   '#e8dfd0', footColor: '#c9b99a', aboutColor: '#5c4f3a',
    },
  };

  const t = themes[themeKey] || themes.yesil;
  const sbAlpha = themeKey === 'bej' ? '245,237,216' : '255,255,255';
  const date = new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' });

  const profileHTML = profilePhoto
    ? `<img src="${profilePhoto}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />`
    : `<span style="font-size:32px;color:rgba(255,255,255,0.25);">&#128100;</span>`;

  const contactRow = (icon, val) => !val ? '' : `
    <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:9px;">
      <div style="width:24px;height:24px;border-radius:6px;background:rgba(${t.accentDim},0.15);display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0;">${icon}</div>
      <span style="font-size:11px;color:rgba(${sbAlpha},0.65);line-height:1.4;word-break:break-all;">${val}</span>
    </div>`;

  const skillsHTML = skills.length === 0 ? '' : `
    <div style="margin-bottom:20px;">
      <div style="font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(${t.accentDim},0.7);margin-bottom:10px;">BECERİLER</div>
      ${skills.map(s => `
        <div style="margin-bottom:9px;">
          <div style="font-size:11px;color:rgba(${sbAlpha},0.75);margin-bottom:4px;">${s.beceri}</div>
          <div style="height:3px;border-radius:99px;background:rgba(255,255,255,0.08);overflow:hidden;">
            <div style="height:100%;border-radius:99px;background:linear-gradient(90deg,${t.accent},${t.accentLight});width:${s.seviye}%;"></div>
          </div>
        </div>`).join('')}
    </div>`;

  const langsHTML = languages.length === 0 ? '' : `
    <div style="margin-bottom:20px;">
      <div style="font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(${t.accentDim},0.7);margin-bottom:10px;">DİLLER</div>
      ${languages.map(l => `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
          <span style="font-size:11px;color:rgba(${sbAlpha},0.75);">${l.dil}</span>
          <span style="display:flex;gap:4px;">
            ${[1,2,3,4,5].map(i =>
              `<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${i<=l.seviye ? t.accent : 'rgba(255,255,255,0.12)'};"></span>`
            ).join('')}
          </span>
        </div>`).join('')}
    </div>`;

  const workHTML = workHistory.length === 0 ? '' : `
    <div style="margin-bottom:20px;">
      <div style="font-size:14px;font-weight:700;color:${t.mainText};margin-bottom:11px;display:flex;align-items:center;gap:8px;font-family:Georgia,serif;">
        Çalışılan Kurumlar
        <span style="flex:1;height:1px;background:linear-gradient(90deg,rgba(0,0,0,0.12),transparent);display:inline-block;"></span>
      </div>
      <div style="display:flex;flex-direction:column;gap:7px;">
        ${workHistory.map(w => `
          <div style="padding:10px 13px;background:${t.cardBg};border-radius:9px;border-left:3px solid ${t.accent};">
            <div style="font-size:13px;font-weight:600;color:${t.mainText};margin-bottom:2px;">${w.sirket}</div>
            ${w.pozisyon ? `<div style="font-size:11px;color:${t.accent};font-weight:500;">${w.pozisyon}</div>` : ''}
            ${w.yil ? `<div style="font-size:10px;color:${t.metaColor};margin-top:2px;">${w.yil}</div>` : ''}
          </div>`).join('')}
      </div>
    </div>`;

  const infoItems = [
    companyName && { k: 'Sunulan Şirket', v: companyName },
    phone       && { k: 'Telefon',        v: phone },
    email       && { k: 'E-posta',        v: email },
    birthDate   && { k: 'Doğum Tarihi',   v: birthDate },
    address     && { k: 'Adres',          v: address },
    linkedin    && { k: 'LinkedIn',       v: linkedin },
  ].filter(Boolean);

  const infoHTML = infoItems.length === 0 ? '' : `
    <div style="margin-bottom:20px;">
      <div style="font-size:14px;font-weight:700;color:${t.mainText};margin-bottom:11px;display:flex;align-items:center;gap:8px;font-family:Georgia,serif;">
        Kişisel Bilgiler
        <span style="flex:1;height:1px;background:linear-gradient(90deg,rgba(0,0,0,0.12),transparent);display:inline-block;"></span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        ${infoItems.map(item => `
          <div style="background:${t.cardBg};border-radius:9px;padding:10px 13px;">
            <div style="font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${t.metaColor};margin-bottom:3px;">${item.k}</div>
            <div style="font-size:12px;font-weight:500;color:${t.mainText};line-height:1.3;">${item.v}</div>
          </div>`).join('')}
      </div>
    </div>`;

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>CV</title>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; }
    html, body { width:794px; height:1123px; overflow:hidden; }
    .page { width:794px; height:1123px; display:grid; grid-template-columns:248px 1fr; overflow:hidden; }
    .sidebar { background:${t.sidebarBg}; color:${t.sidebarText}; padding:44px 24px 30px; display:flex; flex-direction:column; overflow:hidden; }
    .main { background:${t.mainBg}; padding:44px 36px 30px; display:flex; flex-direction:column; overflow:hidden; }
  </style>
</head>
<body>
<div class="page">

  <div class="sidebar">
    <div style="display:flex;flex-direction:column;align-items:center;gap:11px;margin-bottom:24px;">
      <div style="width:90px;height:90px;border-radius:50%;padding:3px;background:linear-gradient(135deg,${t.accent},${t.accentLight});">
        <div style="width:100%;height:100%;border-radius:50%;overflow:hidden;background:${t.avatarBg};display:flex;align-items:center;justify-content:center;">
          ${profileHTML}
        </div>
      </div>
      <div style="font-size:17px;font-weight:700;color:${t.sidebarText};text-align:center;font-family:Georgia,serif;line-height:1.2;">${name || 'Ad Soyad'}</div>
      ${title ? `<div style="font-size:9px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:${t.accent};text-align:center;">${title}</div>` : ''}
    </div>

    <div style="width:34px;height:2px;background:linear-gradient(90deg,${t.accent},transparent);margin:0 auto 20px;"></div>

    <div style="margin-bottom:20px;">
      <div style="font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(${t.accentDim},0.7);margin-bottom:10px;">İLETİŞİM</div>
      ${contactRow('&#128222;', phone)}
      ${contactRow('&#9993;&#65039;', email)}
      ${contactRow('&#128205;', address)}
      ${contactRow('&#128279;', linkedin)}
    </div>

    ${skillsHTML}
    ${langsHTML}

    ${companyName ? `
    <div style="margin-top:auto;padding-top:14px;border-top:1px solid rgba(255,255,255,0.06);">
      <div style="font-size:9px;color:rgba(255,255,255,0.25);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:3px;">SUNULAN ŞİRKET</div>
      <div style="font-size:12px;font-weight:600;color:rgba(${t.accentDim},0.75);">${companyName}</div>
    </div>` : '<div style="margin-top:auto;"></div>'}

    <div style="text-align:center;margin-top:12px;font-size:8px;color:rgba(255,255,255,0.12);letter-spacing:0.15em;text-transform:uppercase;">AlhazenPDF</div>
  </div>

  <div class="main">
    <div style="margin-bottom:18px;">
      <div style="font-size:32px;font-weight:700;color:${t.mainText};line-height:1.1;margin-bottom:5px;font-family:Georgia,serif;">${name || 'Ad Soyad'}</div>
      ${title ? `<div style="font-size:11px;font-weight:700;color:${t.accent};letter-spacing:0.1em;text-transform:uppercase;margin-bottom:3px;">${title}</div>` : ''}
      ${birthDate ? `<div style="font-size:11px;color:${t.metaColor};">Doğum Tarihi: ${birthDate}</div>` : ''}
    </div>
    <div style="height:2px;margin-bottom:20px;background:linear-gradient(90deg,${t.accent},rgba(${t.accentDim},0.1) 60%,transparent);"></div>

    ${about ? `
    <div style="margin-bottom:20px;">
      <div style="font-size:14px;font-weight:700;color:${t.mainText};margin-bottom:10px;display:flex;align-items:center;gap:8px;font-family:Georgia,serif;">
        Hakkımda
        <span style="flex:1;height:1px;background:linear-gradient(90deg,rgba(0,0,0,0.12),transparent);display:inline-block;"></span>
      </div>
      <div style="font-size:12px;color:${t.aboutColor};line-height:1.75;">${about}</div>
    </div>` : ''}

    ${workHTML}
    ${infoHTML}

    <div style="margin-top:auto;padding-top:13px;border-top:1px solid ${t.divColor};display:flex;align-items:center;justify-content:space-between;">
      <div style="font-size:8px;letter-spacing:0.15em;text-transform:uppercase;color:${t.footColor};">ALHAZENPDF</div>
      <div style="font-size:10px;color:${t.footColor};">${date}</div>
    </div>
  </div>

</div>
</body>
</html>`;
};
