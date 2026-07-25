import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput,
  StatusBar, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import { usePremium } from '../context/PremiumContext';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../themes/colors';
import { buildEmlakPortfolyoHTML } from '../pdf/emlakPortfolyoBuilder';
import { loadCompanyProfile } from '../utils/companyProfile';
import { shareToWhatsApp } from '../utils/whatsappShare';

const MAX_EV = 10;
const ILAN_TURLERI = ['Satılık', 'Kiralık', 'Satılık / Kiralık'];
const ODA_SECENEKLERI = ['1+0', '1+1', '2+1', '3+1', '4+1', '4+2', '5+1', '5+2'];
const OZELLIK_SECENEKLERI = [
  'Otopark', 'Havuz', 'Güvenlik', 'Asansör', 'Balkon',
  'Bahçe', 'Ebeveyn Banyo', 'Kombi', 'Krediye Uygun', 'Takas',
  'Doğalgaz', 'Yerden Isıtma', 'Akıllı Ev', 'Eşyalı',
];

const EV_ISIMLERI = [
  'Birinci', 'İkinci', 'Üçüncü', 'Dördüncü', 'Beşinci',
  'Altıncı', 'Yedinci', 'Sekizinci', 'Dokuzuncu', 'Onuncu',
];

function emptyEv() {
  return {
    foto: null,
    baslik: '',
    konum: '',
    m2: '',
    oda: '',
    kat: '',
    yapiYili: '',
    ilanTuru: 'Satılık',
    ozellikler: [],
    fiyat: '',
    not: '',
  };
}

function Field({ label, required, children }) {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
        {label}{required ? <Text style={{ color: '#b8965a' }}> *</Text> : ''}
      </Text>
      {children}
    </View>
  );
}

function Row2({ children }) {
  return <View style={styles.row2}>{children}</View>;
}

export default function EmlakPortfolyoScreen({ navigation }) {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  const insets = useSafeAreaInsets();
  const { gate } = usePremium();

  const [step, setStep] = useState('form'); // 'form' | 'summary'
  const [mevcutIdx, setMevcutIdx] = useState(0);
  const [evler, setEvler] = useState([emptyEv()]);
  const [generating, setGenerating] = useState(false);
  const [firmaAdi, setFirmaAdi] = useState('');
  const [iletisim, setIletisim] = useState('');

  useEffect(() => {
    loadCompanyProfile().catch(() => ({})).then(p => {
      if (p?.companyName) setFirmaAdi(p.companyName);
      if (p?.phone) setIletisim(p.phone);
    });
  }, []);

  const mevcut = evler[mevcutIdx] || emptyEv();

  const updateMevcut = useCallback((key, val) => {
    setEvler(prev => {
      const next = [...prev];
      next[mevcutIdx] = { ...next[mevcutIdx], [key]: val };
      return next;
    });
  }, [mevcutIdx]);

  const toggleOzellik = useCallback((oz) => {
    setEvler(prev => {
      const next = [...prev];
      const cur = next[mevcutIdx];
      const list = cur.ozellikler.includes(oz)
        ? cur.ozellikler.filter(x => x !== oz)
        : [...cur.ozellikler, oz];
      next[mevcutIdx] = { ...cur, ozellikler: list };
      return next;
    });
  }, [mevcutIdx]);

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Fotoğraf seçmek için galeri iznine ihtiyaç var.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      const base64 = `data:image/jpeg;base64,${asset.base64}`;
      updateMevcut('foto', base64);
    }
  };

  const validate = () => {
    const ev = evler[mevcutIdx];
    if (!ev.baslik.trim()) { Alert.alert('Eksik', 'Konut başlığı zorunludur.'); return false; }
    if (!ev.konum.trim()) { Alert.alert('Eksik', 'Konum zorunludur.'); return false; }
    if (!ev.m2.trim()) { Alert.alert('Eksik', 'm² alanı zorunludur.'); return false; }
    if (!ev.oda) { Alert.alert('Eksik', 'Oda sayısı zorunludur.'); return false; }
    if (!ev.fiyat.trim()) { Alert.alert('Eksik', 'Fiyat zorunludur.'); return false; }
    return true;
  };

  const handleDevamEt = () => {
    if (!validate()) return;
    if (step === 'form' && mevcutIdx === evler.length - 1) {
      setStep('summary');
    } else if (step === 'form') {
      setMevcutIdx(i => i + 1);
    }
  };

  const handleEvEkle = () => {
    if (evler.length >= MAX_EV) {
      Alert.alert('Maksimum', 'En fazla 10 ev ekleyebilirsiniz.');
      return;
    }
    const newIdx = evler.length;
    setEvler(prev => [...prev, emptyEv()]);
    setMevcutIdx(newIdx);
    setStep('form');
  };

  const handleEvSil = (idx) => {
    if (evler.length === 1) {
      Alert.alert('Uyarı', 'En az 1 ev olmalıdır.');
      return;
    }
    Alert.alert('İlanı Sil', 'Bu ilanı silmek istediğinizden emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil', style: 'destructive', onPress: () => {
          setEvler(prev => prev.filter((_, i) => i !== idx));
          setMevcutIdx(prev => Math.min(prev, evler.length - 2));
        }
      },
    ]);
  };

  const handlePDFOlustur = async () => {
    if (!(await gate())) return;
    if (evler.length === 0) return;
    setGenerating(true);
    try {
      const html = buildEmlakPortfolyoHTML({
        evler,
        agencyName: firmaAdi.trim() || 'Emlak Ofisi',
        contact: iletisim.trim(),
      });
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      Alert.alert(
        'PDF Hazır',
        'Nasıl paylaşmak istersiniz?',
        [
          {
            text: 'WhatsApp',
            onPress: () => shareToWhatsApp(uri, `emlak-portfolyo.pdf`),
          },
          {
            text: 'Diğer',
            onPress: () => Sharing.shareAsync(uri, {
              mimeType: 'application/pdf',
              dialogTitle: 'Emlak Portföyü — PDF Paylaş',
            }),
          },
          { text: 'Kapat', style: 'cancel' },
        ]
      );
    } catch (e) {
      Alert.alert('Hata', 'PDF oluşturulurken bir sorun oluştu.');
    } finally {
      setGenerating(false);
    }
  };

  const inp = [styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface2 }];

  // ── SUMMARY SCREEN ──
  if (step === 'summary') {
    return (
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.bg} />

        {/* Nav */}
        <View style={[styles.nav, { borderBottomColor: theme.border, backgroundColor: theme.bg, paddingTop: insets.top + 12 }]}>
          <TouchableOpacity style={[styles.navBtn, { backgroundColor: theme.surface2, borderColor: theme.border }]} onPress={() => setStep('form')}>
            <Icon name="arrow-left" size={18} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.navTitle, { color: theme.text }]}>Portföy Özeti</Text>
          <View style={[styles.badge, { backgroundColor: 'rgba(184,150,90,0.15)', borderColor: 'rgba(184,150,90,0.3)' }]}>
            <Text style={styles.badgeTxt}>{evler.length} İlan</Text>
          </View>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 10 }} showsVerticalScrollIndicator={false} overScrollMode="never" bounces={false}>

          {/* Firma bilgileri */}
          <View style={[styles.firmaCard, { backgroundColor: theme.surface2, borderColor: theme.border }]}>
            <Text style={[styles.firmaSectionTitle, { color: theme.textSecondary }]}>PDF'e Eklenecek Firma Bilgileri</Text>
            <View style={styles.firmaRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Firma Adı</Text>
                <TextInput
                  style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.bg }]}
                  value={firmaAdi}
                  onChangeText={setFirmaAdi}
                  placeholder="Emlak Ofisi Adı"
                  placeholderTextColor={theme.textSecondary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>İletişim</Text>
                <TextInput
                  style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.bg }]}
                  value={iletisim}
                  onChangeText={setIletisim}
                  placeholder="0xxx xxx xx xx"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>

          {evler.map((ev, i) => (
            <View key={i} style={[styles.summaryCard, { backgroundColor: theme.surface2, borderColor: theme.border }]}>
              {ev.foto ? (
                <Image source={{ uri: ev.foto }} style={styles.summaryPhoto} />
              ) : (
                <View style={[styles.summaryPhotoEmpty, { backgroundColor: theme.surface }]}>
                  <Icon name="home-outline" size={24} color={theme.textSecondary} style={{ opacity: 0.3 }} />
                </View>
              )}
              <View style={styles.summaryInfo}>
                <Text style={[styles.summaryNum, { color: '#b8965a' }]}>İlan · {String(i + 1).padStart(3, '0')} · {ev.ilanTuru}</Text>
                <Text style={[styles.summaryTitle, { color: theme.text }]} numberOfLines={1}>{ev.baslik || '—'}</Text>
                <Text style={[styles.summaryLoc, { color: theme.textSecondary }]} numberOfLines={1}>{ev.konum || '—'}</Text>
                <Text style={[styles.summaryPrice, { color: '#b8965a' }]}>{ev.fiyat ? ev.fiyat + ' ₺' : '—'}</Text>
              </View>
              <View style={[styles.summaryActions, { borderLeftColor: theme.border }]}>
                <TouchableOpacity
                  style={styles.summaryActionBtn}
                  onPress={() => { setMevcutIdx(i); setStep('form'); }}
                >
                  <Icon name="pencil-outline" size={16} color="#b8965a" />
                </TouchableOpacity>
                <View style={[styles.summaryActionDivider, { backgroundColor: theme.border }]} />
                <TouchableOpacity style={styles.summaryActionBtn} onPress={() => handleEvSil(i)}>
                  <Icon name="delete-outline" size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {evler.length < MAX_EV && (
            <TouchableOpacity
              style={[styles.addMoreBtn, { borderColor: theme.border }]}
              onPress={handleEvEkle}
            >
              <Text style={{ color: '#b8965a', fontSize: 15, fontWeight: '600' }}>+ Ev Ekle</Text>
            </TouchableOpacity>
          )}
          <View style={{ height: 100 }} />
        </ScrollView>

        <View style={[styles.footer, { backgroundColor: theme.bg, borderTopColor: theme.border, paddingBottom: insets.bottom + 12 }]}>
          <TouchableOpacity
            style={[styles.pdfBtn, generating && { opacity: 0.7 }]}
            onPress={handlePDFOlustur}
            disabled={generating}
            activeOpacity={0.85}
          >
            {generating
              ? <ActivityIndicator color="#0d1b2a" />
              : <Text style={styles.pdfBtnTxt}>PDF Oluştur · {evler.length} İlan</Text>
            }
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── FORM SCREEN ──
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.bg} />

        {/* Nav */}
        <View style={[styles.nav, { borderBottomColor: theme.border, backgroundColor: theme.bg, paddingTop: insets.top + 12 }]}>
          <TouchableOpacity
            style={[styles.navBtn, { backgroundColor: theme.surface2, borderColor: theme.border }]}
            onPress={() => mevcutIdx > 0 ? setMevcutIdx(i => i - 1) : navigation.goBack()}
          >
            <Icon name="arrow-left" size={18} color={theme.text} />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={[styles.navTitle, { color: theme.text }]}>Emlak Portföyü</Text>
            <Text style={[styles.navSub, { color: theme.textSecondary }]}>
              {EV_ISIMLERI[mevcutIdx] || (mevcutIdx + 1) + '.'} Konut
            </Text>
          </View>
          <View style={[styles.badge, { backgroundColor: 'rgba(184,150,90,0.15)', borderColor: 'rgba(184,150,90,0.3)' }]}>
            <Text style={styles.badgeTxt}>{mevcutIdx + 1}/{evler.length}</Text>
          </View>
        </View>

        {/* Adım göstergesi */}
        <View style={[styles.stepsRow, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
          {evler.map((_, i) => (
            <TouchableOpacity key={i} onPress={() => setMevcutIdx(i)} style={styles.stepItem}>
              <View style={[
                styles.stepCircle,
                i < mevcutIdx && { backgroundColor: '#2d7a4a', borderColor: '#2d7a4a' },
                i === mevcutIdx && { borderColor: '#b8965a' },
                { borderColor: i < mevcutIdx ? '#2d7a4a' : i === mevcutIdx ? '#b8965a' : theme.border },
              ]}>
                <Text style={[
                  styles.stepCircleTxt,
                  { color: i < mevcutIdx ? '#fff' : i === mevcutIdx ? '#b8965a' : theme.textSecondary },
                ]}>
                  {i < mevcutIdx ? '✓' : i + 1}
                </Text>
              </View>
              {i < evler.length - 1 && (
                <View style={[styles.stepLine, { backgroundColor: i < mevcutIdx ? '#2d7a4a' : theme.border }]} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" overScrollMode="never" bounces={false}>
          <View style={styles.body}>

            {/* Fotoğraf */}
            <Field label="Fotoğraf">
              <TouchableOpacity
                style={[styles.photoPicker, { borderColor: mevcut.foto ? '#b8965a' : theme.border, backgroundColor: theme.surface2 }]}
                onPress={pickPhoto}
                activeOpacity={0.8}
              >
                {mevcut.foto ? (
                  <>
                    <Image source={{ uri: mevcut.foto }} style={styles.photoImg} />
                    <View style={styles.photoOverlay}>
                      <Text style={styles.photoOverlayTxt}>Değiştir</Text>
                    </View>
                  </>
                ) : (
                  <>
                    <Icon name="home-outline" size={28} color="#b8965a" style={{ opacity: 0.35 }} />
                    <Text style={[styles.photoLabel, { color: '#b8965a' }]}>Fotoğraf Seç</Text>
                    <Text style={[styles.photoSub, { color: theme.textSecondary }]}>Kapak fotoğrafı · 1 adet</Text>
                  </>
                )}
              </TouchableOpacity>
            </Field>

            {/* Başlık */}
            <Field label="Konut Başlığı" required>
              <TextInput
                style={inp}
                value={mevcut.baslik}
                onChangeText={v => updateMevcut('baslik', v)}
                placeholder="Örn: Lüks Rezidans Dairesi"
                placeholderTextColor={theme.textSecondary}
              />
            </Field>

            {/* Konum */}
            <Field label="Konum" required>
              <TextInput
                style={inp}
                value={mevcut.konum}
                onChangeText={v => updateMevcut('konum', v)}
                placeholder="Örn: Odunpazarı, Eskişehir"
                placeholderTextColor={theme.textSecondary}
              />
            </Field>

            {/* m² ve Oda */}
            <Row2>
              <Field label="Brüt m²" required>
                <TextInput
                  style={[inp, { flex: 1 }]}
                  value={mevcut.m2}
                  onChangeText={v => updateMevcut('m2', v)}
                  placeholder="145"
                  keyboardType="numeric"
                  placeholderTextColor={theme.textSecondary}
                />
              </Field>
              <Field label="Oda Sayısı" required>
                <View style={[styles.odaWrap, { borderColor: theme.border, backgroundColor: theme.surface2 }]}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingHorizontal: 8 }}>
                    {ODA_SECENEKLERI.map(o => (
                      <TouchableOpacity
                        key={o}
                        style={[styles.odaChip, mevcut.oda === o && { backgroundColor: 'rgba(184,150,90,0.15)', borderColor: '#b8965a' }, { borderColor: theme.border }]}
                        onPress={() => updateMevcut('oda', o)}
                      >
                        <Text style={[styles.odaChipTxt, { color: mevcut.oda === o ? '#b8965a' : theme.textSecondary }]}>{o}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </Field>
            </Row2>

            {/* Kat ve Yapı Yılı */}
            <Row2>
              <Field label="Kat">
                <TextInput
                  style={[inp, { flex: 1 }]}
                  value={mevcut.kat}
                  onChangeText={v => updateMevcut('kat', v)}
                  placeholder="5 / 12"
                  placeholderTextColor={theme.textSecondary}
                />
              </Field>
              <Field label="Yapı Yılı">
                <TextInput
                  style={[inp, { flex: 1 }]}
                  value={mevcut.yapiYili}
                  onChangeText={v => updateMevcut('yapiYili', v)}
                  placeholder="2022"
                  keyboardType="numeric"
                  placeholderTextColor={theme.textSecondary}
                />
              </Field>
            </Row2>

            {/* İlan Türü */}
            <Field label="İlan Türü" required>
              <View style={styles.chipsWrap}>
                {ILAN_TURLERI.map(t => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.chip, { borderColor: mevcut.ilanTuru === t ? '#b8965a' : theme.border, backgroundColor: mevcut.ilanTuru === t ? 'rgba(184,150,90,0.12)' : theme.surface2 }]}
                    onPress={() => updateMevcut('ilanTuru', t)}
                  >
                    <Text style={[styles.chipTxt, { color: mevcut.ilanTuru === t ? '#b8965a' : theme.textSecondary }]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Field>

            {/* Özellikler */}
            <Field label="Özellikler">
              <View style={styles.chipsWrap}>
                {OZELLIK_SECENEKLERI.map(oz => {
                  const sel = mevcut.ozellikler.includes(oz);
                  return (
                    <TouchableOpacity
                      key={oz}
                      style={[styles.chip, { borderColor: sel ? '#b8965a' : theme.border, backgroundColor: sel ? 'rgba(184,150,90,0.12)' : theme.surface2 }]}
                      onPress={() => toggleOzellik(oz)}
                    >
                      <Text style={[styles.chipTxt, { color: sel ? '#b8965a' : theme.textSecondary }]}>{oz}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Field>

            {/* Fiyat */}
            <Field label="Fiyat (₺)" required>
              <View style={styles.priceWrap}>
                <Text style={[styles.priceCurrency, { color: '#b8965a' }]}>₺</Text>
                <TextInput
                  style={[inp, styles.priceInput]}
                  value={mevcut.fiyat}
                  onChangeText={v => updateMevcut('fiyat', v)}
                  placeholder="0.000.000"
                  keyboardType="numeric"
                  placeholderTextColor={theme.textSecondary}
                />
              </View>
            </Field>

            {/* Not */}
            <Field label="Not (Opsiyonel)">
              <TextInput
                style={inp}
                value={mevcut.not}
                onChangeText={v => updateMevcut('not', v)}
                placeholder="Takas görüşülür, krediye uygun..."
                placeholderTextColor={theme.textSecondary}
              />
            </Field>

          </View>
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Footer butonlar */}
        <View style={[styles.footer, { backgroundColor: theme.bg, borderTopColor: theme.border, paddingBottom: insets.bottom + 12 }]}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleDevamEt} activeOpacity={0.85}>
            <Text style={styles.saveBtnTxt}>
              {mevcutIdx < evler.length - 1 ? 'Sonraki →' : 'Özete Geç →'}
            </Text>
          </TouchableOpacity>
          {evler.length > 1 && mevcutIdx === evler.length - 1 && (
            <TouchableOpacity
              style={[styles.tamamlaBtn, { borderColor: '#b8965a' }]}
              onPress={() => setStep('summary')}
              activeOpacity={0.8}
            >
              <Text style={[styles.tamanlaBtnTxt, { color: '#b8965a' }]}>Portföyü Tamamla</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  nav: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1,
  },
  navBtn: { width: 36, height: 36, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  navBtnTxt: { fontSize: 16 },
  navTitle: { fontSize: 16, fontWeight: '700', letterSpacing: -0.3 },
  navSub: { fontSize: 11, marginTop: 1 },
  badge: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20, borderWidth: 1,
  },
  badgeTxt: { fontSize: 10, fontWeight: '700', color: '#b8965a', letterSpacing: 1 },
  stepsRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1,
    flexWrap: 'wrap', gap: 2,
  },
  stepItem: { flexDirection: 'row', alignItems: 'center' },
  stepCircle: {
    width: 26, height: 26, borderRadius: 13, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  stepCircleTxt: { fontSize: 10, fontWeight: '700' },
  stepLine: { width: 16, height: 1.5 },
  body: { padding: 16, gap: 0 },
  row2: { flexDirection: 'row', gap: 10 },
  fieldWrap: { flex: 1, marginBottom: 14, gap: 5 },
  fieldLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase' },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, fontSize: 14 },
  photoPicker: {
    borderWidth: 1.5, borderStyle: 'dashed', borderRadius: 12,
    height: 140, alignItems: 'center', justifyContent: 'center', gap: 6, overflow: 'hidden',
  },
  photoImg: { position: 'absolute', width: '100%', height: '100%', borderRadius: 10 },
  photoOverlay: {
    position: 'absolute', inset: 0, backgroundColor: 'rgba(13,27,42,0.5)',
    alignItems: 'center', justifyContent: 'center', borderRadius: 10,
  },
  photoOverlayTxt: { color: '#fff', fontSize: 12, fontWeight: '600', letterSpacing: 2 },
  photoLabel: { fontSize: 12, fontWeight: '600', letterSpacing: 1 },
  photoSub: { fontSize: 10 },
  odaWrap: { borderWidth: 1, borderRadius: 10, height: 44, justifyContent: 'center', overflow: 'hidden' },
  odaChip: {
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  odaChipTxt: { fontSize: 12, fontWeight: '600' },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  chip: { paddingHorizontal: 11, paddingVertical: 6, borderRadius: 20, borderWidth: 1.5 },
  chipTxt: { fontSize: 11, fontWeight: '500' },
  priceWrap: { position: 'relative' },
  priceCurrency: { position: 'absolute', left: 12, top: 11, fontSize: 16, fontWeight: '600', zIndex: 1 },
  priceInput: { paddingLeft: 28, fontSize: 18, fontWeight: '600' },
  footer: { padding: 16, paddingTop: 12, borderTopWidth: 1, gap: 10 },
  saveBtn: { backgroundColor: '#0d1b2a', borderRadius: 16, paddingVertical: 15, alignItems: 'center' },
  saveBtnTxt: { color: '#b8965a', fontSize: 14, fontWeight: '700', letterSpacing: 1 },
  tamamlaBtn: { borderWidth: 1.5, borderRadius: 16, paddingVertical: 12, alignItems: 'center' },
  tamanlaBtnTxt: { fontSize: 13, fontWeight: '600', letterSpacing: 0.5 },
  pdfBtn: {
    backgroundColor: '#b8965a', borderRadius: 16, paddingVertical: 16,
    alignItems: 'center',
  },
  pdfBtnTxt: { color: '#0d1b2a', fontSize: 15, fontWeight: '800', letterSpacing: 0.5 },
  summaryCard: {
    flexDirection: 'row', borderRadius: 14, borderWidth: 1, overflow: 'hidden',
  },
  summaryPhoto: { width: 80, height: 90 },
  summaryPhotoEmpty: { width: 80, height: 90, alignItems: 'center', justifyContent: 'center' },
  summaryInfo: { flex: 1, padding: 12, gap: 2 },
  summaryNum: { fontSize: 8, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' },
  summaryTitle: { fontSize: 15, fontWeight: '600' },
  summaryLoc: { fontSize: 10, fontWeight: '300' },
  summaryPrice: { fontSize: 14, fontWeight: '700', marginTop: 4 },
  summaryActions: { width: 40, borderLeftWidth: 1 },
  summaryActionBtn: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  summaryActionDivider: { height: 1 },
  addMoreBtn: {
    borderWidth: 1.5, borderStyle: 'dashed', borderRadius: 14,
    paddingVertical: 14, alignItems: 'center', justifyContent: 'center',
  },
  firmaCard: {
    borderRadius: 14, borderWidth: 1, padding: 14, gap: 10,
  },
  firmaSectionTitle: {
    fontSize: 9, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase',
  },
  firmaRow: { flexDirection: 'row', gap: 10 },
});
