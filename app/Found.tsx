import React, { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {
  View,
  Text,
  Linking,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FoundItems } from "@/service/lost-found/getFoundItem";
import { postFoundItem } from "@/service/lost-found/postFoundItem";
import { images } from '@/constants/images'
import { icons } from '@/constants/icons'
import Modal from 'react-native-modal';

interface FoundItem {
  id: string;
  item_title: string;
  item_description: string;
  item_image?: string;
  item_category: string;
  item_date: string;
  item_reporter_name: string;
  item_contact: string;
}

const Found = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [displayObject, setDisplayObject] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FoundItem | null>(null);
  const [objectName, setObjectName] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [foundItems, setFoundItems] = useState<FoundItem[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string | null>("1234567890"); // Add phoneNumber state
  const [user_id, setUserId] = useState<string>("");
  const [imageFile, setImageFile] = useState<null | {
    uri: string;
    name: string;
    type: string;
  }>(null);

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
          const cachedDataString = await AsyncStorage.getItem("foundItems");
          if (cachedDataString) {
            const { timestamp, data } = JSON.parse(cachedDataString);
            if (timestamp && now - timestamp < oneHour) {
              setFoundItems(data);
            } else {
              await AsyncStorage.removeItem("foundItems");
            }
          }
        } catch (error) {
          console.error("Error reading cache:", error);
        }
  
        try {
          const apiData = await FoundItems();
          setFoundItems(apiData.reverse());
          await AsyncStorage.setItem("foundItems", JSON.stringify({
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
      Toast.show({
        type:'info',
        text1: 'No phone number provided',
        text2: 'Kindly contavt him in person'
      });
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

  const handleAddFoundItem = async () => {
    if (!objectName || !description || !contact || !imageFile) {
      Toast.show({
        type:'info',
        text1: 'Missing Details',
        text2: 'Kindly Fillup All the required details'
      });
      return;
    }

    setLoading(true);

    try {
      const response = await postFoundItem({
        user_id: user_id,
        title: objectName,
        description: description,
        contact: contact,
        image: imageFile,
        item_category: "FOUND",
      });

      if (response?.status === "Item created successfully") {
        
        const result = await FoundItems();
        setFoundItems(result.reverse());
        setModalVisible(false);
        Toast.show({
          type:'success',
          text1: ' Uploaded Successfully',
          text2: 'Thanks for your kindness ❤️'
        });
        setObjectName("");
        setDescription("");
        setContact("");
        setImageFile(null);
      } else {
        Toast.show({
                type:'error',
                text1: ' Upload Failed ',
                text2: 'PLease try again after some-time'
              });
      }
    } catch (error) {
      console.error("Upload error:", error);
      Toast.show({
              type:'error',
              text1: ' Upload Failed ',
              text2: 'PLease try again after some-time'
            });
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: FoundItem }) => {
    if (item.item_category === "LOST") return null;

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
          Found Items
        </Text>
        <Pressable
          onPress={() => setModalVisible(true)}
          className="bg-green-500 px-6 py-3 rounded-full"
        >
          <Text className="text-white text-3xl font-bold">+</Text>
        </Pressable>
      </View>
      {
        !foundItems || foundItems.length == 0 ? (
          <View className="h-40 w-full justify-center">
            <ActivityIndicator size="large" color="#22c55e" />
          </View>
        ) : (
          <FlatList
            data={foundItems}
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
              dialScreen()
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
          <Text className="text-xl font-bold mb-6 text-center">Report Found Item</Text>

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
            onPress={handleAddFoundItem}
            disabled={loading}
            className={`bg-green-500 p-4 rounded-xl ${loading ? 'opacity-70' : ''}`}
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

export default Found;