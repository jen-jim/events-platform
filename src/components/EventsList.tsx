import { type Event } from "../services/api";
import { EventCard } from "./EventCard";
interface EventsListProps {
    events: Event[];
    loading: boolean;
}

export function EventsList({ events, loading }: EventsListProps) {
    if (loading) return <p>Loading events...</p>;
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
