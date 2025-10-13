import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/api";
import { AuthContext, type User } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    async function refreshUser() {
        const data = await getCurrentUser();
        setUser(data?.user || null);
    }

    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}
