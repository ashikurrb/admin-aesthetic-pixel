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
import { useRouter } from "next/navigation"; // Import useRouter

// --- Types ---
interface User {
  id?: string;
  name?: string;
  email?: string;
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

interface AuthProviderProps {
  children: ReactNode;
}

// --- Defaults ---
const defaultState: AuthState = { user: null, token: null };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<AuthState>(defaultState);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter(); // Initialize Router

  // 1. Initialize Auth from Cookies on Mount
  useEffect(() => {
    const initAuth = () => {
      try {
        const cookies = parseCookies();
        const authCookie = cookies["auth"];

        if (authCookie) {
          const parsedData = JSON.parse(authCookie);
          setAuth({
            user: parsedData.user,
            token: parsedData.token,
          });
        }
      } catch (err) {
        console.error("Failed to parse auth cookie:", err);
        destroyCookie(null, "auth");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // 2. Axios Interceptor
  useLayoutEffect(() => {
    const authInterceptor = axios.interceptors.request.use((config) => {
      if (auth.token) {
        config.headers.Authorization = `Bearer ${auth.token}`;
      }
      return config;
    });

    return () => {
      axios.interceptors.request.eject(authInterceptor);
    };
  }, [auth.token]);

  // 3. Helper to handle Logout (FIXED)
  const logout = () => {
    // A. Enable loading state immediately to mask the UI
    setLoading(true);

    try {
      // B. Destroy the cookie
      destroyCookie(null, "auth", { path: "/" });

      // C. Clear the state
      setAuth(defaultState);

      // D. Redirect explicitly
      router.replace("/login"); 
    } catch (error) {
      console.error("Logout failed", error);
      setLoading(false); // Only disable loading if error occurs
    }
    
    // Note: We do NOT set loading(false) here on success, 
    // because the page is about to unmount/redirect. 
    // If you stay on the same page, you might want to add:
    // setTimeout(() => setLoading(false), 500); 
  };

  // 4. Sync State changes to Cookies
  useEffect(() => {
    if (auth.token && auth.user) {
      setCookie(null, "auth", JSON.stringify(auth), {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, loading, logout }}>
      {loading ? (
        // Ensure this loading spinner is full screen and blocks content
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
           {/* Add a visible spinner here if needed */}
           <span className="text-gray-500">Loading...</span>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

// --- Custom Hook ---
const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { useAuth, AuthProvider };