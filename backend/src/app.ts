import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.json({ message: "🚀 NetNizer API running!" });
});

export default app;
