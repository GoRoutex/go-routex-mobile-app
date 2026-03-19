import { View, Text, Pressable } from "react-native";
import React, { useMemo, useState } from "react";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

type StopPoint = {
  id: string;
  stopOrder: string;
  routeId: string;
  plannedArrivalTime?: string;
  plannedDepartureTime?: string;
  note?: string;
};

export type RouteItem = {
  id: string;
  pickupBranch?: string | null;
  origin: string;
  destination: string;
  availableSeats?: number | null;
  plannedStartTime: string;
  plannedEndTime: string;
  routeCode: string;
  stopPoints?: StopPoint[] | null;

  // future fields
  price?: number | null;
  currency?: "VND" | string;
  vehicleType?: string | null;
  seatCapacity?: number | null;
};

const pad2 = (n: number) => String(n).padStart(2, "0");

const formatTimeHHmm = (iso: string) => {
  const d = new Date(iso);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
};

const formatDateDDMM = (iso: string) => {
  const d = new Date(iso);
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}`;
};

const durationText = (startIso: string, endIso: string) => {
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

const sortStops = (stops?: StopPoint[] | null) => {
  if (!stops || stops.length === 0) return [];
  return [...stops].sort(
    (a, b) =>
      (parseInt(a.stopOrder, 10) || 0) - (parseInt(b.stopOrder, 10) || 0),
  );
};

const formatVnd = (v?: number | null) => {
  if (typeof v !== "number") return "—";
  try {
    return new Intl.NumberFormat("vi-VN").format(v) + " ₫";
  } catch {
    return `${v} ₫`;
  }
};

const toVehicleLabel = (type?: string | null, cap?: number | null) => {
  if (!type && !cap) return "—";
  if (type && cap) return `${type} • ${cap} chỗ`;
  if (type) return type;
  return `${cap} chỗ`;
};

const Ticket = ({ item }: { item: RouteItem }) => {
  const [expanded, setExpanded] = useState(false);

  const startTime = formatTimeHHmm(item.plannedStartTime);
  const endTime = formatTimeHHmm(item.plannedEndTime);
  const date = formatDateDDMM(item.plannedStartTime);
  const dur = durationText(item.plannedStartTime, item.plannedEndTime);

  const seats =
    typeof item.availableSeats === "number" ? item.availableSeats : null;
  const lowSeat = typeof seats === "number" && seats > 0 && seats <= 3;

  const stops = useMemo(() => sortStops(item.stopPoints), [item.stopPoints]);
  const stopCount = stops.length;

  const priceText = formatVnd(item.price || 50000);
  const vehicleLabel = toVehicleLabel(item.vehicleType, item.seatCapacity);

  return (
    <View className="bg-white w-full rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden font-sans">
      <View className="p-8">
        {/* Header row */}
        <View className="flex-row justify-between items-start mb-6">
          <View className="flex-1 pr-4">
            <Text className="text-xl font-black text-slate-900 tracking-tight">
              {item.origin} <Text className="text-brand-primary">→</Text> {item.destination}
            </Text>

            <View className="flex-row items-center mt-2 bg-slate-50 self-start px-3 py-1 rounded-full border border-slate-100">
               <Text className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                 {item.routeCode} • {date}
               </Text>
            </View>
          </View>

          <View className="items-end">
            <Text className="text-xl font-black text-brand-primary tracking-tighter">
              {priceText}
            </Text>
            <Text className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Giá vé</Text>
          </View>
        </View>

        {/* Info badges */}
        <View className="flex-row space-x-3 mb-8">
           <View className="bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100 flex-row items-center">
              <MaterialCommunityIcons name="bus-clock" size={14} color="#6366F1" />
              <Text className="text-indigo-600 font-black text-[10px] uppercase tracking-widest ml-2">{vehicleLabel}</Text>
           </View>
           {typeof seats === 'number' && (
              <View className={`px-4 py-2 rounded-2xl border flex-row items-center ${lowSeat ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'}`}>
                 <View className={`w-2 h-2 rounded-full mr-2 ${lowSeat ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                 <Text className={`font-black text-[10px] uppercase tracking-widest ${lowSeat ? 'text-rose-500' : 'text-emerald-500'}`}>
                   {lowSeat ? `Chỉ còn ${seats} chỗ` : `${seats} chỗ trống`}
                 </Text>
              </View>
           )}
        </View>

        {/* Time & Duration row */}
        <View className="flex-row justify-between items-center mb-8 px-2">
          <View>
            <Text className="text-2xl font-black text-slate-900 tracking-tighter">
              {startTime}
            </Text>
            <Text className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Khởi hành</Text>
          </View>

          <View className="items-center flex-1 px-6">
             <View className="bg-slate-50 px-3 py-1 rounded-full border border-slate-100 mb-2">
                <Text className="text-slate-500 font-black text-[10px]">{dur}</Text>
             </View>
             <View className="flex-row items-center w-full">
                <View className="h-1 w-1 rounded-full bg-brand-primary mr-1" />
                <View className="h-[2px] flex-1 bg-slate-100 rounded-full" />
                <View className="h-1 w-1 rounded-full bg-slate-300 ml-1" />
             </View>
             <Text className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">
              {stopCount === 0
                ? "Chạy thẳng"
                : `${stopCount} điểm dừng`}
            </Text>
          </View>

          <View className="items-end">
            <Text className="text-2xl font-black text-slate-900 tracking-tighter">
              {endTime}
            </Text>
            <Text className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Kết thúc</Text>
          </View>
        </View>

        {/* Pickup Location */}
        {!!item.pickupBranch && (
           <View className="bg-slate-50/50 p-4 rounded-3xl border border-slate-50 flex-row items-center mb-4">
              <MaterialCommunityIcons name="map-marker-radius-outline" size={18} color="#0EA5E9" />
              <View className="ml-3 flex-1">
                 <Text className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Điểm đón khách</Text>
                 <Text className="text-slate-900 font-bold text-xs" numberOfLines={1}>
                    {item.pickupBranch}
                 </Text>
              </View>
           </View>
        )}

        {/* Action row */}
        <View className="pt-4 border-t border-slate-50 flex-row justify-between items-center">
            <View>
                {stopCount > 0 ? (
                    <Pressable
                        onPress={() => setExpanded((v) => !v)}
                        className={`px-4 py-2 rounded-2xl flex-row items-center border ${expanded ? 'bg-brand-primary/5 border-brand-primary/10' : 'bg-slate-50 border-slate-100'}`}
                    >
                        <Text className={`text-[10px] font-black uppercase tracking-widest ${expanded ? 'text-brand-primary' : 'text-slate-500'}`}>
                            {expanded ? "Ẩn điểm dừng" : "Xem điểm dừng"}
                        </Text>
                        <MaterialIcons 
                            name={expanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                            size={16} 
                            color={expanded ? "#0EA5E9" : "#94A3B8"} 
                            style={{marginLeft: 4}}
                        />
                    </Pressable>
                ) : (
                    <View className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                        <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Không có điểm dừng</Text>
                    </View>
                )}
            </View>

            <View className="bg-brand-primary/10 h-10 w-10 rounded-xl items-center justify-center border border-brand-primary/10">
                <MaterialIcons name="keyboard-arrow-right" size={24} color="#0EA5E9" />
            </View>
        </View>

        {/* Expanded stops area */}
        {expanded && stopCount > 0 && (
          <View className="mt-6 bg-slate-50/80 rounded-[2rem] p-6 border border-slate-100">
            {stops.map((s, idx) => {
              const arr = s.plannedArrivalTime
                ? formatTimeHHmm(s.plannedArrivalTime)
                : "—";
              const dep = s.plannedDepartureTime
                ? formatTimeHHmm(s.plannedDepartureTime)
                : "—";
              return (
                <View
                  key={s.id ?? `${idx}`}
                  className={`py-4 ${idx < stops.length - 1 ? "border-b border-slate-100/50" : ""}`}
                >
                  <View className="flex-row items-center mb-1">
                     <View className="w-1.5 h-1.5 rounded-full bg-brand-primary mr-2" />
                     <Text className="text-slate-900 font-black text-xs uppercase tracking-tight">
                       Trạm {s.stopOrder}: {s.note || "Trạm dừng chân"}
                     </Text>
                  </View>
                  <Text className="text-[10px] text-slate-400 font-bold ml-3.5 italic">
                    Đến lúc {arr} • Khởi hành {dep}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
};

export default Ticket;
