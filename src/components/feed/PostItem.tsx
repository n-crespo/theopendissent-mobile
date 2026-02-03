import { StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Post } from "@/src/types";
import { timeAgo, formatCompactNumber } from "@/src/utils";
import { theme } from "@/src/constants/theme";
import { useAuth } from "@/src/context/AuthContext";

interface PostItemProps {
  post: Post;
  onStanceChange?: (stance: "agreed" | "dissented") => void;
}

export const PostItem = ({ post, onStanceChange }: PostItemProps) => {
  const router = useRouter();
  const { user } = useAuth();

  if (!post) return null;

  // --- INTERACTION HANDLER ---
  const handleInteraction = (action: () => void) => {
    if (!user) {
      router.push("/profile");
      return;
    }
    action();
  };

  const onVote = (type: "agree" | "disagree") => {
    handleInteraction(() => {
      // Placeholder for your actual voting logic
      console.log(`User voted: ${type}`);

      // 2. Call the callback if it exists (Unlocks the input box)
      if (onStanceChange) {
        onStanceChange(type === "agree" ? "agreed" : "dissented");
      }
    });
  };

  const onOpenDiscussion = () => {
    router.push(`/discussion/${post.id}`);
  };

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
      {/* Wrapped in Pressable so tapping text opens discussion */}
      <Pressable onPress={onOpenDiscussion}>
        <Text style={styles.content}>{post.postContent}</Text>
      </Pressable>

      {/* --- FOOTER (ACTIONS) --- */}
      <View style={styles.footer}>
        {/* Vote Pills */}
        <View style={styles.pillContainer}>
          {/* Agreed Pill */}
          <Pressable
            style={({ pressed }) => [
              styles.pill,
              pressed && styles.pressedPill,
            ]}
            onPress={() => onVote("agree")}
          >
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
          <Pressable
            style={({ pressed }) => [
              styles.pill,
              pressed && styles.pressedPill,
            ]}
            onPress={() => onVote("disagree")}
          >
            <View style={[styles.iconCircle, styles.bgRed]}>
              <Ionicons name="close" size={10} color={theme.colors.surface} />
            </View>
            <Text style={styles.pillText}>
              {formatCompactNumber(dissentedCount)}
            </Text>
          </Pressable>
        </View>

        {/* Reply Button - OPENS DISCUSSION DIRECTLY */}
        <Pressable
          style={({ pressed }) => [
            styles.replyButton,
            pressed && styles.pressedIcon,
          ]}
          onPress={onOpenDiscussion}
        >
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
    backgroundColor: theme.colors.background,
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
    backgroundColor: theme.colors.border,
    marginHorizontal: 6,
  },
  timestamp: {
    color: theme.colors.textSecondary,
    fontSize: 13,
  },
  content: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.background,
  },
  pillContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.full,
    padding: 3,
    borderWidth: 1,
    borderColor: theme.colors.background,
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
  pressedPill: {
    backgroundColor: theme.colors.border,
  },
  pressedIcon: {
    opacity: 0.6,
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
