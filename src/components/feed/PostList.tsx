import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { usePosts } from "../../hooks/usePosts";
import { useFeedSort } from "../../context/FeedSortContext";
import { getPostById } from "../../lib/firebase";
import { Post } from "../../types";
import { PostListView } from "./PostListView";

export const PostList = () => {
  const { sortType } = useFeedSort();
  // sortType is now guaranteed to be "random" | "newest"
  const { posts, loading, loadMore, currentLimit } = usePosts(20, sortType);
  const [injectedPost, setInjectedPost] = useState<Post | null>(null);

  const params = useLocalSearchParams<{ s: string }>();

  useEffect(() => {
    if (params.s) {
      const fetchAndInject = async () => {
        const target = await getPostById(params.s);
        if (!target) return;

        if (target.parentPostId) {
          const parent = await getPostById(target.parentPostId);
          if (parent) setInjectedPost(parent);
        } else {
          setInjectedPost(target);
        }
      };
      fetchAndInject();
    }
  }, [params.s]);

  const filteredPosts = injectedPost
    ? posts.filter((p) => p.id !== injectedPost.id)
    : posts;

  const hasMore = posts.length >= currentLimit;

  return (
    <View style={styles.container}>
      <PostListView
        posts={filteredPosts}
        highlightedPost={injectedPost}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={loadMore}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
