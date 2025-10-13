import { EventsList } from "./components/EventsList";
import { CreateEvent } from "./pages/CreateEvent";

export default function App() {
    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Event Manager</h1>
            <EventsList />
            <hr className="my-6" />
            <CreateEvent />
        </div>
    );
}
