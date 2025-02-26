export interface JoinPayload {
  route: string;
  email: string;
  token: string;
}

export interface PlayerCount {
  activePlayers: number;
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