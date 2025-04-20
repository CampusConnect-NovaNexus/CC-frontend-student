"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList,TouchableOpacity, Image, Modal, TextInput, ScrollView , Button, Pressable} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { useRouter } from "expo-router"
import {icons} from '@/constants/icons'; 
import {images} from '@/constants/images';
const initialItems = [
  {
    id: "1",
    name: "Blue Water Bottle",
    category: "Personal Item",
    location: "Main Library, 2nd Floor",
    date: "2025-04-15",
    description: "Blue metal water bottle with university logo",
    image: "https://via.placeholder.com/150",
    status: "lost",
    contact: "John Doe (john.doe@university.edu)",
  },
  {
    id: "2",
    name: "Calculator (TI-84)",
    category: "Electronics",
    location: "Science Building, Room 103",
    date: "2025-04-14",
    description: 'Texas Instruments graphing calculator, has initials "MJ" on the back',
    image: "https://via.placeholder.com/150",
    status: "found",
    contact: "Lost & Found Office",
  },
  {
    id: "3",
    name: "Student ID Card",
    category: "ID/Cards",
    location: "Student Center",
    date: "2025-04-13",
    description: "Student ID card for Sarah Johnson",
    image: "https://via.placeholder.com/150",
    status: "found",
    contact: "Admin Office",
  },
]
const data = [
  { id: '1', title: 'Item 1', image: 'https://via.placeholder.com/100' },
  { id: '2', title: 'Item 2', image: 'https://via.placeholder.com/100' },
  { id: '3', title: 'Item 3', image: 'https://via.placeholder.com/100' },
  { id: '4', title: 'Item 4', image: 'https://via.placeholder.com/100' },
];

export default function LostFoundScreen() {

  const router = useRouter()


    return (
      <ScrollView className="" >
          <View className="flex mx-4 mt-10 flex-row justify-around " >
            <Pressable  
              onPress={() => router.push('../Lost')}
              className='flex p-5 bg-red-500 flex-row items-center justify-center gap-3  rounded-lg  '
              >
              <Image 
                source={icons.sad_face}
                tintColor="white"
                className="h-8 w-8 m-2"
              />
              <Text className="text-2xl text-white ">Lost</Text>
            </Pressable>
            <Pressable  
              onPress={() => router.push('../Found')}
              className='flex p-5 bg-green-500 flex-row items-center justify-center gap-3  rounded-lg  '
              >
              <Image 
                source={icons.happy_face}
                tintColor="white"
                className="h-8 w-8 m-2"
              />
              <Text className="text-2xl text-white ">Found</Text>
            </Pressable>
            
          </View>
          <View className=" mt-7 border border-black mx-1 rounded-md p-2">
            <Text className="text-2xl ml-3">Recently Lost</Text>
            <FlatList
              data={data}
              keyExtractor={(item) => item.id}
              horizontal
              className="mt-5 "
              renderItem={({ item }) => (
                <View style={styles.itemContainer}
                  className="bg-slate-600 p-10 flex  rounded-lg items-center "
                >
                  <Image source={images.movie_logo}
                  className="" style={styles.image} />
                  <Text className="text-white">{item.title}</Text>
                </View>
              )}
            />
          </View>
          <View className=" mt-7 border border-black mx-1 rounded-md p-2">
            <Text className="text-2xl ml-3">Recently Found</Text>
            <FlatList
              data={data}
              keyExtractor={(item) => item.id}
              horizontal
              className="mt-5 "
              renderItem={({ item }) => (
                <View style={styles.itemContainer}
                  className="bg-slate-600 p-10 flex  rounded-lg items-center "
                >
                  <Image source={images.movie_logo}
                  className="" style={styles.image} />
                  <Text className="text-white">{item.title}</Text>
                </View>
              )}
            />
          </View>
      </ScrollView>
    )
}



const styles = StyleSheet.create({
  itemContainer: {
    marginHorizontal: 10,
   
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  }
});