import { useCallback } from "react";
import { Share, Platform, Alert } from "react-native";
import { Post } from "../types";

// TODO: Replace with your production website URL or Deep Link Scheme
const BASE_URL = "https://theopendissent.com";

export const useShare = () => {
  const sharePost = useCallback(async (post: Post) => {
    try {
      // 1. Construct the URL manually
      // We don't use URLSearchParams polyfills to keep it lightweight/safe
      const path = "/share";
      const sParam = `?s=${post.id}`;
      const pParam = post.parentPostId ? `&p=${post.parentPostId}` : "";

      const shareUrl = `${BASE_URL}${path}${sParam}${pParam}`;
      const shareText = `Check out this discussion on TheOpenDissent!`;

      // 2. Native Share
      const result = await Share.share(
        {
          title: "The Open Dissent",
          message:
            Platform.OS === "android"
              ? `${shareText} ${shareUrl}` // Android often needs URL in message body
              : shareText,
          url: shareUrl, // iOS uses this for the metadata/preview
        },
        {
          // Android specific settings
          dialogTitle: "Share this post",
        },
      );

      // 3. Optional: Handle specific outcomes (usually not needed)
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Shared via activity:", result.activityType);
        } else {
          console.log("Shared successfully");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dismissed");
      }
    } catch (error) {
      console.error("Share failed:", error);
      Alert.alert("Error", "Unable to open share menu.");
    }
  }, []);

  return { sharePost };
};
