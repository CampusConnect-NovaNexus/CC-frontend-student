import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tw from 'twrnc';

const statusColors = {
  Pending: 'text-yellow-500',
  Resolved: 'text-green-500',
  Rejected: 'text-red-500',
};

const GrievanceCard = ({ grievance, onPress }) => {
  const { title, description, status, createdAt } = grievance;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={tw`bg-white rounded-2xl p-4 mb-3 shadow-md`}
    >
      <View style={tw`flex-row justify-between items-center mb-2`}>
        <Text style={tw`text-lg font-bold text-black`}>{title}</Text>
        <Feather name="chevron-right" size={20} color="#999" />
      </View>

      <Text style={tw`text-gray-700 mb-2`} numberOfLines={2}>
        {description}
      </Text>

      <View style={tw`flex-row justify-between items-center`}>
        <Text style={tw`${statusColors[status] || 'text-gray-500'} font-semibold`}>
          {status}
        </Text>
        <Text style={tw`text-xs text-gray-500`}>
          {new Date(createdAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default GrievanceCard;
