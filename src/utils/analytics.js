import AsyncStorage from '@react-native-async-storage/async-storage';

const STATS_KEY = '@alhazen_statistics';

// Get all statistics
export const getStatistics = async () => {
  try {
    const stats = await AsyncStorage.getItem(STATS_KEY);
    if (stats) {
      return JSON.parse(stats);
    }
    // Default stats structure
    return {
      totalPDFs: 0,
      themeUsage: {
        modern: 0,
        darkGold: 0,
        vintage: 0,
        white: 0,
        green: 0,
        burgundy: 0,
        navySilver: 0,
        copper: 0,
        grayOrange: 0,
      },
      categoryUsage: {
        auto: 0,
        'real-estate': 0,
        emlak: 0,
        office: 0,
        personal: 0,
        other: 0,
      },
      monthlyData: [], // { month: 'YYYY-MM', count: 0 }
      lastPDFs: [], // { date, category, theme, photoCount }
    };
  } catch (error) {
    console.error('Error reading statistics:', error);
    return null;
  }
};

// Track new PDF generation
export const trackPDFGeneration = async (category, theme, photoCount, title = 'Başlıksız PDF', permanentUri = null) => {
  try {
    const stats = await getStatistics();
    if (!stats) return;

    // Increment total
    stats.totalPDFs += 1;

    // Track theme usage - Map template names to theme keys
    const templateThemeMap = {
      'Modern': 'modern',
      'Premium Altın': 'darkGold',
      'Premium Yeşil': 'green',
      'Premium Vintage': 'vintage',
      'Premium Beyaz': 'white',
      'Bordo Altın': 'burgundy',
      'Lacivert Gümüş': 'navySilver',
      'Bakır': 'copper',
      'Gri Turuncu': 'grayOrange',
    };
    const themeKey = templateThemeMap[theme] || theme.toLowerCase();
    if (stats.themeUsage[themeKey] !== undefined) {
      stats.themeUsage[themeKey] += 1;
    }

    // Track category usage
    const categoryKey = category.id;
    if (stats.categoryUsage[categoryKey] !== undefined) {
      stats.categoryUsage[categoryKey] += 1;
    } else {
      // Yeni kategori key'i varsa dinamik ekle
      stats.categoryUsage[categoryKey] = 1;
    }

    // Track monthly data
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const monthIndex = stats.monthlyData.findIndex(m => m.month === currentMonth);
    if (monthIndex >= 0) {
      stats.monthlyData[monthIndex].count += 1;
    } else {
      stats.monthlyData.push({ month: currentMonth, count: 1 });
    }

    // Keep only last 12 months
    stats.monthlyData = stats.monthlyData.slice(-12);

    // Track last PDFs (keep last 50)
    const pdfId = Date.now().toString();
    stats.lastPDFs.unshift({
      id: pdfId,
      timestamp: new Date().toISOString(),
      title: title,
      category: category.name,
      theme: theme,
      photoCount: photoCount,
      permanentUri: permanentUri || null,
    });
    stats.lastPDFs = stats.lastPDFs.slice(0, 50);

    // Save updated stats
    await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
    return stats;
  } catch (error) {
    console.error('Error tracking PDF:', error);
    return null;
  }
};

// Get monthly chart data
export const getMonthlyChartData = async () => {
  try {
    const stats = await getStatistics();
    if (!stats || stats.monthlyData.length === 0) {
      return { labels: [], data: [] };
    }

    const labels = stats.monthlyData.map(m => {
      const [year, month] = m.month.split('-');
      return `${month}/${year.slice(2)}`;
    });
    
    const data = stats.monthlyData.map(m => m.count);

    return { labels, data };
  } catch (error) {
    console.error('Error getting chart data:', error);
    return { labels: [], data: [] };
  }
};

// Reset all statistics (for testing)
export const resetStatistics = async () => {
  try {
    await AsyncStorage.removeItem(STATS_KEY);
    return true;
  } catch (error) {
    console.error('Error resetting statistics:', error);
    return false;
  }
};

// Get PDF history (all lastPDFs)
export const getPDFHistory = async () => {
  try {
    const stats = await getStatistics();
    if (!stats || !stats.lastPDFs) {
      return [];
    }
    return stats.lastPDFs;
  } catch (error) {
    console.error('Error getting PDF history:', error);
    return [];
  }
};

// Clear all PDF history
export const clearAllHistory = async () => {
  try {
    const stats = await getStatistics();
    if (!stats) return false;
    stats.lastPDFs = [];
    await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
    return true;
  } catch (error) {
    console.error('Error clearing history:', error);
    return false;
  }
};

// Delete PDF from history
export const deletePDFFromHistory = async (pdfId) => {
  try {
    const stats = await getStatistics();
    if (!stats) return false;

    stats.lastPDFs = stats.lastPDFs.filter(pdf => pdf.id !== pdfId);
    
    await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
    return true;
  } catch (error) {
    console.error('Error deleting PDF from history:', error);
    return false;
  }
};
