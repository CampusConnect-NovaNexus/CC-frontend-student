"use client"

import { useState,useEffect } from "react"
import { View, Text, StyleSheet, FlatList,TouchableOpacity, Image, Modal, TextInput, ScrollView , Button, Pressable} from "react-native"
import { useRouter } from "expo-router"
import {icons} from '@/constants/icons'; 
import {images} from '@/constants/images';
import {LFData} from '@/service/lost-found/LFAPI'
import {lostItemData} from '@/service/lost-found/lostItemClick'
import {foundItemData} from '@/service/lost-found/foundItemClick'


export default function LostFoundScreen() {

  const onLostItemClick=async(id:string)=>{
      const item_info=await lostItemData(id);
      setLostItemInView(item_info);
  }
  const onFoundItemClick=async(id:string)=>{
      const item_info=await foundItemData(id);
      setFoundItemInView(item_info);
  }
  const [showLostItem,setShowLostItem]=useState(false);
  const [showFoundItem,setShowFoundItem]=useState(false);
  const [lostItemInView,setLostItemInView]=useState(null);
  const [foundItemInView,setFoundItemInView]=useState(null);
  const router = useRouter()
  const [data,setData]=useState(null)
  useEffect(() => {
    const fetchData = async () => {
      const result = await LFData();
      console.log('Result in LostFoundScreen: ', result);
      setData(result);
    };
  
    fetchData();
  }, []);
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
              <Modal
                animationType="slide"
                transparent={true}
                visible={showLostItem}
                onRequestClose={() => setShowLostItem(false)}
              >
                  {showLostItem && lostItemInView && (
                    <View className="flex-1 justify-center p-20 bg-black/50" >
                    <View className="bg-white rounded-md flex-col items-center justify-center" >
                        <Text>{lostItemInView.item_title}</Text>
                        <Text>{lostItemInView.item_description}</Text>
                    </View>
                  </View>
                  )}
              </Modal>
              <Modal
                animationType="slide"
                transparent={true}
                visible={showFoundItem}
                onRequestClose={() => setShowFoundItem(false)}
              >
                  {showFoundItem && foundItemInView && (
                    <View className="flex-1 justify-center p-20 bg-black/50" >
                    <View className="bg-white rounded-md flex-col items-center justify-center" >
                        <Text>{foundItemInView.item_title}</Text>
                        <Text>{foundItemInView.item_description}</Text>
                    </View>
                  </View>
                  )}
              </Modal>
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
                <Pressable 
                  onPress={async()=>{
                   await onLostItemClick({id:item.id})
                   setShowLostItem(true);
                  }}
                >
                  <View style={styles.itemContainer}
                    className="bg-slate-600 p-10 flex  rounded-lg items-center "
                  >
                    <Image source={item.item_image?item.item_image:images.movie_logo}
                    className="" style={styles.image} />
                    <Text className="text-white text-xl ">{item.item_title}</Text>
                  </View>
                </Pressable>
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
                <Pressable onPress={async()=>{
                  await onFoundItemClick({id:item.id})
                  setShowFoundItem(true);
                 }}>
                  <View style={styles.itemContainer}
                    className="bg-slate-600 p-10 flex  rounded-lg items-center "
                  >
                    <Image source={item.item_image?item.item_image:images.movie_logo}
                    className="" style={styles.image} />
                    <Text className="text-white">{item.item_title}</Text>
                  </View>
                </Pressable>
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
