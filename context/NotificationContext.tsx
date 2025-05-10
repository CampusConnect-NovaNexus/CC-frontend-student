import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EXPO_AUTH_API_URL } from '@env';

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

  // Auth Server URL for notifications
  const AUTH_API_URL = `${EXPO_AUTH_API_URL}/api/v1/notifications`;
  // const AUTH_API_URL = `http://192.168.3.76:2400/api/v1/notifications`;
  
  console.log('🔔 NOTIFICATION: Auth API URL:', AUTH_API_URL);

  useEffect(() => {
    console.log('🔔 NOTIFICATION: Initializing notification context');
    
    // Load token from storage on mount
    loadSavedToken();

    // Register for push notifications
    registerForPushNotifications();

    // Set up notification listeners
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
      console.log('🔔 NOTIFICATION RECEIVED:', JSON.stringify({
        title: notification.request.content.title,
        body: notification.request.content.body,
        data: notification.request.content.data
      }, null, 2));
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('🔔 NOTIFICATION RESPONSE:', JSON.stringify({
        title: response.notification.request.content.title,
        body: response.notification.request.content.body,
        data: response.notification.request.content.data,
        actionIdentifier: response.actionIdentifier
      }, null, 2));
      // Handle notification response (e.g., navigate to a specific screen)
    });

    // Set up token change listener
    const tokenListener = Notifications.addPushTokenListener(({ data }) => {
      console.log('🔔 PUSH TOKEN CHANGED:', data);
      setExpoPushToken(data);
      saveTokenToStorage(data);
      updateTokenOnServer(data);
    });

    // Clean up listeners on unmount
    return () => {
      console.log('🔔 NOTIFICATION: Cleaning up notification listeners');
      Notifications.removeNotificationSubscription(notificationListener.current!);
      Notifications.removeNotificationSubscription(responseListener.current!);
      Notifications.removePushTokenSubscription(tokenListener);
    };
  }, []);

  const loadSavedToken = async () => {
    try {
      const token = await AsyncStorage.getItem('@expo_push_token');
      if (token) {
        console.log('🔔 NOTIFICATION: Loaded saved token from storage:', token);
        setExpoPushToken(token);
      } else {
        console.log('🔔 NOTIFICATION: No saved token found in storage');
      }
    } catch (error) {
      console.log('🔔 NOTIFICATION ERROR: Failed to load token from storage:', error);
    }
  };

  const saveTokenToStorage = async (token: string) => {
    try {
      await AsyncStorage.setItem('@expo_push_token', token);
      console.log('🔔 NOTIFICATION: Token saved to storage:', token);
    } catch (error) {
      console.log('🔔 NOTIFICATION ERROR: Failed to save token to storage:', error);
    }
  };

  const registerForPushNotifications = async (): Promise<string | null> => {
    console.log('🔔 NOTIFICATION: Starting push notification registration');
    
    if (!Device.isDevice) {
      console.log('🔔 NOTIFICATION: Must use physical device for Push Notifications');
      return null;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      console.log('🔔 NOTIFICATION: Permission status:', existingStatus);

      if (existingStatus !== 'granted') {
        console.log('🔔 NOTIFICATION: Requesting permissions');
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        console.log('🔔 NOTIFICATION: New permission status:', status);
      }

      if (finalStatus !== 'granted') {
        console.log('🔔 NOTIFICATION ERROR: Permission denied');
        return null;
      }

      // Get the token
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      console.log('🔔 NOTIFICATION: Requesting push token with projectId:', projectId);
      
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      const token = tokenData.data;
      console.log('🔔 NOTIFICATION: Received Expo push token:', token);
      
      // Save token to state and storage
      setExpoPushToken(token);
      saveTokenToStorage(token);
      
      // Register token with server if user is logged in
      const userId = await AsyncStorage.getItem('@user_id');
      if (userId) {
        console.log('🔔 NOTIFICATION: User logged in, registering token with server');
        await registerTokenWithServer(token);
      } else {
        console.log('🔔 NOTIFICATION: User not logged in, skipping server registration');
      }

      // For Android, set notification channel
      if (Platform.OS === 'android') {
        console.log('🔔 NOTIFICATION: Setting up Android notification channel');
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      return token;
    } catch (error) {
      console.log('🔔 NOTIFICATION ERROR: Failed to get push token:', error);
      return null;
    }
  };

  const registerTokenWithServer = async (token: string) => {
    try {
      const userId = await AsyncStorage.getItem('@user_id');
      const authToken = await AsyncStorage.getItem('@auth_token');
      
      if (!userId || !authToken) {
        console.log('🔔 NOTIFICATION: User not logged in, skipping token registration');
        return;
      }

      console.log('🔔 NOTIFICATION: Registering token with server', {
        endpoint: `${AUTH_API_URL}/register`,
        userId,
        token
      });

      // Use the auth-server notification register endpoint instead of lost-found
      const response = await fetch(`${AUTH_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          expoToken: token,
          userId: userId,
          platform: Platform.OS,
        }),
      });

      // Check if response is OK before parsing JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.log('🔔 NOTIFICATION ERROR: Server responded with error:', response.status, errorText.substring(0, 200));
        return;
      }

      // Check content type before parsing
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        console.log('🔔 NOTIFICATION: Token registration response:', data);
      } else {
        const text = await response.text();
        console.log('🔔 NOTIFICATION: Non-JSON response:', text.substring(0, 200));
      }
    } catch (error) {
      console.log('🔔 NOTIFICATION ERROR: Failed to register token with server:', error);
    }
  };

  const updateTokenOnServer = async (newToken: string) => {
    try {
      const oldToken = await AsyncStorage.getItem('@expo_push_token');
      const authToken = await AsyncStorage.getItem('@auth_token');
      
      if (!authToken) {
        console.log('🔔 NOTIFICATION: User not logged in, skipping token update');
        return;
      }

      if (oldToken && oldToken !== newToken) {
        console.log('🔔 NOTIFICATION: Updating token on server', {
          oldToken,
          newToken
        });
        
        // Use the auth-server update endpoint
        const response = await fetch(`${AUTH_API_URL}/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            oldToken: oldToken,
            newToken: newToken,
            platform: Platform.OS,
          }),
        });

        const data = await response.json();
        console.log('🔔 NOTIFICATION: Token update response:', data);
      }
    } catch (error) {
      console.log('🔔 NOTIFICATION ERROR: Failed to update token on server:', error);
    }
  };

  const sendPushNotification = async (title: string, body: string, data: any = {}) => {
    if (!expoPushToken) {
      console.log('🔔 NOTIFICATION: No push token available, cannot send notification');
      return;
    }

    const message = {
      to: expoPushToken,
      sound: 'default',
      title,
      body,
      data,
    };

    console.log('🔔 NOTIFICATION: Sending push notification:', {
      to: expoPushToken,
      title,
      body,
      data
    });

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
      console.log('🔔 NOTIFICATION: Push notification sent, response:', responseData);
      return responseData;
    } catch (error) {
      console.log('🔔 NOTIFICATION ERROR: Failed to send push notification:', error);
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