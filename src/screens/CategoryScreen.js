import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../themes/colors';

const CATEGORIES = [
  {
    id: 'auto',
    name: 'Araç Galerisi',
    emoji: '🚗',
    color: '#E05555',
    colorDim: 'rgba(224,85,85,0.12)',
    description: 'Araç satış ilanları',
    fields: ['Marka', 'Model', 'Yıl', 'KM', 'Motor', 'Şanzıman', 'Yakıt', 'Renk', 'Hasar Kayıt', 'Fiyat', 'Telefon', 'Açıklama'],
    gradient: ['transparent', '#E05555', 'transparent'],
  },
  {
    id: 'real-estate',
    name: 'Emlak',
    emoji: '🏠',
    color: '#3DBA7C',
    colorDim: 'rgba(61,186,124,0.12)',
    description: 'Satılık / Kiralık ilan',
    fields: ['İlan Türü', 'Emlak Türü', 'Oda Sayısı', 'M² (Net)', 'M² (Brüt)', 'Bina Yaşı', 'Kat', 'Isıtma', 'Banyo Sayısı', 'Balkon', 'Site İçi', 'Fiyat', 'Adres', 'Telefon'],
    gradient: ['transparent', '#3DBA7C', 'transparent'],
  },
  {
    id: 'office',
    name: 'Ofis / Kurumsal',
    emoji: '💼',
    color: '#4F6EF7',
    colorDim: 'rgba(79,110,247,0.15)',
    description: 'Belgeler & raporlar',
    fields: ['Başlık', 'Firma', 'Departman', 'Tarih', 'Hazırlayan', 'Açıklama'],
    gradient: ['transparent', '#4F6EF7', 'transparent'],
  },
  {
    id: 'personal',
    name: 'Kişisel / CV',
    emoji: '👤',
    color: '#9B6EF7',
    colorDim: 'rgba(155,110,247,0.12)',
    description: 'Özgeçmiş & belgeler',
    fields: ['Ad Soyad', 'Meslek', 'Doğum Tarihi', 'Telefon', 'Email', 'Adres', 'LinkedIn', 'Açıklama', 'İş Geçmişi', 'Beceriler', 'Yabancı Diller', 'CV Teması'],
    gradient: ['transparent', '#9B6EF7', 'transparent'],
  },
  {
    id: 'other',
    name: 'Diğer',
    emoji: '📄',
    color: '#E0904A',
    colorDim: 'rgba(224,144,74,0.12)',
    description: 'Genel amaçlı PDF',
    fields: ['Başlık', 'Alt Başlık', 'Kategori', 'Açıklama'],
    gradient: ['transparent', '#E0904A', 'transparent'],
  },
];

export default function CategoryScreen({ route, navigation }) {
  const mode = route.params?.mode || 'pdf'; // 'pdf' | 'social' | 'sales-card'
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  const salesCardMode = mode === 'sales-card' || mode === 'sales-card-story' || mode === 'sales-card-post';
  const visibleCategories = (mode === 'social' || salesCardMode)
    ? CATEGORIES.filter(c => c.id === 'real-estate' || c.id === 'auto')
    : CATEGORIES;

  const handleSelect = (category) => {
    if (category.id === 'real-estate' || category.id === 'auto') {
      navigation.navigate('Format', { category, mode });
    } else if (category.id === 'personal') {
      navigation.navigate('Form', { category, images: [] });
    } else {
      navigation.navigate('Form', { category, images: [] });
    }
  };

  const getTitle = () => {
    if (mode === 'social') return 'Sosyal Medya';
    if (mode === 'sales-card-story') return 'Dikey Satış Kartı';
    if (mode === 'sales-card-post') return 'Kare Satış Kartı';
    if (mode === 'sales-card') return 'Satış Kartı';
    return 'Kategori Seçin';
  };

  const getSubtitle = () => {
    if (mode === 'social') return 'Hangi kategori için görsel?';
    if (mode === 'sales-card-story') return 'Story · Vitrin · A4 formatları';
    if (mode === 'sales-card-post') return 'Kare · Instagram · Facebook';
    if (mode === 'sales-card') return 'Satış kartı · Vitrin ilanı';
    return 'Ne oluşturmak istiyorsunuz?';
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
            {getTitle()}
          </Text>
          <Text style={[styles.navSub, { color: theme.textSecondary }]}>
            {getSubtitle()}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {/* 2 sütunlu grid — son tek kart tam genişlikte */}
        {visibleCategories.reduce((rows, cat, i) => {
          if (i % 2 === 0) rows.push([cat]);
          else rows[rows.length - 1].push(cat);
          return rows;
        }, []).map((row, rowIdx) => (
          <View key={rowIdx} style={styles.row}>
            {row.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.card,
                  row.length === 1 && styles.cardFull,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
                onPress={() => handleSelect(cat)}
                activeOpacity={0.75}
              >
                {/* Renkli üst bant */}
                <View style={[styles.cardBar, { backgroundColor: cat.color }]} />

                {/* İkon */}
                <View style={[styles.iconCircle, { backgroundColor: cat.color + '22' }]}>
                  <Text style={styles.iconEmoji}>{cat.emoji}</Text>
                </View>

                <Text style={[styles.cardName, { color: theme.text }]}>{cat.name}</Text>
                <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>{cat.description}</Text>

                {/* Alan sayısı badge */}
                <View style={[styles.fieldBadge, { backgroundColor: cat.color + '18', borderColor: cat.color + '40' }]}>
                  <Text style={[styles.fieldBadgeText, { color: cat.color }]}>{cat.fields.length} alan</Text>
                </View>

                {/* Sağ alt ok */}
                <Text style={[styles.cardArrow, { color: cat.color }]}>→</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
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
  grid: { padding: 16, gap: 12 },

  row: { flexDirection: 'row', gap: 12 },

  card: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 170,
    gap: 6,
  },
  cardFull: { flex: 1 },

  cardBar: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 3,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },

  iconCircle: {
    width: 52, height: 52,
    borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  iconEmoji: { fontSize: 26 },

  cardName: { fontSize: 14, fontWeight: '700', letterSpacing: -0.3 },
  cardDesc: { fontSize: 11, lineHeight: 15 },

  fieldBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 6, borderWidth: 1,
    marginTop: 4,
  },
  fieldBadgeText: { fontSize: 10, fontWeight: '600' },

  cardArrow: {
    position: 'absolute',
    bottom: 14, right: 16,
    fontSize: 18, fontWeight: '600',
  },
});
