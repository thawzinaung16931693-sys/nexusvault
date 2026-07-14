import { useEffect } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { LOGIN_PATH } from "@/const";

export function useAuth(options?: {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
}) {
  const utils = trpc.useUtils();
  const navigate = useNavigate();
  const { data: user, isLoading } = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.invalidate();
      window.location.reload();
    },
  });

  useEffect(() => {
    if (
      options?.redirectOnUnauthenticated &&
      !isLoading &&
      !user
    ) {
      navigate(options.redirectPath || LOGIN_PATH);
    }
  }, [options, isLoading, user, navigate]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    logout: () => logoutMutation.mutate(),
  };
}
