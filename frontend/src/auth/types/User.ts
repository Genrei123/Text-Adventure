interface User {
    id: number;
    username: string;
    email: string;
    private: boolean;
    model: string;
    admin: boolean;
}

export interface LoginResponse {
    message: string;
    token: string;
    user: User;
}