// TourCoachmark.tsx
import { createTour, useCoachmark } from '@edwardloopez/react-native-coachmark';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
} from 'react-native';

const TourCoachmark = ({
  visible,
  title,
  content,
  targetPosition,
  targetSize = { width: 60, height: 60 },
  currentStep = 0,
  totalSteps = 1,
  onNext,
  onPrevious,
  onComplete,
  onSkip,
  isFirstStep = true,
  isLastStep = true,
  tooltipBackgroundColor = '#1a4b6e',
  overlayColor = 'rgba(0, 0, 0, 0.7)',
  enableSkip = true,
  animationDuration = 400,
  anchorId,
  steps = [], // اضافه کردن steps به عنوان prop
}) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [tourStarted, setTourStarted] = useState(false);
  const tourKeyRef = useRef(`tour-${Date.now()}`);
  
  const { start, next, back, skip, stop, state } = useCoachmark();

  // ساخت استپ‌ها برای تور
  const buildSteps = () => {
    // اگر steps به عنوان prop ارسال شده، از آن استفاده کن
    if (steps && steps.length > 0) {
      return steps.map((step, index) => ({
        id: step.target || step.id || `step-${index}`,
        title: step.title || '',
        description: step.content || step.description || '',
        placement: 'bottom',
        shape: 'circle',
      }));
    }
    
    // در غیر این صورت از یک استپ استفاده کن
    return [{
      id: anchorId || 'default-anchor',
      title: title || 'راهنما',
      description: content || '',
      placement: 'bottom',
      shape: 'circle',
    }];
  };

  // شروع یا به‌روزرسانی تور
  useEffect(() => {
    if (visible && !tourStarted) {
      const tourSteps = buildSteps();
      
      if (tourSteps.length > 0) {
        const tour = createTour(
          tourKeyRef.current,
          tourSteps,
          {
            showOnce: false,
            delay: 100,
            nextOnBackdropPress: true,
          }
        );
        start(tour);
        setTourStarted(true);
      }
    }
  }, [visible, anchorId, title, content, steps]);

  // به‌روزرسانی استپ فعلی وقتی currentStep تغییر می‌کند
  useEffect(() => {
    if (visible && tourStarted && state) {
      const currentActiveStep = state.index || 0;
      
      if (currentActiveStep !== currentStep) {
        if (currentStep > currentActiveStep) {
          next();
        } else if (currentStep < currentActiveStep) {
          back();
        }
      }
    }
  }, [currentStep, state, visible, tourStarted]);

  // انیمیشن
  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: animationDuration,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
      if (tourStarted) {
        stop();
        setTourStarted(false);
      }
    }
  }, [visible, animationDuration]);

  // اگر visible نباشد
  if (!visible) return null;

  // اگر استپ‌ها وجود دارند و از Coachmark استفاده می‌شود
  if (steps && steps.length > 0) {
    return (
      <View style={styles.anchorContainer}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Coachmark خودش از طریق Provider مدیریت می‌شود */}
        </Animated.View>
      </View>
    );
  }

  // حالت ساده (fallback)
  return (
    <Animated.View 
      style={[
        styles.simpleTooltip,
        {
          opacity: fadeAnim,
          left: targetPosition?.x - 150 || screenWidth / 2 - 150,
          top: targetPosition?.y + 60 || screenHeight / 3,
          backgroundColor: tooltipBackgroundColor,
        }
      ]}
    >
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content}>{content}</Text>
      
      <View style={styles.buttonRow}>
        {!isFirstStep && (
          <TouchableOpacity onPress={onPrevious} style={styles.prevButton}>
            <Text style={styles.prevButtonText}>قبلی</Text>
          </TouchableOpacity>
        )}
        
        {enableSkip && (
          <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
            <Text style={styles.skipButtonText}>رد کردن</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          onPress={isLastStep ? onComplete : onNext}
          style={styles.nextButton}
        >
          <Text style={styles.nextButtonText}>
            {isLastStep ? 'پایان' : 'بعدی'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.stepIndicator}>
        <Text style={styles.stepText}>
          {currentStep + 1} / {totalSteps}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  simpleTooltip: {
    position: 'absolute',
    width: 300,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 9999,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'Kaghaz',
    marginBottom: 8,
  },
  content: {
    fontSize: 15,
    color: '#e0e0e0',
    fontFamily: 'Kaghaz',
    marginBottom: 16,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  prevButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  prevButtonText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontFamily: 'Kaghaz',
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  skipButtonText: {
    color: '#ff6b6b',
    fontSize: 14,
    fontFamily: 'Kaghaz',
  },
  nextButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  nextButtonText: {
    color: '#1a4b6e',
    fontSize: 14,
    fontFamily: 'Kaghaz',
    fontWeight: 'bold',
  },
  stepIndicator: {
    alignItems: 'center',
    marginTop: 12,
  },
  stepText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontFamily: 'Kaghaz',
  },
  anchorContainer: {
    position: 'absolute',
    width: 1,
    height: 1,
  },
});

export default TourCoachmark;