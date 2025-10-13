interface AuthPayload {
    email: string;
    password: string;
}
export interface Event {
    id: number;
    title: string;
    description?: string;
    startTime: string;
    endTime?: string;
    location?: string;
    price?: number;
}

export async function signUpUser(body: AuthPayload) {
    const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error("Registration failed");
    return res.json();
}

export async function loginUser(body: AuthPayload) {
    const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
}

export async function fetchEvents(): Promise<Event[]> {
    const res = await fetch("/api/events");
    if (!res.ok) throw new Error("Failed to fetch events");
    return res.json();
}

export async function createEvent(body: Partial<Event>) {
    const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error("Failed to create event");
    return res.json();
}

export async function signupForEvent(eventId: number, email: string) {
    const res = await fetch(`/api/events/${eventId}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    });
    if (!res.ok) throw new Error("Signup failed");
    return res.json();
}

export async function getCurrentUser() {
    const res = await fetch("/api/auth/me");
    if (!res.ok) return null;
    return res.json();
}
