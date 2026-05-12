import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, Alert, ActivityIndicator, Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Sharing from 'expo-sharing';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../themes/colors';
import { getPDFHistory } from '../utils/analytics';
import { pdfFileExists } from '../utils/pdfStorage';


const THEMES_PREVIEW = [
  { key: 't1', name: 'Siyah · Altın', bg: ['#111', '#1a1a1a'], dot: ['#c9a84c', '#f0cc6a'], border: 'rgba(201,168,76,0.4)', isNew: true },
  { key: 't2', name: 'Yeşil · Altın', bg: ['#0a1a0a', '#0f2010'], dot: ['#3d9e3d', '#5cc45c'], border: 'rgba(100,180,80,0.35)' },
  { key: 't3', name: 'Bej · Vintage', bg: ['#f5f0e8', '#ede5d5'], dot: ['#c4a96a', '#e0c98a'], border: 'rgba(180,160,120,0.4)', light: true },
  { key: 't4', name: 'Beyaz · Gümüş', bg: ['#f8f8f8', '#eeeeee'], dot: ['#aab0c0', '#d0d4e0'], border: 'rgba(150,160,180,0.4)', light: true },
];

export default function HomeScreen({ navigation }) {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  const insets = useSafeAreaInsets();
  const [recentPDFs, setRecentPDFs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sharingId, setSharingId] = useState(null);
  const [showFormatPicker, setShowFormatPicker] = useState(false);

  useEffect(() => {
    let isMounted = true;
    loadRecentPDFs(isMounted);
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const unsubscribe = navigation.addListener('focus', () => {
      loadRecentPDFs(isMounted);
    });
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [navigation]);

  const loadRecentPDFs = async (isMounted = true) => {
    try {
      if (loading) return;
      setLoading(true);
      const history = await getPDFHistory();
      if (isMounted) {
        setRecentPDFs(history.slice(0, 3));
        setTotalCount(history.length);
      }
    } catch (err) {
      console.error('Recent PDFs load error:', err);
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  const handleShare = async (pdf) => {
    if (!pdf.permanentUri) {
      Alert.alert('Dosya Bulunamadı', 'Bu PDF eski bir sürümde oluşturulmuş ve dosyası saklanmamış.');
      return;
    }
    const exists = await pdfFileExists(pdf.permanentUri);
    if (!exists) {
      Alert.alert('Dosya Silinmiş', 'PDF dosyası cihazdan kaldırılmış. Tekrar oluşturmanız gerekiyor.');
      return;
    }
    try {
      setSharingId(pdf.id);
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(pdf.permanentUri, {
          mimeType: 'application/pdf',
          dialogTitle: (pdf.title || 'PDF') + ' — PDF Paylaş',
        });
      }
    } catch {
      Alert.alert('Hata', 'PDF paylaşılırken bir sorun oluştu.');
    } finally {
      setSharingId(null);
    }
  };

  const getCategoryEmoji = (cat) => {
    const map = { 'Galeri': '🚗', 'Emlak': '🏠', 'Elektronik': '📱', 'Mobilya': '🛋️', 'Kıyafet': '👔', 'Diğer': '📦' };
    return map[cat] || '📄';
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '';
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return 'Bugün';
    if (date.toDateString() === yesterday.toDateString()) return 'Dün';
    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' });
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0d0f14' : '#F9FAFB' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#0d0f14' : '#F9FAFB'} />

      {/* Ambient glows */}
      <View style={[styles.glow1, { opacity: isDark ? 1 : 0.4 }]} />
      <View style={[styles.glow2, { opacity: isDark ? 1 : 0.3 }]} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 12) + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HEADER ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcome}>Hoş geldiniz 👋</Text>
            <Text style={[styles.logo, { color: isDark ? '#f0f2f8' : '#1a1a2e' }]}>
              Alhazen<Text style={styles.logoAccent}>PDF</Text>
            </Text>
            <Text style={styles.tagline}>Profesyonel PDF üreticisi</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={[styles.statChip, { backgroundColor: isDark ? '#1e2330' : '#E8EAF6', borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)' }]}>
              <Text style={styles.statChipText}>📄 <Text style={[styles.statChipBold, { color: isDark ? '#f0f2f8' : '#1a1a2e' }]}>{totalCount}</Text> belge</Text>
            </View>
            <TouchableOpacity
              style={[styles.statChip, { backgroundColor: isDark ? '#1e2330' : '#FFF8E1', borderColor: isDark ? 'rgba(201,168,76,0.2)' : 'rgba(201,168,76,0.3)' }]}
              onPress={() => navigation.navigate('Settings')}
              activeOpacity={0.7}
            >
              <Text style={[styles.statChipBold, { color: '#c9a84c', fontSize: 11 }]}>✨ Premium</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── ANA AKSİYON KARTLARI ── */}
        <View style={styles.actionCards}>
          {/* PDF Oluştur */}
          <TouchableOpacity
            style={[styles.actionCard, styles.actionCardPDF]}
            onPress={() => navigation.navigate('Category', { mode: 'pdf' })}
            activeOpacity={0.88}
          >
            <LinearGradient
              colors={['#1a2a6c', '#1e3060', '#162248']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.actionCardShine} />
            <View style={[styles.actionIconWrap, { backgroundColor: 'rgba(79,110,247,0.2)', borderColor: 'rgba(79,110,247,0.3)' }]}>
              <Text style={styles.actionIcon}>📄</Text>
            </View>
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>PDF Oluştur</Text>
              <Text style={styles.actionSub}>Standart · Afiş · Sticker · İlan kartı</Text>
            </View>
            <View style={[styles.actionArrow, { backgroundColor: 'rgba(79,110,247,0.25)' }]}>
              <Text style={[styles.actionArrowText, { color: '#7a9bff' }]}>→</Text>
            </View>
          </TouchableOpacity>

          {/* Satış & Medya Kartları */}
          <TouchableOpacity
            style={[styles.actionCard, styles.actionCardCards]}
            onPress={() => setShowFormatPicker(true)}
            activeOpacity={0.88}
          >
            <LinearGradient
              colors={['#0e0a1a', '#1a1030', '#0e0a1a']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.actionCardShine} />
            <View style={[styles.actionIconWrap, { backgroundColor: 'rgba(130,90,255,0.18)', borderColor: 'rgba(130,90,255,0.28)' }]}>
              <Text style={styles.actionIcon}>🎴</Text>
            </View>
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>Satış & Medya Kartları</Text>
              <Text style={styles.actionSub}>Dikey · Kare · Story formatı</Text>
            </View>
            <View style={[styles.actionArrow, { backgroundColor: 'rgba(130,90,255,0.22)' }]}>
              <Text style={[styles.actionArrowText, { color: '#a07aff' }]}>→</Text>
            </View>
          </TouchableOpacity>

          {/* Expertizli Satış Kağıdı */}
          <TouchableOpacity
            style={[styles.actionCard, styles.actionCardExpertiz]}
            onPress={() => navigation.navigate('ExpertizliForm')}
            activeOpacity={0.88}
          >
            <LinearGradient
              colors={['#0E1E2A', '#1A3040', '#0E1E2A']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.actionCardShine} />
            <View style={[styles.actionIconWrap, { backgroundColor: 'rgba(196,160,32,0.15)', borderColor: 'rgba(196,160,32,0.3)' }]}>
              <Text style={styles.actionIcon}>📋</Text>
            </View>
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>Expertizli Satış Kağıdı</Text>
              <Text style={styles.actionSub}>Hasar haritası · Donanım · A4 PDF</Text>
            </View>
            <View style={[styles.actionArrow, { backgroundColor: 'rgba(196,160,32,0.2)' }]}>
              <Text style={[styles.actionArrowText, { color: '#C4A020' }]}>→</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── TEMALAR ── */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#f0f2f8' : '#1a1a2e' }]}>Temalar</Text>
            <Text style={[styles.sectionLink, { color: '#4f6ef7' }]}>Tümü →</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.themesScroll}
          >
            {THEMES_PREVIEW.map((t) => (
              <TouchableOpacity
                key={t.key}
                style={[styles.themeCard, { borderColor: t.border }]}
                onPress={() => navigation.navigate('Category', { mode: 'pdf' })}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={t.bg}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                {t.isNew && (
                  <View style={styles.themeBadge}>
                    <Text style={styles.themeBadgeText}>✦</Text>
                  </View>
                )}
                <LinearGradient
                  colors={t.dot}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={styles.themeDot}
                />
                <Text style={[styles.themeName, { color: t.light ? 'rgba(60,50,30,0.65)' : 'rgba(255,255,255,0.5)' }]}>
                  {t.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── SON BELGELER ── */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#f0f2f8' : '#1a1a2e' }]}>Son Belgeler</Text>
            <TouchableOpacity onPress={() => navigation.navigate('History')}>
              <Text style={[styles.sectionLink, { color: '#4f6ef7' }]}>Tümü →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.recentList}>
            {recentPDFs.length === 0 ? (
              <View style={[styles.emptyCard, { backgroundColor: isDark ? '#161a23' : '#fff', borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)' }]}>
                <Text style={[styles.emptyText, { color: isDark ? '#6b7280' : '#9CA3AF' }]}>
                  Henüz belge oluşturmadınız 📭
                </Text>
              </View>
            ) : (
              recentPDFs.map((pdf, i) => {
                const isSharing = sharingId === pdf.id;
                const hasFile = !!pdf.permanentUri;
                return (
                  <TouchableOpacity
                    key={pdf.id || i}
                    style={[styles.recentItem, { backgroundColor: isDark ? '#161a23' : '#fff', borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)' }]}
                    onPress={() => navigation.navigate('History')}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.recentIconWrap, { backgroundColor: isDark ? '#1e2330' : '#F3F4F6' }]}>
                      <Text style={styles.recentEmoji}>{getCategoryEmoji(pdf.category)}</Text>
                    </View>
                    <View style={styles.recentInfo}>
                      <Text style={[styles.recentName, { color: isDark ? '#f0f2f8' : '#1a1a2e' }]} numberOfLines={1}>{pdf.title}</Text>
                      <Text style={[styles.recentMeta, { color: isDark ? '#6b7280' : '#9CA3AF' }]}>
                        {pdf.category} · {formatDate(pdf.timestamp)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.recentShare, { backgroundColor: hasFile ? 'rgba(79,110,247,0.15)' : (isDark ? '#1e2330' : '#F3F4F6'), borderColor: hasFile ? 'rgba(79,110,247,0.4)' : (isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)') }]}
                      onPress={() => handleShare(pdf)}
                      disabled={isSharing}
                      activeOpacity={0.7}
                    >
                      {isSharing
                        ? <ActivityIndicator size="small" color="#4f6ef7" />
                        : <Text style={{ fontSize: 14 }}>{hasFile ? '↑' : '⬇'}</Text>
                      }
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── FORMAT PICKER MODAL ── */}
      <Modal
        visible={showFormatPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFormatPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowFormatPicker(false)}
        >
          <View style={[styles.modalSheet, { backgroundColor: isDark ? '#161a23' : '#fff' }]}>
            <View style={[styles.modalHandle, { backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)' }]} />
            <Text style={[styles.modalTitle, { color: isDark ? '#f0f2f8' : '#1a1a2e' }]}>Format Seçin</Text>
            <View style={styles.formatTiles}>
              {[
                { icon: '📱', label: 'Dikey', sub: 'Story · Vitrin · A4', mode: 'sales-card-story', color: '#5ddb8a', bg: 'rgba(61,186,124,0.14)', border: 'rgba(61,186,124,0.3)' },
                { icon: '⬜', label: 'Kare', sub: 'Satış kartı · 1:1', mode: 'sales-card-post', color: '#c9a84c', bg: 'rgba(201,168,76,0.14)', border: 'rgba(201,168,76,0.3)' },
                { icon: '🎞️', label: 'Story', sub: 'Sosyal medya · 9:16', mode: 'social', color: '#a07aff', bg: 'rgba(130,90,255,0.14)', border: 'rgba(130,90,255,0.28)' },
              ].map((f) => (
                <TouchableOpacity
                  key={f.label}
                  style={[styles.formatTile, { backgroundColor: f.bg, borderColor: f.border }]}
                  onPress={() => {
                    setShowFormatPicker(false);
                    navigation.navigate('Category', { mode: f.mode });
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.formatTileIcon}>{f.icon}</Text>
                  <Text style={[styles.formatTileLabel, { color: isDark ? '#f0f2f8' : '#1a1a2e' }]}>{f.label}</Text>
                  <Text style={[styles.formatTileSub, { color: isDark ? '#6b7280' : '#9CA3AF' }]}>{f.sub}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── BOTTOM NAV ── */}
      <View style={[styles.bottomNav, { borderTopColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)', paddingBottom: Math.max(insets.bottom, 12) }]}>
        <LinearGradient
          colors={isDark ? ['rgba(13,15,20,0)', 'rgba(13,15,20,0.97)'] : ['rgba(249,250,251,0)', 'rgba(249,250,251,0.97)']}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        {[
          { icon: '🏠', label: 'Ana Sayfa', active: true, onPress: undefined },
          { icon: '📚', label: 'Belgeler', onPress: () => navigation.navigate('History') },
          { icon: '📊', label: 'İstatistik', onPress: () => navigation.navigate('Dashboard') },
          { icon: '⚙️', label: 'Ayarlar', onPress: () => navigation.navigate('Settings') },
        ].map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.navItem}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <Text style={styles.navIcon}>{item.icon}</Text>
            <Text style={[styles.navLabel, { color: item.active ? '#4f6ef7' : (isDark ? '#6b7280' : '#9CA3AF') }]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  glow1: {
    position: 'absolute', top: -120, right: -80,
    width: 340, height: 340, borderRadius: 170,
    backgroundColor: 'rgba(79,110,247,0.12)',
  },
  glow2: {
    position: 'absolute', bottom: 100, left: -100,
    width: 280, height: 280, borderRadius: 140,
    backgroundColor: 'rgba(201,168,76,0.08)',
  },

  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 20 },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 24, paddingTop: 52, paddingBottom: 20,
  },
  welcome: { fontSize: 13, color: '#6b7280', marginBottom: 4 },
  logo: { fontSize: 30, fontWeight: '800', color: '#f0f2f8', letterSpacing: -0.5, lineHeight: 34 },
  logoAccent: { color: '#4f6ef7' },
  tagline: { fontSize: 12, color: '#6b7280', fontWeight: '300', marginTop: 4 },
  headerRight: { alignItems: 'flex-end', gap: 6, paddingTop: 6 },
  statChip: {
    borderRadius: 10, borderWidth: 1,
    paddingHorizontal: 10, paddingVertical: 5,
    flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  statChipText: { fontSize: 11, color: '#6b7280' },
  statChipBold: { fontWeight: '600' },

  // Action cards
  actionCards: { paddingHorizontal: 24, gap: 12, marginBottom: 32 },
  actionCard: {
    borderRadius: 20, padding: 22,
    flexDirection: 'row', alignItems: 'center', gap: 18,
    overflow: 'hidden', position: 'relative',
  },
  actionCardPDF: { borderWidth: 1, borderColor: 'rgba(79,110,247,0.3)' },
  actionCardCards: { borderWidth: 1, borderColor: 'rgba(130,90,255,0.28)' },
  actionCardExpertiz: { borderWidth: 1, borderColor: 'rgba(196,160,32,0.35)' },
  actionCardShine: {
    position: 'absolute', top: 0, right: 0,
    width: 140, height: '100%',
    backgroundColor: 'rgba(255,255,255,0.025)',
  },
  actionIconWrap: {
    width: 52, height: 52, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, flexShrink: 0,
  },
  actionIcon: { fontSize: 24 },
  actionText: { flex: 1 },
  actionTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 4 },
  actionSub: { fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 16 },
  actionArrow: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  actionArrowText: { fontSize: 16, fontWeight: '600' },

  // Section
  sectionContainer: { marginBottom: 28 },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24, marginBottom: 14,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  sectionLink: { fontSize: 12, fontWeight: '500' },

  // Themes
  themesScroll: { paddingHorizontal: 24, gap: 10 },
  themeCard: {
    width: 88, height: 108, borderRadius: 16,
    alignItems: 'center', justifyContent: 'flex-end',
    padding: 10, borderWidth: 1, overflow: 'hidden',
  },
  themeBadge: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: '#4f6ef7',
    borderRadius: 5, paddingHorizontal: 5, paddingVertical: 2,
  },
  themeBadgeText: { fontSize: 8, color: '#fff', fontWeight: '700' },
  themeDot: { width: 20, height: 20, borderRadius: 10, marginBottom: 8 },
  themeName: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', textAlign: 'center' },

  // Recent
  recentList: { paddingHorizontal: 24, gap: 8 },
  recentItem: {
    borderRadius: 14, borderWidth: 1,
    padding: 14, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  recentIconWrap: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  recentEmoji: { fontSize: 18 },
  recentInfo: { flex: 1, minWidth: 0 },
  recentName: { fontSize: 13, fontWeight: '500', marginBottom: 2 },
  recentMeta: { fontSize: 11 },
  recentShare: {
    width: 32, height: 32, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, flexShrink: 0,
  },
  emptyCard: {
    borderRadius: 14, borderWidth: 1,
    padding: 24, alignItems: 'center',
    marginHorizontal: 24,
  },
  emptyText: { fontSize: 14 },

  // Format picker modal
  modalOverlay: {
    flex: 1, justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalSheet: {
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 24, paddingTop: 14, paddingBottom: 36,
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    alignSelf: 'center', marginBottom: 20,
  },
  modalTitle: { fontSize: 17, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  formatTiles: { flexDirection: 'row', gap: 12 },
  formatTile: {
    flex: 1, borderRadius: 16, borderWidth: 1,
    padding: 18, alignItems: 'center', gap: 6,
  },
  formatTileIcon: { fontSize: 28 },
  formatTileLabel: { fontSize: 14, fontWeight: '700' },
  formatTileSub: { fontSize: 10, textAlign: 'center', lineHeight: 14 },

  // Bottom nav
  bottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 10,
    borderTopWidth: 1, overflow: 'hidden',
  },
  navItem: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 4 },
  navIcon: { fontSize: 22, lineHeight: 26 },
  navLabel: { fontSize: 10, fontWeight: '500', letterSpacing: 0.2 },

  // Settings menu
  settingsMenu: {
    position: 'absolute', bottom: 80, right: 20,
    borderRadius: 12, borderWidth: 1,
    minWidth: 220, elevation: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 8,
  },
  settingsItem: {
    flexDirection: 'row', alignItems: 'center',
    padding: 14, gap: 12, borderBottomWidth: 1,
  },
  settingsEmoji: { fontSize: 20 },
  settingsText: { fontSize: 14, fontWeight: '600' },
});
