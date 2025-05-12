import React from 'react';
import { View, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { saveImage } from '@/utils/fileHelper';
import Toast from 'react-native-toast-message';

export default function ImagePickerComponent() {
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({
        type: 'error',
        text1: 'Permission required',
        text2: 'Camera access is needed',
        position: 'bottom'
      });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      await saveImage(uri);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Image saved',
        position: 'bottom'
      });
    }
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({
        type: 'error',
        text1: 'Permission required',
        text2: 'Gallery access is needed',
        position: 'bottom'
      });
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
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Images saved',
        position: 'bottom'
      });
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
