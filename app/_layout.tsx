import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../src/context/AuthContext";
import { ModalProvider } from "../src/context/ModalContext";
import { GlobalModal } from "../src/components/modals/GlobalModal";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AuthProvider>
        <ModalProvider>
          <Stack screenOptions={{ headerShown: false }}>
            {/* 1. Main Tabs */}
            <Stack.Screen
              name="(tabs)"
              options={{
                title: "Home Feed",
              }}
            />

            {/* 2. Sign In Modal */}
            <Stack.Screen
              name="modal/signin"
              options={{
                presentation: "formSheet", // The Apple Card Look
                sheetAllowedDetents: [1.0],
                sheetGrabberVisible: true,
                headerShown: false, // We handle the header inside the file
              }}
            />

            {/* 3. Discussion Sheet - SIMPLIFIED */}
            <Stack.Screen
              name="replies/[id]"
              options={{
                presentation: "modal",
                sheetAllowedDetents: [1.0],
                sheetGrabberVisible: true,
                headerShown: true, // Native Header ON
                title: "Replies",
                headerShadowVisible: true,
                headerStyle: { backgroundColor: "#F2F2F7" },
              }}
            />
          </Stack>
          <GlobalModal />
        </ModalProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
