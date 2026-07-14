import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Home, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative z-10 px-4">
      <div className="text-center">
        <AlertTriangle className="w-16 h-16 text-[#9D4EDD] mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-white mb-2 font-['Space_Grotesk']">
          404
        </h1>
        <p className="text-gray-400 mb-6">
          The page you're looking for doesn't exist in this dimension.
        </p>
        <Link to="/">
          <Button className="btn-gradient text-white">
            <Home className="w-4 h-4 mr-2" />
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
