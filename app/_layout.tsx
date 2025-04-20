// app/(tabs)/_layout.js
import './globals.css';
import { Stack } from "expo-router";
import React from "react";
import {  Image, Pressable, Text, View } from "react-native";
import { useRouter } from 'expo-router';
import {icons} from '@/constants/icons';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from '@/context/ThemeContext';


export default function TabLayout() {
  const router = useRouter();

  return (
    <SafeAreaProvider>
      <ThemeProvider>
      <Stack
        screenOptions={{
          animation: 'slide_from_right', // 👈 This enables the animation!
        }}
      >
        <Stack.Screen
          name="(tabs)" 
          options={{
            animation:'slide_from_bottom',
            headerTitle: () => (
              <View className='flex-1 flex-row justify-between items-center ' >
                <Text className='flex flex-1 text-xl '>Campus Connect</Text>
                <View className=' flex-row gap-2 justify-around items-center ' >
                  <Pressable className=' p-2 ' onPress={() => router.push("/Notification")} >
                    <Image
                      source={icons.notify}
                      className='size-7'
                    />
                  </Pressable>
                  
                  <Pressable className=' p-2 ' onPress={() => router.push("/Profile")}  >
                    <Image
                      source={icons.profile}
                      className='size-7'
                    />
                  </Pressable>
                </View>
              </View>
              
            ),
          }}
        />
        <Stack.Screen
          name="Notification"
          options={{
            headerShown: false,
            animation:'slide_from_bottom'
          }}
        />
        <Stack.Screen
          name="Profile"
          options={{
            headerShown: false,
            animation: 'slide_from_bottom',
          }}
        />
    </Stack>
    </ThemeProvider>
  </SafeAreaProvider>
  );
}
