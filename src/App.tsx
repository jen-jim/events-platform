import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Navbar } from "./components/NavBar";
import { AuthProvider } from "./contexts/AuthProvider";
import { CreateEvent } from "./pages/CreateEvent";
import Home from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <div className="p-4 max-w-2xl mx-auto">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/create"
                            element={
                                <CreateEvent
                                    onEventCreated={function (): void {
                                        throw new Error(
                                            "Function not implemented."
                                        );
                                    }}
                                />
                            }
                        />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}
