import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, Linking, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../themes/colors';
import supabase from '../utils/supabaseClient';
import { ACTIVE_CO_KEY } from './CompanySelectScreen';
import Icon from '../components/Icon';

const GOLD  = '#C9A84C';
const NAVY  = '#0F172A';
const NAVY2 = '#1A2744';

const WA_GENEL = 'https://wa.me/905533069006?text=' + encodeURIComponent('Merhaba, AlhazenPDF hakkında bilgi almak istiyorum.');

const GALERI_PLANS = [
  {
    key: 'free', name: 'Ücretsiz', price: '₺0', sub: '/ ay', color: '#6B7280',
    features: [
      { ok: true,  txt: '1 kullanıcı' },
      { ok: true,  txt: 'Yerel depolama (cihaz)' },
      { ok: true,  txt: 'Araç ekleme & düzenleme' },
      { ok: true,  txt: 'Satış kârı hesaplama' },
      { ok: true,  txt: 'Muayene takibi' },
      { ok: false, txt: 'Bulut senkronizasyon' },
      { ok: false, txt: 'Takım özelliği' },
    ],
  },
  {
    key: 'solo', name: 'Galeri Solo', price: '₺300', sub: '/ ay', color: GOLD, badge: 'Popüler',
    features: [
      { ok: true,  txt: '1 kullanıcı' },
      { ok: true,  txt: 'Bulut senkronizasyon' },
      { ok: true,  txt: 'Tüm cihazlardan erişim' },
      { ok: true,  txt: 'Sınırsız araç kaydı' },
      { ok: true,  txt: 'Muayene hatırlatıcıları' },
      { ok: false, txt: 'Takım özelliği' },
    ],
  },
  {
    key: 'takim', name: 'Galeri Takım', price: '₺500', sub: '/ ay', color: '#059669', badge: 'Takım',
    features: [
      { ok: true, txt: '1 patron + 3 yetkili (4 kişi)' },
      { ok: true, txt: 'Ortak araç listesi' },
      { ok: true, txt: 'Gerçek zamanlı senkronizasyon' },
      { ok: true, txt: 'Sınırsız araç kaydı' },
      { ok: true, txt: 'Muayene hatırlatıcıları' },
      { ok: true, txt: 'Rol yönetimi (patron / yetkili)' },
    ],
  },
];

const SERVIS_PLANS = [
  {
    key: 'free', name: 'Ücretsiz', price: '₺0', sub: '/ ay', color: '#6B7280',
    features: [
      { ok: true,  txt: '1 kullanıcı' },
      { ok: true,  txt: 'Yerel depolama (cihaz)' },
      { ok: true,  txt: 'Servis kaydı oluşturma' },
      { ok: true,  txt: 'PDF çıktısı & QR paylaşım' },
      { ok: false, txt: 'Bulut senkronizasyon' },
      { ok: false, txt: 'Takım özelliği' },
    ],
  },
  {
    key: 'solo', name: 'Servis Solo', price: '₺200', sub: '/ ay', color: GOLD, badge: 'Popüler',
    features: [
      { ok: true,  txt: '1 kullanıcı' },
      { ok: true,  txt: 'Bulut senkronizasyon' },
      { ok: true,  txt: 'Tüm cihazlardan erişim' },
      { ok: true,  txt: 'Sınırsız servis kaydı' },
      { ok: true,  txt: 'Müşteriye QR servis sayfası' },
      { ok: false, txt: 'Takım özelliği' },
    ],
  },
  {
    key: 'takim', name: 'Servis Takım', price: '₺350', sub: '/ ay', color: '#059669', badge: 'Takım',
    features: [
      { ok: true, txt: '1 patron + 2 yetkili (3 kişi)' },
      { ok: true, txt: 'Ortak servis listesi' },
      { ok: true, txt: 'Gerçek zamanlı senkronizasyon' },
      { ok: true, txt: 'Sınırsız servis kaydı' },
      { ok: true, txt: 'Müşteriye QR servis sayfası' },
      { ok: true, txt: 'Rol yönetimi (patron / yetkili)' },
    ],
  },
];

const EMLAK_PLANS = [
  {
    key: 'free', name: 'Ücretsiz', price: '₺0', sub: '/ ay', color: '#6B7280',
    features: [
      { ok: true,  txt: '1 kullanıcı' },
      { ok: true,  txt: 'Yerel depolama (cihaz)' },
      { ok: true,  txt: 'Emlak portföyü oluşturma' },
      { ok: true,  txt: 'PDF çıktısı & paylaşım' },
      { ok: false, txt: 'Bulut senkronizasyon' },
      { ok: false, txt: 'Takım özelliği' },
    ],
  },
  {
    key: 'solo', name: 'Emlak Solo', price: '₺300', sub: '/ ay', color: '#B45309', badge: 'Popüler',
    features: [
      { ok: true,  txt: '1 kullanıcı' },
      { ok: true,  txt: 'Bulut senkronizasyon' },
      { ok: true,  txt: 'Tüm cihazlardan erişim' },
      { ok: true,  txt: 'Sınırsız portföy kaydı' },
      { ok: true,  txt: 'Sosyal medya kartları' },
      { ok: false, txt: 'Takım özelliği' },
    ],
  },
  {
    key: 'takim', name: 'Emlak Ofis', price: '₺500', sub: '/ ay', color: '#059669', badge: 'Ofis',
    features: [
      { ok: true, txt: '1 patron + 3 danışman (4 kişi)' },
      { ok: true, txt: 'Ortak portföy listesi' },
      { ok: true, txt: 'Gerçek zamanlı senkronizasyon' },
      { ok: true, txt: 'Sınırsız portföy kaydı' },
      { ok: true, txt: 'Sosyal medya kartları' },
      { ok: true, txt: 'Rol yönetimi (patron / danışman)' },
    ],
  },
];

function trialKalan(trial_ends_at) {
  if (!trial_ends_at) return 0;
  return Math.max(0, Math.floor((new Date(trial_ends_at) - new Date()) / 86400000));
}

export default function PlanScreen({ navigation }) {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  const insets = useSafeAreaInsets();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user || null;
        if (!user) { setLoading(false); return; }
        const activeId = await AsyncStorage.getItem(ACTIVE_CO_KEY);
        let query = supabase.from('companies').select('*').eq('owner_id', user.id);
        if (activeId) query = query.eq('id', activeId);
        const { data } = await query.maybeSingle();
        setCompany(data || null);
      } catch {}
      setLoading(false);
    })();
  }, []);

  const companyType = company?.type || 'galeri';
  const plans = companyType === 'teknik_servis' ? SERVIS_PLANS : companyType === 'emlak' ? EMLAK_PLANS : GALERI_PLANS;
  const currentPlan = company?.plan || 'free';
  const kalan = company ? trialKalan(company.trial_ends_at) : 0;
  const trialAktif = currentPlan === 'free' && kalan > 0;
  const trialBitti = currentPlan === 'free' && kalan === 0 && !!company;

  const typeLabel = companyType === 'teknik_servis' ? 'Teknik Servis' : companyType === 'emlak' ? 'Emlak' : 'Galeri';

  function bannerColor() {
    if (trialAktif) return GOLD;
    if (trialBitti) return '#EF4444';
    if (currentPlan === 'solo')  return GOLD;
    if (currentPlan === 'takim') return '#059669';
    return '#6B7280';
  }

  function bannerText() {
    if (!company) return null;
    if (trialAktif) return `Deneme Süresi — ${kalan} gün kaldı`;
    if (trialBitti) return 'Deneme Süreniz Doldu';
    if (currentPlan === 'solo')  return `${typeLabel} Solo — Aktif`;
    if (currentPlan === 'takim') return `${typeLabel} Takım — Aktif`;
    return null;
  }

  const basvuruUrl = 'https://alhazenpdf.com/basvuru';

  const bc = bannerColor();
  const bt = bannerText();

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <LinearGradient colors={[NAVY, NAVY2]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Abonelik Planları</Text>
          <Text style={styles.headerSub}>{typeLabel} Pro · AlhazenPDF</Text>
        </View>
        <View style={styles.starBadge}>
          <Icon name="star-outline" size={22} color={GOLD} />
        </View>
      </LinearGradient>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={GOLD} size="large" />
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

          {bt && (
            <View style={[styles.banner, { backgroundColor: bc + '12', borderColor: bc + '33' }]}>
              <Text style={[styles.bannerTitle, { color: bc }]}>{bt}</Text>
              {company?.name && (
                <Text style={[styles.bannerSub, { color: theme.textSecondary }]}>{company.name}</Text>
              )}
              {trialAktif && (
                <View style={styles.trialBarWrap}>
                  <View style={[styles.trialTrack, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)' }]}>
                    <View style={[styles.trialFill, { width: `${Math.round((kalan / 30) * 100)}%`, backgroundColor: bc }]} />
                  </View>
                </View>
              )}
            </View>
          )}

          <View style={styles.planList}>
            {plans.map(plan => {
              const isActive = currentPlan === plan.key;
              return (
                <View key={plan.key} style={[styles.planCard, {
                  backgroundColor: theme.surface,
                  borderColor: isActive ? plan.color : theme.border,
                  borderWidth: isActive ? 2 : 1,
                }]}>
                  <View style={styles.planNameRow}>
                    <Text style={[styles.planName, { color: theme.text }]}>{plan.name}</Text>
                    {plan.badge && (
                      <View style={[styles.badge, { backgroundColor: plan.color }]}>
                        <Text style={styles.badgeTxt}>{plan.badge}</Text>
                      </View>
                    )}
                    {isActive && (
                      <View style={[styles.badge, { backgroundColor: '#059669' }]}>
                        <Text style={styles.badgeTxt}>Aktif</Text>
                      </View>
                    )}
                  </View>

                  <View style={[styles.divider, { backgroundColor: theme.border }]} />

                  {plan.features.map((f, i) => (
                    <View key={i} style={styles.featureRow}>
                      <Icon
                        name={f.ok ? 'check-circle-outline' : 'close-circle-outline'}
                        size={16}
                        color={f.ok ? plan.color : theme.textSecondary}
                      />
                      <Text style={[styles.featureTxt, {
                        color: f.ok ? theme.text : theme.textSecondary,
                        opacity: f.ok ? 1 : 0.45,
                      }]}>
                        {f.txt}
                      </Text>
                    </View>
                  ))}

                  {!isActive && plan.key !== 'free' && (
                    <TouchableOpacity
                      style={styles.upgradeBtn}
                      onPress={() => Linking.openURL(basvuruUrl)}
                      activeOpacity={0.85}
                    >
                      <Icon name="web" size={18} color="#fff" style={{ marginRight: 8 }} />
                      <Text style={styles.upgradeBtnTxt}>alhazenpdf.com'dan Başvur</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>

          <View style={[styles.footerBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.footerTitle, { color: theme.text }]}>Plan yükseltme & sorular</Text>
            <Text style={[styles.footerSub, { color: theme.textSecondary }]}>
              Plan yükseltmek veya yıllık fiyatlandırma için bizimle iletişime geçin.
            </Text>
            <TouchableOpacity
              style={styles.contactBtn}
              onPress={() => Linking.openURL(WA_GENEL)}
              activeOpacity={0.8}
            >
              <Icon name="whatsapp" size={16} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.contactBtnTxt}>WhatsApp: 0553 306 90 06</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 60 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingBottom: 18 },
  backBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: -0.5 },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },
  starBadge: { width: 42, height: 42, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },

  banner: { margin: 16, borderRadius: 16, borderWidth: 1, padding: 16, gap: 4 },
  bannerTitle: { fontSize: 14, fontWeight: '800' },
  bannerSub: { fontSize: 12 },
  trialBarWrap: { marginTop: 8 },
  trialTrack: { height: 6, borderRadius: 99, overflow: 'hidden' },
  trialFill: { height: '100%', borderRadius: 99 },

  planList: { paddingHorizontal: 16, gap: 14 },
  planCard: { borderRadius: 18, padding: 18, gap: 6 },
  planNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  planName: { fontSize: 17, fontWeight: '800', letterSpacing: -0.4 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 2 },
  price: { fontSize: 30, fontWeight: '900', letterSpacing: -1 },
  priceSub: { fontSize: 13 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 7 },
  badgeTxt: { color: '#fff', fontSize: 10, fontWeight: '800' },
  divider: { height: 1, marginVertical: 6 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 2 },
  featureTxt: { fontSize: 13, fontWeight: '500', flex: 1 },
  upgradeBtn: { marginTop: 12, borderRadius: 12, paddingVertical: 14, alignItems: 'center', backgroundColor: '#25D366', flexDirection: 'row', justifyContent: 'center' },
  upgradeBtnTxt: { color: '#fff', fontSize: 14, fontWeight: '700' },

  footerBox: { margin: 16, marginTop: 20, borderRadius: 16, borderWidth: 1, padding: 18, gap: 6 },
  footerTitle: { fontSize: 14, fontWeight: '700' },
  footerSub: { fontSize: 12, lineHeight: 18 },
  contactBtn: { marginTop: 10, backgroundColor: '#25D366', borderRadius: 10, paddingVertical: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  contactBtnTxt: { color: '#fff', fontSize: 13, fontWeight: '700' },
});
