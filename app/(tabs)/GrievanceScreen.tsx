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
  category: string
}

export default function GrievanceScreen() {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [formVisible, setFormVisible] = useState(false);
  const [newGrievance, setNewGrievance] = useState({
    title: "",
    description: "",
    selectedCategory: ""
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
  const [viewSelectedCategory, setViewSelectedCategory] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);//fow category while filling the form 
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);//for filter
  const options = ["Infrastructure",
    "Academic",
    "Mess",
    "Hostel",
    "Wifi",
    "Library",
    "Administration",
    "Sports",
    "Others",];


  const handleOptionSelect = (option: string) => {
    if (viewSelectedCategory === option) {
      setViewSelectedCategory('');
    } else {
      setViewSelectedCategory(option);
    }
    setDropdownVisible(false);
  };
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
      loadStats()
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

    if (grievances?.length > 0) {
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
    if (newGrievance.title && newGrievance.description) {
      const payload = {
        user_id: user_id,
        title: newGrievance.title,
        description: newGrievance.description,
        category: newGrievance.selectedCategory
      };
      console.log(payload);
      const response = await postGrievance(payload);
      if (response?.c_id) {
        Toast.show({
          type: 'success',
          text1: ' Uploaded Successfully',
          text2: 'Your problem will be resolved at the earliest '
        });
        setFormVisible(false);
        setNewGrievance({ title: "", description: "", selectedCategory: "" });
        loadStats();
        loadGrievances();
      }
    }
    else {
      Toast.show({
        type: 'info',
        text1: 'Insufficient Info',
        text2: 'Kindly fill all the fields'
      });
    }
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
          {item.category && (
            <View style={{
              backgroundColor: '#FEF3C7', // amber-100
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
              alignSelf: 'flex-start',
              marginBottom: 10,
              borderWidth: 1,
              borderColor: '#FCD34D', // amber-300
            }}>
              <Text style={{
                color: '#92400E', // amber-800
                fontWeight: '500',
                fontSize: 12,
              }}>{item.category}</Text>
            </View>
          )}
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
          <View className="flex-row justify-between items-center px-4 pb-2">
            <Text
              style={{ fontFamily: "wastedVindey" }}
              className="text-3xl"
            >
              Recent Issues
            </Text>
            <TouchableOpacity
              onPress={() => setIsDropdownVisible(prev => !prev)}
              style={{
                backgroundColor: '#F59E0B', // amber-500
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 20,
                flexDirection: 'row',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 2,
              }}
            >
              <Ionicons name="filter" size={18} color="white" style={{ marginRight: 6 }} />
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                Filter
              </Text>
            </TouchableOpacity>
          </View>

          {viewSelectedCategory ? (
            <View style={{
              backgroundColor: '#FEF3C7', // amber-100
              marginHorizontal: 16,
              marginBottom: 12,
              padding: 10,
              borderRadius: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Text style={{ color: '#92400E', fontWeight: '500' }}>
                Viewing: {viewSelectedCategory}
              </Text>
              <TouchableOpacity onPress={() => setViewSelectedCategory('')}>
                <Ionicons name="close-circle" size={20} color="#92400E" />
              </TouchableOpacity>
            </View>
          ) : null}
          {/* Filter Modal */}
          <Modal
            isVisible={isDropdownVisible}
            onBackdropPress={() => setIsDropdownVisible(false)}
            animationIn="fadeInDown"
            animationOut="slideOutUp"
            animationInTiming={400}
            animationOutTiming={400}
            backdropTransitionInTiming={400}
            backdropTransitionOutTiming={400}
            backdropColor="rgba(0,0,0,0.5)"
            style={{ margin: 0, justifyContent: 'flex-start', alignItems: 'flex-end' }}
          >
            <View
              style={{
                position: 'absolute',
                top: 100,
                right: 16,
                backgroundColor: 'white',
                borderRadius: 12,
                padding: 8,
                width: 180,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 5,
                elevation: 5,
              }}
            >
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    handleOptionSelect(option);
                    setIsDropdownVisible(false);
                  }}
                  style={{
                    padding: 12,
                    borderBottomWidth: index === options.length - 1 ? 0 : 1,
                    borderBottomColor: '#F3F4F6',
                    backgroundColor: viewSelectedCategory === option ? '#FEF3C7' : 'transparent',
                    borderRadius: 6,
                  }}
                >
                  <Text style={{
                    color: viewSelectedCategory === option ? '#92400E' : '#4B5563',
                    fontWeight: viewSelectedCategory === option ? '600' : 'normal'
                  }}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Modal>
        </View>

        <TouchableOpacity
          className="absolute w-fit bottom-20 right-6 bg-amber-600 rounded-full p-5 z-10 "
          onPress={() => setFormVisible(true)}
        >
          <Ionicons name="add-circle" size={26} color="#fdfcf9" />
        </TouchableOpacity>

        {grievances?.length === 0 ? (
          <View className="h-40 w-full justify-center">
            <ActivityIndicator size="large" color="#cb612a" />
          </View>
        ) : (
          <FlatList
            data={viewSelectedCategory ? grievances.filter((grievance) => grievance.category === viewSelectedCategory) : grievances}
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
          <View style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 24,
            margin: 16,
            width: '90%',
            alignSelf: 'center',
            maxHeight: '80%',
          }}>
            <Text style={{
              fontSize: 22,
              fontWeight: 'bold',
              marginBottom: 20,
              textAlign: 'center',
              color: '#1F2937',
            }}>
              Submit New Grievance
            </Text>

            <Pressable
              onPress={() => setFormVisible(false)}
              style={{
                position: 'absolute',
                right: -10,
                top: -10,
                backgroundColor: 'white',
                padding: 10,
                borderRadius: 999,
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}
            >
              <Image
                source={icons.cross}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
              />
            </Pressable>

            <Text style={{ color: '#4B5563', fontWeight: '500', marginBottom: 6, marginLeft: 4 }}>
              Title
            </Text>
            <TextInput
              style={{
                backgroundColor: '#F3F4F6',
                borderRadius: 10,
                padding: 14,
                marginBottom: 16,
                color: '#1F2937',
                fontSize: 16,
              }}
              placeholder="Enter grievance title"
              value={newGrievance.title}
              onChangeText={(text) =>
                setNewGrievance({ ...newGrievance, title: text })
              }
              placeholderTextColor="#9CA3AF"
            />

            <Text style={{ color: '#4B5563', fontWeight: '500', marginBottom: 6, marginLeft: 4 }}>
              Description
            </Text>
            <TextInput
              style={{
                backgroundColor: '#F3F4F6',
                borderRadius: 10,
                padding: 14,
                marginBottom: 16,
                height: 100,
                textAlignVertical: 'top',
                color: '#1F2937',
                fontSize: 16,
              }}
              placeholder="Describe your grievance in detail"
              multiline
              value={newGrievance.description}
              onChangeText={(text) =>
                setNewGrievance({ ...newGrievance, description: text })
              }
              placeholderTextColor="#9CA3AF"
            />
            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: '#4B5563', fontWeight: '500', marginBottom: 6, marginLeft: 4 }}>
                Category
              </Text>
              <TouchableOpacity
                onPress={() => setDropdownVisible(!dropdownVisible)}
                style={{
                  backgroundColor: '#F3F4F6',
                  borderRadius: 10,
                  padding: 14,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: newGrievance.selectedCategory ? '#F59E0B' : '#E5E7EB',
                }}
              >
                <Text style={{
                  color: newGrievance.selectedCategory ? '#92400E' : '#6B7280',
                  fontWeight: newGrievance.selectedCategory ? '500' : 'normal',
                  fontSize: 16,
                }}>
                  {newGrievance.selectedCategory
                    ? newGrievance.selectedCategory
                    : "Select grievance category"}
                </Text>
                <Ionicons
                  name={dropdownVisible ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="#6B7280"
                />
              </TouchableOpacity>

              <Modal
                isVisible={dropdownVisible}
                onBackdropPress={() => setDropdownVisible(false)}
                backdropOpacity={0.1}
                animationIn="fadeIn"
                animationOut="fadeOut"
                animationInTiming={200}
                animationOutTiming={200}
                backdropTransitionInTiming={200}
                backdropTransitionOutTiming={200}
                style={{ margin: 0, justifyContent: 'center', alignItems: 'center' }}
              >
                <View style={{
                  backgroundColor: 'white',
                  borderRadius: 10,
                  width: '85%',
                  maxHeight: 300,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                  elevation: 3,
                  borderWidth: 1,
                  borderColor: '#F3F4F6',
                }}>
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: '#F3F4F6',
                    padding: 14,
                  }}>
                    <Text style={{ fontWeight: 'bold', color: '#1F2937', fontSize: 16 }}>
                      Select Category
                    </Text>
                    <TouchableOpacity onPress={() => setDropdownVisible(false)}>
                      <Ionicons name="close" size={22} color="#6B7280" />
                    </TouchableOpacity>
                  </View>

                  <ScrollView style={{ maxHeight: 250 }}>
                    {options.map((option, index, array) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          setNewGrievance({ ...newGrievance, selectedCategory: option })
                          setDropdownVisible(false);
                        }}
                        style={{
                          padding: 14,
                          borderBottomWidth: index === array.length - 1 ? 0 : 1,
                          borderBottomColor: '#F3F4F6',
                          backgroundColor: newGrievance.selectedCategory === option ? '#FEF3C7' : 'white',
                        }}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          {newGrievance.selectedCategory === option && (
                            <Ionicons name="checkmark-circle" size={18} color="#F59E0B" style={{ marginRight: 8 }} />
                          )}
                          <Text style={{
                            color: newGrievance.selectedCategory === option ? '#92400E' : '#4B5563',
                            fontWeight: newGrievance.selectedCategory === option ? '500' : 'normal',
                            fontSize: 16,
                          }}>
                            {option}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </Modal>
            </View>

            <Pressable
              onPress={postNewGrievance}
              style={{
                backgroundColor: '#D97706', // amber-600
                padding: 16,
                borderRadius: 12,
                marginTop: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 2,
              }}
            >
              <Text style={{
                color: 'white',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 18,
              }}>
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
            setComments(null)
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
