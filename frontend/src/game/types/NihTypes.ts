interface GameMessage {
    content: string;
    isUser: boolean;
    timestamp: string;
  }
  
  interface Item {
    id: string;
    name: string;
    description: string;
    usableOn: string[];
  }
  
  interface Location {
    id: string;
    name: string;
    description: string;
    exits: { [key: string]: string };
  }
  
  interface GameState {
    locationId: string;
    locationDetails: Location;
    inventory: Item[];
  }