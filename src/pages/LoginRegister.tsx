import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { loginUser, signUpUser } from "../services/api";
import "./LoginRegister.css";

export function LoginRegister() {
    const { refreshUser } = useContext(AuthContext);

    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [staffKey, setStaffKey] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            if (isRegister) {
                if (password !== confirmPassword) {
                    toast.error("Passwords do not match.");
                    return;
                }

                const { role } = await signUpUser({
                    name,
                    email,
                    password,
                    staffKey: staffKey || undefined
                });
                toast.success(
                    `Registration successful! Registered as ${role}.`
                );
            } else {
                await loginUser({ email, password });
                toast.success("Login successful!");
            }

            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setStaffKey("");
            await refreshUser();
            navigate("/");
        } catch (err: unknown) {
            if (err instanceof Error) toast.error(err.message);
            else toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2 className="auth-title">
                    {isRegister ? "Register" : "Login"}
                </h2>

                <form onSubmit={handleSubmit} className="auth-form">
                    {isRegister && (
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="auth-input"
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="auth-input"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="auth-input"
                    />
                    {isRegister && (
                        <>
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                required
                                className="auth-input"
                            />
                            <input
                                type="text"
                                placeholder="Staff Key (optional)"
                                value={staffKey}
                                onChange={(e) => setStaffKey(e.target.value)}
                                className="auth-input"
                            />
                        </>
                    )}
                    <button
                        type="submit"
                        className="auth-button"
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

                <p className="auth-toggle">
                    {isRegister
                        ? "Already have an account?"
                        : "Don't have an account?"}{" "}
                    <button
                        onClick={() => setIsRegister(!isRegister)}
                        className="auth-toggle-btn"
                    >
                        {isRegister ? "Login" : "Register"}
                    </button>
                </p>
            </div>
        </div>
    );
}
