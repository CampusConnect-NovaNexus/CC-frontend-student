"use client";

import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  Pressable,
  ActivityIndicator
} from "react-native";
import { useRouter } from "expo-router";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { LFData } from "@/service/lost-found/LFAPI";
import { lostItemData } from "@/service/lost-found/lostItemClick";
import { foundItemData } from "@/service/lost-found/foundItemClick";
import { fetchUser } from "@/service/lost-found/fetchUser";
import My_modal from "@/components/My_modal";

interface user {
  id: string;
  email: string;
  username: string;
}

export default function LostFoundScreen() {
  const [data, setData] = useState(null);
  const [showLostItem, setShowLostItem] = useState(false);
  const [showFoundItem, setShowFoundItem] = useState(false);
  const [lostItemInView, setLostItemInView] = useState(null);
  const [foundItemInView, setFoundItemInView] = useState(null);
  const [reportedUser, setReportedUser] = useState<user | null>(null);
  const router = useRouter();

  const lostListItem = ({ item }) => {
    if (item.item_category === "FOUND") {
      return null;
    }
    
    return (
      <Pressable
        onPress={async () => {
          await onLostItemClick(item.id, item.user_id);
          setLostItemInView(item)
        }}
      >
        <View
          style={styles.itemContainer}
          className="overflow-hidden bg-[#fafdff] rounded-2xl border-[1px] border-slate-500"
        >
          <Image
            source={
              item.item_image
                ? { uri: item.item_image }
                : images.movie_logo
            }
            style={styles.image}
            className="object-cover"
          />
          <Text className="text-black overflow-hidden px-3 text-md font-semibold my-2 text-center">
            {item.item_title}
          </Text>
          <Text numberOfLines={2} className="text-gray-700 overflow-hidden text-sm px-5 pb-2 ">
            {item.item_description}
          </Text>
        </View>
      </Pressable>
    );
  }
  const foundListItem = ({ item }) => {
    if (item.item_category === "LOST") {
      return null;
    }
    
    return (
      <Pressable
        onPress={async () => {
          await onFoundItemClick(item.id, item.user_id);
          setFoundItemInView(item);
        }}
      >
        <View
          style={styles.itemContainer}
          className="overflow-hidden bg-[#fafdff] rounded-2xl border-[1px] border-slate-500"
        >
          <Image
            source={
              item.item_image
                ? { uri: item.item_image }
                : images.movie_logo
            }
            style={styles.image}
            className="object-cover"
          />
          <Text className="text-black overflow-hidden px-3 text-lg font-semibold mt-2 text-center">
            {item.item_title}
          </Text>
          <Text className="text-gray-700 overflow-hidden text-sm px-5 pb-2">
            {item.item_description}
          </Text>
        </View>
      </Pressable>
    );
  }

  const getUser = async (id: string) => {
    //can i reduce time by setting item_info from the retrieved data from LFAPI
    const user_info = await fetchUser({ id });
    setReportedUser(user_info);
  };

  const onLostItemClick = async (id: string, userId: string) => {
    const item_info = await lostItemData({ id });
    setLostItemInView(item_info);
    await getUser(userId);
    setShowLostItem(true);
  };

  const onFoundItemClick = async (id: string, userId: string) => {
    const item_info = await foundItemData({ id });
    setFoundItemInView(item_info);
    await getUser(userId);
    setShowFoundItem(true);
  };



  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const result = await LFData();



        setData(result.reverse());
      }

      fetchData();
    }, [])
  )
  return (
    <ScrollView className="bg-[#fdfcf9] mb-[60px]">
      <View className="flex mx-4 mt-10 flex-row justify-around">
        <Pressable
          onPress={() => router.push("../Lost")}
          className="flex p-5 bg-red-500 flex-row w-[45%] items-center justify-center gap-3 rounded-xl shadow-gray-800 shadow-xl"
        >
          <Image
            source={icons.sad_face}
            tintColor="white"
            className="h-8 w-8 m-1"
          />
          <Text style={{ fontFamily: "transcity" }} className="text-4xl pt-1 text-white">Lost</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("../Found")}
          className="flex p-3 bg-green-500 w-[45%]  flex-row items-center justify-center gap-3 rounded-xl"
        >
          <Image
            source={icons.happy_face}
            tintColor="white"
            className="h-8 w-8 m-1"
          />
          <Text style={{ fontFamily: "transcity" }} className="text-4xl pt-1 text-white">Found</Text>
        </Pressable>
      </View>

      <View className="mt-7 mx-3 rounded-xl p-2 pt-4 ">
        <Text style={{ fontFamily: "transcity" }} className="text-4xl ml-3 font-semibold text-black">
          Recently Lost
        </Text>

        {/* Show ActivityIndicator if data is null or empty */}
        {!data ? (
          <View className="h-40 justify-center items-center">
            <ActivityIndicator size="large" color="#f59e0b" />
          </View>
        ) : (
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={data}
            keyExtractor={(item) => item.id}
            horizontal
            className="mt-5"
            renderItem={lostListItem}
          />
        )}
      </View>

      <View className="mt-7 mx-3 rounded-xl p-2 pt-4">
        <Text style={{ fontFamily: "transcity" }} className="text-4xl ml-3 font-semibold text-black">
          Recently Found
        </Text>

        {/* Show loader while data is loading/empty */}
        {!data ? (
          <View className="h-40 justify-center items-center">
            <ActivityIndicator size="large" color="#f59e0b" /> {/* amber-500 */}
          </View>
        ) : (
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={data}
            keyExtractor={(item) => item.id}
            horizontal
            className="mt-5 mb-10"
            renderItem={foundListItem}
            ListEmptyComponent={  // Fallback if data becomes empty after load
              <View className="h-40 justify-center items-center">
                <Text className="text-gray-500">No found items yet</Text>
              </View>
            }
          />
        )}
      </View>

      {/* Lost Item Modal */}

      <My_modal
        visible={showLostItem && lostItemInView !== null}
        onClose={() => setShowLostItem(false)}
      >
        {lostItemInView && (
          <View className="flex-1 justify-center items-center bg-transparent px-5">
            <View className="bg-white p-5 rounded-xl w-full max-w-md">
              {lostItemInView.item_image ? (
                <Image
                  source={{ uri: lostItemInView.item_image }}
                  className="w-full h-40 rounded mb-4"
                  resizeMode="cover"
                />
              ) : (
                <Text className="text-gray-500 text-center mb-4">
                  Image is unavailable
                </Text>
              )}
              <Text className="text-xl font-bold mb-2">
                {lostItemInView.item_title}
              </Text>
              <Text className="mb-2">{lostItemInView.item_description}</Text>
              <Text className="text-sm text-gray-600 mt-3">
                Reported by {reportedUser?.username ?? "Loading..."}
              </Text>
              {/* <Pressable
                onPress={() => setShowLostItem(false)}
                className="bg-red-500 mt-4 py-2 px-4 rounded-lg"
              >
                <Text className="text-white text-center">Close</Text>
              </Pressable> */}
            </View>
          </View>
        )}
      </My_modal>

      {/* Found Item Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFoundItem}
        onRequestClose={() => setShowFoundItem(false)}
      >
        {showFoundItem && foundItemInView && (
          <View className="flex-1 justify-center items-center bg-black/60 px-5">
            <View className="bg-white p-5 rounded-xl w-full max-w-md">
              <Text className="text-xl font-bold mb-2">
                {foundItemInView.item_title}
              </Text>
              <Text className="mb-2">{foundItemInView.item_description}</Text>
              <Text className="text-sm text-gray-600 mt-3">
                Reported by {reportedUser?.username ?? "Loading..."}
              </Text>
              <Pressable
                onPress={() => setShowFoundItem(false)}
                className="bg-green-500 mt-4 py-2 px-4 rounded-lg"
              >
                <Text className="text-white text-center">Close</Text>
              </Pressable>
            </View>
          </View>
        )}
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    marginHorizontal: 10,
    width: 150,
  },
  image: {
    width: 150,
    height: 150,
    backgroundColor: "#ccc",
  },
});
