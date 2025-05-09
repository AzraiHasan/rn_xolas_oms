import React, { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IssueCard } from '@/components/issues/IssueCard';
import { IssueReport, IssueSeverity } from '@/types/models/Issue';

// Mock data for issues
const MOCK_ISSUES: IssueReport[] = [
  {
    id: '1',
    title: 'WiFi Signal Loss at Server Room',
    description: 'Frequent connection drops in the server room area affecting network monitoring systems. Signal strength drops below 20% during peak hours.',
    location: 'Server Room - Building A',
    timestamp: new Date(2025, 4, 6).toISOString(),
    severity: IssueSeverity.High,
    photos: [
      { 
        id: 'p1', 
        uri: 'https://picsum.photos/seed/issue1/400/300',
        timestamp: new Date(2025, 4, 6).toISOString()
      }
    ]
  },
  {
    id: '2',
    title: 'AC Temperature Fluctuations',
    description: 'Air conditioning system showing inconsistent temperature readings. Actual room temperature varies by 5-8°F from the displayed temperature.',
    location: 'Conference Room C',
    timestamp: new Date(2025, 4, 8).toISOString(),
    severity: IssueSeverity.Medium,
    photos: [
      { 
        id: 'p2', 
        uri: 'https://picsum.photos/seed/issue2/400/300',
        timestamp: new Date(2025, 4, 8).toISOString()
      }
    ]
  },
  {
    id: '3',
    title: 'Printer Paper Jam',
    description: 'HP LaserJet printer consistently jamming with various paper types. Error code 13.A displays on the control panel.',
    location: 'Admin Office',
    timestamp: new Date(2025, 4, 9).toISOString(),
    severity: IssueSeverity.Low,
    photos: [
      { 
        id: 'p3', 
        uri: 'https://picsum.photos/seed/issue3/400/300',
        timestamp: new Date(2025, 4, 9).toISOString()
      },
      { 
        id: 'p4', 
        uri: 'https://picsum.photos/seed/issue4/400/300',
        timestamp: new Date(2025, 4, 9).toISOString()
      }
    ]
  }
];

export default function IssuesScreen() {
  const [issues, setIssues] = useState<IssueReport[]>(MOCK_ISSUES);
  const insets = useSafeAreaInsets();

  const renderItem = ({ item }: { item: IssueReport }) => {
    return <IssueCard issue={item} />;
  };

  const renderEmptyComponent = () => (
    <ThemedView style={styles.emptyContainer}>
      <ThemedText type="title" style={styles.emptyTitle}>No Issues Found</ThemedText>
      <ThemedText style={styles.emptyText}>
        There are no issues currently assigned to you. Create a new issue or check back later.
      </ThemedText>
    </ThemedView>
  );

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ 
        title: 'Issues',
        contentStyle: { paddingTop: 0 }
      }} />
      
      <FlatList
        data={issues}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyComponent}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  emptyTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
  }
});
