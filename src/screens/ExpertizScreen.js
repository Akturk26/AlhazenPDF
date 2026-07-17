import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Text, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HASAR_HARITASI_HTML } from '../pdf/hasarHaritasiHTML';
import Icon from '../components/Icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../themes/colors';

const GOLD = '#C9A84C';

const STORAGE_KEY = (id) => `form_draft_${id}`;

export default function ExpertizScreen({ route, navigation }) {
  const { categoryId, ekspertizData } = route.params;
  const webViewRef = useRef(null);
  const [webViewReady, setWebViewReady] = useState(false);
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  const insets = useSafeAreaInsets();

  // WebView yüklendikten sonra mevcut ekspertiz verisini enjekte et
  useEffect(() => {
    if (!webViewReady) return;
    if (ekspertizData && Object.keys(ekspertizData).length > 0) {
      webViewRef.current?.injectJavaScript(
        `loadInitialState(${JSON.stringify(ekspertizData)}); true;`
      );
    }
  }, [webViewReady]);

  // WebView'dan "Kaydet" mesajı geldiğinde
  const onMessage = async (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      // Mevcut form draftini oku, ekspertizData alanını güncelle
      const draftKey = STORAGE_KEY(categoryId);
      const saved = await AsyncStorage.getItem(draftKey);
      const draft = saved ? JSON.parse(saved) : {};
      await AsyncStorage.setItem(draftKey, JSON.stringify({ ...draft, ekspertizData: data }));
    } catch {}
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.bg} />

      {/* Üst bar */}
      <View style={[styles.nav, { borderBottomColor: theme.border, backgroundColor: theme.bg, paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: theme.surface2, borderColor: theme.border }]}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={18} color={theme.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.navTitle, { color: theme.text }]}>Hasar & Boya Haritası</Text>
          <Text style={[styles.navSub, { color: theme.textSecondary }]}>Parçaya dokun · Durumu işaretle</Text>
        </View>
      </View>

      {/* WebView */}
      <WebView
        ref={webViewRef}
        source={{ html: HASAR_HARITASI_HTML }}
        style={styles.webview}
        onLoad={() => setWebViewReady(true)}
        onMessage={onMessage}
        javaScriptEnabled
        scrollEnabled
        showsVerticalScrollIndicator={false}
        startInLoadingState
        renderLoading={() => (
          <View style={[styles.loading, { backgroundColor: theme.bg }]}>
            <ActivityIndicator color={GOLD} size="large" />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  nav: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 14,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
  },
  backText: { fontSize: 18, fontWeight: '600' },
  navTitle: { fontSize: 16, fontWeight: '700' },
  navSub: { fontSize: 12, marginTop: 1 },
  webview: { flex: 1 },
  loading: {
    position: 'absolute', inset: 0,
    alignItems: 'center', justifyContent: 'center',
  },
});
