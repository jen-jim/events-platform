import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { updateUserProfile } from "../services/api";

export function Profile() {
    const { user, refreshUser } = useContext(AuthContext);
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [editName, setEditName] = useState(false);
    const [editEmail, setEditEmail] = useState(false);
    const [editPassword, setEditPassword] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        refreshUser().finally(() => setLoading(false));
    }, [refreshUser]);

    if (loading) return <p>Loading profile...</p>;

    if (!user) {
        return (
            <p className="text-center mt-8 text-gray-600">
                Please log in to view your profile.
            </p>
        );
    }

    async function handleLogout() {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            refreshUser();
            navigate("/");
        } catch {
            alert("Logout failed");
        }
    }

    async function handleUpdate(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        if (password && password !== confirmPassword) {
            setMessage("❌ Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            await updateUserProfile({
                name: editName && user && name !== user.name ? name : undefined,
                email:
                    editEmail && user && email !== user.email
                        ? email
                        : undefined,
                password: editPassword && password ? password : undefined
            });

            await refreshUser();
            setEditName(false);
            setEditEmail(false);
            setEditPassword(false);
            setPassword("");
            setConfirmPassword("");
            setMessage("✅ Profile updated successfully!");
        } catch (err) {
            if (err instanceof Error) {
                setMessage(err.message);
            } else {
                setMessage("❌ Failed to update profile.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-lg mx-auto p-4 border rounded shadow mt-6">
            <h2 className="text-2xl font-bold mb-4 text-center">
                Your Profile
            </h2>
            <div className="mb-6">
                <p>
                    <strong>Name:</strong> {user.name || "—"}
                </p>
                <p>
                    <strong>Email:</strong> {user.email}
                </p>
                <p>
                    <strong>Role:</strong> {user.role}
                </p>
                <p>
                    <strong>Joined:</strong>{" "}
                    {new Date(user.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                    })}
                </p>
            </div>

            <form onSubmit={handleUpdate} className="space-y-3">
                {editName && (
                    <input
                        type="text"
                        placeholder="New Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border p-2 w-full"
                    />
                )}
                {editEmail && (
                    <input
                        type="email"
                        placeholder="New Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border p-2 w-full"
                    />
                )}
                {editPassword && (
                    <>
                        <input
                            type="password"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border p-2 w-full"
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="border p-2 w-full"
                        />
                    </>
                )}

                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => setEditName((prev) => !prev)}
                        className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                    >
                        {editName ? "Cancel Name Edit" : "Edit Name"}
                    </button>
                    <button
                        type="button"
                        onClick={() => setEditEmail((prev) => !prev)}
                        className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                    >
                        {editEmail ? "Cancel Email Edit" : "Edit Email"}
                    </button>
                    <button
                        type="button"
                        onClick={() => setEditPassword((prev) => !prev)}
                        className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                    >
                        {editPassword
                            ? "Cancel Password Edit"
                            : "Edit Password"}
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
                >
                    {loading ? "Updating..." : "Save Changes"}
                </button>
            </form>

            {message && <p className="mt-3 text-center">{message}</p>}

            <hr className="my-6" />

            <div className="text-center">
                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
