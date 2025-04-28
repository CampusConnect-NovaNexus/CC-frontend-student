// import { View, Text, TextInput, Pressable, Image, FlatList } from 'react-native';
// import React,{useEffect, useState} from 'react';
// import { useLocalSearchParams } from 'expo-router';
// import { icons } from '@/constants/icons';




//   interface SyllabusItem {
//     item_id: string;
//     exam_id: string;
//     parent_item_id: string | null;
//     description: string;
//     created_by: string;
//   }

// const ExamDetail = () => {
//   const { exam_id, exam_type, exam_date, exam_course_code } = useLocalSearchParams<{
//     exam_id: string;
//     exam_type: string;
//     exam_date: string;
//     exam_course_code: string;
//   }>();
//   const [syllabusItem, setSyllabusItem]=useState("")
//   const[syllabus,setSyllabus]=useState<SyllabusItem[]| null>()
//   // Function to calculate remaining days
//   const getRemainingDays = (dateString: string) => {
//     const today = new Date();
//     const examDay = new Date(dateString);
//     const diffTime = examDay.getTime() - today.getTime();
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//     if (diffDays > 1) return `${diffDays} days left`;
//     else if (diffDays === 1) return 'Tomorrow!';
//     else if (diffDays === 0) return 'Today!';
//     else return 'Already passed';
//   };
//   const postSylItem=async()=>{
//     const body : AddSyllabusRequest={
//         description: syllabusItem,
//         parent_item_id:null,
//         user_id:'user123'
//     }
//     const res=await addSyllabusItem(body,exam_id)
//     if(res && res.item_id){
//         getSylItem()
//     }
//     console.log('response from adding syllabus item : ', res);
    
//   }
//   const getSylItem=async()=>{
//     const res=await getSyllabusItems(exam_id);
//     if(res && res.length>0){
//     setSyllabus(res.reverse());
//     }
//   }
//   const renderSyllabusItem=(item:SyllabusItem)=>{
//     console.log('item : ',item)
//     return (
//         <Pressable className='flex-row items-center my-2 ' >
//           <View
//             style={{
//               width: 24,
//               height: 24,
//               borderRadius: 12,
//               borderWidth: 2,
              
              
//               marginRight: 12,
//             }}
//           />
//           <Text className="text-xl">{item.item.description}</Text>
//         </Pressable>
//       );
//   }
//   useEffect(()=>{
//     getSylItem()
//   },[])
  
//   return (
//     <View className="flex-1 bg-gray-100 p-6">
//       <View className="bg-white rounded-xl h-full p-6 flex-col items-center shadow-md">
//         <Text className="text-2xl font-bold text-gray-800 mb-4 text-center border-b border-gray-300 ">Exam Details</Text>
//         <View className='self-start' >
//             <View className="mb-4">
//             <Text className="text-lg text-gray-600">Course Code:</Text>
//             <Text className="text-xl font-semibold text-gray-900">{exam_course_code.toUpperCase()}</Text>
//             </View>

//             <View className="mb-4">
//             <Text className="text-lg text-gray-600">Exam Type:</Text>
//             <Text className="text-xl font-semibold text-gray-900">{exam_type}</Text>
//             </View>

//             <View className="mb-4">
//             <Text className="text-lg text-gray-600">Exam Date:</Text>
//             <Text className="text-xl font-semibold text-gray-900">
//                 {new Date(exam_date).toDateString()}
//             </Text>
//             </View>

//             <View className="mb-4">
//             <Text className="text-lg text-gray-600">Time Remaining:</Text>
//             <Text className="text-xl font-semibold text-purple-600">
//                 {getRemainingDays(exam_date)}
//             </Text>
//             </View>
//             <Text className="text-2xl text-gray-700 mt-5  " ></Text>
//             {syllabus && syllabus.length >0 ?
//             (
//             <FlatList
//                 data={syllabus}
//                 keyExtractor={(item)=>item.item_id}
//                 renderItem={renderSyllabusItem}
//             />)
//             :
//             (<Text>You haven't add any syllabus yet </Text>)}

//         </View>
//         <View className="absolute border rounded-xl flex-row justify-between items-center bottom-8 w-full px-2 border-t border-gray-300 ">
//             <TextInput
//                 value={syllabusItem}
//                 onChangeText={setSyllabusItem}
//                 placeholder='Add a new study item . .'
//                 className=''
//             />
//             <Pressable
//                 onPress={()=>{
//                     setSyllabusItem("")
//                     postSylItem()
//                 }}
//             >
//                 <Image
//                     source={icons.send}
//                     className='size-5 px-2'
//                 />
//             </Pressable>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default ExamDetail;
import { View, Text, FlatList, TextInput, Pressable, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { icons } from '@/constants/icons';
import { addSyllabusItem } from '@/service/lms/addSyllabusItem';
import { getSyllabusItems } from '@/service/lms/getSyllabusItem';
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
    <View className="flex-1 bg-gray-100 p-4">
      <View className="bg-white rounded-2xl p-6 shadow-md flex-1">
        <Text className="text-2xl font-bold text-gray-800 mb-6 text-center border-b pb-2">Exam Details</Text>

        <View className="self-start w-full">
          <View className="mb-4">
            <Text className="text-base text-gray-600">Course Code:</Text>
            <Text className="text-xl font-semibold text-gray-900">{exam_course_code?.toUpperCase()}</Text>
          </View>

          <View className="mb-4">
            <Text className="text-base text-gray-600">Exam Type:</Text>
            <Text className="text-xl font-semibold text-gray-900">{exam_type}</Text>
          </View>

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
            <Text className="text-gray-500 italic">You haven't added any syllabus yet.</Text>
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
            className="pl-3"
          >
            <Image
              source={icons.send}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </Pressable>
        </View>

      </View>
    </View>
  );
};

export default ExamDetail;
