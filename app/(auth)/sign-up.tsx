import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const signUp = () => {
  return (
    <View>
      <Text>sign-up</Text>
      <Link
        href="/(auth)/sign-in"
        className="mt-4 px-4 py-2 text-white bg-primary rounded"
      >
        Sign In Account
      </Link>
    </View>
  );
};

export default signUp;
