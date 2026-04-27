import { colors } from "@/constants/theme";
import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function OnboardingScreen() {
  const { isLoaded, isSignedIn } = useAuth();

  // Show loading state while auth is being verified
  if (!isLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  // Redirect based on auth state
  if (isSignedIn) {
    // User is signed in, go to home tabs
    return <Redirect href="/(tabs)" />;
  } else {
    // User is not signed in, go to sign in
    return <Redirect href="/(auth)/sign-in" />;
  }
}
