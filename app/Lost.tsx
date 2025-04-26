  import React, { useEffect, useState, useCallback } from "react";
  import { useFocusEffect } from '@react-navigation/native';
  import {
    View,
    Text,
    TextInput,
    Modal,
    Pressable,
    FlatList,
    Image,
    Alert,
    StyleSheet,
    ActivityIndicator
  } from "react-native";
  import * as ImagePicker from "expo-image-picker";
  import { fetchUser } from '@/service/lost-found/fetchUser'
  import { LFData } from "@/service/lost-found/LFAPI";
  import { postLostItem } from "@/service/lost-found/postLostItem";
  import { images } from '@/constants/images'
  
  interface LostItem {
    id: string;
    item_title: string;
    item_description: string;
    item_image?: string;  
    item_category: string;
    item_date: string;
    item_reporter_name: string;
  }
  
  const Lost = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [displayObject, setDisplayObject] = useState(false);
    const [selectedItem, setSelectedItem] = useState<LostItem | null>(null);
    const [objectName, setObjectName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [lostItems, setLostItems] = useState<LostItem[]>([]);
    const [imageFile, setImageFile] = useState<null | { 
      uri: string;
      name: string;
      type: string;
    }>(null);
  
    useFocusEffect(
      useCallback(() => {
        const fetchData = async () => {
          const result = await LFData();
          setLostItems(result.reverse());
        };
        fetchData();
      }, [])
    );
  
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
  
    const handleAddLostItem = async () => {
      if (!objectName || !description) {
        Alert.alert("Error", "Please fill all fields and pick an image.");
        return;
      }
  
      setLoading(true);
  
      try {
        if (!imageFile) return;
  
        const response = await postLostItem({
          user_id: "f1254d1f-6a62-495f-99fa-88740d4bb662",
          title: objectName,
          description: description,
          image: imageFile,
          item_category: "LOST",
        });
  
        if (response && response.status === "Item created successfully") {
          Alert.alert("Upload Successful", "Thanks for your kindness ❤️");
          const result = await LFData();
          setLostItems(result.reverse());
          setModalVisible(false);
          setObjectName("");
          setDescription("");
          setImageFile(null); // Reset image
        } else {
          Alert.alert("Upload failed", "Please try again later.");
        }
      } catch (error) {
        console.error("Upload error: ", error);
        Alert.alert("Error", "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };
  
    const renderItem = ({ item }: { item: LostItem }) => {
      if (item.item_category === "FOUND") return null;
  
      return (
        <Pressable onPress={() => {
          setSelectedItem(item);
          setDisplayObject(true);
        }}>
          <View className="flex-col">
            <View className="bg-[#F8F8FF] mb-4 flex-row justify-between rounded-2xl items-center shadow-md shadow-slate-400">
              <View className="h-full w-1/2">
                <Text className="text-black font-semibold text-xl mt-2 px-3">
                  {item.item_title}
                </Text>
                <Text className="text-gray-700 text-md px-3 mt-2">
                  {item.item_description}
                </Text>
              </View>
              <Image
                source={item.item_image ? { uri: item.item_image } : images.movie_logo}
                style={styles.image}
                className="object-cover rounded-r-2xl"
              />
            </View>
          </View>
        </Pressable>
      );
    };
  
    return (
      <View className="flex-1 bg-white p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text style={{ fontFamily: 'wastedVindey' }} className="text-4xl text-black p-4">
            Lost Items
          </Text>
          <Pressable
            onPress={() => setModalVisible(true)}
            className="bg-red-500 px-6 py-3 rounded-full"
          >
            <Text className="text-white text-3xl font-bold">+</Text>
          </Pressable>
        </View>
  
        <FlatList
          data={lostItems}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={renderItem}
        />
  
        {/* Modal for displaying item details */}
        {displayObject && selectedItem && (
          <Modal visible={displayObject} animationType="slide" transparent={true}>
            <View className="flex-1 justify-center items-center bg-black/80 px-4">
              <View className="bg-white w-full rounded-lg p-5">
                {selectedItem.item_image ? (
                  <Image
                    source={{ uri: selectedItem.item_image }}
                    className="w-full h-40 rounded mb-4"
                    resizeMode="cover"
                  />
                ) : (
                  <Text className="text-gray-500 text-center mb-4">
                    Image is unavailable
                  </Text>
                )}

                <Text className="text-black font-bold text-xl mb-2">
                  Object Name: {selectedItem.item_title}
                </Text>
                <Text className="text-black mb-2">
                  Description & Place: {selectedItem.item_description}
                </Text>
                <View className="flex-row justify-between mb-4">
                  <Text className="text-gray-700">
                    By: {selectedItem.item_reporter_name}
                  </Text>
                  <Text className="text-gray-700">{selectedItem.item_date}</Text>
                </View>

                <View className="flex-row justify-around">
                  <Pressable
                    onPress={() => setDisplayObject(false)}
                    className="bg-gray-500 px-4 py-2 rounded"
                  >
                    <Text className="text-white">Close</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setDisplayObject(false)}
                    className="bg-blue-500 px-4 py-2 rounded"
                  >
                    <Text className="text-white">Claim</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        )}
  
        {/* Modal for adding new item */}
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-center items-center bg-black/50 px-4">
            <View className="bg-white w-full rounded-lg p-5 flex-col items-center">
              <Text className="text-lg font-bold mb-6 text-black text-center">Report Lost Item</Text>

              <Pressable
                onPress={pickImage}
                className="bg-[#FAF9F6] w-2/3 p-3 rounded-2xl mb-3 border-2 border-yellow-500"
              >
                <Text className="text-black text-center font-semibold">
                  {imageFile ? "Change Image" : "Pick Image"}
                </Text>
              </Pressable>

              {imageFile && (
                <Image
                  source={{ uri: imageFile.uri }}
                  className="w-4/5 h-2/5 mb-2 rounded-2xl"
                  resizeMode="cover"
                />
              )}
              <TextInput
                placeholder="Lost Object Name"
                value={objectName}
                onChangeText={setObjectName}
                className="border w-full border-gray-300 rounded-lg px-3 py-2 mb-3 text-black"
                placeholderTextColor="#6B7280"
              />
              <TextInput
                placeholder="Object Description and Place"
                value={description}
                onChangeText={setDescription}
                multiline
                className="border border-gray-300 rounded px-3 py-2 mb-3 text-black"
                placeholderTextColor="#6B7280"
              />
              <View className="flex-row justify-between">
                <Pressable
                onPress={() => {
                  setModalVisible(false)
                  setObjectName("")
                  setDescription("");
                  setImageFile(null)}}
                className="px-4 py-2 bg-gray-400 rounded"
              >
                <Text className="text-white">Cancel</Text>
              </Pressable>
                <Pressable
                  onPress={handleAddLostItem}
                  disabled={loading}
                  className={`px-6 py-4 rounded ${loading ? 'bg-green-400' : 'bg-green-600'}`}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white text-xl font-bold">Submit</Text>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    image: {
      width: 150,
      height: 150,
      backgroundColor: "#ccc",
    },
  });
  
  export default Lost;