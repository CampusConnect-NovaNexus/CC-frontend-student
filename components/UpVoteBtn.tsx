import React, { useState,useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { Pressable, Image ,Text,View} from 'react-native';
import {icons }from '@/constants/icons'; 
import { getGrievanceById } from '@/service/grievance/getGrievanceById';
import {upVote} from '@/service/grievance/upVote'
import {downVote} from '@/service/grievance/downVote'

const UpvoteButton = ({ user_id, c_id, upVotes }: { user_id: string; c_id: string; upVotes: number }) => {
  // console.log('inUpvoteBtn');
  
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [likes, setLikes] = useState(upVotes);

  const getGrievance = async (c_id: string) => {
    console.log("grievance")
    const response = await getGrievanceById(c_id);
    try {
      setIsUpvoted(response.complaint.upvotes.includes(user_id)); 
      setLikes(response.complaint.upvotes.length);          
    } catch (error) {
      console.log(error)
    }
  };

  useFocusEffect(
      useCallback(()=>{
        getGrievance(c_id)
      },[])
    )
  // useEffect(() => {
  //   getGrievance(c_id);
  // }, []);

  const handlePress = async () => {
    if (isUpvoted) {
      const response = await downVote(c_id, user_id);
      console.log(response);
      if (response.c_id) {
        setIsUpvoted(false);
        setLikes(prev => prev - 1); // ✅ decrease like count
      }
    } else {
      const response = await upVote(c_id, user_id);
      console.log(response);
      if (response.c_id) {
        setIsUpvoted(true);
        setLikes(prev => prev + 1); // ✅ increase like count
      }
    }
  };

  return (
    <View className="flex justify-center items-center">
      <Pressable
        className="border p-2 rounded-full ml-1 mt-1"
        onPressIn={handlePress}
      >
        <Image
          source={icons.upArrow}
          className="size-5"
          style={{ tintColor: isUpvoted ? 'green' : 'red' }}
        />
      </Pressable>
      <Text>{likes}</Text>
    </View>
  );
};

export default UpvoteButton;