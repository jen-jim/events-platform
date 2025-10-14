import { type Event } from "../services/api";
import { EventCard } from "./EventCard";

export function EventsList({
    events,
    setEvents
}: {
    events: Event[];
    setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
}) {
    if (!events.length) return <p>No events yet.</p>;

    return (
        <div>
            <h2 className="text-2xl mb-4 font-bold">Upcoming Events</h2>
            {events.map((event) => (
                <EventCard key={event.id} event={event} setEvents={setEvents} />
            ))}
        </div>
    );
}
