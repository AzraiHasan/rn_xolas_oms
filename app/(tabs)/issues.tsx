import { FlatList, StyleSheet } from 'react-native';

import { IssueCard } from '@/components/issues';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IssueReport, IssueSeverity } from '@/types/models/Issue';

/**
 * Mock data for demonstration purposes
 */
const MOCK_ISSUES: IssueReport[] = [
  {
    id: '1',
    title: 'Broken pipe in northeast corner',
    description: 'Water leaking from ceiling in the northeast corner of building A. Damage visible on drywall and carpet is wet.',
    location: 'Building A, Floor 2, Room 203',
    timestamp: new Date(2024, 4, 1).toISOString(),
    severity: IssueSeverity.High,
    photos: [
      {
        id: '1a',
        uri: 'https://picsum.photos/id/26/400/300',
        timestamp: new Date(2024, 4, 1).toISOString(),
        title: 'Ceiling damage',
      },
    ],
  },
  {
    id: '2',
    title: 'Window seal broken',
    description: 'Window seal appears to be broken, allowing moisture to enter during rainy weather. Window is located on west wall.',
    location: 'Building B, Floor 1, Room 110',
    timestamp: new Date(2024, 4, 5).toISOString(),
    severity: IssueSeverity.Medium,
    photos: [
      {
        id: '2a',
        uri: 'https://picsum.photos/id/24/400/300',
        timestamp: new Date(2024, 4, 5).toISOString(),
      },
    ],
  },
  {
    id: '3',
    title: 'Chipping paint on exterior wall',
    description: 'Paint is chipping and peeling on the south exterior wall, approximately 3 feet from ground level.',
    location: 'Building C, South Wall',
    timestamp: new Date(2024, 4, 8).toISOString(),
    severity: IssueSeverity.Low,
    photos: [],
  },
];

/**
 * Screen for displaying the list of issues
 */
export default function IssuesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const renderItem = ({ item }: { item: IssueReport }) => (
    <IssueCard issue={item} />
  );
  
  const renderEmptyState = () => (
    <ThemedView style={styles.emptyContainer}>
      <IconSymbol size={48} name="exclamationmark.circle" color={colors.icon} />
      <ThemedText style={styles.emptyText}>No issues reported yet</ThemedText>
      <Button
        label="Report an Issue"
        variant="primary"
        size="small"
        style={styles.emptyButton}
      />
    </ThemedView>
  );
  
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Issues</ThemedText>
      </ThemedView>
      
      <FlatList
        data={MOCK_ISSUES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    marginTop: 12,
    marginBottom: 24,
    fontSize: 16,
    textAlign: 'center',
  },
  emptyButton: {
    minWidth: 160,
  },
});
