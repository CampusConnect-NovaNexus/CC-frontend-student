import {EXPO_BASE_URL_GR} from '@env';
export const postGrievance = async ({user_id,title,description}:{user_id:string, title:string,description:string}) => {
    const BASEURL=EXPO_BASE_URL_GR
    
    
    try {
    const response = await fetch(`${BASEURL}/new_complaint`, {method:"POST",
      headers:{
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id,
        title,
        description
        }),
     
    });
    const data=await response.json();
    console.log('postGrievance : ',data);
    
    return data
  } catch (error) {
    console.error('Create Complaint Error:', error);
  }
};