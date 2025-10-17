import { X } from "lucide-react";
import ReactDOM from "react-dom";
import "./Modal.css";

export function Modal({
    children,
    closeModal
}: {
    children: React.ReactNode;
    closeModal: () => void;
}) {
    return ReactDOM.createPortal(
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button
                    aria-label="Close"
                    className="modal-close-btn"
                    onClick={closeModal}
                >
                    <X />
                </button>
                {children}
            </div>
        </div>,
        document.body
    );
}
