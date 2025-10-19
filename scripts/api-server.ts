import dotenv from "dotenv";
import express from "express";
import { readdirSync, statSync } from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

dotenv.config();

const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const apiDir = path.join(__dirname, "../api");

const app = express();
app.use(express.json());

// find ts files in the specified dir and set up api routes
const loadRoutes = async (dir: string) => {
    const entries = readdirSync(dir);

    const importPromises: Promise<void>[] = [];

    entries.forEach((entry) => {
        const fullPath = path.join(dir, entry);
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
            importPromises.push(loadRoutes(fullPath));
            return;
        }

        if (!/\.ts$/.test(entry)) return;

        const relativePath = fullPath.replace(apiDir, "");
        const route = `/api${relativePath}`
            .replace(/\.ts$/, "") // remove .ts extension
            .replace(/\[([^\]]+)\]/g, ":$1") // replace [param] with :param
            .replace(/\/index$/, ""); // remove /index suffix

        const importPromise = import(pathToFileURL(fullPath).href)
            .then((module) => {
                const handler = module.default;
                if (typeof handler === "function") {
                    app.all(route, async (req, res) => {
                        console.log(`➡️  ${req.method} ${req.originalUrl}`);
                        try {
                            // create a VercelRequest-like object
                            const vercelReq = new Proxy(req, {
                                get(target, prop) {
                                    // merge params and query into query
                                    return prop === "query"
                                        ? { ...target.params, ...target.query }
                                        : Reflect.get(target, prop);
                                }
                            });
                            await handler(vercelReq, res);
                        } catch (err) {
                            console.error(
                                `${req.method} ${req.originalUrl}:`,
                                err
                            );
                            res.status(500).json({
                                error: "Internal Server Error"
                            });
                        }
                    });
                }
            })
            .catch((err) => {
                console.error("❌ Failed to import", fullPath, err);
            });

        importPromises.push(importPromise);
    });

    await Promise.all(importPromises);
};

(async () => {
    console.log("⏳ Loading API routes...");
    await loadRoutes(apiDir);

    app.listen(PORT, () =>
        console.log(`🚀 API dev server running at http://localhost:${PORT}`)
    );
})();
