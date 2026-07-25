import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, Alert, TextInput, Image, ActivityIndicator, Linking, Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACTIVE_CO_KEY } from './CompanySelectScreen';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../themes/colors';
import { TUTORIAL_KEY } from '../components/TutorialOverlay';
import { ONBOARDING_KEY } from './OnboardingScreen';
import { usePremium } from '../context/PremiumContext';
import { loadCompanyProfile, saveCompanyProfile } from '../utils/companyProfile';
import supabase from '../utils/supabaseClient';
import Icon from '../components/Icon';

const GOLD   = '#C9A84C';
const GOLD_L = '#E8C97A';
const NAVY   = '#0F172A';
const NAVY2  = '#1A2744';

const APP_VERSION = '1.1.2';

function trialKalan(trial_ends_at) {
  if (!trial_ends_at) return 0;
  return Math.max(0, Math.floor((new Date(trial_ends_at) - new Date()) / 86400000));
}

function planLabel(company) {
  if (!company) return null;
  const kalan = trialKalan(company.trial_ends_at);
  const prefix = company.type === 'teknik_servis' ? 'Servis' : company.type === 'emlak' ? 'Emlak' : 'Galeri';
  if (company.plan === 'takim')    return { txt: `${prefix} Takım · Aktif`,    color: '#059669' };
  if (company.plan === 'solo')     return { txt: `${prefix} Solo · Aktif`,     color: GOLD };
  if (company.plan === 'bireysel') return { txt: 'Bireysel Premium · Aktif',   color: GOLD };
  if (kalan > 0) return { txt: `Deneme · ${kalan} gün`, color: '#F59E0B' };
  return null; // Ücretsiz plan → rozet gösterme
}

function heroColors(company, isDark) {
  if (isDark) return ['#1A1D2E', '#0E0F14'];
  if (company?.type === 'teknik_servis') return ['#0F766E', '#0D9488'];
  if (company?.type === 'emlak') return ['#92400E', '#B45309'];
  return [NAVY, NAVY2];
}

function typeIcon(type) {
  if (type === 'teknik_servis') return { name: 'tools', label: 'Teknik Servis' };
  if (type === 'emlak')         return { name: 'home-city-outline', label: 'Emlak' };
  return { name: 'car-outline', label: 'Galeri' };
}

function SectionLabel({ label, color = GOLD }) {
  return (
    <View style={s.sectionRow}>
      <View style={[s.sectionAccent, { backgroundColor: color }]} />
      <Text style={s.sectionTxt}>{label}</Text>
    </View>
  );
}

function IBox({ bg, children }) {
  return <View style={[s.iconBox, { backgroundColor: bg }]}>{children}</View>;
}

function Row({ iconEl, label, value, onPress, danger, last, rightEl }) {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  return (
    <TouchableOpacity
      style={[s.row, !last && { borderBottomWidth: 1, borderBottomColor: theme.border }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress && !rightEl}
    >
      {iconEl}
      <Text style={[s.rowLabel, { color: danger ? '#EF4444' : theme.text }]}>{label}</Text>
      {rightEl ?? (value
        ? <Text style={[s.rowValue, { color: theme.textSecondary }]}>{value}</Text>
        : onPress && <Text style={[s.rowArrow, { color: theme.textSecondary }]}>›</Text>
      )}
    </TouchableOpacity>
  );
}

export default function SettingsScreen({ navigation }) {
  const { isDark, toggleTheme } = useTheme();
  const theme = getTheme(isDark);
  const insets = useSafeAreaInsets();
  const { isPremium, premiumTier, showBireyselPaywall } = usePremium();

  const [profileName, setProfileName]     = useState('');
  const [profileLogo, setProfileLogo]     = useState(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [savedProfile, setSavedProfile]   = useState(null);
  const [servisUser, setServisUser]       = useState(null);
  const [company, setCompany]             = useState(null);
  const [isLoading, setIsLoading]         = useState(false);

  const loadProfile = async () => {
    const p = await loadCompanyProfile();
    if (p) {
      setProfileName(p.name || '');
      setProfileLogo(p.logoUri ? { uri: p.logoUri, base64: p.logoBase64 } : null);
      setSavedProfile(p);
    }
  };

  const loadAuthInfo = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user || null;
      setServisUser(user);
      if (!user) { setCompany(null); return; }

      const activeId = await AsyncStorage.getItem(ACTIVE_CO_KEY);
      if (activeId) {
        const { data: co } = await supabase.from('companies').select('*').eq('id', activeId).maybeSingle();
        if (co) { setCompany(co); return; }
      }
      const { data: owned } = await supabase.from('companies').select('*')
        .eq('owner_id', user.id).order('created_at').limit(1).maybeSingle();
      if (owned) { setCompany(owned); await AsyncStorage.setItem(ACTIVE_CO_KEY, owned.id); return; }
      const { data: memberships } = await supabase.from('company_members')
        .select('company_id').eq('email', user.email).not('accepted_at', 'is', null).limit(1);
      if (memberships?.length) {
        const { data: mco } = await supabase.from('companies').select('*')
          .eq('id', memberships[0].company_id).maybeSingle();
        if (mco) { setCompany(mco); await AsyncStorage.setItem(ACTIVE_CO_KEY, mco.id); }
      }
    } catch { setServisUser(null); setCompany(null); }
    finally { setIsLoading(false); }
  };

  useFocusEffect(useCallback(() => {
    loadProfile();
    loadAuthInfo();
  }, []));

  const pickLogo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8, base64: true,
      });
      if (!result.canceled) setProfileLogo({ uri: result.assets[0].uri, base64: result.assets[0].base64 });
    } catch { Alert.alert('Hata', 'Fotoğraf seçilemedi.'); }
  };

  const handleSaveProfile = async () => {
    if (!profileName.trim()) { Alert.alert('Uyarı', 'Şirket adı boş olamaz.'); return; }
    setProfileSaving(true);
    await saveCompanyProfile({ name: profileName.trim(), logoUri: profileLogo?.uri || null, logoBase64: profileLogo?.base64 || null });
    await loadProfile();
    setProfileSaving(false);
    Alert.alert('✓', 'Profil kaydedildi.');
  };

  const resetTutorial = async () => {
    try { await AsyncStorage.removeItem(TUTORIAL_KEY); Alert.alert('Sıfırlandı', 'Uygulamayı kapatıp açın.'); }
    catch { Alert.alert('Hata', 'Sıfırlanamadı.'); }
  };

  const resetOnboarding = async () => {
    try { await AsyncStorage.removeItem(ONBOARDING_KEY); Alert.alert('Sıfırlandı', 'Uygulamayı kapatıp açın.'); }
    catch { Alert.alert('Hata', 'Sıfırlanamadı.'); }
  };

  const handleSignOut = () => {
    Alert.alert('Çıkış Yap', 'Hesabınızdan çıkış yapılsın mı?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Çıkış', style: 'destructive', onPress: async () => {
        await supabase.auth.signOut();
        setServisUser(null); setCompany(null);
      }},
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert('Hesabı Sil', 'Bu işlem geri alınamaz. Hesabınız kalıcı olarak silinir.', [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Evet, Sil', style: 'destructive', onPress: () =>
        Alert.alert('Son Onay', 'Hesabınız ve tüm verileriniz silinecek. Devam?', [
          { text: 'Vazgeç', style: 'cancel' },
          { text: 'Kalıcı Olarak Sil', style: 'destructive', onPress: async () => {
            try {
              const { error } = await supabase.rpc('delete_user');
              if (error) throw error;
              await supabase.auth.signOut();
              navigation.navigate('Home');
            } catch (e) { Alert.alert('Hata', e.message || 'Hesap silinemedi.'); }
          }},
        ])
      },
    ]);
  };

  const pl = planLabel(company);
  const effectivePlan = isPremium
    ? (pl ?? { txt: 'Pro · Aktif', color: GOLD })
    : pl;
  const isOwner = servisUser?.id === company?.owner_id;
  const hasChanges = savedProfile && (
    profileName.trim() !== (savedProfile.name || '') ||
    (profileLogo?.uri || null) !== (savedProfile.logoUri || null)
  );
  const isUpToDate = savedProfile && !hasChanges;
  const gradColors = heroColors(company, isDark);
  const avatarInitial = (company?.name || profileName || '?')[0]?.toUpperCase() || '?';
  const ti = typeIcon(company?.type);

  return (
    <View style={[s.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* HERO */}
        <LinearGradient colors={gradColors} style={[s.hero, { paddingTop: insets.top + 10 }]}>
          <View style={s.heroNav}>
            <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={20} color="#fff" />
            </TouchableOpacity>
            <View style={s.vChip}>
              <Text style={s.vChipTxt}>v{APP_VERSION}</Text>
            </View>
          </View>

          {isLoading ? (
            <View style={[s.heroBody, { paddingVertical: 28 }]}>
              <ActivityIndicator color="rgba(255,255,255,0.8)" size="large" />
            </View>
          ) : servisUser ? (
            <View style={s.heroBody}>
              <TouchableOpacity style={s.avatarWrap} onPress={pickLogo} activeOpacity={0.85}>
                {profileLogo
                  ? <Image source={{ uri: profileLogo.uri }} style={s.avatarImg} />
                  : (
                    <LinearGradient colors={['rgba(255,255,255,0.35)', 'rgba(255,255,255,0.15)']} style={s.avatarFallback}>
                      <Text style={s.avatarInitial}>{avatarInitial}</Text>
                    </LinearGradient>
                  )
                }
                <View style={s.avatarEditDot}>
                  <Icon name="pencil" size={11} color="#fff" />
                </View>
              </TouchableOpacity>

              <Text style={s.heroName} numberOfLines={1}>
                {company?.name || profileName || 'Şirket Adı'}
              </Text>

              <View style={s.heroBadgeRow}>
                <View style={s.heroTypeBadge}>
                  <Icon name={ti.name} size={13} color="#fff" style={{ marginRight: 5 }} />
                  <Text style={s.heroTypeTxt}>{ti.label}</Text>
                </View>
                {effectivePlan && (
                  <View style={[s.heroPlanBadge, {
                    backgroundColor: effectivePlan.color + '30',
                    borderColor: effectivePlan.color + '70',
                    flexDirection: 'row', alignItems: 'center', gap: 4,
                  }]}>
                    {isPremium && <Text style={{ fontSize: 10, color: effectivePlan.color }}>★</Text>}
                    <Text style={[s.heroPlanTxt, { color: effectivePlan.color }]}>{effectivePlan.txt}</Text>
                  </View>
                )}
              </View>

              <Text style={s.heroEmail}>{servisUser.email}</Text>
            </View>
          ) : (
            <View style={s.heroBody}>
              <View style={s.heroLockCircle}>
                <Icon name="lock-outline" size={38} color="rgba(255,255,255,0.9)" />
              </View>
              <Text style={s.heroGuestTitle}>Hesap Bağlı Değil</Text>
              <Text style={s.heroGuestSub}>Giriş yap, 3 gün ücretsiz kullan</Text>
            </View>
          )}
        </LinearGradient>

        {/* QUICK ACTIONS */}
        {!isLoading && servisUser ? (
          <View style={s.qaRow}>
            <TouchableOpacity
              style={[s.qaCard, { backgroundColor: theme.surface, borderColor: isPremium ? GOLD + '70' : GOLD + '40' }]}
              onPress={() => navigation.navigate('Plan')}
              activeOpacity={0.8}
            >
              <LinearGradient colors={isPremium ? [GOLD, '#B8923A'] : [NAVY, NAVY2]} style={s.qaIcon}>
                <Icon name={isPremium ? 'star' : 'star-outline'} size={22} color={isPremium ? NAVY : GOLD} />
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={[s.qaTxt, { color: theme.text }]}>Planım</Text>
                {isPremium && <Text style={{ fontSize: 10, color: GOLD, fontWeight: '700', marginTop: 1 }}>Pro Aktif</Text>}
              </View>
              <Text style={[s.qaArrow, { color: theme.textSecondary }]}>›</Text>
            </TouchableOpacity>

            {(company?.plan === 'takim' || premiumTier === 'takim') && isOwner && (
              <TouchableOpacity
                style={[s.qaCard, { backgroundColor: theme.surface, borderColor: '#05966930' }]}
                onPress={() => navigation.navigate('TeamMembers')}
                activeOpacity={0.8}
              >
                <LinearGradient colors={['#059669', '#10B981']} style={s.qaIcon}>
                  <Icon name="account-group-outline" size={22} color="#fff" />
                </LinearGradient>
                <Text style={[s.qaTxt, { color: theme.text }]}>Takım</Text>
                <Text style={[s.qaArrow, { color: theme.textSecondary }]}>›</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[s.qaCard, { backgroundColor: theme.surface, borderColor: NAVY + '50' }]}
              onPress={() => navigation.navigate('CompanySelect')}
              activeOpacity={0.8}
            >
              <LinearGradient colors={[NAVY, NAVY2]} style={s.qaIcon}>
                <Icon name="swap-horizontal" size={22} color={GOLD} />
              </LinearGradient>
              <Text style={[s.qaTxt, { color: theme.text }]}>İşletme</Text>
              <Text style={[s.qaArrow, { color: theme.textSecondary }]}>›</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={s.guestCol}>
            <TouchableOpacity
              style={[s.loginCard, { backgroundColor: theme.surface, borderColor: GOLD + '40' }]}
              onPress={() => navigation.navigate('Auth')}
              activeOpacity={0.85}
            >
              <LinearGradient colors={[NAVY, NAVY2]} style={s.loginIcon}>
                <Icon name="lock-open-outline" size={24} color={GOLD} />
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={[s.loginTitle, { color: theme.text }]}>Giriş Yap / Kayıt Ol</Text>
                <Text style={[s.loginSub, { color: theme.textSecondary }]}>Hesap aç, şirketini yönet</Text>
              </View>
              <Text style={[s.qaArrow, { color: GOLD, fontSize: 22 }]}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.loginCard, { backgroundColor: theme.surface, borderColor: GOLD + '25' }]}
              onPress={showBireyselPaywall}
              activeOpacity={0.85}
            >
              <LinearGradient colors={[GOLD, '#B8923A']} style={s.loginIcon}>
                <Icon name="star" size={22} color={NAVY} />
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={[s.loginTitle, { color: theme.text }]}>Bireysel Premium</Text>
                <Text style={[s.loginSub, { color: theme.textSecondary }]}>Kişisel kullanım için premium paket</Text>
              </View>
              <Text style={[s.qaArrow, { color: GOLD, fontSize: 22 }]}>›</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ŞİRKET PROFİLİ */}
        <SectionLabel label="ŞİRKET PROFİLİ" color={GOLD} />
        <View style={[s.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[s.profileRow, { borderBottomColor: theme.border }]}>
            <TouchableOpacity onPress={pickLogo} activeOpacity={0.8}
              style={[s.miniLogo, { backgroundColor: theme.surface2, borderColor: theme.border }]}>
              {profileLogo
                ? <Image source={{ uri: profileLogo.uri }} style={s.miniLogoImg} />
                : <Icon name="office-building-outline" size={24} color={GOLD} />
              }
              <View style={[s.miniLogoBadge, { backgroundColor: GOLD }]}>
                <Icon name="plus" size={12} color="#fff" />
              </View>
            </TouchableOpacity>
            <View style={{ flex: 1, gap: 6 }}>
              <TextInput
                style={[s.profileInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface2 }]}
                value={profileName}
                onChangeText={setProfileName}
                placeholder="Şirket / Garaj adı"
                placeholderTextColor={theme.textSecondary}
              />
              {profileLogo && (
                <TouchableOpacity onPress={() => setProfileLogo(null)}>
                  <Text style={{ color: '#EF4444', fontSize: 12, fontWeight: '600' }}>✕  Logoyu Kaldır</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={[s.saveBtn, { backgroundColor: isUpToDate ? '#059669' : GOLD, opacity: profileSaving ? 0.7 : 1 }]}
            onPress={handleSaveProfile}
            disabled={profileSaving}
            activeOpacity={0.85}
          >
            {profileSaving
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={s.saveBtnTxt}>{isUpToDate ? '✓  Güncel' : 'Profili Kaydet'}</Text>
            }
          </TouchableOpacity>
        </View>

        {/* TERCİHLER */}
        <SectionLabel label="TERCİHLER" color={GOLD} />
        <View style={[s.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Row
            iconEl={
              <IBox bg={isDark ? 'rgba(232,201,122,0.15)' : 'rgba(201,168,76,0.15)'}>
                <Icon name={isDark ? 'weather-sunny' : 'moon-waning-crescent'} size={20}
                  color={isDark ? GOLD_L : GOLD} />
              </IBox>
            }
            label={isDark ? 'Açık Tema' : 'Koyu Tema'}
            rightEl={
              <Switch
                value={isDark} onValueChange={toggleTheme}
                trackColor={{ false: '#d1d5db', true: GOLD }}
                thumbColor="#fff"
                style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
              />
            }
          />
          <Row
            iconEl={<IBox bg="rgba(201,168,76,0.12)"><Icon name="target" size={20} color={GOLD} /></IBox>}
            label="Tutorial'ı Sıfırla"
            onPress={resetTutorial}
          />
          <Row
            iconEl={<IBox bg="rgba(61,186,124,0.15)"><Icon name="hand-wave-outline" size={20} color="#3DBA7C" /></IBox>}
            label="Karşılama Ekranını Sıfırla"
            onPress={resetOnboarding}
            last
          />
        </View>

        {/* HAKKINDA */}
        <SectionLabel label="HAKKINDA" color={GOLD} />
        <View style={[s.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Row
            iconEl={<IBox bg="rgba(15,23,42,0.10)"><Icon name="cellphone" size={20} color={NAVY2} /></IBox>}
            label="Versiyon"
            value={APP_VERSION}
          />
          <Row
            iconEl={<IBox bg="rgba(201,168,76,0.15)"><Icon name="lightning-bolt" size={20} color={GOLD} /></IBox>}
            label="AlhazenPDF"
            value="Pro Yönetim"
            last
          />
        </View>

        {/* KEŞFET */}
        <View style={[s.discoverCard, { backgroundColor: isDark ? '#0E1020' : '#F8F6EF', borderColor: GOLD + '35' }]}>
          <View style={s.discoverTop}>
            <LinearGradient colors={[NAVY, NAVY2]} style={s.discoverIconBox}>
              <Icon name="lightning-bolt" size={24} color={GOLD} />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={[s.discoverTitle, { color: theme.text }]}>Gücü Keşfet</Text>
              <Text style={[s.discoverSub, { color: theme.textSecondary }]}>Made with ♥ by Alhazen · Aktekno</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[s.discoverBtn, { backgroundColor: GOLD }]}
            onPress={() => Linking.openURL('https://www.instagram.com/alhazencode')}
            activeOpacity={0.85}
          >
            <Text style={s.discoverBtnTxt}>Instagram'da Takip Et  →</Text>
          </TouchableOpacity>
        </View>

        {/* TEHLİKELİ ALAN */}
        {servisUser && (
          <>
            <SectionLabel label="TEHLİKELİ ALAN" color="#EF4444" />
            <View style={[s.card, { backgroundColor: theme.surface, borderColor: '#EF444425' }]}>
              <Row
                iconEl={<IBox bg="rgba(239,68,68,0.10)"><Icon name="logout-variant" size={20} color="#EF4444" /></IBox>}
                label="Çıkış Yap"
                onPress={handleSignOut}
                danger
              />
              <Row
                iconEl={<IBox bg="rgba(239,68,68,0.10)"><Icon name="delete-outline" size={20} color="#EF4444" /></IBox>}
                label="Hesabı Kalıcı Olarak Sil"
                onPress={handleDeleteAccount}
                danger
                last
              />
            </View>
          </>
        )}

        <View style={{ height: 56 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },

  /* Hero */
  hero: { paddingBottom: 32 },
  heroNav: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingBottom: 10,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  vChip: {
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.15)',
  },
  vChipTxt: { fontSize: 12, fontWeight: '700', color: '#fff' },
  heroBody: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 8, gap: 8 },
  avatarWrap: { position: 'relative', marginBottom: 4 },
  avatarImg: { width: 84, height: 84, borderRadius: 42, borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)' },
  avatarFallback: {
    width: 84, height: 84, borderRadius: 42,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarInitial: { fontSize: 36, fontWeight: '800', color: '#fff' },
  avatarEditDot: {
    position: 'absolute', bottom: 2, right: 2,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: GOLD,
    borderWidth: 2, borderColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  heroName: { fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: -0.5, textAlign: 'center' },
  heroBadgeRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  heroTypeBadge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.18)',
  },
  heroTypeTxt: { color: '#fff', fontSize: 12, fontWeight: '700' },
  heroPlanBadge: {
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
  },
  heroPlanTxt: { color: '#fff', fontSize: 12, fontWeight: '700' },
  heroEmail: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 },

  /* Guest hero */
  heroLockCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  heroGuestTitle: { fontSize: 20, fontWeight: '800', color: '#fff' },
  heroGuestSub: { fontSize: 13, color: 'rgba(255,255,255,0.65)' },

  /* Quick actions */
  qaRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingTop: 16 },
  guestCol: { flexDirection: 'column', gap: 10, paddingHorizontal: 16, paddingTop: 16 },
  qaCard: {
    flex: 1, borderRadius: 16, borderWidth: 1,
    padding: 12, alignItems: 'center', gap: 6,
  },
  qaIcon: {
    width: 44, height: 44, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  qaTxt: { fontSize: 12, fontWeight: '700', textAlign: 'center' },
  qaArrow: { fontSize: 16, fontWeight: '300' },

  /* Login card */
  loginCard: {
    flex: 1, borderRadius: 16, borderWidth: 1,
    padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  loginIcon: {
    width: 50, height: 50, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  loginTitle: { fontSize: 15, fontWeight: '700' },
  loginSub: { fontSize: 12, marginTop: 2 },

  /* Section label */
  sectionRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginTop: 24, marginBottom: 8, marginHorizontal: 20,
  },
  sectionAccent: { width: 3, height: 14, borderRadius: 2 },
  sectionTxt: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2, color: '#888' },

  /* Card */
  card: { marginHorizontal: 16, borderRadius: 18, borderWidth: 1, overflow: 'hidden' },

  /* Settings row */
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14, gap: 14,
  },
  iconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: '500' },
  rowArrow: { fontSize: 20, fontWeight: '300' },
  rowValue: { fontSize: 13, fontWeight: '600' },

  /* Profile edit */
  profileRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    padding: 16, borderBottomWidth: 1,
  },
  miniLogo: {
    width: 60, height: 60, borderRadius: 16, borderWidth: 1.5, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center', position: 'relative', flexShrink: 0,
  },
  miniLogoImg: { width: 60, height: 60, borderRadius: 16 },
  miniLogoBadge: {
    position: 'absolute', bottom: -4, right: -4,
    width: 20, height: 20, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  profileInput: {
    borderWidth: 1, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 11, fontSize: 15,
  },
  saveBtn: {
    margin: 12, borderRadius: 14, paddingVertical: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  saveBtnTxt: { color: '#fff', fontSize: 14, fontWeight: '700' },

  /* Discover */
  discoverCard: {
    marginHorizontal: 16, marginTop: 24,
    borderRadius: 20, borderWidth: 1, padding: 18, gap: 14,
  },
  discoverTop: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  discoverIconBox: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  discoverTitle: { fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
  discoverSub: { fontSize: 12, marginTop: 2 },
  discoverBtn: { borderRadius: 14, paddingVertical: 13, alignItems: 'center' },
  discoverBtnTxt: { color: '#fff', fontSize: 14, fontWeight: '700', letterSpacing: 0.3 },
});
