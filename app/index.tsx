import { View, Text, Pressable, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { router } from "expo-router";

const FeatureCard = ({
  icon,
  title,
  delay = 0,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  delay?: number;
}) => (
  <Animated.View
    entering={FadeInDown.duration(450).delay(delay)}
    className="bg-[#263148] border border-[#33415C] rounded-2xl p-4 flex-1 min-h-[96px]"
  >
    <View className="w-10 h-10 rounded-2xl bg-[#1E9E95]/20 items-center justify-center mb-3">
      <MaterialCommunityIcons name={icon} size={20} color="#12B3A8" />
    </View>

    <Text className="text-white font-bold text-sm leading-5">{title}</Text>
  </Animated.View>
);

const StatCard = ({
  value,
  label,
  delay = 0,
}: {
  value: string;
  label: string;
  delay?: number;
}) => (
  <Animated.View
    entering={FadeInUp.duration(450).delay(delay)}
    className="flex-1 bg-[#1E2738] rounded-2xl px-4 py-4 border border-[#2C364D]"
  >
    <Text className="text-[#12B3A8] text-2xl font-extrabold">{value}</Text>
    <Text className="text-neutral-300 mt-1 text-sm">{label}</Text>
  </Animated.View>
);

export default function LandingPage() {
  return (
    <SafeAreaView className="flex-1 bg-[#192031]">
      <StatusBar style="light" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-4">
          {/* Brand */}
          <Animated.View
            entering={FadeInDown.duration(450)}
            className="flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <View className="w-11 h-11 rounded-2xl bg-[#12B3A8] items-center justify-center">
                <MaterialCommunityIcons name="bus" size={24} color="white" />
              </View>

              <View className="ml-3">
                <Text className="text-white text-xl font-extrabold tracking-wide">
                  GO
                </Text>
                <Text className="text-[#4AE8DD] text-base italic font-bold -mt-1">
                  ROUTEX
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => router.push("/login")}
              className="px-4 py-2 rounded-full border border-[#3A455E]"
            >
              <Text className="text-white font-semibold">Login</Text>
            </Pressable>
          </Animated.View>

          {/* Hero */}
          <Animated.View
            entering={FadeInDown.duration(500).delay(150)}
            className="mt-10"
          >
            <Text className="text-white text-[44px] font-extrabold leading-[52px]">
              Book smarter,
            </Text>
            <Text className="text-[#12B3A8] text-[44px] font-extrabold leading-[52px]">
              manage routes faster.
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(500).delay(280)}
            className="mt-5"
          >
            <Text className="text-neutral-300 text-lg leading-8">
              Search routes, choose seats, track availability, and streamline
              transport operations in one modern experience.
            </Text>
          </Animated.View>

          {/* Feature chips */}
          <View className="mt-7 flex-row flex-wrap justify-between">
            <View className="w-[48%] mb-3">
              <FeatureCard
                icon="map-marker-path"
                title="Route Search"
                delay={350}
              />
            </View>

            <View className="w-[48%] mb-3">
              <FeatureCard icon="seat-passenger" title="Seat Map" delay={430} />
            </View>

            <View className="w-[48%]">
              <FeatureCard icon="bus-clock" title="Assignment" delay={510} />
            </View>

            <View className="w-[48%]">
              <FeatureCard
                icon="ticket-confirmation-outline"
                title="Booking Flow"
                delay={590}
              />
            </View>
          </View>

          {/* Hero card */}
          <Animated.View
            entering={FadeInUp.duration(550).delay(560)}
            className="mt-8 bg-[#222C3F] rounded-[28px] p-5 border border-[#33415C]"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-4">
                <Text className="text-white text-xl font-extrabold">
                  Route operations at your fingertips
                </Text>
                <Text className="text-neutral-300 mt-2 leading-6">
                  From trip planning to seat holding and booking confirmation,
                  everything stays synchronized in real time.
                </Text>
              </View>

              <View className="w-16 h-16 rounded-3xl bg-[#12B3A8] items-center justify-center">
                <MaterialCommunityIcons
                  name="ticket-confirmation-outline"
                  size={30}
                  color="white"
                />
              </View>
            </View>
          </Animated.View>

          {/* Stats */}
          <View className="flex-row gap-3 mt-6">
            <StatCard value="24/7" label="Trip monitoring" delay={650} />
            <StatCard value="Live" label="Seat inventory" delay={730} />
            <StatCard value="Fast" label="Booking flow" delay={810} />
          </View>

          {/* CTA */}
          <Animated.View
            entering={FadeInUp.duration(550).delay(900)}
            className="mt-9"
          >
            <Pressable
              onPress={() => router.push("/(tabs)")}
              className="bg-[#12B3A8] rounded-2xl items-center justify-center py-4"
            >
              <Text className="text-white font-extrabold text-lg">
                Discover Routes
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/login")}
              className="mt-4 border border-[#3A455E] rounded-2xl items-center justify-center py-4"
            >
              <Text className="text-white font-bold text-base">
                Sign in to manage bookings
              </Text>
            </Pressable>
          </Animated.View>

          {/* Bottom auth */}
          <Animated.View
            entering={FadeInUp.duration(500).delay(1020)}
            className="flex-row mt-6 justify-center items-center"
          >
            <Text className="text-neutral-400 text-base">
              Don&apos;t have an account?
            </Text>

            <Pressable onPress={() => router.push("/register")}>
              <Text className="text-[#4AE8DD] font-extrabold text-base ml-2">
                Register
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
