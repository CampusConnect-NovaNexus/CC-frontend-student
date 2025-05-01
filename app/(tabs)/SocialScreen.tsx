
import { useCallback, useState } from "react";
import {
  View,
  FlatList,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  Image,
} from "react-native";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getAllPosts } from "@/service/socials/posts";
import { getCommentsForPost } from "@/service/socials/getComment";
import { addCommentToPost } from "@/service/socials/addComment";
import { createPost } from "@/service/socials/new_post";
import Forum from "@/components/Forum";
import {icons} from "@/constants/icons";

const CACHE_KEY = "SOCIAL_POSTS_CACHE";
const CACHE_TIMESTAMP_KEY = "SOCIAL_POSTS_TIMESTAMP";
const COMMENT_CACHE_KEY = (postId: string) => `COMMENTS_CACHE_${postId}`;
const COMMENT_TIMESTAMP_KEY = (postId: string) => `COMMENTS_TIMESTAMP_${postId}`;
const ONE_HOUR_MS = 60 * 60 * 1000;

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
interface Comment {
  comment_id: string;
  post_id: string;
  comment: string;
  user_id: string;
}


const SocialScreen = () => {
  const [data, setData] = useState<ForumItem[]>([]);
  const [selectedPost, setSelectedPost] = useState<ForumItem | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [addPostVisible, setAddPostVisible] = useState<boolean>(false);
  const [detailPostVisible, setDetailPostVisible] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>("");
  const [comments, setComments] = useState<Comment[] | null>(null);
  const user_id = "user3456";

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

  const postComment = async (postId: string) => {
    if (!newComment.trim()) return;
    try {
      await addCommentToPost(postId, user_id, newComment.trim());
      setNewComment("");
      await getComments(postId, true);
    } catch (error) {
      console.log("Error posting comment:", error);
    }
  };

  const getComments = async (postId: string, forceRefresh = false) => {
    try {
      const timestampKey = COMMENT_TIMESTAMP_KEY(postId);
      const cacheKey = COMMENT_CACHE_KEY(postId);
      const now = Date.now();

      const cached = await AsyncStorage.getItem(cacheKey);
      const timestamp = await AsyncStorage.getItem(timestampKey);

      if (cached && timestamp && !forceRefresh) {
        const age = now - parseInt(timestamp, 10);
        if (age < ONE_HOUR_MS) {
          setComments(JSON.parse(cached));
          return;
        } else {
          await AsyncStorage.multiRemove([cacheKey, timestampKey]);
        }
      }

      const response = await getCommentsForPost(postId);
      if (response?.comments) {
        console.log(response?.comments);
        
        setComments(response.comments);
        await AsyncStorage.setItem(cacheKey, JSON.stringify(response.comments));
        await AsyncStorage.setItem(timestampKey, now.toString());
      }
    } catch (error) {
      console.log("Error getting comments:", error);
    }
  };

  const newPost = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Please fill all the fields");
      return;
    }

    try {
      const image = imageFile ?? undefined;
      await createPost(user_id, title.trim(), description.trim(), image);
      await fetchAndCacheData();
      setAddPostVisible(false);
      setDescription("");
      setTitle("");
      setImageFile(null);
    } catch (error) {
      console.error("Post creation failed", error);
      alert("Failed to create post. Try again.");
    }
  };

  const loadCachedData = async () => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      const timestamp = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY);
      if (cached && timestamp) {
        const age = Date.now() - parseInt(timestamp, 10);
        if (age < ONE_HOUR_MS) {
          setData(JSON.parse(cached));
          return;
        } else {
          await AsyncStorage.multiRemove([CACHE_KEY, CACHE_TIMESTAMP_KEY]);
        }
      }
    } catch (error) {
      console.log("Error loading cache:", error);
    }
  };

  const fetchAndCacheData = async () => {
    try {
      const response = await getAllPosts();
      if (Array.isArray(response?.posts)) {
        setData(response.posts);
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(response.posts));
        await AsyncStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
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
    <View className="min-h-screen flex-col gap-4 ">
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <Pressable
            onPress={async () => {
              console.log('pressed in SS ');
              
              setSelectedPost(item);
              console.log('setSelectedPost : ', selectedPost);
              setDetailPostVisible(true);
              console.log('getting comments');
              
              await getComments(item.post_id);
            }}
            className="bg-red-300 py-6"
          >
            <Forum item={item} />
          </Pressable>
        )}
        keyExtractor={(item) => item.post_id}
        className="mb-40"
      />

      <TouchableOpacity
        className="absolute bottom-40 right-6 bg-lime-600 rounded-full p-5"
        onPress={() => setAddPostVisible(true)}
      >
        <Ionicons name="add-circle" size={26} color="#fdfcf9" />
      </TouchableOpacity>

      <Modal isVisible={addPostVisible} onBackdropPress={() => setAddPostVisible(false)}>
        <View className="bg-white p-5 rounded-xl">
          <Pressable className="absolute -top-4 -right-4" onPress={() => setAddPostVisible(false)}>
            <Image source={icons.cross} className="size-6" />
          </Pressable>

          <Text>Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            className="border p-2 rounded-lg mb-2"
          />

          <Text>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            className="border p-2 rounded-lg mb-2"
            multiline
          />

          <Pressable onPress={pickImage} className="bg-gray-100 p-3 rounded-xl mb-4">
            <Text>{imageFile ? "Change Image" : "Select Image"}</Text>
          </Pressable>

          {imageFile && (
            <Image source={{ uri: imageFile.uri }} className="w-full h-40 rounded-xl mb-4" />
          )}

          <View className="flex-row justify-between">
            <Pressable
              onPress={() => {
                setAddPostVisible(false);
                setTitle("");
                setDescription("");
                setImageFile(null);
              }}
              className="bg-red-500 px-4 py-2 rounded-xl"
            >
              <Text className="text-white">Drop</Text>
            </Pressable>
            <Pressable onPress={newPost} className="bg-green-500 px-4 py-2 rounded-xl">
              <Text className="text-white">Post</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SocialScreen;
