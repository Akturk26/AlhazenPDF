/**
 * Modern (Mavi) Tema Konfigürasyonu
 */
export const modernTheme = {
  // Renk paleti
  colors: {
    primary: '#3b82f6',      // Ana mavi
    secondary: '#60a5fa',    // Açık mavi
    dark: '#1e40af',         // Koyu mavi
    text: '#111827',         // Koyu gri metin
    textLight: '#6b7280',    // Açık gri metin
    background: '#ffffff',   // Beyaz arkaplan
    border: '#e5e7eb',       // Açık gri border
    surface: '#f3f4f6',      // Açık gri yüzey
  },

  // Font ailesi
  fonts: {
    heading: "'Segoe UI', Arial, sans-serif",
    body: "'Segoe UI', Arial, sans-serif",
  },

  // Layout ayarları
  layout: {
    galleryColumns: 3,       // 3 sütunlu galeri
    specsLayout: 'table',    // Tablo düzeni
    showBorder: true,        // Dış border göster
    headerStyle: 'simple',   // Basit header
    footerStyle: 'simple',   // Basit footer
    galleryMaxPhotos: 5,     // Max 5 fotoğraf
    multiPage: false,        // Tek sayfa (bellek optimizasyonu)
  },

  // Özel özellikler
  features: {
    showAppBranding: true,   // AlhazenPDF markasını göster
    showDate: true,          // Tarihi göster
  },
};
