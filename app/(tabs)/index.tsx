import { Image, StyleSheet, Platform, View, Text ,Button } from 'react-native';
import {images} from '@/constants/images';
import ImagePickerComponent from '@/app/ImagePickerComponent';

import { useRouter } from "expo-router";

const router = useRouter();


export default function HomeScreen() {
  return (
    <View className='flex justify-center items-center' >
      <Text className='text-xl'>Hello World</Text>
      <Image 
        source={images.nit_logo}
        className='w-20 h-20'
        resizeMode="contain"
      />
      <ImagePickerComponent/>
      <Button title="View Gallery" onPress={() => router.push("/gallery")} />
      
    </View>
  );
}
