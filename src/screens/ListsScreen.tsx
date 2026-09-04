import React, { useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Screen from '../components/Screen';
import LessonHeader from '../components/LessonHeader';
import { useAppTheme } from '../context/ThemeContext';

type Task = { id: string; title: string; done: boolean };

const seedTasks = (): Task[] =>
  Array.from({ length: 18 }, (_, i) => ({
    id: `task-${i + 1}`,
    title: `Write e2e test #${i + 1}`,
    done: i % 5 === 0,
  }));

// LESSON: search filtering, pull-to-refresh, checkable rows (toggle state),
// swipe-to-delete, and atIndex()-style disambiguation via repeated testIDs
// (`lists-task-row-<id>` is unique, but `lists-task-title` recurs so specs
// must use `.atIndex(n)` to target one).
const ListsScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo(
    () => tasks.filter(t => t.title.toLowerCase().includes(query.toLowerCase())),
    [tasks, query],
  );

  const toggleTask = (id: string) =>
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)));

  const deleteTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setTasks(seedTasks());
      setRefreshing(false);
    }, 800);
  };

  return (
    <Screen scroll={false} testID="lists-screen">
      <LessonHeader
        testID="lists-header"
        title="Lists, Search & Swipe"
        subtitle="Filter, pull to refresh, tap to complete, swipe left to delete."
      />

      <TextInput
        testID="lists-search-input"
        accessibilityLabel="Search tasks"
        style={[styles.search, { borderColor: theme.border, color: theme.text }]}
        placeholder="Search tasks…"
        placeholderTextColor={theme.subtext}
        value={query}
        onChangeText={setQuery}
      />

      <Text testID="lists-count-text" style={[styles.count, { color: theme.subtext }]}>
        {filtered.length} task{filtered.length === 1 ? '' : 's'}
      </Text>

      <FlatList
        testID="lists-task-list"
        data={filtered}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl testID="lists-refresh-control" refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text testID="lists-empty-text" style={[styles.empty, { color: theme.subtext }]}>
            No tasks match "{query}"
          </Text>
        }
        renderItem={({ item }) => (
          <Swipeable
            testID={`lists-swipeable-${item.id}`}
            renderRightActions={() => (
              <TouchableOpacity
                testID={`lists-delete-button-${item.id}`}
                accessibilityLabel={`Delete ${item.title}`}
                style={[styles.deleteAction, { backgroundColor: theme.danger }]}
                onPress={() => deleteTask(item.id)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            )}>
            <TouchableOpacity
              testID={`lists-task-row-${item.id}`}
              accessibilityLabel={`Toggle ${item.title}`}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: item.done }}
              style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => toggleTask(item.id)}>
              <View
                style={[
                  styles.checkbox,
                  { borderColor: theme.primary },
                  item.done && { backgroundColor: theme.primary },
                ]}>
                {item.done && <Text style={styles.checkTick}>✓</Text>}
              </View>
              <Text
                testID="lists-task-title"
                style={[
                  styles.rowTitle,
                  { color: theme.text },
                  item.done && styles.rowTitleDone,
                ]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          </Swipeable>
        )}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  search: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 8,
  },
  count: { fontSize: 12, marginBottom: 8 },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 14 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkTick: { color: '#fff', fontSize: 13, fontWeight: '700' },
  rowTitle: { fontSize: 15, flexShrink: 1 },
  rowTitleDone: { textDecorationLine: 'line-through', opacity: 0.5 },
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    borderRadius: 10,
    marginBottom: 8,
  },
  deleteText: { color: '#fff', fontWeight: '700' },
});

export default ListsScreen;
