import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, Alert, ActivityIndicator, Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { getPDFHistory } from '../utils/analytics';
import { pdfFileExists } from '../utils/pdfStorage';
import supabase from '../utils/supabaseClient';
import { ACTIVE_CO_KEY } from './CompanySelectScreen';
import Icon from '../components/Icon';

const GOLD = '#C9A84C';

export default function HomeScreen({ navigation }) {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [recentPDFs, setRecentPDFs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sharingId, setSharingId] = useState(null);
  const [showFormatPicker, setShowFormatPicker] = useState(false);
  const [companyType, setCompanyType] = useState(null);

  const loadCompanyType = async () => {
    try {
      const id = await AsyncStorage.getItem(ACTIVE_CO_KEY);
      if (!id) { setCompanyType(null); return; }
      const { data } = await supabase.from('companies').select('type').eq('id', id).single();
      setCompanyType(data?.type || null);
    } catch { setCompanyType(null); }
  };

  useEffect(() => {
    let isMounted = true;
    loadRecentPDFs(isMounted);
    loadCompanyType();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const unsubscribe = navigation.addListener('focus', () => {
      loadRecentPDFs(isMounted);
      if (isMounted) loadCompanyType();
    });
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [navigation]);

  const loadRecentPDFs = async (isMounted = true) => {
    try {
      if (loading) return;
      setLoading(true);
      const history = await getPDFHistory();
      if (isMounted) {
        setRecentPDFs(history.slice(0, 3));
        setTotalCount(history.length);
      }
    } catch {
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  const handleShare = async (pdf) => {
    if (!pdf.permanentUri) {
      Alert.alert('Dosya Bulunamadı', 'Bu PDF eski bir sürümde oluşturulmuş ve dosyası saklanmamış.');
      return;
    }
    const exists = await pdfFileExists(pdf.permanentUri);
    if (!exists) {
      Alert.alert('Dosya Silinmiş', 'PDF dosyası cihazdan kaldırılmış. Tekrar oluşturmanız gerekiyor.');
      return;
    }
    try {
      setSharingId(pdf.id);
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(pdf.permanentUri, {
          mimeType: 'application/pdf',
          dialogTitle: (pdf.title || 'PDF') + ' — PDF Paylaş',
        });
      }
    } catch {
      Alert.alert('Hata', 'PDF paylaşılırken bir sorun oluştu.');
    } finally {
      setSharingId(null);
    }
  };

  const getCategoryIcon = (cat) => {
    const map = {
      'Galeri':     { name: 'car-outline',         color: '#7a9bff' },
      'Emlak':      { name: 'home-outline',         color: '#C9A84C' },
      'Elektronik': { name: 'cellphone',            color: '#5ddb8a' },
      'Mobilya':    { name: 'sofa-outline',         color: '#a07aff' },
      'Kıyafet':   { name: 'tshirt-crew-outline',  color: '#f87171' },
      'Diğer':     { name: 'file-outline',          color: '#9ca3af' },
    };
    return map[cat] || { name: 'file-pdf-box', color: '#7a9bff' };
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '';
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return 'Bugün';
    if (date.toDateString() === yesterday.toDateString()) return 'Dün';
    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' });
  };

  // ─── Yardımcı: aksiyon kartı ───
  const ActionCard = ({ colors, borderColor, iconName, iconColor, iconBg, iconBorder, title, sub, arrowColor, arrowBg, onPress }) => (
    <TouchableOpacity style={[styles.actionCard, { borderColor }]} onPress={onPress} activeOpacity={0.88}>
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <View style={styles.actionCardShine} />
      <View style={[styles.actionIconWrap, { backgroundColor: iconBg, borderColor: iconBorder }]}>
        <Icon name={iconName} size={24} color={iconColor} />
      </View>
      <View style={styles.actionText}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSub}>{sub}</Text>
      </View>
      <View style={[styles.actionArrow, { backgroundColor: arrowBg }]}>
        <Icon name="arrow-right" size={16} color={arrowColor} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0d0f14' : '#F9FAFB' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#0d0f14' : '#F9FAFB'} />

      <View style={[styles.glow1, { opacity: isDark ? 1 : 0.4 }]} />
      <View style={[styles.glow2, { opacity: isDark ? 1 : 0.3 }]} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 12) + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HEADER ── */}
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <View>
            <Text style={styles.welcome}>Hoş geldiniz</Text>
            <Text style={[styles.logo, { color: isDark ? '#f0f2f8' : '#0F172A' }]}>
              Alhazen<Text style={styles.logoAccent}>PDF</Text>
            </Text>
            <Text style={styles.tagline}>Profesyonel PDF üreticisi</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={[styles.statChip, { backgroundColor: isDark ? '#1e2330' : '#E8EAF6', borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)' }]}>
              <Icon name="file-document-outline" size={12} color="#6b7280" />
              <Text style={[styles.statChipBold, { color: isDark ? '#f0f2f8' : '#0F172A' }]}>{totalCount}</Text>
              <Text style={styles.statChipText}>belge</Text>
            </View>
            <TouchableOpacity
              style={[styles.statChip, { backgroundColor: isDark ? '#1e2330' : '#FFF8E1', borderColor: isDark ? 'rgba(201,168,76,0.2)' : 'rgba(201,168,76,0.3)' }]}
              onPress={() => navigation.navigate('Settings')}
              activeOpacity={0.7}
            >
              <Icon name="star-four-points" size={12} color="#C9A84C" />
              <Text style={[styles.statChipBold, { color: '#C9A84C', fontSize: 11 }]}>Premium</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── ANA AKSİYON KARTLARI ── */}
        <View style={styles.actionCards}>

          {/* GALERİ */}
          {companyType === 'galeri' && (<>
            <ActionCard
              colors={['#1a2a6c', '#1e3060', '#162248']} borderColor="rgba(79,110,247,0.3)"
              iconName="file-pdf-box" iconColor="#7a9bff" iconBg="rgba(79,110,247,0.2)" iconBorder="rgba(79,110,247,0.3)"
              title="PDF Oluştur" sub="Standart · Afiş · Sticker · İlan kartı"
              arrowColor="#7a9bff" arrowBg="rgba(79,110,247,0.25)"
              onPress={() => navigation.navigate('Category', { mode: 'pdf' })}
            />
            <ActionCard
              colors={['#0e0a1a', '#1a1030', '#0e0a1a']} borderColor="rgba(130,90,255,0.28)"
              iconName="cards-outline" iconColor="#a07aff" iconBg="rgba(130,90,255,0.18)" iconBorder="rgba(130,90,255,0.28)"
              title="Satış & Medya Kartları" sub="Dikey · Kare · Story formatı"
              arrowColor="#a07aff" arrowBg="rgba(130,90,255,0.22)"
              onPress={() => setShowFormatPicker(true)}
            />
            <ActionCard
              colors={['#0E1E2A', '#1A3040', '#0E1E2A']} borderColor="rgba(196,160,32,0.35)"
              iconName="clipboard-check-outline" iconColor="#C4A020" iconBg="rgba(196,160,32,0.15)" iconBorder="rgba(196,160,32,0.3)"
              title="Expertizli Satış Kağıdı" sub="Hasar haritası · Donanım · A4 PDF"
              arrowColor="#C4A020" arrowBg="rgba(196,160,32,0.2)"
              onPress={() => navigation.navigate('ExpertizliForm')}
            />
            <ActionCard
              colors={['#0A1A0A', '#0F2010', '#0A1A0A']} borderColor="rgba(74,200,80,0.35)"
              iconName="chart-timeline-variant" iconColor="#4ac850" iconBg="rgba(74,200,80,0.15)" iconBorder="rgba(74,200,80,0.3)"
              title="Satış Takip" sub="Stok · Alış-Satış · Kâr/Zarar"
              arrowColor="#4ac850" arrowBg="rgba(74,200,80,0.2)"
              onPress={() => navigation.navigate('SatisTakip')}
            />
          </>)}

          {/* TEKNİK SERVİS */}
          {companyType === 'teknik_servis' && (<>
            <ActionCard
              colors={['#1C1408', '#2E2010', '#1C1408']} borderColor="rgba(184,146,42,0.4)"
              iconName="receipt-text-outline" iconColor="#D4AA40" iconBg="rgba(184,146,42,0.18)" iconBorder="rgba(184,146,42,0.3)"
              title="Teklif & Fatura" sub="Kalem listesi · KDV · İmza alanı"
              arrowColor="#D4AA40" arrowBg="rgba(184,146,42,0.2)"
              onPress={() => navigation.navigate('TeklifFatura')}
            />
            <ActionCard
              colors={['#0e0a1a', '#1a1030', '#0e0a1a']} borderColor="rgba(130,90,255,0.28)"
              iconName="car-outline" iconColor="#a07aff" iconBg="rgba(130,90,255,0.18)" iconBorder="rgba(130,90,255,0.28)"
              title="Araç Satış Kartı" sub="Dikey · Kare · Story formatı"
              arrowColor="#a07aff" arrowBg="rgba(130,90,255,0.22)"
              onPress={() => setShowFormatPicker(true)}
            />
            <ActionCard
              colors={['#120C06', '#221406', '#120C06']} borderColor="rgba(201,168,76,0.35)"
              iconName="tools" iconColor="#C9A84C" iconBg="rgba(201,168,76,0.15)" iconBorder="rgba(201,168,76,0.3)"
              title="Teknik Servis" sub="Servis kaydı · QR kod · Geçmiş"
              arrowColor="#C9A84C" arrowBg="rgba(201,168,76,0.18)"
              onPress={() => navigation.navigate('TeknikServis')}
            />
            <ActionCard
              colors={['#080E18', '#0E1828', '#080E18']} borderColor="rgba(74,138,208,0.35)"
              iconName="car-search-outline" iconColor="#4A8AD0" iconBg="rgba(74,138,208,0.15)" iconBorder="rgba(74,138,208,0.3)"
              title="Araç Sorgula" sub="Plakadan servis geçmişini ücretsiz öğren"
              arrowColor="#4A8AD0" arrowBg="rgba(74,138,208,0.18)"
              onPress={() => navigation.navigate('AracSorgula')}
            />
          </>)}

          {/* EMLAK */}
          {companyType === 'emlak' && (<>
            <ActionCard
              colors={['#1a2a6c', '#1e3060', '#162248']} borderColor="rgba(79,110,247,0.3)"
              iconName="file-pdf-box" iconColor="#7a9bff" iconBg="rgba(79,110,247,0.2)" iconBorder="rgba(79,110,247,0.3)"
              title="PDF Oluştur" sub="Standart · Afiş · Sticker · İlan kartı"
              arrowColor="#7a9bff" arrowBg="rgba(79,110,247,0.25)"
              onPress={() => navigation.navigate('Category', { mode: 'pdf' })}
            />
            <ActionCard
              colors={['#0e0a1a', '#1a1030', '#0e0a1a']} borderColor="rgba(130,90,255,0.28)"
              iconName="cards-outline" iconColor="#a07aff" iconBg="rgba(130,90,255,0.18)" iconBorder="rgba(130,90,255,0.28)"
              title="Satış & Medya Kartları" sub="Dikey · Kare · Story formatı"
              arrowColor="#a07aff" arrowBg="rgba(130,90,255,0.22)"
              onPress={() => setShowFormatPicker(true)}
            />
            <ActionCard
              colors={['#0D0B06', '#1A160A', '#0D0B06']} borderColor="rgba(184,150,90,0.35)"
              iconName="home-city-outline" iconColor="#b8965a" iconBg="rgba(184,150,90,0.15)" iconBorder="rgba(184,150,90,0.3)"
              title="Emlak Portföyü" sub="Çoklu ilan · Karşılaştırma · PDF"
              arrowColor="#b8965a" arrowBg="rgba(184,150,90,0.18)"
              onPress={() => navigation.navigate('EmlakPortfolyo')}
            />
            <ActionCard
              colors={['#1C1408', '#2E2010', '#1C1408']} borderColor="rgba(184,146,42,0.4)"
              iconName="receipt-text-outline" iconColor="#D4AA40" iconBg="rgba(184,146,42,0.18)" iconBorder="rgba(184,146,42,0.3)"
              title="Teklif & Fatura" sub="Kalem listesi · KDV · İmza alanı"
              arrowColor="#D4AA40" arrowBg="rgba(184,146,42,0.2)"
              onPress={() => navigation.navigate('TeklifFatura')}
            />
          </>)}

          {/* GİRİŞSİZ */}
          {!companyType && (<>
            <ActionCard
              colors={['#1a2a6c', '#1e3060', '#162248']} borderColor="rgba(79,110,247,0.3)"
              iconName="file-pdf-box" iconColor="#7a9bff" iconBg="rgba(79,110,247,0.2)" iconBorder="rgba(79,110,247,0.3)"
              title="PDF Oluştur" sub="Standart · Afiş · Sticker · İlan kartı"
              arrowColor="#7a9bff" arrowBg="rgba(79,110,247,0.25)"
              onPress={() => navigation.navigate('Category', { mode: 'pdf' })}
            />
            <ActionCard
              colors={['#0e0a1a', '#1a1030', '#0e0a1a']} borderColor="rgba(130,90,255,0.28)"
              iconName="cards-outline" iconColor="#a07aff" iconBg="rgba(130,90,255,0.18)" iconBorder="rgba(130,90,255,0.28)"
              title="Satış & Medya Kartları" sub="Dikey · Kare · Story formatı"
              arrowColor="#a07aff" arrowBg="rgba(130,90,255,0.22)"
              onPress={() => setShowFormatPicker(true)}
            />
            <ActionCard
              colors={['#0E1E2A', '#1A3040', '#0E1E2A']} borderColor="rgba(196,160,32,0.35)"
              iconName="clipboard-check-outline" iconColor="#C4A020" iconBg="rgba(196,160,32,0.15)" iconBorder="rgba(196,160,32,0.3)"
              title="Expertizli Satış Kağıdı" sub="Hasar haritası · Donanım · A4 PDF"
              arrowColor="#C4A020" arrowBg="rgba(196,160,32,0.2)"
              onPress={() => navigation.navigate('ExpertizliForm')}
            />
            <ActionCard
              colors={['#1C1408', '#2E2010', '#1C1408']} borderColor="rgba(184,146,42,0.4)"
              iconName="receipt-text-outline" iconColor="#D4AA40" iconBg="rgba(184,146,42,0.18)" iconBorder="rgba(184,146,42,0.3)"
              title="Teklif & Fatura" sub="Kalem listesi · KDV · İmza alanı"
              arrowColor="#D4AA40" arrowBg="rgba(184,146,42,0.2)"
              onPress={() => navigation.navigate('TeklifFatura')}
            />
            <ActionCard
              colors={['#080E18', '#0E1828', '#080E18']} borderColor="rgba(74,138,208,0.35)"
              iconName="car-search-outline" iconColor="#4A8AD0" iconBg="rgba(74,138,208,0.15)" iconBorder="rgba(74,138,208,0.3)"
              title="Araç Sorgula" sub="Plakadan servis geçmişini ücretsiz öğren"
              arrowColor="#4A8AD0" arrowBg="rgba(74,138,208,0.18)"
              onPress={() => navigation.navigate('AracSorgula')}
            />
            <ActionCard
              colors={['#1A1200', '#2A1E00', '#1A1200']} borderColor="rgba(201,168,76,0.35)"
              iconName="car-multiple" iconColor="#C9A84C" iconBg="rgba(201,168,76,0.15)" iconBorder="rgba(201,168,76,0.3)"
              title="Araçlarım" sub="Muayene · Sigorta · Bakım takibi"
              arrowColor="#C9A84C" arrowBg="rgba(201,168,76,0.18)"
              onPress={() => navigation.navigate('Araclarim')}
            />
          </>)}

        </View>

        {/* ── SON BELGELER ── */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#f0f2f8' : '#0F172A' }]}>Son Belgeler</Text>
            <TouchableOpacity onPress={() => navigation.navigate('History')} style={styles.sectionLinkBtn}>
              <Text style={[styles.sectionLink, { color: GOLD }]}>Tümü</Text>
              <Icon name="arrow-right" size={13} color={GOLD} />
            </TouchableOpacity>
          </View>

          <View style={styles.recentList}>
            {recentPDFs.length === 0 ? (
              <View style={[styles.emptyCard, { backgroundColor: isDark ? '#161a23' : '#fff', borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)' }]}>
                <Icon name="tray-remove" size={28} color={isDark ? '#374151' : '#D1D5DB'} />
                <Text style={[styles.emptyText, { color: isDark ? '#6b7280' : '#9CA3AF' }]}>
                  Henüz belge oluşturmadınız
                </Text>
              </View>
            ) : (
              recentPDFs.map((pdf, i) => {
                const isSharing = sharingId === pdf.id;
                const hasFile = !!pdf.permanentUri;
                const catIcon = getCategoryIcon(pdf.category);
                return (
                  <TouchableOpacity
                    key={pdf.id || i}
                    style={[styles.recentItem, { backgroundColor: isDark ? '#161a23' : '#fff', borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)' }]}
                    onPress={() => navigation.navigate('History')}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.recentIconWrap, { backgroundColor: isDark ? '#1e2330' : '#F3F4F6' }]}>
                      <Icon name={catIcon.name} size={18} color={catIcon.color} />
                    </View>
                    <View style={styles.recentInfo}>
                      <Text style={[styles.recentName, { color: isDark ? '#f0f2f8' : '#0F172A' }]} numberOfLines={1}>{pdf.title}</Text>
                      <Text style={[styles.recentMeta, { color: isDark ? '#6b7280' : '#9CA3AF' }]}>
                        {pdf.category} · {formatDate(pdf.timestamp)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.recentShare, { backgroundColor: hasFile ? 'rgba(201,168,76,0.15)' : (isDark ? '#1e2330' : '#F3F4F6'), borderColor: hasFile ? 'rgba(201,168,76,0.4)' : (isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)') }]}
                      onPress={() => handleShare(pdf)}
                      disabled={isSharing}
                      activeOpacity={0.7}
                    >
                      {isSharing
                        ? <ActivityIndicator size="small" color={GOLD} />
                        : <Icon name={hasFile ? 'share-variant-outline' : 'download-outline'} size={15} color={hasFile ? GOLD : (isDark ? '#6b7280' : '#9CA3AF')} />
                      }
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── FORMAT PICKER MODAL ── */}
      <Modal visible={showFormatPicker} transparent animationType="slide" onRequestClose={() => setShowFormatPicker(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowFormatPicker(false)}>
          <View style={[styles.modalSheet, { backgroundColor: isDark ? '#161a23' : '#fff' }]}>
            <View style={[styles.modalHandle, { backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)' }]} />
            <Text style={[styles.modalTitle, { color: isDark ? '#f0f2f8' : '#0F172A' }]}>Format Seçin</Text>
            <View style={styles.formatTiles}>
              {[
                { iconName: 'cellphone', label: 'Dikey', sub: 'Story · Vitrin · A4', mode: 'sales-card-story', color: '#5ddb8a', bg: 'rgba(61,186,124,0.14)', border: 'rgba(61,186,124,0.3)' },
                { iconName: 'crop-square', label: 'Kare', sub: 'Satış kartı · 1:1', mode: 'sales-card-post', color: '#c9a84c', bg: 'rgba(201,168,76,0.14)', border: 'rgba(201,168,76,0.3)' },
                { iconName: 'instagram', label: 'Story', sub: 'Sosyal medya · 9:16', mode: 'social', color: '#a07aff', bg: 'rgba(130,90,255,0.14)', border: 'rgba(130,90,255,0.28)' },
              ].map((f) => (
                <TouchableOpacity
                  key={f.label}
                  style={[styles.formatTile, { backgroundColor: f.bg, borderColor: f.border }]}
                  onPress={() => { setShowFormatPicker(false); navigation.navigate('Category', { mode: f.mode }); }}
                  activeOpacity={0.8}
                >
                  <Icon name={f.iconName} size={30} color={f.color} />
                  <Text style={[styles.formatTileLabel, { color: isDark ? '#f0f2f8' : '#0F172A' }]}>{f.label}</Text>
                  <Text style={[styles.formatTileSub, { color: isDark ? '#6b7280' : '#9CA3AF' }]}>{f.sub}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── BOTTOM NAV ── */}
      <View style={[styles.bottomNav, { borderTopColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)', paddingBottom: Math.max(insets.bottom, 12) }]}>
        <LinearGradient
          colors={isDark ? ['rgba(13,15,20,0)', 'rgba(13,15,20,0.97)'] : ['rgba(249,250,251,0)', 'rgba(249,250,251,0.97)']}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        {[
          { iconName: 'home',                    label: 'Ana Sayfa', active: true,  onPress: undefined },
          { iconName: 'file-document-multiple-outline', label: 'Belgeler',  active: false, onPress: () => navigation.navigate('History') },
          { iconName: 'tools',                   label: 'Servis',    active: false, onPress: () => navigation.navigate('TeknikServis') },
          { iconName: 'cog-outline',             label: 'Ayarlar',   active: false, onPress: () => navigation.navigate('Settings') },
        ].map((item, i) => (
          <TouchableOpacity key={i} style={styles.navItem} onPress={item.onPress} activeOpacity={0.7}>
            <Icon
              name={item.iconName}
              size={22}
              color={item.active ? GOLD : (isDark ? '#6b7280' : '#9CA3AF')}
            />
            <Text style={[styles.navLabel, { color: item.active ? GOLD : (isDark ? '#6b7280' : '#9CA3AF') }]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  glow1: {
    position: 'absolute', top: -120, right: -80,
    width: 340, height: 340, borderRadius: 170,
    backgroundColor: 'rgba(201,168,76,0.08)',
  },
  glow2: {
    position: 'absolute', bottom: 100, left: -100,
    width: 280, height: 280, borderRadius: 140,
    backgroundColor: 'rgba(201,168,76,0.08)',
  },

  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 20 },

  header: {
    flexDirection: 'row', alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 24, paddingBottom: 24,
  },
  welcome: { fontSize: 12, color: '#6b7280', marginBottom: 4, fontWeight: '500', letterSpacing: 0.3 },
  logo: { fontSize: 30, fontWeight: '800', letterSpacing: -0.8, lineHeight: 34 },
  logoAccent: { color: GOLD },
  tagline: { fontSize: 12, color: '#6b7280', fontWeight: '400', marginTop: 5 },
  headerRight: { alignItems: 'flex-end', gap: 6, paddingTop: 6 },
  statChip: {
    borderRadius: 10, borderWidth: 1,
    paddingHorizontal: 10, paddingVertical: 5,
    flexDirection: 'row', alignItems: 'center', gap: 5,
  },
  statChipText: { fontSize: 11, color: '#6b7280' },
  statChipBold: { fontWeight: '700', fontSize: 11 },

  actionCards: { paddingHorizontal: 20, gap: 10, marginBottom: 32 },
  actionCard: {
    borderRadius: 20, padding: 20,
    flexDirection: 'row', alignItems: 'center', gap: 16,
    overflow: 'hidden', position: 'relative', borderWidth: 1,
  },
  actionCardShine: {
    position: 'absolute', top: 0, right: 0,
    width: 140, height: '100%',
    backgroundColor: 'rgba(255,255,255,0.025)',
  },
  actionIconWrap: {
    width: 50, height: 50, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, flexShrink: 0,
  },
  actionText: { flex: 1 },
  actionTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 4, letterSpacing: -0.2 },
  actionSub: { fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 15 },
  actionArrow: {
    width: 34, height: 34, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },

  sectionContainer: { marginBottom: 28 },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24, marginBottom: 14,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', letterSpacing: -0.3 },
  sectionLinkBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  sectionLink: { fontSize: 12, fontWeight: '600' },

  recentList: { paddingHorizontal: 20, gap: 8 },
  recentItem: {
    borderRadius: 14, borderWidth: 1,
    padding: 14, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  recentIconWrap: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  recentInfo: { flex: 1, minWidth: 0 },
  recentName: { fontSize: 13, fontWeight: '600', marginBottom: 2, letterSpacing: -0.1 },
  recentMeta: { fontSize: 11 },
  recentShare: {
    width: 32, height: 32, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, flexShrink: 0,
  },
  emptyCard: {
    borderRadius: 14, borderWidth: 1,
    padding: 28, alignItems: 'center', gap: 10,
    marginHorizontal: 20,
  },
  emptyText: { fontSize: 13 },

  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.55)' },
  modalSheet: {
    borderTopLeftRadius: 26, borderTopRightRadius: 26,
    paddingHorizontal: 24, paddingTop: 14, paddingBottom: 36,
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    alignSelf: 'center', marginBottom: 22,
  },
  modalTitle: { fontSize: 17, fontWeight: '700', marginBottom: 22, textAlign: 'center', letterSpacing: -0.3 },
  formatTiles: { flexDirection: 'row', gap: 12 },
  formatTile: {
    flex: 1, borderRadius: 16, borderWidth: 1,
    padding: 18, alignItems: 'center', gap: 8,
  },
  formatTileLabel: { fontSize: 14, fontWeight: '700' },
  formatTileSub: { fontSize: 10, textAlign: 'center', lineHeight: 14 },

  bottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 10, borderTopWidth: 1, overflow: 'hidden',
  },
  navItem: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 4 },
  navLabel: { fontSize: 10, fontWeight: '500', letterSpacing: 0.2 },
});
