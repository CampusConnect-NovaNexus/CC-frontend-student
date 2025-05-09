import { EXPO_BASE_URL_SS } from '@env';

export const deleteComment = async (p_id: string, comment_id: string) => {
  try {
    const res = await fetch(`${EXPO_BASE_URL_SS}/api/forum/delete_comment/${p_id}/${comment_id}`, {
      method: 'DELETE',
    });
    return await res.json();
  } catch (error) {
    console.error('Failed to delete comment:', error);
  }
};
