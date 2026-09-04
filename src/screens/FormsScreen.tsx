import React, { useState } from 'react';
import { StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import Screen from '../components/Screen';
import LessonHeader from '../components/LessonHeader';
import PrimaryButton from '../components/PrimaryButton';
import { useAppTheme } from '../context/ThemeContext';

const ROLES = ['Student', 'Instructor', 'QA Engineer', 'Developer'] as const;
type Role = (typeof ROLES)[number];

// LESSON: every common form control in one place. Covers by.type() (native
// component classes), by.traits (adjustable/selected), toHaveValue,
// toHaveToggleValue, and typing/clearing/replacing text.
const FormsScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [role, setRole] = useState<Role>('Student');
  const [experience, setExperience] = useState(3);
  const [notifications, setNotifications] = useState(true);
  const [agree, setAgree] = useState(false);
  const [plan, setPlan] = useState<'free' | 'pro'>('free');
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = name.trim().length > 0 && agree;

  return (
    <Screen testID="forms-screen">
      <LessonHeader
        testID="forms-header"
        title="Forms & Inputs"
        subtitle="Text fields, switches, a slider, a picker, checkboxes and radio buttons."
      />

      <Text style={[styles.label, { color: theme.text }]}>Full name</Text>
      <TextInput
        testID="forms-name-input"
        accessibilityLabel="Full name"
        style={[styles.input, { borderColor: theme.border, color: theme.text }]}
        value={name}
        onChangeText={setName}
        placeholder="Ada Lovelace"
        placeholderTextColor={theme.subtext}
      />

      <Text style={[styles.label, { color: theme.text }]}>Bio (multiline)</Text>
      <TextInput
        testID="forms-bio-input"
        accessibilityLabel="Bio"
        style={[styles.input, styles.multiline, { borderColor: theme.border, color: theme.text }]}
        value={bio}
        onChangeText={setBio}
        placeholder="Tell us about yourself"
        placeholderTextColor={theme.subtext}
        multiline
      />

      <Text style={[styles.label, { color: theme.text }]}>Role</Text>
      <View style={[styles.pickerWrap, { borderColor: theme.border }]}>
        <Picker
          testID="forms-role-picker"
          accessibilityLabel="Role picker"
          selectedValue={role}
          onValueChange={value => setRole(value as Role)}>
          {ROLES.map(r => (
            <Picker.Item key={r} label={r} value={r} testID={`forms-role-option-${r}`} />
          ))}
        </Picker>
      </View>

      <Text style={[styles.label, { color: theme.text }]}>
        Years of experience: <Text testID="forms-experience-value">{experience}</Text>
      </Text>
      <Slider
        testID="forms-experience-slider"
        accessibilityLabel="Years of experience slider"
        minimumValue={0}
        maximumValue={10}
        step={1}
        value={experience}
        onValueChange={setExperience}
        minimumTrackTintColor={theme.primary}
      />

      <View style={styles.row}>
        <Text style={[styles.label, styles.rowLabel, { color: theme.text }]}>
          Email notifications
        </Text>
        <Switch
          testID="forms-notifications-switch"
          accessibilityLabel="Email notifications"
          value={notifications}
          onValueChange={setNotifications}
        />
      </View>

      <Text style={[styles.label, { color: theme.text }]}>Plan</Text>
      <View style={styles.radioGroup}>
        {(['free', 'pro'] as const).map(option => (
          <TouchableOpacity
            key={option}
            testID={`forms-plan-radio-${option}`}
            accessibilityLabel={`${option} plan`}
            accessibilityRole="radio"
            accessibilityState={{ selected: plan === option }}
            style={styles.radioRow}
            onPress={() => setPlan(option)}>
            <View
              style={[
                styles.radioOuter,
                { borderColor: theme.primary },
                plan === option && { borderColor: theme.primary },
              ]}>
              {plan === option && (
                <View style={[styles.radioInner, { backgroundColor: theme.primary }]} />
              )}
            </View>
            <Text style={[styles.radioLabel, { color: theme.text }]}>
              {option === 'free' ? 'Free' : 'Pro ($9/mo)'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        testID="forms-agree-checkbox"
        accessibilityLabel="Agree to terms"
        accessibilityRole="checkbox"
        accessibilityState={{ checked: agree }}
        style={styles.checkboxRow}
        onPress={() => setAgree(prev => !prev)}>
        <View
          style={[
            styles.checkboxBox,
            { borderColor: theme.primary },
            agree && { backgroundColor: theme.primary },
          ]}>
          {agree && <Text style={styles.checkboxTick}>✓</Text>}
        </View>
        <Text style={[styles.checkboxLabel, { color: theme.text }]}>
          I agree to the terms and conditions
        </Text>
      </TouchableOpacity>

      <PrimaryButton
        testID="forms-submit-button"
        title="Submit"
        disabled={!canSubmit}
        onPress={() => setSubmitted(true)}
        style={styles.submit}
      />

      {submitted && (
        <View
          testID="forms-summary-card"
          style={[styles.summary, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.summaryTitle, { color: theme.text }]}>Submitted ✅</Text>
          <Text testID="forms-summary-name" style={{ color: theme.subtext }}>
            Name: {name}
          </Text>
          <Text testID="forms-summary-role" style={{ color: theme.subtext }}>
            Role: {role}
          </Text>
          <Text testID="forms-summary-plan" style={{ color: theme.subtext }}>
            Plan: {plan}
          </Text>
        </View>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 16 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  pickerWrap: { borderWidth: 1, borderRadius: 10, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowLabel: { marginTop: 0 },
  radioGroup: { flexDirection: 'row', gap: 20 },
  radioRow: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioInner: { width: 10, height: 10, borderRadius: 5 },
  radioLabel: { fontSize: 14 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxTick: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  checkboxLabel: { fontSize: 14, flexShrink: 1 },
  submit: { marginTop: 24 },
  summary: { marginTop: 20, padding: 14, borderWidth: 1, borderRadius: 10 },
  summaryTitle: { fontWeight: '700', marginBottom: 6, fontSize: 15 },
});

export default FormsScreen;
