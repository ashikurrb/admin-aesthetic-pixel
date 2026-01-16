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
import Image from "next/image";

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

  // load token & user on mount
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

  // when token change, fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      if (!auth.token) return;
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
  }, [auth.token]); //

  //Axios Interceptor
  useLayoutEffect(() => {
    const authInterceptor = axios.interceptors.request.use((config) => {
      const cookies = parseCookies();
      const token = cookies["token"];

      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    return () => axios.interceptors.request.eject(authInterceptor);
  }, []);

  // Logout
  const logout = () => {
    destroyCookie(null, "token", { path: "/" });
    setAuth(defaultState);
    router.replace("/login");
  };

  // Sync token into cookies
  useEffect(() => {
    if (auth.token) {
      setCookie(null, "token", auth.token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
    }
  }, [auth.token]);

  //auto logout
  useLayoutEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401) {
          destroyCookie(null, "token");
          setAuth(defaultState);
          router.replace("/login");
        }
        return Promise.reject(err);
      }
    );

    return () => axios.interceptors.response.eject(responseInterceptor);
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, loading, logout }}>
      {loading && !auth.token ? (
       <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <Image
          src="/logoDark.png"
          alt="Aesthetic Pixel Studio LLC"
          width={150}
          height={150}
          className="animate-pulse"
        />
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
