import { EXPO_BASE_URL_SS } from '@env';

export const deletePost = async (p_id: string) => {
  try {
    const res = await fetch(`${EXPO_BASE_URL_SS}/api/forum/delete_post/${p_id}`, {
      method: 'DELETE',
    });
    return await res.json();
  } catch (error) {
    console.error('Failed to delete post:', error);
  }
};