import { EXPO_BASE_URL_SS } from '@env';

export const getAllPosts = async () => {
  
  try {
    const res = await fetch(`${EXPO_BASE_URL_SS}/api/forum/posts`);
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch posts:', error);
  }
};