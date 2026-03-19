import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState, useRef } from "react";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

const VerifyPage = () => {
  const params = useLocalSearchParams<{ email?: string }>();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto focus next input
    if (text.length !== 0 && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join("");
    // TODO: Call Verify API
    console.log("Verifying code:", code);
    router.replace("/");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-brand-surface font-sans"
    >
      {/* Header */}
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

          <Text className="text-white font-black text-xl tracking-tight">Xác thực OTP</Text>

          <View className="w-12 h-12 rounded-2xl bg-brand-primary/20 items-center justify-center border border-brand-primary/20 backdrop-blur-md">
            <MaterialCommunityIcons name="shield-key" size={24} color="#0EA5E9" />
          </View>
        </View>

        <View className="mt-10 items-center px-10 relative z-10">
          <View className="w-20 h-20 rounded-[2.5rem] bg-brand-primary items-center justify-center mb-8 shadow-2xl shadow-brand-primary/40">
            <MaterialCommunityIcons name="email-check-outline" size={40} color="white" />
          </View>
          <Text className="text-white font-black text-3xl tracking-tight text-center">
            Xác thực Email
          </Text>
          <Text className="text-slate-400 text-center mt-4 font-medium leading-6">
            Hệ thống đã gửi mã xác thực 6 chữ số đến địa chỉ{"\n"}
            <Text className="text-brand-primary font-black">{params.email || "của bạn"}</Text>
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-8 pt-12 overflow-visible">
        <View className="flex-row justify-between mb-12">
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputs.current[index] = ref;
              }}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectionColor="#0EA5E9"
              className={`w-[14%] aspect-square rounded-[1.25rem] border-2 text-center text-3xl shadow-sm transition-all ${
                digit ? "border-brand-primary bg-brand-primary/5 text-brand-primary font-black shadow-brand-primary/10" : "bg-white border-slate-100 text-slate-900 font-bold"
              }`}
            />
          ))}
        </View>

        <Pressable
          onPress={handleVerify}
          disabled={otp.some((d) => !d)}
          className={`rounded-[2rem] py-5 items-center justify-center shadow-xl active:scale-95 transition-all ${
            otp.every((d) => d) ? "bg-brand-primary shadow-brand-primary/40 scale-[1.02]" : "bg-slate-100 opacity-50 shadow-none"
          }`}
        >
          <Text className={`font-black text-xl ${
            otp.every((d) => d) ? "text-white" : "text-slate-400"
          }`}>Xác thực & Tiếp tục</Text>
        </Pressable>

        <View className="mt-12 items-center">
          <Text className="text-slate-500 font-medium">Bạn không nhận được mã?</Text>
          <Pressable className="mt-4 active:opacity-60">
            <Text className="text-brand-primary font-black text-lg tracking-tight px-6 py-3 bg-brand-primary/5 rounded-2xl border border-brand-primary/10">Gửi lại mã ngay</Text>
          </Pressable>
        </View>
      </ScrollView>

      <View className="p-8 items-center bg-white/50 backdrop-blur-md rounded-t-[3rem] border-t border-slate-50">
          <Text className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Bảo mật bởi SSL 256-bit encryption</Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default VerifyPage;
