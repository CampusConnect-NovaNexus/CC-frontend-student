import {EXPO_BASE_URL_GR} from '@env';

export const addResolver = async (c_id: string, user_id: string) => {
    const BASEURL=EXPO_BASE_URL_GR
    try {
    const response = await fetch(`${BASEURL}/add_resolver/${c_id}`, 
      { method:"POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        user_id,
        }),
      });
    const data= await response.json()l
    console.log('Added Resolver:', data);
    return data;
  } catch (error) {
    console.error('Add Resolver Error:', error);
  }
};