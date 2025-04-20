import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const ReportFoundItemForm = () => {
  const [foundDate, setFoundDate] = useState(new Date());
  const [place, setPlace] = useState('');
  const [finderName, setFinderName] = useState('');
  const [objectFound, setObjectFound] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    setFoundDate(selectedDate || foundDate);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const handleSubmit = () => {
    const formData = {
      foundDate,
      place,
      finderName,
      objectFound,
      image,
    };
    console.log('Form Submitted', formData);
    // Here you can call an API to submit the form data
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Report Found Item</Text>

      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={finderName}
        onChangeText={setFinderName}
      />
      <TextInput
        style={styles.input}
        placeholder="Place Found"
        value={place}
        onChangeText={setPlace}
      />
      <TextInput
        style={styles.input}
        placeholder="Object Found"
        value={objectFound}
        onChangeText={setObjectFound}
      />

      <View style={styles.dateContainer}>
        <Text>Date Found: {foundDate.toLocaleDateString()}</Text>
        <Button title="Pick Date" onPress={() => setShowDatePicker(true)} />
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={foundDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <Button title="Pick Image" onPress={pickImage} />

      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
  },
  dateContainer: {
    marginBottom: 15,
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
});

export default ReportFoundItemForm;
