import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, Alert, TextInput, Modal, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../components/Icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const GOLD = '#C9A84C';
const NAVY = '#0F172A';
const NAVY2 = '#1A2744';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../themes/colors';
import { getAraclar, deleteArac, satisYap } from '../utils/satisStorage';

function today() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
}

function gunHesapla(alis, satis) {
  try {
    const parse = str => { const [g, a, y] = str.split('.'); return new Date(y, a - 1, g); };
    return Math.max(0, Math.round((parse(satis) - parse(alis)) / 86400000));
  } catch { return null; }
}

function muayeneKalan(tarihi) {
  if (!tarihi) return null;
  try {
    const [g, a, y] = tarihi.split('.');
    const exp = new Date(Number(y), Number(a) - 1, Number(g));
    const now = new Date(); now.setHours(0, 0, 0, 0);
    return Math.round((exp - now) / 86400000);
  } catch { return null; }
}

function formatFiyat(value) {
  const digits = value.replace(/\D/g, '');
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function fmtN(n) {
  if (!n) return '—';
  const num = parseFloat(String(n).replace(/\./g, '').replace(',', '.'));
  if (isNaN(num)) return n;
  return num.toLocaleString('tr-TR');
}

function kar(alis, satis) {
  const a = parseFloat(String(alis).replace(/\./g, '').replace(',', '.')) || 0;
  const s = parseFloat(String(satis).replace(/\./g, '').replace(',', '.')) || 0;
  return s - a;
}

export default function SatisTakipScreen({ navigation }) {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  const insets = useSafeAreaInsets();

  const [list, setList]             = useState([]);
  const [tab, setTab]               = useState('stok');
  const [arama, setArama]           = useState('');
  const [satisModal, setSatisModal] = useState(null);
  const [satisFiyat, setSatisFiyat] = useState('');
  const [satisTarihi, setSatisTarihi] = useState(today());

  useFocusEffect(useCallback(() => {
    getAraclar().then(setList);
  }, []));

  const stok    = list.filter(a => !a.satis_tarihi);
  const satildi = list.filter(a => !!a.satis_tarihi);

  const toplamKar  = satildi.reduce((acc, a) => acc + kar(a.alis_fiyat, a.satis_fiyat), 0);
  const toplamAlis = stok.reduce((acc, a) => acc + (parseFloat(String(a.alis_fiyat).replace(/\./g, '').replace(',', '.')) || 0), 0);

  const handleDelete = (arac) => {
    Alert.alert('Sil', `${arac.marka} ${arac.model} silinsin mi?`, [
      { text: 'İptal', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: async () => {
        await deleteArac(arac.id);
        getAraclar().then(setList);
      }},
    ]);
  };

  const handleSatis = async () => {
    if (!satisFiyat.trim()) { Alert.alert('Eksik', 'Satış fiyatı gerekli.'); return; }
    await satisYap(satisModal.id, satisFiyat.trim(), satisTarihi.trim());
    setSatisModal(null);
    setSatisFiyat('');
    setSatisTarihi(today());
    getAraclar().then(setList);
  };

  const havuz = tab === 'stok' ? stok : satildi;
  const shown = arama.trim()
    ? havuz.filter(a => {
        const q = arama.trim().toLowerCase();
        return (
          (a.plaka || '').toLowerCase().includes(q) ||
          (a.marka || '').toLowerCase().includes(q) ||
          (a.model || '').toLowerCase().includes(q)
        );
      })
    : havuz;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <LinearGradient colors={[NAVY, NAVY2]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={18} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Satış Takip</Text>
            <Text style={styles.headerSub}>Araç alım-satım defteri</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AracEkle')}>
            <Text style={styles.addBtnTxt}>+ Araç</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Stokta</Text>
            <Text style={styles.summaryVal}>{stok.length} araç</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Stok Değeri</Text>
            <Text style={styles.summaryVal}>{fmtN(toplamAlis)} ₺</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Toplam Kâr</Text>
            <Text style={[styles.summaryVal, { color: toplamKar >= 0 ? '#6EE7B7' : '#FCA5A5' }]}>
              {toplamKar >= 0 ? '+' : ''}{fmtN(toplamKar)} ₺
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Tab Bar */}
      <View style={[styles.tabBar, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        {[['stok', `Stokta (${stok.length})`], ['satildi', `Satıldı (${satildi.length})`]].map(([key, label]) => (
          <TouchableOpacity key={key} style={styles.tabBtn} onPress={() => setTab(key)}>
            <Text style={[styles.tabTxt, { color: tab === key ? GOLD : theme.textSecondary }]}>{label}</Text>
            {tab === key && <View style={styles.tabLine} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Arama */}
      <View style={[styles.searchWrap, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <Icon name="magnify" size={18} color={theme.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          value={arama}
          onChangeText={setArama}
          placeholder="Plaka, marka veya model ara…"
          placeholderTextColor={theme.textSecondary}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {arama.length > 0 && (
          <TouchableOpacity onPress={() => setArama('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={{ fontSize: 14, color: theme.textSecondary }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {shown.length === 0 ? (
          <View style={styles.empty}>
            <Icon name={tab === 'stok' ? 'car-outline' : 'tag-outline'} size={48} color={GOLD} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              {tab === 'stok' ? 'Stokta araç yok' : 'Henüz satış yok'}
            </Text>
            <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
              {tab === 'stok' ? '+ Araç butonu ile ekleyin' : 'Stok ekleyip satış yapın'}
            </Text>
          </View>
        ) : (
          <View style={styles.listWrap}>
            {shown.map(arac => {
              const gunSayisi = arac.satis_tarihi
                ? gunHesapla(arac.alis_tarihi, arac.satis_tarihi)
                : gunHesapla(arac.alis_tarihi, today());
              const karTutar = arac.satis_fiyat ? kar(arac.alis_fiyat, arac.satis_fiyat) : null;
              const muayeneGun = muayeneKalan(arac.muayene_tarihi);
              const muayeneColor = muayeneGun === null ? null
                : muayeneGun < 0   ? '#ef4444'
                : muayeneGun < 30  ? '#f97316'
                : muayeneGun < 90  ? '#eab308'
                : '#22c55e';
              const muayenePct = muayeneGun === null ? 0
                : Math.max(0, Math.min(100, (muayeneGun / 365) * 100));

              return (
                <View key={arac.id} style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <View style={styles.cardHeader}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <Text style={[styles.cardTitle, { color: theme.text }]}>
                          {arac.marka} {arac.model}{arac.yil ? ` · ${arac.yil}` : ''}
                        </Text>
                        {arac.plaka ? (
                          <View style={styles.plakaBadge}>
                            <Text style={styles.plakaTxt}>{arac.plaka}</Text>
                          </View>
                        ) : null}
                      </View>
                      <Text style={[styles.cardSub, { color: theme.textSecondary }]}>
                        {arac.renk ? `${arac.renk} · ` : ''}{arac.km ? `${fmtN(arac.km)} km · ` : ''}{gunSayisi != null ? `${gunSayisi} gün` : ''}
                      </Text>
                      {arac.boyali_parcalar && Object.keys(arac.boyali_parcalar).length > 0 && (
                        <Text style={styles.boyaliBadge}>
                          🎨 {Object.keys(arac.boyali_parcalar).length} panel işaretli
                        </Text>
                      )}
                    </View>
                    {karTutar !== null && (
                      <View style={[styles.karBadge, { backgroundColor: karTutar >= 0 ? '#D1FAE5' : '#FEE2E2' }]}>
                        <Text style={[styles.karTxt, { color: karTutar >= 0 ? '#065F46' : '#991B1B' }]}>
                          {karTutar >= 0 ? '+' : ''}{fmtN(karTutar)} ₺
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Muayene bar */}
                  {muayeneGun !== null && (
                    <View style={[styles.muayeneWrap, { borderTopColor: theme.border }]}>
                      <View style={styles.muayeneRow}>
                        <Text style={[styles.muayeneLabel, { color: theme.textSecondary }]}>Muayene</Text>
                        <Text style={[styles.muayeneVal, { color: muayeneColor }]}>
                          {muayeneGun < 0
                            ? `${Math.abs(muayeneGun)} gün GECIKTI`
                            : `${muayeneGun} gün kaldı`}
                        </Text>
                        <Text style={[styles.muayeneTarih, { color: theme.textSecondary }]}>{arac.muayene_tarihi}</Text>
                      </View>
                      <View style={[styles.muayeneTrack, { backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)' }]}>
                        <View style={[styles.muayeneFill, { width: `${muayenePct}%`, backgroundColor: muayeneColor }]} />
                      </View>
                    </View>
                  )}

                  <View style={[styles.cardPrices, { borderTopColor: theme.border }]}>
                    <View style={styles.priceItem}>
                      <Text style={[styles.priceLabel, { color: theme.textSecondary }]}>Alış</Text>
                      <Text style={[styles.priceVal, { color: theme.text }]}>{fmtN(arac.alis_fiyat)} ₺</Text>
                      <Text style={[styles.priceDate, { color: theme.textSecondary }]}>{arac.alis_tarihi}</Text>
                    </View>
                    {arac.satis_fiyat ? (
                      <View style={styles.priceItem}>
                        <Text style={[styles.priceLabel, { color: theme.textSecondary }]}>Satış</Text>
                        <Text style={[styles.priceVal, { color: GOLD }]}>{fmtN(arac.satis_fiyat)} ₺</Text>
                        <Text style={[styles.priceDate, { color: theme.textSecondary }]}>{arac.satis_tarihi}</Text>
                      </View>
                    ) : null}
                  </View>

                  {arac.notlar ? (
                    <Text style={[styles.cardNot, { color: theme.textSecondary, borderTopColor: theme.border }]}>{arac.notlar}</Text>
                  ) : null}

                  <View style={[styles.cardActions, { borderTopColor: theme.border }]}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('AracEkle', { arac })}>
                      <Text style={[styles.actionTxt, { color: theme.textSecondary }]}>Düzenle</Text>
                    </TouchableOpacity>
                    {!arac.satis_tarihi && (
                      <TouchableOpacity style={styles.actionBtn} onPress={() => { setSatisModal(arac); setSatisFiyat(''); setSatisTarihi(today()); }}>
                        <Text style={[styles.actionTxt, { color: GOLD }]}>Satıldı Olarak İşaretle</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(arac)}>
                      <Text style={[styles.actionTxt, { color: '#E05555' }]}>Sil</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Satış Modal */}
      <Modal visible={!!satisModal} transparent animationType="slide" onRequestClose={() => setSatisModal(null)}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={[styles.modalSheet, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {satisModal?.marka} {satisModal?.model} — Satış Kaydı
            </Text>
            <Text style={[styles.modalLabel, { color: theme.textSecondary }]}>SATIŞ FİYATI (₺)</Text>
            <TextInput
              style={[styles.modalInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface2 }]}
              value={satisFiyat}
              onChangeText={v => setSatisFiyat(formatFiyat(v))}
              placeholder="950.000"
              keyboardType="numeric"
              placeholderTextColor={theme.textSecondary}
              autoFocus
            />
            <Text style={[styles.modalLabel, { color: theme.textSecondary, marginTop: 12 }]}>SATIŞ TARİHİ</Text>
            <TextInput
              style={[styles.modalInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface2 }]}
              value={satisTarihi}
              onChangeText={setSatisTarihi}
              placeholder="GG.AA.YYYY"
              placeholderTextColor={theme.textSecondary}
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity style={[styles.modalCancel, { borderColor: theme.border }]} onPress={() => setSatisModal(null)}>
                <Text style={[styles.modalCancelTxt, { color: theme.text }]}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirm} onPress={handleSatis}>
                <Text style={styles.modalConfirmTxt}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: { paddingHorizontal: 16, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  backBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  backBtnTxt: { color: '#fff', fontSize: 16 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: -0.5 },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },
  addBtn: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  addBtnTxt: { color: '#fff', fontSize: 13, fontWeight: '700' },

  summaryRow: { flexDirection: 'row' },
  summaryItem: { flex: 1, alignItems: 'center', gap: 3 },
  summaryLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 9, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' },
  summaryVal: { color: '#fff', fontSize: 13, fontWeight: '700' },

  tabBar: { flexDirection: 'row', borderBottomWidth: 1 },
  tabBtn: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  tabTxt: { fontSize: 13, fontWeight: '600' },
  tabLine: { position: 'absolute', bottom: 0, left: '20%', right: '20%', height: 2, backgroundColor: GOLD, borderRadius: 2 },

  scroll: { flex: 1 },
  listWrap: { padding: 16, gap: 12 },

  empty: { alignItems: 'center', paddingTop: 80, gap: 8 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 16, fontWeight: '700' },
  emptySub: { fontSize: 13 },

  card: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', padding: 14, gap: 10 },
  cardTitle: { fontSize: 15, fontWeight: '700', letterSpacing: -0.3 },
  cardSub: { fontSize: 12, marginTop: 3 },
  boyaliBadge: { fontSize: 11, color: GOLD, marginTop: 3, fontWeight: '600' },
  karBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  karTxt: { fontSize: 12, fontWeight: '800' },

  muayeneWrap: { paddingHorizontal: 14, paddingTop: 10, paddingBottom: 10, borderTopWidth: 1, gap: 6 },
  muayeneRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  muayeneLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', width: 56 },
  muayeneVal: { fontSize: 11, fontWeight: '700', flex: 1 },
  muayeneTarih: { fontSize: 10 },
  muayeneTrack: { height: 5, borderRadius: 99, overflow: 'hidden' },
  muayeneFill: { height: '100%', borderRadius: 99 },

  cardPrices: { flexDirection: 'row', borderTopWidth: 1, paddingHorizontal: 14, paddingVertical: 10, gap: 20 },
  priceItem: { gap: 2 },
  priceLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },
  priceVal: { fontSize: 14, fontWeight: '700' },
  priceDate: { fontSize: 11 },

  cardNot: { fontSize: 12, paddingHorizontal: 14, paddingVertical: 8, borderTopWidth: 1, fontStyle: 'italic' },

  cardActions: { flexDirection: 'row', borderTopWidth: 1, paddingHorizontal: 14, paddingVertical: 10, gap: 16 },
  actionBtn: { paddingVertical: 2 },
  actionTxt: { fontSize: 12, fontWeight: '600' },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 14, paddingVertical: 4 },

  plakaBadge: {
    backgroundColor: '#1e3a8a', borderRadius: 5,
    paddingHorizontal: 7, paddingVertical: 2,
  },
  plakaTxt: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, gap: 8 },
  modalTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  modalLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 1, marginBottom: 4 },
  modalInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 12, fontSize: 15 },
  modalBtns: { flexDirection: 'row', gap: 10, marginTop: 16 },
  modalCancel: { flex: 1, borderWidth: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  modalCancelTxt: { fontSize: 14, fontWeight: '600' },
  modalConfirm: { flex: 2, backgroundColor: GOLD, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  modalConfirmTxt: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
