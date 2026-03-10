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
      <View className="flex-1 bg-[#192031] justify-center px-6">
        <View className="bg-white rounded-[40px] p-8 items-center shadow-2xl">
          <View className="mb-6 bg-white p-3 rounded-[32px] shadow-sm border border-gray-100">
            <Image
              source={require("../assets/images/logo-1.png")}
              style={{ width: 100, height: 100 }}
              contentFit="contain"
            />
          </View>

          <Text className="text-2xl font-black text-gray-900 text-center mb-3">
            Đăng ký thành công!
          </Text>

          <Text className="text-gray-500 text-center leading-6 mb-8 font-medium">
            Bạn sẽ nhận được email xác nhận cùng với mã OTP code gửi tới {"\n"}
            <Text className="text-[#12B3A8] font-bold">{email}</Text>
          </Text>

          <Pressable
            onPress={() => {
              router.push({
                pathname: "/verify",
                params: { email },
              });
            }}
            className="w-full bg-[#12B3A8] rounded-2xl py-4 items-center justify-center shadow-lg shadow-[#12B3A8]/30 mb-4"
          >
            <Text className="text-white font-black text-lg">Xác thực ngay</Text>
          </Pressable>

          <Pressable onPress={() => router.back()} className="py-2">
            <Text className="text-gray-400 font-bold">Quay lại Đăng nhập</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // MÀN HÌNH FORM ĐĂNG KÝ (INITIAL STATE)
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#F5F7FA]"
    >
      <View
        className="w-full bg-[#192031] pt-16 pb-6"
        style={{
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
        }}
      >
        <View className="flex-row items-center justify-between px-3">
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 rounded-full bg-slate-700 items-center justify-center"
          >
            <MaterialIcons name="keyboard-arrow-left" size={28} color="white" />
          </Pressable>

          <Text className="text-white font-extrabold text-lg">Đăng ký</Text>

          <MaterialCommunityIcons
            size={26}
            color="white"
            name="dots-horizontal"
          />
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mb-6">
        <View className="py-5 px-5">
          <Image
            source={require("../assets/images/logo-1.png")}
            style={{ width: 100, height: 100 }}
          />
        </View>
          <Text className="text-2xl font-extrabold text-gray-900">
            Tạo tài khoản
          </Text>
          <Text className="text-gray-500 mt-2 text-center">
            Đăng ký để quản lý hành trình và đặt vé của bạn
          </Text>
        </View>

        <View className="bg-white rounded-3xl p-5 border border-gray-100">
          <View className="mb-4">
            <Text className="text-xs text-gray-500 mb-2">Họ và tên</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Nhập họ và tên"
              placeholderTextColor="gray"
              className="border border-gray-300 rounded-2xl px-4 py-4 text-gray-900 font-medium"
            />
          </View>

          <View className="mb-4">
            <Text className="text-xs text-gray-500 mb-2">Tên đăng nhập</Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Nhập tên đăng nhập"
              placeholderTextColor="gray"
              autoCapitalize="none"
              className="border border-gray-300 rounded-2xl px-4 py-4 text-gray-900 font-medium"
            />
          </View>

          <View className="mb-4">
            <Text className="text-xs text-gray-500 mb-2">Số điện thoại</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Nhập số điện thoại"
              placeholderTextColor="gray"
              keyboardType="phone-pad"
              className="border border-gray-300 rounded-2xl px-4 py-4 text-gray-900 font-medium"
            />
          </View>

          <View className="mb-4">
            <Text className="text-xs text-gray-500 mb-2">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Nhập địa chỉ email"
              placeholderTextColor="gray"
              keyboardType="email-address"
              autoCapitalize="none"
              className="border border-gray-300 rounded-2xl px-4 py-4 text-gray-900 font-medium"
            />
          </View>

          <View className="mb-4">
            <Text className="text-xs text-gray-500 mb-2">Mật khẩu</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Nhập mật khẩu"
              placeholderTextColor="gray"
              secureTextEntry
              className="border border-gray-300 rounded-2xl px-4 py-4 text-gray-900 font-medium"
            />
          </View>

          <View className="mb-2">
            <Text className="text-xs text-gray-500 mb-2">Xác nhận mật khẩu</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Nhập lại mật khẩu"
              placeholderTextColor="gray"
              secureTextEntry
              className="border border-gray-300 rounded-2xl px-4 py-4 text-gray-900 font-medium"
            />
          </View>

          <Pressable
            disabled={!canRegister}
            onPress={handleRegister}
            className={`rounded-2xl py-4 items-center justify-center mt-5 ${
              canRegister ? "bg-[#12B3A8]" : "bg-gray-300"
            }`}
          >
            <Text
              className={`font-black text-base ${
                canRegister ? "text-white" : "text-gray-500"
              }`}
            >
              Tạo tài khoản
            </Text>
          </Pressable>

          <View className="flex-row justify-center items-center mt-5">
            <Text className="text-gray-500">Đã có tài khoản? </Text>
            <Pressable onPress={() => router.back()}>
              <Text className="text-[#12B3A8] font-extrabold">Đăng nhập</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;
