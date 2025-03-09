export interface Player {
  id: number;
  username: string;
  email: string;
  status: 'online' | 'offline';
  subscription: string;
  coinsBalance: number;
  lastActivity: string;
}

export interface Game {
  title: string;
  excerpt: string;
  created: string;
  status: string;
}