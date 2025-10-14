import type { VercelRequest, VercelResponse } from "@vercel/node";
import bcrypt from "bcrypt";
import { setTokenCookie, signToken } from "../lib/auth.ts";
import prisma from "../lib/prisma.ts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { email, password, staffKey } = req.body as {
        email?: string;
        password?: string;
        staffKey?: string;
    };

    if (!email || !password)
        return res.status(400).json({ error: "Missing fields" });

    try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ error: "Email already registered" });
        }

        const hashed = await bcrypt.hash(password, 10);

        const isStaff = staffKey && staffKey === process.env.STAFF_REG_KEY;
        const role = isStaff ? "staff" : "user";

        const user = await prisma.user.create({
            data: { email, password: hashed, role }
        });

        const token = signToken({
            id: user.id,
            email: user.email,
            role: user.role
        });
        setTokenCookie(res, token);

        res.status(201).json({
            id: user.id,
            email: user.email,
            role: user.role,
            message: isStaff ? "Staff account created" : "User account created"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Registration failed" });
    }
}
