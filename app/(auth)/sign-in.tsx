import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const signIn = () => {
  return (
    <View>
      <Text>sign-in</Text>
      <Link
        href="/(auth)/sign-up"
        className="mt-4 px-4 py-2 text-white bg-primary rounded"
      >
        Sign Up Account
      </Link>
    </View>
  );
};

export default signIn;
