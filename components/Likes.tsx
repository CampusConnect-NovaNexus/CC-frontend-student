import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { Pressable, Image, Text, View } from 'react-native';
import { icons } from '@/constants/icons';

import { upvotePost } from '@/service/socials/upVotePost';
import { downvotePost } from '@/service/socials/downVotePost';

const Likes = ({ post_id,user_id,upVotes }: { user_id: string; post_id: string; upVotes: string[] }) => {
  console.log(upVotes);
  

  const [isUpvoted, setIsUpvoted] = useState(upVotes?.includes(user_id) || false);
   const [likes, setLikes] =useState(upVotes.length);
  useEffect(()=>{
   if (upVotes?.includes(user_id)){
    setIsUpvoted(true);
   }
  },[])
  
  const handlePress = async () => {
    if (isUpvoted) {
      setLikes(likes => likes - 1)
      setIsUpvoted(false);``
      const response = await downvotePost(post_id, user_id);
      console.log(response);
      
    } else {
      setIsUpvoted(true);
      setLikes(prev => prev + 1)
      const response = await upvotePost(post_id, user_id);
      console.log(response);
    }
    console.log('pressed');
    
  };

  return (
    <View className="flex-row justify-center items-center">
      <Pressable
        className="flex-row gap-2 items-center border border-gray-300 bg-white p-2 rounded-full ml-1 mt-1"
        onPressIn={handlePress}
        style = {{elevation : 1}}
      >
        <Image
          source={icons.upvote}
          className="size-5"
          style={{ tintColor: isUpvoted ? 'green' : 'red' }}
        />
        <Text className='text-md text-gray-600 font-bold'>Vote</Text>
        <View className='h-[20px] w-[2px] bg-gray-400'></View>
        <Text className='text-md text-gray-600 font-bold px-1.5'>{likes}</Text>
      </Pressable>
    </View>
  );
};

export default Likes