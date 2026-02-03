import React, { ReactNode } from "react";
import { Text, View, Pressable, StyleSheet, ViewStyle } from "react-native";
import { theme } from "@/src/constants/theme";

interface ChipProps {
  children: ReactNode;
  icon?: ReactNode;
  isActive?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export const Chip = ({
  children,
  icon,
  onPress,
  isActive = false,
  style,
}: ChipProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        isActive ? styles.containerActive : styles.containerInactive,
        pressed && styles.pressed,
        style,
      ]}
    >
      {/* Optional Icon Slot */}
      {icon && (
        <View
          style={[
            styles.iconWrapper,
            isActive ? styles.iconWrapperActive : styles.iconWrapperInactive,
          ]}
        >
          {icon}
        </View>
      )}

      {/* Content Slot */}
      <Text
        style={[
          styles.text,
          isActive ? styles.textActive : styles.textInactive,
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999, // Full pill shape
    paddingVertical: 6,
    paddingLeft: 6,
    paddingRight: 16,
    borderWidth: 1,
    gap: 8,
  },
  containerActive: {
    backgroundColor: theme.colors.slate100,
    borderColor: theme.colors.slate800,
    // Shadow
    shadowColor: theme.colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  containerInactive: {
    backgroundColor: theme.colors.shadowColor,
    borderColor: theme.colors.slate200,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  // Icon Wrapper Styles
  iconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  iconWrapperActive: {
    backgroundColor: theme.colors.slate700,
    borderColor: theme.colors.slate600,
  },
  iconWrapperInactive: {
    backgroundColor: theme.colors.slate100,
    borderColor: theme.colors.border,
  },
  // Text Styles
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
  textActive: {
    color: "white",
  },
  textInactive: {
    color: theme.colors.slate600,
  },
});
