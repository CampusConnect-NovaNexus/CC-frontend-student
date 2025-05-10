import { View, Text, ScrollView, TouchableOpacity, ImageBackground, Animated, Linking, ActivityIndicator, RefreshControl, Easing } from 'react-native';
import { images } from "@/constants/images";
import { useRef, useState, useEffect } from 'react';
import { getStudentExams } from '@/service/lms/getStudentExams';
import { getStoredNoticeUpdates, fetchNewNoticeUpdates } from '@/service/lms/getNoticeUpdates';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from "@/context/AuthContext";
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

interface NoticeUpdate {
  update_id: string;
  title: string;
  link: string;
  sequence: number;
  created_at: string;
}

export default function HomeScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [exams, setExams] = useState<Exam[]>([]);
  const [noticeUpdates, setNoticeUpdates] = useState<NoticeUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [noticeLoading, setNoticeLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchExams(),
          fetchNotices()
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const examData = await getStudentExams(user?.id);
      console.log('user id in getStudentExams : ', user?.id);
      
      if (examData) {
        setExams(examData);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotices = async () => {
    try {
      setNoticeLoading(true);
      const noticeData = await getStoredNoticeUpdates();
      if (noticeData) {
        const sortedNotices = [...noticeData].sort((a, b) => a.sequence - b.sequence);
        setNoticeUpdates(sortedNotices);
      }
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setNoticeLoading(false);
    }
  };

  const startRotationAnimation = () => {
    rotateAnim.setValue(0);
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.linear
      })
    ).start();
  };

  const stopRotationAnimation = () => {
    rotateAnim.stopAnimation();
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      startRotationAnimation();

      await Promise.all([
        fetchExams(),
        refreshNotices()
      ]);
    } catch (error) {
      console.error('Error during refresh:', error);
    } finally {
      stopRotationAnimation();
      setRefreshing(false);
    }
  };

  const refreshNotices = async () => {
    try {
      const url = 'https://www.nitm.ac.in/';
      const newNotices = await fetchNewNoticeUpdates(url);
      if (newNotices) {
        const sortedNotices = [...newNotices].sort((a, b) => a.sequence - b.sequence);
        setNoticeUpdates(sortedNotices);
      }
    } catch (error) {
      console.error('Error refreshing notices:', error);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const [year, month, day] = dateString.split('-');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

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
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#1f2937' }} numberOfLines={2}>{title}</Text>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: '#d97706',
          paddingVertical: 9,
          paddingHorizontal: 9,
          borderRadius: 100
        }}
        activeOpacity={0.8}
        onPress={() => Linking.openURL(link)}
      >
        <Ionicons name="information-circle" size={25} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const ScheduleCard = ({ title, date, course_code }: ScheduleCardProps) => (
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
        <Text style={{ fontSize: 10, color: '#9ca3af', marginBottom: 4 }}>Upcoming Exam</Text>
        <Text style={{ fontSize: 12, fontWeight: '600', color: '#1f2937' }} numberOfLines={2}>
          {title}
        </Text>
      </View>
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 10, color: '#6b7280', marginBottom: 4 }}>Scheduled On</Text>
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#0d9488' }}>
          {formatDate(date)}
        </Text>
      </View>
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 10, color: '#6b7280', marginBottom: 4 }}>Course Code</Text>
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#f87171' }}>
          {course_code.toUpperCase()}
        </Text>
      </View>
    </View>
  );

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
    <View style={{ flex: 1, backgroundColor: '#fdfcf9', marginBottom: 60 }}>
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

      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#0891b2']}
            tintColor={'#0891b2'}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 220 }}
      >
        <View style={{
          width: '100%',
          alignItems: 'center',
          paddingTop: 32,
          zIndex: 20
        }}>
          <View style={{
            width: '33%',
            height: 8,
            backgroundColor: '#e5e7eb',
            borderRadius: 9999
          }} />
        </View>

        <View style={{ padding: 24, backgroundColor: '#fdfcf9' }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16
          }}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#374151' }}>Latest Updates</Text>
            <TouchableOpacity
              onPress={handleRefresh}
              style={{
                width: 37,
                height: 37,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#1f2937',
                elevation: 2,
              }}
              disabled={refreshing}
            >
              <Animated.View
                style={{
                  transform: [{
                    rotate: rotateAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg']
                    })
                  }]
                }}
              >
                <Ionicons
                  name="refresh-outline"
                  size={22}
                  color="#1f2937"
                />
              </Animated.View>
            </TouchableOpacity>
          </View>

          <Text style={{ fontSize: 14, color: '#9ca3af', marginBottom: 16 }}>
            Be the one who knows everything!
          </Text>
          <ScrollView
            horizontal={false}
            nestedScrollEnabled
            style = {{
              height  : 400
            }}
          >
                {noticeLoading ? (
            <View style={{ alignItems: 'center', paddingVertical: 32 }}>
              <ActivityIndicator size="large" color="#0891b2" />
              <Text style={{ color: '#6b7280', marginTop: 8 }}>Loading updates...</Text>
            </View>
          ) : noticeUpdates.length > 0 ? (
            noticeUpdates.map((update) => (
                <UpdatesCard
                  key={update.update_id}
                  title={update.title}
                  link={update.link}
                />
            ))
          ) : (
            <View style={{
              backgroundColor: 'white',
              padding: 24,
              borderRadius: 12,
              alignItems: 'center'
            }}>
              <Text style={{ color: '#6b7280' }}>No updates found</Text>
            </View>
          )}
          </ScrollView>
          

          <Text style={{ fontSize: 20, fontWeight: '700', color: '#374151', marginVertical: 16 }}>
            Your Schedule
          </Text>
          <Text style={{ fontSize: 14, color: '#9ca3af', marginBottom: 16 }}>
            You need to face this!
          </Text>

          {loading ? (
            <View style={{ alignItems: 'center', paddingVertical: 32 }}>
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