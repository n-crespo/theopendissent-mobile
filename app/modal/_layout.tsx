import { Stack } from "expo-router";

export default function ModalLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="signin"
        options={{
          presentation: "formSheet", // <--- The Apple Card Look
          sheetAllowedDetents: [1.0], // Full height
          sheetGrabberVisible: true, // Little gray bar at top
          headerShown: true, // Let the modal manage its own header
        }}
      />
    </Stack>
  );
}
