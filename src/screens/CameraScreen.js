import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, StatusBar, Modal, PanResponder, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../themes/colors';

const MAX_PHOTOS = 25;

// Grid sabitleri
const { width: SCREEN_W } = Dimensions.get('window');
const GRID_PAD = 20;
const GRID_GAP = 8;
const NUM_COLS = 3;
const ITEM_SIZE = Math.floor((SCREEN_W - GRID_PAD * 2 - GRID_GAP * (NUM_COLS - 1)) / NUM_COLS);

const POSITIONER_W = 280;
const POSITIONER_H = 170;

// Tek fotoğraf kartı — kendi PanResponder'ı var
function SortablePhotoItem({ item, index, total, dragFromIndex, dragToIndex, onDragStart, onDragMove, onDragEnd, onEdit, onRemove, theme }) {
  const indexRef = useRef(index);
  indexRef.current = index;
  const totalRef = useRef(total);
  totalRef.current = total;

  const calcToIndex = (dx, dy) => {
    const colDelta = Math.round(dx / (ITEM_SIZE + GRID_GAP));
    const rowDelta = Math.round(dy / (ITEM_SIZE + GRID_GAP));
    const fromRow = Math.floor(indexRef.current / NUM_COLS);
    const fromCol = indexRef.current % NUM_COLS;
    const toRow = Math.max(0, Math.min(Math.floor((totalRef.current - 1) / NUM_COLS), fromRow + rowDelta));
    const toCol = Math.max(0, Math.min(NUM_COLS - 1, fromCol + colDelta));
    return Math.min(totalRef.current - 1, toRow * NUM_COLS + toCol);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dx) + Math.abs(gs.dy) > 8,
      onPanResponderGrant: () => {
        onDragStart(indexRef.current);
      },
      onPanResponderMove: (_, gs) => {
        onDragMove(calcToIndex(gs.dx, gs.dy));
      },
      onPanResponderRelease: (_, gs) => {
        onDragEnd(indexRef.current, calcToIndex(gs.dx, gs.dy));
      },
      onPanResponderTerminate: () => {
        onDragEnd(indexRef.current, indexRef.current);
      },
    })
  ).current;

  const isDragging = dragFromIndex === index;
  const isTarget  = dragToIndex !== null && dragToIndex === index && dragFromIndex !== index;

  return (
    <View
      style={[
        { width: ITEM_SIZE, height: ITEM_SIZE, borderRadius: 12, overflow: 'hidden', position: 'relative' },
        isDragging && { opacity: 0.45, transform: [{ scale: 1.05 }] },
        isTarget  && { borderWidth: 3, borderColor: '#4F6EF7', borderRadius: 12 },
      ]}
      {...panResponder.panHandlers}
    >
      <Image source={{ uri: item.uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />

      {/* Sıra numarası */}
      <View style={{ position: 'absolute', bottom: 6, left: 6, width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.blue }}>
        <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff' }}>{index + 1}</Text>
      </View>

      {/* Sürükle tutacağı */}
      <View style={{ position: 'absolute', bottom: 6, right: 6, width: 28, height: 28, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.surface2, borderColor: theme.border }}>
        <Text style={{ fontSize: 13, fontWeight: 'bold', letterSpacing: -2, color: theme.textSecondary }}>⋮⋮</Text>
      </View>

      {/* Düzenle butonu */}
      <TouchableOpacity
        style={{ position: 'absolute', top: 6, right: 30, width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', zIndex: 3, backgroundColor: theme.blue, borderWidth: 2, borderColor: '#fff' }}
        onPress={() => onEdit(item)}
        activeOpacity={0.8}
      >
        <Text style={{ fontSize: 11, color: '#fff', fontWeight: '700' }}>✎</Text>
      </TouchableOpacity>

      {/* Sil butonu */}
      <TouchableOpacity
        style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', zIndex: 3, backgroundColor: 'rgba(220,50,50,0.9)', borderWidth: 2, borderColor: '#fff' }}
        onPress={() => onRemove(item.id)}
        activeOpacity={0.8}
      >
        <Text style={{ fontSize: 12, color: '#fff', fontWeight: '700' }}>✕</Text>
      </TouchableOpacity>

      {/* Sürükleme vurgusu */}
      {isDragging && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(79,110,247,0.25)', borderWidth: 2, borderColor: '#4F6EF7', borderRadius: 12 }} pointerEvents="none" />
      )}
    </View>
  );
}

// Sıralanabilir grid
function SortablePhotoGrid({ images, onReorder, onEdit, onRemove, theme }) {
  const [dragState, setDragState] = useState(null); // { fromIndex, toIndex }

  const handleDragStart = (fromIndex) => {
    setDragState({ fromIndex, toIndex: fromIndex });
  };

  const handleDragMove = (toIndex) => {
    setDragState(prev => prev ? { ...prev, toIndex } : null);
  };

  const handleDragEnd = (fromIndex, toIndex) => {
    if (fromIndex !== toIndex && toIndex >= 0 && toIndex < images.length) {
      const arr = [...images];
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
      onReorder(arr);
    }
    setDragState(null);
  };

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: GRID_GAP, paddingBottom: 20 }}>
      {images.map((item, index) => (
        <SortablePhotoItem
          key={item.id}
          item={item}
          index={index}
          total={images.length}
          dragFromIndex={dragState?.fromIndex ?? null}
          dragToIndex={dragState?.toIndex ?? null}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
          onEdit={onEdit}
          onRemove={onRemove}
          theme={theme}
        />
      ))}
    </View>
  );
}

function PhotoPositioner({ image, onPositionChange }) {
  const imgW = image.width || 1200;
  const imgH = image.height || 1600;

  const scale = Math.max(POSITIONER_W / imgW, POSITIONER_H / imgH);
  const scaledW = Math.round(imgW * scale);
  const scaledH = Math.round(imgH * scale);
  const maxPanX = Math.max(0, (scaledW - POSITIONER_W) / 2);
  const maxPanY = Math.max(0, (scaledH - POSITIONER_H) / 2);

  const initOffset = () => {
    if (image.objectPosition) {
      const ox = maxPanX > 0 ? ((50 - image.objectPosition.x) / 50) * maxPanX : 0;
      const oy = maxPanY > 0 ? ((50 - image.objectPosition.y) / 50) * maxPanY : 0;
      return {
        x: Math.max(-maxPanX, Math.min(maxPanX, ox)),
        y: Math.max(-maxPanY, Math.min(maxPanY, oy)),
      };
    }
    return { x: 0, y: 0 };
  };

  const offsetRef = useRef(initOffset());
  const gestureStartRef = useRef({ x: 0, y: 0 });
  const [offset, setOffset] = useState(offsetRef.current);

  const posX = maxPanX > 0 ? Math.round(50 - (offset.x / maxPanX) * 50) : 50;
  const posY = maxPanY > 0 ? Math.round(50 - (offset.y / maxPanY) * 50) : 50;

  const posLabel = () => {
    const h = posX < 30 ? 'Sol' : posX > 70 ? 'Sağ' : 'Orta';
    const v = posY < 30 ? 'Üst' : posY > 70 ? 'Alt' : 'Merkez';
    if (h === 'Orta' && v === 'Merkez') return 'Merkez';
    if (h === 'Orta') return v;
    if (v === 'Merkez') return h;
    return `${v}-${h}`;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        gestureStartRef.current = { ...offsetRef.current };
      },
      onPanResponderMove: (_, gs) => {
        const newX = Math.max(-maxPanX, Math.min(maxPanX, gestureStartRef.current.x + gs.dx));
        const newY = Math.max(-maxPanY, Math.min(maxPanY, gestureStartRef.current.y + gs.dy));
        offsetRef.current = { x: newX, y: newY };
        setOffset({ x: newX, y: newY });
      },
      onPanResponderRelease: () => {
        const px = maxPanX > 0 ? Math.round(50 - (offsetRef.current.x / maxPanX) * 50) : 50;
        const py = maxPanY > 0 ? Math.round(50 - (offsetRef.current.y / maxPanY) * 50) : 50;
        onPositionChange({ x: px, y: py });
      },
    })
  ).current;

  const imgLeft = (POSITIONER_W - scaledW) / 2 + offset.x;
  const imgTop = (POSITIONER_H - scaledH) / 2 + offset.y;

  return (
    <View style={{ alignItems: 'center', gap: 8 }}>
      <View
        style={{ width: POSITIONER_W, height: POSITIONER_H, overflow: 'hidden', borderRadius: 10, backgroundColor: '#000' }}
        {...panResponder.panHandlers}
      >
        <Image
          source={{ uri: image.uri }}
          style={{ position: 'absolute', width: scaledW, height: scaledH, left: imgLeft, top: imgTop }}
        />
        {/* Crosshair overlay */}
        <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 28, height: 2, backgroundColor: 'rgba(255,255,255,0.85)' }} />
          <View style={{ position: 'absolute', width: 2, height: 28, backgroundColor: 'rgba(255,255,255,0.85)' }} />
          <View style={{ position: 'absolute', width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: '#fff' }} />
        </View>
        {/* Corner brackets */}
        <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <View style={{ position: 'absolute', top: 8, left: 8, width: 18, height: 18, borderTopWidth: 2, borderLeftWidth: 2, borderColor: 'rgba(255,255,255,0.55)' }} />
          <View style={{ position: 'absolute', top: 8, right: 8, width: 18, height: 18, borderTopWidth: 2, borderRightWidth: 2, borderColor: 'rgba(255,255,255,0.55)' }} />
          <View style={{ position: 'absolute', bottom: 8, left: 8, width: 18, height: 18, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: 'rgba(255,255,255,0.55)' }} />
          <View style={{ position: 'absolute', bottom: 8, right: 8, width: 18, height: 18, borderBottomWidth: 2, borderRightWidth: 2, borderColor: 'rgba(255,255,255,0.55)' }} />
        </View>
      </View>
      <Text style={{ fontSize: 12, color: '#888', textAlign: 'center' }}>
        {'Odak: '}
        <Text style={{ fontWeight: '700', color: '#6FA3FF' }}>{posLabel()}</Text>
        {'  ·  '}{posX}% / {posY}%
      </Text>
    </View>
  );
}

export default function CameraScreen({ route, navigation }) {
  const { category, format } = route.params;
  const isPersonal = category.id === 'personal';
  const maxPhotos = isPersonal ? 1 : (format?.maxPhotos || MAX_PHOTOS);

  const [images, setImages] = useState([]);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  // Cleanup on unmount to free memory
  useEffect(() => {
    return () => {
      setImages([]);
    };
  }, []);

  const pickImage = async (fromCamera = false) => {
    try {
      const permissionResult = fromCamera 
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('İzin Gerekli', 'Fotoğraf eklemek için izin vermeniz gerekiyor.');
        return;
      }

      const result = fromCamera
        ? await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.95,
            base64: true,
          })
        : await ImagePicker.launchImageLibraryAsync({
            allowsMultipleSelection: true,
            quality: 0.95,
            base64: true,
          });

      if (!result.canceled) {
        if (result.assets) {
          // Get dimensions for each image
          const newImagesWithDimensions = await Promise.all(
            result.assets.map(async (asset, idx) => {
              return new Promise((resolve) => {
                Image.getSize(asset.uri, (width, height) => {
                  resolve({
                    id: `${Date.now()}_${idx}`,
                    uri: asset.uri,
                    base64: asset.base64,
                    fileName: asset.fileName || asset.uri.split('/').pop(),
                    timestamp: asset.exif?.DateTime || new Date().toISOString(),
                    width,
                    height,
                    isPortrait: height > width,
                  });
                }, () => {
                  // Fallback if getSize fails
                  resolve({
                    id: `${Date.now()}_${idx}`,
                    uri: asset.uri,
                    base64: asset.base64,
                    fileName: asset.fileName || asset.uri.split('/').pop(),
                    timestamp: asset.exif?.DateTime || new Date().toISOString(),
                    width: 1200,
                    height: 1600,
                    isPortrait: true,
                  });
                });
              });
            })
          );
          
          const totalImages = images.length + newImagesWithDimensions.length;
          if (totalImages > maxPhotos) {
            Alert.alert('Limit', `Maksimum ${maxPhotos} fotoğraf ekleyebilirsiniz.`);
            return;
          }
          
          setImages([...images, ...newImagesWithDimensions]);
        }
      }
    } catch (error) {
      Alert.alert('Hata', 'Fotoğraf eklenirken bir hata oluştu.');
    }
  };

  const removeImage = (itemId) => {
    const newImages = images.filter((img) => img.id !== itemId);
    setImages(newImages);
  };

  const sortImages = (sortType) => {
    let sortedImages = [...images];
    
    switch(sortType) {
      case 'date-asc':
        sortedImages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        break;
      case 'date-desc':
        sortedImages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        break;
      case 'name-asc':
        sortedImages.sort((a, b) => (a.fileName || '').localeCompare(b.fileName || ''));
        break;
      case 'name-desc':
        sortedImages.sort((a, b) => (b.fileName || '').localeCompare(a.fileName || ''));
        break;
      default:
        break;
    }
    
    setImages(sortedImages);
    setSortModalVisible(false);
    Alert.alert('✓ Sıralandı', `Fotoğraflar ${sortType.includes('date') ? 'tarihe' : 'isme'} göre sıralandı.`);
  };

  const openEditModal = (item) => {
    setSelectedImage(item);
    setEditModalVisible(true);
  };

  const handleRotateImage = async (degrees) => {
    try {
      if (!selectedImage) return;
      
      const manipResult = await ImageManipulator.manipulateAsync(
        selectedImage.uri,
        [{ rotate: degrees }],
        { compress: 0.95, format: ImageManipulator.SaveFormat.JPEG }
      );

      // Get new dimensions after rotation
      const newDimensions = await new Promise((resolve) => {
        Image.getSize(manipResult.uri, (width, height) => {
          resolve({ width, height, isPortrait: height > width });
        }, () => {
          // Fallback: swap dimensions for 90/270° rotations
          const swapDimensions = degrees === 90 || degrees === 270;
          resolve({
            width: swapDimensions ? selectedImage.height : selectedImage.width,
            height: swapDimensions ? selectedImage.width : selectedImage.height,
            isPortrait: swapDimensions ? selectedImage.width > selectedImage.height : selectedImage.isPortrait,
          });
        });
      });

      // Update image in array with new dimensions
      const updatedImages = images.map(img => 
        img.id === selectedImage.id 
          ? { ...img, uri: manipResult.uri, ...newDimensions }
          : img
      );
      
      setImages(updatedImages);
      setSelectedImage({ ...selectedImage, uri: manipResult.uri, ...newDimensions });
      Alert.alert('✓ Döndürüldü', `Fotoğraf ${degrees}° döndürüldü.`);
    } catch (error) {
      console.error('Rotate error:', error);
      Alert.alert('Hata', 'Fotoğraf döndürülürken hata oluştu.');
    }
  };

  const handleCropImage = async (cropType) => {
    try {
      if (!selectedImage) return;

      // Get image dimensions first
      const { width, height } = await new Promise((resolve) => {
        Image.getSize(selectedImage.uri, (w, h) => resolve({ width: w, height: h }));
      });

      let cropData;

      switch(cropType) {
        case 'square': {
          const size = Math.min(width, height);
          cropData = {
            originX: (width - size) / 2,
            originY: (height - size) / 2,
            width: size,
            height: size,
          };
          break;
        }
        case '16:9': {
          const targetRatio = 16 / 9;
          let cropWidth = width;
          let cropHeight = width / targetRatio;
          if (cropHeight > height) {
            cropHeight = height;
            cropWidth = height * targetRatio;
          }
          cropData = {
            originX: (width - cropWidth) / 2,
            originY: (height - cropHeight) / 2,
            width: cropWidth,
            height: cropHeight,
          };
          break;
        }
        case '4:3': {
          const ratio43 = 4 / 3;
          let crop43Width = width;
          let crop43Height = width / ratio43;
          if (crop43Height > height) {
            crop43Height = height;
            crop43Width = height * ratio43;
          }
          cropData = {
            originX: (width - crop43Width) / 2,
            originY: (height - crop43Height) / 2,
            width: crop43Width,
            height: crop43Height,
          };
          break;
        }
        default:
          return;
      }

      const manipResult = await ImageManipulator.manipulateAsync(
        selectedImage.uri,
        [{ crop: cropData }],
        { compress: 0.95, format: ImageManipulator.SaveFormat.JPEG }
      );

      // Get new dimensions after crop
      const newDimensions = await new Promise((resolve) => {
        Image.getSize(manipResult.uri, (width, height) => {
          resolve({ width, height, isPortrait: height > width });
        }, () => {
          // Fallback: use crop dimensions
          resolve({
            width: cropData.width,
            height: cropData.height,
            isPortrait: cropData.height > cropData.width,
          });
        });
      });

      // Update image in array with new dimensions
      const updatedImages = images.map(img => 
        img.id === selectedImage.id 
          ? { ...img, uri: manipResult.uri, ...newDimensions }
          : img
      );
      
      setImages(updatedImages);
      setSelectedImage({ ...selectedImage, uri: manipResult.uri, ...newDimensions });
      Alert.alert('✓ Kırpıldı', `Fotoğraf ${cropType} olarak kırpıldı.`);
    } catch (error) {
      console.error('Crop error:', error);
      Alert.alert('Hata', 'Fotoğraf kırpılırken hata oluştu.');
    }
  };

  const handlePositionChange = (position) => {
    if (!selectedImage) return;
    const updatedImages = images.map(img =>
      img.id === selectedImage.id ? { ...img, objectPosition: position } : img
    );
    setImages(updatedImages);
    setSelectedImage(prev => ({ ...prev, objectPosition: position }));
  };

  const handleContinue = async () => {
    if (!isPersonal && images.length === 0) {
      Alert.alert('Uyarı', 'En az 1 fotoğraf eklemelisiniz.');
      return;
    }
    if (category.id === 'expertizli') {
      await AsyncStorage.setItem('photos_expertizli', JSON.stringify(images));
      navigation.goBack();
      return;
    }
    navigation.navigate('Form', { category, images, format });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.bg} />

      {/* Nav Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={[styles.navBack, { backgroundColor: theme.surface2, borderColor: theme.border }]}
        >
          <Text style={[styles.navBackText, { color: theme.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: theme.text }]}>Fotoğraf Ekle</Text>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={theme.heroGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.photoHero, { borderBottomColor: theme.border }]}
        >
          <View style={[styles.heroGlow, { backgroundColor: isDark ? 'rgba(79,110,247,0.08)' : 'rgba(79,70,229,0.05)' }]} />
          
          {/* Category Badge */}
          <View style={[styles.photoCatBadge, { backgroundColor: theme.blueDim, borderColor: isDark ? 'rgba(79,110,247,0.2)' : 'rgba(79,70,229,0.2)' }]}>
            <View style={[styles.photoCatDot, { backgroundColor: theme.blueLight }]} />
            <Text style={[styles.photoCatLabel, { color: theme.blueLight }]}>{category.name}</Text>
          </View>

          <Text style={[styles.photoHeroTitle, { color: theme.text }]}>
            {isPersonal ? 'Profil Fotoğrafı\nEkleyin' : 'Fotoğraflarınızı\nEkleyin'}
          </Text>
          <Text style={[styles.photoHeroSub, { color: theme.textSecondary }]}>
            {isPersonal ? 'Opsiyonel · Maksimum 1 fotoğraf' : `Maksimum ${maxPhotos} fotoğraf`}
          </Text>

          {/* Progress Steps */}
          <View style={styles.progressBarWrap}>
            <View style={styles.progressSteps}>
              <View style={styles.progressStep}>
                <View style={[styles.progressCircle, styles.progressCircleDone, { backgroundColor: theme.green }]}>
                  <Text style={styles.progressCircleText}>✓</Text>
                </View>
                <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>Kategori</Text>
              </View>
              <View style={[styles.progressLine, styles.progressLineDone, { backgroundColor: theme.green }]} />
              <View style={styles.progressStep}>
                <View style={[styles.progressCircle, styles.progressCircleActive, { backgroundColor: theme.blue }]}>
                  <Text style={styles.progressCircleText}>2</Text>
                </View>
                <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>Fotoğraf</Text>
              </View>
              <View style={[styles.progressLine, styles.progressLinePending, { backgroundColor: theme.border }]} />
              <View style={styles.progressStep}>
                <View style={[styles.progressCircle, styles.progressCirclePending, { backgroundColor: theme.surface3, borderColor: theme.border }]}>
                  <Text style={[styles.progressCircleText, { color: theme.textDim }]}>3</Text>
                </View>
                <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>Bilgiler</Text>
              </View>
              <View style={[styles.progressLine, styles.progressLinePending, { backgroundColor: theme.border }]} />
              <View style={styles.progressStep}>
                <View style={[styles.progressCircle, styles.progressCirclePending, { backgroundColor: theme.surface3, borderColor: theme.border }]}>
                  <Text style={[styles.progressCircleText, { color: theme.textDim }]}>4</Text>
                </View>
                <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>Tema</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Upload Butonları — kompakt */}
          <View style={styles.uploadRow}>
            <TouchableOpacity
              style={[styles.uploadPill, { backgroundColor: theme.surface, borderColor: theme.borderBright }]}
              onPress={() => pickImage(true)}
              activeOpacity={0.75}
            >
              <Text style={styles.uploadPillEmoji}>📷</Text>
              <Text style={[styles.uploadPillLabel, { color: theme.text }]}>Kamera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.uploadPill, styles.uploadPillPrimary, { backgroundColor: theme.blue }]}
              onPress={() => pickImage(false)}
              activeOpacity={0.75}
            >
              <Text style={styles.uploadPillEmoji}>🖼️</Text>
              <Text style={[styles.uploadPillLabel, { color: '#fff' }]}>Galeriden Seç</Text>
            </TouchableOpacity>
          </View>

          {/* Sayaç + sırala — tek satır */}
          <View style={[styles.countRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.countText, { color: theme.textSecondary }]}>
              <Text style={[styles.countNum, { color: theme.blueLight }]}>{images.length}</Text>
              {'  /  '}{MAX_PHOTOS} fotoğraf
            </Text>
            {images.length > 1 && (
              <TouchableOpacity
                style={[styles.sortChip, { backgroundColor: theme.surface2, borderColor: theme.border }]}
                onPress={() => setSortModalVisible(true)}
              >
                <Text style={[styles.sortChipText, { color: theme.textSecondary }]}>⚡ Sırala</Text>
              </TouchableOpacity>
            )}
            {images.length === 0 && (
              <Text style={[styles.countHint, { color: theme.textDim }]}>
                {isPersonal ? 'Opsiyonel' : 'İlk foto kapak olur'}
              </Text>
            )}
          </View>

          {/* Sıralanabilir fotoğraf grid'i */}
          {images.length > 0 && (
            <SortablePhotoGrid
              images={images}
              onReorder={setImages}
              onEdit={openEditModal}
              onRemove={removeImage}
              theme={theme}
            />
          )}
        </View>
      </ScrollView>

      {/* Bottom Button */}
      {(images.length > 0 || isPersonal) && (
        <View style={[styles.bottomSafe, { backgroundColor: theme.bg }]}>
          <TouchableOpacity onPress={handleContinue}>
            <LinearGradient
              colors={theme.ctaGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.bottomBtn}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.3)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.bottomBtnGlow}
              />
              <Text style={styles.bottomBtnText}>
                {isPersonal && images.length === 0 ? 'Fotoğrafsız Devam Et →' : 'Devam Et →'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* Sort Modal */}
      <Modal
        visible={sortModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSortModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSortModalVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Sıralama Seçenekleri</Text>
            <Text style={[styles.modalSub, { color: theme.textSecondary }]}>Fotoğrafları nasıl sıralamak istersiniz?</Text>
            
            <View style={styles.sortOptions}>
              <TouchableOpacity 
                style={[styles.sortOption, { backgroundColor: theme.bg, borderColor: theme.border }]}
                onPress={() => sortImages('date-asc')}
              >
                <Text style={styles.sortOptionIcon}>📅</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.sortOptionLabel, { color: theme.text }]}>Tarihe Göre (Eski → Yeni)</Text>
                  <Text style={[styles.sortOptionDesc, { color: theme.textSecondary }]}>En eski fotoğraf başta</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.sortOption, { backgroundColor: theme.bg, borderColor: theme.border }]}
                onPress={() => sortImages('date-desc')}
              >
                <Text style={styles.sortOptionIcon}>📅</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.sortOptionLabel, { color: theme.text }]}>Tarihe Göre (Yeni → Eski)</Text>
                  <Text style={[styles.sortOptionDesc, { color: theme.textSecondary }]}>En yeni fotoğraf başta</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.sortOption, { backgroundColor: theme.bg, borderColor: theme.border }]}
                onPress={() => sortImages('name-asc')}
              >
                <Text style={styles.sortOptionIcon}>🔤</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.sortOptionLabel, { color: theme.text }]}>İsme Göre (A → Z)</Text>
                  <Text style={[styles.sortOptionDesc, { color: theme.textSecondary }]}>Alfabetik sıralama</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.sortOption, { backgroundColor: theme.bg, borderColor: theme.border }]}
                onPress={() => sortImages('name-desc')}
              >
                <Text style={styles.sortOptionIcon}>🔤</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.sortOptionLabel, { color: theme.text }]}>İsme Göre (Z → A)</Text>
                  <Text style={[styles.sortOptionDesc, { color: theme.textSecondary }]}>Ters alfabetik sıralama</Text>
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.modalCancel, { borderColor: theme.border }]}
              onPress={() => setSortModalVisible(false)}
            >
              <Text style={[styles.modalCancelText, { color: theme.textSecondary }]}>İptal</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setEditModalVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]} onStartShouldSetResponder={() => true}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Fotoğraf Düzenle</Text>
            <Text style={[styles.modalSub, { color: theme.textSecondary }]}>Odak noktası, döndürme ve kırpma seçenekleri</Text>

            {/* PDF Focus Point */}
            {selectedImage && (
              <View style={styles.editSection}>
                <Text style={[styles.editSectionTitle, { color: theme.text }]}>📍 PDF Odak Noktası</Text>
                <Text style={[styles.editSectionSub, { color: theme.textSecondary }]}>Sürükleyerek PDF'te görünecek alanı seçin</Text>
                <PhotoPositioner
                  key={selectedImage.id}
                  image={selectedImage}
                  onPositionChange={handlePositionChange}
                />
              </View>
            )}
            
            <View style={styles.editOptions}>
              {/* Rotate Options */}
              <View style={styles.editSection}>
                <Text style={[styles.editSectionTitle, { color: theme.text }]}>🔄 Döndür</Text>
                <View style={styles.editRow}>
                  <TouchableOpacity 
                    style={[styles.editOption, { backgroundColor: theme.bg, borderColor: theme.border }]}
                    onPress={() => handleRotateImage(-90)}
                  >
                    <Text style={styles.editOptionIcon}>↶</Text>
                    <Text style={[styles.editOptionLabel, { color: theme.text }]}>90° Sola</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.editOption, { backgroundColor: theme.bg, borderColor: theme.border }]}
                    onPress={() => handleRotateImage(90)}
                  >
                    <Text style={styles.editOptionIcon}>↷</Text>
                    <Text style={[styles.editOptionLabel, { color: theme.text }]}>90° Sağa</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.editOption, { backgroundColor: theme.bg, borderColor: theme.border }]}
                    onPress={() => handleRotateImage(180)}
                  >
                    <Text style={styles.editOptionIcon}>↻</Text>
                    <Text style={[styles.editOptionLabel, { color: theme.text }]}>180°</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Crop Options */}
              <View style={styles.editSection}>
                <Text style={[styles.editSectionTitle, { color: theme.text }]}>✂️ Kırp</Text>
                <View style={styles.editRow}>
                  <TouchableOpacity 
                    style={[styles.editOption, { backgroundColor: theme.bg, borderColor: theme.border }]}
                    onPress={() => handleCropImage('square')}
                  >
                    <Text style={styles.editOptionIcon}>⬜</Text>
                    <Text style={[styles.editOptionLabel, { color: theme.text }]}>Kare (1:1)</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.editOption, { backgroundColor: theme.bg, borderColor: theme.border }]}
                    onPress={() => handleCropImage('4:3')}
                  >
                    <Text style={styles.editOptionIcon}>▭</Text>
                    <Text style={[styles.editOptionLabel, { color: theme.text }]}>4:3</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.editOption, { backgroundColor: theme.bg, borderColor: theme.border }]}
                    onPress={() => handleCropImage('16:9')}
                  >
                    <Text style={styles.editOptionIcon}>▬</Text>
                    <Text style={[styles.editOptionLabel, { color: theme.text }]}>16:9</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.modalCancel, { borderColor: theme.border }]}
              onPress={() => setEditModalVisible(false)}
            >
              <Text style={[styles.modalCancelText, { color: theme.textSecondary }]}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
    paddingBottom: 14,
    gap: 12,
  },
  navBack: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBackText: {
    fontSize: 16,
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  scrollContent: {
    flex: 1,
  },
  photoHero: {
    marginHorizontal: -20,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 28,
    borderBottomWidth: 1,
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    inset: 0,
  },
  photoCatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
    paddingLeft: 8,
    marginBottom: 12,
    alignSelf: 'center',
    zIndex: 1,
  },
  photoCatDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  photoCatLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  photoHeroTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
    zIndex: 1,
  },
  photoHeroSub: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '300',
    textAlign: 'center',
    zIndex: 1,
  },
  progressBarWrap: {
    marginTop: 16,
    zIndex: 1,
  },
  progressSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
  },
  progressStep: {
    alignItems: 'center',
    gap: 4,
  },
  progressCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  progressCircleDone: {},
  progressCircleActive: {
    shadowColor: 'rgba(79,110,247,0.4)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  progressCirclePending: {},
  progressCircleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  progressLabel: {
    fontSize: 8,
    letterSpacing: 0.5,
  },
  progressLine: {
    width: 40,
    height: 1,
    marginBottom: 14,
  },
  progressLineDone: {},
  progressLinePending: {},
  content: {
    padding: 20,
    gap: 12,
  },
  // Kompakt upload satırı
  uploadRow: {
    flexDirection: 'row',
    gap: 10,
  },
  uploadPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  uploadPillPrimary: {
    flex: 2,
    borderWidth: 0,
  },
  uploadPillEmoji: { fontSize: 17 },
  uploadPillLabel: { fontSize: 13, fontWeight: '600' },

  // Sayaç satırı
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  countText: { fontSize: 13 },
  countNum: { fontSize: 15, fontWeight: '800' },
  countHint: { fontSize: 11 },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  sortChipText: { fontSize: 12, fontWeight: '600' },

  // countDot hâlâ kullanılıyor (renderProgressDots kaldırıldı, ama bırakalım)
  countDot: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  sortButton: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sortEmoji: {
    fontSize: 18,
  },
  sortLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  sortSub: {
    fontSize: 10,
    marginTop: 2,
  },
  sortArrow: {
    fontSize: 24,
    fontWeight: '300',
  },
  removeButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '700',
  },
  dragIcon: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: -2,
  },
  bottomSafe: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 28,
  },
  bottomBtn: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  bottomBtnGlow: {
    position: 'absolute',
    top: 0,
    left: '30%',
    right: '30%',
    height: 1,
  },
  bottomBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    gap: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  modalSub: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 8,
  },
  sortOptions: {
    gap: 10,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  sortOptionIcon: {
    fontSize: 24,
  },
  sortOptionLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  sortOptionDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  modalCancel: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 8,
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
  },
  editPreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
    marginVertical: 16,
  },
  editPreviewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  editOptions: {
    width: '100%',
    gap: 16,
  },
  editSection: {
    width: '100%',
  },
  editSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  editSectionSub: {
    fontSize: 11,
    fontWeight: '300',
    marginBottom: 10,
  },
  editRow: {
    flexDirection: 'row',
    gap: 8,
  },
  editOption: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
  },
  editOptionIcon: {
    fontSize: 20,
  },
  editOptionLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});
