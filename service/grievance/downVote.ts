import {EXPO_BASE_URL_GR} from '@env';

export const downVote = async (c_id: string, user_id: string) => {
  
    const BASEURL=EXPO_BASE_URL_GR  
    console.log('BASEURL : ',BASEURL);
    
    try {
    const response = await fetch(`${BASEURL}/downvote/${c_id}`, { method:"PUT",
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
    console.error('Downvote Complaint Error:', error);
  }
};