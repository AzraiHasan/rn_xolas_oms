/**
 * Synchronization Service
 * 
 * Manages data synchronization between local device and Supabase backend.
 * Implements device isolation and offline-first strategy.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { supabase } from './supabase/supabaseClient';
import { issueStorage, fileStorage } from './StorageService';
import { getDeviceId } from '../utils/deviceId';
import { IssueReport } from '../types/models/Issue';

const SYNC_QUEUE_KEY = 'xolas_oms.sync_queue';
const SYNC_STATE_KEY = 'xolas_oms.sync_state';

export class SyncService {
  private syncInProgress = false;
  
  async initializeSync() {
    // Monitor network changes and auto-sync
    NetInfo.addEventListener(state => {
      if (state.isConnected && !this.syncInProgress) {
        this.performSync();
      }
    });
  }

  async performSync(): Promise<{ successful: number; failed: number }> {
    if (this.syncInProgress) return { successful: 0, failed: 0 };
    
    this.syncInProgress = true;
    let successful = 0;
    let failed = 0;

    try {
      const deviceId = await getDeviceId();
      await this.authenticateDevice(deviceId);
      
      const pendingReports = await this.getUnsyncedReports();
      
      for (const report of pendingReports) {
        try {
          // Upload report to Supabase
          const { error: reportError } = await supabase
            .from('reports')
            .upsert({
              id: report.id,
              device_id: deviceId,
              title: report.title,
              description: report.description,
              location: report.siteId,
              severity: report.severity,
              created_at: report.timestamp,
              updated_at: new Date().toISOString(),
              sync_status: 'synced'
            });
            
          if (!reportError) {
            await this.syncPhotosForReport(report);
            await this.markReportSynced(report.id);
            successful++;
          } else {
            failed++;
          }
        } catch (error) {
          console.error('Sync failed for report:', report.id, error);
          failed++;
        }
      }
      
      await this.logSyncEvent(deviceId, successful);
      
    } finally {
      this.syncInProgress = false;
    }
    
    return { successful, failed };
  }
  
  private async authenticateDevice(deviceId: string): Promise<void> {
    // Use Supabase anonymous auth with custom claims
    const { error } = await supabase.auth.signInAnonymously({
      data: { device_id: deviceId }
    });
    
    if (error) throw error;
  }
  
  private async getUnsyncedReports(): Promise<IssueReport[]> {
    const allReports = await issueStorage.getAllIssues();
    return allReports.filter(report => report.sync_status === 'pending');
  }
  
  private async syncPhotosForReport(report: IssueReport): Promise<void> {
    for (const photo of report.photos) {
      try {
        // Upload photo to Supabase Storage
        const photoBlob = await fetch(photo.uri).then(r => r.blob());
        
        const { error } = await supabase.storage
          .from('report-photos')
          .upload(`${report.device_id}/${photo.id}`, photoBlob);
          
        if (!error) {
          // Insert photo metadata
          await supabase.from('photos').insert({
            id: photo.id,
            report_id: report.id,
            file_path: `${report.device_id}/${photo.id}`,
            created_at: photo.timestamp
          });
        }
      } catch (error) {
        console.error('Photo sync failed:', photo.id, error);
      }
    }
  }
  
  private async markReportSynced(reportId: string): Promise<void> {
    const report = await issueStorage.getIssueById(reportId);
    if (report) {
      report.sync_status = 'synced';
      await issueStorage.updateIssue(report);
    }
  }
  
  private async logSyncEvent(deviceId: string, reportsSynced: number): Promise<void> {
    await supabase.from('sync_logs').insert({
      device_id: deviceId,
      reports_synced: reportsSynced,
      sync_timestamp: new Date().toISOString()
    });
  }
}

export const syncService = new SyncService();
