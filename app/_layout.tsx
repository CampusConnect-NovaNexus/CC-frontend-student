// app/(tabs)/_layout.js
import './globals.css';
import { Stack } from "expo-router";
import React from "react";
import {  Image, Pressable, Text, View } from "react-native";
import { useRouter } from 'expo-router';
import {icons} from '@/constants/icons';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from '@/context/ThemeContext';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

export default function TabLayout() {
  const router = useRouter();
  const [loaded, error] = useFonts({
    'Awesome': require('../assets/fonts/awesome.regular.ttf'),
    'samarkan': require('../assets/fonts/Samarkan.ttf')
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
          <StatusBar style="dark" backgroundColor="#fdfcf9" />
      
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

            headerShadowVisible: false,
            headerTitle: () => (
              <View className='flex-1 flex-row justify-between items-center pt-3 mb-0 bg-[#fdfcf9]' >
                <Text className={{fontFamily : 'Awesome', fontSize: 30}} className='flex flex-1'>Campus Connect</Text>
                <View className=' flex-row gap-2 justify-around items-center ' >
                  <Pressable className=' p-2 pb-6' onPress={() => router.push("/Notification")} >
                    <Image
                      source={icons.notify}
                      className='size-7'
                    />
                  </Pressable>
                  
                  <Pressable className=' p-2 pb-6 ' onPress={() => router.push("/Profile")}  >
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
