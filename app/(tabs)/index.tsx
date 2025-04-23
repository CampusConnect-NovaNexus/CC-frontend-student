import { View, Text, ScrollView, TouchableOpacity, ImageBackground, Animated } from 'react-native';
import { useRouter } from "expo-router";
import { images } from "@/constants/images";
import { useRef } from 'react';

interface RecommendationCardProps {
  title: string;
  progress: number;
}

export default function HomeScreen() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;

  const RecommendationCard = ({ title, progress }: RecommendationCardProps) => (
    <View className="bg-white p-6 rounded-2xl mb-4 shadow-lg">
      <Text className="text-xl font-semibold text-gray-800 mb-2">{title}</Text>
      <View className="w-full bg-gray-100 rounded-full h-2">
        <View
          className="bg-blue-500 h-2 rounded-full"
          style={{ width: `${progress}%` }}
        />
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
        className="flex-1 pt-4 mb-[70px]"
        contentContainerStyle={{ paddingTop: 220 }}
      >

        {/* Handle */}
        <View className='w-full flex items-center bg-[#fdfcf9] pt-8 rounded-t-full z-20'>
          <View className='w-1/3 h-2 bg-gray-400 rounded-full' />
        </View>

        {/* Content */}
        <View className="p-6 bg-[#fdfcf9]">
          <Text className="text-2xl font-bold text-gray-800 mb-4 text-center">Recommendations</Text>
          <RecommendationCard title="Mathematics" progress={65} />
          <RecommendationCard title="Geography" progress={40} />

          <Text className="text-2xl font-bold text-gray-800 mt-8 mb-4">Your Schedule</Text>

          {[1, 2, 3, 4].map((item) => (
            <TouchableOpacity
              key={item}
              className="bg-white p-6 rounded-2xl shadow-lg mb-4"
              activeOpacity={0.9}
            >
              <Text className="text-lg text-gray-500 mb-1">Next Lesson</Text>
              <Text className="text-xl font-semibold text-gray-800">Biology - Chapter 3</Text>
              <Text className="text-lg text-blue-500 mt-2">Animal Kingdom</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
}