import { View, Text } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';

const DetailedCourse = () => {
  const { course_code, course_name } = useLocalSearchParams<{ course_code: string; course_name: string }>();

  return (
    <View>
      <Text>{course_code}</Text>
      <Text>{course_name}</Text>
    </View>
  );
};

export default DetailedCourse;
