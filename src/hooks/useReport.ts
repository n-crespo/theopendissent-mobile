import { useCallback } from "react";
import { Linking, Alert } from "react-native";

const FORM_BASE_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdRBsVqe7UhMhprUmt3dnyhGiokHRPapXzPLwmxhizeMtHjkQ/viewform";
const ENTRY_POST_ID = "entry.175932122";
const ENTRY_USER_ID = "entry.625171225";

export const useReport = () => {
  const reportPost = useCallback(
    async (postId: string, reporterUserId?: string) => {
      try {
        // 1. Construct URL Query manually (safer than URLSearchParams on some RN versions)
        const userIdParam = reporterUserId || "anonymous";

        const query = [
          `usp=pp_url`,
          `${ENTRY_POST_ID}=${encodeURIComponent(postId)}`,
          `${ENTRY_USER_ID}=${encodeURIComponent(userIdParam)}`,
        ].join("&");

        const reportUrl = `${FORM_BASE_URL}?${query}`;

        // 2. Check if supported and Open
        const canOpen = await Linking.canOpenURL(reportUrl);

        if (canOpen) {
          await Linking.openURL(reportUrl);
        } else {
          Alert.alert("Error", "Could not open the report form.");
        }
      } catch (error) {
        console.error("Report error:", error);
        Alert.alert(
          "Error",
          "Something went wrong trying to report this post.",
        );
      }
    },
    [],
  );

  return { reportPost };
};
