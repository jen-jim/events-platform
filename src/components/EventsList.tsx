import { useEffect, useState } from "react";
import { type Event, fetchEvents } from "../services/api";
import { EventCard } from "./EventCard";

export function EventsList() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchEvents()
            .then(setEvents)
            .catch(() => setError("Failed to load events"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading events...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!events.length) return <p>No events yet.</p>;

    return (
        <div>
            <h2 className="text-2xl mb-4 font-bold">Upcoming Events</h2>
            {events.map((event) => (
                <EventCard key={event.id} event={event} />
            ))}
        </div>
    );
}
