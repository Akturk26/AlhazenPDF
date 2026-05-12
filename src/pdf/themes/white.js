/**
 * White Silver Premium Theme (Beyaz-Gümüş)
 * Minimalist, şık görünüm
 */
export const whiteSilverTheme = {
  name: 'Premium Beyaz',
  
  // CSS Color Variables
  colors: {
    primary: '#FFFFFF',       // Beyaz
    secondary: '#F8F8F8',     // Açık gri
    tertiary: '#EEEEEE',      // Orta açık gri
    accent: '#111111',        // Siyah
    accentLight: '#444444',   // Koyu gri
    silver: '#C8C8C8',        // Gümüş
    silverDark: '#999999',    // Koyu gümüş
    text: '#111111',          // Siyah
    textSecondary: '#AAAAAA', // Orta gri
  },

  // Typography
  fonts: {
    heading: 'Playfair Display',
    body: 'DM Sans',
    googleFontsURL: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;700;900&family=DM+Sans:wght@200;300;400;500&display=swap',
  },

  // Layout Configuration
  layout: {
    headerStyle: 'simple',        // Basit header
    galleryColumns: 3,            // 3-column gallery
    galleryMaxPhotos: 5,          // Max 5 fotoğraf
    specsLayout: 'grid',          // Grid layout
    specsColumns: 4,              // 4 sütun
    sectionStyle: 'simple',       // Basit başlıklar
    priceInHero: true,            // Fiyat hero'da (siyah panel)
    footerDot: false,             // Footer'da nokta yok
    bottomBar: true,              // Alt gradient çubuk
    topBar: true,                 // Üst gradient çubuk
    multiPage: true,              // Çok sayfalı PDF desteği (4-25 foto arası, max 5 sayfa)
  },
};
