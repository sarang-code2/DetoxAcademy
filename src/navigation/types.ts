export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Forms: undefined;
  Lists: undefined;
  Modals: undefined;
  Gestures: undefined;
  Network: undefined;
  WebViewLesson: undefined;
  TabsDemo: undefined;
  Matchers: undefined;
  Animations: undefined;
};

export type TabParamList = {
  TabHome: undefined;
  TabProfile: undefined;
  TabSettings: undefined;
};

export type Lesson = {
  key: keyof RootStackParamList;
  title: string;
  description: string;
  icon: string;
};

export const LESSONS: Lesson[] = [
  {
    key: 'Forms',
    title: 'Forms & Inputs',
    description: 'Text fields, switches, sliders, pickers, checkboxes, radio buttons',
    icon: '📝',
  },
  {
    key: 'Lists',
    title: 'Lists, Search & Swipe',
    description: 'FlatList, search filtering, pull-to-refresh, swipe-to-delete, indexed items',
    icon: '📋',
  },
  {
    key: 'Modals',
    title: 'Modals, Alerts & Toasts',
    description: 'Native Alert, custom Modal, dismissible toast notifications',
    icon: '🪟',
  },
  {
    key: 'Gestures',
    title: 'Gestures',
    description: 'Long press, double tap, drag, pinch-to-zoom, swipeable card',
    icon: '👆',
  },
  {
    key: 'Network',
    title: 'Network & Async States',
    description: 'Loading, success, error and retry states for an async request',
    icon: '🌐',
  },
  {
    key: 'WebViewLesson',
    title: 'WebView',
    description: 'Embedded web content and the react-native-webview matcher',
    icon: '🧭',
  },
  {
    key: 'TabsDemo',
    title: 'Tab Navigation',
    description: 'A nested bottom tab navigator: Home / Profile / Settings',
    icon: '🗂️',
  },
  {
    key: 'Matchers',
    title: 'Locator Matchers Showcase',
    description: 'id, text, label, type, traits, value, index, ancestor & descendant',
    icon: '🎯',
  },
  {
    key: 'Animations',
    title: 'Animations',
    description: 'Fade/scale transitions and asserting on elements that appear over time',
    icon: '✨',
  },
];
