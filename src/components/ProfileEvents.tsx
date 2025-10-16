import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import type { User } from "../contexts/AuthContext";
import { cancelSignupForEvent, fetchEvents, type Event } from "../services/api";
import { gcalUrl } from "../utils/calendar";

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

    if (loading) return <p>Loading events...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

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
        <div>
            <h2 className="text-2xl font-bold mb-4">My Events</h2>
            {!events.length ? (
                <p>You have not signed up for any events yet.</p>
            ) : (
                events.map((event) => (
                    <div key={event.id} className="border rounded p-4 mb-3">
                        <h3 className="text-lg font-semibold">{event.title}</h3>
                        {event.description && <p>{event.description}</p>}
                        <p>
                            🕒 {new Date(event.startTime).toLocaleDateString()}{" "}
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
                        {event.location && <p>📍 {event.location}</p>}
                        {event.price && event.price > 0 ? (
                            <p>💰 £{event.price.toFixed(2)}</p>
                        ) : (
                            <p>💰 Free</p>
                        )}
                        <a
                            href={gcalUrl(event)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline"
                        >
                            ➕ Add to Google Calendar
                        </a>
                        <button
                            onClick={() => handleCancelSignup(event.id)}
                            className="ml-4 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition"
                        >
                            Cancel Signup
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}
