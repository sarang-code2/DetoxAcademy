import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import Screen from '../components/Screen';
import LessonHeader from '../components/LessonHeader';
import PrimaryButton from '../components/PrimaryButton';
import { useAppTheme } from '../context/ThemeContext';

type Status = 'idle' | 'loading' | 'success' | 'error';
type Article = { id: string; title: string };

const fetchArticles = (shouldFail: boolean): Promise<Article[]> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Network request failed'));
      } else {
        resolve(
          Array.from({ length: 6 }, (_, i) => ({
            id: `article-${i + 1}`,
            title: `Detox tip #${i + 1}: use waitFor for async UI`,
          })),
        );
      }
    }, 1200);
  });

// LESSON: idle -> loading -> success/error -> retry. This is the canonical
// case for Detox's `waitFor(element).toBeVisible().withTimeout(ms)`, since
// the spinner and the final content never coexist in the tree.
const NetworkScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const [status, setStatus] = useState<Status>('idle');
  const [articles, setArticles] = useState<Article[]>([]);
  const [failNext, setFailNext] = useState(false);

  const load = useCallback(async (shouldFail: boolean) => {
    setStatus('loading');
    try {
      const data = await fetchArticles(shouldFail);
      setArticles(data);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }, []);

  return (
    <Screen testID="network-screen" scroll={status !== 'success'}>
      <LessonHeader
        testID="network-header"
        title="Network & Async States"
        subtitle="A simulated 1.2s request with loading, success, error and retry states."
      />

      <View style={styles.controls}>
        <PrimaryButton
          testID="network-load-button"
          title="Load articles"
          onPress={() => load(failNext)}
          loading={status === 'loading'}
        />
        <PrimaryButton
          testID="network-toggle-fail-button"
          title={failNext ? 'Will fail: ON' : 'Will fail: OFF'}
          variant="secondary"
          onPress={() => setFailNext(prev => !prev)}
          style={styles.toggleButton}
        />
      </View>

      {status === 'loading' && (
        <View testID="network-loading-indicator" style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.centerText, { color: theme.subtext }]}>Loading articles…</Text>
        </View>
      )}

      {status === 'error' && (
        <View testID="network-error-state" style={styles.center}>
          <Text style={[styles.errorTitle, { color: theme.danger }]}>Something went wrong</Text>
          <Text style={[styles.centerText, { color: theme.subtext }]}>
            Network request failed
          </Text>
          <PrimaryButton
            testID="network-retry-button"
            title="Retry"
            onPress={() => load(false)}
            style={styles.retryButton}
          />
        </View>
      )}

      {status === 'success' && (
        <FlatList
          testID="network-article-list"
          data={articles}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View
              testID={`network-article-row-${item.id}`}
              style={[styles.articleRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={{ color: theme.text }}>{item.title}</Text>
            </View>
          )}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  controls: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  toggleButton: { flex: 1 },
  center: { alignItems: 'center', marginTop: 40 },
  centerText: { marginTop: 10, fontSize: 14 },
  errorTitle: { fontSize: 17, fontWeight: '700' },
  retryButton: { marginTop: 16, minWidth: 140 },
  articleRow: { borderWidth: 1, borderRadius: 10, padding: 14, marginBottom: 10 },
});

export default NetworkScreen;
