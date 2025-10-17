import type { VercelRequest, VercelResponse } from "@vercel/node";
import bcrypt from "bcrypt";
import { setTokenCookie, signToken } from "../lib/auth.js";
import prisma from "../lib/prisma.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { email, password } = req.body as {
        email?: string;
        password?: string;
    };

    if (!email || !password) {
        return res.status(400).json({ error: "Missing fields" });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = signToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        setTokenCookie(res, token);

        return res.status(200).json({
            id: user.id,
            email: user.email,
            role: user.role
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Login failed" });
    }
}
