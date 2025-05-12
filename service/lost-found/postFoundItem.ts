
import { EXPO_BASE_URL } from '@env';

const getMimeType = (filename: string) => {
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

export const postFoundItem = async (item:any) => {
  
  const BASEURL = EXPO_BASE_URL;
  const form = new FormData();

  form.append('title', item.title);
  form.append('user_id', item.user_id); // better to not hardcode it
  form.append('description', item.description);
  form.append('item_category', item.item_category);

  if (item.image) {
    const mimeType = getMimeType(item.image.name);
    form.append('image_file', {
      uri: item.image.uri,
      name: item.image.name,
      type: mimeType, // ✅ correct type
    } as any);
  }
  
  try {
    const response = await fetch(`${BASEURL}/api/v1/item/create`, {
      method: 'POST',
      body: form,
    });
    const data=await response.json();
    return data;
  } catch (error) {
    console.error("Error posting Found item:", error);
    return null;
  }
};
