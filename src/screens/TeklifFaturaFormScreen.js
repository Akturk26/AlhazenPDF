import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput,
  StatusBar, Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import Icon from '../components/Icon';
import { usePremium } from '../context/PremiumContext';

const GOLD = '#C9A84C';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../themes/colors';
import { buildTeklifFaturaHTML } from '../pdf/teklifFaturaBuilder';
import { saveTeklif } from '../utils/teklifStorage';
import { loadCompanyProfile } from '../utils/companyProfile';
import { shareToWhatsApp } from '../utils/whatsappShare';

const BELGE_TIPLERI = ['Teklif', 'Fatura', 'Proforma Fatura', 'İrsaliye'];
const DOVIZ_OPTS    = ['₺', '$', '€', '£'];
const KDV_OPTS      = ['20', '10', '1', '0'];
const BIRIM_OPTS    = ['Adet', 'm²', 'm³', 'Kg', 'Ton', 'Lt', 'Paket', 'Koli', 'Set', 'Saat', 'Gün'];

function today() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
}

function nextMonth() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
}

let _rowId = 0;
const newRow = () => ({
  id: String(++_rowId),
  kod: '', ad: '', aciklama: '', miktar: '1', birim: 'Adet', birim_fiyat: '',
});

function SectionHeader({ iconName, title, color }) {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  return (
    <View style={[styles.sectionHeader, { backgroundColor: color + (isDark ? '22' : '15'), borderLeftColor: color }]}>
      <Icon name={iconName} size={16} color={color} />
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
    </View>
  );
}

function Field({ label, children }) {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>{label}</Text>
      {children}
    </View>
  );
}

function Row2({ children }) {
  return <View style={styles.row2}>{children}</View>;
}

export default function TeklifFaturaFormScreen({ navigation }) {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  const insets = useSafeAreaInsets();
  const { gate } = usePremium();

  const [firma, setFirma]           = useState('');
  const [belgeTipi, setBelgeTipi]   = useState('Teklif');
  const [seriNo, setSeriNo]         = useState('TKL-001');
  const [adres, setAdres]           = useState('');
  const [sehir, setSehir]           = useState('');
  const [telefon, setTelefon]       = useState('');
  const [vkn, setVkn]               = useState('');

  const [musteriAdi, setMusteriAdi]     = useState('');
  const [musteriAdres, setMusteriAdres] = useState('');
  const [musteriVkn, setMusteriVkn]     = useState('');

  const [tarih, setTarih]           = useState(today());
  const [gecerlilik, setGecerlilik] = useState(nextMonth());
  const [doviz, setDoviz]           = useState('₺');
  const [kdv, setKdv]               = useState('20');
  const [dovizKuru, setDovizKuru]   = useState('');
  const [odemeVadesi, setOdemeVadesi] = useState('');
  const [notlar, setNotlar]         = useState('');

  const [kalemler, setKalemler]     = useState([newRow()]);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadCompanyProfile().then(p => {
      if (!p) return;
      if (p.name) setFirma(p.name);
    });
  }, []);

  // Toplam hesapla
  const totals = (() => {
    let sub = 0;
    kalemler.forEach(k => {
      const qty = parseFloat(k.miktar) || 0;
      const price = parseFloat(k.birim_fiyat.replace(',', '.')) || 0;
      sub += qty * price;
    });
    const kdvAmt = sub * (parseFloat(kdv) / 100);
    return { sub, kdvAmt, grand: sub + kdvAmt };
  })();

  const fmtN = (n) => n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const addKalem = () => {
    const last = kalemler[kalemler.length - 1];
    if (!last.ad.trim()) {
      Alert.alert('Eksik Alan', 'Mevcut kaleme Ürün / Hizmet Adı girilmeden yeni kalem eklenemez.');
      return;
    }
    setKalemler(prev => [...prev, newRow()]);
  };
  const removeKalem = (id) => {
    if (kalemler.length === 1) return;
    setKalemler(prev => prev.filter(k => k.id !== id));
  };
  const updateKalem = (id, field, val) => {
    setKalemler(prev => prev.map(k => k.id === id ? { ...k, [field]: val } : k));
  };

  const cycleBelgeTipi = () => {
    const idx = BELGE_TIPLERI.indexOf(belgeTipi);
    setBelgeTipi(BELGE_TIPLERI[(idx + 1) % BELGE_TIPLERI.length]);
  };
  const cycleDoviz = () => {
    const idx = DOVIZ_OPTS.indexOf(doviz);
    setDoviz(DOVIZ_OPTS[(idx + 1) % DOVIZ_OPTS.length]);
  };
  const cycleKdv = () => {
    const idx = KDV_OPTS.indexOf(kdv);
    setKdv(KDV_OPTS[(idx + 1) % KDV_OPTS.length]);
  };
  const cycleBirim = (id) => {
    const k = kalemler.find(k => k.id === id);
    if (!k) return;
    const idx = BIRIM_OPTS.indexOf(k.birim);
    updateKalem(id, 'birim', BIRIM_OPTS[(idx + 1) % BIRIM_OPTS.length]);
  };

  const handleGenerate = async () => {
    if (!firma.trim()) { Alert.alert('Eksik', 'Firma adı zorunludur.'); return; }
    if (!musteriAdi.trim()) { Alert.alert('Eksik', 'Müşteri adı zorunludur.'); return; }
    const eksikKalem = kalemler.some(k => !k.ad.trim() && (k.kod.trim() || k.birim_fiyat.trim()));
    if (eksikKalem) {
      Alert.alert(
        'Eksik Ürün Adı',
        'Bazı kalemlerde Ürün / Hizmet Adı boş bırakıldı. Bu kalemler PDF\'e eklenmeyecek. Devam etmek istiyor musunuz?',
        [
          { text: 'Geri Dön', style: 'cancel' },
          { text: 'Yine de Oluştur', onPress: () => doGenerate() },
        ]
      );
      return;
    }
    doGenerate();
  };

  const doGenerate = async () => {
    if (!(await gate())) return;
    setGenerating(true);
    try {
      const html = buildTeklifFaturaHTML({
        firma: firma.trim(),
        belge_tipi: belgeTipi,
        seri_no: seriNo.trim(),
        adres: adres.trim(),
        sehir: sehir.trim(),
        telefon: telefon.trim(),
        vkn: vkn.trim(),
        musteri_adi: musteriAdi.trim(),
        musteri_adres: musteriAdres.trim(),
        musteri_vkn: musteriVkn.trim(),
        tarih: tarih.trim(),
        gecerlilik: gecerlilik.trim(),
        doviz,
        kdv_yuzde: kdv,
        doviz_kuru: dovizKuru.trim(),
        odeme_vadesi: odemeVadesi.trim(),
        kalemler: kalemler.filter(k => k.ad.trim()),
        notlar: notlar.trim(),
      });

      const { uri } = await Print.printToFileAsync({ html, base64: false, width: 595, height: 842 });

      await saveTeklif({
        belge_tipi: belgeTipi,
        firma: firma.trim(),
        musteri: musteriAdi.trim(),
        seri_no: seriNo.trim(),
        tarih: tarih.trim(),
        toplam: fmtN(totals.grand) + ' ' + doviz,
        uri,
      });

      Alert.alert(
        'PDF Hazır',
        'Nasıl paylaşmak istersiniz?',
        [
          {
            text: 'WhatsApp',
            onPress: () => shareToWhatsApp(uri, `${belgeTipi}-${seriNo.trim()}.pdf`),
          },
          {
            text: 'Diğer',
            onPress: () => Sharing.shareAsync(uri, {
              mimeType: 'application/pdf',
              dialogTitle: `${belgeTipi} — ${firma.trim()}`,
            }),
          },
          { text: 'Kapat', style: 'cancel' },
        ]
      );
    } catch (e) {
      Alert.alert('Hata', 'PDF oluşturulamadı: ' + (e.message || ''));
    } finally {
      setGenerating(false);
    }
  };

  const fieldStyle = [styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface2 }];

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.bg} />

        {/* Nav */}
        <View style={[styles.nav, { borderBottomColor: theme.border, backgroundColor: theme.bg, paddingTop: insets.top + 12 }]}>
          <TouchableOpacity
            style={[styles.navBtn, { backgroundColor: theme.surface2, borderColor: theme.border }]}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={18} color={theme.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.navTitle, { color: theme.text }]}>Teklif & Fatura</Text>
            <Text style={[styles.navSub, { color: theme.textSecondary }]}>Profesyonel PDF belgesi</Text>
          </View>
          {/* Belge tipi badge */}
          <TouchableOpacity
            onPress={cycleBelgeTipi}
            style={[styles.belgeChip, { backgroundColor: '#B8922A' + '22', borderColor: '#B8922A' + '55' }]}
          >
            <Text style={[styles.belgeChipTxt, { color: '#B8922A' }]}>{belgeTipi}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* Toplam özet */}
          <View style={[styles.summaryBar, { backgroundColor: '#111B2E' }]}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Ara Toplam</Text>
              <Text style={styles.summaryVal}>{fmtN(totals.sub)} {doviz}</Text>
            </View>
            {parseFloat(kdv) > 0 && (
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>KDV %{kdv}</Text>
                <Text style={[styles.summaryVal, { color: '#ECC85A' }]}>{fmtN(totals.kdvAmt)} {doviz}</Text>
              </View>
            )}
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Genel Toplam</Text>
              <Text style={[styles.summaryVal, styles.summaryGrand]}>{fmtN(totals.grand)} {doviz}</Text>
            </View>
          </View>

          <View style={styles.body}>

            {/* FİRMA BİLGİLERİ */}
            <SectionHeader iconName="office-building-outline" title="Firma Bilgileri" color={GOLD} />
            <Row2>
              <Field label="FİRMA ADI *">
                <TextInput style={[fieldStyle, { flex: 1 }]} value={firma} onChangeText={setFirma}
                  placeholder="Özbek İnşaat Ltd. Şti." placeholderTextColor={theme.textSecondary} />
              </Field>
              <Field label="SERİ NO">
                <TextInput style={[fieldStyle, { flex: 1 }]} value={seriNo} onChangeText={setSeriNo}
                  placeholder="TKL-001" placeholderTextColor={theme.textSecondary} />
              </Field>
            </Row2>
            <Row2>
              <Field label="ADRES">
                <TextInput style={[fieldStyle, { flex: 1 }]} value={adres} onChangeText={setAdres}
                  placeholder="Mah. Cad. No:" placeholderTextColor={theme.textSecondary} />
              </Field>
              <Field label="ŞEHİR">
                <TextInput style={[fieldStyle, { flex: 1 }]} value={sehir} onChangeText={setSehir}
                  placeholder="Eskişehir" placeholderTextColor={theme.textSecondary} />
              </Field>
            </Row2>
            <Row2>
              <Field label="TELEFON">
                <TextInput style={[fieldStyle, { flex: 1 }]} value={telefon} onChangeText={setTelefon}
                  placeholder="+90 555 000 00 00" keyboardType="phone-pad" placeholderTextColor={theme.textSecondary} />
              </Field>
              <Field label="VKN / TCKN">
                <TextInput style={[fieldStyle, { flex: 1 }]} value={vkn} onChangeText={setVkn}
                  placeholder="Opsiyonel" keyboardType="numeric" placeholderTextColor={theme.textSecondary} />
              </Field>
            </Row2>

            {/* MÜŞTERİ BİLGİLERİ */}
            <SectionHeader iconName="account-outline" title="Müşteri Bilgileri" color="#3DBA7C" />
            <Field label="MÜŞTERİ ADI / UNVANI *">
              <TextInput style={fieldStyle} value={musteriAdi} onChangeText={setMusteriAdi}
                placeholder="Ahmet Bey / Yıldız Yapı A.Ş." placeholderTextColor={theme.textSecondary} />
            </Field>
            <Row2>
              <Field label="MÜŞTERİ ADRES / FİRMA">
                <TextInput style={[fieldStyle, { flex: 1 }]} value={musteriAdres} onChangeText={setMusteriAdres}
                  placeholder="Müşteri adresi veya firma adı" placeholderTextColor={theme.textSecondary} />
              </Field>
              <Field label="MÜŞTERİ VKN">
                <TextInput style={[fieldStyle, { flex: 1 }]} value={musteriVkn} onChangeText={setMusteriVkn}
                  placeholder="Opsiyonel" keyboardType="numeric" placeholderTextColor={theme.textSecondary} />
              </Field>
            </Row2>

            {/* BELGE AYARLARI */}
            <SectionHeader iconName="clipboard-text-outline" title="Belge Ayarları" color="#B8922A" />
            <Row2>
              <Field label="DÜZENLEME TARİHİ">
                <TextInput style={[fieldStyle, { flex: 1 }]} value={tarih} onChangeText={setTarih}
                  placeholder="GG.AA.YYYY" placeholderTextColor={theme.textSecondary} />
              </Field>
              <Field label="GEÇERLİLİK TARİHİ">
                <TextInput style={[fieldStyle, { flex: 1 }]} value={gecerlilik} onChangeText={setGecerlilik}
                  placeholder="GG.AA.YYYY" placeholderTextColor={theme.textSecondary} />
              </Field>
            </Row2>
            <Row2>
              <Field label="DÖVİZ">
                <TouchableOpacity style={[fieldStyle, styles.cycleBtn, { flex: 1 }]} onPress={cycleDoviz}>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: '600' }}>{doviz}</Text>
                  <Text style={{ color: theme.textSecondary, fontSize: 11 }}>↕</Text>
                </TouchableOpacity>
              </Field>
              <Field label={`KDV %${kdv}`}>
                <TouchableOpacity style={[fieldStyle, styles.cycleBtn, { flex: 1 }]} onPress={cycleKdv}>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: '600' }}>%{kdv}</Text>
                  <Text style={{ color: theme.textSecondary, fontSize: 11 }}>↕</Text>
                </TouchableOpacity>
              </Field>
            </Row2>
            <Row2>
              <Field label="DÖVİZ KURU (OPS.)">
                <TextInput style={[fieldStyle, { flex: 1 }]} value={dovizKuru} onChangeText={setDovizKuru}
                  placeholder="1 $ = 38,50 ₺" placeholderTextColor={theme.textSecondary} />
              </Field>
              <Field label="ÖDEME VADESİ">
                <TextInput style={[fieldStyle, { flex: 1 }]} value={odemeVadesi} onChangeText={setOdemeVadesi}
                  placeholder="Peşin / 30 Gün" placeholderTextColor={theme.textSecondary} />
              </Field>
            </Row2>

            {/* KALEMLER */}
            <SectionHeader iconName="package-variant" title={`Kalemler (${kalemler.length})`} color="#E05555" />

            {kalemler.map((k, idx) => (
              <View key={k.id} style={[styles.kalemCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                {/* Kalem numarası + sil */}
                <View style={styles.kalemHeader}>
                  <View style={[styles.kalemNumBadge, { backgroundColor: '#E05555' + '22' }]}>
                    <Text style={[styles.kalemNumTxt, { color: '#E05555' }]}>#{idx + 1}</Text>
                  </View>
                  <TouchableOpacity onPress={() => removeKalem(k.id)} style={styles.kalemDelBtn} disabled={kalemler.length === 1}>
                    <Text style={{ color: kalemler.length === 1 ? theme.border : '#E05555', fontSize: 16 }}>✕</Text>
                  </TouchableOpacity>
                </View>

                <Row2>
                  <Field label="KOD (OPS.)">
                    <TextInput style={[fieldStyle, { flex: 1 }]} value={k.kod} onChangeText={v => updateKalem(k.id, 'kod', v)}
                      placeholder="MLZ-001" placeholderTextColor={theme.textSecondary} />
                  </Field>
                  <Field label="ÜRÜN / HİZMET ADI *">
                    <TextInput
                      style={[fieldStyle, { flex: 1 }, !k.ad.trim() && k.birim_fiyat.trim() && { borderColor: '#E05555' }]}
                      value={k.ad}
                      onChangeText={v => updateKalem(k.id, 'ad', v)}
                      placeholder="Portland Çimentosu 42.5"
                      placeholderTextColor={theme.textSecondary}
                    />
                  </Field>
                </Row2>
                <Field label="AÇIKLAMA">
                  <TextInput style={fieldStyle} value={k.aciklama} onChangeText={v => updateKalem(k.id, 'aciklama', v)}
                    placeholder="Ürün açıklaması (opsiyonel)" placeholderTextColor={theme.textSecondary} />
                </Field>
                <Row2>
                  <Field label="MİKTAR">
                    <TextInput style={[fieldStyle, { flex: 1 }]} value={k.miktar} onChangeText={v => updateKalem(k.id, 'miktar', v)}
                      keyboardType="numeric" placeholder="1" placeholderTextColor={theme.textSecondary} />
                  </Field>
                  <Field label="BİRİM">
                    <TouchableOpacity style={[fieldStyle, styles.cycleBtn, { flex: 1 }]} onPress={() => cycleBirim(k.id)}>
                      <Text style={{ color: theme.text, fontSize: 14, fontWeight: '600' }}>{k.birim}</Text>
                      <Text style={{ color: theme.textSecondary, fontSize: 11 }}>↕</Text>
                    </TouchableOpacity>
                  </Field>
                  <Field label={`BİRİM FİYAT (${doviz})`}>
                    <TextInput style={[fieldStyle, { flex: 1 }]} value={k.birim_fiyat} onChangeText={v => updateKalem(k.id, 'birim_fiyat', v)}
                      keyboardType="numeric" placeholder="0,00" placeholderTextColor={theme.textSecondary} />
                  </Field>
                </Row2>

                {/* Kalem tutarı */}
                {k.ad.trim() && k.birim_fiyat ? (
                  <View style={[styles.kalemTotal, { borderTopColor: theme.border }]}>
                    <Text style={{ color: theme.textSecondary, fontSize: 11 }}>
                      {k.miktar || 1} × {k.birim_fiyat} {doviz} (KDV dahil)
                    </Text>
                    <Text style={{ color: '#B8922A', fontWeight: '700', fontSize: 13 }}>
                      {fmtN((parseFloat(k.miktar) || 0) * (parseFloat(k.birim_fiyat.replace(',', '.')) || 0) * (1 + parseFloat(kdv) / 100))} {doviz}
                    </Text>
                  </View>
                ) : null}
              </View>
            ))}

            <TouchableOpacity
              style={[styles.addKalemBtn, { borderColor: '#E05555' + '60', backgroundColor: '#E05555' + '10' }]}
              onPress={addKalem}
            >
              <Text style={{ color: '#E05555', fontSize: 13, fontWeight: '700' }}>＋  Kalem Ekle</Text>
            </TouchableOpacity>

            {/* NOTLAR */}
            <SectionHeader iconName="text-box-outline" title="Notlar (Opsiyonel)" color="#9B6EF7" />
            <Field label="NOT / AÇIKLAMA">
              <TextInput
                style={[fieldStyle, { height: 80, textAlignVertical: 'top', paddingTop: 12 }]}
                value={notlar} onChangeText={setNotlar}
                placeholder="Ödeme koşulları, teslimat süresi, garanti şartları..."
                placeholderTextColor={theme.textSecondary}
                multiline
              />
            </Field>

            {/* Fatura uyarısı */}
            {(belgeTipi === 'Fatura' || belgeTipi === 'Proforma Fatura') && (
              <View style={[styles.yasal, { backgroundColor: '#FFF8E7', borderColor: '#ECC85A' }]}>
                <Text style={styles.yasalTxt}>
                  ⚠️  PDF alt kısmında yasal uyarı notu yer alacak: "Bu resmi bir fatura değildir..."
                </Text>
              </View>
            )}

          </View>

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Alt buton */}
        <View style={[styles.footer, { backgroundColor: theme.bg, borderTopColor: theme.border, paddingBottom: insets.bottom + 12 }]}>
          <TouchableOpacity
            style={[styles.generateBtn, { opacity: generating ? 0.7 : 1 }]}
            onPress={handleGenerate}
            disabled={generating}
            activeOpacity={0.85}
          >
            {generating
              ? <ActivityIndicator color="#fff" size="small" />
              : <>
                  <Text style={styles.generateBtnTxt}>PDF Oluştur & Paylaş</Text>
                  <Text style={styles.generateBtnTotal}>{fmtN(totals.grand)} {doviz}</Text>
                </>
            }
          </TouchableOpacity>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  nav: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1,
  },
  navBtn: {
    width: 36, height: 36, borderRadius: 12, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  navBtnTxt: { fontSize: 16 },
  navTitle: { fontSize: 16, fontWeight: '700', letterSpacing: -0.3 },
  navSub: { fontSize: 11, marginTop: 1 },
  belgeChip: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 10, borderWidth: 1,
  },
  belgeChipTxt: { fontSize: 12, fontWeight: '700' },

  summaryBar: {
    flexDirection: 'row', padding: 12, paddingHorizontal: 16, gap: 0,
  },
  summaryItem: { flex: 1, alignItems: 'center', gap: 2 },
  summaryLabel: { fontSize: 9, fontWeight: '600', letterSpacing: 0.5, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' },
  summaryVal: { fontSize: 12, fontWeight: '700', color: '#fff', fontVariant: ['tabular-nums'] },
  summaryGrand: { color: '#ECC85A', fontSize: 14 },

  scroll: { flex: 1 },
  body: { padding: 16, gap: 0 },

  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 8, paddingHorizontal: 12,
    borderLeftWidth: 3, borderRadius: 6,
    marginTop: 20, marginBottom: 12,
  },
  sectionEmoji: { fontSize: 16 },
  sectionTitle: { fontSize: 13, fontWeight: '700', letterSpacing: -0.2 },

  row2: { flexDirection: 'row', gap: 10 },

  fieldWrap: { flex: 1, marginBottom: 10, gap: 4 },
  fieldLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  input: {
    borderWidth: 1, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 14,
  },
  cycleBtn: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
  },

  kalemCard: {
    borderRadius: 14, borderWidth: 1,
    padding: 12, marginBottom: 10, gap: 0,
  },
  kalemHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 10,
  },
  kalemNumBadge: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
  },
  kalemNumTxt: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  kalemDelBtn: { padding: 4 },
  kalemTotal: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 8, borderTopWidth: 1, marginTop: 4,
  },

  addKalemBtn: {
    borderWidth: 1, borderStyle: 'dashed', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', marginBottom: 4,
  },

  yasal: {
    borderWidth: 1, borderRadius: 10, padding: 12, marginTop: 10,
  },
  yasalTxt: { fontSize: 12, color: '#7A5C00', lineHeight: 18 },

  footer: {
    padding: 16, paddingTop: 12, borderTopWidth: 1,
  },
  generateBtn: {
    backgroundColor: '#111B2E',
    borderRadius: 16, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 20,
  },
  generateBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },
  generateBtnTotal: { color: '#ECC85A', fontSize: 16, fontWeight: '800' },
});
