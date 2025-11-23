import { type Session } from './auth-schema';

export type { LoginDto, Session } from './auth-schema';

export interface AuthState {
    session: Session | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface LoginResponse {
    session: Session;
    message: string;
}