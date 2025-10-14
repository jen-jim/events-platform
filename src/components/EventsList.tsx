import { useEffect, useState } from "react";
import { fetchEvents, type Event } from "../services/api";
import { EventCard } from "./EventCard";

export function EventsList() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
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
    if (!events.length) return <p>No events yet.</p>;

    return (
        <div>
            <h2 className="text-2xl mb-4 font-bold">Upcoming Events</h2>
            {events.map((event) => (
                <EventCard
                    key={event.id}
                    event={event}
                    onDeleted={loadEvents}
                />
            ))}
        </div>
    );
}
