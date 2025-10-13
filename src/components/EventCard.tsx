import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { type Event, signupForEvent } from "../services/api";
import { gcalUrl } from "../utils/calendar";

export function EventCard({ event }: { event: Event }) {
    const { user } = useContext(AuthContext);
    const [signedUp, setSignedUp] = useState(false);

    async function handleSignup() {
        if (!user) {
            alert("You must be logged in to sign up!");
            return;
        }

        try {
            await signupForEvent(event.id, user.email);
            setSignedUp(true);
            alert("Signed up!");
        } catch {
            alert("Signup failed");
        }
    }

    return (
        <div
            className="border rounded-lg shadow p-4 mb-4 flex flex-col gap-2"
            role="group"
            aria-label={`Event: ${event.title}`}
        >
            <h3 className="text-lg font-semibold">{event.title}</h3>
            <p>{event.description}</p>
            <p>
                {new Date(event.startTime).toLocaleString()}
                {event.endTime &&
                    " - " + new Date(event.endTime).toLocaleString()}
            </p>
            {event.location && <p>📍 {event.location}</p>}
            {event.price && <p>💰 ${event.price}</p>}

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
    );
}
