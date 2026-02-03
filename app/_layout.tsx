import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../src/context/AuthContext";
import { ModalProvider } from "../src/context/ModalContext";
import { GlobalModal } from "../src/components/modals/GlobalModal";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AuthProvider>
        <ModalProvider>
          {/* Use Stack for native navigation */}
          <Stack>
            {/* 1. Main Feed (Hidden Header) */}
            <Stack.Screen name="index" options={{ headerShown: false }} />

            {/* 2. The "Apple Style" About Sheet */}
            <Stack.Screen
              name="modal/about"
              options={{
                presentation: "modal", // Use native iOS sheet
                headerShown: true, // Use native header bar
                headerTitle: "About", // Native Title
                headerLargeTitle: true, // The big iOS 14+ title
                headerStyle: { backgroundColor: "#F2F2F7" }, // Matches grouped bg
                headerShadowVisible: false, // Removes line under header
              }}
            />
          </Stack>

          <GlobalModal />
        </ModalProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
