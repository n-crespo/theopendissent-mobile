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
import { useAuth } from "@/src/context/AuthContext";
import { loginWithFirebaseCredential } from "@/src/lib/firebase";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

const IOS_BLUE = "#007AFF";

export default function SignInModal() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // 1. Configure the Google Request
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
    androidClientId: "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
    webClientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com", // also called 'clientId' in some configs
  });

  // 2. Listen for the response
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      handleFirebaseLogin(id_token);
    }
  }, [response]);

  const handleFirebaseLogin = async (idToken: string) => {
    setLoading(true);
    try {
      await loginWithFirebaseCredential(idToken);
      router.back();
    } catch (error: any) {
      // your backend blocking function error will be caught here
      const isDomainError = error.message?.includes("g.ucla.edu");
      Alert.alert(
        isDomainError ? "UCLA Access Only" : "Login Failed",
        isDomainError
          ? "Please use your @g.ucla.edu email."
          : "Try again later.",
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
          onPress={() => promptAsync()}
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
