import { EXPO_BASE_URL_SS } from '@env';
import { addPoints } from '../auth/addPoints';
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
  console.log('new post baseurl in api ', EXPO_BASE_URL_SS)
  try {
    const res = await fetch(`${EXPO_BASE_URL_SS}/api/forum/new_post`, {
      method: 'POST',
      body: form
    });
    if(res.ok) {
        addPoints(item.user_id,10)
    }
    return await res.json();
  } catch (error) {
    console.error('Failed to create post:', error);
  }
};
// export const createPost = async (item:postItemInput) => {
//   const form = new FormData();

//   form.append('title', item.title);
//   form.append('user_id', item.user_id); 
//   form.append('description', item.description);

//   if (item.image) {
//     const mimeType = getMimeType(item.image.name);
//     form.append('image_file', {
//       uri: item.image.uri,
//       name: item.image.name,
//       type: mimeType, 
//     } as any);
//   }
//   console.log('new post  data : ', form);
  
//   try {
//     const res = await fetch(`${EXPO_BASE_URL_SS}/api/forum/new_post`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: form
//     });
//     return await res.json();
//   } catch (error) {
//     console.error('Failed to create post:', error);
//   }
// };
