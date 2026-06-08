import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User } from "@shared/schema";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Optimistically show the locally stored user for instant UI...
    const storedUser = localStorage.getItem("customfit_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("customfit_user");
      }
    }

    // ...then confirm with the server session. This also hydrates users who
    // signed in via "Log in with Replit" (no localStorage entry of their own).
    (async () => {
      try {
        const response = await fetch("/api/auth/me", { credentials: "include" });
        if (response.ok) {
          const { user: serverUser } = await response.json();
          setUser(serverUser);
          localStorage.setItem("customfit_user", JSON.stringify(serverUser));
        } else if (response.status === 401) {
          setUser(null);
          localStorage.removeItem("customfit_user");
        }
      } catch {
        // Network error — keep optimistic state.
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const { user } = await response.json();
    setUser(user);
    localStorage.setItem("customfit_user", JSON.stringify(user));
  };

  const register = async (userData: any) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const { user } = await response.json();
    setUser(user);
    localStorage.setItem("customfit_user", JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("customfit_user");
    // Destroy the server session (clears both custom and Replit Auth identity).
    fetch("/api/auth/logout", { method: "POST", credentials: "include" }).catch(
      () => {},
    );
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
