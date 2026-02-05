import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/context/AuthContext";
import { router } from "expo-router";
import { theme } from "../../src/constants/theme";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileTab() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Ionicons
            name="person-circle-outline"
            size={80}
            color={theme.colors.slate300}
          />
          <Text style={styles.title}>Your Profile</Text>
          <Text style={styles.subtitle}>
            Sign in with your UCLA email to join the discussion.
          </Text>
          <Pressable
            style={styles.signInBtn}
            onPress={() => router.push("/modal/signin")}
          >
            <Text style={styles.signInBtnText}>Sign In</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.email?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.emailText}>{user.email}</Text>
            <View style={styles.badge}>
              <Ionicons
                name="checkmark-circle"
                size={14}
                color={theme.colors.success}
              />
              <Text style={styles.badgeText}>Verified Student</Text>
            </View>
          </View>
        </View>

        <Pressable style={styles.logoutBtn} onPress={logout}>
          <Ionicons
            name="log-out-outline"
            size={18}
            color={theme.colors.danger}
          />
          <Text style={styles.logoutBtnText}>Sign Out</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        {/* activity feed/stats would go here */}
        <Text style={styles.infoText}>
          Your posts and interactions will appear here.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderSubtle,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.slate100,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.logoBlue,
  },
  emailText: { fontSize: 16, fontWeight: "600", color: theme.colors.slate900 },
  badge: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  badgeText: { fontSize: 12, color: theme.colors.success, fontWeight: "600" },
  title: { fontSize: 24, fontWeight: "bold", marginTop: 16 },
  subtitle: {
    textAlign: "center",
    color: theme.colors.textSecondary,
    marginTop: 8,
    marginBottom: 24,
  },
  signInBtn: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  signInBtnText: { color: "white", fontWeight: "600" },
  logoutBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  logoutBtnText: {
    color: theme.colors.danger,
    fontWeight: "600",
    fontSize: 14,
  },
  content: { flex: 1, alignItems: "center", justifyContent: "center" },
  infoText: { color: theme.colors.textTertiary, fontSize: 14 },
});
