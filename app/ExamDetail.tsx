import { View, Text, FlatList, TextInput, Pressable, Image, Alert, Button, Linking, Modal } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { icons } from '@/constants/icons';
import { addSyllabusItem } from '@/service/lms/addSyllabusItem';
import { getSyllabusItems } from '@/service/lms/getSyllabusItem';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import * as DocumentPicker from 'expo-document-picker';
import sendPdf, { PdfFile } from '@/service/lms/sendPdfFile';
import { getPdf } from '@/service/lms/getPdf';
import Toast from 'react-native-toast-message';

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
  const [pdfFile, setPdfFile] = useState<PdfFile | null>(null);
  const { user } = useAuth();
  const [resPdf, setResPdf] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
      user_id: user?.id || "",
    };
    const res = await addSyllabusItem(body, exam_id);
    if (res && res.item_id) {
      getSylItem();
    }
    setSyllabusItem("");
  };

  const getSylItem = async () => {
    const res = await getSyllabusItems(exam_id);
    if (res && res.length > 0) {
      setSyllabus(res.reverse());
    }
  };

  const RenderSyllabusItem = ({ item }: { item: SyllabusItem }) => {
    const [checked, setChecked] = useState(false);
    const toggleCheckbox = () => setChecked(!checked);

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

  const pickPdf = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.length) return;

      const file = result.assets[0];
      setPdfFile({
        uri: file.uri,
        name: file.name,
        mimeType: file.mimeType,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to pick PDF');
    }
  };

  const uploadPdf = async () => {
    if (!pdfFile) {
      Alert.alert('No file selected', 'Please select a PDF first.');
      return;
    }

    try {
      const response = await sendPdf(pdfFile, exam_id);
      if (response.message === "PYQ added successfully") {
        setPdfFile(null);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'PDF uploaded successfully!',
        });
      }
    } catch (err: any) {
      Alert.alert('Upload Error', err?.message || 'Something went wrong');
    }
  };

  const getPdfFile = async () => {
    try {
      const res = await getPdf(exam_id);
      if (res && res.pyq_pdf) {
        setResPdf(res.pyq_pdf);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch PDF');
    }
  };

  const handleViewPdf = () => {
    if (!resPdf) {
      Alert.alert('No PDF', 'No previous year paper available');
      return;
    }
    Linking.openURL(resPdf);
  };

  useEffect(() => {
    getSylItem();
  }, []);

  useEffect(() => {
    if (isModalVisible) {
      getPdfFile();
    }
  }, [isModalVisible]);

  return (
    <View className="flex-1 bg-gray-100 p-4 mt-10">
      <StatusBar style="dark" backgroundColor="#f3f3f1" />
      <View className="bg-[#F8F8FF] rounded-2xl p-6 shadow-md flex-1">
        <Text className="text-2xl font-bold text-gray-800 mb-6 text-center border-b border-gray-300 pb-2">
          Exam Details
        </Text>

        <View className="h-fit p-4">
          <View className="flex-row justify-between mb-5">
            <View className="bg-teal-400 rounded-lg p-5 flex-1 m-1 items-center justify-center">
              <Text className="text-2xl font-bold text-white">
                {exam_course_code?.toUpperCase()}
              </Text>
              <Text className="text-white">Course Code</Text>
            </View>

            <View className="bg-teal-500 rounded-lg p-5 flex-1 m-1 items-center justify-center">
              <Text className="text-2xl font-bold text-white">
                {exam_type?.toUpperCase()}
              </Text>
              <Text className="text-white">Event</Text>
            </View>
          </View>

          <Pressable
            onPress={() => setIsModalVisible(true)}
            className="bg-teal-600 rounded-lg p-5 m-1 items-center justify-center"
          >
            <Text className="text-xl font-bold text-white">
              Past Year Question Papers
            </Text>
          </Pressable>

          <View className="mb-4 mt-4">
            <Text className="text-base text-gray-600">Exam Date:</Text>
            <Text className="text-xl font-semibold text-gray-900">
              {new Date(exam_date).toDateString()}
            </Text>
          </View>

          <View className="mb-6">
            <Text className="text-base text-gray-600">Time Remaining:</Text>
            <Text className="text-xl font-semibold text-red-600">
              {getRemainingDays(exam_date)}
            </Text>
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

        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-[#00000080]">
            <View className="bg-[#F8F8FF] rounded-2xl p-6 m-4 w-11/12">
              <View className="flex-row justify-between mb-4">
                <Text className="text-xl font-bold text-gray-800">PYQ Papers</Text>
                <Pressable onPress={() => setIsModalVisible(false)}>
                  <Ionicons name="close" size={24} color="gray" />
                </Pressable>
              </View>

              <View className="space-y-6">
                {resPdf ? (
                  <View className="bg-green-50 p-4 rounded-xl border border-green-200">
                    <View className="flex-row items-center mb-3">
                      <Ionicons name="document-text" size={24} color="#059669" />
                      <Text className="text-green-700 ml-2 font-semibold">PDF Available</Text>
                    </View>
                    <Pressable
                      onPress={handleViewPdf}
                      className="flex-row items-center bg-green-600 p-3 rounded-lg justify-center"
                    >
                      <Ionicons name="eye" size={24} color="white" />
                      <Text className="text-white ml-2 font-medium">View PDF</Text>
                    </Pressable>
                  </View>
                ) : (
                  <View className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <View className="flex-row items-center mb-3">
                      <Ionicons name="alert-circle" size={24} color="#6B7280" />
                      <Text className="text-gray-600 ml-2 font-semibold">No PDF Available</Text>
                    </View>
                    <Text className="text-gray-500 mb-4">Upload a previous year question paper to help other students.</Text>
                  </View>
                )}

                <View className="space-y-3">
                  <Pressable
                    onPress={pickPdf}
                    className="flex-row items-center bg-teal-500 m-5 p-3 w-1/2 rounded-lg justify-center self-center"
                  >
                    <Ionicons name="document-attach" size={24} color="white" />
                    <Text className="text-white ml-2 font-medium">Select PDF</Text>
                  </Pressable>

                  {pdfFile && (
                    <View className="bg-teal-50 p-4 rounded-xl border border-teal-200">
                      <Text className="text-teal-700 mb-3">Selected: {pdfFile.name}</Text>
                      <Pressable
                        onPress={uploadPdf}
                        className="flex-row items-center bg-teal-600 p-3 rounded-lg justify-center"
                      >
                        <Ionicons name="cloud-upload" size={24} color="white" />
                        <Text className="text-white ml-2 font-medium">Upload PDF</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        </Modal>

        <View className="absolute bottom-4 left-4 right-4 flex-row items-center border border-gray-300 rounded-full px-4 py-2 bg-white shadow">
          <TextInput
            value={syllabusItem}
            onChangeText={setSyllabusItem}
            placeholder="Add a new study item..."
            className="flex-1 text-base text-gray-700"
            placeholderTextColor="gray"
          />
          <Pressable
            onPress={postSylItem}
            disabled={!syllabusItem.trim()}
            className="bg-teal-600 rounded-full p-1"
          >
            <Ionicons name="add" size={26} color="#fdfcf9" />
          </Pressable>
        </View>
      </View>
      <Toast />
    </View>
  );
};

export default ExamDetail;