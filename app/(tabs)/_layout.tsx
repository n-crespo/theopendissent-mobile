import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";
import { DynamicColorIOS } from "react-native";

export default function TabLayout() {
  return (
    <NativeTabs
      tintColor={DynamicColorIOS({
        dark: "#0A84FF",
        light: "#007AFF",
      })}
    >
      {/* LEFT TAB: About */}
      <NativeTabs.Trigger name="about">
        <Label>About</Label>
        <Icon
          sf={{
            default: "questionmark.circle",
            selected: "questionmark.circle.fill",
          }}
        />
      </NativeTabs.Trigger>

      {/* MIDDLE TAB: Feed */}
      <NativeTabs.Trigger name="index">
        <Label>Feed</Label>
        <Icon sf={{ default: "house", selected: "house.fill" }} />
      </NativeTabs.Trigger>

      {/* RIGHT TAB: Profile */}
      <NativeTabs.Trigger name="profile">
        <Label>Profile</Label>
        <Icon
          sf={{ default: "person.circle", selected: "person.circle.fill" }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
