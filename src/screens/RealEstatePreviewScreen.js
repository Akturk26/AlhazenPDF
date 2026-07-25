import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Alert, ActivityIndicator, Modal, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../components/Icon';
import { usePremium } from '../context/PremiumContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Sharing from 'expo-sharing';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system/legacy';
import ViewShot from 'react-native-view-shot';
import { WebView } from 'react-native-webview';
import { generateRealEstatePDF } from '../pdf/generatePDF';
import { buildSocialDarkHTML, buildSocialGreenHTML, buildSocialStoryHTML } from '../pdf/realEstatePDF';
import {
  buildSalesArchHTML,
  buildSalesSakuraHTML,
  buildSalesDeepHTML,
  buildSalesVolcanoHTML,
  buildSalesHistHTML,
} from '../pdf/salesCards';
import {
  buildA4OrangeHTML,
  buildA4NavyHTML,
  buildA4GreenHTML,
  buildA4GalacticHTML,
  buildA4SaldaHTML,
  buildA4CrystalHTML,
  buildA4AmberHTML,
  buildA4OltuHTML,
  buildA4VolkanHTML,
  buildA4TarihiHTML,
} from '../pdf/salesCardsA4';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../themes/colors';
import { trackPDFGeneration } from '../utils/analytics';

const { width: SCREEN_W } = Dimensions.get('window');

const SIZE_LABELS = {
  'cam-sticker':  'A5 · 148×210 mm',
  'ilan-karti':   'A4 · 210×297 mm',
  'vitrin':        'A3 · 420×297 mm',
  'social-dark':  '1080×1080 · Instagram/Facebook',
  'social-green': '1080×1080 · Instagram/Facebook',
  'social-story': '1080×1920 · Story/WhatsApp',
  'sales-arch-story':    '1080×1920 · WhatsApp/Story',
  'sales-arch-post':     '1080×1080 · Instagram/Facebook',
  'sales-sakura-story':  '1080×1920 · WhatsApp/Story',
  'sales-sakura-post':   '1080×1080 · Instagram/Facebook',
  'sales-deep-story':    '1080×1920 · WhatsApp/Story',
  'sales-deep-post':     '1080×1080 · Instagram/Facebook',
  'sales-volcano-story': '1080×1920 · WhatsApp/Story',
  'sales-volcano-post':  '1080×1080 · Instagram/Facebook',
  'sales-hist-story':    '1080×1920 · WhatsApp/Story',
  'sales-hist-post':     '1080×1080 · Instagram/Facebook',
  'a4-orange':   'A4 · 595×842 · Print',
  'a4-navy':     'A4 · 595×842 · Print',
  'a4-green':    'A4 · 595×842 · Print',
  'a4-galactic': 'A4 · 595×842 · Print',
  'a4-salda':    'A4 · 595×842 · Print',
  'a4-crystal':  'A4 · 595×842 · Print',
  'a4-amber':    'A4 · 595×842 · Print',
  'a4-oltu':     'A4 · 595×842 · Print',
  'a4-volkan':   'A4 · 595×842 · Print',
  'a4-tarihi':   'A4 · 595×842 · Print',
};

const MAX_PHOTOS = {
  'cam-sticker':  1,
  'ilan-karti':   1,
  'vitrin':        20,
  'social-dark':  1,
  'social-green': 1,
  'social-story': 1,
  'sales-arch-story':    1,
  'sales-arch-post':     1,
  'sales-sakura-story':  1,
  'sales-sakura-post':   1,
  'sales-deep-story':    1,
  'sales-deep-post':     1,
  'sales-volcano-story': 1,
  'sales-volcano-post':  1,
  'sales-hist-story':    1,
  'sales-hist-post':     1,
  'a4-orange':   1,
  'a4-navy':     1,
  'a4-green':    1,
  'a4-galactic': 1,
  'a4-salda':    1,
  'a4-crystal':  1,
  'a4-amber':    1,
  'a4-oltu':     1,
  'a4-volkan':   1,
  'a4-tarihi':   1,
};

// Card HTML dimensions (CSS px)
const CARD_DIMS = {
  'social-dark':  { w: 600, h: 600 },
  'social-green': { w: 600, h: 600 },
  'social-story': { w: 338, h: 600 },
  'sales-arch-story':    { w: 405, h: 720 },
  'sales-arch-post':     { w: 540, h: 540 },
  'sales-sakura-story':  { w: 405, h: 720 },
  'sales-sakura-post':   { w: 540, h: 540 },
  'sales-deep-story':    { w: 405, h: 720 },
  'sales-deep-post':     { w: 540, h: 540 },
  'sales-volcano-story': { w: 405, h: 720 },
  'sales-volcano-post':  { w: 540, h: 540 },
  'sales-hist-story':    { w: 405, h: 720 },
  'sales-hist-post':     { w: 540, h: 540 },
  'a4-orange':   { w: 595, h: 842 },
  'a4-navy':     { w: 595, h: 842 },
  'a4-green':    { w: 595, h: 842 },
  'a4-galactic': { w: 595, h: 842 },
  'a4-salda':    { w: 595, h: 842 },
  'a4-crystal':  { w: 595, h: 842 },
  'a4-amber':    { w: 595, h: 842 },
  'a4-oltu':     { w: 595, h: 842 },
  'a4-volkan':   { w: 595, h: 842 },
  'a4-tarihi':   { w: 595, h: 842 },
};

const SOCIAL_IDS = ['social-dark', 'social-green', 'social-story'];
const SALES_IDS = [
  'sales-arch-story', 'sales-arch-post',
  'sales-sakura-story', 'sales-sakura-post',
  'sales-deep-story', 'sales-deep-post',
  'sales-volcano-story', 'sales-volcano-post',
  'sales-hist-story', 'sales-hist-post',
];
const A4_IDS = [
  'a4-orange', 'a4-navy', 'a4-green', 'a4-galactic', 'a4-salda',
  'a4-crystal', 'a4-amber', 'a4-oltu', 'a4-volkan', 'a4-tarihi',
];

export default function RealEstatePreviewScreen({ route, navigation }) {
  const { category, images, formData, logo, companyName, format, ekspertizData } = route.params;
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUri, setPdfUri] = useState(null);
  const [captureVisible, setCaptureVisible] = useState(false);
  const [captureHtml, setCaptureHtml] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const viewShotRef = useRef(null);
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  const insets = useSafeAreaInsets();
  const { gate } = usePremium();
  const GOLD = '#C9A84C';

  const isSocial = SOCIAL_IDS.includes(format.id);
  const isSales = SALES_IDS.includes(format.id);
  const isA4Card = A4_IDS.includes(format.id);
  const isImageRender = isSocial || isSales || isA4Card;

  const imageToBase64 = async (imageData) => {
    try {
      const uri = imageData.uri || imageData;
      const originalWidth  = imageData.width  || 1200;
      const originalHeight = imageData.height || 1600;
      const isPortrait = imageData.isPortrait !== undefined
        ? imageData.isPortrait : originalHeight > originalWidth;

      const compressed = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: Math.min(originalWidth, 1200) } }],
        { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG }
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

  const preparePhotos = async () => {
    const maxPhotos = MAX_PHOTOS[format.id] || images.length;
    const selected = images.slice(0, maxPhotos);
    const base64Images = await Promise.all(selected.map(imageToBase64));
    return base64Images.filter(Boolean);
  };

  const handleGenerate = async () => {
    if (!(await gate())) return;
    try {
      setIsGenerating(true);
      const photos = await preparePhotos();

      let logoBase64 = '';
      if (logo) {
        try {
          logoBase64 = logo.base64
            ? `data:image/png;base64,${logo.base64}`
            : `data:image/png;base64,${await FileSystem.readAsStringAsync(logo.uri || logo, { encoding: 'base64' })}`;
        } catch {}
      }

      const uri = await generateRealEstatePDF(
        { formData, photos, companyName, logo: logoBase64, category: { id: category.id }, ekspertizData: ekspertizData || {} },
        format.id
      );
      setPdfUri(uri);
      setIsGenerating(false);
      return uri;
    } catch (error) {
      console.error('❌ PDF Hatası:', error);
      Alert.alert('Hata', 'PDF oluşturulamadı: ' + error.message);
      setIsGenerating(false);
      return null;
    }
  };

  const handlePreview = async () => {
    const uri = pdfUri || await handleGenerate();
    if (!uri) return;
    try { await Sharing.openAsync(uri); }
    catch { Alert.alert('Hata', 'PDF açılamadı'); }
  };

  const handleShare = async () => {
    const uri = pdfUri || await handleGenerate();
    if (!uri) return;
    try {
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'PDF Paylaş' });
      else Alert.alert('Hazır', 'PDF oluşturuldu!');
    } catch { Alert.alert('Hata', 'PDF paylaşılamadı'); }
  };

  // Build HTML for the social card with base64 photos
  const buildSocialHtml = async () => {
    const photos = await preparePhotos();
    let logoBase64 = '';
    if (logo) {
      try {
        logoBase64 = logo.base64
          ? `data:image/png;base64,${logo.base64}`
          : `data:image/png;base64,${await FileSystem.readAsStringAsync(logo.uri || logo, { encoding: 'base64' })}`;
      } catch {}
    }
    const data = { formData, photos, companyName, logo: logoBase64, category: { id: category.id }, ekspertizData: ekspertizData || {} };
    if (format.id === 'social-dark')  return buildSocialDarkHTML(data);
    if (format.id === 'social-green') return buildSocialGreenHTML(data);
    if (format.id === 'social-story') return buildSocialStoryHTML(data);
    
    // Sales Cards (5 themes × 2 variants)
    if (format.id === 'sales-arch-story')    return buildSalesArchHTML(data, true);
    if (format.id === 'sales-arch-post')     return buildSalesArchHTML(data, false);
    if (format.id === 'sales-sakura-story')  return buildSalesSakuraHTML(data, true);
    if (format.id === 'sales-sakura-post')   return buildSalesSakuraHTML(data, false);
    if (format.id === 'sales-deep-story')    return buildSalesDeepHTML(data, true);
    if (format.id === 'sales-deep-post')     return buildSalesDeepHTML(data, false);
    if (format.id === 'sales-volcano-story') return buildSalesVolcanoHTML(data, true);
    if (format.id === 'sales-volcano-post')  return buildSalesVolcanoHTML(data, false);
    if (format.id === 'sales-hist-story')    return buildSalesHistHTML(data, true);
    if (format.id === 'sales-hist-post')     return buildSalesHistHTML(data, false);
    
    // A4 Premium Themes
    if (format.id === 'a4-orange')   return buildA4OrangeHTML(data);
    if (format.id === 'a4-navy')     return buildA4NavyHTML(data);
    if (format.id === 'a4-green')    return buildA4GreenHTML(data);
    if (format.id === 'a4-galactic') return buildA4GalacticHTML(data);
    if (format.id === 'a4-salda')    return buildA4SaldaHTML(data);
    if (format.id === 'a4-crystal')  return buildA4CrystalHTML(data);
    if (format.id === 'a4-amber')    return buildA4AmberHTML(data);
    if (format.id === 'a4-oltu')     return buildA4OltuHTML(data);
    if (format.id === 'a4-volkan')   return buildA4VolkanHTML(data);
    if (format.id === 'a4-tarihi')   return buildA4TarihiHTML(data);
    
    return '';
  };

  const handleSaveImage = async () => {
    if (!(await gate())) return;
    try {
      setIsGenerating(true);
      const html = await buildSocialHtml();
      setCaptureHtml(html);
      setCaptureVisible(true);
    } catch (err) {
      Alert.alert('Hata', 'Resim hazırlanamadı: ' + err.message);
      setIsGenerating(false);
    }
  };

  const handleWebViewLoaded = async () => {
    // Wait for WebView to fully render (images, CSS)
    await new Promise(r => setTimeout(r, 900));
    if (!viewShotRef.current) {
      setCaptureVisible(false);
      setIsGenerating(false);
      return;
    }
    try {
      setIsCapturing(true);
      const uri = await viewShotRef.current.capture();
      setCaptureVisible(false);
      setIsCapturing(false);
      setIsGenerating(false);
      const title = (formData['Marka'] || formData['İlan Türü'] || 'İlan') + ' ' + (formData['Model'] || formData['Emlak Türü'] || '');
      await trackPDFGeneration('Galeri', format.name + ' · Görsel', 1, title.trim(), uri);
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Resim Paylaş' });
      } else {
        Alert.alert('Hazır', 'Resim oluşturuldu!');
      }
      // Geçici dosyayı temizle
      FileSystem.deleteAsync(uri, { idempotent: true }).catch(() => {});
    } catch (err) {
      setCaptureVisible(false);
      setIsCapturing(false);
      setIsGenerating(false);
      Alert.alert('Hata', 'Resim yakalanamadı: ' + err.message);
    }
  };

  const ilanTuru  = formData['İlan Türü']  || formData['Marka'] || '';
  const fiyat     = formData['Fiyat']      || '';
  const adres     = formData['Adres']      || formData['Model'] || '';
  const telefon   = formData['Telefon']    || '';

  const filledFields = Object.entries(formData).filter(([, v]) => v && String(v).trim());

  // Card dimensions for capture modal
  const cardDims = CARD_DIMS[format.id] || { w: 600, h: 600 };
  const cardScale = Math.min(SCREEN_W / cardDims.w, 1.0);
  const cardDisplayW = cardDims.w * cardScale;
  const cardDisplayH = cardDims.h * cardScale;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <LinearGradient
          colors={[format.color, format.color + 'BB']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + 14 }]}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBackBtn}>
              <Icon name="arrow-left" size={18} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerIcon}>
              <Text style={styles.headerEmoji}>{format.icon}</Text>
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>{format.name}</Text>
              <Text style={styles.headerSub}>{SIZE_LABELS[format.id]}</Text>
            </View>
            {pdfUri && (
              <View style={styles.readyBadge}>
                <Icon name="check" size={11} color="#fff" />
                <Text style={styles.readyText}>Hazır</Text>
              </View>
            )}
          </View>

          {/* Stats strip */}
          <View style={styles.statsStrip}>
            {[
              { num: Math.min(images.length, MAX_PHOTOS[format.id] || images.length), label: 'Fotoğraf' },
              { num: filledFields.length, label: 'Alan' },
              { num: ilanTuru || '—', label: isSocial ? 'Tür' : 'Tür' },
            ].map((s, i) => (
              <React.Fragment key={i}>
                {i > 0 && <View style={styles.statDiv} />}
                <View style={styles.statItem}>
                  <Text style={styles.statNum} numberOfLines={1}>{s.num}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>
        </LinearGradient>

        {/* Info card */}
        <View style={styles.content}>
          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.textSecondary }]}>ÖZET BİLGİLER</Text>

            {[
              ['Tür / Marka', ilanTuru],
              ['Fiyat', fiyat],
              ['Adres / Model', adres],
              ['Telefon', telefon],
            ].filter(([, v]) => v).map(([k, v]) => (
              <View key={k} style={[styles.row, { borderBottomColor: theme.border }]}>
                <Text style={[styles.rowKey, { color: theme.textSecondary }]}>{k}</Text>
                <Text style={[styles.rowVal, { color: theme.text }]} numberOfLines={2}>{v}</Text>
              </View>
            ))}

            {format.id !== 'vitrin' && (
              <View style={[styles.row, { borderBottomColor: 'transparent' }]}>
                <Text style={[styles.rowKey, { color: theme.textSecondary }]}>Kullanılan foto</Text>
                <Text style={[styles.rowVal, { color: theme.text }]}>
                  {Math.min(images.length, MAX_PHOTOS[format.id] || images.length)} / {images.length}
                  {images.length > (MAX_PHOTOS[format.id] || images.length) ? ' (otomatik kırpıldı)' : ''}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom buttons */}
      <View style={[styles.bottom, { backgroundColor: theme.bg, borderTopColor: theme.border }]}>
        {isA4Card ? (
          /* A4 Satış Kartları: PDF küçük solda + JPG büyük sağda */
          <>
            <TouchableOpacity
              style={[styles.btnSec, { backgroundColor: theme.surface2, borderColor: theme.border }]}
              onPress={handleShare}
              disabled={isGenerating}
              activeOpacity={0.8}
            >
              {isGenerating
                ? <ActivityIndicator color={GOLD} size="small" />
                : <><Icon name="file-document-outline" size={18} color={GOLD} /><Text style={[styles.btnSecText, { color: GOLD }]}>PDF</Text></>
              }
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnPri}
              onPress={handleSaveImage}
              disabled={isGenerating}
              activeOpacity={0.88}
            >
              <LinearGradient
                colors={[format.color, format.color + 'CC']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.btnPriInner}
              >
                {isGenerating
                  ? <ActivityIndicator color="#fff" />
                  : <>
                      <Icon name="image-outline" size={18} color="#fff" />
                      <Text style={styles.btnPriText}>JPG / PNG Paylaş</Text>
                    </>
                }
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : isImageRender ? (
          /* Social/Sales: JPG/PNG primary */
          <>
            <TouchableOpacity
              style={styles.btnPri}
              onPress={handleSaveImage}
              disabled={isGenerating}
              activeOpacity={0.88}
            >
              <LinearGradient
                colors={[format.color, format.color + 'CC']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.btnPriInner}
              >
                {isGenerating
                  ? <ActivityIndicator color="#fff" />
                  : <>
                      <Icon name="image-outline" size={18} color="#fff" />
                      <Text style={styles.btnPriText}>JPG/PNG Paylaş</Text>
                    </>
                }
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : (
          /* Non-social: original PDF flow */
          <>
            <TouchableOpacity
              style={[styles.btnSec, { backgroundColor: theme.surface2, borderColor: theme.border }]}
              onPress={handlePreview}
              disabled={isGenerating}
              activeOpacity={0.8}
            >
              {isGenerating
                ? <ActivityIndicator color={GOLD} size="small" />
                : <><Icon name="eye-outline" size={18} color={GOLD} /><Text style={[styles.btnSecText, { color: GOLD }]}>Önizle</Text></>
              }
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnPri}
              onPress={handleShare}
              disabled={isGenerating}
              activeOpacity={0.88}
            >
              <LinearGradient
                colors={[format.color, format.color + 'CC']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.btnPriInner}
              >
                {isGenerating
                  ? <ActivityIndicator color="#fff" />
                  : <>
                      <Icon name="share-variant" size={18} color="#fff" />
                      <Text style={styles.btnPriText}>{pdfUri ? 'Tekrar Paylaş' : 'PDF Oluştur & Paylaş'}</Text>
                    </>
                }
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      </View>

      <TouchableOpacity
        style={[styles.homeLink, { backgroundColor: theme.bg }]}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={[styles.homeLinkText, { color: theme.textSecondary }]}>Ana Sayfaya Dön</Text>
      </TouchableOpacity>

      {/* ── Image Capture Modal ── */}
      <Modal visible={captureVisible} transparent={false} animationType="fade" statusBarTranslucent>
        <View style={styles.captureOverlay}>
          <Text style={styles.captureLabel}>
            {isCapturing ? 'Kaydediliyor...' : 'Kart hazırlanıyor...'}
          </Text>

          <ViewShot
            ref={viewShotRef}
            options={{ format: 'png', quality: 1.0, result: 'tmpfile' }}
            style={{ width: cardDims.w, height: cardDims.h, transform: [{ scale: cardScale }], transformOrigin: 'top left' }}
          >
            <WebView
              source={{ html: captureHtml }}
              style={{ width: cardDims.w, height: cardDims.h }}
              scrollEnabled={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              onLoadEnd={handleWebViewLoaded}
              androidLayerType="software"
            />
          </ViewShot>

          {isCapturing && (
            <ActivityIndicator color="#fff" size="large" style={{ marginTop: 24 }} />
          )}
        </View>
      </Modal>
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
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  headerEmoji: { fontSize: 22 },
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
    flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12, padding: 12,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 3 },
  statNum: { fontSize: 13, fontWeight: '800', color: '#fff' },
  statLabel: { fontSize: 9, color: 'rgba(255,255,255,0.65)', fontWeight: '500' },
  statDiv: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 2 },

  content: { padding: 16, paddingBottom: 24 },
  card: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  cardTitle: { fontSize: 10, fontWeight: '700', letterSpacing: 1, padding: 14, paddingBottom: 6 },
  row: {
    flexDirection: 'row', alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 14, paddingVertical: 10,
    borderBottomWidth: 1, gap: 16,
  },
  rowKey: { fontSize: 12, fontWeight: '600', flexShrink: 0, maxWidth: '40%' },
  rowVal: { fontSize: 13, flex: 1, textAlign: 'right' },

  bottom: {
    flexDirection: 'row', gap: 10,
    padding: 16, paddingBottom: 12, borderTopWidth: 1,
  },
  btnSec: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 18, paddingVertical: 14,
    borderRadius: 14, borderWidth: 1,
  },
  btnSecText: { fontSize: 14, fontWeight: '600' },
  btnPri: { flex: 1, borderRadius: 14, overflow: 'hidden' },
  btnPriInner: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8, padding: 14,
  },
  btnPriText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  homeLink: { alignItems: 'center', paddingVertical: 12, paddingBottom: 24 },
  homeLinkText: { fontSize: 13 },

  captureOverlay: {
    flex: 1, backgroundColor: '#000',
    alignItems: 'flex-start', justifyContent: 'flex-start',
    paddingTop: 40, paddingLeft: 0,
    overflow: 'hidden',
  },
  captureLabel: {
    color: 'rgba(255,255,255,0.5)', fontSize: 12,
    letterSpacing: 1, marginBottom: 12, paddingLeft: 20,
  },
});
