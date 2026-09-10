"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserProfile, loginApi, registerNasabahApi, registerAdminApi, getMeApi } from "@/lib/api";

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<UserProfile>;
  registerNasabah: (formData: FormData) => Promise<any>;
  registerAdmin: (data: {
    username: string;
    password: string;
    namaUnit: string;
    namaPengelola: string;
    telp: string;
  }) => Promise<any>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "trashly_token";
const USER_KEY = "trashly_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load saved session on initial mount
  useEffect(() => {
    async function initAuth() {
      if (typeof window === "undefined") return;

      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedToken) {
        setToken(storedToken);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            console.error("Failed to parse stored user", e);
          }
        }

        // Verify session with backend
        try {
          const res = await getMeApi(storedToken);
          setUser(res.data);
          localStorage.setItem(USER_KEY, JSON.stringify(res.data));
        } catch (err) {
          console.warn("Session expired or invalid token:", err);
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setToken(null);
          setUser(null);
        }
      }

      setIsLoading(false);
    }

    initAuth();
  }, []);

  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await getMeApi(token);
      setUser(res.data);
      localStorage.setItem(USER_KEY, JSON.stringify(res.data));
    } catch (err) {
      console.error("Failed to refresh user:", err);
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

    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(profile));

    return profile;
  };

  const registerNasabah = async (formData: FormData): Promise<any> => {
    const res = await registerNasabahApi(formData);
    return res;
  };

  const registerAdmin = async (data: {
    username: string;
    password: string;
    namaUnit: string;
    namaPengelola: string;
    telp: string;
  }): Promise<any> => {
    const res = await registerAdminApi(data);
    return res;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
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
