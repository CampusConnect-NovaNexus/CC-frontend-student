import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';


const GrievanceCard = ({ grievance, onPress }) => {
  const { title, description } = grievance;

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-white rounded-2xl p-4 mb-3 shadow-md`}
    >
      <View className={`flex-row justify-between items-center mb-2`}>
        <Text className={`text-lg font-bold text-black`}>{title}</Text>
        <Feather name="chevron-right" size={20} color="#999" />
      </View>

      <Text className='text-gray-700 mb-2' numberOfLines={2}>
        {description}
      </Text>

      <View className={`flex-row justify-between items-center`}>
        <Text className={`text-gray-500'} font-semibold`}>
          {status}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default GrievanceCard;
