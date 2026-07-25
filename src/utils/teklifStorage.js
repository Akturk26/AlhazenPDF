import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@teklif_fatura_history_v1';

export async function saveTeklif(record) {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    list.unshift({ ...record, id: Date.now().toString(), timestamp: Date.now() });
    if (list.length > 100) list.length = 100;
    await AsyncStorage.setItem(KEY, JSON.stringify(list));
  } catch {}
}

export async function getTeklifHistory() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export async function deleteTeklif(id) {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    await AsyncStorage.setItem(KEY, JSON.stringify(list.filter(r => r.id !== id)));
  } catch {}
}
