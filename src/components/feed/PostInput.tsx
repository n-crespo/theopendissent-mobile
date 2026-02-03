import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
  Keyboard,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { createPost } from "../../lib/firebase";
import { pinPostToTop } from "../../hooks/usePosts";
import { theme } from "../../constants/theme";
import { useRouter } from "expo-router";

interface PostInputProps {
  parentPostId: string;
  currentStance?: "agreed" | "dissented" | null;
  onPostCreated?: () => void;
}

export const PostInput = ({
  parentPostId,
  currentStance,
  onPostCreated,
}: PostInputProps) => {
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [height, setHeight] = useState(44); // Start at button height

  const { user } = useAuth();
  const router = useRouter();

  // Logic: User must select a stance to reply
  const hasNoStance = !currentStance;
  const MAX_CHARS = 600;
  const charsLeft = MAX_CHARS - content.length;
  const isNearLimit = charsLeft < 50;

  const handleSubmit = async () => {
    if (!user) {
      router.push("/modal/signin");
      return;
    }

    if (hasNoStance || isPosting) return;

    const trimmedContent = content.trim();
    if (!trimmedContent || trimmedContent.length > MAX_CHARS) return;

    // Confirm before posting
    Alert.alert("Post Reply", "Are you ready to post this?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Post",
        onPress: async () => {
          setIsPosting(true);
          try {
            const newKey = await createPost(
              user.uid,
              trimmedContent,
              parentPostId,
              currentStance,
            );

            if (newKey) {
              pinPostToTop(newKey);
            }

            // Reset UI
            setContent("");
            setHeight(44);
            Keyboard.dismiss();

            if (onPostCreated) onPostCreated();
          } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to submit reply.");
          } finally {
            setIsPosting(false);
          }
        },
      },
    ]);
  };

  const getPlaceholder = () => {
    if (hasNoStance) return "Choose a stance above to reply...";
    return currentStance === "agreed"
      ? "I agree because..."
      : "I dissent because...";
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* TEXT INPUT */}
        <View style={styles.inputWrapper}>
          <TextInput
            multiline
            value={content}
            onChangeText={setContent}
            placeholder={getPlaceholder()}
            placeholderTextColor={hasNoStance ? "#94A3B8" : "#64748B"}
            editable={!hasNoStance && !isPosting}
            maxLength={MAX_CHARS}
            // Auto-grow logic
            onContentSizeChange={(e) =>
              setHeight(
                Math.min(Math.max(44, e.nativeEvent.contentSize.height), 140),
              )
            }
            style={[
              styles.input,
              { height },
              hasNoStance && styles.disabledInput,
            ]}
          />

          {/* Character Count */}
          {!hasNoStance && content.length > 0 && (
            <Text
              style={[
                styles.charCount,
                isNearLimit ? styles.charCountRed : styles.charCountGray,
              ]}
            >
              {charsLeft}
            </Text>
          )}
        </View>

        {/* SUBMIT BUTTON */}
        <Pressable
          onPress={handleSubmit}
          disabled={hasNoStance || isPosting || content.trim().length === 0}
          style={({ pressed }) => [
            styles.button,
            (hasNoStance || content.trim().length === 0) &&
              styles.disabledButton,
            pressed && styles.pressedButton,
          ]}
        >
          {isPosting ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.buttonText}>Reply</Text>
          )}
        </Pressable>
      </View>

      {/* WARNING TEXT */}
      {hasNoStance && (
        <Text style={styles.warningText}>
          Select <Text style={styles.bold}>Agree</Text> or{" "}
          <Text style={styles.bold}>Dissent</Text> on the post to unlock
          replies.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end", // Align bottom so button stays with input
    gap: 8,
  },
  inputWrapper: {
    flex: 1,
    position: "relative",
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 15,
    color: "#0F172A",
    textAlignVertical: "top", // Essential for Android multiline
  },
  disabledInput: {
    backgroundColor: "#F1F5F9",
    borderColor: "#CBD5E1",
    color: "#94A3B8",
    fontStyle: "italic",
  },
  charCount: {
    position: "absolute",
    bottom: -18,
    right: 4,
    fontSize: 10,
    fontWeight: "700",
  },
  charCountGray: {
    color: "#CBD5E1",
  },
  charCountRed: {
    color: theme.colors.danger,
  },
  button: {
    height: 44,
    width: 70,
    backgroundColor: theme.colors.logoBlue,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  disabledButton: {
    backgroundColor: "#CBD5E1",
    shadowOpacity: 0,
  },
  pressedButton: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
  },
  warningText: {
    fontSize: 12,
    color: theme.colors.danger,
    marginLeft: 4,
  },
  bold: {
    fontWeight: "700",
  },
});
