import React, { useState } from "react";
import {images} from "@/constants/images";
import {
  View,
  Text,
  TextInput,
  Modal,
  Pressable,
  FlatList,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

interface FoundItem {
  id: string;
  personName: string;
  objectName: string;
  description: string;
  date: string;
  image ?: string;
}

const Found : React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [displayObject,setDisplayObject] = useState(false)
  const [selectedItem, setSelectedItem] = useState<FoundItem | null>(null);
  const [personName, setPersonName] = useState("");
  const [objectName, setObjectName] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState<string>("")
  const [FoundItems, setFoundItems] = useState<FoundItem[]>([]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleAddFoundItem = () => {
    if (!personName || !objectName || !date || !imageUri) return;

    const newItem: FoundItem = {
      id: Date.now().toString(),
      personName,
      objectName,
      description,
      date,
      image: imageUri,
    };

    setFoundItems((prev) => [...prev, newItem]);
    setPersonName("");
    setObjectName("");
    setDescription("");
    setDate("");
    setImageUri("");
    setModalVisible(false);
  };

  return (
    <View className="flex-1 bg-white p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold text-black">Found Items</Text>
        <Pressable
          onPress={() => setModalVisible(true)}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          <Text className="text-white font-semibold">Add</Text>
        </Pressable>
      </View>

      <FlatList
        data={FoundItems}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={()=>{
              setSelectedItem(item);
              setDisplayObject(true);
            }}
          >
            <View className="bg-gray-100 p-3 rounded mb-3">
              <Image
                source={{ uri: item.image }}
                className="w-full h-40 rounded mb-2"
                resizeMode="cover"
              />
              <Text className="font-semibold text-black">Object: {item.objectName}</Text>
              <Text className="text-gray-700">By: {item.personName}</Text>
              <Text className="text-gray-500">Date: {item.date}</Text>
            </View>
          </Pressable>
        )}
      />
      {displayObject && selectedItem && (
        <Modal visible={displayObject} animationType="slide" transparent={true}>
        <View className="flex-1 justify-center items-center bg-black/80 z-10 px-4">
          {selectedItem ? (
            <View className="bg-white w-full rounded-lg p-5">

              {selectedItem.image ? (
                <Image
                  source={{ uri: selectedItem.image }}
                  className="w-full h-40 rounded mb-4"
                  resizeMode="cover"
                />
              ) : (
                <Text className="text-gray-500 text-center mb-4">
                  Image is unavailable
                </Text>
              )}

              <Text className="text-black font-bold text-xl mb-2">
                Object Name: {selectedItem.objectName}
              </Text>
              <Text className="text-black mb-2">
                Description & Place: {selectedItem.description}
              </Text>
              <View className="flex-row justify-between mb-4">
                <Text className="text-gray-700">By: {selectedItem.personName}</Text>
                <Text className="text-gray-700">{selectedItem.date}</Text>
              </View>

              <View className="flex-row justify-around">
                <Pressable
                  onPress={() => setDisplayObject(false)}
                  className="bg-gray-500 px-4 py-2 rounded"
                >
                  <Text className="text-white">Close</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    // You can handle claim logic here
                    setDisplayObject(false);
                  }}
                  className="bg-blue-500 px-4 py-2 rounded"
                >
                  <Text className="text-white">Claim</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Text className="text-white">Loading item...</Text>
          )}
        </View>
      </Modal>
      )}
      
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-center items-center bg-black/50 px-4">
          <View className="bg-white w-full rounded-lg p-5">
            <Text className="text-lg font-bold mb-2 text-black">Report Found Item</Text>

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
              placeholder="Found Object Name"
              value={objectName}
              onChangeText={setObjectName}
              className="border border-gray-300 rounded px-3 py-2 mb-3 text-black"
              placeholderTextColor="#6B7280"
            />
            <TextInput
              placeholder="Object Descriptiona and the place found "
              value={description}
              multiline
              onChangeText={setDescription}
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
