interface Game {
    id: number;
    title: string;
    slug: string;
    description: string;
    tagline: string;
    genre: string;
    subgenre: string;
    primary_color: string;
    private: boolean;
    createdAt: string;
    updatedAt: string;
    UserId: number | null;
  }