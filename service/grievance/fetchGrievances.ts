import {EXPO_BASE_URL_GR} from '@env';

export const fetchGrievances = async () => {
  const BASEURL = EXPO_BASE_URL_GR
  
  try {
    const response = await fetch(`${BASEURL}/complaints`);
    const data=await response.json();
        
    return data;
  } catch (error) {
    console.error('fetchGrievances error :', error);
  }
};