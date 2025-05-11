import React, { useState, useEffect,useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { top10 } from '@/service/auth/top10';
// Define the student type for leaderboard
interface LeaderboardStudent {
  id: string;
  name: string;
  points: number;
  avatar?: string;
  rank: number;
}

export default function LeaderBoard() {
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardStudent[]>([]);

  // useEffect(() => {
  //   // In a real app, this would be an API call to fetch leaderboard data
  //   fetchLeaderboardData();
  // }, []);
  const leaderBoardData=async()=>{
    const data = await top10();
    
    setLeaderboardData(data);
    setLoading(false);
  }
  useFocusEffect(
    useCallback(() => {
      // Fetch leaderboard data when the screen is focused
      leaderBoardData();
    }, [])
  );

  // const fetchLeaderboardData = async () => {
  //   try {
  //     // Simulate API call delay
  //     await new Promise(resolve => setTimeout(resolve, 1000));
      
  //     // Mock data for demonstration
  //     const mockData: LeaderboardStudent[] = Array.from({ length: 13 }, (_, i) => ({
  //       id: `student-${i + 1}`,
  //       name: `Student ${i + 1}`,
  //       points: Math.floor(Math.random() * 500) + 500, // Random points between 500-1000
  //       avatar: undefined, // In a real app, this would be a URL
  //       rank: i + 1
  //     }));
      
  //     // Sort by points in descending order
  //     mockData.sort((a, b) => b.points - a.points);
      
  //     // Update ranks after sorting
  //     mockData.forEach((student, index) => {
  //       student.rank = index + 1;
  //     });
      
  //     setLeaderboardData(mockData);
  //   } catch (error) {
  //     console.error('Error fetching leaderboard data:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Get top 3 students
  const topThreeStudents = leaderboardData.slice(0, 3);
  
  // Get the rest of the students (up to 10 more)
  const remainingStudents = leaderboardData.slice(3, 13);

  // Render medal icon based on rank
  const renderMedalIcon = (rank: number) => {
    if (rank === 1) return <Ionicons name="trophy" size={24} color="#FFD700" />;
    if (rank === 2) return <Ionicons name="trophy" size={24} color="#C0C0C0" />;
    if (rank === 3) return <Ionicons name="trophy" size={24} color="#CD7F32" />;
    return null;
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Leaderboard" }} />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Top 3 Students Section */}
          <View style={styles.topThreeContainer}>
            <Text style={styles.sectionTitle}>Top Performers</Text>
            <View style={styles.podiumContainer}>
              {/* Second Place */}
              {topThreeStudents.length > 1 && (
                <View style={[styles.podiumItem, styles.secondPlace]}>
                  <View style={styles.avatarContainer}>
                    {topThreeStudents[1].avatar ? (
                      <Image source={{ uri: topThreeStudents[1].avatar }} style={styles.avatar} />
                    ) : (
                      <View style={[styles.avatarPlaceholder, { backgroundColor: '#C0C0C0' }]}>
                        <Text style={styles.avatarText}>{topThreeStudents[1].name.charAt(0)}</Text>
                      </View>
                    )}
                    <View style={styles.medalContainer}>
                      {renderMedalIcon(2)}
                    </View>
                  </View>
                  <Text style={styles.podiumName} numberOfLines={1}>{topThreeStudents[1].name}</Text>
                  <Text style={styles.podiumPoints}>{topThreeStudents[1].points} pts</Text>
                </View>
              )}
              
              {/* First Place */}
              {topThreeStudents.length > 0 && (
                <View style={[styles.podiumItem, styles.firstPlace]}>
                  <View style={styles.avatarContainer}>
                    {topThreeStudents[0].avatar ? (
                      <Image source={{ uri: topThreeStudents[0].avatar }} style={styles.avatar} />
                    ) : (
                      <View style={[styles.avatarPlaceholder, { backgroundColor: '#FFD700' }]}>
                        <Text style={styles.avatarText}>{topThreeStudents[0].name.charAt(0)}</Text>
                      </View>
                    )}
                    <View style={styles.medalContainer}>
                      {renderMedalIcon(1)}
                    </View>
                  </View>
                  <Text style={styles.podiumName} numberOfLines={1}>{topThreeStudents[0].name}</Text>
                  <Text style={styles.podiumPoints}>{topThreeStudents[0].points} pts</Text>
                </View>
              )}
              
              {/* Third Place */}
              {topThreeStudents.length > 2 && (
                <View style={[styles.podiumItem, styles.thirdPlace]}>
                  <View style={styles.avatarContainer}>
                    {topThreeStudents[2].avatar ? (
                      <Image source={{ uri: topThreeStudents[2].avatar }} style={styles.avatar} />
                    ) : (
                      <View style={[styles.avatarPlaceholder, { backgroundColor: '#CD7F32' }]}>
                        <Text style={styles.avatarText}>{topThreeStudents[2].name.charAt(0)}</Text>
                      </View>
                    )}
                    <View style={styles.medalContainer}>
                      {renderMedalIcon(3)}
                    </View>
                  </View>
                  <Text style={styles.podiumName} numberOfLines={1}>{topThreeStudents[2].name}</Text>
                  <Text style={styles.podiumPoints}>{topThreeStudents[2].points} pts</Text>
                </View>
              )}
            </View>
          </View>
          
          {/* Remaining Students List */}
          <View style={styles.listContainer} className='bg-black'>
            <Text style={styles.sectionTitle}>Leaderboard</Text>
            {remainingStudents.map((student) => (
              <View key={student.id} style={styles.listItem}>
                <View style={styles.rankContainer}>
                  <Text style={styles.rankText}>{student.rank}</Text>
                </View>
                
                <View style={styles.studentInfo}>
                  {student.avatar ? (
                    <Image source={{ uri: student.avatar }} style={styles.listAvatar} />
                  ) : (
                    <View style={styles.listAvatarPlaceholder}>
                      <Text style={styles.listAvatarText}>{student.name.charAt(0)}</Text>
                    </View>
                  )}
                  <Text style={styles.studentName} numberOfLines={1}>{student.name}</Text>
                </View>
                
                <Text style={styles.pointsText}>{student.points} pts</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  topThreeContainer: {
    marginBottom: 24,
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 180,
  },
  podiumItem: {
    alignItems: 'center',
    width: '30%',
  },
  firstPlace: {
    height: 160,
    zIndex: 3,
  },
  secondPlace: {
    height: 130,
    zIndex: 2,
  },
  thirdPlace: {
    height: 110,
    zIndex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  medalContainer: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 2,
  },
  podiumName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
    maxWidth: '100%',
  },
  podiumPoints: {
    fontSize: 12,
    color: '#666',
  },
  listContainer: {
    borderRadius: 12,
    backgroundColor: 'white',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2,
  },
  listItem: {
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rankContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontWeight: 'bold',
    color: '#666',
  },
  studentInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  listAvatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  listAvatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  studentName: {
    fontSize: 16,
    fontWeight: '500',
  },
  pointsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db',
  },
});