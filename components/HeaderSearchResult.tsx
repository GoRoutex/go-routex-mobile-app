import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const HeaderSearchResult = () => {
  const [searchRouteData, setSearchRouteData] = useState<any>(null);

  const originCity = searchRouteData?.originCity || "Hà Nội";
  const destinationCity = searchRouteData?.destinationCity || "Hải Phòng";
  const departureDate = searchRouteData?.departureDate || "04-03-2026";
  const seats = searchRouteData?.seats || 2;

  const formattedDepartureDate = departureDate?.replace(/['"]+/g, "");

  useEffect(() => {
    const fetchSearchRouteData = async () => {
      try {
        const data = await AsyncStorage.getItem("searchRouteData");
        if (data !== null) {
          setSearchRouteData(JSON.parse(data));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSearchRouteData();
  }, []);

  return (
    <View className="px-2">
      <View className="flex-row justify-center items-center mb-4">
        <View className="flex-row items-center bg-white/5 px-6 py-3 rounded-2xl border border-white/5 backdrop-blur-md">
           <Text className="text-xl text-white font-black tracking-tighter">
             {originCity}
           </Text>
           <View className="mx-4 bg-brand-primary/20 p-1.5 rounded-full">
              <MaterialCommunityIcons name="arrow-right" size={16} color="#0EA5E9" />
           </View>
           <Text className="text-xl text-white font-black tracking-tighter">
             {destinationCity}
           </Text>
        </View>
      </View>

      <View className="flex-row justify-center items-center space-x-3">
          <View className="flex-row items-center">
             <MaterialCommunityIcons name="calendar-range" size={14} color="#0EA5E9" style={{marginRight: 6}} />
             <Text className="text-xs text-slate-400 font-black uppercase tracking-widest">
               {formattedDepartureDate}
             </Text>
          </View>
          
          <View className="w-1 h-1 rounded-full bg-slate-600" />
          
          <View className="flex-row items-center">
             <MaterialCommunityIcons name="account-group-outline" size={14} color="#0EA5E9" style={{marginRight: 6}} />
             <Text className="text-xs text-slate-400 font-black uppercase tracking-widest">
               {seats} Chỗ
             </Text>
          </View>

          <View className="w-1 h-1 rounded-full bg-slate-600" />

          <View className="flex-row items-center">
             <MaterialCommunityIcons name="shield-check-outline" size={14} color="#10B981" style={{marginRight: 6}} />
             <Text className="text-xs text-slate-400 font-black uppercase tracking-widest">
               An toàn
             </Text>
          </View>
      </View>
    </View>
  );
};

export default HeaderSearchResult;
