import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ActivityIndicator, StatusBar, ScrollView, Alert,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import supabase from '../utils/supabaseClient';
import Icon from '../components/Icon';

export default function TeknikServisScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('giris');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [garajAdi, setGarajAdi] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [kvkkChecked, setKvkkChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('E-posta ve şifre gerekli.');
      return;
    }
    setSubmitting(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setSubmitting(false);
    if (err) {
      if (err.message === 'Invalid login credentials') {
        setError('E-posta veya şifre hatalı.');
      } else if (err.message === 'Email not confirmed') {
        setError('');
        setInfo('E-postanız henüz doğrulanmadı. Gelen kutunuzu kontrol edin, onay bağlantısına tıklayın.');
      } else {
        setError(err.message);
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Önce e-posta adresinizi girin.');
      return;
    }
    setSubmitting(true);
    setError('');
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: 'https://alhazenpdf.com',
    });
    setSubmitting(false);
    if (err) {
      setError(err.message);
    } else {
      setInfo('Şifre sıfırlama bağlantısı e-postanıza gönderildi. Kontrol edin.');
    }
  };

  const handleRegister = async () => {
    if (!garajAdi.trim()) { setError('Garaj adı gerekli.'); return; }
    if (!email.trim()) { setError('E-posta gerekli.'); return; }
    if (password.length < 6) { setError('Şifre en az 6 karakter olmalı.'); return; }
    if (!kvkkChecked) { setError('Devam etmek için beyanı onaylamanız gerekiyor.'); return; }
    setSubmitting(true);
    setError('');
    setInfo('');
    const { data, error: err } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          garaj_adi: garajAdi.trim(),
          kvkk_accepted: true,
          kvkk_accepted_at: new Date().toISOString(),
          kvkk_version: '1.0',
        },
      },
    });
    setSubmitting(false);
    if (err) { setError(err.message); return; }
    if (data.user && !data.session) {
      setInfo('E-posta adresinize gönderilen onay bağlantısına tıklayın, ardından giriş yapın.');
      setTab('giris');
    }
  };

  const handleLogout = () => {
    Alert.alert('Çıkış Yap', 'Hesabınızdan çıkmak istiyor musunuz?', [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Çıkış Yap', style: 'destructive',
        onPress: () => supabase.auth.signOut(),
      },
    ]);
  };

  const garajAdiDisplay = user?.user_metadata?.garaj_adi
    || user?.email?.split('@')[0]
    || 'Garaj';

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#C9A84C" size="large" />
      </View>
    );
  }

  if (!user) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <StatusBar barStyle="light-content" backgroundColor="#0d0f14" />

        <View style={[styles.nav, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity style={styles.navBtn} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={18} color="#EEF0F6" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Teknik Servis</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.authContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brandBlock}>
            <Text style={styles.brandLogo}>
              Alhazen<Text style={styles.brandGold}>PDF</Text>
            </Text>
            <View style={styles.brandBadge}>
              <Text style={styles.brandBadgeTxt}>TEKNİK SERVİS</Text>
            </View>
            <Text style={styles.brandDesc}>
              Araç bakım kayıtları buluta senkronize edilir.{'\n'}QR kod ile müşterilerinizle paylaşın.
            </Text>
          </View>

          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, tab === 'giris' && styles.tabActive]}
              onPress={() => { setTab('giris'); setError(''); setInfo(''); setKvkkChecked(false); }}
            >
              <Text style={[styles.tabTxt, tab === 'giris' && styles.tabTxtActive]}>Giriş Yap</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, tab === 'kayit' && styles.tabActive]}
              onPress={() => { setTab('kayit'); setError(''); setInfo(''); }}
            >
              <Text style={[styles.tabTxt, tab === 'kayit' && styles.tabTxtActive]}>Kayıt Ol</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formCard}>
            {tab === 'kayit' && (
              <>
                <Text style={styles.formLabel}>GARAJ ADI</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Yılmaz Oto Servis"
                  placeholderTextColor="#4b5563"
                  value={garajAdi}
                  onChangeText={setGarajAdi}
                />
              </>
            )}

            <Text style={styles.formLabel}>E-POSTA</Text>
            <TextInput
              style={styles.formInput}
              placeholder="garaj@email.com"
              placeholderTextColor="#4b5563"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={[styles.formLabel, { marginTop: 14 }]}>ŞİFRE</Text>
            <TextInput
              style={styles.formInput}
              placeholder={tab === 'kayit' ? 'En az 6 karakter' : '••••••••'}
              placeholderTextColor="#4b5563"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {tab === 'kayit' && (
              <TouchableOpacity
                style={styles.kvkkRow}
                onPress={() => setKvkkChecked(v => !v)}
                activeOpacity={0.8}
              >
                <View style={[styles.kvkkBox, kvkkChecked && styles.kvkkBoxChecked]}>
                  {kvkkChecked && <Text style={styles.kvkkCheck}>✓</Text>}
                </View>
                <Text style={styles.kvkkTxt}>
                  Sisteme girdiğim müşteri adı, telefon ve şirket bilgilerinin doğruluğundan ve hukuki sorumluluğundan şahsım/şirketim mesuldür. Kayıt altına alınan bakım ve işlemlerin fiilen gerçekleştirildiğini teyit ederim. AlhazenPDF, kullanıcılar tarafından girilen verilerin doğruluğundan ve üçüncü kişilere karşı korunmasından sorumlu tutulamaz.
                </Text>
              </TouchableOpacity>
            )}

            {!!error && <Text style={styles.errorTxt}>{error}</Text>}
            {!!info && <Text style={styles.infoTxt}>{info}</Text>}

            <TouchableOpacity
              style={[styles.submitBtn, (submitting || (tab === 'kayit' && !kvkkChecked)) && { opacity: 0.5 }]}
              onPress={tab === 'giris' ? handleLogin : handleRegister}
              disabled={submitting || (tab === 'kayit' && !kvkkChecked)}
              activeOpacity={0.8}
            >
              {submitting
                ? <ActivityIndicator color="#060810" size="small" />
                : <Text style={styles.submitBtnTxt}>
                    {tab === 'giris' ? 'Giriş Yap' : 'Garajı Kaydet'}
                  </Text>
              }
            </TouchableOpacity>

            {tab === 'giris' && (
              <TouchableOpacity
                style={styles.forgotBtn}
                onPress={handleForgotPassword}
                disabled={submitting}
              >
                <Text style={styles.forgotTxt}>Şifremi unuttum</Text>
              </TouchableOpacity>
            )}

            {tab === 'kayit' && (
              <Text style={styles.noteText}>Kayıt ücretsiz ve anında onaylanır.</Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0f14" />

      <View style={styles.nav}>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={18} color="#EEF0F6" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.navTitle}>Teknik Servis</Text>
          <Text style={styles.navSub} numberOfLines={1}>{garajAdiDisplay}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutTxt}>Çıkış</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.hubContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeIconWrap}>
            <Icon name="wrench" size={22} color="#C9A84C" />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.welcomeGaraj} numberOfLines={1}>{garajAdiDisplay}</Text>
            <Text style={styles.welcomeEmail} numberOfLines={1}>{user.email}</Text>
          </View>
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeTxt}>● AKTİF</Text>
          </View>
        </View>

        <Text style={styles.hubSectionTitle}>İŞLEMLER</Text>

        <TouchableOpacity
          style={[styles.hubCard, { borderColor: 'rgba(201,168,76,0.35)', backgroundColor: 'rgba(201,168,76,0.07)' }]}
          onPress={() => navigation.navigate('ServisForm')}
          activeOpacity={0.78}
        >
          <View style={[styles.hubIconWrap, { backgroundColor: 'rgba(201,168,76,0.15)', borderColor: 'rgba(201,168,76,0.3)' }]}>
            <Icon name="wrench" size={22} color="#C9A84C" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.hubCardTitle, { color: '#C9A84C' }]}>Servis Kaydı Oluştur</Text>
            <Text style={styles.hubCardDesc}>Araç bilgisi gir · A4 PDF oluştur · QR kodu al</Text>
          </View>
          <Icon name="chevron-right" size={22} color="#C9A84C" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.hubCard, { borderColor: 'rgba(76,175,80,0.35)', backgroundColor: 'rgba(76,175,80,0.07)' }]}
          onPress={() => navigation.navigate('ServisGecmis')}
          activeOpacity={0.78}
        >
          <View style={[styles.hubIconWrap, { backgroundColor: 'rgba(76,175,80,0.15)', borderColor: 'rgba(76,175,80,0.3)' }]}>
            <Icon name="clipboard-text-outline" size={22} color="#4CAF50" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.hubCardTitle, { color: '#4CAF50' }]}>Servis Geçmişi</Text>
            <Text style={styles.hubCardDesc}>Garajınıza ait tüm bakım kayıtlarını görüntüle</Text>
          </View>
          <Icon name="chevron-right" size={22} color="#4CAF50" />
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0f14' },
  center: { flex: 1, backgroundColor: '#0d0f14', alignItems: 'center', justifyContent: 'center' },

  nav: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingTop: 52, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  navBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#1e2330', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  navBtnTxt: { fontSize: 16, color: '#EEF0F6' },
  navTitle: { fontSize: 16, fontWeight: '700', color: '#EEF0F6', letterSpacing: -0.3 },
  navSub: { fontSize: 11, color: '#9ca3af', marginTop: 1 },
  logoutBtn: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8,
    backgroundColor: 'rgba(220,38,38,0.1)', borderWidth: 1, borderColor: 'rgba(220,38,38,0.25)',
  },
  logoutTxt: { fontSize: 12, fontWeight: '600', color: '#dc2626' },

  authContent: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 48 },

  brandBlock: { alignItems: 'center', marginBottom: 36 },
  brandLogo: { fontSize: 28, fontWeight: '800', color: '#EEF0F6', letterSpacing: -0.5 },
  brandGold: { color: '#C9A84C' },
  brandBadge: {
    marginTop: 8, paddingHorizontal: 14, paddingVertical: 4, borderRadius: 100,
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.35)', backgroundColor: 'rgba(201,168,76,0.1)',
  },
  brandBadgeTxt: { fontSize: 10, fontWeight: '700', color: '#C9A84C', letterSpacing: 3 },
  brandDesc: { marginTop: 16, fontSize: 13, color: '#6b7280', textAlign: 'center', lineHeight: 20 },

  tabs: {
    flexDirection: 'row', borderRadius: 12, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 20, backgroundColor: '#161a23',
  },
  tab: { flex: 1, paddingVertical: 11, alignItems: 'center' },
  tabActive: { backgroundColor: 'rgba(201,168,76,0.15)' },
  tabTxt: { fontSize: 14, fontWeight: '600', color: '#4b5563' },
  tabTxtActive: { color: '#C9A84C' },

  formCard: {
    backgroundColor: '#161a23', borderRadius: 16, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)', padding: 20,
  },
  formLabel: { fontSize: 10, fontWeight: '700', color: '#6b7280', letterSpacing: 2, marginBottom: 6 },
  formInput: {
    backgroundColor: '#0d0f14', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11,
    fontSize: 14, color: '#EEF0F6', marginBottom: 14,
  },
  errorTxt: { fontSize: 12, color: '#ef4444', marginBottom: 12, textAlign: 'center' },
  infoTxt: { fontSize: 12, color: '#C9A84C', marginBottom: 12, textAlign: 'center', lineHeight: 18 },
  submitBtn: {
    backgroundColor: '#C9A84C', borderRadius: 12, paddingVertical: 14,
    alignItems: 'center', justifyContent: 'center', marginTop: 4,
  },
  submitBtnTxt: { fontSize: 15, fontWeight: '700', color: '#060810', letterSpacing: 0.3 },
  noteText: { fontSize: 11, color: '#6b7280', textAlign: 'center', marginTop: 12, lineHeight: 16 },
  forgotBtn: { alignItems: 'center', paddingTop: 14 },
  forgotTxt: { fontSize: 12, color: '#6b7280', textDecorationLine: 'underline' },

  kvkkRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    marginBottom: 14, marginTop: 4,
  },
  kvkkBox: {
    width: 20, height: 20, borderRadius: 5, borderWidth: 1.5,
    borderColor: 'rgba(201,168,76,0.4)', backgroundColor: 'rgba(201,168,76,0.05)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
  },
  kvkkBoxChecked: {
    backgroundColor: '#C9A84C', borderColor: '#C9A84C',
  },
  kvkkCheck: { fontSize: 12, fontWeight: '900', color: '#060810' },
  kvkkTxt: { flex: 1, fontSize: 10, color: '#6b7280', lineHeight: 15 },

  hubContent: { padding: 20, gap: 14 },

  welcomeCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#161a23', borderRadius: 16, borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.2)', padding: 18, marginBottom: 6,
  },
  welcomeIconWrap: {
    width: 48, height: 48, borderRadius: 12, flexShrink: 0,
    backgroundColor: 'rgba(201,168,76,0.12)', borderWidth: 1, borderColor: 'rgba(201,168,76,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  welcomeIcon: { fontSize: 22 },
  welcomeGaraj: { fontSize: 16, fontWeight: '700', color: '#EEF0F6', marginBottom: 2 },
  welcomeEmail: { fontSize: 11, color: '#6b7280' },
  activeBadge: {
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 100, flexShrink: 0,
    backgroundColor: 'rgba(76,175,80,0.12)', borderWidth: 1, borderColor: 'rgba(76,175,80,0.3)',
  },
  activeBadgeTxt: { fontSize: 9, fontWeight: '700', color: '#4CAF50', letterSpacing: 1 },

  hubSectionTitle: { fontSize: 9, fontWeight: '700', color: '#4b5563', letterSpacing: 3, marginTop: 4 },

  hubCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderRadius: 16, borderWidth: 1, padding: 18,
  },
  hubIconWrap: {
    width: 48, height: 48, borderRadius: 12, borderWidth: 1, flexShrink: 0,
    alignItems: 'center', justifyContent: 'center',
  },
  hubIcon: { fontSize: 22 },
  hubCardTitle: { fontSize: 15, fontWeight: '700', marginBottom: 3 },
  hubCardDesc: { fontSize: 12, color: '#6b7280', lineHeight: 17 },
  hubArrow: { fontSize: 22, fontWeight: '600', paddingLeft: 4 },
});
