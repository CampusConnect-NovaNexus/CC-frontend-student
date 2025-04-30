"use client";
import { useState, useCallback, useLayoutEffect } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  Alert,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { icons } from "@/constants/icons";
import { getAllCourses } from "@/service/lms/getAllCourses";
import { Ionicons } from "@expo/vector-icons";
import { createCourse } from "@/service/lms/createCourse";
import { enrollStudent } from "@/service/lms/enrollStudent";
import Modal from 'react-native-modal';

interface Course {
  course_code: string;
  course_name: string;
  created_by: string;
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
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>();
  const [addCourseFormVisible, setAddCourseFormVisible] = useState(false);
  const [joinExistingClassModal, setJoinExistingClassModal] = useState(false);
  const [course_code, setCourse_code] = useState("");
  const [course_name, setCourse_name] = useState("");

  const fetchAllCourses = async () => {
    const res = await getAllCourses();
    setCourses(res.reverse());
  };
  useFocusEffect(
    useCallback(() => {
      fetchAllCourses();
    }, [])
  );

  const handleCoursePress = (item: Course) => {
    router.push({
      pathname: "../DetailedCourse",
      params: {
        course_code: item.course_code,
        course_name: item.course_name,
      },
    });
  };
  const handleCreateClassPress = async () => {
    const body: CreateCourseRequest = {
      course_code: course_code.toLowerCase(),
      course_name,
      user_id: "user123",
    };
    const res = await createCourse(body);
    fetchAllCourses();
  };
  const handleEnrollClassPress = async (course_code: string) => {
    const body: EnrollStudentRequest = {
      student_id: "user123",
      roll_no: "b23cs019",
    };
    const res = await enrollStudent(course_code, body);
    fetchAllCourses();
  };

  const renderSubjectTab = ({ item }: { item: Course }) => {
    return (
      <Pressable onPress={() => handleCoursePress(item)}>
        <View className="bg-[#FFFFF0] m-2 p-4 rounded-xl shadow-md">
          <View className="flex-row justify-between items-center mb-2">
            <View className="bg-teal-500 px-3 py-1 rounded-lg">
              <Text className="text-white font-bold">{item.course_code.toUpperCase()}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </View>
          <Text className="text-lg font-semibold">{item.course_name}</Text>
          <Text className="text-gray-500 text-sm mt-1">Created by: {item.created_by || "Instructor"}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View className="flex-1 bg-[#fdfcf9]">
      <View className="flex-row justify-between mb-5 p-4">
        <View className="bg-teal-400 rounded-lg p-5 flex-1 m-1 items-center">
          <Text className="text-2xl font-bold text-white">{courses?.length || 0}</Text>
          <Text className="text-white">Total</Text>
        </View>
        <View className="bg-teal-500 rounded-lg p-5 flex-1 m-1 items-center">
          <Text className="text-2xl font-bold text-white">{courses?.length || 0}</Text>
          <Text className="text-white">Courses</Text>
        </View>
        <View className="bg-teal-600 rounded-lg p-5 flex-1 m-1 items-center">
          <Text className="text-2xl font-bold text-white">0</Text>
          <Text className="text-white">Exams</Text>
        </View>
      </View>

      <View className="z-10 bg-[#fdfcf9]">
        <Text style={{ fontFamily: "wastedVindey" }} className="text-3xl p-4 pb-6">My Courses</Text>
      </View>

      {!courses ? (
        <View className="h-40 w-full justify-center">
          <ActivityIndicator size="large" color="#cb612a" />
        </View>
      ) : courses.length > 0 ? (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.course_code}
          renderItem={renderSubjectTab}
          extraData={courses}
          contentContainerStyle={{ paddingBottom: 100 }}
          className="mt-1"
        />
      ) : (
        <View className="flex-col min-h-[200px] bg-[#fdfcf9] items-center justify-center">
          <Text className="text-gray-600 text-xl">
            No courses yet. Add your first course!
          </Text>
        </View>
      )}

      <TouchableOpacity
        className="absolute bottom-20 right-6 bg-teal-600 rounded-full p-5"
        onPress={() => setJoinExistingClassModal(true)}
      >
        <Ionicons name="add-circle" size={26} color="#fdfcf9" />
      </TouchableOpacity>
      {/* Add new course */}
      <Modal
        isVisible={addCourseFormVisible}
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
        animationInTiming={400}
        animationOutTiming={400}
        backdropTransitionInTiming={400}
        backdropTransitionOutTiming={200}
        backdropColor="rgba(0,0,0,0.5)"
        onBackdropPress={() => setAddCourseFormVisible(false)}
        style={styles.modal}
      >
        <View className="bg-white rounded-2xl p-5 m-4">
          <Text className="text-xl font-bold mb-6 text-center">Add New Course</Text>

          <Pressable
            onPress={() => setAddCourseFormVisible(false)}
            className="absolute -right-2 -top-2 bg-white p-3 rounded-full"
            style={{ elevation: 5 }}
          >
            <Image
              source={icons.cross}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </Pressable>

          <Text className="font-bold mb-3">
            Course Name
          </Text>
          <TextInput
            className="bg-gray-100 rounded-lg p-3 mb-3"
            placeholder="Enter Course Code (e.g. CS212)"
            value={course_code}
            onChangeText={setCourse_code}
            placeholderTextColor="#6B7280"
          />

          <Text className="font-bold mb-3">
            Course Code
          </Text>
          <TextInput
            className="bg-gray-100 rounded-lg p-3 mb-6"
            placeholder="Enter Course Name"
            value={course_name}
            onChangeText={setCourse_name}
            placeholderTextColor="#6B7280"
          />
          <Pressable
            onPress={() => {
              setJoinExistingClassModal(true);
              setAddCourseFormVisible(false);
            }}
            className="mb-4"
          >
            <Text className="underline text-teal-600 self-end">
              or join an existing class
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              if (course_code.trim() && course_name.trim()) {
                handleCreateClassPress();
                setCourse_code("");
                setCourse_name("");
                setAddCourseFormVisible(false);
              } else {
                Alert.alert("Error", "Please fill all the details");
              }
            }}
            className="bg-teal-600 p-4 rounded-xl"
          >
            <Text className="text-white text-center font-bold text-lg">
              Create Course
            </Text>
          </Pressable>
        </View>
      </Modal>

      {/* Join Existing course */}
      <Modal
        isVisible={joinExistingClassModal}
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
        animationInTiming={400}
        animationOutTiming={400}
        backdropTransitionInTiming={400}
        backdropTransitionOutTiming={200}
        backdropColor="rgba(0,0,0,0.5)"
        onBackdropPress={() => setJoinExistingClassModal(false)}
        style={styles.modal}
      >
        <View className="bg-white rounded-2xl p-5 m-4">
          <Text className="text-xl font-bold mb-6 text-center">Join a Class</Text>

          <Pressable
            onPress={() => setJoinExistingClassModal(false)}
            className="absolute -right-2 -top-2 bg-white p-3 rounded-full"
            style={{ elevation: 5 }}
          >
            <Image
              source={icons.cross}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </Pressable>


          <TextInput
            className="bg-gray-100 rounded-lg p-3 mb-6"
            placeholder="Enter Course Code (e.g. CS212)"
            value={course_code}
            onChangeText={setCourse_code}
            placeholderTextColor="#6B7280"
          />
          <Text className="text-md italic font-bold text-teal-600 self-center pb-3">
            OR
          </Text>
          <Pressable
            onPress={() => {
              setAddCourseFormVisible(true);
              setJoinExistingClassModal(false);
            }}
            className="mb-4 border-[1px] border-gray-300 self-center w-fit p-3 rounded-xl bg-white"
            style={{ elevation: 1 }}
          >
            <Text className="text-md text-teal-600">
              + Add Course
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              if (course_code.trim()) {
                handleEnrollClassPress(course_code);
                setCourse_code("");
                setCourse_name("");
                setJoinExistingClassModal(false);
              } else {
                Alert.alert("Error", "Please enter a course code");
              }
            }}
            className="bg-teal-600 p-4 rounded-xl"
          >
            <Text className="text-white text-center font-bold text-lg">
              Join Course
            </Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});
