import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../src/context/AuthContext";
import { ModalProvider } from "../src/context/ModalContext";
import { GlobalModal } from "../src/components/modals/GlobalModal";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      {/* style="dark" -> Forces the Time/Battery text to be BLACK.
        This provides high contrast against your cream (#F8F2E8) background.
      */}
      <StatusBar style="dark" />

      <AuthProvider>
        <ModalProvider>
          {/* Slot loads the (tabs) layout automatically */}
          <Slot />

          {/* Your Custom Global Modal floats above everything else */}
          <GlobalModal />
        </ModalProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
