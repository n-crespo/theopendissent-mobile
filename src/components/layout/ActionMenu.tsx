import React from "react";
import {
  ActionSheetIOS,
  Platform,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Post } from "@/src/types";

import { useShare } from "../../hooks/useShare";
import { useReport } from "../../hooks/useReport";

interface ActionMenuProps {
  post: Post;
  isOwner: boolean;
  currentUserId?: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const ActionMenu = ({
  post,
  isOwner,
  currentUserId,
  onEdit,
  onDelete,
}: ActionMenuProps) => {
  const { sharePost } = useShare();
  const { reportPost } = useReport();

  const handlePress = () => {
    if (Platform.OS === "ios") {
      showActionSheetIOS();
    } else {
      showAndroidAlert();
    }
  };

  // 1. iOS Native Action Sheet
  const showActionSheetIOS = () => {
    const options = ["Cancel", "Share"];
    const destructiveButtonIndex = []; // Track which index is red

    // Build dynamic options
    if (isOwner) {
      options.push("Edit Post");
      options.push("Delete Post");
      destructiveButtonIndex.push(options.length - 1); // Delete is last
    } else if (currentUserId) {
      options.push("Report");
      destructiveButtonIndex.push(options.length - 1); // Report is red
    }

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 0,
        destructiveButtonIndex: destructiveButtonIndex[0],
        userInterfaceStyle: "light",
      },
      (buttonIndex) => {
        const selected = options[buttonIndex];

        switch (selected) {
          case "Share":
            sharePost(post);
            break;
          case "Edit Post":
            // Slight delay ensures the action sheet closes smoothly before edit mode starts
            setTimeout(onEdit, 100);
            break;
          case "Delete Post":
            setTimeout(onDelete, 100);
            break;
          case "Report":
            reportPost(post.id, currentUserId);
            break;
        }
      },
    );
  };

  // 2. Android Fallback (Native Alert Menu)
  const showAndroidAlert = () => {
    const buttons: any[] = [
      { text: "Cancel", style: "cancel" },
      { text: "Share", onPress: () => sharePost(post) },
    ];

    if (isOwner) {
      buttons.push({ text: "Edit", onPress: onEdit });
      buttons.push({
        text: "Delete",
        style: "destructive",
        onPress: onDelete,
      });
    } else if (currentUserId) {
      buttons.push({
        text: "Report",
        style: "destructive",
        onPress: () => reportPost(post.id, currentUserId),
      });
    }

    Alert.alert("Post Options", undefined, buttons);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.trigger,
        pressed && styles.triggerPressed,
      ]}
      hitSlop={10}
    >
      <Ionicons name="ellipsis-horizontal" size={18} color="#94A3B8" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  trigger: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  triggerPressed: {
    backgroundColor: "#F1F5F9",
  },
});
