import {EXPO_BASE_URL_GR} from '@env';

export const getGrievanceOfUser = async (user_id: string) => {
    const BASEURL=EXPO_BASE_URL_GR
    try {
    const response = await fetch(`${BASEURL}/user/${user_id}`);
    const data= await response.json()
    return data;
  } catch (error) {
    console.error('getGrievanceOfUser Error:', error);
  }
};