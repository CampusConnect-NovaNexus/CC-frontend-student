import { View, Text, ScrollView, TouchableOpacity, ImageBackground, Animated, Linking, ActivityIndicator } from 'react-native';
import { images } from "@/constants/images";
import { useRef, useState, useEffect } from 'react';
import { getStudentExams } from '@/service/lms/getStudentExams';

interface UpdatesCardProps {
  title: string;
  link: string;
}
interface ScheduleCardProps {
  title: string;
  date: string;
  course_code: string;
}

interface Exam {
  course_code: string;
  course_name: string;
  created_by: string;
  exam_date: string;
  exam_id: string;
  exam_type: string;
}

export default function HomeScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch upcoming exams when component mounts
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const studentId = 'user123'; 
        const examData = await getStudentExams(studentId);
        if (examData) {
          setExams(examData);
        }
      } catch (error) {
        console.error('Error fetching exams:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExams();
  }, []);

  const UpdatesCard = ({ title, link }: UpdatesCardProps) => (
    <View style={{ 
      backgroundColor: 'white', 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: 24, 
      borderRadius: 16, 
      marginBottom: 16, 
      shadowColor: '#d1d5db', 
      shadowOffset: { width: 0, height: 4 }, 
      shadowOpacity: 0.2, 
      shadowRadius: 4, 
      elevation: 4 
    }}>
      <View style={{ flex: 1, paddingRight: 16 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: '#1f2937' }} numberOfLines={2}>{title}</Text>
      </View>
      <TouchableOpacity
        style={{ 
          backgroundColor: '#d97706', 
          paddingVertical: 12, 
          paddingHorizontal: 16, 
          borderRadius: 8 
        }}
        activeOpacity={0.8}
        onPress={() => Linking.openURL(link)}
      >
        <Text style={{ color: 'white', fontWeight: '600', fontSize: 14 }}>Know More</Text>
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

  const ScheduleCard = ({ title, date, course_code }: ScheduleCardProps) => {
    return (
      <View style={{ 
        backgroundColor: 'white', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: 20, 
        borderRadius: 12, 
        marginBottom: 16, 
        shadowColor: '#d1d5db', 
        shadowOffset: { width: 0, height: 4 }, 
        shadowOpacity: 0.2, 
        shadowRadius: 4, 
        elevation: 4 
      }}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={{ fontSize: 10, fontWeight: '500', color: '#9ca3af', marginBottom: 4 }}>Upcoming Exam</Text>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#1f2937', marginTop: 4 }} numberOfLines={2}>
            {title}
          </Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 10, fontWeight: '500', color: '#6b7280', marginRight: 8, marginBottom: 4 }}>Scheduled On</Text>
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#0d9488', marginTop: 4, marginRight: 24 }}>
            {formatDate(date)}
          </Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 10, fontWeight: '500', color: '#6b7280', marginBottom: 4 }}>Course Code</Text>
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#f87171', marginTop: 4 }}>
            {course_code.toUpperCase()}
          </Text>
        </View>
      </View>
    );
  };

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
    <View style={{ flex: 1, backgroundColor: '#f9fcf9' }}>
      {/* Animated Header Image */}
      <Animated.View
        style={{
          height: '33%',
          position: 'absolute',
          width: '100%',
          zIndex: 10,
          opacity: headerOpacity,
          transform: [{ translateY: imageTranslateY }],
        }}
      >
        <ImageBackground
          source={images.main_bg}
          style={{ width: '100%', height: '100%' }}
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
        style={{ flex: 1, paddingTop: 16, marginBottom: 60 }}
        contentContainerStyle={{ paddingTop: 220 }}
      >

        {/* Handle */}
        <View style={{ 
          width: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: '#fdfcf9', 
          paddingTop: 32, 
          borderTopLeftRadius: 9999, 
          borderTopRightRadius: 9999, 
          zIndex: 20 
        }}>
          <View style={{ 
            width: '33%', 
            height: 8, 
            backgroundColor: '#9ca3af', 
            borderRadius: 9999 
          }} />
        </View>

        {/* Content */}
        <View style={{ padding: 24, backgroundColor: '#fdfcf9' }}>
          <Text style={{ fontSize: 20, color: '#374151', marginBottom: 4, fontWeight: '700' }}>Latest Updates</Text>
          <Text style={{ fontSize: 14, color: '#9ca3af', paddingLeft: 4, marginBottom: 16, fontWeight: '700' }}>Be the one who knows everything !!!</Text>
          <View style={{ marginBottom: 16, height: 'auto' }}>
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
          </View>

          <Text style={{ fontSize: 20, fontWeight: '700', color: '#374151', marginTop: 8, marginBottom: 4 }}>Your Schedule</Text>
          <Text style={{ fontSize: 14, color: '#9ca3af', marginBottom: 16, fontWeight: '700', paddingLeft: 4 }}>You need to face this !!!</Text>

          {loading ? (
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 32 }}>
              <ActivityIndicator size="large" color="#0891b2" />
              <Text style={{ color: '#6b7280', marginTop: 8 }}>Loading your exams...</Text>
            </View>
          ) : exams.length > 0 ? (
            exams.map((exam) => (
              <ScheduleCard 
                key={exam.exam_id}
                title={exam.exam_type} 
                date={exam.exam_date} 
                course_code={exam.course_code} 
              />
            ))
          ) : (
            <View style={{ 
              backgroundColor: 'white', 
              padding: 24, 
              borderRadius: 12, 
              marginBottom: 16, 
              shadowColor: '#d1d5db', 
              shadowOffset: { width: 0, height: 4 }, 
              shadowOpacity: 0.2, 
              shadowRadius: 4, 
              elevation: 4,
              alignItems: 'center' 
            }}>
              <Text style={{ color: '#6b7280' }}>No upcoming exams found</Text>
            </View>
          )}

        </View>
      </Animated.ScrollView>
    </View>
  );
}