import type { VercelRequest, VercelResponse } from "@vercel/node";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma.ts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { email, password, role } = req.body as {
        email?: string;
        password?: string;
        role?: string;
    };

    if (!email || !password) {
        return res.status(400).json({ error: "Missing fields" });
    }

    try {
        const hashed = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashed,
                role: role || "user"
            }
        });

        return res.status(201).json({
            id: user.id,
            email: user.email,
            role: user.role
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Registration failed" });
    }
}
