import React, { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';

import {
  View,
  Text,
  TextInput,
  Pressable,
  Linking,
  FlatList,
  Image,
  Alert,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LFData } from "@/service/lost-found/LFAPI";
import { postLostItem } from "@/service/lost-found/postLostItem";
import { images } from '@/constants/images'
import { icons } from '@/constants/icons'
import Modal from 'react-native-modal';
import { Ionicons } from "@expo/vector-icons";
interface LostItem {
  id: string;
  item_title: string;
  item_description: string;
  item_image?: string;
  item_category: string;
  item_date: string;
  item_reporter_name: string;
  item_contact: string;
}

const Lost = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [displayObject, setDisplayObject] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LostItem | null>(null);
  const [objectName, setObjectName] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [user_id, setUserId] = useState<string>("");
  const [imageFile, setImageFile] = useState<null | {
    uri: string;
    name: string;
    type: string;
  }>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>("1234567890");
  
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
  
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const oneHour = 60 * 60 * 1000;
        const now = Date.now();
  
        try {
          const cachedDataString = await AsyncStorage.getItem("lostItems");
          if (cachedDataString) {
            const { timestamp, data } = JSON.parse(cachedDataString);
            if (timestamp && now - timestamp < oneHour) {
              setLostItems(data);
            } else {
              await AsyncStorage.removeItem("lostItems");
            }
          }
        } catch (error) {
          console.error("Error reading cache:", error);
        }
  
        try {
          const apiData = await LFData();
          setLostItems(apiData?.reverse());
          await AsyncStorage.setItem("lostItems", JSON.stringify({
            timestamp: now,
            data: apiData
          }));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchData();
    }, [])
  );
  
  const dialScreen = async () => {
    if (phoneNumber) {

      const url = `tel:${phoneNumber}`;
      Linking.openURL(url); 
    } 
    else{
      alert("Phone number is not provided");
    }
  }
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
    if (!objectName || !description || !contact || !imageFile) {
      Alert.alert("Error", "Please fill all fields and select an image.");
      return;
    }

    setLoading(true);

    try {
      const response = await postLostItem({
        user_id: user_id,
        title: objectName,
        description: description,
        contact: contact,
        image: imageFile,
        item_category: "LOST",
      });

      if (response?.status === "Item created successfully") {
        Alert.alert("Upload Successful", "Thanks for your kindness ❤️");
        const result = await LFData();
        setLostItems(result.reverse());
        setModalVisible(false);
        setObjectName("");
        setDescription("");
        setContact("");
        setImageFile(null);
      } else {
        Alert.alert("Upload failed", "Please try again later.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert('Error', 'Something went wrong.');
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
              <Text className="text-black text-xl mt-2 px-3 font-semibold">
                {item.item_title}
              </Text>
              <Text className="text-gray-700 text-md mt-2 px-3">
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
    <View className="flex-1 bg-[#fdfcf9] p-4 mt-10">
      <View className="flex-row justify-between items-center mb-4">
        <Text style={{ fontFamily: 'wastedVindey' }} className="text-5xl p-4 text-black">
          Lost Items
        </Text>
        <Pressable
          onPress={() => setModalVisible(true)}
          className="bg-red-500 px-6 py-3 rounded-full"
        >
          <Text className="text-white text-3xl font-bold">+</Text>
        </Pressable>
      </View>
      {
        !lostItems || lostItems.length == 0 ? (
          <View className="h-40 w-full justify-center">
            <ActivityIndicator size="large" color="#22c55e" />
          </View>
        ) : (
          <FlatList
            data={lostItems}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={renderItem}
          />
        )
      }

      {/* Item Detail Modal */}
      <Modal
        isVisible={displayObject}
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
        animationInTiming={400}
        animationOutTiming={400}
        backdropTransitionInTiming={400}
        backdropTransitionOutTiming={200}
        backdropColor="rgba(0,0,0,0.5)"
        onBackdropPress={() => setDisplayObject(false)}
        style={styles.modal}
      >
        <View className="bg-white rounded-2xl p-5 m-4">
          <View className="relative mb-4">
            {selectedItem?.item_image ? (
              <Image
                source={{ uri: selectedItem.item_image }}
                className="w-full h-60 rounded-lg"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-40 bg-gray-200 rounded-xl justify-center items-center">
                <Text className="text-gray-500 text-center px-4">
                  No image uploaded
                </Text>
              </View>
            )}

            <Pressable
              onPress={() => setDisplayObject(false)}
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
            {selectedItem?.item_title}
          </Text>
          <Text className="text-gray-600 mb-4">
            {selectedItem?.item_description}
          </Text>

          <View className="space-y-2 mb-4">
            <Text className="text-gray-500">
              Posted by: {selectedItem?.item_reporter_name}
            </Text>
            <Text className="text-gray-500">
              Date: {selectedItem?.item_date}
            </Text>
            <Text className="text-gray-500">
              Contact: {selectedItem?.item_contact}
            </Text>
          </View>

          <Pressable
            onPress={() => {
              setDisplayObject(false)
              dialScreen();
            }}
            className="bg-blue-500 px-6 py-3 rounded-xl self-center"
          >
            <Text className="text-white font-bold text-lg">Claim Item</Text>
          </Pressable>
        </View>
      </Modal>

      {/* Add Item Modal */}
      <Modal
        isVisible={isModalVisible}
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
        animationInTiming={400}
        animationOutTiming={400}
        backdropTransitionInTiming={400}
        backdropTransitionOutTiming={200}
        backdropColor="rgba(0,0,0,0.5)"
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modal}
      >
        <View className="bg-white rounded-2xl p-5 m-4">
          <Text className="text-xl font-bold mb-6 text-center">Report Lost Item</Text>

          <Pressable
            onPress={() => setModalVisible(false)}
            className="absolute -right-2 -top-2 bg-white p-3 rounded-full"
            style={{ elevation: 5 }}
          >
            <Image
              source={icons.cross}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </Pressable>

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

          <TextInput
            placeholder="Item Name"
            value={objectName}
            onChangeText={setObjectName}
            className="bg-gray-100 rounded-lg p-3 mb-3"
            placeholderTextColor="#6B7280"
          />

          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            className="bg-gray-100 rounded-lg p-3 mb-3 h-24"
            placeholderTextColor="#6B7280"
          />

          <TextInput
            placeholder="Contact Number"
            value={contact}
            onChangeText={setContact}
            className="bg-gray-100 rounded-lg p-3 mb-6"
            placeholderTextColor="#6B7280"
            keyboardType="phone-pad"
          />

          <Pressable
            onPress={handleAddLostItem}
            disabled={loading}
            className={`bg-red-500 p-4 rounded-xl ${loading ? 'opacity-70' : ''}`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-bold text-lg">
                Submit Report
              </Text>
            )}
          </Pressable>
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
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});

export default Lost;