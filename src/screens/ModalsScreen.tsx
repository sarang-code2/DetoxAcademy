import React, { useRef, useState } from 'react';
import { Alert, Animated, Modal, StyleSheet, Text, View } from 'react-native';
import Screen from '../components/Screen';
import LessonHeader from '../components/LessonHeader';
import PrimaryButton from '../components/PrimaryButton';
import { useAppTheme } from '../context/ThemeContext';

// LESSON: three flavors of "overlay" UI. Native Alert.alert cannot be
// targeted by Detox matchers on either platform reliably, so the e2e spec
// for this screen only asserts on the app-level toggle it leaves behind.
// The custom <Modal> and toast, however, are regular RN views and are fully
// matchable with by.id + waitFor.
const ModalsScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [alertResult, setAlertResult] = useState<string | null>(null);
  const toastOpacity = useRef(new Animated.Value(0)).current;

  const showNativeAlert = () => {
    Alert.alert(
      'Delete lesson progress?',
      'This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => setAlertResult('cancelled') },
        { text: 'Delete', style: 'destructive', onPress: () => setAlertResult('deleted') },
      ],
      { cancelable: true },
    );
  };

  const showToast = () => {
    setToastVisible(true);
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(1500),
      Animated.timing(toastOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => setToastVisible(false));
  };

  return (
    <Screen testID="modals-screen">
      <LessonHeader
        testID="modals-header"
        title="Modals, Alerts & Toasts"
        subtitle="A native Alert, a custom full-screen Modal, and a self-dismissing toast."
      />

      <PrimaryButton
        testID="modals-open-alert-button"
        title="Show native alert"
        onPress={showNativeAlert}
        style={styles.button}
      />
      {alertResult && (
        <Text testID="modals-alert-result-text" style={[styles.result, { color: theme.subtext }]}>
          Last alert result: {alertResult}
        </Text>
      )}

      <PrimaryButton
        testID="modals-open-modal-button"
        title="Open custom modal"
        onPress={() => setModalVisible(true)}
        style={styles.button}
      />

      <PrimaryButton
        testID="modals-show-toast-button"
        title="Show toast"
        variant="secondary"
        onPress={showToast}
        style={styles.button}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}>
        {/* The testID deliberately goes on this inner content view, not on
            <Modal> itself. A transparent <Modal>'s own native host view
            (RCTModalHostView) has bounds that Detox's visibility-percentage
            check handles unreliably — a well-known gotcha — while a normal
            View with real, fully-opaque bounds works exactly as expected. */}
        <View style={styles.backdrop}>
          <View
            testID="modals-custom-modal"
            style={[styles.sheet, { backgroundColor: theme.card }]}>
            <Text testID="modals-custom-modal-title" style={[styles.sheetTitle, { color: theme.text }]}>
              Custom Modal
            </Text>
            <Text style={[styles.sheetBody, { color: theme.subtext }]}>
              This is a real React Native view, so Detox can find it with
              by.id('modals-custom-modal') and assert toBeVisible()/toBeNotVisible().
            </Text>
            <PrimaryButton
              testID="modals-close-modal-button"
              title="Close"
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            />
          </View>
        </View>
      </Modal>

      {toastVisible && (
        <Animated.View
          testID="modals-toast"
          style={[styles.toast, { backgroundColor: theme.text, opacity: toastOpacity }]}
          pointerEvents="none">
          <Text style={[styles.toastText, { color: theme.background }]}>
            Saved successfully ✓
          </Text>
        </Animated.View>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  button: { marginTop: 14 },
  result: { marginTop: 10, fontSize: 13 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  sheetTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  sheetBody: { fontSize: 14, lineHeight: 20, marginBottom: 20 },
  closeButton: {},
  toast: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  toastText: { fontWeight: '600' },
});

export default ModalsScreen;
