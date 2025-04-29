import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/api';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  registerForPushNotifications: () => Promise<string | null>;
  sendPushNotification: (title: string, body: string, data?: any) => Promise<any>;
}

const NotificationContext = createContext<NotificationContextType>({
  expoPushToken: null,
  notification: null,
  registerForPushNotifications: async () => null,
  sendPushNotification: async () => null,
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = React.useRef<Notifications.Subscription>();
  const responseListener = React.useRef<Notifications.Subscription>();

  useEffect(() => {
    // Load token from storage on mount
    loadSavedToken();

    // Register for push notifications
    registerForPushNotifications();

    // Set up notification listeners
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      // Handle notification response (e.g., navigate to a specific screen)
    });

    // Set up token change listener
    const tokenListener = Notifications.addPushTokenListener(({ data }) => {
      console.log('Push token changed:', data);
      setExpoPushToken(data);
      saveTokenToStorage(data);
      updateTokenOnServer(data);
    });

    // Clean up listeners on unmount
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current!);
      Notifications.removeNotificationSubscription(responseListener.current!);
      Notifications.removePushTokenSubscription(tokenListener);
    };
  }, []);

  const loadSavedToken = async () => {
    try {
      const token = await AsyncStorage.getItem('@expo_push_token');
      if (token) {
        setExpoPushToken(token);
      }
    } catch (error) {
      console.error('Error loading push token from storage:', error);
    }
  };

  const saveTokenToStorage = async (token: string) => {
    try {
      await AsyncStorage.setItem('@expo_push_token', token);
    } catch (error) {
      console.error('Error saving push token to storage:', error);
    }
  };

  const registerForPushNotifications = async (): Promise<string | null> => {
    if (!Device.isDevice) {
      console.log('Must use physical device for Push Notifications');
      return null;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return null;
      }

      // Get the token
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      const token = tokenData.data;
      console.log('Expo push token:', token);
      
      // Save token to state and storage
      setExpoPushToken(token);
      saveTokenToStorage(token);
      
      // Register token with server if user is logged in
      const userId = await AsyncStorage.getItem('@user_id');
      if (userId) {
        await registerTokenWithServer(token);
      }

      // For Android, set notification channel
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      return token;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  };

  const registerTokenWithServer = async (token: string) => {
    try {
      const userId = await AsyncStorage.getItem('@user_id');
      const authToken = await AsyncStorage.getItem('@auth_token');
      
      if (!userId || !authToken) {
        console.log('User not logged in, skipping token registration');
        return;
      }

      const response = await fetch(`${API_URL}/notification/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          expo_token: token,
          platform: Platform.OS,
        }),
      });

      const data = await response.json();
      console.log('Token registration response:', data);
    } catch (error) {
      console.error('Error registering token with server:', error);
    }
  };

  const updateTokenOnServer = async (newToken: string) => {
    try {
      const oldToken = await AsyncStorage.getItem('@expo_push_token');
      const authToken = await AsyncStorage.getItem('@auth_token');
      
      if (!authToken) {
        console.log('User not logged in, skipping token update');
        return;
      }

      if (oldToken && oldToken !== newToken) {
        const response = await fetch(`${API_URL}/notification/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            old_token: oldToken,
            new_token: newToken,
            platform: Platform.OS,
          }),
        });

        const data = await response.json();
        console.log('Token update response:', data);
      }
    } catch (error) {
      console.error('Error updating token on server:', error);
    }
  };

  const sendPushNotification = async (title: string, body: string, data: any = {}) => {
    if (!expoPushToken) {
      console.log('No push token available');
      return;
    }

    const message = {
      to: expoPushToken,
      sound: 'default',
      title,
      body,
      data,
    };

    try {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      const responseData = await response.json();
      console.log('Push notification sent:', responseData);
      return responseData;
    } catch (error) {
      console.error('Error sending push notification:', error);
      throw error;
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        expoPushToken,
        notification,
        registerForPushNotifications,
        sendPushNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};