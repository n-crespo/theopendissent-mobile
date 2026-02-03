import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { Post } from "../types";
import { deletePost, updatePost } from "../lib/firebase";
import { interactionStore } from "../lib/interactionStore";
import { useAuth } from "../context/AuthContext";

export const usePostActions = (post: Post) => {
  const { user } = useAuth();
  const router = useRouter();
  const uid = user?.uid;

  // Initialize from Store if available, else props (Optimistic UI)
  const [localInteractions, setLocalInteractions] = useState(() =>
    interactionStore.get(post.id).agreed
      ? interactionStore.get(post.id)
      : post.userInteractions || { agreed: {}, dissented: {} },
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.postContent);
  const [isSaving, setIsSaving] = useState(false);

  // Sync Server Props -> Store
  useEffect(() => {
    if (post.userInteractions) {
      interactionStore.syncFromServer(post.id, post.userInteractions, uid);
    }
  }, [post.id, post.userInteractions, uid]);

  // Sync Store -> Local State
  useEffect(() => {
    return interactionStore.subscribe(post.id, (newData) => {
      setLocalInteractions(newData);
    });
  }, [post.id]);

  // Derived state
  const interactionState = {
    agreed: !!(uid && localInteractions?.agreed?.[uid]),
    dissented: !!(uid && localInteractions?.dissented?.[uid]),
  };

  const dynamicMetrics = {
    agreedCount: Object.keys(localInteractions?.agreed || {}).length,
    dissentedCount: Object.keys(localInteractions?.dissented || {}).length,
    replyCount: post.replyCount || 0,
  };

  // --- HANDLERS (Adapted for React Native) ---

  const handleInteraction = (type: "agreed" | "dissented") => {
    if (!uid) {
      router.push("/modal/signin");
      return;
    }
    interactionStore.toggle(post.id, uid, type, post.parentPostId);
  };

  const handleCancel = () => {
    setEditContent(post.postContent);
    setIsEditing(false);
  };

  const handleEditSave = async () => {
    const trimmed = editContent.trim();
    if (!trimmed || trimmed === post.postContent) {
      handleCancel();
      return;
    }

    setIsSaving(true);
    try {
      await updatePost(
        post.id,
        { postContent: trimmed, editedAt: Date.now() },
        post.parentPostId,
      );
      setIsEditing(false);
    } catch (err) {
      console.error("failed to save changes:", err);
      Alert.alert("Error", "Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTrigger = () => {
    if (!uid) {
      router.push("/modal/signin");
      return;
    }

    // Native Alert instead of custom modal
    Alert.alert(
      "Delete Post?",
      "Are you sure you want to delete this? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePost(post.id, uid, post.parentPostId);
            } catch (error) {
              console.error("failed to delete:", error);
              Alert.alert("Error", "Could not delete post.");
            }
          },
        },
      ],
    );
  };

  return {
    uid,
    localMetrics: dynamicMetrics,
    isEditing,
    setIsEditing,
    editContent,
    setEditContent,
    isSaving,
    interactionState,
    handleInteraction,
    handleCancel,
    handleEditSave,
    handleDeleteTrigger,
  };
};
