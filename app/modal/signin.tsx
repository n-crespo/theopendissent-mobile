import { View, Text, StyleSheet, Pressable } from "react-native";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/src/constants/theme";

// Standard iOS System Colors
const IOS_BLUE = "#007AFF";
const IOS_GRAY = theme.colors.iosGray;
const IOS_BG = theme.colors.backgroundGrouped; // System Grouped Background

export default function SignInModal() {
  // Mock function for now
  const handleSignIn = () => {
    alert("This would trigger Google Sign In");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* 1. Native Header Configuration */}
      <Stack.Screen
        options={{
          title: "Sign In",
          headerLeft: () => (
            <ButtonText onPress={() => router.back()} text="Cancel" />
          ),
          headerRight: () => null, // No "Done" button until they sign in
        }}
      />

      {/* 2. Main Content */}
      <View style={styles.content}>
        {/* Logo / Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="school" size={60} color={IOS_BLUE} />
        </View>

        <Text style={styles.title}>Student Access</Text>
        <Text style={styles.subtitle}>
          Join the conversation on The Open Dissent.
        </Text>

        {/* 3. The Warning Card (Apple Style) */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Ionicons
              name="warning"
              size={20}
              color="#FF9500"
              style={{ marginRight: 12 }}
            />
            <Text style={styles.warningText}>
              You must use a{" "}
              <Text style={{ fontWeight: "600" }}>@g.ucla.edu</Text> email
              address to sign up.
            </Text>
          </View>
        </View>

        {/* 4. Action Buttons */}
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
          ]}
          onPress={handleSignIn}
        >
          <Text style={styles.primaryButtonText}>Sign In with Google</Text>
        </Pressable>

        <Text style={styles.footerText}>
          We do not store your personal data. Your identity is anonymized.
        </Text>
      </View>
    </View>
  );
}

// Helper for Header Buttons
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
  container: {
    flex: 1,
    backgroundColor: IOS_BG,
  },
  content: {
    padding: 24,
    alignItems: "center",
    paddingTop: 40,
  },
  iconContainer: {
    marginBottom: 20,
    width: 100,
    height: 100,
    borderRadius: 22,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: theme.colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.shadowColor,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 17,
    color: IOS_GRAY,
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
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  warningText: {
    fontSize: 15,
    color: theme.colors.shadowColor,
    flex: 1,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: theme.colors.shadowColor,
    width: "100%",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
  },
  footerText: {
    fontSize: 13,
    color: IOS_GRAY,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
