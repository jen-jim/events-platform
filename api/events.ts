import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getUserFromReq } from "./lib/auth.js";
import prisma from "./lib/prisma.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === "GET") {
        const events = await prisma.event.findMany({
            orderBy: { startTime: "asc" },
            include: {
                Signup: {
                    select: {
                        id: true,
                        userEmail: true,
                        eventId: true,
                        user: { select: { name: true } }
                    }
                }
            }
        });

        const eventsWithSignups = await Promise.all(
            events.map(async (event) => {
                const signupsWithNames = await Promise.all(
                    event.Signup.map(async (s) => {
                        const user = await prisma.user.findUnique({
                            where: { email: s.userEmail }
                        });
                        return {
                            email: s.userEmail,
                            name: user?.name || "Unknown"
                        };
                    })
                );
                return { ...event, signups: signupsWithNames };
            })
        );

        return res.status(200).json(eventsWithSignups);
    }

    if (req.method === "POST") {
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

    if (req.method === "DELETE") {
        const user = getUserFromReq(req);
        if (!user || user.role !== "staff") {
            return res.status(403).json({ error: "Not authorized" });
        }

        const id = req.query.id;
        const eventId = Number(id);
        if (!eventId || isNaN(eventId)) {
            return res.status(400).json({ error: "Invalid event ID" });
        }

        try {
            await prisma.event.delete({
                where: { id: eventId }
            });

            return res
                .status(200)
                .json({ message: "Event deleted successfully" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to delete event" });
        }
    }

    if (req.method === "PUT") {
        const user = getUserFromReq(req);
        if (!user || user.role !== "staff")
            return res.status(403).json({ error: "Not authorized" });

        const { id, title, description, startTime, endTime, location, price } =
            req.body;

        if (!id) {
            return res.status(400).json({ error: "Event ID required" });
        }

        try {
            const updatedEvent = await prisma.event.update({
                where: { id: Number(id) },
                data: {
                    ...(title && { title }),
                    ...(description && { description }),
                    ...(startTime && { startTime: new Date(startTime) }),
                    ...(endTime && { endTime: new Date(endTime) }),
                    ...(location && { location }),
                    ...(price !== undefined && { price: Number(price) })
                }
            });

            return res.status(200).json(updatedEvent);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to update event" });
        }
    }

    return res.status(405).send("Method Not Allowed").end();
}
