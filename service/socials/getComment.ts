import { EXPO_BASE_URL_SS } from '@env';

export const getCommentsForPost = async (post_id: string) => {
  
  try {
    const res = await fetch(`${EXPO_BASE_URL_SS}/api/forum/get_comments/${post_id}`);
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Failed to get comments:', error);
  }
};
