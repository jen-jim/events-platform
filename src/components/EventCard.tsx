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
import "./EventCard.css";
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
                className="event-card"
                role="group"
                aria-label={`Event: ${event.title}`}
            >
                <div className="event-header">
                    <h3 className="event-title">{event.title}</h3>
                    {user?.role === "staff" && (
                        <div className="event-actions">
                            <button
                                onClick={() => setShowEditEvent(true)}
                                className="btn-icon btn-edit"
                                aria-label={`Edit event: ${event.title}`}
                            >
                                <Pencil />
                            </button>
                            <button
                                onClick={handleDelete}
                                className="btn-icon btn-delete"
                                aria-label={`Delete event: ${event.title}`}
                            >
                                <Trash2 />
                            </button>
                        </div>
                    )}
                </div>

                {event.description && (
                    <p className="event-description">{event.description}</p>
                )}

                <p className="event-detail">
                    <Clock className="icon" />
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
                        ` - ${new Date(event.endTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                        })}`}
                </p>

                {event.location && (
                    <p className="event-detail">
                        <MapPin className="icon" /> {event.location}
                    </p>
                )}

                <p className="event-detail">
                    <ReceiptPoundSterling className="icon" />{" "}
                    {event.price && event.price > 0
                        ? `£${event.price.toFixed(2)}`
                        : "Free"}
                </p>

                {user && signedUp && (
                    <>
                        <p className="event-status">Signed up!</p>
                        <a
                            href={gcalUrl(event)}
                            target="_blank"
                            rel="noreferrer"
                            className="event-link"
                        >
                            <CalendarPlus className="icon" /> Add to Google
                            Calendar
                        </a>
                    </>
                )}

                {!user && <p className="event-status">Log in to sign up</p>}

                <div className="event-footer">
                    {user && !signedUp && (
                        <button
                            onClick={handleSignup}
                            className="btn-secondary"
                        >
                            Sign Up
                        </button>
                    )}

                    {user && signedUp && (
                        <button
                            onClick={handleCancelSignup}
                            className="btn-secondary"
                        >
                            Cancel Signup
                        </button>
                    )}

                    {user?.role === "staff" && (
                        <button
                            onClick={() => setShowSignups(true)}
                            className="btn-signups"
                        >
                            View Signups
                        </button>
                    )}
                </div>
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
