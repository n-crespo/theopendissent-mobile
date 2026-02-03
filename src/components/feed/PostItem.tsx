import { StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Post } from "@/src/types";
import { timeAgo, formatCompactNumber } from "@/src/utils";
import { theme } from "@/src/constants/theme";

export const PostItem = ({ post }: { post: Post }) => {
  if (!post) return null;

  // Safe checks for counts
  const agreedCount = post.userInteractions?.agreed
    ? Object.keys(post.userInteractions.agreed).length
    : 0;

  const dissentedCount = post.userInteractions?.dissented
    ? Object.keys(post.userInteractions.dissented).length
    : 0;

  return (
    <View style={styles.card}>
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons
            name="person"
            size={16}
            color={theme.colors.textSecondary}
          />
        </View>

        <View style={styles.metaContainer}>
          <Text style={styles.userId}>
            {post.userId ? post.userId.substring(0, 8) + "..." : "Anonymous"}
          </Text>
          <View style={styles.dotSeparator} />
          <Text style={styles.timestamp}>
            {typeof post.timestamp === "number"
              ? timeAgo(new Date(post.timestamp))
              : ""}
          </Text>
        </View>
      </View>

      {/* --- CONTENT --- */}
      <Text style={styles.content}>{post.postContent}</Text>

      {/* --- FOOTER (ACTIONS) --- */}
      <View style={styles.footer}>
        {/* Vote Pills */}
        <View style={styles.pillContainer}>
          {/* Agreed Pill */}
          <Pressable style={styles.pill}>
            <View style={[styles.iconCircle, styles.bgGreen]}>
              <Ionicons
                name="checkmark"
                size={10}
                color={theme.colors.surface}
              />
            </View>
            <Text style={styles.pillText}>
              {formatCompactNumber(agreedCount)}
            </Text>
          </Pressable>

          {/* Dissented Pill */}
          <Pressable style={styles.pill}>
            <View style={[styles.iconCircle, styles.bgRed]}>
              <Ionicons name="close" size={10} color={theme.colors.surface} />
            </View>
            <Text style={styles.pillText}>
              {formatCompactNumber(dissentedCount)}
            </Text>
          </Pressable>
        </View>

        {/* Reply Button */}
        <Pressable style={styles.replyButton}>
          <Ionicons
            name="chatbubble-outline"
            size={16}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.replyText}>
            {formatCompactNumber(post.replyCount || 0)}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.s,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.default,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    backgroundColor: theme.colors.background, // Used as a subtle gray/offwhite
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userId: {
    color: theme.colors.text,
    fontWeight: "700",
    fontSize: 14,
  },
  dotSeparator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: theme.colors.border, // Using border color for the subtle dot
    marginHorizontal: 6,
  },
  timestamp: {
    color: theme.colors.textSecondary,
    fontSize: 13,
  },
  content: {
    fontSize: 16,
    color: theme.colors.text, // Using main text color
    lineHeight: 24,
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.background, // Using subtle background/border
  },
  pillContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.full,
    padding: 3,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 2,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.lg,
    gap: 6,
  },
  iconCircle: {
    width: 16,
    height: 16,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  bgGreen: {
    backgroundColor: theme.colors.success,
  },
  bgRed: {
    backgroundColor: theme.colors.danger,
  },
  pillText: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.textSecondary,
  },
  replyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 8,
  },
  replyText: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.textSecondary,
  },
});
