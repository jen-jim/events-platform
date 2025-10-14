import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { loginUser, signUpUser } from "../services/api";

export function LoginRegister() {
    const { refreshUser } = useContext(AuthContext);

    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [staffKey, setStaffKey] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            if (isRegister) {
                if (password !== confirmPassword) {
                    setMessage("❌ Passwords do not match.");
                    return;
                }

                const { role } = await signUpUser({
                    name,
                    email,
                    password,
                    staffKey: staffKey || undefined
                });
                setMessage(
                    `✅ Registration successful! Registered as ${role}.`
                );
            } else {
                await loginUser({ email, password });
                setMessage("✅ Login successful!");
            }

            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setStaffKey("");
            await refreshUser();
        } catch (err: unknown) {
            if (err instanceof Error) setMessage(err.message);
            else setMessage("❌ Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-md mx-auto p-4 border rounded shadow">
            <h2 className="text-xl font-bold mb-4">
                {isRegister ? "Register" : "Login"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
                {isRegister && (
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="border p-2 w-full"
                    />
                )}
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
                {isRegister && (
                    <>
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
                            placeholder="Staff Key (optional)"
                            value={staffKey}
                            onChange={(e) => setStaffKey(e.target.value)}
                            className="border p-2 w-full"
                        />
                    </>
                )}
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 w-full"
                    disabled={loading}
                >
                    {loading
                        ? isRegister
                            ? "Registering..."
                            : "Logging in..."
                        : isRegister
                        ? "Register"
                        : "Login"}
                </button>
            </form>

            {message && <p className="mt-3">{message}</p>}

            <p className="mt-4 text-center">
                {isRegister
                    ? "Already have an account?"
                    : "Don't have an account?"}{" "}
                <button
                    className="text-blue-600 underline"
                    onClick={() => setIsRegister(!isRegister)}
                >
                    {isRegister ? "Login" : "Register"}
                </button>
            </p>
        </div>
    );
}
