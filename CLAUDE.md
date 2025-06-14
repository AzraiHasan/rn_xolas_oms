# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Xolas OMS** (v0.0.1) - an onsite reporting app prototype built with React Native/Expo for field technicians to create issue reports with photo attachments. 

**Branch: feature/supabase-integration** - This branch is migrating from custom offline-first sync to Supabase real-time architecture while preserving the working POC on `alpha-dev` branch.

## Migration Strategy

**Current State**: Transitioning from local-only storage to Supabase backend integration
**Goal**: Replace custom sync queue with Supabase real-time while maintaining offline capability
**Preserve**: UI components, navigation structure, and core user experience

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

### Core Services Architecture (Target)
- **IssueContext** - Global state management for issues using React Context
- **SupabaseService** - Replaces IssueRepository with Supabase client integration
- **StorageService** - Local caching layer (reduced role, mainly for offline)
- **Real-time Subscriptions** - Replaces custom SyncService with Supabase real-time

### Key Storage Strategy (Migrating)
- **Issues**: Supabase PostgreSQL database (primary) + local cache (offline)
- **Photos**: Supabase Storage buckets + local cache for offline viewing
- **Real-time Sync**: Supabase built-in real-time instead of custom queue

### Database Schema (Planned)
```sql
-- Core tables for multi-site/team support
organizations (id, name, settings)
sites (id, organization_id, name, location, metadata)
teams (id, site_id, name)
users (id, team_id, name, role, permissions)
issues (id, site_id, created_by, title, description, severity, status, metadata)
photos (id, issue_id, storage_path, thumbnail_path, metadata)
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

### Photo Management
- Camera integration via `expo-camera`
- Gallery access via `expo-image-picker`
- Local file storage in device document directory
- Thumbnail generation and full-size viewing

### Offline-First Design (Evolving)
- **Target**: Supabase offline-first SDK with automatic sync
- **Fallback**: Local cache for critical operations when offline  
- **Real-time**: Live updates for admin dashboard and field coordination
- **Network awareness**: `@react-native-community/netinfo` for connection status

## Migration Phases

### Phase 1: Supabase Setup
- [ ] Create Supabase project and configure database
- [ ] Set up authentication and Row Level Security policies
- [ ] Create database schema for multi-site/team structure

### Phase 2: Service Layer Migration  
- [ ] Create SupabaseService to replace IssueRepository
- [ ] Implement real-time subscriptions for issues
- [ ] Migrate photo storage to Supabase Storage

### Phase 3: Real-time Features
- [ ] Add live issue updates for admin dashboard
- [ ] Implement issue assignment and status tracking
- [ ] Build admin control center (separate Nuxt3 app)

### Phase 4: Testing & Optimization
- [ ] Compare performance with alpha-dev branch
- [ ] Validate offline functionality
- [ ] Load testing with multiple concurrent users

## Key Implementation Notes

- Preserve existing UI components and navigation
- Maintain custom ID generation for backward compatibility  
- Form validation in `utils/validation.ts` (keep existing)
- Theme management with light/dark mode support (unchanged)
- Replace sync queue with Supabase real-time subscriptions