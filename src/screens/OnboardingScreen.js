import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../themes/colors';

const ONBOARDING_KEY = '@alhazen_onboarding_completed';

const slides = [
  {
    key: '1',
    title: 'AlhazenPDF 💎',
    text: 'Profesyonel PDF\'lerinizi saniyeler içinde oluşturun. Emlak, araç galerisi, sosyal medya — hepsi bir arada.',
    emoji: '✨',
    gradient: ['#060A18', '#172048', '#4F6EF7'],
    showLogo: true,
  },
  {
    key: '2',
    title: 'Emlak & Araç Formatları 🏠',
    text: 'Cam sticker, ilan kartı, vitrin afişi ve sosyal medya görseli — her format için özel tasarım. Şirket profilinizi bir kez kaydedin, her ilana otomatik gelsin.',
    emoji: '🏠',
    gradient: ['#0D2614', '#3DBA7C', '#C9A84C'],
  },
  {
    key: '3',
    title: '9 Premium Tema 🎨',
    text: 'Siyah Altın, Lacivert Gümüş, Bordo Altın, Bakır ve daha fazlası — 9 özenle hazırlanmış tasarım. 25 fotoğrafa kadar çok sayfalı galeri.',
    emoji: '💎',
    gradient: ['#111111', '#C9A84C', '#7A1520'],
  },
  {
    key: '4',
    title: 'Anında Paylaşım 🚀',
    text: 'PDF\'iniz hazır olunca doğrudan paylaşın. WhatsApp, e-posta, Google Drive — istediğiniz her yere gönderin.',
    emoji: '📄',
    gradient: ['#1A3A6A', '#4F6EF7', '#060A18'],
  },
];

export default function OnboardingScreen({ onDone }) {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  // Web'de onboarding'i otomatik atla
  React.useEffect(() => {
    if (Platform.OS === 'web') {
      handleDone();
    }
  }, []);

  const handleDone = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      onDone();
    } catch (error) {
      console.error('Onboarding storage error:', error);
      onDone();
    }
  };

  // Web'de boş ekran göster (otomatik atlıyor)
  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1, backgroundColor: '#060A18', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 18 }}>Yükleniyor...</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => {
    return (
      <LinearGradient
        colors={item.gradient}
        style={styles.slide}
      >
        <View style={styles.slideContent}>
          {item.showLogo ? (
            <View style={styles.logoContainer}>
              <View style={styles.ultimateLogo}>
                <View style={styles.hexContainer}>
                  <View style={[styles.hexRing, styles.hexOuter]} />
                  <View style={[styles.hexRing, styles.hexMiddle]} />
                  <View style={[styles.hexRing, styles.hexInner]} />
                </View>
                <View style={styles.eye}>
                  <View style={styles.eyeBorder} />
                  <View style={styles.eyeIris}>
                    <View style={styles.eyePupil}>
                      <View style={styles.eyeShine} />
                    </View>
                  </View>
                </View>
                <Text style={styles.bigA}>A</Text>
                <View style={styles.aLine} />
                <View style={styles.pdfBadge}>
                  <Text style={styles.pdfText}>PDF</Text>
                </View>
                <View style={[styles.glowDot, { top: 10, left: '50%' }]} />
                <View style={[styles.glowDot, { bottom: 15, right: 20 }]} />
                <View style={[styles.glowDot, { top: 60, right: 15 }]} />
              </View>
              <Text style={styles.logoTagline}>Premium PDF Generator</Text>
            </View>
          ) : (
            <Text style={styles.slideEmoji}>{item.emoji}</Text>
          )}
          <Text style={styles.slideTitle}>{item.title}</Text>
          <Text style={styles.slideText}>{item.text}</Text>
        </View>
      </LinearGradient>
    );
  };

  const renderNextButton = () => {
    return (
      <View style={[styles.button, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
        <Text style={styles.buttonText}>İleri →</Text>
      </View>
    );
  };

  const renderDoneButton = () => {
    return (
      <View style={[styles.button, { backgroundColor: 'rgba(255,255,255,0.4)' }]}>
        <Text style={styles.buttonText}>Başla 🚀</Text>
      </View>
    );
  };

  const renderSkipButton = () => {
    return (
      <View style={[styles.skipButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
        <Text style={styles.skipText}>Geç</Text>
      </View>
    );
  };

  return (
    <AppIntroSlider
      data={slides}
      renderItem={renderItem}
      onDone={handleDone}
      onSkip={handleDone}
      showSkipButton
      renderNextButton={renderNextButton}
      renderDoneButton={renderDoneButton}
      renderSkipButton={renderSkipButton}
      dotStyle={styles.dot}
      activeDotStyle={styles.activeDot}
    />
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  slideContent: {
    alignItems: 'center',
    maxWidth: 340,
  },
  slideEmoji: {
    fontSize: 80,
    marginBottom: 40,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  slideText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginRight: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginLeft: 16,
  },
  skipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  dot: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 24,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  ultimateLogo: {
    width: 180,
    height: 180,
    borderRadius: 40,
    backgroundColor: '#060A18',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#4F6EF7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  hexContainer: {
    position: 'absolute',
    width: 140,
    height: 140,
    top: 20,
    left: 20,
  },
  hexRing: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: '#C9A84C',
  },
  hexOuter: {
    width: 140,
    height: 140,
    transform: [{ rotate: '30deg' }],
    borderRadius: 8,
    borderColor: '#F0D060',
    opacity: 0.6,
  },
  hexMiddle: {
    width: 110,
    height: 110,
    top: 15,
    left: 15,
    transform: [{ rotate: '30deg' }],
    borderRadius: 6,
    borderColor: '#3A6EF5',
    borderWidth: 2,
    opacity: 0.8,
  },
  hexInner: {
    width: 80,
    height: 80,
    top: 30,
    left: 30,
    transform: [{ rotate: '30deg' }],
    borderRadius: 4,
    borderColor: 'rgba(100,150,255,0.3)',
    borderWidth: 1,
  },
  eye: {
    position: 'absolute',
    top: 25,
    width: 46,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeBorder: {
    position: 'absolute',
    width: 46,
    height: 23,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: '#C9A84C',
    backgroundColor: 'transparent',
  },
  eyeIris: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: '#3A6EF5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F6EF7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
  eyePupil: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#04081A',
    position: 'relative',
  },
  eyeShine: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#fff',
    top: 0,
    right: 0,
  },
  bigA: {
    fontSize: 72,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -2,
    textShadowColor: 'rgba(79,110,247,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    marginTop: -10,
  },
  aLine: {
    width: 80,
    height: 2,
    backgroundColor: '#F0D060',
    borderRadius: 1,
    marginTop: -20,
    shadowColor: '#C9A84C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 3,
  },
  pdfBadge: {
    position: 'absolute',
    bottom: 18,
    backgroundColor: '#E04020',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 8,
    shadowColor: '#B02800',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 5,
  },
  pdfText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
  },
  glowDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F0D060',
    shadowColor: '#F0D060',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 5,
  },
  logoTagline: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 3,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
});

export { ONBOARDING_KEY };
