import {EXPO_BASE_URL_GR} from '@env';

export const upVote = async (c_id: string, user_id: string) => {
    const BASEURL=EXPO_BASE_URL_GR
    console.log('in upvote',user_id, c_id);
    
    try {
    const response = await fetch(`${BASEURL}/upvote/${c_id}`, { method:"PUT",
      headers:{
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id,
        }),
     });
    const data=await response.json()
    
    return data;
  } catch (error) {
    console.error('Upvote Complaint Error:', error);
  }
};