import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.tsx";

export function Navbar() {
    const { user, refreshUser } = useContext(AuthContext);
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            refreshUser(); // resets user in context
            navigate("/login");
        } catch {
            alert("Logout failed");
        }
    }

    return (
        <nav className="p-4 border-b mb-4 flex justify-between items-center bg-gray-50">
            <Link to="/" className="font-bold text-xl">
                Home
            </Link>
            <div className="flex items-center gap-4">
                {user?.role === "staff" && (
                    <Link
                        to="/create"
                        className="text-blue-600 hover:underline"
                    >
                        Create Event
                    </Link>
                )}

                {user ? (
                    <>
                        <span>👤 {user.email}</span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="text-blue-600 hover:underline"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="text-blue-600 hover:underline"
                        >
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
