import { View, Text, TextInput, Pressable, Image } from 'react-native';
import React,{useEffect, useState} from 'react';
import { useLocalSearchParams } from 'expo-router';
import { icons } from '@/constants/icons';
import { addSyllabusItem } from '@/service/lms/addSyllabusItem';
import { getSyllabusItems } from '@/service/lms/getSyllabusItem';
const ExamDetail = () => {
  const { exam_id, exam_type, exam_date, exam_course_code } = useLocalSearchParams<{
    exam_id: string;
    exam_type: string;
    exam_date: string;
    exam_course_code: string;
  }>();
  const [syllabusItem, setSyllabusItem]=useState("")

  // Function to calculate remaining days
  const getRemainingDays = (dateString: string) => {
    const today = new Date();
    const examDay = new Date(dateString);
    const diffTime = examDay.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 1) return `${diffDays} days left`;
    else if (diffDays === 1) return 'Tomorrow!';
    else if (diffDays === 0) return 'Today!';
    else return 'Already passed';
  };
  const postSylItem=async()=>{

  }
  const getSylItem=async()=>{
    
  }
  useEffect(()=>{

  },[])
  
  return (
    <View className="flex-1 bg-gray-100 p-6">
      <View className="bg-white rounded-xl h-full p-6 flex-col items-center shadow-md">
        <Text className="text-2xl font-bold text-gray-800 mb-4 text-center border-b border-gray-300 ">Exam Details</Text>
        <View className='self-start' >
            <View className="mb-4">
            <Text className="text-lg text-gray-600">Course Code:</Text>
            <Text className="text-xl font-semibold text-gray-900">{exam_course_code.toUpperCase()}</Text>
            </View>

            <View className="mb-4">
            <Text className="text-lg text-gray-600">Exam Type:</Text>
            <Text className="text-xl font-semibold text-gray-900">{exam_type}</Text>
            </View>

            <View className="mb-4">
            <Text className="text-lg text-gray-600">Exam Date:</Text>
            <Text className="text-xl font-semibold text-gray-900">
                {new Date(exam_date).toDateString()}
            </Text>
            </View>

            <View className="mb-4">
            <Text className="text-lg text-gray-600">Time Remaining:</Text>
            <Text className="text-xl font-semibold text-purple-600">
                {getRemainingDays(exam_date)}
            </Text>
            </View>

        </View>
        <View className="absolute border rounded-xl flex-row justify-between items-center bottom-8 w-full px-2 border-t border-gray-300 ">
            <TextInput
                value={syllabusItem}
                onChangeText={setSyllabusItem}
                placeholder='Add a new study item . .'
                className=''
            />
            <Pressable
                onPress={()=>{

                }}
            >
                <Image
                    source={icons.send}
                    className='size-5 px-2'
                />
            </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ExamDetail;
