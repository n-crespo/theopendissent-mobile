import { StyleSheet, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
import { FeedSortProvider } from "../../src/context/FeedSortContext";
import { PostList } from "../../src/components/feed/PostList";
import { theme } from "../../src/constants/theme";

export default function FeedTab() {
  return (
    // We remove edges={['top']} so the content flows BEHIND the status bar (Native feel)
    <View style={styles.container}>
      <FeedSortProvider>
        <PostList />
      </FeedSortProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
