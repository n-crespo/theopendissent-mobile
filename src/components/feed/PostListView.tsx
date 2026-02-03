import React from "react";
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Text,
} from "react-native";
import { PostItem } from "./PostItem";
import { Post } from "../../types";

interface PostListViewProps {
  posts: Post[];
  highlightedPost?: Post | null;
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export const PostListView = ({
  posts,
  highlightedPost,
  loading,
  hasMore,
  onLoadMore,
}: PostListViewProps) => {
  // 1. Header Component: Renders the "Pinned" post at the top of the scrollable list
  const renderHeader = () => {
    if (!highlightedPost) return null;
    return (
      <View style={styles.pinnedContainer}>
        <Text style={styles.pinnedLabel}>Shared Discussion</Text>
        <PostItem post={highlightedPost} />
        <View style={styles.divider} />
      </View>
    );
  };

  // 2. Footer Component: Renders the loading spinner at the bottom
  const renderFooter = () => {
    if (!loading && !hasMore && posts.length > 0) {
      return (
        <View style={styles.footer}>
          <Text style={styles.footerText}>You&apos;ve reached the end!</Text>
        </View>
      );
    }
    if (loading) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="small" color="#94a3b8" />
          <Text style={styles.loadingText}>Loading older posts...</Text>
        </View>
      );
    }
    return <View style={{ height: 40 }} />; // Spacer
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PostItem post={item} />}
      // Native "Intersection Observer" replacement
      onEndReached={() => {
        if (hasMore && !loading) {
          onLoadMore();
        }
      }}
      onEndReachedThreshold={0.5} // Trigger when user is halfway down the last screen
      // Structure props
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      contentContainerStyle={styles.listContent}
      // Performance props
      removeClippedSubviews={true} // Unmounts items off-screen (huge performance boost)
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  pinnedContainer: {
    marginBottom: 16,
  },
  pinnedLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#64748b",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 12,
  },
  footer: {
    paddingVertical: 24,
    alignItems: "center",
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    color: "#94a3b8",
    fontStyle: "italic",
  },
  loadingText: {
    fontSize: 12,
    color: "#94a3b8",
  },
});
