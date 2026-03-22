import { useState } from "react";

interface User {
  name: string;
  email: string;
  image: string;
}

interface Props {
  user: User;
}

interface ProfileData {
  brandName: string;
  niche: string;
  targetAudience: string;
  tone: string[];
  goals: string[];
  activeSocials: string[];
  references: string;
}

const NICHES = [
  "Tech",
  "Fitness",
  "Gastronomía",
  "Moda",
  "Educación",
  "Negocios",
  "Entretenimiento",
  "Lifestyle",
  "Otro",
];
const TONES = [
  "Casual",
  "Formal",
  "Humorístico",
  "Educativo",
  "Inspiracional",
  "Provocador",
  "Cercano",
  "Profesional",
];
const GOALS = [
  "Más seguidores",
  "Más engagement",
  "Vender producto/servicio",
  "Posicionamiento como experto",
  "Generar comunidad",
];
const SOCIALS = [
  "Instagram",
  "TikTok",
  "Twitter/X",
  "LinkedIn",
  "YouTube",
  "Facebook",
  "Threads",
];

export default function OnboardingWizard({ user }: Props) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ProfileData>({
    brandName: "",
    niche: "",
    targetAudience: "",
    tone: [],
    goals: [],
    activeSocials: [],
    references: "",
  });

  const toggleItem = (
    field: "tone" | "goals" | "activeSocials",
    item: string,
  ) => {
    setData((prev) => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter((i) => i !== item)
        : [...prev[field], item],
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await fetch("http://localhost:3000/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      window.location.href = "/dashboard";
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col items-center justify-center p-6">
      {/* Progress bar */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Paso {step} de 3</span>
          <span>{Math.round((step / 3) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-1">
          <div
            className="bg-[#00FF94] h-1 rounded-full transition-all duration-500"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <div className="w-full max-w-lg">
        {/* Paso 1 */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-1">
                Hola, {user.name.split(" ")[0]} 👋
              </h1>
              <p className="text-gray-400">
                Cuéntanos sobre ti para personalizar tu experiencia
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  ¿Cómo quieres que te llamemos?
                </label>
                <input
                  type="text"
                  value={data.brandName}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, brandName: e.target.value }))
                  }
                  placeholder="Tu nombre o nombre de marca"
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#00FF94] transition"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  ¿Cuál es tu nicho?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {NICHES.map((niche) => (
                    <button
                      key={niche}
                      onClick={() => setData((prev) => ({ ...prev, niche }))}
                      className={`py-2 px-3 rounded-xl text-sm border transition ${
                        data.niche === niche
                          ? "border-[#00FF94] text-[#00FF94] bg-[#00FF9410]"
                          : "border-gray-800 text-gray-400 hover:border-gray-600"
                      }`}
                    >
                      {niche}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!data.brandName || !data.niche}
              className="w-full py-3 rounded-xl bg-[#00FF94] text-black font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#00e085] transition"
            >
              Continuar →
            </button>
          </div>
        )}

        {/* Paso 2 */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-1">Tu audiencia 🎯</h1>
              <p className="text-gray-400">¿A quién le hablas y cómo?</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  ¿Quién es tu público objetivo?
                </label>
                <textarea
                  value={data.targetAudience}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      targetAudience: e.target.value,
                    }))
                  }
                  placeholder="Ej: developers junior en LATAM, mamás emprendedoras..."
                  rows={3}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#00FF94] transition resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Tono de comunicación (elige 2-3)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {TONES.map((tone) => (
                    <button
                      key={tone}
                      onClick={() => toggleItem("tone", tone)}
                      className={`py-2 px-3 rounded-xl text-sm border transition ${
                        data.tone.includes(tone)
                          ? "border-[#00FF94] text-[#00FF94] bg-[#00FF9410]"
                          : "border-gray-800 text-gray-400 hover:border-gray-600"
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="w-full py-3 rounded-xl border border-gray-800 text-gray-400 hover:border-gray-600 transition"
              >
                ← Atrás
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!data.targetAudience || data.tone.length === 0}
                className="w-full py-3 rounded-xl bg-[#00FF94] text-black font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#00e085] transition"
              >
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* Paso 3 */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-1">Casi listo 🚀</h1>
              <p className="text-gray-400">
                ¿Dónde publicas y qué quieres lograr?
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Redes sociales activas
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {SOCIALS.map((social) => (
                    <button
                      key={social}
                      onClick={() => toggleItem("activeSocials", social)}
                      className={`py-2 px-3 rounded-xl text-sm border transition ${
                        data.activeSocials.includes(social)
                          ? "border-[#00FF94] text-[#00FF94] bg-[#00FF9410]"
                          : "border-gray-800 text-gray-400 hover:border-gray-600"
                      }`}
                    >
                      {social}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Objetivos
                </label>
                <div className="flex flex-col gap-2">
                  {GOALS.map((goal) => (
                    <button
                      key={goal}
                      onClick={() => toggleItem("goals", goal)}
                      className={`py-2 px-4 rounded-xl text-sm border text-left transition ${
                        data.goals.includes(goal)
                          ? "border-[#00FF94] text-[#00FF94] bg-[#00FF9410]"
                          : "border-gray-800 text-gray-400 hover:border-gray-600"
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Referentes (opcional)
                </label>
                <input
                  type="text"
                  value={data.references}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, references: e.target.value }))
                  }
                  placeholder="Ej: @midudev, @paulocoelho..."
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#00FF94] transition"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="w-full py-3 rounded-xl border border-gray-800 text-gray-400 hover:border-gray-600 transition"
              >
                ← Atrás
              </button>
              <button
                onClick={handleSubmit}
                disabled={
                  data.activeSocials.length === 0 ||
                  data.goals.length === 0 ||
                  loading
                }
                className="w-full py-3 rounded-xl bg-[#00FF94] text-black font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#00e085] transition"
              >
                {loading ? "Guardando..." : "Comenzar 🚀"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
