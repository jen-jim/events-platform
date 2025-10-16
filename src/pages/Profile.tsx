import { Check, Pencil, X } from "lucide-react";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ProfileEvents } from "../components/ProfileEvents";
import { AuthContext } from "../contexts/AuthContext";
import { updateUserProfile } from "../services/api";
import { EditableField } from "../utils/EditableField";
import "./Profile.css";

export function Profile() {
    const { user, refreshUser } = useContext(AuthContext);
    const [editingField, setEditingField] = useState<
        "name" | "email" | "password" | null
    >(null);
    const [tempValue, setTempValue] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    if (!user) {
        return (
            <p className="text-center mt-8 text-gray-600">
                Please log in to view your profile.
            </p>
        );
    }

    if (loading) return <p>Loading profile...</p>;

    async function handleDeleteProfile() {
        if (
            !confirm(
                "Are you sure you want to delete your account? This cannot be undone."
            )
        )
            return;

        try {
            const res = await fetch("/api/auth/delete", { method: "DELETE" });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to delete profile");
            }

            toast.success("Account deleted successfully!");
            await handleLogout();
        } catch (err) {
            if (err instanceof Error) toast.error(err.message);
            else toast.error("Failed to delete profile");
        }
    }

    async function handleLogout() {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            refreshUser();
            navigate("/");
            toast.success("Logged out successfully!");
        } catch {
            toast.error("Failed to log out.");
        }
    }

    const handleEdit = (field: "name" | "email" | "password") => {
        setEditingField(field);
        if (field === "name") setTempValue(user.name || "");
        if (field === "email") setTempValue(user.email || "");
        if (field === "password") setTempValue("");
    };

    const cancelEdit = () => {
        setEditingField(null);
        setTempValue("");
        setConfirmPassword("");
    };

    const handleSave = async () => {
        setLoading(true);

        if (editingField === "password" && tempValue !== confirmPassword) {
            toast.error("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            const updateFields =
                editingField === "name"
                    ? { name: tempValue }
                    : editingField === "email"
                    ? { email: tempValue }
                    : { password: tempValue };

            await updateUserProfile(updateFields);
            await refreshUser();

            toast.success("Profile updated successfully!");
            cancelEdit();
        } catch (err) {
            if (err instanceof Error) toast.error(err.message);
            else toast.error("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-card">
            <h2 className="profile-title">Your Profile</h2>

            <div className="profile-fields">
                <EditableField
                    label="Name"
                    value={user.name || "—"}
                    field="name"
                    editingField={editingField}
                    tempValue={tempValue}
                    setTempValue={setTempValue}
                    handleEdit={handleEdit}
                    handleSave={handleSave}
                    cancelEdit={cancelEdit}
                    loading={loading}
                />

                <EditableField
                    label="Email"
                    value={user.email}
                    field="email"
                    editingField={editingField}
                    tempValue={tempValue}
                    setTempValue={setTempValue}
                    handleEdit={handleEdit}
                    handleSave={handleSave}
                    cancelEdit={cancelEdit}
                    loading={loading}
                />

                {editingField === "password" ? (
                    <div className="field">
                        <label>Password</label>
                        <div className="password-edit">
                            <input
                                type="password"
                                placeholder="New password"
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
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
                    </div>
                ) : (
                    <div className="field flex-between">
                        <label>Password</label>
                        <button onClick={() => handleEdit("password")}>
                            <Pencil className="icon-edit" />
                        </button>
                    </div>
                )}

                <div className="field">
                    <label>Role</label>
                    <p>{user.role}</p>
                </div>

                <div className="field">
                    <label>Joined</label>
                    <p>
                        {new Date(user.createdAt).toLocaleDateString(
                            undefined,
                            {
                                year: "numeric",
                                month: "short",
                                day: "numeric"
                            }
                        )}
                    </p>
                </div>
            </div>

            <hr className="divider" />

            <ProfileEvents user={user} />

            <hr className="divider" />

            <div className="profile-actions">
                <button className="profile-button" onClick={handleLogout}>
                    Logout
                </button>
                <button
                    className="profile-button"
                    onClick={handleDeleteProfile}
                >
                    Delete Account
                </button>
            </div>
        </div>
    );
}
