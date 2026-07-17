import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../themes/colors';
import { getStatistics, getMonthlyChartData } from '../utils/analytics';

const GOLD = '#C9A84C';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen({ navigation }) {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState({ labels: [], data: [] });
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    loadStatistics(isMounted);
    return () => { isMounted = false; };
  }, []);

  const loadStatistics = async (isMounted = true) => {
    try {
      setError(null);
      const statistics = await getStatistics();
      const monthlyChart = await getMonthlyChartData();
      if (isMounted) {
        setStats(statistics);
        setChartData(monthlyChart);
      }
    } catch (err) {
      if (isMounted) {
        setError('İstatistikler yüklenemedi');
        console.error('Statistics load error:', err);
      }
    }
  };

  if (!stats) {
    return (
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={styles.loading}>
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Yükleniyor...</Text>
        </View>
      </View>
    );
  }

  const categoryIcons = {
    auto: 'car-outline',
    emlak: 'home-city-outline',
    office: 'briefcase-outline',
    personal: 'account-outline',
    other: 'file-document-outline',
  };

  const categoryColors = {
    auto: '#E05555', emlak: '#3DBA7C', office: '#3B82F6',
    personal: '#9B6EF7', other: '#E0904A',
  };

  const categoryNames = {
    auto: 'Otomotiv',
    emlak: 'Emlak',
    office: 'Ofis',
    personal: 'Kişisel',
    other: 'Diğer',
  };

  const themeIcons = {
    modern: 'palette-outline',
    darkGold: 'star-circle-outline',
    vintage: 'book-open-page-variant-outline',
    white: 'file-document-outline',
    green: 'leaf',
  };

  const themeNames = {
    modern: 'Modern',
    darkGold: 'Premium Altın',
    vintage: 'Premium Vintage',
    white: 'Premium Beyaz',
    green: 'Premium Yeşil',
  };

  const topCategory = Object.entries(stats.categoryUsage).reduce((a, b) => a[1] > b[1] ? a : b, ['', 0]);
  const topTheme = Object.entries(stats.themeUsage).reduce((a, b) => a[1] > b[1] ? a : b, ['', 0]);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.bg} />

      {/* Header */}
      <View style={[styles.navBar, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={[styles.navBack, { backgroundColor: theme.surface2, borderColor: theme.border }]}
        >
          <Icon name="arrow-left" size={18} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: theme.text }]}>İstatistikler</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Stats */}
        <LinearGradient
          colors={theme.heroGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.heroCard, { borderBottomColor: theme.border }]}
        >
          <View style={[styles.heroGlow, { backgroundColor: isDark ? 'rgba(201,168,76,0.06)' : 'rgba(201,168,76,0.04)' }]} />
          <Text style={[styles.heroLabel, { color: theme.textSecondary }]}>Toplam PDF</Text>
          <Text style={[styles.heroNumber, { color: theme.text }]}>{stats.totalPDFs}</Text>
          <Text style={[styles.heroSub, { color: theme.textSecondary }]}>Oluşturuldu 🎉</Text>
        </LinearGradient>

        {/* Quick Stats */}
        <View style={styles.content}>
          <View style={styles.quickStats}>
            <View style={[styles.quickStat, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={styles.quickStatIcon}>⭐</Text>
              <Text style={[styles.quickStatLabel, { color: theme.textSecondary }]}>En Çok</Text>
              <Text style={[styles.quickStatValue, { color: theme.text }]}>{categoryNames[topCategory[0]] || '-'}</Text>
            </View>

            <View style={[styles.quickStat, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={styles.quickStatIcon}>🎨</Text>
              <Text style={[styles.quickStatLabel, { color: theme.textSecondary }]}>Favori Tema</Text>
              <Text style={[styles.quickStatValue, { color: theme.text }]}>{themeNames[topTheme[0]] || '-'}</Text>
            </View>
          </View>

          {/* Monthly Chart */}
          {chartData.labels.length > 0 && (
            <View style={[styles.chartCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.chartTitle, { color: theme.text }]}>📊 Aylık PDF Grafiği</Text>
              <BarChart
                data={{
                  labels: chartData.labels,
                  datasets: [{ data: chartData.data }],
                }}
                width={screenWidth - 80}
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  backgroundColor: theme.surface,
                  backgroundGradientFrom: theme.surface,
                  backgroundGradientTo: theme.surface,
                  decimalPlaces: 0,
                  color: (opacity = 1) => isDark ? `rgba(79, 110, 247, ${opacity})` : `rgba(79, 70, 229, ${opacity})`,
                  labelColor: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity * 0.6})` : `rgba(0, 0, 0, ${opacity * 0.6})`,
                  style: { borderRadius: 16 },
                  propsForBackgroundLines: {
                    strokeDasharray: '',
                    stroke: theme.border,
                    strokeWidth: 1,
                  },
                }}
                style={styles.chart}
                fromZero
              />
            </View>
          )}

          {/* Category Usage */}
          <View style={[styles.statsCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <Icon name="folder-outline" size={16} color={GOLD} />
              <Text style={[styles.statsTitle, { color: theme.text, marginBottom: 0 }]}>Kategori Kullanımı</Text>
            </View>
            <View style={styles.statsList}>
              {Object.entries(stats.categoryUsage).map(([key, value]) => (
                <View key={key} style={[styles.statsItem, { borderBottomColor: theme.border }]}>
                  <View style={styles.statsItemLeft}>
                    <Icon name={categoryIcons[key] || 'file-document-outline'} size={18} color={categoryColors[key] || GOLD} />
                    <Text style={[styles.statsItemLabel, { color: theme.text }]}>{categoryNames[key]}</Text>
                  </View>
                  <View style={styles.statsItemRight}>
                    <Text style={[styles.statsItemValue, { color: GOLD }]}>{value}</Text>
                    <View style={[styles.statsBar, { backgroundColor: theme.surfaceDim }]}>
                      <View 
                        style={[styles.statsBarFill, { 
                          backgroundColor: GOLD,
                          width: `${stats.totalPDFs > 0 ? (value / stats.totalPDFs) * 100 : 0}%`
                        }]} 
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Theme Usage */}
          <View style={[styles.statsCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <Icon name="palette-outline" size={16} color={GOLD} />
              <Text style={[styles.statsTitle, { color: theme.text, marginBottom: 0 }]}>Tema Kullanımı</Text>
            </View>
            <View style={styles.statsList}>
              {Object.entries(stats.themeUsage).map(([key, value]) => (
                <View key={key} style={[styles.statsItem, { borderBottomColor: theme.border }]}>
                  <View style={styles.statsItemLeft}>
                    <Icon name={themeIcons[key] || 'palette-outline'} size={18} color={GOLD} />
                    <Text style={[styles.statsItemLabel, { color: theme.text }]}>{themeNames[key]}</Text>
                  </View>
                  <View style={styles.statsItemRight}>
                    <Text style={[styles.statsItemValue, { color: theme.green }]}>{value}</Text>
                    <View style={[styles.statsBar, { backgroundColor: theme.surfaceDim }]}>
                      <View 
                        style={[styles.statsBarFill, { 
                          backgroundColor: theme.green,
                          width: `${stats.totalPDFs > 0 ? (value / stats.totalPDFs) * 100 : 0}%`
                        }]} 
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Recent PDFs */}
          {stats.lastPDFs.length > 0 && (
            <View style={[styles.statsCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.statsTitle, { color: theme.text }]}>📄 Son PDF'ler</Text>
              <View style={styles.statsList}>
                {stats.lastPDFs.map((pdf, index) => {
                  const date = new Date(pdf.date);
                  const dateStr = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                  return (
                    <View key={index} style={[styles.recentItem, { borderBottomColor: theme.border }]}>
                      <View style={styles.recentLeft}>
                        <Text style={[styles.recentDate, { color: theme.textSecondary }]}>{dateStr}</Text>
                        <Text style={[styles.recentCategory, { color: theme.text }]}>{pdf.category}</Text>
                      </View>
                      <View style={styles.recentRight}>
                        <Text style={[styles.recentTheme, { color: theme.textSecondary }]}>{pdf.theme}</Text>
                        <Text style={[styles.recentPhotos, { color: GOLD }]}>{pdf.photoCount} foto</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    gap: 12,
  },
  navBack: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBackText: {
    fontSize: 20,
    fontWeight: '600',
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  heroCard: {
    padding: 40,
    alignItems: 'center',
    borderBottomWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    top: -100,
    left: -100,
    right: -100,
    bottom: -100,
    borderRadius: 999,
  },
  heroLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  heroNumber: {
    fontSize: 56,
    fontWeight: '800',
    marginBottom: 8,
  },
  heroSub: {
    fontSize: 14,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  quickStats: {
    flexDirection: 'row',
    gap: 10,
  },
  quickStat: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    gap: 6,
  },
  quickStatIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quickStatValue: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  chartCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  statsList: {
    gap: 12,
  },
  statsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  statsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statsItemIcon: {
    fontSize: 20,
  },
  statsItemLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statsItemValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  statsBar: {
    width: 60,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  statsBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  recentLeft: {
    gap: 4,
  },
  recentDate: {
    fontSize: 11,
  },
  recentCategory: {
    fontSize: 14,
    fontWeight: '600',
  },
  recentRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  recentTheme: {
    fontSize: 11,
  },
  recentPhotos: {
    fontSize: 12,
    fontWeight: '600',
  },
});
