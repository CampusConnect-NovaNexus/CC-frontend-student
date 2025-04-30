import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text, ImageBackground, Image } from 'react-native';
// import { useColorScheme } from '@/hooks/useColorScheme';
import { icons } from '@/constants/icons';

const TabIcon=({focused,icon, title}:any )=>{ 
  if(focused){  
      return(
          <View className='size-full justify-center items-center mt-4 p-6 rounded-full bg-[#3f3f3f]' >
             <Image
              source={icon} tintColor="white" className="size-5"
          />
          </View>
      )
  }
  return(
      <View className='size-full justify-center items-center mt-4 rounded-full ' >
          <Image
              source={icon} tintColor="gray" className="size-6"
          />
      </View>
  ) 
  
}


export default function TabLayout() {
  // const colorScheme = useColorScheme();

  return (
    <Tabs
    screenOptions={{
      
      tabBarShowLabel: false,
      tabBarItemStyle:{
          width: '100%',
          height: '100%',
          justifyContent: 'space-around',
          alignItems: 'center',
      },
      tabBarStyle:{
          backgroundColor: '#f3f3f1',
          padding: 15,
          height: 60,
          position:'absolute',
          overflow:'hidden',
          elevation : 5
      }
  }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ focused }) => <>
          <TabIcon focused={focused} icon={icons.home} title="home" />
     </>
        }}
      />
      <Tabs.Screen
        name="ExamHubScreen"
        options={{
          headerShown: false,
          title: 'ExamHub',
          tabBarIcon: ({ focused }) => <>
          <TabIcon focused={focused} icon={icons.exam} title="ExamHub" />
     </>
        }}
      />
      <Tabs.Screen
        name="GrievanceScreen"
        options={{
          headerShown: false,
          title: 'Grievance',
          tabBarIcon: ({ focused }) => <>
          <TabIcon focused={focused} icon={icons.grievance} title="Grievance" />
     </>
        }}
      />
      <Tabs.Screen
        name="SocialScreen"
        options={{
          headerShown: false,
          title: 'Library',
          tabBarIcon: ({ focused }) => <>
          <TabIcon focused={focused} icon={icons.library} title="Library" />
     </>
        }}
      />
      <Tabs.Screen
        name="LostFoundScreen"
        options={{
          headerShown: false,
          title: 'Lost / Found',
          tabBarIcon: ({ focused }) => <>
          <TabIcon focused={focused} icon={icons.lostfound} title="Lost / Found" />
     </>
        }}
      />
    </Tabs>
  );
}
