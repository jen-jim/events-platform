import type { Event } from "../services/api";
import { Modal } from "./Modal";

export function SignupsModal({
    event,
    setShowSignups
}: {
    event: Event;
    setShowSignups: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        <Modal closeModal={() => setShowSignups(false)}>
            <h4 className="text-lg font-bold mb-3">Signed Up Users</h4>
            <ul className="space-y-1">
                {event.Signup?.map((s) => (
                    <li key={s.id}>
                        {s.user?.name} ({s.userEmail})
                    </li>
                ))}
                {!event.Signup?.length && <li>No signups yet.</li>}
            </ul>
        </Modal>
    );
}
