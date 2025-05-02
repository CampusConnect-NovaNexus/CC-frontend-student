import { useCallback, useState, useEffect } from "react";
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
import { icons } from "@/constants/icons";

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
  const [user_id, setUserId] = useState<string>("");

  useEffect(() => {
    // Load user_id from AsyncStorage when component mounts
    const getUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('@user_id');
        if (id) {
          setUserId(id);
        }
      } catch (error) {
        console.error('Error fetching user id:', error);
      }
    };
    
    getUserId();
  }, []);

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
      await createPost({ title, user_id, description, image });
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
    <View className="flex-1 bg-[#F3F2EF]">
      {/* LinkedIn-style header */}
      <View className="bg-white px-4 py-2 flex-row items-center justify-between border-b border-gray-200">
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-full bg-blue-600 mr-2 overflow-hidden">
            <Image 
              source={icons.profile} 
              className="w-full h-full" 
              resizeMode="cover"
            />
          </View>
          <View className="flex-1 h-9 bg-[#EEF3F8] rounded-full px-3 flex-row items-center">
            <Ionicons name="search" size={16} color="#666" />
            <Text className="text-gray-500 ml-2 text-sm">Search</Text>
          </View>
        </View>
        <Ionicons name="chatbubble-ellipses-outline" size={24} color="#666" />
      </View>

      {/* Post creation quick access */}
      <View className="bg-white mt-2 px-4 py-3 flex-row items-center border-b border-gray-200">
        <View className="w-10 h-10 rounded-full overflow-hidden mr-3">
          <Image 
            source={icons.profile} 
            className="w-full h-full" 
            resizeMode="cover"
          />
        </View>
        <TouchableOpacity 
          className="flex-1 h-10 border border-gray-300 rounded-full px-4 justify-center"
          onPress={() => setAddPostVisible(true)}
        >
          <Text className="text-gray-500">Start a post</Text>
        </TouchableOpacity>
      </View>

      {/* Post type options */}
      <View className="bg-white px-2 py-1 flex-row justify-between border-b border-gray-200">
        <TouchableOpacity className="flex-row items-center p-2">
          <Ionicons name="image" size={18} color="#70B5F9" />
          <Text className="ml-1 text-gray-500 text-xs">Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center p-2">
          <Ionicons name="videocam" size={18} color="#7FC15E" />
          <Text className="ml-1 text-gray-500 text-xs">Video</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center p-2">
          <Ionicons name="calendar" size={18} color="#E7A33E" />
          <Text className="ml-1 text-gray-500 text-xs">Event</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center p-2">
          <Ionicons name="document-text" size={18} color="#F5987E" />
          <Text className="ml-1 text-gray-500 text-xs">Article</Text>
        </TouchableOpacity>
      </View>

      {/* Posts feed */}
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <Pressable
            onPress={async () => {
              setSelectedPost(item);
              setDetailPostVisible(true);
              await getComments(item.post_id);
            }}
            className="bg-white my-2 shadow-sm"
          >
            <Forum item={item} />
          </Pressable>
        )}
        keyExtractor={(item) => item.post_id}
        className="flex-1"
        showsVerticalScrollIndicator={false}
      />

      {/* Create post modal */}
      <Modal 
        isVisible={addPostVisible} 
        onBackdropPress={() => setAddPostVisible(false)}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropTransitionOutTiming={0}
        style={{ margin: 0, justifyContent: 'flex-end' }}
      >
        <View className="bg-white rounded-t-xl p-4 pb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold">Create a post</Text>
            <Pressable onPress={() => setAddPostVisible(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </Pressable>
          </View>

          <View className="flex-row items-center mb-4">
            <View className="w-12 h-12 rounded-full overflow-hidden mr-3">
              <Image 
                source={icons.profile} 
                className="w-full h-full" 
                resizeMode="cover"
              />
            </View>
            <View>
              <Text className="font-bold">Your Name</Text>
              <TouchableOpacity className="flex-row items-center mt-1">
                <Ionicons name="globe-outline" size={14} color="#666" />
                <Text className="text-xs text-gray-500 ml-1">Anyone</Text>
                <Ionicons name="chevron-down" size={14} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Add a headline"
            className="text-base mb-3 border-b border-gray-200 pb-2"
          />

          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="What do you want to talk about?"
            multiline
            className="text-base min-h-[100px] mb-4"
          />

          {imageFile && (
            <View className="mb-4 relative">
              <Image source={{ uri: imageFile.uri }} className="w-full h-48 rounded-lg" />
              <TouchableOpacity 
                className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1"
                onPress={() => setImageFile(null)}
              >
                <Ionicons name="close" size={16} color="white" />
              </TouchableOpacity>
            </View>
          )}

          <View className="flex-row border-t border-gray-200 pt-3">
            <TouchableOpacity 
              onPress={pickImage}
              className="flex-row items-center mr-4"
            >
              <Ionicons name="image-outline" size={24} color="#0a66c2" />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center mr-4">
              <Ionicons name="videocam-outline" size={24} color="#0a66c2" />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center mr-4">
              <Ionicons name="document-outline" size={24} color="#0a66c2" />
            </TouchableOpacity>
            <View className="flex-1" />
            <TouchableOpacity 
              onPress={newPost}
              className={`px-4 py-2 rounded-full ${title.trim() && description.trim() ? 'bg-[#0a66c2]' : 'bg-gray-300'}`}
              disabled={!title.trim() || !description.trim()}
            >
              <Text className="text-white font-medium">Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Post detail modal */}
      <Modal
        isVisible={detailPostVisible}
        onBackdropPress={() => setDetailPostVisible(false)}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        style={{ margin: 0, justifyContent: 'flex-end' }}
      >
        <View className="bg-white rounded-t-xl max-h-[90%]">
          {selectedPost && (
            <View>
              <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                <View className="w-10" />
                <Text className="font-semibold">Post</Text>
                <Pressable onPress={() => setDetailPostVisible(false)}>
                  <Ionicons name="close" size={22} color="#666" />
                </Pressable>
              </View>
              
              <View>
                <Forum item={selectedPost} />
              </View>
              
              <View className="px-4 pb-6">
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="font-semibold text-base">Comments</Text>
                  <TouchableOpacity>
                    <Text className="text-sm text-[#0a66c2]">Most relevant ▼</Text>
                  </TouchableOpacity>
                </View>
                
                <FlatList
                  data={comments}
                  renderItem={({ item }) => (
                    <View className="flex-row mb-4">
                      <View className="w-10 h-10 rounded-full overflow-hidden mr-3">
                        <Image 
                          source={icons.profile} 
                          className="w-full h-full" 
                          resizeMode="cover"
                        />
                      </View>
                      <View className="flex-1">
                        <View className="bg-[#F2F2F2] p-3 rounded-xl">
                          <Text className="font-bold text-sm">User</Text>
                          <Text className="text-sm mt-1">{item.comment}</Text>
                        </View>
                        <View className="flex-row items-center mt-1 ml-2">
                          <Text className="text-xs text-gray-500 mr-4">Like</Text>
                          <Text className="text-xs text-gray-500">Reply</Text>
                        </View>
                      </View>
                    </View>
                  )}
                  keyExtractor={(item) => item.comment_id}
                  ListEmptyComponent={
                    <View className="py-6 items-center">
                      <Ionicons name="chatbubble-ellipses-outline" size={40} color="#ccc" />
                      <Text className="text-gray-400 mt-2 text-center">No comments yet</Text>
                      <Text className="text-gray-400 text-center">Be the first to comment</Text>
                    </View>
                  }
                  style={{ maxHeight: 300 }}
                />
                
                <View className="flex-row items-center mt-3 bg-[#F2F2F2] rounded-full px-4 py-2">
                  <View className="w-8 h-8 rounded-full overflow-hidden mr-2">
                    <Image 
                      source={icons.profile} 
                      className="w-full h-full" 
                      resizeMode="cover"
                    />
                  </View>
                  <TextInput
                    value={newComment}
                    onChangeText={setNewComment}
                    placeholder="Add a comment..."
                    className="flex-1 text-sm"
                  />
                  <TouchableOpacity 
                    onPress={() => postComment(selectedPost.post_id)}
                    disabled={!newComment.trim()}
                  >
                    <Ionicons 
                      name="send" 
                      size={20} 
                      color={newComment.trim() ? "#0a66c2" : "#ccc"} 
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default SocialScreen;
