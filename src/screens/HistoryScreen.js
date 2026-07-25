import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, StatusBar, Alert, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Sharing from 'expo-sharing';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../themes/colors';
import { getPDFHistory, deletePDFFromHistory, clearAllHistory } from '../utils/analytics';
import { pdfFileExists, deletePDFFile } from '../utils/pdfStorage';
import Icon from '../components/Icon';

const GOLD  = '#C9A84C';
const NAVY  = '#0F172A';
const NAVY2 = '#1A2744';

export default function HistoryScreen({ navigation }) {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  const insets = useSafeAreaInsets();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sharingId, setSharingId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('Tümü');

  useEffect(() => {
    let isMounted = true;
    loadHistory(isMounted);
    return () => { isMounted = false; };
  }, []);

  const loadHistory = async (isMounted = true) => {
    try {
      setLoading(true);
      const data = await getPDFHistory();
      if (isMounted) { setHistory(data); setLoading(false); }
    } catch {
      if (isMounted) setLoading(false);
    }
  };

  const handleShare = async (item) => {
    if (!item.permanentUri) {
      Alert.alert('Dosya Bulunamadı', 'Bu PDF eski bir sürümde oluşturulmuş ve dosyası saklanmamış.');
      return;
    }
    const exists = await pdfFileExists(item.permanentUri);
    if (!exists) {
      Alert.alert('Dosya Silinmiş', 'PDF dosyası cihazdan kaldırılmış. Tekrar oluşturmanız gerekiyor.');
      return;
    }
    try {
      setSharingId(item.id);
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(item.permanentUri, {
          mimeType: 'application/pdf',
          dialogTitle: item.title + ' — PDF Paylaş',
        });
      }
    } catch {
      Alert.alert('Hata', 'PDF paylaşılırken bir sorun oluştu.');
    } finally {
      setSharingId(null);
    }
  };

  const handleDelete = (item) => {
    Alert.alert(
      'PDF Sil',
      'Bu kayıt ve dosya silinecek. Geri alınamaz.',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil', style: 'destructive',
          onPress: async () => {
            await deletePDFFile(item.permanentUri);
            await deletePDFFromHistory(item.id);
            await loadHistory();
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    if (history.length === 0) return;
    Alert.alert(
      'Tüm Geçmişi Sil',
      `${history.length} kayıt ve dosyaları silinecek. Geri alınamaz.`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Tümünü Sil', style: 'destructive',
          onPress: async () => {
            await Promise.all(history.map(item => deletePDFFile(item.permanentUri)));
            await clearAllHistory();
            setHistory([]);
          },
        },
      ]
    );
  };

  const getCategoryIcon = (cat) => {
    const map = {
      'Araç Galerisi': 'car-outline',
      'Emlak': 'home-city-outline',
      'Ofis / Kurumsal': 'briefcase-outline',
      'Kişisel / CV': 'account-outline',
      'Diğer': 'file-document-outline',
    };
    return map[cat] || 'file-document-outline';
  };

  const getCategoryColor = (cat) => {
    const map = { 'Araç Galerisi': '#E05555', 'Emlak': '#3DBA7C', 'Ofis / Kurumsal': '#C9A84C', 'Kişisel / CV': '#9B6EF7' };
    return map[cat] || '#888';
  };

  const FILTERS = [
    { label: 'Tümü', value: 'Tümü' },
    { label: 'Araç', value: 'Araç Galerisi' },
    { label: 'Emlak', value: 'Emlak' },
    { label: 'Ofis', value: 'Ofis / Kurumsal' },
    { label: 'CV', value: 'Kişisel / CV' },
  ];

  const filtered = activeFilter === 'Tümü' ? history : history.filter(item => item.category === activeFilter);

  const formatDate = (ts) => {
    if (!ts) return '';
    const date = new Date(ts);
    if (isNaN(date.getTime())) return '';
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString())
      return `Bugün ${date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`;
    if (date.toDateString() === yesterday.toDateString())
      return `Dün ${date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`;
    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <LinearGradient
        colors={[NAVY, NAVY2]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PDF Geçmişi</Text>
        <View style={styles.headerRight}>
          <Text style={styles.headerCount}>{history.length} PDF</Text>
          {history.length > 0 && (
            <TouchableOpacity onPress={handleClearAll} style={styles.clearBtn}>
              <Text style={styles.clearText}>Tümünü Sil</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.filterBar, { backgroundColor: theme.bg, borderBottomColor: theme.border }]}
        contentContainerStyle={styles.filterContent}
      >
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.value}
            onPress={() => setActiveFilter(f.value)}
            style={[
              styles.filterChip,
              { borderColor: theme.border, backgroundColor: theme.surface },
              activeFilter === f.value && { backgroundColor: GOLD, borderColor: GOLD },
            ]}
          >
            <Text style={[
              styles.filterChipText,
              { color: theme.textSecondary },
              activeFilter === f.value && { color: '#fff' },
            ]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={GOLD} size="large" />
          </View>
        ) : history.length === 0 ? (
          <View style={styles.center}>
            <View style={[styles.emptyIconWrap, { backgroundColor: isDark ? 'rgba(201,168,76,0.1)' : 'rgba(15,23,42,0.06)' }]}>
              <Icon name="tray-remove" size={48} color={GOLD} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>Henüz PDF Yok</Text>
            <Text style={[styles.emptySub, { color: theme.textSecondary }]}>İlk PDF'inizi oluşturarak başlayın</Text>
            <TouchableOpacity
              style={[styles.emptyBtn, { backgroundColor: GOLD }]}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.emptyBtnText}>Yeni PDF Oluştur</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.list}>
            {filtered.length === 0 && (
              <View style={styles.center}>
                <Text style={[styles.emptyTitle, { color: theme.text, fontSize: 16 }]}>Kayıt Bulunamadı</Text>
                <Text style={[styles.emptySub, { color: theme.textSecondary }]}>Bu kategoride henüz PDF yok</Text>
              </View>
            )}
            {filtered.map((item, idx) => {
              const color = getCategoryColor(item.category);
              const iconName = getCategoryIcon(item.category);
              const hasFile = !!item.permanentUri;
              const isSharing = sharingId === item.id;

              return (
                <TouchableOpacity
                  key={item.id || idx}
                  activeOpacity={0.85}
                  onPress={() => handleShare(item)}
                  style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                  <View style={[styles.colorBar, { backgroundColor: color }]} />

                  <View style={styles.cardInner}>
                    <View style={styles.cardTop}>
                      <View style={[styles.iconWrap, { backgroundColor: color + '20' }]}>
                        <Icon name={iconName} size={22} color={color} />
                      </View>
                      <View style={styles.cardInfo}>
                        <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={1}>
                          {item.title}
                        </Text>
                        <Text style={[styles.cardMeta, { color: theme.textSecondary }]}>
                          {item.theme} · {item.photoCount} foto
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteBtn}>
                        <Icon name="delete-outline" size={20} color="#EF4444" />
                      </TouchableOpacity>
                    </View>

                    <View style={[styles.cardBottom, { borderTopColor: theme.border }]}>
                      <Text style={[styles.dateText, { color: theme.textSecondary }]}>
                        {formatDate(item.timestamp)}
                      </Text>
                      <TouchableOpacity
                        style={[
                          styles.shareBtn,
                          { backgroundColor: hasFile ? color : theme.surface2, borderColor: hasFile ? color : theme.border },
                        ]}
                        onPress={() => handleShare(item)}
                        disabled={isSharing}
                        activeOpacity={0.8}
                      >
                        {isSharing
                          ? <ActivityIndicator color={hasFile ? '#fff' : theme.textSecondary} size="small" />
                          : <Text style={[styles.shareBtnText, { color: hasFile ? '#fff' : theme.textSecondary }]}>
                              {hasFile ? 'Paylaş' : 'Dosya Yok'}
                            </Text>
                        }
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={{ height: 48 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    paddingBottom: 20, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center',
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '700', color: '#fff', marginLeft: 14 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerCount: {
    fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.85)',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 10, overflow: 'hidden',
  },
  clearBtn: {
    backgroundColor: 'rgba(220,50,50,0.75)',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10,
  },
  clearText: { fontSize: 11, fontWeight: '700', color: '#fff' },

  filterBar: { flexGrow: 0, borderBottomWidth: 1 },
  filterContent: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1,
  },
  filterChipText: { fontSize: 13, fontWeight: '600' },

  scroll: { flex: 1 },

  center: {
    alignItems: 'center', justifyContent: 'center',
    paddingVertical: 80, paddingHorizontal: 40,
  },
  emptyIconWrap: {
    width: 88, height: 88, borderRadius: 44,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  emptyTitle: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  emptySub: { fontSize: 14, textAlign: 'center', marginBottom: 24 },
  emptyBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14 },
  emptyBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },

  list: { padding: 16, gap: 10 },

  card: {
    borderRadius: 16, borderWidth: 1,
    overflow: 'hidden', flexDirection: 'row',
  },
  colorBar: { width: 4 },
  cardInner: { flex: 1, padding: 14 },

  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  iconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', marginBottom: 3 },
  cardMeta: { fontSize: 12 },
  deleteBtn: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },

  cardBottom: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10, borderTopWidth: 1,
  },
  dateText: { fontSize: 12 },
  shareBtn: {
    paddingHorizontal: 16, paddingVertical: 7,
    borderRadius: 10, borderWidth: 1,
    minWidth: 80, alignItems: 'center',
  },
  shareBtnText: { fontSize: 13, fontWeight: '700' },
});
