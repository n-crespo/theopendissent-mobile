import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../src/constants/theme";
import { PostItem } from "../../src/components/feed/PostItem";
import { Post } from "../../src/types";
// Import the real data functions
import { subscribeToPost, subscribeToReplies } from "../../src/lib/firebase";

export default function DiscussionPage() {
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState<Post | null>(null);
  const [replies, setReplies] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Subscribe to the Main Post (Title/Content)
  useEffect(() => {
    // Safety check for ID
    if (typeof id !== "string") return;

    const unsubscribePost = subscribeToPost(id, (updatedPost) => {
      if (updatedPost) {
        setPost(updatedPost);
        // Once we have the main post, we can stop the full-screen spinner
        setLoading(false);
      } else {
        // Handle case where post is deleted or doesn't exist
        setPost(null);
        setLoading(false);
      }
    });

    return () => unsubscribePost();
  }, [id]);

  // 2. Subscribe to Replies
  useEffect(() => {
    if (typeof id !== "string") return;

    const unsubscribeReplies = subscribeToReplies(id, (updatedReplies) => {
      setReplies(updatedReplies);
    });

    return () => unsubscribeReplies();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.logoBlue} />
      </View>
    );
  }

  // Handle case where post wasn't found (after loading)
  if (!post) {
    return (
      <View style={styles.center}>
        <Text style={{ color: theme.colors.textSecondary }}>
          Post not found or deleted.
        </Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: theme.colors.logoBlue }}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={100}
      >
        <ScrollView contentContainerStyle={styles.content}>
          {/* 1. The Main Post */}
          <PostItem post={post} />

          {/* 2. Separator */}
          <View style={styles.separatorContainer}>
            <Text style={styles.separatorText}>REPLIES</Text>
            <View style={styles.separatorLine} />
          </View>

          {/* 3. Replies List */}
          <View style={styles.repliesContainer}>
            {replies.map((reply) => (
              <View key={reply.id} style={styles.replyWrapper}>
                {/* Re-using PostItem for replies */}
                <PostItem post={reply} />
              </View>
            ))}

            {replies.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  No replies yet. Be the first!
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* 4. Input Area (Sticky Bottom) */}
        <View style={styles.inputBar}>
          <View style={styles.inputPlaceholder}>
            <Text style={styles.inputText}>Add your thought...</Text>
          </View>
          <View style={styles.sendButton}>
            <Ionicons name="arrow-up" size={20} color="white" />
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7", // iOS Grouped Background
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: "#F2F2F7",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  closeButton: {
    position: "absolute",
    right: 16,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    paddingHorizontal: 4,
  },
  separatorText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#8E8E93",
    letterSpacing: 1,
    marginRight: 12,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E5EA",
  },
  repliesContainer: {
    gap: 12,
  },
  replyWrapper: {},
  emptyState: {
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderStyle: "dashed",
    borderRadius: 12,
  },
  emptyText: {
    color: "#8E8E93",
    fontStyle: "italic",
  },
  // Input Styles
  inputBar: {
    backgroundColor: "white",
    padding: 12,
    paddingBottom: 30, // Space for home indicator
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  inputPlaceholder: {
    flex: 1,
    height: 40,
    backgroundColor: "#F2F2F7",
    borderRadius: 20,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  inputText: {
    color: "#8E8E93",
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.logoBlue,
    alignItems: "center",
    justifyContent: "center",
  },
});
