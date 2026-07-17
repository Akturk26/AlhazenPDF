import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, Image, Alert, StatusBar,
  Modal, PanResponder, Dimensions, FlatList,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../themes/colors';
import { loadCompanyProfile, saveCompanyProfile } from '../utils/companyProfile';
import { getAraclar } from '../utils/araclarimStorage';
import Icon from '../components/Icon';

const GOLD = '#C9A84C';

// ─── Araç marka/model listesi ────────────────────────────────────────────────
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

// ─── Seçmeli alanlar ────────────────────────────────────────────────────────
const SELECT_OPTIONS = {
  'Şanzıman':   ['Otomatik', 'Manuel', 'Yarı Otomatik'],
  'Yakıt':      ['Benzin', 'Dizel', 'Benzin-LPG', 'Elektrikli', 'Hybrid'],
  'İlan Türü':  ['Satılık', 'Kiralık'],
  'Emlak Türü': ['Daire', 'Arsa', 'Tarla', 'Dükkan', 'Villa', 'İşyeri', 'Apartman', 'Bina', 'Konut'],
  'Isıtma':     ['Zeminden', 'Kalorifer', 'Merkezi', 'Elektrikli', 'Klima', 'Soba'],
  'Site İçi':   ['Evet', 'Hayır'],
  'Balkon':     ['Var', 'Yok'],
};

const HYBRID_SELECT_OPTIONS = {
  'Oda Sayısı':      ['1+0', '2+0', '1+1', '2+1', '3+1', '4+1', '4+2'],
  'Banyo Sayısı':    ['1', '2', '3', '3+'],
  'Eğitim Seviyesi': ['İlköğretim', 'Lise', 'Ön Lisans', 'Lisans', 'Yüksek Lisans', 'Doktora'],
};

const NUMBER_FIELDS = ['KM', 'Fiyat', 'Hasar Kayıt', 'M² (Net)', 'M² (Brüt)', 'Bina Yaşı', 'Kat', 'Yıl'];

// ─── Accordion section config ────────────────────────────────────────────────
const FORM_SECTIONS = {
  'real-estate': [
    { id: 'temel',   title: 'Temel Bilgiler',   iconName: 'home-outline',        fields: ['İlan Türü', 'Emlak Türü', 'Oda Sayısı', 'M² (Net)', 'M² (Brüt)', 'Bina Yaşı', 'Kat'] },
    { id: 'ozellik', title: 'Özellikler',        iconName: 'star-circle-outline', fields: ['Isıtma', 'Banyo Sayısı', 'Balkon', 'Site İçi'] },
    { id: 'fiyat',   title: 'Fiyat & İletişim', iconName: 'currency-usd',        fields: ['Fiyat', 'Adres', 'Telefon'] },
  ],
  'auto': [
    { id: 'arac',   title: 'Araç Bilgileri',     iconName: 'car-outline',      fields: ['Marka', 'Model', 'Yıl', 'Renk'] },
    { id: 'teknik', title: 'Teknik Özellikler',  iconName: 'cog-outline',      fields: ['Motor', 'Şanzıman', 'Yakıt', 'KM'] },
    { id: 'satis',  title: 'Satış Bilgileri',    iconName: 'tag-text-outline', fields: ['Hasar Kayıt', 'Fiyat', 'Telefon', 'Açıklama'] },
  ],
  'personal': [
    { id: 'kisisel',   title: 'Kişisel Bilgiler', iconName: 'account-outline',   fields: ['Ad Soyad', 'Meslek', 'Doğum Tarihi', 'Telefon', 'Email', 'Adres', 'LinkedIn', 'Eğitim Seviyesi'] },
    { id: 'hakkimda',  title: 'Hakkımda',          iconName: 'text-box-outline',  fields: ['Açıklama'] },
    { id: 'is',        title: 'İş Geçmişi',        iconName: 'briefcase-outline', fields: ['İş Geçmişi'] },
    { id: 'beceriler', title: 'Beceriler & Diller', iconName: 'star-outline',      fields: ['Beceriler', 'Yabancı Diller'] },
    { id: 'tema',      title: 'CV Tasarımı',        iconName: 'palette-outline',   fields: ['CV Teması'] },
  ],
};

const formatNumberTR = (value) => {
  const digits = value.replace(/\D/g, '');
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const STORAGE_KEY = (id) => `form_draft_${id}`;

// ─── Photo grid constants ────────────────────────────────────────────────────
const { width: SCREEN_W } = Dimensions.get('window');
const GRID_PAD = 16;
const GRID_GAP = 8;
const NUM_COLS = 3;
const ITEM_SIZE = Math.floor((SCREEN_W - GRID_PAD * 2 - GRID_GAP * (NUM_COLS - 1)) / NUM_COLS);
const POSITIONER_W = 260;
const POSITIONER_H = 160;

// ─── SortablePhotoItem ───────────────────────────────────────────────────────
function SortablePhotoItem({ item, index, total, dragFromIndex, dragToIndex, onDragStart, onDragMove, onDragEnd, onEdit, onRemove, theme }) {
  const indexRef = useRef(index);
  indexRef.current = index;
  const totalRef = useRef(total);
  totalRef.current = total;

  const calcToIndex = (dx, dy) => {
    const colDelta = Math.round(dx / (ITEM_SIZE + GRID_GAP));
    const rowDelta = Math.round(dy / (ITEM_SIZE + GRID_GAP));
    const fromRow = Math.floor(indexRef.current / NUM_COLS);
    const fromCol = indexRef.current % NUM_COLS;
    const toRow = Math.max(0, Math.min(Math.floor((totalRef.current - 1) / NUM_COLS), fromRow + rowDelta));
    const toCol = Math.max(0, Math.min(NUM_COLS - 1, fromCol + colDelta));
    return Math.min(totalRef.current - 1, toRow * NUM_COLS + toCol);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dx) + Math.abs(gs.dy) > 8,
      onPanResponderGrant: () => { onDragStart(indexRef.current); },
      onPanResponderMove: (_, gs) => { onDragMove(calcToIndex(gs.dx, gs.dy)); },
      onPanResponderRelease: (_, gs) => { onDragEnd(indexRef.current, calcToIndex(gs.dx, gs.dy)); },
      onPanResponderTerminate: () => { onDragEnd(indexRef.current, indexRef.current); },
    })
  ).current;

  const isDragging = dragFromIndex === index;
  const isTarget = dragToIndex !== null && dragToIndex === index && dragFromIndex !== index;

  return (
    <View
      style={[
        { width: ITEM_SIZE, height: ITEM_SIZE, borderRadius: 12, overflow: 'hidden', position: 'relative' },
        isDragging && { opacity: 0.45, transform: [{ scale: 1.05 }] },
        isTarget && { borderWidth: 3, borderColor: GOLD, borderRadius: 12 },
      ]}
      {...panResponder.panHandlers}
    >
      <Image source={{ uri: item.uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
      <View style={{ position: 'absolute', bottom: 6, left: 6, width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: GOLD }}>
        <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff' }}>{index + 1}</Text>
      </View>
      <View style={{ position: 'absolute', bottom: 6, right: 6, width: 28, height: 28, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.surface2, borderColor: theme.border }}>
        <Text style={{ fontSize: 13, fontWeight: 'bold', letterSpacing: -2, color: theme.textSecondary }}>⋮⋮</Text>
      </View>
      <TouchableOpacity
        style={{ position: 'absolute', top: 6, right: 30, width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', zIndex: 3, backgroundColor: GOLD, borderWidth: 2, borderColor: '#fff' }}
        onPress={() => onEdit(item)}
        activeOpacity={0.8}
      >
        <Text style={{ fontSize: 11, color: '#fff', fontWeight: '700' }}>✎</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', zIndex: 3, backgroundColor: 'rgba(220,50,50,0.9)', borderWidth: 2, borderColor: '#fff' }}
        onPress={() => onRemove(item.id)}
        activeOpacity={0.8}
      >
        <Text style={{ fontSize: 12, color: '#fff', fontWeight: '700' }}>✕</Text>
      </TouchableOpacity>
      {isDragging && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(201,168,76,0.25)', borderWidth: 2, borderColor: GOLD, borderRadius: 12 }} pointerEvents="none" />
      )}
    </View>
  );
}

// ─── SortablePhotoGrid ───────────────────────────────────────────────────────
function SortablePhotoGrid({ images, onReorder, onEdit, onRemove, theme }) {
  const [dragState, setDragState] = useState(null);

  const handleDragStart = (fromIndex) => setDragState({ fromIndex, toIndex: fromIndex });
  const handleDragMove = (toIndex) => setDragState(prev => prev ? { ...prev, toIndex } : null);
  const handleDragEnd = (fromIndex, toIndex) => {
    if (fromIndex !== toIndex && toIndex >= 0 && toIndex < images.length) {
      const arr = [...images];
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
      onReorder(arr);
    }
    setDragState(null);
  };

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: GRID_GAP }}>
      {images.map((item, index) => (
        <SortablePhotoItem
          key={item.id}
          item={item}
          index={index}
          total={images.length}
          dragFromIndex={dragState?.fromIndex ?? null}
          dragToIndex={dragState?.toIndex ?? null}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
          onEdit={onEdit}
          onRemove={onRemove}
          theme={theme}
        />
      ))}
    </View>
  );
}

// ─── PhotoPositioner ─────────────────────────────────────────────────────────
function PhotoPositioner({ image, onPositionChange }) {
  const imgW = image.width || 1200;
  const imgH = image.height || 1600;
  const scale = Math.max(POSITIONER_W / imgW, POSITIONER_H / imgH);
  const scaledW = Math.round(imgW * scale);
  const scaledH = Math.round(imgH * scale);
  const maxPanX = Math.max(0, (scaledW - POSITIONER_W) / 2);
  const maxPanY = Math.max(0, (scaledH - POSITIONER_H) / 2);

  const initOffset = () => {
    if (image.objectPosition) {
      const ox = maxPanX > 0 ? ((50 - image.objectPosition.x) / 50) * maxPanX : 0;
      const oy = maxPanY > 0 ? ((50 - image.objectPosition.y) / 50) * maxPanY : 0;
      return { x: Math.max(-maxPanX, Math.min(maxPanX, ox)), y: Math.max(-maxPanY, Math.min(maxPanY, oy)) };
    }
    return { x: 0, y: 0 };
  };

  const offsetRef = useRef(initOffset());
  const gestureStartRef = useRef({ x: 0, y: 0 });
  const [offset, setOffset] = useState(offsetRef.current);
  const posX = maxPanX > 0 ? Math.round(50 - (offset.x / maxPanX) * 50) : 50;
  const posY = maxPanY > 0 ? Math.round(50 - (offset.y / maxPanY) * 50) : 50;

  const posLabel = () => {
    const h = posX < 30 ? 'Sol' : posX > 70 ? 'Sağ' : 'Orta';
    const v = posY < 30 ? 'Üst' : posY > 70 ? 'Alt' : 'Merkez';
    if (h === 'Orta' && v === 'Merkez') return 'Merkez';
    if (h === 'Orta') return v;
    if (v === 'Merkez') return h;
    return `${v}-${h}`;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => { gestureStartRef.current = { ...offsetRef.current }; },
      onPanResponderMove: (_, gs) => {
        const newX = Math.max(-maxPanX, Math.min(maxPanX, gestureStartRef.current.x + gs.dx));
        const newY = Math.max(-maxPanY, Math.min(maxPanY, gestureStartRef.current.y + gs.dy));
        offsetRef.current = { x: newX, y: newY };
        setOffset({ x: newX, y: newY });
      },
      onPanResponderRelease: () => {
        const px = maxPanX > 0 ? Math.round(50 - (offsetRef.current.x / maxPanX) * 50) : 50;
        const py = maxPanY > 0 ? Math.round(50 - (offsetRef.current.y / maxPanY) * 50) : 50;
        onPositionChange({ x: px, y: py });
      },
    })
  ).current;

  const imgLeft = (POSITIONER_W - scaledW) / 2 + offset.x;
  const imgTop = (POSITIONER_H - scaledH) / 2 + offset.y;

  return (
    <View style={{ alignItems: 'center', gap: 8 }}>
      <View style={{ width: POSITIONER_W, height: POSITIONER_H, overflow: 'hidden', borderRadius: 10, backgroundColor: '#000' }} {...panResponder.panHandlers}>
        <Image source={{ uri: image.uri }} style={{ position: 'absolute', width: scaledW, height: scaledH, left: imgLeft, top: imgTop }} />
        <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 28, height: 2, backgroundColor: 'rgba(255,255,255,0.85)' }} />
          <View style={{ position: 'absolute', width: 2, height: 28, backgroundColor: 'rgba(255,255,255,0.85)' }} />
          <View style={{ position: 'absolute', width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: '#fff' }} />
        </View>
        <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <View style={{ position: 'absolute', top: 8, left: 8, width: 18, height: 18, borderTopWidth: 2, borderLeftWidth: 2, borderColor: 'rgba(255,255,255,0.55)' }} />
          <View style={{ position: 'absolute', top: 8, right: 8, width: 18, height: 18, borderTopWidth: 2, borderRightWidth: 2, borderColor: 'rgba(255,255,255,0.55)' }} />
          <View style={{ position: 'absolute', bottom: 8, left: 8, width: 18, height: 18, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: 'rgba(255,255,255,0.55)' }} />
          <View style={{ position: 'absolute', bottom: 8, right: 8, width: 18, height: 18, borderBottomWidth: 2, borderRightWidth: 2, borderColor: 'rgba(255,255,255,0.55)' }} />
        </View>
      </View>
      <Text style={{ fontSize: 12, color: '#888', textAlign: 'center' }}>
        {'Odak: '}
        <Text style={{ fontWeight: '700', color: '#6FA3FF' }}>{posLabel()}</Text>
        {'  ·  '}{posX}% / {posY}%
      </Text>
    </View>
  );
}

// ─── ChipRow ─────────────────────────────────────────────────────────────────
function ChipRow({ options, value, onSelect, allowCustom, customValue, onCustomChange, theme }) {
  return (
    <>
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipScroll}
        keyboardShouldPersistTaps="handled"
      >
        {options.map((opt) => {
          const sel = value === opt;
          return (
            <TouchableOpacity
              key={opt}
              style={[styles.chip, { backgroundColor: sel ? GOLD : theme.surface2, borderColor: sel ? GOLD : theme.border }]}
              onPress={() => onSelect(opt)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, { color: sel ? '#fff' : theme.textSecondary }]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {allowCustom && (
        <TextInput
          style={[styles.input, styles.hybridInput, { backgroundColor: theme.surface2, borderColor: customValue ? GOLD : theme.border, color: theme.text }]}
          placeholder="Farklı bir değer girin..."
          placeholderTextColor={theme.textSecondary}
          value={customValue}
          onChangeText={onCustomChange}
        />
      )}
    </>
  );
}

export default function FormScreen({ route, navigation }) {
  const { category, images: initialImages = [], format, mode } = route.params;
  const isPersonal = category.id === 'personal';
  const maxPhotos = isPersonal ? 1 : (format?.maxPhotos || 25);

  const [formData, setFormData] = useState({});
  const [images, setImages] = useState(initialImages);
  const [logo, setLogo] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [ekspertizData, setEkspertizData] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  const insets = useSafeAreaInsets();
  const saveTimerRef = useRef(null);

  const [picker, setPicker] = useState({ visible: false, key: '', title: '', items: [], search: '' });

  // Araçlarım listesi (sadece auto kategorisi)
  const [araçlarimList, setAraçlarimList] = useState([]);
  const [selectedAracId, setSelectedAracId] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      if (category.id === 'auto') {
        getAraclar().then(list => setAraçlarimList(list || []));
      }
    }, [category.id])
  );

  const handleSelectArac = (arac) => {
    setSelectedAracId(arac.id);
    setFormData(prev => ({
      ...prev,
      'Marka': arac.marka || '',
      'Model': arac.model || '',
      'Yıl': arac.yil || '',
      'Renk': arac.renk || '',
      'Yakıt': arac.yakit || '',
    }));
    setOpenSections(prev => ({ ...prev, arac: true }));
  };

  // Dinamik alan giriş state'leri
  const [langInput, setLangInput] = useState({ dil: '', seviye: '' });
  const [skillInput, setSkillInput] = useState({ beceri: '', seviye: '' });
  const [workInput, setWorkInput] = useState({ sirket: '', pozisyon: '', yil: '' });

  const sections = FORM_SECTIONS[category.id];
  const initialOpen = sections
    ? sections.reduce((acc, s, i) => ({ ...acc, [s.id]: i === 0 }), {})
    : {};
  const [openSections, setOpenSections] = useState(initialOpen);

  useEffect(() => {
    const loadDraft = async () => {
      try {
        const [saved, profile] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY(category.id)),
          loadCompanyProfile(),
        ]);

        if (saved) {
          const { formData: f, ekspertizData: ed } = JSON.parse(saved);
          if (f) setFormData(f);
          if (ed) setEkspertizData(ed);
        }

        if (profile?.name) {
          setCompanyName(profile.name);
          if (profile.logoUri) {
            setLogo({ uri: profile.logoUri, base64: profile.logoBase64 || null });
          }
        } else if (saved) {
          const { companyName: c, logo: l } = JSON.parse(saved);
          if (c) setCompanyName(c);
          if (l) setLogo(l);
        }
      } catch {}
      finally { setIsLoaded(true); }
    };
    loadDraft();
  }, [category.id]);

  useEffect(() => {
    if (!isLoaded) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY(category.id), JSON.stringify({ formData, companyName, logo, ekspertizData }));
    }, 300);
    return () => clearTimeout(saveTimerRef.current);
  }, [formData, companyName, logo, ekspertizData, isLoaded]);

  // ─── Photo handlers ──────────────────────────────────────────────────────
  const pickImage = async (fromCamera = false) => {
    try {
      const permResult = fromCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permResult.granted) {
        Alert.alert('İzin Gerekli', 'Fotoğraf eklemek için izin vermeniz gerekiyor.');
        return;
      }
      const result = fromCamera
        ? await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.95, base64: true })
        : await ImagePicker.launchImageLibraryAsync({ allowsMultipleSelection: !isPersonal, quality: 0.95, base64: true });

      if (!result.canceled && result.assets) {
        const newImgs = await Promise.all(
          result.assets.map((asset, idx) =>
            new Promise((resolve) => {
              Image.getSize(asset.uri, (width, height) => {
                resolve({ id: `${Date.now()}_${idx}`, uri: asset.uri, base64: asset.base64, fileName: asset.fileName || asset.uri.split('/').pop(), timestamp: asset.exif?.DateTime || new Date().toISOString(), width, height, isPortrait: height > width });
              }, () => {
                resolve({ id: `${Date.now()}_${idx}`, uri: asset.uri, base64: asset.base64, fileName: asset.fileName || asset.uri.split('/').pop(), timestamp: new Date().toISOString(), width: 1200, height: 1600, isPortrait: true });
              });
            })
          )
        );
        if (images.length + newImgs.length > maxPhotos) {
          Alert.alert('Limit', `Maksimum ${maxPhotos} fotoğraf ekleyebilirsiniz.`);
          return;
        }
        setImages(prev => isPersonal ? [newImgs[0]] : [...prev, ...newImgs]);
      }
    } catch {
      Alert.alert('Hata', 'Fotoğraf eklenirken bir hata oluştu.');
    }
  };

  const removeImage = (itemId) => setImages(prev => prev.filter(img => img.id !== itemId));

  const sortImages = (sortType) => {
    setImages(prev => {
      const arr = [...prev];
      switch (sortType) {
        case 'date-asc':  arr.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)); break;
        case 'date-desc': arr.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); break;
        case 'name-asc':  arr.sort((a, b) => (a.fileName || '').localeCompare(b.fileName || '')); break;
        case 'name-desc': arr.sort((a, b) => (b.fileName || '').localeCompare(a.fileName || '')); break;
      }
      return arr;
    });
    setSortModalVisible(false);
  };

  const openEditModal = (item) => { setSelectedImage(item); setEditModalVisible(true); };

  const handleRotateImage = async (degrees) => {
    if (!selectedImage) return;
    try {
      const result = await ImageManipulator.manipulate(selectedImage.uri).rotate(degrees).saveAsync({ compress: 0.95, format: ImageManipulator.SaveFormat.JPEG });
      const dims = await new Promise((resolve) => {
        Image.getSize(result.uri, (w, h) => resolve({ width: w, height: h, isPortrait: h > w }), () => {
          const swap = degrees === 90 || degrees === 270;
          resolve({ width: swap ? selectedImage.height : selectedImage.width, height: swap ? selectedImage.width : selectedImage.height, isPortrait: swap ? selectedImage.width > selectedImage.height : selectedImage.isPortrait });
        });
      });
      const updated = { ...selectedImage, uri: result.uri, ...dims };
      setImages(prev => prev.map(img => img.id === selectedImage.id ? updated : img));
      setSelectedImage(updated);
    } catch {
      Alert.alert('Hata', 'Fotoğraf döndürülürken hata oluştu.');
    }
  };

  const handleCropImage = async (cropType) => {
    if (!selectedImage) return;
    try {
      const { width, height } = await new Promise((resolve) => {
        Image.getSize(selectedImage.uri, (w, h) => resolve({ width: w, height: h }));
      });
      let cropData;
      if (cropType === 'square') {
        const size = Math.min(width, height);
        cropData = { originX: (width - size) / 2, originY: (height - size) / 2, width: size, height: size };
      } else if (cropType === '16:9') {
        const ratio = 16 / 9;
        let cw = width, ch = width / ratio;
        if (ch > height) { ch = height; cw = height * ratio; }
        cropData = { originX: (width - cw) / 2, originY: (height - ch) / 2, width: cw, height: ch };
      } else if (cropType === '4:3') {
        const ratio = 4 / 3;
        let cw = width, ch = width / ratio;
        if (ch > height) { ch = height; cw = height * ratio; }
        cropData = { originX: (width - cw) / 2, originY: (height - ch) / 2, width: cw, height: ch };
      } else { return; }
      const result = await ImageManipulator.manipulate(selectedImage.uri).crop(cropData).saveAsync({ compress: 0.95, format: ImageManipulator.SaveFormat.JPEG });
      const dims = await new Promise((resolve) => {
        Image.getSize(result.uri, (w, h) => resolve({ width: w, height: h, isPortrait: h > w }), () => resolve({ width: cropData.width, height: cropData.height, isPortrait: cropData.height > cropData.width }));
      });
      const updated = { ...selectedImage, uri: result.uri, ...dims };
      setImages(prev => prev.map(img => img.id === selectedImage.id ? updated : img));
      setSelectedImage(updated);
    } catch {
      Alert.alert('Hata', 'Fotoğraf kırpılırken hata oluştu.');
    }
  };

  const handlePositionChange = (position) => {
    if (!selectedImage) return;
    setImages(prev => prev.map(img => img.id === selectedImage.id ? { ...img, objectPosition: position } : img));
    setSelectedImage(prev => ({ ...prev, objectPosition: position }));
  };

  // ─── Picker helpers ──────────────────────────────────────────────────────
  const openPicker = (key, title, items) => setPicker({ visible: true, key, title, items, search: '' });
  const selectPickerItem = (value) => {
    if (picker.key === 'Marka') {
      setFormData(p => ({ ...p, Marka: value, Model: '' }));
    } else {
      setFormData(p => ({ ...p, [picker.key]: value }));
    }
    setPicker(p => ({ ...p, visible: false }));
  };

  // ─── Form handlers ───────────────────────────────────────────────────────
  const set = (field, value) => setFormData(p => ({ ...p, [field]: value }));
  const setNumber = (field, value) => set(field, formatNumberTR(value));
  const toggle = (field, value) => set(field, formData[field] === value ? '' : value);

  const addLanguage = () => {
    if (!langInput.dil.trim() || !langInput.seviye) return;
    const cur = Array.isArray(formData['Yabancı Diller']) ? formData['Yabancı Diller'] : [];
    set('Yabancı Diller', [...cur, { dil: langInput.dil.trim(), seviye: parseInt(langInput.seviye) }]);
    setLangInput({ dil: '', seviye: '' });
  };
  const removeLanguage = (idx) => {
    const cur = Array.isArray(formData['Yabancı Diller']) ? formData['Yabancı Diller'] : [];
    set('Yabancı Diller', cur.filter((_, i) => i !== idx));
  };
  const addSkill = () => {
    if (!skillInput.beceri.trim() || !skillInput.seviye) return;
    const cur = Array.isArray(formData['Beceriler']) ? formData['Beceriler'] : [];
    const pct = Math.min(100, Math.max(0, parseInt(skillInput.seviye)));
    set('Beceriler', [...cur, { beceri: skillInput.beceri.trim(), seviye: pct }]);
    setSkillInput({ beceri: '', seviye: '' });
  };
  const removeSkill = (idx) => {
    const cur = Array.isArray(formData['Beceriler']) ? formData['Beceriler'] : [];
    set('Beceriler', cur.filter((_, i) => i !== idx));
  };
  const addWork = () => {
    if (!workInput.sirket.trim()) return;
    const cur = Array.isArray(formData['İş Geçmişi']) ? formData['İş Geçmişi'] : [];
    set('İş Geçmişi', [...cur, { sirket: workInput.sirket.trim(), pozisyon: workInput.pozisyon.trim(), yil: workInput.yil.trim() }]);
    setWorkInput({ sirket: '', pozisyon: '', yil: '' });
  };
  const removeWork = (idx) => {
    const cur = Array.isArray(formData['İş Geçmişi']) ? formData['İş Geçmişi'] : [];
    set('İş Geçmişi', cur.filter((_, i) => i !== idx));
  };

  const pickLogo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true, aspect: [1, 1], quality: 0.8, base64: true,
      });
      if (!result.canceled) {
        setLogo({ uri: result.assets[0].uri, base64: result.assets[0].base64 });
      }
    } catch {
      Alert.alert('Hata', 'Fotoğraf seçilemedi.');
    }
  };

  const clearDraft = () => {
    Alert.alert('Formu Temizle', 'Girilen tüm bilgiler silinecek. Emin misin?', [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Temizle', style: 'destructive', onPress: () => {
          setFormData({});
          setCompanyName('');
          setLogo(null);
          setImages([]);
          setEkspertizData({});
          AsyncStorage.removeItem(STORAGE_KEY(category.id));
        },
      },
    ]);
  };

  const handleContinue = () => {
    if (companyName) {
      saveCompanyProfile({ name: companyName, logoUri: logo?.uri || null, logoBase64: logo?.base64 || null });
    }
    if (isPersonal) {
      navigation.navigate('Preview', { category, images, formData, logo, companyName, template: { id: 0, name: 'CV', color: '#9B6EF7', iconName: 'file-document-outline' } });
    } else if (mode === 'sales-card-story') {
      navigation.navigate('Format', { category, images, formData, logo, companyName, mode: 'sales-card-story' });
    } else if (format && format.id !== 'standard') {
      navigation.navigate('RealEstatePreview', { category, images, formData, logo, companyName, format, ekspertizData });
    } else {
      navigation.navigate('Template', { category, images, formData, logo, companyName });
    }
  };

  // ─── Özel alan renderer'ları ─────────────────────────────────────────────
  const renderYabanciDiller = () => {
    const langs = Array.isArray(formData['Yabancı Diller']) ? formData['Yabancı Diller'] : [];
    return (
      <View style={styles.fieldWrap}>
        <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>YABANCI DİLLER</Text>
        {langs.map((l, idx) => (
          <View key={idx} style={[styles.dynamicItem, { backgroundColor: theme.surface2, borderColor: theme.border }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.dynamicItemTitle, { color: theme.text }]}>{l.dil}</Text>
              <View style={styles.langDots}>
                {[1,2,3,4,5].map(i => (
                  <View key={i} style={[styles.langDot, { backgroundColor: i <= l.seviye ? '#c9a84c' : theme.border }]} />
                ))}
              </View>
            </View>
            <TouchableOpacity onPress={() => removeLanguage(idx)} style={styles.removeBtn}>
              <Icon name="delete-outline" size={16} color="#e05555" />
            </TouchableOpacity>
          </View>
        ))}
        <View style={[styles.addBox, { backgroundColor: theme.surface2, borderColor: theme.border }]}>
          <Text style={[styles.addBoxLabel, { color: theme.textSecondary }]}>Bildiğiniz yabancı dil?</Text>
          <TextInput
            style={[styles.addInput, { backgroundColor: theme.bg, borderColor: theme.border, color: theme.text }]}
            placeholder="Örn: Rusça, Almanca..."
            placeholderTextColor={theme.textSecondary}
            value={langInput.dil}
            onChangeText={(v) => setLangInput(p => ({ ...p, dil: v }))}
          />
          <Text style={[styles.addBoxLabel, { color: theme.textSecondary, marginTop: 10 }]}>Seviyesi? (1–5)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
            {['1','2','3','4','5'].map(n => {
              const sel = langInput.seviye === n;
              return (
                <TouchableOpacity key={n} style={[styles.chip, { backgroundColor: sel ? '#c9a84c' : theme.bg, borderColor: sel ? '#c9a84c' : theme.border }]} onPress={() => setLangInput(p => ({ ...p, seviye: n }))}>
                  <Text style={[styles.chipText, { color: sel ? '#fff' : theme.textSecondary }]}>{n}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <TouchableOpacity style={[styles.addItemBtn, { backgroundColor: GOLD, opacity: langInput.dil && langInput.seviye ? 1 : 0.5 }]} onPress={addLanguage}>
            <Icon name="plus" size={16} color="#fff" />
            <Text style={styles.addItemBtnText}>Ekle</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderBeceriler = () => {
    const skills = Array.isArray(formData['Beceriler']) ? formData['Beceriler'] : [];
    return (
      <View style={styles.fieldWrap}>
        <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>BECERİLER</Text>
        {skills.map((s, idx) => (
          <View key={idx} style={[styles.dynamicItem, { backgroundColor: theme.surface2, borderColor: theme.border }]}>
            <View style={{ flex: 1, gap: 6 }}>
              <Text style={[styles.dynamicItemTitle, { color: theme.text }]}>{s.beceri}</Text>
              <View style={styles.skillBarWrap}><View style={[styles.skillBarFill, { width: `${s.seviye}%`, backgroundColor: '#c9a84c' }]} /></View>
              <Text style={[{ fontSize: 10, color: theme.textSecondary }]}>{s.seviye}%</Text>
            </View>
            <TouchableOpacity onPress={() => removeSkill(idx)} style={styles.removeBtn}><Icon name="delete-outline" size={16} color="#e05555" /></TouchableOpacity>
          </View>
        ))}
        <View style={[styles.addBox, { backgroundColor: theme.surface2, borderColor: theme.border }]}>
          <Text style={[styles.addBoxLabel, { color: theme.textSecondary }]}>Beceri adı</Text>
          <TextInput style={[styles.addInput, { backgroundColor: theme.bg, borderColor: theme.border, color: theme.text }]} placeholder="Örn: Araç Kullanımı, MS Office..." placeholderTextColor={theme.textSecondary} value={skillInput.beceri} onChangeText={(v) => setSkillInput(p => ({ ...p, beceri: v }))} />
          <Text style={[styles.addBoxLabel, { color: theme.textSecondary, marginTop: 10 }]}>Seviye (0–100)</Text>
          <TextInput style={[styles.addInput, { backgroundColor: theme.bg, borderColor: theme.border, color: theme.text }]} placeholder="Örn: 85" placeholderTextColor={theme.textSecondary} value={skillInput.seviye} onChangeText={(v) => setSkillInput(p => ({ ...p, seviye: v.replace(/\D/g,'') }))} keyboardType="numeric" />
          <TouchableOpacity style={[styles.addItemBtn, { backgroundColor: GOLD, opacity: skillInput.beceri && skillInput.seviye ? 1 : 0.5 }]} onPress={addSkill}>
            <Icon name="plus" size={16} color="#fff" />
            <Text style={styles.addItemBtnText}>Ekle</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderIsGecmisi = () => {
    const works = Array.isArray(formData['İş Geçmişi']) ? formData['İş Geçmişi'] : [];
    return (
      <View style={styles.fieldWrap}>
        <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>İŞ GEÇMİŞİ</Text>
        {works.map((w, idx) => (
          <View key={idx} style={[styles.dynamicItem, { backgroundColor: theme.surface2, borderColor: theme.border }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.dynamicItemTitle, { color: theme.text }]}>{w.sirket}</Text>
              {w.pozisyon ? <Text style={[{ fontSize: 12, color: '#c9a84c', marginTop: 2 }]}>{w.pozisyon}</Text> : null}
              {w.yil ? <Text style={[{ fontSize: 11, color: theme.textSecondary, marginTop: 1 }]}>{w.yil}</Text> : null}
            </View>
            <TouchableOpacity onPress={() => removeWork(idx)} style={styles.removeBtn}><Icon name="delete-outline" size={16} color="#e05555" /></TouchableOpacity>
          </View>
        ))}
        <View style={[styles.addBox, { backgroundColor: theme.surface2, borderColor: theme.border }]}>
          <Text style={[styles.addBoxLabel, { color: theme.textSecondary }]}>Şirket / Kurum</Text>
          <TextInput style={[styles.addInput, { backgroundColor: theme.bg, borderColor: theme.border, color: theme.text }]} placeholder="Örn: Vural İnşaat A.Ş." placeholderTextColor={theme.textSecondary} value={workInput.sirket} onChangeText={(v) => setWorkInput(p => ({ ...p, sirket: v }))} />
          <Text style={[styles.addBoxLabel, { color: theme.textSecondary, marginTop: 10 }]}>Pozisyon / Görev</Text>
          <TextInput style={[styles.addInput, { backgroundColor: theme.bg, borderColor: theme.border, color: theme.text }]} placeholder="Örn: Şoför, Muhasebeci..." placeholderTextColor={theme.textSecondary} value={workInput.pozisyon} onChangeText={(v) => setWorkInput(p => ({ ...p, pozisyon: v }))} />
          <Text style={[styles.addBoxLabel, { color: theme.textSecondary, marginTop: 10 }]}>Çalışma Dönemi</Text>
          <TextInput style={[styles.addInput, { backgroundColor: theme.bg, borderColor: theme.border, color: theme.text }]} placeholder="Örn: 2022 – 2025 veya 2023 – Devam" placeholderTextColor={theme.textSecondary} value={workInput.yil} onChangeText={(v) => setWorkInput(p => ({ ...p, yil: v }))} />
          <TouchableOpacity style={[styles.addItemBtn, { backgroundColor: GOLD, opacity: workInput.sirket ? 1 : 0.5 }]} onPress={addWork}>
            <Icon name="plus" size={16} color="#fff" />
            <Text style={styles.addItemBtnText}>Ekle</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCVTema = () => {
    const cur = formData['CV Teması'] || 'yesil';
    return (
      <View style={styles.fieldWrap}>
        <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>CV TASARIMI</Text>
        <View style={styles.themeRow}>
          {[
            { id: 'yesil', label: 'Yeşil Altın', color: '#0d1f0f', accent: '#c9a84c', desc: 'Koyu yeşil & altın' },
            { id: 'bej',   label: 'Bej Vintage',  color: '#2c2416', accent: '#b48c50', desc: 'Vintage kahve & altın' },
          ].map(t => {
            const sel = cur === t.id;
            return (
              <TouchableOpacity key={t.id} style={[styles.themeCard, { borderColor: sel ? t.accent : theme.border, backgroundColor: sel ? t.color : theme.surface2 }]} onPress={() => set('CV Teması', t.id)} activeOpacity={0.8}>
                <View style={[styles.themeAccentBar, { backgroundColor: t.accent }]} />
                <Text style={[styles.themeCardLabel, { color: sel ? '#fff' : theme.text }]}>{t.label}</Text>
                <Text style={[styles.themeCardDesc, { color: sel ? 'rgba(255,255,255,0.5)' : theme.textSecondary }]}>{t.desc}</Text>
                {sel && <View style={[styles.themeCheck, { backgroundColor: t.accent }]}><Text style={{ color:'#fff', fontSize:10 }}>✓</Text></View>}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderField = (field, index) => {
    if (field === 'Yabancı Diller') return <View key={field}>{renderYabanciDiller()}</View>;
    if (field === 'Beceriler')      return <View key={field}>{renderBeceriler()}</View>;
    if (field === 'İş Geçmişi')    return <View key={field}>{renderIsGecmisi()}</View>;
    if (field === 'CV Teması')      return <View key={field}>{renderCVTema()}</View>;

    if (field === 'Marka') {
      const val = formData['Marka'] || '';
      return (
        <View key={field + index} style={styles.fieldWrap}>
          <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>MARKA</Text>
          <TouchableOpacity
            style={[styles.input, styles.pickerBtn, { backgroundColor: theme.surface2, borderColor: theme.border }]}
            onPress={() => openPicker('Marka', 'Marka Seç', MARKALAR)}
            activeOpacity={0.7}
          >
            <Text style={{ flex: 1, fontSize: 14, color: val ? theme.text : theme.textSecondary }}>
              {val || 'Marka seçin…'}
            </Text>
            <Text style={{ fontSize: 16, color: theme.textSecondary }}>›</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (field === 'Model') {
      const marka = formData['Marka'] || '';
      const modeller = marka ? (MARKA_MODELLER[marka] || []) : [];
      const val = formData['Model'] || '';
      return (
        <View key={field + index} style={styles.fieldWrap}>
          <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>MODEL</Text>
          <TouchableOpacity
            style={[styles.input, styles.pickerBtn, { backgroundColor: theme.surface2, borderColor: theme.border, opacity: !marka ? 0.5 : 1 }]}
            onPress={() => marka && openPicker('Model', 'Model Seç', modeller)}
            activeOpacity={0.7}
          >
            <Text style={{ flex: 1, fontSize: 14, color: val ? theme.text : theme.textSecondary }}>
              {val || (marka ? 'Model seçin…' : 'Önce marka seçin')}
            </Text>
            <Text style={{ fontSize: 16, color: theme.textSecondary }}>›</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const isLarge  = field === 'Açıklama' || field === 'Alt Başlık';
    const isHybrid = HYBRID_SELECT_OPTIONS[field];
    const isSelect = SELECT_OPTIONS[field];
    const isNumber = NUMBER_FIELDS.includes(field);

    if (isHybrid) {
      const presets = HYBRID_SELECT_OPTIONS[field];
      const cur = formData[field] || '';
      const isPill = presets.includes(cur);
      return (
        <View key={field + index} style={styles.fieldWrap}>
          <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>{field.toUpperCase()}</Text>
          <ChipRow options={presets} value={cur} onSelect={(v) => toggle(field, v)} allowCustom customValue={isPill ? '' : cur} onCustomChange={(v) => set(field, v)} theme={theme} />
        </View>
      );
    }
    if (isSelect) {
      return (
        <View key={field + index} style={styles.fieldWrap}>
          <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>{field.toUpperCase()}</Text>
          <ChipRow options={SELECT_OPTIONS[field]} value={formData[field] || ''} onSelect={(v) => toggle(field, v)} theme={theme} />
        </View>
      );
    }
    return (
      <View key={field + index} style={styles.fieldWrap}>
        <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>{field.toUpperCase()}</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.surface2, borderColor: theme.border, color: theme.text }, isLarge && styles.textArea]}
          placeholder={`${field} girin...`}
          placeholderTextColor={theme.textSecondary}
          value={formData[field] || ''}
          onChangeText={(v) => isNumber ? setNumber(field, v) : set(field, v)}
          keyboardType={isNumber ? 'numeric' : 'default'}
          multiline={isLarge}
          numberOfLines={isLarge ? 4 : 1}
        />
      </View>
    );
  };

  const toggleSection = (id) => setOpenSections(p => ({ ...p, [id]: !p[id] }));
  const hasDraft = Object.values(formData).some(v => Array.isArray(v) ? v.length > 0 : Boolean(v)) || companyName || logo;
  const countFilled = (fields) => fields.filter(f => { const v = formData[f]; return Array.isArray(v) ? v.length > 0 : Boolean(v); }).length;

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: theme.bg }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.bg} />

      {/* ── NAV ── */}
      <View style={[styles.nav, { borderBottomColor: theme.border, backgroundColor: theme.bg, paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: theme.surface2, borderColor: theme.border }]}>
          <Icon name="arrow-left" size={18} color={theme.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.navTitle, { color: theme.text }]}>Bilgileri Girin</Text>
          <Text style={[styles.navSub, { color: theme.textSecondary }]}>
            {category.name}{format ? ` · ${format.name}` : ''}
          </Text>
        </View>
        <View style={styles.stepChip}>
          <Text style={styles.stepTxt}>1 / 3</Text>
        </View>
        {hasDraft && (
          <TouchableOpacity onPress={clearDraft} style={[styles.clearBtn, { borderColor: theme.border }]}>
            <Icon name="delete-outline" size={15} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* ── FOTOĞRAFLAR ── */}
        {!isPersonal && <View style={[styles.section, { backgroundColor: theme.surface, borderColor: images.length > 0 ? (isDark ? 'rgba(201,168,76,0.3)' : 'rgba(201,168,76,0.4)') : theme.border }]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconWrap, { backgroundColor: images.length > 0 ? 'rgba(201,168,76,0.15)' : theme.surface2 }]}>
              <Icon name={isPersonal ? 'camera-account' : 'camera-outline'} size={20} color={images.length > 0 ? GOLD : theme.textSecondary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>{isPersonal ? 'Profil Fotoğrafı' : 'Fotoğraflar'}</Text>
              {images.length > 0
                ? <Text style={[styles.filledCount, { color: GOLD }]}>{images.length} fotoğraf eklendi</Text>
                : <Text style={[styles.filledCount, { color: theme.textSecondary }]}>{isPersonal ? 'Opsiyonel · max 1' : `Opsiyonel · max ${maxPhotos}`}</Text>
              }
            </View>
            {!isPersonal && images.length > 1 && (
              <TouchableOpacity style={[styles.sortChipSmall, { backgroundColor: theme.surface2, borderColor: theme.border }]} onPress={() => setSortModalVisible(true)}>
                <Text style={[{ fontSize: 11, fontWeight: '600', color: theme.textSecondary }]}>⚡ Sırala</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={[styles.sectionBody, { gap: 12 }]}>
            {/* Upload buttons */}
            <View style={styles.uploadRow}>
              <TouchableOpacity style={[styles.uploadPill, { backgroundColor: theme.surface2, borderColor: theme.border }]} onPress={() => pickImage(true)} activeOpacity={0.75}>
                <Icon name="camera-outline" size={17} color={theme.textSecondary} />
                <Text style={[styles.uploadPillLabel, { color: theme.text }]}>Kamera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.uploadPill, styles.uploadPillPrimary, { backgroundColor: GOLD }]} onPress={() => pickImage(false)} activeOpacity={0.75}>
                <Icon name="image-multiple-outline" size={17} color="#fff" />
                <Text style={[styles.uploadPillLabel, { color: '#fff' }]}>Galeriden Seç</Text>
              </TouchableOpacity>
            </View>

            {/* Photo grid */}
            {images.length > 0 && (
              <SortablePhotoGrid images={images} onReorder={setImages} onEdit={openEditModal} onRemove={removeImage} theme={theme} />
            )}
          </View>
        </View>}

        {/* ── ŞİRKET / PROFİL ── */}
        <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconWrap, { backgroundColor: theme.surface2 }]}>
              <Icon name={isPersonal ? 'account-circle-outline' : 'domain'} size={20} color={theme.textSecondary} />
            </View>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {isPersonal ? 'CV Bilgileri' : 'Şirket Bilgileri'}
            </Text>
            {!isPersonal && (
              <Text style={[styles.optionalTag, { color: theme.textSecondary, borderColor: theme.border }]}>Opsiyonel</Text>
            )}
          </View>
          <View style={styles.sectionBody}>
            <View style={styles.fieldWrap}>
              <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
                {isPersonal ? 'SUNULACAK ŞİRKET' : 'ŞİRKET / İŞLETME ADI'}
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface2, borderColor: theme.border, color: theme.text }]}
                placeholder={isPersonal ? 'Örn: Google, Türk Telekom...' : 'Örn: AKTÜRK MOTORS GALERİ'}
                placeholderTextColor={theme.textSecondary}
                value={companyName}
                onChangeText={setCompanyName}
              />
            </View>
            <View style={styles.fieldWrap}>
              <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
                {isPersonal ? 'PROFİL FOTOĞRAFI' : 'LOGO'}
              </Text>
              {logo ? (
                <View style={styles.logoPreview}>
                  <Image source={{ uri: logo.uri }} style={[styles.logoImage, { backgroundColor: theme.surface2 }]} />
                  <TouchableOpacity style={[styles.changeLogoBtn, { backgroundColor: GOLD }]} onPress={pickLogo}>
                    <Icon name="refresh" size={16} color="#fff" />
                    <Text style={styles.changeLogoText}>Değiştir</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={[styles.logoBtn, { backgroundColor: theme.surface2, borderColor: theme.border }]} onPress={pickLogo}>
                  <Icon name={isPersonal ? 'account-circle-outline' : 'image-outline'} size={28} color={theme.textSecondary} />
                  <Text style={[styles.logoBtnText, { color: theme.textSecondary }]}>
                    {isPersonal ? 'Fotoğraf Seç' : 'Logo Yükle'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* ── ARAÇLARIM SEÇ (sadece araç kategorisi) ── */}
        {category.id === 'auto' && (
          <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconWrap, { backgroundColor: theme.surface2 }]}>
                <Icon name="car-multiple" size={20} color={GOLD} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Araçlarımdan Seç</Text>
                <Text style={[styles.filledCount, { color: theme.textSecondary }]}>
                  {araçlarimList.length > 0 ? 'Seç → alanlar otomatik dolsun' : 'Henüz araç eklemediniz'}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.addAracBtn, { backgroundColor: GOLD + '18', borderColor: GOLD + '40' }]}
                onPress={() => navigation.navigate('SahsiAracEkle')}
                activeOpacity={0.8}
              >
                <Icon name="plus" size={16} color={GOLD} />
                <Text style={[styles.addAracTxt, { color: GOLD }]}>Ekle</Text>
              </TouchableOpacity>
            </View>
            {araçlarimList.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 12, paddingBottom: 12 }}>
                {araçlarimList.map(arac => {
                  const isSel = selectedAracId === arac.id;
                  return (
                    <TouchableOpacity
                      key={arac.id}
                      style={[styles.aracChip, {
                        backgroundColor: isSel ? GOLD + '18' : theme.surface2,
                        borderColor: isSel ? GOLD : theme.border,
                      }]}
                      onPress={() => handleSelectArac(arac)}
                      activeOpacity={0.75}
                    >
                      <Icon name="car-outline" size={14} color={isSel ? GOLD : theme.textSecondary} />
                      <View>
                        <Text style={[styles.aracChipMain, { color: isSel ? GOLD : theme.text }]}>
                          {arac.marka} {arac.model}
                        </Text>
                        {(arac.yil || arac.plaka) ? (
                          <Text style={[styles.aracChipSub, { color: theme.textSecondary }]}>
                            {[arac.yil, arac.plaka].filter(Boolean).join(' · ')}
                          </Text>
                        ) : null}
                      </View>
                      {isSel && <Icon name="check-circle" size={14} color={GOLD} />}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>
        )}

        {/* ── FORM ALANLARI ── */}
        {sections ? (
          sections.map((sec) => {
            const isOpen = openSections[sec.id];
            const filled = countFilled(sec.fields);
            return (
              <View key={sec.id} style={[styles.section, { backgroundColor: theme.surface, borderColor: isOpen ? (isDark ? 'rgba(201,168,76,0.3)' : 'rgba(201,168,76,0.4)') : theme.border }]}>
                <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection(sec.id)} activeOpacity={0.7}>
                  <View style={[styles.sectionIconWrap, { backgroundColor: isOpen ? 'rgba(201,168,76,0.15)' : theme.surface2 }]}>
                    <Icon name={sec.iconName} size={20} color={isOpen ? GOLD : theme.textSecondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>{sec.title}</Text>
                    {filled > 0 && <Text style={[styles.filledCount, { color: GOLD }]}>{filled} alan dolu</Text>}
                  </View>
                  <Icon name="chevron-down" size={18} color={theme.textSecondary} style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }} />
                </TouchableOpacity>
                {isOpen && (
                  <View style={styles.sectionBody}>
                    {sec.fields.map((field, i) => renderField(field, i))}
                  </View>
                )}
              </View>
            );
          })
        ) : (
          <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.sectionBody}>
              {category.fields.map((field, i) => renderField(field, i))}
            </View>
          </View>
        )}

        {/* Ekspertiz butonu — sadece araç kategorisi */}
        {category.id === 'auto' && (() => {
          const markedCount = Object.keys(ekspertizData || {}).length;
          const groups = { paint: [], replace: [], local: [] };
          Object.values(ekspertizData || {}).forEach(e => { if (groups[e.status]) groups[e.status].push(e.name); });
          const summaryParts = [
            groups.paint.length   ? `🔵 ${groups.paint.length} Boyalı`   : '',
            groups.replace.length ? `🟡 ${groups.replace.length} Değişen` : '',
            groups.local.length   ? `🟢 ${groups.local.length} Lokal`     : '',
          ].filter(Boolean).join('  ');
          return (
            <TouchableOpacity
              style={[styles.expertizBtn, { backgroundColor: theme.surface, borderColor: markedCount > 0 ? GOLD : theme.border }]}
              onPress={() => navigation.navigate('Expertiz', { categoryId: category.id, ekspertizData: ekspertizData || {} })}
              activeOpacity={0.8}
            >
              <Icon name="car-search-outline" size={22} color={markedCount > 0 ? GOLD : theme.textSecondary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.expertizTitle, { color: theme.text }]}>Hasar &amp; Boya Haritası</Text>
                <Text style={[styles.expertizSub, { color: markedCount > 0 ? GOLD : theme.textSecondary }]}>
                  {markedCount > 0 ? summaryParts : 'Parça durumlarını işaretle (opsiyonel)'}
                </Text>
              </View>
              <Text style={{ color: theme.textSecondary, fontSize: 18 }}>›</Text>
            </TouchableOpacity>
          );
        })()}

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* ── DEVAM BUTONU ── */}
      <View style={[styles.bottomBar, { backgroundColor: theme.bg, borderTopColor: theme.border }]}>
        <TouchableOpacity style={[styles.continueBtn, { backgroundColor: GOLD }]} onPress={handleContinue} activeOpacity={0.88}>
          <Text style={styles.continueBtnText}>
            {isPersonal ? 'Devam Et' : 'Şablon Seç'}
          </Text>
          <View style={styles.continueBtnIcon}>
            <Icon name={isPersonal ? 'arrow-right' : 'palette'} size={18} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      {/* ── SORT MODAL ── */}
      <Modal visible={sortModalVisible} transparent animationType="fade" onRequestClose={() => setSortModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSortModalVisible(false)}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Sıralama Seçenekleri</Text>
            <Text style={[styles.modalSub, { color: theme.textSecondary }]}>Fotoğrafları nasıl sıralamak istersiniz?</Text>
            <View style={{ gap: 10 }}>
              {[
                { key: 'date-asc',  iconName: 'sort-calendar-ascending',   label: 'Tarihe Göre (Eski → Yeni)', desc: 'En eski fotoğraf başta' },
                { key: 'date-desc', iconName: 'sort-calendar-descending',  label: 'Tarihe Göre (Yeni → Eski)', desc: 'En yeni fotoğraf başta' },
                { key: 'name-asc',  iconName: 'sort-alphabetical-ascending',  label: 'İsme Göre (A → Z)',      desc: 'Alfabetik sıralama' },
                { key: 'name-desc', iconName: 'sort-alphabetical-descending', label: 'İsme Göre (Z → A)',      desc: 'Ters alfabetik sıralama' },
              ].map(opt => (
                <TouchableOpacity key={opt.key} style={[styles.sortOption, { backgroundColor: theme.bg, borderColor: theme.border }]} onPress={() => sortImages(opt.key)}>
                  <Icon name={opt.iconName} size={22} color={theme.textSecondary} />
                  <View style={{ flex: 1 }}>
                    <Text style={[{ fontSize: 14, fontWeight: '600', color: theme.text }]}>{opt.label}</Text>
                    <Text style={[{ fontSize: 11, marginTop: 2, color: theme.textSecondary }]}>{opt.desc}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={[styles.modalCancel, { borderColor: theme.border }]} onPress={() => setSortModalVisible(false)}>
              <Text style={[{ fontSize: 14, fontWeight: '600', color: theme.textSecondary }]}>İptal</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── EDIT MODAL ── */}
      <Modal visible={editModalVisible} transparent animationType="fade" onRequestClose={() => setEditModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setEditModalVisible(false)}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]} onStartShouldSetResponder={() => true}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Fotoğraf Düzenle</Text>
            <Text style={[styles.modalSub, { color: theme.textSecondary }]}>Odak noktası, döndürme ve kırpma</Text>
            {selectedImage && (
              <View style={{ gap: 4 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Icon name="image-filter-center-focus" size={16} color={GOLD} />
                  <Text style={[{ fontSize: 14, fontWeight: '700', color: theme.text }]}>PDF Odak Noktası</Text>
                </View>
                <Text style={[{ fontSize: 11, fontWeight: '300', color: theme.textSecondary, marginBottom: 8 }]}>Sürükleyerek PDF'te görünecek alanı seçin</Text>
                <PhotoPositioner key={selectedImage.id} image={selectedImage} onPositionChange={handlePositionChange} />
              </View>
            )}
            <View style={{ gap: 16 }}>
              <View style={{ gap: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Icon name="rotate-right" size={16} color={GOLD} />
                  <Text style={[{ fontSize: 14, fontWeight: '700', color: theme.text }]}>Döndür</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {[{ deg: -90, iconName: 'rotate-left', label: '90° Sola' }, { deg: 90, iconName: 'rotate-right', label: '90° Sağa' }, { deg: 180, iconName: 'rotate-3d-variant', label: '180°' }].map(r => (
                    <TouchableOpacity key={r.deg} style={[styles.editOption, { backgroundColor: theme.bg, borderColor: theme.border }]} onPress={() => handleRotateImage(r.deg)}>
                      <Icon name={r.iconName} size={22} color={GOLD} />
                      <Text style={[{ fontSize: 11, fontWeight: '600', color: theme.text }]}>{r.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={{ gap: 8 }}>
                <Text style={[{ fontSize: 14, fontWeight: '700', color: theme.text }]}>✂️ Kırp</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {[{ type: 'square', icon: '⬜', label: 'Kare 1:1' }, { type: '4:3', icon: '▭', label: '4:3' }, { type: '16:9', icon: '▬', label: '16:9' }].map(c => (
                    <TouchableOpacity key={c.type} style={[styles.editOption, { backgroundColor: theme.bg, borderColor: theme.border }]} onPress={() => handleCropImage(c.type)}>
                      <Text style={{ fontSize: 20 }}>{c.icon}</Text>
                      <Text style={[{ fontSize: 11, fontWeight: '600', color: theme.text }]}>{c.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
            <TouchableOpacity style={[styles.modalCancel, { borderColor: theme.border }]} onPress={() => setEditModalVisible(false)}>
              <Text style={[{ fontSize: 14, fontWeight: '600', color: theme.textSecondary }]}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── MARKA/MODEL PICKER MODAL ── */}
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
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.pickerItem, { borderBottomColor: theme.border }, item === formData[picker.key] && { backgroundColor: GOLD + '18' }]}
                  onPress={() => selectPickerItem(item)}
                >
                  <Text style={[styles.pickerItemTxt, { color: theme.text }, item === formData[picker.key] && { color: GOLD, fontWeight: '700' }]}>
                    {item}
                  </Text>
                  {item === formData[picker.key] && <Text style={{ color: GOLD }}>✓</Text>}
                </TouchableOpacity>
              )}
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
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 14,
    borderBottomWidth: 1,
  },
  backBtn: { width: 36, height: 36, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 16 },
  navTitle: { fontSize: 16, fontWeight: '700', letterSpacing: -0.3 },
  navSub: { fontSize: 11, marginTop: 1 },
  stepChip: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
    backgroundColor: 'rgba(201,168,76,0.12)', borderWidth: 1, borderColor: 'rgba(201,168,76,0.25)',
  },
  stepTxt: { fontSize: 11, fontWeight: '700', color: GOLD },
  clearBtn: { width: 36, height: 36, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },

  scroll: { flex: 1 },

  section: { marginHorizontal: 16, marginTop: 10, borderRadius: 18, borderWidth: 1, overflow: 'hidden' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  sectionIconWrap: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  sectionIconEmoji: { fontSize: 18 },
  sectionTitle: { fontSize: 14, fontWeight: '700', letterSpacing: -0.2 },
  optionalTag: { fontSize: 10, fontWeight: '600', borderWidth: 1, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  filledCount: { fontSize: 11, marginTop: 1 },
  chevron: { fontSize: 14 },

  sectionBody: { paddingHorizontal: 16, paddingBottom: 16, gap: 14, borderTopWidth: 1, borderTopColor: 'rgba(120,120,120,0.1)', paddingTop: 14 },

  fieldWrap: { gap: 8 },
  fieldLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },

  chipScroll: { flexDirection: 'row', gap: 8, paddingRight: 4 },
  chip: { paddingVertical: 9, paddingHorizontal: 16, borderRadius: 99, borderWidth: 1.5 },
  chipText: { fontSize: 13, fontWeight: '500' },

  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, fontSize: 14 },
  hybridInput: { marginTop: 8 },
  textArea: { height: 90, textAlignVertical: 'top', paddingTop: 12 },

  logoBtn: { borderWidth: 1, borderStyle: 'dashed', borderRadius: 12, paddingVertical: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  logoBtnText: { fontSize: 14, fontWeight: '500' },
  logoPreview: { alignItems: 'center', gap: 10 },
  logoImage: { width: 100, height: 100, borderRadius: 12 },
  changeLogoBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  changeLogoText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  dynamicItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, borderWidth: 1 },
  dynamicItemTitle: { fontSize: 13, fontWeight: '600' },
  removeBtn: { padding: 6 },
  langDots: { flexDirection: 'row', gap: 5, marginTop: 6 },
  langDot: { width: 8, height: 8, borderRadius: 4 },
  skillBarWrap: { height: 4, borderRadius: 99, backgroundColor: 'rgba(150,150,150,0.15)', overflow: 'hidden' },
  skillBarFill: { height: '100%', borderRadius: 99 },
  addBox: { borderWidth: 1, borderRadius: 14, padding: 14, gap: 8 },
  addBoxLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.6 },
  addInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, fontSize: 14 },
  addItemBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 12, borderRadius: 10, marginTop: 4 },
  addItemBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  themeRow: { flexDirection: 'row', gap: 10 },
  themeCard: { flex: 1, borderRadius: 14, borderWidth: 2, padding: 14, overflow: 'hidden', position: 'relative', gap: 4 },
  themeAccentBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  themeCardLabel: { fontSize: 13, fontWeight: '700', marginTop: 4 },
  themeCardDesc: { fontSize: 11 },
  themeCheck: { position: 'absolute', top: 10, right: 10, width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },

  addAracBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1 },
  addAracTxt: { fontSize: 12, fontWeight: '700' },
  aracChip: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
  aracChipMain: { fontSize: 13, fontWeight: '700' },
  aracChipSub: { fontSize: 10, marginTop: 1 },
  expertizBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 16, marginTop: 10, padding: 16, borderRadius: 16, borderWidth: 1.5 },
  expertizEmoji: { fontSize: 22 },
  expertizTitle: { fontSize: 14, fontWeight: '700', letterSpacing: -0.2 },
  expertizSub: { fontSize: 11, marginTop: 2 },

  bottomBar: { paddingHorizontal: 16, paddingVertical: 14, paddingBottom: 28, borderTopWidth: 1 },
  continueBtn: { borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  continueBtnText: { fontSize: 16, fontWeight: '700', color: '#fff', letterSpacing: -0.2 },
  continueBtnIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },

  // Photo section
  uploadRow: { flexDirection: 'row', gap: 10 },
  uploadPill: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1 },
  uploadPillPrimary: { flex: 2, borderWidth: 0 },
  uploadPillEmoji: { fontSize: 17 },
  uploadPillLabel: { fontSize: 13, fontWeight: '600' },
  sortChipSmall: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1 },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', maxWidth: 400, borderRadius: 20, padding: 24, gap: 16 },
  modalTitle: { fontSize: 20, fontWeight: '700', textAlign: 'center' },
  modalSub: { fontSize: 13, textAlign: 'center', marginBottom: 8 },
  sortOption: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 1, gap: 12 },
  modalCancel: { padding: 14, borderRadius: 12, borderWidth: 1, alignItems: 'center', marginTop: 8 },
  editOption: { flex: 1, padding: 12, borderRadius: 10, borderWidth: 1, alignItems: 'center', gap: 4 },

  pickerBtn: { flexDirection: 'row', alignItems: 'center' },
  pickerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  pickerSheet: { borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '75%' },
  pickerHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
  pickerTitle: { fontSize: 16, fontWeight: '700' },
  pickerSearch: { margin: 12, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14 },
  pickerItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1 },
  pickerItemTxt: { fontSize: 14 },
});
