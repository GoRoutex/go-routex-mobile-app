import { View, Text, Pressable, Alert } from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

const DepartureDate = () => {
  const [routeOfferData, setRouteOfferData] = useState<any>({
    departureDate: new Date(),
  });

  const saveDepartureDate = async () => {
    try {
      const departureDate = new Date(routeOfferData.departureDate);
      const dateString = departureDate.toISOString().split("T")[0];

      await AsyncStorage.setItem("departureDate", dateString);

      Alert.alert("Thành công", "Đã cập nhật ngày khởi hành thành công");
      router.back();
    } catch (error: any) {
      console.log("saveDepartureDate error:", error);
      Alert.alert("Lỗi", error?.message ?? "Không thể lưu ngày khởi hành");
    }
  };

  return (
    <View className="flex-1 bg-brand-surface font-sans">
      <View className="flex-1">
        {/* Header */}
        <View
          className="w-full bg-brand-dark pt-16 pb-12 overflow-hidden relative"
          style={{ borderBottomLeftRadius: 50, borderBottomRightRadius: 50 }}
        >
          <View className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/10 rounded-full -mr-40 -mt-40 blur-3xl opacity-50" />
          
          <View className="flex-row items-center justify-between px-8 relative z-10">
            <Pressable
              onPress={() => router.back()}
              className="h-12 w-12 rounded-2xl bg-white/10 items-center justify-center border border-white/5 backdrop-blur-md active:scale-95 transition-all"
            >
              <MaterialIcons
                name="keyboard-arrow-left"
                size={32}
                color="white"
              />
            </Pressable>

            <Text className="text-white font-black text-xl tracking-tight">
              Ngày khởi hành
            </Text>

            <Pressable
              onPress={saveDepartureDate}
              className="bg-brand-primary px-6 py-3 rounded-2xl shadow-lg shadow-brand-primary/20 active:scale-95 transition-all"
            >
              <Text className="text-white font-black text-xs uppercase tracking-widest">Lưu</Text>
            </Pressable>
          </View>
        </View>

        {/* Calendar View */}
        <View className="p-8 -mt-8">
           <View className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden font-sans p-4">
              <Calendar
                theme={{
                   backgroundColor: '#ffffff',
                   calendarBackground: '#ffffff',
                   textSectionTitleColor: '#1e293b',
                   selectedDayBackgroundColor: '#0EA5E9',
                   selectedDayTextColor: '#ffffff',
                   todayTextColor: '#0EA5E9',
                   dayTextColor: '#1e293b',
                   textDisabledColor: '#cbd5e1',
                   dotColor: '#0EA5E9',
                   selectedDotColor: '#ffffff',
                   arrowColor: '#0EA5E9',
                   monthTextColor: '#0f172a',
                   indicatorColor: '#0EA5E9',
                   textDayFontWeight: '700',
                   textMonthFontWeight: '900',
                   textDayHeaderFontWeight: '900',
                   textDayFontSize: 14,
                   textMonthFontSize: 18,
                   textDayHeaderFontSize: 12
                }}
                onDayPress={(day: any) => {
                  setRouteOfferData({
                    ...routeOfferData,
                    departureDate: new Date(day.dateString),
                  });
                }}
                markedDates={{
                  [routeOfferData.departureDate.toISOString().split("T")[0]]: {
                    selected: true,
                    disableTouchEvent: true,
                  },
                }}
              />
           </View>
           
           <View className="mt-8 bg-slate-50 p-6 rounded-3xl border border-slate-100 flex-row items-center">
              <View className="w-12 h-12 rounded-2xl bg-brand-primary/10 items-center justify-center mr-4">
                 <MaterialIcons name="event-available" size={24} color="#0EA5E9" />
              </View>
              <View className="flex-1">
                 <Text className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">Ngày đã chọn</Text>
                 <Text className="text-slate-900 font-black text-lg tracking-tight">
                    {routeOfferData.departureDate.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                 </Text>
              </View>
           </View>
        </View>
      </View>
    </View>
  );
};

export default DepartureDate;
