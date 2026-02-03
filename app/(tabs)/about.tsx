import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet } from "react-native";
import { AboutModal } from "../../src/components/modals/AboutModal"; // Reuse your existing component

export default function AboutTab() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <AboutModal />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F2E8",
  },
  content: {
    padding: 20,
  },
});
