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
    interactions: string[];
  }