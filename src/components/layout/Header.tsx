import React from "react";
import { StyleSheet, View, Text, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { theme } from "@/src/constants/theme";
import { useModal } from "../../context/ModalContext";

export const Header = () => {
  const { openModal } = useModal();
  const { user, loading } = useAuth();

  const handleOpenAbout = () => {
    openModal("about");
  };

  const handleSignIn = () => {
    alert("Sign In Modal would open here");
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.contentContainer}>
        {/* LEFT: Info Button */}
        <View style={styles.leftSection}>
          <Pressable
            style={({ pressed }) => [
              styles.pillButton,
              pressed && styles.pressed,
            ]}
            onPress={handleOpenAbout}
          >
            <Text style={styles.questionMark}>?</Text>
          </Pressable>
        </View>

        {/* CENTER: Main Logo */}
        <View style={styles.centerSection}>
          <Image
            source={require("../../../assets/images/Flat-Logo.png")}
            resizeMode="contain"
            style={styles.logo}
          />
        </View>

        {/* RIGHT: Auth Section */}
        <View style={styles.rightSection}>
          {loading ? (
            <Ionicons
              name="ellipsis-horizontal"
              size={20}
              color={theme.colors.textSecondary}
            />
          ) : user ? (
            <Pressable style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>
                {user.email ? user.email[0].toUpperCase() : "U"}
              </Text>
            </Pressable>
          ) : (
            <Pressable
              style={({ pressed }) => [
                styles.pillButton,
                pressed && styles.pressed,
              ]}
              onPress={handleSignIn}
            >
              <Text style={styles.signInText}>Sign In</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: 5, // tweak this maybe
    zIndex: 50,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: 600,
    width: "100%",
    alignSelf: "center",
  },
  leftSection: {
    width: 60,
    alignItems: "flex-start",
  },
  centerSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: "100%",
    height: 40,
  },
  rightSection: {
    width: 60,
    alignItems: "flex-end",
  },
  logoText: {
    fontSize: 16,
    fontWeight: "900",
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  pillButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface, // Clean white bg for buttons
    flexDirection: "row",
    alignItems: "center",
  },
  pressed: {
    backgroundColor: theme.colors.border, // Darken slightly on press
    transform: [{ scale: 0.95 }],
  },
  questionMark: {
    fontSize: 15,
    fontWeight: "bold",
    color: theme.colors.textSecondary,
  },
  signInText: {
    fontSize: 12,
    fontWeight: "bold",
    color: theme.colors.textSecondary,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.logoBlue, // Use brand color
    alignItems: "center",
    justifyContent: "center",
  },
  userAvatarText: {
    color: theme.colors.surface,
    fontWeight: "bold",
    fontSize: 14,
  },
});
