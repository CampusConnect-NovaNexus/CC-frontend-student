import { EXPO_BASE_URL_SS } from '@env';

export const createPost = async (user_id: string, title: string, description: string) => {
  try {
    const res = await fetch(`${EXPO_BASE_URL_SS}/api/forum/new_post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, title, description })
    });
    return await res.json();
  } catch (error) {
    console.error('Failed to create post:', error);
  }
};
