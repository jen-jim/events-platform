import type { VercelRequest, VercelResponse } from "@vercel/node";
import cookie from "cookie";
import jwt, { type JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_in_prod";

export interface AuthPayload extends JwtPayload {
    id: number;
    email: string;
    role: string;
}

export function signToken(payload: AuthPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): AuthPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as AuthPayload;
    } catch (err) {
        console.log(err);
        return null;
    }
}

// Read token from cookie or Authorization header
export function getUserFromReq(req: VercelRequest): AuthPayload | null {
    const cookies = cookie.parse(req.headers.cookie || "");
    const authHeader = req.headers.authorization;
    const token =
        cookies.token || (authHeader ? authHeader.split(" ")[1] : null);
    if (!token) return null;
    return verifyToken(token);
}

// Set cookie on response
export function setTokenCookie(res: VercelResponse, token: string): void {
    const serialized = cookie.serialize("token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    });

    res.setHeader("Set-Cookie", serialized);
}
