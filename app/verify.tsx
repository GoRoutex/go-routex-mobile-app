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
      className="flex-1 bg-[#F5F7FA]"
    >
      {/* Header */}
      <View
        className="w-full bg-[#192031] pt-16 pb-10"
        style={{
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}
      >
        <View className="flex-row items-center justify-between px-6">
          <Pressable
            onPress={() => router.back()}
            className="h-12 w-12 rounded-2xl bg-white/10 items-center justify-center border border-white/10"
          >
            <MaterialIcons name="keyboard-arrow-left" size={32} color="white" />
          </Pressable>

          <Text className="text-white font-black text-xl tracking-tight">Verification</Text>

          <View className="w-12" />
        </View>

        <View className="mt-8 items-center px-10">
          <View className="w-20 h-20 rounded-[28px] bg-[#12B3A8] items-center justify-center mb-6 shadow-xl shadow-[#12B3A8]/40">
            <MaterialCommunityIcons name="shield-check" size={40} color="white" />
          </View>
          <Text className="text-white font-black text-2xl tracking-tight text-center">
            Verify your email
          </Text>
          <Text className="text-white/60 text-center mt-3 font-medium leading-5">
            Please enter the 6-digit code sent to{"\n"}
            <Text className="text-[#4AE8DD] font-bold">{params.email || "your email"}</Text>
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-10">
        <View className="flex-row justify-between mb-10">
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
              selectionColor="#12B3A8"
              className="w-[14%] aspect-square bg-white rounded-2xl border-2 border-gray-100 text-center text-2xl font-black text-gray-900 shadow-sm"
              style={digit ? { borderColor: "#12B3A8", backgroundColor: "#EAFBF9" } : {}}
            />
          ))}
        </View>

        <Pressable
          onPress={handleVerify}
          disabled={otp.some((d) => !d)}
          className={`rounded-[24px] py-5 items-center justify-center shadow-lg ${
            otp.every((d) => d) ? "bg-[#12B3A8] shadow-[#12B3A8]/30" : "bg-gray-300"
          }`}
        >
          <Text className="text-white font-black text-lg">Verify & Continue</Text>
        </Pressable>

        <View className="mt-8 items-center">
          <Text className="text-gray-500 font-medium">Didn't receive the code?</Text>
          <Pressable className="mt-2">
            <Text className="text-[#12B3A8] font-bold text-base">Resend Code</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default VerifyPage;
