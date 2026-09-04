import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  testID?: string;
  style?: ViewStyle;
};

const Screen: React.FC<Props> = ({ children, scroll = true, testID, style }) => {
  const { theme } = useAppTheme();
  const Container = scroll ? ScrollView : View;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} testID={testID}>
      <Container
        // A distinct testID from the screen root: `scrollTo()`/`scroll()`
        // only work against the actual scrollable native view, and Detox
        // needs a matcher for that specific view to drive those actions.
        testID={scroll ? (testID ? `${testID}-scroll` : undefined) : undefined}
        style={styles.flex}
        contentContainerStyle={scroll ? [styles.content, style] : undefined}
        keyboardShouldPersistTaps="handled">
        {scroll ? children : <View style={[styles.content, styles.flex, style]}>{children}</View>}
      </Container>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
});

export default Screen;
