import React, { useState, useRef } from 'react';
import { StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useAppTheme } from '../context/ThemeContext';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';

// LESSON: this screen is the first thing Detox sees on `device.launchApp()`.
// It demonstrates: by.id, by.label, typeText/clearText/replaceText,
// tapReturnKey, toBeVisible/toBeNotVisible, toHaveText, and a real
// async loading state driven by AuthContext's simulated network delay.
const LoginScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef<TextInput>(null);

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    const result = await login(username, password);
    setLoading(false);
    if (!result.success) {
      setError(result.error ?? 'Something went wrong');
    }
  };

  return (
    <Screen testID="login-screen">
      <View style={styles.brand}>
        <Text style={[styles.logo, { color: theme.primary }]} testID="login-logo">
          🥋 Detox Academy
        </Text>
        <Text style={[styles.tagline, { color: theme.subtext }]}>
          Sign in to start the lessons
        </Text>
      </View>

      <Text style={[styles.label, { color: theme.text }]}>Username</Text>
      <TextInput
        testID="login-username-input"
        accessibilityLabel="Username input"
        style={[styles.input, { borderColor: theme.border, color: theme.text }]}
        placeholder="e.g. jane"
        placeholderTextColor={theme.subtext}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
      />

      <Text style={[styles.label, { color: theme.text }]}>Password</Text>
      <TextInput
        ref={passwordRef}
        testID="login-password-input"
        accessibilityLabel="Password input"
        style={[styles.input, { borderColor: theme.border, color: theme.text }]}
        placeholder="at least 4 characters"
        placeholderTextColor={theme.subtext}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        returnKeyType="done"
        onSubmitEditing={onSubmit}
      />

      <View style={styles.rememberRow}>
        <Switch
          testID="login-remember-switch"
          accessibilityLabel="Remember me"
          value={rememberMe}
          onValueChange={setRememberMe}
        />
        <Text style={[styles.rememberLabel, { color: theme.text }]}>Remember me</Text>
      </View>

      {error ? (
        <Text testID="login-error-text" style={[styles.error, { color: theme.danger }]}>
          {error}
        </Text>
      ) : null}

      <PrimaryButton
        testID="login-submit-button"
        title="Sign in"
        onPress={onSubmit}
        loading={loading}
        disabled={!username || !password}
        style={styles.submit}
      />

      <Text style={[styles.hint, { color: theme.subtext }]} testID="login-hint-text">
        Hint: any username + a 4+ char password works. Try "locked" as the
        username to see the error path.
      </Text>
    </Screen>
  );
};

const styles = StyleSheet.create({
  brand: { alignItems: 'center', marginBottom: 32, marginTop: 12 },
  logo: { fontSize: 24, fontWeight: '800' },
  tagline: { fontSize: 14, marginTop: 6 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 14 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  rememberRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  rememberLabel: { marginLeft: 10, fontSize: 14 },
  error: { marginTop: 14, fontSize: 14, fontWeight: '600' },
  submit: { marginTop: 24 },
  hint: { fontSize: 12, marginTop: 20, textAlign: 'center', lineHeight: 18 },
});

export default LoginScreen;
