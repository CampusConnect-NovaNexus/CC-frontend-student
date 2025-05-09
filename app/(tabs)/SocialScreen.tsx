import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Pressable,
} from "react-native";
import React, { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Forum from "@/components/Forum";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from "expo-router";
import { getAllPosts } from "@/service/socials/posts";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import { createPost } from "@/service/socials/new_post";
import { icons } from "@/constants/icons";

interface ForumItem {
  post_id: string;
  comment_count: number;
  created_at: string;
  description: string;
  title: string;
  image: string;
  upvotes: string[];
  user_id: string;
}

const CACHE_KEY = "SOCIAL_POSTS_CACHE";
const CACHE_TIMESTAMP_KEY = "SOCIAL_POSTS_TIMESTAMP";
const ONE_HOUR_MS = 60 * 60 * 1000;

const SocialScreen = () => {
  const [data, setData] = useState<ForumItem[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const user_id="user3456"
  const [addPostVisible, setAddPostVisible] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<null | {
    uri: string;
    name: string;
    type: string;
  }>(null);
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      setImageFile({
        uri: asset.uri,
        name: asset.fileName ?? asset.uri.split("/").pop() ?? "photo.jpg",
        type: asset.type ?? "image/jpeg",
      });
    }
  };
  const newPost=async()=>{
    const response = await createPost(
      user_id,
      title,
      description,
    );
    fetchAndCacheData();
  }
  const loadCachedData = async () => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      const timestamp = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY);

      if (cached && timestamp) {
        const age = Date.now() - parseInt(timestamp, 10);
        if (age < ONE_HOUR_MS) {
          const parsed = JSON.parse(cached);
          setData(parsed);

          return;
        } else {
          await AsyncStorage.multiRemove([CACHE_KEY, CACHE_TIMESTAMP_KEY]);
        }
      } else {
        console.log(" No valid cache found.");
      }
    } catch (error) {
      console.log("Error loading cache:", error);
    }
  };

  const fetchAndCacheData = async () => {
    try {
      const response = await getAllPosts();
      if (response && Array.isArray(response.posts)) {
        setData(response.posts);
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(response.posts));
        await AsyncStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      } else {
        console.warn("Unexpected API response:", response);
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCachedData();
      fetchAndCacheData();
    }, [])
  );

  return (
    <View className="min-h-screen">
      <FlatList
        data={data}
        renderItem={({ item }) => <Forum item={item} />}
        keyExtractor={(item) => item.post_id}
      />
      <TouchableOpacity
        className="absolute bottom-40 right-6 bg-lime-600 rounded-full p-5"
        onPress={() => {
          setAddPostVisible(true);
        }}
      >
        <Ionicons name="add-circle" size={26} color="#fdfcf9" />
      </TouchableOpacity>
      <Modal
        isVisible={addPostVisible}
        onBackdropPress={() => setAddPostVisible(false)}
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
        animationInTiming={400}
        animationOutTiming={400}
        backdropTransitionInTiming={400}
        backdropTransitionOutTiming={200}
        backdropColor="rgba(0,0,0,0.5)"
        className="m-0 w-full"
      >
        <View className="bg-black/35 h-screen w-full  flex-col items-center justify-center">
          <View className="bg-white rounded-xl px-3  ">
            <Pressable className="absolute -top-4 -right-4 bg-white rounded-full p-1  "
              onPress={()=>setAddPostVisible(false)}
            >
              <Image source={icons.cross} className="size-6 " />
            </Pressable>
            <View>
              <Text>Title</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                className="border-[1px] border-black rounded-lg p-2 w-[80%] "
              />

              <Text>Description</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                className="border-[1px] border-black rounded-lg p-2 w-[80%] "
              />
              <Pressable
                onPress={pickImage}
                className="bg-gray-100 p-4 rounded-xl mb-4 items-center border-2 border-dashed border-gray-300"
              >
                <Text className="text-gray-600 font-medium">
                  {imageFile ? "Change Image" : "Select Image"}
                </Text>
              </Pressable>

              {imageFile && (
                <Image
                  source={{ uri: imageFile.uri }}
                  className="w-full h-40 rounded-xl mb-4"
                  resizeMode="cover"
                />
              )}
              <View>
                <Pressable
                  onPress={() => {
                    setAddPostVisible(false);
                    setDescription("");
                    setTitle("");
                    setImageFile(null);
                  }}
                  className="bg-red-500 px-3 rounded-xl py-2 "
                >
                  <Text className="text-white ">Drop</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    newPost();
                    setAddPostVisible(false);
                    setDescription("");
                    setTitle("");
                    setImageFile(null);
                  }}
                  className="bg-green-500 px-3 rounded-xl py-2 "
                >
                  <Text className="text-white ">Post</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SocialScreen;
