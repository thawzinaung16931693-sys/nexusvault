import { NeonAuthUIProvider, AuthView } from "@neondatabase/auth-ui";
import "@neondatabase/auth-ui/css";
import { useNavigate } from "react-router";
import { authClient } from "@/auth";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center relative z-10 px-4">
      <div className="w-full max-w-sm glass-surface border border-[#7B2CBF]/30 rounded-xl p-6">
        <div className="text-center mb-6">
          <h1 className="text-white text-xl font-['Space_Grotesk'] font-semibold">
            Welcome to Lotaya Digital Store
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Sign in to access your digital store
          </p>
        </div>
        <NeonAuthUIProvider
          authClient={authClient}
          navigate={navigate}
          social={{
            providers: ["google", "github"],
          }}
        >
          <AuthView pathname="sign-in" />
        </NeonAuthUIProvider>
      </div>
    </div>
  );
}
