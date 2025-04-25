import { EXPO_BASE_URL } from '@env';
import * as ImageManipulator from 'expo-image-manipulator';

export interface LostFoundItemInput {
  title: string;
  user_id: string;
  description: string;
  item_category: string;
  image?: {
    uri: string;
    name: string;
  };
}

export const getMimeType = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    default:
      return 'application/octet-stream';
  }
};

export const prepareItemFormData = async (item: LostFoundItemInput, compressionQuality = 0.7, imageWidth=500): Promise<FormData> => {
  const form = new FormData();

  form.append('title', item.title);
  form.append('user_id', item.user_id);
  form.append('description', item.description);
  form.append('item_category', item.item_category);

  if (item.image) {
    const compressedImage = await ImageManipulator.manipulateAsync(
      item.image.uri,
      [{ resize: { width: imageWidth } }],
      { compress: compressionQuality, format: ImageManipulator.SaveFormat.JPEG }
    );

    const mimeType = getMimeType(item.image.name);
    form.append('image_file', {
      uri: compressedImage.uri,
      name: item.image.name,
      type: mimeType,
    } as any);
  }

  return form;
};

export const submitItemToAPI = async (formData: FormData, itemType: 'lost' | 'found'): Promise<any> => {
  const BASEURL = EXPO_BASE_URL;

  try {
    const response = await fetch(`${BASEURL}/api/v1/item/create`, {
      method: 'POST',
      body: formData,
    });

    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      console.error(`HTTP Error for ${itemType} item:`, response.status, response.statusText);
      return null;
    }

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      console.log(`Response from post${itemType}Item:`, data);
      return data;
    } else {
      const text = await response.text();
      console.error("Non-JSON response:", text);
      return null;
    }
  } catch (error) {
    console.error(`Error posting ${itemType} item:`, error);
    return null;
  }
};