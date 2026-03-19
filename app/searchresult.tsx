import { View, Text, Pressable, FlatList } from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import HeaderSearchResult from "@/components/HeaderSearchResult";
import Ticket, { RouteItem } from "@/components/Ticket";

type SearchRouteResponse = {
  requestId?: string;
  requestDateTime?: string;
  channel?: string;
  result?: { responseCode: string; description: string };
  data: RouteItem[];
};

const SearchResult = () => {
  const mockRouteData: SearchRouteResponse = {
    data: [
      {
        id: "09b6fc7c-c3ce-4ed6-9093-ada0db903546",
        pickupBranch: "233 Điện Biên Phủ",
        origin: "Hà Nội",
        destination: "Hải Phòng",
        availableSeats: 32,
        plannedStartTime: "2026-03-04T07:30:00Z",
        plannedEndTime: "2026-03-04T13:30:00Z",
        routeCode: "HAN-HPH-06",
        stopPoints: [
          {
            id: "d80f95a5-db24-499f-ac6e-bc92d02fbdc2",
            stopOrder: "1",
            routeId: "09b6fc7c-c3ce-4ed6-9093-ada0db903546",
            plannedArrivalTime: "2026-03-04T09:30Z",
            plannedDepartureTime: "2026-03-04T09:45Z",
            note: "Trạm Dừng Chân",
          },
        ],
      },
    ],
  };

  const params = useLocalSearchParams<any>();
  const { routeOfferData } = params;

  const parsed: SearchRouteResponse = routeOfferData
    ? JSON.parse(routeOfferData)
    : mockRouteData;

  const list = parsed?.data ?? [];

  return (
    <View className="flex-1 bg-brand-surface font-sans">
      <View className="flex-1">
        {/* Header */}
        <View
          className="w-full bg-brand-dark pt-16 pb-12 overflow-hidden relative"
          style={{ borderBottomLeftRadius: 50, borderBottomRightRadius: 50 }}
        >
          <View className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/10 rounded-full -mr-40 -mt-40 blur-3xl opacity-50" />
          
          <View className="flex-row items-center justify-between px-8 relative z-10 mb-8">
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
              Kết quả tìm kiếm
            </Text>

            <View className="w-12 h-12 rounded-2xl bg-brand-primary/20 items-center justify-center border border-brand-primary/20 backdrop-blur-md">
                <MaterialCommunityIcons size={24} color="#0EA5E9" name="tune-variant" />
            </View>
          </View>

          <View className="px-8 relative z-10">
            <HeaderSearchResult />
          </View>
        </View>

        {/* List */}
        <FlatList
          data={list}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 32,
            paddingBottom: 40,
          }}
          ListHeaderComponent={
            <View className="flex-row justify-between items-end mb-8 px-2">
              <View>
                 <Text className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">Danh sách</Text>
                 <Text className="text-2xl font-black text-slate-900 tracking-tight">Chuyến xe</Text>
              </View>
              <View className="bg-slate-100 px-4 py-2 rounded-2xl border border-slate-100">
                 <Text className="text-slate-500 font-black text-xs">
                   {list.length} Kết quả
                 </Text>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                router.push({
                  pathname: "/route-detail",
                  params: { routeData: JSON.stringify(item) },
                });
              }}
              className="mb-8 active:scale-[0.98] transition-all"
            >
              <Ticket item={item} />
            </Pressable>
          )}
          ListEmptyComponent={
            <View className="pt-20 items-center px-10">
              <View className="w-24 h-24 rounded-full bg-slate-50 items-center justify-center mb-6">
                 <MaterialCommunityIcons name="bus-marker" size={48} color="#94A3B8" />
              </View>
              <Text className="text-slate-900 font-black text-lg text-center mb-2">Không tìm thấy chuyến xe nào</Text>
              <Text className="text-slate-400 font-bold text-sm text-center">Vui lòng thử lại với các tiêu chí tìm kiếm khác hoặc thay đổi ngày khởi hành nhé.</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default SearchResult;
