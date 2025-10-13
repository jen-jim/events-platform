import React, { useState } from "react";
import { createEvent } from "../services/api";

export function CreateEvent() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startTime, setStartTime] = useState("");
    const [location, setLocation] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            await createEvent({ title, description, startTime, location });
            alert("Event created!");
            setTitle("");
            setDescription("");
            setStartTime("");
            setLocation("");
        } catch {
            alert("Failed to create event");
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
                className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
            >
                Create
            </button>
        </form>
    );
}
