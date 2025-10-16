import ReactDOM from "react-dom";
import type { Event } from "../services/api";

export function SignupsModal({
    event,
    setShowSignups
}: {
    event: Event;
    setShowSignups: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 relative">
                <h4 className="text-lg font-bold mb-3">Signed Up Users</h4>
                <button
                    className="absolute top-2 right-2 text-red-600 font-bold"
                    onClick={() => setShowSignups(false)}
                >
                    ✕
                </button>
                <ul className="space-y-1">
                    {event.Signup?.map((s) => (
                        <li key={s.id}>
                            {s.user?.name} ({s.userEmail})
                        </li>
                    ))}
                    {!event.Signup?.length && <li>No signups yet.</li>}
                </ul>
            </div>
        </div>,
        document.body
    );
}
