import type { VercelRequest, VercelResponse } from "@vercel/node";
import { setTokenCookie } from "../lib/auth.ts";

export default function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") return res.status(405).end();

    setTokenCookie(res, "");
    res.status(200).json({ message: "Logged out" });
}
