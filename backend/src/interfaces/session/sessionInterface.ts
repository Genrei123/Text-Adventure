export interface SessionData {
    interactions: any[];
    gamesCreated: any[];
    gamesPlayed: any[];
    visitedPages?: Record<string, number>; // Add this line
  }