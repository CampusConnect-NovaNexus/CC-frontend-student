import {EXPO_BASE_URL_GR} from '@env';

export const getComment = async (c_id: string) => {
    const BASEURL=EXPO_BASE_URL_GR
  try {
    
    const response = await fetch(`${BASEURL}/get_comments/${c_id}`);
    const data=response.json();
    return data;
  } catch (error) {
    console.error('Get Comments Error:', error);
    return null
  }
};
