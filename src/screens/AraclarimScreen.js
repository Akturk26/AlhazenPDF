import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList,
  StatusBar, Alert, Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../components/Icon';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../themes/colors';
import { getAraclar, deleteArac, kalanGun, durumRenk } from '../utils/araclarimStorage';
import { usePremium } from '../context/PremiumContext';

const GOLD = '#C9A84C';

function StatusBadge({ label, tarih }) {
  const gun = kalanGun(tarih);
  const renk = durumRenk(gun);
  const text = gun === null ? '—' : gun < 0 ? 'Süresi doldu' : gun === 0 ? 'Bugün' : `${gun} gün`;
  return (
    <View style={[s.badge, { backgroundColor: renk + '18', borderColor: renk + '50' }]}>
      <View style={[s.badgeDot, { backgroundColor: renk }]} />
      <Text style={[s.badgeLbl, { color: renk }]}>{label}</Text>
      <Text style={[s.badgeVal, { color: renk }]}>{text}</Text>
    </View>
  );
}

export default function AraclarimScreen({ navigation }) {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  const insets = useSafeAreaInsets();
  const { isSoloPlus, showPaywall } = usePremium();
  const [araclar, setAraclar] = useState([]);

  const bg = isDark ? '#0d0f14' : '#F9FAFB';
  const surface = isDark ? '#161a23' : '#fff';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';

  useFocusEffect(useCallback(() => {
    getAraclar().then(setAraclar);
  }, []));

  const handleAdd = async () => {
    if (!isSoloPlus && araclar.length >= 1) {
      await showPaywall('solo');
      return;
    }
    navigation.navigate('SahsiAracEkle', {});
  };

  const handleDelete = (arac) => {
    Alert.alert('Aracı Sil', `${arac.marka} ${arac.model} silinsin mi?`, [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Sil', style: 'destructive', onPress: async () => {
          await deleteArac(arac.id);
          setAraclar(prev => prev.filter(a => a.id !== arac.id));
        },
      },
    ]);
  };

  const sonMuayene = (arac) => arac.muayeneler?.slice(-1)[0]?.sonrakiTarih || null;
  const sonSigorta = (arac) => arac.sigortalar?.slice(-1)[0]?.bitis || null;

  const renderArac = ({ item }) => (
    <TouchableOpacity
      style={[s.card, { backgroundColor: surface, borderColor: border }]}
      onPress={() => navigation.navigate('AracDetay', { aracId: item.id })}
      onLongPress={() => handleDelete(item)}
      activeOpacity={0.85}
    >
      {/* Fotoğraf */}
      <View style={[s.photoWrap, { backgroundColor: isDark ? '#0d0f14' : '#f3f4f6', borderColor: border }]}>
        {item.fotoUri ? (
          <Image source={{ uri: item.fotoUri }} style={s.photo} resizeMode="cover" />
        ) : (
          <Icon name="car-outline" size={28} color={GOLD} />
        )}
      </View>

      {/* Bilgiler */}
      <View style={s.info}>
        <View style={s.infoTop}>
          <Text style={[s.make, { color: theme.text }]}>{item.marka} {item.model}</Text>
          <Text style={[s.year, { color: theme.textSecondary }]}>{item.yil}</Text>
        </View>
        <Text style={[s.plaka, { color: '#C9A84C' }]}>{item.plaka?.toUpperCase()}</Text>
        <View style={s.badges}>
          <StatusBadge label="Muayene" tarih={sonMuayene(item)} />
          <StatusBadge label="Sigorta" tarih={sonSigorta(item)} />
        </View>
      </View>

      <Icon name="chevron-right" size={22} color={theme.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <View style={[s.root, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bg} />

      {/* Header */}
      <LinearGradient
        colors={['#0F172A', '#1A2744']}
        style={[s.header, { paddingTop: insets.top + 12, borderBottomColor: 'rgba(255,255,255,0.08)' }]}
      >
        <TouchableOpacity style={[s.backBtn, { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.15)' }]} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[s.title, { color: '#fff' }]}>Araçlarım</Text>
          <Text style={[s.sub, { color: 'rgba(255,255,255,0.6)' }]}>
            {araclar.length > 0 ? `${araclar.length} araç kayıtlı` : 'Henüz araç eklenmedi'}
          </Text>
        </View>
        <TouchableOpacity
          style={[s.addBtn, { backgroundColor: '#C9A84C' }]}
          onPress={() => handleAdd()}
          activeOpacity={0.85}
        >
          <Text style={s.addTxt}>+ Ekle</Text>
        </TouchableOpacity>
      </LinearGradient>

      {araclar.length === 0 ? (
        <View style={s.empty}>
          <Icon name="car-outline" size={56} color={GOLD} />
          <Text style={[s.emptyTitle, { color: theme.text }]}>Araç Eklenmedi</Text>
          <Text style={[s.emptySub, { color: theme.textSecondary }]}>
            Araçlarınızın muayene, sigorta ve{'\n'}bakım geçmişini buradan takip edin.
          </Text>
          <TouchableOpacity
            style={[s.emptyBtn, { backgroundColor: '#C9A84C' }]}
            onPress={() => handleAdd()}
          >
            <Text style={s.emptyBtnTxt}>İlk Aracı Ekle</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={araclar}
          keyExtractor={a => a.id}
          renderItem={renderArac}
          contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: insets.bottom + 32 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1,
  },
  backBtn: { width: 36, height: 36, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  backTxt: { fontSize: 16 },
  title: { fontSize: 18, fontWeight: '800', letterSpacing: -0.4 },
  sub: { fontSize: 11, marginTop: 1 },
  addBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  addTxt: { color: '#fff', fontSize: 13, fontWeight: '700' },

  card: {
    borderRadius: 14, borderWidth: 1, padding: 12,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  photoWrap: {
    width: 72, height: 60, borderRadius: 10, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0,
  },
  photo: { width: '100%', height: '100%' },
  photoEmoji: { fontSize: 28 },

  info: { flex: 1, gap: 4 },
  infoTop: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  make: { fontSize: 15, fontWeight: '700', letterSpacing: -0.2 },
  year: { fontSize: 12 },
  plaka: { fontSize: 12, fontWeight: '700', letterSpacing: 1.5 },
  badges: { flexDirection: 'row', gap: 6, marginTop: 2 },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6, borderWidth: 1,
  },
  badgeDot: { width: 5, height: 5, borderRadius: 3 },
  badgeLbl: { fontSize: 9, fontWeight: '600', letterSpacing: 0.2 },
  badgeVal: { fontSize: 9, fontWeight: '700' },

  arrow: { fontSize: 22, paddingLeft: 4 },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 12 },
  emptyIcon: { fontSize: 56, marginBottom: 8 },
  emptyTitle: { fontSize: 20, fontWeight: '800', textAlign: 'center' },
  emptySub: { fontSize: 14, textAlign: 'center', lineHeight: 21, opacity: 0.7 },
  emptyBtn: { marginTop: 8, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 14 },
  emptyBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
