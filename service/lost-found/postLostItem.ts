
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

export const postLostItem = async (item: LostFoundItemInput) => {
  console.log('in lost post item');
  
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
  console.log('lost data : ', form);
  
  try {
    const response = await fetch(`${BASEURL}/api/v1/item/create`, {
      method: 'POST',
      body: form,
    });

    const contentType = response.headers.get("content-type");
    console.log('respoosne : ', response)
    if (!response.ok) {
      console.error("HTTP Error:", response.status, response.statusText);
      return null;
    }

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      console.log("Response from postLostItem:", data);
      return data;
    } else {
      const text = await response.text();
      console.error("Non-JSON response:", text);
      return null;
    }
  } catch (error) {
    console.error("Error posting lost item:", error);
    return null;
  }
};
