import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';

type Props = {
  title: string;
  subtitle?: string;
  testID?: string;
};

const LessonHeader: React.FC<Props> = ({ title, subtitle, testID }) => {
  const { theme } = useAppTheme();
  return (
    <View style={styles.wrap} testID={testID}>
      <Text style={[styles.title, { color: theme.text }]} accessibilityRole="header">
        {title}
      </Text>
      {subtitle ? <Text style={[styles.subtitle, { color: theme.subtext }]}>{subtitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { fontSize: 14, marginTop: 4, lineHeight: 20 },
});

export default LessonHeader;
