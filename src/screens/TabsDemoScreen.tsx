import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../navigation/types';
import TabHomeTab from './tabs/TabHomeTab';
import TabProfileTab from './tabs/TabProfileTab';
import TabSettingsTab from './tabs/TabSettingsTab';
import { useAppTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator<TabParamList>();

const icons: Record<keyof TabParamList, string> = {
  TabHome: '🏠',
  TabProfile: '👤',
  TabSettings: '⚙️',
};

// LESSON: a nested bottom tab navigator. Each tab button carries a
// `tabBarTestID` (react-navigation's supported hook for Detox), separate
// from the testIDs on the content of each tab screen.
const TabsDemoScreen: React.FC = () => {
  const { theme } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.subtext,
        tabBarStyle: { backgroundColor: theme.card, borderTopColor: theme.border },
        tabBarIcon: () => <Text style={{ fontSize: 20 }}>{icons[route.name as keyof TabParamList]}</Text>,
      })}>
      <Tab.Screen
        name="TabHome"
        component={TabHomeTab}
        options={{ title: 'Home', tabBarTestID: 'tabs-nav-home-button' }}
      />
      <Tab.Screen
        name="TabProfile"
        component={TabProfileTab}
        options={{ title: 'Profile', tabBarTestID: 'tabs-nav-profile-button' }}
      />
      <Tab.Screen
        name="TabSettings"
        component={TabSettingsTab}
        options={{ title: 'Settings', tabBarTestID: 'tabs-nav-settings-button' }}
      />
    </Tab.Navigator>
  );
};

export default TabsDemoScreen;
