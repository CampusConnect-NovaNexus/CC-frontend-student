import React, { useState } from 'react';
import { Pressable, Image } from 'react-native';
import {icons }from '@/constants/icons'; 
const UpvoteButton = ({user_id,c_id}:{user_id}) => {
  const [isPressed, setIsPressed] = useState(false);
  return (
    <Pressable
      className={`border p-2 rounded-full ml-1 mt-1 `}
      onPressIn={() => setIsPressed(!isPressed)}
    >
      <Image
        source={icons.upArrow}
        className="size-5 "
        style={{ tintColor: isPressed ? 'green' : 'black' }}
      />
    </Pressable>
  );
};

export default UpvoteButton;