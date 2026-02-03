import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { theme } from "../../constants/theme";
import { Ionicons } from "@expo/vector-icons";

// --- Placeholder for ListenChip (until we port the real one) ---
const ListenChip = () => (
  <View style={styles.chipPlaceholder}>
    <Ionicons name="musical-notes" size={16} color="white" />
    <Text style={styles.chipText}>Listen to the Podcast</Text>
  </View>
);
// -------------------------------------------------------------

export const AboutModal = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>What is this?</Text>

      <Text style={styles.body}>
        The Open Dissent is a platform for{" "}
        <Text style={styles.bold}>anonymous political debate</Text>.{"\n"}
        {"\n"}
        We believe ideas should stand on their own merit. That means no public
        profiles and <Text style={styles.bold}>no engagement algorithms</Text>.
        Our feed is shuffled to ensure you see a diverse range of opinions, not
        just the loudest ones.
        {"\n"}
        {"\n"}
        Post your thoughts today for a chance to be featured on our debate-style
        show!
      </Text>

      {/* Podcast Links */}
      <View style={styles.footer}>
        <ListenChip />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.text, // text-slate-900
    marginBottom: 24,
    textAlign: "center",
  },
  body: {
    fontSize: 16,
    lineHeight: 24, // leading-relaxed
    color: theme.colors.textSecondary, // text-slate-700
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  bold: {
    fontWeight: "700",
    color: theme.colors.text,
  },
  footer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  // Chip Styles
  chipPlaceholder: {
    backgroundColor: theme.colors.logoBlue,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.full,
    gap: 8,
  },
  chipText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});
