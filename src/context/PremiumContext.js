import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import supabase from '../utils/supabaseClient';
import { TIER_PRIORITY, higherTier, getTierFromRC, getTierFromSupabase } from '../utils/tierUtils';

// ─── Limitler ────────────────────────────────────────────────────────────────
const FREE_TOTAL_LIMIT      = 3;
const BIREYSEL_DAILY_LIMIT  = 3;

// ─── AsyncStorage anahtarları ────────────────────────────────────────────────
const FREE_KEY          = '@free_usage_v1';
const BIREYSEL_KEY      = '@bireysel_daily_v1';
const ACTIVE_CO_KEY     = '@alhazen_active_co_id';
const PENDING_TIER_KEY  = '@pending_rc_tier_v1';

// ─── RevenueCat ──────────────────────────────────────────────────────────────
const RC_API_KEY = Platform.OS === 'ios'
  ? 'appl_ssyKsVJsgNTqxPISkPzLdoFdyaG'
  : 'goog_dlBrzkktLycAZtzVQBXlddPdYIR';

const todayStr = () => new Date().toISOString().slice(0, 10);

// ─── Context ─────────────────────────────────────────────────────────────────
const PremiumContext = createContext(null);

export function PremiumProvider({ children }) {
  const [premiumTier, setPremiumTier]       = useState('free'); // 'free'|'bireysel'|'solo'|'takim'
  const [freeUsed, setFreeUsed]             = useState(0);      // ücretsiz toplam kullanım
  const [bireyselUsed, setBireyselUsed]     = useState(0);      // bireysel bugünkü kullanım
  const [paywallVisible, setPaywallVisible] = useState(false);
  const [paywallMode, setPaywallMode]       = useState('all');  // 'all' | 'bireysel'
  const resolverRef = useRef(null);

  const isPremium  = premiumTier !== 'free';
  const isSoloPlus = premiumTier === 'solo' || premiumTier === 'takim';
  // Paywall'a iletilecek kalan hak sayısı
  const FREE_LIMIT = premiumTier === 'bireysel' ? BIREYSEL_DAILY_LIMIT : FREE_TOTAL_LIMIT;
  const freeUsedDisplay = premiumTier === 'bireysel' ? bireyselUsed : freeUsed;

  // ─── Kota yükle: Supabase öncelikli, AsyncStorage fallback ─────────────────
  const loadUsage = async (userId = null) => {
    if (userId) {
      try {
        const { data } = await supabase.from('pdf_usage')
          .select('free_total, bireysel_date, bireysel_daily')
          .eq('user_id', userId)
          .maybeSingle();
        if (data) {
          setFreeUsed(data.free_total || 0);
          setBireyselUsed(data.bireysel_date === todayStr() ? (data.bireysel_daily || 0) : 0);
          return;
        }
      } catch {}
    }
    // Fallback: AsyncStorage
    const freeRaw = await AsyncStorage.getItem(FREE_KEY);
    if (freeRaw) setFreeUsed(parseInt(freeRaw, 10) || 0);
    const bRaw = await AsyncStorage.getItem(BIREYSEL_KEY);
    if (bRaw) {
      const { count, date } = JSON.parse(bRaw);
      setBireyselUsed(date === todayStr() ? (count || 0) : 0);
    }
  };

  // ─── Supabase'den şirket planını bul (sahip VEYA üye) — id dahil döner ─────
  const getCompanyPlan = async (user) => {
    if (!user) return null;
    const activeId = await AsyncStorage.getItem(ACTIVE_CO_KEY);
    if (activeId) {
      const { data } = await supabase.from('companies')
        .select('id, plan, trial_ends_at').eq('id', activeId).maybeSingle();
      if (data) return data;
    }
    const { data: owned } = await supabase.from('companies')
      .select('id, plan, trial_ends_at').eq('owner_id', user.id).maybeSingle();
    if (owned) return owned;
    const { data: mem } = await supabase.from('company_members')
      .select('company_id').eq('email', user.email)
      .not('accepted_at', 'is', null).maybeSingle();
    if (mem?.company_id) {
      const { data: mco } = await supabase.from('companies')
        .select('id, plan, trial_ends_at').eq('id', mem.company_id).maybeSingle();
      if (mco) return mco;
    }
    return null;
  };

  // ─── Supabase'e tier yaz (sahibi olduğu TÜM şirketler) ─────────────────────
  const syncTierToSupabase = async (tier, user) => {
    const { error } = await supabase.from('companies')
      .update({ plan: tier })
      .eq('owner_id', user.id);
    return !error;
  };

  // ─── Premium tier güncelle ─────────────────────────────────────────────────
  const updateTier = async (session) => {
    let rcTier = 'free';
    let rcCallSucceeded = false;
    try {
      if (session?.user?.id) await Purchases.logIn(session.user.id);
      const info = await Purchases.getCustomerInfo();
      rcTier = getTierFromRC(info);
      rcCallSucceeded = true;
    } catch {}

    // Anonim satın alma desteği: RC merge çalışmasa bile pending tier kullan
    let pendingTier = 'free';
    try {
      const stored = await AsyncStorage.getItem(PENDING_TIER_KEY);
      if (stored) pendingTier = stored;
    } catch {}

    const effectiveRcTier = higherTier(rcTier, pendingTier);

    let sbTier = 'free';
    let company = null;
    try {
      if (session?.user) {
        company = await getCompanyPlan(session.user);
        sbTier = getTierFromSupabase(company);
      }
    } catch {}

    // Abonelik süresi doldu: RC kesin 'free' döndü, Supabase hâlâ eski planı tutuyor
    // → Supabase'i düşür (ağ hatası değil, RC'den onaylı yanıt geldi)
    if (rcCallSucceeded && effectiveRcTier === 'free' && session?.user &&
        (sbTier === 'bireysel' || sbTier === 'solo' || sbTier === 'takim')) {
      try {
        await syncTierToSupabase('free', session.user);
        sbTier = 'free';
      } catch {}
    }

    const finalTier = higherTier(effectiveRcTier, sbTier);
    if (rcCallSucceeded && effectiveRcTier === 'free') {
      // RC kesin 'free' onayladı → downgrade izinli
      setPremiumTier(finalTier);
    } else {
      // RC belirsiz/başarısız ya da aktif abonelik var → mevcut tier'dan aşağı inme
      setPremiumTier(prev => higherTier(prev, finalTier));
    }

    // effectiveRcTier > sbTier ise Supabase'i güncelle
    if (session?.user && TIER_PRIORITY[effectiveRcTier] > TIER_PRIORITY[sbTier] && effectiveRcTier !== 'free') {
      try {
        const ok = await syncTierToSupabase(effectiveRcTier, session.user);
        if (ok) await AsyncStorage.removeItem(PENDING_TIER_KEY);
      } catch {}
    } else if (pendingTier !== 'free' && session?.user && TIER_PRIORITY[sbTier] >= TIER_PRIORITY[pendingTier]) {
      AsyncStorage.removeItem(PENDING_TIER_KEY).catch(() => {});
    }

    // Giriş yapılmışsa Supabase'den gerçek kota sayısını çek (reinstall bypass kapanır)
    if (session?.user?.id) {
      await loadUsage(session.user.id);
    }
  };

  // ─── Başlangıç ────────────────────────────────────────────────────────────
  useEffect(() => {
    Purchases.setLogLevel(LOG_LEVEL.ERROR);
    Purchases.configure({ apiKey: RC_API_KEY });
    Purchases.addCustomerInfoUpdateListener((info) => {
      const tier = getTierFromRC(info);
      if (tier !== 'free') setPremiumTier(prev => higherTier(prev, tier));
    });

    loadUsage();

    supabase.auth.getSession().then(({ data: { session } }) => {
      updateTier(session);
    }).catch(() => {});

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      updateTier(session);
    });
    return () => authListener?.subscription?.unsubscribe();
  }, []);

  // ─── Kullanım kontrolü ────────────────────────────────────────────────────
  const canGenerate = () => {
    if (isSoloPlus) return true;
    if (premiumTier === 'bireysel') return bireyselUsed < BIREYSEL_DAILY_LIMIT;
    return freeUsed < FREE_TOTAL_LIMIT;
  };

  const consumeOne = async () => {
    if (isSoloPlus) return;

    let userId = null;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      userId = session?.user?.id ?? null;
    } catch {}

    if (premiumTier === 'bireysel') {
      const next = bireyselUsed + 1;
      setBireyselUsed(next);
      await AsyncStorage.setItem(BIREYSEL_KEY, JSON.stringify({ count: next, date: todayStr() }));
      if (userId) {
        supabase.from('pdf_usage').upsert(
          { user_id: userId, bireysel_date: todayStr(), bireysel_daily: next, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        ).catch(() => {});
      }
    } else {
      const next = freeUsed + 1;
      setFreeUsed(next);
      await AsyncStorage.setItem(FREE_KEY, String(next));
      if (userId) {
        supabase.from('pdf_usage').upsert(
          { user_id: userId, free_total: next, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        ).catch(() => {});
      }
    }
  };

  // ─── Gate: PDF üretimi için ───────────────────────────────────────────────
  const gate = () =>
    new Promise(resolve => {
      if (canGenerate()) {
        consumeOne();
        resolve(true);
      } else {
        resolverRef.current = resolve;
        setPaywallVisible(true);
      }
    });

  // ─── showPaywall: tüm planlar (gate veya özellik erişimi için) ──────────────
  const showPaywall = (minTier = 'bireysel') =>
    new Promise(resolve => {
      if (TIER_PRIORITY[premiumTier] >= TIER_PRIORITY[minTier]) { resolve(true); return; }
      resolverRef.current = resolve;
      setPaywallMode('all');
      setPaywallVisible(true);
    });

  // ─── showBireyselPaywall: Ayarlar → yalnızca Bireysel plan göster ──────────
  const showBireyselPaywall = () =>
    new Promise(resolve => {
      if (isPremium) { resolve(true); return; }
      resolverRef.current = resolve;
      setPaywallMode('bireysel');
      setPaywallVisible(true);
    });

  const closePaywall = () => {
    setPaywallVisible(false);
    setPaywallMode('all');
    if (resolverRef.current) {
      resolverRef.current(false);
      resolverRef.current = null;
    }
  };

  const onPurchaseSuccess = async () => {
    try {
      const info = await Purchases.getCustomerInfo();
      const tier = getTierFromRC(info);
      setPremiumTier(prev => higherTier(prev, tier));

      if (tier !== 'free') {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Giriş yapılmış: direkt Supabase'e yaz
          await syncTierToSupabase(tier, session.user);
          await AsyncStorage.removeItem(PENDING_TIER_KEY);
        } else {
          // Anonim satın alma: login sonrası updateTier kullanacak
          await AsyncStorage.setItem(PENDING_TIER_KEY, tier);
        }
      }
    } catch {
      setPremiumTier('bireysel');
    }
    setPaywallVisible(false);
    if (resolverRef.current) {
      resolverRef.current(true);
      resolverRef.current = null;
    }
  };

  return (
    <PremiumContext.Provider value={{
      isPremium,
      isSoloPlus,
      premiumTier,
      freeUsed: freeUsedDisplay,
      FREE_LIMIT,
      paywallVisible,
      paywallMode,
      gate,
      showPaywall,
      showBireyselPaywall,
      closePaywall,
      onPurchaseSuccess,
      setIsPremium: (v) => setPremiumTier(v ? 'solo' : 'free'), // geriye dönük uyumluluk
    }}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const ctx = useContext(PremiumContext);
  if (!ctx) throw new Error('usePremium must be used inside PremiumProvider');
  return ctx;
}
