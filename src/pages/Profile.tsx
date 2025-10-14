// src/pages/Profile.tsx
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export function Profile() {
    const { user, refreshUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        refreshUser().finally(() => setLoading(false));
    }, [refreshUser]);

    if (loading) return <p>Loading profile...</p>;
    if (!user) return <p>You must be logged in to view your profile.</p>;

    async function handleLogout() {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            refreshUser();
            navigate("/");
        } catch {
            alert("Logout failed");
        }
    }

    return (
        <div className="max-w-md mx-auto p-4 border rounded shadow">
            <h2 className="text-xl font-bold mb-4">Your Profile</h2>
            <p>
                <strong>Email:</strong> {user.email}
            </p>
            <p>
                <strong>Role:</strong> {user.role}
            </p>
            <p>
                <strong>Joined:</strong>{" "}
                {new Date(user.createdAt).toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                })}
            </p>
            <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
            >
                Logout
            </button>
        </div>
    );
}
