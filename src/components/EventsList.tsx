import { Plus } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { type Event } from "../services/api";
import { EventCard } from "./EventCard";
import "./EventsList.css";

export function EventsList({
    events,
    setEvents,
    setShowModal
}: {
    events: Event[];
    setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const { user } = useContext(AuthContext);

    return (
        <div className="events-list">
            <div className="events-header">
                <h2 className="events-title">Upcoming Events</h2>

                {user?.role === "staff" && (
                    <button
                        className="create-event-btn"
                        onClick={() => setShowModal(true)}
                    >
                        <Plus className="icon" /> Create New Event
                    </button>
                )}
            </div>

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
