/**
 * Sync Test Component
 * 
 * Manual testing interface for Supabase sync functionality
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { syncService } from '../services/SyncService';
import { issueStorage } from '../services/StorageService';
import { getDeviceId } from '../utils/deviceId';
import { IssueCategory, IssueSeverity, IssueStatus } from '../types/models/Issue';

export default function SyncTestComponent() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const log = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    setTestResults(prev => [...prev, logEntry]);
    console.log(logEntry);
  };

  const createTestIssue = async () => {
    try {
      setIsLoading(true);
      const deviceId = await getDeviceId();
      log(`Device ID: ${deviceId}`);

      const testIssue = await issueStorage.createIssue({
        title: `Test Issue ${Date.now()}`,
        description: "Testing sync functionality",
        siteId: "test-site-001",
        category: IssueCategory.Audit,
        severity: IssueSeverity.Medium,
        status: IssueStatus.New,
        timestamp: new Date().toISOString(),
        photos: []
      });

      log(`✅ Created issue: ${testIssue.id}`);
      log(`📱 Sync status: ${testIssue.sync_status}`);
      log(`🔧 Device ID: ${testIssue.device_id}`);
      
    } catch (error) {
      log(`❌ Error creating issue: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testSync = async () => {
    try {
      setIsLoading(true);
      log("🔄 Starting sync test...");

      // Get pending reports count
      const allIssues = await issueStorage.getAllIssues();
      const pendingCount = allIssues.filter(issue => issue.sync_status === 'pending').length;
      log(`📋 Found ${pendingCount} pending issues to sync`);

      if (pendingCount === 0) {
        log("ℹ️  No pending issues found. Create some first!");
        return;
      }

      // Perform sync
      const result = await syncService.performSync();
      log(`✅ Sync completed: ${result.successful} successful, ${result.failed} failed`);

      // Check updated statuses
      const updatedIssues = await issueStorage.getAllIssues();
      const stillPending = updatedIssues.filter(issue => issue.sync_status === 'pending').length;
      const synced = updatedIssues.filter(issue => issue.sync_status === 'synced').length;
      
      log(`📊 Status: ${synced} synced, ${stillPending} still pending`);

    } catch (error) {
      log(`❌ Sync error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkLocalData = async () => {
    try {
      const allIssues = await issueStorage.getAllIssues();
      const deviceId = await getDeviceId();
      
      log(`📱 Current device: ${deviceId}`);
      log(`📄 Total local issues: ${allIssues.length}`);
      
      allIssues.forEach((issue, index) => {
        log(`  ${index + 1}. ${issue.title} (${issue.sync_status})`);
      });

    } catch (error) {
      log(`❌ Error checking data: ${error}`);
    }
  };

  const clearTestData = async () => {
    Alert.alert(
      "Clear Test Data",
      "Remove all local issues?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              const allIssues = await issueStorage.getAllIssues();
              for (const issue of allIssues) {
                await issueStorage.deleteIssue(issue.id);
              }
              log(`🗑️  Cleared ${allIssues.length} local issues`);
            } catch (error) {
              log(`❌ Error clearing data: ${error}`);
            }
          }
        }
      ]
    );
  };

  const clearLogs = () => setTestResults([]);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Sync Test Console
      </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
        <TouchableOpacity
          onPress={createTestIssue}
          disabled={isLoading}
          style={{
            backgroundColor: '#007AFF',
            padding: 12,
            borderRadius: 8,
            opacity: isLoading ? 0.6 : 1
          }}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>Create Test Issue</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={testSync}
          disabled={isLoading}
          style={{
            backgroundColor: '#34C759',
            padding: 12,
            borderRadius: 8,
            opacity: isLoading ? 0.6 : 1
          }}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>Test Sync</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={checkLocalData}
          style={{
            backgroundColor: '#FF9500',
            padding: 12,
            borderRadius: 8
          }}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>Check Local Data</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={clearTestData}
          style={{
            backgroundColor: '#FF3B30',
            padding: 12,
            borderRadius: 8
          }}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>Clear Data</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={clearLogs}
          style={{
            backgroundColor: '#8E8E93',
            padding: 12,
            borderRadius: 8
          }}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>Clear Logs</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10 }}>
        Test Results:
      </Text>

      <ScrollView 
        style={{ 
          flex: 1, 
          backgroundColor: '#000', 
          padding: 15, 
          borderRadius: 8 
        }}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {testResults.length === 0 ? (
          <Text style={{ color: '#8E8E93', fontStyle: 'italic' }}>
            No test results yet. Start by creating a test issue.
          </Text>
        ) : (
          testResults.map((result, index) => (
            <Text 
              key={index} 
              style={{ 
                color: '#00FF00', 
                fontFamily: 'monospace',
                fontSize: 12,
                marginBottom: 2
              }}
            >
              {result}
            </Text>
          ))
        )}
      </ScrollView>

      <Text style={{ 
        fontSize: 12, 
        color: '#8E8E93', 
        marginTop: 10,
        textAlign: 'center'
      }}>
        💡 Check Supabase dashboard to verify data sync
      </Text>
    </View>
  );
}