import { Tabs } from "expo-router";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0EA5E9',
        tabBarInactiveTintColor: '#94A3B8',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: -10 },
          shadowOpacity: 0.05,
          shadowRadius: 20,
          height: 90,
          paddingBottom: 30,
          paddingTop: 10,
          borderTopLeftRadius: 35,
          borderTopRightRadius: 35,
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang chủ",
          tabBarLabelStyle: { fontWeight: '900', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 },
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={28} name="home-variant" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: "Đăng nhập",
          tabBarLabelStyle: { fontWeight: '900', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 },
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={28} name="account-circle-outline" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
