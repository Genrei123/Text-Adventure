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