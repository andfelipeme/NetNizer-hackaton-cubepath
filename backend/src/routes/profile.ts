import { Hono } from "hono";
import { db } from "../db";
import { creatorProfile } from "../db/schema";
import { eq } from "drizzle-orm";
import { auth } from "../auth";

const profile = new Hono();

// GET /api/profile — obtener perfil del usuario autenticado
profile.get("/", async (c) => {
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) return c.json({ error: "Unauthorized" }, 401);

    const result = await db
      .select()
      .from(creatorProfile)
      .where(eq(creatorProfile.userId, session.user.id))
      .limit(1);

    return c.json({ profile: result[0] || null });
  } catch (error) {
    return c.json({ error: "Error getting profile" }, 500);
  }
});

// POST /api/profile — crear o actualizar perfil
profile.post("/", async (c) => {
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) return c.json({ error: "Unauthorized" }, 401);

    const body = await c.req.json();
    const {
      brandName,
      niche,
      targetAudience,
      tone,
      goals,
      activeSocials,
      references,
    } = body;

    // Verificar si ya existe un perfil
    const existing = await db
      .select()
      .from(creatorProfile)
      .where(eq(creatorProfile.userId, session.user.id))
      .limit(1);

    if (existing.length > 0) {
      // Actualizar
      await db
        .update(creatorProfile)
        .set({
          brandName,
          niche,
          targetAudience,
          tone: JSON.stringify(tone),
          goals: JSON.stringify(goals),
          activeSocials: JSON.stringify(activeSocials),
          references,
          updatedAt: new Date(),
        })
        .where(eq(creatorProfile.userId, session.user.id));
    } else {
      // Crear nuevo
      await db.insert(creatorProfile).values({
        id: crypto.randomUUID(),
        userId: session.user.id,
        brandName,
        niche,
        targetAudience,
        tone: JSON.stringify(tone),
        goals: JSON.stringify(goals),
        activeSocials: JSON.stringify(activeSocials),
        references,
      });
    }

    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: "Error saving profile" }, 500);
  }
});

export default profile;
