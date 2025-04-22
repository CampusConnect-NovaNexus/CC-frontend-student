"use client";

import { useState, useEffect,useCallback } from "react";
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
} from "react-native";
import { useRouter } from "expo-router";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { LFData } from "@/service/lost-found/LFAPI";
import { lostItemData } from "@/service/lost-found/lostItemClick";
import { foundItemData } from "@/service/lost-found/foundItemClick";
import { fetchUser } from "@/service/lost-found/fetchUser";

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

  const lostListItem=({item})=>{
    if(item.item_category==="FOUND")return null
      return(
        <Pressable
              onPress={async () => {
                await onLostItemClick(item.id, item.user_id);
                setLostItemInView(item)
              }}
            >
              <View
                style={styles.itemContainer}
                className=" overflow-hidden bg-slate-600 p-5 rounded-lg items-center"
              >
                <Image
                  source={
                    item.item_image
                      ? { uri: item.item_image }
                      : images.movie_logo
                  }
                  style={styles.image}
                />
                <Text className="text-white overflow-hidden text-lg font-semibold mt-2">
                  {item.item_title}
                </Text>
              </View>
            </Pressable>
      )
    
    return null;
  }
  const foundListItem=({item})=>{
    if(item.item_category==="LOST")return null
      return(
        <Pressable
              onPress={async () => {
                await onFoundItemClick(item.id,item.user_id);
                setFoundItemInView(item);
              }}
            >
              <View
                style={styles.itemContainer}
                className="bg-slate-600 p-5 rounded-lg items-center"
              >
                <Image
                  source={
                    item.item_image
                      ? { uri: item.item_image }
                      : images.movie_logo
                  }
                  style={styles.image}
                />
                <Text className="text-white text-lg font-semibold mt-2">
                  {item.item_title}
                </Text>
              </View>
            </Pressable>
      )
  }

  const getUser = async (id: string) => {
    //can i reduce time by setting item_info from the retrieved data from LFAPI
    const user_info = await fetchUser({ id });
    setReportedUser(user_info);
  };

  const onLostItemClick = async (id: string, userId: string) => {
   // const item_info = await lostItemData({ id });
    //setLostItemInView(item_info);
    await getUser(userId);
    setShowLostItem(true);
  };

  const onFoundItemClick = async (id: string, userId: string) => {
    //const item_info = await foundItemData({ id });
    //setFoundItemInView(item_info);
    await getUser(userId);
    setShowFoundItem(true);
  };

  
  
      useFocusEffect(
        useCallback(()=>{
          const fetchData =async()=>{
            const result=await LFData();
           
            
            
            setData(result.reverse());
          }
    
          fetchData();
        },[])
      )
  return (
    <ScrollView className="">
      <View className="flex mx-4 mt-10 flex-row justify-around">
        <Pressable
          onPress={() => router.push("../Lost")}
          className="flex p-5 bg-red-500 flex-row w-[40%] items-center justify-center gap-3 rounded-lg"
        >
          <Image
            source={icons.sad_face}
            tintColor="white"
            className="h-8 w-8 m-2"
          />
          <Text className="text-2xl text-white">Lost</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("../Found")}
          className="flex p-5 bg-green-500 w-[40%]  flex-row items-center justify-center gap-3 rounded-lg"
        >
          <Image
            source={icons.happy_face}
            tintColor="white"
            className="h-8 w-8 m-2"
          />
          <Text className="text-2xl text-white">Found</Text>
        </Pressable>
      </View>

      <View className="mt-7 border border-black mx-1 rounded-md p-2">
        <Text className="text-2xl ml-3 font-semibold text-gray-800">
          Recently Lost
        </Text>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          horizontal
          className="mt-5"
          renderItem={lostListItem}
        />
      </View>

      <View className="mt-7 border border-black mx-1 rounded-md p-2">
        <Text className="text-2xl ml-3 font-semibold text-gray-800">
          Recently Found
        </Text>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          horizontal
          className="mt-5"
          renderItem={foundListItem}
        />
      </View>

      {/* Lost Item Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showLostItem}
        onRequestClose={() => setShowLostItem(false)}
      >
        {showLostItem && lostItemInView && (
          <View className="flex-1 justify-center items-center bg-black/60 px-5">
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
              <Pressable
                onPress={() => setShowLostItem(false)}
                className="bg-red-500 mt-4 py-2 px-4 rounded-lg"
              >
                <Text className="text-white text-center">Close</Text>
              </Pressable>
            </View>
          </View>
        )}
      </Modal>

      {/* Found Item Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFoundItem}
        onRequestClose={() => setShowFoundItem(false)}
      >
        {showFoundItem && foundItemInView  && (
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
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: "#ccc",
  },
});
