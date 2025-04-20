import React from 'react';
import { View, Button, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { saveImage } from '@/utils/fileHelper';

export default function ImagePickerComponent() {
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Camera access is needed');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      await saveImage(uri);
      Alert.alert("Success", "Image saved");
    }
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Gallery access is needed');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      for (let asset of result.assets) {
        await saveImage(asset.uri);
      }
      Alert.alert("Success", "Images saved");
    }
  };

  return (
    <View style={{ marginVertical: 20 }}>
      <Button title="Capture from Camera" onPress={takePhoto} />
      <View style={{ height: 10 }} />
      <Button title="Pick Multiple from Gallery" onPress={pickFromGallery} />
    </View>
  );
}
