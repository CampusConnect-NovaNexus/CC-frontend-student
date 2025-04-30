import { EXPO_BASE_URL_SS } from '@env';

export const upvotePost = async (post_id: string, user_id: string) => {
  try {
    const res = await fetch(`${EXPO_BASE_URL_SS}/api/forum/upvote/${post_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id })
    });
    return await res.json();
  } catch (error) {
    console.error('Failed to upvote:', error);
  }
};
