export interface JoinPayload {
  route: string;
  token?: string;
  email: string;
}

export interface PlayerCount {
  activePlayers: number;
}

export interface LastPlayedPayload {
  route: string;
  email: string;
  timestamp: number;
  gameName?: string;
}

export interface SessionData {
  startTime: Date;
  endTime?: Date;
  sessionData: {
    interactions: { [key: string]: any };
    gamesCreated: { [key: string]: any };
    gamesPlayed: { [key: string]: any };
    visitedPages: { [key: string]: any };
  };
}