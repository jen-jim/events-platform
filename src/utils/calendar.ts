export function toGCalDates(start: Date, end?: Date): string {
    const pad = (n: number) => n.toString().padStart(2, "0");
    const format = (d: Date) =>
        d.getUTCFullYear().toString() +
        pad(d.getUTCMonth() + 1) +
        pad(d.getUTCDate()) +
        "T" +
        pad(d.getUTCHours()) +
        pad(d.getUTCMinutes()) +
        pad(d.getUTCSeconds()) +
        "Z";

    const s = format(start);
    const e = format(end ?? new Date(start.getTime() + 60 * 60 * 1000)); // default 1hr
    return `${s}/${e}`;
}

export function gcalUrl(event: {
    title: string;
    startTime: string | Date;
    endTime?: string | Date;
    description?: string;
    location?: string;
}): string {
    const dates = toGCalDates(
        new Date(event.startTime),
        event.endTime ? new Date(event.endTime) : undefined
    );

    const params = new URLSearchParams({
        action: "TEMPLATE",
        text: event.title,
        dates,
        details: event.description || "",
        location: event.location || ""
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
