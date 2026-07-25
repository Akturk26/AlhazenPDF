import { Platform, Alert } from 'react-native';
import * as Sharing from 'expo-sharing';
import RNShare from 'react-native-share';

/**
 * PDF dosyasını doğrudan WhatsApp ile paylaşır.
 * Android'de WhatsApp'ı direkt açar; iOS'ta sistem share sheet'i açar.
 */
export async function shareToWhatsApp(uri, filename = 'belge.pdf') {
  try {
    if (Platform.OS === 'android') {
      await RNShare.shareSingle({
        social: RNShare.Social.WHATSAPP,
        url: uri,
        type: 'application/pdf',
        filename,
        failOnCancel: false,
      });
    } else {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        UTI: 'com.adobe.pdf',
        dialogTitle: 'WhatsApp ile Paylaş',
      });
    }
  } catch (e) {
    if (e?.message?.includes('WhatsApp') || e?.message?.includes('not installed')) {
      Alert.alert(
        'WhatsApp Bulunamadı',
        'Cihazınızda WhatsApp kurulu değil. Normal paylaşım açılıyor.',
        [{ text: 'Tamam', onPress: () => Sharing.shareAsync(uri, { mimeType: 'application/pdf' }) }]
      );
    } else if (e?.message !== 'User did not share') {
      try {
        await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'PDF Paylaş' });
      } catch {
        Alert.alert('Hata', 'PDF paylaşılamadı.');
      }
    }
  }
}
