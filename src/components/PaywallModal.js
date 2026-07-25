import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import Purchases from 'react-native-purchases';
import { usePremium } from '../context/PremiumContext';
import supabase from '../utils/supabaseClient';
import { navigate } from '../navigation/navigationRef';

const GOLD  = '#C9A84C';
const NAVY  = '#0F172A';
const NAVY2 = '#1A2744';

const PLANS = [
  {
    key: 'bireysel',
    label: 'Bireysel',
    emoji: '👤',
    monthlyId: '$rc_monthly',
    yearlyId: '$rc_annual',
    features: ['3 PDF/gün', 'Tüm şablonlar', 'Filigransız çıktı'],
    accent: GOLD,
  },
  {
    key: 'solo',
    label: 'Solo',
    emoji: '⚡',
    monthlyId: 'solo_aylik',
    yearlyId: 'solo_yillik',
    features: ['Sınırsız PDF', 'Satış & expertiz', 'Araç & emlak modülü'],
    accent: '#3DBA7C',
  },
  {
    key: 'takim',
    label: 'Takım',
    emoji: '🏢',
    monthlyId: 'takim_aylik',
    yearlyId: 'takim_yillik',
    features: ['Her şey dahil', 'Ekip üye yönetimi', 'Öncelikli destek'],
    accent: '#5B8FF9',
  },
];

export default function PaywallModal() {
  const { paywallVisible, paywallMode, closePaywall, onPurchaseSuccess, FREE_LIMIT } = usePremium();
  const visiblePlans = paywallMode === 'bireysel' ? PLANS.filter(p => p.key === 'bireysel') : PLANS;
  const [pkgMap, setPkgMap]         = useState({});
  const [isYearly, setIsYearly]     = useState(true);
  const [loading, setLoading]       = useState(false);
  const [purchasing, setPurchasing] = useState(null); // plan key being purchased

  useEffect(() => {
    if (paywallVisible) fetchOfferings();
  }, [paywallVisible]);

  const fetchOfferings = async () => {
    setLoading(true);
    try {
      const offerings = await Purchases.getOfferings();
      const map = {};
      // Tüm offering'leri tara — Bireysel/Solo/Takım farklı offering'lerde olabilir
      for (const key of Object.keys(offerings.all ?? {})) {
        for (const p of (offerings.all[key].availablePackages ?? [])) {
          map[p.identifier] = p;
          if (p.product?.identifier) map[p.product.identifier] = p;
        }
      }
      setPkgMap(map);
    } catch {}
    setLoading(false);
  };

  const handlePurchase = async (plan) => {
    if (purchasing) return;

    // Solo ve Takım için hesap zorunlu
    if (plan.key !== 'bireysel') {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert(
          'Hesap Gerekli',
          'Solo ve Takım planları işletme hesabınıza bağlıdır. Önce kayıt olun veya giriş yapın.',
          [
            { text: 'Kayıt Ol / Giriş Yap', onPress: () => { closePaywall(); navigate('Auth'); } },
            { text: 'İptal', style: 'cancel' },
          ]
        );
        return;
      }
    }

    const pkgId = isYearly ? plan.yearlyId : plan.monthlyId;
    const pkg = pkgMap[pkgId];
    if (!pkg) {
      Alert.alert('Ürünler Yükleniyor', 'Abonelik bilgileri henüz yüklenemedi. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.');
      return;
    }
    setPurchasing(plan.key);
    try {
      await Purchases.purchasePackage(pkg);
      await onPurchaseSuccess();
    } catch (e) {
      if (!e.userCancelled) {
        Alert.alert('Hata', 'Satın alma başarısız. Lütfen tekrar deneyin.');
      }
    }
    setPurchasing(null);
  };

  const getPrice = (plan) => {
    const pkgId = isYearly ? plan.yearlyId : plan.monthlyId;
    const pkg = pkgMap[pkgId];
    return pkg?.product?.localizedPriceString ?? null;
  };

  return (
    <Modal
      visible={paywallVisible}
      animationType="slide"
      transparent
      onRequestClose={closePaywall}
    >
      <View style={s.overlay}>
        <View style={s.sheet}>
          {/* Başlık */}
          <View style={s.header}>
            <View style={s.logoBox}>
              <Text style={s.logoTxt}>A</Text>
            </View>
            <Text style={s.title}>AlhazenPDF Pro</Text>
            <Text style={s.subtitle}>
              {FREE_LIMIT} ücretsiz PDF hakkınız doldu
            </Text>
          </View>

          {/* Aylık / Yıllık toggle */}
          <View style={s.periodRow}>
            <TouchableOpacity
              style={[s.periodBtn, !isYearly && s.periodBtnActive]}
              onPress={() => setIsYearly(false)}
              activeOpacity={0.8}
            >
              <Text style={[s.periodTxt, !isYearly && s.periodTxtActive]}>Aylık</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.periodBtn, isYearly && s.periodBtnActive]}
              onPress={() => setIsYearly(true)}
              activeOpacity={0.8}
            >
              <Text style={[s.periodTxt, isYearly && s.periodTxtActive]}>Yıllık</Text>
              {isYearly && (
                <View style={s.saveBadge}>
                  <Text style={s.saveTxt}>2 AY BEDAVA</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Plan kartları */}
          {loading ? (
            <ActivityIndicator color={GOLD} style={{ marginVertical: 24 }} />
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 320 }}>
              {visiblePlans.map((plan) => {
                const price = getPrice(plan);
                const isBuying = purchasing === plan.key;
                return (
                  <TouchableOpacity
                    key={plan.key}
                    style={[s.card, { borderColor: plan.accent + '60', opacity: purchasing && purchasing !== plan.key ? 0.6 : 1 }]}
                    onPress={() => handlePurchase(plan)}
                    disabled={!!purchasing}
                    activeOpacity={0.85}
                  >
                    <View style={s.cardLeft}>
                      <View style={[s.cardIcon, { backgroundColor: plan.accent + '20' }]}>
                        <Text style={s.cardEmoji}>{plan.emoji}</Text>
                      </View>
                      <View style={s.cardInfo}>
                        <Text style={s.cardName}>{plan.label}</Text>
                        <Text style={s.cardFeatures} numberOfLines={2}>
                          {plan.features.join('  ·  ')}
                        </Text>
                      </View>
                    </View>
                    <View style={s.cardRight}>
                      {isBuying ? (
                        <ActivityIndicator color={plan.accent} size="small" />
                      ) : (
                        <>
                          <Text style={[s.cardPrice, { color: plan.accent }]}>
                            {price ?? '—'}
                          </Text>
                          <Text style={s.cardPeriod}>
                            {isYearly ? '/yıl' : '/ay'}
                          </Text>
                        </>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {paywallMode === 'bireysel' && (
            <View style={s.infoBox}>
              <Text style={s.infoTxt}>
                Şirketler için Solo ve Takım planları: Kayıt Ol / Giriş Yap yapın, ardından{' '}
                <Text style={{ fontWeight: '700', color: GOLD }}>Ayarlar → Planlarım</Text>{' '}
                sekmesinden satın alın.
              </Text>
            </View>
          )}

          <TouchableOpacity style={s.closeBtn} onPress={closePaywall}>
            <Text style={s.closeTxt}>Şimdi değil</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: NAVY,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBox: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: GOLD,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 10,
  },
  logoTxt:  { fontSize: 24, fontWeight: '900', color: NAVY, fontFamily: 'serif' },
  title:    { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.5)', textAlign: 'center' },

  periodRow: {
    flexDirection: 'row',
    backgroundColor: NAVY2,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    gap: 6,
  },
  periodBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  periodBtnActive:  { backgroundColor: GOLD },
  periodTxt:        { fontSize: 14, fontWeight: '700', color: 'rgba(255,255,255,0.45)' },
  periodTxtActive:  { color: NAVY },
  saveBadge: {
    position: 'absolute',
    top: -9,
    backgroundColor: '#3DBA7C',
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  saveTxt: { fontSize: 8, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NAVY2,
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  cardLeft:   { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardIcon:   { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  cardEmoji:  { fontSize: 20 },
  cardInfo:   { flex: 1 },
  cardName:   { fontSize: 15, fontWeight: '800', color: '#fff', marginBottom: 3 },
  cardFeatures: { fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 15 },
  cardRight:  { alignItems: 'flex-end', minWidth: 56 },
  cardPrice:  { fontSize: 15, fontWeight: '800' },
  cardPeriod: { fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 1 },

  closeBtn: { alignItems: 'center', paddingTop: 16 },
  closeTxt:  { fontSize: 13, color: 'rgba(255,255,255,0.35)' },

  infoBox:  { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 12, marginTop: 12 },
  infoTxt:  { fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 18, textAlign: 'center' },
});
