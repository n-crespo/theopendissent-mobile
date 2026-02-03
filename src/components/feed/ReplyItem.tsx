import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Post } from "@/src/types";
import { timeAgo } from "@/src/utils";
import { theme } from "@/src/constants/theme";
import { useAuth } from "@/src/context/AuthContext";

export const ReplyItem = ({
  reply,
  highlighted,
}: {
  reply: Post;
  highlighted?: boolean;
}) => {
  const { user } = useAuth();

  const { userId, timestamp, postContent, userInteractionType, editedAt } =
    reply;

  // Logic checks
  const isOwner = user?.uid === userId;
  const isAgree = userInteractionType === "agreed";

  // Dynamic Styles based on Stance
  const stanceColor = isAgree ? theme.colors.success : theme.colors.danger;
  const stanceBg = isAgree ? "#DCFCE7" : "#FEE2E2"; // Light Green vs Light Red
  const stanceIcon = isAgree ? "checkbox" : "close-circle"; // Ionicons names
  const stanceLabel = isAgree ? "Agreed" : "Dissented";

  const formattedTime = timeAgo(
    new Date(typeof timestamp === "number" ? timestamp : 0),
  );

  const shortenedUid = userId ? userId.substring(0, 10) + "..." : "Anonymous";

  return (
    <View
      style={[styles.container, highlighted && styles.highlightedContainer]}
    >
      {/* --- HEADER --- */}
      <View style={styles.header}>
        {/* Stance Icon Box */}
        <View style={[styles.iconBox, { backgroundColor: stanceBg }]}>
          <Ionicons name={stanceIcon} size={16} color={stanceColor} />
        </View>

        {/* User Info Column */}
        <View style={styles.metaColumn}>
          <Text style={styles.username}>{isOwner ? "You" : shortenedUid}</Text>

          <View style={styles.metaRow}>
            <Text style={[styles.stanceText, { color: stanceColor }]}>
              {stanceLabel}
            </Text>
            <Text style={styles.dotSeparator}>·</Text>
            <Text style={styles.timestamp}>{formattedTime}</Text>

            {editedAt && (
              <>
                <Text style={styles.dotSeparator}>·</Text>
                <Text style={styles.editedText}>edited</Text>
              </>
            )}
          </View>
        </View>
      </View>

      {/* --- CONTENT --- */}
      <View style={styles.contentWrapper}>
        <Text style={styles.content}>{postContent}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 8,
    // Shadow for iOS/Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  highlightedContainer: {
    borderColor: theme.colors.logoBlue,
    backgroundColor: theme.colors.slate50,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    gap: 10,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  metaColumn: {
    justifyContent: "center",
    paddingTop: 2, // Align text visually with icon box
  },
  username: {
    fontSize: 14,
    fontWeight: "700", // 'font-semibold'
    color: theme.colors.slate900,
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  stanceText: {
    fontSize: 12,
    fontWeight: "600",
  },
  dotSeparator: {
    marginHorizontal: 4,
    color: theme.colors.slate400,
    fontSize: 12,
  },
  timestamp: {
    color: theme.colors.textTertiary,
    fontSize: 12,
    fontWeight: "500",
  },
  editedText: {
    color: theme.colors.textTertiary,
    fontSize: 12,
    fontStyle: "italic",
  },
  contentWrapper: {
    paddingLeft: 42, // Indent content to align with text above (32px icon + 10px gap)
  },
  content: {
    fontSize: 14,
    color: theme.colors.slate800,
    lineHeight: 20,
  },
});
