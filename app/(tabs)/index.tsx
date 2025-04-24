import { View, Text, ScrollView, TouchableOpacity, ImageBackground, Animated, Linking } from 'react-native';
import { useRouter } from "expo-router";
import { images } from "@/constants/images";
import { useRef } from 'react';

interface UpdatesCardProps {
  title: string;
  link: string;
}
interface ScheduleCardProps {
  title: string;
  date: string;
  course_code: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;

  const UpdatesCard = ({ title, link }: UpdatesCardProps) => (
    <View className="bg-white flex flex-row justify-between items-center p-6 rounded-2xl mb-4 shadow-lg shadow-gray-200">
      <View className="flex-1 pr-4">
        <Text className="text-md font-semibold text-gray-800" numberOfLines={2}>{title}</Text>
      </View>
      <TouchableOpacity
        className="bg-amber-600 py-3 px-4 rounded-lg active:bg-amber-700"
        activeOpacity={0.8}
        onPress={() => Linking.openURL(link)}
      >
        <Text className="text-white font-semibold text-sm">Know More</Text>
      </TouchableOpacity>
    </View>
  );

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
  };

  const ScheduleCard = ({ title, date, course_code }: ScheduleCardProps) => (
    <View className="bg-white flex flex-row justify-between items-center p-6 rounded-xl mb-4 shadow-lg shadow-gray-200">
      <View className="flex-1 pr-3">
        <Text className="text-xs font-medium text-gray-400 mb-1">Upcoming Exam</Text>
        <Text className="text-md font-semibold text-gray-800 mt-1" numberOfLines={2}>
          {title}
        </Text>
      </View>
      <View className="items-center">
        <Text className="text-xs font-medium text-gray-500 mr-2 mb-1">Scheduled On</Text>
        <Text className="text-md font-bold text-teal-600 mt-1 mr-6">
          {formatDate(date)}
        </Text>
      </View>
      <View className="items-center ">
        <Text className="text-xs font-medium text-gray-500 mb-1">Course Code</Text>
        <Text className="text-md font-bold text-rose-400 mt-1">
          {course_code}
        </Text>
      </View>
    </View>
  );

  // Animated header style
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  return (
    <View className="flex-1 bg-amber-50">
      {/* Animated Header Image */}
      <Animated.View
        className="h-1/3 absolute w-full z-10"
        style={{
          opacity: headerOpacity,
          transform: [{ translateY: imageTranslateY }],
        }}
      >
        <ImageBackground
          source={images.main_bg}
          className="w-full h-full"
          resizeMode="cover"
        />
      </Animated.View>

      {/* Scroll Content */}
      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        className="flex-1 pt-4 mb-[60px]"
        contentContainerStyle={{ paddingTop: 220 }}
      >

        {/* Handle */}
        <View className='w-full flex items-center bg-[#fdfcf9] pt-8 rounded-t-full z-20'>
          <View className='w-1/3 h-2 bg-gray-400 rounded-full' />
        </View>

        {/* Content */}
        <View className="p-6 bg-[#fdfcf9]">
          <Text className="text-xl text-gray-700 mb-1 font-bold">Latest Updates</Text>
          <Text className="text-sm text-gray-400 pl-1 mb-4 font-bold">Be the one who knows everything !!!</Text>
          <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            className="mb-4 h-60"
          >
            <UpdatesCard
              title="Notification on Spring 25 Mid Term Feedback"
              link="https://www.nitm.ac.in/uploads/91d1b01f76b8744a3a39af32b027dd89.pdf"
            />
            <UpdatesCard
              title="Notification on Spring 25 Mid Term Feedback"
              link="https://www.nitm.ac.in/uploads/91d1b01f76b8744a3a39af32b027dd89.pdf"
            />
            <UpdatesCard
              title="Notification on Spring 25 Mid Term Feedback"
              link="https://www.nitm.ac.in/uploads/91d1b01f76b8744a3a39af32b027dd89.pdf"
            />
          </ScrollView>


          <Text className="text-xl font-bold text-gray-700 mt-2 mb-1">Your Schedule</Text>
          <Text className="text-sm text-gray-400 mb-4 font-bold pl-1">You need to face this !!!</Text>

          <ScheduleCard title="MID TERM" date="2025-03-21" course_code="CS220" />
          <ScheduleCard title="CLASS TEST II" date="2025-05-07" course_code="CS220" />
          <ScheduleCard title="END TERM" date="2025-05-22" course_code="CS220" />

        </View>
      </Animated.ScrollView>
    </View>
  );
}