import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, Alert, ActivityIndicator, Modal,
} from 'react-native';
import Icon from '../components/Icon';
import { usePremium } from '../context/PremiumContext';
import { WebView } from 'react-native-webview';
import ViewShot from 'react-native-view-shot';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { shareToWhatsApp } from '../utils/whatsappShare';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system/legacy';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  buildSaldaKorsanHTML,
  buildKozmikMukarnasHTML,
  buildIbnulHeysemHTML,
  buildAlpineHTML,
  buildMukarnasAotearoaHTML,
  buildIznikCiniHTML,
} from '../pdf/expertizCards';
import { trackPDFGeneration } from '../utils/analytics';

const BUILDERS = {
  'salda-korsan':      buildSaldaKorsanHTML,
  'kozmik-mukarnas':   buildKozmikMukarnasHTML,
  'ibnul-heysem':      buildIbnulHeysemHTML,
  'alpine':            buildAlpineHTML,
  'mukarnas-aotearoa': buildMukarnasAotearoaHTML,
  'iznik-cini':        buildIznikCiniHTML,
};

export default function ExpertizliPreviewScreen({ route, navigation }) {
  const { formData = {}, companyName = '', donanim = [], tramer = true, ekspertizData = {}, photos = [], templateKey = 'salda-korsan' } = route.params || {};
  const insets = useSafeAreaInsets();
  const { gate } = usePremium();

  const [previewHtml, setPreviewHtml] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUri, setPdfUri] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [captureVisible, setCaptureVisible] = useState(false);
  const [captureHtml, setCaptureHtml] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const viewShotRef = useRef(null);

  useEffect(() => {
    buildPreview();
  }, []);

  const imageToBase64 = async (imageData) => {
    try {
      const uri = imageData.uri || imageData;
      const compressed = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1400 } }],
        { compress: 0.95, format: ImageManipulator.SaveFormat.JPEG }
      );
      const base64 = await FileSystem.readAsStringAsync(compressed.uri, { encoding: 'base64' });
      return { base64: `data:image/jpeg;base64,${base64}` };
    } catch {
      return null;
    }
  };

  const buildPreview = async () => {
    setIsLoading(true);
    try {
      const html = await buildHtml();
      setPreviewHtml(html);
    } catch (e) {
      Alert.alert('Hata', 'Önizleme oluşturulamadı: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!(await gate())) return;
    try {
      setIsGenerating(true);
      const html = await buildHtml();

      const { uri } = await Print.printToFileAsync({ html, base64: false, width: 595, height: 842 });
      const destDir = FileSystem.documentDirectory + 'AlhazenPDF/';
      await FileSystem.makeDirectoryAsync(destDir, { intermediates: true });
      const fileName = `expertizli_${Date.now()}.pdf`;
      const destUri = destDir + fileName;
      await FileSystem.moveAsync({ from: uri, to: destUri });

      const title = `${formData['Marka'] || 'Araç'} ${formData['Model'] || ''}`.trim();
      await trackPDFGeneration('Galeri', `Expertizli · ${templateKey}`, photos.length, title, destUri);

      setPdfUri(destUri);
      setIsGenerating(false);

      Alert.alert(
        'PDF Hazır! 🎉',
        'Expertizli satış kağıdınız oluşturuldu.',
        [
          { text: 'Paylaş', onPress: () => handleShare(destUri) },
          { text: 'Tamam', style: 'cancel' },
        ]
      );
    } catch (e) {
      setIsGenerating(false);
      Alert.alert('Hata', 'PDF oluşturulamadı: ' + e.message);
    }
  };

  const buildHtml = async () => {
    const base64Photos = photos.length
      ? (await Promise.all(photos.slice(0, 1).map(imageToBase64))).filter(Boolean)
      : [];
    const builder = BUILDERS[templateKey] || buildSaldaKorsanHTML;
    return builder({ formData, photos: base64Photos, companyName, ekspertizData, donanim, tramer });
  };

  const handleSaveImage = async () => {
    if (!(await gate())) return;
    try {
      setIsGenerating(true);
      const html = await buildHtml();
      setCaptureHtml(html);
      setCaptureVisible(true);
    } catch (err) {
      Alert.alert('Hata', 'Resim hazırlanamadı: ' + err.message);
      setIsGenerating(false);
    }
  };

  const handleWebViewLoaded = async () => {
    await new Promise(r => setTimeout(r, 2500));
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
      const title = `${formData['Marka'] || 'Araç'} ${formData['Model'] || ''}`.trim();
      await trackPDFGeneration('Galeri', `Expertizli · ${templateKey} · Görsel`, photos.length, title, uri);
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, { mimeType: 'image/jpeg', dialogTitle: 'Resim Paylaş' });
      } else {
        Alert.alert('Hazır', 'Resim oluşturuldu!');
      }
    } catch (err) {
      setCaptureVisible(false);
      setIsCapturing(false);
      setIsGenerating(false);
      Alert.alert('Hata', 'Resim yakalanamadı: ' + err.message);
    }
  };

  const handleShare = async (uri) => {
    const u = uri || pdfUri;
    if (!u) {
      await handleGeneratePDF();
      return;
    }
    try {
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(u, {
          mimeType: 'application/pdf',
          dialogTitle: `${formData['Marka'] || 'Araç'} — Expertizli Satış Kağıdı`,
        });
      }
    } catch {
      Alert.alert('Hata', 'Paylaşım başarısız');
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: '#050D10' }]}>
      <StatusBar barStyle="light-content" backgroundColor="#050D10" />

      {/* Nav */}
      <View style={[styles.nav, { paddingTop: insets.top + 14 }]}>
        <TouchableOpacity style={[styles.navBtn, { backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.12)' }]} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.navTitle}>Önizleme</Text>
          <Text style={styles.navSub}>Expertizli Satış Kağıdı · A4</Text>
        </View>
        <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: 'rgba(196,160,32,0.15)', borderColor: 'rgba(196,160,32,0.4)' }]}
          onPress={() => handleShare()}
          disabled={isGenerating}
        >
          <Icon name="share-variant" size={20} color="#C4A020" />
        </TouchableOpacity>
      </View>

      {/* Preview */}
      <View style={styles.previewWrap}>
        {isLoading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color="#C4A020" size="large" />
            <Text style={styles.loadingTxt}>Önizleme hazırlanıyor...</Text>
          </View>
        ) : (
          <WebView
            source={{ html: previewHtml }}
            style={styles.webview}
            scrollEnabled
            javaScriptEnabled
            scalesPageToFit
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Bottom bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>

        {/* Yenile */}
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={buildPreview}
          disabled={isLoading}
        >
          <Icon name="refresh" size={18} color="rgba(255,255,255,0.45)" />
        </TouchableOpacity>

        {/* PDF Oluştur → hazır olunca Paylaş */}
        <TouchableOpacity
          style={[styles.pdfBtn, (isGenerating && !captureVisible) && { opacity: 0.6 }]}
          onPress={pdfUri ? () => handleShare() : handleGeneratePDF}
          disabled={isGenerating}
          activeOpacity={0.85}
        >
          {isGenerating && !captureVisible ? (
            <ActivityIndicator color="#0E1E2A" size="small" />
          ) : (
            <>
              <Icon name={pdfUri ? 'share-variant' : 'file-document-outline'} size={17} color="#0E1E2A" />
              <Text style={styles.pdfBtnTxt}>{pdfUri ? 'PDF Paylaş' : 'PDF Oluştur'}</Text>
            </>
          )}
        </TouchableOpacity>

        {/* WhatsApp (PDF hazır olunca) */}
        {pdfUri && (
          <TouchableOpacity style={styles.waBtn} onPress={() => shareToWhatsApp(pdfUri)}>
            <Icon name="whatsapp" size={18} color="#fff" />
          </TouchableOpacity>
        )}

        {/* Görsel Kaydet */}
        <TouchableOpacity
          style={[styles.imageBtn, (isGenerating && captureVisible) && { opacity: 0.6 }]}
          onPress={handleSaveImage}
          disabled={isGenerating}
          activeOpacity={0.85}
        >
          {isGenerating && captureVisible ? (
            <ActivityIndicator color="#C4A020" size="small" />
          ) : (
            <>
              <Icon name="image-outline" size={16} color="#C4A020" />
              <Text style={styles.imageBtnTxt}>Görsel</Text>
            </>
          )}
        </TouchableOpacity>

      </View>

      {/* Capture Modal */}
      <Modal visible={captureVisible} transparent animationType="none">
        <View style={styles.captureModal}>
          <ViewShot
            ref={viewShotRef}
            options={{ format: 'jpg', quality: 1.0, pixelRatio: 4 }}
            style={{ width: 595, height: 842 }}
          >
            <WebView
              source={{ html: captureHtml }}
              style={{ width: 595, height: 842, backgroundColor: '#fff' }}
              scrollEnabled={false}
              javaScriptEnabled
              onLoad={handleWebViewLoaded}
            />
          </ViewShot>
          {isCapturing && (
            <View style={styles.captureOverlay}>
              <ActivityIndicator color="#C4A020" size="large" />
              <Text style={styles.captureTxt}>Resim oluşturuluyor...</Text>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  nav: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingTop: 14, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  navBtn: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  navBtnTxt: { fontSize: 18, fontWeight: '600', color: '#fff' },
  navTitle: { fontSize: 16, fontWeight: '700', color: '#F2EDD4' },
  navSub: { fontSize: 11, color: 'rgba(242,237,212,0.35)', marginTop: 1 },

  previewWrap: {
    flex: 1,
    backgroundColor: '#0A1012',
  },
  webview: { flex: 1, backgroundColor: '#0A1012' },
  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingTxt: { color: 'rgba(242,237,212,0.4)', fontSize: 13 },

  bottomBar: {
    flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingTop: 14,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#0E1E2A', alignItems: 'center',
  },
  iconBtn: {
    width: 46, height: 46, borderRadius: 12, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  pdfBtn: {
    flex: 1, height: 46, borderRadius: 12, backgroundColor: '#C4A020',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7,
  },
  pdfBtnTxt: { color: '#0E1E2A', fontSize: 14, fontWeight: '800', letterSpacing: 0.2 },
  waBtn: {
    width: 46, height: 46, borderRadius: 12, backgroundColor: '#25D366',
    alignItems: 'center', justifyContent: 'center',
  },
  imageBtn: {
    height: 46, paddingHorizontal: 14, borderRadius: 12,
    borderWidth: 1, borderColor: 'rgba(196,160,32,0.4)',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5,
  },
  imageBtnTxt: { color: '#C4A020', fontSize: 13, fontWeight: '700' },
  captureModal: {
    position: 'absolute', top: -2000, left: 0,
    width: 595, height: 842,
  },
  captureOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center', justifyContent: 'center', gap: 12,
  },
  captureTxt: { color: '#C4A020', fontSize: 14, fontWeight: '600' },
});
