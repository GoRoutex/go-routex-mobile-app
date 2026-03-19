import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import React, { useMemo, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

type StopPoint = {
  id: string;
  stopOrder: string;
  routeId: string;
  plannedArrivalTime?: string;
  plannedDepartureTime?: string;
  note?: string;
};

type RouteItem = {
  id: string;
  pickupBranch?: string | null;
  origin: string;
  destination: string;
  availableSeats?: number | null;
  plannedStartTime: string;
  plannedEndTime: string;
  routeCode: string;
  vehiclePlate?: string | null;
  vehicleType?: string | null;
  seatCapacity?: number | null;
  stopPoints?: StopPoint[] | null;
  price?: number | null;
  currency?: string | null;
};

const pad2 = (n: number) => String(n).padStart(2, "0");

const formatTimeHHmm = (iso?: string) => {
  if (!iso) return "--:--";
  const d = new Date(iso);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
};

const formatDateDDMMYYYY = (iso?: string) => {
  if (!iso) return "--/--/----";
  const d = new Date(iso);
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
};

const durationText = (startIso?: string, endIso?: string) => {
  if (!startIso || !endIso) return "--";
  const s = new Date(startIso).getTime();
  const e = new Date(endIso).getTime();
  const diff = Math.max(0, e - s);

  const totalMin = Math.floor(diff / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;

  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

const formatVnd = (value?: number | null) => {
  if (typeof value !== "number") return "—";
  return `${new Intl.NumberFormat("vi-VN").format(value)} ₫`;
};

const Booking = () => {
  const params = useLocalSearchParams<{
    routeData?: string | string[];
    selectedSeats?: string | string[];
  }>();

  const rawRouteData = params?.routeData;
  const rawSelectedSeats = params?.selectedSeats;

  const routeDataStr = Array.isArray(rawRouteData)
    ? rawRouteData[0]
    : rawRouteData;
  const selectedSeatsStr = Array.isArray(rawSelectedSeats)
    ? rawSelectedSeats[0]
    : rawSelectedSeats;

  const routeData: RouteItem = useMemo(() => {
    const mockRouteData: RouteItem = {
      id: "09b6fc7c-c3ce-4ed6-9093-ada0db903546",
      pickupBranch: "233 Điện Biên Phủ",
      origin: "Hà Nội",
      destination: "Hải Phòng",
      availableSeats: 32,
      plannedStartTime: "2026-03-04T07:30:00Z",
      plannedEndTime: "2026-03-04T13:30:00Z",
      routeCode: "HAN-HPH-06",
      vehiclePlate: "51B-123.45",
      vehicleType: "LIMOUSINE",
      seatCapacity: 34,
      price: 320000,
      currency: "VND",
      stopPoints: [],
    };

    if (!routeDataStr) return mockRouteData;
    try {
      return JSON.parse(routeDataStr);
    } catch {
      return mockRouteData;
    }
  }, [routeDataStr]);

  const selectedSeats: string[] = useMemo(() => {
    if (!selectedSeatsStr) return [];
    try {
      return JSON.parse(selectedSeatsStr);
    } catch {
      return [];
    }
  }, [selectedSeatsStr]);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [note, setNote] = useState("");

  const unitPrice = routeData.price ?? 0;
  const totalAmount = unitPrice * selectedSeats.length;

  const canContinue =
    customerName.trim().length > 0 &&
    customerPhone.trim().length > 0 &&
    selectedSeats.length > 0;

  return (
    <View className="flex-1 bg-brand-surface font-sans">
      {/* Header */}
      <View
        className="w-full bg-brand-dark pt-16 pb-12 overflow-hidden relative"
        style={{
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
        }}
      >
        <View className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/10 rounded-full -mr-40 -mt-40 blur-3xl opacity-50" />
        <View className="flex-row items-center justify-between px-8 relative z-10">
          <Pressable
            onPress={() => router.back()}
            className="h-12 w-12 rounded-2xl bg-white/10 items-center justify-center border border-white/5 backdrop-blur-md active:scale-95 transition-all"
          >
            <MaterialIcons name="keyboard-arrow-left" size={32} color="white" />
          </Pressable>

          <Text className="text-white font-black text-xl tracking-tight">Chi tiết đặt vé</Text>

          <View className="w-12 h-12 rounded-2xl bg-brand-primary/20 items-center justify-center border border-brand-primary/20 backdrop-blur-md">
            <MaterialCommunityIcons name="ticket-confirmation-outline" size={24} color="#0EA5E9" />
          </View>
        </View>

        <View className="mt-8 px-8 flex-row justify-between items-end relative z-10">
          <View>
            <Text className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">Hành trình</Text>
            <Text className="text-white text-3xl font-black tracking-tighter">
              {routeData.origin} <Text className="text-brand-primary">→</Text> {routeData.destination}
            </Text>
          </View>
          <View className="bg-brand-primary/20 px-4 py-2 rounded-2xl border border-brand-primary/20">
             <Text className="text-brand-primary font-black text-xs">{routeData.routeCode}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-6 -mt-8"
        contentContainerStyle={{ paddingBottom: 220 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Route summary card */}
        <View className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 border border-slate-50">
          <View className="flex-row justify-between items-center bg-slate-50/50 p-4 rounded-[2rem] border border-slate-50 mb-8">
            <View className="flex-row items-center">
               <View className="w-10 h-10 rounded-xl bg-white items-center justify-center shadow-sm border border-slate-50 mr-3">
                  <MaterialCommunityIcons name="bus-side" size={20} color="#0EA5E9" />
               </View>
               <Text className="text-slate-900 font-black tracking-tight">{routeData.vehicleType || "—"}</Text>
            </View>
            <Text className="text-slate-400 font-black text-xs tracking-widest">{routeData.vehiclePlate || "—"}</Text>
          </View>

          <View className="flex-row justify-between items-center px-2">
            <View>
              <Text className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">Khởi hành</Text>
              <Text className="text-2xl font-black text-slate-900 tracking-tighter">
                {formatTimeHHmm(routeData.plannedStartTime)}
              </Text>
              <Text className="text-slate-500 font-bold text-xs mt-1">
                {formatDateDDMMYYYY(routeData.plannedStartTime)}
              </Text>
            </View>

            <View className="items-center flex-1 px-4">
              <View className="bg-brand-primary/5 px-3 py-1 rounded-full border border-brand-primary/10 mb-2">
                <Text className="text-brand-primary font-black text-[10px]">
                  {durationText(routeData.plannedStartTime, routeData.plannedEndTime)}
                </Text>
              </View>
              <View className="flex-row items-center w-full">
                <View className="h-1 w-1 rounded-full bg-brand-primary mr-1" />
                <View className="h-[2px] flex-1 bg-slate-100 rounded-full" />
                <View className="h-1 w-1 rounded-full bg-slate-300 ml-1" />
              </View>
            </View>

            <View className="items-end">
              <Text className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">Kết thúc</Text>
              <Text className="text-2xl font-black text-slate-900 tracking-tighter">
                {formatTimeHHmm(routeData.plannedEndTime)}
              </Text>
              <Text className="text-slate-500 font-bold text-xs mt-1">
                {formatDateDDMMYYYY(routeData.plannedEndTime)}
              </Text>
            </View>
          </View>

          <View className="mt-8 pt-8 border-t border-slate-50">
            <View className="flex-row items-start">
               <View className="w-10 h-10 rounded-full bg-brand-primary/10 items-center justify-center mr-4">
                  <MaterialCommunityIcons name="map-marker-radius-outline" size={20} color="#0EA5E9" />
               </View>
               <View className="flex-1">
                  <Text className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">Điểm đón khách</Text>
                  <Text className="text-slate-900 font-bold text-sm leading-5">
                    {routeData.pickupBranch || "Chưa xác định"}
                  </Text>
               </View>
            </View>
          </View>
        </View>

        {/* Selected seats card */}
        <View className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 border border-slate-50 mt-6">
          <View className="flex-row items-center mb-6">
            <View className="w-8 h-8 rounded-lg bg-indigo-50 items-center justify-center mr-3">
              <MaterialCommunityIcons name="seat-passenger" size={18} color="#6366F1" />
            </View>
            <Text className="text-lg font-black text-slate-900 tracking-tight">Số ghế đã chọn</Text>
          </View>

          {selectedSeats.length === 0 ? (
            <View className="bg-slate-50 rounded-2xl p-4 border border-dashed border-slate-200">
              <Text className="text-sm text-slate-400 font-medium text-center italic">Chưa có ghế nào được chọn</Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap">
              {selectedSeats.map((seat) => (
                <View
                  key={seat}
                  className="bg-brand-primary rounded-2xl px-5 py-3 mr-3 mb-3 shadow-sm shadow-brand-primary/20"
                >
                  <Text className="text-white font-black text-base">{seat}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Customer information card */}
        <View className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 border border-slate-50 mt-6">
          <View className="flex-row items-center mb-8">
            <View className="w-8 h-8 rounded-lg bg-emerald-50 items-center justify-center mr-3">
              <MaterialCommunityIcons name="account-edit-outline" size={18} color="#10B981" />
            </View>
            <Text className="text-lg font-black text-slate-900 tracking-tight">Thông tin hành khách</Text>
          </View>

          <View className="space-y-6">
            <View>
              <Text className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-3 ml-1">Họ và tên *</Text>
              <TextInput
                value={customerName}
                onChangeText={setCustomerName}
                placeholder="Ví dụ: Nguyễn Văn A"
                className="bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-slate-900 font-bold text-base"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View className="mt-4">
              <Text className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-3 ml-1">Số điện thoại *</Text>
              <TextInput
                value={customerPhone}
                onChangeText={setCustomerPhone}
                placeholder="Ví dụ: 0912345678"
                keyboardType="phone-pad"
                className="bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-slate-900 font-bold text-base"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View className="mt-4">
              <Text className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-3 ml-1">Địa chỉ Email</Text>
              <TextInput
                value={customerEmail}
                onChangeText={setCustomerEmail}
                placeholder="Ví dụ: hotro@goroutex.vn"
                keyboardType="email-address"
                autoCapitalize="none"
                className="bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-slate-900 font-bold text-base"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View className="mt-4">
              <Text className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-3 ml-1">Ghi chú (nếu có)</Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Thêm yêu cầu hoặc ghi chú..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className="bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-slate-900 font-bold text-base min-h-[120px]"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>
        </View>

        {/* Payment summary card */}
        <View className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 border border-slate-50 mt-6">
          <View className="flex-row items-center mb-8">
            <View className="w-8 h-8 rounded-lg bg-orange-50 items-center justify-center mr-3">
              <MaterialCommunityIcons name="wallet-outline" size={18} color="#F59E0B" />
            </View>
            <Text className="text-lg font-black text-slate-900 tracking-tight">Chi tiết thanh toán</Text>
          </View>

          <View className="space-y-4">
            <View className="flex-row justify-between items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-50 mb-3">
              <Text className="text-slate-500 font-bold text-sm">Số lượng ghế</Text>
              <Text className="text-slate-900 font-black text-base">{selectedSeats.length}</Text>
            </View>

            <View className="flex-row justify-between items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-50 mb-3">
              <Text className="text-slate-500 font-bold text-sm">Đơn giá</Text>
              <Text className="text-slate-900 font-black text-base">{formatVnd(unitPrice)}</Text>
            </View>

            <View className="mt-4 pt-6 border-t border-slate-100 flex-row justify-between items-center px-2">
              <Text className="text-lg font-black text-slate-900">Tổng cộng</Text>
              <Text className="text-2xl font-black text-brand-primary tracking-tight">
                {formatVnd(totalAmount)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom action area */}
      <View
        className="absolute bottom-0 left-0 right-0 px-8 pb-10 pt-6 bg-white/90 backdrop-blur-3xl rounded-t-[3rem] border-t border-slate-100 shadow-2xl shadow-brand-dark/20"
      >
        <View className="bg-slate-50/80 rounded-3xl px-6 py-4 mb-6 border border-slate-50">
          <View className="flex-row justify-between items-center">
            <View className="flex-1 pr-4 border-r border-slate-200">
              <Text className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">Hành khách</Text>
              <Text className="text-slate-900 font-black text-base tracking-tight" numberOfLines={1}>
                {customerName.trim().length > 0 ? customerName : "Chưa nhập"}
              </Text>
            </View>

            <View className="items-end pl-4">
              <Text className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">Tạm tính</Text>
              <Text className="text-slate-900 font-black text-base tracking-tight">
                {formatVnd(totalAmount)}
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          disabled={!canContinue}
          onPress={() => {
            router.push({
              pathname: "/payment",
              params: {
                totalAmount: totalAmount.toString(),
                routeData: JSON.stringify(routeData),
                selectedSeats: JSON.stringify(selectedSeats),
              },
            });
          }}
          className={`rounded-3xl py-5 items-center justify-center shadow-2xl active:scale-[0.98] transition-all ${
            canContinue ? "bg-brand-primary shadow-brand-primary/40" : "bg-slate-100 opacity-60"
          }`}
        >
          <View className="flex-row items-center">
             <Text
                className={`font-black text-xl tracking-tight ${
                  canContinue ? "text-white" : "text-slate-400"
                }`}
              >
                Xác nhận đặt vé
              </Text>
              {canContinue && <MaterialIcons name="keyboard-arrow-right" size={24} color="white" style={{marginLeft: 4, marginTop: 2}} />}
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default Booking;
