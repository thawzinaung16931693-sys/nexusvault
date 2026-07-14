import { useAuth } from "@/hooks/useAuth";
import { AuthLayoutSkeleton } from "./AuthLayoutSkeleton";
import { Navigate } from "react-router";
import { LOGIN_PATH } from "@/const";

interface Props {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function AuthLayout({ children, adminOnly }: Props) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <AuthLayoutSkeleton />;

  if (!user) return <Navigate to={LOGIN_PATH} replace />;

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
