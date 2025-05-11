import { EXPO_BASE_URL_SS } from '@env';
import { addPoints } from '../auth/addPoints';
export const deletePost = async (p_id: string,user_id:string) => {
  try {
    const res = await fetch(`${EXPO_BASE_URL_SS}/api/forum/delete_post/${p_id}`, {
      method: 'DELETE',
    });
    if(res.ok) {
        addPoints(user_id,-10)
    }
    return await res.json();
  } catch (error) {
    console.error('Failed to delete post:', error);
  }
};