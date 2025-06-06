import { View, Text, FlatList, TextInput, Pressable, Image, Alert, Button, Linking, Modal, Dimensions, ScrollView } from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { icons } from '@/constants/icons';
import { addSyllabusItem } from '@/service/lms/addSyllabusItem';
import { getSyllabusItems } from '@/service/lms/getSyllabusItem';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import * as DocumentPicker from 'expo-document-picker';
import sendPdf, { PdfFile } from '@/service/lms/sendPdfFile';
import { getPdf } from '@/service/lms/getPdf';
import { updateProgress } from '@/service/lms/updateProgress';
import Toast from 'react-native-toast-message';
import { getItem, setItem, syllabusToDescriptionMap, updateItem } from '@/service/lms/storage';
import React from 'react';
import { updateSyllabusItemStat } from '@/service/lms/updateSyllabusItemStat';
import { getSyllabusItemStats } from '@/service/lms/getSyllabusItemStats';
import CircularProgress from '@/components/CircularProgress';

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
  total_students?: number;
  who_studied?: number;
  stats?: {
    total_students: number;
    who_studied: number;
  };
}

const ExamDetail = () => {
  const { exam_id, exam_type, exam_date, exam_course_code } = useLocalSearchParams<{
    exam_id: string;
    exam_type: string;
    exam_date: string;
    exam_course_code: string;
  }>();
  
  console.log('ExamDetail initialized with params:', { exam_id, exam_type, exam_date, exam_course_code });

  const [syllabusItem, setSyllabusItem] = useState("");
  const [syllabus, setSyllabus] = useState<SyllabusItem[] | null>(null);
  const [pdfFile, setPdfFile] = useState<PdfFile | null>(null);
  const { user } = useAuth();
  const [resPdf, setResPdf] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
useFocusEffect(
  useCallback(()=>{
         initializeData();
  },[])
)  
const initializeData = async () => {
      console.log('Initializing data for ExamDetail');
      try {
        await getSylItem();
        await getPdfFile();
        console.log('Initial data loaded successfully');
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    };
  // useEffect(() => {
  //   console.log('ExamDetail component mounted');
    
    
    
 
    
  //   return () => {
  //     console.log('ExamDetail component unmounting');
  //   };
  // }, []);

  const getRemainingDays = (dateString: string) => {
    const today = new Date();
    const examDay = new Date(dateString);
    const diffTime = examDay.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    console.log('Calculating remaining days:', { dateString, today: today.toISOString(), examDay: examDay.toISOString(), diffTime, diffDays });

    if (diffDays > 1) return `${diffDays} days left`;
    else if (diffDays === 1) return 'Tomorrow!';
    else if (diffDays === 0) return 'Today!';
    else return 'Already passed';
  };

  // const updateItemProgress = async ()=> {
  //   const body: UpdateProgressRequest = {
  //     user_id: user?.id || "",
  //     completed: true
  //   }
  //   const res = await updateProgress(body, user_id);
    
  // }
  const postSylItem = async () => {
    console.log('Starting to post syllabus item:', { syllabusItem, userId: user?.id, examId: exam_id });
    
    const body: AddSyllabusRequest = {
      description: syllabusItem,
      parent_item_id: null,
      user_id: user?.id || "",
    };
    
    try {
      const res = await addSyllabusItem(body, exam_id);
      console.log('Syllabus item post response:', res);
      
      if (res && res.item_id) {
        console.log('Successfully added syllabus item with ID:', res.item_id);
        getSylItem();
      } else {
        console.log('Failed to add syllabus item, response:', res);
      }
    } catch (error) {
      console.error('Error posting syllabus item:', error);
    }
    
    setSyllabusItem("");
  };

  const getSylItem = async () => {
    console.log('Fetching syllabus items for exam ID:', exam_id);
    
    try {
      const res = await getSyllabusItems(exam_id);
     ;
      
      if (res && res.length > 0) {
        console.log(`Found ${res.length} syllabus items, reversing order for display`);
        setSyllabus(res.reverse());
        
        const prevState = await getItem('checklistState');
        console.log('Previous checklist state from storage:', prevState);
        
        if (!prevState) {
          console.log('No previous checklist state found, creating new one');
          const checklistState = syllabusToDescriptionMap(res, false);
          // console.log('New checklist state:', checklistState);
          await setItem('checklistState', checklistState);
        }
        
        const currentState = await getItem('checklistState');
        // console.log('Current checklist state:', currentState);
      } else {
        console.log('No syllabus items found or empty response');
      }
    } catch (error) {
      console.error('Error fetching syllabus items:', error);
    }
  };

  const RenderSyllabusItem = ({ item }: { item: SyllabusItem }) => {
  const [checked, setChecked] = useState(false);
  const [totalStudents, setTotalStudents] = useState(
    item.stats?.total_students || item.total_students || 10
  );
  const [whoStudied, setWhoStudied] = useState(
    item.stats?.who_studied || item.who_studied || 0
  );
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const fetchItemStats = async () => {
      try {
        const statsData = await getSyllabusItemStats(item.item_id);
        if (statsData && statsData.stats) {
          setTotalStudents(statsData.stats.total_students || 10);
          setWhoStudied(statsData.stats.who_studied || 0);
        }
      } catch (error) {
        console.error('Error fetching item stats:', error);
      }
    };

    fetchItemStats();
  }, [item.item_id]);

  useEffect(() => {
    const fetchChecklistState = async () => {
      const checklistState = await getItem('checklistState');
      if (!checklistState) {
        console.log("Checklist state not in local storage, default values false");
        return;
      }
      const isMarkedAsDone = checklistState[item.description] ?? false;
      setChecked(isMarkedAsDone);
    };

    fetchChecklistState();
  }, []);

  const toggleCheckbox = useCallback(async () => {
    if (!user?.id) {
      console.error('User ID is missing, cannot update progress');
      return;
    }
    
    const newValue = !checked;
    setChecked(newValue);
    
    console.log(`Toggling checkbox for item ${item.item_id}: ${checked} -> ${newValue}`);
    
    try {
      // First, update the local storage to reflect the UI change
      await updateItem('checklistState', item.description, newValue);
      
      // Then update the server
      console.log(`Sending update to server: item=${item.item_id}, user=${user.id}, done=${newValue}`);
      const response = await updateSyllabusItemStat(item.item_id, user.id, newValue);
      
      console.log('Server response:', JSON.stringify(response));
      
      // Update the chart data based on the response
      if (response && response.stats) {
        console.log(`Updating stats from response: total=${response.stats.total_students}, studied=${response.stats.who_studied}`);
        console.log(`Completers: ${JSON.stringify(response.stats.completers)}`);
        
        // Always use the server's values to ensure consistency
        setTotalStudents(response.stats.total_students);
        setWhoStudied(response.stats.who_studied);
      } else {
        console.log('No stats in response, fetching latest stats');
        // If no stats in response, fetch the latest stats
        try {
          const statsData = await getSyllabusItemStats(item.item_id);
          console.log('Stats data:', JSON.stringify(statsData));
          
          if (statsData && statsData.stats) {
            console.log(`Fetched stats: total=${statsData.stats.total_students}, studied=${statsData.stats.who_studied}`);
            console.log(`Completers: ${JSON.stringify(statsData.stats.completers)}`);
            
            setTotalStudents(statsData.stats.total_students);
            setWhoStudied(statsData.stats.who_studied);
          } else {
            console.log('No stats data returned from getSyllabusItemStats');
          }
        } catch (statsError) {
          console.error('Error fetching updated stats:', statsError);
        }
      }
    } catch (error) {
      console.error('Updating toggle error:', error);
      // Revert the checkbox state
      setChecked(!newValue);
      // Also revert the local storage
      await updateItem('checklistState', item.description, !newValue);
    }
  }, [item.item_id, item.description, checked, user]);

  // Ensure we always have some data to show a complete circle
  const studiedCount = whoStudied || 0;
  // Make sure we have at least some value for both segments to ensure a full circle
  const notStudiedCount = Math.max(1, totalStudents - studiedCount);
  
  // If studiedCount is 0, we need to ensure the chart still shows a full circle
  const chartData = studiedCount === 0 ? [
    {
      name: 'Not Studied',
      population: 1,
      color: '#F44336',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    }
  ] : [
    {
      name: 'Studied',
      population: studiedCount,
      color: '#4CAF50',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    },
    {
      name: 'Not Studied',
      population: notStudiedCount,
      color: '#F44336',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    }
  ];

  return (
    <View className="flex-row justify-between items-center my-3 border-b border-gray-100 pb-3">
      <Pressable
        onPress={toggleCheckbox}
        className="flex-row items-center flex-1"
      >
        <View
          className={`w-6 h-6 rounded-full border-2 ${
            checked ? 'bg-green-500 border-green-500' : 'border-gray-400'
          } mr-3`}
        />
        <Text className="text-lg text-gray-800 flex-1" numberOfLines={2}>{item.description}</Text>
      </Pressable>
      
      <View style={{ width: 80, height: 100, marginLeft: 5, alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress
          size={70}
          strokeWidth={10}
          progress={totalStudents > 0 ? whoStudied / totalStudents : 0}
          progressColor="#FF8C00" // Bright Orange
          bgColor="#F0F0F0" // Light Gray/Off-White
          textColor="#666"
          studiedCount={whoStudied}
          totalCount={totalStudents}
        />
        <Text className="text-xs text-center text-gray-500 mt-1">
          studied
        </Text>
      </View>
    </View>
  );
};

  const pickPdf = async () => {
    console.log('Starting PDF picker');
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });
      
      console.log('Document picker result:', result);

      if (result.canceled || !result.assets?.length) {
        console.log('PDF picking canceled or no assets returned');
        return;
      }

      const file = result.assets[0];
      console.log('Selected file:', { name: file.name, uri: file.uri, size: file.size, mimeType: file.mimeType });

      const pdfFile = {
        uri: file.uri,
        name: file.name,
        mimeType: file.mimeType,
      };

      console.log('Setting PDF file in state:', pdfFile);
      setPdfFile(pdfFile); 
    } catch (error) {
      console.error('Error picking PDF:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to pick PDF',
        position: 'bottom'
      });
    }
};

const uploadPdf = async () => {
  console.log('Starting PDF upload process');
  
  if (!pdfFile) {
    console.log('No PDF file selected, showing toast message');
    Toast.show({
      type: 'info',
      text1: 'No file selected',
      text2: 'Please select a PDF first.',
      position: 'bottom'
    });
    return;
  }

  console.log('PDF file to upload:', pdfFile);
  console.log('Uploading PDF for exam ID:', exam_id);

  try {
    console.log('Sending PDF to server...');
    const response = await sendPdf(pdfFile, exam_id);
    console.log('Upload response:', response);
    
    if(response.message === "PYQ added successfully"){
      console.log('PDF uploaded successfully, clearing pdfFile state');
      setPdfFile(null);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'PDF uploaded successfully!',
      });
      getPdfFile()
    } else {
      console.log('Upload completed but with unexpected response:', response);
    }
  } catch (err: any) {
    console.error('Error uploading PDF:', err);
    console.error('Error details:', { message: err?.message, stack: err?.stack });
    
    Toast.show({
      type: 'error',
      text1: 'Upload Error',
      text2: err?.message || 'Something went wrong',
      position: 'bottom'
    });
  }
};
const getPdfFile = async () => {
  console.log('Fetching PDF file for exam ID:', exam_id);
  
  try {
    const res = await getPdf(exam_id);
    console.log('getPdfFile response:', res);
    
    if(res && res.pyq_pdf){
      console.log('PDF found, setting in state:', res.pyq_pdf.substring(0, 50) + '...');
      setResPdf(res.pyq_pdf);
    } else {
      console.log('No PDF found in response or invalid response format');
    }
  } catch (error) {
    console.error('Error fetching PDF file:', error);
  }
}

const handleViewPdf = () => {
  console.log('handleViewPdf called, attempting to open PDF');
  
  if (!resPdf) {
    console.log('No PDF available to view');
    Toast.show({
      type: 'info',
      text1: 'No PDF Available',
      text2: 'There is no PDF file to view.',
      position: 'bottom'
    });
    return;
  }
  
  try {
    console.log('Opening PDF with URL:', resPdf.substring(0, 50) + '...');
    Linking.openURL(resPdf);
  } catch (error) {
    console.error('Error opening PDF:', error);
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'Failed to open PDF',
      position: 'bottom'
    });
  }
}

  return (
    <View className="flex-1 bg-gray-100 p-4 mt-10">
      <StatusBar style="dark" backgroundColor="#f3f3f1" />
      <View className="bg-[#F8F8FF] rounded-2xl p-6 shadow-md flex-1">
        <Text className="text-2xl font-bold text-gray-800 mb-6 text-center border-b border-gray-300 pb-2">
          Exam Details
        </Text>

        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }} // Add padding at bottom for the input box
        >
          <View className="flex-row justify-between mb-5">
            <View className="bg-teal-400 rounded-lg p-5 flex-1 m-1 items-center justify-center">
              <Text className="text-2xl font-bold text-white">
                {exam_course_code?.toUpperCase()}
              </Text>
              <Text className="text-white">Course Code</Text>
            </View>

            <View className="bg-teal-500 rounded-lg p-5 flex-1 m-1 items-center justify-center">
              <Text className="text-xl font-bold text-white">
                {exam_type?.toUpperCase()}
              </Text>
              <Text className="text-white">Event</Text>
            </View>
          </View>

          <Pressable
            onPress={() => {
              setIsModalVisible(true)
              getPdfFile()
            }
              
            }
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
            <View className="mb-4 w-full">
              {syllabus.map((item) => (
                <RenderSyllabusItem key={item.item_id} item={item} />
              ))}
            </View>
          ) : (
            <Text className="text-gray-500 italic">You haven't added any TO DO item yet.</Text>
          )}
        </ScrollView>

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