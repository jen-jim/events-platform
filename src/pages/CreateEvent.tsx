import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role !== "staff") {
            navigate("/"); // redirect non-staff to home
        }
    }, [navigate, user]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            await createEvent({
                title,
                description,
                startTime,
                endTime,
                location,
                price: price === "" ? 0 : Number(price)
            });
            setMessage("✅ Event created successfully!");
            setTitle("");
            setDescription("");
            setStartTime("");
            setEndTime("");
            setLocation("");
            setPrice("");

            onEventCreated();
        } catch {
            setMessage("❌ Failed to create event.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3">
            <h2 className="text-xl font-bold">Create Event</h2>

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

            <label className="block">
                <span className="text-sm text-gray-600">Start Time</span>
                <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    className="border p-2 w-full"
                />
            </label>

            <label className="block">
                <span className="text-sm text-gray-600">End Time</span>
                <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="border p-2 w-full"
                />
            </label>

            <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border p-2 w-full"
            />

            <input
                type="number"
                placeholder="Price (optional)"
                value={price}
                onChange={(e) =>
                    setPrice(
                        e.target.value === "" ? "" : Number(e.target.value)
                    )
                }
                className="border p-2 w-full"
                min="0"
                step="0.01"
            />

            <button
                type="submit"
                className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
                disabled={loading}
            >
                {loading ? "Creating..." : "Create Event"}
            </button>

            {message && (
                <p
                    className={`text-sm ${
                        message.startsWith("✅")
                            ? "text-green-600"
                            : "text-red-600"
                    }`}
                >
                    {message}
                </p>
            )}
        </form>
    );
}
