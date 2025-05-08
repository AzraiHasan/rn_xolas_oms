import { ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Input } from '@/components/ui/Input';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IssueSeverity } from '@/types/models/Issue';

/**
 * Screen for creating a new issue
 */
export default function CreateIssueScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Report an Issue</ThemedText>
      </ThemedView>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.formSection}>
          <ThemedText type="subtitle">Issue Details</ThemedText>
          
          <Input
            label="Title"
            placeholder="Brief description of the issue"
            required
          />
          
          <Input
            label="Description"
            placeholder="Detailed explanation of the issue"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={styles.textArea}
            required
          />
          
          <Input
            label="Location"
            placeholder="Where is the issue located?"
            required
            leftIcon={<IconSymbol size={16} name="mappin.circle.fill" color={colors.icon} />}
          />
        </ThemedView>
        
        <ThemedView style={styles.formSection}>
          <ThemedText type="subtitle">Severity</ThemedText>
          
          <ThemedView style={styles.severityButtons}>
            <Button
              label={IssueSeverity.Low}
              variant="ghost"
              style={[styles.severityButton, { backgroundColor: '#DCFCE7' }]}
              textStyle={{ color: '#10B981' }}
            />
            
            <Button
              label={IssueSeverity.Medium}
              variant="ghost"
              style={[styles.severityButton, { backgroundColor: '#FFF0C2' }]}
              textStyle={{ color: '#F59E0B' }}
            />
            
            <Button
              label={IssueSeverity.High}
              variant="ghost"
              style={[styles.severityButton, { backgroundColor: '#FDDCDC' }]}
              textStyle={{ color: '#E11D48' }}
            />
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.formSection}>
          <ThemedText type="subtitle">Photos</ThemedText>
          
          <ThemedView style={styles.photoSection}>
            <Button
              label="Take Photo"
              variant="secondary"
              leftIcon={<IconSymbol size={16} name="camera.fill" color={colors.tint} />}
              style={styles.photoButton}
            />
            
            <Button
              label="Choose from Gallery"
              variant="secondary"
              leftIcon={<IconSymbol size={16} name="photo.on.rectangle" color={colors.tint} />}
              style={styles.photoButton}
            />
          </ThemedView>
          
          <ThemedView style={styles.photoPlaceholder}>
            <IconSymbol size={32} name="photo.fill" color={colors.icon} />
            <ThemedText style={styles.photoPlaceholderText}>No photos added yet</ThemedText>
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.submitSection}>
          <Button
            label="Submit Report"
            variant="primary"
            size="large"
          />
        </ThemedView>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  formSection: {
    marginBottom: 24,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  severityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  severityButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  photoSection: {
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 16,
  },
  photoButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  photoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    borderWidth: 1,
    borderColor: '#E4E7EB',
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  photoPlaceholderText: {
    marginTop: 8,
    color: '#687076',
  },
  submitSection: {
    marginTop: 32,
    marginBottom: 16,
  },
});
