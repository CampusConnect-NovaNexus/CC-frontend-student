import { View, Text, ScrollView, Image, Pressable, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { icons } from '@/constants/icons';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Sample notification data structure
interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
}

// Sample data for notifications
const sampleNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'New Assignment Posted',
    message: 'A new assignment has been posted for CS101 - Introduction to Programming',
    timestamp: '2023-05-12T10:30:00Z',
    type: 'info',
    isRead: false
  },
  {
    id: '2',
    title: 'Exam Schedule Updated',
    message: 'The final exam for Mathematics has been rescheduled to May 20th',
    timestamp: '2023-05-11T14:45:00Z',
    type: 'warning',
    isRead: false
  },
  {
    id: '3',
    title: 'Assignment Graded',
    message: 'Your assignment for Data Structures has been graded. You received an A!',
    timestamp: '2023-05-10T09:15:00Z',
    type: 'success',
    isRead: true
  },
  {
    id: '4',
    title: 'Attendance Alert',
    message: 'Your attendance in Database Systems is below 75%. Please improve your attendance.',
    timestamp: '2023-05-09T11:20:00Z',
    type: 'error',
    isRead: true
  },
  {
    id: '5',
    title: 'Campus Event',
    message: 'Annual Tech Fest will be held on June 5-7. Register now to participate!',
    timestamp: '2023-05-08T16:00:00Z',
    type: 'info',
    isRead: true
  }
];

// Notification Template Component
const NotificationTemplate = ({ data }: { data: NotificationItem }) => {
  // Icon mapping based on notification type
  const iconMap = {
    info: { name: 'information-circle', color: '#3498db' },
    warning: { name: 'warning', color: '#f39c12' },
    success: { name: 'checkmark-circle', color: '#2ecc71' },
    error: { name: 'alert-circle', color: '#e74c3c' }
  };

  // Format timestamp to a readable date
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
  };

  return (
    <View style={[
      styles.notificationCard, 
      { backgroundColor: data.isRead ? '#f8f9fa' : '#ffffff' }
    ]}>
      <View style={styles.iconContainer}>
        <Ionicons 
          name={iconMap[data.type].name as any} 
          size={24} 
          color={iconMap[data.type].color} 
        />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.timestamp}>{formatDate(data.timestamp)}</Text>
        </View>
        <Text style={styles.message}>{data.message}</Text>
      </View>
      {!data.isRead && <View style={styles.unreadIndicator} />}
    </View>
  );
};

const Notification = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching notifications from an API
    const fetchNotifications = async () => {
      try {
        // In a real app, you would fetch from an API
        // const response = await fetch('your-api-endpoint');
        // const data = await response.json();
        
        // Using sample data for demonstration
        setNotifications(sampleNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const renderNotificationItem = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity 
      onPress={() => markAsRead(item.id)}
      activeOpacity={0.7}
    >
      <NotificationTemplate data={item} />
    </TouchableOpacity>
  );

  const unreadCount = notifications.filter(item => !item.isRead).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        
        <View style={{ flex: 1 }} className='m-0 bg-black' />
        
        {unreadCount > 0 && (
          <TouchableOpacity 
            style={styles.markAllButton}
            onPress={markAllAsRead}
          >
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        }
      />
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFDFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 16,
  },
  backButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  markAllButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#F0F8FF',
  },
  markAllText: {
    fontSize: 12,
    color: '#3498db',
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
  },
  iconContainer: {
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  message: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  unreadIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3498db',
  },
});