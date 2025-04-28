import {EXPO_BASE_URL_GR} from '@env';

export const getStats = async () => {
    const BASEURL=EXPO_BASE_URL_GR
  try {
    const response = await fetch(`${BASEURL}/stats`);
    const data=await response.json();
    console.log('Stats :',data);
    return data;
  } catch (error) {
    console.error('Unable to reach servers at the moment');
  }
};