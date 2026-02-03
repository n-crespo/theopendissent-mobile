import React from "react";
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Text,
  Image,
} from "react-native";
import { PostItem } from "./PostItem";
import { Post } from "../../types";
import { theme } from "@/src/constants/theme";

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
  const renderHeader = () => {
    return (
      <View>
        {/* --- NEW: The Logo lives here now --- */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../assets/images/Flat-Logo.png")}
            style={styles.logo}
            resizeMode="center"
          />
        </View>

        {/* Pinned Post Logic */}
        {highlightedPost && (
          <View style={styles.pinnedContainer}>
            <Text style={styles.pinnedLabel}>Shared Discussion</Text>
            <PostItem post={highlightedPost} />
            <View style={styles.divider} />
          </View>
        )}
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
          <ActivityIndicator size="small" color={theme.colors.textTertiary} />
          <Text style={styles.loadingText}>Loading older posts...</Text>
        </View>
      );
    }
    return <View style={{ height: 40 }} />; // Spacer
  };

  return (
    <FlatList
      // ... keep existing props ...
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
    color: theme.colors.textSecondary,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 12,
  },
  footer: {
    paddingVertical: 24,
    alignItems: "center",
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    fontStyle: "italic",
  },
  loadingText: {
    fontSize: 12,
    color: theme.colors.textTertiary,
  },
  logoContainer: {
    alignItems: "center",
    paddingBottom: 16,
    paddingTop: 40,
  },
  logo: {
    height: 50,
  },
});
