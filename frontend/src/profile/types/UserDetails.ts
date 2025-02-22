interface UserDetails {
    id: number;
    username: string;
    email: string;
    private: boolean;
    model: string;
    admin: boolean;
    emailVerified: boolean;
    totalCoins: number;
    createdAt: string;
    updatedAt: string;
    
    // Bio property
    bio: string | null;
    
    // Profile picture property (typically stored as a URL or path)
    profilePicture: string | null;
    
    // Games created by the user (array of game objects/IDs)
    gamesCreated: number[] | null;
    
    // Comments made by the user (array of comment references/IDs)
    commentedOn: number[] | null;
}