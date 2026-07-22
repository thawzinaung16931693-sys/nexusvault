import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { authClient } from "@/auth";
import { LOGIN_PATH } from "@/const";

interface AuthUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role?: string;
}

export function useAuth(options?: {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
}) {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authClient.getSession().then((result) => {
      if (result.data?.session && result.data?.user) {
        const u = result.data.user;
        setUser({
          id: u.id,
          name: u.name ?? null,
          email: u.email,
          image: u.image ?? null,
          role: (u as any).role ?? "user",
        });
      }
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (options?.redirectOnUnauthenticated && !isLoading && !user) {
      navigate(options.redirectPath || LOGIN_PATH);
    }
  }, [options, isLoading, user, navigate]);

  const logout = useCallback(async () => {
    await authClient.signOut();
    setUser(null);
    window.location.reload();
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    logout,
  };
}
