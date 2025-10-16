import { CircleUser } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.tsx";
import "./NavBar.css";

export function Navbar() {
    const { user } = useContext(AuthContext);

    return (
        <header className="site-header">
            <nav className="navbar">
                <Link to="/" className="navbar-logo">
                    The Cupping Room
                </Link>

                <p className="navbar-tagline">
                    Brewed experiences, shared together
                </p>

                <div className="navbar-links">
                    {user ? (
                        <>
                            <Link to="/profile" className="navbar-user">
                                <CircleUser size={18} />{" "}
                                <span>{user.name}</span>
                            </Link>
                        </>
                    ) : (
                        <Link to="/auth" className="navbar-auth">
                            Login / Register
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
}
