/**
 * Test Tab Screen
 */

import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import SyncTestComponent from '../../components/SyncTestComponent';

export default function TestTab() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SyncTestComponent />
    </SafeAreaView>
  );
}