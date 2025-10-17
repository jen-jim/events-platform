import { Check, Pencil, X } from "lucide-react";
import "./EditableField.css";

export function EditableField({
    label,
    value,
    field,
    editingField,
    tempValue,
    setTempValue,
    handleEdit,
    handleSave,
    cancelEdit,
    loading
}: {
    label: string;
    value: string;
    field: "name" | "email";
    editingField: string | null;
    tempValue: string;
    setTempValue: (v: string) => void;
    handleEdit: (f: "name" | "email" | "password") => void;
    handleSave: () => void;
    cancelEdit: () => void;
    loading: boolean;
}) {
    return (
        <div className="editable-field">
            {editingField === field ? (
                <>
                    <label className="editable-field-label" htmlFor={field}>
                        {label}
                    </label>
                    <div className="edit-mode">
                        <input
                            type={field === "email" ? "email" : "text"}
                            name={field}
                            id={field}
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                        />
                        <div className="edit-buttons">
                            <button onClick={handleSave} disabled={loading}>
                                <Check
                                    aria-label="Save"
                                    className="icon-save"
                                />
                            </button>
                            <button onClick={cancelEdit}>
                                <X
                                    aria-label="Cancel"
                                    className="icon-cancel"
                                />
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <span className="editable-field-label">{label}</span>
                    <div className="view-mode">
                        <p>{value}</p>
                        <button onClick={() => handleEdit(field)}>
                            <Pencil aria-label="Edit" className="icon-edit" />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
