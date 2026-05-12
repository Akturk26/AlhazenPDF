import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../themes/colors';

const TEMPLATES = [
  {
    id: 1, name: 'Modern', tag: 'Klasik', multiPage: false,
    color: '#4F46E5',
    thumb: {
      bg: '#FFFFFF', header: '#4F46E5', headerH: 18,
      photoColor: '#E8E8EE', accent: '#4F46E5',
      lines: ['#4F46E588', '#4F46E555', '#4F46E535'],
      footer: '#4F46E5', hasBorder: false, hasCorners: false, serif: false,
    },
  },
  {
    id: 2, name: 'Premium Altın', tag: 'Premium', multiPage: true,
    color: '#C9A84C',
    thumb: {
      bg: '#111111', header: '#111111', headerH: 20,
      photoColor: '#2A2A2A', accent: '#C9A84C',
      lines: ['#C9A84C99', '#C9A84C66', '#C9A84C44'],
      footer: '#1A1A1A', hasBorder: false, hasCorners: true, serif: true,
    },
  },
  {
    id: 3, name: 'Premium Yeşil', tag: 'Premium', multiPage: true,
    color: '#4CAF50',
    thumb: {
      bg: '#0F1F10', header: '#0F1F10', headerH: 20,
      photoColor: '#1A2E1A', accent: '#4CAF50',
      lines: ['#4CAF5099', '#4CAF5066', '#4CAF5044'],
      footer: '#0F1F10', hasBorder: false, hasCorners: false, badge: true, serif: true,
    },
  },
  {
    id: 4, name: 'Premium Vintage', tag: 'Premium', multiPage: true,
    color: '#A08060',
    thumb: {
      bg: '#F5F0E8', header: '#F5F0E8', headerH: 20,
      photoColor: '#E0D8CC', accent: '#C4A96A',
      lines: ['#A0806088', '#A0806066', '#A0806044'],
      footer: '#EDE5D5', hasBorder: true, hasCorners: false, serif: true,
    },
  },
  {
    id: 5, name: 'Premium Beyaz', tag: 'Premium', multiPage: true,
    color: '#333333',
    thumb: {
      bg: '#FFFFFF', header: '#FFFFFF', headerH: 20,
      photoColor: '#F0F0F0', accent: '#333333',
      lines: ['#33333388', '#33333366', '#33333344'],
      footer: '#F8F8F8', hasBorder: false, hasCorners: false, serif: true, topBar: true,
    },
  },
  {
    id: 6, name: 'Bordo Altın', tag: 'Premium', multiPage: true,
    color: '#7A1520',
    thumb: {
      bg: '#1A0508', header: '#7A1520', headerH: 20,
      photoColor: '#2A1015', accent: '#C9A84C',
      lines: ['#C9A84C99', '#C9A84C66', '#C9A84C44'],
      footer: '#7A1520', hasBorder: false, hasCorners: false, serif: true,
    },
  },
  {
    id: 7, name: 'Lacivert Gümüş', tag: 'Premium', multiPage: true,
    color: '#1A3A6A',
    thumb: {
      bg: '#0A1828', header: '#1A3A6A', headerH: 20,
      photoColor: '#1A2840', accent: '#A0B8D0',
      lines: ['#A0B8D099', '#A0B8D066', '#A0B8D044'],
      footer: '#1A3A6A', hasBorder: false, hasCorners: false, serif: true,
    },
  },
  {
    id: 8, name: 'Bakır', tag: 'Premium', multiPage: true,
    color: '#8B5A30',
    thumb: {
      bg: '#120A04', header: '#120A04', headerH: 20,
      photoColor: '#1E1008', accent: '#B87040',
      lines: ['#B8704099', '#B8704066', '#B8704044'],
      footer: '#1E1008', hasBorder: false, hasCorners: false, serif: true,
    },
  },
  {
    id: 9, name: 'Gri Turuncu', tag: 'Premium', multiPage: true,
    color: '#E86020',
    thumb: {
      bg: '#0E0E0E', header: '#1A1A1A', headerH: 22,
      photoColor: '#222222', accent: '#E86020',
      lines: ['#E8602099', '#E8602066', '#E8602044'],
      footer: '#E86020', hasBorder: false, hasCorners: false, serif: false,
    },
  },
];

function ThumbPreview({ thumb, accent }) {
  const { bg, header, headerH, photoColor, lines, footer, hasBorder, hasCorners, topBar } = thumb;
  const isDarkThumb = bg.startsWith('#0') || bg.startsWith('#1') || bg === '#111111' || bg === '#0E0E0E' || bg === '#120A04';

  return (
    <View style={[
      styles.thumbOuter,
      { backgroundColor: bg, borderColor: hasBorder ? accent + '60' : 'transparent', borderWidth: hasBorder ? 1 : 0 },
    ]}>
      {/* Gold corners for darkGold */}
      {hasCorners && (
        <>
          <View style={[styles.corner, styles.cornerTL, { borderColor: accent }]} />
          <View style={[styles.corner, styles.cornerTR, { borderColor: accent }]} />
          <View style={[styles.corner, styles.cornerBL, { borderColor: accent }]} />
          <View style={[styles.corner, styles.cornerBR, { borderColor: accent }]} />
        </>
      )}
      {/* Top accent bar (white theme) */}
      {topBar && <View style={[styles.topBar, { backgroundColor: '#111' }]} />}
      {/* Header */}
      <View style={[styles.thumbHeader, { backgroundColor: header, height: headerH, borderBottomColor: accent + '40', borderBottomWidth: hasBorder || bg === '#FFFFFF' ? 1 : 0 }]}>
        <View style={[styles.thumbHeaderDot, { backgroundColor: accent }]} />
        <View style={[styles.thumbHeaderLine, { backgroundColor: isDarkThumb ? '#ffffff30' : '#00000025' }]} />
      </View>
      {/* Photo placeholder */}
      <View style={[styles.thumbPhoto, { backgroundColor: photoColor }]}>
        <View style={[styles.thumbPhotoInner, { backgroundColor: accent + '30' }]} />
      </View>
      {/* Text lines */}
      <View style={styles.thumbBody}>
        {lines.map((c, i) => (
          <View key={i} style={[styles.thumbLine, { backgroundColor: c, width: i === 0 ? '80%' : i === 1 ? '55%' : '68%' }]} />
        ))}
        {/* Specs mini grid */}
        <View style={styles.thumbGrid}>
          {[0, 1, 2].map(i => (
            <View key={i} style={[styles.thumbCell, { backgroundColor: accent + '20', borderColor: accent + '30' }]} />
          ))}
        </View>
      </View>
      {/* Footer bar */}
      <View style={[styles.thumbFooter, { backgroundColor: footer }]}>
        <View style={[styles.thumbFooterLine, { backgroundColor: accent + '80' }]} />
      </View>
    </View>
  );
}

export default function TemplateScreen({ route, navigation }) {
  const { category, images, formData, logo, companyName } = route.params;
  const [selected, setSelected] = useState(null);
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  const handleContinue = () => {
    if (!selected) return;
    navigation.navigate('Preview', { category, images, formData, template: selected, logo, companyName });
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
          <Text style={[styles.navTitle, { color: theme.text }]}>Tema Seçin</Text>
          <Text style={[styles.navSub, { color: theme.textSecondary }]}>9 profesyonel tema</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>

        {TEMPLATES.map((tmpl) => {
          const isSelected = selected?.id === tmpl.id;
          return (
            <TouchableOpacity
              key={tmpl.id}
              style={[
                styles.card,
                { backgroundColor: theme.surface, borderColor: isSelected ? tmpl.color : theme.border },
                isSelected && { borderWidth: 2 },
              ]}
              onPress={() => setSelected(tmpl)}
              activeOpacity={0.75}
            >
              {/* Sol renk çizgisi */}
              <View style={[styles.colorBar, { backgroundColor: tmpl.color }]} />

              {/* PDF Minyatür */}
              <ThumbPreview thumb={tmpl.thumb} accent={tmpl.color} />

              {/* Bilgi */}
              <View style={styles.info}>
                <Text style={[styles.cardName, { color: theme.text }]}>{tmpl.name}</Text>
                <View style={styles.badges}>
                  <View style={[styles.badge, { backgroundColor: tmpl.color + '18', borderColor: tmpl.color + '40' }]}>
                    <Text style={[styles.badgeText, { color: tmpl.color }]}>{tmpl.tag}</Text>
                  </View>
                  {tmpl.multiPage && (
                    <View style={[styles.badge, { backgroundColor: theme.greenDim || '#E8F5E9', borderColor: '#4CAF5050' }]}>
                      <Text style={[styles.badgeText, { color: '#388E3C' }]}>Çok Sayfalı</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.cardSub, { color: theme.textSecondary }]}>
                  {tmpl.thumb.serif ? 'Serif · Klasik tipografi' : 'Sans-serif · Modern tipografi'}
                </Text>
              </View>

              {/* Seçim */}
              {isSelected ? (
                <View style={[styles.checkCircle, { backgroundColor: tmpl.color }]}>
                  <Text style={styles.checkText}>✓</Text>
                </View>
              ) : (
                <View style={[styles.emptyCircle, { borderColor: theme.border }]} />
              )}
            </TouchableOpacity>
          );
        })}

        <View style={[styles.infoBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.infoBoxText, { color: theme.textSecondary }]}>
            💡{'  '}<Text style={{ fontWeight: '600', color: theme.text }}>Çok Sayfalı</Text>{' '}temalar 4–25 fotoğrafla birden fazla sayfa oluşturur.
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Alt buton */}
      {selected && (
        <View style={[styles.bottom, { backgroundColor: theme.bg, borderTopColor: theme.border }]}>
          <TouchableOpacity onPress={handleContinue} activeOpacity={0.88}>
            <LinearGradient
              colors={theme.ctaGradient}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.bottomBtn}
            >
              <Text style={styles.bottomBtnText}>{selected.name} ile PDF Oluştur →</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const THUMB_W = 62;
const THUMB_H = 84;

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
    overflow: 'hidden',
    paddingVertical: 12, paddingRight: 16,
    paddingLeft: 20, gap: 14,
  },

  colorBar: {
    position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
  },

  // ── Thumbnail ──
  thumbOuter: {
    width: THUMB_W, height: THUMB_H,
    borderRadius: 8, overflow: 'hidden',
    flexShrink: 0,
  },
  topBar: { height: 2 },
  thumbHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 5, gap: 4,
  },
  thumbHeaderDot: { width: 5, height: 5, borderRadius: 3 },
  thumbHeaderLine: { flex: 1, height: 2, borderRadius: 1 },
  thumbPhoto: {
    height: 28, marginHorizontal: 4, marginTop: 3,
    borderRadius: 4, overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center',
  },
  thumbPhotoInner: { width: 16, height: 10, borderRadius: 2 },
  thumbBody: {
    flex: 1, paddingHorizontal: 5, paddingTop: 5, gap: 3,
  },
  thumbLine: { height: 2.5, borderRadius: 1.5 },
  thumbGrid: { flexDirection: 'row', gap: 3, marginTop: 3 },
  thumbCell: {
    flex: 1, height: 8, borderRadius: 2, borderWidth: 0.5,
  },
  thumbFooter: { height: 10, alignItems: 'center', justifyContent: 'center' },
  thumbFooterLine: { width: '50%', height: 1.5, borderRadius: 1 },

  // Gold corners
  corner: {
    position: 'absolute', width: 6, height: 6,
    borderColor: '#C9A84C',
  },
  cornerTL: { top: 3, left: 3, borderTopWidth: 1, borderLeftWidth: 1 },
  cornerTR: { top: 3, right: 3, borderTopWidth: 1, borderRightWidth: 1 },
  cornerBL: { bottom: 3, left: 3, borderBottomWidth: 1, borderLeftWidth: 1 },
  cornerBR: { bottom: 3, right: 3, borderBottomWidth: 1, borderRightWidth: 1 },

  // ── Card Info ──
  info: { flex: 1, gap: 5 },
  cardName: { fontSize: 14, fontWeight: '700', letterSpacing: -0.2 },
  cardSub: { fontSize: 11, lineHeight: 14 },
  badges: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  badge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 5, borderWidth: 1 },
  badgeText: { fontSize: 9, fontWeight: '700' },

  checkCircle: {
    width: 26, height: 26, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  checkText: { fontSize: 13, color: '#fff', fontWeight: '700' },
  emptyCircle: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, flexShrink: 0 },

  infoBox: {
    borderRadius: 12, borderWidth: 1,
    padding: 14, marginTop: 4,
  },
  infoBoxText: { fontSize: 12, lineHeight: 18 },

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
