import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Alert, ActivityIndicator, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../components/Icon';
import { usePremium } from '../context/PremiumContext';
import * as Sharing from 'expo-sharing';

const GOLD = '#C9A84C';
import { shareToWhatsApp } from '../utils/whatsappShare';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import { generatePDF } from '../pdf/generatePDF';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../themes/colors';
import { trackPDFGeneration } from '../utils/analytics';
import { savePDFPermanently } from '../utils/pdfStorage';

const THEME_MAP = {
  'Modern': 'modern', 'Premium Altın': 'darkGold', 'Premium Yeşil': 'green',
  'Premium Vintage': 'vintage', 'Premium Beyaz': 'white', 'Bordo Altın': 'burgundy',
  'Lacivert Gümüş': 'navySilver', 'Bakır': 'copper', 'Gri Turuncu': 'grayOrange',
};

export default function PreviewScreen({ route, navigation }) {
  const { category, images, formData, template, logo, companyName } = route.params;
  const { gate } = usePremium();
  const [status, setStatus]       = useState('generating'); // 'generating' | 'ready' | 'error'
  const [pdfUri, setPdfUri]       = useState(null);
  const [fileSize, setFileSize]   = useState(null);
  const [progress, setProgress]   = useState(0);
  const progressAnim              = useRef(new Animated.Value(0)).current;
  const readyAnim                 = useRef(new Animated.Value(0)).current;
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  const insets = useSafeAreaInsets();

  const filledFields = Object.entries(formData).filter(
    ([, v]) => v && !Array.isArray(v) && typeof v !== 'object' && String(v).trim()
  );
  const arrayFields = Object.entries(formData).filter(
    ([, v]) => Array.isArray(v) && v.length > 0
  );
  const pageCount = images.length > 3 ? Math.ceil(images.length / 4) + 1 : 1;

  // Ekran açılır açılmaz PDF üretimi başlasın
  useEffect(() => {
    gate().then(allowed => {
      if (allowed) generatePDFInBackground();
      else navigation.goBack();
    });
    return () => { setPdfUri(null); };
  }, []);

  const animateProgress = (toValue, duration = 400) => {
    Animated.timing(progressAnim, {
      toValue, duration, useNativeDriver: false,
    }).start();
    setProgress(toValue);
  };

  const generatePDFInBackground = async () => {
    try {
      setStatus('generating');
      animateProgress(0.15);

      // Logo base64
      let logoBase64 = '';
      if (logo) {
        try {
          logoBase64 = logo.base64
            ? `data:image/png;base64,${logo.base64}`
            : `data:image/png;base64,${await FileSystem.readAsStringAsync(logo.uri || logo, { encoding: 'base64' })}`;
        } catch {}
      }
      animateProgress(0.25);

      // Fotoğrafları base64'e çevir
      const totalPhotos = images.length;
      const base64Images = await Promise.all(images.map(async (img, idx) => {
        const result = await imageToBase64(img);
        animateProgress(0.25 + ((idx + 1) / totalPhotos) * 0.5);
        return result;
      }));
      const photos = base64Images.filter(img => img?.base64);
      animateProgress(0.8);

      // Başlık
      let pdfTitle = category.name;
      if (category.id === 'auto' && formData.Marka && formData.Model) {
        pdfTitle = `${formData.Marka} ${formData.Model}`;
      } else if (category.id === 'real-estate') {
        const oda = formData['Oda Sayısı'] || '';
        const tip = formData['Emlak Türü'] || formData['İlan Türü'] || 'Emlak';
        pdfTitle = oda ? `${oda} ${tip}` : tip;
      } else if (formData.Başlık) {
        pdfTitle = formData.Başlık;
      } else if (formData['Ad Soyad']) {
        pdfTitle = formData['Ad Soyad'];
      }

      // PDF üret
      const tempUri = await generatePDF(
        { title: pdfTitle, category, formData, logo: logoBase64, companyName, photos },
        THEME_MAP[template.name] || 'modern'
      );
      animateProgress(0.9);

      // Kalıcı klasöre kopyala
      const permanentUri = await savePDFPermanently(tempUri, pdfTitle);
      const finalUri = permanentUri || tempUri;

      // Dosya boyutu
      try {
        const info = await FileSystem.getInfoAsync(finalUri);
        if (info.exists) {
          const kb = Math.round(info.size / 1024);
          setFileSize(kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`);
        }
      } catch {}

      await trackPDFGeneration(category, template.name, photos.length, pdfTitle, finalUri);
      animateProgress(1.0);

      setPdfUri(finalUri);
      setStatus('ready');

      // "Hazır" animasyonu
      Animated.spring(readyAnim, {
        toValue: 1, useNativeDriver: true, tension: 80, friction: 7,
      }).start();

    } catch {
      setStatus('error');
    }
  };

  const imageToBase64 = async (imageData) => {
    try {
      const uri = imageData.uri || imageData;
      const originalWidth  = imageData.width  || 1200;
      const originalHeight = imageData.height || 1600;
      const isPortrait     = imageData.isPortrait !== undefined
        ? imageData.isPortrait : originalHeight > originalWidth;

      const totalPhotos = images.length;
      const targetWidth = totalPhotos > 10 ? 800 : totalPhotos > 6 ? 1000 : totalPhotos > 3 ? 1200 : 1500;
      const quality     = totalPhotos > 10 ? 0.65 : totalPhotos > 6 ? 0.72 : totalPhotos > 3 ? 0.80 : 0.88;
      const resizeWidth = Math.min(originalWidth, targetWidth);
      const needsResize = resizeWidth < originalWidth * 0.95;

      const compressed = await ImageManipulator.manipulateAsync(
        uri,
        needsResize ? [{ resize: { width: resizeWidth } }] : [],
        { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
      );
      const base64 = await FileSystem.readAsStringAsync(compressed.uri, { encoding: 'base64' });
      return {
        base64: `data:image/jpeg;base64,${base64}`,
        width: originalWidth, height: originalHeight, isPortrait,
        objectPosition: imageData.objectPosition || null,
      };
    } catch {
      return null;
    }
  };

  const handleShare = async () => {
    if (!pdfUri) return;
    try {
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(pdfUri, { mimeType: 'application/pdf', dialogTitle: 'PDF Paylaş' });
      }
    } catch {
      Alert.alert('Hata', 'PDF paylaşılırken bir hata oluştu.');
    }
  };

  const handlePreview = async () => {
    if (!pdfUri) return;
    try {
      await Sharing.openAsync(pdfUri);
    } catch {
      Alert.alert('Hata', 'PDF açılamadı.');
    }
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1], outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <LinearGradient
          colors={[template.color, template.color + 'BB']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + 14 }]}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBackBtn}>
              <Icon name="arrow-left" size={18} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerIcon}>
              <Icon name="file-document-outline" size={22} color="#fff" />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>{template.name} Teması</Text>
              <Text style={styles.headerSub}>{category.name}</Text>
            </View>
            {status === 'ready' && (
              <Animated.View style={[styles.readyBadge, { transform: [{ scale: readyAnim }] }]}>
                <Icon name="check" size={11} color="#fff" />
                <Text style={styles.readyText}>Hazır</Text>
              </Animated.View>
            )}
          </View>

          {/* İstatistik */}
          <View style={styles.statsStrip}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{images.length}</Text>
              <Text style={styles.statLabel}>Fotoğraf</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{filledFields.length + arrayFields.length}</Text>
              <Text style={styles.statLabel}>Alan</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>~{pageCount}</Text>
              <Text style={styles.statLabel}>Sayfa</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{fileSize || '—'}</Text>
              <Text style={styles.statLabel}>Boyut</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>

          {/* Durum kartı */}
          {status === 'generating' && (
            <View style={[styles.statusCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <ActivityIndicator color={template.color} size="large" />
              <Text style={[styles.statusTitle, { color: theme.text }]}>PDF Oluşturuluyor...</Text>
              <Text style={[styles.statusSub, { color: theme.textSecondary }]}>
                {images.length} fotoğraf işleniyor
              </Text>
              {/* Progress bar */}
              <View style={[styles.progressBg, { backgroundColor: theme.surface2 }]}>
                <Animated.View style={[styles.progressFill, { width: progressWidth, backgroundColor: template.color }]} />
              </View>
              <Text style={[styles.progressPct, { color: theme.textSecondary }]}>
                {Math.round(progress * 100)}%
              </Text>
            </View>
          )}

          {status === 'ready' && (
            <Animated.View style={{ opacity: readyAnim, transform: [{ translateY: readyAnim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }}>
              <View style={[styles.readyCard, { backgroundColor: template.color + '14', borderColor: template.color + '40' }]}>
                <View style={[styles.readyIconWrap, { backgroundColor: template.color }]}>
                  <Icon name="check" size={22} color="#fff" />
                </View>
                <View style={styles.readyInfo}>
                  <Text style={[styles.readyCardTitle, { color: theme.text }]}>PDF Hazır!</Text>
                  <Text style={[styles.readyCardSub, { color: theme.textSecondary }]}>
                    {fileSize && `${fileSize} · `}{pageCount} sayfa · {images.length} fotoğraf
                  </Text>
                </View>
              </View>
            </Animated.View>
          )}

          {status === 'error' && (
            <View style={[styles.statusCard, { backgroundColor: '#FFF0F0', borderColor: '#FFD0D0' }]}>
              <Icon name="alert-circle-outline" size={44} color="#C00" />
              <Text style={[styles.statusTitle, { color: '#C00' }]}>PDF Oluşturulamadı</Text>
              <Text style={[styles.statusSub, { color: '#900' }]}>Fotoğrafları kontrol edip tekrar deneyin.</Text>
              <TouchableOpacity
                style={[styles.retryBtn, { backgroundColor: template.color }]}
                onPress={generatePDFInBackground}
              >
                <Text style={styles.retryText}>Tekrar Dene</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Form özeti */}
          {(filledFields.length > 0 || arrayFields.length > 0) && (
            <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.cardTitle, { color: theme.textSecondary }]}>ÖZET BİLGİLER</Text>
              {filledFields.map(([key, value]) => (
                <View key={key} style={[styles.fieldRow, { borderBottomColor: theme.border }]}>
                  <Text style={[styles.fieldKey, { color: theme.textSecondary }]}>{key}</Text>
                  <Text style={[styles.fieldVal, { color: theme.text }]} numberOfLines={2}>{value}</Text>
                </View>
              ))}
              {arrayFields.map(([key, value]) => (
                <View key={key} style={[styles.fieldRow, { borderBottomColor: theme.border }]}>
                  <Text style={[styles.fieldKey, { color: theme.textSecondary }]}>{key}</Text>
                  <Text style={[styles.fieldVal, { color: theme.text }]}>{value.length} kayıt</Text>
                </View>
              ))}
            </View>
          )}

        </View>
      </ScrollView>

      {/* Alt butonlar */}
      <View style={[styles.bottom, { backgroundColor: theme.bg, borderTopColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.btnSecondary, { backgroundColor: theme.surface2, borderColor: theme.border, opacity: status === 'ready' ? 1 : 0.4 }]}
          onPress={handlePreview}
          disabled={status !== 'ready'}
          activeOpacity={0.8}
        >
          <Icon name="eye-outline" size={18} color={GOLD} />
          <Text style={[styles.btnSecText, { color: GOLD }]}>Aç</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnPrimary, { opacity: status === 'ready' ? 1 : 0.5 }]}
          onPress={handleShare}
          disabled={status !== 'ready'}
          activeOpacity={0.88}
        >
          <LinearGradient
            colors={status === 'ready' ? theme.ctaGradient : ['#999', '#777']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.btnPrimaryInner}
          >
            {status === 'generating'
              ? <><ActivityIndicator color="#fff" size="small" /><Text style={styles.btnPriText}>Hazırlanıyor...</Text></>
              : <><Icon name="share-variant" size={18} color="#fff" /><Text style={styles.btnPriText}>PDF Paylaş</Text></>
            }
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnWhatsApp, { opacity: status === 'ready' ? 1 : 0.4 }]}
          onPress={() => shareToWhatsApp(pdfUri)}
          disabled={status !== 'ready'}
          activeOpacity={0.85}
        >
          <Text style={styles.btnWhatsAppTxt}>WA</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.secondaryRow, { backgroundColor: theme.bg, paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={[styles.secondaryBtn, { backgroundColor: theme.surface2, borderColor: theme.border }]}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.8}
        >
          <Icon name="home-outline" size={16} color={theme.textSecondary} />
          <Text style={[styles.secondaryBtnTxt, { color: theme.textSecondary }]}>Ana Sayfa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.secondaryBtn, { backgroundColor: theme.surface2, borderColor: theme.border }]}
          onPress={() => navigation.navigate('Category', { mode: 'pdf' })}
          activeOpacity={0.8}
        >
          <Icon name="plus-circle-outline" size={16} color={GOLD} />
          <Text style={[styles.secondaryBtnTxt, { color: GOLD }]}>Yeni PDF</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },

  header: { paddingBottom: 20, paddingHorizontal: 16, gap: 16 },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerBackBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  headerIcon: {
    width: 38, height: 38, borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 15, fontWeight: '800', color: '#fff', letterSpacing: -0.3 },
  headerSub: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  readyBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
  },
  readyText: { fontSize: 11, fontWeight: '700', color: '#fff' },

  statsStrip: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12, padding: 12,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 3 },
  statNum: { fontSize: 13, fontWeight: '800', color: '#fff' },
  statLabel: { fontSize: 9, color: 'rgba(255,255,255,0.65)', fontWeight: '500' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 2 },

  content: { padding: 16, gap: 12, paddingBottom: 24 },

  // Status card
  statusCard: {
    borderRadius: 16, borderWidth: 1,
    padding: 28, alignItems: 'center', gap: 10,
  },
  statusTitle: { fontSize: 16, fontWeight: '700', marginTop: 4 },
  statusSub: { fontSize: 13, textAlign: 'center' },
  progressBg: {
    width: '100%', height: 6, borderRadius: 3,
    overflow: 'hidden', marginTop: 8,
  },
  progressFill: { height: '100%', borderRadius: 3 },
  progressPct: { fontSize: 11, fontWeight: '600' },

  // Ready card
  readyCard: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 16, borderWidth: 1,
    padding: 16, gap: 14,
  },
  readyIconWrap: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  readyInfo: { flex: 1 },
  readyCardTitle: { fontSize: 16, fontWeight: '700' },
  readyCardSub: { fontSize: 12, marginTop: 2 },

  // Error
  retryBtn: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10, marginTop: 6 },
  retryText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  // Summary card
  card: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  cardTitle: { fontSize: 10, fontWeight: '700', letterSpacing: 1, padding: 14, paddingBottom: 6 },
  fieldRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 14, paddingVertical: 10,
    borderBottomWidth: 1, gap: 16,
  },
  fieldKey: { fontSize: 12, fontWeight: '600', flexShrink: 0, maxWidth: '40%' },
  fieldVal: { fontSize: 13, flex: 1, textAlign: 'right' },

  // Bottom
  bottom: {
    flexDirection: 'row', gap: 10,
    padding: 16, paddingBottom: 12, borderTopWidth: 1,
  },
  btnSecondary: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 18, paddingVertical: 14,
    borderRadius: 14, borderWidth: 1,
  },
  btnSecText: { fontSize: 14, fontWeight: '600' },
  btnPrimary: { flex: 1, borderRadius: 14, overflow: 'hidden' },
  btnPrimaryInner: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8, padding: 14,
  },
  btnPriText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  btnWhatsApp: {
    width: 50, height: 50, borderRadius: 14,
    backgroundColor: '#25D366',
    alignItems: 'center', justifyContent: 'center',
  },
  btnWhatsAppTxt: { fontSize: 11, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },

  secondaryRow: {
    flexDirection: 'row', gap: 10,
    paddingHorizontal: 16, paddingTop: 0, paddingBottom: 24,
  },
  secondaryBtn: {
    flex: 1, borderRadius: 12, borderWidth: 1,
    paddingVertical: 12, alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: 6,
  },
  secondaryBtnTxt: { fontSize: 13, fontWeight: '600' },
});
