import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  LinkingOptions,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useAppTheme } from '../context/ThemeContext';
import { LESSONS, RootStackParamList } from './types';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import FormsScreen from '../screens/FormsScreen';
import ListsScreen from '../screens/ListsScreen';
import ModalsScreen from '../screens/ModalsScreen';
import GesturesScreen from '../screens/GesturesScreen';
import NetworkScreen from '../screens/NetworkScreen';
import WebViewScreen from '../screens/WebViewScreen';
import TabsDemoScreen from '../screens/TabsDemoScreen';
import MatchersScreen from '../screens/MatchersScreen';
import AnimationsScreen from '../screens/AnimationsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

// LESSON: device.launchApp({ url }) (cold start) and device.openURL({ url })
// (warm) both exercise this same linking config — it's plain React
// Navigation, nothing Detox-specific. Because every lesson screen only
// exists in the navigator once `user` is truthy (see below), a cold deep
// link into a lesson while logged out simply can't resolve — the route
// isn't registered yet — and falls back to Login. That's a realistic,
// worth-testing case in its own right, not a bug.
const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['detoxacademy://'],
  config: {
    screens: {
      Login: 'login',
      Home: 'home',
      Forms: 'lesson/forms',
      Lists: 'lesson/lists',
      Modals: 'lesson/modals',
      Gestures: 'lesson/gestures',
      Network: 'lesson/network',
      WebViewLesson: 'lesson/webview',
      TabsDemo: 'lesson/tabs',
      Matchers: 'lesson/matchers',
      Animations: 'lesson/animations',
    },
  },
};

// A single reusable back button so every lesson screen exposes the same
// stable testID for Detox, instead of relying on the platform's default
// (unlabelled) native back chevron.
const BackButton = ({ onPress, tintColor }: { onPress: () => void; tintColor?: string }) => (
  <TouchableOpacity
    testID="nav-back-button"
    accessibilityLabel="Go back"
    accessibilityRole="button"
    onPress={onPress}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
    <Text style={{ color: tintColor, fontSize: 16, fontWeight: '600' }}>‹ Back</Text>
  </TouchableOpacity>
);

const RootNavigator: React.FC = () => {
  const { user } = useAuth();
  const { theme, isDark } = useAppTheme();

  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: theme.background,
      card: theme.card,
      text: theme.text,
      border: theme.border,
      primary: theme.primary,
    },
  };

  return (
    <NavigationContainer theme={navTheme} linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: theme.card },
          headerTitleStyle: { color: theme.text },
          headerTintColor: theme.primary,
        }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            {LESSONS.map(lesson => (
              <Stack.Screen
                key={lesson.key}
                name={lesson.key}
                component={SCREEN_COMPONENTS[lesson.key]}
                options={({ navigation }) => ({
                  title: lesson.title,
                  headerLeft: ({ tintColor }) => (
                    <BackButton onPress={() => navigation.goBack()} tintColor={tintColor} />
                  ),
                })}
              />
            ))}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const SCREEN_COMPONENTS: Record<keyof RootStackParamList, React.ComponentType<any>> = {
  Login: LoginScreen,
  Home: HomeScreen,
  Forms: FormsScreen,
  Lists: ListsScreen,
  Modals: ModalsScreen,
  Gestures: GesturesScreen,
  Network: NetworkScreen,
  WebViewLesson: WebViewScreen,
  TabsDemo: TabsDemoScreen,
  Matchers: MatchersScreen,
  Animations: AnimationsScreen,
};

export default RootNavigator;
