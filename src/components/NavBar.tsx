import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.tsx";

export function Navbar() {
    const { user } = useContext(AuthContext);

    return (
        <nav className="p-4 border-b mb-4 flex justify-between items-center bg-gray-50">
            <Link to="/" className="font-bold text-xl">
                Home
            </Link>
            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        <Link to="/profile" className="ml-4">
                            👤 {user.email}
                        </Link>
                    </>
                ) : (
                    <Link to="/auth">Login / Register</Link>
                )}
            </div>
        </nav>
    );
}
