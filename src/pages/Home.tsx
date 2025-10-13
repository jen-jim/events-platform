import { useEffect, useState } from "react";
import { EventsList } from "../components/EventsList";
import { fetchEvents, type Event } from "../services/api";
import { CreateEvent } from "./CreateEvent";

export default function Home() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    const loadEvents = async () => {
        setLoading(true);
        try {
            const data = await fetchEvents();
            setEvents(data);
        } catch {
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEvents();
    }, []);

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Event Manager</h1>

            <EventsList events={events} loading={loading} />

            <hr className="my-6" />

            <CreateEvent onEventCreated={loadEvents} />
        </div>
    );
}
