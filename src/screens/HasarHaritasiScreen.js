import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Text, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import { HASAR_HARITASI_HTML } from '../pdf/hasarHaritasiHTML';
import Icon from '../components/Icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../themes/colors';

const GOLD = '#C9A84C';

export default function HasarHaritasiScreen({ route, navigation }) {
  const { initialData, returnScreen = 'AracEkle', returnParams = {} } = route.params || {};
  const webViewRef = useRef(null);
  const [ready, setReady] = useState(false);
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!ready) return;
    if (initialData && Object.keys(initialData).length > 0) {
      webViewRef.current?.injectJavaScript(
        `loadInitialState(${JSON.stringify(initialData)}); true;`
      );
    }
  }, [ready]);

  const onMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      navigation.navigate(returnScreen, { ...returnParams, hasarData: data });
    } catch {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.bg} />

      <View style={[styles.nav, { borderBottomColor: theme.border, backgroundColor: theme.bg, paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: theme.surface2, borderColor: theme.border }]}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={18} color={theme.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: theme.text }]}>Hasar & Boya Haritası</Text>
          <Text style={[styles.sub, { color: theme.textSecondary }]}>Parçaya dokun · Durumu işaretle</Text>
        </View>
      </View>

      <WebView
        ref={webViewRef}
        source={{ html: HASAR_HARITASI_HTML }}
        style={styles.webview}
        onLoad={() => setReady(true)}
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
  root:    { flex: 1 },
  nav:     { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1 },
  backBtn: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  title:   { fontSize: 16, fontWeight: '700' },
  sub:     { fontSize: 12, marginTop: 1 },
  webview: { flex: 1 },
  loading: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
});
