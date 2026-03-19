import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import React, { useState } from "react";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const canRegister =
    fullName.trim().length > 0 &&
    username.trim().length > 0 &&
    phone.trim().length > 0 &&
    email.trim().length > 0 &&
    password.trim().length > 0 &&
    confirmPassword.trim().length > 0;

  const handleRegister = () => {
    if (!canRegister) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }

    // Giả lập lưu API
    setIsSuccess(true);
  };

  // MÀN HÌNH SAU KHI CLICK CREATE ACCOUNT (SUCCESS STATE)
  if (isSuccess) {
    return (
      <View className="flex-1 bg-brand-dark justify-center px-8 relative overflow-hidden">
        <View className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/20 rounded-full -mr-40 -mt-40 blur-3xl opacity-50" />
        
        <View className="bg-white rounded-[3rem] p-10 items-center shadow-2xl relative z-10 border border-white/20">
          <View className="mb-8 bg-brand-primary/10 p-5 rounded-[2.5rem] shadow-sm border border-brand-primary/10">
            <MaterialCommunityIcons name="shield-check" size={64} color="#0EA5E9" />
          </View>

          <Text className="text-3xl font-black text-slate-900 text-center mb-3 tracking-tight">
            Đăng ký thành công!
          </Text>

          <Text className="text-slate-500 text-center leading-7 mb-10 font-medium px-2">
            Hành trình của bạn đã sẵn sàng. Mã xác thực OTP đã được gửi tới email: {"\n"}
            <Text className="text-brand-primary font-black">{email}</Text>
          </Text>

          <Pressable
            onPress={() => {
              router.push({
                pathname: "/verify",
                params: { email },
              });
            }}
            className="w-full bg-brand-primary rounded-2xl py-5 items-center justify-center shadow-xl shadow-brand-primary/30 mb-6 active:scale-95 transition-all"
          >
            <Text className="text-white font-black text-xl">Xác thực ngay</Text>
          </Pressable>

          <Pressable onPress={() => router.back()} className="py-2 active:opacity-60">
            <Text className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Quay lại Đăng nhập</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // MÀN HÌNH FORM ĐĂNG KÝ (INITIAL STATE)
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-brand-surface font-sans"
    >
      <View
        className="w-full bg-brand-dark pt-16 pb-12 overflow-hidden relative"
        style={{
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
        }}
      >
        <View className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
        <View className="flex-row items-center justify-between px-8 relative z-10">
          <Pressable
            onPress={() => router.back()}
            className="h-12 w-12 rounded-2xl bg-white/10 items-center justify-center border border-white/5 backdrop-blur-md active:scale-95"
          >
            <MaterialIcons name="keyboard-arrow-left" size={32} color="white" />
          </Pressable>

          <Text className="text-white font-black text-xl tracking-tight">Đăng ký tài khoản</Text>

          <View className="w-12 h-12 items-center justify-center">
             <MaterialCommunityIcons size={28} color="rgba(255,255,255,0.2)" name="dots-horizontal" />
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-8"
        contentContainerStyle={{ paddingTop: 32, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mb-10">
          <View className="w-20 h-20 rounded-3xl bg-brand-primary items-center justify-center shadow-lg shadow-brand-primary/20 mb-6">
            <MaterialCommunityIcons name="bus" size={40} color="white" />
          </View>
          <Text className="text-4xl font-black text-slate-900 tracking-tight">
            Tạo tài khoản
          </Text>
          <Text className="text-slate-500 mt-3 text-center font-medium leading-6 max-w-[280px]">
            Gia nhập cộng đồng Go Routex để quản lý mọi hành trình nhanh chóng
          </Text>
        </View>

        <View className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
          <View className="mb-6">
            <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Họ và tên</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Nhập họ và tên của bạn"
              placeholderTextColor="#94A3B8"
              className="bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-slate-900 font-black text-base focus:border-brand-primary/30"
            />
          </View>

          <View className="mb-6">
            <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Tên đăng nhập</Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Nhập tên đăng nhập"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              className="bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-slate-900 font-black text-base focus:border-brand-primary/30"
            />
          </View>

          <View className="mb-6">
            <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Số điện thoại</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Nhập số điện thoại"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              className="bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-slate-900 font-black text-base focus:border-brand-primary/30"
            />
          </View>

          <View className="mb-6">
            <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Nhập địa chỉ email"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-slate-900 font-black text-base focus:border-brand-primary/30"
            />
          </View>

          <View className="mb-6">
            <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Mật khẩu</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              className="bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-slate-900 font-black text-base focus:border-brand-primary/30"
            />
          </View>

          <View className="mb-4">
            <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Xác nhận mật khẩu</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••••"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              className="bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-slate-900 font-black text-base focus:border-brand-primary/30"
            />
          </View>

          <Pressable
            disabled={!canRegister}
            onPress={handleRegister}
            className={`rounded-2xl py-5 items-center justify-center mt-8 shadow-xl active:scale-95 transition-all ${
              canRegister ? "bg-brand-primary shadow-brand-primary/30 scale-[1.02]" : "bg-slate-100 shadow-none opacity-50"
            }`}
          >
            <Text
              className={`font-black text-xl ${
                canRegister ? "text-white" : "text-slate-400"
              }`}
            >
              Đăng ký ngay
            </Text>
          </Pressable>

          <View className="flex-row justify-center items-center mt-8 mb-2">
            <Text className="text-slate-500 font-medium">Đã có tài khoản? </Text>
            <Pressable onPress={() => router.back()} className="active:opacity-60">
              <Text className="text-brand-primary font-black text-base ml-1">Đăng nhập</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;
