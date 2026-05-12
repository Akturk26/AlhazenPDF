import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, Alert, TextInput, Image, ActivityIndicator, Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../themes/colors';
import { TUTORIAL_KEY } from '../components/TutorialOverlay';
import { ONBOARDING_KEY } from './OnboardingScreen';
import { loadCompanyProfile, saveCompanyProfile } from '../utils/companyProfile';

export default function SettingsScreen({ navigation }) {
  const { isDark, toggleTheme } = useTheme();
  const theme = getTheme(isDark);

  const [profileName, setProfileName] = useState('');
  const [profileLogo, setProfileLogo] = useState(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [savedProfile, setSavedProfile] = useState(null);

  const loadProfile = async () => {
    const p = await loadCompanyProfile();
    if (p) {
      setProfileName(p.name || '');
      setProfileLogo(p.logoUri ? { uri: p.logoUri, base64: p.logoBase64 } : null);
      setSavedProfile(p);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const pickLogo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, aspect: [1, 1], quality: 0.8, base64: true,
      });
      if (!result.canceled) {
        setProfileLogo({ uri: result.assets[0].uri, base64: result.assets[0].base64 });
      }
    } catch {
      Alert.alert('Hata', 'Fotoğraf seçilemedi.');
    }
  };

  const removeLogo = () => {
    setProfileLogo(null);
  };

  const handleSaveProfile = async () => {
    if (!profileName.trim()) {
      Alert.alert('Uyarı', 'Şirket adı boş olamaz.');
      return;
    }
    setProfileSaving(true);
    await saveCompanyProfile({
      name: profileName.trim(),
      logoUri: profileLogo?.uri || null,
      logoBase64: profileLogo?.base64 || null,
    });
    await loadProfile(); // Tekrar yükle
    setProfileSaving(false);
    Alert.alert('✓', 'Şirket profili kaydedildi.');
  };

  // Mevcut değerler kaydedilmiş profille aynı mı?
  const hasChanges = savedProfile && (
    profileName.trim() !== (savedProfile.name || '') ||
    (profileLogo?.uri || null) !== (savedProfile.logoUri || null)
  );
  const isUpToDate = savedProfile && !hasChanges;

  const resetTutorial = async () => {
    try {
      await AsyncStorage.removeItem(TUTORIAL_KEY);
      Alert.alert('Sıfırlandı', 'Uygulamayı kapatıp açın.');
    } catch {
      Alert.alert('Hata', 'Sıfırlanamadı.');
    }
  };

  const resetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_KEY);
      Alert.alert('Sıfırlandı', 'Uygulamayı kapatıp açın.');
    } catch {
      Alert.alert('Hata', 'Sıfırlanamadı.');
    }
  };

  const Row = ({ emoji, label, onPress, danger, value }) => (
    <TouchableOpacity
      style={[styles.row, { borderBottomColor: theme.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.rowEmoji}>{emoji}</Text>
      <Text style={[styles.rowLabel, { color: danger ? '#e05555' : theme.text }]}>{label}</Text>
      {value
        ? <Text style={[styles.rowValue, { color: theme.textSecondary }]}>{value}</Text>
        : <Text style={[styles.rowArrow, { color: theme.textSecondary }]}>›</Text>
      }
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.bg} />

      {/* Nav */}
      <View style={[styles.nav, { borderBottomColor: theme.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, { backgroundColor: theme.surface2, borderColor: theme.border }]}
        >
          <Text style={[styles.backText, { color: theme.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: theme.text }]}>Ayarlar</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* ── Şirket Profili ── */}
        <Text style={[styles.groupLabel, { color: theme.textSecondary }]}>ŞİRKET PROFİLİ</Text>
        <View style={[styles.group, { backgroundColor: theme.surface, borderColor: theme.border }]}>

          {/* Logo */}
          <View style={[styles.logoRow, { borderBottomColor: theme.border }]}>
            <TouchableOpacity onPress={pickLogo} activeOpacity={0.8} style={[styles.logoBox, { backgroundColor: theme.surface2, borderColor: theme.border }]}>
              {profileLogo
                ? <Image source={{ uri: profileLogo.uri }} style={styles.logoImg} />
                : <Text style={styles.logoPlaceholder}>🏢</Text>
              }
            </TouchableOpacity>
            <View style={styles.logoMeta}>
              <Text style={[styles.logoTitle, { color: theme.text }]}>Şirket Logosu</Text>
              <Text style={[styles.logoSub, { color: theme.textSecondary }]}>
                PDF'lerde sol üstte görünür
              </Text>
              <View style={styles.logoActions}>
                <TouchableOpacity onPress={pickLogo} style={[styles.logoBtn, { backgroundColor: theme.blue }]}>
                  <Text style={styles.logoBtnText}>{profileLogo ? 'Değiştir' : 'Yükle'}</Text>
                </TouchableOpacity>
                {profileLogo && (
                  <TouchableOpacity onPress={removeLogo} style={[styles.logoBtn, { backgroundColor: '#e05555' }]}>
                    <Text style={styles.logoBtnText}>Kaldır</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          {/* Şirket adı */}
          <View style={[styles.inputRow, { borderBottomColor: theme.border }]}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Şirket Adı</Text>
            <TextInput
              style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface2 }]}
              value={profileName}
              onChangeText={setProfileName}
              placeholder="Örn: Aktürk Gayrimenkul"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          {/* Kaydet butonu */}
          <TouchableOpacity
            style={[styles.saveBtn, { 
              backgroundColor: isUpToDate ? '#3DBA7C' : theme.blue,
              opacity: profileSaving ? 0.7 : 1
            }]}
            onPress={handleSaveProfile}
            activeOpacity={0.8}
            disabled={profileSaving}
          >
            {profileSaving
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={styles.saveBtnText}>
                  {isUpToDate ? '✓ Güncel' : 'Profili Kaydet'}
                </Text>
            }
          </TouchableOpacity>

        </View>

        {/* ── Görünüm ── */}
        <Text style={[styles.groupLabel, { color: theme.textSecondary }]}>GÖRÜNÜM</Text>
        <View style={[styles.group, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Row
            emoji={isDark ? '☀️' : '🌙'}
            label={isDark ? 'Açık Temaya Geç' : 'Koyu Temaya Geç'}
            onPress={toggleTheme}
          />
        </View>

        {/* ── Uygulama ── */}
        <Text style={[styles.groupLabel, { color: theme.textSecondary }]}>UYGULAMA</Text>
        <View style={[styles.group, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Row emoji="🎯" label="Tutorial'ı Sıfırla" onPress={resetTutorial} />
          <Row emoji="👋" label="Karşılama Ekranını Sıfırla" onPress={resetOnboarding} />
        </View>

        {/* ── Hakkında ── */}
        <Text style={[styles.groupLabel, { color: theme.textSecondary }]}>HAKKINDA</Text>
        <View style={[styles.group, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.row, { borderBottomColor: theme.border }]}>
            <Text style={styles.rowEmoji}>📱</Text>
            <Text style={[styles.rowLabel, { color: theme.text }]}>Versiyon</Text>
            <Text style={[styles.rowValue, { color: theme.textSecondary }]}>1.0.40</Text>
          </View>
          <View style={[styles.row, { borderBottomWidth: 0 }]}>
            <Text style={styles.rowEmoji}>✨</Text>
            <Text style={[styles.rowLabel, { color: theme.text }]}>AlhazenPDF</Text>
            <Text style={[styles.rowValue, { color: '#c9a84c' }]}>Premium</Text>
          </View>
        </View>

        {/* ── Gücü Keşfet ── */}
        <View style={styles.discoverCard}>
          <Text style={[styles.discoverMeta, { color: theme.textSecondary }]}>
            Made with ❤️ by <Text style={{ color: '#4f6ef7', fontWeight: '700' }}>Alhazen · Aktekno</Text>
          </Text>
          <TouchableOpacity
            style={styles.discoverBtn}
            onPress={() => Linking.openURL('https://www.instagram.com/alhazencode')}
            activeOpacity={0.85}
          >
            <Text style={styles.discoverBtnText}>Gücü Keşfet →</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 48 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  nav: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 14,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 12,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  backText: { fontSize: 16 },
  navTitle: { fontSize: 17, fontWeight: '700', letterSpacing: -0.3 },

  scroll: { flex: 1 },

  groupLabel: {
    fontSize: 11, fontWeight: '700', letterSpacing: 0.8,
    marginTop: 24, marginBottom: 6, marginHorizontal: 20,
  },
  group: {
    marginHorizontal: 16, borderRadius: 16, borderWidth: 1,
    overflow: 'hidden',
  },

  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 16,
    borderBottomWidth: 1, gap: 12,
  },
  rowEmoji: { fontSize: 20, width: 28, textAlign: 'center' },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: '500' },
  rowArrow: { fontSize: 20, fontWeight: '300' },
  rowValue: { fontSize: 14, fontWeight: '500' },

  // Logo section
  logoRow: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, gap: 16, borderBottomWidth: 1,
  },
  logoBox: {
    width: 72, height: 72, borderRadius: 16,
    borderWidth: 1, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', flexShrink: 0,
  },
  logoImg: { width: 72, height: 72, borderRadius: 16 },
  logoPlaceholder: { fontSize: 28 },
  logoMeta: { flex: 1, gap: 4 },
  logoTitle: { fontSize: 15, fontWeight: '600' },
  logoSub: { fontSize: 12, lineHeight: 16 },
  logoActions: { flexDirection: 'row', gap: 8, marginTop: 6 },
  logoBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
  logoBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  // Input section
  inputRow: {
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, gap: 8,
  },
  inputLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  input: {
    borderWidth: 1, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 15,
  },

  // Discover card
  discoverCard: {
    marginHorizontal: 16, marginTop: 24,
    alignItems: 'center', gap: 14,
  },
  discoverMeta: { fontSize: 13 },
  discoverBtn: {
    width: '100%', borderRadius: 16,
    backgroundColor: '#4f6ef7',
    paddingVertical: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  discoverBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },

  // Save button
  saveBtn: {
    margin: 12, borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
