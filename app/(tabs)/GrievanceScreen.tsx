"use client";
import { EXPO_AUTH_API_URL } from "@env";
import Toast from "react-native-toast-message";
import { useState, useEffect } from "react";

import { useAuth } from "@/context/AuthContext";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Pressable,
  RefreshControl,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import UpVoteBtn from "@/components/UpVoteBtn";
import TimeAgo from "@/components/TimeAgo";
import { fetchGrievances } from "@/service/grievance/fetchGrievances";
import { postGrievance } from "@/service/grievance/postGrievance";
import { getStats } from "@/service/grievance/getStats";
import { getComment } from "@/service/grievance/getComment";
import { postComment } from "@/service/grievance/postComment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { icons } from "@/constants/icons";
import Modal from "react-native-modal";

interface Comment {
  c_id: string;
  c_message: string;
  comment_id: string;
  user_id: string;
  created_at: string;
}

interface Grievance {
  c_id: string;
  user_id: string;
  comment_count: string;
  created_at: string;
  description: string;
  title: string;
  upvotes: string[];
  resolver: string[];
}

export default function GrievanceScreen() {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [formVisible, setFormVisible] = useState(false);
  const [newGrievance, setNewGrievance] = useState({
    title: "",
    description: "",
    selectedCategory:""
  });
  const [grievanceItem, setGrievanceItem] = useState<Grievance | null>(null);
  const [grievanceVisible, setGrievanceVisible] = useState(false);
  const [stats, setStats] = useState({
    total_complaints: 0,
    unresolved_complaints: 0,
    resolved_complaints: 0,
  });
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [newComment, setNewComment] = useState("");
  const [user_id, setUserId] = useState("");
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const { logout, user } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  // const [selectedCategory, setSelectedCategory] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    // Load user_id from AsyncStorage when component mounts
    const getUserId = async () => {
      try {
        const id = await AsyncStorage.getItem("@user_id");
        if (id) {
          setUserId(id);
        }
      } catch (error) {
        console.error("Error fetching user id:", error);
      }
    };

    getUserId();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      loadGrievances();
      setRefreshing(false);
    }, 2000);
  };

  // Fetch usernames for all grievances
  useEffect(() => {
    const fetchUserNames = async () => {
      const userNamesMap: Record<string, string> = {};

      for (const grievance of grievances) {
        if (!userNamesMap[grievance.user_id]) {
          try {
            const response = await fetch(
              `${EXPO_AUTH_API_URL}/api/v1/auth/user/${grievance.user_id}`
            );
            const userData = await response.json();
            if (userData && userData.name) {
              userNamesMap[grievance.user_id] = userData.name;
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }
      }

      setUserNames(userNamesMap);
    };

    if (grievances.length > 0) {
      fetchUserNames();
    }
  }, [grievances]);

  const clearOldCommentCaches = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const commentKeys = keys.filter((key) => key.startsWith("comments_"));

      const now = Date.now();
      const twoHours = 2 * 60 * 60 * 1000;

      const commentItems = await AsyncStorage.multiGet(commentKeys);

      const keysToRemove: string[] = [];

      for (const [key, value] of commentItems) {
        if (value) {
          const parsed = JSON.parse(value);
          if (!parsed.timestamp || now - parsed.timestamp > twoHours) {
            keysToRemove.push(key);
          }
        }
      }

      if (keysToRemove.length > 0) {
        await AsyncStorage.multiRemove(keysToRemove);
        console.log("Old comment caches cleared:", keysToRemove);
      }
    } catch (error) {
      console.error("Error clearing old comment caches:", error);
    }
  };
  const loadGrievances = async () => {
    const cacheKey = "cached_grievances";
    const now = Date.now();
    const twoHours = 2 * 60 * 60 * 1000;

    try {
      // Check for existing cache
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.timestamp && now - parsed.timestamp < twoHours) {
          setGrievances(parsed.data);
        } else {
          // Expired, remove cache
          await AsyncStorage.removeItem(cacheKey);
        }
      }

      // Fetch fresh data
      const result = await fetchGrievances();

      if (result) {
        const reversed = result.complaints?.reverse();
        setGrievances(reversed);
        await AsyncStorage.setItem(
          cacheKey,
          JSON.stringify({ timestamp: now, data: reversed })
        );
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Network Error !",
        text2: "Can not fetch grievances at the moment",
      });
    }
  };

  const loadStats = async () => {
    const result = await getStats();
    if (result) {
      setStats(result);
    } else {
      Toast.show({
        type: "error",
        text1: "Stats not refreshed",
        text2: "Stats, could not be loaded ",
      });
    }
  };

  // useEffect(() => {
  //   loadGrievances();
  //   loadStats();
  // }, []);

  // useEffect(() => {

  //   loadComments();
  // }, [grievanceItem]);
  useEffect(() => {
    if (grievanceItem) {
      loadComments();
    }
  }, [grievanceItem]);
  useFocusEffect(
    useCallback(() => {
      loadGrievances();
      loadStats();
      clearOldCommentCaches();
    }, [])
  );
  const postNewGrievance = async () => {
    if (newGrievance.title && newGrievance.description ) {
      const payload = {
        user_id: user_id,
        title: newGrievance.title,
        description: newGrievance.description,
        category: newGrievance.selectedCategory
      };
      const response = await postGrievance(payload);
      if (response?.c_id) {
        Toast.show({
          type:'success',
          text1: ' Uploaded Successfully',
          text2: 'Your problem will be resolved at the earliest '
        });
        setFormVisible(false);
        setNewGrievance({ title: "", description: "", selectedCategory:"" });
        loadStats();
        loadGrievances();
      }
    }
    Toast.show({
      type:'info',
      text1: 'Insufficient Info',
      text2: 'Kindly fill all the fields'
    });
  };
  // const loadComments = async () => {
  //   if (grievanceItem) {
  //     const result = await getComment(grievanceItem.c_id);
  //     setComments(result?.comments.reverse() || null);
  //   }
  // };
  const loadComments = async () => {
    if (!grievanceItem) return;

    const cacheKey = `comments_${grievanceItem.c_id}`;

    try {
      // Try fetching from API
      const result = await getComment(grievanceItem.c_id);
      const fetchedComments = result?.comments.reverse() || null;

      setComments(fetchedComments);

      // Cache comments locally
      if (fetchedComments) {
        // await AsyncStorage.setItem(cacheKey, JSON.stringify(fetchedComments));
        await AsyncStorage.setItem(
          cacheKey,
          JSON.stringify({ timestamp: Date.now(), data: fetchedComments })
        );
      }
    } catch (err) {
      // If API fails (e.g., offline), load from local storage
      const cached = await AsyncStorage.getItem(cacheKey);
      // if (cached) {
      //   const parsed = JSON.parse(cached);
      //   setComments(parsed);
      // } else {
      //   setComments([]);
      // }
      if (cached) {
        const parsed = JSON.parse(cached);
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;

        if (parsed.timestamp && now - parsed.timestamp < oneHour) {
          setComments(parsed.data);
        } else {
          // Cache is too old, remove it and fetch again
          await AsyncStorage.removeItem(cacheKey);
          setComments([]);
        }
      } else {
        setComments([]);
      }
    }
  };
  // getTimeAgo function has been moved to the TimeAgo component

  const handlePostComment = async (c_id: string) => {
    if (!newComment.trim()) return;

    try {
      await postComment(c_id, user_id, newComment);
      setNewComment("");

      const result = await getComment(c_id);
      const updatedComments = result?.comments.reverse() || [];

      setComments(updatedComments);

      // Update AsyncStorage cache
      await AsyncStorage.setItem(
        `comments_${c_id}`,
        JSON.stringify(updatedComments)
      );
    } catch (error) {
      console.log("Comment post failed:", error);
    }
  };

  const renderGrievanceItem = ({ item }: { item: Grievance }) => {
    const userName = userNames[item.user_id] || "User";
    return (
      <TouchableOpacity
        className=""
        onPress={async () => {
          await setGrievanceItem(item);
          setGrievanceVisible(true);
        }}
      >
        <View className="line bg-gray-200 w-full h-[1.5px] my-2 shadow-sm shadow-slate-400"></View>
        <View className="px-4 pb-4">
          <View className="flex-row justify-left items-center gap-3">
            <View className="flex-row justify-left items-center gap-3">
              <View className="bg-gray-400 w-11 h-11 rounded-full my-2 justify-center items-center">
                <Image
                  source={icons.profile}
                  className="size-12 rounded-full"
                  resizeMode="contain"
                />
              </View>
            </View>

            <Text className="text-lg font-bold">{userName}</Text>
            <View className="flex-row items-center gap-1">
              <View className="w-1.5 h-1.5 rounded-full bg-gray-400"></View>
              <TimeAgo
                date={item.created_at}
                className="text-sm text-gray-400 font-bold"
              />
            </View>
          </View>
          {/* Rest of the component remains the same */}
          <Text className="text-lg font-semibold mb-2">{item.title}</Text>
          <Text className="text-gray-600 mb-3">{item.description}</Text>

          <View className="flex-row justify-left items-center">
            <UpVoteBtn
              c_id={item.c_id}
              user_id={user_id}
              upVotes={item.upvotes}
            />
            <View className="flex-row justify-center items-center px-2">
              <Pressable
                className="flex-row gap-2 items-center border border-gray-300 bg-white p-2 px-4 rounded-full ml-1 mt-1"
                style={{ elevation: 1 }}
                onPressIn={() => {
                  setGrievanceItem(item);
                  setGrievanceVisible(true);
                }}
              >
                <Image source={icons.comment} className="size-5" />
                <Text className="text-md text-gray-600 font-bold px-1">
                  {item.comment_count}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 relative bg-[#fdfcf9]">
      <View className="flex-1 relative bg-[#fdfcf9]">
        <View className="flex-row justify-between mb-5 p-4">
          <View className="bg-amber-400 rounded-lg p-5 flex-1 m-1 items-center">
            <Text className="text-2xl font-bold text-white">
              {stats.total_complaints}
            </Text>
            <Text className="text-white">Total</Text>
          </View>
          <View className="bg-amber-500 rounded-lg p-5 flex-1 m-1 items-center">
            <Text className="text-2xl font-bold text-white">
              {stats.unresolved_complaints}
            </Text>
            <Text className="text-white">Pending</Text>
          </View>
          <View className="bg-amber-600 rounded-lg p-5 flex-1 m-1 items-center">
            <Text className="text-2xl font-bold text-white">
              {stats.resolved_complaints}
            </Text>
            <Text className="text-white">Resolved</Text>
          </View>
        </View>
        <View className="z-10 bg-[#fdfcf9]">
          <Text
            style={{ fontFamily: "wastedVindey" }}
            className="text-3xl p-4 pb-6"
          >
            Recent Issues
          </Text>
        </View>

        <TouchableOpacity
          className="absolute w-fit bottom-20 right-6 bg-amber-600 rounded-full p-5 z-10 "
          onPress={() => setFormVisible(true)}
        >
          <Ionicons name="add-circle" size={26} color="#fdfcf9" />
        </TouchableOpacity>

        {grievances.length === 0 ? (
          <View className="h-40 w-full justify-center">
            <ActivityIndicator size="large" color="#cb612a" />
          </View>
        ) : (
          <FlatList
            data={grievances}
            renderItem={renderGrievanceItem}
            keyExtractor={(item) => item.c_id}
            contentContainerStyle={{ paddingBottom: 100 }}
            className="-mt-4"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}

        {/* New Grievance Modal */}
        <Modal
          isVisible={formVisible}
          animationIn="fadeInUp"
          animationOut="fadeOutDown"
          animationInTiming={400}
          animationOutTiming={400}
          backdropTransitionInTiming={400}
          backdropTransitionOutTiming={200}
          backdropColor="rgba(0,0,0,0.5)"
          onBackdropPress={() => setFormVisible(false)}
          style={styles.modal}
        >
          <View className="bg-white rounded-2xl p-5 m-4">
            <Text className="text-xl font-bold mb-6 text-center">
              Submit New Grievance
            </Text>

            <Pressable
              onPress={() => setFormVisible(false)}
              className="absolute -right-2 -top-2 bg-white p-3 rounded-full"
              style={{ elevation: 5 }}
            >
              <Image
                source={icons.cross}
                className="w-6 h-6"
                resizeMode="contain"
              />
            </Pressable>

            <TextInput
              className="bg-gray-100 rounded-lg p-3 mb-3"
              placeholder="Enter grievance title"
              value={newGrievance.title}
              onChangeText={(text) =>
                setNewGrievance({ ...newGrievance, title: text })
              }
              placeholderTextColor="#6B7280"
            />
            <TextInput
              className="bg-gray-100 rounded-lg p-3 mb-6 h-24"
              placeholder="Describe your grievance in detail"
              multiline
              value={newGrievance.description}
              onChangeText={(text) =>
                setNewGrievance({ ...newGrievance, description: text })
              }
              placeholderTextColor="#6B7280"
            />
            <View className="mb-4">
              <TouchableOpacity
                onPress={() => setDropdownVisible(!dropdownVisible)}
                className="bg-gray-100 rounded-lg p-3"
              >
                <Text className="text-gray-700">
                  {newGrievance.selectedCategory
                    ? newGrievance.selectedCategory
                    : "Select grievance category"}
                </Text>
              </TouchableOpacity>

              {dropdownVisible && (
                <View className="bg-white border rounded-lg mt-2 max-h-64">
                  {[
                    "Infrastructure",
                    "Academic",
                    "Mess",
                    "Hostel",
                    "Wifi",
                    "Library",
                    "Administration",
                    "Sports",
                    "Others",
                  ].map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        setNewGrievance({...newGrievance, selectedCategory: option})
                        setDropdownVisible(false);
                      }}
                      className="p-3 border-b border-gray-200"
                    >
                      <Text className="text-gray-800">{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <Pressable
              onPress={postNewGrievance}
              className="  bg-amber-600 p-4 rounded-xl"
            >
              <Text className="text-white text-center font-bold text-lg">
                Submit Grievance
              </Text>
            </Pressable>
          </View>
        </Modal>

        <Modal
          isVisible={grievanceVisible}
          animationIn="fadeInUp"
          animationOut="fadeOutDown"
          animationInTiming={400}
          animationOutTiming={400}
          backdropTransitionInTiming={400}
          backdropTransitionOutTiming={200}
          backdropColor="rgba(0,0,0,0.5)"
          onBackdropPress={() => {
            setGrievanceItem(null);
            setGrievanceVisible(false);
          }}
          style={styles.detail_modal}
        >
          <View className="bg-white rounded-2xl p-5 m-4">
            <View className="relative">
              <Pressable
                onPress={() => {
                  setGrievanceVisible(false);
                  setGrievanceItem(null);
                }}
                className="absolute -right-8 -top-8 bg-white p-3 rounded-full"
                style={{ elevation: 7 }}
              >
                <Image
                  source={icons.cross}
                  className="w-5 h-5"
                  resizeMode="contain"
                />
              </Pressable>
            </View>

            <Text className="text-black font-bold text-xl mb-2">
              {grievanceItem?.title}
            </Text>
            <Text className="text-gray-600 mb-4">
              {grievanceItem?.description}
            </Text>
            <Text className="text-gray-500 mb-6">
              Posted{" "}
              {grievanceItem ? <TimeAgo date={grievanceItem.created_at} /> : ""}
            </Text>

            <Text className="text-lg font-bold mb-3">Comments</Text>
            <FlatList
              data={comments || []}
              keyExtractor={(item) => item.comment_id}
              renderItem={({ item }) => {
                return (
                  <View className="bg-gray-50 rounded-lg p-3 mb-2">
                    <Text className="text-gray-800">{item.c_message}</Text>
                    <TimeAgo
                      date={item.created_at}
                      className="text-gray-400 text-xs mt-1"
                    />
                  </View>
                );
              }}
              className="mb-4 max-h-40"
            />

            <View className="flex-row items-center gap-2 mt-2">
              <TextInput
                className="bg-gray-100 rounded-lg flex-1 p-3"
                placeholder="Your Comment here..."
                value={newComment}
                onChangeText={setNewComment}
                placeholderTextColor="#6B7280"
              />
              <Pressable
                onPress={() =>
                  grievanceItem && handlePostComment(grievanceItem.c_id)
                }
                className="bg-amber-600 p-3 rounded-full"
              >
                <Ionicons name="send" size={24} color="white" />
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  detail_modal: {
    justifyContent: "center",
    margin: 0,
  },
});
