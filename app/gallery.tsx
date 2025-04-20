import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, StyleSheet, Text } from 'react-native';
import { getAllSavedImages } from '@/utils/fileHelper';

export default function Gallery() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      const imgs = await getAllSavedImages();
      setImages(imgs);
    };
    loadImages();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {images.length === 0 && <Text>No saved images</Text>}
      {images.map((uri, index) => (
        <Image key={index} source={{ uri }} style={styles.image} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 8,
  },
});
