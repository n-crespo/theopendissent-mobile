import React from "react";
import {
  Modal,
  StyleSheet,
  View,
  Text,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useModal, ModalType } from "../../context/ModalContext";
import { theme } from "../../constants/theme";
import { AboutModal } from "./AboutModal";

// --- TEMPORARY STUBS (So the app compiles without creating 10 files) ---
const StubModal = ({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) => (
  <View style={styles.stubContainer}>
    <Text style={styles.stubTitle}>{title}</Text>
    <Pressable style={styles.stubButton} onPress={onClose}>
      <Text style={styles.stubButtonText}>Close</Text>
    </Pressable>
  </View>
);
// ----------------------------------------------------------------------

export const GlobalModal = () => {
  const { modalStack, closeModal, activeModal, modalPayload } = useModal();

  // If stack is empty, don't render anything
  if (modalStack.length === 0) return null;

  return (
    <Modal
      transparent={true}
      visible={true} // Controlled by the return null above
      animationType="fade"
      onRequestClose={closeModal} // Android Hardware Back Button
    >
      {/* Overlay Background */}
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.overlay}>
          {/* Stop click propagation so clicking the card doesn't close it */}
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalCard}>
              {/* Header with Close Button */}
              <View style={styles.header}>
                <Pressable onPress={closeModal} hitSlop={10}>
                  <Ionicons
                    name="close"
                    size={24}
                    color={theme.colors.textSecondary}
                  />
                </Pressable>
              </View>

              {/* Dynamic Content Switching */}
              {activeModal === "about" && <AboutModal />}
              {activeModal === "signin" && (
                <StubModal title="Sign In" onClose={closeModal} />
              )}
              {activeModal === "logout" && (
                <StubModal title="Log Out" onClose={closeModal} />
              )}

              {/* Example of handling your custom payloads */}
              {activeModal === "confirmPost" && (
                <View style={styles.stubContainer}>
                  <Text>Are you sure you want to post?</Text>
                  <Pressable
                    style={[styles.stubButton, { marginTop: 10 }]}
                    onPress={() => {
                      modalPayload?.onConfirm?.(); // Call the callback
                      closeModal();
                    }}
                  >
                    <Text style={styles.stubButtonText}>Yes, Post</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark semi-transparent background
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: 20,
    ...theme.shadows.modal, // Use your new theme shadow
  },
  header: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  // Stub Styles
  stubContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  stubTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: theme.colors.text,
  },
  stubButton: {
    backgroundColor: theme.colors.logoBlue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: theme.borderRadius.md,
  },
  stubButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
