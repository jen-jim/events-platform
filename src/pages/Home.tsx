import { useEffect, useState } from "react";
import { CreateEvent } from "../components/CreateEvent";
import { EventsList } from "../components/EventsList";
import { Modal } from "../components/Modal";
import { fetchEvents, type Event } from "../services/api";
import "./Home.css";

export function Home() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    async function loadEvents() {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchEvents();
            setEvents(data);
        } catch {
            setError("Failed to load events");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadEvents();
    }, []);

    function handleCreated() {
        setShowModal(false);
        loadEvents();
    }

    if (loading) return <p>Loading events...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="home-page">
            <EventsList
                events={events}
                setEvents={setEvents}
                setShowModal={setShowModal}
            />

            {showModal && (
                <Modal closeModal={() => setShowModal(false)}>
                    <CreateEvent onEventCreated={handleCreated} />
                </Modal>
            )}
        </div>
    );
}
