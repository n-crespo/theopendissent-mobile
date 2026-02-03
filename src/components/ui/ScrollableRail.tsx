import React, { ReactNode } from "react";
import { ScrollView, View, StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "@/src/constants/theme";

interface ScrollableRailProps {
  children: ReactNode;
  style?: ViewStyle;
}

export const ScrollableRail = ({ children, style }: ScrollableRailProps) => {
  return (
    <View style={[styles.container, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToAlignment="center"
      >
        {children}
        {/* Spacer for right-side visual balance */}
        <View style={{ width: 16 }} />
      </ScrollView>

      {/* Fade / Shadow Overlay */}
      <View style={styles.fadeOverlay}>
        <LinearGradient
          colors={["transparent", theme.colors.background]} // Fades to background color
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  scrollContent: {
    paddingLeft: 0,
    alignItems: "center",
    gap: 8,
  },
  fadeOverlay: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 30, // Width of the fade
    pointerEvents: "none", // Allows touches to pass through to the scrollview
    zIndex: 10,
  },
});
