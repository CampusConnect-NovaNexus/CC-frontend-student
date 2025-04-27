"use client"
import { useState,useCallback, useLayoutEffect } from "react"
import { useFocusEffect , useRouter} from "expo-router"
import { View, Text, FlatList, TouchableOpacity, ScrollView, Modal, TextInput, Pressable, Image } from "react-native"
import { icons } from "@/constants/icons"
import { getAllCourses } from "@/service/lms/getAllCourses"
import { Ionicons } from "@expo/vector-icons"
import { createCourse } from "@/service/lms/createCourse"

interface Course{
  course_code:string,
  course_name:string,
  created_by:string
}
interface CreateCourseRequest {
  course_code: string;
  course_name: string;
  user_id: string;
}

export default function ExamHubScreen() {

  const router=useRouter();
  
  const [courses,setCourses]=useState<Course[]>()
  const [addCourseFormVisible,setAddCourseFormVisible]=useState(false)
  const [course_code,setCourse_code]=useState("")
  const [course_name,setCourse_name]=useState("")
  

  const getCourses=async()=>{
    const res=await getAllCourses()
    setCourses(res.reverse())
  }
   useFocusEffect(
    useCallback(()=>{
      getCourses()
    },[])
  )
   
  const handleCoursePress = (item: Course) => {
    router.push({
      pathname: '../DetailedCourse',
      params: {
        course_code: item.course_code,
        course_name: item.course_name,
      },
    });
  };
  const handleSubmitPress=async()=>{
    const body:CreateCourseRequest={
      course_code,
      course_name,
      user_id:"user123"
    }
    const res=await createCourse(body)
    console.log('res from CreateCourse in Exam HUb');
    getCourses();
  }

  const renderSubjectTab = ({ item }:{item:Course}) => { 
    return (
      <Pressable onPress={()=>handleCoursePress(item)}>
        <View className="bg-gray-300 m-2 p-2 rounded-xl">
          <Text>{item.course_code}</Text>
          <Text>{item.course_name}</Text>
        </View>
      </Pressable>
    )
  }

  return (
    <View className="flex-col min-h-full  bg-white">
      {courses && courses.length>0 ?(
        <FlatList
        data={courses}
        keyExtractor={(item) => item.course_code}
        showsVerticalScrollIndicator={false}
        renderItem={renderSubjectTab}
        extraData={courses}
      />
    ):(
      <View>
        <Text>
        No Courses Yet Add first
        </Text>
      </View>
    )}
      
      <TouchableOpacity  onPress={()=>setAddCourseFormVisible(true)} >
        <Ionicons name="add" className="bg-purple-500 self-end p-6 rounded-full bottom-24 right-7  " size={24} color="white" />
      </TouchableOpacity>
      {/* Add new course */}
      <Modal
      visible={addCourseFormVisible}
      onDismiss={()=>setAddCourseFormVisible(false)}
      >
        <View className="flex-col h-full w-full items-center justify-center bg-black/70" >
          
          <View className="bg-white w-[60%] rounded-xl py-5 w-[80%] flex " >
          <Pressable
            onPress={()=>{
              setAddCourseFormVisible(false)
            }}
          >
            <Image
              source={icons.goBack}
              className="size-7 "
            />
          </Pressable>
            <Text className="text-4xl mt-5  " >Add  course</Text>
            <TextInput
              value={course_code}
              placeholder="enter course code like CS-102"
              onChangeText={setCourse_code}
              className="border rounded-full px-3 text-2xl "
            />
            <TextInput
              value={course_name}
              placeholder="enter course code like CS-102"
              onChangeText={setCourse_name}
              className="border rounded-full px-3 text-xl "
            />
            <View className="flex-row mt-5 items-center justify-around" >
              <Pressable 
                className="bg-red-300 px-2 py-1 flex text-center rounded-xl "
                onPress={()=>{
                  setCourse_code("")
                  setCourse_name("")
                  setAddCourseFormVisible(false)
                }}
              >
                <Text className="text-red-700 text-3xl " >
                  Cancle
                </Text>
              </Pressable>
              <Pressable 
                className="bg-green-300 px-2 py-1 flex text-center rounded-xl "
                onPress={()=>{
                  handleSubmitPress();
                  setCourse_code("")
                  setCourse_name("")
                  setAddCourseFormVisible(false)
                }}
              >
                <Text className="text-green-700 text-3xl" >
                  Submit
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}
