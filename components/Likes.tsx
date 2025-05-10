import React, { useState, useEffect } from "react";
import { Pressable, Image, Text, View } from "react-native";
import { icons } from "@/constants/icons";
import { Ionicons } from "@expo/vector-icons";
import { upvotePost } from "@/service/socials/upVotePost";
import { downvotePost } from "@/service/socials/downVotePost";

const Likes = ({
  post_id,
  user_id,
  upVotes,
}: {
  user_id: string;
  post_id: string;
  upVotes: string[];
}) => {
  const [isUpvoted, setIsUpvoted] = useState(
    upVotes?.includes(user_id) || false
  );
  const [likes, setLikes] = useState(upVotes.length);

  useEffect(() => {
    if (upVotes?.includes(user_id)) {
      setIsUpvoted(true);
    }
  }, []);

  const handlePress = async () => {
    if (isUpvoted) {
      setLikes((likes) => likes - 1);
      setIsUpvoted(false);
      const response = await downvotePost(post_id, user_id);
      console.log(response);
    } else {
      setIsUpvoted(true);
      setLikes((prev) => prev + 1);
      const response = await upvotePost(post_id, user_id);
      console.log(response);
    }
  };

  return (
    <Pressable
      className={`flex-row items-center justify-center py-2 ${
        isUpvoted ? "opacity-100" : "opacity-80"
      }`}
      onPress={handlePress}
      style={{ flex: 1 }}
    >
      <Ionicons
        name={isUpvoted ? "thumbs-up" : "thumbs-up-outline"}
        size={18}
        color={isUpvoted ? "#0a66c2" : "#666"}
      /><Text
          className={`text-sm ml-2 pr-2  ${
            isUpvoted ? "text-[#0a66c2] font-medium" : "text-gray-500"
          }`}
        >
          Like {isUpvoted ? "d" : ""}
        </Text>

      
      <View className="border-l-2  pl-2 h-full ">
        <Text
          className={`text-sm ml-2   ${
            isUpvoted ? "text-[#0a66c2] font-medium" : "text-gray-500"
          }`}
        >
          {likes}
        </Text>
      </View>
    </Pressable>
  );
};

export default Likes;
