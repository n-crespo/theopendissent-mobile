import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router, Stack } from "expo-router";
import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/src/constants/theme";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { signInWithGoogle } from "@/src/lib/firebase";

// Required for the browser to close correctly after login
WebBrowser.maybeCompleteAuthSession();

const IOS_BLUE = "#007AFF";

export default function SignInModal() {
  const [loading, setLoading] = useState(false);

  // 1. The Magic String: Matches your Google Cloud Console "Authorized redirect URIs"
  const PROXY_REDIRECT = "https://auth.expo.io/@ncrespo/theopendissent-mobile";

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    // 2. CRITICAL: Use the Web Client ID for EVERYTHING in Expo Go.
    // This forces Google to see this as a "Web" request, allowing the proxy redirect.
    clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,

    // 3. Do NOT include iosClientId here while testing in Expo Go.
    // It causes a mismatch because Google expects a Bundle ID (com.app...) instead of the proxy URL.

    redirectUri: PROXY_REDIRECT,

    // 4. Force Firebase-compatible response
    responseType: "id_token",
  });

  // Debugging Log
  useEffect(() => {
    if (request) {
      console.log("---------------------------------------------");
      console.log("AUTH REQUEST READY");
      console.log("Target Client ID:", request.clientId);
      console.log("Redirect URI:", request.redirectUri);
      console.log("---------------------------------------------");
    }
  }, [request]);

  // Handle Login Response
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      handleFirebaseLogin(id_token);
    } else if (response?.type === "error") {
      Alert.alert("Authentication Error", "Google could not sign you in.");
      console.error("Auth Error:", response.error);
    }
  }, [response]);

  const handleFirebaseLogin = async (idToken: string) => {
    if (!idToken) return;

    setLoading(true);
    try {
      // Pass the token to your firebase.ts helper
      await signInWithGoogle(idToken);
      router.back();
    } catch (error: any) {
      console.error("Firebase Login Error:", error);

      const isDomainError = error.message?.includes("g.ucla.edu");
      Alert.alert(
        isDomainError ? "UCLA Access Only" : "Login Failed",
        isDomainError
          ? "Please use your @g.ucla.edu email."
          : "Could not verify your account with Firebase.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Stack.Screen
        options={{
          title: "Sign In",
          headerLeft: () => (
            <ButtonText onPress={() => router.back()} text="Cancel" />
          ),
        }}
      />

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="school" size={60} color={IOS_BLUE} />
        </View>

        <Text style={styles.title}>Student Access</Text>
        <Text style={styles.subtitle}>
          Join the conversation on The Open Dissent.
        </Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Ionicons
              name="shield-checkmark"
              size={20}
              color={theme.colors.success}
              style={{ marginRight: 12 }}
            />
            <Text style={styles.warningText}>
              Verification is handled automatically via{" "}
              <Text style={{ fontWeight: "600" }}>UCLA Single Sign-On</Text>.
            </Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            (!request || loading) && { opacity: 0.5 },
            pressed && { opacity: 0.8 },
          ]}
          disabled={!request || loading}
          onPress={() => {
            // Force the proxy usage one last time in the prompt
            promptAsync();
          }}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.primaryButtonText}>Sign In with Google</Text>
          )}
        </Pressable>

        <Text style={styles.footerText}>
          You will be redirected to the secure Google login page.
        </Text>
      </View>
    </View>
  );
}

const ButtonText = ({
  text,
  onPress,
}: {
  text: string;
  onPress: () => void;
}) => (
  <Pressable onPress={onPress}>
    <Text style={{ fontSize: 17, color: IOS_BLUE, paddingHorizontal: 8 }}>
      {text}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.backgroundGrouped },
  content: { padding: 24, alignItems: "center", paddingTop: 40 },
  iconContainer: {
    marginBottom: 20,
    width: 100,
    height: 100,
    borderRadius: 22,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  title: { fontSize: 28, fontWeight: "800", color: "#000", marginBottom: 8 },
  subtitle: {
    fontSize: 17,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "white",
    width: "100%",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  row: { flexDirection: "row", alignItems: "center" },
  warningText: { fontSize: 15, color: "#000", flex: 1, lineHeight: 20 },
  primaryButton: {
    backgroundColor: "#000",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  primaryButtonText: { color: "white", fontSize: 17, fontWeight: "600" },
  footerText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
