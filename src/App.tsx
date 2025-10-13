import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Navbar } from "./components/NavBar";
import { CreateEvent } from "./pages/CreateEvent";
import Home from "./pages/Home";

export default function App() {
    return (
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
                </Routes>
            </div>
        </Router>
    );
}
