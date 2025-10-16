import {
    CalendarPlus,
    Clock,
    MapPin,
    Pencil,
    ReceiptPoundSterling,
    Trash2
} from "lucide-react";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../contexts/AuthContext";
import {
    cancelSignupForEvent,
    deleteEvent,
    type Event,
    signupForEvent,
    updateEvent
} from "../services/api";
import { gcalUrl } from "../utils/calendar";
import { EditEventModal } from "./EditEventModal";
import { SignupsModal } from "./SignupsModal";

export function EventCard({
    event,
    setEvents
}: {
    event: Event;
    setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
}) {
    const { user } = useContext(AuthContext);

    const alreadySignedUp = user
        ? event.Signup.some((s) => s.userEmail === user.email)
        : false;

    const [signedUp, setSignedUp] = useState(alreadySignedUp);
    const [showSignups, setShowSignups] = useState(false);
    const [showEditEvent, setShowEditEvent] = useState(false);

    async function handleSignup() {
        if (!user) {
            toast.error("You must be logged in to sign up!");
            return;
        }

        try {
            await signupForEvent(event.id, user.email);
            setSignedUp(true);
            toast.success("Signed up!");
        } catch {
            toast.error("Signup failed");
        }
    }

    async function handleCancelSignup() {
        if (!user) return;
        try {
            await cancelSignupForEvent(event.id, user.email);
            setSignedUp(false);
            toast.success("Signup cancelled!");
        } catch {
            toast.error("Failed to cancel signup");
        }
    }

    async function handleDelete() {
        if (!confirm("Are you sure you want to delete this event?")) return;
        try {
            await deleteEvent(event.id);
            setEvents((prev) => prev.filter((e) => e.id !== event.id));
            toast.success("Event deleted!");
        } catch {
            toast.error("Failed to delete event");
        }
    }

    async function handleSaveEdit({
        title,
        description,
        startTime,
        endTime,
        location,
        price
    }: Event) {
        const formattedPrice = price ? parseFloat(price.toFixed(2)) : 0;

        try {
            await updateEvent(event.id, {
                title,
                description,
                startTime,
                endTime,
                location,
                price: formattedPrice
            });

            setEvents((prev) =>
                prev.map((e) =>
                    e.id === event.id
                        ? {
                              ...e,
                              title,
                              description,
                              startTime,
                              endTime,
                              location,
                              price
                          }
                        : e
                )
            );

            toast.success("Event updated!");
            setShowEditEvent(false);
        } catch {
            toast.error("Failed to update event");
        }
    }

    return (
        <>
            <div
                className="border rounded-lg shadow p-4 mb-4 flex flex-col gap-2"
                role="group"
                aria-label={`Event: ${event.title}`}
            >
                <h3 className="text-lg font-semibold">{event.title}</h3>

                {user?.role === "staff" && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowEditEvent(true)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                            aria-label={`Edit event: ${event.title}`}
                        >
                            <Pencil />
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                            aria-label={`Delete event: ${event.title}`}
                        >
                            <Trash2 />
                        </button>
                    </div>
                )}

                <p className="flex items-center gap-2 text-gray-600 italic">
                    {event.description}
                </p>
                <p className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4 text-primary" />{" "}
                    {new Date(event.startTime).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric"
                    })}{" "}
                    {new Date(event.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                    })}
                    {event.endTime &&
                        `-${new Date(event.endTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                        })}`}
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

                {user ? (
                    !signedUp ? (
                        <button
                            onClick={handleSignup}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                            Sign Up
                        </button>
                    ) : (
                        <>
                            <p className="text-gray-500 italic">Signed up!</p>
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
                                onClick={handleCancelSignup}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                                Cancel Signup
                            </button>
                        </>
                    )
                ) : (
                    <p className="text-gray-500 italic">Log in to sign up</p>
                )}

                {user?.role === "staff" && (
                    <button
                        onClick={() => setShowSignups(true)}
                        className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                    >
                        View Signups
                    </button>
                )}
            </div>

            {showEditEvent && (
                <EditEventModal
                    event={event}
                    setShowEditEvent={setShowEditEvent}
                    onSubmit={handleSaveEdit}
                />
            )}

            {showSignups && (
                <SignupsModal event={event} setShowSignups={setShowSignups} />
            )}
        </>
    );
}
