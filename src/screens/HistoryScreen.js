import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, StatusBar, Alert, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Sharing from 'expo-sharing';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../themes/colors';
import { getPDFHistory, deletePDFFromHistory, clearAllHistory } from '../utils/analytics';
import { pdfFileExists, deletePDFFile } from '../utils/pdfStorage';

export default function HistoryScreen({ navigation }) {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sharingId, setSharingId] = useState(null);

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
            for (const item of history) {
              await deletePDFFile(item.permanentUri);
            }
            await clearAllHistory();
            setHistory([]);
          },
        },
      ]
    );
  };

  const getCategoryEmoji = (cat) => {
    const map = { 'Araç Galerisi': '🚗', 'Emlak': '🏠', 'Ofis / Kurumsal': '💼', 'Kişisel / CV': '👤', 'Diğer': '📄' };
    return map[cat] || '📄';
  };

  const getCategoryColor = (cat) => {
    const map = { 'Araç Galerisi': '#E05555', 'Emlak': '#3DBA7C', 'Ofis / Kurumsal': '#4F6EF7', 'Kişisel / CV': '#9B6EF7' };
    return map[cat] || '#888';
  };

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
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.bg} />

      {/* Header */}
      <LinearGradient
        colors={theme.heroGradient}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PDF Geçmişi</Text>
        <View style={styles.headerRight}>
          <Text style={[styles.headerCount, { color: theme.blueLight }]}>{history.length} PDF</Text>
          {history.length > 0 && (
            <TouchableOpacity onPress={handleClearAll} style={styles.clearBtn}>
              <Text style={styles.clearText}>Tümünü Sil</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={theme.blue} size="large" />
          </View>
        ) : history.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>Henüz PDF Yok</Text>
            <Text style={[styles.emptySub, { color: theme.textSecondary }]}>İlk PDF'inizi oluşturarak başlayın</Text>
            <TouchableOpacity
              style={[styles.emptyBtn, { backgroundColor: theme.blue }]}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.emptyBtnText}>Yeni PDF Oluştur</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.list}>
            {history.map((item, idx) => {
              const color = getCategoryColor(item.category);
              const hasFile = !!item.permanentUri;
              const isSharing = sharingId === item.id;

              return (
                <View key={item.id || idx} style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  {/* Sol renk çizgisi */}
                  <View style={[styles.colorBar, { backgroundColor: color }]} />

                  <View style={styles.cardInner}>
                    {/* Üst satır */}
                    <View style={styles.cardTop}>
                      <View style={[styles.iconWrap, { backgroundColor: color + '20' }]}>
                        <Text style={styles.iconEmoji}>{getCategoryEmoji(item.category)}</Text>
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
                        <Text style={styles.deleteIcon}>🗑️</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Alt satır */}
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
                              {hasFile ? '↑ Paylaş' : 'Dosya Yok'}
                            </Text>
                        }
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
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
    paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  backText: { fontSize: 22, color: '#fff' },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '700', color: '#fff', marginLeft: 14 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerCount: {
    fontSize: 12, fontWeight: '600',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 10, overflow: 'hidden',
  },
  clearBtn: {
    backgroundColor: 'rgba(220,50,50,0.75)',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10,
  },
  clearText: { fontSize: 11, fontWeight: '700', color: '#fff' },

  scroll: { flex: 1 },

  center: {
    alignItems: 'center', justifyContent: 'center',
    paddingVertical: 80, paddingHorizontal: 40,
  },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
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
  iconEmoji: { fontSize: 22 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', marginBottom: 3 },
  cardMeta: { fontSize: 12 },
  deleteBtn: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  deleteIcon: { fontSize: 16 },

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
