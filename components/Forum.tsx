import { View, Text,Image , TouchableOpacity, Pressable} from 'react-native'
import React, { useEffect } from 'react'
import { icons } from '@/constants/icons'
import Likes from './Likes'
import { fetchUser } from '@/service/lost-found/fetchUser'
import {TimeAgo} from '@/components/TimeAgo'

interface ForumItem{
   post_id: string,
   comment_count: number,
   created_at: string,
   description: string,
   title: string,
   image:string,
   upvotes: string[],
  user_id: string,
}

const Forum = ({item}:{item:ForumItem}) => {
  
  
  useEffect (()=>{

  },[])

  return (
    <Pressable
        className=""
        onPress={() => {
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

            <Text className="text-lg font-bold">{}</Text>
            <View className="flex-row items-center gap-1">
              <View className="w-1.5 h-1.5 rounded-full bg-gray-400"></View>
              {/* <TimeAgo 
                date=
                className="text-sm text-gray-400 font-bold"
              /> */}
              <Text className="text-sm text-gray-800 " >Dates</Text>
            </View>
          </View>
          {/* Rest of the component remains the same */}
          <Text className="text-lg font-semibold mb-2">{item.title}</Text>
          <Text className="text-gray-600 mb-3">{item.description}</Text>
            {item.image && 
            <Image
            source={{ uri : item.image}}
            />
            }
          <View className="flex-row justify-left items-center">
            <Likes
              post_id={item.post_id}
              user_id={item.user_id}
              upVotes={item.upvotes}
            />
            <View className="flex-row justify-center items-center px-2">
              <Pressable
                className="flex-row gap-2 items-center border border-gray-300 bg-white p-2 px-4 rounded-full ml-1 mt-1"
                style={{ elevation: 1 }}
                onPressIn={() => {
                }}
              >
                <Image
                  source={icons.comment}
                  className="size-5"
                />
                <Text className='text-md text-gray-600 font-bold px-1'>{item.comment_count}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Pressable>
  )
}

export default Forum