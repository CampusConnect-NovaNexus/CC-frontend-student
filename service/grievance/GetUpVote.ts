import {EXPO_BASE_URL_GR} from '@env';

export const getUpvote = async (c_id: string) => {
    const BASEURL=EXPO_BASE_URL_GR
  try {
    const response = await fetch(`${BASEURL}/get_upvotes/${c_id}`);
    const data=await response.json();
    return data;
  } catch (error) {
    console.error('Get Upvotes Error:', error);
  }
};