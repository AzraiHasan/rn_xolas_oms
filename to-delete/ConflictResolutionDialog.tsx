import React, { useState } from 'react';
import { Modal, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { IssueReport } from '@/types/models/Issue';

interface ConflictResolutionDialogProps {
  visible: boolean;
  onClose: () => void;
  localVersion: IssueReport;
  serverVersion: IssueReport;
  onResolve: (resolution: 'local' | 'server' | 'merge') => Promise<void>;
}

export function ConflictResolutionDialog({
  visible,
  onClose,
  localVersion,
  serverVersion,
  onResolve
}: ConflictResolutionDialogProps) {
  const [isResolving, setIsResolving] = useState(false);

  const handleResolve = async (resolution: 'local' | 'server' | 'merge') => {
    setIsResolving(true);
    try {
      await onResolve(resolution);
      onClose();
    } catch (error) {
      console.error('Failed to resolve conflict:', error);
    } finally {
      setIsResolving(false);
    }
  };

  // Find differences between the two versions
  const findDifferences = () => {
    const differences = [];
    
    if (localVersion.title !== serverVersion.title) {
      differences.push({
        field: 'Title',
        local: localVersion.title,
        server: serverVersion.title
      });
    }
    
    if (localVersion.description !== serverVersion.description) {
      differences.push({
        field: 'Description',
        local: localVersion.description,
        server: serverVersion.description
      });
    }
    
    if (localVersion.location !== serverVersion.location) {
      differences.push({
        field: 'Location',
        local: localVersion.location,
        server: serverVersion.location
      });
    }
    
    if (localVersion.severity !== serverVersion.severity) {
      differences.push({
        field: 'Severity',
        local: localVersion.severity,
        server: serverVersion.severity
      });
    }
    
    // Compare photos
    const localPhotoIds = localVersion.photos.map(p => p.id);
    const serverPhotoIds = serverVersion.photos.map(p => p.id);
    
    if (localPhotoIds.length !== serverPhotoIds.length) {
      differences.push({
        field: 'Photos',
        local: `${localPhotoIds.length} photos`,
        server: `${serverPhotoIds.length} photos`
      });
    }
    
    return differences;
  };

  const differences = findDifferences();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView intensity={70} className="flex-1 justify-center items-center p-4">
        <ThemedView className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md p-4">
          <ThemedView className="flex-row justify-between items-center mb-4">
            <ThemedText type="title">Sync Conflict</ThemedText>
            <TouchableOpacity onPress={onClose} disabled={isResolving}>
              <IconSymbol name="xmark" size={24} color="#6B7280" />
            </TouchableOpacity>
          </ThemedView>
          
          <ThemedText className="mb-4">
            This issue has been modified both locally and on the server. Please choose which version to keep.
          </ThemedText>
          
          {differences.length > 0 && (
            <ThemedView className="border border-gray-200 dark:border-gray-700 rounded-lg mb-4">
              <ThemedView className="bg-gray-100 dark:bg-gray-700 p-2 rounded-t-lg">
                <ThemedText type="subtitle" className="text-sm">Differences</ThemedText>
              </ThemedView>
              
              {differences.map((diff, index) => (
                <ThemedView 
                  key={diff.field} 
                  className={`p-3 ${index < differences.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}
                >
                  <ThemedText className="font-medium mb-1">{diff.field}</ThemedText>
                  <ThemedView className="flex-row">
                    <ThemedView className="flex-1 pr-2">
                      <ThemedText className="text-xs text-gray-500 dark:text-gray-400 mb-1">Local</ThemedText>
                      <ThemedText className="text-sm text-blue-600">{diff.local}</ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-1 pl-2 border-l border-gray-200 dark:border-gray-700">
                      <ThemedText className="text-xs text-gray-500 dark:text-gray-400 mb-1">Server</ThemedText>
                      <ThemedText className="text-sm text-green-600">{diff.server}</ThemedText>
                    </ThemedView>
                  </ThemedView>
                </ThemedView>
              ))}
            </ThemedView>
          )}
          
          <ThemedView className="flex-row gap-3 mt-2">
            <Button
              label="Keep Local"
              variant="secondary"
              className="flex-1"
              disabled={isResolving}
              onPress={() => handleResolve('local')}
            />
            <Button
              label="Keep Server"
              variant="secondary"
              className="flex-1"
              disabled={isResolving}
              onPress={() => handleResolve('server')}
            />
          </ThemedView>
          
          <Button
            label="Smart Merge"
            variant="primary"
            className="mt-3"
            disabled={isResolving}
            loading={isResolving}
            onPress={() => handleResolve('merge')}
          />
        </ThemedView>
      </BlurView>
    </Modal>
  );
}
