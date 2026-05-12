import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../themes/colors';

// type: 'pdf' | 'social'
const FORMATS_BY_CATEGORY = {
  'real-estate': [
    {
      id: 'standard',
      type: 'pdf',
      name: 'Standart PDF',
      desc: 'Çok sayfalı, tüm detaylar ve fotoğraflar',
      size: 'A4',
      color: '#4F46E5',
      icon: '📄',
      useCase: 'Müşteri dosyası · E-posta',
      maxPhotos: 25,
    },
    {
      id: 'cam-sticker', type: 'pdf',
      name: 'Cam Sticker',
      desc: 'Dükkan camına yapıştırma afişi',
      size: 'A5  148×210 mm',
      color: '#E05555',
      icon: '📌',
      useCase: 'Ofis camı · Vitrinde ilan',
      maxPhotos: 1,
    },
    {
      id: 'ilan-karti', type: 'pdf',
      name: 'İlan Kartı',
      desc: 'Tek sayfalık, müşteriye verilecek ilan',
      size: 'A4  210×297 mm',
      color: '#3DBA7C',
      icon: '🏠',
      useCase: 'Müşteriye ver · Broşür',
      maxPhotos: 1,
    },
    {
      id: 'vitrin', type: 'pdf',
      name: 'Vitrin Afişi',
      desc: 'Büyük cam ve ilan panolarına, sayfa başı 2 fotoğraf',
      size: 'A3  420×297 mm',
      color: '#C9A84C',
      icon: '🖼️',
      useCase: 'Büyük cam · İlan panosu',
      maxPhotos: 20,
    },
    {
      id: 'social-dark', type: 'social',
      name: 'Sosyal Medya · Koyu',
      desc: 'Siyah & altın kare kart, Instagram/Facebook',
      size: '1080×1080',
      color: '#C9A84C',
      icon: '◾',
      useCase: 'Instagram · Facebook',
      maxPhotos: 1,
    },
    {
      id: 'social-green', type: 'social',
      name: 'Sosyal Medya · Yeşil',
      desc: 'Beyaz & yeşil kare kart, Instagram/Facebook',
      size: '1080×1080',
      color: '#2E7D32',
      icon: '🟩',
      useCase: 'Instagram · Facebook',
      maxPhotos: 1,
    },
    {
      id: 'social-story', type: 'social',
      name: 'Instagram Story',
      desc: '9:16 dikey format, hikaye ve WhatsApp durumu',
      size: '1080×1920',
      color: '#5C35CC',
      icon: '📱',
      useCase: 'Story · WhatsApp Durum',
      maxPhotos: 1,
    },
    // Satış Kartları
    {
      id: 'sales-arch-story', type: 'sales-card',
      name: '🏗 Mimari · Dikey',
      desc: 'Endüstriyel beton doku, pas çelik',
      size: '1080×1920',
      color: '#D4782A',
      icon: '🏗',
      useCase: 'WhatsApp · Story · Vitrin',
      maxPhotos: 1,
    },
    {
      id: 'sales-arch-post', type: 'sales-card',
      name: '🏗 Mimari · Kare',
      desc: 'Endüstriyel beton doku, pas çelik',
      size: '1080×1080',
      color: '#D4782A',
      icon: '🏗',
      useCase: 'Instagram · Facebook',
      maxPhotos: 1,
    },
    {
      id: 'sales-sakura-story', type: 'sales-card',
      name: '🌸 Sakura · Dikey',
      desc: 'Japon kiraz çiçeği, altın varak',
      size: '1080×1920',
      color: '#F9A8C4',
      icon: '🌸',
      useCase: 'WhatsApp · Story · Vitrin',
      maxPhotos: 1,
    },
    {
      id: 'sales-sakura-post', type: 'sales-card',
      name: '🌸 Sakura · Kare',
      desc: 'Japon kiraz çiçeği, altın varak',
      size: '1080×1080',
      color: '#F9A8C4',
      icon: '🌸',
      useCase: 'Instagram · Facebook',
      maxPhotos: 1,
    },
    {
      id: 'sales-deep-story', type: 'sales-card',
      name: '🌊 Derin · Dikey',
      desc: 'Okyanus mavisi, gümüş dalga',
      size: '1080×1920',
      color: '#4DA8DA',
      icon: '🌊',
      useCase: 'WhatsApp · Story · Vitrin',
      maxPhotos: 1,
    },
    {
      id: 'sales-deep-post', type: 'sales-card',
      name: '🌊 Derin · Kare',
      desc: 'Okyanus mavisi, gümüş dalga',
      size: '1080×1080',
      color: '#4DA8DA',
      icon: '🌊',
      useCase: 'Instagram · Facebook',
      maxPhotos: 1,
    },
    {
      id: 'sales-volcano-story', type: 'sales-card',
      name: '🌋 Volkan · Dikey',
      desc: 'Lav kırmızısı, ateş turuncu',
      size: '1080×1920',
      color: '#FF4500',
      icon: '🌋',
      useCase: 'WhatsApp · Story · Vitrin',
      maxPhotos: 1,
    },
    {
      id: 'sales-volcano-post', type: 'sales-card',
      name: '🌋 Volkan · Kare',
      desc: 'Lav kırmızısı, ateş turuncu',
      size: '1080×1080',
      color: '#FF4500',
      icon: '🌋',
      useCase: 'Instagram · Facebook',
      maxPhotos: 1,
    },
    {
      id: 'sales-hist-story', type: 'sales-card',
      name: '🏛 Tarihi · Dikey',
      desc: 'Antik papirüs, bronz mühür',
      size: '1080×1920',
      color: '#8B6914',
      icon: '🏛',
      useCase: 'WhatsApp · Story · Vitrin',
      maxPhotos: 1,
    },
    {
      id: 'sales-hist-post', type: 'sales-card',
      name: '🏛 Tarihi · Kare',
      desc: 'Antik papirüs, bronz mühür',
      size: '1080×1080',
      color: '#8B6914',
      icon: '🏛',
      useCase: 'Instagram · Facebook',
      maxPhotos: 1,
    },
    // A4 Premium Themes
    {
      id: 'a4-orange', type: 'sales-card',
      name: '🟠 Turuncu A4',
      desc: 'Endüstriyel · Beton · Print',
      size: 'A4 · 595×842',
      color: '#FF6B00',
      icon: '🟠',
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
    {
      id: 'a4-navy', type: 'sales-card',
      name: '🔵 Lacivert A4',
      desc: 'Profesyonel · Kurumsal · Print',
      size: 'A4 · 595×842',
      color: '#4A90D9',
      icon: '🔵',
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
    {
      id: 'a4-green', type: 'sales-card',
      name: '🟢 Yeşil A4',
      desc: 'Doğal · Zarif · Print',
      size: 'A4 · 595×842',
      color: '#4A6744',
      icon: '🟢',
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
    {
      id: 'a4-galactic', type: 'sales-card',
      name: '🌌 Galaktik A4',
      desc: 'Uzay · Yıldızlar · Print',
      size: 'A4 · 595×842',
      color: '#67E8F9',
      icon: '🌌',
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
    {
      id: 'a4-salda', type: 'sales-card',
      name: '🏴‍☠️ Salda A4',
      desc: 'Kumsal · Deniz · Print',
      size: 'A4 · 595×842',
      color: '#5ABCD8',
      icon: '🏴‍☠️',
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
    {
      id: 'a4-crystal', type: 'sales-card',
      name: '💎 Kristal A4',
      desc: 'Çok Renkli · Zarif · Print',
      size: 'A4 · 595×842',
      color: '#3B82F6',
      icon: '💎',
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
    {
      id: 'a4-amber', type: 'sales-card',
      name: '🟡 Kehribar A4',
      desc: 'Reçine · Bal · Print',
      size: 'A4 · 595×842',
      color: '#F59E0B',
      icon: '🟡',
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
    {
      id: 'a4-oltu', type: 'sales-card',
      name: '⚫ Oltu A4',
      desc: 'Gökkuşağı · Opal · Print',
      size: 'A4 · 595×842',
      color: '#C4B5FD',
      icon: '⚫',
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
    {
      id: 'a4-volkan', type: 'sales-card',
      name: '🌋 Volkan A4',
      desc: 'Lav · Ateş · Print',
      size: 'A4 · 595×842',
      color: '#FF8C00',
      icon: '🌋',
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
    {
      id: 'a4-tarihi', type: 'sales-card',
      name: '🏛 Tarihi A4',
      desc: 'Papirüs · Bronz · Print',
      size: 'A4 · 595×842',
      color: '#8B6914',
      icon: '🏛',
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
      color: '#4F46E5',
      icon: '📄',
      useCase: 'Müşteri dosyası · E-posta',
      maxPhotos: 25,
    },
    // Sosyal Medya
    {
      id: 'social-dark', type: 'social',
      name: 'Sosyal Medya · Koyu',
      desc: 'Siyah & altın kare kart, Instagram/Facebook',
      size: '1080×1080',
      color: '#C9A84C',
      icon: '◾',
      useCase: 'Instagram · Facebook',
      maxPhotos: 1,
    },
    {
      id: 'social-green', type: 'social',
      name: 'Sosyal Medya · Yeşil',
      desc: 'Beyaz & yeşil kare kart, Instagram/Facebook',
      size: '1080×1080',
      color: '#2E7D32',
      icon: '🟩',
      useCase: 'Instagram · Facebook',
      maxPhotos: 1,
    },
    {
      id: 'social-story', type: 'social',
      name: 'Instagram Story',
      desc: '9:16 dikey format, hikaye ve WhatsApp durumu',
      size: '1080×1920',
      color: '#5C35CC',
      icon: '📱',
      useCase: 'Story · WhatsApp Durum',
      maxPhotos: 1,
    },
    // Satış Kartları
    {
      id: 'sales-arch-story', type: 'sales-card',
      name: '🏗 Mimari · Dikey',
      desc: 'Endüstriyel beton doku, pas çelik',
      size: '1080×1920',
      color: '#D4782A',
      icon: '🏗',
      useCase: 'WhatsApp · Story · Vitrin',
      maxPhotos: 1,
    },
    {
      id: 'sales-arch-post', type: 'sales-card',
      name: '🏗 Mimari · Kare',
      desc: 'Endüstriyel beton doku, pas çelik',
      size: '1080×1080',
      color: '#D4782A',
      icon: '🏗',
      useCase: 'Instagram · Facebook',
      maxPhotos: 1,
    },
    {
      id: 'sales-sakura-story', type: 'sales-card',
      name: '🌸 Sakura · Dikey',
      desc: 'Japon kiraz çiçeği, altın varak',
      size: '1080×1920',
      color: '#F9A8C4',
      icon: '🌸',
      useCase: 'WhatsApp · Story · Vitrin',
      maxPhotos: 1,
    },
    {
      id: 'sales-sakura-post', type: 'sales-card',
      name: '🌸 Sakura · Kare',
      desc: 'Japon kiraz çiçeği, altın varak',
      size: '1080×1080',
      color: '#F9A8C4',
      icon: '🌸',
      useCase: 'Instagram · Facebook',
      maxPhotos: 1,
    },
    {
      id: 'sales-deep-story', type: 'sales-card',
      name: '🌊 Derin · Dikey',
      desc: 'Okyanus mavisi, gümüş dalga',
      size: '1080×1920',
      color: '#4DA8DA',
      icon: '🌊',
      useCase: 'WhatsApp · Story · Vitrin',
      maxPhotos: 1,
    },
    {
      id: 'sales-deep-post', type: 'sales-card',
      name: '🌊 Derin · Kare',
      desc: 'Okyanus mavisi, gümüş dalga',
      size: '1080×1080',
      color: '#4DA8DA',
      icon: '🌊',
      useCase: 'Instagram · Facebook',
      maxPhotos: 1,
    },
    {
      id: 'sales-volcano-story', type: 'sales-card',
      name: '🌋 Volkan · Dikey',
      desc: 'Lav kırmızısı, ateş turuncu',
      size: '1080×1920',
      color: '#FF4500',
      icon: '🌋',
      useCase: 'WhatsApp · Story · Vitrin',
      maxPhotos: 1,
    },
    {
      id: 'sales-volcano-post', type: 'sales-card',
      name: '🌋 Volkan · Kare',
      desc: 'Lav kırmızısı, ateş turuncu',
      size: '1080×1080',
      color: '#FF4500',
      icon: '🌋',
      useCase: 'Instagram · Facebook',
      maxPhotos: 1,
    },
    {
      id: 'sales-hist-story', type: 'sales-card',
      name: '🏛 Tarihi · Dikey',
      desc: 'Antik papirüs, bronz mühür',
      size: '1080×1920',
      color: '#8B6914',
      icon: '🏛',
      useCase: 'WhatsApp · Story · Vitrin',
      maxPhotos: 1,
    },
    {
      id: 'sales-hist-post', type: 'sales-card',
      name: '🏛 Tarihi · Kare',
      desc: 'Antik papirüs, bronz mühür',
      size: '1080×1080',
      color: '#8B6914',
      icon: '🏛',
      useCase: 'Instagram · Facebook',
      maxPhotos: 1,
    },
    // A4 Premium Themes
    {
      id: 'a4-orange', type: 'sales-card',
      name: '🟠 Turuncu A4',
      desc: 'Endüstriyel · Beton · Print',
      size: 'A4 · 595×842',
      color: '#FF6B00',
      icon: '🟠',
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
    {
      id: 'a4-navy', type: 'sales-card',
      name: '🔵 Lacivert A4',
      desc: 'Profesyonel · Kurumsal · Print',
      size: 'A4 · 595×842',
      color: '#4A90D9',
      icon: '🔵',
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
    {
      id: 'a4-green', type: 'sales-card',
      name: '🟢 Yeşil A4',
      desc: 'Doğal · Zarif · Print',
      size: 'A4 · 595×842',
      color: '#4A6744',
      icon: '🟢',
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
    {
      id: 'a4-galactic', type: 'sales-card',
      name: '🌌 Galaktik A4',
      desc: 'Uzay · Yıldızlar · Print',
      size: 'A4 · 595×842',
      color: '#67E8F9',
      icon: '🌌',
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
    {
      id: 'a4-salda', type: 'sales-card',
      name: '🏴‍☠️ Salda A4',
      desc: 'Kumsal · Deniz · Print',
      size: 'A4 · 595×842',
      color: '#5ABCD8',
      icon: '🏴‍☠️',
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
    {
      id: 'a4-crystal', type: 'sales-card',
      name: '💎 Kristal A4',
      desc: 'Çok Renkli · Zarif · Print',
      size: 'A4 · 595×842',
      color: '#3B82F6',
      icon: '💎',
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
    {
      id: 'a4-amber', type: 'sales-card',
      name: '🟡 Kehribar A4',
      desc: 'Reçine · Bal · Print',
      size: 'A4 · 595×842',
      color: '#F59E0B',
      icon: '🟡',
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
    {
      id: 'a4-oltu', type: 'sales-card',
      name: '⚫ Oltu A4',
      desc: 'Gökkuşağı · Opal · Print',
      size: 'A4 · 595×842',
      color: '#C4B5FD',
      icon: '⚫',
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
    {
      id: 'a4-volkan', type: 'sales-card',
      name: '🌋 Volkan A4',
      desc: 'Lav · Ateş · Print',
      size: 'A4 · 595×842',
      color: '#FF8C00',
      icon: '🌋',
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
    {
      id: 'a4-tarihi', type: 'sales-card',
      name: '🏛 Tarihi A4',
      desc: 'Papirüs · Bronz · Print',
      size: 'A4 · 595×842',
      color: '#8B6914',
      icon: '🏛',
      useCase: 'Print · Profesyonel',
      maxPhotos: 1,
    },
  ],
};

export default function FormatScreen({ route, navigation }) {
  const { category, mode } = route.params; // mode: 'pdf' | 'social' | 'sales-card' | undefined
  const [selected, setSelected] = useState(null);
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  const allFormats = FORMATS_BY_CATEGORY[category.id] || FORMATS_BY_CATEGORY['real-estate'];
  const formats = mode === 'social'
    ? allFormats.filter(f => f.type === 'social')
    : mode === 'pdf'
    ? allFormats.filter(f => f.type === 'pdf')
    : mode === 'sales-card-story'
    ? allFormats.filter(f => f.type === 'sales-card' && !f.size.includes('1080×1080'))
    : mode === 'sales-card-post'
    ? allFormats.filter(f => f.type === 'sales-card' && f.size.includes('1080×1080'))
    : mode === 'sales-card'
    ? allFormats.filter(f => f.type === 'sales-card')
    : allFormats;

  const handleContinue = () => {
    if (!selected) return;
    navigation.navigate('Form', { category, images: [], format: selected });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.bg} />

      {/* Nav */}
      <View style={[styles.nav, { borderBottomColor: theme.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, { backgroundColor: theme.surface2, borderColor: theme.border }]}
        >
          <Text style={[styles.backText, { color: theme.text }]}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={[styles.navTitle, { color: theme.text }]}>
            {mode === 'social' ? 'Sosyal Medya Formatı'
              : mode === 'sales-card-story' ? 'Dikey Format'
              : mode === 'sales-card-post' ? 'Kare Format'
              : 'Çıktı Formatı'}
          </Text>
          <Text style={[styles.navSub, { color: theme.textSecondary }]}>
            {category.emoji} {category.name}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {formats.map((fmt) => {
          const isSelected = selected?.id === fmt.id;
          return (
            <TouchableOpacity
              key={fmt.id}
              style={[
                styles.card,
                { backgroundColor: theme.surface, borderColor: isSelected ? fmt.color : theme.border },
                isSelected && { borderWidth: 2 },
              ]}
              onPress={() => setSelected(fmt)}
              activeOpacity={0.75}
            >
              {/* Left color bar */}
              <View style={[styles.colorBar, { backgroundColor: fmt.color }]} />

              {/* Icon */}
              <View style={[styles.iconWrap, { backgroundColor: fmt.color + '18' }]}>
                <Text style={styles.iconText}>{fmt.icon}</Text>
              </View>

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
                  {fmt.maxPhotos < 25 && (
                    <View style={[styles.badge, { backgroundColor: theme.surface2, borderColor: theme.border }]}>
                      <Text style={[styles.badgeText, { color: theme.textSecondary }]}>
                        max {fmt.maxPhotos} foto
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Radio */}
              {isSelected
                ? <View style={[styles.radioOn, { backgroundColor: fmt.color }]}><Text style={styles.radioCheck}>✓</Text></View>
                : <View style={[styles.radioOff, { borderColor: theme.border }]} />
              }
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
              <Text style={styles.bottomBtnText}>{selected.name} ile Devam Et →</Text>
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
  backText: { fontSize: 16 },
  navTitle: { fontSize: 17, fontWeight: '700', letterSpacing: -0.3 },
  navSub: { fontSize: 11, marginTop: 1 },

  scroll: { flex: 1 },
  list: { padding: 16, gap: 10 },

  card: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 16, borderWidth: 1,
    overflow: 'hidden', gap: 14,
    paddingVertical: 16, paddingHorizontal: 16, paddingLeft: 20,
  },

  colorBar: {
    position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
  },

  iconWrap: {
    width: 52, height: 52, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  iconText: { fontSize: 24 },

  info: { flex: 1, gap: 5 },
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

  bottom: {
    paddingHorizontal: 16, paddingVertical: 14,
    paddingBottom: 28, borderTopWidth: 1,
  },
  bottomBtn: {
    borderRadius: 14, padding: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  bottomBtnText: { fontSize: 15, fontWeight: '700', color: '#fff', letterSpacing: -0.2 },
});
