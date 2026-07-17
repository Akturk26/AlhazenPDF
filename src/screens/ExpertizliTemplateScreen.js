import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../components/Icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../themes/colors';

const TEMPLATES = [
  {
    key: 'salda-korsan',
    name: 'Salda Korsan',
    desc: 'Deniz mavisi · Korsan altını · Hasar haritası',
    colors: ['#0E1E2A', '#1A3040'],
    accent: '#C4A020',
    tag: '⚓',
  },
  {
    key: 'kozmik-mukarnas',
    name: 'Kozmik Mukarnas',
    desc: 'Derin uzay · Nebula · Atom geometrisi',
    colors: ['#04030A', '#1A0E3A'],
    accent: '#00C8E0',
    tag: '⚛',
    isNew: true,
  },
  {
    key: 'ibnul-heysem',
    name: 'İbn-ül Heysem',
    desc: 'Parşömen · Altın · Işığın bilgesi',
    colors: ['#060A14', '#0C1428'],
    accent: '#E8C84A',
    tag: '👁',
    isNew: true,
  },
  {
    key: 'alpine',
    name: 'Kristal Zirve',
    desc: 'Kar beyazı · Buzul mavisi · Dağ silüeti',
    colors: ['#060C12', '#0E1A24'],
    accent: '#5BBFDC',
    tag: '❄',
    isNew: true,
  },
  {
    key: 'mukarnas-aotearoa',
    name: 'Mukarnas & Aotearoa',
    desc: 'Orman yeşili · Altın · Eğreltiotu deseni',
    colors: ['#060E08', '#0F2412'],
    accent: '#C8952A',
    tag: '🌿',
    isNew: true,
  },
  {
    key: 'iznik-cini',
    name: 'İznik Çini',
    desc: 'Kobalt mavisi · Parşömen · Osmanlı çinisi',
    colors: ['#1A0A0F', '#0E1F3A'],
    accent: '#1A7A6E',
    tag: '🌷',
    isNew: true,
  },
];

export default function ExpertizliTemplateScreen({ route, navigation }) {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  const insets = useSafeAreaInsets();
  const params = route.params || {};

  const handleSelect = (tpl) => {
    navigation.navigate('ExpertizliPreview', { ...params, templateKey: tpl.key });
  };

  return (
    <View style={[styles.root, { backgroundColor: isDark ? '#0d0f14' : '#F9FAFB' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Nav */}
      <View style={[styles.nav, { borderBottomColor: theme.border, backgroundColor: isDark ? '#0d0f14' : '#fff', paddingTop: insets.top + 14 }]}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: theme.surface2, borderColor: theme.border }]} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={18} color={theme.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.navTitle, { color: theme.text }]}>Şablon Seçin</Text>
          <Text style={[styles.navSub, { color: theme.textSecondary }]}>Expertizli satış kartı teması</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.hint, { color: theme.textSecondary }]}>
          Bir tema seçin — her biri benzersiz tasarım ve renk paleti sunar
        </Text>

        {TEMPLATES.map(tpl => (
          <TouchableOpacity
            key={tpl.key}
            style={[styles.card, { borderColor: tpl.accent + '55' }]}
            onPress={() => handleSelect(tpl)}
            activeOpacity={0.85}
          >
            <LinearGradient colors={tpl.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />

            {tpl.isNew && (
              <View style={[styles.newBadge, { backgroundColor: tpl.accent }]}>
                <Text style={styles.newBadgeTxt}>YENİ</Text>
              </View>
            )}

            {/* Preview mini */}
            <View style={styles.preview}>
              <View style={[styles.previewStripe, { backgroundColor: tpl.accent }]} />
              <View style={styles.previewBody}>
                <Text style={[styles.previewTag, { color: tpl.accent + 'AA' }]}>{tpl.tag} EXPERTIZLI SATIŞ KARTI</Text>
                <Text style={styles.previewMake}>MARKA</Text>
                <Text style={[styles.previewModel, { color: tpl.accent }]}>Model Adı</Text>
              </View>
              <View style={[styles.previewFooter, { backgroundColor: tpl.colors[0] }]}>
                <View style={[styles.previewFooterDot, { backgroundColor: tpl.accent }]} />
                <Text style={[styles.previewFooterTxt, { color: tpl.accent }]}>AlhazenPDF</Text>
              </View>
            </View>

            {/* Info */}
            <View style={styles.info}>
              <Text style={[styles.infoName, { color: tpl.accent }]}>{tpl.tag} {tpl.name}</Text>
              <Text style={styles.infoDesc}>{tpl.desc}</Text>
              <View style={[styles.selectBtn, { borderColor: tpl.accent + '80' }]}>
                <Text style={[styles.selectBtnTxt, { color: tpl.accent }]}>Bu Şablonu Seç →</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Coming soon */}
        <View style={[styles.comingSoon, { backgroundColor: isDark ? '#161a23' : '#fff', borderColor: theme.border }]}>
          <Text style={styles.comingSoonIcon}>🚀</Text>
          <Text style={[styles.comingSoonTitle, { color: theme.text }]}>Daha Fazla Tema Geliyor</Text>
          <Text style={[styles.comingSoonSub, { color: theme.textSecondary }]}>
            Yakında: Galaktik, Amber, Volkan ve daha fazla yeni tema
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  nav: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingTop: 14, paddingBottom: 14,
    borderBottomWidth: 1,
  },
  backBtn: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  backTxt: { fontSize: 18, fontWeight: '600' },
  navTitle: { fontSize: 16, fontWeight: '700' },
  navSub: { fontSize: 11, marginTop: 1 },

  content: { padding: 16 },
  hint: { fontSize: 12, marginBottom: 16, textAlign: 'center' },

  card: {
    borderRadius: 20, borderWidth: 1, overflow: 'hidden',
    marginBottom: 16, flexDirection: 'row', height: 180,
  },
  newBadge: {
    position: 'absolute', top: 12, right: 12, zIndex: 10,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
  },
  newBadgeTxt: { color: '#0E1E2A', fontSize: 9, fontWeight: '800', letterSpacing: 0.8 },

  preview: { width: 120, flexShrink: 0 },
  previewStripe: { height: 4 },
  previewBody: { flex: 1, padding: 10, justifyContent: 'center' },
  previewTag: { fontSize: 5, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 4 },
  previewMake: { fontSize: 22, fontWeight: '900', color: '#F2EDD4', letterSpacing: 0.04, lineHeight: 24 },
  previewModel: { fontSize: 11, fontWeight: '300', fontStyle: 'italic', letterSpacing: 0.1, marginTop: 2 },
  previewFooter: { height: 28, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, gap: 6 },
  previewFooterDot: { width: 6, height: 6, transform: [{ rotate: '45deg' }] },
  previewFooterTxt: { fontSize: 9, fontWeight: '700', letterSpacing: 0.2 },

  info: { flex: 1, padding: 16, justifyContent: 'center' },
  infoName: { fontSize: 18, fontWeight: '800', letterSpacing: 0.05, marginBottom: 4 },
  infoDesc: { fontSize: 12, color: 'rgba(242,237,212,0.45)', lineHeight: 17, marginBottom: 16 },
  selectBtn: { borderWidth: 1, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14, alignSelf: 'flex-start' },
  selectBtnTxt: { fontSize: 13, fontWeight: '700' },

  comingSoon: {
    borderRadius: 16, borderWidth: 1,
    padding: 24, alignItems: 'center', gap: 8,
  },
  comingSoonIcon: { fontSize: 32 },
  comingSoonTitle: { fontSize: 15, fontWeight: '700' },
  comingSoonSub: { fontSize: 12, textAlign: 'center', lineHeight: 18 },
});
