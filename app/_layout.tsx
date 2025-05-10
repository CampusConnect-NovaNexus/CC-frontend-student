// app/_layout.tsx
import './globals.css';
import { router, Stack } from "expo-router";
import React, { useEffect } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useRouter } from 'expo-router';
import { icons } from '@/constants/icons';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { setBackgroundColorAsync } from 'expo-system-ui';
import { Slot, useSegments, usePathname } from 'expo-router';
import Toast from 'react-native-toast-message';
// This component handles authentication routing
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip this effect if auth is still loading
    if (isLoading) return;

    const inAuthGroup = pathname === '/login' || pathname === '/register';
    
    if (!user && !inAuthGroup) {
      // If user is not logged in and trying to access a protected route,
      // redirect to the login page
      router.replace('/login');
    } else if (user && inAuthGroup) {
      // If user is logged in and trying to access auth routes,
      // redirect to the main app
      router.replace('/(tabs)');
    }
  }, [user, segments, isLoading, pathname]);

  if (isLoading) {
    // Return a loading screen while checking auth status
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image 
          source={require('../assets/adaptive-icon.png')} 
          style={{ width: 120, height: 120 }} 
        />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
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
      <AuthProvider>
        <ThemeProvider>
          <AuthGuard>
            <Stack
              screenOptions={{
                animation: 'slide_from_right',
                headerShadowVisible: false,
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

                        <Pressable className='p-2 pb-6 ' onPress={() => router.push("/LeaderBoard")}  >
                          <Image
                            source={icons.leaderboard}
                            className='size-8 rounded-md'
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
                name="login"
                options={{
                  headerShown: false,
                  animation: 'slide_from_bottom',
                }}
              />
              <Stack.Screen
                name="register"
                options={{
                  headerShown: false,
                  animation: 'slide_from_bottom',
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
                name="postsOfUser"
                options={{
                  headerShown: false,
                  animation: 'slide_from_right',
                }}
              />
              <Stack.Screen
                name="DetailedCourse"
                options={{
                  headerShown: false,
                  animation: 'slide_from_right',
                }}
              />
              <Stack.Screen
                name="ExamDetail"
                options={{
                  headerShown: false,
                  animation: 'slide_from_right',
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
          </AuthGuard>
        </ThemeProvider>
      </AuthProvider>
      <Toast />
    </SafeAreaProvider>
  );
}
