import {
  View,
  Text,
  Alert,
  Pressable,
  FlatList,
  ActivityIndicator,
  TextInput,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api, API_BASE_URL, SEARCH_LOCATION_PATH } from "@/utils/env";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

interface LocationItem {
  id: number;
  name: string;
  code: string;
}

type SelectionType = "origin" | "destination";

const LocationSelection = () => {
  const [searchInput, setSearchInput] = useState("");

  const [autoCompleteResults, setAutoCompleteResults] = useState<
    LocationItem[]
  >([]);

  const [originCode, setOriginCode] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [loading, setLoading] = useState(false);

  const params = useLocalSearchParams<{ type?: string }>();

  const type: SelectionType =
    params?.type === "destination" ? "destination" : "origin";

  useEffect(() => {
    if (type === "destination") {
      AsyncStorage.getItem("originCode").then(setOriginCode);
    } else {
      setOriginCode(null);
    }
  }, [type]);

  const fetchLocation = useCallback(async (keyword: string) => {
    const kw = keyword.trim();

    if (kw.length === 0) {
      setAutoCompleteResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(SEARCH_LOCATION_PATH, {
        params: { keyword: kw, page: 0, size: 10 },
      });

      const list: LocationItem[] = response.data?.data ?? [];
      setAutoCompleteResults(list);
    } catch (error) {
      console.log(error);
      setAutoCompleteResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (value: string) => {
    setSearchInput(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchLocation(value);
    }, 250);
  };

  const onPick = useCallback(
    async (item: LocationItem) => {
      if (type === "destination" && originCode && item.code === originCode) {
        Alert.alert(
          "Thông báo",
          "Điểm đến phải khác với điểm xuất phát",
        );
        return;
      } else {
        setSearchInput(item.name);
        setAutoCompleteResults([]);

        if (type === "origin") {
          await AsyncStorage.multiSet([
            ["originCity", item.name],
            ["originCode", item.code],
          ]);
        } else {
          await AsyncStorage.multiSet([
            ["destinationCity", item.name],
            ["destinationCode", item.code],
          ]);
        }

        router.back();
      }
    },
    [type, originCode],
  );

  const title =
    type === "destination" ? "Chọn điểm đến" : "Chọn điểm xuất phát";
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
              {title}
            </Text>

            <View className="w-12 h-12 rounded-2xl bg-brand-primary/20 items-center justify-center border border-brand-primary/20 backdrop-blur-md">
                <MaterialCommunityIcons size={24} color="#0EA5E9" name="map-marker-radius-outline" />
            </View>
          </View>
        </View>

        {/* City Search and Results */}
        <View className="flex-1 px-8 -mt-8">
          <View className="bg-white rounded-3xl p-6 shadow-2xl shadow-slate-200/50 border border-slate-50 mb-6">
            <Text className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-3 ml-1">Tìm kiếm thành phố</Text>
            <View className="relative">
              <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                 <MaterialIcons name="search" size={20} color="#94A3B8" />
              </View>
              <TextInput
                placeholder="Ví dụ: Hà Nội, Hải Phòng..."
                placeholderTextColor={"#94A3B8"}
                value={searchInput}
                onChangeText={handleInputChange}
                className="bg-slate-50 border-2 border-slate-50 rounded-2xl pl-12 pr-5 py-4 text-slate-900 font-bold text-base"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Autocomplete Results */}
          {(loading || autoCompleteResults.length > 0) && (
            <View className="flex-1 bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
              {loading && (
                <View className="py-10 items-center">
                  <ActivityIndicator color="#0EA5E9" />
                  <Text className="text-slate-400 font-bold text-xs mt-4">Đang tìm kiếm...</Text>
                </View>
              )}

              <FlatList
                keyboardShouldPersistTaps="handled"
                data={autoCompleteResults}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => {
                  const disabled = Boolean(
                    type === "destination" &&
                    originCode &&
                    item.code === originCode,
                  );

                  return (
                    <Pressable
                      disabled={disabled}
                      onPress={() => onPick(item)}
                      className={`px-8 py-6 border-b border-slate-50 flex-row items-center justify-between ${disabled ? 'opacity-40' : 'active:bg-slate-50'}`}
                    >
                      <View className="flex-row items-center flex-1">
                         <View className="w-10 h-10 rounded-xl bg-slate-50 items-center justify-center mr-4 border border-slate-100">
                            <MaterialCommunityIcons name="map-marker-outline" size={20} color={disabled ? "#CBD5E1" : "#0EA5E9"} />
                         </View>
                         <View>
                            <Text className={`text-slate-900 font-black text-base tracking-tight ${disabled ? 'text-slate-400' : ''}`}>
                              {item.name}
                            </Text>
                            <Text className="text-slate-400 font-bold text-xs">{item.code}</Text>
                         </View>
                      </View>
                      
                      {disabled ? (
                         <View className="bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                            <Text className="text-[10px] text-rose-400 font-black uppercase tracking-widest">Đã chọn</Text>
                         </View>
                      ) : (
                         <MaterialIcons name="keyboard-arrow-right" size={20} color="#CBD5E1" />
                      )}
                    </Pressable>
                  );
                }}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={<View className="h-4" />}
                ListEmptyComponent={!loading ? (
                   <View className="py-20 items-center">
                      <Text className="text-slate-400 font-bold italic">Không tìm thấy kết quả</Text>
                   </View>
                ) : null}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default LocationSelection;
