import { Image, StyleSheet, Platform, View, Text ,Button } from 'react-native';
import {images} from '@/constants/images';
import ImagePickerComponent from '@/app/ImagePickerComponent';

import { useRouter } from "expo-router";



export default function HomeScreen() {

  const router = useRouter();

  return (
    <View className='flex-1 p-0 bg-white '>
      <Text style={{fontFamily: "Awesome"}} className='text-7xl p-10 text-black '>Hi 👋</Text>
      <Text style={{fontFamily: "Awesome"}} className='text-5xl text-black p-2'>Jishnu Duhan</Text>
      {/* <Image 
        source={images.nit_logo}
        className='w-20 h-20'
        resizeMode="contain"
      /> */}
      {/* <ImagePickerComponent/> */}
      <Button title="View Gallery" onPress={() => router.push("/gallery")} />
    </View>
  );
}