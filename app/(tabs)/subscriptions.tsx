import SubscriptionCard from "@/components/SubscriptionCard";
import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import { styled } from "nativewind";
import React, { useMemo, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const subscriptions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredSubscriptions = useMemo(() => {
    if (!searchQuery.trim()) return HOME_SUBSCRIPTIONS;

    const query = searchQuery.toLowerCase();
    return HOME_SUBSCRIPTIONS.filter((sub) => {
      const name = sub.name.toLowerCase();
      const category = sub.category?.toLowerCase() || "";
      const plan = sub.plan?.toLowerCase() || "";

      return (
        name.includes(query) || category.includes(query) || plan.includes(query)
      );
    });
  }, [searchQuery]);

  const handleCardPress = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-5 pt-5">
        <Text className="text-2xl font-bold text-text mb-4">Subscriptions</Text>

        <TextInput
          placeholder="Search subscriptions..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="bg-card px-4 py-3 rounded-lg mb-4 text-text"
        />
      </View>

      <FlatList
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="px-5 mb-3">
            <SubscriptionCard
              {...item}
              expanded={expandedId === item.id}
              onPress={() => handleCardPress(item.id)}
            />
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="px-5 py-8 items-center">
            <Text className="text-text text-center">
              No subscriptions found
            </Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        scrollEnabled={false}
      />
    </SafeAreaView>
  );
};

export default subscriptions;
