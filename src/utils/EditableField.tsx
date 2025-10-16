import { Check, Pencil, X } from "lucide-react";

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
        <div>
            <label className="block text-gray-700 font-medium">{label}</label>
            {editingField === field ? (
                <div className="flex gap-2 items-center">
                    <input
                        type={field === "email" ? "email" : "text"}
                        className="border p-2 rounded flex-1"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                    />
                    <button onClick={handleSave} disabled={loading}>
                        <Check className="text-green-600 hover:text-green-800" />
                    </button>
                    <button onClick={cancelEdit}>
                        <X className="text-red-600 hover:text-red-800" />
                    </button>
                </div>
            ) : (
                <div className="flex justify-between items-center">
                    <p>{value}</p>
                    <button onClick={() => handleEdit(field)}>
                        <Pencil
                            className="text-gray-500 hover:text-gray-700"
                            size={18}
                        />
                    </button>
                </div>
            )}
        </div>
    );
}
