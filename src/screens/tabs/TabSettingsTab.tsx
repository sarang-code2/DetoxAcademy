import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import Screen from '../../components/Screen';
import { useAppTheme } from '../../context/ThemeContext';

const TabSettingsTab: React.FC = () => {
  const { theme, isDark, toggleTheme } = useAppTheme();

  return (
    <Screen testID="tab-settings-screen">
      <Text style={[styles.title, { color: theme.text }]}>Settings tab</Text>

      <View style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.rowLabel, { color: theme.text }]}>Dark mode</Text>
        <Switch
          testID="tab-settings-dark-mode-switch"
          accessibilityLabel="Dark mode"
          value={isDark}
          onValueChange={toggleTheme}
        />
      </View>

      <Text testID="tab-settings-theme-text" style={[styles.themeText, { color: theme.subtext }]}>
        Current theme: {isDark ? 'dark' : 'light'}
      </Text>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  rowLabel: { fontSize: 15, fontWeight: '600' },
  themeText: { marginTop: 12, fontSize: 13 },
});

export default TabSettingsTab;
