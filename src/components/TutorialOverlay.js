import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TUTORIAL_KEY = '@alhazen_tutorial_completed';

const tutorialSteps = [
  {
    id: 1,
    screen: 'Home',
    title: 'Ana Sayfa 🏠',
    description: 'Buradan yeni PDF oluşturabilir, istatistiklerinizi görebilir ve tema değiştirebilirsiniz.',
    highlight: 'center',
  },
  {
    id: 2,
    screen: 'Category',
    title: 'Kategori Seçin 📁',
    description: 'PDF\'iniz için uygun kategoriyi seçin. Her kategori özel form alanlarıyla gelir.',
    highlight: 'top',
  },
  {
    id: 3,
    screen: 'Camera',
    title: 'Fotoğraf Ekleyin 📷',
    description: 'Uzun basarak fotoğrafları sürükleyip sıralayabilirsiniz. Sıralama butonuyla otomatik sıralama yapabilirsiniz.',
    highlight: 'middle',
  },
  {
    id: 4,
    screen: 'Template',
    title: 'Tema Seçin 🎨',
    description: '4 premium tema arasından seçim yapın. Premium temalar 21 fotoğrafa kadar destekler.',
    highlight: 'middle',
  },
];

export default function TutorialOverlay({ currentScreen, onComplete }) {
  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tutorialCompleted, setTutorialCompleted] = useState(true);

  useEffect(() => {
    checkTutorial();
  }, []);

  useEffect(() => {
    if (!tutorialCompleted && currentScreen) {
      const step = tutorialSteps.find(s => s.screen === currentScreen);
      if (step) {
        const stepIndex = tutorialSteps.indexOf(step);
        if (stepIndex === currentStep) {
          setVisible(true);
        }
      }
    }
  }, [currentScreen, currentStep, tutorialCompleted]);

  const checkTutorial = async () => {
    try {
      const completed = await AsyncStorage.getItem(TUTORIAL_KEY);
      setTutorialCompleted(!!completed);
    } catch (error) {
      console.error('Tutorial check error:', error);
      setTutorialCompleted(true);
    }
  };

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setVisible(false);
    } else {
      handleComplete();
    }
  };

  const handleSkip = async () => {
    await handleComplete();
  };

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem(TUTORIAL_KEY, 'true');
      setTutorialCompleted(true);
      setVisible(false);
      if (onComplete) onComplete();
    } catch (error) {
      console.error('Tutorial complete error:', error);
    }
  };

  if (tutorialCompleted || !visible) {
    return null;
  }

  const step = tutorialSteps[currentStep];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleSkip}
    >
      <View style={styles.overlay}>
        {/* Backdrop */}
        <TouchableOpacity 
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleSkip}
        />

        {/* Tutorial Card */}
        <View style={[styles.card, getCardPosition(step.highlight)]}>
          <LinearGradient
            colors={['#4F6EF7', '#10B981']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{step.title}</Text>
              <Text style={styles.cardStep}>
                {currentStep + 1}/{tutorialSteps.length}
              </Text>
            </View>
            
            <Text style={styles.cardDescription}>{step.description}</Text>

            <View style={styles.cardButtons}>
              <TouchableOpacity 
                style={styles.skipButton}
                onPress={handleSkip}
              >
                <Text style={styles.skipText}>Geç</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.nextButton}
                onPress={handleNext}
              >
                <Text style={styles.nextText}>
                  {currentStep < tutorialSteps.length - 1 ? 'İleri →' : 'Tamam ✓'}
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}

const getCardPosition = (highlight) => {
  switch (highlight) {
    case 'top':
      return { top: 100 };
    case 'middle':
      return { top: '40%' };
    case 'bottom':
      return { bottom: 100 };
    default:
      return { top: '35%' };
  }
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  card: {
    position: 'absolute',
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardGradient: {
    padding: 24,
    minWidth: 300,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    flex: 1,
  },
  cardStep: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cardDescription: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.95)',
    lineHeight: 22,
    marginBottom: 20,
  },
  cardButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  skipButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  skipText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
  },
  nextText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});

export { TUTORIAL_KEY };
