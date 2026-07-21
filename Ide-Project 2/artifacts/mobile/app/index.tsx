import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useColors } from "@/hooks/useColors";
import { useUserProfile } from "@/context/UserContext";
import { useAdmin } from "@/context/AdminContext";

export default function Index() {
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { isAdmin, isLoaded: adminLoaded } = useAdmin();
  const { profile, isLoaded: profileLoaded } = useUserProfile();
  const colors = useColors();

  if (!authLoaded || !profileLoaded || !adminLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (isAdmin) {
    return <Redirect href="/(tabs)" />;
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (!profile.onboardingComplete) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}
