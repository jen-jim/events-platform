import type { VercelRequest, VercelResponse } from "@vercel/node";
import bcrypt from "bcrypt";
import { setTokenCookie, signToken } from "../lib/auth.ts";
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
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: role || "user"
            }
        });

        // create JWT token
        const token = signToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        // Set cookie
        setTokenCookie(res, token);

        return res.status(201).json({
            id: user.id,
            email: user.email,
            role: user.role
        });
    } catch (err) {
        if (
            typeof err === "object" &&
            err !== null &&
            "code" in err &&
            (err as { code?: string }).code === "P2002"
        ) {
            return res.status(400).json({ error: "Email already in use" });
        }
        console.error(err);
        return res.status(500).json({ error: "Registration failed" });
    }
}
