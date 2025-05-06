import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  RefreshControl,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import Toast from "react-native-toast-message";
import { getGrievanceOfUser } from "@/service/grievance/getGrievanceByUserId";
import { getUsersPost } from "@/service/socials/getPostsByUserId";
import { useLocalSearchParams } from "expo-router";
import { deleteGrievance } from "@/service/grievance/deleteGrievance";
import { deletePost } from "@/service/socials/deletePost";
const categories = [
  { key: "LF", label: "Lost-Found" },
  { key: "GR", label: "Grievances" },
  { key: "IS", label: "IntraSocial" },
];

const PostsOfUser = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [dataType, setDataType] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const { user_id } = useLocalSearchParams<{ user_id: string }>();

  const onRefresh = () => {
    if (selectedCategory) fetchData(selectedCategory, true);
  };

  const fetchData = async (category: string, isRefresh = false) => {
    if (!category) {
      Toast.show({
        type: "error",
        text1: "Please select a category",
        position: "top",
      });
      return;
    }

    if (!isRefresh) setLoading(true);
    if (isRefresh) setRefreshing(true);

    try {
      if (category === "GR") {
        console.log("finding grievance of user ");

        const result = await getGrievanceOfUser(user_id);

        if (!result?.complaint) {
          Toast.show({
            type: "error",
            text1: "No grievances found",
            position: "top",
          });
        }

        await setData(result?.complaint);

        await setDataType("GR");
        console.log("data in GR : ", data, " dataType: ", dataType);
      }
      if (category === "IS") {
        console.log("finding posts ");
        const result = await getUsersPost(user_id);
        console.log("result from IS : ", result);
        if (result?.message === "Post not found") {
          Toast.show({
            type: "success",
            text1: "You have no posts",
            position: "top",
          });
          console.log("setting data in IS");

          setData(result.post);
          setDataType("IS");

          return;
        }
        setData(result.post);
        setDataType("IS");
        console.log("data in IS : ", data, " dataType: ", dataType);
      }

      // Add LF and IS fetch logic here if available
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error fetching data",
        position: "top",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  const deleteMyGrievance = async (c_id: string) => {
    const response = deleteGrievance(c_id);
    Toast.show({
      type: "success",
      text1: "Grievance Deleted",
      position:'top'
    });
  };
  const deleteMyPost = async (post_id: string) => {
    const response = deletePost(post_id);
    Toast.show({
      type: "success",
      text1: "Post Deleted",
      position:'top'
    });
  };
  const renderPosts = ({ item }: any) => {
    console.log("item : ", item);
    if (dataType === "GR") {
      return (
        <View className="p-4 bg-gray-500 rounded-lg shadow m-2">
          <Text className="text-lg font-bold">{item.title}</Text>
          <Text className="text-gray-700 mt-1">{item.description}</Text>
          {item.post_image_url && <Image source={{ uri: item.item_image }} />}
          <Pressable
            onPress={async()=>{
              await deleteMyGrievance(item.c_id)
              fetchData('GR')
            }}
          >
            <Text>Delete</Text>
          </Pressable>
        </View>
      );
    } else if (dataType === "IS") {
      return (
        <View className="p-4 bg-white rounded-lg shadow m-2">
          <Text className="text-lg font-bold">{item.title}</Text>
          <Text className="text-gray-700 mt-1">{item.description}</Text>
          <Text className="text-sm text-gray-500 mt-2">
            Upvotes: {item.upvotes} | Category: {item.category}
          </Text>
          <Pressable
            onPress={async()=>{
              await deleteMyPost(item.post_id)
              fetchData('IS')
            }}
          >
            <Text>Delete</Text>
          </Pressable>
        </View>
      );
    }else if (dataType === "LF") {
      return (
        <View className="p-4 bg-white rounded-lg shadow m-2">
          
        </View>
      );
    }

    return null;
  };

  const handleCategoryPress = async (key: string) => {
    if (key === selectedCategory) return;
    setSelectedCategory(key);
    fetchData(key);
  };

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold mb-4">Your Posts</Text>

      <View className="flex-row justify-between mb-4">
        {categories.map((cat) => (
          <Pressable
            key={cat.key}
            onPress={() => handleCategoryPress(cat.key)}
            className={`px-4 py-2 rounded-full ${
              selectedCategory === cat.key ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                selectedCategory === cat.key ? "text-white" : "text-gray-800"
              }`}
            >
              {cat.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4B5563" className="mt-10" />
      ) : (
        selectedCategory === dataType && (
          <FlatList
            data={data}
            keyExtractor={(item) => item.post_id}
            renderItem={renderPosts}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={
              <View>
                <Text>Nothing found</Text>
              </View>
            }
            extraData={data}
          />
        )
      )}
    </View>
  );
};

export default PostsOfUser;
