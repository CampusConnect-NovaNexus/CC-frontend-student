import { EXPO_BASE_URL_SS } from '@env';
import { addPoints } from '../auth/addPoints';
export const upvotePost = async (post_id: string, user_id: string) => {
  try {
    const res = await fetch(`${EXPO_BASE_URL_SS}/api/forum/upvote/${post_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id })
    });
    if(res.ok) {
        addPoints(user_id,2)
    }
    return await res.json();
  } catch (error) {
    console.error('Failed to upvote:', error);
  }
};
