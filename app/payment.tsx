import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

type PaymentMethod = {
  id: string;
  name: string;
  icon: string;
  iconType: "MaterialCommunityIcons" | "FontAwesome5";
  description: string;
};

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "qr_pay",
    name: "QR Pay",
    icon: "qrcode-scan",
    iconType: "MaterialCommunityIcons",
    description: "Scan QR code to pay instantly",
  },
  {
    id: "momo",
    name: "MoMo Wallet",
    icon: "wallet",
    iconType: "MaterialCommunityIcons",
    description: "Pay with MoMo e-wallet",
  },
  {
    id: "bank_transfer",
    name: "Bank Transfer",
    icon: "university",
    iconType: "FontAwesome5",
    description: "Transfer via mobile banking app",
  },
  {
    id: "credit_card",
    name: "Credit Card",
    icon: "credit-card",
    iconType: "MaterialCommunityIcons",
    description: "Visa, Mastercard, JCB",
  },
];

const PaymentPage = () => {
  const params = useLocalSearchParams<{
    totalAmount?: string;
    routeData?: string;
    selectedSeats?: string;
  }>();

  const [selectedMethod, setSelectedMethod] = useState<string>("qr_pay");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatVnd = (value: number) => {
    return `${new Intl.NumberFormat("vi-VN").format(value)} ₫`;
  };

  const total = params.totalAmount ? parseInt(params.totalAmount) : 320000;
  const routeInfo = params.routeData ? JSON.parse(params.routeData) : {
    origin: "Hà Nội",
    destination: "Hải Phòng",
    plannedStartTime: "2026-03-04T07:30:00Z",
    routeCode: "HAN-HPH-06",
    vehicleType: "LIMOUSINE",
  };
  const seats = params.selectedSeats ? JSON.parse(params.selectedSeats) : ["A1", "A2"];

  return (
    <View className="flex-1 bg-[#F5F7FA]">
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

          <Text className="text-white font-black text-xl tracking-tight">Checkout</Text>

          <View className="h-12 w-12 rounded-2xl bg-white/10 items-center justify-center border border-white/10">
            <MaterialCommunityIcons name="help-circle-outline" size={24} color="white" />
          </View>
        </View>

        {/* Amount in Header */}
        <View className="mt-8 items-center">
          <Text className="text-white/60 text-sm font-medium mb-1">Total to Pay</Text>
          <Text className="text-white font-black text-4xl tracking-tighter">
            {formatVnd(total)}
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 -mt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 140 }}
      >
        {/* Timer floating badge */}
        <View className="flex-row justify-center mb-6">
          <View className="bg-white border border-gray-100 rounded-full px-6 py-3 flex-row items-center shadow-lg">
            <View className="bg-red-50 rounded-full p-2 mr-3">
              <MaterialCommunityIcons name="clock-fast" size={20} color="#FF6B6B" />
            </View>
            <Text className="text-gray-500 font-semibold mr-2">Secure checkout:</Text>
            <Text className="text-[#FF6B6B] font-black">{formatTime(timeLeft)}</Text>
          </View>
        </View>

        {/* Order Details Accordion-style */}
        <View className="bg-white rounded-[32px] p-6 border border-gray-100 mb-6 shadow-sm">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Booking Reference</Text>
              <Text className="text-lg font-black text-gray-900">#GRX-{Math.floor(100000 + Math.random() * 900000)}</Text>
            </View>
            <View className="bg-[#EAFBF9] px-3 py-1 rounded-full">
              <Text className="text-[#12B3A8] text-xs font-bold">Pending</Text>
            </View>
          </View>

          <View className="h-[1px] bg-gray-50 w-full mb-6" />

          <View className="flex-row items-start mb-6">
            <View className="mr-4 items-center">
              <View className="w-3 h-3 rounded-full bg-[#12B3A8] border-2 border-[#12B3A8]/20" />
              <View className="w-[1px] h-10 bg-gray-200 border-dashed border-[1px]" />
              <View className="w-3 h-3 rounded-full bg-gray-300 border-2 border-gray-100" />
            </View>
            <View className="flex-1">
              <View className="mb-4">
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider">Departure</Text>
                <Text className="text-gray-900 font-extrabold text-base">{routeInfo.origin}</Text>
              </View>
              <View>
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider">Arrival</Text>
                <Text className="text-gray-900 font-extrabold text-base">{routeInfo.destination}</Text>
              </View>
            </View>
          </View>

          <View className="flex-row justify-between pt-4 border-t border-gray-50">
            <View>
              <Text className="text-gray-400 text-[10px] font-bold uppercase mb-1">Bus Code</Text>
              <Text className="text-gray-900 font-black text-sm">{routeInfo.routeCode}</Text>
            </View>
            <View>
              <Text className="text-gray-400 text-[10px] font-bold uppercase mb-1">Vehicle</Text>
              <Text className="text-gray-900 font-black text-sm">{routeInfo.vehicleType}</Text>
            </View>
            <View className="items-end">
              <Text className="text-gray-400 text-[10px] font-bold uppercase mb-1">Selected Seats</Text>
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="seat-passenger" size={14} color="#12B3A8" style={{ marginRight: 4 }} />
                <Text className="text-[#12B3A8] font-black text-sm">{seats.join(", ")}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment Methods */}
        <View className="flex-row items-center justify-between mb-4 px-2">
          <Text className="text-lg font-black text-gray-900">Payment Method</Text>
          <Text className="text-gray-400 text-xs font-bold">Step 2 of 2</Text>
        </View>

        {PAYMENT_METHODS.map((method) => (
          <Pressable
            key={method.id}
            onPress={() => setSelectedMethod(method.id)}
            className={`flex-row items-center bg-white p-5 rounded-[28px] mb-4 border-2 ${
              selectedMethod === method.id ? "border-[#12B3A8]" : "border-transparent"
            } shadow-sm`}
          >
            <View className={`w-14 h-14 rounded-2xl items-center justify-center ${
              selectedMethod === method.id ? "bg-[#12B3A8]" : "bg-gray-50"
            }`}>
              {method.iconType === "MaterialCommunityIcons" ? (
                <MaterialCommunityIcons
                  name={method.icon as any}
                  size={28}
                  color={selectedMethod === method.id ? "white" : "#687076"}
                />
              ) : (
                <FontAwesome5
                  name={method.icon}
                  size={24}
                  color={selectedMethod === method.id ? "white" : "#687076"}
                />
              )}
            </View>

            <View className="flex-1 ml-4">
              <Text className={`font-black text-lg ${
                selectedMethod === method.id ? "text-gray-900" : "text-gray-700"
              }`}>
                {method.name}
              </Text>
              <Text className="text-gray-400 text-xs font-semibold mt-1">{method.description}</Text>
            </View>

            <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
              selectedMethod === method.id ? "border-[#12B3A8] bg-[#12B3A8]/10" : "border-gray-200"
            }`}>
              {selectedMethod === method.id && (
                <View className="w-3 h-3 rounded-full bg-[#12B3A8]" />
              )}
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* Bottom Action Footer */}
      <View
        className="absolute bottom-0 left-0 right-0 px-6 pb-10 pt-6"
        style={{
          backgroundColor: "#rgba(245,247,250,0.98)",
          borderTopLeftRadius: 36,
          borderTopRightRadius: 36,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -10 },
          shadowOpacity: 0.05,
          shadowRadius: 20,
          elevation: 20,
        }}
      >
        <Pressable
          onPress={() => {
            router.replace("/");
          }}
          className="bg-[#12B3A8] rounded-[24px] py-5 items-center justify-center shadow-xl shadow-[#12B3A8]/30"
        >
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="shield-check" size={20} color="white" style={{ marginRight: 8 }} />
            <Text className="text-white font-black text-lg">
              Confirm Payment
            </Text>
          </View>
        </Pressable>

        <View className="mt-4 flex-row justify-center items-center">
          <MaterialIcons name="lock" size={12} color="#9BA1A6" />
          <Text className="text-[#9BA1A6] text-[10px] font-bold uppercase tracking-widest ml-1">
            Secure 256-bit SSL encrypted payment
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PaymentPage;
