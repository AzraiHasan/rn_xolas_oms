# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Xolas OMS** (v0.0.1) - an onsite reporting app prototype built with React Native/Expo for field technicians to create issue reports with photo attachments. 

**Branch: feature/supabase-integration** - Supabase integration Phase 3 complete! Report sync and photo sync fully working on all platforms (web ✅, native ✅). Ready for Phase 4 (Multi-Device Testing).

## Current Implementation State

**Status**: Phase 3 Complete ✅ - Cross-platform sync fully operational on all platforms
**Data Flow**: UI → IssueContext → IssueRepository → StorageService (Local + Supabase sync)
**Report Sync**: ✅ Fully working - local to Supabase database sync operational on all platforms (native, web)
**Photo Sync**: ✅ Fully working - Both web and native platforms operational with Supabase Storage
**Current Phase**: Ready for Phase 4 (Multi-Device Testing)

## Development Commands

- `npm install` - Install dependencies
- `npm install @supabase/supabase-js` - Install Supabase client (for this branch)
- `npx expo start` - Start development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator  
- `npm run web` - Run web version
- `npm run lint` - Run ESLint checks
- `npm run reset-project` - Reset to blank project

## Branch Context

**Working POC**: Switch to `alpha-dev` branch for stable demo version
**Supabase Integration**: Stay on this branch for backend integration work

## Architecture

### Core Services Architecture (Phase 2 Complete)
- **IssueContext** - ✅ Global state management using React Context
- **IssueRepository** - ✅ Abstraction layer with local + Supabase sync
- **StorageService** - ✅ Hybrid: AsyncStorage + ExpoFileSystem + Supabase sync
- **SyncService** - ✅ Supabase backend integration operational (reports sync working)
- **SupabaseService** - ✅ Database operations implemented and working

### Current Storage Strategy (Hybrid Architecture)
- **Issues**: Local AsyncStorage + Supabase database sync (✅ working on all platforms)
- **Photos**: Local file system + Supabase Storage (✅ working on all platforms)
- **Sync Status**: Device-based sync_status tracking ('pending'/'synced')
- **Device Isolation**: UUID-based device_id for multi-device support
- **Network**: @react-native-community/netinfo triggering auto-sync
- **Platform Compatibility**: Web compatibility added with localStorage and platform-specific storage adapters

### Database Schema (Implemented - Phase 1 Complete)
```sql
-- Current working schema (Phase 1)
reports (id, device_id, title, description, severity, status, sync_status, created_at, metadata)
photos (id, report_id, storage_path, thumbnail_path, metadata)
sync_logs (id, device_id, operation, status, timestamp)

-- Future expansion tables (planned)
organizations (id, name, settings)
sites (id, organization_id, name, location, metadata)
teams (id, site_id, name)
users (id, team_id, name, role, permissions)
```

### UI Framework
- **NativeWind** for Tailwind CSS styling
- **Expo Router** with file-based routing (`app/` directory)
- **Tab navigation** as primary navigation pattern

### Navigation Structure
```
app/
├── (tabs)/          # Tab-based navigation
│   ├── index.tsx    # Dashboard/Home
│   ├── issues.tsx   # Issue list
│   └── create-issue.tsx # Issue creation
├── issue/
│   ├── [id].tsx     # Issue detail view
│   └── update/[id].tsx # Issue editing
```

### Component Organization
- `components/ui/` - Reusable UI components with NativeWind styling
- `components/issues/` - Issue-specific components
- `components/photos/` - Camera and photo handling components
- `components/forms/` - Form field components

### Type System
- Path aliases: `@/*` maps to project root
- TypeScript strict mode enabled
- Centralized types in `types/models/` and `types/services/`

### Photo Management (Implemented)
- ✅ Camera integration via `expo-camera` v16.1.6
- ✅ Gallery access via `expo-image-picker` v16.1.4  
- ✅ Local file storage via ExpoFileSystemService in document directory
- ✅ Image optimization via `expo-image-manipulator` with smart compression (200KB threshold)
- ✅ Automatic resizing (max 1200px width) and JPEG quality control (70-80%)
- ❌ Thumbnail generation not implemented (full-size only)

### Offline-First Design (Hybrid - Phase 2 Complete)
- ✅ **Primary**: Local-first with AsyncStorage + FileSystem for immediate operations
- ✅ **Background Sync**: Automatic sync to Supabase when network available
- ✅ **Network Awareness**: `@react-native-community/netinfo` triggering auto-sync  
- ✅ **Device Isolation**: UUID-based device_id for multi-device data separation
- ✅ **Sync Status Tracking**: 'pending'/'synced' status per report
- ✅ **Cross-Platform Compatibility**: Web and native storage adapters with platform detection
- ✅ **Photo Sync**: Both web and native platforms operational with Supabase Storage

## Implementation Progress

### ✅ Phase 1: Backend Setup (Complete)
- [x] Supabase project configured with database schema
- [x] Storage bucket (report-photos) created
- [x] Row Level Security policies defined and configured for production use
- [x] Environment variables configured

### ✅ Phase 2: Mobile Integration (Complete) 
- [x] Supabase client integrated with AsyncStorage
- [x] Issue model updated with sync_status and device_id fields
- [x] Device ID utility for cross-platform UUID generation
- [x] Sync service operational with real Supabase database operations
- [x] Test component integrated as Test tab for validation
- [x] Cross-platform compatibility added (web + native)
- [x] Storage service with platform-specific adapters implemented

### ✅ Phase 3: Testing & Validation (Complete)
**Priority 1: Photo Storage**
- [x] Configure storage bucket RLS policies for device-based uploads (✅ RLS policies created)
- [x] Implement getPhotoData method for FileStorageService interface (✅ completed)
- [x] Test photo sync functionality on web platform (✅ working)
- [x] Resolve native platform photo upload technical challenges (✅ resolved using fetch + arrayBuffer approach)

### 🔄 Phase 4: Multi-Device Testing (Next Priority)

**Priority 2: Multi-Device Testing** 
- [ ] Test device isolation with multiple installations
- [ ] Validate data separation between device_ids
- [ ] Verify admin access to all reports

**Priority 3: Performance & Edge Cases**
- [ ] Test sync with larger datasets (10+ reports with photos)
- [ ] Validate conflict resolution and retry mechanisms  
- [ ] Performance comparison with alpha-dev branch
- [x] Cross-platform compatibility validation (✅ web and native tested)

## Success Metrics Progress

| Metric | Target | Current Status |
|--------|--------|----------------|
| Zero data loss during sync | 100% | ✅ Reports sync without loss on all platforms |
| Device data isolation | 100% | ✅ Device_id implemented, ready for multi-device validation |
| Cross-platform compatibility | 100% | ✅ Web and native platforms operational |
| Admin access to all reports | <5 seconds | ✅ RLS policies configured and working |
| Photo sync functionality | 100% | ✅ Both web and native platforms operational |
| Sync completion time | <30 seconds for 10 reports | ✅ Individual reports <2 seconds, scalability pending test |

## Key Implementation Notes

- **Report sync fully operational** - End-to-end sync from mobile/web to Supabase working on all platforms
- **Photo sync fully operational** - Both web and native platforms working with Supabase Storage (native resolved using fetch + arrayBuffer)
- **Cross-platform compatibility achieved** - Storage services with platform-specific adapters (localStorage for web, AsyncStorage for native)
- **RLS policies configured** - Storage bucket policies working, allowing proper photo uploads
- **Device isolation architecture** - UUID-based device_id system implemented and functional
- **Zero breaking changes** - Existing mobile app functionality preserved during integration
- **Test interface operational** - SyncTestComponent integrated as Test tab for validation
- **Performance validated** - Individual report sync <2 seconds, network-aware auto-sync working
- **Web compatibility added** - Full web browser support with proper storage adapters

---

## 🎯 Current Focus: Phase 3 Testing & Validation

**Next Priority:** Multi-device testing and performance validation with larger datasets. Photo sync technical challenges have been resolved.

**Current Status:** Cross-platform sync architecture complete with both report sync and photo sync working on all platforms. Native photo upload issue resolved using fetch + arrayBuffer approach for proper binary data handling.