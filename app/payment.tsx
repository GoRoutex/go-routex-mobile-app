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
    name: "Quét mã QR",
    icon: "qrcode-scan",
    iconType: "MaterialCommunityIcons",
    description: "Thanh toán nhanh qua ứng dụng Ngân hàng",
  },
  {
    id: "momo",
    name: "Ví MoMo",
    icon: "wallet",
    iconType: "MaterialCommunityIcons",
    description: "Thanh toán qua ví điện tử MoMo",
  },
  {
    id: "bank_transfer",
    name: "Chuyển khoản",
    icon: "university",
    iconType: "FontAwesome5",
    description: "Chuyển khoản ngân hàng 24/7",
  },
  {
    id: "credit_card",
    name: "Thẻ Quốc tế",
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
    <View className="flex-1 bg-brand-surface font-sans">
      {/* Header */}
      <View
        className="w-full bg-brand-dark pt-16 pb-14 overflow-hidden relative"
        style={{
          borderBottomLeftRadius: 60,
          borderBottomRightRadius: 60,
        }}
      >
        <View className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
        <View className="flex-row items-center justify-between px-8 relative z-10">
          <Pressable
            onPress={() => router.back()}
            className="h-14 w-14 rounded-2xl bg-white/10 items-center justify-center border border-white/5 backdrop-blur-md active:scale-95"
          >
            <MaterialIcons name="keyboard-arrow-left" size={36} color="white" />
          </Pressable>

          <View className="items-center">
            <Text className="text-white font-black text-2xl tracking-tight">Thanh toán</Text>
            <Text className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1 opacity-70">Xác nhận đơn hàng</Text>
          </View>

          <View className="h-14 w-14 rounded-2xl bg-brand-primary/20 items-center justify-center border border-brand-primary/20 backdrop-blur-md">
            <MaterialCommunityIcons name="shield-check" size={28} color="#0EA5E9" />
          </View>
        </View>

        {/* Amount in Header */}
        <View className="mt-10 items-center relative z-10">
          <Text className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] mb-2">Tổng tiền cần thanh toán</Text>
          <Text className="text-white font-black text-5xl tracking-tighter">
            {formatVnd(total)}
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 -mt-8"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 160 }}
      >
        {/* Timer floating badge */}
        <View className="flex-row justify-center mb-8">
          <View className="bg-white border border-slate-100 rounded-3xl px-8 py-4 flex-row items-center shadow-2xl shadow-slate-200/50">
            <View className="bg-rose-50 rounded-2xl p-2.5 mr-4 shadow-sm">
              <MaterialCommunityIcons name="clock-fast" size={20} color="#F43F5E" />
            </View>
            <View>
              <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-3">Phiên giao dịch hết hạn sau</Text>
              <Text className="text-slate-900 font-extrabold text-lg tracking-tighter mt-0.5">{formatTime(timeLeft)}</Text>
            </View>
          </View>
        </View>

        {/* Order Details Accordion-style */}
        <View className="bg-white rounded-[2.5rem] p-8 border border-slate-100 mb-8 shadow-2xl shadow-slate-200/40 relative overflow-hidden">
          <View className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
          <View className="flex-row items-center justify-between mb-8 relative z-10">
            <View>
              <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Mã đặt vé của bạn</Text>
              <Text className="text-xl font-black text-slate-900 tracking-tight">#GRX-{Math.floor(100000 + Math.random() * 900000)}</Text>
            </View>
            <View className="bg-brand-primary/10 px-5 py-2 rounded-2xl border border-brand-primary/10">
              <Text className="text-brand-primary text-xs font-black">Chờ xử lý</Text>
            </View>
          </View>

          <View className="h-[2px] bg-slate-50 w-full mb-8" />

          <View className="flex-row items-start mb-8 px-2 relative z-10">
            <View className="mr-6 items-center">
              <View className="w-4 h-4 rounded-full bg-brand-primary border-4 border-brand-primary/20" />
              <View className="w-[2px] h-12 bg-slate-100 border-dashed border-[1px]" />
              <View className="w-4 h-4 rounded-full bg-slate-200 border-4 border-slate-50" />
            </View>
            <View className="flex-1">
              <View className="mb-6">
                <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1.5">Điểm khởi hành</Text>
                <Text className="text-slate-900 font-black text-lg tracking-tight">{routeInfo.origin}</Text>
              </View>
              <View>
                <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1.5">Điểm kết thúc</Text>
                <Text className="text-slate-900 font-black text-lg tracking-tight">{routeInfo.destination}</Text>
              </View>
            </View>
          </View>

          <View className="flex-row justify-between pt-8 border-t border-slate-50 relative z-10">
            <View>
              <Text className="text-slate-400 text-[10px] font-black uppercase mb-1.5">Mã chuyến</Text>
              <Text className="text-slate-900 font-black text-sm tracking-tight">{routeInfo.routeCode}</Text>
            </View>
            <View>
              <Text className="text-slate-400 text-[10px] font-black uppercase mb-1.5">Dòng xe</Text>
              <Text className="text-slate-900 font-black text-sm tracking-tight">{routeInfo.vehicleType}</Text>
            </View>
            <View className="items-end">
              <Text className="text-slate-400 text-[10px] font-black uppercase mb-1.5">Chỗ đã chọn</Text>
              <View className="flex-row items-center bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                <MaterialCommunityIcons name="seat-passenger" size={16} color="#0EA5E9" style={{ marginRight: 6 }} />
                <Text className="text-brand-primary font-black text-sm">{seats.join(", ")}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment Methods */}
        <View className="flex-row items-center justify-between mb-6 px-4">
          <Text className="text-2xl font-black text-slate-900 tracking-tight">Phương thức thanh toán</Text>
          <View className="bg-slate-900/5 px-3 py-1 rounded-lg">
             <Text className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Bước 2/2</Text>
          </View>
        </View>

        {PAYMENT_METHODS.map((method) => (
          <Pressable
            key={method.id}
            onPress={() => setSelectedMethod(method.id)}
            className={`flex-row items-center bg-white p-6 rounded-[2.5rem] mb-5 border-2 transition-all ${
              selectedMethod === method.id ? "border-brand-primary bg-brand-primary/5 shadow-2xl shadow-brand-primary/10 scale-[1.02]" : "border-white shadow-sm shadow-slate-200"
            }`}
          >
            <View className={`w-16 h-16 rounded-[20px] items-center justify-center shadow-sm ${
              selectedMethod === method.id ? "bg-brand-primary" : "bg-slate-50 border border-slate-100"
            }`}>
              {method.iconType === "MaterialCommunityIcons" ? (
                <MaterialCommunityIcons
                  name={method.icon as any}
                  size={32}
                  color={selectedMethod === method.id ? "white" : "#64748B"}
                />
              ) : (
                <FontAwesome5
                  name={method.icon}
                  size={28}
                  color={selectedMethod === method.id ? "white" : "#64748B"}
                />
              )}
            </View>

            <View className="flex-1 ml-5">
              <Text className={`font-black text-xl tracking-tight ${
                selectedMethod === method.id ? "text-slate-900" : "text-slate-800"
              }`}>
                {method.name}
              </Text>
              <Text className="text-slate-400 text-xs font-bold mt-1 tracking-tight">{method.description}</Text>
            </View>

            <View className={`w-8 h-8 rounded-full border-2 items-center justify-center transition-all ${
              selectedMethod === method.id ? "border-brand-primary bg-brand-primary" : "border-slate-200"
            }`}>
              {selectedMethod === method.id && (
                <View className="w-3 h-3 rounded-full bg-white shadow-sm" />
              )}
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* Bottom Action Footer */}
      <View
        className="absolute bottom-0 left-0 right-0 px-8 pb-12 pt-8"
        style={{
          backgroundColor: "#rgba(255,255,255,0.9)",
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          shadowColor: "#0F172A",
          shadowOffset: { width: 0, height: -15 },
          shadowOpacity: 0.1,
          shadowRadius: 30,
          elevation: 30,
        }}
      >
        <Pressable
          onPress={() => {
            router.replace("/");
          }}
          className="bg-brand-primary rounded-3xl py-6 items-center justify-center shadow-2xl shadow-brand-primary/40 active:scale-[0.98] transition-all"
        >
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="lock-check" size={24} color="white" style={{ marginRight: 10 }} />
            <Text className="text-white font-black text-xl">
              Xác nhận Thanh toán
            </Text>
          </View>
        </Pressable>

        <View className="mt-5 flex-row justify-center items-center opacity-60">
          <MaterialIcons name="security" size={14} color="#64748B" />
          <Text className="text-slate-500 text-[10px] font-black uppercase tracking-[0.15em] ml-2">
            Thanh toán an toàn mã hóa SSL 256-bit
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PaymentPage;
