import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../contexts/AuthContext";
import { createEvent } from "../services/api";
import "./CreateEvent.css";

export function CreateEvent({
    onEventCreated
}: {
    onEventCreated: () => void;
}) {
    const { user } = useContext(AuthContext);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState<number | "">("");
    const [loading, setLoading] = useState(false);

    if (!user || user.role !== "staff") return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            await createEvent({
                title,
                description,
                startTime,
                endTime,
                location,
                price: price === "" ? 0 : Number(price)
            });
            setTitle("");
            setDescription("");
            setStartTime("");
            setEndTime("");
            setLocation("");
            setPrice("");
            toast.success("Event created!");
            onEventCreated?.();
        } catch {
            toast.error("Failed to create event");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="create-event-form">
            <h3 className="form-title">Create New Event</h3>

            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="form-input"
            />

            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-textarea"
            />

            <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="form-input"
            />

            <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="form-input"
            />

            <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="form-input"
            />

            <input
                type="number"
                placeholder="Price (£)"
                value={price}
                onChange={(e) =>
                    setPrice(
                        e.target.value === "" ? "" : Number(e.target.value)
                    )
                }
                className="form-input"
            />

            <button
                type="submit"
                disabled={loading}
                className="form-submit-btn"
            >
                {loading ? "Creating..." : "Create Event"}
            </button>
        </form>
    );
}
