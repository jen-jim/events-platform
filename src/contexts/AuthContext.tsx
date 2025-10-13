import { createContext } from "react";

export interface User {
    id: number;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    refreshUser: async () => {}
});
