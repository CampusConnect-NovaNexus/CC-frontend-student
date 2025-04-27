"use client"
import { useState,useCallback } from "react"
import { useFocusEffect , useRouter} from "expo-router"

import { View, Text, FlatList, TouchableOpacity, ScrollView, Modal, TextInput, Pressable } from "react-native"
import { icons } from "@/constants/icons"
import { getAllCourses } from "@/service/lms/getAllCourses"

interface Course{
  course_code:string,
  course_name:string,
  created_by:number
}

export default function ExamHubScreen() {

  const router=useRouter();
  
  const [courses,setCourses]=useState<Course[]>([
    {
      course_code: "CS101",
      course_name: "Introduction to Computer Science",
      created_by: 1
    },
    {
      course_code: "CS103",
      course_name: "Introduction to Computer Science",
      created_by: 2
    },
    {
      course_code: "CS102",
      course_name: "Introduction to Computer Science",
      created_by: 3
    }
  ])
  

  const getCourses=async()=>{
    console.log('in get ciurses');
    
    const res=await getAllCourses()
    console.log('resposnse of get all courses in ExamHubScr : ', res);
    
  }
   useFocusEffect(
    useCallback(()=>{
      getCourses()
    },[])
   )
   
   const handlePress = (item: Course) => {
    router.push({
      pathname: '../DetailedCourse',
      params: {
        course_code: item.course_code,
        course_name: item.course_name,
      },
    });
  };

  const renderSubjectTab = ({ item }:{item:Course}) => { 
    return (
      <Pressable onPress={()=>handlePress(item)}>
        <View className="bg-gray-300 m-2 p-2 rounded-xl">
          <Text>{item.course_code}</Text>
          <Text>{item.course_name}</Text>
        </View>
      </Pressable>
    )
  }

  return (
    <View className="flex-col  bg-white">
      <FlatList
        data={courses}
        keyExtractor={(item) => item.course_code}
        showsVerticalScrollIndicator={false}
        renderItem={renderSubjectTab}
      />
      <Pressable>
        </Pressable>
    </View>
  )
}
