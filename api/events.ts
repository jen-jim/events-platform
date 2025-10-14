import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getUserFromReq } from "./lib/auth.ts";
import prisma from "./lib/prisma.ts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === "GET") {
        const events = await prisma.event.findMany({
            orderBy: { startTime: "asc" }
        });
        return res.status(200).json(events);
    }

    if (req.method === "POST") {
        // staff only
        const user = getUserFromReq(req);
        if (!user || user.role !== "staff")
            return res.status(403).json({ error: "Not authorized" });

        const { title, description, startTime, endTime, location, price } =
            req.body;
        try {
            const event = await prisma.event.create({
                data: {
                    title,
                    description,
                    startTime: new Date(startTime),
                    endTime: endTime ? new Date(endTime) : null,
                    location,
                    price: price || 0,
                    createdBy: user.id
                }
            });
            return res.status(201).json(event);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Create event failed" });
        }
    }

    return res.status(405).send("Method Not Allowed").end();
}
