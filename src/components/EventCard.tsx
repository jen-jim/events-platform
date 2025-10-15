import { useContext, useState } from "react";
import ReactDOM from "react-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../contexts/AuthContext";
import {
    deleteEvent,
    type Event,
    signupForEvent,
    updateEvent
} from "../services/api";
import { gcalUrl } from "../utils/calendar";

export function EventCard({
    event,
    setEvents
}: {
    event: Event;
    setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
}) {
    const { user } = useContext(AuthContext);
    const [signedUp, setSignedUp] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState(event.title);
    const [description, setDescription] = useState(event.description || "");
    const [startTime, setStartTime] = useState(event.startTime.slice(0, 16));
    const [endTime, setEndTime] = useState(
        event.endTime ? event.endTime.slice(0, 16) : ""
    );
    const [location, setLocation] = useState(event.location || "");
    const [price, setPrice] = useState(event.price || 0);

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

    async function handleSaveEdit(e: React.FormEvent) {
        e.preventDefault();
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
            setShowModal(false);
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
                            onClick={() => setShowModal(true)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                            Delete
                        </button>
                    </div>
                )}

                <p>{event.description}</p>
                <p>
                    🕒{" "}
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
                {event.location && <p>📍 {event.location}</p>}
                {event.price && event.price > 0 ? (
                    <p>💰 £{event.price.toFixed(2)}</p>
                ) : (
                    <p>💰 Free</p>
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
                        <a
                            href={gcalUrl(event)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline"
                        >
                            ➕ Add to Google Calendar
                        </a>
                    )
                ) : (
                    <p className="text-gray-500 italic">Log in to sign up</p>
                )}
            </div>

            {showModal &&
                ReactDOM.createPortal(
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative">
                            <h2 className="text-xl font-semibold mb-4">
                                Edit Event
                            </h2>

                            <form
                                onSubmit={handleSaveEdit}
                                className="flex flex-col gap-3"
                            >
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="border p-2 rounded"
                                    placeholder="Title"
                                    required
                                />

                                <textarea
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    className="border p-2 rounded"
                                    rows={3}
                                    placeholder="Description"
                                />

                                <div className="flex gap-2">
                                    <input
                                        type="datetime-local"
                                        value={startTime}
                                        onChange={(e) =>
                                            setStartTime(e.target.value)
                                        }
                                        className="border p-2 rounded w-1/2"
                                        required
                                    />
                                    <input
                                        type="datetime-local"
                                        value={endTime}
                                        onChange={(e) =>
                                            setEndTime(e.target.value)
                                        }
                                        className="border p-2 rounded w-1/2"
                                    />
                                </div>

                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) =>
                                        setLocation(e.target.value)
                                    }
                                    className="border p-2 rounded"
                                    placeholder="Location"
                                />

                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) =>
                                        setPrice(parseFloat(e.target.value))
                                    }
                                    className="border p-2 rounded"
                                    placeholder="Price (£)"
                                    min="0"
                                    step="0.01"
                                />

                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
}
