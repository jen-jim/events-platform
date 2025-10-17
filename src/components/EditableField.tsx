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
            <label>{label}</label>
            {editingField === field ? (
                <div className="edit-mode">
                    <input
                        type={field === "email" ? "email" : "text"}
                        name={field}
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                    />
                    <div className="edit-buttons">
                        <button onClick={handleSave} disabled={loading}>
                            <Check className="icon-success" />
                        </button>
                        <button onClick={cancelEdit}>
                            <X className="icon-error" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="view-mode">
                    <p>{value}</p>
                    <button onClick={() => handleEdit(field)}>
                        <Pencil className="icon-edit" />
                    </button>
                </div>
            )}
        </div>
    );
}
