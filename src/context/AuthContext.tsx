import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { subscribeToAuth, signInWithGoogle, logoutUser } from "../lib/firebase";
import { User } from "firebase/auth";

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    // Use the ID from Firebase (mriv...)
    clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,

    // Force the exact whitelisted URL
    redirectUri: "https://auth.expo.io/@ncrespo/theopendissent-mobile",

    // tells the hook to use the Expo Auth Proxy for Expo Go testing
    // proxy: true,

    // Firebase requires the ID Token
    responseType: "id_token",
  });

  // 2. Debugging: This should now match your Google Console exactly
  useEffect(() => {
    if (request) {
      console.log("---------------- AUTH DEBUG ----------------");
      console.log("Final Redirect URI:", request.redirectUri);
      console.log("Full Auth URL:", request.url);
      console.log("--------------------------------------------");
    }
  }, [request]);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      if (id_token) {
        signInWithGoogle(id_token).catch((err) => {
          console.error("Firebase Sign-In Error:", err);
        });
      }
    }
  }, [response]);

  const signIn = async () => {
    try {
      // triggers the login flow using the configured proxy
      await promptAsync();
    } catch (error) {
      console.error("Sign in error:", error);
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
