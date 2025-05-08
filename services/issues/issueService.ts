import { IssueReport, IssueSeverity } from '@/types/models/Issue';

/**
 * Mock issue data for development purposes
 */
const MOCK_ISSUES: IssueReport[] = [
  {
    id: '1',
    title: 'Water pump malfunction',
    description: 'Main water pump is making unusual noise and not pumping efficiently. Possible bearing failure.',
    location: 'Building A, Utility Room',
    timestamp: new Date(2025, 4, 1).toISOString(),
    severity: IssueSeverity.High,
    photos: [
      {
        id: 'p1',
        uri: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=884&auto=format&fit=crop',
        timestamp: new Date(2025, 4, 1).toISOString(),
        title: 'Water pump overview'
      },
      {
        id: 'p2',
        uri: 'https://images.unsplash.com/photo-1583475020839-119feddf2ec6?q=80&w=992&auto=format&fit=crop',
        timestamp: new Date(2025, 4, 1).toISOString(),
        title: 'Close-up of damaged area'
      }
    ]
  },
  {
    id: '2',
    title: 'Exterior wall crack',
    description: 'Found a 2mm crack in the south-facing exterior wall. No water infiltration yet, but could worsen.',
    location: 'Building B, South Wall',
    timestamp: new Date(2025, 4, 3).toISOString(),
    severity: IssueSeverity.Medium,
    photos: [
      {
        id: 'p3',
        uri: 'https://images.unsplash.com/photo-1520642413789-2bd6770d59e3?q=80&w=1170&auto=format&fit=crop',
        timestamp: new Date(2025, 4, 3).toISOString(),
        title: 'Wall crack overview'
      }
    ]
  },
  {
    id: '3',
    title: 'HVAC filter replacement',
    description: 'Scheduled maintenance: HVAC filters need replacement. Current filters have been in use for 4 months.',
    location: 'Central Air Handling Unit',
    timestamp: new Date(2025, 4, 4).toISOString(),
    severity: IssueSeverity.Low,
    photos: [
      {
        id: 'p4',
        uri: 'https://images.unsplash.com/photo-1621095271333-7dbe8545f27a?q=80&w=1074&auto=format&fit=crop',
        timestamp: new Date(2025, 4, 4).toISOString(),
        title: 'HVAC filter condition'
      }
    ]
  },
  {
    id: '4',
    title: 'Electrical panel overheating',
    description: 'Main electrical panel B-12 showing signs of overheating. Thermal scan shows hotspots on several breakers.',
    location: 'Building C, Electrical Room',
    timestamp: new Date(2025, 4, 5).toISOString(),
    severity: IssueSeverity.High,
    photos: [
      {
        id: 'p5',
        uri: 'https://images.unsplash.com/photo-1629118802861-a1a6c3fdae11?q=80&w=1074&auto=format&fit=crop',
        timestamp: new Date(2025, 4, 5).toISOString(),
        title: 'Electrical panel thermal scan'
      }
    ]
  },
  {
    id: '5',
    title: 'Roof drainage blockage',
    description: 'Roof drain appears to be partially blocked with debris. Standing water observed after recent rainfall.',
    location: 'Building A, Roof',
    timestamp: new Date(2025, 4, 6).toISOString(),
    severity: IssueSeverity.Medium,
    photos: [
      {
        id: 'p6',
        uri: 'https://images.unsplash.com/photo-1575385151618-85a86d4c1a10?q=80&w=1170&auto=format&fit=crop',
        timestamp: new Date(2025, 4, 6).toISOString(),
        title: 'Blocked roof drainage'
      }
    ]
  },
  {
    id: '6',
    title: 'Parking lot pothole',
    description: 'Small pothole developing in visitor parking area. Currently about 30cm in diameter and 5cm deep.',
    location: 'Visitor Parking Lot, Space 12',
    timestamp: new Date(2025, 4, 7).toISOString(),
    severity: IssueSeverity.Low,
    photos: [
      {
        id: 'p7',
        uri: 'https://images.unsplash.com/photo-1594761051605-a4dcb6597e4e?q=80&w=987&auto=format&fit=crop',
        timestamp: new Date(2025, 4, 7).toISOString(),
        title: 'Parking lot pothole'
      }
    ]
  },
  {
    id: '7',
    title: 'Safety rail damage',
    description: 'Safety rail on the west stairwell has a loose mounting bracket. Creates wobble when used.',
    location: 'Building B, West Stairwell',
    timestamp: new Date(2025, 4, 7).toISOString(),
    severity: IssueSeverity.High,
    photos: [
      {
        id: 'p8',
        uri: 'https://images.unsplash.com/photo-1573962576149-7416d648e8b0?q=80&w=987&auto=format&fit=crop',
        timestamp: new Date(2025, 4, 7).toISOString(),
        title: 'Damaged safety rail'
      }
    ]
  },
  {
    id: '8',
    title: 'Ceiling water stain',
    description: 'Water stain on ceiling tiles in the conference room. No active dripping, but stain is growing.',
    location: 'Building A, Main Conference Room',
    timestamp: new Date(2025, 4, 8).toISOString(),
    severity: IssueSeverity.Medium,
    photos: [
      {
        id: 'p9',
        uri: 'https://images.unsplash.com/photo-1617739284433-1d53b5c02099?q=80&w=987&auto=format&fit=crop',
        timestamp: new Date(2025, 4, 8).toISOString(),
        title: 'Ceiling water stain'
      }
    ]
  }
];

/**
 * Service for managing issue reports
 */
export const IssueService = {
  /**
   * Get all issues
   */
  getAllIssues: (): Promise<IssueReport[]> => {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...MOCK_ISSUES]);
      }, 500);
    });
  },

  /**
   * Get issue by ID
   */
  getIssueById: (id: string): Promise<IssueReport | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const issue = MOCK_ISSUES.find(issue => issue.id === id);
        resolve(issue);
      }, 300);
    });
  },

  /**
   * Get issues by severity
   */
  getIssuesBySeverity: (severity: IssueSeverity): Promise<IssueReport[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredIssues = MOCK_ISSUES.filter(issue => issue.severity === severity);
        resolve(filteredIssues);
      }, 300);
    });
  },

  /**
   * Get issue statistics
   */
  getIssueStatistics: (): Promise<{
    total: number;
    bySeverity: Record<IssueSeverity, number>;
    recentIssues: IssueReport[];
  }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Get counts by severity
        const bySeverity = {
          [IssueSeverity.Low]: MOCK_ISSUES.filter(i => i.severity === IssueSeverity.Low).length,
          [IssueSeverity.Medium]: MOCK_ISSUES.filter(i => i.severity === IssueSeverity.Medium).length,
          [IssueSeverity.High]: MOCK_ISSUES.filter(i => i.severity === IssueSeverity.High).length,
        };

        // Get 5 most recent issues
        const recentIssues = [...MOCK_ISSUES]
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 5);

        resolve({
          total: MOCK_ISSUES.length,
          bySeverity,
          recentIssues
        });
      }, 500);
    });
  }
};
