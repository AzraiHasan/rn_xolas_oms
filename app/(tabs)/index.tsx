import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IssueBarChart, RecentActivityItem, StatisticCard } from '@/components/dashboard';
import { AppHeader } from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useIssues } from '@/contexts/IssueContext';
import { IssueSeverity } from '@/types/models/Issue';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const { 
    issues, 
    loading, 
    error, 
    refreshIssues 
  } = useIssues();
  
  // Fetch issue statistics on component mount
  useEffect(() => {
    refreshIssues();
  }, []);
  
  // Calculate statistics from issues
  const calculateStats = () => {
    if (!issues || issues.length === 0) {
      return {
        total: 0,
        bySeverity: {
          [IssueSeverity.Low]: 0,
          [IssueSeverity.Medium]: 0,
          [IssueSeverity.High]: 0,
        },
        recentIssues: []
      };
    }
    
    // Calculate by severity
    const bySeverity = {
      [IssueSeverity.Low]: issues.filter(i => i.severity === IssueSeverity.Low).length,
      [IssueSeverity.Medium]: issues.filter(i => i.severity === IssueSeverity.Medium).length,
      [IssueSeverity.High]: issues.filter(i => i.severity === IssueSeverity.High).length,
    };
    
    // Get 5 most recent issues
    const recentIssues = [...issues]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
    
    return {
      total: issues.length,
      bySeverity,
      recentIssues
    };
  };
  
  const stats = calculateStats();
  
  const renderContent = () => {
    if (loading) {
      return (
        <ThemedView className="items-center justify-center py-8">
          <ActivityIndicator size="large" color={colors.tint} />
          <ThemedText className="mt-3 text-gray-500">Loading dashboard...</ThemedText>
        </ThemedView>
      );
    }
    
    if (error) {
      return (
        <ThemedView className="items-center justify-center py-8 gap-3">
          <IconSymbol size={40} name="exclamationmark.circle.fill" color="#E11D48" />
          <ThemedText className="text-red-600 mb-2">{error}</ThemedText>
          <Button 
            label="Retry" 
            variant="primary" 
            onPress={refreshIssues} 
          />
        </ThemedView>
      );
    }
    
    return (
      <>
        {/* Issue Stats Cards */}
        <ThemedView className="flex-row flex-wrap gap-3 mb-6 md:gap-4">
          <StatisticCard
            value={stats.total}
            label="Total Issues"
            borderColor={colorScheme === 'dark' ? '#FFFFFF' : '#444444'}
            iconName="tray.fill"
            iconColor={colors.icon}
          />
          
          <StatisticCard
            value={stats.bySeverity[IssueSeverity.High]}
            label={IssueSeverity.High}
            borderColor="#E11D48"
            valueColor="#E11D48"
            labelColor="#E11D48"
            iconName="exclamationmark.triangle.fill"
            iconColor="#E11D48"
          />
          
          <StatisticCard
            value={stats.bySeverity[IssueSeverity.Medium]}
            label={IssueSeverity.Medium}
            borderColor="#F59E0B"
            valueColor="#F59E0B"
            labelColor="#F59E0B"
            iconName="exclamationmark.circle.fill"
            iconColor="#F59E0B"
          />
          
          <StatisticCard
            value={stats.bySeverity[IssueSeverity.Low]}
            label={IssueSeverity.Low}
            borderColor="#10B981"
            valueColor="#10B981"
            labelColor="#10B981"
            iconName="checkmark.circle.fill"
            iconColor="#10B981"
          />
        </ThemedView>
        
        {/* Issue Chart */}
        <IssueBarChart data={stats.bySeverity} total={stats.total} />
        
        {/* Quick Actions */}
        <ThemedView className="mb-6">
          <ThemedText type="subtitle">Quick Actions</ThemedText>
          
          <ThemedView className="flex-row mt-3 gap-3 md:gap-4">
            <Link href="/(tabs)/create-issue" asChild>
              <Button
                label="Report New Issue"
                variant="primary"
                leftIcon={<IconSymbol size={18} name="plus.circle.fill" color={colorScheme === 'light' ? '#000000' : '#FFFFFF'} />}
                className="flex-1"
              />
            </Link>
            
            <Link href="/(tabs)/issues" asChild>
              <Button
                label="View All Issues"
                variant="primary"
                leftIcon={<IconSymbol size={18} name="list.bullet" color={colorScheme === 'light' ? '#000000' : '#FFFFFF'} />}
                className="flex-1"
              />
            </Link>
          </ThemedView>
        </ThemedView>
        
        {/* Recent Activity */}
        <ThemedView className="mb-6">
          <ThemedView className="flex-row justify-between items-center mb-3">
            <ThemedText type="subtitle">Recent Activity</ThemedText>
            <Link href="/(tabs)/issues" className="flex-row items-center">
              <ThemedText className="text-blue-600 text-sm">View all</ThemedText>
            </Link>
          </ThemedView>
          
          {stats.recentIssues.length > 0 ? (
            <ThemedView className="border border-[#E4E7EB] dark:border-gray-700 rounded-xl overflow-hidden">
              {stats.recentIssues.map((issue) => (
                <RecentActivityItem key={issue.id} issue={issue} />
              ))}
            </ThemedView>
          ) : (
            <ThemedView className="items-center justify-center py-8 border border-[#E4E7EB] dark:border-gray-700 rounded-xl mt-3">
              <IconSymbol size={40} name="tray.fill" color={colors.icon} />
              <ThemedText className="mt-2 text-gray-500">No recent activity</ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      </>
    );
  };
  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          className="h-[178px] w-[290px] absolute bottom-0 left-0"
        />
      }>
      <AppHeader title="Issue Dashboard" />
      
      {renderContent()}
    </ParallaxScrollView>
  );
}
