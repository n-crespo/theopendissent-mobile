import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../src/context/AuthContext";

export default function RootLayout() {
  return (
    // SafeAreaProvider ensures content doesn't go behind the notch/status bar
    <SafeAreaProvider>
      <AuthProvider>
        {/* Slot renders the current page (e.g., index.tsx) */}
        <Slot />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
