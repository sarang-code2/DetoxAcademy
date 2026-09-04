import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Screen from '../../components/Screen';
import { useAuth } from '../../context/AuthContext';
import { useAppTheme } from '../../context/ThemeContext';

const TabProfileTab: React.FC = () => {
  const { theme } = useAppTheme();
  const { user } = useAuth();
  const [favorite, setFavorite] = useState('');

  return (
    <Screen testID="tab-profile-screen">
      <Text style={[styles.title, { color: theme.text }]}>Profile tab</Text>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.avatar]}>🙂</Text>
        <Text testID="tab-profile-username" style={[styles.username, { color: theme.text }]}>
          {user?.username}
        </Text>
      </View>

      <Text style={[styles.label, { color: theme.text }]}>Favorite testing framework</Text>
      <TextInput
        testID="tab-profile-favorite-input"
        accessibilityLabel="Favorite testing framework"
        style={[styles.input, { borderColor: theme.border, color: theme.text }]}
        value={favorite}
        onChangeText={setFavorite}
        placeholder="Detox, obviously"
        placeholderTextColor={theme.subtext}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: { fontSize: 40, marginBottom: 8 },
  username: { fontSize: 17, fontWeight: '700' },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
});

export default TabProfileTab;
