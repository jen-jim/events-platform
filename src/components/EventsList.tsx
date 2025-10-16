import { type Event } from "../services/api";
import { EventCard } from "./EventCard";
import "./EventsList.css";

export function EventsList({
    events,
    setEvents
}: {
    events: Event[];
    setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
}) {
    return (
        <div className="events-list">
            <h2 className="events-title">Upcoming Events</h2>
            {events.length > 0 ? (
                events.map((event) => (
                    <EventCard
                        key={event.id}
                        event={event}
                        setEvents={setEvents}
                    />
                ))
            ) : (
                <p className="events-empty">
                    No upcoming events yet — check back soon!
                </p>
            )}
        </div>
    );
}
