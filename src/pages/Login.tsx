import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { loginUser } from "../services/api";

export function Login() {
    const { refreshUser } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            await loginUser({ email, password });
            setMessage("✅ Login successful!");
            setEmail("");
            setPassword("");
            await refreshUser();
        } catch (err: unknown) {
            if (err instanceof Error) setMessage(`❌ ${err.message}`);
            else setMessage("❌ Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3">
            <h2 className="text-xl font-bold">Login</h2>

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

            <button
                type="submit"
                className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
                disabled={loading}
            >
                {loading ? "Logging in..." : "Login"}
            </button>

            {message && <p>{message}</p>}
        </form>
    );
}
