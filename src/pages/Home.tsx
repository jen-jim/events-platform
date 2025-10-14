import { useEffect, useState } from "react";
import { CreateEvent } from "../components/CreateEvent";
import { EventsList } from "../components/EventsList";
import { fetchEvents, type Event } from "../services/api";

export function Home() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    if (loading) return <p>Loading events...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold mb-4">Events</h1>
            <CreateEvent onEventCreated={loadEvents} />
            <EventsList events={events} setEvents={setEvents} />
        </div>
    );
}
