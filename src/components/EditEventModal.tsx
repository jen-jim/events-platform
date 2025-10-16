import { useState } from "react";
import type { Event } from "../services/api";
import { FormInput } from "./FormInput";
import { Modal } from "./Modal";

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

    return (
        <Modal closeModal={() => setShowEditEvent(false)}>
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
                    value={price}
                    onChange={(value) => setPrice(parseFloat(value))}
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
        </Modal>
    );
}
