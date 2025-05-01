import { EXPO_BASE_URL_SS } from '@env';

interface postItemInput {
  title: string;
  user_id: string;
  description: string;
  image?: {
    uri: string;
    name: string;
    type?: string;
  };
}
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

// export const createPost = async (user_id: string, title: string, description: string) => {
//   try {
//     const res = await fetch(`${EXPO_BASE_URL_SS}/api/forum/new_post`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ user_id, title, description })
//     });
//     return await res.json();
//   } catch (error) {
//     console.error('Failed to create post:', error);
//   }
// };
export const createPost = async (item:postItemInput) => {
  const form = new FormData();

  form.append('title', item.title);
  form.append('user_id', item.user_id); 
  form.append('description', item.description);

  if (item.image) {
    const mimeType = getMimeType(item.image.name);
    form.append('image_file', {
      uri: item.image.uri,
      name: item.image.name,
      type: mimeType, 
    } as any);
  }
  console.log('new post  data : ', form);
  
  try {
    const res = await fetch(`${EXPO_BASE_URL_SS}/api/forum/new_post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: form
    });
    return await res.json();
  } catch (error) {
    console.error('Failed to create post:', error);
  }
};
