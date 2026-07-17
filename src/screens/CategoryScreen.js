import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../themes/colors';
import Icon from '../components/Icon';

const CATEGORIES = [
  {
    id: 'auto',
    name: 'Araç Galerisi',
    iconName: 'car-outline',
    color: '#E05555',
    description: 'Araç satış ilanları',
    fields: ['Marka', 'Model', 'Yıl', 'KM', 'Motor', 'Şanzıman', 'Yakıt', 'Renk', 'Hasar Kayıt', 'Fiyat', 'Telefon', 'Açıklama'],
  },
  {
    id: 'real-estate',
    name: 'Emlak',
    iconName: 'home-city-outline',
    color: '#3DBA7C',
    description: 'Satılık / Kiralık ilan',
    fields: ['İlan Türü', 'Emlak Türü', 'Oda Sayısı', 'M² (Net)', 'M² (Brüt)', 'Bina Yaşı', 'Kat', 'Isıtma', 'Banyo Sayısı', 'Balkon', 'Site İçi', 'Fiyat', 'Adres', 'Telefon'],
  },
  {
    id: 'office',
    name: 'Ofis / Kurumsal',
    iconName: 'briefcase-outline',
    color: '#3B82F6',
    description: 'Belgeler & raporlar',
    fields: ['Başlık', 'Firma', 'Departman', 'Tarih', 'Hazırlayan', 'Açıklama'],
  },
  {
    id: 'personal',
    name: 'Kişisel / CV',
    iconName: 'account-outline',
    color: '#9B6EF7',
    description: 'Özgeçmiş & belgeler',
    fields: ['Ad Soyad', 'Meslek', 'Doğum Tarihi', 'Telefon', 'Email', 'Adres', 'LinkedIn', 'Açıklama', 'Eğitim Seviyesi', 'İş Geçmişi', 'Beceriler', 'Yabancı Diller', 'CV Teması'],
  },
  {
    id: 'other',
    name: 'Diğer',
    iconName: 'file-document-outline',
    color: '#E0904A',
    description: 'Genel amaçlı PDF',
    fields: ['Başlık', 'Alt Başlık', 'Kategori', 'Açıklama'],
  },
];

export default function CategoryScreen({ route, navigation }) {
  const mode = route.params?.mode || 'pdf';
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  const insets = useSafeAreaInsets();

  const salesCardMode = mode === 'sales-card' || mode === 'sales-card-story' || mode === 'sales-card-post';
  const visibleCategories = (mode === 'social' || salesCardMode)
    ? CATEGORIES.filter(c => c.id === 'real-estate' || c.id === 'auto')
    : CATEGORIES;

  const handleSelect = (category) => {
    if (category.id === 'real-estate' || category.id === 'auto') {
      if (mode === 'pdf' && category.id === 'auto') {
        navigation.navigate('Form', {
          category, images: [],
          format: { id: 'standard', type: 'pdf', name: 'Standart PDF', size: 'A4', color: '#0F172A', iconName: 'file-document-outline', useCase: 'Müşteri dosyası · E-posta', maxPhotos: 25 },
        });
      } else if (mode === 'sales-card-story') {
        navigation.navigate('Form', { category, images: [], mode: 'sales-card-story' });
      } else {
        navigation.navigate('Format', { category, mode });
      }
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

  const rows = visibleCategories.reduce((acc, cat, i) => {
    if (i % 2 === 0) acc.push([cat]);
    else acc[acc.length - 1].push(cat);
    return acc;
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.bg} />

      <View style={[styles.nav, { borderBottomColor: theme.border, paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, { backgroundColor: theme.surface2, borderColor: theme.border }]}
        >
          <Icon name="arrow-left" size={18} color={theme.text} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.navTitle, { color: theme.text }]}>{getTitle()}</Text>
          <Text style={[styles.navSub, { color: theme.textSecondary }]}>{getSubtitle()}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {rows.map((row, rowIdx) => (
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
                <View style={[styles.cardBar, { backgroundColor: cat.color }]} />

                <View style={[styles.iconCircle, { backgroundColor: cat.color + '22' }]}>
                  <Icon name={cat.iconName} size={28} color={cat.color} />
                </View>

                <Text style={[styles.cardName, { color: theme.text }]}>{cat.name}</Text>
                <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>{cat.description}</Text>

                <View style={[styles.fieldBadge, { backgroundColor: cat.color + '18', borderColor: cat.color + '40' }]}>
                  <Text style={[styles.fieldBadgeText, { color: cat.color }]}>{cat.fields.length} alan</Text>
                </View>

                <View style={[styles.cardArrowWrap, { backgroundColor: cat.color + '15' }]}>
                  <Icon name="arrow-right" size={14} color={cat.color} />
                </View>
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
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 14, borderBottomWidth: 1,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 12,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  navTitle: { fontSize: 17, fontWeight: '700', letterSpacing: -0.3 },
  navSub: { fontSize: 11, marginTop: 1 },

  scroll: { flex: 1 },
  grid: { padding: 16, gap: 12 },
  row: { flexDirection: 'row', gap: 12 },

  card: {
    flex: 1, borderRadius: 18, borderWidth: 1,
    padding: 18, overflow: 'hidden', position: 'relative',
    minHeight: 170, gap: 6,
  },
  cardFull: { flex: 1 },
  cardBar: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 3,
    borderTopLeftRadius: 18, borderTopRightRadius: 18,
  },

  iconCircle: {
    width: 52, height: 52, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },

  cardName: { fontSize: 14, fontWeight: '700', letterSpacing: -0.3 },
  cardDesc: { fontSize: 11, lineHeight: 15 },

  fieldBadge: {
    alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 6, borderWidth: 1, marginTop: 4,
  },
  fieldBadgeText: { fontSize: 10, fontWeight: '600' },

  cardArrowWrap: {
    position: 'absolute', bottom: 12, right: 12,
    width: 26, height: 26, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
});
