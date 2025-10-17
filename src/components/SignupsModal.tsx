import type { Event } from "../services/api";
import { Modal } from "./Modal";
import "./SignupsModal.css";

export function SignupsModal({
    event,
    setShowSignups
}: {
    event: Event;
    setShowSignups: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        <Modal closeModal={() => setShowSignups(false)}>
            <div className="signups-container">
                <h3 className="signups-title">Signed Up Users</h3>
                <ul className="signups-list-container">
                    {event.Signup?.map((s) => (
                        <li key={s.id} className="signups-list">
                            <span className="signups-user-name">
                                {s.user?.name}
                            </span>{" "}
                            <span className="signups-user-email">
                                ({s.userEmail})
                            </span>{" "}
                        </li>
                    ))}
                    {!event.Signup?.length && (
                        <li className="signups-empty">No signups yet.</li>
                    )}
                </ul>
            </div>
        </Modal>
    );
}
