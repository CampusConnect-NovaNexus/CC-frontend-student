import { View, Text, ScrollView, Image,Pressable,StyleSheet } from 'react-native'
import React from 'react'
import {icons} from '@/constants/icons'; // Adjust the import path as necessary
import {useRouter} from 'expo-router'; 

const Notification = () => {
  const router = useRouter();
  return (
    <ScrollView>
      <Pressable onPress={() => router.back()} style={styles.button} >
             <Image 
              source={icons.goBack}
              className='w-8 h-8'
             />
      </Pressable>
      <Text>
        Notification
      </Text>
    </ScrollView>
  )
}

export default Notification

const styles = StyleSheet.create({
  button: {
    width:30, // 👈 set width here
    height: 30, // 👈 set height here
    top: 5,
    left: 11,
    borderRadius: 8,
    alignItems: 'center',
  },
});