import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
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
    const [location, setLocation] = useState("");
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
            await createEvent({ title, description, startTime, location });
            setMessage("✅ Event created successfully!");
            setTitle("");
            setDescription("");
            setStartTime("");
            setLocation("");

            onEventCreated();
        } catch {
            setMessage("❌ Failed to create event.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto space-y-3"
            aria-live="polite"
        >
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

            <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="border p-2 w-full"
            />

            <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border p-2 w-full"
            />

            <button
                type="submit"
                disabled={loading}
                className={`px-3 py-2 rounded text-white ${
                    loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                }`}
            >
                {loading ? "Creating..." : "Create"}
            </button>

            {message && (
                <p
                    className={`mt-2 font-medium ${
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
