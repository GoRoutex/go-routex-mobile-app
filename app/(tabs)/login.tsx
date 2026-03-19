import { View, Text, TextInput, Pressable, Alert, ScrollView } from "react-native";
import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image } from "expo-image";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const canLogin = username.trim().length > 0 && password.trim().length > 0;

  const handleLogin = () => {
    if (!canLogin) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu");
      return;
    }

    Alert.alert("Đăng nhập", `Tên đăng nhập: ${username}`);
    // TODO: call login API
  };

  return (
    <View className="flex-1 bg-brand-surface font-sans">
      {/* Decorative Background */}
      <View className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/5 rounded-full -mr-40 -mt-20 blur-3xl opacity-50" />
      <View className="absolute bottom-0 left-0 w-80 h-80 bg-brand-accent/5 rounded-full -ml-40 -mb-20 blur-3xl opacity-50" />

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mb-12">
          <View className="w-24 h-24 bg-white rounded-[2rem] items-center justify-center shadow-2xl shadow-slate-200 border border-slate-50 mb-8 p-4">
            <Image
              source={require("../../assets/images/logo-1.png")}
              style={{ width: '100%', height: '100%' }}
              contentFit="contain"
            />
          </View>
          <Text className="text-4xl font-black text-slate-900 tracking-tighter mb-3">Chào mừng!</Text>
          <Text className="text-slate-400 font-bold text-center px-6 leading-5">
            Đăng nhập để quản lý lịch trình, phương tiện và các chuyến xe của bạn
          </Text>
        </View>

        <View className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 border border-slate-50">
          <View className="space-y-6">
            <View>
              <Text className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-3 ml-1">Tên đăng nhập</Text>
              <View className="relative">
                <View className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
                   <MaterialCommunityIcons name="account-outline" size={20} color="#94A3B8" />
                </View>
                <TextInput
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Nhập tên đăng nhập"
                  placeholderTextColor="#94A3B8"
                  className="bg-slate-50 border-2 border-slate-50 rounded-2xl pl-14 pr-5 py-4 text-slate-900 font-bold text-base"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View className="mt-4">
              <Text className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-3 ml-1">Mật khẩu</Text>
              <View className="relative">
                <View className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
                   <MaterialCommunityIcons name="lock-outline" size={20} color="#94A3B8" />
                </View>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Nhập mật khẩu"
                  placeholderTextColor="#94A3B8"
                  className="bg-slate-50 border-2 border-slate-50 rounded-2xl pl-14 pr-5 py-4 text-slate-900 font-bold text-base"
                  secureTextEntry
                />
              </View>
            </View>

            <Pressable
              disabled={!canLogin}
              onPress={handleLogin}
              className={`rounded-3xl py-5 items-center justify-center mt-8 shadow-2xl active:scale-[0.98] transition-all ${
                canLogin ? "bg-brand-primary shadow-brand-primary/40" : "bg-slate-100 shadow-none opacity-60"
              }`}
            >
              <Text
                className={`font-black text-xl tracking-tight ${
                  canLogin ? "text-white" : "text-slate-400"
                }`}
              >
                Đăng nhập
              </Text>
            </Pressable>

            {/* Register redirect */}
            <View className="flex-row justify-center items-center mt-8">
              <Text className="text-slate-400 font-bold text-sm">Chưa có tài khoản? </Text>
              <Pressable 
                onPress={() => router.push("/register")}
                className="active:opacity-70"
              >
                <Text className="text-brand-primary font-black text-sm tracking-tight border-b border-brand-primary/20">Đăng ký ngay</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Support Link */}
        <View className="mt-12 items-center">
            <Pressable className="flex-row items-center bg-slate-50 px-6 py-3 rounded-full border border-slate-100">
               <MaterialCommunityIcons name="help-circle-outline" size={16} color="#94A3B8" />
               <Text className="text-slate-400 font-bold text-xs ml-2 uppercase tracking-widest">Hỗ trợ kỹ thuật</Text>
            </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default Login;
