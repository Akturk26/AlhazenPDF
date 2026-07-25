import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, Alert, TextInput, Modal, ActivityIndicator,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../themes/colors';
import supabase from '../utils/supabaseClient';
import Icon from '../components/Icon';

export const ACTIVE_CO_KEY = '@alhazen_active_co_id';

const GOLD  = '#C9A84C';
const NAVY  = '#0F172A';
const NAVY2 = '#1A2744';

const TYPE_META = {
  galeri:         { icon: 'car-outline',       label: 'Galeri' },
  teknik_servis:  { icon: 'tools',              label: 'Teknik Servis' },
  emlak:          { icon: 'home-city-outline',  label: 'Emlak' },
};

const TYPE_OPTIONS = [
  { key: 'galeri',        icon: 'car-outline',       label: 'Galeri' },
  { key: 'teknik_servis', icon: 'tools',              label: 'Servis' },
  { key: 'emlak',         icon: 'home-city-outline',  label: 'Emlak'  },
];

function trialKalan(trial_ends_at) {
  if (!trial_ends_at) return 0;
  return Math.max(0, Math.floor((new Date(trial_ends_at) - new Date()) / 86400000));
}

function planChip(company) {
  const kalan = trialKalan(company.trial_ends_at);
  if (company.plan === 'takim')    return { txt: 'Takım · Aktif',    color: '#059669' };
  if (company.plan === 'solo')     return { txt: 'Solo · Aktif',     color: GOLD };
  if (company.plan === 'bireysel') return { txt: 'Bireysel · Aktif', color: GOLD };
  if (kalan > 0) return { txt: `Deneme · ${kalan} gün`, color: '#F59E0B' };
  return { txt: 'Ücretsiz', color: '#6B7280' };
}

function CoCard({ co, activeId, onPress, theme, isDark, memberBadge }) {
  const isActive = co.id === activeId;
  const meta = TYPE_META[co.type] || TYPE_META.galeri;
  const chip = planChip(co);
  return (
    <TouchableOpacity
      style={[styles.card, {
        backgroundColor: theme.surface,
        borderColor: isActive ? GOLD : theme.border,
        borderWidth: isActive ? 2 : 1,
      }]}
      onPress={() => onPress(co)}
      activeOpacity={0.8}
    >
      <View style={[styles.iconBox, { backgroundColor: isDark ? 'rgba(201,168,76,0.12)' : 'rgba(15,23,42,0.06)' }]}>
        <Icon name={meta.icon} size={26} color={isActive ? GOLD : NAVY2} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.coName, { color: theme.text }]}>{co.name}</Text>
        <Text style={[styles.coType, { color: theme.textSecondary }]}>
          {meta.label}{memberBadge ? ' · Yetkili' : ''}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 6 }}>
        <View style={[styles.chip, { backgroundColor: chip.color + '18', borderColor: chip.color + '40' }]}>
          <Text style={[styles.chipTxt, { color: chip.color }]}>{chip.txt}</Text>
        </View>
        {isActive && (
          <View style={[styles.activeDot, { backgroundColor: GOLD }]}>
            <Text style={{ color: '#fff', fontSize: 9, fontWeight: '800' }}>AKTİF</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function CompanySelectScreen({ navigation }) {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  const insets = useSafeAreaInsets();

  const [ownedCos, setOwnedCos]   = useState([]);
  const [memberCos, setMemberCos] = useState([]);
  const [activeId, setActiveId]   = useState(null);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(false);
  const [newName, setNewName]     = useState('');
  const [newType, setNewType]     = useState('galeri');
  const [saving, setSaving]       = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigation.goBack(); return; }

      const { data: owned } = await supabase
        .from('companies').select('*')
        .eq('owner_id', user.id)
        .order('created_at');
      setOwnedCos(owned || []);

      const { data: memberships } = await supabase
        .from('company_members')
        .select('company_id')
        .eq('email', user.email)
        .not('accepted_at', 'is', null);

      let mcos = [];
      if (memberships?.length) {
        const ids = memberships.map(m => m.company_id);
        const { data: mcoData } = await supabase.from('companies').select('*').in('id', ids);
        mcos = mcoData || [];
      }
      setMemberCos(mcos);

      const stored = await AsyncStorage.getItem(ACTIVE_CO_KEY);
      setActiveId(stored || owned?.[0]?.id || null);
    } catch {}
    setLoading(false);
  };

  const selectCompany = async (company) => {
    await AsyncStorage.setItem(ACTIVE_CO_KEY, company.id);
    setActiveId(company.id);
    navigation.goBack();
  };

  const handleAdd = async () => {
    if (!newName.trim()) { Alert.alert('Eksik', 'İşletme adı zorunludur.'); return; }
    if (ownedCos.find(co => co.type === newType)) {
      const lbl = newType === 'galeri' ? 'Galeri' : newType === 'emlak' ? 'Emlak' : 'Teknik Servis';
      Alert.alert('Limit', `Zaten bir ${lbl} işletmeniz var. Her türden yalnızca 1 işletme açılabilir.`);
      return;
    }
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase.from('companies').insert({
        owner_id: user.id,
        name: newName.trim(),
        type: newType,
        plan: 'free',
      }).select().maybeSingle();
      if (error) throw error;
      setModal(false);
      setNewName('');
      setNewType('galeri');
      if (data) await selectCompany(data);
    } catch (e) {
      Alert.alert('Hata', e.message || 'İşletme eklenemedi.');
    }
    setSaving(false);
  };

  const namePlaceholder = newType === 'galeri'
    ? 'Örn: Aktürk Oto Galeri'
    : newType === 'emlak'
    ? 'Örn: Aktürk Emlak'
    : 'Örn: Aktürk Teknik Servis';

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <LinearGradient colors={[NAVY, NAVY2]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>İşletmelerim</Text>
          <Text style={styles.headerSub}>Aktif işletmeyi seçin</Text>
        </View>
        <View style={styles.headerBadge}>
          <Icon name="swap-horizontal" size={20} color={GOLD} />
        </View>
      </LinearGradient>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={GOLD} size="large" />
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={styles.list}>

            {ownedCos.map(co => (
              <CoCard key={co.id} co={co} activeId={activeId} onPress={selectCompany} theme={theme} isDark={isDark} />
            ))}

            <TouchableOpacity
              style={[styles.addBtn, { borderColor: GOLD + '50', backgroundColor: GOLD + '08' }]}
              onPress={() => setModal(true)}
              activeOpacity={0.8}
            >
              <Icon name="plus-circle-outline" size={22} color={GOLD} />
              <Text style={[styles.addBtnTxt, { color: GOLD }]}>Yeni İşletme Ekle</Text>
            </TouchableOpacity>

            {memberCos.length > 0 && (
              <>
                <View style={styles.sectionDivider}>
                  <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
                  <Text style={[styles.dividerTxt, { color: theme.textSecondary }]}>ÜYE OLDUĞUM İŞLETMELER</Text>
                  <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
                </View>
                {memberCos.map(co => (
                  <CoCard key={co.id} co={co} activeId={activeId} onPress={selectCompany} theme={theme} isDark={isDark} memberBadge />
                ))}
              </>
            )}

          </View>
          <View style={{ height: 60 }} />
        </ScrollView>
      )}

      {/* Yeni İşletme Modal */}
      <Modal visible={modal} transparent animationType="slide" onRequestClose={() => setModal(false)}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={[styles.modalSheet, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Yeni İşletme</Text>

            <Text style={[styles.fieldLbl, { color: theme.textSecondary }]}>İŞLETME TÜRÜ</Text>
            <View style={[styles.typeRow, { backgroundColor: isDark ? '#0d0f14' : '#f3f4f6', borderColor: theme.border }]}>
              {TYPE_OPTIONS.map(({ key, icon, label }) => {
                const active = newType === key;
                return (
                  <TouchableOpacity
                    key={key}
                    style={[styles.typeBtn, active && { backgroundColor: NAVY }]}
                    onPress={() => setNewType(key)}
                  >
                    <Icon name={icon} size={18} color={active ? GOLD : theme.textSecondary} />
                    <Text style={[styles.typeLbl, { color: active ? GOLD : theme.textSecondary }]}>{label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.fieldLbl, { color: theme.textSecondary, marginTop: 14 }]}>İŞLETME ADI</Text>
            <TextInput
              style={[styles.modalInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface2 }]}
              value={newName}
              onChangeText={setNewName}
              placeholder={namePlaceholder}
              placeholderTextColor={theme.textSecondary}
              autoFocus
            />

            <View style={styles.modalBtns}>
              <TouchableOpacity style={[styles.cancelBtn, { borderColor: theme.border }]} onPress={() => setModal(false)}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: theme.text }}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBtn, { opacity: saving ? 0.7 : 1 }]}
                onPress={handleAdd}
                disabled={saving}
              >
                {saving
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>Ekle</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingBottom: 18 },
  backBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: -0.5 },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },
  headerBadge: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },

  list: { padding: 16, gap: 12 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 16, padding: 16 },
  iconBox: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  coName: { fontSize: 15, fontWeight: '700', letterSpacing: -0.3 },
  coType: { fontSize: 12, marginTop: 2 },
  chip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 7, borderWidth: 1 },
  chipTxt: { fontSize: 10, fontWeight: '800' },
  activeDot: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },

  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, borderRadius: 16, borderWidth: 1.5, borderStyle: 'dashed', padding: 18,
  },
  addBtnTxt: { fontSize: 14, fontWeight: '700' },

  sectionDivider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 4 },
  dividerLine: { flex: 1, height: 1 },
  dividerTxt: { fontSize: 9, fontWeight: '800', letterSpacing: 1 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, gap: 8 },
  modalTitle: { fontSize: 17, fontWeight: '800', marginBottom: 16 },
  fieldLbl: { fontSize: 9, fontWeight: '800', letterSpacing: 1, marginBottom: 6 },
  typeRow: { flexDirection: 'row', borderRadius: 12, borderWidth: 1, padding: 4, gap: 4 },
  typeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 9 },
  typeLbl: { fontSize: 13, fontWeight: '700' },
  modalInput: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, marginTop: 2 },
  modalBtns: { flexDirection: 'row', gap: 10, marginTop: 20 },
  cancelBtn: { flex: 1, borderWidth: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  confirmBtn: { flex: 2, backgroundColor: GOLD, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
});
