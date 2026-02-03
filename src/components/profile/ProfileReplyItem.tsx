import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ReplyItem } from "../feed/ReplyItem";
import { Post } from "@/src/types";
import { theme } from "@/src/constants/theme";

// Extend Post type locally to include the injected parentPost
type ReplyWithParent = Post & { parentPost?: Post };

export const ProfileReplyItem = ({ reply }: { reply: ReplyWithParent }) => {
  const router = useRouter();

  const handleOpenContext = () => {
    if (reply.parentPost) {
      router.push({
        pathname: "/replies/[id]",
        params: { id: reply.parentPost.id },
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Context Header */}
      {reply.parentPost ? (
        <Pressable
          onPress={handleOpenContext}
          style={({ pressed }) => [
            styles.contextHeader,
            pressed && styles.contextHeaderPressed,
          ]}
        >
          <Ionicons
            name="arrow-forward-outline"
            size={12}
            color={theme.colors.textTertiary}
            style={styles.icon}
          />
          <Text style={styles.labelText}>Replying to:</Text>
          <Text
            style={styles.parentContent}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {reply.parentPost.postContent}
          </Text>
        </Pressable>
      ) : (
        <View style={styles.contextHeader}>
          <Text style={styles.deletedText}>Parent post deleted</Text>
        </View>
      )}

      {/* The Actual Reply */}
      <ReplyItem reply={reply} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column", // FIX: Changed 'col' to 'column'
    gap: 4,
    marginBottom: 12,
  },
  contextHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
    marginBottom: 2,
    gap: 6,
  },
  contextHeaderPressed: {
    opacity: 0.7,
  },
  icon: {
    transform: [{ rotate: "90deg" }],
  },
  labelText: {
    fontSize: 12,
    color: theme.colors.slate400,
  },
  parentContent: {
    fontSize: 12,
    fontWeight: "500",
    color: theme.colors.slate500,
    flex: 1,
  },
  deletedText: {
    fontSize: 12,
    fontStyle: "italic",
    color: theme.colors.slate300,
    paddingLeft: 16,
  },
});
