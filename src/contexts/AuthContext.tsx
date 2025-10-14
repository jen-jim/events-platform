import { createContext } from "react";

export interface User {
    id: number;
    name: string;
    email: string;
    role: "user" | "staff";
    createdAt: string;
}

interface AuthContextType {
    user: User | null;
    refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    refreshUser: async () => {}
});
