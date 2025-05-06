import { View, Text, ScrollView, Pressable,RefreshControl, FlatList } from 'react-native'
import React,{useState} from 'react'
import Toast from 'react-native-toast-message';
import { getGrievanceOfUser } from '@/service/grievance/getGrievanceByUserId'
import { useLocalSearchParams } from 'expo-router';
const postsOfUser = () => {
    const [selectedCateory,setSelectedCategory]=useState<string>('')
    const [refreshing, setRefreshing] = useState(false);
    const [data,setData]=useState([])
    const [dataType,setDataType]=useState<string>('')
    const { user_id } = useLocalSearchParams<{ user_id:string }>();
    const onRefresh = () => {
        setRefreshing(true);
            fetchData();
        setTimeout( () => {
          
          setRefreshing(false);
        }, 2000);
      };
      const renderPosts=({item}:any)=>{
        return(
            <View className='flex-row justify-between items-center'>
                <Text>{item.title}</Text>
                <Text>{item.description}</Text>
            </View>
        )
      }
      const fetchData=async()=>{
        console.log('in fetch data');
        
        if(!selectedCateory){
            Toast.show({
                type: 'error',
                text1: 'Please select a category',
                position: 'top',
              });
              return;
        }
        if(selectedCateory==='LF'){
          
        }
        if(selectedCateory==='GR'){
          const data=await getGrievanceOfUser(user_id)
          if(data?.complaint?.length===0){
            Toast.show({
                type: 'error',
                text1: 'Cannot fetch Your Grievances',
                position: 'top',
              });
              return;
          }
          setData(data.complaint)
          setDataType('GR')
        }
      }
  return (
   <ScrollView
   refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }
   >
    <View>
        <Text>Your Posts</Text>
    </View>
    <View className='flex-row justify-around items-center' >
        <Pressable
        onPress={async()=>{
            await setSelectedCategory('LF')
            fetchData()
        }}
        >
            <Text className="text-xl text-gray-400" >Lost-Found</Text>
        </Pressable>
        <Pressable
        onPress={async()=>{
            await setSelectedCategory('GR')
            fetchData()
        }}
        >
            <Text className="text-xl text-gray-400" >Grievances</Text>
        </Pressable>
        <Pressable
            onPress={async()=>{
                await setSelectedCategory('IS')
                fetchData()
            }}
        >
            <Text className="text-xl text-gray-400" >IntraSocial</Text>
        </Pressable>
    </View>
    {selectedCateory===dataType &&
        <FlatList
        data={data}
        renderItem={renderPosts}
        />
    }
   </ScrollView>
  )
}

export default postsOfUser