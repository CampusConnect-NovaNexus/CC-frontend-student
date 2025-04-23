import { Tabs } from 'expo-router';
import React from 'react';
import { View,Text,ImageBackground,Image } from 'react-native';
// import { useColorScheme } from '@/hooks/useColorScheme';

import { icons } from '@/constants/icons';

const TabIcon=({focused,icon, title}:any )=>{ 
  if(focused){  
      return(
          <View className='size-full justify-center items-center mt-4 rounded-md bg-[#A8B5DB] ' >
             <Image
              source={icon} tintColor="blue" className="size-5"
          />
          </View>
      )
  }
  return(
      <View className='size-full justify-center items-center mt-4 rounded-full ' >
          <Image
              source={icon} tintColor="#A8B5DB" className="size-5"
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
          backgroundColor: '#000000',
          padding: 15,
          height: 60,
          position:'absolute',
          overflow:'hidden',
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
        name="LibraryScreen"
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
