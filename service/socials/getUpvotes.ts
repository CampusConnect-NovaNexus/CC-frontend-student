import { EXPO_BASE_URL_SS } from '@env';

export const getUpvotes = async (post_id: string) => {
  try {
    const res = await fetch(`${EXPO_BASE_URL_SS}/api/forum/get_upvotes/${post_id}`);
    return await res.json();
  } catch (error) {
    console.error('Failed to get upvotes:', error);
  }
};