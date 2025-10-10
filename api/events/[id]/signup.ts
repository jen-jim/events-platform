import { VercelRequest, VercelResponse } from "@vercel/node";
import prisma from "../../lib/prisma";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { id } = req.query;
    if (req.method !== "POST") return res.status(405).end();

    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Missing email" });

    try {
        const signup = await prisma.signup.create({
            data: { eventId: parseInt(id as string, 10), userEmail: email }
        });
        return res.status(201).json({ ok: true, signup });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Signup failed" });
    }
}
