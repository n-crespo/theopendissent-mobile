import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Pressable,
  SafeAreaView,
} from "react-native";
import { useAuth } from "../src/context/AuthContext";

export default function Page() {
  const { user, loading, signIn } = useAuth();

  // 1. Loading State
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.text}>Connecting to Dissent...</Text>
      </View>
    );
  }

  // 2. Logged Out State
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>The Open Dissent</Text>
        <Text style={styles.subtitle}>Mobile Experiment</Text>

        <Pressable
          style={styles.button}
          onPress={() =>
            alert(
              "Native Google Sign-In requires extra setup! We will fix this next.",
            )
          }
        >
          <Text style={styles.buttonText}>Sign In with Google</Text>
        </Pressable>
      </View>
    );
  }

  // 3. Logged In State (The Feed)
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Feed</Text>
        <Text style={styles.userText}>User: {user.uid.slice(0, 5)}...</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.text}>
          Feed data will go here.
          {/* We will hook up usePosts() here next */}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 32,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: "#444",
  },
  userText: {
    fontSize: 12,
    color: "#888",
  },
  button: {
    backgroundColor: "#2563EB", // Logo blue
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
