interface User {
    id: number;
    username: string;
    email: string;
    private: boolean;
    model: string;
    admin: boolean;
}

interface LoginResponse {
    message: string;
    token: string;
    user: User;
}