import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { CreateEvent } from "./pages/CreateEvent";
import Home from "./pages/Home";

export default function App() {
    return (
        <Router>
            <nav className="p-4 border-b mb-4 flex gap-4">
                <Link to="/">Home</Link>
                <Link to="/create">Create Event</Link>
            </nav>
            <div className="p-4 max-w-2xl mx-auto">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/create" element={<CreateEvent />} />
                </Routes>
            </div>
        </Router>
    );
}
