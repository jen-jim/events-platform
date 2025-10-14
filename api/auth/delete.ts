import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getUserFromReq } from "../lib/auth.ts";
import prisma from "../lib/prisma.ts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "DELETE") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const user = getUserFromReq(req);
    if (!user) return res.status(401).json({ error: "Not authorised" });

    try {
        await prisma.event.updateMany({
            where: { createdBy: user.id },
            data: { createdBy: null }
        });
        await prisma.signup.deleteMany({
            where: { userEmail: user.email }
        });
        await prisma.user.delete({
            where: { id: user.id }
        });

        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete user" });
    }
}
