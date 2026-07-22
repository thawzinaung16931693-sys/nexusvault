import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center relative z-10 px-4">
      <Card className="w-full max-w-sm glass-surface border-[#7B2CBF]/30">
        <CardHeader className="text-center">
          <CardTitle className="text-white text-xl font-['Space_Grotesk']">Welcome to Lotaya Digital Store</CardTitle>
          <p className="text-gray-400 text-sm mt-1">Sign in to access your digital store</p>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full btn-gradient text-white"
            size="lg"
            onClick={() => {
              window.location.href = getOAuthUrl();
            }}
          >
            Sign in with Kimi
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
