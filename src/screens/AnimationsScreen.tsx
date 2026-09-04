import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Screen from '../components/Screen';
import LessonHeader from '../components/LessonHeader';
import PrimaryButton from '../components/PrimaryButton';
import { useAppTheme } from '../context/ThemeContext';

// LESSON: elements that only become visible/stable after an animation
// finishes. The right way to assert on these in Detox is
// `waitFor(element(by.id(...))).toBeVisible().withTimeout(3000)` instead of
// a fixed sleep, because animation duration can vary per device.
const AnimationsScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const [cardVisible, setCardVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const bar = useRef(new Animated.Value(0)).current;

  const revealCard = () => {
    setCardVisible(true);
    fade.setValue(0);
    scale.setValue(0.8);
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 1200, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  const hideCard = () => {
    Animated.timing(fade, { toValue: 0, duration: 300, useNativeDriver: true }).start(() =>
      setCardVisible(false),
    );
  };

  const runProgress = () => {
    setProgress(0);
    bar.setValue(0);
    Animated.timing(bar, { toValue: 1, duration: 2000, useNativeDriver: false }).start();
    bar.addListener(({ value }) => setProgress(Math.round(value * 100)));
  };

  return (
    <Screen testID="animations-screen">
      <LessonHeader
        testID="animations-header"
        title="Animations"
        subtitle="A delayed fade/scale card, and a progress bar — both best asserted with waitFor()."
      />

      <PrimaryButton
        testID="animations-reveal-button"
        title={cardVisible ? 'Hide card (fades out)' : 'Reveal card (1.2s fade)'}
        onPress={cardVisible ? hideCard : revealCard}
      />

      {cardVisible && (
        <Animated.View
          testID="animations-card"
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border, opacity: fade, transform: [{ scale }] },
          ]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>I faded in over 1.2s</Text>
          <Text style={{ color: theme.subtext }}>
            waitFor(element(by.id('animations-card'))).toBeVisible().withTimeout(2000)
          </Text>
        </Animated.View>
      )}

      <PrimaryButton
        testID="animations-progress-button"
        title="Run 2s progress bar"
        variant="secondary"
        onPress={runProgress}
        style={styles.progressButton}
      />
      <View style={[styles.track, { borderColor: theme.border }]}>
        <Animated.View
          testID="animations-progress-fill"
          style={[
            styles.fill,
            {
              backgroundColor: theme.primary,
              width: bar.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
            },
          ]}
        />
      </View>
      <Text testID="animations-progress-text" style={[styles.progressText, { color: theme.subtext }]}>
        {progress}%
      </Text>
    </Screen>
  );
};

const styles = StyleSheet.create({
  card: { marginTop: 20, padding: 18, borderRadius: 12, borderWidth: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  progressButton: { marginTop: 28 },
  track: { height: 14, borderRadius: 7, borderWidth: 1, marginTop: 16, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 7 },
  progressText: { marginTop: 8, fontSize: 13 },
});

export default AnimationsScreen;
