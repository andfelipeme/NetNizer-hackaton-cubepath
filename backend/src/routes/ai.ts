import { Hono } from "hono";
import { db } from "../db";
import { creatorProfile } from "../db/schema";
import { eq } from "drizzle-orm";
import { auth } from "../auth";
import { geminiModel, buildCreatorPrompt } from "../services/gemini";

const ai = new Hono();

// POST /api/ai/generate-ideas — generar ideas de contenido
ai.post("/generate-ideas", async (c) => {
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) return c.json({ error: "Unauthorized" }, 401);

    const { platform } = await c.req.json();

    // Obtener perfil del usuario
    const profiles = await db
      .select()
      .from(creatorProfile)
      .where(eq(creatorProfile.userId, session.user.id))
      .limit(1);

    if (!profiles.length) {
      return c.json({ error: "Profile not found" }, 404);
    }

    const profile = profiles[0];

    const instruction = `
Genera 6 ideas de contenido para ${platform} basadas en el perfil del creador.
Responde con este formato JSON exacto:
{
  "ideas": [
    {
      "title": "título corto de la idea",
      "description": "descripción de 1-2 oraciones",
      "format": "tipo de contenido (reel, carrusel, story, post, video)",
      "hook": "frase gancho para captar atención"
    }
  ]
}
    `;

    const prompt = buildCreatorPrompt(profile as any, instruction);
    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text();

    const parsed = JSON.parse(text);
    return c.json(parsed);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Error generating ideas" }, 500);
  }
});

// POST /api/ai/generate-post — redactar un post completo
ai.post("/generate-post", async (c) => {
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) return c.json({ error: "Unauthorized" }, 401);

    const { platform, idea } = await c.req.json();

    const profiles = await db
      .select()
      .from(creatorProfile)
      .where(eq(creatorProfile.userId, session.user.id))
      .limit(1);

    if (!profiles.length) {
      return c.json({ error: "Profile not found" }, 404);
    }

    const profile = profiles[0];

    const instruction = `
Redacta un post completo para ${platform} sobre esta idea: "${idea}".
Responde con este formato JSON exacto:
{
  "post": {
    "caption": "el texto completo del post",
    "hashtags": ["hashtag1", "hashtag2"],
    "callToAction": "frase de llamada a la acción",
    "bestTimeToPost": "mejor hora para publicar"
  }
}
    `;

    const prompt = buildCreatorPrompt(profile as any, instruction);
    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text();

    const parsed = JSON.parse(text);
    return c.json(parsed);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Error generating post" }, 500);
  }
});

export default ai;
