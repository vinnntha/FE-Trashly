"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import { UserProfile, loginApi, registerNasabahApi, registerAdminApi, getMeApi } from "@/lib/api";
import { isTokenExpired, getTokenRemainingSeconds, getTokenRole } from "@/lib/jwt";
import { setAuthCookie, removeAuthCookie } from "@/lib/cookie";

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  tokenRole: 'NASABAH' | 'ADMIN' | null;
  isLoading: boolean;
  isSessionExpired: boolean;
  login: (username: string, password: string) => Promise<UserProfile>;
  registerNasabah: (formData: FormData) => Promise<unknown>;
  registerAdmin: (data: {
    username: string;
    password: string;
    namaUnit: string;
    namaPengelola: string;
    telp: string;
  }) => Promise<unknown>;
  logout: (expired?: boolean) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "trashly_token";
const USER_KEY = "trashly_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSessionExpired, setIsSessionExpired] = useState<boolean>(false);

  const expirationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear auto-expiration timer
  const clearExpirationTimer = useCallback(() => {
    if (expirationTimerRef.current) {
      clearTimeout(expirationTimerRef.current);
      expirationTimerRef.current = null;
    }
  }, []);

  const handleSessionExpired = useCallback(() => {
    clearExpirationTimer();
    setToken(null);
    setUser(null);
    setIsSessionExpired(true);
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      removeAuthCookie();
    }
  }, [clearExpirationTimer]);

  // Schedule auto-logout when token expires
  const scheduleExpirationTimer = useCallback((jwtToken: string) => {
    clearExpirationTimer();
    const remainingSeconds = getTokenRemainingSeconds(jwtToken);

    if (remainingSeconds <= 0) {
      handleSessionExpired();
      return;
    }

    // Schedule timer to trigger slightly before or right on expiration
    expirationTimerRef.current = setTimeout(() => {
      console.warn("JWT Token has expired. Logging out automatically.");
      handleSessionExpired();
    }, remainingSeconds * 1000);
  }, [clearExpirationTimer, handleSessionExpired]);

  // Load saved session on initial mount
  useEffect(() => {
    async function initAuth() {
      if (typeof window === "undefined") return;

      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedToken) {
        // 1. First check if token is expired locally
        if (isTokenExpired(storedToken)) {
          console.warn("Stored token is already expired. Clearing session.");
          handleSessionExpired();
          setIsLoading(false);
          return;
        }

        // 2. Token is valid in time: sync cookie and setup auto-logout timer
        const remainingSeconds = getTokenRemainingSeconds(storedToken);
        setAuthCookie(storedToken, remainingSeconds);
        scheduleExpirationTimer(storedToken);

        setToken(storedToken);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            console.error("Failed to parse stored user", e);
          }
        }

        // 3. Verify session with backend API
        try {
          const res = await getMeApi(storedToken);
          setUser(res.data);
          localStorage.setItem(USER_KEY, JSON.stringify(res.data));
        } catch (err) {
          console.warn("Session verification failed on backend:", err);
          handleSessionExpired();
        }
      }

      setIsLoading(false);
    }

    initAuth();

    return () => {
      clearExpirationTimer();
    };
  }, [clearExpirationTimer, handleSessionExpired, scheduleExpirationTimer]);

  const refreshUser = async () => {
    if (!token || isTokenExpired(token)) {
      handleSessionExpired();
      return;
    }
    try {
      const res = await getMeApi(token);
      setUser(res.data);
      localStorage.setItem(USER_KEY, JSON.stringify(res.data));
    } catch (err) {
      console.error("Failed to refresh user:", err);
      handleSessionExpired();
    }
  };

  const login = async (username: string, password: string): Promise<UserProfile> => {
    const res = await loginApi(username, password);
    const { token: newToken, ...userData } = res.data;

    const profile: UserProfile = {
      id: userData.id,
      username: userData.username,
      role: userData.role,
      nasabah: userData.nasabah,
      adminBank: userData.adminBank,
    };

    setToken(newToken);
    setUser(profile);
    setIsSessionExpired(false);

    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(USER_KEY, JSON.stringify(profile));
    }

    // Set cookie and schedule timer based on token exp
    const remainingSeconds = getTokenRemainingSeconds(newToken);
    setAuthCookie(newToken, remainingSeconds);
    scheduleExpirationTimer(newToken);

    return profile;
  };

  const registerNasabah = async (formData: FormData): Promise<unknown> => {
    const res = await registerNasabahApi(formData);
    return res;
  };

  const registerAdmin = async (data: {
    username: string;
    password: string;
    namaUnit: string;
    namaPengelola: string;
    telp: string;
  }): Promise<unknown> => {
    const res = await registerAdminApi(data);
    return res;
  };

  const logout = (expired: boolean = false) => {
    clearExpirationTimer();
    setToken(null);
    setUser(null);
    if (expired) {
      setIsSessionExpired(true);
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      removeAuthCookie();
    }
  };

  // Derive role securely from token payload to avoid relying solely on client state
  const tokenRole = token ? getTokenRole(token) : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        tokenRole,
        isLoading,
        isSessionExpired,
        login,
        registerNasabah,
        registerAdmin,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
