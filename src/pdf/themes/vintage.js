/**
 * Vintage Premium Theme (Bej-Kahverengi)
 * Klasik, nostaljik görünüm
 */
export const vintageTheme = {
  name: 'Premium Vintage',
  
  // CSS Color Variables
  colors: {
    primary: '#F5EDD8',       // Krem
    secondary: '#EDE0C4',     // Parşömen
    tertiary: '#D4C4A0',      // Sıcak orta ton
    accent: '#A08060',        // Açık kahve
    accentDark: '#7A5C3C',    // Kahverengi
    accentDarker: '#4A3020',  // Koyu kahve
    text: '#2A1A0C',          // Espresso
    textSecondary: '#A08060', // Açık kahve
  },

  // Typography
  fonts: {
    heading: 'Libre Baskerville',
    body: 'Jost',
    googleFontsURL: 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Jost:wght@200;300;400;500&display=swap',
  },

  // Layout Configuration
  layout: {
    headerStyle: 'ornament',      // ❧ süslemesi
    galleryColumns: 3,            // 3-column gallery
    galleryMaxPhotos: 5,          // Max 5 fotoğraf
    specsLayout: 'table',         // Table layout (vintage stil)
    specsColumns: 2,              // 2 sütun (key-value)
    sectionStyle: 'ornament',     // ✦ süslemeli başlıklar
    priceInHero: false,           // Fiyat table'da (siyah arka plan)
    footerDot: false,             // Footer'da nokta yok
    bottomBar: false,             // Alt çubuk yok
    border: true,                 // Çerçeve var
    multiPage: true,              // Çok sayfalı PDF desteği (4-25 foto arası, max 5 sayfa)
  },
};
