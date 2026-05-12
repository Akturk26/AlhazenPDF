/**
 * Green Gold Premium Theme (Yeşil-Altın)
 * Teknolojik, modern görünüm
 */
export const greenGoldTheme = {
  name: 'Premium Yeşil',
  
  // CSS Color Variables
  colors: {
    primary: '#0A1F0F',       // Koyu yeşil
    secondary: '#0D2614',     // Derin yeşil
    tertiary: '#153018',      // Orta yeşil
    accent: '#4CAF50',        // Neon yeşil
    accentSecondary: '#D4AF37', // Altın
    accentLight: '#F0D060',   // Açık altın
    text: '#F0EDE0',          // Bej beyaz
    textSecondary: '#6A8A6A', // Gri-yeşil
  },

  // Typography
  fonts: {
    heading: 'Unbounded',
    body: 'Space Grotesk',
    googleFontsURL: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&family=Unbounded:wght@300;400;700;900&display=swap',
  },

  // Layout Configuration
  layout: {
    headerStyle: 'badge',         // Badge (yeşil nokta + AlhazenPDF)
    galleryColumns: 2,            // 2-column gallery
    galleryMaxPhotos: 5,          // Max 5 fotoğraf
    specsLayout: 'grid',          // Grid layout
    specsColumns: 3,              // 3 sütun
    sectionStyle: 'numbered',     // 01, 02 numaralı başlıklar
    priceInHero: false,           // Fiyat specs'te
    footerDot: true,              // Footer'da parlayan nokta
    bottomBar: false,             // Alt çubuk yok
    multiPage: true,              // Çok sayfalı PDF desteği (4-25 foto arası, max 5 sayfa)
  },
};
