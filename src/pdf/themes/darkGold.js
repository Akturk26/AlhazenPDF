/**
 * Dark Gold Premium Theme (Altın-Siyah)
 * Lüks, premium görünüm
 */
export const darkGoldTheme = {
  name: 'Premium Altın',
  
  // CSS Color Variables
  colors: {
    primary: '#0A0A0A',      // Siyah arka plan
    secondary: '#111111',     // Koyu gri
    tertiary: '#1A1A1A',      // Orta gri
    accent: '#C9A84C',        // Altın
    accentLight: '#E8C97A',   // Açık altın
    accentDark: '#9A7A2E',    // Koyu altın
    text: '#F5F0E8',          // Bej beyaz
    textSecondary: '#888888', // Gri
  },

  // Typography
  fonts: {
    heading: 'Cormorant Garamond',
    body: 'Montserrat',
    googleFontsURL: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Montserrat:wght@300;400;500;600&display=swap',
  },

  // Layout Configuration
  layout: {
    headerStyle: 'corners',       // Köşe süslemeleri
    galleryColumns: 2,            // 2-column gallery (1 ana + yan)
    galleryMaxPhotos: 5,          // Max 5 fotoğraf (tek sayfa modunda)
    specsLayout: 'grid',          // Grid layout
    specsColumns: 3,              // 3 sütun
    sectionStyle: 'simple',       // Basit section başlıkları
    priceInHero: false,           // Fiyat specs'te
    footerDot: true,              // Footer'da nokta
    bottomBar: false,             // Alt çubuk yok
    multiPage: true,              // Çok sayfalı PDF desteği (4-25 foto arası, max 5 sayfa)
  },
};
