"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { isTokenExpired } from "./jwt";
import { removeAuthCookie } from "./cookie";

export function clearSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("trashly_token");
    localStorage.removeItem("trashly_user");
    removeAuthCookie();
  }
}

/**
 * Custom hook to guard Nasabah routes:
 * - Redirects to /login if unauthenticated or token expired
 * - Redirects to /admin/nasabah if user role is ADMIN
 */
export function useAuthGuard() {
  const router = useRouter();
  const { user, token, tokenRole, isLoading, isSessionExpired, logout } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    // 1. If token is missing, expired, or session ended
    if (!token || isTokenExpired(token) || isSessionExpired) {
      if (token && isTokenExpired(token)) {
        logout(true);
      }
      router.push("/login");
      return;
    }

    // 2. If user profile is missing
    if (!user) {
      router.push("/login");
      return;
    }

    // 3. If role is ADMIN, Nasabah halaman is not accessible
    const currentRole = tokenRole || user.role;
    if (currentRole === "ADMIN") {
      router.push("/admin/dashboard");
    }
  }, [isLoading, token, isSessionExpired, user, tokenRole, logout, router]);

  const currentRole = tokenRole || user?.role;
  const isAuthorized = !isLoading && !!user && !!token && currentRole === "NASABAH";

  return {
    user,
    token,
    currentRole,
    isLoading,
    isAuthorized,
    logout,
  };
}

/**
 * Custom hook to guard Admin routes:
 * - Redirects to /login if unauthenticated or token expired
 * - Redirects to /dashboard if user role is NASABAH
 */
export function useAdminAuthGuard() {
  const router = useRouter();
  const { user, token, tokenRole, isLoading, isSessionExpired, logout } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    // 1. If token is missing, expired, or session ended
    if (!token || isTokenExpired(token) || isSessionExpired) {
      if (token && isTokenExpired(token)) {
        logout(true);
      }
      router.push("/login");
      return;
    }

    // 2. If user profile is missing
    if (!user) {
      router.push("/login");
      return;
    }

    // 3. If role is NASABAH, Admin panel is forbidden
    const currentRole = tokenRole || user.role;
    if (currentRole === "NASABAH") {
      router.push("/dashboard");
    }
  }, [isLoading, token, isSessionExpired, user, tokenRole, logout, router]);

  const currentRole = tokenRole || user?.role;
  const isAuthorized = !isLoading && !!user && !!token && currentRole === "ADMIN";

  return {
    user,
    token,
    currentRole,
    isLoading,
    isAuthorized,
    logout,
  };
}
