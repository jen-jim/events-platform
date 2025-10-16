import { Plus, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { CreateEvent } from "../components/CreateEvent";
import { EventsList } from "../components/EventsList";
import { AuthContext } from "../contexts/AuthContext";
import { fetchEvents, type Event } from "../services/api";
import "./Home.css";

export function Home() {
    const { user } = useContext(AuthContext);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    async function loadEvents() {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchEvents();
            setEvents(data);
        } catch {
            setError("Failed to load events");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadEvents();
    }, []);

    function handleCreated() {
        setShowModal(false);
        loadEvents();
    }

    if (loading) return <p>Loading events...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="home-page">
            {user?.role === "staff" && (
                <button
                    className="create-event-btn"
                    onClick={() => setShowModal(true)}
                >
                    <Plus className="icon" /> Create New Event
                </button>
            )}

            <EventsList events={events} setEvents={setEvents} />

            {showModal &&
                ReactDOM.createPortal(
                    <div
                        className="modal-overlay"
                        onClick={() => setShowModal(false)}
                    >
                        <div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                        >
                            <button
                                className="modal-close-btn"
                                onClick={() => setShowModal(false)}
                            >
                                <X />
                            </button>
                            <CreateEvent onEventCreated={handleCreated} />
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
}
