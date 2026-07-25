import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList,
  TextInput, StatusBar, Alert, ActivityIndicator, Modal,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import { usePremium } from '../context/PremiumContext';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../themes/colors';
import { getAllServisKartlari, deleteServisKarti, searchByPlaka } from '../utils/servisStorage';
import { buildServisKartiHTML } from '../pdf/servisKartiBuilder';
import * as Print from 'expo-print';
import * as ImageManipulator from 'expo-image-manipulator';
import { savePDFPermanently } from '../utils/pdfStorage';
import supabase from '../utils/supabaseClient';

function cloudToLocal(k) {
  let tarih = '';
  if (k.tarih) {
    const d = new Date(k.tarih);
    tarih = `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
  }
  return {
    id: k.id,
    plaka: k.plaka || '',
    tarih,
    timestamp: new Date(k.created_at).getTime(),
    make: k.marka || '',
    model: k.model || '',
    year: k.yil || '',
    fuel: k.yakit || '',
    color: k.renk || '',
    kmNow: k.km || '',
    kmNext: k.km_sonraki || '',
    shop: k.garaj_adi || '',
    addr: k.garaj_adres || '',
    done: k.yapilan_islemler || '',
    parts: k.degistirilen_parcalar || '',
    suggest: k.onerilenler || '',
    note: k.notlar || '',
    phone: k.telefon || '',
    logoUri: null,
    pdfUri: null,
  };
}

export default function ServisGecmisScreen({ navigation }) {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  const insets = useSafeAreaInsets();
  const { gate } = usePremium();

  // Benim Kayıtlarım state
  const [list, setList] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [previewItem, setPreviewItem] = useState(null);
  const [previewHtml, setPreviewHtml] = useState('');
  const [webLoaded, setWebLoaded] = useState(false);
  const [working, setWorking] = useState(false);

  // Plaka Sorgula state
  const [activeTab, setActiveTab] = useState('mine');
  const [plakaQuery, setPlakaQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadAll();
    }, [])
  );

  const loadAll = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('servis_kayitlari')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(100);
        if (!error && data) {
          setList(data.map(cloudToLocal));
          setLoading(false);
          return;
        }
      }
    } catch {}
    const all = await getAllServisKartlari();
    setList(all);
    setLoading(false);
  };

  const handleSearch = async (text) => {
    setQuery(text);
    if (!text.trim()) {
      await loadAll();
      return;
    }
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('servis_kayitlari')
          .select('*')
          .eq('user_id', user.id)
          .ilike('plaka', `%${text.trim().toUpperCase()}%`)
          .order('created_at', { ascending: false })
          .limit(20);
        if (!error && data) {
          setList(data.map(cloudToLocal));
          return;
        }
      }
    } catch {}
    const results = await searchByPlaka(text);
    setList(results);
  };

  const searchPublic = async (text) => {
    if (!text.trim()) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    try {
      const { data, error } = await supabase
        .from('servis_kayitlari')
        .select('*')
        .ilike('plaka', `%${text.trim().toUpperCase()}%`)
        .order('created_at', { ascending: false })
        .limit(30);
      setSearchResults(!error && data ? data : []);
    } catch {
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const logoToBase64 = async (uri) => {
    try {
      const info = await FileSystem.getInfoAsync(uri);
      if (!info.exists) return null;
      const compressed = await ImageManipulator.manipulateAsync(
        uri, [{ resize: { width: 300 } }],
        { compress: 0.85, format: ImageManipulator.SaveFormat.PNG }
      );
      const b64 = await FileSystem.readAsStringAsync(compressed.uri, { encoding: 'base64' });
      return `data:image/png;base64,${b64}`;
    } catch {
      return null;
    }
  };

  const openPreview = async (item) => {
    setWorking(true);
    try {
      let logoBase64 = null;
      if (item.logoUri) logoBase64 = await logoToBase64(item.logoUri);
      const html = buildServisKartiHTML({ ...item, logoBase64 });
      setPreviewHtml(html);
      setWebLoaded(false);
      setPreviewItem(item);
    } catch {
      Alert.alert('Hata', 'Önizleme açılamadı.');
    } finally {
      setWorking(false);
    }
  };

  const handleShare = async (item) => {
    if (!(await gate())) return;
    if (item.pdfUri) {
      try {
        const info = await FileSystem.getInfoAsync(item.pdfUri);
        if (info.exists) {
          const can = await Sharing.isAvailableAsync();
          if (can) {
            await Sharing.shareAsync(item.pdfUri, { mimeType: 'application/pdf', dialogTitle: 'Servis Bakım Kartı' });
            return;
          }
        }
      } catch {}
    }
    setWorking(true);
    try {
      let logoBase64 = null;
      if (item.logoUri) logoBase64 = await logoToBase64(item.logoUri);
      const rawHtml = buildServisKartiHTML({ ...item, logoBase64 });
      const html = rawHtml.replace(/<link[^>]*googleapis\.com[^>]*>/g, '');
      const { uri } = await Print.printToFileAsync({ html, width: 595, height: 842 });
      const title = `Servis_${(item.plaka || 'Kart').replace(/\s/g, '_')}_${item.tarih.replace(/\./g, '')}`;
      const perm = await savePDFPermanently(uri, title);
      const can = await Sharing.isAvailableAsync();
      if (can) await Sharing.shareAsync(perm || uri, { mimeType: 'application/pdf', dialogTitle: 'Servis Bakım Kartı' });
    } catch {
      Alert.alert('Hata', 'PDF oluşturulamadı.');
    } finally {
      setWorking(false);
    }
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Kaydı Sil',
      `${item.plaka} plakalı aracın bakım kaydı silinecek. Emin misin?`,
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Sil', style: 'destructive', onPress: async () => {
            try {
              const { data: { user } } = await supabase.auth.getUser();
              if (user) {
                await supabase.from('servis_kayitlari').delete().eq('id', item.id).eq('user_id', user.id);
              } else {
                await deleteServisKarti(item.id);
              }
            } catch {
              await deleteServisKarti(item.id);
            }
            await loadAll();
          },
        },
      ]
    );
  };

  const bg = isDark ? '#0d0f14' : '#F9FAFB';
  const surface = isDark ? '#161a23' : '#fff';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const accent = '#FF8C1E';
  const gold = '#C9A84C';

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: surface, borderColor: border }]}
      onPress={() => openPreview(item)}
      activeOpacity={0.75}
    >
      <View style={[styles.cardBar, { backgroundColor: accent }]} />
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <View style={[styles.plateBadge, { backgroundColor: '#E8C020' }]}>
            <Text style={styles.plateTxt}>{item.plaka || '—'}</Text>
          </View>
          <Text style={[styles.cardDate, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
            {item.tarih}
          </Text>
        </View>
        <Text style={[styles.cardMakeModel, { color: theme.text }]}>
          {[item.make, item.model, item.year].filter(Boolean).join(' · ') || 'Araç bilgisi yok'}
        </Text>
        {item.shop ? <Text style={[styles.cardShop, { color: accent }]}>{item.shop}</Text> : null}
        {item.kmNow ? (
          <Text style={[styles.cardKm, { color: isDark ? '#6b7280' : '#9ca3af' }]}>
            {item.kmNow} km'de bakım yapıldı
          </Text>
        ) : null}
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: 'rgba(255,140,30,0.12)', borderColor: accent + '55' }]}
          onPress={() => handleShare(item)}
        >
          <Text style={[styles.actionBtnTxt, { color: accent }]}>↑</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: 'rgba(220,38,38,0.1)', borderColor: 'rgba(220,38,38,0.4)' }]}
          onPress={() => handleDelete(item)}
        >
          <Text style={[styles.actionBtnTxt, { color: '#dc2626' }]}>🗑</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderPublicItem = ({ item, index }) => {
    let tarih = '';
    if (item.tarih) {
      const d = new Date(item.tarih);
      tarih = `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
    }
    const isLatest = index === 0;
    const km = item.km ? parseInt(item.km).toLocaleString('tr-TR') : null;

    return (
      <View style={[styles.pubCard, { backgroundColor: surface, borderColor: isLatest ? gold + '55' : border }]}>
        <View style={[styles.pubCardBar, { backgroundColor: isLatest ? gold : border }]} />
        <View style={styles.pubCardBody}>
          <View style={styles.pubCardTop}>
            <View style={[styles.plateBadge, { backgroundColor: '#E8C020' }]}>
              <Text style={styles.plateTxt}>{item.plaka || '—'}</Text>
            </View>
            {isLatest && (
              <View style={styles.latestBadge}>
                <Text style={styles.latestBadgeTxt}>SON BAKIM</Text>
              </View>
            )}
            <Text style={[styles.cardDate, { color: isDark ? '#9ca3af' : '#6b7280', marginLeft: 'auto' }]}>
              {tarih}
            </Text>
          </View>

          {item.garaj_adi ? (
            <Text style={[styles.pubGaraj, { color: gold }]}>🔧  {item.garaj_adi}</Text>
          ) : null}

          {km ? (
            <Text style={[styles.pubKm, { color: isDark ? '#6b7280' : '#9ca3af' }]}>
              {km} km'de bakım yapıldı
            </Text>
          ) : null}

          {item.yapilan_islemler ? (
            <Text style={[styles.pubDetail, { color: isDark ? '#d1d5db' : '#374151' }]} numberOfLines={3}>
              {item.yapilan_islemler}
            </Text>
          ) : null}

          {item.degistirilen_parcalar ? (
            <Text style={[styles.pubParts, { color: isDark ? '#9ca3af' : '#6b7280' }]} numberOfLines={2}>
              🔩  {item.degistirilen_parcalar}
            </Text>
          ) : null}

          {item.sasi_no ? (
            <Text style={[styles.pubParts, { color: isDark ? '#4b5563' : '#9ca3af' }]}>
              Şasi: {'*'.repeat(Math.max(0, item.sasi_no.length - 3))}{item.sasi_no.slice(-3)}
            </Text>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bg} />

      {/* Nav */}
      <View style={[styles.nav, { borderBottomColor: border, paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: isDark ? '#1e2330' : '#f3f4f6', borderColor: border }]}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={18} color={theme.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.navTitle, { color: theme.text }]}>Servis Geçmişi</Text>
        </View>
        <TouchableOpacity
          style={[styles.newBtn, { backgroundColor: accent + '18', borderColor: accent + '55' }]}
          onPress={() => navigation.navigate('ServisForm')}
        >
          <Text style={[styles.newBtnTxt, { color: accent }]}>+ Yeni</Text>
        </TouchableOpacity>
      </View>

      {/* Sekmeler */}
      <View style={[styles.tabBar, { borderBottomColor: border, backgroundColor: bg }]}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'mine' && { borderBottomColor: accent }]}
          onPress={() => setActiveTab('mine')}
        >
          <Text style={[styles.tabBtnTxt, { color: activeTab === 'mine' ? accent : (isDark ? '#6b7280' : '#9ca3af') }]}>
            Benim Kayıtlarım
          </Text>
          {list.length > 0 && activeTab === 'mine' && (
            <View style={[styles.tabCount, { backgroundColor: accent + '22' }]}>
              <Text style={[styles.tabCountTxt, { color: accent }]}>{list.length}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'search' && { borderBottomColor: gold }]}
          onPress={() => setActiveTab('search')}
        >
          <Text style={[styles.tabBtnTxt, { color: activeTab === 'search' ? gold : (isDark ? '#6b7280' : '#9ca3af') }]}>
            Plaka Sorgula
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── BENİM KAYITLARIM ── */}
      {activeTab === 'mine' && (
        <>
          <View style={[styles.searchWrap, { borderBottomColor: border }]}>
            <View style={[styles.searchBox, { backgroundColor: surface, borderColor: border }]}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={[styles.searchInput, { color: theme.text }]}
                placeholder="Plaka ile ara… (örn: 26 ABC)"
                placeholderTextColor={isDark ? '#4b5563' : '#9ca3af'}
                value={query}
                onChangeText={handleSearch}
                autoCapitalize="characters"
              />
              {query.length > 0 && (
                <TouchableOpacity onPress={() => handleSearch('')}>
                  <Text style={{ color: isDark ? '#6b7280' : '#9ca3af', fontSize: 16 }}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator color={accent} size="large" />
            </View>
          ) : list.length === 0 ? (
            <View style={styles.center}>
              <Text style={{ fontSize: 40 }}>🔧</Text>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                {query ? 'Sonuç bulunamadı' : 'Henüz kayıt yok'}
              </Text>
              <Text style={[styles.emptyDesc, { color: isDark ? '#6b7280' : '#9ca3af' }]}>
                {query
                  ? `"${query}" plakalı araç kaydı bulunamadı`
                  : 'Servis bakım kartı oluşturmak için + Yeni butonuna bas'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={list}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}

      {/* ── PLAKA SORGULA ── */}
      {activeTab === 'search' && (
        <>
          <View style={[styles.pubSearchWrap, { borderBottomColor: border }]}>
            <View style={styles.pubSearchRow}>
              <TextInput
                style={[styles.pubSearchInput, { backgroundColor: surface, borderColor: border, color: theme.text }]}
                placeholder="26 ABC 123"
                placeholderTextColor={isDark ? '#4b5563' : '#9ca3af'}
                value={plakaQuery}
                onChangeText={setPlakaQuery}
                autoCapitalize="characters"
                returnKeyType="search"
                onSubmitEditing={() => searchPublic(plakaQuery)}
              />
              <TouchableOpacity
                style={[styles.pubSearchBtn, { backgroundColor: gold }]}
                onPress={() => searchPublic(plakaQuery)}
                activeOpacity={0.8}
              >
                <Text style={styles.pubSearchBtnTxt}>Ara</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.pubSearchHint, { color: isDark ? '#4b5563' : '#9ca3af' }]}>
              Tüm garajların kayıtlarında arama yapılır
            </Text>
          </View>

          {searchLoading ? (
            <View style={styles.center}>
              <ActivityIndicator color={gold} size="large" />
              <Text style={[styles.emptyDesc, { color: isDark ? '#6b7280' : '#9ca3af', marginTop: 12 }]}>
                Sorgulanıyor…
              </Text>
            </View>
          ) : searchResults.length === 0 && plakaQuery.trim() ? (
            <View style={styles.center}>
              <Text style={{ fontSize: 40 }}>🔍</Text>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>Kayıt bulunamadı</Text>
              <Text style={[styles.emptyDesc, { color: isDark ? '#6b7280' : '#9ca3af' }]}>
                {plakaQuery.toUpperCase()} için henüz servis kaydı yok
              </Text>
            </View>
          ) : searchResults.length === 0 ? (
            <View style={styles.center}>
              <Text style={{ fontSize: 48, marginBottom: 16 }}>🔎</Text>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>Plaka ile sorgula</Text>
              <Text style={[styles.emptyDesc, { color: isDark ? '#6b7280' : '#9ca3af' }]}>
                Herhangi bir garajın kaydettiği{'\n'}bakım geçmişini görebilirsiniz
              </Text>
            </View>
          ) : (
            <FlatList
              data={searchResults}
              keyExtractor={item => item.id}
              renderItem={renderPublicItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}

      {working && (
        <View style={styles.overlay}>
          <ActivityIndicator color={accent} size="large" />
          <Text style={styles.overlayTxt}>İşleniyor…</Text>
        </View>
      )}

      {/* Önizleme Modal */}
      <Modal
        visible={!!previewItem}
        animationType="slide"
        onRequestClose={() => setPreviewItem(null)}
      >
        <View style={[styles.modalContainer, { backgroundColor: '#0A0C10' }]}>
          <View style={styles.modalNav}>
            <TouchableOpacity style={styles.modalClose} onPress={() => setPreviewItem(null)}>
              <Text style={styles.modalCloseTxt}>✕</Text>
            </TouchableOpacity>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.modalNavTitle}>{previewItem?.plaka || '—'}</Text>
              <Text style={styles.modalNavSub}>{previewItem?.tarih}</Text>
            </View>
            <TouchableOpacity
              style={[styles.modalShareBtn, { borderColor: accent + '55', backgroundColor: accent + '15' }]}
              onPress={() => previewItem && handleShare(previewItem)}
            >
              <Text style={[styles.modalShareTxt, { color: accent }]}>↑ PDF</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1 }}>
            {!webLoaded && (
              <View style={styles.webLoading}>
                <ActivityIndicator color={accent} size="large" />
                <Text style={styles.webLoadingTxt}>Kart yükleniyor…</Text>
              </View>
            )}
            <WebView
              source={{ html: previewHtml }}
              style={{ flex: 1, opacity: webLoaded ? 1 : 0 }}
              onLoad={() => setWebLoaded(true)}
              scrollEnabled
              originWhitelist={['*']}
              javaScriptEnabled
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  nav: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 14,
    borderBottomWidth: 1,
  },
  navBtn: {
    width: 36, height: 36, borderRadius: 10, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  navBtnTxt: { fontSize: 16 },
  navTitle: { fontSize: 16, fontWeight: '700', letterSpacing: -0.3 },
  newBtn: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 9, borderWidth: 1,
  },
  newBtnTxt: { fontSize: 13, fontWeight: '700' },

  // Sekmeler
  tabBar: {
    flexDirection: 'row', borderBottomWidth: 1,
    paddingHorizontal: 16,
  },
  tabBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 12,
    borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  tabBtnTxt: { fontSize: 13, fontWeight: '700', letterSpacing: 0.2 },
  tabCount: {
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10,
  },
  tabCountTxt: { fontSize: 10, fontWeight: '700' },

  // My records search
  searchWrap: { paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 14, letterSpacing: 1 },

  // Public search
  pubSearchWrap: {
    paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10, borderBottomWidth: 1,
  },
  pubSearchRow: { flexDirection: 'row', gap: 10 },
  pubSearchInput: {
    flex: 1, borderWidth: 1, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 11,
    fontSize: 16, fontWeight: '600', letterSpacing: 2,
  },
  pubSearchBtn: {
    paddingHorizontal: 20, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  pubSearchBtnTxt: { fontSize: 14, fontWeight: '700', color: '#060810' },
  pubSearchHint: { fontSize: 11, marginTop: 6 },

  listContent: { padding: 16, gap: 10 },

  // My records card
  card: {
    borderRadius: 14, borderWidth: 1, overflow: 'hidden',
    flexDirection: 'row', alignItems: 'stretch',
  },
  cardBar: { width: 4 },
  cardBody: { flex: 1, padding: 14, gap: 3 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 2 },
  plateBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 3 },
  plateTxt: { fontWeight: '800', fontSize: 13, color: '#0E1218', letterSpacing: 2 },
  cardDate: { fontSize: 11, fontWeight: '500' },
  cardMakeModel: { fontSize: 14, fontWeight: '600' },
  cardShop: { fontSize: 12 },
  cardKm: { fontSize: 11 },
  cardActions: { justifyContent: 'center', gap: 6, paddingRight: 10, paddingLeft: 4 },
  actionBtn: {
    width: 34, height: 34, borderRadius: 8, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  actionBtnTxt: { fontSize: 15 },

  // Public search card
  pubCard: {
    borderRadius: 14, borderWidth: 1, overflow: 'hidden',
    flexDirection: 'row', alignItems: 'stretch',
  },
  pubCardBar: { width: 4 },
  pubCardBody: { flex: 1, padding: 14, gap: 5 },
  pubCardTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2, flexWrap: 'wrap' },
  latestBadge: {
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 100,
    backgroundColor: 'rgba(201,168,76,0.15)', borderWidth: 1, borderColor: 'rgba(201,168,76,0.4)',
  },
  latestBadgeTxt: { fontSize: 9, fontWeight: '700', color: '#C9A84C', letterSpacing: 1 },
  pubGaraj: { fontSize: 14, fontWeight: '700' },
  pubKm: { fontSize: 11 },
  pubDetail: { fontSize: 13, lineHeight: 18 },
  pubParts: { fontSize: 11, lineHeight: 16 },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 40 },
  emptyTitle: { fontSize: 16, fontWeight: '700' },
  emptyDesc: { fontSize: 13, textAlign: 'center', lineHeight: 20 },

  overlay: {
    position: 'absolute', inset: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center', justifyContent: 'center', gap: 14,
  },
  overlayTxt: { color: '#FF8C1E', fontSize: 14, letterSpacing: 0.5 },

  modalContainer: { flex: 1 },
  modalNav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,140,30,0.2)',
  },
  modalClose: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  modalCloseTxt: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  modalNavTitle: { fontSize: 14, fontWeight: '800', color: '#E8C020', letterSpacing: 2 },
  modalNavSub: { fontSize: 10, color: 'rgba(255,140,30,0.6)', letterSpacing: 0.5 },
  modalShareBtn: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1,
  },
  modalShareTxt: { fontSize: 12, fontWeight: '700' },
  webLoading: {
    position: 'absolute', inset: 0,
    alignItems: 'center', justifyContent: 'center', gap: 12, zIndex: 10,
    backgroundColor: '#0A0C10',
  },
  webLoadingTxt: { color: 'rgba(255,140,30,0.7)', fontSize: 13, letterSpacing: 0.5 },
});
