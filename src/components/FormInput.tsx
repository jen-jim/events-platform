import type { HTMLInputTypeAttribute } from "react";
import "./FormInput.css";

export function FormInput({
    label,
    type = "text",
    value,
    onChange,
    ...rest
}: {
    label: string;
    type?: HTMLInputTypeAttribute | "textarea";
    value?: string | number;
    onChange?: (value: string) => void;
    name?: string;
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    min?: number | string;
    step?: number | string;
}) {
    const inputProps = {
        className: "form-input" + (type === "textarea" ? " form-textarea" : ""),
        value,
        onChange: (
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => onChange?.(e.target.value),
        ...rest
    };

    const inputElement =
        type === "textarea" ? (
            <textarea {...inputProps} />
        ) : (
            <input type={type} {...inputProps} />
        );

    return (
        <label className="form-input-container">
            <span className="form-input-label">{label}</span>
            {inputElement}
        </label>
    );
}
