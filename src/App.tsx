import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Navbar } from "./components/NavBar";
import { AuthProvider } from "./contexts/AuthProvider";
import { Home } from "./pages/Home";
import { LoginRegister } from "./pages/LoginRegister";
import { Profile } from "./pages/Profile";

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <div className="p-4 max-w-2xl mx-auto">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/auth" element={<LoginRegister />} />
                        <Route path="/profile" element={<Profile />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}
