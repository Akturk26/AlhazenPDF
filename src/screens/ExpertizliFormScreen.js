import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, StatusBar, Switch, Alert, Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../themes/colors';

const DRAFT_KEY = 'form_draft_expertizli';

const PRESET_DONANIM = [
  'LED Far', 'Geri Kamera', '360° Kamera', 'Keyless', 'CarPlay',
  'Android Auto', 'Cruise Control', 'Şerit Takip', 'Park Sensörü',
  'Isıtmalı Cam', 'Sunroof', 'Deri Döşeme', 'Çift Klima',
  'Çarpışma Uyarısı', 'Akıllı Ayna', 'Navigasyon', 'HUD',
  'Kör Nokta Uyarısı', 'Isıtmalı Koltuk', 'Elektrikli Koltuk',
  'Otomatik Park', 'Yağmur Sensörü', 'Adaptif Hız Sabitleyici',
];

const EMPTY_FORM = {
  Marka: '', Model: '', 'Yıl': '', Motor: '', 'Şanzıman': '', 'Yakıt': '',
  KM: '', Renk: '', Telefon: '', Fiyat: '',
  'Kasa Tipi': '', Muayene: '', Bagaj: '', Garanti: '',
};

export default function ExpertizliFormScreen({ route, navigation }) {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  const [companyName, setCompanyName] = useState('');
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [donanim, setDonanim] = useState([]);
  const [customDonanim, setCustomDonanim] = useState('');
  const [tramer, setTramer] = useState(true);
  const [ekspertizData, setEkspertizData] = useState({});
  const [photoUri, setPhotoUri] = useState(null);

  useEffect(() => {
    loadDraft();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      readEkspertiz();
    });
    return unsubscribe;
  }, [navigation]);

  const loadDraft = async () => {
    try {
      const saved = await AsyncStorage.getItem(DRAFT_KEY);
      if (saved) {
        const d = JSON.parse(saved);
        if (d.companyName) setCompanyName(d.companyName);
        if (d.formData) setFormData({ ...EMPTY_FORM, ...d.formData });
        if (d.donanim) setDonanim(d.donanim);
        if (d.tramer !== undefined) setTramer(d.tramer);
        if (d.ekspertizData) setEkspertizData(d.ekspertizData);
        if (d.photoUri) setPhotoUri(d.photoUri);
      }
    } catch {}
  };

  const readEkspertiz = async () => {
    try {
      const saved = await AsyncStorage.getItem(DRAFT_KEY);
      if (saved) {
        const d = JSON.parse(saved);
        if (d.ekspertizData) setEkspertizData(d.ekspertizData);
      }
    } catch {}
  };

  const saveDraft = useCallback(async (patch = {}) => {
    try {
      await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify({
        companyName, formData, donanim, tramer, ekspertizData, photoUri, ...patch,
      }));
    } catch {}
  }, [companyName, formData, donanim, tramer, ekspertizData, photoUri]);

  useEffect(() => {
    const t = setTimeout(() => saveDraft(), 600);
    return () => clearTimeout(t);
  }, [saveDraft]);

  const setField = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  const toggleDonanim = (item) => {
    setDonanim(prev =>
      prev.includes(item) ? prev.filter(d => d !== item) : [...prev, item]
    );
  };

  const addCustomDonanim = () => {
    const trimmed = customDonanim.trim();
    if (!trimmed || donanim.includes(trimmed)) return;
    setDonanim(prev => [...prev, trimmed]);
    setCustomDonanim('');
  };

  const pickPhoto = async (fromCamera = false) => {
    try {
      const perm = fromCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('İzin Gerekli', 'Fotoğraf eklemek için izin vermeniz gerekiyor.');
        return;
      }
      const result = fromCamera
        ? await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.95 })
        : await ImagePicker.launchImageLibraryAsync({ allowsMultipleSelection: false, quality: 0.95 });
      if (!result.canceled && result.assets?.[0]) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Hata', 'Fotoğraf seçilemedi.');
    }
  };

  const goEkspertiz = async () => {
    await saveDraft();
    navigation.navigate('Expertiz', { categoryId: 'expertizli', ekspertizData });
  };

  const handleDevam = async () => {
    if (!formData['Marka'].trim() || !formData['Model'].trim()) {
      Alert.alert('Eksik Bilgi', 'Lütfen en az Marka ve Model alanlarını doldurun.');
      return;
    }
    await saveDraft();
    navigation.navigate('ExpertizliTemplate', {
      formData,
      companyName,
      donanim,
      tramer,
      ekspertizData,
      photos: photoUri ? [{ uri: photoUri }] : [],
    });
  };

  const clearDraft = () => {
    Alert.alert('Formu Temizle', 'Tüm araç bilgileri, fotoğraf ve hasar verileri silinecek. Emin misin?', [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Temizle', style: 'destructive', onPress: async () => {
          setFormData(EMPTY_FORM);
          setCompanyName('');
          setDonanim([]);
          setTramer(true);
          setEkspertizData({});
          setPhotoUri(null);
          await AsyncStorage.removeItem(DRAFT_KEY);
        },
      },
    ]);
  };

  const markedCount = Object.keys(ekspertizData).length;
  const hasDraft = Object.values(formData).some(Boolean) || companyName || donanim.length || photoUri || markedCount;
  const s = { backgroundColor: isDark ? '#0d0f14' : '#F9FAFB' };

  return (
    <View style={[styles.root, s]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={s.backgroundColor} />

      {/* Nav */}
      <View style={[styles.nav, { borderBottomColor: theme.border, backgroundColor: isDark ? '#0d0f14' : '#fff' }]}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: theme.surface2, borderColor: theme.border }]} onPress={() => navigation.goBack()}>
          <Text style={[styles.backTxt, { color: theme.text }]}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.navTitle, { color: theme.text }]}>Expertizli Satış Kağıdı</Text>
          <Text style={[styles.navSub, { color: theme.textSecondary }]}>Hasar haritası entegre · A4 PDF</Text>
        </View>
        {hasDraft && (
          <TouchableOpacity style={[styles.clearBtn, { backgroundColor: theme.surface2, borderColor: theme.border }]} onPress={clearDraft}>
            <Text style={styles.clearBtnTxt}>🗑</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* ── GALERİ ── */}
        <SectionHeader title="Galeri Bilgileri" icon="🏢" isDark={isDark} theme={theme} />
        <View style={[styles.card, { backgroundColor: isDark ? '#161a23' : '#fff', borderColor: theme.border }]}>
          <FieldRow label="Galeri Adı" value={companyName} onChangeText={setCompanyName} placeholder="Aktürk Premium Motors" theme={theme} isDark={isDark} />
          <FieldRow label="Telefon" value={formData['Telefon']} onChangeText={v => setField('Telefon', v)} placeholder="0542 000 00 00" keyboardType="phone-pad" theme={theme} isDark={isDark} last />
        </View>

        {/* ── FOTOĞRAF ── */}
        <SectionHeader title="Araç Fotoğrafı" icon="📷" isDark={isDark} theme={theme} />
        <View style={[styles.card, { backgroundColor: isDark ? '#161a23' : '#fff', borderColor: photoUri ? theme.blue : theme.border }]}>
          {photoUri ? (
            <View>
              <Image source={{ uri: photoUri }} style={styles.photoPreview} resizeMode="cover" />
              <View style={styles.photoActions}>
                <TouchableOpacity style={[styles.photoActionBtn, { borderColor: theme.border }]} onPress={() => pickPhoto(true)} activeOpacity={0.8}>
                  <Text style={[styles.photoActionTxt, { color: theme.text }]}>📷 Kamera</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.photoActionBtn, { borderColor: theme.border }]} onPress={() => pickPhoto(false)} activeOpacity={0.8}>
                  <Text style={[styles.photoActionTxt, { color: theme.text }]}>🖼️ Değiştir</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.photoActionBtn, { borderColor: theme.border }]} onPress={() => setPhotoUri(null)} activeOpacity={0.8}>
                  <Text style={[styles.photoActionTxt, { color: '#e05555' }]}>✕ Kaldır</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.photoPickRow}>
              <TouchableOpacity style={[styles.photoPickBtn, { backgroundColor: isDark ? '#1e2330' : '#F3F4F6', borderColor: theme.border }]} onPress={() => pickPhoto(true)} activeOpacity={0.8}>
                <Text style={styles.photoPickIcon}>📷</Text>
                <Text style={[styles.photoPickLabel, { color: theme.text }]}>Kamera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.photoPickBtn, styles.photoPickBtnPrimary, { backgroundColor: theme.blue }]} onPress={() => pickPhoto(false)} activeOpacity={0.8}>
                <Text style={styles.photoPickIcon}>🖼️</Text>
                <Text style={[styles.photoPickLabel, { color: '#fff' }]}>Galeriden Seç</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ── ARAÇ BİLGİLERİ ── */}
        <SectionHeader title="Araç Bilgileri" icon="🚗" isDark={isDark} theme={theme} />
        <View style={[styles.card, { backgroundColor: isDark ? '#161a23' : '#fff', borderColor: theme.border }]}>
          <FieldRow2 label1="Marka" val1={formData['Marka']} set1={v => setField('Marka', v)} ph1="OPEL"
                     label2="Model" val2={formData['Model']} set2={v => setField('Model', v)} ph2="Astra" theme={theme} isDark={isDark} />
          <FieldRow2 label1="Yıl" val1={formData['Yıl']} set1={v => setField('Yıl', v)} ph1="2022" keyboardType1="numeric"
                     label2="Yakıt" val2={formData['Yakıt']} set2={v => setField('Yakıt', v)} ph2="Benzin" theme={theme} isDark={isDark} />
          <FieldRow2 label1="Motor" val1={formData['Motor']} set1={v => setField('Motor', v)} ph1="1.4 Turbo 130 PS"
                     label2="Şanzıman" val2={formData['Şanzıman']} set2={v => setField('Şanzıman', v)} ph2="6 İleri Otomatik" theme={theme} isDark={isDark} />
          <FieldRow2 label1="KM" val1={formData['KM']} set1={v => setField('KM', v)} ph1="48.200 km" keyboardType1="numeric"
                     label2="Renk" val2={formData['Renk']} set2={v => setField('Renk', v)} ph2="Pearl Beyaz" theme={theme} isDark={isDark} />
        </View>

        {/* ── EK BİLGİLER ── */}
        <SectionHeader title="Ek Bilgiler" icon="📋" isDark={isDark} theme={theme} />
        <View style={[styles.card, { backgroundColor: isDark ? '#161a23' : '#fff', borderColor: theme.border }]}>
          <FieldRow2 label1="Kasa Tipi" val1={formData['Kasa Tipi']} set1={v => setField('Kasa Tipi', v)} ph1="Sedan · 5 Kapı"
                     label2="Muayene" val2={formData['Muayene']} set2={v => setField('Muayene', v)} ph2="04.2026" theme={theme} isDark={isDark} />
          <FieldRow2 label1="Bagaj" val1={formData['Bagaj']} set1={v => setField('Bagaj', v)} ph1="422 L"
                     label2="Garanti" val2={formData['Garanti']} set2={v => setField('Garanti', v)} ph2="3 Yıl / 100.000 km" theme={theme} isDark={isDark} />
          <FieldRow label="Fiyat" value={formData['Fiyat']} onChangeText={v => setField('Fiyat', v)} placeholder="1.175.000" keyboardType="numeric" theme={theme} isDark={isDark} last />
        </View>

        {/* ── TRAMER ── */}
        <SectionHeader title="Tramer Durumu" icon="🔎" isDark={isDark} theme={theme} />
        <View style={[styles.card, { backgroundColor: isDark ? '#161a23' : '#fff', borderColor: theme.border }]}>
          <View style={styles.tramerRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.tramerLabel, { color: theme.text }]}>{tramer ? '✅ Tramer Kaydı Yok' : '⚠️ Tramer Kaydı Var'}</Text>
              <Text style={[styles.tramerSub, { color: theme.textSecondary }]}>{tramer ? 'Araç temiz sicilli' : 'Hasar kaydı mevcut'}</Text>
            </View>
            <Switch
              value={tramer}
              onValueChange={setTramer}
              trackColor={{ false: '#DC2626', true: '#16A34A' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* ── HASAR & BOYA ── */}
        <SectionHeader title="Hasar & Boya Haritası" icon="🔍" isDark={isDark} theme={theme} />
        <TouchableOpacity
          style={[styles.expertizBtn, { backgroundColor: isDark ? '#161a23' : '#fff', borderColor: markedCount > 0 ? theme.blue : theme.border }]}
          onPress={goEkspertiz}
          activeOpacity={0.8}
        >
          <Text style={styles.expertizIcon}>🗺️</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.expertizTitle, { color: theme.text }]}>Hasar Haritasını Aç</Text>
            <Text style={[styles.expertizSub, { color: theme.textSecondary }]}>
              {markedCount > 0 ? `${markedCount} parça işaretlendi` : 'Araç parçalarını interaktif olarak işaretle'}
            </Text>
          </View>
          <Text style={[styles.expertizArrow, { color: theme.textSecondary }]}>›</Text>
        </TouchableOpacity>

        {/* ── DONANIM ── */}
        <SectionHeader title="Donanım Listesi" icon="⚙️" isDark={isDark} theme={theme} />
        <View style={[styles.card, { backgroundColor: isDark ? '#161a23' : '#fff', borderColor: theme.border }]}>
          <View style={styles.donanimGrid}>
            {PRESET_DONANIM.map(item => {
              const selected = donanim.includes(item);
              return (
                <TouchableOpacity
                  key={item}
                  style={[styles.donChip, {
                    backgroundColor: selected ? theme.blue : (isDark ? '#1e2330' : '#F3F4F6'),
                    borderColor: selected ? theme.blue : theme.border,
                  }]}
                  onPress={() => toggleDonanim(item)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.donChipTxt, { color: selected ? '#fff' : theme.textSecondary }]}>{item}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {donanim.filter(d => !PRESET_DONANIM.includes(d)).length > 0 && (
            <View style={[styles.customChipsRow, { borderTopColor: theme.border }]}>
              {donanim.filter(d => !PRESET_DONANIM.includes(d)).map(item => (
                <TouchableOpacity
                  key={item}
                  style={[styles.donChip, { backgroundColor: theme.blue, borderColor: theme.blue }]}
                  onPress={() => toggleDonanim(item)}
                >
                  <Text style={[styles.donChipTxt, { color: '#fff' }]}>{item} ✕</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <View style={[styles.customInputRow, { borderTopColor: theme.border }]}>
            <TextInput
              style={[styles.customInput, { color: theme.text, borderColor: theme.border, backgroundColor: isDark ? '#1e2330' : '#F9FAFB' }]}
              value={customDonanim}
              onChangeText={setCustomDonanim}
              placeholder="Özel donanım ekle..."
              placeholderTextColor={theme.textSecondary}
              onSubmitEditing={addCustomDonanim}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={[styles.addBtn, { backgroundColor: theme.blue }]}
              onPress={addCustomDonanim}
            >
              <Text style={styles.addBtnTxt}>Ekle</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── DEVAM ── */}
        <TouchableOpacity style={[styles.devamBtn, { backgroundColor: theme.blue }]} onPress={handleDevam} activeOpacity={0.85}>
          <Text style={styles.devamTxt}>Şablon Seç →</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function SectionHeader({ title, icon, theme }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionIcon}>{icon}</Text>
      <Text style={[styles.sectionTitle, { color: '#6b7280' }]}>{title}</Text>
    </View>
  );
}

function FieldRow({ label, value, onChangeText, placeholder, keyboardType, theme, isDark, last }) {
  return (
    <View style={[styles.fieldRow, !last && { borderBottomWidth: 1, borderBottomColor: theme.border }]}>
      <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>{label}</Text>
      <TextInput
        style={[styles.fieldInput, { color: theme.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        keyboardType={keyboardType || 'default'}
      />
    </View>
  );
}

function FieldRow2({ label1, val1, set1, ph1, keyboardType1, label2, val2, set2, ph2, theme }) {
  return (
    <View style={[styles.fieldRow2, { borderBottomWidth: 1, borderBottomColor: theme.border }]}>
      <View style={[styles.fieldHalf, { borderRightWidth: 1, borderRightColor: theme.border }]}>
        <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>{label1}</Text>
        <TextInput style={[styles.fieldInput, { color: theme.text }]} value={val1} onChangeText={set1} placeholder={ph1} placeholderTextColor={theme.textSecondary} keyboardType={keyboardType1 || 'default'} />
      </View>
      <View style={styles.fieldHalf}>
        <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>{label2}</Text>
        <TextInput style={[styles.fieldInput, { color: theme.text }]} value={val2} onChangeText={set2} placeholder={ph2} placeholderTextColor={theme.textSecondary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  nav: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingTop: 14, paddingBottom: 14,
    borderBottomWidth: 1,
  },
  backBtn: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  backTxt: { fontSize: 18, fontWeight: '600' },
  navTitle: { fontSize: 16, fontWeight: '700' },
  navSub: { fontSize: 11, marginTop: 1 },
  clearBtn: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  clearBtnTxt: { fontSize: 16 },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8, marginTop: 20, paddingLeft: 2 },
  sectionIcon: { fontSize: 14 },
  sectionTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },

  card: { borderRadius: 14, borderWidth: 1, overflow: 'hidden', marginBottom: 4 },

  photoPreview: { width: '100%', height: 200, borderRadius: 12, marginBottom: 0 },
  photoActions: { flexDirection: 'row', gap: 8, padding: 10 },
  photoActionBtn: { flex: 1, borderWidth: 1, borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
  photoActionTxt: { fontSize: 12, fontWeight: '600' },
  photoPickRow: { flexDirection: 'row', gap: 10, padding: 12 },
  photoPickBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 10, borderWidth: 1 },
  photoPickBtnPrimary: { flex: 2, borderWidth: 0 },
  photoPickIcon: { fontSize: 18 },
  photoPickLabel: { fontSize: 13, fontWeight: '600' },

  expertizBtn: {
    borderRadius: 14, borderWidth: 1,
    padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 4,
  },
  expertizIcon: { fontSize: 28 },
  expertizTitle: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  expertizSub: { fontSize: 12 },
  expertizArrow: { fontSize: 22 },

  fieldRow: { paddingHorizontal: 16, paddingVertical: 12 },
  fieldRow2: { flexDirection: 'row' },
  fieldHalf: { flex: 1, paddingHorizontal: 14, paddingVertical: 12 },
  fieldLabel: { fontSize: 10, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 },
  fieldInput: { fontSize: 14, fontWeight: '500', padding: 0 },

  tramerRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  tramerLabel: { fontSize: 14, fontWeight: '600' },
  tramerSub: { fontSize: 12, marginTop: 2 },

  donanimGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, padding: 12 },
  donChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
  donChipTxt: { fontSize: 12, fontWeight: '500' },
  customChipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, padding: 12, borderTopWidth: 1 },
  customInputRow: { flexDirection: 'row', gap: 8, padding: 12, borderTopWidth: 1 },
  customInput: { flex: 1, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 13 },
  addBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  addBtnTxt: { color: '#fff', fontSize: 13, fontWeight: '600' },

  devamBtn: { borderRadius: 14, padding: 18, alignItems: 'center', marginTop: 24 },
  devamTxt: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
});
