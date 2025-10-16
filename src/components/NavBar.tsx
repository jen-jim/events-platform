import { CircleUser, Coffee } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.tsx";
import "./NavBar.css";

export function Navbar() {
    const { user } = useContext(AuthContext);

    return (
        <header className="site-header">
            <nav className="navbar">
                <div className="navbar-left">
                    <Link to="/" className="navbar-logo">
                        The Cupping Room <Coffee className="navbar-logo-icon" />
                    </Link>
                    <p className="navbar-tagline">
                        Brewed experiences, shared together
                    </p>
                </div>

                <div className="navbar-links">
                    {user ? (
                        <>
                            <Link
                                to="/profile"
                                className="navbar-user"
                                title="Profile"
                            >
                                <CircleUser className="navbar-icon" />{" "}
                                <span className="navbar-username">
                                    {user.name}
                                </span>
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
