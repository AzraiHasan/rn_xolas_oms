import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IssueSeverity } from '@/types/models/Issue';

/**
 * Mock data for demonstration purposes
 */
const MOCK_ISSUE_COUNTS = {
  total: 12,
  high: 3,
  medium: 5,
  low: 4,
};

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
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
      
      {/* Issue Stats Cards */}
      <ThemedView style={styles.statsContainer}>
        <ThemedView style={styles.statsCard}>
          <ThemedText style={styles.statValue}>{MOCK_ISSUE_COUNTS.total}</ThemedText>
          <ThemedText style={styles.statLabel}>Total Issues</ThemedText>
        </ThemedView>
        
        <ThemedView style={[styles.statsCard, { backgroundColor: '#FDDCDC' }]}>
          <ThemedText style={[styles.statValue, { color: '#E11D48' }]}>
            {MOCK_ISSUE_COUNTS.high}
          </ThemedText>
          <ThemedText style={[styles.statLabel, { color: '#E11D48' }]}>
            {IssueSeverity.High}
          </ThemedText>
        </ThemedView>
        
        <ThemedView style={[styles.statsCard, { backgroundColor: '#FFF0C2' }]}>
          <ThemedText style={[styles.statValue, { color: '#F59E0B' }]}>
            {MOCK_ISSUE_COUNTS.medium}
          </ThemedText>
          <ThemedText style={[styles.statLabel, { color: '#F59E0B' }]}>
            {IssueSeverity.Medium}
          </ThemedText>
        </ThemedView>
        
        <ThemedView style={[styles.statsCard, { backgroundColor: '#DCFCE7' }]}>
          <ThemedText style={[styles.statValue, { color: '#10B981' }]}>
            {MOCK_ISSUE_COUNTS.low}
          </ThemedText>
          <ThemedText style={[styles.statLabel, { color: '#10B981' }]}>
            {IssueSeverity.Low}
          </ThemedText>
        </ThemedView>
      </ThemedView>
      
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
      
      {/* Recent Activity - Placeholder */}
      <ThemedView style={styles.recentActivityContainer}>
        <ThemedText type="subtitle">Recent Activity</ThemedText>
        <ThemedView style={styles.emptyState}>
          <IconSymbol size={40} name="tray.fill" color={colors.icon} />
          <ThemedText style={styles.emptyStateText}>No recent activity</ThemedText>
        </ThemedView>
      </ThemedView>
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
  statsCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
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
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
