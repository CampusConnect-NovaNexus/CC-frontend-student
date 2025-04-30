import { View, Text, FlatList, TouchableOpacity, Pressable, StyleSheet, ActivityIndicator, Image, Platform } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { getCourseExams } from '@/service/lms/getCoursesExam';
import { createExam } from '@/service/lms/createExam';
import { Ionicons } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import Modal from 'react-native-modal';
import { icons } from "@/constants/icons";

interface Exam {
  exam_id: string,
  course_code: string,
  exam_type: string,
  exam_date: string,
  created_by: string
}

const DetailedCourse = () => {
  const router = useRouter();
  const [allExams, setAllExams] = useState<Exam[]>();
  const [loading, setLoading] = useState(true);
  const { course_code, course_name } = useLocalSearchParams<{ course_code: string; course_name: string }>();

  const [modalVisible, setModalVisible] = useState(false);
  const [examType, setExamType] = useState('');
  const [examDate, setExamDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const getAllExams = async () => {
    setLoading(true);
    try {
      const res = await getCourseExams(course_code);
      setAllExams(res);
    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!examType) {
      alert('Please select an Exam Type');
      return;
    }

    // Call your API to create new exam
    await createExam(course_code, {
      exam_type: examType,
      exam_date: examDate.toISOString(),
      user_id: "user123"
    });

    getAllExams(); // refresh list
  };

  const handleCancel = () => {
    setExamType('');
    setExamDate(new Date());
    setModalVisible(false);
  };

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

  const getExamTypeLabel = (type: string) => {
    const types = {
      'mt': 'Mid Term',
      'et': 'End Term',
      'ct1': 'Class Test 1',
      'ct2': 'Class Test 2'
    };
    return types[type as keyof typeof types] || type;
  };

  const renderExamTab = ({ item }: { item: Exam }) => {
    const time = getRemainingDays(item.exam_date);
    const isPassed = time === 'Already passed';

    return (
      <Pressable
        onPress={() => {
          router.push({
            pathname: 'ExamDetail',
            params: {
              exam_id: item.exam_id,
              exam_type: item.exam_type,
              exam_date: item.exam_date,
              exam_course_code: item.course_code,
            },
          });
        }}
      >
        <View className={`${isPassed ? 'bg-gray-300' : 'bg-[#FFFFF0]'} m-2 p-4 rounded-xl shadow-md`}>
          <View className="flex-row justify-between items-center mb-2">
            <View className={`${isPassed ? 'bg-gray-400' : 'bg-teal-500'} px-3 py-1 rounded-lg`}>
              <Text className="text-white font-bold">{getExamTypeLabel(item.exam_type)}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </View>
          <Text className={`text-lg font-semibold ${isPassed ? 'text-white' : 'text-gray-800'}`}>
            {new Date(item.exam_date).toDateString()}
          </Text>
          <Text className={`text-sm ${isPassed ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
            Created by: {item.created_by || "Instructor"}
          </Text>
          <Text className={`text-sm ${isPassed ? 'text-gray-500' : 'text-sky-600'} mt-2 font-semibold`}>
            {time}
          </Text>
        </View>
      </Pressable>
    );
  };

  useFocusEffect(
    useCallback(() => {
      getAllExams();
    }, [])
  );

  return (
    <View className="flex-1 bg-[#fdfcf9] pt-14">
      {/* Header Stats */}
      <View className="flex-row justify-between mb-5 p-4">
        <View className="bg-teal-400 rounded-lg p-5 flex-1 m-1 items-center">
          <Text className="text-2xl font-bold text-white">{course_code?.toUpperCase()}</Text>
          <Text className="text-white">Course Code</Text>
        </View>
        <View className="bg-teal-500 rounded-lg p-5 flex-1 m-1 items-center">
          <Text className="text-2xl font-bold text-white">{allExams?.length || 0}</Text>
          <Text className="text-white">Deadlines</Text>
        </View>
      </View>

      {/* Course Title */}
      <View className="z-10 bg-[#fdfcf9] px-4 py-2">
        <Text className="text-2xl font-bold text-gray-800 px-4 mb-2 text-center">{course_name?.toUpperCase()}</Text>

      </View>

      {/* Exams List */}
      {loading ? (
        <View className="h-40 w-full justify-center">
          <ActivityIndicator size="large" color="#0891b2" />
        </View>
      ) : allExams && allExams.length > 0 ? (
        <View className="mb-10">
          <Text className="text-xl text-gray-400 mt-4 px-5 italic">Upcoming Events</Text>
          <FlatList
            data={allExams}
            keyExtractor={(exam) => exam.exam_id}
            renderItem={renderExamTab}
            extraData={allExams}
            contentContainerStyle={{ paddingBottom: 100 }}
            className="mt-1"
          />
        </View>
      ) : (
        <View className="flex-col min-h-[200px] bg-[#fdfcf9] mt-[15vh] items-center justify-center">
          <Text className="text-gray-500 text-2xl py-4 w-4/5 text-center">No exams declared yet, Relax 😌</Text>
          <Text className="text-gray-400 text-xl py-4 italic">Feel free to add one </Text>
        </View>
      )}

      {/* Modal for creating new exam */}
      <Modal
        isVisible={modalVisible}
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
        animationInTiming={400}
        animationOutTiming={400}
        backdropTransitionInTiming={400}
        backdropTransitionOutTiming={200}
        backdropColor="rgba(0,0,0,0.5)"
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modal}
      >
        <View className="bg-white rounded-2xl p-5 m-4">
          <Text className="text-xl font-bold mb-6 text-center">Create New Exam</Text>
          
          <Pressable
            onPress={() => setModalVisible(false)}
            className="absolute -right-2 -top-2 bg-white p-3 rounded-full"
            style={{ elevation: 5 }}
          >
            <Image
              source={icons.cross}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </Pressable>

          <Text className="font-bold mb-3">Exam Type</Text>
          <View className="bg-gray-100 rounded-lg mb-4">
            <Picker
              selectedValue={examType}
              onValueChange={(itemValue) => setExamType(itemValue)}
              style={{ height: 55 }}
            >
              <Picker.Item label="Select Exam Type" value="" />
              <Picker.Item label="Mid Term" value="mt" />
              <Picker.Item label="End Term" value="et" />
              <Picker.Item label="Class Test 1" value="ct1" />
              <Picker.Item label="Class Test 2" value="ct2" />
            </Picker>
          </View>

          {/* Date Picker */}
          <Text className="font-bold mb-3">Exam Date</Text>
          <TouchableOpacity
            className="bg-gray-100 p-4 rounded-lg mb-6"
            onPress={() => setShowDatePicker(true)}
          >
            <Text className="text-gray-700">{examDate.toDateString()}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={examDate}
              mode="date"
              style={{ height: 55 }}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setExamDate(selectedDate);
              }}
            />
          )}

          <TouchableOpacity
            className="bg-teal-600 p-4 rounded-xl mt-4"
            onPress={() => {
              if (examType && examDate) {
                alert('Please fill the fields');
                return;
              }
              handleSubmit();
              setExamType('');
              setExamDate(new Date());
              setModalVisible(false);
            }}
          >
            <Text className="text-white text-center font-bold text-lg">Create Exam</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Add Exam Button */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="absolute bottom-20 right-6 bg-teal-600 rounded-full p-5"
      >
        <Ionicons name="add-circle" size={26} color="#fdfcf9" />
      </TouchableOpacity>
    </View>
  );
};

export default DetailedCourse;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});
