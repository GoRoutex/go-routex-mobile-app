import Header from "@/components/Header";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  ArrowPathRoundedSquareIcon,
  ChevronDoubleRightIcon,
} from "react-native-heroicons/outline";
import { api, SEARCH_ROUTE_PATH } from "@/utils/env";
import { genUUID, nowOffsetDateTime } from "@/utils/request";

interface RouteOfferData {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: Date;
  returnDate: Date;
  adults: number;
  maxResults: number;
}
interface SearchRouteData {
  originCity: string;
  destinationCity: string;
  departureDate: string;
  seat: number;
}
// Trip Options components
interface TripOptionProps {
  pageNavigation: string;
  handleNavigationChange: (type: string) => void;
}

const TripOption: React.FC<TripOptionProps> = ({
  pageNavigation,
  handleNavigationChange,
}) => (
  <View className="flex-row justify-between w-full px-2 py-2">
    <Pressable
      className="flex-row w-1/2"
      onPress={() => handleNavigationChange("one-way")}
    >
      <View
        className={`w-full justify-center items-center flex-row space-x-2 pb-3
            ${pageNavigation === "one-way" ? "border-b-4 border-brand-primary" : "border-transparent"}`}
      >
        <ChevronDoubleRightIcon
          size={20}
          strokeWidth={pageNavigation === "one-way" ? 3 : 2}
          color={pageNavigation === "one-way" ? "#0EA5E9" : "#94A3B8"}
        />
        <Text
          className={`text-lg pl-2 ${
            pageNavigation === "one-way" ? "text-slate-900" : "text-slate-400"
          }`}
          style={{
            fontWeight: pageNavigation === "one-way" ? "900" : "600",
          }}
        >
          Một chiều
        </Text>
      </View>
    </Pressable>

    {/* Round Trip */}
    <Pressable
      className="flex-row w-1/2"
      onPress={() => handleNavigationChange("round-trip")}
    >
      <View
        className={`w-full justify-center items-center flex-row space-x-2 pb-3
            ${pageNavigation === "round-trip" ? "border-b-4 border-brand-primary" : "border-transparent"}`}
      >
        <ArrowPathRoundedSquareIcon
          size={20}
          strokeWidth={pageNavigation === "round-trip" ? 3 : 2}
          color={pageNavigation === "round-trip" ? "#0EA5E9" : "#94A3B8"}
        />
        <Text
          className={`text-lg pl-2 ${
            pageNavigation === "round-trip" ? "text-slate-900" : "text-slate-400"
          }`}
          style={{
            fontWeight: pageNavigation === "round-trip" ? "900" : "600",
          }}
        >
          Khứ hồi
        </Text>
      </View>
    </Pressable>
  </View>
);

// Location Component

interface LocationInputProps {
  placeholder: string;
  icon: React.ReactNode;
  value: string;
  onPress: () => void;
}

const LocationInput: React.FC<LocationInputProps> = ({
  placeholder,
  icon,
  value,
  onPress,
}) => (
  <View className="bg-slate-50 border-2 border-slate-50 mx-4 mb-5 rounded-2xl justify-center h-16 shadow-sm shadow-slate-200/50">
    <Pressable onPress={onPress}>
      <View className="px-5 flex-row justify-between items-center">
        <View className="w-[12%]">{icon}</View>
        <View className="w-[88%]">
          {value ? (
            <Text className="text-slate-900 font-black text-base tracking-tight">
              {value}
            </Text>
          ) : (
            <Text className="text-slate-400 font-bold text-base">
              {placeholder}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  </View>
);

type SearchRouteRequest = {
  requestId: string;
  requestDateTime: string;
  channel: string;
  data: {
    origin: string;
    destination: string;
    departureDate: string;
    fromTime?: string;
    toTime?: string;
    pageSize: string;
    pageNumber: string;
    seat?: string;
  };
};

type SearchRouteResponse = {
  requestId: string;
  requestDateTime: string;
  channel: string;
  data: {
    id: string;
    pickupBranch: string;
    origin: string;
    destination: string;
    plannedStartTime: string;
    plannedEndTime: string;
    routeCode: string;
    stopPoints: [
      {
        id: string;
        stopOrder: string;
        routeId: string;
        plannedArrivalTime: string;
        plannedDepartureTime: string;
        note: string;
      },
    ];
  };
};
// Departure Date Component
interface DepartureDateProps {
  placeholder: string;
  icon: React.ReactNode;
  value: string;
  onPress: () => void;
}

const DepartureDate: React.FC<DepartureDateProps> = ({
  placeholder,
  icon,
  value,
  onPress,
}) => (
  <Pressable
    onPress={onPress}
    className="bg-slate-50 border-2 border-slate-50 mx-4 mb-5 rounded-2xl justify-center h-16 flex-row items-center pl-5 shadow-sm shadow-slate-200/50"
  >
    <View className="w-[12%]">{icon}</View>
    <View className="w-[88%] px-0 items-start justify-start">
      <Text className={`font-black text-base tracking-tight ${value ? 'text-slate-900' : 'text-slate-400'}`}>
        {value || placeholder}
      </Text>
    </View>
  </Pressable>
);

interface QuickInfoCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

const QuickInfoCard: React.FC<QuickInfoCardProps> = ({
  icon,
  title,
  subtitle,
}) => (
  <View className="bg-white rounded-[2rem] p-6 border border-slate-100 flex-1 shadow-sm shadow-slate-200">
    <View className="mb-4 w-12 h-12 rounded-2xl bg-brand-primary/10 items-center justify-center border border-brand-primary/5">{icon}</View>
    <Text className="text-slate-900 font-black text-lg tracking-tight mb-2 leading-6">{title}</Text>
    <Text className="text-slate-500 text-xs font-medium leading-5">{subtitle}</Text>
  </View>
);

export default function HomeScreen() {
  const [isPending, setIsPending] = useState(false);
  const [pageNavigation, setPageNavigation] = useState("one-way");
  const [routeOfferData, setRouteOfferData] = useState<RouteOfferData>({
    originLocationCode: "",
    destinationLocationCode: "",
    departureDate: new Date(),
    returnDate: new Date(),
    adults: 0,
    maxResults: 10,
  });
  const [searchRouteData, setSearchRouteData] = useState<SearchRouteData>({
    originCity: "",
    destinationCity: "",
    departureDate: "",
    seat: 1,
  });

  const [selectedDate, setSelectedDate] = useState<string>("");

  const handleNavigationChange = (type: string) => setPageNavigation(type);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      const loadForm = async () => {
        try {
          const [
            depDate,
            originName,
            originCode,
            destinationName,
            destinationCode,
            loginFlag,
            storedUserName,
            storedRoutePoint,
          ] = await Promise.all([
            AsyncStorage.getItem("departureDate"),
            AsyncStorage.getItem("originCity"),
            AsyncStorage.getItem("originCode"),
            AsyncStorage.getItem("destinationCity"),
            AsyncStorage.getItem("destinationCode"),
            AsyncStorage.getItem("isLoggedIn"),
            AsyncStorage.getItem("userName"),
            AsyncStorage.getItem("routePoint"),
          ]);

          if (!mounted) return;

          setIsLoggedIn(loginFlag === "true");
          setUserName(storedUserName || "Customer");
          setRoutePoint(storedRoutePoint);

          if (depDate) {
            setSelectedDate(depDate);
            setSearchRouteData((p) => ({ ...p, departureDate: depDate }));
          }

          if (originName) {
            setSearchRouteData((p) => ({ ...p, originCity: originName }));
          }

          if (originCode) {
            setRouteOfferData((p) => ({
              ...p,
              originLocationCode: originCode,
            }));
          }

          if (destinationName) {
            setSearchRouteData((p) => ({
              ...p,
              destinationCity: destinationName,
            }));
          }

          if (destinationCode) {
            setRouteOfferData((p) => ({
              ...p,
              destinationLocationCode: destinationCode,
            }));
          }
        } catch (e) {
          console.log("load form error:", e);
        }
      };

      loadForm();

      return () => {
        mounted = false;
      };
    }, [])
  );

  const handleParentSearch = async () => {
    if (!searchRouteData.originCity || !searchRouteData.destinationCity) {
      Alert.alert("Lỗi", "Vui lòng chọn Điểm đi và Điểm đến");
      return;
    }

    if (!searchRouteData.departureDate) {
      Alert.alert("Lỗi", "Vui lòng chọn ngày khởi hành");
      return;
    }

    if (!searchRouteData.seat || searchRouteData.seat < 1) {
      Alert.alert(
        "Lỗi",
        "Số lượng ghế phải lớn hơn hoặc bằng 1",
      );
      return;
    }

    const payload: SearchRouteRequest = {
      requestId: genUUID(),
      requestDateTime: nowOffsetDateTime(),
      channel: "ONL",
      data: {
        origin: searchRouteData.originCity,
        destination: searchRouteData.destinationCity,
        departureDate: searchRouteData.departureDate,
        seat: String(searchRouteData.seat),
        pageSize: "10",
        pageNumber: "0",
      },
    };

    setIsPending(true);
    try {
      const response = await api.post<SearchRouteResponse>(
        SEARCH_ROUTE_PATH,
        payload,
      );

      const data = response.data;

      await AsyncStorage.setItem("searchRouteData", JSON.stringify(data));

      router.push({
        pathname: "/searchresult",
        params: {
          routeOfferData: JSON.stringify(data),
        },
      });
    } catch (error: any) {
      console.error("Error fetching flight offers", error);
      setIsPending(false);

      if (error.response && error.response.status === 401) {
        Alert.alert("Phiên làm việc hết hạn", "Vui lòng đăng nhập lại", [
          { text: "OK" },
        ]);
      } else {
        Alert.alert("Lỗi", "Đã có lỗi xảy ra khi tìm kiếm chuyến xe", [
          { text: "OK" },
        ]);
      }
    } finally {
      setIsPending(false);
    }
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Khách hàng");
  const [routePoint, setRoutePoint] = useState<string | null>(null);

  return (
    <View className="flex-1 bg-brand-surface relative font-sans">
      <StatusBar style="light" />

      {isPending && (
        <View className="absolute z-[100] w-full h-full justify-center items-center">
          <View className="bg-brand-dark h-full w-full justify-center items-center opacity-[0.4]" />
          <View className="absolute bg-white p-10 rounded-[2.5rem] shadow-2xl items-center border border-slate-100">
            <ActivityIndicator
              size="large"
              color="#0EA5E9"
            />
            <Text className="mt-5 text-slate-900 font-black tracking-tight">Đang tìm chuyến...</Text>
          </View>
        </View>
      )}

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 150 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          className="h-[340px] mb-4 justify-start w-full bg-brand-dark relative pt-16 overflow-hidden"
          style={{
            borderBottomLeftRadius: 60,
            borderBottomRightRadius: 60,
          }}
        >
          <View className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/10 rounded-full -mr-40 -mt-40 blur-3xl opacity-50" />
          <Header
            isLoggedIn={isLoggedIn}
            userName={userName}
            routePoint={routePoint}
          />
        </View>

        {/* Form Area */}
        <View className="w-full px-6 -mt-32">
          <View className="bg-white rounded-[3.5rem] pt-8 pb-10 shadow-2xl shadow-slate-200 border border-slate-100">
            <View className="flex-row justify-between w-full px-4 py-2 mb-4">
              <TripOption
                pageNavigation={pageNavigation}
                handleNavigationChange={handleNavigationChange}
              />
            </View>

            {/* Departure City */}
            <LocationInput
              placeholder={
                searchRouteData.originCity
                  ? searchRouteData.originCity
                  : "Điểm xuất phát"
              }
              icon={<MaterialCommunityIcons size={28} color="#0EA5E9" name="bus-side" />}
              value={searchRouteData.originCity}
              onPress={() =>
                router.push({
                  pathname: "/departure",
                  params: { type: "origin" },
                })
              }
            />

            {/* Destination City */}
            <LocationInput
              placeholder={
                searchRouteData.destinationCity
                  ? searchRouteData.destinationCity
                  : "Điểm đến"
              }
              icon={
                <MaterialCommunityIcons size={28} color="#6366F1" name="map-marker-distance" />
              }
              value={searchRouteData.destinationCity}
              onPress={() =>
                router.push({
                  pathname: "/selectLocation",
                  params: { type: "destination" },
                })
              }
            />

            {/* Departure Date */}
            <DepartureDate
              placeholder="Chọn ngày khởi hành"
              icon={<MaterialCommunityIcons size={28} color="#10B981" name="calendar-month" />}
              value={selectedDate || searchRouteData.departureDate}
              onPress={() => router.push("/departureDate")}
            />

            {/* Seat */}
            <View className="bg-slate-50 border-2 border-slate-50 mx-4 rounded-2xl h-16 justify-center items-center flex-row px-5 shadow-sm shadow-slate-200/50">
              <View className="w-[12%]">
                <MaterialCommunityIcons
                  size={28}
                  color="#F43F5E"
                  name="account-group"
                />
              </View>

              <TextInput
                className="w-[88%] text-base px-0 font-black text-slate-900 tracking-tight"
                placeholder="Số hành khách"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={String(searchRouteData.seat)}
                onChangeText={(text) => {
                  const seatValue = parseInt(text, 10);
                  const validSeatValue = isNaN(seatValue) ? 0 : seatValue;
                  setSearchRouteData((prev) => ({
                    ...prev,
                    seat: validSeatValue,
                  }));

                  setRouteOfferData((prev) => ({
                    ...prev,
                    adults: validSeatValue,
                  }));
                }}
              />
            </View>

            {/* Search Button */}
            <View className="w-full justify-start px-4 mt-8">
              <Pressable
                className="bg-brand-primary rounded-3xl justify-center items-center py-5 shadow-xl shadow-brand-primary/30 active:scale-95 transition-all"
                onPress={handleParentSearch}
              >
                <View className="flex-row items-center">
                   <MaterialCommunityIcons name="magnify" size={24} color="white" style={{marginRight: 8}} />
                   <Text className="text-white font-black text-xl tracking-tight">Tìm chuyến xe</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Quick Summary */}
        <View className="px-6 mt-12">
          <Text className="text-2xl font-black text-slate-900 mb-6 tracking-tight px-2">
            Tại sao chọn dịch vụ của chúng tôi?
          </Text>

          <View className="flex-row gap-4">
            <QuickInfoCard
              icon={
                <MaterialCommunityIcons
                  name="clock-check-outline"
                  size={28}
                  color="#0EA5E9"
                />
              }
              title="Đúng giờ"
              subtitle="Lịch trình được tối ưu hóa để khởi hành và đến nơi đúng hạn."
            />

            <QuickInfoCard
              icon={
                <MaterialCommunityIcons
                  name="shield-car"
                  size={28}
                  color="#10B981"
                />
              }
              title="An toàn"
              subtitle="Theo dõi hành trình thời gian thực và phương tiện đời mới nhất."
            />
          </View>
        </View>

        {/* Stats / Business Features */}
        <View className="px-6 mt-10">
          <View className="bg-brand-dark rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl shadow-brand-dark/30">
            <View className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 rounded-full border border-white/10 -mr-16 -mt-16 blur-xl" />
            <Text className="text-white text-2xl font-black tracking-tight tracking-tight">
              Go Routex Premium
            </Text>
            <Text className="text-slate-400 mt-4 leading-6 font-medium">
              Nền tảng vận tải hiện đại tích hợp quản lý chuyến đi, ghế trống và đặt vé 24/7.
            </Text>

            <View className="flex-row justify-between mt-10">
              <View className="items-center flex-1">
                <Text className="text-brand-primary text-3xl font-black tracking-tighter">
                  24/7
                </Text>
                <Text className="text-slate-400 text-[10px] uppercase font-black tracking-widest mt-2">Giám sát</Text>
              </View>

              <View className="items-center flex-1 border-x border-white/10 px-2">
                <Text className="text-brand-primary text-3xl font-black tracking-tighter">
                  100%
                </Text>
                <Text className="text-slate-400 text-[10px] uppercase font-black tracking-widest mt-2">Chủ động</Text>
              </View>

              <View className="items-center flex-1">
                <Text className="text-brand-primary text-3xl font-black tracking-tighter">
                  Real
                </Text>
                <Text className="text-slate-400 text-[10px] uppercase font-black tracking-widest mt-2">Đặt chỗ</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Popular routes */}
        <View className="px-6 mt-12 pb-10">
          <Text className="text-2xl font-black text-slate-900 mb-6 tracking-tight px-2">
            Tuyến đường phổ biến
          </Text>

          <View className="bg-white rounded-[2.5rem] border border-slate-100 p-6 shadow-2xl shadow-slate-200/50">
            <Pressable className="flex-row justify-between items-center py-5 border-b border-slate-50 transition-all active:opacity-60 px-2">
              <View className="flex-row items-center">
                 <View className="w-12 h-12 rounded-2xl bg-slate-50 items-center justify-center mr-4 border border-slate-100">
                    <MaterialCommunityIcons name="bus-clock" size={24} color="#0EA5E9" />
                 </View>
                 <View>
                    <Text className="font-black text-slate-900 text-lg tracking-tight">
                      Hà Nội → Hải Phòng
                    </Text>
                    <Text className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest">
                      Limousine • Chuyến liên tục
                    </Text>
                 </View>
              </View>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={32}
                color="#CBD5E1"
              />
            </Pressable>

            <Pressable className="flex-row justify-between items-center py-5 border-b border-slate-50 transition-all active:opacity-60 px-2">
              <View className="flex-row items-center">
                 <View className="w-12 h-12 rounded-2xl bg-slate-50 items-center justify-center mr-4 border border-slate-100">
                    <MaterialCommunityIcons name="bus-side" size={24} color="#10B981" />
                 </View>
                 <View>
                    <Text className="font-black text-slate-900 text-lg tracking-tight">
                      Sài Gòn → Nha Trang
                    </Text>
                    <Text className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest">
                      Xe giường nằm • Chuyến đêm
                    </Text>
                 </View>
              </View>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={32}
                color="#CBD5E1"
              />
            </Pressable>

            <Pressable className="flex-row justify-between items-center py-5 transition-all active:opacity-60 px-2">
              <View className="flex-row items-center">
                 <View className="w-12 h-12 rounded-2xl bg-slate-50 items-center justify-center mr-4 border border-slate-100">
                    <MaterialCommunityIcons name="map-marker-path" size={24} color="#6366F1" />
                 </View>
                 <View>
                    <Text className="font-black text-slate-900 text-lg tracking-tight">
                      Đà Lạt → Sài Gòn
                    </Text>
                    <Text className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest">
                      Premium Coach • Hàng ngày
                    </Text>
                 </View>
              </View>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={32}
                color="#CBD5E1"
              />
            </Pressable>
          </View>
        </View>

        {/* Notes / booking policy */}
        <View className="px-6 mt-4 pb-20">
          <Text className="text-2xl font-black text-slate-900 mb-6 tracking-tight px-2">
            Lưu ý đặt vé
          </Text>

          <View className="bg-slate-900/5 rounded-[2.5rem] border border-slate-900/5 p-8">
            <View className="flex-row items-start mb-6">
              <MaterialCommunityIcons
                name="check-circle"
                size={22}
                color="#0EA5E9"
              />
              <Text className="text-slate-600 ml-4 flex-1 font-medium leading-6">
                Ghế bạn chọn sẽ được giữ tạm thời trước khi xác nhận thanh toán.
              </Text>
            </View>

            <View className="flex-row items-start mb-6">
              <MaterialCommunityIcons
                name="check-circle"
                size={22}
                color="#10B981"
              />
              <Text className="text-slate-600 ml-4 flex-1 font-medium leading-6">
                Tình trạng ghế trống được đồng bộ hóa thời gian thực với hệ thống.
              </Text>
            </View>

            <View className="flex-row items-start">
              <MaterialCommunityIcons
                name="check-circle"
                size={22}
                color="#6366F1"
              />
              <Text className="text-slate-600 ml-4 flex-1 font-medium leading-6">
                Hệ thống tự động sắp xếp xe và loại xe dựa trên từng hành trình cụ thể.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
