export interface RegisterRequestBody {
    username: string;
    email: string;
    password: string;
    private?: boolean;
    model?: string;
    admin?: boolean;
}