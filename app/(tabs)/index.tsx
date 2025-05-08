import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IssueBarChart, RecentActivityItem, StatisticCard } from '@/components/dashboard';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IssueService } from '@/services/issues/issueService';
import { IssueReport, IssueSeverity } from '@/types/models/Issue';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    total: number;
    bySeverity: Record<IssueSeverity, number>;
    recentIssues: IssueReport[];
  } | null>(null);
  
  // Fetch issue statistics on component mount
  useEffect(() => {
    const fetchIssueStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const issueStats = await IssueService.getIssueStatistics();
        setStats(issueStats);
      } catch (err) {
        setError('Failed to load issue statistics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchIssueStats();
  }, []);
  
  const renderContent = () => {
    if (loading) {
      return (
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
          <ThemedText style={styles.loadingText}>Loading dashboard...</ThemedText>
        </ThemedView>
      );
    }
    
    if (error) {
      return (
        <ThemedView style={styles.errorContainer}>
          <IconSymbol size={40} name="exclamationmark.circle.fill" color="#E11D48" />
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <Button 
            label="Retry" 
            variant="primary" 
            onPress={() => {
              setLoading(true);
              IssueService.getIssueStatistics()
                .then(data => setStats(data))
                .catch(err => {
                  console.error(err);
                  setError('Failed to load issue statistics');
                })
                .finally(() => setLoading(false));
            }} 
          />
        </ThemedView>
      );
    }
    
    if (!stats) {
      return null;
    }
    
    return (
      <>
        {/* Issue Stats Cards */}
        <ThemedView style={styles.statsContainer}>
          <StatisticCard
            value={stats.total}
            label="Total Issues"
            backgroundColor={colorScheme === 'dark' ? '#2A2A2A' : '#F5F5F5'}
            iconName="tray.fill"
            iconColor={colors.icon}
          />
          
          <StatisticCard
            value={stats.bySeverity[IssueSeverity.High]}
            label={IssueSeverity.High}
            backgroundColor={colorScheme === 'dark' ? '#442626' : '#FDDCDC'}
            valueColor="#E11D48"
            labelColor="#E11D48"
            iconName="exclamationmark.triangle.fill"
            iconColor="#E11D48"
          />
          
          <StatisticCard
            value={stats.bySeverity[IssueSeverity.Medium]}
            label={IssueSeverity.Medium}
            backgroundColor={colorScheme === 'dark' ? '#453A1F' : '#FFF0C2'}
            valueColor="#F59E0B"
            labelColor="#F59E0B"
            iconName="exclamationmark.circle.fill"
            iconColor="#F59E0B"
          />
          
          <StatisticCard
            value={stats.bySeverity[IssueSeverity.Low]}
            label={IssueSeverity.Low}
            backgroundColor={colorScheme === 'dark' ? '#1E3A2F' : '#DCFCE7'}
            valueColor="#10B981"
            labelColor="#10B981"
            iconName="checkmark.circle.fill"
            iconColor="#10B981"
          />
        </ThemedView>
        
        {/* Issue Chart */}
        <IssueBarChart data={stats.bySeverity} total={stats.total} />
        
        {/* Quick Actions */}
        <ThemedView style={styles.actionsContainer}>
          <ThemedText type="subtitle">Quick Actions</ThemedText>
          
          <ThemedView style={styles.actionsRow}>
            <Link href="/(tabs)/create-issue" asChild>
              <Button
                label="Report New Issue"
                variant="primary"
                leftIcon={<IconSymbol size={18} name="plus.circle.fill" color="#FFFFFF" />}
                style={styles.actionButton}
              />
            </Link>
            
            <Link href="/(tabs)/issues" asChild>
              <Button
                label="View All Issues"
                variant="secondary"
                leftIcon={<IconSymbol size={18} name="list.bullet" color={colors.tint} />}
                style={styles.actionButton}
              />
            </Link>
          </ThemedView>
        </ThemedView>
        
        {/* Recent Activity */}
        <ThemedView style={styles.recentActivityContainer}>
          <ThemedView style={styles.sectionTitleRow}>
            <ThemedText type="subtitle">Recent Activity</ThemedText>
            <Link href="/(tabs)/issues">
              <ThemedText style={styles.viewAllLink}>View all</ThemedText>
            </Link>
          </ThemedView>
          
          {stats.recentIssues.length > 0 ? (
            <ThemedView style={styles.recentIssuesList}>
              {stats.recentIssues.map((issue) => (
                <RecentActivityItem key={issue.id} issue={issue} />
              ))}
            </ThemedView>
          ) : (
            <ThemedView style={styles.emptyState}>
              <IconSymbol size={40} name="tray.fill" color={colors.icon} />
              <ThemedText style={styles.emptyStateText}>No recent activity</ThemedText>
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
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Issue Dashboard</ThemedText>
      </ThemedView>
      
      {renderContent()}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  actionsContainer: {
    marginBottom: 24,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  recentActivityContainer: {
    marginBottom: 24,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllLink: {
    color: '#0086C9',
    fontSize: 14,
  },
  recentIssuesList: {
    borderWidth: 1,
    borderColor: '#E4E7EB',
    borderRadius: 12,
    overflow: 'hidden',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    borderWidth: 1,
    borderColor: '#E4E7EB',
    borderRadius: 12,
    marginTop: 12,
  },
  emptyStateText: {
    marginTop: 8,
    color: '#687076',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 12,
    color: '#687076',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  errorText: {
    color: '#E11D48',
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
