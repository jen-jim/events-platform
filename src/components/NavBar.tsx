import { CircleUser } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.tsx";

export function Navbar() {
    const { user } = useContext(AuthContext);

    return (
        <nav className="p-4 border-b mb-4 flex justify-between items-center bg-gray-50">
            <Link to="/" className="font-bold text-xl">
                EventsHub
            </Link>
            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        <Link
                            to="/profile"
                            className="flex items-center ml-4 gap-1"
                        >
                            <CircleUser /> {user.name}
                        </Link>
                    </>
                ) : (
                    <Link to="/auth">Login / Register</Link>
                )}
            </div>
        </nav>
    );
}
