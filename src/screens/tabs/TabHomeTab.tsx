import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Screen from '../../components/Screen';
import PrimaryButton from '../../components/PrimaryButton';
import { useAppTheme } from '../../context/ThemeContext';

const TabHomeTab: React.FC = () => {
  const { theme } = useAppTheme();
  const [count, setCount] = useState(0);

  return (
    <Screen testID="tab-home-screen">
      <Text style={[styles.title, { color: theme.text }]}>Home tab</Text>
      <Text style={[styles.subtitle, { color: theme.subtext }]}>
        A counter that resets if the component unmounts, to demonstrate that
        switching bottom tabs keeps this screen mounted.
      </Text>
      <View style={styles.counterRow}>
        <Text testID="tab-home-counter" style={[styles.counter, { color: theme.primary }]}>
          {count}
        </Text>
      </View>
      <PrimaryButton testID="tab-home-increment-button" title="Increment" onPress={() => setCount(c => c + 1)} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 13, lineHeight: 19, marginBottom: 20 },
  counterRow: { alignItems: 'center', marginBottom: 20 },
  counter: { fontSize: 48, fontWeight: '800' },
});

export default TabHomeTab;
