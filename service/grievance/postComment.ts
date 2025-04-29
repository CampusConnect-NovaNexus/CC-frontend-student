import { EXPO_BASE_URL_GR } from '@env';

export const postComment = async (c_id: string, user_id: string,c_message: string) => {
  const BASEURL = EXPO_BASE_URL_GR;
  console.log('BASEURL : ',BASEURL);
  try {
    const response = await fetch(`${BASEURL}/add_comment/${c_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id,
        comment:c_message,
      }),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Add Comment Error:', error);
  }
};
