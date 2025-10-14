import type { VercelRequest, VercelResponse } from "@vercel/node";
import bcrypt from "bcrypt";
import { getUserFromReq } from "../lib/auth.ts";
import prisma from "../lib/prisma.ts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "PUT") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const user = getUserFromReq(req);
    if (!user) return res.status(401).json({ error: "Not authorised" });

    const { name, email, password } = req.body as {
        name?: string;
        email?: string;
        password?: string;
    };

    if (!name && !email && !password)
        return res.status(400).json({ error: "No fields to update" });

    try {
        const updateData: Record<string, string> = {};

        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (password) updateData.password = await bcrypt.hash(password, 10);

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });

        res.status(200).json({ user: updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update profile" });
    }
}
