import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useAppTheme } from '../context/ThemeContext';
import Screen from '../components/Screen';
import { LESSONS, RootStackParamList } from '../navigation/types';

// LESSON: the landing screen after login. A FlatList of navigable "lesson"
// rows, each with its own stable testID (`home-lesson-item-<key>`) so specs
// can target a specific row instead of relying on visual position.
const HomeScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const { user, logout } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Screen scroll={false} testID="home-screen">
      <View style={styles.header}>
        <View>
          <Text style={[styles.welcome, { color: theme.subtext }]}>Welcome back</Text>
          <Text
            testID="home-username-text"
            style={[styles.username, { color: theme.text }]}>
            {user?.username}
          </Text>
        </View>
        <TouchableOpacity
          testID="home-logout-button"
          accessibilityLabel="Log out"
          accessibilityRole="button"
          onPress={logout}
          style={[styles.logoutButton, { borderColor: theme.border }]}>
          <Text style={{ color: theme.danger, fontWeight: '600' }}>Log out</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        testID="home-lesson-list"
        data={LESSONS}
        keyExtractor={item => item.key}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            testID={`home-lesson-item-${item.key}`}
            accessibilityLabel={`Open lesson: ${item.title}`}
            accessibilityRole="button"
            style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => navigation.navigate(item.key as never)}>
            <Text style={styles.icon}>{item.icon}</Text>
            <View style={styles.cardText}>
              <Text
                testID={`home-lesson-title-${index}`}
                style={[styles.cardTitle, { color: theme.text }]}>
                {item.title}
              </Text>
              <Text style={[styles.cardDesc, { color: theme.subtext }]}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcome: { fontSize: 13 },
  username: { fontSize: 20, fontWeight: '700' },
  logoutButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  listContent: { paddingBottom: 40 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  icon: { fontSize: 28, marginRight: 12 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardDesc: { fontSize: 12, marginTop: 3, lineHeight: 16 },
});

export default HomeScreen;
