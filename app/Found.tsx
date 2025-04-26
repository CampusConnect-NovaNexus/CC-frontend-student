import React, { useEffect, useState ,useCallback} from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  Pressable,
  FlatList,
  Image,
  Alert,
  StyleSheet
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from '@react-navigation/native';
import { LFData } from "@/service/lost-found/LFAPI";
import { postFoundItem } from "@/service/lost-found/postFoundItem";
interface FoundItem {
  id: string;
  item_title: string;
  item_description: string;
  item_image?: string;
  item_category: string;
  item_date:string,
  item_reporter_name:string;
}
import {images} from '@/constants/images'

const Found= () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [displayObject, setDisplayObject] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FoundItem | null>(null);
  const [personName, setPersonName] = useState("");
  const [objectName, setObjectName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [imageUri, setImageUri] = useState<string>("");
  const [foundItems, setFoundItems] = useState<FoundItem[]>([]);
  console.log("ImageURI"+ imageUri);
  const foundListItem=({item})=>{
      if(item.item_category==="LOST") {
        return null;
      }
      
      return(
        <Pressable
          onPress={async () => {
            setSelectedItem(item);
            setDisplayObject(true);
          }}
        >
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
                source={
                  item.item_image
                    ? { uri: item.item_image }
                    : images.movie_logo
                }
                style={styles.image}
                className="object-cover rounded-r-2xl"
              />
            </View>
          </View>
        </Pressable>
      );
  }

    useFocusEffect(
      useCallback(()=>{
        const fetchData =async()=>{
          const result=await LFData();
          
          setFoundItems(result.reverse());
        }
  
        fetchData();
      },[])
    )


  const fetchData = async () => {
    const result = await LFData();
    
    setFoundItems(result.reverse());
  };
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };
  const embeddFoundItem=async()=>{
    //call an api requires item_id so will be caled if Add item found is successed 
  }
  const handleAddFoundItem = async () => {
    if (!personName || !objectName ||!description || !date ) {
      Alert.alert("Error", "Please fill all fields and pick an image.");
      return;
    }
    try {
      const response = await postFoundItem({
        user_id:"f1254d1f-6a62-495f-99fa-88740d4bb662" ,
        title: objectName,
        description: description,
        image: imageUri,
        item_category: "FOUND",
      });
      
      if (response && response.status==="Item created successfully") {
        Alert.alert("Upload Successful", "Thanks for your kindness ❤️");
        // fetchLostItems();
        fetchData();
        setModalVisible(false);
        setPersonName("");
        setObjectName("");
        setDate("");
        setDescription("");
        setImageUri("");
      } else {
        Alert.alert("Upload failed", "Please try again later.");
      }
    } catch (error) {
      console.error("Upload error : ", error);
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text style={{fontFamily: 'wastedVindey'}} className="text-4xl p-4 text-black">Found Items</Text>
        <Pressable
          onPress={() => setModalVisible(true)}
          className="bg-green-500 px-6 py-3 rounded-full"
        >
          <Text className="text-white text-3xl font-bold">+</Text>
        </Pressable>
      </View>

      <FlatList
        data={foundItems}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={foundListItem}
      />

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

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-center items-center bg-black/50 px-4">
          <View className="bg-white w-full rounded-lg p-5">
            <Text className="text-lg font-bold mb-2 text-black">Report Lost Item</Text>

            <Pressable
              onPress={pickImage}
              className="bg-gray-200 p-3 rounded mb-3"
            >
              <Text className="text-black text-center">
                {imageUri ? "Change Image" : "Pick Image"}
              </Text>
            </Pressable>

            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                className="w-full h-40 mb-2 rounded"
                resizeMode="cover"
              />
            ) : null}

            <TextInput
              placeholder="Your Name"
              value={personName}
              onChangeText={setPersonName}
              className="border border-gray-300 rounded px-3 py-2 mb-3 text-black"
              placeholderTextColor="#6B7280"
            />
            <TextInput
              placeholder="Lost Object Name"
              value={objectName}
              onChangeText={setObjectName}
              className="border border-gray-300 rounded px-3 py-2 mb-3 text-black"
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
            <TextInput
              placeholder="Date"
              value={date}
              onChangeText={setDate}
              className="border border-gray-300 rounded px-3 py-2 mb-3 text-black"
              placeholderTextColor="#6B7280"
            />

            <View className="flex-row justify-between">
              <Pressable
                onPress={() => setModalVisible(false)}
                className="px-4 py-2 bg-gray-400 rounded"
              >
                <Text className="text-white">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleAddFoundItem}
                className="px-4 py-2 bg-blue-600 rounded"
              >
                <Text className="text-white">Submit</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Found;

const styles = StyleSheet.create({
  itemContainer: {
    marginHorizontal: 10,
    width: 150,
  },
  image: {
    width: 150,
    height: 150,
    backgroundColor: "#ccc",
  },
});
