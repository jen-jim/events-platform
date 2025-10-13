import { Link } from "react-router-dom";

export function Navbar() {
    return (
        <nav className="p-4 border-b mb-4 flex justify-between items-center bg-gray-50">
            <Link to="/" className="font-bold text-xl">
                🎟 Event Manager
            </Link>
            <div className="space-x-4">
                <Link to="/" className="hover:underline">
                    Home
                </Link>
                <Link to="/create" className="hover:underline">
                    Create
                </Link>
            </div>
        </nav>
    );
}
