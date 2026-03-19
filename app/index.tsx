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
    className="bg-white border border-slate-100 rounded-3xl p-5 flex-1 min-h-[110px] shadow-sm shadow-slate-200"
  >
    <View className="w-12 h-12 rounded-2xl bg-brand-primary/10 items-center justify-center mb-4">
      <MaterialCommunityIcons name={icon} size={24} color="#0EA5E9" />
    </View>

    <Text className="text-slate-900 font-extrabold text-sm leading-5">{title}</Text>
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
    className="flex-1 bg-white rounded-3xl px-5 py-5 border border-slate-100 shadow-sm shadow-slate-200"
  >
    <Text className="text-brand-primary text-2xl font-black">{value}</Text>
    <Text className="text-slate-500 mt-1 text-[12px] font-bold uppercase tracking-tight">{label}</Text>
  </Animated.View>
);

export default function LandingPage() {
  return (
    <SafeAreaView className="flex-1 bg-brand-surface">
      <StatusBar style="dark" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-6">
          {/* Brand */}
          <Animated.View
            entering={FadeInDown.duration(450)}
            className="flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-2xl bg-brand-primary items-center justify-center shadow-lg shadow-brand-primary/20">
                <MaterialCommunityIcons name="bus" size={26} color="white" />
              </View>

              <View className="ml-4">
                <Text className="text-brand-dark text-2xl font-black tracking-tight leading-7">
                  GO
                </Text>
                <Text className="text-brand-primary text-base italic font-black -mt-1 tracking-widest">
                  ROUTEX
                </Text>
              </View>

            </View>

            <Pressable
              onPress={() => router.push("/login")}
              className="px-6 py-2.5 rounded-2xl bg-white border border-slate-100 shadow-sm shadow-slate-200 active:scale-95 transition-all"
            >
              <Text className="text-slate-900 font-black text-sm">Đăng nhập</Text>
            </Pressable>
          </Animated.View>

          {/* Hero */}
          <Animated.View
            entering={FadeInDown.duration(500).delay(150)}
            className="mt-12"
          >
            <Text className="text-slate-900 text-[48px] font-black leading-[54px] tracking-tight">
              Đặt vé thông minh,
            </Text>
            <Text className="text-brand-primary text-[48px] font-black leading-[54px] tracking-tight">
              di chuyển nhanh chóng.
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(500).delay(280)}
            className="mt-6"
          >
            <Text className="text-slate-500 text-lg leading-8 font-medium">
              Tìm kiếm tuyến đường, chọn chỗ ngồi và theo dõi hành trình của bạn trong một trải nghiệm hiện đại và thân thiện.
            </Text>
          </Animated.View>

          {/* Feature chips */}
          <View className="mt-10 flex-row flex-wrap justify-between">
            <View className="w-[48%] mb-4">
              <FeatureCard
                icon="map-marker-path"
                title="Tìm kiếm Tuyến"
                delay={350}
              />
            </View>

            <View className="w-[48%] mb-4">
              <FeatureCard icon="seat-passenger" title="Sơ đồ Chỗ ngồi" delay={430} />
            </View>

            <View className="w-[48%]">
              <FeatureCard icon="bus-clock" title="Lịch trình Thực" delay={510} />
            </View>

            <View className="w-[48%]">
              <FeatureCard
                icon="ticket-confirmation-outline"
                title="Đặt vé Nhanh"
                delay={590}
              />
            </View>
          </View>

          {/* Hero card */}
          <Animated.View
            entering={FadeInUp.duration(550).delay(560)}
            className="mt-10 bg-brand-dark rounded-[3rem] p-8 border border-white/5 shadow-2xl shadow-brand-dark/20 relative overflow-hidden"
          >
            <View className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-6">
                <Text className="text-white text-2xl font-black leading-8 tracking-tight">
                  Quản lý hành trình trong tầm tay
                </Text>
                <Text className="text-slate-400 mt-3 leading-6 font-medium">
                  Từ lập kế hoạch đến giữ chỗ và xác nhận đặt vé, mọi thứ đều được đồng bộ hóa thời gian thực.
                </Text>
              </View>

              <View className="w-16 h-16 rounded-[24px] bg-brand-primary items-center justify-center shadow-lg shadow-brand-primary/20">
                <MaterialCommunityIcons
                  name="shield-check"
                  size={32}
                  color="white"
                />
              </View>
            </View>
          </Animated.View>

          {/* Stats */}
          <View className="flex-row gap-4 mt-8">
            <StatCard value="24/7" label="Hỗ trợ khách hàng" delay={650} />
            <StatCard value="Live" label="Tình trạng ghế" delay={730} />
            <StatCard value="Fast" label="Thanh toán 1 chạm" delay={810} />
          </View>

          {/* CTA */}
          <Animated.View
            entering={FadeInUp.duration(550).delay(900)}
            className="mt-12"
          >
            <Pressable
              onPress={() => router.push("/(tabs)")}
              className="bg-brand-primary rounded-2xl items-center justify-center py-5 shadow-xl shadow-brand-primary/20 active:scale-95 transition-all"
            >
              <Text className="text-white font-black text-xl">
                Khám phá ngay
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/login")}
              className="mt-5 bg-white border border-slate-100 rounded-2xl items-center justify-center py-5 shadow-sm shadow-slate-200 active:scale-95 transition-all"
            >
              <Text className="text-slate-900 font-black text-base">
                Đăng nhập để đặt vé
              </Text>
            </Pressable>
          </Animated.View>

          {/* Bottom auth */}
          <Animated.View
            entering={FadeInUp.duration(500).delay(1020)}
            className="flex-row mt-10 justify-center items-center"
          >
            <Text className="text-slate-500 text-base font-medium">
              Bạn chưa có tài khoản?
            </Text>

            <Pressable onPress={() => router.push("/register")}>
              <Text className="text-brand-primary font-black text-base ml-2">
                Đăng ký ngay
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
