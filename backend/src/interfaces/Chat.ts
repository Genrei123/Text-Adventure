export interface Chat {
    session_id: string;
    model: string;
    role: string;
    content: string;
    GameId: number;
    UserId: number;
    createdAt: Date;
    updatedAt: Date;
}
