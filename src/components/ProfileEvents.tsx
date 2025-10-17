import {
    CalendarPlus,
    Clock,
    MapPin,
    ReceiptPoundSterling
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import type { User } from "../contexts/AuthContext";
import { cancelSignupForEvent, fetchEvents, type Event } from "../services/api";
import { gcalUrl } from "../utils/calendar";
import "./ProfileEvents.css";

export function ProfileEvents({ user }: { user: User }) {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchEvents()
            .then((data) => {
                const signedUpEvents = data.filter((e) =>
                    e.Signup.some((s) => s.userEmail === user.email)
                );
                setEvents(signedUpEvents);
            })
            .catch(() => setError("Failed to load events"))
            .finally(() => setLoading(false));
    }, [user]);

    if (loading) return <p className="loading">Loading events...</p>;
    if (error) return <p className="profile-error">{error}</p>;

    async function handleCancelSignup(eventId: number) {
        try {
            await cancelSignupForEvent(eventId, user.email);

            setEvents((prev) => prev.filter((e) => e.id !== eventId));
            toast.success("Signup cancelled!");
        } catch {
            toast.error("Failed to cancel signup");
        }
    }

    return (
        <div className="profile-events">
            <h2>Events</h2>

            {!events.length ? (
                <p className="no-events">
                    You have not signed up for any events yet.
                </p>
            ) : (
                events.map((event) => (
                    <div key={event.id} className="profile-event-card">
                        <h3 className="profile-event-title">{event.title}</h3>

                        {event.description && (
                            <p className="profile-event-description">
                                {event.description}
                            </p>
                        )}

                        <p className="profile-event-info">
                            <Clock className="profile-icon" />{" "}
                            {new Date(event.startTime).toLocaleDateString(
                                undefined,
                                {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric"
                                }
                            )}{" "}
                            {new Date(event.startTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit"
                            })}
                            {event.endTime &&
                                ` - ${new Date(
                                    event.endTime
                                ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}`}
                        </p>

                        {event.location && (
                            <p className="profile-event-info">
                                <MapPin className="profile-icon" />{" "}
                                {event.location}
                            </p>
                        )}

                        <p className="profile-event-info">
                            <ReceiptPoundSterling className="profile-icon" />{" "}
                            {event.price && event.price > 0
                                ? `£${event.price.toFixed(2)}`
                                : "Free"}
                        </p>

                        <a
                            href={gcalUrl(event)}
                            target="_blank"
                            rel="noreferrer"
                            className="profile-gcal-link"
                        >
                            <CalendarPlus className="profile-icon" /> Add to
                            Google Calendar
                        </a>

                        <button
                            onClick={() => handleCancelSignup(event.id)}
                            className="profile-cancel-btn"
                        >
                            Cancel Signup
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}
