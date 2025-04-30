"use client";

import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Linking,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import Modal from "react-native-modal";
import { LinearGradient } from "expo-linear-gradient";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import TimeAgo from "@/components/TimeAgo";
import { LFData } from "@/service/lost-found/LFAPI";
import { lostItemData } from "@/service/lost-found/lostItemClick";
import { foundItemData } from "@/service/lost-found/foundItemClick";
import { fetchUser } from "@/service/lost-found/fetchUser";

interface User {
  id: string;
  email: string;
  username: string;
}

interface LFItem {
  id: string;
  item_title: string;
  item_description: string;
  item_image?: string;
  item_category: string;
  item_date: string;
  item_contact: string;
  user_id: string;
}

export default function LostFoundScreen() {
  const router = useRouter();
  const [data, setData] = useState<LFItem[] | null>(null);
  const [isLostModalVisible, setIsLostModalVisible] = useState(false);
  const [isFoundModalVisible, setIsFoundModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LFItem | null>(null);
  const [reportedUser, setReportedUser] = useState<User | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>("1234567890");
  const [loadingModal, setLoadingModal] = useState(false);
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );
 
  const CACHE_KEY = "LF_CACHE";
  const ONE_HOUR_MS = 60 * 60 * 1000;

  const fetchData = async () => {
    try {
      const now = Date.now();

      // 1. Try loading from cache
      const cachedDataRaw = await AsyncStorage.getItem(CACHE_KEY);
      let finalData: LFItem[] = [];

      if (cachedDataRaw) {
        const cached = JSON.parse(cachedDataRaw);
        const freshItems = cached.filter(
          (item: any) => now - item._cachedAt < ONE_HOUR_MS
        );
        finalData = freshItems.map((item: any) => {
          const { _cachedAt, ...originalData } = item;
          return originalData;
        });

        // Update cache with only fresh data
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(freshItems));
      }

      // 2. Fetch from API
      const apiData = await LFData();
      const timestamped = apiData.map((item) => ({
        ...item,
        _cachedAt: now,
      }));

      // Combine and remove duplicates by ID
      const combinedMap = new Map();
      [...timestamped, ...finalData].forEach((item) => {
        combinedMap.set(item.id, item);
      });

      const combinedData = Array.from(combinedMap.values());

      // 3. Save to AsyncStorage
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(combinedData));

      // 4. Show on screen
      setData(combinedData.reverse());
    } catch (error) {
      console.error("Failed to load or cache data:", error);
    }
  };
  // const handleItemClick = async (
  //   id: string,
  //   userId: string,
  //   isLost: boolean
  // ) => {
  //   const itemData = isLost
  //     ? await lostItemData({ id })
  //     : await foundItemData({ id });

  //   const userData = await fetchUser({ id: userId });

  //   setSelectedItem(itemData);
  //   setReportedUser(userData);
  //   isLost ? setIsLostModalVisible(true) : setIsFoundModalVisible(true);
  // };

  const dialScreen = async () => {
    if (phoneNumber) {
      const url = `tel:${phoneNumber}`;
      Linking.openURL(url);
    } else {
      alert("Phone number is not provided");
    }
  };
  const renderItem = ({ item, isLost }: { item: LFItem; isLost: boolean }) => (
    <Pressable onPress={async() =>{ 
      await setSelectedItem(item);
      await fetchUser(item.user_id)
      isLost ? setIsLostModalVisible(true) : setIsFoundModalVisible(true);
    }}>
      <View
        style={styles.itemContainer}
        className="bg-[#fafdff] rounded-2xl border border-slate-300"
      >
        <Image
          source={
            item.item_image ? { uri: item.item_image } : images.movie_logo
          }
          style={styles.image}
          className="rounded-2xl"
        />

        <LinearGradient
          colors={["rgba(0,0,0,0.9)", "rgba(0,0,0,0.02)"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          className="p-6 h-24"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            padding: 12,
          }}
        >
          <Text
            numberOfLines={1}
            className="text-white font-bold text-md text-center"
          >
            {item.item_title}
          </Text>
          <Text numberOfLines={1} className="text-gray-50 text-sm mt-1">
            {item.item_description}
          </Text>
          <TimeAgo
            date={item.item_date}
            className="text-gray-300 text-xs mt-1"
          />
        </LinearGradient>
      </View>
    </Pressable>
  );

  const renderModalContent = () =>{ 
    if (loadingModal || !selectedItem) {
      return <ActivityIndicator size="large" color="#000" />;
    }
    
    return(
    
    <View className="bg-white rounded-2xl p-5 mx-4">
      <Pressable
        onPress={() => {
          setIsLostModalVisible(false);
          setIsFoundModalVisible(false);
        }}
        className="absolute -right-2 -top-2 z-10 p-3 bg-white rounded-full"
        style={{ elevation: 5 }}
      >
        <Image source={icons.cross} className="w-5 h-5" />
      </Pressable>

      <View className="relative mb-4">
        {selectedItem?.item_image && (
          <Image
            source={selectedItem.item_image ? { uri: selectedItem.item_image } : images.movie_logo}
            className="w-full h-60 rounded-xl"
            resizeMode="contain"
          />
        ) 
        // : (
        //   <View className="w-full h-48 bg-gray-100 rounded-xl justify-center items-center">
        //     <Text className="text-gray-400">No image available</Text>
        //   </View>
        // )
        }
        
      
      </View>

      <Text className="text-xl font-bold text-gray-800">
        {selectedItem?.item_title}
      </Text>
      <Text className="text-gray-600 mt-2">
        {selectedItem?.item_description}
      </Text>

      <View className="mt-4 space-y-1">
        <Text className="text-sm text-gray-500">
          Reported by: {reportedUser?.username || "Unknown"}
        </Text>
        <Text className="text-sm text-gray-500">
          Date:{" "}
          {selectedItem?.item_date ? (
            <TimeAgo date={selectedItem.item_date} />
          ) : (
            ""
          )}
        </Text>
        <Text className="text-sm text-gray-500">
          Contact: {selectedItem?.item_contact}
        </Text>
      </View>

      <Pressable
        className={`mt-6 py-3 rounded-lg ${
          isLostModalVisible ? "bg-red-500" : "bg-green-500"
        }`}
        onPress={() => {
          setIsLostModalVisible(false);
          setIsFoundModalVisible(false);
          dialScreen();
        }}
      >
        <Text className="text-white text-center font-medium">
          {isLostModalVisible ? "Return Item" : "Claim Item"}
        </Text>
      </Pressable>
    </View>
  );}

  return (
    <ScrollView className="bg-[#fdfcf9] flex-1 mb-[60px]">
      <View className="flex-row justify-between mx-5 mt-8 gap-4">
        <Pressable
          onPress={() => router.push("../Lost")}
          className="flex-1 bg-red-500 p-4 rounded-xl items-center shadow-lg"
        >
          <Image source={icons.sad_face} className="w-12 h-12 tint-white" />
          <Text
            style={{ fontFamily: "transcity" }}
            className="text-white text-2xl mt-2"
          >
            Lost
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("../Found")}
          className="flex-1 bg-green-500 p-4 rounded-xl items-center shadow-lg"
        >
          <Image source={icons.happy_face} className="w-12 h-12 tint-white" />
          <Text
            style={{ fontFamily: "transcity" }}
            className="text-white text-2xl mt-2"
          >
            Found
          </Text>
        </Pressable>
      </View>

      {/* Recently Lost Section */}
      <View className="mt-8 mx-5">
        <Text
          style={{ fontFamily: "transcity" }}
          className="text-3xl text-gray-800"
        >
          Recently Lost
        </Text>
        {!data ? (
          <View className="h-40 justify-center">
            <ActivityIndicator size="large" color="#ef4444" />
          </View>
        ) : (
          <FlatList
            horizontal
            data={data.filter((item) => item.item_category === "LOST")}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            className="mt-4"
            renderItem={({ item }) => renderItem({ item, isLost: true })}
            ListEmptyComponent={
              <Text className="text-gray-400 mt-4">No lost items found</Text>
            }
          />
        )}
      </View>

      {/* Recently Found Section */}
      <View className="mt-8 mx-5 mb-10">
        <Text
          style={{ fontFamily: "transcity" }}
          className="text-3xl text-gray-800"
        >
          Recently Found
        </Text>
        {!data ? (
          <View className="h-40 justify-center">
            <ActivityIndicator size="large" color="#22c55e" />
          </View>
        ) : (
          <FlatList
            horizontal
            data={data.filter((item) => item.item_category === "FOUND")}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            className="mt-4"
            renderItem={({ item }) => renderItem({ item, isLost: false })}
            ListEmptyComponent={
              <Text className="text-gray-400 mt-4">No found items</Text>
            }
          />
        )}
      </View>

      {/* Unified Modal */}
      <Modal
        isVisible={isLostModalVisible || isFoundModalVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropColor="rgba(0,0,0,0.5)"
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={300}
        onBackdropPress={() => {
          setIsLostModalVisible(false);
          setIsFoundModalVisible(false);
        }}
        style={styles.modal}
      >
        {renderModalContent()}
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    width: 200,
    marginRight: 16,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 200,
    height: 240,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: "#f3f4f6",
  },
  modal: {
    justifyContent: "center",
    margin: 0,
  },
});
