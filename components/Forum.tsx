import { View, Text,Image , TouchableOpacity, Pressable} from 'react-native'
import React from 'react'
import { icons } from '@/constants/icons'
import TimeAgo from './TimeAgo'
import UpVoteBtn from './UpVoteBtn'

interface ForumItem{

}
const Forum = () => {
  return (
    <TouchableOpacity
        className="bg-red-500"
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

            <Text className="text-lg font-bold">UserName</Text>
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
          <Text className="text-lg font-semibold mb-2">Title</Text>
          <Text className="text-gray-600 mb-3">Description</Text>
            {

            }
          <View className="flex-row justify-left items-center">
            <UpVoteBtn
              c_id="c_id"
              user_id="user123"
              upVotes={12}
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
                <Text className='text-md text-gray-600 font-bold px-1'>30</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </TouchableOpacity>
  )
}

export default Forum