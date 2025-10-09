import { VercelRequest, VercelResponse } from "@vercel/node";
import { sql } from "@vercel/postgres"; // if using Vercel Postgres

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "GET") return res.status(405).send("Method Not Allowed");

    try {
        const result =
            await sql`SELECT id, title, start_time FROM events LIMIT 20`;
        res.status(200).json({ events: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database query failed" });
    }
}
