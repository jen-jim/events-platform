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
                        {event.description && (
                            <p className="flex items-center gap-2 text-gray-600 italic">
                                {event.description}
                            </p>
                        )}
                        <p className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4 text-primary" />{" "}
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
                                `-${new Date(event.endTime).toLocaleTimeString(
                                    [],
                                    {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    }
                                )}`}
                        </p>
                        {event.location && (
                            <p className="flex items-center gap-2 text-gray-600">
                                <MapPin className="w-4 h-4 text-primary" />{" "}
                                {event.location}
                            </p>
                        )}
                        {event.price && event.price > 0 ? (
                            <p className="flex items-center gap-2 text-gray-600">
                                <ReceiptPoundSterling className="w-4 h-4 text-primary" />{" "}
                                £{event.price.toFixed(2)}
                            </p>
                        ) : (
                            <p className="flex items-center gap-2 text-gray-600">
                                <ReceiptPoundSterling className="w-4 h-4 text-primary" />{" "}
                                Free
                            </p>
                        )}
                        <a
                            href={gcalUrl(event)}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 text-accent hover:underline"
                        >
                            <CalendarPlus className="w-4 h-4 text-primary" />{" "}
                            Add to Google Calendar
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
