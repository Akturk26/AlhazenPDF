import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, Alert, Image, Modal, TextInput, FlatList,
  KeyboardAvoidingView, Platform, Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../components/Icon';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../themes/colors';

const GOLD = '#C9A84C';
import {
  getAraclar, updateArac, deleteArac,
  kalanGun, durumRenk,
} from '../utils/araclarimStorage';

function today() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
}

function addMonths(dateStr, months) {
  const [dd, mm, yy] = dateStr.split('.');
  const d = new Date(Number(yy), Number(mm) - 1 + months, Number(dd));
  return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
}

// ─── Tab: Muayene ───────────────────────────────────────────────────
function MuayeneTab({ arac, onUpdate, colors }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ tarih: today(), sonrakiTarih: addMonths(today(), 24), sonuc: 'Geçti', not: '' });

  const handleAdd = async () => {
    Keyboard.dismiss();
    const entry = { id: Date.now().toString(), ...form };
    const yeni = [...(arac.muayeneler || []), entry];
    await onUpdate({ muayeneler: yeni });
    setModal(false);
    setForm({ tarih: today(), sonrakiTarih: addMonths(today(), 24), sonuc: 'Geçti', not: '' });
  };

  const handleDelete = (id) => {
    Alert.alert('Sil', 'Bu kayıt silinsin mi?', [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: async () => {
        await onUpdate({ muayeneler: (arac.muayeneler || []).filter(m => m.id !== id) });
      }},
    ]);
  };

  const list = [...(arac.muayeneler || [])].reverse();

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={[st.addRowBtn, { borderColor: colors.border }]} onPress={() => setModal(true)}>
        <Text style={[st.addRowBtnTxt, { color: GOLD }]}>+ Muayene Ekle</Text>
      </TouchableOpacity>
      {list.length === 0 ? <Text style={[st.emptyTxt, { color: colors.sub }]}>Muayene kaydı yok</Text> : (
        list.map(m => {
          const gun = kalanGun(m.sonrakiTarih);
          const renk = durumRenk(gun);
          return (
            <TouchableOpacity key={m.id} style={[st.entryCard, { backgroundColor: colors.surface, borderColor: colors.border, borderLeftColor: renk, borderLeftWidth: 3 }]}
              onLongPress={() => handleDelete(m.id)} activeOpacity={0.85}>
              <View style={st.entryRow}>
                <Text style={[st.entryLabel, { color: colors.sub }]}>Muayene Tarihi</Text>
                <Text style={[st.entryVal, { color: colors.text }]}>{m.tarih}</Text>
              </View>
              <View style={st.entryRow}>
                <Text style={[st.entryLabel, { color: colors.sub }]}>Sonraki Muayene</Text>
                <Text style={[st.entryVal, { color: renk, fontWeight: '700' }]}>{m.sonrakiTarih}</Text>
              </View>
              {gun !== null && (
                <View style={[st.statusChip, { backgroundColor: renk + '18', borderColor: renk + '40' }]}>
                  <Text style={[st.statusTxt, { color: renk }]}>
                    {gun < 0 ? '⚠ Süresi doldu' : gun === 0 ? '⚠ Bugün!' : `⏳ ${gun} gün kaldı`}
                  </Text>
                </View>
              )}
              <View style={st.entryRow}>
                <Text style={[st.entryLabel, { color: colors.sub }]}>Sonuç</Text>
                <Text style={[st.entryVal, { color: m.sonuc === 'Geçti' ? '#16a34a' : '#dc2626' }]}>{m.sonuc}</Text>
              </View>
              {m.not ? <Text style={[st.entryNote, { color: colors.sub }]}>{m.not}</Text> : null}
              <Text style={[st.longPressTip, { color: colors.sub }]}>Silmek için basılı tut</Text>
            </TouchableOpacity>
          );
        })
      )}

      <Modal visible={modal} animationType="slide" transparent onRequestClose={() => setModal(false)}>
        <KeyboardAvoidingView style={st.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={[st.modalSheet, { backgroundColor: colors.surface }]}>
            <Text style={[st.modalTitle, { color: colors.text }]}>Muayene Ekle</Text>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {[
              { key: 'tarih', lbl: 'Muayene Tarihi', hint: 'gg.aa.yyyy' },
              { key: 'sonrakiTarih', lbl: 'Sonraki Muayene Tarihi', hint: 'gg.aa.yyyy' },
            ].map(f => (
              <View key={f.key} style={st.mField}>
                <Text style={[st.mLbl, { color: colors.sub }]}>{f.lbl}</Text>
                <TextInput
                  style={[st.mInput, { backgroundColor: colors.bg, borderColor: colors.border, color: colors.text }]}
                  value={form[f.key]} onChangeText={v => setForm(p => ({ ...p, [f.key]: v }))}
                  placeholder={f.hint} placeholderTextColor={colors.sub}
                />
              </View>
            ))}
            <View style={st.mField}>
              <Text style={[st.mLbl, { color: colors.sub }]}>Sonuç</Text>
              <View style={st.segRow}>
                {['Geçti', 'Kaldı'].map(opt => (
                  <TouchableOpacity key={opt}
                    style={[st.seg, form.sonuc === opt && { backgroundColor: opt === 'Geçti' ? '#16a34a' : '#dc2626', borderColor: opt === 'Geçti' ? '#16a34a' : '#dc2626' }, { borderColor: colors.border }]}
                    onPress={() => setForm(p => ({ ...p, sonuc: opt }))}>
                    <Text style={[st.segTxt, { color: form.sonuc === opt ? '#fff' : colors.sub }]}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={st.mField}>
              <Text style={[st.mLbl, { color: colors.sub }]}>Not (opsiyonel)</Text>
              <TextInput style={[st.mInput, { backgroundColor: colors.bg, borderColor: colors.border, color: colors.text }]}
                value={form.not} onChangeText={v => setForm(p => ({ ...p, not: v }))}
                placeholder="İstasyon, not…" placeholderTextColor={colors.sub} />
            </View>
            </ScrollView>
            <View style={st.modalBtns}>
              <TouchableOpacity style={[st.modalBtn, { borderColor: colors.border }]} onPress={() => setModal(false)}>
                <Text style={[st.modalBtnTxt, { color: colors.sub }]}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[st.modalBtn, { backgroundColor: GOLD, borderColor: GOLD }]} onPress={handleAdd}>
                <Text style={[st.modalBtnTxt, { color: '#fff' }]}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

// ─── Tab: Sigorta ───────────────────────────────────────────────────
function SigortaTab({ arac, onUpdate, colors }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ sirket: '', policeNo: '', baslangic: today(), bitis: addMonths(today(), 12), tur: 'Kasko', not: '' });
  const TURLER = ['Kasko', 'Trafik', 'Trafik + Kasko'];

  const handleAdd = async () => {
    Keyboard.dismiss();
    const entry = { id: Date.now().toString(), ...form };
    await onUpdate({ sigortalar: [...(arac.sigortalar || []), entry] });
    setModal(false);
    setForm({ sirket: '', policeNo: '', baslangic: today(), bitis: addMonths(today(), 12), tur: 'Kasko', not: '' });
  };

  const handleDelete = (id) => {
    Alert.alert('Sil', 'Bu kayıt silinsin mi?', [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: async () => {
        await onUpdate({ sigortalar: (arac.sigortalar || []).filter(s => s.id !== id) });
      }},
    ]);
  };

  const list = [...(arac.sigortalar || [])].reverse();

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={[st.addRowBtn, { borderColor: colors.border }]} onPress={() => setModal(true)}>
        <Text style={[st.addRowBtnTxt, { color: '#3DBA7C' }]}>+ Sigorta Ekle</Text>
      </TouchableOpacity>
      {list.length === 0 ? <Text style={[st.emptyTxt, { color: colors.sub }]}>Sigorta kaydı yok</Text> : (
        list.map(s => {
          const gun = kalanGun(s.bitis);
          const renk = durumRenk(gun);
          return (
            <TouchableOpacity key={s.id} style={[st.entryCard, { backgroundColor: colors.surface, borderColor: colors.border, borderLeftColor: renk, borderLeftWidth: 3 }]}
              onLongPress={() => handleDelete(s.id)} activeOpacity={0.85}>
              <View style={st.entryRow}>
                <Text style={[st.entryLabel, { color: colors.sub }]}>Şirket</Text>
                <Text style={[st.entryVal, { color: colors.text }]}>{s.sirket || '—'}</Text>
              </View>
              {s.policeNo ? <View style={st.entryRow}>
                <Text style={[st.entryLabel, { color: colors.sub }]}>Poliçe No</Text>
                <Text style={[st.entryVal, { color: colors.text }]}>{s.policeNo}</Text>
              </View> : null}
              <View style={st.entryRow}>
                <Text style={[st.entryLabel, { color: colors.sub }]}>Bitiş</Text>
                <Text style={[st.entryVal, { color: renk, fontWeight: '700' }]}>{s.bitis}</Text>
              </View>
              {gun !== null && (
                <View style={[st.statusChip, { backgroundColor: renk + '18', borderColor: renk + '40' }]}>
                  <Text style={[st.statusTxt, { color: renk }]}>
                    {gun < 0 ? '⚠ Süresi doldu' : gun === 0 ? '⚠ Bugün bitiyor!' : `⏳ ${gun} gün kaldı`}
                  </Text>
                </View>
              )}
              <View style={st.entryRow}>
                <Text style={[st.entryLabel, { color: colors.sub }]}>Tür</Text>
                <Text style={[st.entryVal, { color: colors.text }]}>{s.tur}</Text>
              </View>
              <Text style={[st.longPressTip, { color: colors.sub }]}>Silmek için basılı tut</Text>
            </TouchableOpacity>
          );
        })
      )}

      <Modal visible={modal} animationType="slide" transparent onRequestClose={() => setModal(false)}>
        <KeyboardAvoidingView style={st.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={[st.modalSheet, { backgroundColor: colors.surface }]}>
            <Text style={[st.modalTitle, { color: colors.text }]}>Sigorta Ekle</Text>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {[
              { key: 'sirket', lbl: 'Sigorta Şirketi', hint: 'Allianz, Anadolu Sigorta…' },
              { key: 'policeNo', lbl: 'Poliçe No (opsiyonel)', hint: '1234567890' },
              { key: 'baslangic', lbl: 'Başlangıç', hint: 'gg.aa.yyyy' },
              { key: 'bitis', lbl: 'Bitiş', hint: 'gg.aa.yyyy' },
            ].map(f => (
              <View key={f.key} style={st.mField}>
                <Text style={[st.mLbl, { color: colors.sub }]}>{f.lbl}</Text>
                <TextInput
                  style={[st.mInput, { backgroundColor: colors.bg, borderColor: colors.border, color: colors.text }]}
                  value={form[f.key]} onChangeText={v => setForm(p => ({ ...p, [f.key]: v }))}
                  placeholder={f.hint} placeholderTextColor={colors.sub}
                />
              </View>
            ))}
            <View style={st.mField}>
              <Text style={[st.mLbl, { color: colors.sub }]}>Sigorta Türü</Text>
              <View style={st.segRow}>
                {TURLER.map(opt => (
                  <TouchableOpacity key={opt}
                    style={[st.seg, form.tur === opt && { backgroundColor: '#3DBA7C', borderColor: '#3DBA7C' }, { borderColor: colors.border }]}
                    onPress={() => setForm(p => ({ ...p, tur: opt }))}>
                    <Text style={[st.segTxt, { color: form.tur === opt ? '#fff' : colors.sub, fontSize: 11 }]}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            </ScrollView>
            <View style={st.modalBtns}>
              <TouchableOpacity style={[st.modalBtn, { borderColor: colors.border }]} onPress={() => setModal(false)}>
                <Text style={[st.modalBtnTxt, { color: colors.sub }]}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[st.modalBtn, { backgroundColor: '#3DBA7C', borderColor: '#3DBA7C' }]} onPress={handleAdd}>
                <Text style={[st.modalBtnTxt, { color: '#fff' }]}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

// ─── Tab: Bakım ─────────────────────────────────────────────────────
function BakimTab({ arac, onUpdate, colors }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ tarih: today(), km: '', yapilan: '', garaj: '', not: '' });

  const handleAdd = async () => {
    Keyboard.dismiss();
    if (!form.yapilan.trim()) { Alert.alert('Eksik', 'Yapılan işlemi girin.'); return; }
    const entry = { id: Date.now().toString(), ...form };
    await onUpdate({ bakimlar: [...(arac.bakimlar || []), entry] });
    setModal(false);
    setForm({ tarih: today(), km: '', yapilan: '', garaj: '', not: '' });
  };

  const handleDelete = (id) => {
    Alert.alert('Sil', 'Bu kayıt silinsin mi?', [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: async () => {
        await onUpdate({ bakimlar: (arac.bakimlar || []).filter(b => b.id !== id) });
      }},
    ]);
  };

  const list = [...(arac.bakimlar || [])].reverse();

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={[st.addRowBtn, { borderColor: colors.border }]} onPress={() => setModal(true)}>
        <Text style={[st.addRowBtnTxt, { color: '#FF8C1E' }]}>+ Bakım Ekle</Text>
      </TouchableOpacity>
      {list.length === 0 ? <Text style={[st.emptyTxt, { color: colors.sub }]}>Bakım kaydı yok</Text> : (
        list.map(b => (
          <TouchableOpacity key={b.id} style={[st.entryCard, { backgroundColor: colors.surface, borderColor: colors.border, borderLeftColor: '#FF8C1E', borderLeftWidth: 3 }]}
            onLongPress={() => handleDelete(b.id)} activeOpacity={0.85}>
            <View style={st.entryRow}>
              <Text style={[st.entryLabel, { color: colors.sub }]}>Tarih</Text>
              <Text style={[st.entryVal, { color: colors.text }]}>{b.tarih}</Text>
            </View>
            {b.km ? <View style={st.entryRow}>
              <Text style={[st.entryLabel, { color: colors.sub }]}>KM</Text>
              <Text style={[st.entryVal, { color: '#FF8C1E', fontWeight: '700' }]}>{b.km}</Text>
            </View> : null}
            <View style={st.entryRow}>
              <Text style={[st.entryLabel, { color: colors.sub }]}>Garaj / Servis</Text>
              <Text style={[st.entryVal, { color: colors.text }]}>{b.garaj || '—'}</Text>
            </View>
            <Text style={[st.yapilan, { color: colors.text }]}>{b.yapilan}</Text>
            {b.not ? <Text style={[st.entryNote, { color: colors.sub }]}>{b.not}</Text> : null}
            <Text style={[st.longPressTip, { color: colors.sub }]}>Silmek için basılı tut</Text>
          </TouchableOpacity>
        ))
      )}

      <Modal visible={modal} animationType="slide" transparent onRequestClose={() => setModal(false)}>
        <KeyboardAvoidingView style={st.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={[st.modalSheet, { backgroundColor: colors.surface }]}>
            <Text style={[st.modalTitle, { color: colors.text }]}>Bakım Ekle</Text>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {[
              { key: 'tarih', lbl: 'Tarih', hint: 'gg.aa.yyyy' },
              { key: 'km', lbl: 'KM (opsiyonel)', hint: '97.500', numeric: true },
              { key: 'garaj', lbl: 'Garaj / Servis', hint: 'Yılmaz Oto Servis' },
            ].map(f => (
              <View key={f.key} style={st.mField}>
                <Text style={[st.mLbl, { color: colors.sub }]}>{f.lbl}</Text>
                <TextInput
                  style={[st.mInput, { backgroundColor: colors.bg, borderColor: colors.border, color: colors.text }]}
                  value={form[f.key]} onChangeText={v => setForm(p => ({ ...p, [f.key]: v }))}
                  placeholder={f.hint} placeholderTextColor={colors.sub}
                  keyboardType={f.numeric ? 'numeric' : 'default'}
                />
              </View>
            ))}
            <View style={st.mField}>
              <Text style={[st.mLbl, { color: colors.sub }]}>Yapılan İşlemler *</Text>
              <TextInput
                style={[st.mInput, st.mTextarea, { backgroundColor: colors.bg, borderColor: colors.border, color: colors.text }]}
                value={form.yapilan} onChangeText={v => setForm(p => ({ ...p, yapilan: v }))}
                placeholder={'Yağ değişimi\nHava filtresi\nFren kontrolü'}
                placeholderTextColor={colors.sub} multiline numberOfLines={4} textAlignVertical="top"
              />
            </View>
            </ScrollView>
            <View style={st.modalBtns}>
              <TouchableOpacity style={[st.modalBtn, { borderColor: colors.border }]} onPress={() => setModal(false)}>
                <Text style={[st.modalBtnTxt, { color: colors.sub }]}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[st.modalBtn, { backgroundColor: '#FF8C1E', borderColor: '#FF8C1E' }]} onPress={handleAdd}>
                <Text style={[st.modalBtnTxt, { color: '#fff' }]}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

// ─── Ana Ekran ───────────────────────────────────────────────────────
const TABS = [
  { key: 'muayene', label: 'Muayene', color: GOLD },
  { key: 'sigorta', label: 'Sigorta', color: '#3DBA7C' },
  { key: 'bakim',   label: 'Bakım',   color: '#FF8C1E' },
];

export default function AracDetayScreen({ navigation, route }) {
  const { aracId } = route.params;
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  const insets = useSafeAreaInsets();
  const [arac, setArac] = useState(null);
  const [activeTab, setActiveTab] = useState('muayene');

  const bg = isDark ? '#0d0f14' : '#F9FAFB';
  const surface = isDark ? '#161a23' : '#fff';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';
  const colors = { bg, surface, border, text: theme.text, sub: theme.textSecondary };

  useFocusEffect(useCallback(() => {
    getAraclar().then(list => {
      const found = list.find(a => a.id === aracId);
      if (found) setArac(found);
    });
  }, [aracId]));

  const handleUpdate = async (updates) => {
    const updated = await updateArac(aracId, updates);
    if (updated) setArac(updated);
  };

  const handleDelete = () => {
    Alert.alert('Aracı Sil', 'Bu araç ve tüm kayıtları silinecek. Emin misin?', [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: async () => {
        await deleteArac(aracId);
        navigation.goBack();
      }},
    ]);
  };

  if (!arac) return <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center' }, { backgroundColor: bg }]} />;

  const tabColor = TABS.find(t => t.key === activeTab)?.color || GOLD;

  return (
    <View style={[st.root, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bg} />

      {/* Header */}
      <LinearGradient
        colors={isDark ? ['#161a23', '#0d0f14'] : ['#fff', '#F9FAFB']}
        style={[st.header, { paddingTop: insets.top + 10, borderBottomColor: border }]}
      >
        <TouchableOpacity style={[st.navBtn, { backgroundColor: isDark ? '#1e2330' : '#f3f4f6', borderColor: border }]} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={18} color={theme.text} />
        </TouchableOpacity>

        {/* Araç özet */}
        <View style={[st.aracSummary, { backgroundColor: isDark ? '#0d0f14' : '#f3f4f6', borderColor: border }]}>
          {arac.fotoUri
            ? <Image source={{ uri: arac.fotoUri }} style={st.summaryPhoto} resizeMode="cover" />
            : <Icon name="car-outline" size={22} color={isDark ? '#555' : '#bbb'} />
          }
          <View>
            <Text style={[st.summaryMake, { color: theme.text }]}>{arac.marka} {arac.model}</Text>
            <Text style={[st.summaryPlaka, { color: '#C9A84C' }]}>{arac.plaka} · {arac.yil}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[st.navBtn, { backgroundColor: isDark ? '#1e2330' : '#f3f4f6', borderColor: border }]}
          onPress={() => navigation.navigate('SahsiAracEkle', { arac })}
        >
          <Text style={{ fontSize: 14 }}>✏️</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Tabs */}
      <View style={[st.tabBar, { backgroundColor: surface, borderBottomColor: border }]}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[st.tabBtn, activeTab === tab.key && { borderBottomColor: tab.color, borderBottomWidth: 2.5 }]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[st.tabTxt, { color: activeTab === tab.key ? tab.color : theme.textSecondary }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab içerik */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'muayene' && <MuayeneTab arac={arac} onUpdate={handleUpdate} colors={colors} />}
        {activeTab === 'sigorta' && <SigortaTab arac={arac} onUpdate={handleUpdate} colors={colors} />}
        {activeTab === 'bakim'   && <BakimTab   arac={arac} onUpdate={handleUpdate} colors={colors} />}

        {/* Sil butonu */}
        <TouchableOpacity style={st.deleteBtn} onPress={handleDelete} activeOpacity={0.8}>
          <Text style={st.deleteTxt}>🗑  Aracı Sil</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 14, paddingBottom: 12, borderBottomWidth: 1,
  },
  navBtn: { width: 36, height: 36, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  aracSummary: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10,
    borderRadius: 12, borderWidth: 1, padding: 8, overflow: 'hidden',
  },
  summaryPhoto: { width: 44, height: 36, borderRadius: 6 },
  summaryMake: { fontSize: 14, fontWeight: '700' },
  summaryPlaka: { fontSize: 11, fontWeight: '600', letterSpacing: 1 },

  tabBar: {
    flexDirection: 'row', borderBottomWidth: 1,
  },
  tabBtn: {
    flex: 1, paddingVertical: 13, alignItems: 'center', borderBottomWidth: 2.5, borderBottomColor: 'transparent',
  },
  tabTxt: { fontSize: 13, fontWeight: '700' },

  addRowBtn: {
    borderWidth: 1.5, borderRadius: 10, paddingVertical: 12,
    alignItems: 'center', marginBottom: 12, borderStyle: 'dashed',
  },
  addRowBtnTxt: { fontSize: 14, fontWeight: '700' },
  emptyTxt: { textAlign: 'center', fontSize: 13, opacity: 0.5, marginTop: 20 },

  entryCard: {
    borderRadius: 12, borderWidth: 1, padding: 14, marginBottom: 10, gap: 6,
  },
  entryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  entryLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 0.3, textTransform: 'uppercase' },
  entryVal: { fontSize: 14, fontWeight: '600' },
  entryNote: { fontSize: 12, fontStyle: 'italic', marginTop: 2 },
  yapilan: { fontSize: 13, lineHeight: 19, marginTop: 4 },
  statusChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1, alignSelf: 'flex-start' },
  statusTxt: { fontSize: 12, fontWeight: '700' },
  longPressTip: { fontSize: 9, opacity: 0.4, textAlign: 'right', marginTop: 4 },

  deleteBtn: {
    marginTop: 24, paddingVertical: 14, borderRadius: 12,
    backgroundColor: 'rgba(220,38,38,0.08)', borderWidth: 1, borderColor: 'rgba(220,38,38,0.25)',
    alignItems: 'center',
  },
  deleteTxt: { color: '#dc2626', fontSize: 14, fontWeight: '700' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, gap: 12, paddingBottom: 36 },
  modalTitle: { fontSize: 17, fontWeight: '800', marginBottom: 4 },
  mField: { gap: 4 },
  mLbl: { fontSize: 11, fontWeight: '600', letterSpacing: 0.3, textTransform: 'uppercase' },
  mInput: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  mTextarea: { minHeight: 80 },
  segRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  seg: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, borderWidth: 1.5 },
  segTxt: { fontSize: 13, fontWeight: '600' },
  modalBtns: { flexDirection: 'row', gap: 10, marginTop: 8 },
  modalBtn: { flex: 1, borderRadius: 12, borderWidth: 1.5, paddingVertical: 13, alignItems: 'center' },
  modalBtnTxt: { fontSize: 15, fontWeight: '700' },
});
