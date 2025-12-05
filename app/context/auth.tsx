"use client";

import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useLayoutEffect,
} from "react";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import { useRouter } from "next/navigation";

// --- Types ---
interface User {
  id?: string;
  name?: string;
  avatar?: string | null;
  email?: string;
  phone?: string;
  role?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

interface AuthContextType {
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
  loading: boolean;
  logout: () => void;
}

const defaultState: AuthState = { user: null, token: null };
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>(defaultState);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 1️⃣ Load token + user on initial load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies["token"];

        if (!token) {
          setAuth(defaultState);
          setLoading(false);
          return;
        }

        setAuth((prev) => ({ ...prev, token }));

        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/auth/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setAuth({ token, user: data.user });
      } catch (err) {
        console.error("Auth init error:", err);
        destroyCookie(null, "token");
        setAuth(defaultState);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // 2️⃣ Fetch user when token changes (THIS FIXES THE LOGIN REFRESH ISSUE)
  useEffect(() => {
    const fetchUser = async () => {
      if (!auth.token) return; // nothing to fetch

      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/auth/me`,
          {
            headers: { Authorization: `Bearer ${auth.token}` },
          }
        );

        setAuth((prev) => ({
          ...prev,
          user: data.user,
        }));
      } catch (err) {
        console.error("Failed to fetch user:", err);
        destroyCookie(null, "token");
        setAuth(defaultState);
        router.replace("/login");
      }
    };

    fetchUser();
  }, [auth.token]); // 🔥 triggers AFTER login

  // 3️⃣ Axios Interceptor
  useLayoutEffect(() => {
    const authInterceptor = axios.interceptors.request.use((config) => {
      const cookies = parseCookies();
      const token = cookies["token"];

      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    return () => axios.interceptors.request.eject(authInterceptor);
  }, []);

  // 4️⃣ Logout
  const logout = () => {
    destroyCookie(null, "token", { path: "/" });
    setAuth(defaultState);
    router.replace("/login");
  };

  // 5️⃣ Sync token into cookies
  useEffect(() => {
    if (auth.token) {
      setCookie(null, "token", auth.token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
    }
  }, [auth.token]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, loading, logout }}>
      {loading && !auth.token ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
          <span className="text-gray-500">Loading...</span>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};