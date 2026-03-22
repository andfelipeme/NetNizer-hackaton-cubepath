import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./auth";
import profile from "./routes/profile";
import ai from "./routes/ai";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "http://localhost:4321",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

app.on(["GET", "POST"], "/api/auth/**", (c) => {
  return auth.handler(c.req.raw);
});

app.route("/api/profile", profile);
app.route("/api/ai", ai);

app.get("/", (c) => {
  return c.json({ message: "🚀 NetNizer API running!" });
});

export default app;
