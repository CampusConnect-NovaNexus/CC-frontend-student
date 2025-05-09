import { View, Text, FlatList, TextInput, Pressable, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { icons } from '@/constants/icons';
import { addSyllabusItem } from '@/service/lms/addSyllabusItem';
import { getSyllabusItems } from '@/service/lms/getSyllabusItem';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from "@expo/vector-icons";

interface AddSyllabusRequest {
  description: string;
  parent_item_id: string | null;
  user_id: string;
}
interface SyllabusItem {
  item_id: string;
  exam_id: string;
  parent_item_id: string | null;
  description: string;
  created_by: string;
}

const ExamDetail = () => {
  const { exam_id, exam_type, exam_date, exam_course_code } = useLocalSearchParams<{
    exam_id: string;
    exam_type: string;
    exam_date: string;
    exam_course_code: string;
  }>();

  const [syllabusItem, setSyllabusItem] = useState("");
  const [syllabus, setSyllabus] = useState<SyllabusItem[] | null>(null);

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

  const postSylItem = async () => {
    const body: AddSyllabusRequest = {
      description: syllabusItem,
      parent_item_id: null,
      user_id: 'user123',
    };
    const res = await addSyllabusItem(body, exam_id);
    if (res && res.item_id) {
      getSylItem();
    }
    console.log('response from adding syllabus item : ', res);
  };

  const getSylItem = async () => {
    const res = await getSyllabusItems(exam_id);
    if (res && res.length > 0) {
      setSyllabus(res.reverse());
    }
  };

  const RenderSyllabusItem = ({ item }: { item: SyllabusItem }) => {
    const [checked, setChecked] = useState(false);
    const toggleCheckbox = () => {
      setChecked(!checked);
    };

    return (
      <Pressable
        disabled={checked}
        onPress={toggleCheckbox}
        className="flex-row items-center my-2"
      >
        <View
          className={`w-6 h-6 rounded-full border-2 ${checked ? 'bg-green-500 border-green-500' : 'border-gray-400'} mr-3`}
        />
        <Text className="text-lg text-gray-800">{item.description}</Text>
      </Pressable>
    );
  };

  useEffect(() => {
    getSylItem();
    
    
  }, []);

  return (

    <View className="flex-1 bg-gray-100 p-4 mt-10">
      <StatusBar style="dark" backgroundColor="#f3f3f1" />
      <View className="bg-[#F8F8FF] rounded-2xl p-6 shadow-md flex-1">
        <Text className="text-2xl font-bold text-gray-800 mb-6 text-center border-b border-gray-300 pb-2">Exam Details</Text>
        <View>
          <View className="flex-row justify-between mb-5 p-4">
            <View className="bg-teal-400 rounded-lg p-5 flex-1 m-1 items-center">
              <Text className="text-2xl font-bold text-white">{exam_course_code?.toUpperCase()}</Text>
              <Text className="text-white">Course Code</Text>
            </View>
            <View className="bg-teal-500 rounded-lg p-5 flex-1 m-1 items-center">
              <Text className="text-2xl font-bold text-white">{exam_type.toUpperCase()}</Text>
              <Text className="text-white">Event </Text>
            </View>
          </View>
        </View>
        <View className="self-start w-full">

          <View className="mb-4">
            <Text className="text-base text-gray-600">Exam Date:</Text>
            <Text className="text-xl font-semibold text-gray-900">{new Date(exam_date).toDateString()}</Text>
          </View>

          <View className="mb-6">
            <Text className="text-base text-gray-600">Time Remaining:</Text>
            <Text className="text-xl font-semibold text-purple-600">{getRemainingDays(exam_date)}</Text>
          </View>

          <Text className="text-xl font-semibold text-gray-700 mb-3">Syllabus:</Text>

          {syllabus && syllabus.length > 0 ? (
            <FlatList
              data={syllabus}
              keyExtractor={(item) => item.item_id}
              renderItem={({ item }) => <RenderSyllabusItem item={item} />}
              showsVerticalScrollIndicator={false}
              className="mb-4"
            />
          ) : (
            <Text className="text-gray-500 italic">You haven't added any TO DO item yet.</Text>
          )}
        </View>

        {/* Input Field to Add New Syllabus */}
        <View className="absolute bottom-4 left-4 right-4 flex-row items-center border border-gray-300 rounded-full px-4 py-2 bg-white shadow">
          <TextInput
            value={syllabusItem}
            onChangeText={setSyllabusItem}
            placeholder="Add a new study item..."
            className="flex-1 text-base text-gray-700"
            placeholderTextColor="gray"
          />
          <Pressable
            onPress={() => {
              if (syllabusItem.trim().length > 0) {
                postSylItem();
                setSyllabusItem("");
              }
            }}
            className="bg-teal-600 rounded-full p-1"
          >
            <Ionicons name="add" size={26} color="#fdfcf9" />
          </Pressable>
        </View>

      </View>
    </View>
  );
};

export default ExamDetail;
