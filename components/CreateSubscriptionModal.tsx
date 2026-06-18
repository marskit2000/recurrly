import { icons } from "@/constants/icons";
import clsx from "clsx";
import dayjs from "dayjs";
import { usePostHog } from "posthog-react-native";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

const CATEGORIES = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
];

const CATEGORY_COLORS: Record<string, string> = {
  Entertainment: "#ff6b6b",
  "AI Tools": "#b8d4e3",
  "Developer Tools": "#e8def8",
  Design: "#f5c542",
  Productivity: "#85c1e9",
  Cloud: "#aed6f1",
  Music: "#f1b0d0",
  Other: "#c8d6e5",
};

interface CreateSubscriptionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (subscription: Subscription) => void;
}

export default function CreateSubscriptionModal({
  isVisible,
  onClose,
  onSubmit,
}: CreateSubscriptionModalProps) {
  const posthog = usePostHog();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<"Monthly" | "Yearly">("Monthly");
  const [category, setCategory] = useState("Entertainment");
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const validateForm = () => {
    const newErrors: Partial<Record<string, string>> = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!price.trim()) {
      newErrors.price = "Price is required";
    } else {
      const priceNum = parseFloat(price);
      if (isNaN(priceNum) || priceNum <= 0) {
        newErrors.price = "Price must be a positive number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateRenewalDate = (startDate: string, freq: string) => {
    if (freq === "Monthly") {
      return dayjs(startDate).add(1, "month").toISOString();
    } else {
      return dayjs(startDate).add(1, "year").toISOString();
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const now = new Date().toISOString();
    const renewalDate = calculateRenewalDate(now, frequency);

    const newSubscription: Subscription = {
      id: `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      icon: icons.wallet,
      name,
      category,
      status: "active",
      startDate: now,
      price: parseFloat(price),
      currency: "USD",
      billing: frequency,
      renewalDate,
      color: CATEGORY_COLORS[category] || CATEGORY_COLORS.Other,
    };

    onSubmit(newSubscription);

    posthog.capture("subscription_created", {
      name: newSubscription.name,
      category: newSubscription.category || "Uncategorized",
      price: newSubscription.price,
      billing_frequency: newSubscription.billing,
    });

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setCategory("Entertainment");
    setErrors({});
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="modal-overlay">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="modal-container">
            {/* Header */}
            <View className="modal-header">
              <Text className="modal-title">New Subscription</Text>
              <Pressable className="modal-close" onPress={onClose}>
                <Text className="modal-close-text">×</Text>
              </Pressable>
            </View>

            {/* Body */}
            <ScrollView
              className="modal-body"
              showsVerticalScrollIndicator={false}
            >
              {/* Name Field */}
              <View className="auth-field">
                <Text className="auth-label">Name</Text>
                <TextInput
                  className={clsx(
                    "auth-input",
                    errors.name && "auth-input-error",
                  )}
                  placeholder="e.g., Netflix"
                  placeholderTextColor="rgba(0,0,0,0.3)"
                  value={name}
                  onChangeText={setName}
                />
                {errors.name && (
                  <Text className="auth-error">{errors.name}</Text>
                )}
              </View>

              {/* Price Field */}
              <View className="auth-field">
                <Text className="auth-label">Price</Text>
                <TextInput
                  className={clsx(
                    "auth-input",
                    errors.price && "auth-input-error",
                  )}
                  placeholder="e.g., 9.99"
                  placeholderTextColor="rgba(0,0,0,0.3)"
                  keyboardType="decimal-pad"
                  value={price}
                  onChangeText={setPrice}
                />
                {errors.price && (
                  <Text className="auth-error">{errors.price}</Text>
                )}
              </View>

              {/* Frequency Picker */}
              <View className="auth-field">
                <Text className="auth-label">Billing Frequency</Text>
                <View className="picker-row">
                  {(["Monthly", "Yearly"] as const).map((freq) => (
                    <Pressable
                      key={freq}
                      className={clsx(
                        "picker-option",
                        frequency === freq && "picker-option-active",
                      )}
                      onPress={() => setFrequency(freq)}
                    >
                      <Text
                        className={clsx(
                          "picker-option-text",
                          frequency === freq && "picker-option-text-active",
                        )}
                      >
                        {freq}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Category Chips */}
              <View className="auth-field">
                <Text className="auth-label">Category</Text>
                <View className="category-scroll">
                  {CATEGORIES.map((cat) => (
                    <Pressable
                      key={cat}
                      className={clsx(
                        "category-chip",
                        category === cat && "category-chip-active",
                      )}
                      onPress={() => setCategory(cat)}
                    >
                      <Text
                        className={clsx(
                          "category-chip-text",
                          category === cat && "category-chip-text-active",
                        )}
                      >
                        {cat}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Submit Button */}
              <Pressable
                className={clsx(
                  "auth-button",
                  !name.trim() || !price.trim() ? "auth-button-disabled" : "",
                )}
                onPress={handleSubmit}
                disabled={!name.trim() || !price.trim()}
              >
                <Text className="auth-button-text">Create Subscription</Text>
              </Pressable>

              {/* Spacer */}
              <View className="h-6" />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
