import { View, Text, Pressable, Alert, ScrollView, ActivityIndicator } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import {
  bookingapi,
  GET_ALL_SEAT_PATH,
  HOLD_SEAT_PATH,
} from "@/utils/env";
import { genUUID, nowOffsetDateTime } from "@/utils/request";

type RouteSeatStatus = "AVAILABLE" | "HELD" | "SOLD" | "BLOCKED";

type HoldSeatRequest = {
  requestId: string;
  requestDateTime: string;
  channel: string;
  data: {
    routeId: string;
    seatNos: string[];
  };
};

type HoldSeatResponse = {
  requestId: string;
  requestDateTime: string;
  channel: string;
  result?: {
    responseCode: string;
    description: string;
  };
  data?: {
    routeId: string;
    seatNos: string[];
  };
};
type GetAllSeatRequest = {
  requestId: string;
  requestDateTime: string;
  channel: string;
  data: {
    routeId: string;
  };
};

type RouteSeatItems = {
  routeId: string;
  seatNo: string;
  status: RouteSeatStatus;
  ticketId?: string | null;
};

type GetAllSeatResponse = {
  requestId: string;
  requestDateTime: string;
  channel: string;
  result?: {
    responseCode: string;
    description: string;
  };
  data: RouteSeatItems[];
};

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

const mockRouteData: RouteItem = {
  id: "09b6fc7c-c3ce-4ed6-9093-ada0db903546",
  pickupBranch: "233 Dien Bien Phu",
  origin: "Hà Nội",
  destination: "Hải Phòng",
  availableSeats: 32,
  plannedStartTime: "2026-03-04T07:30:00Z",
  plannedEndTime: "2026-03-04T13:30:00Z",
  routeCode: "HAN-HPH-06",
  vehiclePlate: "51B-123.45",
  vehicleType: "LIMOUSINE",
  seatCapacity: 34,
  stopPoints: [
    {
      id: "d80f95a5-db24-499f-ac6e-bc92d02fbdc2",
      stopOrder: "1",
      routeId: "09b6fc7c-c3ce-4ed6-9093-ada0db903546",
      plannedArrivalTime: "2026-03-04T09:30:00Z",
      plannedDepartureTime: "2026-03-04T09:45:00Z",
      note: "Trạm Dừng Chân",
    },
  ],
};

const RouteDetail = () => {
  const params = useLocalSearchParams<{ routeData?: string | string[] }>();
  const raw = params?.routeData;
  const routeDataStr = Array.isArray(raw) ? raw[0] : raw;

  const [routeSeat, setRouteSeat] = useState<RouteSeatItems[]>([]);
  const [loadingSeat, setLoadingSeat] = useState(false);
  const [holdingSeat, setHoldingSeat] = useState(false);

  const handleContinue = async () => {
    if (selectedSeats.length === 0) {
      return;
    }

    const payload: HoldSeatRequest = {
      requestId: genUUID(),
      requestDateTime: nowOffsetDateTime(),
      channel: "ONL",
      data: {
        routeId: routeData.id,
        seatNos: selectedSeats,
      },
    };

    setHoldingSeat(true);

    try {
      const response = await bookingapi.post<HoldSeatResponse>(
        HOLD_SEAT_PATH,
        payload,
      );

      const resultCode = response.data?.result?.responseCode;

      if (resultCode && resultCode !== "0000") {
        Alert.alert(
          "Thông báo",
          response.data?.result?.description || "Giữ chỗ không thành công",
        );
        await fetchRouteSeats();
        return;
      }

      router.push({
        pathname: "/booking",
        params: {
          routeData: JSON.stringify(routeData),
          selectedSeats: JSON.stringify(selectedSeats),
        },
      });
    } catch (error: any) {
      console.log("Hold Seat Error: ", error?.response?.data ?? error);
      Alert.alert("Lỗi", "Không thể giữ chỗ các ghế đã chọn");
    } finally {
      setHoldingSeat(false);
    }
  };

  const routeData: RouteItem = useMemo(() => {
    if (!routeDataStr) return mockRouteData;

    try {
      return JSON.parse(routeDataStr);
    } catch {
      return mockRouteData;
    }
  }, [routeDataStr]);

  const fetchRouteSeats = useCallback(async () => {
    const payload: GetAllSeatRequest = {
      requestId: genUUID(),
      requestDateTime: nowOffsetDateTime(),
      channel: "ONL",
      data: {
        routeId: routeData.id,
      },
    };

    setLoadingSeat(true);
    try {
      const response = await bookingapi.post<GetAllSeatResponse>(
        GET_ALL_SEAT_PATH,
        payload,
      );

      setRouteSeat(response.data?.data ?? []);
    } catch (error: any) {
      console.log("Fetch Route Seat Error: ", error?.response.data ?? error);
      Alert.alert("Lỗi", "Không thể tải danh sách chỗ ngồi");
      setRouteSeat([]);
    } finally {
      setLoadingSeat(false);
    }
  }, [routeData.id]);

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const canContinue = selectedSeats.length > 0;
  const [bottomPanelHeight, setBottomPanelHeight] = useState(0);

  const seatStatusMap = useMemo(() => {
    const map = new Map<string, RouteSeatStatus>();
    routeSeat.forEach((seat) => {
      map.set(seat.seatNo, seat.status);
    });
    return map;
  }, [routeSeat]);

  const toggleSeat = (seatNo: string) => {
    const status = seatStatusMap.get(seatNo) ?? "AVAILABLE";
    if (status === "SOLD" || status === "HELD" || status === "BLOCKED") return;

    setSelectedSeats((prev) =>
      prev.includes(seatNo)
        ? prev.filter((s) => s !== seatNo)
        : [...prev, seatNo],
    );
  };

  useEffect(() => {
    fetchRouteSeats();
  }, [fetchRouteSeats]);

  const stops = [...(routeData.stopPoints ?? [])].sort(
    (a, b) =>
      (parseInt(a.stopOrder, 10) || 0) - (parseInt(b.stopOrder, 10) || 0),
  );

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

          <Text className="text-white font-black text-xl tracking-tight">Chọn chỗ ngồi</Text>

          <View className="w-12 h-12 rounded-2xl bg-brand-primary/20 items-center justify-center border border-brand-primary/20 backdrop-blur-md">
            <MaterialCommunityIcons name="bus-articulated-front" size={24} color="#0EA5E9" />
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
        contentContainerStyle={{
          paddingBottom: bottomPanelHeight + 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Route Info Card */}
        <View className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 border border-slate-50 mb-6">
           <View className="flex-row justify-between items-center mb-6">
              <View className="bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 flex-row items-center">
                 <View className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
                 <Text className="text-emerald-700 font-black text-xs uppercase tracking-widest">
                   {routeData.availableSeats ?? 0} ghế trống
                 </Text>
              </View>
              <View className="flex-row items-center">
                 <MaterialCommunityIcons name="bus-side" size={20} color="#94A3B8" />
                 <Text className="text-slate-400 font-black text-xs ml-2 tracking-widest">{routeData.vehiclePlate || "—"}</Text>
              </View>
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
        </View>

        {/* Seat Map Area */}
        <View className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 border border-slate-50">
          <View className="flex-row items-center justify-between mb-8">
            <Text className="text-lg font-black text-slate-900 tracking-tight">Sơ đồ chỗ ngồi</Text>
            <View className="w-10 h-10 rounded-xl bg-slate-50 items-center justify-center border border-slate-100">
               <MaterialCommunityIcons name="steering" size={20} color="#94A3B8" />
            </View>
          </View>

          {/* Legend */}
          <View className="flex-row justify-between mb-10 bg-slate-50/50 p-4 rounded-3xl border border-slate-50">
            <View className="items-center">
              <View className="w-6 h-6 rounded-lg bg-white border-2 border-slate-200 mb-2 shadow-sm" />
              <Text className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Trống</Text>
            </View>
            <View className="items-center">
              <View className="w-6 h-6 rounded-lg bg-brand-primary mb-2 shadow-sm shadow-brand-primary/30" />
              <Text className="text-[10px] text-brand-primary font-black uppercase tracking-widest">Đang chọn</Text>
            </View>
            <View className="items-center">
              <View className="w-6 h-6 rounded-lg bg-slate-200 mb-2" />
              <Text className="text-[10px] text-slate-300 font-black uppercase tracking-widest">Đã bán</Text>
            </View>
            <View className="items-center">
              <View className="w-6 h-6 rounded-lg bg-rose-100 border border-rose-200 mb-2" />
              <Text className="text-[10px] text-rose-300 font-black uppercase tracking-widest">Đang giữ</Text>
            </View>
          </View>

          {loadingSeat ? (
            <View className="py-20 items-center">
              <ActivityIndicator size="large" color="#0EA5E9" />
              <Text className="text-slate-400 font-bold mt-4">Đang tải sơ đồ...</Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-between px-2">
              {routeSeat
                .slice()
                .sort((a, b) =>
                  a.seatNo.localeCompare(b.seatNo, undefined, {
                    numeric: true,
                  }),
                )
                .map((seat) => {
                  const seatNo = seat.seatNo;
                  const status = seat.status ?? "AVAILABLE";
                  const isSold = status === "SOLD";
                  const isHeld = status === "HELD";
                  const isBlocked = status === "BLOCKED";
                  const isSelected = selectedSeats.includes(seatNo);
                  const disabled = isSold || isHeld || isBlocked;

                  let containerClasses = "w-[22%] aspect-square mb-4 rounded-2xl border-2 items-center justify-center transition-all ";
                  let textClasses = "font-black text-sm ";

                  if (isSold) {
                    containerClasses += "bg-slate-100 border-slate-100 opacity-40";
                    textClasses += "text-slate-400";
                  } else if (isHeld) {
                    containerClasses += "bg-rose-50 border-rose-100";
                    textClasses += "text-rose-200";
                  } else if (isBlocked) {
                    containerClasses += "bg-slate-200 border-slate-200";
                    textClasses += "text-slate-400";
                  } else if (isSelected) {
                    containerClasses += "bg-brand-primary border-brand-primary shadow-lg shadow-brand-primary/30 scale-110 z-10";
                    textClasses += "text-white";
                  } else {
                    containerClasses += "bg-white border-slate-50 shadow-sm shadow-slate-100";
                    textClasses += "text-slate-900";
                  }

                  return (
                    <Pressable
                      key={`${seat.routeId}-${seatNo}`}
                      disabled={disabled}
                      onPress={() => toggleSeat(seatNo)}
                      className={containerClasses}
                    >
                      <Text className={textClasses}>{seatNo}</Text>
                    </Pressable>
                  );
                })}
            </View>
          )}
        </View>

        {/* Stop points Card */}
        <View className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 border border-slate-50 mt-6">
          <View className="flex-row items-center mb-6">
            <View className="w-8 h-8 rounded-lg bg-indigo-50 items-center justify-center mr-3">
              <MaterialCommunityIcons name="map-marker-path" size={18} color="#6366F1" />
            </View>
            <Text className="text-lg font-black text-slate-900 tracking-tight">Lịch trình chi tiết</Text>
          </View>

          {stops.length === 0 ? (
            <View className="bg-slate-50 rounded-2xl p-4 border border-dashed border-slate-200">
               <Text className="text-sm text-slate-400 font-medium text-center italic">Chưa có thông tin lịch trình chi tiết</Text>
            </View>
          ) : (
            <View className="pl-4 border-l-2 border-slate-50">
              {stops.map((s, idx) => (
                <View
                  key={s.id}
                  className={`relative pl-8 ${idx < stops.length - 1 ? "pb-8" : ""}`}
                >
                   {/* Timeline indicator */}
                   <View className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-indigo-400 z-10" />
                   {idx < stops.length - 1 && (
                     <View className="absolute left-[-2px] top-4 w-[2px] h-full bg-slate-50" />
                   )}

                   <View className="bg-slate-50/50 p-4 rounded-2xl border border-slate-50">
                      <Text className="text-slate-900 font-black text-sm mb-1">Trạm: {s.note || "Trạm dừng chân"}</Text>
                      <View className="flex-row items-center">
                         <MaterialCommunityIcons name="clock-outline" size={12} color="#94A3B8" />
                         <Text className="text-xs text-slate-400 font-bold ml-1">
                           Đến: {formatTimeHHmm(s.plannedArrivalTime)} • Đi: {formatTimeHHmm(s.plannedDepartureTime)}
                         </Text>
                      </View>
                   </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Bottom action area */}
      <View
        onLayout={(e) => {
          setBottomPanelHeight(e.nativeEvent.layout.height);
        }}
        className="absolute bottom-0 left-0 right-0 px-8 pb-10 pt-6 bg-white/90 backdrop-blur-3xl rounded-t-[3rem] border-t border-slate-100 shadow-2xl shadow-brand-dark/20"
      >
        <View className="bg-slate-50/80 rounded-3xl px-6 py-4 mb-6 border border-slate-50">
          <View className="flex-row justify-between items-center">
            <View className="flex-1 pr-4 border-r border-slate-200">
              <Text className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">Ghế đã chọn</Text>
              <Text className="text-slate-900 font-black text-base tracking-tight" numberOfLines={1}>
                {selectedSeats.length > 0 ? selectedSeats.join(", ") : "Chưa chọn"}
              </Text>
            </View>

            <View className="items-end pl-4">
              <Text className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">Số lượng</Text>
              <Text className="text-slate-900 font-black text-base tracking-tight">
                {selectedSeats.length}
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          disabled={!canContinue || holdingSeat}
          onPress={handleContinue}
          className={`rounded-3xl py-5 items-center justify-center shadow-2xl active:scale-[0.98] transition-all ${
            canContinue ? "bg-brand-primary shadow-brand-primary/40" : "bg-slate-100 opacity-60 shadow-none"
          }`}
        >
          <View className="flex-row items-center">
             <Text
                className={`font-black text-xl tracking-tight ${
                  canContinue ? "text-white" : "text-slate-400"
                }`}
              >
                {holdingSeat ? "Đang xử lý..." : "Tiếp tục"}
              </Text>
              {!holdingSeat && canContinue && <MaterialIcons name="keyboard-arrow-right" size={24} color="white" style={{marginLeft: 4, marginTop: 2}} />}
              {holdingSeat && <ActivityIndicator size="small" color="white" style={{marginLeft: 8}} />}
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default RouteDetail;
