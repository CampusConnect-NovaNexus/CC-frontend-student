import { View, Text, FlatList, TouchableOpacity, Pressable } from 'react-native';
import React, { useCallback, useState,useEffect } from 'react';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { getCourseExams } from '@/service/lms/getCoursesExam';
import { createExam } from '@/service/lms/createExam';
import { Ionicons } from "@expo/vector-icons";
import { Modal, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
interface Exam {
  exam_id: string,
  course_code: string,
  exam_type: string,
  exam_date: string,
  created_by: string
}

const DetailedCourse = () => {
  const router= useRouter();
  const [allExams, setAllExams] = useState<Exam[]>();
  const { course_code, course_name } = useLocalSearchParams<{ course_code: string; course_name: string }>();

  const [modalVisible, setModalVisible] = useState(false);
  const [examType, setExamType] = useState('');
  const [examDate, setExamDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const getAllExams = async () => {
    const res = await getCourseExams(course_code);
    setAllExams(res);
    console.log(res);
  };

  const handleSubmit = async () => {
    if (!examType) {
      alert('Please select an Exam Type');
      return;
    }

    // Call your API to create new exam
    await createExam(course_code,{
      exam_type: examType,
      exam_date: examDate.toISOString(),
      user_id:"user123"
    });

    setExamType('');
    setExamDate(new Date());
    setModalVisible(false);
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


  const renderExamTab = ({ item }: { item: Exam }) => {
    console.log('item in render Exa tab : ', item);
    const time=getRemainingDays(item.exam_date)
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
        <View className={`${time==='Already passed'?'bg-slate-600':'bg-gray-400'} p-4 rounded-lg shadow-md m-4 border border-gray-800`}>
          <Text className="text-xl font-semibold text-gray-800">{item.exam_type}</Text>
          <Text className="text-gray-600">{new Date(item.exam_date).toDateString()}</Text>
          <Text className="text-sm text-gray-500">Created by: {item.created_by}</Text>
          <Text className="text-sm text-purple-600 mt-2 font-semibold">{time}</Text>
        </View>
</Pressable>
    );
  };
  // useEffect(()=>{
  //     getAllExams()
  // },[allExams])

  useFocusEffect(
    useCallback(() => {
      getAllExams();
    }, [])
  );

  return (
    <View className='bg-gray-200 h-full'>

      <Text className="text-4xl text-gray-800">{course_code.toUpperCase()}</Text>
      <Text className="text-2xl text-gray-600">{course_name.toUpperCase()}</Text>

      <Text className="text-2xl mt-10">
        Upcoming Exams:
      </Text>

      {allExams && allExams.length > 0 ? (
        <FlatList
          data={allExams}
          keyExtractor={(exam) => exam.exam_id}
          renderItem={renderExamTab}
          extraData={allExams}
        />
      ) : (
        <View className='flex items-center mt-10'>
          <Text>No Exams yet declared, relax 😌</Text>
        </View>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-xl p-6 w-11/12">
            <Text className="text-xl font-bold mb-4 text-center">Create New Exam</Text>

            <Picker
              selectedValue={examType}
              onValueChange={(itemValue) => setExamType(itemValue)}
            >
              <Picker.Item label="Select Exam Type" value="" />
              <Picker.Item label="Mid" value="Mid Term" />
              <Picker.Item label="End" value="End Term" />
              <Picker.Item label="CT1" value="Class Test I" />
              <Picker.Item label="CT2" value="Class Test II" />
            </Picker>

            {/* Date Picker */}
            <TouchableOpacity
              className="bg-gray-200 p-3 rounded-md mt-4"
              onPress={() => setShowDatePicker(true)}
            >
              <Text>Select Exam Date: {examDate.toDateString()}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={examDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setExamDate(selectedDate);
                }}
              />
            )}

            <View className="flex-row justify-between mt-6">
              <TouchableOpacity
                className="bg-red-500 p-3 rounded-md flex-1 mr-2"
                onPress={handleCancel}
              >
                <Text className="text-white text-center font-bold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-green-500 p-3 rounded-md flex-1 ml-2"
                onPress={handleSubmit}
              >
                <Text className="text-white text-center font-bold">Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="absolute bg-purple-500 self-end p-6 rounded-full bottom-10 right-10"
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default DetailedCourse;
