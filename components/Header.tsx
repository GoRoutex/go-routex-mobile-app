import { View, Text, Pressable } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

interface HeaderProps {
  isLoggedIn: boolean;
  userName: string;
  routePoint?: string | null;
}

const Header: React.FC<HeaderProps> = ({
  isLoggedIn,
  userName,
  routePoint,
}) => {
  const displayName = userName?.trim()?.length > 0 ? userName : "Khách hàng";

  return (
    <View className="px-8 mt-4">
      {isLoggedIn && (
        <View className="bg-white/10 border border-white/5 self-start px-4 py-1.5 rounded-full mb-4 flex-row items-center backdrop-blur-md">
           <MaterialCommunityIcons name="star-circle" size={16} color="#0EA5E9" />
           <Text className="text-white font-black text-[10px] uppercase tracking-widest ml-2">
              Điểm tích lũy: <Text className="text-brand-primary">{routePoint || "0"}</Text>
           </Text>
        </View>
      )}
      <View className="flex-row justify-between items-center">
        <View className="flex-1 pr-6">
          <Text className="text-white text-3xl font-black tracking-tighter leading-8">
            {isLoggedIn
              ? `Chào mừng,\n${displayName}!`
              : "Chào mừng,\nQuý khách!"}
          </Text>

          <Text className="text-slate-400 mt-4 leading-6 font-medium text-sm">
            {isLoggedIn
              ? "Quản lý hành trình và tận hưởng những chuyến đi tuyệt vời nhất."
              : "Tìm kiếm và đặt vé những chuyến xe chất lượng cao thật dễ dàng."}
          </Text>
        </View>

        <Pressable
          onPress={() => {
            if (!isLoggedIn) {
              router.push("/login");
            }
          }}
          className={`w-16 h-16 rounded-[2rem] items-center justify-center border ${
            isLoggedIn 
              ? "bg-brand-primary border-brand-primary/20 shadow-lg shadow-brand-primary/40" 
              : "bg-white/10 border-white/5 backdrop-blur-xl"
          }`}
        >
          <MaterialCommunityIcons
            name={isLoggedIn ? "account-check" : "account-outline"}
            size={32}
            color="white"
          />
        </Pressable>
      </View>
    </View>
  );
};

export default Header;
