import React, { memo } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Post } from "@/src/types";
import { timeAgo, formatCompactNumber } from "@/src/utils";
import { theme } from "@/src/constants/theme";
// Removed unused useAuth import
import { usePostActions } from "@/src/hooks/usePostActions";
import { ActionMenu } from "../layout/ActionMenu";

interface PostItemProps {
  post: Post;
  disableClick?: boolean;
  onStanceChange?: (stance: "agreed" | "dissented" | null) => void;
}

// 1. Define component as a named function first (Fixes display-name error)
const PostItemComponent = ({
  post,
  disableClick,
  onStanceChange,
}: PostItemProps) => {
  const router = useRouter();

  // 2. Removed unused 'user' from useAuth.
  // We use 'uid' from the hook instead.
  const {
    uid,
    localMetrics,
    isEditing,
    setIsEditing,
    editContent,
    setEditContent,
    isSaving,
    interactionState,
    handleInteraction,
    handleEditSave,
    handleCancel,
    handleDeleteTrigger,
  } = usePostActions(post);

  const isOwner = uid === post.userId;
  const MAX_CHARS = 600;
  const charsLeft = MAX_CHARS - editContent.length;
  const isNearLimit = charsLeft < 50;

  const activeStance = interactionState.dissented
    ? "dissented"
    : interactionState.agreed
      ? "agreed"
      : null;

  const onVote = (type: "agreed" | "dissented") => {
    if (onStanceChange) {
      const nextStance = activeStance === type ? null : type;
      onStanceChange(nextStance);
    }
    handleInteraction(type);
  };

  const onOpenReplies = () => {
    if (disableClick || isEditing) return;

    router.push({
      pathname: "/replies/[id]",
      params: { id: post.id },
    });
  };

  const formattedTime =
    typeof post.timestamp === "number" ? timeAgo(new Date(post.timestamp)) : "";

  const formattedEditTime = post.editedAt
    ? timeAgo(new Date(post.editedAt))
    : null;

  if (!post || !post.userId) return null;

  return (
    <View style={[styles.card, post.parentPostId && styles.replyCard]}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={16} color="#64748B" />
          </View>
          <View>
            <Text style={styles.userId}>
              {isOwner ? "You" : post.userId.substring(0, 10) + "..."}
            </Text>
            <View style={styles.metaRow}>
              <Text style={styles.timestamp}>{formattedTime}</Text>
              {formattedEditTime && (
                <>
                  <Text style={styles.dotSeparator}>·</Text>
                  <Text style={styles.timestamp}>
                    edited {formattedEditTime}
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>

        <ActionMenu
          post={post}
          isOwner={isOwner}
          currentUserId={uid}
          onEdit={() => setIsEditing(true)}
          onDelete={handleDeleteTrigger}
        />
      </View>

      {/* CONTENT (VIEW vs EDIT) */}
      {isEditing ? (
        <View style={styles.editContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.editInput}
              multiline
              value={editContent}
              onChangeText={setEditContent}
              maxLength={MAX_CHARS}
              autoFocus
            />
            <Text
              style={[
                styles.charCount,
                isNearLimit ? styles.textRed : styles.textGray,
              ]}
            >
              {charsLeft}
            </Text>
          </View>

          <View style={styles.editButtons}>
            <Pressable
              onPress={handleEditSave}
              style={[
                styles.editBtn,
                styles.saveBtn,
                isSaving && { opacity: 0.7 },
              ]}
              disabled={isSaving || editContent.trim().length === 0}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.saveBtnText}>Save</Text>
              )}
            </Pressable>
            <Pressable
              onPress={handleCancel}
              style={[styles.editBtn, styles.cancelBtn]}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable onPress={onOpenReplies} disabled={disableClick}>
          <Text style={styles.content}>{post.postContent}</Text>
        </Pressable>
      )}

      {/* FOOTER */}
      <View style={styles.footer}>
        <View style={styles.voteCapsule}>
          <Pressable
            style={[
              styles.voteBtn,
              activeStance === "agreed" && styles.voteBtnAgreed,
            ]}
            onPress={() => onVote("agreed")}
          >
            <Ionicons
              name="checkmark"
              size={14}
              color={activeStance === "agreed" ? "white" : "#94A3B8"}
            />
            <Text
              style={[
                styles.voteText,
                activeStance === "agreed"
                  ? { color: "white" }
                  : { color: "#64748B" },
              ]}
            >
              {formatCompactNumber(localMetrics.agreedCount)}
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.voteBtn,
              activeStance === "dissented" && styles.voteBtnDissented,
            ]}
            onPress={() => onVote("dissented")}
          >
            <Ionicons
              name="close"
              size={14}
              color={activeStance === "dissented" ? "white" : "#94A3B8"}
            />
            <Text
              style={[
                styles.voteText,
                activeStance === "dissented"
                  ? { color: "white" }
                  : { color: "#64748B" },
              ]}
            >
              {formatCompactNumber(localMetrics.dissentedCount)}
            </Text>
          </Pressable>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.replyButton,
            pressed && { opacity: 0.6 },
          ]}
          onPress={onOpenReplies}
          disabled={disableClick}
        >
          <Ionicons
            name={disableClick ? "chatbox" : "chatbox-outline"}
            size={16}
            color={disableClick ? theme.colors.logoBlue : "#94A3B8"}
          />
          <Text
            style={[
              styles.replyText,
              disableClick && { color: theme.colors.logoBlue },
            ]}
          >
            {formatCompactNumber(localMetrics.replyCount)}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

// 3. Export the Memoized component
export const PostItem = memo(PostItemComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  replyCard: {
    marginLeft: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#E2E8F0",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    gap: 10,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    backgroundColor: "#F1F5F9",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  userId: {
    color: "#0F172A",
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  timestamp: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "500",
  },
  dotSeparator: {
    marginHorizontal: 4,
    color: "#94A3B8",
    fontSize: 12,
  },
  content: {
    fontSize: 15,
    color: "#1E293B",
    lineHeight: 22,
    marginBottom: 16,
  },
  editContainer: {
    marginBottom: 12,
  },
  inputWrapper: {
    position: "relative",
  },
  editInput: {
    borderWidth: 1,
    borderColor: theme.colors.logoBlue,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: "top",
    color: "#1E293B",
    backgroundColor: "#F8FAFC",
  },
  charCount: {
    position: "absolute",
    bottom: -20,
    right: 2,
    fontSize: 10,
    fontWeight: "bold",
  },
  textRed: { color: theme.colors.danger },
  textGray: { color: "#CBD5E1" },
  editButtons: {
    flexDirection: "row",
    gap: 8,
    marginTop: 24,
  },
  editBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtn: {
    backgroundColor: theme.colors.logoBlue,
    minWidth: 70,
  },
  cancelBtn: {
    backgroundColor: "#F1F5F9",
  },
  saveBtnText: {
    color: "white",
    fontWeight: "600",
    fontSize: 13,
  },
  cancelBtnText: {
    color: "#64748B",
    fontWeight: "600",
    fontSize: 13,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  voteCapsule: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderRadius: 999,
    padding: 2,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    gap: 2,
  },
  voteBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 6,
  },
  voteBtnAgreed: {
    backgroundColor: theme.colors.success,
  },
  voteBtnDissented: {
    backgroundColor: theme.colors.danger,
  },
  voteText: {
    fontSize: 12,
    fontWeight: "700",
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
    color: "#94A3B8",
  },
});
