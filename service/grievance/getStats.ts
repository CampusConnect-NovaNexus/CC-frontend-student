import {EXPO_BASE_URL_GR} from '@env';

export const getStats = async () => {
    const BASEURL=EXPO_BASE_URL_GR
    console.log('BASEURL : ',BASEURL);
    
  try {
    const response = await fetch(`${BASEURL}/stats`);
    const data=await response.json();
    return data;
  } catch (error) {
    console.error('Unable to fetch Stats at the moment');
  }
};