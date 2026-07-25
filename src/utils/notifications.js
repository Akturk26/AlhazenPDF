import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { getAraclar, parseDate } from './araclarimStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import supabase from './supabaseClient';

const NOTIF_KEY = '@notifs_scheduled_v1';
const ACTIVE_CO_KEY = '@alhazen_active_co_id';

// Bildirimleri ön planda da göster
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// GG.AA.YYYY string → Date
function parseTR(str) {
  if (!str) return null;
  const [d, m, y] = str.split('.');
  if (!d || !m || !y) return null;
  return new Date(Number(y), Number(m) - 1, Number(d));
}

// Belirli bir tarihe X gün öncesi için bildirim zamanla
async function scheduleIfNeeded(id, title, body, targetDate, daysBefore) {
  const triggerDate = new Date(targetDate);
  triggerDate.setDate(triggerDate.getDate() - daysBefore);
  triggerDate.setHours(9, 0, 0, 0);

  if (triggerDate <= new Date()) return; // Geçmişte, atla

  await Notifications.scheduleNotificationAsync({
    identifier: id,
    content: { title, body, sound: true },
    trigger: { date: triggerDate },
  });
}

// Tüm mevcut bildirimleri iptal et ve yeniden zamanla
export async function scheduleAllNotifications() {
  try {
    const granted = await requestNotificationPermission();
    if (!granted) return;

    // Tüm eskimiş bildirimleri temizle
    await Notifications.cancelAllScheduledNotificationsAsync();

    const promises = [];

    // ── KİŞİSEL ARAÇLAR (AsyncStorage) ──
    const kisiselAraclar = await getAraclar();
    for (const arac of kisiselAraclar) {
      const label = `${arac.marka} ${arac.model}${arac.plaka ? ` · ${arac.plaka}` : ''}`;

      // Muayene
      const sonMuayene = arac.muayeneler?.slice(-1)[0]?.sonrakiTarih || null;
      if (sonMuayene) {
        const d = parseDate(sonMuayene);
        if (d) {
          promises.push(scheduleIfNeeded(
            `muayene_30_${arac.id}`, '🔧 Muayene Yaklaşıyor',
            `${label} aracının muayenesi 30 gün içinde.`, d, 30
          ));
          promises.push(scheduleIfNeeded(
            `muayene_10_${arac.id}`, '⚠️ Muayene 10 Gün Kaldı',
            `${label} aracının muayenesi 10 gün içinde! Randevu alın.`, d, 10
          ));
          promises.push(scheduleIfNeeded(
            `muayene_3_${arac.id}`, '🚨 Muayene Son 3 Gün!',
            `${label} aracının muayenesine 3 gün kaldı, hemen randevu alın!`, d, 3
          ));
        }
      }

      // Sigorta
      const sonSigorta = arac.sigortalar?.slice(-1)[0]?.bitis || null;
      if (sonSigorta) {
        const d = parseDate(sonSigorta);
        if (d) {
          promises.push(scheduleIfNeeded(
            `sigorta_30_${arac.id}`, '🛡️ Sigorta Yaklaşıyor',
            `${label} aracının sigortası 30 gün içinde bitiyor.`, d, 30
          ));
          promises.push(scheduleIfNeeded(
            `sigorta_10_${arac.id}`, '⚠️ Sigorta 10 Gün Kaldı',
            `${label} aracının sigortası 10 gün içinde bitiyor! Yenileyin.`, d, 10
          ));
          promises.push(scheduleIfNeeded(
            `sigorta_3_${arac.id}`, '🚨 Sigorta Son 3 Gün!',
            `${label} aracının sigortasına 3 gün kaldı, hemen yenileyin!`, d, 3
          ));
        }
      }
    }

    // ── GALERİ ARAÇLARI (Supabase) — muayene tarihi ──
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const activeId = await AsyncStorage.getItem(ACTIVE_CO_KEY);
        let query = supabase
          .from('araclar')
          .select('id, marka, model, plaka, muayene_tarihi')
          .eq('owner_id', session.user.id)
          .not('muayene_tarihi', 'is', null);
        if (activeId) query = query.eq('company_id', activeId);
        const { data: galeriAraclar } = await query;

        for (const arac of (galeriAraclar || [])) {
          if (!arac.muayene_tarihi) continue;
          const label = `${arac.marka} ${arac.model}${arac.plaka ? ` · ${arac.plaka}` : ''}`;
          const d = parseTR(arac.muayene_tarihi);
          if (!d) continue;
          promises.push(scheduleIfNeeded(
            `galeri_muayene_30_${arac.id}`, '🔧 Araç Muayenesi Yaklaşıyor',
            `${label} aracının muayenesi 30 gün içinde.`, d, 30
          ));
          promises.push(scheduleIfNeeded(
            `galeri_muayene_10_${arac.id}`, '⚠️ Araç Muayenesi 10 Gün Kaldı',
            `${label} muayenesi 10 gün içinde! Randevu alın.`, d, 10
          ));
          promises.push(scheduleIfNeeded(
            `galeri_muayene_3_${arac.id}`, '🚨 Araç Muayenesi Son 3 Gün!',
            `${label} muayenesine 3 gün kaldı, hemen randevu alın!`, d, 3
          ));
        }
      }
    } catch {}

    await Promise.allSettled(promises);
    await AsyncStorage.setItem(NOTIF_KEY, String(Date.now()));
  } catch {}
}
