import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { User } from "firebase/auth";
import { subscribeToAuth, signInWithGoogle, logoutUser } from "../lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Manages the authentication state and provides auth methods via context.
 * Wraps the entire application in _layout.tsx.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth changes using the library helper
    const unsubscribe = subscribeToAuth((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      // NOTE: In React Native, this function in 'lib/firebase' must use
      // GoogleSignin.signIn() (native) or makeRedirectUri() (expo-auth-session).
      // The web 'signInWithPopup' will NOT work here.
      await signInWithGoogle();
    } catch (error) {
      console.error("Sign in failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom Hook to access auth state.
 * Usage: const { user, loading, signIn } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
