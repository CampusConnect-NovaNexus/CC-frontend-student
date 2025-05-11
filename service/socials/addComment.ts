import { EXPO_BASE_URL_SS } from '@env';
import { addPoints } from '../auth/addPoints';
export const addCommentToPost = async (post_id: string, user_id: string, comment: string) => {
  try {
    const res = await fetch(`${EXPO_BASE_URL_SS}/api/forum/add_comment/${post_id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, comment }),
    });
    if(res.ok) {
        addPoints(user_id,5)
    }
    return await res.json();
  } catch (error) {
    console.error('Failed to add comment:', error);
  }
};
