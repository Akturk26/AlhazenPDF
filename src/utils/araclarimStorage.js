import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@araclarim_v1';

export async function getAraclar() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export async function saveArac(arac) {
  try {
    const list = await getAraclar();
    const idx = list.findIndex(a => a.id === arac.id);
    if (idx >= 0) list[idx] = arac;
    else list.unshift(arac);
    await AsyncStorage.setItem(KEY, JSON.stringify(list));
  } catch {}
}

export async function deleteArac(id) {
  try {
    const list = await getAraclar();
    await AsyncStorage.setItem(KEY, JSON.stringify(list.filter(a => a.id !== id)));
  } catch {}
}

export async function updateArac(id, updates) {
  try {
    const list = await getAraclar();
    const idx = list.findIndex(a => a.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...updates };
      await AsyncStorage.setItem(KEY, JSON.stringify(list));
      return list[idx];
    }
    return null;
  } catch { return null; }
}

// Tarih string → Date (dd.mm.yyyy)
export function parseDate(str) {
  if (!str) return null;
  const [d, m, y] = str.split('.');
  if (!d || !m || !y) return null;
  return new Date(Number(y), Number(m) - 1, Number(d));
}

// Kaç gün kaldı
export function kalanGun(tarihStr) {
  const dt = parseDate(tarihStr);
  if (!dt) return null;
  const diff = dt - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Durum rengi
export function durumRenk(kalanGunSayisi) {
  if (kalanGunSayisi === null) return '#6b7280';
  if (kalanGunSayisi < 0) return '#dc2626';
  if (kalanGunSayisi <= 30) return '#f59e0b';
  return '#16a34a';
}
