import React, { useState, useEffect } from 'react';
import { View, Alert, TextInput, TouchableOpacity, Text } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';


export default function SendNotification() {
  const [expoPushToken, setExpoPushToken] = useState<string>('');
  const [targetToken, setTargetToken] = useState<string>('');

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) setExpoPushToken(token);
    });
  }, []);

  async function sendPushNotification() {
    if (!targetToken) {
      Alert.alert('Error', 'Please enter a valid target Expo push token.');
      return;
    }

    const message = {
      to: targetToken,
      sound: 'default',
      title: 'Hello!',
      body: 'This is a hello from another device!',
      data: { customData: 'optional data' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    Alert.alert('Success', 'Push notification sent!');
  }

  return (
    <View className="flex-1 justify-center items-center p-6 bg-white">
      <Text className="text-xl font-bold mb-4 text-black">Enter Target Token</Text>
      <TextInput
        className="border border-gray-400 rounded-lg w-full p-3 mb-6 text-black"
        placeholder="Enter Expo Push Token"
        placeholderTextColor="#999"
        value={targetToken}
        onChangeText={setTargetToken}
      />
      <TouchableOpacity
        className="bg-blue-500 rounded-xl px-6 py-3"
        onPress={sendPushNotification}
      >
        <Text className="text-white text-lg font-semibold">Send Hello</Text>
      </TouchableOpacity>
    </View>
  );
}

async function registerForPushNotificationsAsync(): Promise<string | undefined> {
  if (!Device.isDevice) {
    Alert.alert('Error', 'Must use a physical device for Push Notifications');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    Alert.alert('Error', 'Failed to get push token for push notifications!');
    return;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync();
  console.log('Expo Push Token:', tokenData.data);
  return tokenData.data;
}
