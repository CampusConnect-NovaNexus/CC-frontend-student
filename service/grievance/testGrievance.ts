import {EXPO_BASE_URL_GR} from '@env';

export const testGrievance = async () => {
    const BASEURL=EXPO_BASE_URL_GR
  try {
    const response = await fetch(`http://192.168.3.75:5000/test`);
    const data=await response.json()
    console.log('Test Server :', data);
    
  } catch (error) {
    console.error('Test Server Error:', error);
  }
};