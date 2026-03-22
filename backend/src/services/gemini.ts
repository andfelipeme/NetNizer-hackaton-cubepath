import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const buildCreatorPrompt = (
  profile: {
    brandName: string | null;
    niche: string | null;
    targetAudience: string | null;
    tone: string | null;
    goals: string | null;
    activeSocials: string | null;
    references: string | null;
  },
  instruction: string,
) => {
  const tone = profile.tone ? JSON.parse(profile.tone).join(", ") : "";
  const goals = profile.goals ? JSON.parse(profile.goals).join(", ") : "";
  const socials = profile.activeSocials
    ? JSON.parse(profile.activeSocials).join(", ")
    : "";

  return `
Eres un experto en social media y marketing digital.
Estás ayudando a ${profile.brandName}, que se dedica al nicho de ${profile.niche}.
Su público objetivo es: ${profile.targetAudience}.
Su tono de comunicación es: ${tone}.
Sus objetivos son: ${goals}.
Sus redes principales son: ${socials}.
${profile.references ? `Creadores que admira: ${profile.references}.` : ""}

${instruction}

Responde SOLO en JSON válido, sin texto adicional ni bloques de código markdown.
  `.trim();
};
