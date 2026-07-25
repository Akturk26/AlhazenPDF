import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, StatusBar, Alert, Image, FlatList, Modal,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../themes/colors';
import { saveArac, getAraclar } from '../utils/araclarimStorage';
import { scheduleAllNotifications } from '../utils/notifications';

const GOLD = '#C9A84C';

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
  'Ford':           ['B-Max','C-Max','Connect','Courier','EcoSport','Edge','Fiesta','Focus','Fusion','Galaxy','Kuga','Mondeo','Mustang','Puma','Ranger','S-Max','Transit','Tourneo'],
  'GAC':            ['Empow','GS3','GS4','GS5','GS8'],
  'Haval':          ['Dargo','H6','H9','Jolion'],
  'Honda':          ['Accord','Civic','CR-V','CR-Z','FR-V','HR-V','Jazz','Legend','Logo','Odyssey'],
  'Hyundai':        ['Accent','Azera','Bayon','Elantra','Getz','i10','i20','i30','i40','Ioniq','Ioniq 5','Ioniq 6','Kona','Matrix','Santa Fe','Sonata','Terracan','Tucson'],
  'Isuzu':          ['D-Max','Trooper'],
  'Jaguar':         ['E-Pace','F-Pace','F-Type','I-Pace','S-Type','X-Type','XE','XF','XJ'],
  'Jeep':           ['Avenger','Cherokee','Commander','Compass','Grand Cherokee','Liberty','Patriot','Renegade','Wrangler'],
  'Kia':            ['Carens','Ceed','Cerato','EV6','Magentis','Niro','Optima','Picanto','Pro Ceed','Rio','Sorento','Soul','Sportage','Stinger','Stonic','Xceed'],
  'Land Rover':     ['Defender','Discovery','Discovery Sport','Evoque','Freelander','Range Rover','Range Rover Sport','Velar'],
  'Lexus':          ['CT 200h','ES','GS','IS','LS','LX','NX','RX','UX'],
  'Maserati':       ['Ghibli','GranTurismo','Grecale','Levante','Quattroporte'],
  'Mazda':          ['CX-3','CX-5','CX-60','MX-5','Mazda2','Mazda3','Mazda6','MPV','Premacy','RX-8'],
  'Mercedes-Benz':  ['A Sınıfı','B Sınıfı','C Sınıfı','E Sınıfı','G Sınıfı','S Sınıfı','CLA','CLK','CLS','GLA','GLB','GLC','GLE','GLS','Sprinter','V Sınıfı','Vito','EQA','EQB','EQC'],
  'MG':             ['3','4','5','6','HS','Marvel R','ZS','ZS EV'],
  'Mini':           ['Cabrio','Clubman','Cooper','Countryman','Paceman'],
  'Mitsubishi':     ['ASX','Colt','Eclipse Cross','Galant','L200','Lancer','Outlander','Pajero','Space Star'],
  'Nissan':         ['Almera','Juke','Leaf','Micra','Note','Pathfinder','Primera','Qashqai','Terrano','X-Trail'],
  'Opel':           ['Adam','Agila','Antara','Astra','Calibra','Combo','Corsa','Crossland','Frontera','Grandland','Insignia','Kadett','Manta','Meriva','Mokka','Movano','Omega','Signum','Vectra','Vivaro','Zafira','Zafira Life'],
  'Peugeot':        ['106','107','108','206','207','208','301','306','307','308','406','407','408','508','2008','3008','4007','5008','Partner','Rifter','Traveller'],
  'Pontiac':        ['Aztek','Bonneville','Firebird','G6','Grand Am','Grand Prix','GTO','Montana','Solstice','Sunfire','Trans Am','Vibe'],
  'Porsche':        ['718','911','918','Cayenne','Cayman','Macan','Panamera','Taycan'],
  'Renault':        ['Captur','Clio','Espace','Fluence','Kadjar','Kangoo','Laguna','Megane','Modus','Scenic','Symbol','Talisman','Traffic','Twingo','Zoe'],
  'Saab':           ['9-3','9-5','9-7X'],
  'Seat':           ['Arona','Ateca','Cordoba','Ibiza','Leon','Tarraco','Toledo'],
  'Skoda':          ['Enyaq','Fabia','Kamiq','Karoq','Kodiaq','Octavia','Rapid','Roomster','Superb','Yeti'],
  'Subaru':         ['Forester','Impreza','Legacy','Levorg','Outback','WRX','XV'],
  'Suzuki':         ['Alto','Baleno','Celerio','Grand Vitara','Ignis','Jimny','Liana','S-Cross','SX4','Swift','Vitara'],
  'Tata':           ['Indica','Indigo','Safari','Sumo','Venture'],
  'Tesla':          ['Model 3','Model S','Model X','Model Y','Cybertruck'],
  'TOGG':           ['T10X','T10F'],
  'Toyota':         ['Auris','Avensis','Aygo','C-HR','Camry','Celica','Corolla','GR Yaris','Hilux','Land Cruiser','Prius','Proace','RAV4','Supra','Verso','Yaris','bZ4X'],
  'Volkswagen':     ['Amarok','Arteon','Bora','Caddy','Crafter','Golf','ID.3','ID.4','Jetta','Passat','Polo','Sharan','T-Cross','T-Roc','Tiguan','Touareg','Touran','Transporter'],
  'Volvo':          ['C30','C40','C70','EX30','S40','S60','S80','S90','V40','V50','V60','V70','V90','XC40','XC60','XC70','XC90'],
};
const MARKALAR = Object.keys(MARKA_MODELLER).sort();
const YAKIT_LISTESI = ['Benzin', 'Dizel', 'LPG', 'Elektrik', 'Hibrit (HEV)', 'Hibrit (PHEV)', 'CNG'];
const VITES_LISTESI = ['Manuel', 'Otomatik', 'Yarı Otomatik (DSG)', 'CVT', 'e-CVT'];

const EMPTY = { marka: '', model: '', yil: '', plaka: '', renk: '', yakit: '', vites: '' };

export default function SahsiAracEkleScreen({ navigation, route }) {
  const { arac: editArac } = route.params || {};
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  const insets = useSafeAreaInsets();

  const [form, setForm] = useState(editArac ? {
    marka: editArac.marka || '',
    model: editArac.model || '',
    yil: editArac.yil || '',
    plaka: editArac.plaka || '',
    renk: editArac.renk || '',
    yakit: editArac.yakit || '',
    vites: editArac.vites || '',
  } : EMPTY);
  const [fotoUri, setFotoUri] = useState(editArac?.fotoUri || null);
  const [saving, setSaving] = useState(false);
  const [picker, setPicker] = useState({ visible: false, key: '', title: '', items: [], search: '' });

  const bg = isDark ? '#0d0f14' : '#F9FAFB';
  const surface = isDark ? '#161a23' : '#fff';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const label = isDark ? '#9ca3af' : '#6b7280';

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const openPicker = (key, title, items) => setPicker({ visible: true, key, title, items, search: '' });

  const selectItem = (val) => {
    if (picker.key === 'marka') setForm(f => ({ ...f, marka: val, model: '' }));
    else setField(picker.key, val);
    setPicker(p => ({ ...p, visible: false }));
  };

  const getModelList = () => form.marka && MARKA_MODELLER[form.marka]
    ? MARKA_MODELLER[form.marka]
    : MARKALAR.flatMap(m => MARKA_MODELLER[m]);

  const pickPhoto = async (fromCamera = false) => {
    try {
      const perm = fromCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) { Alert.alert('İzin Gerekli', 'Fotoğraf eklemek için izin verin.'); return; }
      const result = fromCamera
        ? await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.8 })
        : await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.8 });
      if (!result.canceled && result.assets?.[0]) setFotoUri(result.assets[0].uri);
    } catch { Alert.alert('Hata', 'Fotoğraf seçilemedi.'); }
  };

  const handleSave = async () => {
    if (!form.marka) { Alert.alert('Eksik', 'Marka seçin.'); return; }
    if (!form.plaka.trim()) { Alert.alert('Eksik', 'Plaka girin.'); return; }
    setSaving(true);
    const arac = {
      id: editArac?.id || Date.now().toString(),
      ...form,
      plaka: form.plaka.toUpperCase().trim(),
      fotoUri: fotoUri || null,
      muayeneler: editArac?.muayeneler || [],
      sigortalar: editArac?.sigortalar || [],
      bakimlar: editArac?.bakimlar || [],
      createdAt: editArac?.createdAt || Date.now(),
    };
    await saveArac(arac);
    setSaving(false);
    scheduleAllNotifications();
    navigation.goBack();
  };

  const renderSelect = (key, lbl, pickerTitle, items) => (
    <View style={s.field}>
      <Text style={[s.lbl, { color: label }]}>{lbl}</Text>
      <TouchableOpacity
        style={[s.input, s.selectBtn, { backgroundColor: surface, borderColor: border }]}
        onPress={() => openPicker(key, pickerTitle, items)}
        activeOpacity={0.7}
      >
        <Text style={[s.selectTxt, { color: form[key] ? theme.text : (isDark ? '#4b5563' : '#9ca3af') }]}>
          {form[key] || 'Seç…'}
        </Text>
        <Text style={{ color: '#C9A84C', fontSize: 16 }}>▾</Text>
      </TouchableOpacity>
    </View>
  );

  const renderInput = (key, placeholder, opts = {}) => (
    <View style={s.field}>
      <Text style={[s.lbl, { color: label }]}>{opts.label || placeholder}</Text>
      <TextInput
        style={[s.input, { backgroundColor: surface, borderColor: border, color: theme.text }]}
        placeholder={placeholder}
        placeholderTextColor={isDark ? '#4b5563' : '#9ca3af'}
        value={form[key]}
        onChangeText={v => setField(key, v)}
        keyboardType={opts.numeric ? 'numeric' : 'default'}
        autoCapitalize={opts.upper ? 'characters' : 'none'}
      />
    </View>
  );

  return (
    <View style={[s.root, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bg} />

      <View style={[s.header, { paddingTop: insets.top + 12, borderBottomColor: border }]}>
        <TouchableOpacity style={[s.navBtn, { backgroundColor: isDark ? '#1e2330' : '#f3f4f6', borderColor: border }]} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={18} color={theme.text} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: theme.text }]}>{editArac ? 'Aracı Düzenle' : 'Yeni Araç Ekle'}</Text>
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={80}>
        <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">

          {/* Fotoğraf */}
          <View style={[s.section, { backgroundColor: surface, borderColor: border }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <Icon name="camera-outline" size={16} color={GOLD} />
              <Text style={[s.sectionTitle, { color: GOLD, marginBottom: 0 }]}>Araç Fotoğrafı</Text>
            </View>
            <View style={s.photoRow}>
              <View style={[s.photoBox, { borderColor: border, backgroundColor: isDark ? '#0d0f14' : '#f3f4f6' }]}>
                {fotoUri
                  ? <Image source={{ uri: fotoUri }} style={s.photo} resizeMode="cover" />
                  : <Icon name="car-outline" size={36} color={isDark ? '#555' : '#bbb'} />
                }
              </View>
              <View style={s.photoBtns}>
                <TouchableOpacity style={[s.photoBtn, { borderColor: '#C9A84C55', backgroundColor: '#C9A84C11' }]} onPress={() => pickPhoto(false)}>
                  <Icon name="folder-image" size={15} color={GOLD} />
                  <Text style={[s.photoBtnTxt, { color: GOLD }]}>Galeriden</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.photoBtn, { borderColor: '#C9A84C55', backgroundColor: '#C9A84C11' }]} onPress={() => pickPhoto(true)}>
                  <Icon name="camera-outline" size={15} color={GOLD} />
                  <Text style={[s.photoBtnTxt, { color: GOLD }]}>Kamera</Text>
                </TouchableOpacity>
                {fotoUri && (
                  <TouchableOpacity onPress={() => setFotoUri(null)}>
                    <Text style={{ color: '#dc2626', fontSize: 12, fontWeight: '600' }}>✕ Kaldır</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          {/* Araç Bilgileri */}
          <View style={[s.section, { backgroundColor: surface, borderColor: border }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <Icon name="car-outline" size={16} color={GOLD} />
              <Text style={[s.sectionTitle, { color: GOLD, marginBottom: 0 }]}>Araç Bilgileri</Text>
            </View>
            <View style={s.row2}>
              {renderSelect('marka', 'Marka *', 'Araç Markası', MARKALAR)}
              {renderSelect('model', 'Model', 'Model Seç', getModelList())}
            </View>
            <View style={s.row2}>
              {renderInput('yil', '2020', { label: 'Yıl', numeric: true })}
              {renderInput('plaka', '06 ABC 123', { label: 'Plaka *', upper: true })}
            </View>
            <View style={s.row2}>
              {renderSelect('yakit', 'Yakıt', 'Yakıt Tipi', YAKIT_LISTESI)}
              {renderSelect('vites', 'Vites', 'Vites Tipi', VITES_LISTESI)}
            </View>
            {renderInput('renk', 'Beyaz', { label: 'Renk' })}
          </View>

          {/* Kaydet */}
          <TouchableOpacity
            style={[s.saveBtn, { opacity: saving ? 0.7 : 1 }]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.85}
          >
            <Text style={s.saveTxt}>{saving ? 'Kaydediliyor…' : '✓  Aracı Kaydet'}</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Picker Modal */}
      <Modal visible={picker.visible} animationType="slide" transparent onRequestClose={() => setPicker(p => ({ ...p, visible: false }))}>
        <KeyboardAvoidingView style={s.pickerOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={[s.pickerSheet, { backgroundColor: surface }]}>
            <View style={[s.pickerHeader, { borderBottomColor: border }]}>
              <Text style={[s.pickerTitle, { color: theme.text }]}>{picker.title}</Text>
              <TouchableOpacity onPress={() => setPicker(p => ({ ...p, visible: false }))}>
                <Text style={[{ fontSize: 18, padding: 4, color: label }]}>✕</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[s.pickerSearch, { backgroundColor: isDark ? '#0d0f14' : '#f3f4f6', borderColor: border, color: theme.text }]}
              placeholder="Ara…" placeholderTextColor={isDark ? '#4b5563' : '#9ca3af'}
              value={picker.search}
              onChangeText={t => setPicker(p => ({ ...p, search: t }))}
              autoFocus
            />
            <FlatList
              data={picker.items.filter(i => i.toLowerCase().includes(picker.search.toLowerCase()))}
              keyExtractor={i => i}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[s.pickerItem, { borderBottomColor: border }, item === form[picker.key] && { backgroundColor: '#C9A84C18' }]}
                  onPress={() => selectItem(item)}
                >
                  <Text style={[s.pickerItemTxt, { color: theme.text }, item === form[picker.key] && { color: '#C9A84C', fontWeight: '700' }]}>{item}</Text>
                  {item === form[picker.key] && <Text style={{ color: '#C9A84C' }}>✓</Text>}
                </TouchableOpacity>
              )}
              ListFooterComponent={
                picker.search.trim().length > 0 ? (
                  <TouchableOpacity
                    style={[s.pickerItem, { borderBottomColor: 'transparent', backgroundColor: '#C9A84C12' }]}
                    onPress={() => selectItem(picker.search.trim())}
                  >
                    <Text style={{ color: '#C9A84C', fontWeight: '700', fontSize: 14 }}>+ "{picker.search.trim()}" olarak kullan</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={{ paddingHorizontal: 20, paddingVertical: 14 }}>
                    <Text style={{ color: '#9ca3af', fontSize: 12 }}>Listede bulamadıysanız yukarıya yazıp "+ olarak kullan" seçeneğine basın</Text>
                  </View>
                )
              }
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1,
  },
  navBtn: { width: 36, height: 36, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 17, fontWeight: '700', textAlign: 'center' },
  content: { padding: 16, gap: 16 },
  section: { borderRadius: 14, borderWidth: 1, padding: 16, gap: 12 },
  sectionTitle: { fontSize: 13, fontWeight: '700', letterSpacing: 0.3, marginBottom: 4 },
  row2: { flexDirection: 'row', gap: 10 },
  field: { flex: 1, gap: 4 },
  lbl: { fontSize: 11, fontWeight: '600', letterSpacing: 0.3, textTransform: 'uppercase' },
  input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 10, fontSize: 14 },
  selectBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  selectTxt: { fontSize: 14, flex: 1 },
  photoRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  photoBox: { width: 100, height: 76, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  photo: { width: '100%', height: '100%' },
  photoBtns: { flex: 1, gap: 8 },
  photoBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 5 },
  photoBtnTxt: { fontSize: 13, fontWeight: '600' },
  saveBtn: {
    backgroundColor: '#C9A84C', borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', marginTop: 4,
  },
  saveTxt: { color: '#fff', fontSize: 16, fontWeight: '800' },
  pickerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  pickerSheet: { borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '75%', paddingBottom: 20 },
  pickerHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
  pickerTitle: { fontSize: 16, fontWeight: '700' },
  pickerSearch: { margin: 12, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9, fontSize: 14 },
  pickerItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  pickerItemTxt: { fontSize: 15 },
});
