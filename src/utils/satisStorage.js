import AsyncStorage from '@react-native-async-storage/async-storage';
import supabase from './supabaseClient';
import { ACTIVE_CO_KEY } from '../screens/CompanySelectScreen';

async function getCompanyId() {
  return await AsyncStorage.getItem(ACTIVE_CO_KEY);
}

function _today() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
}

export async function getAraclar() {
  try {
    const company_id = await getCompanyId();
    if (!company_id) return [];
    const { data } = await supabase
      .from('araclar')
      .select('*')
      .eq('company_id', company_id)
      .order('created_at', { ascending: false });
    return data || [];
  } catch { return []; }
}

export async function saveArac(arac) {
  try {
    const company_id = await getCompanyId();
    if (!company_id) return;
    const { id, timestamp, ...fields } = arac;
    if (id) {
      await supabase.from('araclar').update({
        ...fields,
        updated_at: new Date().toISOString(),
      }).eq('id', id).eq('company_id', company_id);
    } else {
      await supabase.from('araclar').insert({
        company_id,
        ...fields,
        alis_tarihi: fields.alis_tarihi || _today(),
      });
    }
  } catch {}
}

export async function deleteArac(id) {
  try {
    const company_id = await getCompanyId();
    if (!company_id) return;
    await supabase.from('araclar').delete().eq('id', id).eq('company_id', company_id);
  } catch {}
}

export async function satisYap(id, satis_fiyat, satis_tarihi) {
  try {
    const company_id = await getCompanyId();
    if (!company_id) return;
    await supabase.from('araclar').update({
      satis_fiyat,
      satis_tarihi: satis_tarihi || _today(),
      updated_at: new Date().toISOString(),
    }).eq('id', id).eq('company_id', company_id);
  } catch {}
}
