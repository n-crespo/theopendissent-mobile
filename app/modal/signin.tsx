import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router, Stack } from "expo-router";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/src/constants/theme";
import { useAuth } from "@/src/context/AuthContext";

const IOS_BLUE = "#007AFF";

export default function SignInModal() {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signIn();
      router.back();
    } catch (error: any) {
      console.error("sign in error:", error.code, error.message);

      // if the backend blocking function triggers, the message
      // typically flows through the error object.
      const isDomainError =
        error.message?.includes("g.ucla.edu") ||
        error.code === "auth/permission-denied";

      Alert.alert(
        isDomainError ? "UCLA Access Only" : "Sign In Error",
        isDomainError
          ? "Please use your official @g.ucla.edu student email to continue."
          : "An unexpected error occurred. Please try again.",
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
          style={[styles.primaryButton, loading && { opacity: 0.7 }]}
          onPress={handleSignIn}
          disabled={loading}
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
