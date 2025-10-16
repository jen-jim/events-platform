import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../contexts/AuthContext";
import { createEvent } from "../services/api";
import "./CreateEvent.css";
import { FormInput } from "./FormInput";

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
    const [price, setPrice] = useState(0);
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
                price
            });
            setTitle("");
            setDescription("");
            setStartTime("");
            setEndTime("");
            setLocation("");
            setPrice(0);
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

            <FormInput
                label="Title"
                value={title}
                onChange={(value) => setTitle(value)}
                required
            />

            <FormInput
                label="Description"
                type="textarea"
                value={description}
                onChange={(value) => setDescription(value)}
            />

            <div className="form-input-row">
                <FormInput
                    label="Start Time"
                    type="datetime-local"
                    value={startTime}
                    onChange={(value) => setStartTime(value)}
                    required
                />
                <FormInput
                    label="End Time"
                    type="datetime-local"
                    value={endTime}
                    onChange={(value) => setEndTime(value)}
                />
            </div>

            <FormInput
                label="Location"
                value={location}
                onChange={(value) => setLocation(value)}
            />

            <FormInput
                label="Price (£)"
                type="number"
                placeholder="0.00"
                value={price}
                onChange={(value) => setPrice(parseFloat(value))}
                min="0"
                step="0.01"
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
