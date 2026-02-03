import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FeedSortProvider } from "../src/context/FeedSortContext";
import { PostList } from "../src/components/feed/PostList";
import { Header } from "../src/components/layout/Header";
import { theme } from "../src/constants/theme";

export default function Page() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <FeedSortProvider>
        <View style={styles.container}>
          <Header />

          {/* feed scrolls underneath the header */}
          <View style={styles.feedContainer}>
            <PostList />
          </View>
        </View>
      </FeedSortProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  feedContainer: {
    flex: 1, // This forces the list to take all remaining space
  },
});
