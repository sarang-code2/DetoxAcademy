import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import Screen from '../components/Screen';
import LessonHeader from '../components/LessonHeader';
import { useAppTheme } from '../context/ThemeContext';

const HTML = `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font-family: -apple-system, sans-serif; padding: 24px; background: #F9FAFB; }
      button { font-size: 16px; padding: 12px 20px; border-radius: 8px; border: none;
        background: #4F46E5; color: white; margin-top: 16px; }
      #count { font-size: 20px; font-weight: 700; margin-top: 12px; }
    </style>
  </head>
  <body>
    <h2>Hello from a WebView</h2>
    <p>This content is rendered by the device's web engine, not React Native.</p>
    <div id="count" data-testid="web-counter">0</div>
    <button id="incrementBtn" data-testid="web-increment-button" onclick="increment()">Tap me</button>
    <script>
      let count = 0;
      function increment() {
        count += 1;
        document.getElementById('count').innerText = count;
      }
    </script>
  </body>
</html>
`;

// LESSON: embedded web content. Detox 20+ can target elements *inside* the
// WebView via `web.element(by.web.id('web-increment-button'))` when the
// WebView is given a `nativeID`/testID, while everything outside of it
// (this screen's own header, back button, etc.) still uses normal by.id().
const WebViewScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const [loaded, setLoaded] = useState(false);

  return (
    <Screen testID="webview-screen" scroll={false}>
      <LessonHeader
        testID="webview-header"
        title="WebView"
        subtitle="Embedded web content with its own counter button, driven by JS inside the page."
      />
      {!loaded && (
        <Text testID="webview-loading-text" style={{ color: theme.subtext, marginBottom: 8 }}>
          Loading web content…
        </Text>
      )}
      <View style={styles.webWrap}>
        <WebView
          testID="webview-content"
          nativeID="webview-content"
          originWhitelist={['*']}
          source={{ html: HTML }}
          onLoadEnd={() => setLoaded(true)}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  webWrap: { flex: 1, borderRadius: 12, overflow: 'hidden' },
});

export default WebViewScreen;
