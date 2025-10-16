import { useState } from "react";
import ReactDOM from "react-dom";
import type { Event } from "../services/api";

export function EditEventModal({
    event,
    setShowEditEvent,
    onSubmit
}: {
    event: Event;
    setShowEditEvent: React.Dispatch<React.SetStateAction<boolean>>;
    onSubmit: (event: Event) => void;
}) {
    const [title, setTitle] = useState(event.title);
    const [description, setDescription] = useState(event.description || "");
    const [startTime, setStartTime] = useState(event.startTime.slice(0, 16));
    const [endTime, setEndTime] = useState(
        event.endTime ? event.endTime.slice(0, 16) : ""
    );
    const [location, setLocation] = useState(event.location || "");
    const [price, setPrice] = useState(event.price || 0);

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative">
                <h2 className="text-xl font-semibold mb-4">Edit Event</h2>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit({
                            ...event,
                            title,
                            description,
                            startTime,
                            endTime,
                            location,
                            price
                        });
                        setShowEditEvent(false);
                    }}
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
                        onChange={(e) => setDescription(e.target.value)}
                        className="border p-2 rounded"
                        rows={3}
                        placeholder="Description"
                    />

                    <div className="flex gap-2">
                        <input
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="border p-2 rounded w-1/2"
                            required
                        />
                        <input
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="border p-2 rounded w-1/2"
                        />
                    </div>

                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="border p-2 rounded"
                        placeholder="Location"
                    />

                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(parseFloat(e.target.value))}
                        className="border p-2 rounded"
                        placeholder="Price (£)"
                        min="0"
                        step="0.01"
                    />

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={() => setShowEditEvent(false)}
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
    );
}
