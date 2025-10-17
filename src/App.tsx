import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
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
                <main className="app-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/auth" element={<LoginRegister />} />
                        <Route path="/profile" element={<Profile />} />
                    </Routes>
                </main>
            </Router>
            <Toaster position="top-center" />
        </AuthProvider>
    );
}
