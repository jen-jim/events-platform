import type { VercelRequest, VercelResponse } from "@vercel/node";
import prisma from "../../lib/prisma.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { id } = req.query;
    console.log(req.method);
    if (req.method !== "DELETE") return res.status(405).end();

    const eventId = parseInt(id as string, 10);
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Missing email" });

    try {
        await prisma.signup.deleteMany({
            where: { eventId, userEmail: email }
        });
        return res.status(200).json({ ok: true, message: "Signup cancelled" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to cancel signup" });
    }
}
