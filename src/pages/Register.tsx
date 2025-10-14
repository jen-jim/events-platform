import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { signUpUser } from "../services/api";

export function Register() {
    const { refreshUser } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [staffKey, setStaffKey] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        if (password !== confirmPassword) {
            setMessage("❌ Passwords do not match.");
            return;
        }

        try {
            await signUpUser({
                email,
                password,
                staffKey: staffKey || undefined
            });
            setMessage("✅ Registration successful!");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setStaffKey("");
            await refreshUser();
        } catch (err: unknown) {
            if (err instanceof Error) setMessage(`❌ ${err.message}`);
            else setMessage("❌ Registration failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3">
            <h2 className="text-xl font-bold">Register</h2>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border p-2 w-full"
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border p-2 w-full"
            />

            <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="border p-2 w-full"
            />

            <input
                type="text"
                placeholder="(Optional) Staff Key"
                value={staffKey}
                onChange={(e) => setStaffKey(e.target.value)}
                className="border p-2 w-full"
            />

            <button
                type="submit"
                className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
                disabled={loading}
            >
                {loading ? "Registering..." : "Register"}
            </button>

            {message && <p>{message}</p>}
        </form>
    );
}
