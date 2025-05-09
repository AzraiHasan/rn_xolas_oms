import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { Stack } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IssueCard } from '@/components/issues/IssueCard';
import { Header, PageLayout } from '@/components/layouts';
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

  const renderItem = ({ item }: { item: IssueReport }) => {
    return <IssueCard issue={item} />;
  };

  const renderEmptyComponent = () => (
    <ThemedView className="p-6 items-center justify-center h-[300px]">
      <ThemedText type="title" className="mb-2 text-center">No Issues Found</ThemedText>
      <ThemedText className="text-center opacity-70">
        There are no issues currently assigned to you. Create a new issue or check back later.
      </ThemedText>
    </ThemedView>
  );

  return (
    <PageLayout
      header={<Header title="Issues" />}
    >
      <Stack.Screen options={{ 
        headerShown: false,
      }} />
      
      <FlatList
        data={issues}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        ListEmptyComponent={renderEmptyComponent}
        showsVerticalScrollIndicator={false}
      />
    </PageLayout>
  );
}


