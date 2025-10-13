import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export function Login() {
    const { refreshUser } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
                const { error } = await res.json();
                throw new Error(error || "Login failed");
            }

            setMessage("✅ Logged in successfully!");
            setEmail("");
            setPassword("");

            await refreshUser(); // update context

            navigate("/");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setMessage(`❌ ${err.message}`);
            } else {
                setMessage("❌ Login failed");
            }
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

            {message && (
                <p
                    className={
                        message.startsWith("✅")
                            ? "text-green-600"
                            : "text-red-600"
                    }
                >
                    {message}
                </p>
            )}
        </form>
    );
}
