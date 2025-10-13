import { EventsList } from "../components/EventsList";

export default function Home() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
            <EventsList />
        </div>
    );
}
