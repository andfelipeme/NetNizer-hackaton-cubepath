import { authClient } from "../lib/auth-client";

export default function LoginButton() {
  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "http://localhost:4321/dashboard",
      scopes: ["user:email"],
    });
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition hover:cursor-pointer"
    >
      Entrar con GitHub
    </button>
  );
}
