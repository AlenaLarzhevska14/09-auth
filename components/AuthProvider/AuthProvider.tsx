"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession, logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

type AuthProviderProps = {
  children: ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );

  const [isChecking, setIsChecking] = useState(true);
  const [canRenderContent, setCanRenderContent] = useState(false);

  useEffect(() => {
    async function verifySession() {
      setIsChecking(true);
      setCanRenderContent(false);
      let keepLoader = false;

      const isPrivateRoute =
        pathname.startsWith("/profile") || pathname.startsWith("/notes");

      const isAuthRoute =
        pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

      try {
        const user = await checkSession();

        if (user) {
          setUser(user);

          if (isAuthRoute) {
            keepLoader = true;
            router.replace("/profile");
            return;
          }

          setCanRenderContent(true);
        } else {
          clearIsAuthenticated();

          if (isPrivateRoute) {
            try {
              await logout();
            } catch {}

            keepLoader = true;
            router.replace("/sign-in");
            return;
          }

          setCanRenderContent(true);
        }
      } catch {
        clearIsAuthenticated();

        if (isPrivateRoute) {
          try {
            await logout();
          } catch {}

          keepLoader = true;
          router.replace("/sign-in");
          return;
        }

        setCanRenderContent(true);
      } finally {
        if (!keepLoader) {
          setIsChecking(false);
        }
      }
    }

    verifySession();
  }, [pathname, router, setUser, clearIsAuthenticated]);

  if (isChecking || !canRenderContent) {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
}
