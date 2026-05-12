/**
 * Gray Orange Theme (Gri Turuncu)
 * Koyu gri + turuncu aksan, Barlow Condensed tipografi
 */
export const grayOrangeTheme = {
  name: 'Gri Turuncu',

  colors: {
    primary: '#0F0F0F',
    secondary: '#161616',
    tertiary: '#1E1E1E',
    accent: '#E86020',
    accentLight: '#FF8040',
    accentDark: '#8A3810',
    text: '#F0F0F0',
    textSecondary: '#6A6A6A',
    gray: '#3A3A3A',
    gray2: '#525252',
    gray3: '#7A7A7A',
  },

  fonts: {
    heading: 'Barlow Condensed',
    body: 'Barlow',
    googleFontsURL: 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700;800&family=Barlow:wght@300;400;500&display=swap',
  },

  layout: {
    headerStyle: 'grayOrange',
    galleryColumns: 2,
    galleryMaxPhotos: 5,
    specsLayout: 'grid',
    specsColumns: 3,
    sectionStyle: 'numbered',
    priceInHero: true,
    footerDot: true,
    bottomBar: false,
    multiPage: true,
  },
};
