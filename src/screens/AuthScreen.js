import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, StatusBar, Alert, ActivityIndicator,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../themes/colors';
import supabase from '../utils/supabaseClient';
import { ACTIVE_CO_KEY } from './CompanySelectScreen';
import Icon from '../components/Icon';

const GOLD  = '#C9A84C';
const NAVY  = '#0F172A';
const NAVY2 = '#1A2744';

const TYPE_OPTIONS = [
  { key: 'galeri',        icon: 'car-outline',        label: 'Galeri' },
  { key: 'teknik_servis', icon: 'tools',               label: 'Servis' },
  { key: 'emlak',         icon: 'home-city-outline',   label: 'Emlak'  },
];

function translateError(msg) {
  if (!msg) return 'Bilinmeyen hata.';
  if (msg.includes('Invalid login credentials')) return 'Email veya şifre hatalı.';
  if (msg.includes('Email not confirmed')) return 'Email adresinizi doğrulayın ve tekrar deneyin.';
  if (msg.includes('User already registered')) return 'Bu email zaten kayıtlı. Giriş yapmayı deneyin.';
  if (msg.includes('Password should be')) return 'Şifre en az 6 karakter olmalı.';
  if (msg.includes('Unable to validate')) return 'Geçersiz email adresi.';
  return msg;
}

export default function AuthScreen({ navigation }) {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  const insets = useSafeAreaInsets();

  const [mode, setMode]                     = useState('login');
  const [email, setEmail]                   = useState('');
  const [password, setPassword]             = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [firmaAdi, setFirmaAdi]             = useState('');
  const [isletmeTipi, setIsletmeTipi]       = useState('galeri');
  const [loading, setLoading]               = useState(false);
  const [err, setErr]                       = useState('');

  const switchMode = (m) => { setMode(m); setErr(''); };

  const handleLogin = async () => {
    setErr('');
    if (!email.trim() || !password) { setErr('Email ve şifre zorunludur.'); return; }
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) { setLoading(false); setErr(translateError(error.message)); return; }

    if (data.user?.email) {
      await supabase
        .from('company_members')
        .update({ accepted_at: new Date().toISOString() })
        .eq('email', data.user.email)
        .is('accepted_at', null);
    }

    setLoading(false);
    navigation.goBack();
  };

  const handleRegister = async () => {
    setErr('');
    if (!firmaAdi.trim()) { setErr('İşletme adı zorunludur.'); return; }
    if (!email.trim()) { setErr('Email zorunludur.'); return; }
    if (password.length < 6) { setErr('Şifre en az 6 karakter olmalı.'); return; }
    if (password !== passwordRepeat) { setErr('Şifreler eşleşmiyor.'); return; }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: { data: { firma_adi: firmaAdi.trim() } },
    });

    if (error) { setLoading(false); setErr(translateError(error.message)); return; }

    if (data.user) {
      const { data: co } = await supabase.from('companies').insert({
        owner_id: data.user.id,
        name: firmaAdi.trim(),
        type: isletmeTipi,
        plan: 'free',
      }).select().maybeSingle();
      if (co) {
        const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
        await AsyncStorage.setItem(ACTIVE_CO_KEY, co.id);
      } else {
        // insert başarılı ama select dönemedi — fallback sorgu
        const { data: fallback } = await supabase.from('companies')
          .select('id').eq('owner_id', data.user.id).order('created_at', { ascending: false }).limit(1).maybeSingle();
        if (fallback) {
          const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
          await AsyncStorage.setItem(ACTIVE_CO_KEY, fallback.id);
        }
      }
    }

    setLoading(false);

    if (!data.session) {
      Alert.alert(
        'Email Doğrulama',
        'Hesabınız oluşturuldu. Email adresinize gelen doğrulama linkine tıklayın, ardından giriş yapın.',
        [{ text: 'Tamam', onPress: () => switchMode('login') }]
      );
    } else {
      Alert.alert(
        'Hoş Geldiniz!',
        'Hesabınız başarıyla oluşturuldu.',
        [{ text: 'Tamam', onPress: () => navigation.goBack() }]
      );
    }
  };

  const firmaPlaceholder = isletmeTipi === 'galeri'
    ? 'Örn: Aktürk Oto Galeri'
    : isletmeTipi === 'emlak'
    ? 'Örn: Aktürk Emlak Ofisi'
    : 'Örn: Aktürk Teknik Servis';

  const fieldStyle = [styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface2 }];

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        {/* Header */}
        <LinearGradient colors={[NAVY, NAVY2]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>İşletme Hesabı</Text>
            <Text style={styles.headerSub}>AlhazenPDF · Pro Yönetim</Text>
          </View>
          <View style={styles.lockBadge}>
            <Icon name="lock-outline" size={22} color={GOLD} />
          </View>
        </LinearGradient>

        {/* Tabs */}
        <View style={[styles.tabs, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
          {[['login', 'Giriş Yap'], ['register', 'Kayıt Ol']].map(([key, label]) => (
            <TouchableOpacity key={key} style={styles.tabBtn} onPress={() => switchMode(key)}>
              <Text style={[styles.tabTxt, { color: mode === key ? GOLD : theme.textSecondary }]}>{label}</Text>
              {mode === key && <View style={styles.tabLine} />}
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.form}>

            {mode === 'register' && (
              <>
                {/* İşletme Türü */}
                <View style={styles.field}>
                  <Text style={[styles.fieldLbl, { color: theme.textSecondary }]}>İŞLETME TÜRÜ</Text>
                  <View style={[styles.typeRow, { backgroundColor: isDark ? '#0d0f14' : '#f3f4f6', borderColor: theme.border }]}>
                    {TYPE_OPTIONS.map(({ key, icon, label }) => {
                      const active = isletmeTipi === key;
                      return (
                        <TouchableOpacity
                          key={key}
                          style={[styles.typeBtn, active && { backgroundColor: NAVY }]}
                          onPress={() => setIsletmeTipi(key)}
                        >
                          <Icon name={icon} size={18} color={active ? GOLD : theme.textSecondary} />
                          <Text style={[styles.typeLbl, { color: active ? GOLD : theme.textSecondary }]}>{label}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* İşletme Adı */}
                <View style={styles.field}>
                  <Text style={[styles.fieldLbl, { color: theme.textSecondary }]}>İŞLETME ADI</Text>
                  <TextInput
                    style={fieldStyle} value={firmaAdi} onChangeText={setFirmaAdi}
                    placeholder={firmaPlaceholder}
                    placeholderTextColor={theme.textSecondary}
                  />
                </View>
              </>
            )}

            <View style={styles.field}>
              <Text style={[styles.fieldLbl, { color: theme.textSecondary }]}>E-POSTA</Text>
              <TextInput
                style={fieldStyle} value={email} onChangeText={setEmail}
                placeholder="ornek@mail.com"
                placeholderTextColor={theme.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.field}>
              <Text style={[styles.fieldLbl, { color: theme.textSecondary }]}>ŞİFRE</Text>
              <TextInput
                style={fieldStyle} value={password} onChangeText={setPassword}
                placeholder={mode === 'register' ? 'En az 6 karakter' : '••••••'}
                placeholderTextColor={theme.textSecondary}
                secureTextEntry
              />
            </View>

            {mode === 'register' && (
              <View style={styles.field}>
                <Text style={[styles.fieldLbl, { color: theme.textSecondary }]}>ŞİFRE TEKRAR</Text>
                <TextInput
                  style={fieldStyle} value={passwordRepeat} onChangeText={setPasswordRepeat}
                  placeholder="Şifreyi tekrar girin"
                  placeholderTextColor={theme.textSecondary}
                  secureTextEntry
                />
              </View>
            )}

            {err ? <Text style={styles.errTxt}>{err}</Text> : null}

            <TouchableOpacity
              style={[styles.btn, { opacity: loading ? 0.7 : 1 }]}
              onPress={mode === 'login' ? handleLogin : handleRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.btnTxt}>{mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}</Text>
              }
            </TouchableOpacity>

            {mode === 'login' && (
              <TouchableOpacity onPress={() => switchMode('register')} style={{ alignItems: 'center', marginTop: 16 }}>
                <Text style={[styles.switchTxt, { color: theme.textSecondary }]}>
                  Hesabınız yok mu? <Text style={{ color: GOLD, fontWeight: '700' }}>Kayıt Olun →</Text>
                </Text>
              </TouchableOpacity>
            )}

          </View>
          <View style={{ height: 80 }} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingBottom: 18 },
  backBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: -0.5 },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },
  lockBadge: { width: 42, height: 42, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },

  tabs: { flexDirection: 'row', borderBottomWidth: 1 },
  tabBtn: { flex: 1, alignItems: 'center', paddingVertical: 13 },
  tabTxt: { fontSize: 14, fontWeight: '600' },
  tabLine: { position: 'absolute', bottom: 0, left: '20%', right: '20%', height: 2, backgroundColor: GOLD, borderRadius: 2 },

  form: { padding: 20, gap: 2 },
  field: { marginBottom: 14 },
  fieldLbl: { fontSize: 9, fontWeight: '800', letterSpacing: 1, marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15 },

  typeRow: { flexDirection: 'row', borderRadius: 12, borderWidth: 1, padding: 4, gap: 4 },
  typeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 9 },
  typeLbl: { fontSize: 13, fontWeight: '700' },

  errTxt: { color: '#EF4444', fontSize: 13, marginBottom: 8, fontWeight: '500' },
  btn: { backgroundColor: GOLD, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  btnTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },

  switchTxt: { fontSize: 13 },
});
