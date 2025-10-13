import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export function Navbar() {
    const { user } = useContext(AuthContext);

    return (
        <nav className="p-4 border-b mb-4 flex justify-between items-center bg-gray-50">
            <Link to="/" className="font-bold text-xl">
                Home
            </Link>
            <div>
                {user?.role === "staff" && (
                    <Link to="/create">Create Event</Link>
                )}
                {!user && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
