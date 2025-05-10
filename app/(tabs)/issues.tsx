import React from 'react';
import { FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Stack } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IssueCard } from '@/components/issues/IssueCard';
import { Header, PageLayout } from '@/components/layouts';
import { useIssues } from '@/contexts/IssueContext';



export default function IssuesScreen() {
  const { issues, loading, error, refreshIssues } = useIssues();

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
      
      {loading ? (
        <ThemedView className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
          <ThemedText className="mt-4">Loading issues...</ThemedText>
        </ThemedView>
      ) : error ? (
        <ThemedView className="p-6 items-center justify-center h-[300px]">
          <ThemedText type="title" className="mb-2 text-center">Error Loading Issues</ThemedText>
          <ThemedText className="text-center opacity-70">{error}</ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={issues}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          ListEmptyComponent={renderEmptyComponent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refreshIssues} />
          }
        />
      )}
    </PageLayout>
  );
}


