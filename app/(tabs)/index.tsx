// index.tsx
import GameCard from '@/components/home/gameCard';
import ProfileCard from '@/components/home/profileCard';
import TourCoachmark from '@/components/TourCoachmark';
import { homeTourSteps } from '@/constants/tourSteps';
import { useTour } from '@/hooks/useTour';
import { CoachmarkAnchor } from '@edwardloopez/react-native-coachmark';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, useWindowDimensions, View } from 'react-native';

const games = [
  //{ id: 1, title: 'تخته نرد ایرانی', bgColor: '#1d5cdd', textColor: '#1d5cdd', mode: 'aiVsAi' },
  { id: 2, title: 'تخته نرد استاندارد', bgColor: '#7c3aed', textColor: '#7c3aed', mode: 'standard' },
  { id: 3, title: 'تفننی', bgColor: '#ea580c', textColor: '#ea580c', mode: 'fun' },
  //{ id: 4, title: 'دو نفره', bgColor: '#dc2626', textColor: '#dc2626', mode: 'twoPlayer' },
  // { id: 4, title: 'هوش مصنوعی', bgColor: '#dc2626', textColor: '#dc2626', mode: 'AIvsAI' },
];

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const cardWidth = width * 0.9;
  const cardHeight = height * 0.18;
  const [isMeasuring, setIsMeasuring] = useState(true);

  const profileRef = useRef(null);
  const gameCardRef = useRef(null);

  const tour = useTour('home', homeTourSteps, {
    autoStart: true,
    delay: 800,
    onComplete: () => console.log('Home tour completed'),
  });

  useEffect(() => {
    setTimeout(() => {
      setIsMeasuring(false);
    }, 500);
  }, []);

  if (isMeasuring && !tour.isVisible) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#1a4b6e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CoachmarkAnchor id="profile" shape="circle" padding={12}>
        <View ref={profileRef}>
          <ProfileCard />
        </View>
      </CoachmarkAnchor>

      <View style={styles.cardsContainer}>
        {games.map((game, index) => (
          <CoachmarkAnchor
            key={game.id}
            id={index === 0 ? 'gameCard' : `gameCard_${game.id}`}
            shape="rect"
            padding={12}
            radius={12}
          >
            <View ref={index === 0 ? gameCardRef : null}>
              <GameCard
                game={game}
                cardWidth={cardWidth}
                cardHeight={cardHeight}
                imageWidth={cardWidth * 0.4}
                imageHeight={cardWidth * 0.4 * 0.8}
              />
            </View>
          </CoachmarkAnchor>
        ))}
      </View>

      {/* ارسال تمام استپ‌ها به TourCoachmark */}
      <TourCoachmark
        visible={tour.isVisible && tour.isReady}
        title={tour.currentStepData?.title}
        content={tour.currentStepData?.content}
        targetPosition={tour.targetPosition}
        currentStep={tour.currentStep}
        totalSteps={tour.totalSteps}
        onNext={tour.nextStep}
        onPrevious={tour.previousStep}
        onComplete={tour.completeTour}
        onSkip={tour.skipTour}
        isFirstStep={tour.isFirstStep}
        isLastStep={tour.isLastStep}
        tooltipBackgroundColor={tour.currentStepData?.tooltipBackgroundColor}
        enableSkip={tour.canSkip}
        steps={homeTourSteps.map(step => ({
          ...step,
          target: step.target,
          description: step.content,
        }))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: '2.5%',
  },
});