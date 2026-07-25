import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, Alert, TextInput, Modal, ActivityIndicator,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../themes/colors';
import { usePremium } from '../context/PremiumContext';
import supabase from '../utils/supabaseClient';
import { ACTIVE_CO_KEY } from './CompanySelectScreen';
import Icon from '../components/Icon';

const GOLD  = '#C9A84C';
const NAVY  = '#0F172A';
const NAVY2 = '#1A2744';

function maxUye(company) {
  if (company?.plan !== 'takim') return 0;
  return company?.type === 'teknik_servis' ? 2 : 3;
}

export default function TeamMembersScreen({ navigation }) {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  const insets = useSafeAreaInsets();
  const { premiumTier } = usePremium();

  const [company, setCompany]       = useState(null);
  const [members, setMembers]       = useState([]);
  const [ownerEmail, setOwnerEmail] = useState('');
  const [loading, setLoading]       = useState(true);
  const [modal, setModal]           = useState(false);
  const [newEmail, setNewEmail]     = useState('');
  const [saving, setSaving]         = useState(false);

  useFocusEffect(useCallback(() => { load(); }, []));

  const load = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigation.goBack(); return; }
      setOwnerEmail(user.email);

      const activeId = await AsyncStorage.getItem(ACTIVE_CO_KEY);
      if (!activeId) { navigation.goBack(); return; }

      const { data: co } = await supabase.from('companies').select('*').eq('id', activeId).maybeSingle();
      if (!co) { navigation.goBack(); return; }
      setCompany(co);

      const { data: mList } = await supabase
        .from('company_members')
        .select('*')
        .eq('company_id', activeId)
        .order('invited_at');
      setMembers(mList || []);
    } catch {}
    setLoading(false);
  };

  const handleAdd = async () => {
    const email = newEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) { Alert.alert('Hata', 'Geçerli bir email adresi girin.'); return; }
    if (email === ownerEmail) { Alert.alert('Hata', 'Patron emaili eklenemez.'); return; }
    if (members.find(m => m.email === email)) { Alert.alert('Hata', 'Bu email zaten ekli.'); return; }

    const max = maxUye(company);
    if (members.length >= max) {
      const tLabel = company.type === 'teknik_servis' ? 'Servis' : company.type === 'emlak' ? 'Emlak' : 'Galeri';
      Alert.alert('Limit', `${tLabel} Takım planında en fazla ${max} yetkili eklenebilir.`);
      return;
    }

    setSaving(true);
    const { error } = await supabase.from('company_members').insert({
      company_id: company.id,
      email,
      role: 'member',
      invited_by: (await supabase.auth.getUser()).data.user?.id,
      accepted_at: new Date().toISOString(),
    });
    setSaving(false);

    if (error) { Alert.alert('Hata', error.message); return; }
    setNewEmail('');
    setModal(false);
    load();
  };

  const handleRemove = (member) => {
    Alert.alert(
      'Üyeyi Çıkar',
      `${member.email} kişisi takımdan çıkarılsın mı?`,
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Çıkar', style: 'destructive', onPress: async () => {
          await supabase.from('company_members').delete().eq('id', member.id);
          load();
        }},
      ]
    );
  };

  const max = maxUye(company);
  const typeLabel = company?.type === 'teknik_servis' ? 'Servis' : company?.type === 'emlak' ? 'Emlak' : 'Galeri';
  const maxYetkili = company?.type === 'teknik_servis' ? '2' : '3';

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <LinearGradient colors={[NAVY, NAVY2]} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Takım Üyeleri</Text>
          <Text style={styles.headerSub}>{company?.name || '...'}</Text>
        </View>
        {company?.plan === 'takim' && (
          <View style={styles.slotBadge}>
            <Text style={styles.slotBadgeTxt}>{members.length} / {max}</Text>
          </View>
        )}
      </LinearGradient>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={GOLD} size="large" />
        </View>
      ) : (company?.plan !== 'takim' && premiumTier !== 'takim') ? (
        <View style={styles.noPlan}>
          <View style={[styles.lockCircle, { backgroundColor: isDark ? 'rgba(201,168,76,0.12)' : 'rgba(15,23,42,0.07)' }]}>
            <Icon name="lock-outline" size={40} color={GOLD} />
          </View>
          <Text style={[styles.noPlanTitle, { color: theme.text }]}>Takım Planı Gerekli</Text>
          <Text style={[styles.noPlanSub, { color: theme.textSecondary }]}>
            {typeLabel} Takım planına geçerek {maxYetkili} yetkili ekleyebilirsiniz.
          </Text>
          <TouchableOpacity style={styles.upgradeBtn} onPress={() => navigation.navigate('Plan')}>
            <Text style={styles.upgradeBtnTxt}>Planı Yükselt →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={styles.list}>

            {/* Patron */}
            <View style={[styles.memberCard, { backgroundColor: theme.surface, borderColor: GOLD + '44' }]}>
              <View style={[styles.avatarBox, { backgroundColor: isDark ? 'rgba(201,168,76,0.12)' : 'rgba(15,23,42,0.07)' }]}>
                <Icon name="crown" size={22} color={GOLD} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.memberEmail, { color: theme.text }]} numberOfLines={1}>{ownerEmail}</Text>
                <Text style={[styles.memberRole, { color: GOLD }]}>Patron</Text>
              </View>
            </View>

            {/* Üyeler */}
            {members.map(m => (
              <View key={m.id} style={[styles.memberCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={[styles.avatarBox, { backgroundColor: m.accepted_at ? '#059669' + '18' : '#F59E0B' + '18' }]}>
                  <Icon
                    name={m.accepted_at ? 'check-circle-outline' : 'clock-outline'}
                    size={22}
                    color={m.accepted_at ? '#059669' : '#F59E0B'}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.memberEmail, { color: theme.text }]} numberOfLines={1}>{m.email}</Text>
                  <Text style={[styles.memberRole, { color: m.accepted_at ? '#059669' : '#F59E0B' }]}>
                    {m.accepted_at ? 'Yetkili · Aktif' : 'Davet Bekliyor'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.removeBtn, { borderColor: '#EF4444' + '40' }]}
                  onPress={() => handleRemove(m)}
                >
                  <Text style={{ color: '#EF4444', fontSize: 12, fontWeight: '700' }}>Çıkar</Text>
                </TouchableOpacity>
              </View>
            ))}

            {/* Boş slotlar */}
            {Array.from({ length: Math.max(0, max - members.length) }).map((_, i) => (
              <View key={`empty-${i}`} style={[styles.emptySlot, { borderColor: theme.border, backgroundColor: theme.surface }]}>
                <Icon name="account-plus-outline" size={18} color={theme.textSecondary} style={{ marginRight: 8 }} />
                <Text style={[styles.emptySlotTxt, { color: theme.textSecondary }]}>Boş Slot — Yetkili eklenebilir</Text>
              </View>
            ))}

            {/* Ekle butonu */}
            {members.length < max && (
              <TouchableOpacity
                style={[styles.addBtn, { borderColor: GOLD + '60', backgroundColor: GOLD + '0A' }]}
                onPress={() => { setNewEmail(''); setModal(true); }}
                activeOpacity={0.8}
              >
                <Icon name="plus-circle-outline" size={22} color={GOLD} />
                <Text style={[styles.addBtnTxt, { color: GOLD }]}>Yetkili Ekle</Text>
              </TouchableOpacity>
            )}

            <View style={[styles.infoBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Icon name="information-outline" size={16} color={theme.textSecondary} style={{ marginTop: 1 }} />
              <Text style={[styles.infoTxt, { color: theme.textSecondary }]}>
                Eklenen kişi uygulamaya aynı email ile kayıt olursa otomatik olarak bu işletmeye erişim kazanır. Uygulama üzerinden davet bildirimi gönderilmez — email'i kendiniz iletin.
              </Text>
            </View>

          </View>
          <View style={{ height: 60 }} />
        </ScrollView>
      )}

      {/* Üye Ekle Modal */}
      <Modal visible={modal} transparent animationType="slide" onRequestClose={() => setModal(false)}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={[styles.modalSheet, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Yetkili Ekle</Text>
            <Text style={[styles.modalSub, { color: theme.textSecondary }]}>
              Kişinin uygulamaya kayıtlı email adresini girin.
            </Text>
            <TextInput
              style={[styles.modalInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface2 }]}
              value={newEmail}
              onChangeText={setNewEmail}
              placeholder="ornek@mail.com"
              placeholderTextColor={theme.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
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
  slotBadge: { backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
  slotBadgeTxt: { color: '#fff', fontSize: 13, fontWeight: '800' },

  noPlan: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  lockCircle: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  noPlanTitle: { fontSize: 18, fontWeight: '800', textAlign: 'center' },
  noPlanSub: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
  upgradeBtn: { marginTop: 8, backgroundColor: GOLD, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 28 },
  upgradeBtnTxt: { color: '#fff', fontSize: 14, fontWeight: '700' },

  list: { padding: 16, gap: 10 },
  memberCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, borderWidth: 1, padding: 14 },
  avatarBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  memberEmail: { fontSize: 14, fontWeight: '600', letterSpacing: -0.2 },
  memberRole: { fontSize: 11, fontWeight: '700', marginTop: 2 },
  removeBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },

  emptySlot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 14, borderWidth: 1, borderStyle: 'dashed', padding: 14 },
  emptySlotTxt: { fontSize: 13 },

  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 14, borderWidth: 1.5, borderStyle: 'dashed', padding: 16 },
  addBtnTxt: { fontSize: 14, fontWeight: '700' },

  infoBox: { borderRadius: 14, borderWidth: 1, padding: 14, marginTop: 4, flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  infoTxt: { fontSize: 12, lineHeight: 20, flex: 1 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, gap: 8 },
  modalTitle: { fontSize: 17, fontWeight: '800' },
  modalSub: { fontSize: 13, lineHeight: 20, marginBottom: 8 },
  modalInput: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15 },
  modalBtns: { flexDirection: 'row', gap: 10, marginTop: 16 },
  cancelBtn: { flex: 1, borderWidth: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  confirmBtn: { flex: 2, backgroundColor: GOLD, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
});
