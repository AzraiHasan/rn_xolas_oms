import React from 'react';
import { Stack } from 'expo-router';
import { Header, PageLayout } from '@/components/layouts';
import { SyncAnalyticsView } from '@/components/sync/SyncAnalyticsView';
import { NetworkStatusBar } from '@/components/layout/NetworkStatusBar';

export default function SyncAnalyticsScreen() {
  return (
    <PageLayout header={<Header title="Sync Analytics" />}>
      <Stack.Screen options={{ headerShown: false }} />
      <NetworkStatusBar showDetails />
      <SyncAnalyticsView />
    </PageLayout>
  );
}
