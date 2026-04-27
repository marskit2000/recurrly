import images from "@/constants/images";
import { colors } from "@/constants/theme";
import { formatSubscriptionDateTime } from "@/lib/utils";
import { useClerk, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { signOut } = useClerk();
  const router = useRouter();
  const { user } = useUser();
  const [signOutLoading, setSignOutLoading] = useState(false);

  const handleSignOut = async () => {
    Alert.alert("Sign out", "Are you sure you want to sign out of Recurrly?", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Sign out",
        onPress: async () => {
          setSignOutLoading(true);
          try {
            await signOut();
            router.replace("/(auth)/sign-in");
          } catch (err) {
            console.error("Sign out error:", err);
            Alert.alert("Error", "Failed to sign out. Please try again.");
          } finally {
            setSignOutLoading(false);
          }
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View style={styles.container}>
              <View style={styles.header}>
                <Text style={styles.title}>Settings</Text>
              </View>

              {/* User Info Section */}
              {user && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Account</Text>
                  </View>
                  <View style={styles.userCard}>
                    <View style={styles.userInfo}>
                      <View style={styles.avatar}>
                        {user.imageUrl ? (
                          <Image
                            style={styles.avatar}
                            source={
                              user?.imageUrl
                                ? { uri: user.imageUrl }
                                : images.avatar
                            }
                          />
                        ) : (
                          <Ionicons
                            name="person"
                            size={24}
                            color={colors.accent}
                          />
                        )}
                      </View>
                      <View style={styles.userDetails}>
                        <Text style={styles.userName}>
                          {user.firstName && user.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user.primaryEmailAddress?.emailAddress || "User"}
                        </Text>
                        <Text style={styles.userEmail}>
                          {user.primaryEmailAddress?.emailAddress}
                        </Text>
                        <Text style={styles.userEmail}>
                          {`Updated at: ${formatSubscriptionDateTime(
                            user.createdAt?.toISOString(),
                          )}`}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}

              {/* Settings Options */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>App</Text>
                </View>
                <View style={styles.settingItem}>
                  <View style={styles.settingLabel}>
                    <Ionicons
                      name="information-circle"
                      size={20}
                      color={colors.accent}
                    />
                    <Text style={styles.settingText}>App Version</Text>
                  </View>
                  <Text style={styles.settingValue}>1.0.0</Text>
                </View>
              </View>

              {/* Sign Out Section */}
              <View style={styles.signOutSection}>
                <TouchableOpacity
                  style={[
                    styles.signOutButton,
                    signOutLoading && styles.signOutButtonDisabled,
                  ]}
                  onPress={handleSignOut}
                  disabled={signOutLoading}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel="Sign out button"
                >
                  {signOutLoading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Ionicons name="log-out" size={18} color="#fff" />
                      <Text style={styles.signOutText}>Sign out</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "sans-bold",
    color: colors.foreground,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "sans-semibold",
    color: colors.mutedForeground,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  userCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.muted,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitials: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.accent,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "sans-semibold",
    color: colors.foreground,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.mutedForeground,
    fontFamily: "sans-regular",
  },
  settingItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  settingLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    fontFamily: "sans-regular",
    color: colors.foreground,
  },
  settingValue: {
    fontSize: 14,
    fontFamily: "sans-regular",
    color: colors.mutedForeground,
  },
  signOutSection: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 16,
  },
  signOutButton: {
    backgroundColor: colors.destructive,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 48,
    marginBottom: 60,
  },
  signOutButtonDisabled: {
    opacity: 0.6,
  },
  signOutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "sans-semibold",
  },
});

export default Settings;
