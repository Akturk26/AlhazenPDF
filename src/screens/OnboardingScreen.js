import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Platform, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from '../components/Icon';

export const ONBOARDING_KEY = '@alhazen_onboarding_completed';

const SLIDES = [
  {
    key: '1',
    bg: ['#060A18', '#0E1535', '#152660'],
    accent: '#C9A84C',
    title: 'AlhazenPDF\'e\nHoş Geldiniz',
    sub: 'Araç galerisi, emlak, servis ve teklif/fatura için profesyonel çıktılar — saniyeler içinde.',
    pills: ['Araç', 'Emlak', 'Servis', 'Teklif'],
    pillIcons: ['car-outline', 'home-city-outline', 'tools', 'file-document-outline'],
    iconType: 'logo',
  },
  {
    key: '2',
    bg: ['#050E09', '#0A1A0D', '#0D2412'],
    accent: '#3DBA7C',
    title: 'PDF & İlan\nÇıktıları',
    sub: 'Cam sticker, ilan kartı, vitrin afişi. Firma bilginizi bir kez kaydedin, her ilana otomatik gelsin.',
    pills: ['Cam Sticker', 'İlan Kartı', 'Vitrin'],
    pillIcons: ['sticker-outline', 'card-outline', 'television'],
    iconType: 'icon',
    iconName: 'file-pdf-box',
  },
  {
    key: '3',
    bg: ['#0E0900', '#1C1200', '#2A1B00'],
    accent: '#C9A84C',
    title: '20+ Premium\nSatış Kartı',
    sub: 'Dikey, kare ve A4 formatlarında. WhatsApp, Story ve Instagram\'a tek dokunuşla paylaş.',
    pills: ['Dikey', 'Kare', 'A4', 'Temalar'],
    pillIcons: ['cellphone', 'crop-square', 'file-document-outline', 'palette-outline'],
    iconType: 'icon',
    iconName: 'palette-outline',
  },
  {
    key: '4',
    bg: ['#080C06', '#0F1A09', '#14220C'],
    accent: '#FF8C1E',
    title: 'Dijital Servis\nKaydı & QR',
    sub: 'Yapılan işlemler, parça değişimi, KM takibi. QR kod ile müşterinize bakım geçmişini gösterin.',
    pills: ['Servis', 'QR Kod', 'KM Takip'],
    pillIcons: ['tools', 'qrcode', 'gauge'],
    iconType: 'icon',
    iconName: 'tools',
  },
];

export default function OnboardingScreen({ onDone }) {
  const [current, setCurrent] = useState(0);
  const insets = useSafeAreaInsets();

  if (Platform.OS === 'web') {
    AsyncStorage.setItem(ONBOARDING_KEY, 'true').catch(() => {});
    onDone();
    return null;
  }

  const slide = SLIDES[current];
  const isLast = current === SLIDES.length - 1;

  const handleDone = async () => {
    try { await AsyncStorage.setItem(ONBOARDING_KEY, 'true'); } catch {}
    onDone();
  };

  const handleNext = () => {
    if (current < SLIDES.length - 1) setCurrent(current + 1);
  };

  return (
    <LinearGradient colors={slide.bg} style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <View style={[s.topLine, { backgroundColor: slide.accent }]} />

      <View style={s.visual}>
        <View style={[s.iconCircle, { borderColor: slide.accent + '40', backgroundColor: slide.accent + '15' }]}>
          <View style={[s.iconInner, { backgroundColor: slide.accent + '25', borderColor: slide.accent + '60' }]}>
            {slide.iconType === 'logo' ? (
              <View style={s.logoWrap}>
                <Text style={[s.logoA, { color: '#fff' }]}>A</Text>
                <View style={[s.logoBar, { backgroundColor: '#D4AF37' }]} />
                <View style={[s.logoBadge, { backgroundColor: '#E04020' }]}>
                  <Text style={s.logoBadgeTxt}>PDF</Text>
                </View>
              </View>
            ) : (
              <Icon name={slide.iconName} size={64} color={slide.accent} />
            )}
          </View>
        </View>

        <View style={s.pillsRow}>
          {slide.pills.map((p, i) => (
            <View key={p} style={[s.pill, { borderColor: slide.accent + '55', backgroundColor: slide.accent + '18' }]}>
              <Icon name={slide.pillIcons[i]} size={13} color={slide.accent} />
              <Text style={[s.pillTxt, { color: slide.accent }]}>{p}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={s.textArea}>
        <View style={[s.accentBar, { backgroundColor: slide.accent }]} />
        <Text style={s.title}>{slide.title}</Text>
        <Text style={s.sub}>{slide.sub}</Text>
      </View>

      <View style={[s.controls, { paddingBottom: Math.max(insets.bottom, 16) + 16 }]}>
        <View style={s.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[s.dot, {
                backgroundColor: i === current ? slide.accent : 'rgba(255,255,255,0.22)',
                width: i === current ? 28 : 6,
              }]}
            />
          ))}
        </View>

        <View style={s.btnRow}>
          {!isLast ? (
            <>
              <TouchableOpacity onPress={handleDone} style={s.skipBtn} activeOpacity={0.7}>
                <Text style={s.skipTxt}>Geç</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleNext}
                style={[s.nextBtn, { backgroundColor: slide.accent }]}
                activeOpacity={0.85}
              >
                <Text style={s.nextTxt}>İleri →</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              onPress={handleDone}
              style={[s.nextBtn, { flex: 1, backgroundColor: slide.accent }]}
              activeOpacity={0.85}
            >
              <Text style={s.nextTxt}>Hadi Başlayalım</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  topLine: { height: 3, opacity: 0.8 },

  visual: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 24, gap: 32,
  },

  iconCircle: {
    width: 200, height: 200, borderRadius: 100,
    borderWidth: 1.5, alignItems: 'center', justifyContent: 'center',
  },
  iconInner: {
    width: 140, height: 140, borderRadius: 70,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },

  logoWrap: { alignItems: 'center', gap: 4 },
  logoA: { fontSize: 72, fontWeight: '900', letterSpacing: -3 },
  logoBar: { width: 64, height: 2.5, borderRadius: 2 },
  logoBadge: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 8, marginTop: 2 },
  logoBadgeTxt: { color: '#fff', fontSize: 13, fontWeight: '900', letterSpacing: 2.5 },

  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1,
  },
  pillTxt: { fontSize: 13, fontWeight: '700' },

  textArea: { paddingHorizontal: 30, paddingBottom: 16, gap: 10 },
  accentBar: { width: 32, height: 3, borderRadius: 2 },
  title: { fontSize: 30, fontWeight: '800', color: '#fff', letterSpacing: -0.7, lineHeight: 36 },
  sub: { fontSize: 14, color: 'rgba(255,255,255,0.68)', lineHeight: 21 },

  controls: { paddingHorizontal: 24, gap: 18 },
  dots: { flexDirection: 'row', gap: 6, justifyContent: 'center' },
  dot: { height: 6, borderRadius: 3 },
  btnRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  skipBtn: { paddingVertical: 14, paddingHorizontal: 16 },
  skipTxt: { color: 'rgba(255,255,255,0.4)', fontSize: 15, fontWeight: '600' },
  nextBtn: { flex: 1, borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  nextTxt: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.2 },
});
