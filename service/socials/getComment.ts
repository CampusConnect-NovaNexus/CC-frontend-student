import { EXPO_BASE_URL_SS } from '@env';

export const getCommentsForPost = async (post_id: string) => {
  console.log('getCommentsForPost called');
  
  try {
    const res = await fetch(`${EXPO_BASE_URL_SS}/api/forum/get_comments/${post_id}`);
    console.log(res);
    
    return await res.json();
  } catch (error) {
    console.error('Failed to get comments:', error);
  }
};
