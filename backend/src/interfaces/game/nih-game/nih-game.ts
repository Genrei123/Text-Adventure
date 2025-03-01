// Location interface
export interface Location {
    id: string;
    name: string;
    description: string;
    exits: { [direction: string]: string }; // e.g., { "north": "forest", "south": "village" }
    events: string[];
    interactables?: string[]; // New field for usable targets
}
  
  // Item interface
  export interface Item {
    id: string;
    name: string;
    description: string;
    usableOn?: string[]; // Optional: items or objects it can be used on
}