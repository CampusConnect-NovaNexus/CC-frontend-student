import { EXPO_BASE_URL_SS } from '@env';

export const getUsersPost = async (user_id: string) => {
  console.log('getUserPost called');
  
  try {
    const res = await fetch(`${EXPO_BASE_URL_SS}/api/forum/user/${user_id}/posts`);
    
    const data = await res.json();
    
    return data;
  } catch (error) {
    console.error('Failed to get users posts:', error);
  }
};
