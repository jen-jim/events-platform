import { Plus, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { CreateEvent } from "../components/CreateEvent";
import { EventsList } from "../components/EventsList";
import { AuthContext } from "../contexts/AuthContext";
import { fetchEvents, type Event } from "../services/api";

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
        <div className="space-y-6">
            <h1 className="text-3xl font-bold mb-4">Events</h1>
            {user?.role === "staff" && (
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    <Plus className="w-4 h-4" /> Create New Event
                </button>
            )}
            <EventsList events={events} setEvents={setEvents} />

            {showModal &&
                ReactDOM.createPortal(
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                        <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
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
