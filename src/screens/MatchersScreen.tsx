import React, { useState } from 'react';
import { StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Screen from '../components/Screen';
import LessonHeader from '../components/LessonHeader';
import PrimaryButton from '../components/PrimaryButton';
import { useAppTheme } from '../context/ThemeContext';

// LESSON: a deliberately dense screen. Every matcher strategy Detox offers
// gets its own labelled section so a single spec file (matchers.test.js)
// can walk through by.id, by.text, by.label, by.traits/role, toHaveValue,
// atIndex(), withAncestor()/withDescendant(), and the toExist() vs
// toBeVisible() distinction.
const MatchersScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const [showExistence, setShowExistence] = useState(true);
  const [visible, setVisible] = useState(true);
  const [switchOn, setSwitchOn] = useState(false);
  const [valueInputText, setValueInputText] = useState('42');

  return (
    <Screen testID="matchers-screen">
      <LessonHeader
        testID="matchers-header"
        title="Locator Matchers Showcase"
        subtitle="Every Detox matcher strategy, isolated into its own section."
      />

      <Section title="1. by.id() — testID">
        <Text testID="matchers-by-id-text" style={styles.body}>
          Find me with by.id('matchers-by-id-text')
        </Text>
      </Section>

      <Section title="2. by.text() — exact visible text">
        <Text style={styles.body}>Find me by exact text match</Text>
      </Section>

      <Section title="3. by.label() — accessibilityLabel">
        <TouchableOpacity
          testID="matchers-by-label-button"
          accessibilityLabel="unique-accessible-label"
          accessibilityRole="button"
          style={[styles.pill, { backgroundColor: theme.primary }]}>
          <Text style={styles.pillText}>Has a distinct a11y label</Text>
        </TouchableOpacity>
      </Section>

      <Section title="4. by.traits() / accessibilityRole">
        <Text testID="matchers-header-role-text" accessibilityRole="header" style={styles.body}>
          I carry the "header" trait/role
        </Text>
        <Switch
          testID="matchers-adjustable-switch"
          accessibilityLabel="Adjustable trait switch"
          value={switchOn}
          onValueChange={setSwitchOn}
          style={styles.spacingTop}
        />
      </Section>

      <Section title="5. toHaveValue() — element value">
        {/* Controlled on purpose (value + onChangeText, not defaultValue) —
            good practice generally, and it's what getAttributes().text
            reads reliably on both platforms in the 5b test below.
            toHaveValue() itself is iOS-only-reliable here: see the e2e
            spec for why. */}
        <TextInput
          testID="matchers-value-input"
          value={valueInputText}
          onChangeText={setValueInputText}
          style={[styles.input, { borderColor: theme.border, color: theme.text }]}
        />
      </Section>

      <Section title="6. atIndex() — repeated testID">
        {[0, 1, 2].map(i => (
          <Text key={i} testID="matchers-repeated-item" style={styles.body}>
            Repeated item #{i}
          </Text>
        ))}
      </Section>

      <Section title="7. withAncestor() / withDescendant()">
        <Text style={[styles.hint, { color: theme.subtext }]}>
          Two cards below both contain a child with the SAME testID
          ("matchers-child-text") — use withAncestor() to pick one.
        </Text>
        <View testID="matchers-parent-card-a" style={[styles.card, { borderColor: theme.border }]}>
          <Text style={[styles.cardLabel, { color: theme.subtext }]}>Card A</Text>
          <Text testID="matchers-child-text" style={styles.body}>
            Shared child text
          </Text>
        </View>
        <View testID="matchers-parent-card-b" style={[styles.card, { borderColor: theme.border }]}>
          <Text style={[styles.cardLabel, { color: theme.subtext }]}>Card B</Text>
          <Text testID="matchers-child-text" style={styles.body}>
            Shared child text
          </Text>
        </View>
      </Section>

      <Section title="8. toExist() vs toBeVisible()">
        <Text style={[styles.hint, { color: theme.subtext }]}>
          One toggle unmounts its target (toExist() flips too); the other
          only hides it with opacity (stays in the tree, toExist() stays
          true, only toBeVisible() flips).
        </Text>
        <PrimaryButton
          testID="matchers-toggle-existence-button"
          title={showExistence ? 'Unmount element' : 'Mount element'}
          variant="secondary"
          onPress={() => setShowExistence(prev => !prev)}
          style={styles.spacingTop}
        />
        {showExistence && (
          <Text testID="matchers-existence-target" style={styles.body}>
            I can be unmounted entirely
          </Text>
        )}
        <PrimaryButton
          testID="matchers-toggle-visibility-button"
          title={visible ? 'Hide (0 height + opacity)' : 'Show'}
          variant="secondary"
          onPress={() => setVisible(prev => !prev)}
          style={styles.spacingTop}
        />
        <Text
          testID="matchers-visibility-target"
          // opacity alone isn't enough here: Detox's toBeVisible() on iOS
          // checks geometric on-screen area, not alpha, so a fully
          // transparent-but-full-size view can still report as "visible".
          // Collapsing the height to 0 as well gives it 0% on-screen area,
          // which toBeVisible() does reliably treat as not visible.
          style={[
            styles.body,
            visible
              ? { opacity: 1 }
              : { opacity: 0, height: 0, overflow: 'hidden' },
          ]}>
          I only fade out, I never unmount
        </Text>
      </Section>
    </Screen>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const { theme } = useAppTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.primary }]}>{title}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 13, fontWeight: '700', marginBottom: 10, textTransform: 'uppercase' },
  body: { fontSize: 15, marginTop: 4 },
  hint: { fontSize: 12, lineHeight: 17, marginBottom: 10 },
  pill: { alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  pillText: { color: '#fff', fontWeight: '600' },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15 },
  card: { borderWidth: 1, borderRadius: 10, padding: 12, marginTop: 8 },
  cardLabel: { fontSize: 11, fontWeight: '700', marginBottom: 4, textTransform: 'uppercase' },
  spacingTop: { marginTop: 10 },
});

export default MatchersScreen;
