import type { VercelRequest, VercelResponse } from "@vercel/node";
import bcrypt from "bcrypt";
import { setTokenCookie, signToken } from "../lib/auth.js";
import prisma from "../lib/prisma.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { name, email, password, staffKey } = req.body as {
        name?: string;
        email?: string;
        password?: string;
        staffKey?: string;
    };

    if (!name || !email || !password)
        return res.status(400).json({ error: "Missing fields" });

    try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ error: "Email already registered" });
        }

        const hashed = await bcrypt.hash(password, 10);

        let role = "user";

        if (staffKey) {
            if (staffKey !== process.env.STAFF_REG_KEY) {
                return res.status(400).json({ error: "Invalid staff key" });
            } else {
                role = "staff";
            }
        }

        const user = await prisma.user.create({
            data: { name: name || "", email, password: hashed, role }
        });

        const token = signToken({
            id: user.id,
            email: user.email,
            role: user.role
        });
        setTokenCookie(res, token);

        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Registration failed" });
    }
}
