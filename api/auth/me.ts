import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getUserFromReq } from "../lib/auth.ts";
import prisma from "../lib/prisma.ts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const userData = getUserFromReq(req);
    if (!userData) return res.status(401).json({ user: null });

    const user = await prisma.user.findUnique({ where: { id: userData.id } });
    res.status(200).json({ user });
}
