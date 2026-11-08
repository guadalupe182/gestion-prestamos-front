"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { clearToken, getToken, setToken } from "@/lib/auth";

const USER_KEY = "auth_user";

type AuthContextValue = {
  token: string | null;
  user: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, username?: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTokenState(getToken());
    setUserState(window.localStorage.getItem(USER_KEY));
    setLoading(false);
  }, []);

  const login = useCallback((t: string, username?: string) => {
    setToken(t);
    setTokenState(t);
    if (username) {
      window.localStorage.setItem(USER_KEY, username);
      setUserState(username);
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    window.localStorage.removeItem(USER_KEY);
    setTokenState(null);
    setUserState(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: !!token,
      loading,
      login,
      logout,
    }),
    [token, user, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return ctx;
}