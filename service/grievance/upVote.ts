import {EXPO_BASE_URL_GR} from '@env';

export const upVote = async (c_id: string, user_id: string) => {
    const BASEURL=EXPO_BASE_URL_GR
    try {
    const response = await fetch(`${BASEURL}/upvote/${c_id}`, { method:"POST",
      headers:{
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id,
        }),
     });
    const data=await response.json()
    console.log('Upvoted Complaint:', data);
    return data;
  } catch (error) {
    console.error('Upvote Complaint Error:', error);
  }
};