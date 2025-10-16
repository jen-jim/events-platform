import { Check, Pencil, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import type { Event } from "../services/api";
import { fetchEvents, updateUserProfile } from "../services/api";
import { gcalUrl } from "../utils/calendar";
import { EditableField } from "../utils/EditableField";

export function Profile() {
    const { user, refreshUser } = useContext(AuthContext);
    const [editingField, setEditingField] = useState<
        "name" | "email" | "password" | null
    >(null);
    const [tempValue, setTempValue] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;
        fetchEvents()
            .then((data) => {
                const signedUpEvents = data.filter((e) =>
                    e.Signup.some((s) => s.userEmail === user.email)
                );
                setEvents(signedUpEvents);
            })
            .catch(() => setError("Failed to load events"))
            .finally(() => setLoading(false));
    }, [user]);

    if (!user) {
        return (
            <p className="text-center mt-8 text-gray-600">
                Please log in to view your profile.
            </p>
        );
    }

    if (loading) return <p>Loading profile...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    async function handleCancelSignup(eventId: number) {
        if (!user) return;
        try {
            const res = await fetch(`/api/events/${eventId}/cancel`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: user.email })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to cancel signup");
            }

            setEvents((prev) => prev.filter((e) => e.id !== eventId));
            toast.success("Signup cancelled!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to cancel signup.");
        }
    }

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
        <div className="max-w-lg mx-auto p-6 border rounded shadow mt-6">
            <h2 className="text-2xl font-bold mb-6 text-center">
                Your Profile
            </h2>

            <div className="space-y-5">
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
                    <div>
                        <label className="block text-gray-700 font-medium">
                            Password
                        </label>
                        <div className="flex flex-col gap-2">
                            <input
                                type="password"
                                placeholder="New password"
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                className="border p-2 rounded"
                            />
                            <input
                                type="password"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                className="border p-2 rounded"
                            />
                            <div className="flex gap-2">
                                <button onClick={handleSave} disabled={loading}>
                                    <Check className="text-green-600 hover:text-green-800" />
                                </button>
                                <button onClick={cancelEdit}>
                                    <X className="text-red-600 hover:text-red-800" />
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-between items-center">
                        <label className="block text-gray-700 font-medium">
                            Password
                        </label>
                        <button onClick={() => handleEdit("password")}>
                            <Pencil
                                className="text-gray-500 hover:text-gray-700"
                                size={18}
                            />
                        </button>
                    </div>
                )}

                <div>
                    <label className="block text-gray-700 font-medium">
                        Role
                    </label>
                    <p>{user.role}</p>
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">
                        Joined
                    </label>
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

            <hr className="my-6" />

            <div>
                <h2 className="text-2xl font-bold mb-4">My Events</h2>
                {!events.length ? (
                    <p>You have not signed up for any events yet.</p>
                ) : (
                    events.map((event) => (
                        <div key={event.id} className="border rounded p-4 mb-3">
                            <h3 className="text-lg font-semibold">
                                {event.title}
                            </h3>
                            {event.description && <p>{event.description}</p>}
                            <p>
                                🕒{" "}
                                {new Date(event.startTime).toLocaleDateString()}{" "}
                                {new Date(event.startTime).toLocaleTimeString(
                                    [],
                                    {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    }
                                )}
                                {event.endTime &&
                                    ` - ${new Date(
                                        event.endTime
                                    ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}`}
                            </p>
                            {event.location && <p>📍 {event.location}</p>}
                            {event.price && event.price > 0 ? (
                                <p>💰 £{event.price.toFixed(2)}</p>
                            ) : (
                                <p>💰 Free</p>
                            )}
                            <a
                                href={gcalUrl(event)}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 underline"
                            >
                                ➕ Add to Google Calendar
                            </a>
                            <button
                                onClick={() => handleCancelSignup(event.id)}
                                className="ml-4 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition"
                            >
                                Cancel Signup
                            </button>
                        </div>
                    ))
                )}
            </div>

            <hr className="my-6" />

            <div className="text-center">
                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Logout
                </button>
                <button
                    onClick={handleDeleteProfile}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Delete Account
                </button>
            </div>
        </div>
    );
}
