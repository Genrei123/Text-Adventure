interface Comment {
    id: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    UserId: number;
    GameId: number;
    Game: {
      title: string;
      id: number;
    };
    User: {
        username: string;
        id: number;

    }


}