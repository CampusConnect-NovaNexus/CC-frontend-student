import { View, Text, Image, TouchableOpacity, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { icons } from '@/constants/icons'
import Likes from './Likes'
import { fetchUser } from '@/service/lost-found/fetchUser'
import { TimeAgo } from '@/components/TimeAgo'
import { Ionicons } from "@expo/vector-icons";
import { getComment } from '@/service/grievance/getComment'

interface ForumItem {
  post_id: string,
  comment_count: number,
  created_at: string,
  description: string,
  title: string,
  post_image_url: string,
  upvotes: string[],
  user_id: string,
}

const Forum = ({
  item,
  setSelectedPost,
  setDetailPostVisible,
  getComment
}: {
  item: ForumItem;
  setSelectedPost: React.Dispatch<React.SetStateAction<ForumItem|null>>;
  setDetailPostVisible: React.Dispatch<React.SetStateAction<boolean>>;
  getComment: (postId: string, forceRefresh?: boolean) => Promise<void>;
})=> {
  const [userName, setUserName] = useState("User");
  const [userPosition, setUserPosition] = useState("Student");
  const handlePress =async () => {
    
    
    setSelectedPost(item);
    setDetailPostVisible(true);
    await getComment(item.post_id)
  };

  useEffect(() => {
    // You could fetch user details here if needed
    r
    
  }, [])

  // Format date for LinkedIn style
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return "Today";
      } else if (diffDays === 1) {
        return "Yesterday";
      } else if (diffDays < 7) {
        return `${diffDays}d`;
      } else if (diffDays < 30) {
        return `${Math.floor(diffDays / 7)}w`;
      } else {
        return `${Math.floor(diffDays / 30)}mo`;
      }
    } catch (e) {
      return "Recently";
    }
  };

  return (
    <View className="bg-white">
      {/* User info section */}
      <View className="p-4">
        <View className="flex-row">
          {/* Profile picture */}
          <View className="mr-3">
            <View className="w-12 h-12 rounded-full overflow-hidden">
              <Image
                source={icons.profile}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          </View>
          
          {/* User details */}
          <View className="flex-1">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="font-bold">{userName}</Text>
                <Text className="text-xs text-gray-500">{userPosition}</Text>
                <View className="flex-row items-center mt-1">
                  <Text className="text-xs text-gray-500">{formatDate(item.created_at)}</Text>
                  <Text className="text-xs text-gray-500 mx-1">•</Text>
                  <Ionicons name="globe-outline" size={12} color="#666" />
                </View>
              </View>
              
              {/* More options */}
              <TouchableOpacity>
                <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        {/* Post content */}
        <View className="mt-2">
          {item.title && (
            <Text className="font-semibold mb-1">{item.title}</Text>
          )}
          <Text className="text-gray-800 mb-3">{item.description}</Text>
        </View>
        
        {/* Post image */}
        {item.post_image_url && (
          <View className="mt-1 mb-2 -mx-4">
            <Image
              source={{ uri: item.post_image_url }}
              className="w-full h-64"
              resizeMode="cover"
            />
          </View>
        )}
        
        {/* Action buttons */}
        <View className="flex-row justify-between items-center pt-1">
          <Likes
            post_id={item.post_id}
            user_id={item.user_id}
            upVotes={item.upvotes}
          />
          
          <TouchableOpacity className="flex-1 flex-row items-center bg-red-300 justify-center py-2"
          onPress={handlePress}
          >
            <Ionicons name="chatbubble-outline" size={18} color="#666" />
            <Text className="text-gray-500 ml-1 text-sm">Comment</Text>
            <View className='border-l border-gray-600 ml-2 pl-2 ' ><Text>{item.comment_count}</Text></View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default Forum