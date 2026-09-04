import React, { useRef, useState } from 'react';
import { Animated, PanResponder, StyleSheet, Text, View } from 'react-native';
import {
  LongPressGestureHandler,
  PinchGestureHandler,
  State,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import Screen from '../components/Screen';
import LessonHeader from '../components/LessonHeader';
import { useAppTheme } from '../context/ThemeContext';

// LESSON: long press, double tap, drag and pinch. Detox drives these with
// element.longPress(), element.multiTap(2), element.swipe(direction) and
// element.pinch(scale, direction). Every derived value is mirrored into a
// plain <Text> node so specs can assert on outcome without reading native
// transform matrices.
const GesturesScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const [longPressed, setLongPressed] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [dragCount, setDragCount] = useState(0);
  const [pinchScale, setPinchScale] = useState<number | null>(null);

  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        setDragCount(prev => prev + 1);
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
      },
    }),
  ).current;

  const onPinchEvent = Animated.event([{ nativeEvent: { scale } }], { useNativeDriver: true });
  const onPinchStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      setPinchScale(Number(event.nativeEvent.scale.toFixed(2)));
      Animated.timing(scale, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    }
  };

  return (
    <Screen testID="gestures-screen">
      <LessonHeader
        testID="gestures-header"
        title="Gestures"
        subtitle="Long press, double tap, drag and pinch — each mirrored to text for easy assertions."
      />

      <Text style={[styles.sectionLabel, { color: theme.text }]}>Long press (800ms)</Text>
      <LongPressGestureHandler
        minDurationMs={800}
        onHandlerStateChange={event => {
          if (event.nativeEvent.state === State.ACTIVE) {
            setLongPressed(prev => !prev);
          }
        }}>
        <View
          testID="gestures-long-press-box"
          accessibilityLabel="Long press me"
          style={[styles.box, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.boxText, { color: theme.text }]}>Hold for 800ms</Text>
        </View>
      </LongPressGestureHandler>
      {longPressed && (
        <View testID="gestures-long-press-menu" style={[styles.menu, { backgroundColor: theme.primary }]}>
          <Text style={styles.menuText}>Context menu revealed!</Text>
        </View>
      )}

      <Text style={[styles.sectionLabel, { color: theme.text }]}>Double tap</Text>
      <TapGestureHandler
        numberOfTaps={2}
        onHandlerStateChange={event => {
          if (event.nativeEvent.state === State.ACTIVE) {
            setTapCount(prev => prev + 1);
          }
        }}>
        <View
          testID="gestures-double-tap-box"
          accessibilityLabel="Double tap me"
          style={[styles.box, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.boxText, { color: theme.text }]}>Double tap here</Text>
        </View>
      </TapGestureHandler>
      <Text testID="gestures-double-tap-count" style={[styles.value, { color: theme.subtext }]}>
        Double taps: {tapCount}
      </Text>

      <Text style={[styles.sectionLabel, { color: theme.text }]}>Drag</Text>
      <View style={[styles.dragArena, { borderColor: theme.border }]}>
        <Animated.View
          testID="gestures-drag-box"
          accessibilityLabel="Drag me"
          {...panResponder.panHandlers}
          style={[
            styles.dragBox,
            { backgroundColor: theme.primary },
            { transform: pan.getTranslateTransform() },
          ]}
        />
      </View>
      <Text testID="gestures-drag-count" style={[styles.value, { color: theme.subtext }]}>
        Drags completed: {dragCount}
      </Text>

      <Text style={[styles.sectionLabel, { color: theme.text }]}>Pinch to zoom</Text>
      <View style={[styles.pinchArena, { borderColor: theme.border }]}>
        <PinchGestureHandler onGestureEvent={onPinchEvent} onHandlerStateChange={onPinchStateChange}>
          <Animated.View
            testID="gestures-pinch-box"
            accessibilityLabel="Pinch me"
            style={[styles.pinchBox, { backgroundColor: theme.success }, { transform: [{ scale }] }]}
          />
        </PinchGestureHandler>
      </View>
      <Text testID="gestures-pinch-scale" style={[styles.value, { color: theme.subtext }]}>
        Last pinch scale: {pinchScale === null ? '—' : pinchScale}
      </Text>
    </Screen>
  );
};

const styles = StyleSheet.create({
  sectionLabel: { fontSize: 13, fontWeight: '600', marginTop: 20, marginBottom: 8 },
  box: {
    height: 90,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxText: { fontSize: 14, fontWeight: '600' },
  menu: { marginTop: 10, padding: 12, borderRadius: 8, alignItems: 'center' },
  menuText: { color: '#fff', fontWeight: '700' },
  value: { fontSize: 13, marginTop: 8 },
  dragArena: {
    height: 160,
    borderWidth: 1,
    borderRadius: 12,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragBox: { width: 70, height: 70, borderRadius: 12 },
  pinchArena: {
    height: 160,
    borderWidth: 1,
    borderRadius: 12,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinchBox: { width: 80, height: 80, borderRadius: 16 },
});

export default GesturesScreen;
