// app/_layout.tsx
import './globals.css';
import { Stack } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useRouter } from 'expo-router';
import { icons } from '@/constants/icons';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from '@/context/ThemeContext';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { setBackgroundColorAsync } from 'expo-system-ui';
import { useEffect } from 'react';


export default function TabLayout() {
  const router = useRouter();
  const [loaded, error] = useFonts({
    'Awesome': require('../assets/fonts/awesome.regular.ttf'),
    'samarkan': require('../assets/fonts/Samarkan.ttf'),
    'transcity': require('../assets/fonts/transcity.regular.otf'),
    'wastedVindey': require('../assets/fonts/wasted-vindey.regular.ttf'),
  });

  useEffect(() => {
    setBackgroundColorAsync('#fdfcf9'); // Change to your desired color
  }, []);

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

        {/* <NotificationProvider> */}
          <ThemeProvider>
            <Stack
              screenOptions={{
                animation: 'slide_from_right', // 👈 This enables the animation!
              }}
            >
              <Stack.Screen
                name="(tabs)"
                options={{
                  animation: 'slide_from_bottom',

                  headerShadowVisible: false,
                  headerTitle: () => (
                    <View className='flex-1 flex-row justify-between items-center pt-3 mb-0 bg-[#fdfcf9]' >
                      <Text style={{ fontFamily: 'Awesome', fontSize: 30 }} className='flex flex-1'>Campus Connect</Text>
                      <View className='flex-row gap-2 justify-around items-center ' >
                        <Pressable className='p-2 pb-6' onPress={() => router.push("/Notification")} >
                          <Image
                            source={icons.notify}
                            className='size-7'
                          />
                        </Pressable>

                        <Pressable className='p-2 pb-6 ' onPress={() => router.push("/Profile")}  >
                          <Image
                            source={icons.profile}
                            className='size-8 rounded-md'
                          />
                        </Pressable>
                      </View>
                    </View>

                  ),
                }}
              />
              <Stack.Screen
                name="Profile"
                options={{
                  headerShown: false,
                  animation: 'slide_from_bottom',
                }}
              />
              <Stack.Screen
                name="Found"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Lost"
                options={{
                  headerShown: false,
                }}
              />
            </Stack>
          </ThemeProvider>
        {/* </NotificationProvider> */}
      </SafeAreaProvider>
  );
}
