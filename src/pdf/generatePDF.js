/**
 * PDF Generator - expo-print wrapper
 * Tema seçimi ve PDF oluşturma işlemlerini yönetir
 */

import * as Print from 'expo-print';
import { buildHTML, buildMultiPageHTML, buildCVHTML } from './base';
import { buildCamStickerHTML, buildIlanKartiHTML, buildVitrinHTML, buildSocialDarkHTML, buildSocialGreenHTML, buildSocialStoryHTML } from './realEstatePDF';
import {
  buildA4OrangeHTML,
  buildA4NavyHTML,
  buildA4GreenHTML,
  buildA4GalacticHTML,
  buildA4SaldaHTML,
  buildA4CrystalHTML,
  buildA4AmberHTML,
  buildA4OltuHTML,
  buildA4VolkanHTML,
  buildA4TarihiHTML,
} from './salesCardsA4';
import { darkGoldTheme } from './themes/darkGold';
import { greenGoldTheme } from './themes/green';
import { vintageTheme } from './themes/vintage';
import { whiteSilverTheme } from './themes/white';
import { modernTheme } from './themes/modern';
import { burgundyGoldTheme } from './themes/burgundyGold';
import { navySilverTheme } from './themes/navySilver';
import { copperMidnightTheme } from './themes/copperMidnight';
import { grayOrangeTheme } from './themes/grayOrange';

// Tema haritası
const THEMES = {
  'modern': modernTheme,
  'darkGold': darkGoldTheme,
  'green': greenGoldTheme,
  'vintage': vintageTheme,
  'white': whiteSilverTheme,
  'burgundy': burgundyGoldTheme,
  'navySilver': navySilverTheme,
  'copper': copperMidnightTheme,
  'grayOrange': grayOrangeTheme,
};

/**
 * PDF Oluştur
 * @param {Object} data - PDF içeriği
 * @param {string} data.title - PDF başlığı (örn: "MERCEDES E200")
 * @param {Object} data.category - Kategori bilgisi
 * @param {Object} data.formData - Form verileri (Marka, Model, KM, vs.)
 * @param {string} data.logo - Logo base64 string
 * @param {string} data.companyName - Şirket adı
 * @param {Array} data.photos - Base64 fotoğraf array
 * @param {string} themeName - Tema adı ('modern', 'darkGold', 'green', 'vintage', 'white')
 * @returns {Promise<string>} PDF dosya URI'si
 */
export const generatePDF = async (data, themeName = 'modern') => {
  try {
    // Tema seç
    let theme = THEMES[themeName];
    
    if (!theme) {
      console.warn(`⚠️ Tema bulunamadı: ${themeName}, varsayılan tema kullanılıyor`);
      theme = modernTheme;
    }

    // KİŞİSEL CV: özel builder
    if (data.category?.id === 'personal') {
      let cvHtml = buildCVHTML(data);
      cvHtml = cvHtml
        .replace(/(<style[^>]*>)/i, '$1@page{size:A4;margin:0;}')
        .replace(/content="width=device-width[^"]*"/g, 'content="width=794"')
        .replace(/width\s*:\s*100vw/g, 'width: 794px')
        .replace(/height\s*:\s*100vh/g, 'height: 1123px')
        .replace(/<link[^>]*googleapis\.com[^>]*>/g, '');
      const { uri } = await Print.printToFileAsync({
        html: cvHtml,
        base64: false,
        width: 595,
        height: 842,
      });
      return uri;
    }

    // HTML oluştur (multi-page destekli temalar için özel builder)
    // BELLEK KONTROLÜ: multiPage temalarda 25+ foto olursa single-page (ilk 5)
    const photoCount = data.photos?.length || 0;
    const useMultiPage = theme.layout?.multiPage && photoCount <= 25;

    if (photoCount > 25) {
      console.warn(`⚠️ Bellek optimizasyonu: ${photoCount} foto → tek sayfa modu (ilk 5 foto)`);
    }

    let html = useMultiPage
      ? buildMultiPageHTML(data, theme)
      : buildHTML(data, theme);

    // expo-print Android fix: WebView has no attached layout so 100vw/100vh = 0
    // Replace viewport-relative units with explicit A4 pixel dimensions
    // Add @page size:A4 so Chrome's print engine creates correct A4 PDF (not oversized)
    // Also remove Google Fonts links (async network load can cause rendering to be missed)
    html = html
      .replace(/@page\s*\{/g, '@page { size: A4;')
      .replace(/content="width=device-width[^"]*"/g, 'content="width=794"')
      .replace(/width\s*:\s*100vw/g, 'width: 794px')
      .replace(/height\s*:\s*100vh/g, 'height: 1123px')
      .replace(/calc\(100vh\s*-\s*([\d.]+)px\s*-\s*([\d.]+)px\)/g, (_, a, b) => `${1123 - parseFloat(a) - parseFloat(b)}px`)
      .replace(/<link[^>]*googleapis\.com[^>]*>/g, '');

    // PDF'e çevir
    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
      width: 595,
      height: 842,
    });

    return uri;
  } catch (error) {
    console.error('❌ PDF oluşturma hatası:', error);
    throw error;
  }
};

/**
 * Real Estate / Auto Special Format PDF
 * @param {Object} data - { formData, photos, companyName, category }
 * @param {'cam-sticker'|'ilan-karti'|'vitrin'|'social-dark'|'social-green'|'social-story'} formatId
 */
export const generateRealEstatePDF = async (data, formatId) => {
  let html;
  let width = 794;
  let height = 1123;

  if (formatId === 'cam-sticker') {
    html = buildCamStickerHTML(data);
    width = 419;   // 559px CSS × 0.75 = 419pt (A5 width)
    height = 595;  // 794px CSS × 0.75 = 595pt (A5 height)
  } else if (formatId === 'ilan-karti') {
    html = buildIlanKartiHTML(data);
    width = 595;   // A4 width in points
    height = 842;  // A4 height in points
  } else if (formatId === 'vitrin') {
    html = buildVitrinHTML(data);
    width = 1191;  // 1587px CSS × 0.75 = 1190pt (A3 landscape width)
    height = 842;  // 1123px CSS × 0.75 = 842pt (A3 height)
  } else if (formatId === 'social-dark') {
    html = buildSocialDarkHTML(data);
    width = 450;   // 600px CSS × 0.75
    height = 450;
  } else if (formatId === 'social-green') {
    html = buildSocialGreenHTML(data);
    width = 450;
    height = 450;
  } else if (formatId === 'social-story') {
    html = buildSocialStoryHTML(data);
    width = 253;   // 338px CSS × 0.75
    height = 450;  // 600px CSS × 0.75
  } else if (formatId === 'a4-orange')   { html = buildA4OrangeHTML(data);   width = 595; height = 842;
  } else if (formatId === 'a4-navy')     { html = buildA4NavyHTML(data);     width = 595; height = 842;
  } else if (formatId === 'a4-green')    { html = buildA4GreenHTML(data);    width = 595; height = 842;
  } else if (formatId === 'a4-galactic') { html = buildA4GalacticHTML(data); width = 595; height = 842;
  } else if (formatId === 'a4-salda')    { html = buildA4SaldaHTML(data);    width = 595; height = 842;
  } else if (formatId === 'a4-crystal')  { html = buildA4CrystalHTML(data);  width = 595; height = 842;
  } else if (formatId === 'a4-amber')    { html = buildA4AmberHTML(data);    width = 595; height = 842;
  } else if (formatId === 'a4-oltu')     { html = buildA4OltuHTML(data);     width = 595; height = 842;
  } else if (formatId === 'a4-volkan')   { html = buildA4VolkanHTML(data);   width = 595; height = 842;
  } else if (formatId === 'a4-tarihi')   { html = buildA4TarihiHTML(data);   width = 595; height = 842;
  } else {
    throw new Error('Geçersiz format: ' + formatId);
  }

  // Google Fonts async yüklenmesi PDF render'ını bozuyor — kaldır
  if (html) {
    html = html.replace(/<link[^>]*googleapis\.com[^>]*>/g, '');
  }

  const { uri } = await Print.printToFileAsync({ html, base64: false, width, height });
  return uri;
};

/**
 * Mevcut temaları listele
 * @returns {Array} Tema isimleri
 */
export const getAvailableThemes = () => {
  return Object.keys(THEMES);
};

/**
 * Tema detaylarını getir
 * @param {string} themeName - Tema adı
 * @returns {Object} Tema objesi
 */
export const getTheme = (themeName) => {
  return THEMES[themeName] || darkGoldTheme;
};
