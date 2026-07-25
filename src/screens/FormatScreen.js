import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../themes/colors';
import Icon from '../components/Icon';

const GOLD = '#C9A84C';
const NAVY = '#0F172A';

const FORMATS_BY_CATEGORY = {
  'real-estate': [
    {
      id: 'standard', type: 'pdf',
      name: 'Standart PDF',
      desc: 'Çok sayfalı, tüm detaylar ve fotoğraflar',
      size: 'A4',
      color: NAVY,
      iconName: 'file-document-outline',
      useCase: 'Müşteri dosyası · E-posta',
      maxPhotos: 25,
    },
    {
      id: 'cam-sticker', type: 'pdf',
      name: 'Cam Sticker',
      desc: 'Dükkan camına yapıştırma afişi',
      size: 'A5  148×210 mm',
      color: '#E05555',
      iconName: 'tag-outline',
      useCase: 'Ofis camı · Vitrinde ilan',
      maxPhotos: 1,
    },
    {
      id: 'ilan-karti', type: 'pdf',
      name: 'İlan Kartı',
      desc: 'Tek sayfalık, müşteriye verilecek ilan',
      size: 'A4  210×297 mm',
      color: '#3DBA7C',
      iconName: 'home-outline',
      useCase: 'Müşteriye ver · Broşür',
      maxPhotos: 1,
    },
    {
      id: 'vitrin', type: 'pdf',
      name: 'Vitrin Afişi',
      desc: 'Büyük cam ve ilan panolarına, sayfa başı 2 fotoğraf',
      size: 'A3  420×297 mm',
      color: GOLD,
      iconName: 'image-frame',
      useCase: 'Büyük cam · İlan panosu',
      maxPhotos: 20,
    },
    // Sosyal Medya
    {
      id: 'social-dark', type: 'social',
      name: 'Sosyal Medya · Koyu',
      desc: 'Siyah & altın kare kart, Instagram/Facebook',
      size: '1080×1080',
      color: GOLD,
      iconName: 'instagram',
      gradientColors: ['#0a0a0a', '#1e1a0f'],
      useCase: 'Instagram · Facebook',
      maxPhotos: 1,
    },
    {
      id: 'social-green', type: 'social',
      name: 'Sosyal Medya · Yeşil',
      desc: 'Beyaz & yeşil kare kart, Instagram/Facebook',
      size: '1080×1080',
      color: '#2E7D32',
      iconName: 'instagram',
      gradientColors: ['#f0fff4', '#c6f6d5'],
      useCase: 'Instagram · Facebook',
      maxPhotos: 1,
    },
    {
      id: 'social-story', type: 'social',
      name: 'Instagram Story',
      desc: '9:16 dikey format, hikaye ve WhatsApp durumu',
      size: '1080×1920',
      color: '#7C3AED',
      iconName: 'cellphone-play',
      gradientColors: ['#1A103D', '#2D1B6B'],
      useCase: 'Story · WhatsApp Durum',
      maxPhotos: 1,
    },
    // Satış Kartları
    {
      id: 'sales-arch-story', type: 'sales-card',
      name: 'Mimari · Dikey',
      desc: 'Endüstriyel beton doku, pas çelik',
      size: '1080×1920',
      color: '#D4782A',
      gradientColors: ['#1A1410', '#2D200E'],
      useCase: 'WhatsApp · Story · Vitrin',
      maxPhotos: 1,
    },
    {
      id: 'sales-arch-post', type: 'sales-card',
      name: 'Mimari · Kare',
      desc: 'Endüstriyel beton doku, pas çelik',
      size: '1080×1080',
      color: '#D4782A',
      gradientColors: ['#1A1410', '#2D200E'],
      useCase: 'Instagram · Facebook',
      maxPhotos: 1,
    },
    {
      id: 'sales-sakura-story', type: 'sales-card',
      name: 'Sakura · Dikey',
      desc: 'Japon kiraz çiçeği, altın varak',
      size: '1080×1920',
      color: '#C0667A',
      gradientColors: ['#FFF0F5', '#F4C2D4'],
      useCase: 'WhatsApp · Story · Vitrin',
      maxPhotos: 1,
    },
    {
      id: 'sales-sakura-post', type: 'sales-card',
      name: 'Sakura · Kare',
      desc: 'Japon kiraz çiçeği, altın varak',
      size: '1080×1080',
      color: '#C0667A',
      gradientColors: ['#FFF0F5', '#F4C2D4'],
      useCase: 'Instagram · Facebook',
      maxPhotos: 1,
    },
    {
      id: 'sales-deep-story', type: 'sales-card',
      name: 'Derin · Dikey',
      desc: 'Okyanus mavisi, gümüş dalga',
      size: '1080×1920',
      color: '#4DA8DA',
      gradientColors: ['#06152B', '#0C2547'],
      useCase: 'WhatsApp · Story · Vitrin',
      maxPhotos: 1,
    },
    {
      id: 'sales-deep-post', type: 'sales-card',
      name: 'Derin · Kare',
      desc: 'Okyanus mavisi, gümüş dalga',
      size: '1080×1080',
      color: '#4DA8DA',
      gradientColors: ['#06152B', '#0C2547'],
      useCase: 'Instagram · Facebook',
      maxPhotos: 1,
    },
    {
      id: 'sales-volcano-story', type: 'sales-card',
      name: 'Volkan · Dikey',
      desc: 'Lav kırmızısı, ateş turuncu',
      size: '1080×1920',
      color: '#FF4500',
      gradientColors: ['#1C0500', '#360A00'],
      useCase: 'WhatsApp · Story · Vitrin',
      maxPhotos: 1,
    },
    {
      id: 'sales-volcano-post', type: 'sales-card',
      name: 'Volkan · Kare',
      desc: 'Lav kırmızısı, ateş turuncu',
      size: '1080×1080',
      color: '#FF4500',
      gradientColors: ['#1C0500', '#360A00'],
      useCase: 'Instagram · Facebook',
      maxPhotos: 1,
    },
    {
      id: 'sales-hist-story', type: 'sales-card',
      name: 'Tarihi · Dikey',
      desc: 'Antik papirüs, bronz mühür',
      size: '1080×1920',
      color: '#D4AF37',
      gradientColors: ['#2E2008', '#1A1202'],
      useCase: 'WhatsApp · Story · Vitrin',
      maxPhotos: 1,
    },
    {
      id: 'sales-hist-post', type: 'sales-card',
      name: 'Tarihi · Kare',
      desc: 'Antik papirüs, bronz mühür',
      size: '1080×1080',
      color: '#D4AF37',
      gradientColors: ['#2E2008', '#1A1202'],
      useCase: 'Instagram · Facebook',
      maxPhotos: 1,
    },
    // A4 Premium Themes
    {
      id: 'a4-orange', type: 'sales-card',
      name: 'Turuncu A4',
      desc: 'Endüstriyel · Beton · Print',
      size: 'A4 · 595×842',
      color: '#FF6B00',
      gradientColors: ['#1a0c00', '#2d1500'],
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
    {
      id: 'a4-navy', type: 'sales-card',
      name: 'Lacivert A4',
      desc: 'Profesyonel · Kurumsal · Print',
      size: 'A4 · 595×842',
      color: '#4A90D9',
      gradientColors: ['#0a1628', '#0f2044'],
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
    {
      id: 'a4-green', type: 'sales-card',
      name: 'Yeşil A4',
      desc: 'Doğal · Zarif · Print',
      size: 'A4 · 595×842',
      color: '#4A6744',
      gradientColors: ['#0a1608', '#162010'],
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
    {
      id: 'a4-galactic', type: 'sales-card',
      name: 'Galaktik A4',
      desc: 'Uzay · Yıldızlar · Print',
      size: 'A4 · 595×842',
      color: '#67E8F9',
      gradientColors: ['#020617', '#0d1832'],
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
    {
      id: 'a4-salda', type: 'sales-card',
      name: 'Salda A4',
      desc: 'Kumsal · Deniz · Print',
      size: 'A4 · 595×842',
      color: '#5ABCD8',
      gradientColors: ['#e0f7ff', '#b3ecff'],
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
    {
      id: 'a4-crystal', type: 'sales-card',
      name: 'Kristal A4',
      desc: 'Çok Renkli · Zarif · Print',
      size: 'A4 · 595×842',
      color: '#3B82F6',
      gradientColors: ['#1e1b4b', '#312e81'],
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
    {
      id: 'a4-amber', type: 'sales-card',
      name: 'Kehribar A4',
      desc: 'Reçine · Bal · Print',
      size: 'A4 · 595×842',
      color: '#F59E0B',
      gradientColors: ['#1c1000', '#2e1a00'],
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
    {
      id: 'a4-oltu', type: 'sales-card',
      name: 'Oltu A4',
      desc: 'Gökkuşağı · Opal · Print',
      size: 'A4 · 595×842',
      color: '#C4B5FD',
      gradientColors: ['#0f0a1e', '#1a1130'],
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
    {
      id: 'a4-volkan', type: 'sales-card',
      name: 'Volkan A4',
      desc: 'Lav · Ateş · Print',
      size: 'A4 · 595×842',
      color: '#FF8C00',
      gradientColors: ['#1C0500', '#360A00'],
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
    {
      id: 'a4-tarihi', type: 'sales-card',
      name: 'Tarihi A4',
      desc: 'Papirüs · Bronz · Print',
      size: 'A4 · 595×842',
      color: '#D4AF37',
      gradientColors: ['#2E2008', '#1A1202'],
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
  ],
  'auto': [
    {
      id: 'standard', type: 'pdf',
      name: 'Standart PDF',
      desc: 'Çok sayfalı, tüm detaylar ve fotoğraflar',
      size: 'A4',
      color: NAVY,
      iconName: 'file-document-outline',
      useCase: 'Müşteri dosyası · E-posta',
      maxPhotos: 25,
    },
    // Sosyal Medya
    {
      id: 'social-dark', type: 'social',
      name: 'Sosyal Medya · Koyu',
      desc: 'Siyah & altın kare kart, Instagram/Facebook',
      size: '1080×1080',
      color: GOLD,
      iconName: 'instagram',
      gradientColors: ['#0a0a0a', '#1e1a0f'],
      useCase: 'Instagram · Facebook',
      maxPhotos: 1,
    },
    {
      id: 'social-green', type: 'social',
      name: 'Sosyal Medya · Yeşil',
      desc: 'Beyaz & yeşil kare kart, Instagram/Facebook',
      size: '1080×1080',
      color: '#2E7D32',
      iconName: 'instagram',
      gradientColors: ['#f0fff4', '#c6f6d5'],
      useCase: 'Instagram · Facebook',
      maxPhotos: 1,
    },
    {
      id: 'social-story', type: 'social',
      name: 'Instagram Story',
      desc: '9:16 dikey format, hikaye ve WhatsApp durumu',
      size: '1080×1920',
      color: '#7C3AED',
      iconName: 'cellphone-play',
      gradientColors: ['#1A103D', '#2D1B6B'],
      useCase: 'Story · WhatsApp Durum',
      maxPhotos: 1,
    },
    // Satış Kartları
    {
      id: 'sales-arch-story', type: 'sales-card',
      name: 'Mimari · Dikey',
      desc: 'Endüstriyel beton doku, pas çelik',
      size: '1080×1920',
      color: '#D4782A',
      gradientColors: ['#1A1410', '#2D200E'],
      useCase: 'WhatsApp · Story · Vitrin',
      maxPhotos: 1,
    },
    {
      id: 'sales-arch-post', type: 'sales-card',
      name: 'Mimari · Kare',
      desc: 'Endüstriyel beton doku, pas çelik',
      size: '1080×1080',
      color: '#D4782A',
      gradientColors: ['#1A1410', '#2D200E'],
      useCase: 'Instagram · Facebook',
      maxPhotos: 1,
    },
    {
      id: 'sales-sakura-story', type: 'sales-card',
      name: 'Sakura · Dikey',
      desc: 'Japon kiraz çiçeği, altın varak',
      size: '1080×1920',
      color: '#C0667A',
      gradientColors: ['#FFF0F5', '#F4C2D4'],
      useCase: 'WhatsApp · Story · Vitrin',
      maxPhotos: 1,
    },
    {
      id: 'sales-sakura-post', type: 'sales-card',
      name: 'Sakura · Kare',
      desc: 'Japon kiraz çiçeği, altın varak',
      size: '1080×1080',
      color: '#C0667A',
      gradientColors: ['#FFF0F5', '#F4C2D4'],
      useCase: 'Instagram · Facebook',
      maxPhotos: 1,
    },
    {
      id: 'sales-deep-story', type: 'sales-card',
      name: 'Derin · Dikey',
      desc: 'Okyanus mavisi, gümüş dalga',
      size: '1080×1920',
      color: '#4DA8DA',
      gradientColors: ['#06152B', '#0C2547'],
      useCase: 'WhatsApp · Story · Vitrin',
      maxPhotos: 1,
    },
    {
      id: 'sales-deep-post', type: 'sales-card',
      name: 'Derin · Kare',
      desc: 'Okyanus mavisi, gümüş dalga',
      size: '1080×1080',
      color: '#4DA8DA',
      gradientColors: ['#06152B', '#0C2547'],
      useCase: 'Instagram · Facebook',
      maxPhotos: 1,
    },
    {
      id: 'sales-volcano-story', type: 'sales-card',
      name: 'Volkan · Dikey',
      desc: 'Lav kırmızısı, ateş turuncu',
      size: '1080×1920',
      color: '#FF4500',
      gradientColors: ['#1C0500', '#360A00'],
      useCase: 'WhatsApp · Story · Vitrin',
      maxPhotos: 1,
    },
    {
      id: 'sales-volcano-post', type: 'sales-card',
      name: 'Volkan · Kare',
      desc: 'Lav kırmızısı, ateş turuncu',
      size: '1080×1080',
      color: '#FF4500',
      gradientColors: ['#1C0500', '#360A00'],
      useCase: 'Instagram · Facebook',
      maxPhotos: 1,
    },
    {
      id: 'sales-hist-story', type: 'sales-card',
      name: 'Tarihi · Dikey',
      desc: 'Antik papirüs, bronz mühür',
      size: '1080×1920',
      color: '#D4AF37',
      gradientColors: ['#2E2008', '#1A1202'],
      useCase: 'WhatsApp · Story · Vitrin',
      maxPhotos: 1,
    },
    {
      id: 'sales-hist-post', type: 'sales-card',
      name: 'Tarihi · Kare',
      desc: 'Antik papirüs, bronz mühür',
      size: '1080×1080',
      color: '#D4AF37',
      gradientColors: ['#2E2008', '#1A1202'],
      useCase: 'Instagram · Facebook',
      maxPhotos: 1,
    },
    // A4 Premium Themes
    {
      id: 'a4-orange', type: 'sales-card',
      name: 'Turuncu A4',
      desc: 'Endüstriyel · Beton · Print',
      size: 'A4 · 595×842',
      color: '#FF6B00',
      gradientColors: ['#1a0c00', '#2d1500'],
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
    {
      id: 'a4-navy', type: 'sales-card',
      name: 'Lacivert A4',
      desc: 'Profesyonel · Kurumsal · Print',
      size: 'A4 · 595×842',
      color: '#4A90D9',
      gradientColors: ['#0a1628', '#0f2044'],
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
    {
      id: 'a4-green', type: 'sales-card',
      name: 'Yeşil A4',
      desc: 'Doğal · Zarif · Print',
      size: 'A4 · 595×842',
      color: '#4A6744',
      gradientColors: ['#0a1608', '#162010'],
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
    {
      id: 'a4-galactic', type: 'sales-card',
      name: 'Galaktik A4',
      desc: 'Uzay · Yıldızlar · Print',
      size: 'A4 · 595×842',
      color: '#67E8F9',
      gradientColors: ['#020617', '#0d1832'],
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
    {
      id: 'a4-salda', type: 'sales-card',
      name: 'Salda A4',
      desc: 'Kumsal · Deniz · Print',
      size: 'A4 · 595×842',
      color: '#5ABCD8',
      gradientColors: ['#e0f7ff', '#b3ecff'],
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
    {
      id: 'a4-crystal', type: 'sales-card',
      name: 'Kristal A4',
      desc: 'Çok Renkli · Zarif · Print',
      size: 'A4 · 595×842',
      color: '#3B82F6',
      gradientColors: ['#1e1b4b', '#312e81'],
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
    {
      id: 'a4-amber', type: 'sales-card',
      name: 'Kehribar A4',
      desc: 'Reçine · Bal · Print',
      size: 'A4 · 595×842',
      color: '#F59E0B',
      gradientColors: ['#1c1000', '#2e1a00'],
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
    {
      id: 'a4-oltu', type: 'sales-card',
      name: 'Oltu A4',
      desc: 'Gökkuşağı · Opal · Print',
      size: 'A4 · 595×842',
      color: '#C4B5FD',
      gradientColors: ['#0f0a1e', '#1a1130'],
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
    {
      id: 'a4-volkan', type: 'sales-card',
      name: 'Volkan A4',
      desc: 'Lav · Ateş · Print',
      size: 'A4 · 595×842',
      color: '#FF8C00',
      gradientColors: ['#1C0500', '#360A00'],
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
    {
      id: 'a4-tarihi', type: 'sales-card',
      name: 'Tarihi A4',
      desc: 'Papirüs · Bronz · Print',
      size: 'A4 · 595×842',
      color: '#D4AF37',
      gradientColors: ['#2E2008', '#1A1202'],
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
  ],
};

// Mini gradient preview for sales-card themes
function SalesThumbPreview({ fmt, isStory }) {
  const isLight = fmt.gradientColors[0].startsWith('#F') || fmt.gradientColors[0].startsWith('#f') || fmt.gradientColors[0].startsWith('#e') || fmt.gradientColors[0].startsWith('#E');
  return (
    <LinearGradient
      colors={fmt.gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={isStory ? styles.thumbStory : styles.thumbPost}
    >
      {/* Accent bar at bottom */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, backgroundColor: fmt.color, borderRadius: 2 }} />
      {/* Simulated content lines */}
      <View style={{ flex: 1, padding: 6, justifyContent: 'flex-end', paddingBottom: 8 }}>
        <View style={{ width: '80%', height: 2, borderRadius: 1, backgroundColor: fmt.color, marginBottom: 3, opacity: 0.9 }} />
        <View style={{ width: '55%', height: 1.5, borderRadius: 1, backgroundColor: isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.25)', marginBottom: 2 }} />
        <View style={{ width: '70%', height: 1.5, borderRadius: 1, backgroundColor: isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.18)' }} />
      </View>
    </LinearGradient>
  );
}

// Mini square/story social preview
function SocialThumbPreview({ fmt }) {
  const isStory = fmt.size.includes('1920');
  const isLight = fmt.gradientColors[0].startsWith('#F') || fmt.gradientColors[0].startsWith('#f') || fmt.gradientColors[0].startsWith('#e') || fmt.gradientColors[0].startsWith('#E');
  return (
    <LinearGradient
      colors={fmt.gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={isStory ? styles.thumbSocStory : styles.thumbSocPost}
    >
      <Icon name={fmt.iconName || 'instagram'} size={isStory ? 16 : 20} color={isLight ? fmt.color : (fmt.color + 'DD')} />
    </LinearGradient>
  );
}

function A4ThemeCard({ fmt, isSelected, theme, onPress }) {
  return (
    <TouchableOpacity
      style={[
        styles.a4Card,
        { backgroundColor: theme.surface, borderColor: isSelected ? fmt.color : theme.border, borderWidth: isSelected ? 2 : 1 },
        !isSelected && { opacity: 0.75 },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Mini A4 doküman önizleme */}
      <LinearGradient
        colors={fmt.gradientColors || [theme.bg, theme.surface2]}
        style={[styles.miniDoc, { borderColor: fmt.color + '40' }]}
      >
        <View style={[styles.miniDocHeader, { backgroundColor: fmt.color }]} />
        <View style={styles.miniDocBody}>
          <View style={[styles.miniDocLines, { paddingTop: 4 }]}>
            <View style={[styles.miniLine, { width: '90%', backgroundColor: fmt.color + '80' }]} />
            <View style={[styles.miniLine, { width: '65%', backgroundColor: 'rgba(255,255,255,0.15)' }]} />
            <View style={[styles.miniLine, { width: '80%', backgroundColor: 'rgba(255,255,255,0.1)' }]} />
            <View style={[styles.miniLine, { width: '55%', backgroundColor: 'rgba(255,255,255,0.1)' }]} />
          </View>
        </View>
        <View style={[styles.miniDocFooter, { backgroundColor: fmt.color + '40' }]} />
      </LinearGradient>

      {/* Tema bilgisi */}
      <View style={styles.a4Info}>
        <Text style={[styles.a4Name, { color: theme.text }]}>{fmt.name}</Text>
        <Text style={[styles.a4Desc, { color: theme.textSecondary }]} numberOfLines={2}>{fmt.desc}</Text>
        <View style={styles.a4Tags}>
          <View style={[styles.a4Tag, { backgroundColor: fmt.color + '18', borderColor: fmt.color + '40' }]}>
            <Text style={[styles.a4TagTxt, { color: fmt.color }]}>A4</Text>
          </View>
          <View style={[styles.a4Tag, { backgroundColor: theme.surface2, borderColor: theme.border }]}>
            <Text style={[styles.a4TagTxt, { color: theme.textSecondary }]}>Print · PDF</Text>
          </View>
        </View>
      </View>

      {/* Radio */}
      {isSelected
        ? <View style={[styles.radioOnA4, { backgroundColor: fmt.color }]}><Text style={styles.radioCheckA4}>✓</Text></View>
        : <View style={[styles.radioOffA4, { borderColor: theme.border }]} />
      }

      {isSelected && <View style={[styles.accentLine, { backgroundColor: fmt.color }]} />}
    </TouchableOpacity>
  );
}

export default function FormatScreen({ route, navigation }) {
  const { category, mode, formData, images: formImages, logo, companyName } = route.params;
  const fromForm = !!formData;
  const [selected, setSelected] = useState(null);
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  const insets = useSafeAreaInsets();

  const allFormats = FORMATS_BY_CATEGORY[category.id] || FORMATS_BY_CATEGORY['real-estate'];
  const formats = fromForm
    ? allFormats.filter(f => f.type === 'sales-card' && f.size.includes('A4'))
    : mode === 'social'
    ? allFormats.filter(f => f.type === 'social')
    : mode === 'pdf'
    ? allFormats.filter(f => f.type === 'pdf')
    : mode === 'sales-card-story'
    ? allFormats.filter(f => f.type === 'sales-card' && !f.size.includes('1080×1080') && !f.size.includes('A4'))
    : mode === 'sales-card-post'
    ? allFormats.filter(f => f.type === 'sales-card' && f.size.includes('1080×1080'))
    : mode === 'sales-card'
    ? allFormats.filter(f => f.type === 'sales-card')
    : allFormats;

  const handleContinue = () => {
    if (!selected) return;
    if (fromForm) {
      navigation.navigate('RealEstatePreview', {
        category, images: formImages || [], formData, logo, companyName, format: selected,
      });
    } else {
      navigation.navigate('Form', { category, images: [], format: selected });
    }
  };

  const isSalesCard = (fmt) => fmt.type === 'sales-card';
  const isSocial = (fmt) => fmt.type === 'social';
  const isStorySize = (fmt) => fmt.size.includes('1920') || (fmt.size.includes('1080') && !fmt.size.includes('1080×1080'));

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.bg} />

      {/* Nav */}
      <View style={[styles.nav, { borderBottomColor: theme.border, paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, { backgroundColor: theme.surface2, borderColor: theme.border }]}
        >
          <Icon name="arrow-left" size={18} color={theme.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.navTitle, { color: theme.text }]}>
            {fromForm ? 'Tema Seç'
              : mode === 'social' ? 'Sosyal Medya Formatı'
              : mode === 'sales-card-story' ? 'Dikey Tema Seç'
              : mode === 'sales-card-post' ? 'Kare Tema Seç'
              : 'Çıktı Formatı'}
          </Text>
          <Text style={[styles.navSub, { color: theme.textSecondary }]}>
            {fromForm ? `${category.name} · A4 Satış Kartı` : category.name}
          </Text>
        </View>
        <View style={[styles.countChip, { backgroundColor: GOLD + '18', borderColor: GOLD + '35' }]}>
          <Text style={[styles.countChipTxt, { color: GOLD }]}>{formats.length}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {formats.map((fmt) => {
          const isSelected = selected?.id === fmt.id;

          if (fromForm) {
            return (
              <A4ThemeCard
                key={fmt.id}
                fmt={fmt}
                isSelected={isSelected}
                theme={theme}
                onPress={() => setSelected(fmt)}
              />
            );
          }

          const isSales = isSalesCard(fmt);
          const isSoc = isSocial(fmt);
          const isStory = isStorySize(fmt);

          return (
            <TouchableOpacity
              key={fmt.id}
              style={[
                styles.card,
                { backgroundColor: theme.surface, borderColor: isSelected ? fmt.color : theme.border },
                isSelected && { borderWidth: 2 },
                !isSelected && { opacity: 0.85 },
              ]}
              onPress={() => setSelected(fmt)}
              activeOpacity={0.78}
            >
              {/* Left accent bar */}
              <View style={[styles.colorBar, { backgroundColor: fmt.color }]} />

              {/* Thumb preview or icon */}
              {isSales ? (
                <SalesThumbPreview fmt={fmt} isStory={isStory} />
              ) : isSoc ? (
                <SocialThumbPreview fmt={fmt} />
              ) : (
                <View style={[styles.iconWrap, { backgroundColor: fmt.color + '18' }]}>
                  <Icon name={fmt.iconName || 'file-document-outline'} size={26} color={fmt.color} />
                </View>
              )}

              {/* Info */}
              <View style={styles.info}>
                <Text style={[styles.cardName, { color: theme.text }]}>{fmt.name}</Text>
                <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>{fmt.desc}</Text>
                <View style={styles.badges}>
                  <View style={[styles.badge, { backgroundColor: fmt.color + '18', borderColor: fmt.color + '40' }]}>
                    <Text style={[styles.badgeText, { color: fmt.color }]}>{fmt.size}</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: theme.surface2, borderColor: theme.border }]}>
                    <Text style={[styles.badgeText, { color: theme.textSecondary }]}>{fmt.useCase}</Text>
                  </View>
                </View>
              </View>

              {/* Radio */}
              {isSelected
                ? <View style={[styles.radioOn, { backgroundColor: fmt.color }]}><Text style={styles.radioCheck}>✓</Text></View>
                : <View style={[styles.radioOff, { borderColor: theme.border }]} />
              }

              {isSelected && <View style={[styles.selectedGlow, { backgroundColor: fmt.color }]} />}
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom CTA */}
      {selected && (
        <View style={[styles.bottom, { backgroundColor: theme.bg, borderTopColor: theme.border }]}>
          <TouchableOpacity onPress={handleContinue} activeOpacity={0.88}>
            <LinearGradient
              colors={[selected.color, selected.color + 'CC']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.bottomBtn}
            >
              <Text style={styles.bottomBtnText}>{selected.name} ile Devam Et</Text>
              <Icon name="arrow-right" size={18} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  nav: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 14,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 12,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  navTitle: { fontSize: 17, fontWeight: '700', letterSpacing: -0.3 },
  navSub: { fontSize: 11, marginTop: 1 },
  countChip: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 8, borderWidth: 1,
  },
  countChipTxt: { fontSize: 12, fontWeight: '700' },

  scroll: { flex: 1 },
  list: { padding: 16, gap: 10 },

  card: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 16, borderWidth: 1,
    overflow: 'hidden', gap: 14,
    paddingVertical: 14, paddingHorizontal: 16, paddingLeft: 20,
  },
  selectedGlow: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
  },
  colorBar: {
    position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
  },

  // Sales card mini preview
  thumbStory: {
    width: 38, height: 68, borderRadius: 8,
    overflow: 'hidden', flexShrink: 0,
  },
  thumbPost: {
    width: 52, height: 52, borderRadius: 8,
    overflow: 'hidden', flexShrink: 0,
  },

  // Social mini preview
  thumbSocStory: {
    width: 38, height: 68, borderRadius: 8,
    overflow: 'hidden', flexShrink: 0,
    alignItems: 'center', justifyContent: 'center',
  },
  thumbSocPost: {
    width: 52, height: 52, borderRadius: 8,
    overflow: 'hidden', flexShrink: 0,
    alignItems: 'center', justifyContent: 'center',
  },

  iconWrap: {
    width: 52, height: 52, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },

  info: { flex: 1, gap: 4 },
  cardName: { fontSize: 15, fontWeight: '700', letterSpacing: -0.2 },
  cardDesc: { fontSize: 12, lineHeight: 16 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 2 },
  badge: {
    paddingHorizontal: 7, paddingVertical: 3,
    borderRadius: 5, borderWidth: 1,
  },
  badgeText: { fontSize: 9, fontWeight: '700' },

  radioOn: {
    width: 26, height: 26, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  radioCheck: { color: '#fff', fontWeight: '700', fontSize: 13 },
  radioOff: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, flexShrink: 0 },

  // A4 tema kartı
  a4Card: {
    borderRadius: 16, borderWidth: 1, overflow: 'hidden',
    flexDirection: 'row', alignItems: 'center',
    padding: 14, gap: 14,
  },
  miniDoc: {
    width: 56, height: 80, borderRadius: 6,
    borderWidth: 1, overflow: 'hidden', flexShrink: 0,
  },
  miniDocHeader: { height: 14 },
  miniDocBody: { flex: 1, padding: 6 },
  miniDocLines: { flex: 1, gap: 3 },
  miniLine: { height: 3, borderRadius: 2 },
  miniDocFooter: { height: 10 },
  a4Info: { flex: 1, gap: 4 },
  a4Name: { fontSize: 14, fontWeight: '700', letterSpacing: -0.2 },
  a4Desc: { fontSize: 11, lineHeight: 15 },
  a4Tags: { flexDirection: 'row', gap: 5, marginTop: 2 },
  a4Tag: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 5, borderWidth: 1 },
  a4TagTxt: { fontSize: 9, fontWeight: '700' },
  radioOnA4: {
    width: 24, height: 24, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0, alignSelf: 'flex-start',
  },
  radioCheckA4: { color: '#fff', fontWeight: '700', fontSize: 12 },
  radioOffA4: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, flexShrink: 0, alignSelf: 'flex-start' },
  accentLine: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2 },

  bottom: {
    paddingHorizontal: 16, paddingVertical: 14,
    paddingBottom: 28, borderTopWidth: 1,
  },
  bottomBtn: {
    borderRadius: 14, padding: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  bottomBtnText: { fontSize: 15, fontWeight: '700', color: '#fff', letterSpacing: -0.2 },
});
