import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, StatusBar, Alert, Modal, ActivityIndicator,
  KeyboardAvoidingView, Platform, Linking, FlatList,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';
import supabase from '../utils/supabaseClient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import { usePremium } from '../context/PremiumContext';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../themes/colors';
import { buildServisKartiHTML } from '../pdf/servisKartiBuilder';
import { saveServisKarti } from '../utils/servisStorage';
import { savePDFPermanently } from '../utils/pdfStorage';

const DRAFT_KEY = '@servis_form_draft_v1';

const YAKIT_LISTESI = ['Benzin', 'Dizel', 'LPG', 'Elektrik', 'Hibrit (HEV)', 'Hibrit (PHEV)', 'CNG'];
const VITES_LISTESI = ['Manuel', 'Otomatik', 'Yarı Otomatik (DSG)', 'CVT', 'e-CVT'];

const MARKA_MODELLER = {
  'Alfa Romeo':     ['147','156','159','166','Brera','Giulia','Giulietta','GTV','MiTo','Spider','Stelvio','Tonale'],
  'Audi':           ['A1','A3','A4','A5','A6','A7','A8','Q2','Q3','Q5','Q7','Q8','TT','RS3','RS4','RS6','e-tron','Q4 e-tron'],
  'BMW':            ['1 Serisi','2 Serisi','3 Serisi','4 Serisi','5 Serisi','6 Serisi','7 Serisi','8 Serisi','X1','X2','X3','X4','X5','X6','X7','M2','M3','M4','M5','iX','i4','i5'],
  'BYD':            ['Atto 3','Dolphin','Han','Sea','Seal','Song Plus','Tang'],
  'Chery':          ['Arrizo 5','Arrizo 6','Tiggo 4','Tiggo 7','Tiggo 8'],
  'Chevrolet':      ['Aveo','Captiva','Cruze','Epica','Lacetti','Malibu','Niva','Orlando','Spark','Tahoe','Trax'],
  'Chrysler':       ['300C','Grand Voyager','PT Cruiser','Sebring','Voyager'],
  'Citroen':        ['Berlingo','C1','C2','C3','C3 Aircross','C4','C4 Cactus','C5','C5 Aircross','C6','DS3','DS4','DS5','Jumpy','Spacetourer','Xsara Picasso'],
  'Dacia':          ['Duster','Jogger','Logan','Logan MCV','Lodgy','Sandero','Sandero Stepway','Spring'],
  'Dodge':          ['Caliber','Challenger','Charger','Durango','Journey','Nitro','Ram 1500'],
  'Fiat':           ['500','500L','500X','Bravo','Brava','Doblo','Egea','Fiorino','Linea','Marea','Panda','Punto','Stilo','Tempra','Tipo','Uno'],
  'Ford':           ['B-Max','C-Max','Connect','Courier','EcoSport','Edge','Escape','Fiesta','Focus','Fusion','Galaxy','Kuga','Maverick','Mondeo','Mustang','Puma','Ranger','S-Max','Transit','Tourneo'],
  'GAC':            ['Empow','GS3','GS4','GS5','GS8'],
  'Haval':          ['Dargo','H6','H9','Jolion'],
  'Honda':          ['Accord','Civic','CR-V','CR-Z','FR-V','HR-V','Jazz','Legend','Logo','Odyssey','Pilot'],
  'Hyundai':        ['Accent','Azera','Bayon','Elantra','Getz','i10','i20','i30','i40','i45','Ioniq','Ioniq 5','Ioniq 6','Kona','Matrix','Santa Fe','Sonata','Terracan','Trajet','Tucson','Veloster'],
  'Isuzu':          ['D-Max','Trooper'],
  'Jaguar':         ['E-Pace','F-Pace','F-Type','I-Pace','S-Type','X-Type','XE','XF','XJ'],
  'Jeep':           ['Avenger','Cherokee','Commander','Compass','Grand Cherokee','Liberty','Patriot','Renegade','Wrangler'],
  'Kia':            ['Carens','Ceed','Cerato','EV6','Magentis','Niro','Optima','Picanto','Pro Ceed','Rio','Sorento','Soul','Sportage','Stinger','Stonic','Xceed'],
  'Land Rover':     ['Defender','Discovery','Discovery Sport','Evoque','Freelander','Range Rover','Range Rover Sport','Velar'],
  'Lexus':          ['CT 200h','ES','GS','IS','LS','LX','NX','RX','UX'],
  'Maserati':       ['Ghibli','GranTurismo','Grecale','Levante','Quattroporte'],
  'Mazda':          ['CX-3','CX-5','CX-60','MX-5','Mazda2','Mazda3','Mazda6','MPV','Premacy','RX-8'],
  'Mercedes-Benz':  ['A Sınıfı','B Sınıfı','C Sınıfı','E Sınıfı','G Sınıfı','S Sınıfı','CLA','CLK','CLS','GLA','GLB','GLC','GLE','GLS','Sprinter','V Sınıfı','Vito','EQA','EQB','EQC','EQE','EQS'],
  'MG':             ['3','4','5','6','HS','Marvel R','ZS','ZS EV'],
  'Mini':           ['Cabrio','Clubman','Cooper','Countryman','Paceman'],
  'Mitsubishi':     ['ASX','Colt','Eclipse Cross','Galant','L200','Lancer','Outlander','Pajero','Space Star'],
  'Nissan':         ['Almera','Juke','Leaf','Micra','Note','Pathfinder','Primera','Qashqai','Skyline','Terrano','X-Trail'],
  'Opel':           ['Adam','Agila','Antara','Astra','Calibra','Combo','Corsa','Crossland','Frontera','Grandland','Insignia','Kadett','Manta','Meriva','Mokka','Movano','Omega','Signum','Vectra','Vivaro','Zafira','Zafira Life'],
  'Peugeot':        ['1007','106','107','108','206','207','208','301','306','307','308','406','407','408','508','605','607','2008','3008','4007','5008','Bipper','Partner','Rifter','Traveller'],
  'Pontiac':        ['Aztek','Bonneville','Firebird','G6','Grand Am','Grand Prix','GTO','Montana','Solstice','Sunfire','Trans Am','Vibe'],
  'Porsche':        ['718','911','918','Cayenne','Cayman','Macan','Panamera','Taycan'],
  'Renault':        ['Captur','Clio','Espace','Fluence','Kadjar','Kangoo','Laguna','Latitude','Megane','Modus','Rapid','Safrane','Scenic','Symbol','Talisman','Traffic','Twingo','Zoe'],
  'Saab':           ['9-3','9-5','9-7X'],
  'Seat':           ['Arona','Ateca','Cordoba','Ibiza','Leon','Tarraco','Toledo'],
  'Skoda':          ['Enyaq','Fabia','Kamiq','Karoq','Kodiaq','Octavia','Rapid','Roomster','Superb','Yeti'],
  'Subaru':         ['Forester','Impreza','Legacy','Levorg','Outback','WRX','XV'],
  'Suzuki':         ['Alto','Baleno','Celerio','Grand Vitara','Ignis','Jimny','Kizashi','Liana','S-Cross','SX4','Swift','Vitara'],
  'Tata':           ['Indica','Indigo','Safari','Sumo','Venture'],
  'Tesla':          ['Model 3','Model S','Model X','Model Y','Cybertruck'],
  'TOGG':           ['T10X','T10F'],
  'Toyota':         ['Auris','Avensis','Aygo','C-HR','Camry','Celica','Corolla','GR Yaris','Hilux','Land Cruiser','Prius','Proace','RAV4','Rush','Supra','Verso','Yaris','bZ4X'],
  'Volkswagen':     ['Amarok','Arteon','Bora','Caddy','Crafter','Golf','ID.3','ID.4','Jetta','Passat','Phaeton','Polo','Sharan','T-Cross','T-Roc','Tiguan','Touareg','Touran','Transporter'],
  'Volvo':          ['C30','C40','C70','EX30','S40','S60','S80','S90','V40','V50','V60','V70','V90','XC40','XC60','XC70','XC90'],
};
const MARKALAR = Object.keys(MARKA_MODELLER).sort();

function todayStr() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

const EMPTY = {
  make: '', model: '', year: '', plaka: '', sasiNo: '', fuel: '', gear: '', color: '',
  kmNow: '', kmNext: '', tarih: todayStr(), shop: '', addr: '',
  phone: '', done: '', parts: '', suggest: '', note: '',
};

export default function ServisFormScreen({ navigation }) {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  const insets = useSafeAreaInsets();
  const { gate } = usePremium();

  const [form, setForm] = useState(EMPTY);
  const [logoUri, setLogoUri] = useState(null);
  const [picker, setPicker] = useState({ visible: false, key: '', title: '', items: [], search: '' });
  const [previewModal, setPreviewModal] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [webLoaded, setWebLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pdfUri, setPdfUri] = useState(null);
  const [qrVisible, setQrVisible] = useState(false);
  const [qrPlaka, setQrPlaka] = useState('');
  const saveTimer = useRef(null);

  useEffect(() => {
    loadDraft();
  }, []);

  const loadDraft = async () => {
    try {
      const raw = await AsyncStorage.getItem(DRAFT_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        setForm(f => ({ ...EMPTY, ...d.form }));
        if (d.logoUri) setLogoUri(d.logoUri);
      }
    } catch {}
  };

  const scheduleSave = (newForm, newLogoUri) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      AsyncStorage.setItem(DRAFT_KEY, JSON.stringify({ form: newForm, logoUri: newLogoUri })).catch(() => {});
    }, 800);
  };

  const setField = (key, val) => {
    setForm(f => {
      const next = { ...f, [key]: val };
      scheduleSave(next, logoUri);
      return next;
    });
  };

  const openPicker = (key, title, items) => {
    setPicker({ visible: true, key, title, items, search: '' });
  };

  const selectPickerItem = (val) => {
    if (picker.key === 'make') {
      setForm(f => {
        const next = { ...f, make: val, model: '' };
        scheduleSave(next, logoUri);
        return next;
      });
    } else {
      setField(picker.key, val);
    }
    setPicker(p => ({ ...p, visible: false }));
  };

  const getModelList = () => {
    if (form.make && MARKA_MODELLER[form.make]) return MARKA_MODELLER[form.make];
    return MARKALAR.flatMap(m => MARKA_MODELLER[m]);
  };

  const pickLogo = async (fromCamera = false) => {
    try {
      const perm = fromCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('İzin Gerekli', 'Logo eklemek için izin vermeniz gerekiyor.');
        return;
      }
      const result = fromCamera
        ? await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.9 })
        : await ImagePicker.launchImageLibraryAsync({ allowsMultipleSelection: false, quality: 0.9 });
      if (!result.canceled && result.assets?.[0]) {
        const uri = result.assets[0].uri;
        setLogoUri(uri);
        scheduleSave(form, uri);
      }
    } catch {
      Alert.alert('Hata', 'Logo seçilemedi.');
    }
  };

  const logoToBase64 = async (uri) => {
    try {
      const compressed = await ImageManipulator.manipulateAsync(
        uri, [{ resize: { width: 300 } }],
        { compress: 0.85, format: ImageManipulator.SaveFormat.PNG }
      );
      const b64 = await FileSystem.readAsStringAsync(compressed.uri, { encoding: 'base64' });
      return `data:image/png;base64,${b64}`;
    } catch {
      return null;
    }
  };

  const openPreview = async () => {
    setSaving(true);
    try {
      let logoBase64 = null;
      if (logoUri) logoBase64 = await logoToBase64(logoUri);
      const html = buildServisKartiHTML({ ...form, logoBase64 });
      setPreviewHtml(html);
      setWebLoaded(false);
      setPdfUri(null);
      setPreviewModal(true);
    } catch (e) {
      Alert.alert('Hata', 'Önizleme oluşturulamadı.');
    } finally {
      setSaving(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (saving) return;
    if (!(await gate())) return;
    setSaving(true);
    try {
      let logoBase64 = null;
      if (logoUri) logoBase64 = await logoToBase64(logoUri);
      const rawHtml = buildServisKartiHTML({ ...form, logoBase64 });
      const html = rawHtml.replace(/<link[^>]*googleapis\.com[^>]*>/g, '');
      const { uri } = await Print.printToFileAsync({ html, width: 595, height: 842 });
      const title = `Servis_${(form.plaka || 'Kart').replace(/\s/g, '_')}_${form.tarih.replace(/\./g, '')}`;
      const perm = await savePDFPermanently(uri, title);
      setPdfUri(perm || uri);

      const id = Date.now().toString();
      await saveServisKarti({
        id,
        plaka: form.plaka.toUpperCase().trim(),
        tarih: form.tarih,
        timestamp: Date.now(),
        make: form.make,
        model: form.model,
        year: form.year,
        fuel: form.fuel,
        color: form.color,
        kmNow: form.kmNow,
        kmNext: form.kmNext,
        shop: form.shop,
        addr: form.addr,
        phone: form.phone,
        done: form.done,
        parts: form.parts,
        suggest: form.suggest,
        note: form.note,
        logoUri: logoUri || null,
        pdfUri: perm || uri,
      });

      const plaka = form.plaka.toUpperCase().trim() || 'PLAKA';
      if (plaka && plaka !== 'PLAKA') {
        await saveToCloud(plaka);
        setPreviewModal(false);
        setQrPlaka(plaka);
        setQrVisible(true);
      } else {
        setPreviewModal(false);
        Alert.alert(
          'Kayıt Tamamlandı',
          'Plaka girilmediği için kayıt yalnızca cihazınızda saklandı.',
          [{ text: 'Tamam' }]
        );
      }
    } catch (e) {
      Alert.alert('Hata', 'PDF oluşturulamadı: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    let uri = pdfUri;
    if (!uri) {
      setSaving(true);
      try {
        let logoBase64 = null;
        if (logoUri) logoBase64 = await logoToBase64(logoUri);
        const rawHtml = buildServisKartiHTML({ ...form, logoBase64 });
        const html = rawHtml.replace(/<link[^>]*googleapis\.com[^>]*>/g, '');
        const { uri: newUri } = await Print.printToFileAsync({ html, width: 595, height: 842 });
        const title = `Servis_${(form.plaka || 'Kart').replace(/\s/g, '_')}_${form.tarih.replace(/\./g, '')}`;
        const perm = await savePDFPermanently(newUri, title);
        uri = perm || newUri;
        setPdfUri(uri);
      } catch {
        Alert.alert('Hata', 'PDF oluşturulamadı.');
        setSaving(false);
        return;
      } finally {
        setSaving(false);
      }
    }
    try {
      const can = await Sharing.isAvailableAsync();
      if (can) await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Servis Bakım Kartı' });
    } catch {
      Alert.alert('Hata', 'PDF paylaşılamadı.');
    }
  };

  const shareViaWhatsApp = async () => {
    const url = `https://alhazenpdf.com/servis/${encodeURIComponent(qrPlaka)}`;
    const msg = `Aracınıza ait servis bakım kaydını aşağıdaki linkten görüntüleyebilirsiniz:\n${url}`;
    try {
      await Linking.openURL(`whatsapp://send?text=${encodeURIComponent(msg)}`);
    } catch {
      Alert.alert('WhatsApp Bulunamadı', 'Cihazınızda WhatsApp yüklü değil.');
    }
  };

  const saveToCloud = async (plaka) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      const parts = form.tarih.split('.');
      const tarihISO = parts.length === 3
        ? new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).toISOString()
        : new Date().toISOString();
      await supabase.from('servis_kayitlari').insert({
        plaka,
        telefon: form.phone || null,
        marka: form.make || null,
        model: form.model || null,
        yil: form.year || null,
        renk: form.color || null,
        yakit: form.fuel || null,
        km: form.kmNow || null,
        km_sonraki: form.kmNext || null,
        yapilan_islemler: form.done || null,
        degistirilen_parcalar: form.parts || null,
        onerilenler: form.suggest || null,
        notlar: form.note || null,
        tarih: tarihISO,
        user_id: user.id,
        garaj_adi: form.shop || user.user_metadata?.garaj_adi || null,
        garaj_adres: form.addr || null,
        sasi_no: form.sasiNo?.toUpperCase().trim() || null,
      });
      return true;
    } catch {
      return false;
    }
  };

  const clearDraft = () => {
    Alert.alert('Formu Temizle', 'Tüm servis bilgileri ve logo silinecek. Emin misin?', [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Temizle', style: 'destructive', onPress: async () => {
          setForm({ ...EMPTY, tarih: todayStr() });
          setLogoUri(null);
          setPdfUri(null);
          await AsyncStorage.removeItem(DRAFT_KEY);
        },
      },
    ]);
  };

  const hasDraft = Object.values(form).some(v => v && v !== EMPTY.tarih) || logoUri;

  const bg = isDark ? '#0d0f14' : '#F9FAFB';
  const surface = isDark ? '#161a23' : '#fff';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const label = isDark ? '#9ca3af' : '#6b7280';
  const accent = '#FF8C1E';

  const renderField = (key, placeholder, opts = {}) => (
    <View style={[styles.fieldWrap, opts.full && styles.fieldFull]}>
      <Text style={[styles.fieldLabel, { color: label }]}>{opts.label || placeholder}</Text>
      <TextInput
        style={[
          opts.multiline ? styles.textarea : styles.input,
          { backgroundColor: surface, borderColor: border, color: theme.text },
        ]}
        placeholder={placeholder}
        placeholderTextColor={isDark ? '#4b5563' : '#9ca3af'}
        value={form[key]}
        onChangeText={v => setField(key, v)}
        multiline={opts.multiline}
        numberOfLines={opts.multiline ? 4 : 1}
        textAlignVertical={opts.multiline ? 'top' : 'center'}
        keyboardType={opts.numeric ? 'numeric' : 'default'}
      />
    </View>
  );

  const renderSelect = (key, lbl, pickerTitle, pickerItems, opts = {}) => (
    <View style={[styles.fieldWrap, opts.full && styles.fieldFull]}>
      <Text style={[styles.fieldLabel, { color: label }]}>{lbl}</Text>
      <TouchableOpacity
        style={[styles.input, styles.selectBtn, { backgroundColor: surface, borderColor: border }]}
        onPress={() => openPicker(key, pickerTitle, pickerItems)}
        activeOpacity={0.7}
      >
        <Text style={[styles.selectTxt, { color: form[key] ? theme.text : (isDark ? '#4b5563' : '#9ca3af') }]}>
          {form[key] || `Seç…`}
        </Text>
        <Text style={[styles.selectArrow, { color: accent }]}>▾</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bg} />

      <View style={[styles.nav, { borderBottomColor: border, paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: isDark ? '#1e2330' : '#f3f4f6', borderColor: border }]}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={18} color={theme.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.navTitle, { color: theme.text }]}>Servis Bakım Kartı</Text>
          <Text style={[styles.navSub, { color: label }]}>Araç · Bakım · Parça bilgileri</Text>
        </View>
        {hasDraft && (
          <TouchableOpacity
            style={[styles.navBtn, { backgroundColor: 'rgba(220,38,38,0.1)', borderColor: 'rgba(220,38,38,0.3)' }]}
            onPress={clearDraft}
          >
            <Icon name="delete-outline" size={18} color="#EF4444" />
          </TouchableOpacity>
        )}
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'android' ? 80 : 0}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Araç Bilgileri ── */}
          <View style={[styles.section, { backgroundColor: surface, borderColor: border }]}>
            <View style={[styles.sectionBar, { backgroundColor: accent + '22', flexDirection: 'row', alignItems: 'center', gap: 8 }]}>
              <Icon name="car-outline" size={16} color={accent} />
              <Text style={[styles.sectionTitle, { color: accent }]}>Araç Bilgileri</Text>
            </View>
            <View style={styles.row2}>
              {renderSelect('make', 'Marka', 'Araç Markası', MARKALAR)}
              {renderSelect('model', 'Model', 'Model Seç', getModelList())}
            </View>
            <View style={styles.row2}>
              {renderField('year', '2018', { label: 'Yıl', numeric: true })}
              {renderField('plaka', '26 ABC 123', { label: 'Plaka *' })}
            </View>
            {renderField('sasiNo', 'WVWZZZ3BZWE123456', { label: 'Şasi No (opsiyonel)', full: true })}
            <View style={styles.row2}>
              {renderSelect('fuel', 'Yakıt Tipi', 'Yakıt Tipi', YAKIT_LISTESI)}
              {renderSelect('gear', 'Vites', 'Vites Tipi', VITES_LISTESI)}
            </View>
            {renderField('color', 'Gri', { label: 'Renk', full: true })}
            <View style={styles.row2}>
              {renderField('kmNow', '97.750', { label: 'Mevcut KM', numeric: true })}
              {renderField('kmNext', '113.750', { label: 'Sonraki Bakım KM', numeric: true })}
            </View>
          </View>

          {/* ── Servis Bilgileri ── */}
          <View style={[styles.section, { backgroundColor: surface, borderColor: border }]}>
            <View style={[styles.sectionBar, { backgroundColor: '#4A8AD022', flexDirection: 'row', alignItems: 'center', gap: 8 }]}>
              <Icon name="wrench-outline" size={16} color="#4A8AD0" />
              <Text style={[styles.sectionTitle, { color: '#4A8AD0' }]}>Servis Bilgileri</Text>
            </View>
            <View style={styles.row2}>
              {renderField('tarih', '15.05.2026', { label: 'Tarih' })}
              {renderField('shop', 'Yılmaz Oto Servis', { label: 'Servis / Esnaf Adı' })}
            </View>
            {renderField('addr', 'Eskişehir Organize Sanayi', { label: 'Adres / Bölge', full: true })}
            {renderField('phone', '0532 000 00 00', { label: 'Telefon', full: true })}

            {/* Logo picker */}
            <View style={styles.fieldFull}>
              <Text style={[styles.fieldLabel, { color: label }]}>Servis Logosu (opsiyonel)</Text>
              <View style={styles.logoRow}>
                <View style={[styles.logoBox, { borderColor: accent + '55', backgroundColor: isDark ? '#0d0f14' : '#f9fafb' }]}>
                  {logoUri ? (
                    <View style={styles.logoPreview}>
                      <Text style={styles.logoCheck}>✓</Text>
                      <Text style={[styles.logoSetTxt, { color: '#28A060' }]}>Logo seçildi</Text>
                    </View>
                  ) : (
                    <Text style={[styles.logoPlaceholder, { color: accent + '55' }]}>SERVİS{'\n'}LOGO</Text>
                  )}
                </View>
                <View style={styles.logoBtns}>
                  <TouchableOpacity
                    style={[styles.logoBtn, { borderColor: accent + '55', backgroundColor: accent + '11' }]}
                    onPress={() => pickLogo(false)}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Icon name="image-multiple-outline" size={15} color={accent} />
                      <Text style={[styles.logoBtnTxt, { color: accent }]}>Galeriden Seç</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.logoBtn, { borderColor: accent + '55', backgroundColor: accent + '11' }]}
                    onPress={() => pickLogo(true)}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Icon name="camera-outline" size={15} color={accent} />
                      <Text style={[styles.logoBtnTxt, { color: accent }]}>Kamerayla Çek</Text>
                    </View>
                  </TouchableOpacity>
                  {logoUri && (
                    <TouchableOpacity onPress={() => { setLogoUri(null); scheduleSave(form, null); }}>
                      <Text style={[styles.logoClearTxt, { color: '#dc2626' }]}>✕ Logoyu Kaldır</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* ── Bakım Detayları ── */}
          <View style={[styles.section, { backgroundColor: surface, borderColor: border }]}>
            <View style={[styles.sectionBar, { backgroundColor: '#28A06022' }]}>
              <Text style={[styles.sectionTitle, { color: '#28A060' }]}>📋  Bakım Detayları</Text>
            </View>

            <View style={styles.fieldFull}>
              <Text style={[styles.fieldLabel, { color: label }]}>Yapılan Bakım / İşlemler</Text>
              <Text style={[styles.fieldHint, { color: label }]}>Her satır ayrı işlem olarak görünür</Text>
              <TextInput
                style={[styles.textarea, { backgroundColor: isDark ? '#0d0f14' : '#f9fafb', borderColor: border, color: theme.text }]}
                placeholder={'Yağ ve yağ filtresi değişimi\nHava filtresi değişimi\nAntifriz bakımı ve takviyesi'}
                placeholderTextColor={isDark ? '#4b5563' : '#9ca3af'}
                value={form.done}
                onChangeText={v => setField('done', v)}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.fieldFull}>
              <Text style={[styles.fieldLabel, { color: label }]}>Değiştirilen Parçalar</Text>
              <Text style={[styles.fieldHint, { color: label }]}>Her satır ayrı parça (opsiyonel)</Text>
              <TextInput
                style={[styles.textarea, { backgroundColor: isDark ? '#0d0f14' : '#f9fafb', borderColor: border, color: theme.text }]}
                placeholder={'Sol ön aks takımı\nTriger kayışı ve gergi seti'}
                placeholderTextColor={isDark ? '#4b5563' : '#9ca3af'}
                value={form.parts}
                onChangeText={v => setField('parts', v)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.fieldFull}>
              <Text style={[styles.fieldLabel, { color: label }]}>Sonraki Bakımda Önerilen İşlemler</Text>
              <Text style={[styles.fieldHint, { color: label }]}>Virgül veya satırla ayır</Text>
              <TextInput
                style={[styles.textarea, { backgroundColor: isDark ? '#0d0f14' : '#f9fafb', borderColor: border, color: theme.text }]}
                placeholder={'Baskı balata ve volant değişimi, Triger set değişimi'}
                placeholderTextColor={isDark ? '#4b5563' : '#9ca3af'}
                value={form.suggest}
                onChangeText={v => setField('suggest', v)}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.fieldFull}>
              <Text style={[styles.fieldLabel, { color: label }]}>Teknisyen Notu (opsiyonel)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: isDark ? '#0d0f14' : '#f9fafb', borderColor: border, color: theme.text }]}
                placeholder="Alt şasi temiz. Motor külbütör kapağında hafif sızıntı gözlemlendi."
                placeholderTextColor={isDark ? '#4b5563' : '#9ca3af'}
                value={form.note}
                onChangeText={v => setField('note', v)}
              />
            </View>
          </View>

          {/* Önizle butonu */}
          <TouchableOpacity
            style={[styles.previewBtn, { borderColor: accent + '60', backgroundColor: accent + '15' }]}
            onPress={openPreview}
            disabled={saving}
            activeOpacity={0.8}
          >
            {saving
              ? <ActivityIndicator color={accent} />
              : <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Icon name="eye-outline" size={16} color={accent} />
                  <Text style={[styles.previewBtnTxt, { color: accent }]}>Kartı Önizle</Text>
                </View>
            }
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── PICKER MODAL ── */}
      <Modal visible={picker.visible} animationType="slide" transparent onRequestClose={() => setPicker(p => ({ ...p, visible: false }))}>
        <KeyboardAvoidingView style={styles.pickerOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={[styles.pickerSheet, { backgroundColor: surface }]}>
            <View style={[styles.pickerHeader, { borderBottomColor: border }]}>
              <Text style={[styles.pickerTitle, { color: theme.text }]}>{picker.title}</Text>
              <TouchableOpacity onPress={() => setPicker(p => ({ ...p, visible: false }))}>
                <Text style={[styles.pickerClose, { color: label }]}>✕</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.pickerSearch, { backgroundColor: isDark ? '#0d0f14' : '#f3f4f6', borderColor: border, color: theme.text }]}
              placeholder="Ara…"
              placeholderTextColor={isDark ? '#4b5563' : '#9ca3af'}
              value={picker.search}
              onChangeText={s => setPicker(p => ({ ...p, search: s }))}
              autoFocus
            />
            <FlatList
              data={picker.items.filter(i => i.toLowerCase().includes(picker.search.toLowerCase()))}
              keyExtractor={i => i}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.pickerItem, { borderBottomColor: border }, item === form[picker.key] && { backgroundColor: accent + '18' }]}
                  onPress={() => selectPickerItem(item)}
                >
                  <Text style={[styles.pickerItemTxt, { color: theme.text }, item === form[picker.key] && { color: accent, fontWeight: '700' }]}>
                    {item}
                  </Text>
                  {item === form[picker.key] && <Text style={{ color: accent }}>✓</Text>}
                </TouchableOpacity>
              )}
              ListFooterComponent={
                picker.search.trim().length > 0 ? (
                  <TouchableOpacity
                    style={[styles.pickerItem, { borderBottomColor: 'transparent', backgroundColor: accent + '12' }]}
                    onPress={() => selectPickerItem(picker.search.trim())}
                  >
                    <Text style={{ color: accent, fontWeight: '700', fontSize: 14 }}>+ "{picker.search.trim()}" olarak kullan</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={{ paddingHorizontal: 20, paddingVertical: 14 }}>
                    <Text style={{ color: isDark ? '#4b5563' : '#9ca3af', fontSize: 12 }}>Listede bulamadıysanız yukarıya yazıp "+ olarak kullan" seçeneğine basın</Text>
                  </View>
                )
              }
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── QR MODAL ── */}
      <Modal visible={qrVisible} animationType="fade" transparent onRequestClose={() => setQrVisible(false)}>
        <View style={styles.qrOverlay}>
          <View style={styles.qrSheet}>
            <Text style={styles.qrTitle}>Kayıt Tamamlandı!</Text>
            <Text style={styles.qrSub}>QR kodu motor kapağına yapıştırın{'\n'}Taratıldığında servis geçmişi görünür</Text>
            <View style={styles.qrWrap}>
              <QRCode
                value={`https://alhazenpdf.com/servis/${encodeURIComponent(qrPlaka)}`}
                size={200}
                color="#060810"
                backgroundColor="#ffffff"
              />
            </View>
            <Text style={styles.qrUrl}>alhazenpdf.com/servis/{qrPlaka}</Text>
            <View style={styles.qrActions}>
              <View style={styles.qrRow}>
                {pdfUri && (
                  <TouchableOpacity
                    style={[styles.qrBtn, styles.qrBtnFlex, { backgroundColor: 'rgba(40,160,96,0.12)', borderColor: 'rgba(40,160,96,0.4)' }]}
                    onPress={() => { setQrVisible(false); handleShare(); }}
                  >
                    <Text style={[styles.qrBtnTxt, { color: '#28A060' }]}>↑  PDF Paylaş</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.qrBtn, styles.qrBtnFlex, { backgroundColor: 'rgba(37,211,102,0.12)', borderColor: 'rgba(37,211,102,0.4)' }]}
                  onPress={shareViaWhatsApp}
                >
                  <Text style={[styles.qrBtnTxt, { color: '#25D366' }]}>💬  WhatsApp</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[styles.qrBtn, { backgroundColor: 'rgba(255,140,30,0.12)', borderColor: 'rgba(255,140,30,0.4)' }]}
                onPress={() => setQrVisible(false)}
              >
                <Text style={[styles.qrBtnTxt, { color: accent }]}>Kapat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── PREVIEW MODAL ── */}
      <Modal visible={previewModal} animationType="slide" onRequestClose={() => setPreviewModal(false)}>
        <View style={[styles.modalContainer, { backgroundColor: '#0A0C10' }]}>
          <View style={styles.modalNav}>
            <TouchableOpacity style={styles.modalClose} onPress={() => setPreviewModal(false)}>
              <Text style={styles.modalCloseTxt}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalNavTitle}>Servis Bakım Kartı</Text>
            <View style={{ width: 36 }} />
          </View>

          <View style={{ flex: 1 }}>
            {!webLoaded && (
              <View style={styles.webLoading}>
                <ActivityIndicator color={accent} size="large" />
                <Text style={styles.webLoadingTxt}>Kart yükleniyor…</Text>
              </View>
            )}
            <WebView
              source={{ html: previewHtml }}
              style={{ flex: 1, opacity: webLoaded ? 1 : 0 }}
              onLoad={() => setWebLoaded(true)}
              scrollEnabled
              originWhitelist={['*']}
              javaScriptEnabled
            />
          </View>

          <View style={[styles.modalActions, { borderTopColor: 'rgba(255,140,30,0.2)', backgroundColor: '#0E1218' }]}>
            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: 'rgba(255,140,30,0.12)', borderColor: 'rgba(255,140,30,0.4)' }]}
              onPress={handleGeneratePDF}
              disabled={saving}
            >
              {saving
                ? <ActivityIndicator color={accent} size="small" />
                : <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Icon name="content-save-outline" size={16} color={accent} />
                    <Text style={[styles.modalBtnTxt, { color: accent }]}>Kaydet & PDF Oluştur</Text>
                  </View>
              }
            </TouchableOpacity>
            {pdfUri && (
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: 'rgba(40,160,96,0.12)', borderColor: 'rgba(40,160,96,0.4)' }]}
                onPress={handleShare}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Icon name="share-variant" size={16} color="#28A060" />
                  <Text style={[styles.modalBtnTxt, { color: '#28A060' }]}>PDF'yi Paylaş</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  nav: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 14,
    borderBottomWidth: 1,
  },
  navBtn: {
    width: 36, height: 36, borderRadius: 10, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  navBtnTxt: { fontSize: 16 },
  navTitle: { fontSize: 16, fontWeight: '700', letterSpacing: -0.3 },
  navSub: { fontSize: 11, marginTop: 1 },
  clearBtnTxt: { fontSize: 16 },

  content: { padding: 16, gap: 16 },

  section: {
    borderRadius: 16, borderWidth: 1, overflow: 'hidden', gap: 12, paddingBottom: 16,
  },
  sectionBar: { paddingHorizontal: 16, paddingVertical: 10 },
  sectionTitle: { fontSize: 13, fontWeight: '700', letterSpacing: 0.3 },

  row2: { flexDirection: 'row', gap: 10, paddingHorizontal: 14 },

  fieldWrap: { flex: 1, gap: 4 },
  fieldFull: { paddingHorizontal: 14, gap: 4 },
  fieldLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 0.3, textTransform: 'uppercase' },
  fieldHint: { fontSize: 10, marginTop: -2 },

  input: {
    borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8,
    fontSize: 14,
  },
  textarea: {
    borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8,
    fontSize: 14, minHeight: 90,
  },

  logoRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  logoBox: {
    width: 82, height: 68, borderWidth: 1.5, borderRadius: 4,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  logoPreview: { alignItems: 'center', gap: 2 },
  logoCheck: { fontSize: 20, color: '#28A060' },
  logoSetTxt: { fontSize: 9, fontWeight: '600' },
  logoPlaceholder: { fontSize: 9, textAlign: 'center', letterSpacing: 2, lineHeight: 16 },
  logoBtns: { flex: 1, gap: 6, justifyContent: 'center' },
  logoBtn: {
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 7, borderWidth: 1,
  },
  logoBtnTxt: { fontSize: 12, fontWeight: '600' },
  logoClearTxt: { fontSize: 11, fontWeight: '600', paddingTop: 2 },

  selectBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  selectTxt: { fontSize: 14, flex: 1 },
  selectArrow: { fontSize: 16, marginLeft: 6 },

  pickerOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  pickerSheet: {
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    maxHeight: '75%', paddingBottom: 20,
  },
  pickerHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1,
  },
  pickerTitle: { fontSize: 16, fontWeight: '700' },
  pickerClose: { fontSize: 18, padding: 4 },
  pickerSearch: {
    margin: 12, borderWidth: 1, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 9, fontSize: 14,
  },
  pickerItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth,
  },
  pickerItemTxt: { fontSize: 15 },

  previewBtn: {
    borderWidth: 1.5, borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  previewBtnTxt: { fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },

  // Modal
  modalContainer: { flex: 1 },
  modalNav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,140,30,0.2)',
  },
  modalClose: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  modalCloseTxt: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  modalNavTitle: {
    fontSize: 14, fontWeight: '700', color: 'rgba(255,140,30,0.85)',
    letterSpacing: 0.5,
  },
  webLoading: {
    position: 'absolute', inset: 0,
    alignItems: 'center', justifyContent: 'center', gap: 12, zIndex: 10,
  },
  webLoadingTxt: { color: 'rgba(255,140,30,0.7)', fontSize: 13, letterSpacing: 0.5 },
  modalActions: {
    padding: 14, gap: 10, borderTopWidth: 1,
  },
  modalBtn: {
    borderRadius: 12, borderWidth: 1.5, paddingVertical: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  modalBtnTxt: { fontSize: 15, fontWeight: '700', letterSpacing: 0.4 },

  qrOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  qrSheet: {
    backgroundColor: '#161a23', borderRadius: 20, borderWidth: 1,
    borderColor: 'rgba(255,140,30,0.25)', padding: 28, alignItems: 'center', width: '100%',
  },
  qrTitle: { fontSize: 20, fontWeight: '800', color: '#EEF0F6', marginBottom: 6 },
  qrSub: { fontSize: 12, color: '#9ca3af', marginBottom: 24, textAlign: 'center', lineHeight: 18 },
  qrWrap: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16,
  },
  qrUrl: {
    fontSize: 11, color: '#6b7280', marginBottom: 24,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', letterSpacing: 0.3,
  },
  qrActions: { gap: 10, width: '100%' },
  qrRow: { flexDirection: 'row', gap: 10 },
  qrBtn: { borderRadius: 12, borderWidth: 1.5, paddingVertical: 13, alignItems: 'center' },
  qrBtnFlex: { flex: 1 },
  qrBtnTxt: { fontSize: 14, fontWeight: '700' },
});
