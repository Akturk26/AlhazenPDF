import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput,
  StatusBar, Alert, KeyboardAvoidingView, Platform, Modal, FlatList, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import Icon from '../components/Icon';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../themes/colors';
import { saveArac } from '../utils/satisStorage';
import { scheduleAllNotifications } from '../utils/notifications';
import { HASAR_HARITASI_HTML } from '../pdf/hasarHaritasiHTML';

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

function formatFiyat(value) {
  const digits = value.replace(/\D/g, '');
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
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

function today() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
}

export default function AracEkleScreen({ navigation, route }) {
  const edit = route?.params?.arac || null;
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  const insets = useSafeAreaInsets();

  const [marka, setMarka]           = useState(edit?.marka || '');
  const [model, setModel]           = useState(edit?.model || '');
  const [plaka, setPlaka]           = useState(edit?.plaka || '');
  const [yil, setYil]               = useState(edit?.yil || '');
  const [renk, setRenk]             = useState(edit?.renk || '');
  const [km, setKm]                 = useState(edit?.km || '');
  const [alisFiyat, setAlisFiyat]   = useState(edit?.alis_fiyat || '');
  const [alisTarihi, setAlisTarihi] = useState(edit?.alis_tarihi || today());
  const [satisFiyat, setSatisFiyat] = useState(edit?.satis_fiyat || '');
  const [satisTarihi, setSatisTarihi] = useState(edit?.satis_tarihi || '');
  const [muayeneTarihi, setMuayeneTarihi] = useState(edit?.muayene_tarihi || '');
  const [notlar, setNotlar]           = useState(edit?.notlar || '');
  const [hasarVerileri, setHasarVerileri] = useState(edit?.boyali_parcalar || {});
  const [picker, setPicker]               = useState({ visible: false, key: '', title: '', items: [], search: '' });
  const [hasarModalVisible, setHasarModalVisible] = useState(false);
  const [hasarModalReady, setHasarModalReady]     = useState(false);
  const hasarWebViewRef = useRef(null);

  const isSatildi = !!edit?.satis_tarihi;

  // Modal açılıp WebView hazır olunca mevcut veriyi inject et
  React.useEffect(() => {
    if (!hasarModalVisible || !hasarModalReady) return;
    if (Object.keys(hasarVerileri).length > 0) {
      hasarWebViewRef.current?.injectJavaScript(
        `loadInitialState(${JSON.stringify(hasarVerileri)}); true;`
      );
    }
  }, [hasarModalVisible, hasarModalReady]);

  const closeHasarModal = () => {
    setHasarModalVisible(false);
    setHasarModalReady(false);
  };

  const handleHasarMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      setHasarVerileri(data);
    } catch {}
    closeHasarModal();
  };

  const fieldStyle = [styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface2 }];

  const openPicker = (key, title, items) => setPicker({ visible: true, key, title, items, search: '' });

  const selectPickerItem = (value) => {
    if (picker.key === 'marka') {
      setMarka(value);
      setModel('');
    } else {
      setModel(value);
    }
    setPicker(p => ({ ...p, visible: false }));
  };

  const handleSave = async () => {
    if (!marka.trim()) { Alert.alert('Eksik', 'Marka zorunludur.'); return; }
    if (!model.trim()) { Alert.alert('Eksik', 'Model zorunludur.'); return; }
    if (!alisFiyat.trim()) { Alert.alert('Eksik', 'Alış fiyatı zorunludur.'); return; }

    await saveArac({
      id: edit?.id,
      marka: marka.trim(),
      model: model.trim(),
      plaka: plaka.trim().toUpperCase(),
      yil: yil.trim(),
      renk: renk.trim(),
      km: km.trim(),
      alis_fiyat: alisFiyat.trim(),
      satis_fiyat: satisFiyat.trim() || null,
      alis_tarihi: alisTarihi.trim(),
      satis_tarihi: satisTarihi.trim() || null,
      muayene_tarihi: muayeneTarihi.trim() || null,
      notlar: notlar.trim(),
      boyali_parcalar: Object.keys(hasarVerileri).length > 0 ? hasarVerileri : null,
      expertiz_notu: null,
    });

    scheduleAllNotifications();
    navigation.goBack();
  };

  const modeller = marka ? (MARKA_MODELLER[marka] || []) : [];

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.bg} />

        <View style={[styles.nav, { borderBottomColor: theme.border, backgroundColor: theme.bg, paddingTop: insets.top + 12 }]}>
          <TouchableOpacity
            style={[styles.navBtn, { backgroundColor: theme.surface2, borderColor: theme.border }]}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={18} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.navTitle, { color: theme.text }]}>{edit ? 'Aracı Düzenle' : 'Araç Ekle'}</Text>
        </View>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.body}>

            {/* Marka */}
            <Field label="MARKA *">
              <TouchableOpacity
                style={[fieldStyle, styles.pickerBtn]}
                onPress={() => openPicker('marka', 'Marka Seç', MARKALAR)}
                activeOpacity={0.7}
              >
                <Text style={{ flex: 1, fontSize: 14, color: marka ? theme.text : theme.textSecondary }}>
                  {marka || 'Marka seçin…'}
                </Text>
                <Text style={{ fontSize: 16, color: theme.textSecondary }}>›</Text>
              </TouchableOpacity>
            </Field>

            {/* Model */}
            <Field label="MODEL *">
              <TouchableOpacity
                style={[fieldStyle, styles.pickerBtn, { opacity: !marka ? 0.5 : 1 }]}
                onPress={() => marka && openPicker('model', 'Model Seç', modeller)}
                activeOpacity={0.7}
              >
                <Text style={{ flex: 1, fontSize: 14, color: model ? theme.text : theme.textSecondary }}>
                  {model || (marka ? 'Model seçin…' : 'Önce marka seçin')}
                </Text>
                <Text style={{ fontSize: 16, color: theme.textSecondary }}>›</Text>
              </TouchableOpacity>
            </Field>

            {/* Plaka */}
            <Field label="PLAKA">
              <TextInput
                style={fieldStyle}
                value={plaka}
                onChangeText={v => setPlaka(v.toUpperCase())}
                placeholder="34 AB 1234"
                placeholderTextColor={theme.textSecondary}
                autoCapitalize="characters"
              />
            </Field>

            <Row2>
              <Field label="YIL">
                <TextInput style={[fieldStyle, { flex: 1 }]} value={yil} onChangeText={setYil}
                  placeholder="2021" keyboardType="numeric" placeholderTextColor={theme.textSecondary} />
              </Field>
              <Field label="RENK">
                <TextInput style={[fieldStyle, { flex: 1 }]} value={renk} onChangeText={setRenk}
                  placeholder="Beyaz" placeholderTextColor={theme.textSecondary} />
              </Field>
            </Row2>

            <Row2>
              <Field label="KM">
                <TextInput style={[fieldStyle, { flex: 1 }]} value={km}
                  onChangeText={v => setKm(formatFiyat(v))}
                  placeholder="85.000" keyboardType="numeric" placeholderTextColor={theme.textSecondary} />
              </Field>
              <Field label="ALIŞ TARİHİ">
                <TextInput style={[fieldStyle, { flex: 1 }]} value={alisTarihi} onChangeText={setAlisTarihi}
                  placeholder="GG.AA.YYYY" placeholderTextColor={theme.textSecondary} />
              </Field>
            </Row2>

            <Field label="ALIŞ FİYATI (₺) *">
              <TextInput style={fieldStyle} value={alisFiyat}
                onChangeText={v => setAlisFiyat(formatFiyat(v))}
                placeholder="850.000" keyboardType="numeric" placeholderTextColor={theme.textSecondary} />
            </Field>

            <Field label="MUAYENE BİTİŞ TARİHİ">
              <TextInput style={fieldStyle} value={muayeneTarihi} onChangeText={setMuayeneTarihi}
                placeholder="GG.AA.YYYY" placeholderTextColor={theme.textSecondary} />
            </Field>

            {isSatildi && (
              <View style={[styles.satisBox, { borderColor: GOLD + '44', backgroundColor: GOLD + '0D' }]}>
                <Text style={[styles.satisBoxTitle, { color: GOLD }]}>Satış Bilgileri</Text>
                <Row2>
                  <Field label="SATIŞ FİYATI (₺)">
                    <TextInput style={[fieldStyle, { flex: 1 }]} value={satisFiyat}
                      onChangeText={v => setSatisFiyat(formatFiyat(v))}
                      placeholder="950.000" keyboardType="numeric" placeholderTextColor={theme.textSecondary} />
                  </Field>
                  <Field label="SATIŞ TARİHİ">
                    <TextInput style={[fieldStyle, { flex: 1 }]} value={satisTarihi} onChangeText={setSatisTarihi}
                      placeholder="GG.AA.YYYY" placeholderTextColor={theme.textSecondary} />
                  </Field>
                </Row2>
              </View>
            )}

            {/* BOYA HARİTASI */}
            <TouchableOpacity
              style={[styles.diagramCard, { borderColor: theme.border, backgroundColor: theme.surface2 }]}
              onPress={() => setHasarModalVisible(true)}
              activeOpacity={0.8}
            >
              <View style={styles.diagramRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.diagramLabel, { color: theme.textSecondary }]}>BOYA / PANEL DEĞİŞİMİ</Text>
                  {Object.keys(hasarVerileri).length > 0 ? (
                    <Text style={[styles.diagramSummary, { color: GOLD }]}>
                      {Object.keys(hasarVerileri).length} panel işaretli
                    </Text>
                  ) : (
                    <Text style={[styles.diagramHint, { color: theme.textSecondary }]}>Panelleri işaretlemek için dokun</Text>
                  )}
                </View>
                <Icon name="car-outline" size={20} color={Object.keys(hasarVerileri).length > 0 ? GOLD : theme.textSecondary} />
              </View>
            </TouchableOpacity>

            <Field label="NOTLAR">
              <TextInput
                style={[fieldStyle, { height: 80, textAlignVertical: 'top', paddingTop: 12 }]}
                value={notlar} onChangeText={setNotlar}
                placeholder="Hasar kaydı, özel notlar..."
                placeholderTextColor={theme.textSecondary}
                multiline
              />
            </Field>

          </View>
          <View style={{ height: 100 }} />
        </ScrollView>

        <View style={[styles.footer, { backgroundColor: theme.bg, borderTopColor: theme.border, paddingBottom: insets.bottom + 12 }]}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
            <Text style={styles.saveBtnTxt}>{edit ? 'Güncelle' : 'Stoka Ekle'}</Text>
          </TouchableOpacity>
        </View>

      </View>

      {/* HASAR HARİTASI MODAL */}
      <Modal visible={hasarModalVisible} animationType="slide" onRequestClose={closeHasarModal}>
        <View style={{ flex: 1, backgroundColor: theme.bg }}>
          <View style={[styles.nav, { borderBottomColor: theme.border, backgroundColor: theme.bg, paddingTop: insets.top + 12 }]}>
            <TouchableOpacity
              style={[styles.navBtn, { backgroundColor: theme.surface2, borderColor: theme.border }]}
              onPress={closeHasarModal}
            >
              <Icon name="arrow-left" size={18} color={theme.text} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={[styles.navTitle, { color: theme.text }]}>Hasar & Boya Haritası</Text>
              <Text style={{ fontSize: 11, color: theme.textSecondary, marginTop: 1 }}>Parçaya dokun · Durumu işaretle</Text>
            </View>
          </View>
          {!hasarModalReady && (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator color={GOLD} size="large" />
            </View>
          )}
          <WebView
            ref={hasarWebViewRef}
            source={{ html: HASAR_HARITASI_HTML }}
            style={{ flex: 1, opacity: hasarModalReady ? 1 : 0 }}
            onLoad={() => setHasarModalReady(true)}
            onMessage={handleHasarMessage}
            javaScriptEnabled
            scrollEnabled
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>

      {/* MARKA/MODEL PICKER MODAL */}
      <Modal visible={picker.visible} animationType="slide" transparent onRequestClose={() => setPicker(p => ({ ...p, visible: false }))}>
        <KeyboardAvoidingView style={styles.pickerOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={[styles.pickerSheet, { backgroundColor: theme.surface }]}>
            <View style={[styles.pickerHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.pickerTitle, { color: theme.text }]}>{picker.title}</Text>
              <TouchableOpacity onPress={() => setPicker(p => ({ ...p, visible: false }))}>
                <Text style={{ fontSize: 18, color: theme.textSecondary, paddingHorizontal: 4 }}>✕</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.pickerSearch, { backgroundColor: isDark ? '#0d0f14' : '#f3f4f6', borderColor: theme.border, color: theme.text }]}
              placeholder="Ara…"
              placeholderTextColor={theme.textSecondary}
              value={picker.search}
              onChangeText={s => setPicker(p => ({ ...p, search: s }))}
              autoFocus
            />
            <FlatList
              data={picker.items.filter(i => i.toLowerCase().includes(picker.search.toLowerCase()))}
              keyExtractor={i => i}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const cur = picker.key === 'marka' ? marka : model;
                return (
                  <TouchableOpacity
                    style={[styles.pickerItem, { borderBottomColor: theme.border }, item === cur && { backgroundColor: GOLD + '18' }]}
                    onPress={() => selectPickerItem(item)}
                  >
                    <Text style={[styles.pickerItemTxt, { color: theme.text }, item === cur && { color: GOLD, fontWeight: '700' }]}>
                      {item}
                    </Text>
                    {item === cur && <Text style={{ color: GOLD }}>✓</Text>}
                  </TouchableOpacity>
                );
              }}
              ListFooterComponent={
                picker.search.trim().length > 0 ? (
                  <TouchableOpacity
                    style={[styles.pickerItem, { borderBottomColor: 'transparent', backgroundColor: GOLD + '12' }]}
                    onPress={() => selectPickerItem(picker.search.trim())}
                  >
                    <Text style={{ color: GOLD, fontWeight: '700', fontSize: 14 }}>+ "{picker.search.trim()}" olarak kullan</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={{ paddingHorizontal: 20, paddingVertical: 14 }}>
                    <Text style={{ color: theme.textSecondary, fontSize: 12 }}>Listede bulamadıysanız yukarıya yazıp "+ olarak kullan" seçeneğine basın</Text>
                  </View>
                )
              }
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  navTitle: { fontSize: 17, fontWeight: '700', letterSpacing: -0.3 },
  scroll: { flex: 1 },
  body: { padding: 16, gap: 0 },
  row2: { flexDirection: 'row', gap: 10 },
  fieldWrap: { flex: 1, marginBottom: 12, gap: 4 },
  fieldLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  input: {
    borderWidth: 1, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 14,
  },
  pickerBtn: { flexDirection: 'row', alignItems: 'center' },
  footer: { padding: 16, paddingTop: 12, borderTopWidth: 1 },
  saveBtn: {
    backgroundColor: GOLD, borderRadius: 16,
    paddingVertical: 16, alignItems: 'center',
  },
  saveBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },
  satisBox: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 12 },
  satisBoxTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 10, textTransform: 'uppercase' },
  diagramCard:    { borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 12 },
  diagramRow:     { flexDirection: 'row', alignItems: 'center', gap: 10 },
  diagramLabel:   { fontSize: 9, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  diagramHint:    { fontSize: 12 },
  diagramSummary: { fontSize: 13, fontWeight: '700' },

  pickerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  pickerSheet: { borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '75%' },
  pickerHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
  pickerTitle: { fontSize: 16, fontWeight: '700' },
  pickerSearch: { margin: 12, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14 },
  pickerItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1 },
  pickerItemTxt: { fontSize: 14 },
});
