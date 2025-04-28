"use client"
import { useState,useCallback, useLayoutEffect } from "react"
import { useFocusEffect , useRouter} from "expo-router"
import { View, Text, FlatList, TouchableOpacity, ScrollView, Modal, TextInput, Pressable, Image, Alert } from "react-native"
import { icons } from "@/constants/icons"
import { getAllCourses } from "@/service/lms/getAllCourses"
import { Ionicons } from "@expo/vector-icons"
import { createCourse } from "@/service/lms/createCourse"
import { enrollStudent } from "@/service/lms/enrollStudent"

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
interface EnrollStudentRequest {
  student_id: string;
  roll_no: string;
}
export default function ExamHubScreen() {

  const router=useRouter();
  
  const [courses,setCourses]=useState<Course[]>()
  const [addCourseFormVisible,setAddCourseFormVisible]=useState(false)
  const [joinExistingClassModal,setJoinExistingClassModal]=useState(false)
  const [course_code,setCourse_code]=useState("")
  const [course_name,setCourse_name]=useState("")
  

  const getAllCourses=async()=>{
    const res=await getAllCourses()
    setCourses(res.reverse())
  }
   useFocusEffect(
    useCallback(()=>{
      getAllCourses()
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
  const handleCreateClassPress=async()=>{
    const body:CreateCourseRequest={
      course_code:course_code.toLowerCase(),
      course_name,
      user_id:"user123"
    }
    const res=await createCourse(body)
    getAllCourses()
  }
  const handleEnrollClassPress=async(course_code:string)=>{
    const body:EnrollStudentRequest={
      student_id:"user123",
      roll_no:"b23cs019"
    }
    const res=await enrollStudent(course_code,body)
    getAllCourses()
    
  }

  const renderSubjectTab = ({ item }:{item:Course}) => { 
    return (
      <Pressable onPress={()=>handleCoursePress(item)}>
        <View className="bg-gray-300 m-2 p-2 rounded-xl">
          <Text>{item.course_code.toUpperCase()}</Text>
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
        renderItem={renderSubjectTab}
        extraData={courses}
      />
    ):(
      <View className="flex-col min-h-full  bg-white   items-center" >
        <Text className=" mt-10 text-gray-600 text-3xl " >
        No Courses Yet Add first
        </Text>
      </View>
    )}
      
      <TouchableOpacity  onPress={()=>setJoinExistingClassModal(true)} >
        <Ionicons name="add" className=" absolute bg-purple-500 self-end p-6 rounded-full bottom-24 right-7  " size={24} color="white" />
      </TouchableOpacity>
      {/* Add new course */}
      <Modal
      visible={addCourseFormVisible}
      animationType="slide"
      onDismiss={()=>setAddCourseFormVisible(false)}
      >
        <View className="flex-col h-full w-full items-center justify-center bg-black/70" >
          
          <View className="bg-white w-[60%] rounded-xl py-5 w-[80%] p-[5%] flex" >
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
            <Text className="text-4xl  " >Add  course</Text>
            <Pressable
              onPress={()=>{
                setJoinExistingClassModal(true)
                setAddCourseFormVisible(false);
              }}  
            >
              <Text className=" underline text-gray-500" >or join an existing class</Text>
            </Pressable>
            <Text className="mt-8 text-2xl " >Enter Course Code</Text>
            <TextInput
              value={course_code}
              placeholder="CS212"
              onChangeText={setCourse_code}
              className="border rounded-full px-3 text-2xl "
              numberOfLines={1}
            />
            <Text className="mt-6 text-2xl " >Enter Course Name</Text>
            <TextInput
              value={course_name}
              placeholder="Principles of Programming"
              onChangeText={setCourse_name}
              numberOfLines={1}
              className="border rounded-full px-3 text-xl "
            />
            <View className="flex-row mt-8 items-center justify-around" >
              <Pressable 
                className="bg-red-700 px-2 py-1 flex text-center rounded-xl "
                onPress={()=>{
                  setCourse_code("")
                  setCourse_name("")
                  setAddCourseFormVisible(false)
                }}
              >
                <Text className="text-red-100 text-3xl " >
                  Cancle
                </Text>
              </Pressable>
              <Pressable 
                className="bg-green-700 px-2 py-1 flex text-center rounded-xl "
                onPress={()=>{
                 if( course_code.trim() && course_name.trim())
                 {
                  handleCreateClassPress();
                  setCourse_code("")
                  setCourse_name("")
                  setAddCourseFormVisible(false)
                  
                 }
                }}
              >
                <Text className="text-green-100 text-3xl" >
                  Submit
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      {/* Join Existing course */}
      <Modal
      visible={joinExistingClassModal}
      animationType="fade"
      onDismiss={()=>setJoinExistingClassModal(false)}
      >
        <View className="flex-col h-full w-full items-center justify-center bg-black/70" >
          
          <View className="bg-white w-[60%] rounded-xl py-5 w-[80%] p-[5%] flex" >
          <Pressable
            onPress={()=>{
              setJoinExistingClassModal(false)
            }}
          >
            <Image
              source={icons.goBack}
              className="size-7 "
            />
          </Pressable>
            <Text className="text-4xl  " >Join a Class</Text>
            <Pressable
              onPress={()=>{
                setAddCourseFormVisible(true);
                setJoinExistingClassModal(false)
              }}  
            >
              <Text className=" underline text-gray-500" >or create a new class</Text>
            </Pressable>
            <Text className="mt-8 text-2xl " >Enter Course Code of Class</Text>
            <TextInput
              value={course_code}
              placeholder="CS212"
              onChangeText={setCourse_code}
              className="border rounded-full px-3 text-2xl "
              numberOfLines={1}
            />
            {/* <Text className="mt-6 text-2xl " >Enter Course Name</Text>
            <TextInput
              value={course_name}
              placeholder="Principles of Programming"
              onChangeText={setCourse_name}
              numberOfLines={1}
              className="border rounded-full px-3 text-xl "
            /> */}
            <View className="flex-row mt-8 items-center justify-around" >
              <Pressable 
                className="bg-red-700 px-2 py-1 flex text-center rounded-xl "
                onPress={()=>{
                  setCourse_code("")
                  setCourse_name("")
                  setJoinExistingClassModal(false)
                }}
              >
                <Text className="text-red-100 text-3xl " >
                  Cancle
                </Text>
              </Pressable>
              <Pressable 
                className="bg-green-700 px-2 py-1 flex text-center rounded-xl "
                onPress={()=>{
                  // handleSubmitPress();
                  if(course_code.trim())
                 { handleEnrollClassPress(course_code)
                  setCourse_code("")
                  setCourse_name("")
                  setJoinExistingClassModal(false)
                  
                 }
                  else{
                    alert('kindly fill all the details')
                  }
                }}
              >
                <Text className="text-green-100 text-3xl" >
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
