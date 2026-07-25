import AsyncStorage from '@react-native-async-storage/async-storage';
import supabase from './supabaseClient';
import { ACTIVE_CO_KEY } from '../screens/CompanySelectScreen';

async function getCompanyId() {
  return await AsyncStorage.getItem(ACTIVE_CO_KEY);
}

export const getAllServisKartlari = async () => {
  try {
    const company_id = await getCompanyId();
    if (!company_id) return [];
    const { data } = await supabase
      .from('servis_kartlari')
      .select('id, data')
      .eq('company_id', company_id)
      .order('created_at', { ascending: false });
    return (data || []).map(row => ({ id: row.id, ...row.data }));
  } catch { return []; }
};

export const saveServisKarti = async (karti) => {
  try {
    const company_id = await getCompanyId();
    if (!company_id) return false;
    const { id, ...data } = karti;
    await supabase.from('servis_kartlari').upsert({
      id,
      company_id,
      plaka: data.plaka?.toUpperCase().trim() || null,
      data,
    }, { onConflict: 'id' });
    return true;
  } catch { return false; }
};

export const deleteServisKarti = async (id) => {
  try {
    const company_id = await getCompanyId();
    if (!company_id) return false;
    await supabase.from('servis_kartlari').delete().eq('id', id).eq('company_id', company_id);
    return true;
  } catch { return false; }
};

export const searchByPlaka = async (plaka) => {
  try {
    const company_id = await getCompanyId();
    if (!company_id) return [];
    const q = plaka.trim().toUpperCase().replace(/\s+/g, '');
    let query = supabase.from('servis_kartlari')
      .select('id, data')
      .eq('company_id', company_id);
    if (q) query = query.ilike('plaka', `%${q}%`);
    const { data } = await query.order('created_at', { ascending: false });
    return (data || []).map(row => ({ id: row.id, ...row.data }));
  } catch { return []; }
};
