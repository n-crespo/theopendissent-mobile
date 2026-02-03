import React from "react";
import {
  ActionSheetIOS,
  Platform,
  Alert,
  Pressable,
  StyleSheet,
  // View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Post } from "@/src/types";

// Hooks
import { useShare } from "../../hooks/useShare";
import { useReport } from "../../hooks/useReport";

interface ActionMenuProps {
  post: Post;
  isOwner: boolean;
  currentUserId?: string;
  onEdit: () => void;
  onDelete: () => void;
  // We expose the trigger function so the parent (PostItem) can call it on LongPress
  triggerRef?: React.MutableRefObject<(() => void) | null>;
}

export const ActionMenu = ({
  post,
  isOwner,
  currentUserId,
  onEdit,
  onDelete,
  triggerRef,
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

  // Assign this function to the ref so the parent can call it
  if (triggerRef) {
    triggerRef.current = handlePress;
  }

  const showActionSheetIOS = () => {
    const options = ["Cancel", "Share"];
    const destructiveButtonIndex = [];

    if (isOwner) {
      options.push("Edit Post");
      options.push("Delete Post");
      destructiveButtonIndex.push(options.length - 1); // Delete is last
    } else if (currentUserId) {
      options.push("Report");
      destructiveButtonIndex.push(options.length - 1);
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
            setTimeout(onEdit, 100);
            break;
          case "Delete Post":
            setTimeout(onDelete, 100);
            break;
          case "Report":
            if (currentUserId) reportPost(post.id, currentUserId);
            break;
        }
      },
    );
  };

  const showAndroidAlert = () => {
    const buttons: any[] = [
      { text: "Cancel", style: "cancel" },
      { text: "Share", onPress: () => sharePost(post) },
    ];
    if (isOwner) {
      buttons.push({ text: "Edit", onPress: onEdit });
      buttons.push({ text: "Delete", style: "destructive", onPress: onDelete });
    } else if (currentUserId) {
      buttons.push({
        text: "Report",
        style: "destructive",
        onPress: () => reportPost(post.id, currentUserId!),
      });
    }
    Alert.alert("Options", undefined, buttons);
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
