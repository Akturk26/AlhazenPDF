import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  FlatList, StatusBar, ActivityIndicator, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../themes/colors';
import supabase from '../utils/supabaseClient';

const gold = '#C9A84C';

function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
}

function DetailRow({ label, value, color }) {
  if (!value) return null;
  return (
    <View style={dt.row}>
      <Text style={dt.label}>{label}</Text>
      <Text style={[dt.value, color && { color }]}>{value}</Text>
    </View>
  );
}

function Section({ title, children, hasContent }) {
  if (!hasContent) return null;
  return (
    <View style={dt.section}>
      <Text style={dt.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function ServisKarti({ item, index, isDark, expanded, onToggle }) {
  const surface  = isDark ? '#161a23' : '#fff';
  const border   = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const textPri  = isDark ? '#f3f4f6' : '#111827';
  const textSec  = isDark ? '#9ca3af' : '#6b7280';
  const textMuted= isDark ? '#4b5563' : '#9ca3af';
  const isLatest = index === 0;

  const km        = item.km ? parseInt(item.km).toLocaleString('tr-TR') : null;
  const kmSonraki = item.km_sonraki ? parseInt(item.km_sonraki).toLocaleString('tr-TR') : null;
  const tarih     = fmtDate(item.tarih);

  const vehicleInfo = [
    item.marka && item.model && `${item.marka} ${item.model}${item.year ? ` (${item.year})` : ''}`,
    item.renk,
    item.yakit,
    item.gear,
  ].filter(Boolean).join(' · ');

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: surface, borderColor: isLatest ? gold + '66' : border }]}
      onPress={onToggle}
      activeOpacity={0.92}
    >
      <View style={[styles.cardBar, { backgroundColor: isLatest ? gold : (isDark ? '#2a2d3a' : '#e5e7eb') }]} />
      <View style={styles.cardBody}>

        {/* ── Başlık satırı ── */}
        <View style={styles.cardTop}>
          <View style={styles.plateBadge}>
            <Text style={styles.plateTxt}>{item.plaka || '—'}</Text>
          </View>
          {isLatest && (
            <View style={styles.latestBadge}>
              <Text style={styles.latestTxt}>SON BAKIM</Text>
            </View>
          )}
          <Text style={[styles.cardDate, { color: textSec, marginLeft: 'auto' }]}>{tarih}</Text>
        </View>

        {/* ── Garaj + km ── */}
        {item.garaj_adi ? <Text style={[styles.cardGaraj, { color: gold }]}>🔧  {item.garaj_adi}</Text> : null}
        {km ? <Text style={[styles.cardKm, { color: textMuted }]}>{km} km'de bakım yapıldı</Text> : null}

        {/* ── Yapılan işlemler (compact: 2 satır, expanded: tam) ── */}
        {item.yapilan_islemler ? (
          <Text style={[styles.cardDetail, { color: textPri }]} numberOfLines={expanded ? undefined : 2}>
            {item.yapilan_islemler}
          </Text>
        ) : null}

        {/* ── EXPANDED detaylar ── */}
        {expanded && (
          <View style={[styles.expandedWrap, { borderTopColor: border }]}>

            <Section title="DEĞİŞTİRİLEN PARÇALAR" hasContent={!!item.degistirilen_parcalar}>
              <Text style={[dt.blockTxt, { color: textSec }]}>🔩  {item.degistirilen_parcalar}</Text>
            </Section>

            <Section title="ÖNERİLENLER" hasContent={!!item.onerilenler}>
              <Text style={[dt.blockTxt, { color: textSec }]}>💡  {item.onerilenler}</Text>
            </Section>

            <Section title="NOTLAR" hasContent={!!item.notlar}>
              <Text style={[dt.blockTxt, { color: textSec }]}>{item.notlar}</Text>
            </Section>

            <Section title="ARAÇ BİLGİSİ" hasContent={!!vehicleInfo}>
              <Text style={[dt.blockTxt, { color: textSec }]}>{vehicleInfo}</Text>
            </Section>

            <Section title="SERVİS BİLGİSİ" hasContent={!!(kmSonraki || item.garaj_adres || item.telefon)}>
              <DetailRow label="Sonraki bakım" value={kmSonraki ? `${kmSonraki} km` : null} color={gold} />
              <DetailRow label="Adres" value={item.garaj_adres} color={textSec} />
              <DetailRow label="Telefon" value={item.telefon} color={textSec} />
            </Section>

            {item.sasi_no ? (
              <Text style={[styles.sasiTxt, { color: textMuted }]}>
                Şasi No: {item.sasi_no}
              </Text>
            ) : null}

          </View>
        )}

        {/* ── Compact'ta parçalar özeti ── */}
        {!expanded && item.degistirilen_parcalar ? (
          <Text style={[styles.cardParts, { color: textSec }]} numberOfLines={1}>
            🔩  {item.degistirilen_parcalar}
          </Text>
        ) : null}

        {/* ── Footer: toggle butonu ── */}
        <View style={[styles.cardFooterRow, { borderTopColor: border }]}>
          <Text style={[styles.cardFooterBrand, { color: textMuted }]}>AlhazenPDF · Teknik Servis</Text>
          <View style={[styles.togglePill, { backgroundColor: isDark ? '#1e2330' : '#f3f4f6', borderColor: border }]}>
            <Text style={[styles.toggleTxt, { color: textSec }]}>
              {expanded ? 'Gizle  ↑' : 'Detay  ↓'}
            </Text>
          </View>
        </View>

      </View>
    </TouchableOpacity>
  );
}

export default function AracSorgulaScreen({ navigation }) {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  const insets = useSafeAreaInsets();

  const [plaka, setPlaka]         = useState('');
  const [results, setResults]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [searched, setSearched]   = useState(false);
  const [expandedIds, setExpandedIds] = useState({});

  const bg     = isDark ? '#0d0f14' : '#F9FAFB';
  const surface= isDark ? '#161a23' : '#fff';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  const handleSearch = async () => {
    if (plaka.trim().length < 4) { Alert.alert('Eksik Bilgi', 'Plaka en az 4 karakter olmalı.'); return; }
    setLoading(true); setSearched(true); setExpandedIds({});
    try {
      const { data, error } = await supabase
        .from('servis_kayitlari')
        .select('*')
        .ilike('plaka', `%${plaka.trim().toUpperCase()}%`)
        .order('created_at', { ascending: false })
        .limit(30);
      const rows = !error && data ? data : [];
      setResults(rows);
      // İlk kaydı otomatik aç
      if (rows.length > 0) setExpandedIds({ [rows[0].id]: true });
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
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
          <Text style={[styles.navTitle, { color: theme.text }]}>Araç Sorgula</Text>
          <Text style={[styles.navSub, { color: isDark ? '#6b7280' : '#9ca3af' }]}>Servis geçmişi sorgulama</Text>
        </View>
      </View>

      {/* Arama */}
      <View style={[styles.searchSection, { borderBottomColor: border }]}>
        <Text style={[styles.searchLabel, { color: isDark ? '#6b7280' : '#9ca3af' }]}>ARAÇ PLAKASI</Text>
        <View style={styles.searchRow}>
          <View style={[styles.plakaBox, { backgroundColor: surface, borderColor: gold + '55' }]}>
            <View style={[styles.plakaFlag, { backgroundColor: '#003DA5' }]}>
              <Text style={styles.plakaFlagTxt}>TR</Text>
            </View>
            <TextInput
              style={[styles.plakaInput, { color: theme.text }]}
              placeholder="26 ABC 123"
              placeholderTextColor={isDark ? '#4b5563' : '#c0c4cc'}
              value={plaka}
              onChangeText={setPlaka}
              autoCapitalize="characters"
              returnKeyType="search"
              onSubmitEditing={handleSearch}
              maxLength={10}
            />
          </View>
          <TouchableOpacity
            style={[styles.searchBtn, { backgroundColor: gold, opacity: plaka.trim().length >= 4 ? 1 : 0.5 }]}
            onPress={handleSearch}
            disabled={plaka.trim().length < 4 || loading}
            activeOpacity={0.8}
          >
            {loading
              ? <ActivityIndicator color="#060810" size="small" />
              : <Text style={styles.searchBtnTxt}>Sorgula</Text>
            }
          </TouchableOpacity>
        </View>
        <Text style={[styles.searchHint, { color: isDark ? '#4b5563' : '#9ca3af' }]}>
          Tüm kayıtlı garajların bakım geçmişinde aranır
        </Text>
      </View>

      {/* Sonuçlar */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={gold} size="large" />
          <Text style={[styles.centerTxt, { color: isDark ? '#6b7280' : '#9ca3af' }]}>Sorgulanıyor…</Text>
        </View>
      ) : searched && results.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>Kayıt bulunamadı</Text>
          <Text style={[styles.emptyDesc, { color: isDark ? '#6b7280' : '#9ca3af' }]}>
            {plaka.trim().toUpperCase()} plakalı araç için{'\n'}henüz servis kaydı girilmemiş
          </Text>
        </View>
      ) : !searched ? (
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>🚗</Text>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>Servis geçmişini öğren</Text>
          <Text style={[styles.emptyDesc, { color: isDark ? '#6b7280' : '#9ca3af' }]}>
            Plakayı girerek aracın tüm bakım{'\n'}geçmişini ücretsiz sorgulayabilirsin
          </Text>
          <View style={[styles.infoBox, { backgroundColor: surface, borderColor: border }]}>
            {[
              { icon: 'wrench-outline', text: 'Hangi garajda bakım yapıldığını gör' },
              { icon: 'clipboard-list-outline', text: 'Yapılan işlemleri ve parçaları gör' },
              { icon: 'calendar-outline', text: 'Bakım tarihlerini ve kilometrelerini gör' },
            ].map((item, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: i < 2 ? 6 : 0 }}>
                <Icon name={item.icon} size={15} color={isDark ? '#9ca3af' : '#6b7280'} />
                <Text style={[styles.infoItem, { color: isDark ? '#9ca3af' : '#6b7280', marginBottom: 0 }]}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          extraData={expandedIds}
          renderItem={({ item, index }) => (
            <ServisKarti
              item={item}
              index={index}
              isDark={isDark}
              expanded={!!expandedIds[item.id]}
              onToggle={() => toggleExpand(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={[styles.resultHeader, { color: isDark ? '#6b7280' : '#9ca3af' }]}>
              {results.length} bakım kaydı bulundu · Karta tıkla detay gör
            </Text>
          }
        />
      )}
    </KeyboardAvoidingView>
  );
}

const dt = StyleSheet.create({
  section:      { marginTop: 12, gap: 4 },
  sectionTitle: { fontSize: 9, fontWeight: '800', letterSpacing: 1.2, color: '#C9A84C', marginBottom: 4 },
  blockTxt:     { fontSize: 13, lineHeight: 20 },
  row:          { flexDirection: 'row', gap: 8, alignItems: 'flex-start', marginTop: 3 },
  label:        { fontSize: 11, fontWeight: '600', color: '#9ca3af', width: 90, flexShrink: 0 },
  value:        { fontSize: 12, flex: 1, lineHeight: 18 },
});

const styles = StyleSheet.create({
  container: { flex: 1 },

  nav: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1,
  },
  navBtn: { width: 36, height: 36, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  navBtnTxt: { fontSize: 16 },
  navTitle: { fontSize: 16, fontWeight: '700', letterSpacing: -0.3 },
  navSub: { fontSize: 11, marginTop: 1 },

  searchSection: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 16, borderBottomWidth: 1 },
  searchLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 2, marginBottom: 10 },
  searchRow: { flexDirection: 'row', gap: 10, alignItems: 'stretch' },
  plakaBox: { flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderRadius: 10, overflow: 'hidden', height: 52 },
  plakaFlag: { width: 36, height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#003DA5' },
  plakaFlagTxt: { fontSize: 9, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  plakaInput: { flex: 1, paddingHorizontal: 12, fontSize: 18, fontWeight: '700', letterSpacing: 3 },
  searchBtn: { paddingHorizontal: 20, borderRadius: 10, height: 52, alignItems: 'center', justifyContent: 'center' },
  searchBtnTxt: { fontSize: 14, fontWeight: '700', color: '#060810' },
  searchHint: { fontSize: 11, marginTop: 8 },

  listContent: { padding: 16, gap: 10 },
  resultHeader: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5, marginBottom: 4 },

  card: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', flexDirection: 'row' },
  cardBar: { width: 4 },
  cardBody: { flex: 1, padding: 14, gap: 5 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 2 },
  plateBadge: { backgroundColor: '#E8C020', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  plateTxt: { fontWeight: '800', fontSize: 13, color: '#0E1218', letterSpacing: 2 },
  latestBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 100, backgroundColor: 'rgba(201,168,76,0.15)', borderWidth: 1, borderColor: 'rgba(201,168,76,0.4)' },
  latestTxt: { fontSize: 9, fontWeight: '700', color: '#C9A84C', letterSpacing: 1 },
  cardDate: { fontSize: 11, fontWeight: '500' },
  cardGaraj: { fontSize: 14, fontWeight: '700' },
  cardKm: { fontSize: 11 },
  cardDetail: { fontSize: 13, lineHeight: 19 },
  cardParts: { fontSize: 11, lineHeight: 16 },

  expandedWrap: { marginTop: 10, paddingTop: 12, borderTopWidth: 1, gap: 2 },
  sasiTxt: { fontSize: 11, marginTop: 10 },

  cardFooterRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: 10, paddingTop: 10, borderTopWidth: 1,
  },
  cardFooterBrand: { fontSize: 9, fontWeight: '600', letterSpacing: 1.5 },
  togglePill: {
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 20, borderWidth: 1,
  },
  toggleTxt: { fontSize: 11, fontWeight: '700' },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32 },
  centerTxt: { fontSize: 14, marginTop: 8 },
  emptyIcon: { fontSize: 56 },
  emptyTitle: { fontSize: 18, fontWeight: '700', textAlign: 'center' },
  emptyDesc: { fontSize: 13, textAlign: 'center', lineHeight: 20 },
  infoBox: { marginTop: 8, borderRadius: 14, borderWidth: 1, padding: 16, gap: 10, width: '100%' },
  infoItem: { fontSize: 13, lineHeight: 20 },
});
