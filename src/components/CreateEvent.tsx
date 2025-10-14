import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { createEvent } from "../services/api";

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
            alert("Event created!");
            onEventCreated?.();
        } catch {
            alert("Failed to create event");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-3 border p-4 rounded-lg"
        >
            <h3 className="font-semibold text-lg">Create New Event</h3>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="border p-2 w-full"
            />
            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border p-2 w-full"
            />
            <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="border p-2 w-full"
            />
            <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="border p-2 w-full"
            />
            <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border p-2 w-full"
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
                className="border p-2 w-full"
            />
            <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
            >
                {loading ? "Creating..." : "Create Event"}
            </button>
        </form>
    );
}
