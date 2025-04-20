
import React from 'react';
import { View, Text, Pressable, ScrollView, Image , StyleSheet} from 'react-native';
import { useTheme } from '@/context/ThemeContext'; 
import {icons} from '@/constants/icons'; 
import { useRouter } from 'expo-router'; 




const HomeScreen = () => {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const bgColor = theme === 'light' ? 'bg-background-light' : 'bg-background-dark';
  const primaryColor = theme === 'light' ? 'text-primary-light' : 'text-primary-dark';
  const secondaryColor = theme === 'light' ? 'text-secondary-light' : 'text-secondary-dark';
  const textColor = theme === 'light' ? 'text-text-light' : 'text-text-dark';
  const buttonColor = theme === 'light' ? 'bg-accent-light' : 'bg-accent-dark';
  const borderColor = theme === 'light' ? 'border-border-light' : 'border-border-dark';
  const bgAccentColor = theme === 'light' ? 'bg-accent-light' : 'bg-accent-dark';
  const mutedTextColor = theme === 'light' ? 'text-mutedText-light' : 'text-mutedText-dark';
  return (
    <ScrollView className={`${bgColor} flex felx-col `} >
      <Pressable onPress={() => router.back()} className=''  style={styles.button} >
       <Image 
        source={icons.goBack}
        className='w-8 h-8 '
       />
      </Pressable>
        <View className={`flex flex-col mt-5 mx-2 p-2  `} >
          <View className='flex-row items-center gap-4 justify-start ' >
          <Text className={`${textColor} text-6xl `} >
                Hi 
            </Text>
            <Text className='text-4xl flex items-center justify-center text-center '>👋</Text>
            <Image />
          </View>
            
            <Text  className={`${textColor} text-6xl font-semibold`}  >Jishnu Duhan</Text>
        </View>
        <View className={`flex flex-col mt-5 mx-4 border ${bgAccentColor} ${borderColor} rounded-lg p-4 `} >
            <Text className={`text-2xl font-thin `}>Recent News</Text>
        </View>
        <View className={`flex flex-col mt-5 mx-4 border ${bgAccentColor} ${borderColor}  rounded-lg p-4 `} >
            <Text className={`text-2xl flex justify-center items-center ${primaryColor} `}>Upcoming Exams</Text>
        </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  button: {
    width:30, // 👈 set width here
    height: 30, // 👈 set height here
    top: 10,
    left: 11,
    borderRadius: 8,
    alignItems: 'center',
  },
});