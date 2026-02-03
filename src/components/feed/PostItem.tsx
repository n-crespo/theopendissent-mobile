import { StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Post } from "@/src/types";
import { timeAgo, formatCompactNumber } from "@/src/utils";

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
          <Ionicons name="person" size={16} color="#64748b" />
        </View>

        <View style={styles.metaContainer}>
          <Text style={styles.userId}>
            {post.userId ? post.userId.substring(0, 8) + "..." : "Anonymous"}
          </Text>
          <View style={styles.dotSeparator} />
          <Text style={styles.timestamp}>
            {/* Convert number timestamp to Date object for your util */}
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
              <Ionicons name="checkmark" size={10} color="white" />
            </View>
            <Text style={styles.pillText}>
              {formatCompactNumber(agreedCount)}
            </Text>
          </Pressable>

          {/* Dissented Pill */}
          <Pressable style={styles.pill}>
            <View style={[styles.iconCircle, styles.bgRed]}>
              <Ionicons name="close" size={10} color="white" />
            </View>
            <Text style={styles.pillText}>
              {formatCompactNumber(dissentedCount)}
            </Text>
          </Pressable>
        </View>

        {/* Reply Button */}
        <Pressable style={styles.replyButton}>
          <Ionicons name="chatbubble-outline" size={16} color="#94a3b8" />
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
    backgroundColor: "white",
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userId: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
  },
  dotSeparator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#cbd5e1",
    marginHorizontal: 6,
  },
  timestamp: {
    fontSize: 13,
    color: "#94a3b8",
  },
  content: {
    fontSize: 16,
    color: "#1e293b",
    lineHeight: 24,
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  pillContainer: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    borderRadius: 20,
    padding: 3,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    gap: 2,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 6,
  },
  iconCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  bgGreen: {
    backgroundColor: "#22c55e",
  },
  bgRed: {
    backgroundColor: "#ef4444",
  },
  pillText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
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
    color: "#94a3b8",
  },
});
